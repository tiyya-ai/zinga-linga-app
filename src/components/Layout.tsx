import React from 'react';
import { GoToTop } from './GoToTop';

interface LayoutProps {
  children: React.ReactNode;
  showGoToTop?: boolean;
  goToTopVariant?: 'default' | 'compact' | 'progress';
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showGoToTop = true,
  goToTopVariant = 'default'
}) => {
  return (
    <div className="min-h-screen">
      {children}
      
      {/* Go to Top Button */}
      {showGoToTop && (
        <>
          {goToTopVariant === 'default' && <GoToTop />}
          {goToTopVariant === 'compact' && <GoToTopCompact />}
          {goToTopVariant === 'progress' && <GoToTopWithProgress />}
        </>
      )}
    </div>
  );
};

// Example usage in your pages:
/*
// In any page component:
import { Layout } from '../components/Layout';
import { GoToTop } from '../components/GoToTop';

export const YourPage = () => {
  return (
    <Layout showGoToTop={true} goToTopVariant="progress">
      <div className="content">
        // Your page content here
      </div>
    </Layout>
  );
};

// Or add directly to specific pages:
export const YourPageWithDirectGoToTop = () => {
  return (
    <div className="min-h-screen">
      // Your page content
      
      <GoToTop showAfter={200} />
    </div>
  );
};
*/