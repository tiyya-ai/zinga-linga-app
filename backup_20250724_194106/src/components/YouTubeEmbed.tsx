import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  videoId, 
  title, 
  autoplay = false, 
  muted = true,
  className = "w-full h-full rounded-2xl"
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=1&showinfo=0&rel=0&modestbranding=1`;

  return (
    <iframe
      className={className}
      src={embedUrl}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};