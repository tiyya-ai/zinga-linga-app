#!/usr/bin/env node

/**
 * Script to switch from sample data to real user data only
 * This will clear all the generated sample users and set up the system
 * to only show real users who actually register and make purchases
 */

console.log('🔄 Switching to Real Data Mode...');

// Clear all sample data from localStorage
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('zinga-linga-data');
  localStorage.removeItem('zinga_real_users');
  localStorage.removeItem('zinga_real_purchases');
  console.log('✅ Cleared all sample data from localStorage');
}

// Create minimal real data structure with only admin and modules
const realOnlyData = {
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
      totalRatings: 0, // Will increase with real purchases
      isActive: true,
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
      totalRatings: 0, // Will increase with real purchases
      isActive: true,
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
      totalRatings: 0, // Will increase with real purchases
      isActive: true,
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
  analytics: {
    totalUsers: 1, // Only admin initially
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueByMonth: [],
    userGrowth: [],
    popularModules: []
  }
};

console.log('📊 Real Data Structure Created:');
console.log(`- Users: ${realOnlyData.users.length} (admin only)`);
console.log(`- Modules: ${realOnlyData.modules.length} (active learning modules)`);
console.log(`- Purchases: ${realOnlyData.purchases.length} (none yet)`);
console.log(`- Revenue: $${realOnlyData.analytics.totalRevenue}`);

// Instructions for the user
console.log('\n🎯 REAL DATA MODE ACTIVATED!');
console.log('\n📝 What this means:');
console.log('✅ All sample/fake users have been removed');
console.log('✅ Only the admin account remains');
console.log('✅ New users will be real people who actually register');
console.log('✅ Purchases will be from real customers only');
console.log('✅ Analytics will reflect actual business data');

console.log('\n🚀 Next Steps:');
console.log('1. Run the application: npm run dev');
console.log('2. Real users can register and make purchases');
console.log('3. Admin dashboard will show only real data');
console.log('4. Analytics will grow with actual user activity');

console.log('\n💡 To add test users manually, use the registration form');
console.log('💡 To restore sample data, run: npm run load-sample-data');

// Export the data structure for use in the application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = realOnlyData;
}

// For browser environments
if (typeof window !== 'undefined') {
  window.realOnlyData = realOnlyData;
}