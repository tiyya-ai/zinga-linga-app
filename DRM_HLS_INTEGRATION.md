# 🔐 DRM + HLS Integration for Zinga Linga Educational Platform

## 🎯 Overview

This document outlines the comprehensive Digital Rights Management (DRM) and HTTP Live Streaming (HLS) integration implemented for the Zinga Linga educational platform. This system ensures secure content delivery while providing optimal streaming performance for educational videos.

## 🛡️ Security Features

### **DRM Protection**
- **Multi-DRM Support**: Widevine, PlayReady, and FairPlay
- **Content Encryption**: AES-128 encryption for all video content
- **License Management**: Secure license server with user authentication
- **Device Fingerprinting**: Unique device identification for access control
- **Concurrent Stream Limits**: Prevent unauthorized sharing
- **Geographic Restrictions**: Optional geo-blocking capabilities

### **Content Protection**
- **Watermarking**: Dynamic user watermarks on video content
- **Screenshot Prevention**: Disable screenshot and screen recording
- **Download Protection**: Prevent unauthorized content downloads
- **Right-click Disabled**: Block context menu access
- **Developer Tools Protection**: Detect and prevent inspection

## 📺 Streaming Technology

### **HLS (HTTP Live Streaming)**
- **Adaptive Bitrate**: Automatic quality adjustment based on bandwidth
- **Multiple Resolutions**: 480p, 720p, 1080p support
- **Low Latency**: Optimized for educational content delivery
- **Cross-Platform**: Works on all modern browsers and devices
- **Offline Support**: Secure offline viewing for purchased content

### **Quality Levels**
```typescript
interface QualityLevel {
  resolution: '480p' | '720p' | '1080p' | 'auto';
  bandwidth: number;
  codecs: string;
}
```

## 🏗️ Architecture

### **Components**

#### **1. SecureVideoPlayer**
```typescript
<SecureVideoPlayer
  contentId="content-123"
  userId="user-456"
  moduleId="module-789"
  title="African Alphabet Adventure"
  isPurchased={true}
  isDemo={false}
  onProgress={(progress) => console.log(progress)}
  onComplete={() => console.log('completed')}
/>
```

#### **2. DRM Service**
```typescript
import { drmService } from './services/drmService';

// Check DRM support
const support = await drmService.checkDRMSupport();

// Initialize DRM for video
const success = await drmService.initializeDRM(
  videoElement,
  contentId,
  userId,
  moduleId,
  isPurchased
);
```

#### **3. HLS Service**
```typescript
import { hlsService } from './services/hlsService';

// Initialize HLS player
const success = await hlsService.initializePlayer(
  videoElement,
  contentId,
  userId,
  streamingConfig
);

// Change quality
hlsService.changeQuality(contentId, '720p');
```

## 🔧 Implementation

### **1. Environment Setup**

Create `.env` file with required configuration:

```bash
# API Configuration
REACT_APP_API_URL=https://api.zingalinga.com
REACT_APP_CDN_URL=https://cdn.zingalinga.com

# DRM Configuration
REACT_APP_DRM_LICENSE_URL=https://drm.zingalinga.com
REACT_APP_DRM_CERTIFICATE_URL=https://drm.zingalinga.com/certificate

# Content Protection
REACT_APP_WATERMARK_ENABLED=true
REACT_APP_SCREENSHOT_PROTECTION=true
```

### **2. Install Dependencies**

```bash
# HLS.js for adaptive streaming
npm install hls.js

# Additional security libraries
npm install crypto-js
npm install device-uuid
```

### **3. Browser Support**

| Browser | Widevine | PlayReady | FairPlay | HLS |
|---------|----------|-----------|----------|-----|
| Chrome  | ✅       | ❌        | ❌       | ✅  |
| Firefox | ✅       | ❌        | ❌       | ✅  |
| Safari  | ❌       | ❌        | ✅       | ✅  |
| Edge    | ✅       | ✅        | ❌       | ✅  |

## 🚀 Usage Examples

### **Basic Video Player**
```tsx
import SecureVideoPlayer from './components/SecureVideoPlayer';

function VideoLesson({ content, user }) {
  return (
    <SecureVideoPlayer
      contentId={content.id}
      userId={user.id}
      moduleId={content.moduleId}
      title={content.title}
      isPurchased={user.purchasedModules.includes(content.moduleId)}
      onProgress={(progress) => {
        // Track learning progress
        analytics.track('video_progress', {
          contentId: content.id,
          progress,
          userId: user.id
        });
      }}
      onComplete={() => {
        // Mark lesson as completed
        markLessonComplete(content.id);
      }}
    />
  );
}
```

### **Content Authorization**
```typescript
// Check if user can access content
const canAccess = await drmService.validateAccess(contentId, userId);

if (!canAccess) {
  // Show purchase prompt or access denied message
  showPurchasePrompt();
  return;
}

// Initialize secure player
initializeSecurePlayer();
```

### **Analytics Integration**
```typescript
// Report playback events
await drmService.reportPlayback(
  contentId,
  userId,
  'start',
  { quality: '720p', device: 'desktop' }
);
```

## 🔒 Security Measures

### **Content Encryption**
- All video content encrypted with AES-128
- Unique encryption keys per content item
- Key rotation for enhanced security
- Secure key delivery via HTTPS

### **License Management**
```typescript
interface ContentLicense {
  contentId: string;
  userId: string;
  licenseToken: string;
  expiresAt: number;
  permissions: {
    canPlay: boolean;
    canDownload: boolean;
    maxConcurrentStreams: number;
  };
}
```

### **Device Fingerprinting**
```typescript
const fingerprint = await generateDeviceFingerprint();
// Includes: userAgent, screen resolution, timezone, WebGL info
```

## 📊 Analytics & Monitoring

