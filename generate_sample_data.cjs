const fs = require('fs');
const path = require('path');

// Generate realistic sample data for analytics
function generateSampleData() {
  const users = [];
  const purchases = [];
  const modules = [
    {
      id: 'module-001',
      title: "Kiki's African Animal Alphabet",
      description: "Learn the alphabet with amazing African animals!",
      character: 'kiki',
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
      character: 'tano',
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
      character: 'kiki',
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
  ];

  // Generate realistic users over the past 90 days
  const names = [
    'Sarah Johnson', 'Mike Chen', 'Emma Davis', 'James Wilson', 'Lisa Garcia',
    'David Brown', 'Maria Rodriguez', 'John Smith', 'Ashley Miller', 'Chris Lee',
    'Jennifer Taylor', 'Robert Anderson', 'Michelle Thomas', 'Kevin Martinez',
    'Amanda White', 'Daniel Harris', 'Jessica Clark', 'Ryan Lewis', 'Nicole Walker',
    'Brandon Hall', 'Stephanie Young', 'Justin Allen', 'Rachel King', 'Tyler Wright',
    'Samantha Green', 'Andrew Adams', 'Brittany Baker', 'Matthew Nelson', 'Lauren Hill'
  ];

  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  for (let i = 0; i < 50; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    const user = {
      id: `user_${Date.now()}_${i}`,
      email,
      name,
      role: 'user',
      purchasedModules: [],
      createdAt: createdAt.toISOString(),
      lastLogin: new Date(createdAt.getTime() + Math.random() * daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      totalSpent: 0
    };

    users.push(user);

    // 60% chance user makes a purchase
    if (Math.random() < 0.6) {
      const numModules = Math.random() < 0.3 ? 2 : 1; // 30% chance of buying 2 modules
      const selectedModules = modules.sort(() => 0.5 - Math.random()).slice(0, numModules);
      const moduleIds = selectedModules.map(m => m.id);
      const amount = selectedModules.reduce((sum, m) => sum + m.price, 0);
      
      const purchaseDate = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      const purchase = {
        id: `purchase_${Date.now()}_${i}`,
        userId: user.id,
        moduleIds,
        amount,
        status: Math.random() < 0.9 ? 'completed' : 'pending',
        paymentMethod: 'Credit Card',
        createdAt: purchaseDate.toISOString(),
        completedAt: purchaseDate.toISOString()
      };

      purchases.push(purchase);

      if (purchase.status === 'completed') {
        user.purchasedModules = moduleIds;
        user.totalSpent = amount;
      }
    }
  }

  // Add admin user
  users.unshift({
    id: 'admin-001',
    email: 'admin@zingalinga.com',
    name: 'System Administrator',
    role: 'admin',
    purchasedModules: [],
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date().toISOString(),
    totalSpent: 0
  });

  // Add demo parent
  users.push({
    id: 'demo-parent-001',
    email: 'parent@demo.com',
    name: 'Demo Parent',
    role: 'user',
    purchasedModules: ['module-001'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date().toISOString(),
    totalSpent: 11.00
  });

  return { users, modules, purchases, contentFiles: [] };
}

// Save the sample data
const sampleData = generateSampleData();
const dataPath = path.join(__dirname, 'sample_data.json');
fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));

console.log(`Generated sample data with:`);
console.log(`- ${sampleData.users.length} users`);
console.log(`- ${sampleData.modules.length} modules`);
console.log(`- ${sampleData.purchases.length} purchases`);
console.log(`- Total revenue: $${sampleData.purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`);
console.log(`Sample data saved to: ${dataPath}`);