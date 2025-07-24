import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface GoToTopProps {
  showAfter?: number; // Show button after scrolling this many pixels
  className?: string;
}

export const GoToTop: React.FC<GoToTopProps> = ({ 
  showAfter = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    setIsScrolling(true);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      disabled={isScrolling}
      className={`
        fixed bottom-6 right-6 z-50
        w-12 h-12 
        bg-gradient-to-r from-brand-green to-brand-blue
        hover:from-brand-blue hover:to-brand-green
        text-white 
        rounded-full 
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        flex items-center justify-center
        font-mali font-bold
        disabled:opacity-70 disabled:cursor-not-allowed
        group
        ${isScrolling ? 'animate-pulse' : ''}
        ${className}
      `}
      title="Go to top"
      aria-label="Scroll to top of page"
    >
      <ChevronUp 
        className={`
          w-6 h-6 
          transition-transform duration-300
          ${isScrolling ? 'animate-bounce' : 'group-hover:-translate-y-0.5'}
        `} 
      />
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></span>
    </button>
  );
};

// Alternative compact version
export const GoToTopCompact: React.FC<GoToTopProps> = ({ 
  showAfter = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > showAfter);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
    }`}>
      <button
        onClick={scrollToTop}
        className={`
          w-10 h-10 
          bg-brand-blue hover:bg-brand-green
          text-white 
          rounded-full 
          shadow-md hover:shadow-lg
          transition-all duration-200
          flex items-center justify-center
          ${className}
        `}
        title="Go to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

// Version with progress indicator
export const GoToTopWithProgress: React.FC<GoToTopProps> = ({ 
  showAfter = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > showAfter);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
    }`}>
      <div className="relative">
        {/* Progress circle */}
        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
            className="text-brand-blue transition-all duration-150"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Button */}
        <button
          onClick={scrollToTop}
          className={`
            absolute inset-2
            bg-white hover:bg-gray-50
            text-brand-blue hover:text-brand-green
            rounded-full 
            shadow-lg hover:shadow-xl
            transition-all duration-200
            flex items-center justify-center
            ${className}
          `}
          title={`Go to top (${Math.round(scrollProgress)}% scrolled)`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};