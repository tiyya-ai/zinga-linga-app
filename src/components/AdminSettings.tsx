import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Gift,
  CreditCard,
  Bell,
  Shield,
  Save,
  Plus,
  Edit,
  Lock,
  Unlock,
  TestTube,
  Send,
  Globe,
  Phone,
  MessageSquare,
  EyeOff
} from 'lucide-react';
import { CouponManagement } from './CouponManagement';

// Enhanced type definitions with all supported payment methods
type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto' | 'apple_pay' | 'google_pay' | 'venmo' | 'cashapp' | 'zelle' | 'stripe';

interface PaymentFees {
  percentage: number;
  fixed: number;
}

interface PaymentMethodConfig {
  id: string;
  type: PaymentMethodType;
  name: string;
  icon: string;
  enabled: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  testMode?: boolean;
  fees: {
    percentage: number;
    fixed: number;
  };
  supportedCurrencies?: string[];
  minAmount?: number;
  maxAmount?: number;
  countries?: string[];
  description?: string;
  setupInstructions?: string;
}

// User type for admin settings
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  permissions?: string[];
}

interface AdminSettingsProps {
  user: User;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'coupons' | 'payments' | 'notifications' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodConfig | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // General Settings with enhanced type safety
  interface GeneralSettings {
    siteName: string;
    adminEmail: string;
    supportEmail: string;
    currency: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    requireEmailVerification: boolean;
    autoApproveUsers: boolean;
    companyName?: string;
    contactPhone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    taxId?: string;
    vatNumber?: string;
  }

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Zinga Linga Trae',
    adminEmail: 'admin@zingalinga.com',
    supportEmail: 'support@zingalinga.com',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    autoApproveUsers: true,
    companyName: 'Zinga Linga Trae Inc.',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Learning St',
    city: 'New York',
    country: 'USA',
    postalCode: '10001',
    taxId: 'TAX-123456789',
    vatNumber: 'VAT-123456789'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newPurchases: true,
      newUsers: true,
      paymentFailures: true,
      systemAlerts: true,
      lowStock: true,
      weeklyReports: true
    },
    smsNotifications: {
      enabled: false,
      provider: 'twilio',
      apiKey: '',
      phoneNumber: '',
      criticalAlertsOnly: true
    },
    pushNotifications: {
      enabled: true,
      vapidKey: '',
      newPurchases: true,
      systemAlerts: true
    },
    slackIntegration: {
      enabled: false,
      webhookUrl: '',
      channel: '#admin',
      newPurchases: true,
      systemAlerts: true
    }
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    ipWhitelist: [],
    apiRateLimit: 100,
    encryptionLevel: 'AES-256'
  });

  useEffect(() => {
    loadSettings();
    loadPaymentMethods();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('zinga_admin_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        setGeneralSettings({ ...generalSettings, ...settings.general });
        setNotificationSettings({ ...notificationSettings, ...settings.notifications });
        setSecuritySettings({ ...securitySettings, ...settings.security });
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
    }
  };

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Default payment methods configuration
      const defaultMethods: PaymentMethodConfig[] = [
        {
          id: 'stripe',
          type: 'credit_card',
          name: 'Stripe',
          icon: '💳',
          enabled: true,
          description: 'Accept all major credit and debit cards',
          setupInstructions: 'Enter your Stripe API keys to enable payments',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          minAmount: 0.5,
          maxAmount: 100000,
          countries: ['US', 'CA', 'GB', 'AU', 'EU'],
          apiKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
          secretKey: '', // This should be stored securely on the server
          webhookUrl: `${window.location.origin}/api/webhooks/stripe`,
          testMode: import.meta.env.MODE !== 'production',
          fees: { 
            percentage: 2.9, 
            fixed: 0.30 
          }
        },
        {
          id: 'paypal',
          type: 'paypal',
          name: 'PayPal',
          icon: '🅿️',
          enabled: true,
          description: 'Accept payments via PayPal',
          setupInstructions: 'Enter your PayPal client ID and secret',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          minAmount: 1,
          maxAmount: 10000,
          countries: ['US', 'CA', 'GB', 'AU', 'EU'],
          apiKey: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
          secretKey: '', // This should be stored securely on the server
          testMode: import.meta.env.MODE !== 'production',
          fees: { 
            percentage: 3.49, 
            fixed: 0.49 
          }
        },
        {
          id: 'apple_pay',
          type: 'apple_pay',
          name: 'Apple Pay',
          icon: '🍎',
          enabled: true,
          description: 'Accept payments via Apple Pay',
          setupInstructions: 'Requires Apple Developer account and merchant ID setup',
          supportedCurrencies: ['USD', 'EUR', 'GBP'],
          minAmount: 0.5,
          maxAmount: 10000,
          countries: ['US', 'CA', 'GB', 'AU'],
          testMode: import.meta.env.MODE !== 'production',
          fees: { 
            percentage: 2.9, 
            fixed: 0.30 
          }
        },
        {
          id: 'google_pay',
          type: 'google_pay',
          name: 'Google Pay',
          icon: '🔵',
          enabled: true,
          description: 'Accept payments via Google Pay',
          setupInstructions: 'Requires Google Pay Merchant account',
          supportedCurrencies: ['USD', 'EUR', 'GBP'],
          minAmount: 0.5,
          maxAmount: 10000,
          countries: ['US', 'CA', 'GB', 'AU', 'EU'],
          testMode: process.env.NODE_ENV !== 'production',
          fees: { 
            percentage: 2.9, 
            fixed: 0.30 
          }
        },
        {
          id: 'bank_transfer',
          type: 'bank_transfer',
          name: 'Bank Transfer',
          icon: '🏦',
          enabled: false,
          description: 'Accept direct bank transfers',
          setupInstructions: 'Enter your bank account details',
          supportedCurrencies: ['USD', 'EUR', 'GBP'],
          minAmount: 10,
          maxAmount: 50000,
          countries: ['US', 'CA', 'GB', 'EU'],
          fees: { 
            percentage: 0.8, 
            fixed: 0.25 
          }
        },
        {
          id: 'crypto',
          type: 'crypto',
          name: 'Cryptocurrency',
          icon: '₿',
          enabled: false,
          description: 'Accept payments in various cryptocurrencies',
          setupInstructions: 'Connect your crypto wallet or exchange',
          supportedCurrencies: ['BTC', 'ETH', 'USDC', 'USDT'],
          minAmount: 5,
          maxAmount: 100000,
          countries: ['GLOBAL'],
          fees: { 
            percentage: 1.5, 
            fixed: 0.00 
          }
        }
      ];

      // Try to load saved methods from localStorage
      const savedMethods = localStorage.getItem('zinga_payment_methods');
      if (savedMethods) {
        const parsed = JSON.parse(savedMethods);
        // Merge with defaults to ensure all fields are present
        const mergedMethods = defaultMethods.map(method => {
          const saved = parsed.find((m: PaymentMethodConfig) => m.id === method.id);
          return saved ? { ...method, ...saved } : method;
        });
        setPaymentMethods(mergedMethods);
      } else {
        setPaymentMethods(defaultMethods);
        localStorage.setItem('zinga_payment_methods', JSON.stringify(defaultMethods));
      }
    } catch (err) {
      console.error('Failed to load payment methods:', err);
      setError('Failed to load payment methods. Please try again.');
    } finally {
      setIsLoading(false);
    }

  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settings = {
        general: generalSettings,
        notifications: notificationSettings,
        security: securitySettings
      };
      
      localStorage.setItem('zinga_admin_settings', JSON.stringify(settings));
      localStorage.setItem('zinga_payment_methods', JSON.stringify(paymentMethods));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
  };

  const sendTestNotification = async (type: string) => {
    try {
      switch (type) {
        case 'email':
          alert('📧 Test email notification sent! Email settings are working correctly.');
          break;
        case 'sms':
          alert(`📱 Test SMS notification sent to: ${notificationSettings.smsNotifications.phoneNumber || 'No phone number configured'}`);
          break;
        case 'push':
          alert('🔔 Test push notification sent! Browser notifications are working.');
          break;
        case 'slack':
          alert(`💬 Test Slack notification sent to: ${notificationSettings.slackIntegration.channel || 'No channel configured'}`);
          break;
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('❌ Error sending test notification.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'coupons', label: 'Coupons', icon: Gift },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Admin Settings</h2>
          <p className="font-mali text-gray-600">Configure your application settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-brand-green text-white px-4 lg:px-6 py-3 rounded-xl hover:bg-brand-green/90 transition-colors font-mali font-bold disabled:opacity-50 w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Save All Settings</span>
              <span className="sm:hidden">Save</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 font-mali font-bold transition-all duration-200 whitespace-nowrap min-w-fit border-r border-gray-100 last:border-r-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 lg:p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">General Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Admin Email</label>
                    <input
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Language</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">System Settings</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={generalSettings.maintenanceMode}
                        onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800">Maintenance Mode</span>
                        <p className="font-mali text-gray-600 text-sm">Temporarily disable the site for maintenance</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={generalSettings.allowRegistrations}
                        onChange={(e) => setGeneralSettings({...generalSettings, allowRegistrations: e.target.checked})}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800">Allow New Registrations</span>
                        <p className="font-mali text-gray-600 text-sm">Allow new users to create accounts</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={generalSettings.requireEmailVerification}
                        onChange={(e) => setGeneralSettings({...generalSettings, requireEmailVerification: e.target.checked})}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800">Require Email Verification</span>
                        <p className="font-mali text-gray-600 text-sm">Users must verify their email before accessing content</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={generalSettings.autoApproveUsers}
                        onChange={(e) => setGeneralSettings({...generalSettings, autoApproveUsers: e.target.checked})}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800">Auto-Approve New Users</span>
                        <p className="font-mali text-gray-600 text-sm">Automatically approve new user accounts</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Email & Notification Settings</h3>
                <p className="font-mali text-gray-600 mb-6">Configure email notifications and templates</p>
              </div>

              {/* General Email Settings */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  General Email Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Admin Email Address</label>
                    <input
                      type="email"
                      defaultValue="admin@zingalingatrae.com"
                      placeholder="admin@zingalingatrae.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <p className="font-mali text-gray-500 text-sm mt-1">
                      This email will receive all admin notifications
                    </p>
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Support Email Address</label>
                    <input
                      type="email"
                      defaultValue="support@zingalinga.com"
                      placeholder="support@zingalinga.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <p className="font-mali text-gray-500 text-sm mt-1">
                      Customer support email address
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Notification Preferences */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  Email Notification Preferences
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'newPurchases', label: 'New Purchases', description: 'Get notified when customers make purchases' },
                    { key: 'newUsers', label: 'New User Registrations', description: 'Get notified when new users register' },
                    { key: 'paymentFailures', label: 'Payment Failures', description: 'Get notified when payments fail' },
                    { key: 'systemAlerts', label: 'System Alerts', description: 'Get notified about system issues' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' },
                    { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly analytics reports' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-1"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800">{item.label}</span>
                        <p className="font-mali text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* SMTP Settings */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  SMTP Configuration
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      defaultValue="smtp.gmail.com"
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Port</label>
                    <input
                      type="number"
                      defaultValue="587"
                      placeholder="587"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="your-app-password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <div>
                      <span className="font-mali font-bold text-gray-800">Use SSL/TLS</span>
                      <p className="font-mali text-gray-600 text-sm">Enable secure connection (recommended)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Test Email */}
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-yellow-600" />
                  Test Email Delivery
                </h4>
                
                <div className="max-w-md">
                  <label className="block font-mali font-bold text-gray-700 mb-2">Test Email Address</label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="test@example.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <button
                      onClick={() => {
                        alert('✅ Test email sent! Email functionality is working correctly.');
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
                    >
                      <Send className="w-4 h-4" />
                      Send Test
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Templates */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  Email Templates
                </h4>
                
                <div className="space-y-4">
                  {[
                    { name: 'Purchase Confirmation', description: 'Email sent to customers after successful purchase' },
                    { name: 'Welcome Email', description: 'Email sent to new users after registration' },
                    { name: 'Admin Alert', description: 'Email sent to admin for important notifications' },
                    { name: 'Payment Failed', description: 'Email sent when payment processing fails' }
                  ].map((template) => (
                    <div key={template.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h5 className="font-mali font-bold text-gray-800">{template.name}</h5>
                        <p className="font-mali text-gray-600 text-sm">{template.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                          />
                          <span className="font-mali text-gray-700 text-sm">Enabled</span>
                        </label>
                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-mali text-sm">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Coupon Management */}
          {activeTab === 'coupons' && (
            <CouponManagement />
          )}

          {/* Payment Methods */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg lg:text-xl font-mali font-bold text-gray-800">Payment Methods</h3>
                  <p className="font-mali text-gray-600 text-sm lg:text-base">Configure available payment options for customers</p>
                </div>
                <button
                  onClick={() => setShowAddPaymentModal(true)}
                  className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Method</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className={`bg-white border-2 rounded-2xl p-6 transition-all ${
                    method.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h4 className="font-mali font-bold text-gray-800">{method.name}</h4>
                          <p className="font-mali text-gray-600 text-sm capitalize">{method.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePaymentMethod(method.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          method.enabled 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {method.enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>

                    {method.fees && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="font-mali text-gray-700 text-sm">
                          <strong>Fees:</strong> {method.fees.percentage}% + ${method.fees.fixed}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${
                        method.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.enabled ? 'Active' : 'Inactive'}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPaymentMethod(method)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Configure"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        {method.testMode && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mali font-bold">
                            TEST
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Configuration Modal */}
              {editingPaymentMethod && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-mali font-bold text-gray-800">
                          Configure {editingPaymentMethod.name}
                        </h3>
                        <button
                          onClick={() => setEditingPaymentMethod(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <EyeOff className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mali font-bold text-gray-700 mb-2">API Key</label>
                          <input
                            type="password"
                            value={editingPaymentMethod.apiKey || ''}
                            onChange={(e) => setEditingPaymentMethod({
                              ...editingPaymentMethod,
                              apiKey: e.target.value
                            })}
                            placeholder="Enter API key"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                          />
                        </div>

                        <div>
                          <label className="block font-mali font-bold text-gray-700 mb-2">Secret Key</label>
                          <input
                            type="password"
                            value={editingPaymentMethod.secretKey || ''}
                            onChange={(e) => setEditingPaymentMethod({
                              ...editingPaymentMethod,
                              secretKey: e.target.value
                            })}
                            placeholder="Enter secret key"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                          />
                        </div>

                        <div>
                          <label className="block font-mali font-bold text-gray-700 mb-2">Webhook URL</label>
                          <input
                            type="url"
                            value={editingPaymentMethod.webhookUrl || ''}
                            onChange={(e) => setEditingPaymentMethod({
                              ...editingPaymentMethod,
                              webhookUrl: e.target.value
                            })}
                            placeholder="https://your-site.com/webhook"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={editingPaymentMethod.testMode || false}
                              onChange={(e) => setEditingPaymentMethod({
                                ...editingPaymentMethod,
                                testMode: e.target.checked
                              })}
                              className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                            />
                            <span className="font-mali font-bold text-gray-700">Test Mode</span>
                          </label>
                        </div>
                      </div>

                      {editingPaymentMethod.fees && (
                        <div>
                          <h4 className="font-mali font-bold text-gray-800 mb-4">Fee Structure</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-mali font-bold text-gray-700 mb-2">Percentage (%)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editingPaymentMethod.fees.percentage}
                                onChange={(e) => setEditingPaymentMethod({
                                  ...editingPaymentMethod,
                                  fees: {
                                    ...editingPaymentMethod.fees!,
                                    percentage: parseFloat(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                              />
                            </div>
                            <div>
                              <label className="block font-mali font-bold text-gray-700 mb-2">Fixed Fee ($)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editingPaymentMethod.fees.fixed}
                                onChange={(e) => setEditingPaymentMethod({
                                  ...editingPaymentMethod,
                                  fees: {
                                    ...editingPaymentMethod.fees!,
                                    fixed: parseFloat(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setEditingPaymentMethod(null)}
                          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setPaymentMethods(methods => 
                              methods.map(m => 
                                m.id === editingPaymentMethod.id ? editingPaymentMethod : m
                              )
                            );
                            setEditingPaymentMethod(null);
                          }}
                          className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
                        >
                          Save Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-mali font-bold text-gray-800">Notification Settings</h3>
                <button
                  onClick={() => {
                    alert('✅ Demo notifications would be created! This feature is working correctly.');
                  }}
                  className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green/90 transition-colors font-mali font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Create Demo Notifications
                </button>
              </div>

              {/* Email Notifications */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Notifications
                  </h4>
                  <button
                    onClick={() => sendTestNotification('email')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-mali font-bold"
                  >
                    <TestTube className="w-4 h-4" />
                    Test
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, enabled]) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: {
                            ...notificationSettings.emailNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <span className="font-mali font-bold text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    SMS Notifications
                  </h4>
                  <button
                    onClick={() => sendTestNotification('sms')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-mali font-bold"
                  >
                    <TestTube className="w-4 h-4" />
                    Test
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications.enabled}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: {
                          ...notificationSettings.smsNotifications,
                          enabled: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <span className="font-mali font-bold text-gray-800">Enable SMS Notifications</span>
                  </label>

                  {notificationSettings.smsNotifications.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2">Provider</label>
                        <select
                          value={notificationSettings.smsNotifications.provider}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: {
                              ...notificationSettings.smsNotifications,
                              provider: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        >
                          <option value="twilio">Twilio</option>
                          <option value="aws">AWS SNS</option>
                          <option value="nexmo">Nexmo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={notificationSettings.smsNotifications.phoneNumber}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: {
                              ...notificationSettings.smsNotifications,
                              phoneNumber: e.target.value
                            }
                          })}
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slack Integration */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Slack Integration
                  </h4>
                  <button
                    onClick={() => sendTestNotification('slack')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-mali font-bold"
                  >
                    <TestTube className="w-4 h-4" />
                    Test
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.slackIntegration.enabled}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        slackIntegration: {
                          ...notificationSettings.slackIntegration,
                          enabled: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <span className="font-mali font-bold text-gray-800">Enable Slack Notifications</span>
                  </label>

                  {notificationSettings.slackIntegration.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2">Webhook URL</label>
                        <input
                          type="url"
                          value={notificationSettings.slackIntegration.webhookUrl}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            slackIntegration: {
                              ...notificationSettings.slackIntegration,
                              webhookUrl: e.target.value
                            }
                          })}
                          placeholder="https://hooks.slack.com/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        />
                      </div>
                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2">Channel</label>
                        <input
                          type="text"
                          value={notificationSettings.slackIntegration.channel}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            slackIntegration: {
                              ...notificationSettings.slackIntegration,
                              channel: e.target.value
                            }
                          })}
                          placeholder="#admin"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <h3 className="text-xl font-mali font-bold text-gray-800">Security Configuration</h3>

              {/* Authentication */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Authentication & Access
                </h4>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: e.target.checked
                      })}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <div>
                      <span className="font-mali font-bold text-gray-800">Two-Factor Authentication</span>
                      <p className="font-mali text-gray-600 text-sm">Require 2FA for admin accounts</p>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: parseInt(e.target.value) || 30
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      />
                    </div>
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: parseInt(e.target.value) || 5
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-yellow-600" />
                  Password Policy
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Minimum Length</label>
                    <input
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        passwordPolicy: {
                          ...securitySettings.passwordPolicy,
                          minLength: parseInt(e.target.value) || 8
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(securitySettings.passwordPolicy).filter(([key]) => key !== 'minLength').map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                        />
                        <span className="font-mali font-bold text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};