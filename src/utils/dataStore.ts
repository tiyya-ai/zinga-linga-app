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
        email: 'sarah.johnson@gmail.com',
        name: 'Sarah Johnson',
        role: 'user' as const,
        purchasedModules: ['module-001', 'module-002', 'module-003'],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 27.98
      },
      {
        id: 'user-002',
        email: 'mike.chen@outlook.com',
        name: 'Mike Chen',
        role: 'user' as const,
        purchasedModules: ['module-001', 'module-002'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 17.99
      },
      {
        id: 'user-003',
        email: 'emma.davis@yahoo.com',
        name: 'Emma Davis',
        role: 'user' as const,
        purchasedModules: ['module-002', 'module-003'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 16.98
      },
      {
        id: 'user-004',
        email: 'james.wilson@gmail.com',
        name: 'James Wilson',
        role: 'user' as const,
        purchasedModules: ['module-001'],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 11.00
      },
      {
        id: 'user-005',
        email: 'maria.garcia@hotmail.com',
        name: 'Maria Garcia',
        role: 'user' as const,
        purchasedModules: ['module-003'],
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: 9.99
      }
    ] as User[],
    modules: [
      {
        id: 'module-001',
        title: "Kiki's African Animal Alphabet",
        description: "Learn the alphabet with amazing African animals! Join Kiki on an exciting journey through the African savanna, discovering letters A-Z with beautiful animals like Antelope, Baboon, Cheetah, and more!",
        character: 'kiki' as const,
        price: 11.00,
        ageRange: '1-3 years',
        isActive: true,
        isVisible: true,
        category: 'learning',
        difficulty: 'beginner' as const,
        estimatedDuration: '30 minutes',
        tags: ['alphabet', 'animals', 'african', 'kiki', 'early-learning'],
        rating: 4.9,
        totalRatings: 1247,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: [
          "26 Interactive alphabet lessons",
          "Beautiful African animal illustrations", 
          "Native pronunciation audio",
          "Fun animal sounds and facts",
          "Progress tracking for parents",
          "Offline mode available"
        ],
        demoVideo: "/demo/kiki-alphabet.mp4",
        fullContent: [
          { id: 'content-001', type: 'video', title: 'Welcome to Kiki\'s Animal World', duration: '3:00', thumbnail: '/thumbnails/kiki-welcome.jpg' },
          { id: 'content-002', type: 'game', title: 'Letter A - Antelope Adventure', duration: '5:00', thumbnail: '/thumbnails/antelope-game.jpg' },
          { id: 'content-003', type: 'audio', title: 'Animal Alphabet Song', duration: '4:00', thumbnail: '/thumbnails/alphabet-song.jpg' },
          { id: 'content-004', type: 'game', title: 'Letter B - Baboon Bounce', duration: '4:40', thumbnail: '/thumbnails/baboon-game.jpg' },
          { id: 'content-005', type: 'video', title: 'African Safari Tour', duration: '5:20', thumbnail: '/thumbnails/safari-tour.jpg' },
          { id: 'content-006', type: 'game', title: 'Complete Alphabet Quiz', duration: '10:00', thumbnail: '/thumbnails/alphabet-quiz.jpg' }
        ]
      },
      {
        id: 'module-002',
        title: "Tano's Jungle Songs",
        description: "Sing along with Tano in the African jungle! Discover traditional African music, rhythms, and cultural stories through interactive songs and musical adventures.",
        character: 'tano' as const,
        price: 6.99,
        ageRange: '2-6 years',
        isActive: true,
        isVisible: true,
        category: 'music',
        difficulty: 'beginner' as const,
        estimatedDuration: '25 minutes',
        tags: ['music', 'songs', 'african', 'tano', 'cultural'],
        rating: 4.8,
        totalRatings: 892,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: [
          "15 Traditional African songs",
          "Interactive rhythm games",
          "Cultural storytelling",
          "Musical instrument sounds",
          "Sing-along lyrics display",
          "Dance movement guides"
        ],
        demoVideo: "/demo/tano-songs.mp4",
        fullContent: [
          { id: 'content-007', type: 'video', title: 'Welcome to Tano\'s Jungle', duration: '3:20', thumbnail: '/thumbnails/tano-welcome.jpg' },
          { id: 'content-008', type: 'audio', title: 'African Drum Circle', duration: '3:00', thumbnail: '/thumbnails/drum-circle.jpg' },
          { id: 'content-009', type: 'game', title: 'Rhythm Matching Game', duration: '5:50', thumbnail: '/thumbnails/rhythm-game.jpg' },
          { id: 'content-010', type: 'audio', title: 'Jungle Animal Sounds', duration: '4:00', thumbnail: '/thumbnails/jungle-sounds.jpg' },
          { id: 'content-011', type: 'video', title: 'Traditional Dance Moves', duration: '4:40', thumbnail: '/thumbnails/dance-moves.jpg' },
          { id: 'content-012', type: 'game', title: 'Musical Memory Challenge', duration: '6:40', thumbnail: '/thumbnails/memory-game.jpg' }
        ]
      },
      {
        id: 'module-003',
        title: "Kiki's Counting Safari",
        description: "Count with Kiki on an exciting African safari! Learn numbers 1-20 while exploring the beautiful African landscape and meeting amazing wildlife friends.",
        character: 'kiki' as const,
        price: 9.99,
        ageRange: '2-5 years',
        isActive: true,
        isVisible: true,
        category: 'math',
        difficulty: 'intermediate' as const,
        estimatedDuration: '35 minutes',
        tags: ['counting', 'numbers', 'math', 'kiki', 'safari'],
        rating: 4.7,
        totalRatings: 634,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: [
          "Numbers 1-20 interactive lessons",
          "Safari animal counting games",
          "Visual number recognition",
          "Basic math concepts",
          "Counting songs and rhymes",
          "Achievement rewards system"
        ],
        demoVideo: "/demo/kiki-counting.mp4",
        fullContent: [
          { id: 'content-013', type: 'video', title: 'Safari Counting Adventure', duration: '3:40', thumbnail: '/thumbnails/counting-safari.jpg' },
          { id: 'content-014', type: 'game', title: 'Count the Elephants', duration: '5:00', thumbnail: '/thumbnails/elephant-counting.jpg' },
          { id: 'content-015', type: 'audio', title: 'Counting Songs Collection', duration: '6:00', thumbnail: '/thumbnails/counting-songs.jpg' },
          { id: 'content-016', type: 'game', title: 'Number Matching Safari', duration: '4:40', thumbnail: '/thumbnails/number-matching.jpg' },
          { id: 'content-017', type: 'video', title: 'Big Numbers, Big Animals', duration: '4:10', thumbnail: '/thumbnails/big-numbers.jpg' },
          { id: 'content-018', type: 'game', title: 'Safari Math Challenge', duration: '7:30', thumbnail: '/thumbnails/math-challenge.jpg' }
        ]
      }
    ] as Module[],
    purchases: [
      {
        id: 'purchase-001',
        userId: 'user-001',
        moduleIds: ['module-001', 'module-002'],
        amount: 17.99,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-002',
        userId: 'user-002',
        moduleIds: ['module-001'],
        amount: 11.00,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-003',
        userId: 'user-003',
        moduleIds: ['module-002', 'module-003'],
        amount: 16.98,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-004',
        userId: 'user-001',
        moduleIds: ['module-003'],
        amount: 9.99,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-005',
        userId: 'user-002',
        moduleIds: ['module-002'],
        amount: 6.99,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'purchase-006',
        userId: 'user-003',
        moduleIds: ['module-001'],
        amount: 11.00,
        status: 'pending' as const,
        paymentMethod: 'PayPal',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
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
      totalUsers: 6,
      totalRevenue: 83.95,
      totalPurchases: 6,
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
      // Ensure we're saving the complete data structure
      const dataToSave = {
        users: data.users || [],
        modules: data.modules || [],
        purchases: data.purchases || [],
        contentFiles: data.contentFiles || [],
        analytics: data.analytics || this.defaultData.analytics,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      console.log('Data saved successfully:', {
        users: dataToSave.users.length,
        modules: dataToSave.modules.length,
        purchases: dataToSave.purchases.length,
        contentFiles: dataToSave.contentFiles.length
      });
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

  // Force refresh data with updated structure
  refreshDataStructure() {
    // Clear old data and reload with new structure
    localStorage.removeItem(this.storageKey);
    const newData = this.defaultData;
    this.saveData(newData);
    return newData;
  }

  // Migrate old data to new structure
  migrateData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Update modules with new properties if they don't exist
        if (data.modules) {
          data.modules = data.modules.map((module: any) => ({
            ...module,
            isVisible: module.isVisible !== undefined ? module.isVisible : true,
            category: module.category || 'learning',
            difficulty: module.difficulty || 'beginner',
            estimatedDuration: module.estimatedDuration || '30 minutes',
            tags: module.tags || []
          }));
        }
        
        this.saveData(data);
        return data;
      }
    } catch (error) {
      console.error('Error migrating data:', error);
    }
    return this.defaultData;
  }
}

export const dataStore = new DataStore();