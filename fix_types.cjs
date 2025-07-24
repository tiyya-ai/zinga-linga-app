const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'types', 'index.ts');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Replace the User interface
const oldUserInterface = `export interface User {
  id: string;
  email: string;
  name: string;
  purchasedModules: string[];
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  totalSpent?: number;
}`;

const newUserInterface = `export interface User {
  id: string;
  email: string;
  name: string;
  purchasedModules: string[];
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  totalSpent?: number;
  isEmailVerified?: boolean;
  subscriptionStatus?: string;
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
  profile?: {
    childAge?: number | null;
    childName?: string;
    parentName?: string;
  };
  updatedAt?: string;
}`;

content = content.replace(oldUserInterface, newUserInterface);

// Also update Purchase interface to include more fields
const oldPurchaseInterface = `export interface Purchase {
  id: string;
  userId: string;
  moduleIds: string[];
  bundleId?: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}`;

const newPurchaseInterface = `export interface Purchase {
  id: string;
  userId: string;
  moduleIds: string[];
  bundleId?: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
  paymentIntentId?: string;
  metadata?: {
    userAgent?: string;
    timestamp?: number;
  };
}`;

content = content.replace(oldPurchaseInterface, newPurchaseInterface);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Types updated successfully!');