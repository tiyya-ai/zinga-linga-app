import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  Bell, 
  CreditCard, 
  Gift, 
  Save, 
  TestTube, 
  Globe, 
  Shield, 
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Percent,
  Users,
  BarChart3,
  TrendingUp,
  Tag,
  Send,
  Phone,
  MapPin,
  Lock,
  Unlock,
  Star,
  Smartphone,
  Wallet,
  Building,
  Banknote,
  QrCode,
  Coins
} from 'lucide-react';
import { EmailNotificationSettings } from './EmailNotificationSettings';
import { CouponManagement } from './CouponManagement';
import { checkoutManager, PaymentMethod } from '../utils/checkout';
import { notificationService } from '../utils/notificationService';

interface PaymentMethodConfig extends PaymentMethod {
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  testMode?: boolean;
  fees?: {
    percentage: number;
    fixed: number;
  };
}

interface AdminSettingsProps {
  user: any;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'coupons' | 'payments' | 'notifications' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodConfig | null>(null);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Zinga Linga Trae',
    adminEmail: 'admin@zingalinga.com',
    supportEmail: 'support@zingalinga.com',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    autoApproveUsers: true
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

  const loadPaymentMethods = () => {
    const defaultMethods: PaymentMethodConfig[] = [
      {
        id: 'stripe',
        type: 'credit_card',
        name: 'Stripe',
        icon: '💳',
        enabled: true,
        apiKey: '',
        secretKey: '',
        testMode: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'paypal',
        type: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        enabled: true,
        apiKey: '',
        secretKey: '',
        testMode: true,
        fees: { percentage: 3.49, fixed: 0.49 }
      },
      {
        id: 'apple_pay',
        type: 'apple_pay',
        name: 'Apple Pay',
        icon: '🍎',
        enabled: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'google_pay',
        type: 'google_pay',
        name: 'Google Pay',
        icon: '🔵',
        enabled: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'venmo',
        type: 'paypal',
        name: 'Venmo',
        icon: '💙',
        enabled: false,
        fees: { percentage: 1.9, fixed: 0.10 }
      },
      {
        id: 'cashapp',
        type: 'paypal',
        name: 'Cash App',
        icon: '💚',
        enabled: false,
        fees: { percentage: 2.75, fixed: 0.00 }
      },
      {
        id: 'zelle',
        type: 'paypal',
        name: 'Zelle',
        icon: '⚡',
        enabled: false,
        fees: { percentage: 0, fixed: 0.00 }
      },
      {
        id: 'crypto',
        type: 'paypal',
        name: 'Cryptocurrency',
        icon: '₿',
        enabled: false,
        fees: { percentage: 1.5, fixed: 0.00 }
      },
      {
        id: 'bank_transfer',
        type: 'paypal',
        name: 'Bank Transfer',
        icon: '🏦',
        enabled: false,
        fees: { percentage: 0.8, fixed: 0.25 }
      }
    ];

    try {
      const stored = localStorage.getItem('zinga_payment_methods');
      if (stored) {
        setPaymentMethods(JSON.parse(stored));
      } else {
        setPaymentMethods(defaultMethods);
        localStorage.setItem('zinga_payment_methods', JSON.stringify(defaultMethods));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods(defaultMethods);
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
      const testData = {
        purchase: {
          id: 'test_123',
          amount: 24.99,
          customerName: 'Test Customer',
          customerEmail: 'test@example.com'
        }
      };

      switch (type) {
        case 'email':
          alert('📧 Test email sent! Check your inbox.');
          break;
        case 'sms':
          alert('📱 Test SMS sent to configured number.');
          break;
        case 'push':
          alert('🔔 Test push notification sent.');
          break;
        case 'slack':
          alert('💬 Test Slack message sent to configured channel.');
          break;
      }
    } catch (error) {
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
          <h2 className="text-3xl font-mali font-bold text-gray-800">Admin Settings</h2>
          <p className="font-mali text-gray-600">Configure your application settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green/90 transition-colors font-mali font-bold disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save All Settings
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-mali font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white border-b-2 border-brand-blue'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
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
            <EmailNotificationSettings />
          )}

          {/* Coupon Management */}
          {activeTab === 'coupons' && (
            <CouponManagement />
          )}

          {/* Payment Methods */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-mali font-bold text-gray-800">Payment Methods</h3>
                  <p className="font-mali text-gray-600">Configure available payment options for customers</p>
                </div>
                <button
                  onClick={() => setShowAddPaymentModal(true)}
                  className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h3 className="text-xl font-mali font-bold text-gray-800">Notification Settings</h3>

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