import { User, Module, Purchase, Analytics, ContentFile, ContentStats } from '../types';

// Real data store using localStorage for persistence
class DataStore {
  private storageKey = 'zinga-linga-data';

  // Initialize with minimal real data
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
      }
    ] as User[],
    modules: [] as Module[],
    purchases: [] as Purchase[],
    contentFiles: [] as ContentFile[],
    analytics: {
      totalUsers: 1,
      totalRevenue: 0,
      totalPurchases: 0,
      activeModules: 0,
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
}

export const dataStore = new DataStore();