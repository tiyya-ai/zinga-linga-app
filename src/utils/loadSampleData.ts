import { dataStore } from './dataStore';

// Sample data for analytics
export const loadSampleAnalyticsData = () => {
  const sampleData = {
    users: [
      {
        id: 'admin-001',
        email: 'admin@zingalinga.com',
        name: 'System Administrator',
        role: 'admin' as const,
        purchasedModules: [],
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 0
      },
      {
        id: 'demo-parent-001',
        email: 'parent@demo.com',
        name: 'Demo Parent',
        role: 'user' as const,
        purchasedModules: ['module-001'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 11.00
      }
    ],
    modules: [
      {
        id: 'module-001',
        title: "Kiki's African Animal Alphabet",
        description: "Learn the alphabet with amazing African animals!",
        character: 'kiki' as const,
        price: 11.00,
        ageRange: '1-3 years',
        rating: 4.9,
        totalRatings: 1247,
        isActive: true,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Interactive games', 'Audio narration', 'Colorful animations'],
        demoVideo: '/demo/kiki-alphabet.mp4',
        fullContent: []
      },
      {
        id: 'module-002',
        title: "Tano's Jungle Songs",
        description: "Sing along with Tano in the African jungle!",
        character: 'tano' as const,
        price: 6.99,
        ageRange: '2-6 years',
        rating: 4.8,
        totalRatings: 892,
        isActive: true,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Musical adventures', 'Sing-along songs', 'Cultural stories'],
        demoVideo: '/demo/tano-songs.mp4',
        fullContent: []
      },
      {
        id: 'module-003',
        title: "Kiki's Counting Safari",
        description: "Count with Kiki on an exciting African safari!",
        character: 'kiki' as const,
        price: 9.99,
        ageRange: '2-5 years',
        rating: 4.7,
        totalRatings: 634,
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Number recognition', 'Counting games', 'Safari adventure'],
        demoVideo: '/demo/kiki-counting.mp4',
        fullContent: []
      }
    ],
    purchases: [
      {
        id: 'purchase-001',
        userId: 'demo-parent-001',
        moduleIds: ['module-001'],
        amount: 11.00,
        status: 'completed' as const,
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    contentFiles: []
  };

  // Generate more realistic users and purchases
  const names = [
    'Sarah Johnson', 'Mike Chen', 'Emma Davis', 'James Wilson', 'Lisa Garcia',
    'David Brown', 'Maria Rodriguez', 'John Smith', 'Ashley Miller', 'Chris Lee',
    'Jennifer Taylor', 'Robert Anderson', 'Michelle Thomas', 'Kevin Martinez',
    'Amanda White', 'Daniel Harris', 'Jessica Clark', 'Ryan Lewis', 'Nicole Walker',
    'Brandon Hall', 'Stephanie Young', 'Justin Allen', 'Rachel King', 'Tyler Wright'
  ];

  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  // Generate 30 more users with realistic data
  for (let i = 0; i < 30; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const daysAgo = Math.floor(Math.random() * 60); // Users from last 60 days
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    const user = {
      id: `user_${Date.now()}_${i}`,
      email,
      name,
      role: 'user' as const,
      purchasedModules: [] as string[],
      createdAt: createdAt.toISOString(),
      lastLogin: new Date(createdAt.getTime() + Math.random() * daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      totalSpent: 0
    };

    sampleData.users.push(user);

    // 50% chance user makes a purchase
    if (Math.random() < 0.5) {
      const moduleIndex = Math.floor(Math.random() * sampleData.modules.length);
      const module = sampleData.modules[moduleIndex];
      const purchaseDate = new Date(createdAt.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000);
      
      const purchase = {
        id: `purchase_${Date.now()}_${i}`,
        userId: user.id,
        moduleIds: [module.id],
        amount: module.price,
        status: Math.random() < 0.9 ? 'completed' as const : 'pending' as const,
        paymentMethod: 'Credit Card',
        createdAt: purchaseDate.toISOString(),
        completedAt: purchaseDate.toISOString()
      };

      sampleData.purchases.push(purchase);

      if (purchase.status === 'completed') {
        user.purchasedModules = [module.id];
        user.totalSpent = module.price;
      }
    }
  }

  // Save the sample data
  dataStore.saveData(sampleData);
  
  console.log('Sample analytics data loaded:', {
    users: sampleData.users.length,
    modules: sampleData.modules.length,
    purchases: sampleData.purchases.length,
    revenue: sampleData.purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  });

  return sampleData;
};