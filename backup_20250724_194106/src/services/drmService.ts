/**
 * DRM Service for Zinga Linga Educational Platform
 * Handles content protection, licensing, and secure delivery
 */

export interface DRMConfig {
  keySystem: 'widevine' | 'playready' | 'fairplay';
  licenseUrl: string;
  certificateUrl?: string;
  headers?: Record<string, string>;
}

export interface ContentLicense {
  contentId: string;
  userId: string;
  moduleId: string;
  licenseToken: string;
  expiresAt: number;
  permissions: {
    canPlay: boolean;
    canDownload: boolean;
    maxConcurrentStreams: number;
    geoRestrictions?: string[];
  };
}

export interface HLSManifest {
  contentId: string;
  manifestUrl: string;
  qualities: Array<{
    resolution: string;
    bandwidth: number;
    url: string;
  }>;
  drmProtected: boolean;
  keyId?: string;
}

class DRMService {
  private readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.zingalinga.com';
  private readonly CDN_BASE = process.env.REACT_APP_CDN_URL || 'https://cdn.zingalinga.com';
  private readonly DRM_LICENSE_URL = process.env.REACT_APP_DRM_LICENSE_URL || 'https://drm.zingalinga.com';
  
  private licenseCache = new Map<string, ContentLicense>();
  private manifestCache = new Map<string, HLSManifest>();

  /**
   * Check if the browser supports DRM
   */
  async checkDRMSupport(): Promise<{
    widevine: boolean;
    playready: boolean;
    fairplay: boolean;
    eme: boolean;
  }> {
    const support = {
      widevine: false,
      playready: false,
      fairplay: false,
      eme: !!navigator.requestMediaKeySystemAccess
    };

    if (!support.eme) {
      return support;
    }

    try {
      // Check Widevine (Chrome, Firefox, Edge)
      try {
        await navigator.requestMediaKeySystemAccess('com.widevine.alpha', [{
          initDataTypes: ['cenc'],
          audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
          videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
        }]);
        support.widevine = true;
      } catch (e) {
        console.log('Widevine not supported');
      }

      // Check PlayReady (Edge, IE)
      try {
        await navigator.requestMediaKeySystemAccess('com.microsoft.playready', [{
          initDataTypes: ['cenc'],
          audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
          videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
        }]);
        support.playready = true;
      } catch (e) {
        console.log('PlayReady not supported');
      }

      // Check FairPlay (Safari)
      try {
        await navigator.requestMediaKeySystemAccess('com.apple.fps.1_0', [{
          initDataTypes: ['skd'],
          audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
          videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
        }]);
        support.fairplay = true;
      } catch (e) {
        console.log('FairPlay not supported');
      }
    } catch (error) {
      console.error('Error checking DRM support:', error);
    }

    return support;
  }

  /**
   * Get the best supported DRM system for the current browser
   */
  async getBestDRMSystem(): Promise<DRMConfig | null> {
    const support = await this.checkDRMSupport();
    
    if (support.widevine) {
      return {
        keySystem: 'widevine',
        licenseUrl: `${this.DRM_LICENSE_URL}/widevine/license`,
        certificateUrl: `${this.DRM_LICENSE_URL}/widevine/certificate`
      };
    }
    
    if (support.playready) {
      return {
        keySystem: 'playready',
        licenseUrl: `${this.DRM_LICENSE_URL}/playready/license`
      };
    }
    
    if (support.fairplay) {
      return {
        keySystem: 'fairplay',
        licenseUrl: `${this.DRM_LICENSE_URL}/fairplay/license`,
        certificateUrl: `${this.DRM_LICENSE_URL}/fairplay/certificate`
      };
    }

    return null;
  }

