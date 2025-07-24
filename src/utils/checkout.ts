import { User, Module, Purchase, PaymentInfo, Cart } from '../types';
import { dataStore } from './dataStore';
import { notificationService } from './notificationService';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  name: string;
  icon: string;
  enabled: boolean;
}

export interface PaymentValidation {
  valid: boolean;
  errors: { [key: string]: string };
}

export interface CheckoutSession {
  id: string;
  userId: string;
  cart: Cart;
  paymentMethod?: PaymentMethod;
  paymentInfo?: PaymentInfo;
  discountCode?: string;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

class CheckoutManager {
  private sessionKey = 'zinga-linga-checkout';
  private discountCodesKey = 'zinga-linga-discount-codes';
  private sessionDuration = 30 * 60 * 1000; // 30 minutes

  // Payment methods available
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      type: 'credit_card',
      name: 'Credit/Debit Card',
      icon: '💳',
      enabled: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      enabled: true
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      name: 'Apple Pay',
      icon: '🍎',
      enabled: true
    },
    {
      id: 'google_pay',
      type: 'google_pay',
      name: 'Google Pay',
      icon: '🔵',
      enabled: true
    }
  ];

  // Default discount codes
  private defaultDiscountCodes: DiscountCode[] = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minAmount: 5,
      maxDiscount: 5,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      usageLimit: 100,
      usedCount: 0,
      active: true
    },
    {
      code: 'SAVE5',
      type: 'fixed',
      value: 5,
      minAmount: 15,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      usageLimit: 50,
      usedCount: 0,
      active: true
    },
    {
      code: 'FAMILY20',
      type: 'percentage',
      value: 20,
      minAmount: 20,
      maxDiscount: 10,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      usageLimit: 25,
      usedCount: 0,
      active: true
    }
  ];

  constructor() {
    this.initializeDiscountCodes();
  }

  // Initialize discount codes if they don't exist
  private initializeDiscountCodes(): void {
    try {
      const existing = localStorage.getItem(this.discountCodesKey);
      if (!existing) {
        localStorage.setItem(this.discountCodesKey, JSON.stringify(this.defaultDiscountCodes));
      }
    } catch (error) {
      console.error('Error initializing discount codes:', error);
    }
  }

  // Get available payment methods
  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods.filter(method => method.enabled);
  }

  // Create checkout session
  createCheckoutSession(userId: string, cart: Cart): CheckoutSession {
    const session: CheckoutSession = {
      id: this.generateSessionId(),
      userId,
      cart,
      discountAmount: 0,
      taxAmount: this.calculateTax(cart.total),
      totalAmount: cart.total + this.calculateTax(cart.total),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.sessionDuration).toISOString(),
      status: 'pending'
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  }

  // Get current checkout session
  getCurrentSession(): CheckoutSession | null {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const session: CheckoutSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > new Date(session.expiresAt).getTime()) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting checkout session:', error);
      return null;
    }
  }

  // Update checkout session
  updateSession(updates: Partial<CheckoutSession>): CheckoutSession | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    const updatedSession = { ...session, ...updates };
    localStorage.setItem(this.sessionKey, JSON.stringify(updatedSession));
    return updatedSession;
  }

  // Clear checkout session
  clearSession(): void {
    localStorage.removeItem(this.sessionKey);
  }

  // Calculate tax (8.5% for demo)
  private calculateTax(amount: number): number {
    return Math.round(amount * 0.085 * 100) / 100;
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'checkout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate credit card number (Luhn algorithm)
  private validateCreditCard(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(num)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Validate expiry date
  private validateExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/').map(s => parseInt(s.trim()));
    if (!month || !year) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
  }

  // Validate CVV
  private validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Validate payment information
  validatePaymentInfo(paymentInfo: PaymentInfo): PaymentValidation {
    const errors: { [key: string]: string } = {};

    // Validate card number
    if (!paymentInfo.cardNumber || !this.validateCreditCard(paymentInfo.cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    // Validate expiry date
    if (!paymentInfo.expiryDate || !this.validateExpiryDate(paymentInfo.expiryDate)) {
      errors.expiryDate = 'Invalid expiry date';
    }

    // Validate CVV
    if (!paymentInfo.cvv || !this.validateCVV(paymentInfo.cvv)) {
      errors.cvv = 'Invalid CVV';
    }

    // Validate cardholder name
    if (!paymentInfo.cardholderName || paymentInfo.cardholderName.trim().length < 2) {
      errors.cardholderName = 'Cardholder name is required';
    }

    // Validate billing address
    if (!paymentInfo.billingAddress.street || paymentInfo.billingAddress.street.trim().length < 5) {
      errors.street = 'Street address is required';
    }

    if (!paymentInfo.billingAddress.city || paymentInfo.billingAddress.city.trim().length < 2) {
      errors.city = 'City is required';
    }

    if (!paymentInfo.billingAddress.state || paymentInfo.billingAddress.state.trim().length < 2) {
      errors.state = 'State is required';
    }

    if (!paymentInfo.billingAddress.zipCode || !/^\d{5}(-\d{4})?$/.test(paymentInfo.billingAddress.zipCode)) {
      errors.zipCode = 'Valid ZIP code is required';
    }

    if (!paymentInfo.billingAddress.country || paymentInfo.billingAddress.country.trim().length < 2) {
      errors.country = 'Country is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Apply discount code
  applyDiscountCode(code: string, cartTotal: number): { success: boolean; discount: number; message: string } {
    try {
      const discountCodesData = localStorage.getItem(this.discountCodesKey);
      if (!discountCodesData) {
        return { success: false, discount: 0, message: 'Invalid discount code' };
      }

      const discountCodes: DiscountCode[] = JSON.parse(discountCodesData);
      const discountCode = discountCodes.find(dc => dc.code.toLowerCase() === code.toLowerCase());

      if (!discountCode) {
        return { success: false, discount: 0, message: 'Invalid discount code' };
      }

      if (!discountCode.active) {
        return { success: false, discount: 0, message: 'This discount code is no longer active' };
      }

      if (discountCode.expiresAt && new Date() > new Date(discountCode.expiresAt)) {
        return { success: false, discount: 0, message: 'This discount code has expired' };
      }

      if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
        return { success: false, discount: 0, message: 'This discount code has reached its usage limit' };
      }

      if (discountCode.minAmount && cartTotal < discountCode.minAmount) {
        return { 
          success: false, 
          discount: 0, 
          message: `Minimum order amount of $${discountCode.minAmount} required for this discount` 
        };
      }

      let discount = 0;
      if (discountCode.type === 'percentage') {
        discount = (cartTotal * discountCode.value) / 100;
        if (discountCode.maxDiscount && discount > discountCode.maxDiscount) {
          discount = discountCode.maxDiscount;
        }
      } else {
        discount = discountCode.value;
      }

      // Ensure discount doesn't exceed cart total
      discount = Math.min(discount, cartTotal);

      return { 
        success: true, 
        discount: Math.round(discount * 100) / 100, 
        message: `Discount applied: $${discount.toFixed(2)} off` 
      };
    } catch (error) {
      console.error('Error applying discount code:', error);
      return { success: false, discount: 0, message: 'Error applying discount code' };
    }
  }

  // Use discount code (increment usage count)
  private useDiscountCode(code: string): void {
    try {
      const discountCodesData = localStorage.getItem(this.discountCodesKey);
      if (!discountCodesData) return;

      const discountCodes: DiscountCode[] = JSON.parse(discountCodesData);
      const updatedCodes = discountCodes.map(dc => 
        dc.code.toLowerCase() === code.toLowerCase() 
          ? { ...dc, usedCount: dc.usedCount + 1 }
          : dc
      );

      localStorage.setItem(this.discountCodesKey, JSON.stringify(updatedCodes));
    } catch (error) {
      console.error('Error using discount code:', error);
    }
  }

  // Process payment (simulated)
  async processPayment(session: CheckoutSession, paymentInfo: PaymentInfo): Promise<{ success: boolean; purchase?: Purchase; message: string }> {
    try {
      // Validate payment info
      const validation = this.validatePaymentInfo(paymentInfo);
      if (!validation.valid) {
        return { 
          success: false, 
          message: 'Payment validation failed: ' + Object.values(validation.errors).join(', ')
        };
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (90% success rate for demo)
      const paymentSuccess = Math.random() > 0.1;
      
      if (!paymentSuccess) {
        return { 
          success: false, 
          message: 'Payment failed. Please check your payment information and try again.' 
        };
      }

      // Create purchase record
      const purchase: Purchase = {
        id: this.generatePurchaseId(),
        userId: session.userId,
        moduleIds: session.cart.items.filter(item => item.type === 'module').map(item => item.id),
        bundleId: session.cart.items.find(item => item.type === 'bundle')?.id,
        amount: session.totalAmount,
        paymentMethod: session.paymentMethod?.name || 'Credit Card',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      // Save purchase to data store
      const data = dataStore.loadData();
      const updatedPurchases = [...data.purchases, purchase];
      
      // Update user's purchased modules and total spent
      const updatedUsers = data.users.map(user => {
        if (user.id === session.userId) {
          const newPurchasedModules = [...new Set([...user.purchasedModules, ...purchase.moduleIds])];
          return {
            ...user,
            purchasedModules: newPurchasedModules,
            totalSpent: (user.totalSpent || 0) + purchase.amount
          };
        }
        return user;
      });

      dataStore.saveData({ ...data, purchases: updatedPurchases, users: updatedUsers });

      // Get user and modules for notifications
      const user = updatedUsers.find(u => u.id === session.userId);
      const purchasedModules = data.modules.filter(m => purchase.moduleIds.includes(m.id));

      // Trigger notifications and emails
      if (user) {
        notificationService.onPurchaseCreated(purchase, user, purchasedModules);
      }

      // Use discount code if applied
      if (session.discountCode) {
        this.useDiscountCode(session.discountCode);
      }

      // Clear checkout session
      this.clearSession();

      return { 
        success: true, 
        purchase, 
        message: 'Payment processed successfully!' 
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { 
        success: false, 
        message: 'An error occurred while processing your payment. Please try again.' 
      };
    }
  }

  // Generate purchase ID
  private generatePurchaseId(): string {
    return 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get discount codes (admin function)
  getDiscountCodes(): DiscountCode[] {
    try {
      const discountCodesData = localStorage.getItem(this.discountCodesKey);
      return discountCodesData ? JSON.parse(discountCodesData) : [];
    } catch (error) {
      console.error('Error getting discount codes:', error);
      return [];
    }
  }

  // Create discount code (admin function)
  createDiscountCode(discountCode: Omit<DiscountCode, 'usedCount'>): { success: boolean; message: string } {
    try {
      const discountCodes = this.getDiscountCodes();
      
      // Check if code already exists
      if (discountCodes.some(dc => dc.code.toLowerCase() === discountCode.code.toLowerCase())) {
        return { success: false, message: 'Discount code already exists' };
      }

      const newDiscountCode: DiscountCode = {
        ...discountCode,
        usedCount: 0
      };

      discountCodes.push(newDiscountCode);
      localStorage.setItem(this.discountCodesKey, JSON.stringify(discountCodes));

      return { success: true, message: 'Discount code created successfully' };
    } catch (error) {
      console.error('Error creating discount code:', error);
      return { success: false, message: 'Error creating discount code' };
    }
  }

  // Update discount code (admin function)
  updateDiscountCode(code: string, updates: Partial<DiscountCode>): { success: boolean; message: string } {
    try {
      const discountCodes = this.getDiscountCodes();
      const updatedCodes = discountCodes.map(dc => 
        dc.code.toLowerCase() === code.toLowerCase() 
          ? { ...dc, ...updates }
          : dc
      );

      localStorage.setItem(this.discountCodesKey, JSON.stringify(updatedCodes));
      return { success: true, message: 'Discount code updated successfully' };
    } catch (error) {
      console.error('Error updating discount code:', error);
      return { success: false, message: 'Error updating discount code' };
    }
  }

  // Delete discount code (admin function)
  deleteDiscountCode(code: string): { success: boolean; message: string } {
    try {
      const discountCodes = this.getDiscountCodes();
      const filteredCodes = discountCodes.filter(dc => dc.code.toLowerCase() !== code.toLowerCase());

      localStorage.setItem(this.discountCodesKey, JSON.stringify(filteredCodes));
      return { success: true, message: 'Discount code deleted successfully' };
    } catch (error) {
      console.error('Error deleting discount code:', error);
      return { success: false, message: 'Error deleting discount code' };
    }
  }
}

export const checkoutManager = new CheckoutManager();