/**
 * HLS (HTTP Live Streaming) Service for Zinga Linga
 * Handles adaptive bitrate streaming with DRM protection
 */

export interface HLSQuality {
  resolution: string;
  bandwidth: number;
  codecs: string;
  url: string;
}

export interface HLSPlaylist {
  contentId: string;
  masterPlaylistUrl: string;
  qualities: HLSQuality[];
  duration: number;
  drmProtected: boolean;
  keyId?: string;
  segments: HLSSegment[];
}

export interface HLSSegment {
  url: string;
  duration: number;
  sequence: number;
  encrypted: boolean;
  keyUri?: string;
}

export interface StreamingConfig {
  autoQuality: boolean;
  maxBandwidth?: number;
  preferredQuality?: string;
  bufferLength: number;
  maxBufferLength: number;
  enableLowLatency: boolean;
}

class HLSService {
  private readonly CDN_BASE = process.env.REACT_APP_CDN_URL || 'https://cdn.zingalinga.com';
  private readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.zingalinga.com';
  
  private hlsInstances = new Map<string, any>();
  private playlistCache = new Map<string, HLSPlaylist>();
  private bandwidthHistory: number[] = [];

  /**
   * Check if HLS is supported in the current browser
   */
  isHLSSupported(): boolean {
    const video = document.createElement('video');
    return !!(
      video.canPlayType('application/vnd.apple.mpegurl') ||
      video.canPlayType('audio/mpegurl') ||
      (window as any).Hls?.isSupported()
    );
  }