  /**
   * Request content license from DRM server
   */
  async requestContentLicense(
    contentId: string,
    userId: string,
    moduleId: string,
    isPurchased: boolean = false
  ): Promise<ContentLicense | null> {
    try {
      // Check cache first
      const cacheKey = `${contentId}-${userId}`;
      const cached = this.licenseCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached;
      }

      // Request new license
      const response = await fetch(`${this.API_BASE}/drm/license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-User-Agent': navigator.userAgent,
          'X-Platform': this.getPlatform()
        },
        body: JSON.stringify({
          contentId,
          userId,
          moduleId,
          isPurchased,
          timestamp: Date.now(),
          fingerprint: await this.generateDeviceFingerprint()
        })
      });

      if (!response.ok) {
        throw new Error(`License request failed: ${response.status}`);
      }

      const license: ContentLicense = await response.json();
      
      // Cache the license
      this.licenseCache.set(cacheKey, license);
      
      // Set up automatic cleanup
      setTimeout(() => {
        this.licenseCache.delete(cacheKey);
      }, license.expiresAt - Date.now());

      return license;
    } catch (error) {
      console.error('Failed to request content license:', error);
      return null;
    }
  }

  /**
   * Get HLS manifest with DRM protection
   */
  async getHLSManifest(contentId: string, quality: string = 'auto'): Promise<HLSManifest | null> {
    try {
      // Check cache first
      const cacheKey = `${contentId}-${quality}`;
      const cached = this.manifestCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.CDN_BASE}/hls/${contentId}/manifest.json`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Quality': quality
        }
      });

      if (!response.ok) {
        throw new Error(`Manifest request failed: ${response.status}`);
      }

      const manifest: HLSManifest = await response.json();
      
      // Cache the manifest
      this.manifestCache.set(cacheKey, manifest);

      return manifest;
    } catch (error) {
      console.error('Failed to get HLS manifest:', error);
      return null;
    }
  }

  /**
   * Initialize DRM for video element
   */
  async initializeDRM(
    video: HTMLVideoElement,
    contentId: string,
    userId: string,
    moduleId: string,
    isPurchased: boolean = false
  ): Promise<boolean> {
    try {
      // Get DRM configuration
      const drmConfig = await this.getBestDRMSystem();
      if (!drmConfig) {
        console.warn('No DRM system supported');
        return false;
      }

      // Get content license
      const license = await this.requestContentLicense(contentId, userId, moduleId, isPurchased);
      if (!license || !license.permissions.canPlay) {
        throw new Error('Content license denied');
      }

      // Set up DRM based on the key system
      switch (drmConfig.keySystem) {
        case 'widevine':
          return await this.setupWidevine(video, drmConfig, license);
        case 'playready':
          return await this.setupPlayReady(video, drmConfig, license);
        case 'fairplay':
          return await this.setupFairPlay(video, drmConfig, license);
        default:
          throw new Error(`Unsupported DRM system: ${drmConfig.keySystem}`);
      }
    } catch (error) {
      console.error('DRM initialization failed:', error);
      return false;
    }
  }

  /**
   * Set up Widevine DRM (Chrome, Firefox, Edge)
   */
  private async setupWidevine(
    video: HTMLVideoElement,
    config: DRMConfig,
    license: ContentLicense
  ): Promise<boolean> {
    try {
      const keySystemAccess = await navigator.requestMediaKeySystemAccess('com.widevine.alpha', [{
        initDataTypes: ['cenc'],
        audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        videoCapabilities: [{
          contentType: 'video/mp4;codecs="avc1.42E01E"',
          robustness: 'SW_SECURE_CRYPTO'
        }]
      }]);

      const mediaKeys = await keySystemAccess.createMediaKeys();
      await video.setMediaKeys(mediaKeys);

      const session = mediaKeys.createSession();

      session.addEventListener('message', async (event) => {
        try {
          const response = await fetch(config.licenseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Authorization': `Bearer ${license.licenseToken}`,
              'X-Content-ID': license.contentId,
              'X-User-ID': license.userId
            },
            body: event.message
          });

          if (response.ok) {
            const licenseData = await response.arrayBuffer();
            await session.update(licenseData);
            console.log('✅ Widevine license updated successfully');
          } else {
            throw new Error(`License server error: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ Widevine license update failed:', error);
          throw error;
        }
      });

      video.addEventListener('encrypted', (event) => {
        session.generateRequest(event.initDataType, event.initData);
      });

      return true;
    } catch (error) {
      console.error('❌ Widevine setup failed:', error);
      return false;
    }
  }

  /**
   * Set up PlayReady DRM (Edge, IE)
   */
  private async setupPlayReady(
    video: HTMLVideoElement,
    config: DRMConfig,
    license: ContentLicense
  ): Promise<boolean> {
    try {
      const keySystemAccess = await navigator.requestMediaKeySystemAccess('com.microsoft.playready', [{
        initDataTypes: ['cenc'],
        audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
      }]);

      const mediaKeys = await keySystemAccess.createMediaKeys();
      await video.setMediaKeys(mediaKeys);

      const session = mediaKeys.createSession();

      session.addEventListener('message', async (event) => {
        try {
          const response = await fetch(config.licenseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml; charset=utf-8',
              'Authorization': `Bearer ${license.licenseToken}`,
              'SOAPAction': '"http://schemas.microsoft.com/DRM/2007/03/protocols/AcquireLicense"'
            },
            body: event.message
          });

          if (response.ok) {
            const licenseData = await response.arrayBuffer();
            await session.update(licenseData);
            console.log('✅ PlayReady license updated successfully');
          } else {
            throw new Error(`License server error: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ PlayReady license update failed:', error);
          throw error;
        }
      });

      video.addEventListener('encrypted', (event) => {
        session.generateRequest(event.initDataType, event.initData);
      });

      return true;
    } catch (error) {
      console.error('❌ PlayReady setup failed:', error);
      return false;
    }
  }

  /**
   * Set up FairPlay DRM (Safari)
   */
  private async setupFairPlay(
    video: HTMLVideoElement,
    config: DRMConfig,
    license: ContentLicense
  ): Promise<boolean> {
    try {
      const keySystemAccess = await navigator.requestMediaKeySystemAccess('com.apple.fps.1_0', [{
        initDataTypes: ['skd'],
        audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
      }]);

      const mediaKeys = await keySystemAccess.createMediaKeys();
      await video.setMediaKeys(mediaKeys);

      const session = mediaKeys.createSession();

      session.addEventListener('message', async (event) => {
        try {
          // FairPlay requires special handling
          const message = event.message;
          const request = new Uint8Array(message);

          const response = await fetch(config.licenseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Authorization': `Bearer ${license.licenseToken}`
            },
            body: request
          });

          if (response.ok) {
            const licenseData = await response.arrayBuffer();
            await session.update(licenseData);
            console.log('✅ FairPlay license updated successfully');
          } else {
            throw new Error(`License server error: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ FairPlay license update failed:', error);
          throw error;
        }
      });

      video.addEventListener('encrypted', (event) => {
        session.generateRequest(event.initDataType, event.initData);
      });

      return true;
    } catch (error) {
      console.error('❌ FairPlay setup failed:', error);
      return false;
    }
  }

  /**
   * Generate device fingerprint for security
   */
  private async generateDeviceFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Zinga Linga DRM', 10, 10);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: this.getWebGLFingerprint()
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(fingerprint));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get WebGL fingerprint
   */
  private getWebGLFingerprint(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'no-webgl';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    
    return `${vendor}-${renderer}`;
  }

  /**
   * Get platform information
   */
  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('windows')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  }

  /**
   * Validate content access permissions
   */
  async validateAccess(contentId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/content/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          contentId,
          userId,
          timestamp: Date.now(),
          fingerprint: await this.generateDeviceFingerprint()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Access validation failed:', error);
      return false;
    }
  }

  /**
   * Report playback analytics (for content protection monitoring)
   */
  async reportPlayback(
    contentId: string,
    userId: string,
    event: 'start' | 'progress' | 'complete' | 'error',
    metadata?: any
  ): Promise<void> {
    try {
      await fetch(`${this.API_BASE}/analytics/playback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          contentId,
          userId,
          event,
          timestamp: Date.now(),
          metadata,
          fingerprint: await this.generateDeviceFingerprint()
        })
      });
    } catch (error) {
      console.error('Failed to report playback analytics:', error);
    }
  }

  /**
   * Clear all cached licenses and manifests
   */
  clearCache(): void {
    this.licenseCache.clear();
    this.manifestCache.clear();
  }
}

export const drmService = new DRMService();