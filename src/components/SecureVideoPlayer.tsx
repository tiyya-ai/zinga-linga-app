import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Lock, Shield } from 'lucide-react';

interface SecureVideoPlayerProps {
  contentId: string;
  userId: string;
  moduleId: string;
  title: string;
  duration?: number;
  thumbnail?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  isPurchased: boolean;
  isDemo?: boolean;
}

interface DRMConfig {
  keySystem: string;
  licenseUrl: string;
  certificateUrl?: string;
  headers?: Record<string, string>;
}

interface HLSConfig {
  manifestUrl: string;
  fallbackUrl?: string;
  quality: 'auto' | '480p' | '720p' | '1080p';
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  contentId,
  userId,
  moduleId,
  title,
  duration,
  thumbnail,
  onProgress,
  onComplete,
  isPurchased,
  isDemo = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'auto' | '480p' | '720p' | '1080p'>('auto');
  const [drmStatus, setDrmStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [hlsSupported, setHlsSupported] = useState(false);

  // DRM Configuration
  const drmConfig: DRMConfig = {
    keySystem: 'com.widevine.alpha', // Primary DRM system
    licenseUrl: `${process.env.REACT_APP_DRM_LICENSE_URL}/license`,
    certificateUrl: `${process.env.REACT_APP_DRM_LICENSE_URL}/certificate`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'X-User-ID': userId,
      'X-Content-ID': contentId,
      'X-Module-ID': moduleId
    }
  };

  // HLS Configuration
  const hlsConfig: HLSConfig = {
    manifestUrl: `${process.env.REACT_APP_CDN_URL}/hls/${contentId}/playlist.m3u8`,
    fallbackUrl: `${process.env.REACT_APP_CDN_URL}/mp4/${contentId}/${quality}.mp4`,
    quality
  };

  // Check DRM support and authorization
  useEffect(() => {
    checkDRMSupport();
    checkContentAuthorization();
  }, [contentId, userId, isPurchased]);

  // Initialize secure video player
  useEffect(() => {
    if (drmStatus === 'authorized' && videoRef.current) {
      initializeSecurePlayer();
    }
  }, [drmStatus, quality]);

  const checkDRMSupport = async () => {
    try {
      // Check if browser supports EME (Encrypted Media Extensions)
      if (!navigator.requestMediaKeySystemAccess) {
        setError('DRM not supported in this browser');
        return;
      }

      // Check Widevine support
      const keySystemConfigs = [{
        initDataTypes: ['cenc'],
        audioCapabilities: [{
          contentType: 'audio/mp4;codecs="mp4a.40.2"'
        }],
        videoCapabilities: [{
          contentType: 'video/mp4;codecs="avc1.42E01E"',
          robustness: 'SW_SECURE_CRYPTO'
        }]
      }];

      await navigator.requestMediaKeySystemAccess('com.widevine.alpha', keySystemConfigs);
      console.log('✅ Widevine DRM supported');
      
      // Check HLS support
      const video = document.createElement('video');
      setHlsSupported(video.canPlayType('application/vnd.apple.mpegurl') !== '');
      
    } catch (error) {
      console.error('❌ DRM check failed:', error);
      setError('DRM not available');
    }
  };

