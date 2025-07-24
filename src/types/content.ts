export interface ContentFile {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'game' | 'image' | 'document';
  size: number; // in bytes
  url?: string;
  thumbnail?: string;
  duration?: string; // for video/audio
  description?: string;
  tags: string[];
  moduleId?: string; // which module this content belongs to
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy: string; // user ID
  status: 'processing' | 'ready' | 'failed';
  metadata?: {
    width?: number;
    height?: number;
    bitrate?: number;
    format?: string;
    [key: string]: any;
  };
}

export interface ContentStats {
  totalFiles: number;
  totalSize: number; // in bytes
  byType: {
    video: number;
    audio: number;
    game: number;
    image: number;
    document: number;
  };
  recentUploads: ContentFile[];
}