  /**
   * Get HLS playlist for content
   */
  async getPlaylist(
    contentId: string,
    userId: string,
    quality: string = 'auto'
  ): Promise<HLSPlaylist | null> {
    try {
      // Check cache first
      const cacheKey = `${contentId}-${quality}`;
      const cached = this.playlistCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.CDN_BASE}/hls/${contentId}/playlist.json`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-User-ID': userId,
          'X-Quality': quality,
          'X-Platform': this.getPlatform()
        }
      });

      if (!response.ok) {
        throw new Error(`Playlist request failed: ${response.status}`);
      }

      const playlist: HLSPlaylist = await response.json();
      
      // Cache the playlist
      this.playlistCache.set(cacheKey, playlist);

      return playlist;
    } catch (error) {
      console.error('Failed to get HLS playlist:', error);
      return null;
    }
  }

  /**
   * Initialize HLS player with DRM support
   */
  async initializePlayer(
    video: HTMLVideoElement,
    contentId: string,
    userId: string,
    config: StreamingConfig = this.getDefaultConfig()
  ): Promise<boolean> {
    try {
      // Get playlist
      const playlist = await this.getPlaylist(contentId, userId);
      if (!playlist) {
        throw new Error('Failed to load playlist');
      }

      // Check if native HLS is supported (Safari)
      if (this.isNativeHLSSupported()) {
        return await this.initializeNativeHLS(video, playlist, config);
      }
      
      // Use HLS.js for other browsers
      if ((window as any).Hls?.isSupported()) {
        return await this.initializeHLSJS(video, playlist, config);
      }

      throw new Error('HLS not supported in this browser');
    } catch (error) {
      console.error('HLS player initialization failed:', error);
      return false;
    }
  }

  /**
   * Initialize native HLS (Safari)
   */
  private async initializeNativeHLS(
    video: HTMLVideoElement,
    playlist: HLSPlaylist,
    config: StreamingConfig
  ): Promise<boolean> {
    try {
      // Set the master playlist URL
      video.src = playlist.masterPlaylistUrl;
      
      // Add authentication headers if needed
      if (playlist.drmProtected) {
        // For native HLS with DRM, we need to handle key requests
        video.addEventListener('encrypted', (event) => {
          console.log('Native HLS encrypted event:', event);
        });
      }

      // Store reference for cleanup
      this.hlsInstances.set(playlist.contentId, { type: 'native', video });

      console.log('✅ Native HLS initialized');
      return true;
    } catch (error) {
      console.error('❌ Native HLS initialization failed:', error);
      return false;
    }
  }

  /**
   * Initialize HLS.js (Chrome, Firefox, Edge)
   */
  private async initializeHLSJS(
    video: HTMLVideoElement,
    playlist: HLSPlaylist,
    config: StreamingConfig
  ): Promise<boolean> {
    try {
      const Hls = (window as any).Hls;
      
      const hlsConfig = {
        debug: process.env.NODE_ENV === 'development',
        enableWorker: true,
        lowLatencyMode: config.enableLowLatency,
        backBufferLength: 90,
        maxBufferLength: config.bufferLength,
        maxMaxBufferLength: config.maxBufferLength,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        
        // Adaptive bitrate settings
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
        abrEwmaFastVoD: 3.0,
        abrEwmaSlowVoD: 9.0,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: false,
        maxStarvationDelay: 4,
        maxLoadingDelay: 4,

        // DRM configuration
        emeEnabled: playlist.drmProtected,
        drmSystems: playlist.drmProtected ? {
          'com.widevine.alpha': {
            licenseUrl: `${process.env.REACT_APP_DRM_LICENSE_URL}/widevine/license`,
            serverCertificateUrl: `${process.env.REACT_APP_DRM_LICENSE_URL}/widevine/certificate`
          },
          'com.microsoft.playready': {
            licenseUrl: `${process.env.REACT_APP_DRM_LICENSE_URL}/playready/license`
          }
        } : undefined,

        // Network settings
        xhrSetup: (xhr: XMLHttpRequest, url: string) => {
          xhr.setRequestHeader('Authorization', `Bearer ${this.getAuthToken()}`);
          xhr.setRequestHeader('X-Content-ID', playlist.contentId);
          xhr.setRequestHeader('X-Platform', this.getPlatform());
        }
      };

      const hls = new Hls(hlsConfig);

      // Load the master playlist
      hls.loadSource(playlist.masterPlaylistUrl);
      hls.attachMedia(video);

      // Event handlers
      this.setupHLSEventHandlers(hls, playlist.contentId);

      // Store reference for cleanup
      this.hlsInstances.set(playlist.contentId, { type: 'hlsjs', instance: hls });

      console.log('✅ HLS.js initialized');
      return true;
    } catch (error) {
      console.error('❌ HLS.js initialization failed:', error);
      return false;
    }
  }

  /**
   * Set up HLS.js event handlers
   */
  private setupHLSEventHandlers(hls: any, contentId: string): void {
    const Hls = (window as any).Hls;

    // Manifest loaded
    hls.on(Hls.Events.MANIFEST_PARSED, (event: any, data: any) => {
      console.log('✅ HLS manifest parsed:', data);
      this.onManifestParsed(contentId, data);
    });

    // Level switched (quality change)
    hls.on(Hls.Events.LEVEL_SWITCHED, (event: any, data: any) => {
      console.log(`📊 Quality switched to: ${data.level}`);
      this.onQualityChanged(contentId, data);
    });

    // Fragment loaded
    hls.on(Hls.Events.FRAG_LOADED, (event: any, data: any) => {
      this.updateBandwidthHistory(data.frag.loaded, data.frag.duration);
    });

    // Error handling
    hls.on(Hls.Events.ERROR, (event: any, data: any) => {
      console.error('❌ HLS error:', data);
      this.handleHLSError(hls, data, contentId);
    });

    // Buffer events
    hls.on(Hls.Events.BUFFER_APPENDED, (event: any, data: any) => {
      // Track buffer health
    });

    hls.on(Hls.Events.BUFFER_EOS, (event: any, data: any) => {
      console.log('📺 End of stream reached');
    });
  }

  /**
   * Handle HLS errors with recovery strategies
   */
  private handleHLSError(hls: any, data: any, contentId: string): void {
    const Hls = (window as any).Hls;

    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.log('🔄 Attempting to recover from network error');
          hls.startLoad();
          break;
          
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log('🔄 Attempting to recover from media error');
          hls.recoverMediaError();
          break;
          
        default:
          console.error('💥 Fatal error, cannot recover');
          this.destroyPlayer(contentId);
          break;
      }
    }
  }

  /**
   * Change video quality
   */
  changeQuality(contentId: string, qualityLevel: number | 'auto'): boolean {
    try {
      const instance = this.hlsInstances.get(contentId);
      if (!instance) return false;

      if (instance.type === 'hlsjs') {
        const hls = instance.instance;
        if (qualityLevel === 'auto') {
          hls.currentLevel = -1; // Auto quality
        } else {
          hls.currentLevel = qualityLevel;
        }
        return true;
      }

      // Native HLS doesn't support manual quality switching
      return false;
    } catch (error) {
      console.error('Failed to change quality:', error);
      return false;
    }
  }

  /**
   * Get available quality levels
   */
  getQualityLevels(contentId: string): Array<{ index: number; height: number; bitrate: number }> {
    try {
      const instance = this.hlsInstances.get(contentId);
      if (!instance || instance.type !== 'hlsjs') return [];

      const hls = instance.instance;
      return hls.levels.map((level: any, index: number) => ({
        index,
        height: level.height,
        bitrate: level.bitrate
      }));
    } catch (error) {
      console.error('Failed to get quality levels:', error);
      return [];
    }
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(contentId: string): number {
    try {
      const instance = this.hlsInstances.get(contentId);
      if (!instance || instance.type !== 'hlsjs') return -1;

      return instance.instance.currentLevel;
    } catch (error) {
      console.error('Failed to get current quality:', error);
      return -1;
    }
  }

  /**
   * Get streaming statistics
   */
  getStats(contentId: string): any {
    try {
      const instance = this.hlsInstances.get(contentId);
      if (!instance || instance.type !== 'hlsjs') return null;

      const hls = instance.instance;
      return {
        currentLevel: hls.currentLevel,
        loadLevel: hls.loadLevel,
        nextLevel: hls.nextLevel,
        averageBandwidth: this.getAverageBandwidth(),
        bufferLength: hls.media ? hls.media.buffered.length : 0,
        dropped: hls.stats.dropped,
        loaded: hls.stats.loaded
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }

  /**
   * Destroy HLS player instance
   */
  destroyPlayer(contentId: string): void {
    try {
      const instance = this.hlsInstances.get(contentId);
      if (!instance) return;

      if (instance.type === 'hlsjs' && instance.instance) {
        instance.instance.destroy();
      }

      this.hlsInstances.delete(contentId);
      console.log('🗑️ HLS player destroyed');
    } catch (error) {
      console.error('Failed to destroy HLS player:', error);
    }
  }

  /**
   * Check if native HLS is supported
   */
  private isNativeHLSSupported(): boolean {
    const video = document.createElement('video');
    return !!(
      video.canPlayType('application/vnd.apple.mpegurl') ||
      video.canPlayType('audio/mpegurl')
    );
  }

  /**
   * Get default streaming configuration
   */
  private getDefaultConfig(): StreamingConfig {
    return {
      autoQuality: true,
      bufferLength: 30,
      maxBufferLength: 600,
      enableLowLatency: false
    };
  }

  /**
   * Update bandwidth history for adaptive streaming
   */
  private updateBandwidthHistory(bytesLoaded: number, duration: number): void {
    if (duration > 0) {
      const bandwidth = (bytesLoaded * 8) / duration; // bits per second
      this.bandwidthHistory.push(bandwidth);
      
      // Keep only last 10 measurements
      if (this.bandwidthHistory.length > 10) {
        this.bandwidthHistory.shift();
      }
    }
  }

  /**
   * Get average bandwidth
   */
  private getAverageBandwidth(): number {
    if (this.bandwidthHistory.length === 0) return 0;
    
    const sum = this.bandwidthHistory.reduce((a, b) => a + b, 0);
    return sum / this.bandwidthHistory.length;
  }

  /**
   * Handle manifest parsed event
   */
  private onManifestParsed(contentId: string, data: any): void {
    // Report analytics
    this.reportAnalytics(contentId, 'manifest_loaded', {
      levels: data.levels.length,
      duration: data.totalduration
    });
  }

  /**
   * Handle quality change event
   */
  private onQualityChanged(contentId: string, data: any): void {
    // Report analytics
    this.reportAnalytics(contentId, 'quality_changed', {
      level: data.level,
      height: data.height,
      bitrate: data.bitrate
    });
  }

  /**
   * Report streaming analytics
   */
  private async reportAnalytics(
    contentId: string,
    event: string,
    metadata: any
  ): Promise<void> {
    try {
      await fetch(`${this.API_BASE}/analytics/streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          contentId,
          event,
          timestamp: Date.now(),
          metadata,
          bandwidth: this.getAverageBandwidth(),
          platform: this.getPlatform()
        })
      });
    } catch (error) {
      console.error('Failed to report streaming analytics:', error);
    }
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
   * Clear all cached data
   */
  clearCache(): void {
    this.playlistCache.clear();
    this.bandwidthHistory = [];
  }

  /**
   * Destroy all active players
   */
  destroyAll(): void {
    for (const contentId of this.hlsInstances.keys()) {
      this.destroyPlayer(contentId);
    }
  }
}

export const hlsService = new HLSService();