import { dataStore } from './dataStore';
import { realDataGenerator } from './realDataGenerator';

export const initializeRealData = () => {
  // Check if we already have real data
  const existingData = dataStore.loadData();
  
  // If we have more than just the admin user and some modules, assume we have real data
  if (existingData.users.length > 4 && existingData.modules.length > 3) {
    console.log('Real data already exists, skipping initialization');
    return existingData;
  }

  console.log('Initializing with realistic data...');

  // Generate a complete realistic dataset
  const realisticData = realDataGenerator.generateCompleteDataset(75, 15); // 75 users, 15 modules

  // Save the realistic data
  dataStore.saveData(realisticData);

  console.log('Realistic data initialized successfully!');
  console.log(`Generated ${realisticData.users.length} users`);
  console.log(`Generated ${realisticData.modules.length} modules`);
  console.log(`Generated ${realisticData.purchases.length} purchases`);
  console.log(`Total revenue: $${realisticData.analytics.totalRevenue.toFixed(2)}`);

  return realisticData;
};

// Function to reset and regenerate all data
export const regenerateAllData = () => {
  console.log('Regenerating all data with fresh realistic data...');
  
  // Clear existing data
  dataStore.clearData();
  
  // Generate new realistic data
  const newData = realDataGenerator.generateCompleteDataset(100, 20); // Even more data
  
  // Save the new data
  dataStore.saveData(newData);
  
  console.log('All data regenerated successfully!');
  console.log(`Generated ${newData.users.length} users`);
  console.log(`Generated ${newData.modules.length} modules`);
  console.log(`Generated ${newData.purchases.length} purchases`);
  console.log(`Total revenue: $${newData.analytics.totalRevenue.toFixed(2)}`);
  
  return newData;
};

// Function to add more users gradually (simulate growth)
export const addMoreUsers = (count = 10) => {
  const existingData = dataStore.loadData();
  const newUsers = [];
  
  for (let i = 0; i < count; i++) {
    newUsers.push(realDataGenerator.generateUser());
  }
  
  // Generate some purchases for new users
  const { users: updatedUsers, purchases: newPurchases } = realDataGenerator.generateRealisticPurchases(
    newUsers, 
    existingData.modules
  );
  
  const updatedData = {
    ...existingData,
    users: [...existingData.users, ...updatedUsers],
    purchases: [...existingData.purchases, ...newPurchases]
  };
  
  // Regenerate analytics
  updatedData.analytics = dataStore.generateAnalytics(
    updatedData.users,
    updatedData.modules,
    updatedData.purchases
  );
  
  dataStore.saveData(updatedData);
  
  console.log(`Added ${count} new users with realistic purchase behavior`);
  return updatedData;
};

// Function to simulate daily activity (new users, purchases)
export const simulateDailyActivity = () => {
  const existingData = dataStore.loadData();
  
  // Add 1-3 new users
  const newUserCount = Math.floor(Math.random() * 3) + 1;
  const newUsers = [];
  
  for (let i = 0; i < newUserCount; i++) {
    newUsers.push(realDataGenerator.generateUser());
  }
  
  // Generate some new purchases from existing users
  const existingUsers = existingData.users.filter(u => u.role === 'user');
  const newPurchases = [];
  
  // 10% of existing users might make a new purchase
  existingUsers.forEach(user => {
    if (Math.random() < 0.1) {
      const availableModules = existingData.modules.filter(
        m => !user.purchasedModules.includes(m.id)
      );
      
      if (availableModules.length > 0) {
        const moduleCount = Math.random() < 0.3 ? 2 : 1;
        const selectedModules = availableModules
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(moduleCount, availableModules.length));
        
        const purchase = realDataGenerator.generatePurchase(
          user.id,
          selectedModules.map(m => m.id),
          existingData.modules
        );
        
        newPurchases.push(purchase);
        
        // Update user if purchase completed
        if (purchase.status === 'completed') {
          user.purchasedModules.push(...selectedModules.map(m => m.id));
          user.totalSpent = (user.totalSpent || 0) + purchase.amount;
        }
      }
    }
  });
  
  // Generate purchases for new users
  const { users: updatedNewUsers, purchases: newUserPurchases } = realDataGenerator.generateRealisticPurchases(
    newUsers,
    existingData.modules
  );
  
  const updatedData = {
    ...existingData,
    users: [...existingData.users, ...updatedNewUsers],
    purchases: [...existingData.purchases, ...newPurchases, ...newUserPurchases]
  };
  
  // Regenerate analytics
  updatedData.analytics = dataStore.generateAnalytics(
    updatedData.users,
    updatedData.modules,
    updatedData.purchases
  );
  
  dataStore.saveData(updatedData);
  
  console.log(`Daily activity simulated: ${newUserCount} new users, ${newPurchases.length + newUserPurchases.length} new purchases`);
  return updatedData;
};