  const checkContentAuthorization = async () => {
    try {
      // For demo content, always authorize
      if (isDemo) {
        setDrmStatus('authorized');
        return;
      }

      // Check if user has purchased the module
      if (!isPurchased) {
        setDrmStatus('unauthorized');
        setError('Content not purchased');
        return;
      }

      // Verify with backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/content/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          contentId,
          userId,
          moduleId,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        const { authorized, token } = await response.json();
        if (authorized) {
          // Store temporary access token
          sessionStorage.setItem(`content_token_${contentId}`, token);
          setDrmStatus('authorized');
        } else {
          setDrmStatus('unauthorized');
          setError('Content access denied');
        }
      } else {
        throw new Error('Authorization failed');
      }
    } catch (error) {
      console.error('❌ Content authorization failed:', error);
      setDrmStatus('unauthorized');
      setError('Unable to verify content access');
    }
  };

  const initializeSecurePlayer = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      const video = videoRef.current;

      // Initialize HLS if supported
      if (hlsSupported && window.Hls?.isSupported()) {
        await initializeHLS(video);
      } else {
        // Fallback to progressive download with DRM
        await initializeProgressiveWithDRM(video);
      }

      // Set up DRM
      await setupDRM(video);
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Player initialization failed:', error);
      setError('Failed to load secure content');
      setIsLoading(false);
    }
  };

  const initializeHLS = async (video: HTMLVideoElement) => {
    const Hls = (window as any).Hls;
    
    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: process.env.NODE_ENV === 'development',
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        // DRM configuration
        emeEnabled: true,
        drmSystems: {
          'com.widevine.alpha': {
            licenseUrl: drmConfig.licenseUrl,
            serverCertificateUrl: drmConfig.certificateUrl
          }
        }
      });

      // Add authentication headers
      hls.config.xhrSetup = (xhr: XMLHttpRequest, url: string) => {
        Object.entries(drmConfig.headers || {}).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      };

      hls.loadSource(hlsConfig.manifestUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest loaded');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS error:', data);
        if (data.fatal) {
          // Fallback to progressive
          initializeProgressiveWithDRM(video);
        }
      });

      // Store HLS instance for cleanup
      (video as any).hlsInstance = hls;
    }
  };

  const initializeProgressiveWithDRM = async (video: HTMLVideoElement) => {
    // Use fallback URL with quality selection
    const contentToken = sessionStorage.getItem(`content_token_${contentId}`);
    const videoUrl = `${hlsConfig.fallbackUrl}?token=${contentToken}&t=${Date.now()}`;
    
    video.src = videoUrl;
  };

  const setupDRM = async (video: HTMLVideoElement) => {
    try {
      // Request media key system access
      const keySystemAccess = await navigator.requestMediaKeySystemAccess(
        drmConfig.keySystem,
        [{
          initDataTypes: ['cenc'],
          audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
          videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
        }]
      );

      // Create media keys
      const mediaKeys = await keySystemAccess.createMediaKeys();
      await video.setMediaKeys(mediaKeys);

      // Create session
      const session = mediaKeys.createSession();

      session.addEventListener('message', async (event) => {
        try {
          // Send license request
          const response = await fetch(drmConfig.licenseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              ...drmConfig.headers
            },
            body: event.message
          });

          if (response.ok) {
            const license = await response.arrayBuffer();
            await session.update(license);
            console.log('✅ DRM license updated');
          } else {
            throw new Error('License request failed');
          }
        } catch (error) {
          console.error('❌ DRM license error:', error);
          setError('DRM license failed');
        }
      });

      // Handle encrypted events
      video.addEventListener('encrypted', (event) => {
        session.generateRequest(event.initDataType, event.initData);
      });

      console.log('✅ DRM setup complete');
    } catch (error) {
      console.error('❌ DRM setup failed:', error);
      // Continue without DRM for demo content
      if (!isDemo) {
        setError('DRM setup failed');
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    setCurrentTime(current);
    setVideoDuration(duration);
    
    if (onProgress) {
      onProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (newQuality: typeof quality) => {
    setQuality(newQuality);
    // Reinitialize player with new quality
    if (drmStatus === 'authorized') {
      initializeSecurePlayer();
    }
  };

  // Prevent right-click and other unauthorized actions
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Disable common video download shortcuts
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  };

  if (drmStatus === 'unauthorized') {
    return (
      <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <Lock className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-mali font-bold mb-2">Content Locked</h3>
          <p className="font-mali text-gray-300">
            {isDemo ? 'Demo content unavailable' : 'Purchase required to access this content'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-mali font-bold mb-2">Playback Error</h3>
          <p className="font-mali text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand-blue px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-mali"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => setIsLoading(false)}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        playsInline
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="font-mali">Loading secure content...</p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
            <div 
              className="bg-brand-blue h-1 rounded-full transition-all"
              style={{ width: `${(currentTime / videoDuration) * 100}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-brand-blue transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button onClick={toggleMute} className="text-white hover:text-brand-blue transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <span className="text-white font-mali text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Quality Selector */}
              <select 
                value={quality}
                onChange={(e) => handleQualityChange(e.target.value as typeof quality)}
                className="bg-black/50 text-white border border-white/20 rounded px-2 py-1 text-sm font-mali"
              >
                <option value="auto">Auto</option>
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>

              {/* DRM Status Indicator */}
              <div className="flex items-center gap-1 text-green-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-mali">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-mali font-bold text-lg">{title}</h3>
          {isPurchased && (
            <div className="flex items-center gap-1 text-green-400 mt-1">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-mali">Premium Content</span>
            </div>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mali pointer-events-none">
        © Zinga Linga
      </div>
    </div>
  );
};

export default SecureVideoPlayer;