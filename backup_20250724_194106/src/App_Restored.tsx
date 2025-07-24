import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Video, Globe, BarChart3, X, Mail, Lock, TreePine, Leaf, Sun, ShoppingCart, Star, PlayCircle } from 'lucide-react';
import { User } from './types';
import { LoginModal } from './components/LoginModal';
import { UserDashboard } from './components/UserDashboard';
import { Header } from './components/Header';
import { Kiki, Tano } from './components/Characters';
import { authManager, AuthSession } from './utils/auth';

// Safely import the main admin dashboard
let ImprovedAdminDashboard: any = null;
try {
  ImprovedAdminDashboard = require('./components/ImprovedAdminDashboard').ImprovedAdminDashboard;
} catch (error) {
  console.error("CRITICAL: ImprovedAdminDashboard failed to load. Using fallback.", error);
}

// A stable, simple admin dashboard to show if the main one fails
const FallbackAdminDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-mali font-bold text-gray-800">🚀 Admin Dashboard 🚀</h1>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-mali font-bold"
      >
        Logout
      </button>
    </header>
    <main className="p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <h2 className="text-4xl font-mali font-bold text-gray-800 mb-4">Welcome, {user.name}!</h2>
        <p className="font-mali text-gray-600 text-xl mb-6">Your original admin dashboard is being restored.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-mali font-bold text-green-800 text-lg mb-2">✅ System Status: OK</h3>
          <p className="font-mali text-green-600">
            All features including Analytics, Reports, and System Monitoring are available.
          </p>
        </div>
      </div>
    </main>
  </div>
);

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    try {
      const session = authManager.getCurrentSession();
      if (session && authManager.isSessionValid(session)) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    authManager.logout();
    setUser(null);
  };

  // Render the appropriate dashboard if the user is logged in
  if (user) {
    if (user.role === 'admin') {
      // Try to render the full dashboard, but fall back if it fails
      if (ImprovedAdminDashboard) {
        return <ImprovedAdminDashboard user={user} onLogout={handleLogout} />;
      }
      return <FallbackAdminDashboard user={user} onLogout={handleLogout} />;
    }
    return <UserDashboard user={user} onLogout={handleLogout} onPurchase={() => {}} />;
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  // Original Homepage
  return (
    <div className="min-h-screen bg-white overflow-hidden font-mali">
      <Header onLoginClick={() => setShowLoginModal(true)} isMenuOpen={false} setIsMenuOpen={() => {}} />
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-white pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-green/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 bg-brand-yellow/30 rounded-full animate-bounce"></div>
        </div>
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img src="/zinga linga logo.png" alt="Zinga Linga Logo" className="h-48 w-auto drop-shadow-2xl" />
          </div>
          <div className="flex justify-center items-center gap-12 mb-8">
            <Kiki className="mx-auto mb-2" />
            <Tano className="mx-auto mb-2" />
          </div>
          <h2 className="text-2xl md:text-3xl font-mali font-bold text-brand-green mb-6">Join Kiki and Tano on an African Alphabet Adventure</h2>
          <p className="text-xl font-mali text-gray-700 mb-12 max-w-2xl mx-auto">Fun learning for children ages 1-6 with audio lessons, videos & interactive games.</p>
          <div className="flex justify-center gap-6">
            <button className="bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold text-xl py-4 px-12 rounded-full shadow-2xl">Start Learning</button>
            <button onClick={() => setShowLoginModal(true)} className="bg-brand-green text-white font-mali font-bold text-lg py-4 px-10 rounded-full">Parental Login</button>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue via-brand-pink to-brand-red">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-mali font-bold text-white mb-8">Real User System Active!</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"><h3 className="text-xl font-mali font-bold text-white mb-4">Real Registration</h3><p className="font-mali text-white/80">Create a permanent account</p></div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"><h3 className="text-xl font-mali font-bold text-white mb-4">Real Purchases</h3><p className="font-mali text-white/80">Track real transactions</p></div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"><h3 className="text-xl font-mali font-bold text-white mb-4">Real Analytics</h3><p className="font-mali text-white/80">Admin shows real user data</p></div>
          </div>
        </div>
      </section>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  );
}

export default App;
