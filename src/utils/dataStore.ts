import { User, Module, Purchase, Analytics, ContentFile, ContentStats } from '../types';

// Real data store using localStorage for persistence
class DataStore {
  private storageKey = 'zinga-linga-data';

  // Initialize with sample data for demonstration
  private defaultData = {
    users: [
      {
        id: 'admin-001',
        email: 'admin@zingalinga.com',
        name: 'System Administrator',
        role: 'admin' as const,
        purchasedModules: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 0
      },
      {
        id: 'user-001',
        email: 'parent1@example.com',
        name: 'Sarah Johnson',
        role: 'user' as const,
        purchasedModules: ['module-001', 'module-002'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 49.98
      },
      {
        id: 'user-002',
        email: 'parent2@example.com',
        name: 'Mike Chen',
        role: 'user' as const,
        purchasedModules: ['module-001'],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 24.99
      },
      {
        id: 'user-003',
        email: 'parent3@example.com',
        name: 'Emma Davis',
        role: 'user' as const,
        purchasedModules: ['module-002', 'module-003'],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 49.98
      }
    ] as User[],
    modules: [
      {
        id: 'module-001',
        title: "Kiki's Creative Adventures",
        description: "Join Kiki on exciting creative journeys filled with art, music, and imagination!",
        character: 'kiki' as const,
        price: 24.99,
        ageRange: '3-6 years',
        isActive: true,
        rating: 4.8,
        totalRatings: 156,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        fullContent: [
          { id: 'content-001', type: 'video', title: 'Welcome to Kiki\'s World', duration: 180 },
          { id: 'content-002', type: 'game', title: 'Color Mixing Fun', duration: 300 },
          { id: 'content-003', type: 'audio', title: 'Kiki\'s Song Time', duration: 240 }
        ]
      },
      {
        id: 'module-002',
        title: "Trae's Logic Puzzles",
        description: "Help Trae solve amazing puzzles and learn problem-solving skills!",
        character: 'trae' as const,
        price: 24.99,
        ageRange: '4-8 years',
        isActive: true,
        rating: 4.6,
        totalRatings: 89,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        fullContent: [
          { id: 'content-004', type: 'video', title: 'Trae\'s Puzzle Palace', duration: 200 },
          { id: 'content-005', type: 'game', title: 'Shape Sorter Challenge', duration: 400 },
          { id: 'content-006', type: 'audio', title: 'Think Along with Trae', duration: 180 }
        ]
      },
      {
        id: 'module-003',
        title: "Kiki & Trae's Friendship Stories",
        description: "Learn about friendship, sharing, and caring with Kiki and Trae!",
        character: 'kiki' as const,
        price: 24.99,
        ageRange: '3-7 years',
        isActive: true,
        rating: 4.9,
        totalRatings: 203,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        fullContent: [
          { id: 'content-007', type: 'video', title: 'Best Friends Forever', duration: 220 },
          { id: 'content-008', type: 'game', title: 'Sharing is Caring Game', duration: 350 },
          { id: 'content-009', type: 'audio', title: 'Friendship Songs', duration: 300 }
        ]
      }
    ] as Module[],
    purchases: [
      {
        id: 'purchase-001',
        userId: 'user-001',
        moduleIds: ['module-001', 'module-002'],
        amount: 49.98,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-002',
        userId: 'user-002',
        moduleIds: ['module-001'],
        amount: 24.99,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-003',
        userId: 'user-003',
        moduleIds: ['module-002', 'module-003'],
        amount: 49.98,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-004',
        userId: 'user-001',
        moduleIds: ['module-003'],
        amount: 24.99,
        status: 'pending' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-005',
        userId: 'user-002',
        moduleIds: ['module-002'],
        amount: 24.99,
        status: 'pending' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ] as Purchase[],
    contentFiles: [
      {
        id: 'file-001',
        name: 'kiki-welcome-video.mp4',
        type: 'video' as const,
        size: 15728640, // 15MB
        uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'file-002',
        name: 'trae-puzzle-game.swf',
        type: 'game' as const,
        size: 8388608, // 8MB
        uploadedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'file-003',
        name: 'friendship-song.mp3',
        type: 'audio' as const,
        size: 4194304, // 4MB
        uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'file-004',
        name: 'character-artwork.png',
        type: 'image' as const,
        size: 2097152, // 2MB
        uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'file-005',
        name: 'parent-guide.pdf',
        type: 'document' as const,
        size: 1048576, // 1MB
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ] as ContentFile[],
    analytics: {
      totalUsers: 4,
      totalRevenue: 124.95,
      totalPurchases: 5,
      activeModules: 3,
      revenueByMonth: [],
      popularModules: [],
      userGrowth: []
    } as Analytics
  };

  // Load data from localStorage or return default
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...this.defaultData,
          ...data,
          // Ensure we always have the admin user
          users: data.users?.length > 0 ? data.users : this.defaultData.users
        };
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return this.defaultData;
  }

  // Save data to localStorage
  saveData(data: any) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  // Generate real analytics from actual data
  generateAnalytics(users: User[], modules: Module[], purchases: Purchase[]): Analytics {
    const completedPurchases = purchases.filter(p => p.status === 'completed');
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
    
    // Generate monthly revenue data from actual purchases
    const revenueByMonth = this.generateMonthlyRevenue(completedPurchases);
    
    // Generate user growth data
    const userGrowth = this.generateUserGrowth(users);
    
    // Generate popular modules data
    const popularModules = this.generatePopularModules(modules, purchases);

    return {
      totalUsers: users.length,
      totalRevenue,
      totalPurchases: purchases.length,
      activeModules: modules.filter(m => m.isActive).length,
      revenueByMonth,
      popularModules,
      userGrowth
    };
  }

  private generateMonthlyRevenue(purchases: Purchase[]) {
    const monthlyData: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = months[date.getMonth()];
      monthlyData[monthKey] = 0;
    }

    // Add actual purchase data
    purchases.forEach(purchase => {
      const date = new Date(purchase.createdAt);
      const monthKey = months[date.getMonth()];
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += purchase.amount;
      }
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  }

  private generateUserGrowth(users: User[]) {
    const monthlyData: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = months[date.getMonth()];
      monthlyData[monthKey] = 0;
    }

    // Count users by creation month
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = months[date.getMonth()];
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey]++;
      }
    });

    return Object.entries(monthlyData).map(([month, users]) => ({
      month,
      users
    }));
  }

  private generatePopularModules(modules: Module[], purchases: Purchase[]) {
    const modulePurchases: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      purchase.moduleIds.forEach(moduleId => {
        modulePurchases[moduleId] = (modulePurchases[moduleId] || 0) + 1;
      });
    });

    return modules
      .map(module => ({
        moduleId: module.id,
        title: module.title,
        purchases: modulePurchases[module.id] || 0
      }))
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);
  }

  // Generate content statistics from actual files
  generateContentStats(contentFiles: ContentFile[]): ContentStats {
    const totalSize = contentFiles.reduce((sum, file) => sum + file.size, 0);
    
    const byType = {
      video: contentFiles.filter(f => f.type === 'video').length,
      audio: contentFiles.filter(f => f.type === 'audio').length,
      game: contentFiles.filter(f => f.type === 'game').length,
      image: contentFiles.filter(f => f.type === 'image').length,
      document: contentFiles.filter(f => f.type === 'document').length,
    };

    const recentUploads = contentFiles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      totalFiles: contentFiles.length,
      totalSize,
      byType,
      recentUploads
    };
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate unique IDs
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Clear all data (reset to default)
  clearData() {
    localStorage.removeItem(this.storageKey);
    return this.defaultData;
  }

  // Initialize with sample data (for first time setup)
  initializeSampleData() {
    const existingData = this.loadData();
    if (existingData.users.length <= 1 && existingData.modules.length === 0) {
      this.saveData(this.defaultData);
      return this.defaultData;
    }
    return existingData;
  }
}

export const dataStore = new DataStore();