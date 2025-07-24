import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Video, Globe, BarChart3, X, Mail, Lock, TreePine, Leaf, Sun, ShoppingCart, Star, PlayCircle } from 'lucide-react';
import { User } from './types';
import { LoginModal } from './components/LoginModal';
import { UserDashboard } from './components/UserDashboard';
import { Header } from './components/Header';
import { Kiki, Tano } from './components/Characters';
import { authManager, AuthSession } from './utils/auth';

// Import admin dashboard components safely
let ImprovedAdminDashboard: any = null;
try {
  ImprovedAdminDashboard = require('./components/ImprovedAdminDashboard').ImprovedAdminDashboard;
} catch (error) {
  console.warn('Admin dashboard not available:', error);
}

// Fallback Simple Admin Dashboard
const SimpleAdminDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-mali font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-mali font-bold"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center mb-8">
          <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">
            Welcome, {user.name}!
          </h2>
          <p className="font-mali text-gray-600 text-lg mb-6">
            Admin dashboard is loading. Full features available soon.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-mali font-bold text-gray-800 mb-1">3</h3>
            <p className="font-mali text-gray-600">Learning Modules</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-mali font-bold text-gray-800 mb-1">Active</h3>
            <p className="font-mali text-gray-600">Purchase System</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-mali font-bold text-gray-800 mb-1">Ready</h3>
            <p className="font-mali text-gray-600">Analytics System</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-mali font-bold text-gray-800 mb-1">Online</h3>
            <p className="font-mali text-gray-600">Platform Status</p>
          </div>
        </div>

        {/* Admin Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-mali font-bold text-gray-800 mb-6">Admin Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-blue-800 mb-2">User Management</h4>
              <p className="font-mali text-blue-600">Manage user accounts and permissions</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-green-800 mb-2">Analytics</h4>
              <p className="font-mali text-green-600">View platform performance metrics</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-purple-800 mb-2">Orders</h4>
              <p className="font-mali text-purple-600">Track purchases and payments</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <Video className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-orange-800 mb-2">Content</h4>
              <p className="font-mali text-orange-600">Manage learning modules</p>
            </div>

            <div className="bg-red-50 rounded-xl p-6 text-center">
              <Globe className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-red-800 mb-2">System</h4>
              <p className="font-mali text-red-600">Monitor platform health</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <Star className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="text-lg font-mali font-bold text-indigo-800 mb-2">Reports</h4>
              <p className="font-mali text-indigo-600">Generate business reports</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-mali font-bold text-blue-800">Full Admin Dashboard Available</h4>
              <p className="font-mali text-blue-600">
                Complete admin features including Analytics, Reports, System monitoring, and User management are ready.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [animateLetters, setAnimateLetters] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateLetters(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    try {
      const session = authManager.getCurrentSession();
      if (session && authManager.isSessionValid(session)) {
        setUser(session.user);
        setCurrentSession(session);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
    setIsLoading(false);
  }, []);

  // Session timeout check
  useEffect(() => {
    if (currentSession) {
      const checkSession = () => {
        try {
          const session = authManager.getCurrentSession();
          if (!session || !authManager.isSessionValid(session)) {
            handleLogout();
          }
        } catch (error) {
          console.error('Session timeout check error:', error);
        }
      };

      const interval = setInterval(checkSession, 60000);
      return () => clearInterval(interval);
    }
  }, [currentSession]);

  const handleLogin = (userData: User) => {
    try {
      setUser(userData);
      const session = authManager.getCurrentSession();
      setCurrentSession(session);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    try {
      authManager.logout();
      setUser(null);
      setCurrentSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePurchase = (moduleIds: string[]) => {
    try {
      if (user) {
        setUser({
          ...user,
          purchasedModules: [...user.purchasedModules, ...moduleIds.filter(id => !user.purchasedModules.includes(id))]
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.role === 'admin') {
      // Try to use the full admin dashboard, fallback to simple one
      if (ImprovedAdminDashboard) {
        try {
          return (
            <ImprovedAdminDashboard 
              user={user} 
              onLogout={handleLogout}
            />
          );
        } catch (error) {
          console.error('Error loading full admin dashboard:', error);
          return (
            <SimpleAdminDashboard 
              user={user} 
              onLogout={handleLogout}
            />
          );
        }
      } else {
        return (
          <SimpleAdminDashboard 
            user={user} 
            onLogout={handleLogout}
          />
        );
      }
    } else {
      return (
        <UserDashboard 
          user={user} 
          onLogout={handleLogout}
          onPurchase={handlePurchase}
        />
      );
    }
  }

  const FloatingLetter = ({ letter, delay, position }: { letter: string; delay: number; position: string }) => (
    <div 
      className={`absolute ${position} text-6xl font-mali font-bold text-brand-green/60 animate-bounce`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {letter}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="font-mali text-gray-600">Loading Zinga Linga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden font-mali">
      {/* Header */}
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-white pt-32">
        {/* Animated jungle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-green/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 bg-brand-yellow/30 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-brand-blue/20 rounded-full animate-ping"></div>
          
          {/* Floating alphabet letters */}
          {animateLetters && (
            <>
              <FloatingLetter letter="A" delay={0} position="top-32 left-20" />
              <FloatingLetter letter="B" delay={0.5} position="top-48 right-32" />
              <FloatingLetter letter="C" delay={1} position="bottom-40 left-32" />
              <FloatingLetter letter="Z" delay={1.5} position="bottom-32 right-40" />
            </>
          )}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/zinga linga logo.png" 
              alt="Zinga Linga Logo" 
              className="h-48 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Characters - Kiki and Tano */}
          <div className="flex justify-center items-center gap-12 mb-8">
            <div className="text-center">
              <Kiki className="mx-auto mb-2" />
              <p className="text-gray-800 font-mali font-bold text-lg drop-shadow-sm">Kiki</p>
            </div>
            <div className="text-center">
              <Tano className="mx-auto mb-2" />
              <p className="text-gray-800 font-mali font-bold text-lg drop-shadow-sm">Tano</p>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-mali font-bold text-brand-green mb-6 drop-shadow-sm">
            Join Kiki and Tano on an African Alphabet Adventure
          </h2>
          
          <p className="text-xl font-mali text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Fun learning for children ages 1-6 with audio lessons, videos & interactive games.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold text-xl py-4 px-12 rounded-full hover:from-brand-yellow hover:to-brand-red transform hover:scale-110 transition-all duration-300 shadow-2xl flex items-center gap-3">
              <Play className="w-6 h-6" />
              Start Learning
            </button>
            
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-brand-green text-white font-mali font-bold text-lg py-4 px-10 rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-300 border-2 border-brand-green"
            >
              Parental Login
            </button>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue via-brand-pink to-brand-red">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-mali font-bold text-white mb-8">
            Complete Learning Platform ✨
          </h2>
          <p className="text-2xl font-mali text-white/90 mb-8">
            Full admin dashboard with Analytics, Reports, System monitoring & more!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <BarChart3 className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mali font-bold text-white mb-2">Analytics</h3>
              <p className="font-mali text-white/80">Real-time platform insights</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mali font-bold text-white mb-2">Reports</h3>
              <p className="font-mali text-white/80">Business intelligence reports</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <Globe className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mali font-bold text-white mb-2">System</h3>
              <p className="font-mali text-white/80">Platform health monitoring</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <ShoppingCart className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mali font-bold text-white mb-2">Commerce</h3>
              <p className="font-mali text-white/80">Purchase & user management</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-brand-blue font-mali font-bold text-xl py-4 px-12 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Access Admin Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;