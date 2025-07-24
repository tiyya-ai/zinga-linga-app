import React, { useState } from 'react';
import { User } from '../types';
import { LoginModal } from './LoginModal';
import { UserDashboard } from './UserDashboard';
import { ImprovedAdminDashboard } from './ImprovedAdminDashboard';
import { Header } from './Header';
import { Footer } from './Footer';
import { AboutPage } from '../pages/AboutPage';
import { HelpPage } from '../pages/HelpPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { ContactPage } from '../pages/ContactPage';
import { ParentGuidePage } from '../pages/ParentGuidePage';
import { TechnicalSupportPage } from '../pages/TechnicalSupportPage';
import { SystemRequirementsPage } from '../pages/SystemRequirementsPage';
import { TroubleshootingPage } from '../pages/TroubleshootingPage';
import { CookiePolicyPage } from '../pages/CookiePolicyPage';
import { RefundPolicyPage } from '../pages/RefundPolicyPage';
import { COPPACompliancePage } from '../pages/COPPACompliancePage';
import { DemoPage } from '../pages/DemoPage';
import { authManager, AuthSession } from '../utils/auth';

// Import the main landing page content
import { LandingPage } from './LandingPage';

interface PageRouterProps {
  user: User | null;
  currentSession: AuthSession | null;
  onLogin: (userData: User) => void;
  onLogout: () => void;
  onPurchase: (moduleIds: string[]) => void;
}

export const PageRouter: React.FC<PageRouterProps> = ({
  user,
  currentSession,
  onLogin,
  onLogout,
  onPurchase
}) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.role === 'admin') {
      return (
        <ImprovedAdminDashboard 
          user={user} 
          onLogout={onLogout}
        />
      );
    } else {
      return (
        <UserDashboard 
          user={user} 
          onLogout={onLogout}
          onPurchase={onPurchase}
        />
      );
    }
  }

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onBack={() => handleNavigation('home')} />;
      case 'help':
        return <HelpPage onBack={() => handleNavigation('home')} />;
      case 'privacy':
        return <PrivacyPage onBack={() => handleNavigation('home')} />;
      case 'terms':
        return <TermsPage onBack={() => handleNavigation('home')} />;
      case 'contact':
        return <ContactPage onBack={() => handleNavigation('home')} />;
      case 'guide':
        return <ParentGuidePage onBack={() => handleNavigation('home')} />;
      case 'support':
        return <TechnicalSupportPage onBack={() => handleNavigation('home')} />;
      case 'requirements':
        return <SystemRequirementsPage onBack={() => handleNavigation('home')} />;
      case 'troubleshoot':
        return <TroubleshootingPage onBack={() => handleNavigation('home')} />;
      case 'cookies':
        return <CookiePolicyPage onBack={() => handleNavigation('home')} />;
      case 'refund':
        return <RefundPolicyPage onBack={() => handleNavigation('home')} />;
      case 'coppa':
        return <COPPACompliancePage onBack={() => handleNavigation('home')} />;
      case 'demo':
        return <DemoPage onBack={() => handleNavigation('home')} />;
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-white overflow-hidden font-mali">
            <Header 
              onLoginClick={() => setShowLoginModal(true)}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={handleNavigation}
            />
            <LandingPage onLoginClick={() => setShowLoginModal(true)} />
            <Footer onNavigate={handleNavigation} />
          </div>
        );
    }
  };

  return (
    <>
      {renderCurrentPage()}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
      />
    </>
  );
};