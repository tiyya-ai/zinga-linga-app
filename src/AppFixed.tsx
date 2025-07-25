import React, { useState, useEffect } from 'react';
import { User } from './types';
import { PageRouter } from './components/PageRouter';
import { authManager, AuthSession } from './utils/auth';
import { dataStore } from './utils/dataStore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load and initialize data ONLY if needed
  useEffect(() => {
    // Initialize data only if completely empty - PRESERVE EXISTING CHANGES
    initializeDataIfNeeded();
    
    const session = authManager.getCurrentSession();
    if (session && authManager.isSessionValid(session)) {
      setUser(session.user);
      setCurrentSession(session);
    }
    setIsLoading(false);
  }, []);

  // Initialize data ONLY if completely empty - PRESERVE EXISTING CHANGES
  const initializeDataIfNeeded = () => {
    const existingData = dataStore.loadData();
    
    // Only initialize if we have NO data at all
    if (!existingData.users || existingData.users.length === 0 || !existingData.modules || existingData.modules.length === 0) {
      console.log('🔧 No existing data found - initializing with default data');
      
      // Initialize with minimal real data structure ONLY if no data exists
      const defaultData = {
        users: [
          {
            id: "admin-001",
            email: "admin@zingalinga.com",
            name: "System Administrator",
            role: "admin",
            purchasedModules: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            totalSpent: 0
          }
        ],
        modules: [
          {
            id: "module-001",
            title: "Kiki's African Animal Alphabet",
            description: "Learn the alphabet with amazing African animals!",
            character: "kiki",
            price: 11,
            ageRange: "1-3 years",
            rating: 4.9,
            totalRatings: 0,
            isActive: true,
            isVisible: true,
            category: 'learning',
            difficulty: 'beginner',
            estimatedDuration: '30 minutes',
            tags: ['alphabet', 'animals', 'kiki'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            features: [
              "Interactive games",
              "Audio narration",
              "Colorful animations"
            ],
            demoVideo: "/demo/kiki-alphabet.mp4",
            fullContent: []
          },
          {
            id: "module-002",
            title: "Tano's Jungle Songs",
            description: "Sing along with Tano in the African jungle!",
            character: "tano",
            price: 6.99,
            ageRange: "2-6 years",
            rating: 4.8,
            totalRatings: 0,
            isActive: true,
            isVisible: true,
            category: 'music',
            difficulty: 'beginner',
            estimatedDuration: '25 minutes',
            tags: ['music', 'songs', 'tano'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            features: [
              "Musical adventures",
              "Sing-along songs",
              "Cultural stories"
            ],
            demoVideo: "/demo/tano-songs.mp4",
            fullContent: []
          },
          {
            id: "module-003",
            title: "Kiki's Counting Safari",
            description: "Count with Kiki on an exciting African safari!",
            character: "kiki",
            price: 9.99,
            ageRange: "2-5 years",
            rating: 4.7,
            totalRatings: 0,
            isActive: true,
            isVisible: true,
            category: 'math',
            difficulty: 'intermediate',
            estimatedDuration: '35 minutes',
            tags: ['counting', 'numbers', 'kiki'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            features: [
              "Number recognition",
              "Counting games",
              "Safari adventure"
            ],
            demoVideo: "/demo/kiki-counting.mp4",
            fullContent: []
          }
        ],
        purchases: [],
        contentFiles: [],
        analytics: {
          totalUsers: 1,
          totalRevenue: 0,
          totalPurchases: 0,
          activeModules: 3,
          revenueByMonth: [],
          userGrowth: [],
          popularModules: []
        }
      };

      dataStore.saveData(defaultData);
      console.log('✅ Default data initialized');
    } else {
      console.log('✅ Existing data preserved - no initialization needed');
      console.log(`📊 Found ${existingData.users.length} users and ${existingData.modules.length} modules`);
      
      // Ensure admin user exists
      const hasAdmin = existingData.users.some(u => u.role === 'admin');
      if (!hasAdmin) {
        console.log('🔧 Adding admin user to existing data');
        const adminUser = {
          id: "admin-001",
          email: "admin@zingalinga.com",
          name: "System Administrator",
          role: "admin",
          purchasedModules: [],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          totalSpent: 0
        };
        
        const updatedData = {
          ...existingData,
          users: [adminUser, ...existingData.users]
        };
        dataStore.saveData(updatedData);
      }
    }
  };

  // Session timeout check
  useEffect(() => {
    if (currentSession) {
      const checkSession = () => {
        const session = authManager.getCurrentSession();
        if (!session || !authManager.isSessionValid(session)) {
          handleLogout();
        }
      };

      // Check session every minute
      const interval = setInterval(checkSession, 60000);
      return () => clearInterval(interval);
    }
  }, [currentSession]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    const session = authManager.getCurrentSession();
    setCurrentSession(session);
  };

  const handleLogout = () => {
    authManager.logout();
    setUser(null);
    setCurrentSession(null);
  };

  const handlePurchase = (moduleIds: string[]) => {
    if (user) {
      // Update user with purchased modules
      const updatedUser = {
        ...user,
        purchasedModules: [...user.purchasedModules, ...moduleIds.filter(id => !user.purchasedModules.includes(id))]
      };
      setUser(updatedUser);

      // Load current data and modules to get purchase details
      const currentData = dataStore.loadData();
      const modules = currentData.modules;
      
      // Calculate total purchase amount
      const purchasedModules = modules.filter(module => moduleIds.includes(module.id));
      const totalAmount = purchasedModules.reduce((sum, module) => sum + module.price, 0);
      
      // Update user's total spent
      updatedUser.totalSpent = (updatedUser.totalSpent || 0) + totalAmount;
      
      // Create purchase record
      const purchase = {
        id: `purchase-${Date.now()}`,
        userId: user.id,
        moduleIds: moduleIds,
        amount: totalAmount,
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        paymentMethod: 'stripe'
      };

      // Update data store
      const updatedData = {
        ...currentData,
        users: currentData.users.map(u => u.id === user.id ? updatedUser : u),
        purchases: [...currentData.purchases, purchase]
      };
      dataStore.saveData(updatedData);

      // Create real purchase notification for admin
      import('./utils/notificationService').then(({ notificationService }) => {
        const moduleNames = purchasedModules.map(m => m.title).join(', ');
        notificationService.createNotification(
          'purchase',
          '🛒 New Purchase!',
          `${user.name} purchased ${moduleNames} for ${totalAmount.toFixed(2)}`,
          'high',
          user.id,
          purchase.id,
          { 
            amount: totalAmount, 
            customer: user.name,
            modules: moduleNames,
            timestamp: new Date().toISOString()
          }
        );
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/zinga linga logo.png" 
            alt="Zinga Linga" 
            className="h-24 w-auto mx-auto mb-4 animate-pulse"
          />
          <p className="text-brand-green font-mali font-bold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <PageRouter
      user={user}
      currentSession={currentSession}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onPurchase={handlePurchase}
    />
  );
}

export default App;