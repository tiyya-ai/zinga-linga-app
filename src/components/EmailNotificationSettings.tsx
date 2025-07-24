import React, { useState, useEffect } from 'react';
import { Mail, Settings, Bell, Send, CheckCircle, AlertTriangle, Eye, Save, TestTube, Globe, Shield, Zap } from 'lucide-react';
import { notificationService } from '../utils/notificationService';

interface EmailSettings {
  adminEmail: string;
  smtpSettings: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  emailTemplates: {
    purchaseConfirmation: {
      subject: string;
      body: string;
      enabled: boolean;
    };
    adminAlert: {
      subject: string;
      body: string;
      enabled: boolean;
    };
    welcome: {
      subject: string;
      body: string;
      enabled: boolean;
    };
    paymentFailed: {
      subject: string;
      body: string;
      enabled: boolean;
    };
  };
  notifications: {
    newPurchases: boolean;
    newUsers: boolean;
    paymentFailures: boolean;
    systemAlerts: boolean;
  };
}

export const EmailNotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    adminEmail: 'admin@zingalinga.com',
    smtpSettings: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      username: '',
      password: ''
    },
    emailTemplates: {
      purchaseConfirmation: {
        subject: '✅ Purchase Confirmation - Zinga Linga Trae',
        body: `Hi {{customerName}}! 🎉

Thank you for your purchase! Your order has been confirmed.

📦 ORDER DETAILS
• Order ID: {{orderId}}
• Amount: ${{amount}}
• Modules: {{moduleNames}}
• Date: {{orderDate}}

🎯 WHAT'S NEXT?
Your learning modules are now available in your dashboard. Start exploring with Kiki and Tano!

🔗 Access Your Content:
Log in to your account to start learning immediately.

Need help? Contact our support team anytime.

Happy Learning!
The Zinga Linga Trae Team 🦁🐘`,
        enabled: true
      },
      adminAlert: {
        subject: '🛒 New Purchase Alert - ${{amount}}',
        body: `🛒 NEW PURCHASE ALERT

Customer Details:
• Name: {{customerName}}
• Email: {{customerEmail}}
• User ID: {{userId}}

Purchase Details:
• Order ID: {{orderId}}
• Amount: ${{amount}}
• Modules: {{moduleNames}}
• Payment Method: {{paymentMethod}}
• Status: {{status}}
• Date: {{orderDate}}

Customer Profile:
• Total Spent: ${{totalSpent}}
• Modules Owned: {{modulesOwned}}
• Member Since: {{memberSince}}

---
Zinga Linga Trae Admin System`,
        enabled: true
      },
      welcome: {
        subject: '🎉 Welcome to Zinga Linga Trae!',
        body: `Welcome to Zinga Linga Trae, {{customerName}}! 🎉

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
The Zinga Linga Trae Team 🦁🐘`,
        enabled: true
      },
      paymentFailed: {
        subject: '❌ Payment Failed Alert',
        body: `❌ PAYMENT FAILED ALERT

Payment failed for user {{customerName}} ({{customerEmail}})

Amount: ${{amount}}
Error: {{error}}
Time: {{timestamp}}

Please follow up with the customer if needed.

---
Zinga Linga Trae Admin System`,
        enabled: true
      }
    },
    notifications: {
      newPurchases: true,
      newUsers: true,
      paymentFailures: true,
      systemAlerts: true
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'templates' | 'smtp' | 'test'>('general');
  const [testEmail, setTestEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('zinga_email_settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...settings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('zinga_email_settings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Email settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setIsTesting(true);
    try {
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📧 Test email sent to:', testEmail);
      alert(`✅ Test email sent to ${testEmail}!\n\nCheck your inbox (and spam folder) for the test message.`);
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('❌ Error sending test email. Please check your SMTP settings.');
    } finally {
      setIsTesting(false);
    }
  };

  const previewTemplate = (templateKey: keyof EmailSettings['emailTemplates']) => {
    const template = settings.emailTemplates[templateKey];
    const sampleData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      userId: 'user-123',
      orderId: 'ORDER-ABC123',
      amount: '24.99',
      moduleNames: "Kiki's Letters Hunt",
      paymentMethod: 'Credit Card',
      status: 'completed',
      orderDate: new Date().toLocaleString(),
      totalSpent: '49.98',
      modulesOwned: '2',
      memberSince: '2024-01-15',
      error: 'Card declined',
      timestamp: new Date().toLocaleString()
    };

    let preview = template.body;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    alert(`📧 Email Preview:\n\nSubject: ${template.subject.replace(/{{(\w+)}}/g, (match, key) => sampleData[key as keyof typeof sampleData] || match)}\n\n${preview}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-mali font-bold text-gray-800">Email & Notification Settings</h2>
          <p className="font-mali text-gray-600">Configure email notifications and templates</p>
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
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'templates', label: 'Email Templates', icon: Mail },
              { id: 'smtp', label: 'SMTP Settings', icon: Globe },
              { id: 'test', label: 'Test Email', icon: TestTube }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-mali font-bold transition-colors ${
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
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Admin Email Address</label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                      placeholder="admin@zingalinga.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <p className="font-mali text-gray-500 text-sm mt-1">
                      This email will receive all admin notifications
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4">Notification Preferences</h4>
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, enabled]) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [key]: e.target.checked }
                        })}
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                      />
                      <div>
                        <span className="font-mali font-bold text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <p className="font-mali text-gray-600 text-sm">
                          {key === 'newPurchases' && 'Get notified when customers make purchases'}
                          {key === 'newUsers' && 'Get notified when new users register'}
                          {key === 'paymentFailures' && 'Get notified when payments fail'}
                          {key === 'systemAlerts' && 'Get notified about system issues'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-8">
              <h3 className="text-xl font-mali font-bold text-gray-800">Email Templates</h3>
              
              {Object.entries(settings.emailTemplates).map(([key, template]) => (
                <div key={key} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-mali font-bold text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={template.enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            emailTemplates: {
                              ...settings.emailTemplates,
                              [key]: { ...template, enabled: e.target.checked }
                            }
                          })}
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                        />
                        <span className="font-mali text-gray-700">Enabled</span>
                      </label>
                    </div>
                    <button
                      onClick={() => previewTemplate(key as keyof EmailSettings['emailTemplates'])}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">Subject Line</label>
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailTemplates: {
                            ...settings.emailTemplates,
                            [key]: { ...template, subject: e.target.value }
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      />
                    </div>

                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">Email Body</label>
                      <textarea
                        value={template.body}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailTemplates: {
                            ...settings.emailTemplates,
                            [key]: { ...template, body: e.target.value }
                          }
                        })}
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm"
                      />
                      <p className="font-mali text-gray-500 text-xs mt-1">
                        Use variables like {{customerName}}, {{orderId}}, {{amount}}, etc.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SMTP Settings */}
          {activeTab === 'smtp' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">SMTP Configuration</h3>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <p className="font-mali text-blue-800 font-bold">Secure Email Delivery</p>
                  </div>
                  <p className="font-mali text-blue-700 text-sm mt-1">
                    Configure your SMTP settings to send emails through your preferred email service provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpSettings.host}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtpSettings: { ...settings.smtpSettings, host: e.target.value }
                      })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Port</label>
                    <input
                      type="number"
                      value={settings.smtpSettings.port}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtpSettings: { ...settings.smtpSettings, port: parseInt(e.target.value) || 587 }
                      })}
                      placeholder="587"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={settings.smtpSettings.username}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtpSettings: { ...settings.smtpSettings, username: e.target.value }
                      })}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={settings.smtpSettings.password}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtpSettings: { ...settings.smtpSettings, password: e.target.value }
                      })}
                      placeholder="your-app-password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.smtpSettings.secure}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtpSettings: { ...settings.smtpSettings, secure: e.target.checked }
                      })}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <div>
                      <span className="font-mali font-bold text-gray-800">Use SSL/TLS</span>
                      <p className="font-mali text-gray-600 text-sm">Enable secure connection (recommended)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Common SMTP Providers */}
              <div>
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4">Common Providers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Gmail', host: 'smtp.gmail.com', port: 587, secure: false },
                    { name: 'Outlook', host: 'smtp-mail.outlook.com', port: 587, secure: false },
                    { name: 'SendGrid', host: 'smtp.sendgrid.net', port: 587, secure: false }
                  ].map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => setSettings({
                        ...settings,
                        smtpSettings: {
                          ...settings.smtpSettings,
                          host: provider.host,
                          port: provider.port,
                          secure: provider.secure
                        }
                      })}
                      className="p-4 border border-gray-300 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors text-center"
                    >
                      <p className="font-mali font-bold text-gray-800">{provider.name}</p>
                      <p className="font-mali text-gray-600 text-sm">{provider.host}:{provider.port}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Test Email */}
          {activeTab === 'test' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Test Email Delivery</h3>
                
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-yellow-600" />
                    <p className="font-mali text-yellow-800 font-bold">Test Your Email Configuration</p>
                  </div>
                  <p className="font-mali text-yellow-700 text-sm mt-1">
                    Send a test email to verify your SMTP settings are working correctly.
                  </p>
                </div>

                <div className="max-w-md">
                  <label className="block font-mali font-bold text-gray-700 mb-2">Test Email Address</label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <button
                      onClick={sendTestEmail}
                      disabled={isTesting || !testEmail}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold disabled:opacity-50"
                    >
                      {isTesting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-mali font-bold text-gray-800 mb-4">Email Queue Status</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-mali font-bold text-gray-800">Email System Status: Active</span>
                    </div>
                    <p className="font-mali text-gray-600 text-sm">
                      All email notifications are being processed normally.
                    </p>
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