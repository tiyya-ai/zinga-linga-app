import React, { useState, useEffect } from 'react';
import { User } from './types';
import { PageRouter } from './components/PageRouter';
import { authManager, AuthSession } from './utils/auth';
import { dataStore } from './utils/dataStore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app start, load data from storage.
    // The dataStore now handles initialization internally.
    dataStore.loadData();
    
    const session = authManager.getCurrentSession();
    if (session && authManager.isSessionValid(session)) {
      setUser(session.user);
      setCurrentSession(session);
    }
    setIsLoading(false);
  }, []);

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
      const updatedUser = {
        ...user,
        purchasedModules: [...user.purchasedModules, ...moduleIds.filter(id => !user.purchasedModules.includes(id))]
      };
      setUser(updatedUser);

      const currentData = dataStore.loadData();
      const modules = currentData.modules;
      const purchasedModules = modules.filter(module => moduleIds.includes(module.id));
      const totalAmount = purchasedModules.reduce((sum, module) => sum + module.price, 0);
      updatedUser.totalSpent = (updatedUser.totalSpent || 0) + totalAmount;
      
      const purchase = {
        id: `purchase-${Date.now()}`,
        userId: user.id,
        moduleIds: moduleIds,
        amount: totalAmount,
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        paymentMethod: 'stripe'
      };

      const updatedData = {
        ...currentData,
        users: currentData.users.map(u => u.id === user.id ? updatedUser : u),
        purchases: [...currentData.purchases, purchase]
      };
      dataStore.saveData(updatedData);
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