### **Playback Analytics**
- Video start/stop events
- Quality changes
- Buffer health
- Error tracking
- User engagement metrics

### **Security Monitoring**
- Unauthorized access attempts
- License violations
- Suspicious device activity
- Geographic anomalies

## 🛠️ Backend Requirements

### **DRM License Server**
```bash
# Widevine License Server
POST /drm/widevine/license
Content-Type: application/octet-stream
Authorization: Bearer <token>

# PlayReady License Server
POST /drm/playready/license
Content-Type: text/xml
SOAPAction: "AcquireLicense"

# FairPlay License Server
POST /drm/fairplay/license
Content-Type: application/octet-stream
```

### **Content Authorization API**
```bash
POST /content/authorize
{
  "contentId": "content-123",
  "userId": "user-456",
  "moduleId": "module-789",
  "timestamp": 1640995200000
}
```

### **HLS Manifest Generation**
```bash
GET /hls/{contentId}/playlist.m3u8
Authorization: Bearer <token>
X-User-ID: user-456
X-Quality: auto
```

## 🔧 Configuration Options

### **DRM Configuration**
```typescript
const drmConfig = {
  keySystem: 'widevine' | 'playready' | 'fairplay',
  licenseUrl: string,
  certificateUrl?: string,
  headers?: Record<string, string>
};
```

### **Streaming Configuration**
```typescript
const streamingConfig = {
  autoQuality: boolean,
  maxBandwidth?: number,
  bufferLength: number,
  maxBufferLength: number,
  enableLowLatency: boolean
};
```

## 🚨 Error Handling

### **Common Errors**
- `DRM_NOT_SUPPORTED`: Browser doesn't support DRM
- `LICENSE_DENIED`: User not authorized for content
- `NETWORK_ERROR`: Connection issues
- `PLAYBACK_ERROR`: Video playback failure

### **Error Recovery**
```typescript
// Automatic retry logic
if (error.type === 'NETWORK_ERROR') {
  await retryWithBackoff();
} else if (error.type === 'MEDIA_ERROR') {
  await recoverMediaError();
}
```

## 📱 Mobile Considerations

### **iOS (Safari)**
- FairPlay DRM support
- Native HLS playback
- Touch-optimized controls
- Picture-in-picture support

### **Android (Chrome)**
- Widevine DRM support
- HLS.js for adaptive streaming
- Hardware acceleration
- Background playback prevention

## 🔄 Content Workflow

### **1. Content Preparation**
```bash
# Encrypt video content
ffmpeg -i input.mp4 -c:v libx264 -c:a aac \
  -hls_key_info_file key.info \
  -hls_playlist_type vod \
  output.m3u8
```

### **2. Upload to CDN**
```bash
# Upload encrypted segments
aws s3 sync ./hls/ s3://zinga-linga-content/hls/
```

### **3. Generate Manifest**
```typescript
const manifest = {
  contentId: 'content-123',
  masterPlaylistUrl: 'https://cdn.zingalinga.com/hls/content-123/playlist.m3u8',
  qualities: [
    { resolution: '480p', bandwidth: 800000 },
    { resolution: '720p', bandwidth: 1200000 },
    { resolution: '1080p', bandwidth: 2000000 }
  ],
  drmProtected: true,
  keyId: 'key-456'
};
```

## 🎯 Best Practices

### **Security**
1. Always validate user permissions server-side
2. Use HTTPS for all communications
3. Implement rate limiting on license requests
4. Monitor for suspicious activity patterns
5. Regularly rotate encryption keys

### **Performance**
1. Use CDN for content delivery
2. Implement proper caching strategies
3. Optimize video encoding settings
4. Monitor bandwidth usage
5. Provide quality selection options

### **User Experience**
1. Show loading states during DRM initialization
2. Provide clear error messages
3. Implement smooth quality transitions
4. Support keyboard shortcuts
5. Ensure accessibility compliance

## 🔍 Testing

### **DRM Testing**
```typescript
// Test DRM support
const support = await drmService.checkDRMSupport();
console.log('DRM Support:', support);

// Test license acquisition
const license = await drmService.requestContentLicense(
  'test-content',
  'test-user',
  'test-module',
  true
);
```

### **HLS Testing**
```typescript
// Test HLS playback
const success = await hlsService.initializePlayer(
  videoElement,
  'test-content',
  'test-user'
);

// Test quality switching
hlsService.changeQuality('test-content', '720p');
```

## 📈 Performance Metrics

### **Key Metrics to Monitor**
- License acquisition time
- Video start time
- Buffer health
- Quality adaptation frequency
- Error rates
- User engagement

### **Optimization Targets**
- License acquisition: < 500ms
- Video start time: < 2s
- Buffer underruns: < 1%
- Quality switches: Smooth transitions
- Error rate: < 0.1%

## 🔮 Future Enhancements

### **Planned Features**
- **Offline Viewing**: Secure download for purchased content
- **Multi-Language Support**: Subtitle and audio track selection
- **Interactive Elements**: Clickable hotspots and quizzes
- **VR/AR Support**: Immersive educational experiences
- **AI-Powered Recommendations**: Personalized content suggestions

### **Advanced Security**
- **Blockchain Verification**: Content authenticity verification
- **Biometric Authentication**: Enhanced user verification
- **Zero-Trust Architecture**: Continuous security validation
- **Quantum-Resistant Encryption**: Future-proof security

## 📞 Support

For technical support or questions about the DRM/HLS integration:

- **Documentation**: [docs.zingalinga.com/drm](https://docs.zingalinga.com/drm)
- **Support Email**: tech-support@zingalinga.com
- **Developer Portal**: [dev.zingalinga.com](https://dev.zingalinga.com)

---

**© 2024 Zinga Linga Educational Platform. All rights reserved.**