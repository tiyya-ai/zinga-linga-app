import { User, Module, Purchase, Analytics, ContentFile, ContentStats } from '../types';

// GUARANTEED PERSISTENCE DATA STORE
class DataStore {
  private storageKey = 'zinga-linga-data';

  // Default data is a function to ensure it's a fresh copy
  private getDefaultData() {
    return {
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
      modules: [
        {
          id: 'module-001',
          title: "Kiki's African Animal Alphabet",
          description: "Learn the alphabet with amazing African animals!",
          character: 'kiki' as const,
          price: 11.00,
          ageRange: '1-3 years',
          isActive: true,
          isVisible: true,
          category: 'learning',
          difficulty: 'beginner' as const,
          estimatedDuration: '30 minutes',
          tags: ['alphabet', 'animals', 'kiki'],
          rating: 4.9,
          totalRatings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          features: ["Interactive games", "Audio narration", "Colorful animations"],
          demoVideo: "/demo/kiki-alphabet.mp4",
          fullContent: []
        },
        {
          id: 'module-002',
          title: "Tano's Jungle Songs",
          description: "Sing along with Tano in the African jungle!",
          character: 'tano' as const,
          price: 6.99,
          ageRange: '2-6 years',
          isActive: true,
          isVisible: true,
          category: 'music',
          difficulty: 'beginner' as const,
          estimatedDuration: '25 minutes',
          tags: ['music', 'songs', 'tano'],
          rating: 4.8,
          totalRatings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          features: ["Musical adventures", "Sing-along songs", "Cultural stories"],
          demoVideo: "/demo/tano-songs.mp4",
          fullContent: []
        }
      ] as Module[],
      purchases: [] as Purchase[],
      contentFiles: [] as ContentFile[],
      analytics: {
        totalUsers: 1,
        totalRevenue: 0,
        totalPurchases: 0,
        activeModules: 2,
        revenueByMonth: [],
        popularModules: [],
        userGrowth: []
      } as Analytics
    };
  }

  // Load data: Initializes with default data ONLY if storage is empty.
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        console.log('📖 Loading existing data from storage.');
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('❌ Error parsing stored data, resetting to default:', error);
    }
    
    console.log('🔧 No valid data found in storage. Initializing with default data.');
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  // Save data: Saves the provided data object directly to storage.
  saveData(data: any) {
    try {
      const dataToSave = {
        users: data.users || [],
        modules: data.modules || [],
        purchases: data.purchases || [],
        contentFiles: data.contentFiles || [],
        analytics: data.analytics || this.getDefaultData().analytics,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('❌ Error saving data to localStorage:', error);
      return false;
    }
  }

  // forceSave is an alias for saveData for clarity in components.
  forceSave(data: any) {
    console.log('💾 Saving data to storage...', { users: data.users.length, modules: data.modules.length });
    return this.saveData(data);
  }

  // Generate analytics from actual data
  generateAnalytics(users: User[], modules: Module[], purchases: Purchase[]): Analytics {
    const completedPurchases = purchases.filter(p => p.status === 'completed');
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalUsers: users.length,
      totalRevenue,
      totalPurchases: purchases.length,
      activeModules: modules.filter(m => m.isActive).length,
      revenueByMonth: [],
      popularModules: [],
      userGrowth: []
    };
  }

  // Generate content stats
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
}

export const dataStore = new DataStore();
