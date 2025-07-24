import React, { useState } from 'react';
import { PlayCircle, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { Kiki, Tano } from './Characters';

interface VideoDemoProps {
  onLoginClick: () => void;
}

export const VideoDemo: React.FC<VideoDemoProps> = ({ onLoginClick }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
        {!showVideo ? (
          // Video Thumbnail/Preview
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden cursor-pointer group"
               onClick={() => setShowVideo(true)}>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 to-brand-pink/30"></div>
            
            {/* Play Button Overlay */}
            <div className="relative z-10 text-center group-hover:scale-110 transition-transform duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 mx-auto">
                <PlayCircle className="w-20 h-20 text-white" />
              </div>
              <p className="text-white font-mali font-bold text-xl mb-2">African Alphabet Adventure</p>
              <p className="text-white/80 font-mali text-lg">Click to watch the demo!</p>
            </div>
            
            {/* Animated elements */}
            <div className="absolute top-4 left-4 animate-bounce">
              <Kiki className="scale-50" />
            </div>
            <div className="absolute bottom-4 right-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Tano className="scale-50" />
            </div>
            
            {/* Floating letters */}
            <div className="absolute top-1/4 right-1/4 text-4xl font-mali font-bold text-white/40 animate-pulse">A</div>
            <div className="absolute bottom-1/3 left-1/4 text-3xl font-mali font-bold text-white/40 animate-pulse" style={{ animationDelay: '1s' }}>B</div>
            <div className="absolute top-1/3 left-1/3 text-2xl font-mali font-bold text-white/40 animate-pulse" style={{ animationDelay: '2s' }}>C</div>
          </div>
        ) : (
          // YouTube Video Embed
          <div className="aspect-video bg-black rounded-2xl relative overflow-hidden">
            <iframe
              className="w-full h-full rounded-2xl"
              src={`https://www.youtube.com/embed/Z9gdMJvYS8g?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&showinfo=0&rel=0&modestbranding=1`}
              title="Zinga Linga Trae - African Alphabet Adventure Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {/* Video Controls Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <div className="bg-black/70 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Kiki className="scale-25" />
                  <span className="text-white font-mali font-bold text-sm">Kiki & Tano</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/70 rounded-lg p-2 hover:bg-black/80 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            
            {/* Close Video Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-black/70 rounded-lg p-2 hover:bg-black/80 transition-colors z-10"
            >
              <span className="text-white font-mali font-bold text-sm">✕</span>
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-mali font-bold text-white mb-2">
            🎵 African Alphabet Adventure
          </h3>
          <p className="font-mali text-pink-100 mb-6 text-lg leading-relaxed">
            Join Kiki and Tano as they explore the African alphabet with amazing animals, 
            fun songs, and interactive learning adventures!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.open('https://www.youtube.com/watch?v=Z9gdMJvYS8g', '_blank')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white font-mali font-bold py-3 px-6 rounded-full hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Watch Full Video on YouTube
            </button>
            
            <button 
              onClick={onLoginClick}
              className="bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-3 px-6 rounded-full hover:from-brand-yellow hover:to-brand-red transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              🚀 Start Learning Now
            </button>
          </div>
          
          {/* Video Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-mali font-bold text-white">26</div>
              <div className="text-sm font-mali text-pink-200">Letters</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-mali font-bold text-white">🎵</div>
              <div className="text-sm font-mali text-pink-200">Songs</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-mali font-bold text-white">🦁</div>
              <div className="text-sm font-mali text-pink-200">Animals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};