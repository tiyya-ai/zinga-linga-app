import { User, Purchase, Module } from '../types';

export interface Notification {
  id: string;
  type: 'purchase' | 'user_registration' | 'system' | 'payment_failed' | 'refund';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  purchaseId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'purchase_confirmation' | 'admin_alert' | 'payment_failed' | 'welcome';
  timestamp: string;
  sent: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private emailQueue: EmailNotification[] = [];
  private adminEmail = 'admin@zingalinga.com';
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.loadNotifications();
  }

  // Load notifications from localStorage
  private loadNotifications() {
    try {
      const stored = localStorage.getItem('zinga_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('zinga_notifications', JSON.stringify(this.notifications));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Add listener for real-time updates
  addListener(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback: (notifications: Notification[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Generate unique ID
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create notification
  createNotification(
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    userId?: string,
    purchaseId?: string,
    data?: any
  ): Notification {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority,
      userId,
      purchaseId,
      data
    };

    this.notifications.unshift(notification);
    this.saveNotifications();

    // Show browser notification if supported
    this.showBrowserNotification(notification);

    return notification;
  }

  // Handle new purchase notification
  onPurchaseCreated(purchase: Purchase, user: User, modules: Module[]) {
    const moduleNames = modules
      .filter(m => purchase.moduleIds.includes(m.id))
      .map(m => m.title)
      .join(', ');

    // Create admin notification
    const adminNotification = this.createNotification(
      'purchase',
      '🛒 New Purchase!',
      `${user.name} purchased ${moduleNames} for $${purchase.amount.toFixed(2)}`,
      'high',
      user.id,
      purchase.id,
      { purchase, user, modules: moduleNames }
    );

    // Send email to admin
    this.sendEmailNotification({
      to: this.adminEmail,
      subject: `🛒 New Purchase Alert - $${purchase.amount.toFixed(2)}`,
      body: this.generatePurchaseEmailBody(purchase, user, moduleNames),
      type: 'admin_alert',
      timestamp: new Date().toISOString(),
      sent: false
    });

    // Send confirmation email to customer
    this.sendEmailNotification({
      to: user.email,
      subject: `✅ Purchase Confirmation - Zinga Linga Trae`,
      body: this.generateCustomerConfirmationEmail(purchase, user, moduleNames),
      type: 'purchase_confirmation',
      timestamp: new Date().toISOString(),
      sent: false
    });

    console.log('📧 Purchase notifications sent:', {
      adminNotification,
      adminEmail: this.adminEmail,
      customerEmail: user.email
    });
  }

  // Handle new user registration
  onUserRegistered(user: User) {
    const notification = this.createNotification(
      'user_registration',
      '👤 New User Registered',
      `${user.name} (${user.email}) just joined the platform`,
      'medium',
      user.id,
      undefined,
      { user }
    );

    // Send welcome email to user
    this.sendEmailNotification({
      to: user.email,
      subject: `🎉 Welcome to Zinga Linga Trae!`,
      body: this.generateWelcomeEmail(user),
      type: 'welcome',
      timestamp: new Date().toISOString(),
      sent: false
    });

    // Notify admin
    this.sendEmailNotification({
      to: this.adminEmail,
      subject: `👤 New User Registration - ${user.name}`,
      body: `A new user has registered:\n\nName: ${user.name}\nEmail: ${user.email}\nJoined: ${new Date().toLocaleString()}`,
      type: 'admin_alert',
      timestamp: new Date().toISOString(),
      sent: false
    });
  }

  // Handle payment failures
  onPaymentFailed(purchase: Purchase, user: User, error: string) {
    this.createNotification(
      'payment_failed',
      '❌ Payment Failed',
      `Payment failed for ${user.name}: ${error}`,
      'urgent',
      user.id,
      purchase.id,
      { purchase, user, error }
    );

    // Send email to admin
    this.sendEmailNotification({
      to: this.adminEmail,
      subject: `❌ Payment Failed Alert`,
      body: `Payment failed for user ${user.name} (${user.email})\n\nAmount: $${purchase.amount}\nError: ${error}\nTime: ${new Date().toLocaleString()}`,
      type: 'payment_failed',
      timestamp: new Date().toISOString(),
      sent: false
    });
  }

  // Send email notification (simulated)
  private async sendEmailNotification(email: EmailNotification) {
    this.emailQueue.push(email);
    
    // Simulate email sending
    setTimeout(() => {
      email.sent = true;
      console.log('📧 Email sent:', {
        to: email.to,
        subject: email.subject,
        type: email.type,
        timestamp: email.timestamp
      });
      
      // In a real app, you would integrate with:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer
      // etc.
    }, 1000);
  }

  // Generate purchase email body for admin
  private generatePurchaseEmailBody(purchase: Purchase, user: User, moduleNames: string): string {
    return `
🛒 NEW PURCHASE ALERT

Customer Details:
• Name: ${user.name}
• Email: ${user.email}
• User ID: ${user.id}

Purchase Details:
• Order ID: ${purchase.id}
• Amount: $${purchase.amount.toFixed(2)}
• Modules: ${moduleNames}
• Payment Method: ${purchase.paymentMethod}
• Status: ${purchase.status}
• Date: ${new Date(purchase.createdAt).toLocaleString()}

Customer Profile:
• Total Spent: $${(user.totalSpent || 0).toFixed(2)}
• Modules Owned: ${user.purchasedModules?.length || 0}
• Member Since: ${new Date(user.createdAt).toLocaleDateString()}

---
Zinga Linga Trae Admin System
    `.trim();
  }

  // Generate customer confirmation email
  private generateCustomerConfirmationEmail(purchase: Purchase, user: User, moduleNames: string): string {
    return `
Hi ${user.name}! 🎉

Thank you for your purchase! Your order has been confirmed.

📦 ORDER DETAILS
• Order ID: ${purchase.id}
• Amount: $${purchase.amount.toFixed(2)}
• Modules: ${moduleNames}
• Date: ${new Date(purchase.createdAt).toLocaleString()}

🎯 WHAT'S NEXT?
Your learning modules are now available in your dashboard. Start exploring with Kiki and Tano!

🔗 Access Your Content:
Log in to your account to start learning immediately.

Need help? Contact our support team anytime.

Happy Learning!
The Zinga Linga Trae Team 🦁🐘
    `.trim();
  }

  // Generate welcome email
  private generateWelcomeEmail(user: User): string {
    return `
Welcome to Zinga Linga Trae, ${user.name}! 🎉

We're excited to have you join our learning adventure with Kiki and Tano!

🌟 GET STARTED:
• Explore our African alphabet adventures
• Try our free demo content
• Browse learning modules for ages 1-6

🎯 WHAT'S AVAILABLE:
• Interactive games and activities
• Audio narration and songs
• Colorful animations
• Cultural stories from Africa

Ready to start learning? Log in to your account and begin the adventure!

Welcome aboard!
The Zinga Linga Trae Team 🦁🐘
    `.trim();
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/zinga linga logo.png',
        badge: '/zinga linga logo.png'
      });
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Delete notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  // Clear all notifications
  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }

  // Get email queue
  getEmailQueue(): EmailNotification[] {
    return this.emailQueue;
  }

  // Get notification stats
  getStats() {
    const total = this.notifications.length;
    const unread = this.getUnreadNotifications().length;
    const byType = this.notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      read: total - unread,
      byType,
      recentActivity: this.notifications.slice(0, 5)
    };
  }
}

export const notificationService = new NotificationService();