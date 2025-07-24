import { User, Module, Purchase } from '../types';

// Real database configuration
const DATABASE_CONFIG = {
  // You can replace this with your actual database URL
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  // For now, we'll use localStorage as a persistent store, but this can be replaced with:
  // - Firebase Firestore
  // - Supabase
  // - MongoDB
  // - PostgreSQL
  // - Any other real database
};

class RealDatabase {
  private apiUrl: string;

  constructor() {
    this.apiUrl = DATABASE_CONFIG.apiUrl;
  }

  // Real user registration (when someone actually signs up)
  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll store in localStorage but structure it like a real DB
      
      const newUser: User = {
        id: this.generateRealId(),
        email: userData.email.toLowerCase(),
        name: userData.name,
        role: 'user',
        purchasedModules: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalSpent: 0,
        // Additional real user fields
        isEmailVerified: false,
        subscriptionStatus: 'free',
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'light'
        },
        profile: {
          childAge: null,
          childName: '',
          parentName: userData.name
        }
      };

      // Store in real database (localStorage for now, but easily replaceable)
      await this.saveUserToDatabase(newUser);
      
      console.log('New user registered:', newUser.email);
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Failed to register user');
    }
  }

  // Get all real users from database
  async getAllUsers(): Promise<User[]> {
    try {
      // In production, this would be: fetch(`${this.apiUrl}/users`)
      const users = this.getUsersFromDatabase();
      console.log(`Retrieved ${users.length} real users from database`);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Get user by email (for login)
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        await this.updateUser(user);
      }
      
      return user || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  // Update user data
  async updateUser(userData: User): Promise<User> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userData.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...userData, updatedAt: new Date().toISOString() };
        await this.saveUsersToDatabase(users);
        console.log('User updated:', userData.email);
        return users[userIndex];
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Record a real purchase
  async recordPurchase(purchase: {
    userId: string;
    moduleIds: string[];
    amount: number;
    paymentMethod: string;
    paymentIntentId?: string; // From Stripe or other payment processor
  }): Promise<Purchase> {
    try {
      const newPurchase: Purchase = {
        id: this.generateRealId(),
        userId: purchase.userId,
        moduleIds: purchase.moduleIds,
        amount: purchase.amount,
        status: 'pending', // Will be updated when payment confirms
        paymentMethod: purchase.paymentMethod,
        createdAt: new Date().toISOString(),
        paymentIntentId: purchase.paymentIntentId,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }
      };

      // Save to database
      await this.savePurchaseToDatabase(newPurchase);
      
      console.log('Purchase recorded:', newPurchase.id);
      return newPurchase;
    } catch (error) {
      console.error('Error recording purchase:', error);
      throw error;
    }
  }

  // Confirm payment (called by webhook from payment processor)
  async confirmPayment(purchaseId: string): Promise<void> {
    try {
      const purchases = await this.getAllPurchases();
      const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);
      
      if (purchaseIndex !== -1) {
        purchases[purchaseIndex].status = 'completed';
        purchases[purchaseIndex].completedAt = new Date().toISOString();
        
        // Update user's purchased modules
        const user = await this.getUserById(purchases[purchaseIndex].userId);
        if (user) {
          user.purchasedModules = [
            ...user.purchasedModules,
            ...purchases[purchaseIndex].moduleIds.filter(id => !user.purchasedModules.includes(id))
          ];
          user.totalSpent = (user.totalSpent || 0) + purchases[purchaseIndex].amount;
          await this.updateUser(user);
        }
        
        await this.savePurchasesToDatabase(purchases);
        console.log('Payment confirmed for purchase:', purchaseId);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Get all purchases
  async getAllPurchases(): Promise<Purchase[]> {
    try {
      return this.getPurchasesFromDatabase();
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  // Database storage methods (can be replaced with real DB calls)
  private async saveUserToDatabase(user: User): Promise<void> {
    const users = this.getUsersFromDatabase();
    users.push(user);
    await this.saveUsersToDatabase(users);
  }

  private async saveUsersToDatabase(users: User[]): Promise<void> {
    localStorage.setItem('zinga_real_users', JSON.stringify(users));
  }

  private getUsersFromDatabase(): User[] {
    try {
      const stored = localStorage.getItem('zinga_real_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading users from database:', error);
      return [];
    }
  }

  private async savePurchaseToDatabase(purchase: Purchase): Promise<void> {
    const purchases = this.getPurchasesFromDatabase();
    purchases.push(purchase);
    await this.savePurchasesToDatabase(purchases);
  }

  private async savePurchasesToDatabase(purchases: Purchase[]): Promise<void> {
    localStorage.setItem('zinga_real_purchases', JSON.stringify(purchases));
  }

  private getPurchasesFromDatabase(): Purchase[] {
    try {
      const stored = localStorage.getItem('zinga_real_purchases');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading purchases from database:', error);
      return [];
    }
  }

  // Generate real database-style IDs
  private generateRealId(): string {
    // This mimics how real databases generate IDs
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `${timestamp}_${randomPart}`;
  }

  // Get real analytics from actual user data
  async getRealAnalytics(): Promise<any> {
    try {
      const users = await this.getAllUsers();
      const purchases = await this.getAllPurchases();
      
      const completedPurchases = purchases.filter(p => p.status === 'completed');
      const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
      
      // Real user growth over time
      const userGrowthByMonth = this.calculateUserGrowth(users);
      
      // Real revenue by month
      const revenueByMonth = this.calculateRevenueByMonth(completedPurchases);
      
      return {
        totalUsers: users.length,
        totalRevenue,
        totalPurchases: purchases.length,
        completedPurchases: completedPurchases.length,
        pendingPurchases: purchases.filter(p => p.status === 'pending').length,
        userGrowthByMonth,
        revenueByMonth,
        averageOrderValue: completedPurchases.length > 0 ? totalRevenue / completedPurchases.length : 0,
        conversionRate: users.length > 0 ? (completedPurchases.length / users.length) * 100 : 0
      };
    } catch (error) {
      console.error('Error calculating real analytics:', error);
      return null;
    }
  }

  private calculateUserGrowth(users: User[]): any[] {
    const monthlyData: { [key: string]: number } = {};
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, users: count }));
  }

  private calculateRevenueByMonth(purchases: Purchase[]): any[] {
    const monthlyData: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      const date = new Date(purchase.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + purchase.amount;
    });
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    localStorage.removeItem('zinga_real_users');
    localStorage.removeItem('zinga_real_purchases');
    console.log('All real data cleared');
  }

  // Export data (for backup)
  async exportData(): Promise<string> {
    const users = await this.getAllUsers();
    const purchases = await this.getAllPurchases();
    
    const exportData = {
      users,
      purchases,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import data (for restore)
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) {
        await this.saveUsersToDatabase(data.users);
      }
      
      if (data.purchases) {
        await this.savePurchasesToDatabase(data.purchases);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export const realDatabase = new RealDatabase();

// Helper function to migrate from old fake data to real data structure
export const migrateToRealData = async (): Promise<void> => {
  console.log('Migrating to real data structure...');
  
  // Clear any fake data
  localStorage.removeItem('zinga-linga-data');
  
  // Initialize with empty real data structure
  await realDatabase.clearAllData();
  
  console.log('Migration to real data completed');
};