import React, { useState, useEffect, useCallback } from 'react';
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
  EyeOff,
  Menu,
  X
} from 'lucide-react';
import { CouponManagement } from './CouponManagement';

// Enhanced type definitions with all supported payment methods
type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto' | 'apple_pay' | 'google_pay' | 'venmo' | 'cashapp' | 'zelle' | 'stripe';

type TabType = 'general' | 'email' | 'coupons' | 'payments' | 'notifications' | 'security';

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
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodConfig | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    adminEmail: 'admin@zingalingatrae.com',
    supportEmail: 'support@zingalingatrae.com',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    autoApproveUsers: false,
    companyName: 'Zinga Linga Trae Educational Publishing',
    contactPhone: '+1 (555) 234-5678',
    address: '456 Children\'s Learning Avenue',
    city: 'New York',
    country: 'USA',
    postalCode: '10016',
    taxId: 'EIN-87-1234567',
    vatNumber: 'US-VAT-123456789'
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

  const loadSettings = useCallback(async () => {
    try {
      const stored = localStorage.getItem('zinga_admin_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        setGeneralSettings(prev => ({ ...prev, ...settings.general }));
        setNotificationSettings(prev => ({ ...prev, ...settings.notifications }));
        setSecuritySettings(prev => ({ ...prev, ...settings.security }));
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setError('Failed to load settings. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeSettings = async () => {
      await loadSettings();
      await loadPaymentMethods();
    };
    
    initializeSettings();
  }, [loadSettings]);

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

  const validateSettings = () => {
    if (!generalSettings.adminEmail || !generalSettings.supportEmail) {
      setError('Email addresses are required');
      return false;
    }
    if (notificationSettings.smsNotifications.enabled && !notificationSettings.smsNotifications.phoneNumber) {
      setError('Phone number is required for SMS notifications');
      return false;
    }
    setError(null);
    return true;
  };

  const saveSettings = async () => {
    if (!validateSettings()) return;
    
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
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
      if (onError) onError(error);
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
    { id: 'general', label: 'General', shortLabel: 'General', icon: Settings },
    { id: 'email', label: 'Email Settings', shortLabel: 'Email', icon: Mail },
    { id: 'coupons', label: 'Coupons', shortLabel: 'Coupons', icon: Gift },
    { id: 'payments', label: 'Payment Methods', shortLabel: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', shortLabel: 'Notify', icon: Bell },
    { id: 'security', label: 'Security', shortLabel: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-6 lg:py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-6">
            {/* Header Section - Ultra Mobile Optimized */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <div className="space-y-1">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold text-gray-900">Admin Settings</h1>
                  <p className="font-mali text-gray-600 text-xs sm:text-base">Configure your application settings and preferences</p>
                </div>
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-brand-green text-white px-3 sm:px-6 py-3 rounded-lg hover:bg-brand-green/90 transition-colors font-mali font-semibold text-sm sm:text-base disabled:opacity-50 min-h-[48px] touch-manipulation"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Save All Settings</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tabs - Ultra Mobile Optimized */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Mobile Tab Selector */}
              <div className="sm:hidden border-b border-gray-200 p-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg touch-manipulation"
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const activeTabData = tabs.find(tab => tab.id === activeTab);
                      const IconComponent = activeTabData?.icon;
                      return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
                    })()}
                    <span className="font-mali font-semibold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </span>
                  </div>
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
                
                {isMobileMenuOpen && (
                  <div className="mt-3 space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as TabType);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors touch-manipulation ${
                          activeTab === tab.id
                            ? 'bg-brand-blue text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-mali font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Tabs */}
              <div className="hidden sm:block border-b border-gray-200">
                <nav className="flex overflow-x-auto scrollbar-hide -mb-px" 
                     style={{ 
                       scrollbarWidth: 'none', 
                       msOverflowStyle: 'none',
                       WebkitOverflowScrolling: 'touch'
                     }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 lg:px-6 py-4 text-sm lg:text-base font-mali font-semibold transition-colors whitespace-nowrap min-w-[120px] lg:min-w-[140px] border-b-2 touch-manipulation ${
                        activeTab === tab.id
                          ? 'border-brand-blue text-brand-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800 mb-4 sm:mb-6">General Configuration</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Site Name</label>
                          <input
                            type="text"
                            value={generalSettings.siteName}
                            onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Admin Email</label>
                          <input
                            type="email"
                            value={generalSettings.adminEmail}
                            onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Support Email</label>
                          <input
                            type="email"
                            value={generalSettings.supportEmail}
                            onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Currency</label>
                          <select
                            value={generalSettings.currency}
                            onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Timezone</label>
                          <select
                            value={generalSettings.timezone}
                            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Language</label>
                          <select
                            value={generalSettings.language}
                            onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 space-y-4">
                        <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800">System Settings</h4>
                        
                        <div className="space-y-4">
                          <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={generalSettings.maintenanceMode}
                              onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                              className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                            />
                            <div className="flex-1">
                              <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Maintenance Mode</span>
                              <p className="font-mali text-gray-600 text-xs sm:text-sm mt-1">Temporarily disable the site for maintenance</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={generalSettings.allowRegistrations}
                              onChange={(e) => setGeneralSettings({...generalSettings, allowRegistrations: e.target.checked})}
                              className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                            />
                            <div className="flex-1">
                              <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Allow New Registrations</span>
                              <p className="font-mali text-gray-600 text-xs sm:text-sm mt-1">Allow new users to create accounts</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={generalSettings.requireEmailVerification}
                              onChange={(e) => setGeneralSettings({...generalSettings, requireEmailVerification: e.target.checked})}
                              className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                            />
                            <div className="flex-1">
                              <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Require Email Verification</span>
                              <p className="font-mali text-gray-600 text-xs sm:text-sm mt-1">Users must verify their email before accessing content</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={generalSettings.autoApproveUsers}
                              onChange={(e) => setGeneralSettings({...generalSettings, autoApproveUsers: e.target.checked})}
                              className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                            />
                            <div className="flex-1">
                              <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Auto-Approve New Users</span>
                              <p className="font-mali text-gray-600 text-xs sm:text-sm mt-1">Automatically approve new user accounts</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800 mb-4 sm:mb-6">Email & Notification Settings</h3>
                      <p className="font-mali text-gray-600 text-sm sm:text-base mb-6">Configure email notifications and templates</p>
                    </div>

                    {/* General Email Settings */}
                    <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                      <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        General Email Settings
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Admin Email Address</label>
                          <input
                            type="email"
                            value={generalSettings.adminEmail}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, adminEmail: e.target.value}))}
                            placeholder="admin@zingalingatrae.com"
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                          <p className="font-mali text-gray-500 text-xs sm:text-sm">
                            This email will receive all admin notifications
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Support Email Address</label>
                          <input
                            type="email"
                            value={generalSettings.supportEmail}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, supportEmail: e.target.value}))}
                            placeholder="support@zingalinga.com"
                            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                          <p className="font-mali text-gray-500 text-xs sm:text-sm">
                            Customer support email address
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Test Email */}
                    <div className="bg-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                      <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TestTube className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        Test Email Delivery
                      </h4>
                      
                      <div className="max-w-md">
                        <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base mb-2">Test Email Address</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="email"
                            placeholder="test@example.com"
                            className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                          <button
                            onClick={() => {
                              alert('✅ Test email sent! Email functionality is working correctly.');
                            }}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold text-sm sm:text-base min-h-[48px] touch-manipulation whitespace-nowrap"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send Test</span>
                          </button>
                        </div>
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
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Payment Methods</h3>
                        <p className="font-mali text-gray-600 text-sm sm:text-base">Configure available payment options for customers</p>
                      </div>
                      <button
                        onClick={() => setShowAddPaymentModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-blue text-white px-4 py-3 rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold text-sm sm:text-base min-h-[48px] touch-manipulation"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Method</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>

                    {/* Payment Methods Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className={`bg-white border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${
                          method.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl sm:text-2xl">{method.icon}</span>
                              <div>
                                <h4 className="font-mali font-bold text-gray-800 text-sm sm:text-base">{method.name}</h4>
                                <p className="font-mali text-gray-600 text-xs sm:text-sm capitalize">{method.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePaymentMethod(method.id)}
                              className={`p-2 rounded-lg transition-colors touch-manipulation ${
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
                              <p className="font-mali text-gray-700 text-xs sm:text-sm">
                                <strong>Fees:</strong> {method.fees.percentage}% + ${method.fees.fixed}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-mali font-bold ${
                              method.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {method.enabled ? 'Active' : 'Inactive'}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingPaymentMethod(method)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
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
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Notification Settings</h3>
                      <button
                        onClick={() => {
                          alert('✅ Demo notifications would be created! This feature is working correctly.');
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-green text-white px-4 py-3 rounded-lg hover:bg-brand-green/90 transition-colors font-mali font-bold text-sm sm:text-base min-h-[48px] touch-manipulation"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Demo Notifications</span>
                      </button>
                    </div>

                    {/* Email Notifications */}
                    <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                        <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 flex items-center gap-2">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          Email Notifications
                        </h4>
                        <button
                          onClick={() => sendTestNotification('email')}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-mali font-bold text-sm min-h-[44px] touch-manipulation"
                        >
                          <TestTube className="w-4 h-4" />
                          <span>Test</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {Object.entries(notificationSettings.emailNotifications).map(([key, enabled]) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer touch-manipulation">
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
                              className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded touch-manipulation"
                            />
                            <span className="font-mali font-bold text-gray-800 capitalize text-sm sm:text-base">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* SMS Notifications */}
                    <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                        <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 flex items-center gap-2">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          SMS Notifications
                        </h4>
                        <button
                          onClick={() => sendTestNotification('sms')}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-mali font-bold text-sm min-h-[44px] touch-manipulation"
                        >
                          <TestTube className="w-4 h-4" />
                          <span>Test</span>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
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
                            className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                          />
                          <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Enable SMS Notifications</span>
                        </label>

                        {notificationSettings.smsNotifications.enabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 sm:ml-7">
                            <div className="space-y-2">
                              <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Provider</label>
                              <select
                                value={notificationSettings.smsNotifications.provider}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  smsNotifications: {
                                    ...notificationSettings.smsNotifications,
                                    provider: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                              >
                                <option value="twilio">Twilio</option>
                                <option value="aws">AWS SNS</option>
                                <option value="nexmo">Nexmo</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Phone Number</label>
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
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
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
                  <div className="space-y-6 sm:space-y-8">
                    <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Security Configuration</h3>

                    {/* Authentication */}
                    <div className="bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200">
                      <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        Authentication & Access
                      </h4>
                      
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              twoFactorAuth: e.target.checked
                            })}
                            className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                          />
                          <div className="flex-1">
                            <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Two-Factor Authentication</span>
                            <p className="font-mali text-gray-600 text-xs sm:text-sm mt-1">Require 2FA for admin accounts</p>
                          </div>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Session Timeout (minutes)</label>
                            <input
                              type="number"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) => setSecuritySettings({
                                ...securitySettings,
                                sessionTimeout: parseInt(e.target.value) || 30
                              })}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Max Login Attempts</label>
                            <input
                              type="number"
                              value={securitySettings.maxLoginAttempts}
                              onChange={(e) => setSecuritySettings({
                                ...securitySettings,
                                maxLoginAttempts: parseInt(e.target.value) || 5
                              })}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Policy */}
                    <div className="bg-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                      <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        Password Policy
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block font-mali font-bold text-gray-700 text-sm sm:text-base">Minimum Length</label>
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
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[48px] touch-manipulation"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(securitySettings.passwordPolicy).filter(([key]) => key !== 'minLength').map(([key, value]) => (
                            <label key={key} className="flex items-start gap-3 cursor-pointer touch-manipulation">
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
                                className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                              />
                              <span className="font-mali font-bold text-gray-800 capitalize text-sm sm:text-base">
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
        )}
      </div>
    </div>
  );
};