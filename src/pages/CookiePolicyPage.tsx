import React from 'react';
import { ArrowLeft, Cookie, Shield, Settings, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface CookiePolicyPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-yellow via-brand-green to-brand-blue">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-8 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Cookie Policy</h1>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              Learn about how Zinga Linga uses cookies to provide the best learning 
              experience for your child while protecting their privacy.
            </p>
            <p className="text-brand-yellow font-bold">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Notice */}
      <section className="py-12 px-4 bg-blue-50 border-l-4 border-blue-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-3">Child-Safe Cookie Usage</h2>
              <p className="text-blue-700 text-lg leading-relaxed">
                Zinga Linga uses only essential cookies necessary for the app to function properly. 
                We do not use tracking cookies, advertising cookies, or any cookies that could 
                compromise your child's privacy. All cookies are COPPA compliant and child-safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">What Are Cookies?</h2>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <Cookie className="w-12 h-12 text-brand-yellow mt-2" />
              <div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">Simple Explanation</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Cookies are small text files that websites store on your device to remember 
                  information about your visit. Think of them like a bookmark that helps the 
                  website remember your preferences.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  For Zinga Linga, cookies help us remember things like your login status, 
                  your child's progress, and app settings - making the learning experience 
                  smoother and more personalized.
                </p>
              </div>
            </div>
          </div>

          {/* Types of Cookies We Use */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-brand-dark mb-8">Types of Cookies We Use</h3>
            
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h4 className="text-xl font-bold text-green-800">Essential Cookies (Required)</h4>
                </div>
                <p className="text-green-700 mb-4">
                  These cookies are necessary for the website to function properly. They cannot be disabled.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-bold text-green-800 mb-2">What they do:</h5>
                  <ul className="space-y-1 text-green-700">
                    <li>• Keep you logged into your parent account</li>
                    <li>• Remember your child's current learning session</li>
                    <li>• Maintain app security and prevent fraud</li>
                    <li>• Store essential app functionality preferences</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-8 h-8 text-blue-600" />
                  <h4 className="text-xl font-bold text-blue-800">Functional Cookies (Optional)</h4>
                </div>
                <p className="text-blue-700 mb-4">
                  These cookies enhance your experience but are not essential. You can disable them.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-bold text-blue-800 mb-2">What they do:</h5>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Remember your preferred language settings</li>
                    <li>• Save volume and display preferences</li>
                    <li>• Remember which modules you've viewed</li>
                    <li>• Store accessibility settings</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-purple-600" />
                  <h4 className="text-xl font-bold text-purple-800">Analytics Cookies (Optional)</h4>
                </div>
                <p className="text-purple-700 mb-4">
                  These help us understand how the app is used so we can improve it. All data is anonymous.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-bold text-purple-800 mb-2">What they track:</h5>
                  <ul className="space-y-1 text-purple-700">
                    <li>• Which learning activities are most popular</li>
                    <li>• How long children spend in different sections</li>
                    <li>• Technical performance and error reports</li>
                    <li>• General usage patterns (no personal data)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* What We DON'T Use */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-brand-dark mb-8">What We DON'T Use</h3>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h4 className="text-2xl font-bold text-red-800">Cookies We Never Use</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-red-800 mb-3">❌ Advertising Cookies</h5>
                  <p className="text-red-700 text-sm">
                    We never use cookies to track children for advertising purposes or 
                    to show targeted ads.
                  </p>
                </div>
                
                <div>
                  <h5 className="font-bold text-red-800 mb-3">❌ Third-Party Tracking</h5>
                  <p className="text-red-700 text-sm">
                    We don't allow other companies to track your child's activity 
                    through our website.
                  </p>
                </div>
                
                <div>
                  <h5 className="font-bold text-red-800 mb-3">❌ Social Media Cookies</h5>
                  <p className="text-red-700 text-sm">
                    No social media tracking or sharing cookies that could 
                    compromise privacy.
                  </p>
                </div>
                
                <div>
                  <h5 className="font-bold text-red-800 mb-3">❌ Cross-Site Tracking</h5>
                  <p className="text-red-700 text-sm">
                    We never track your child's activity across other websites 
                    or apps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-brand-dark mb-8">Managing Your Cookie Preferences</h3>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6">In the Zinga Linga App</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-brand-dark mb-2">Cookie Settings</h5>
                    <p className="text-gray-700 text-sm mb-3">
                      You can manage your cookie preferences in your parent dashboard settings.
                    </p>
                    <button className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                      Manage Cookie Settings
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-brand-dark mb-2">Clear Stored Data</h5>
                    <p className="text-gray-700 text-sm mb-3">
                      You can clear all cookies and stored data at any time from your account settings.
                    </p>
                    <button className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm">
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6">In Your Browser</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-brand-dark mb-3">Chrome</h5>
                    <ol className="space-y-1 text-gray-700 text-sm">
                      <li>1. Click the three dots menu</li>
                      <li>2. Go to Settings &gt; Privacy and security</li>
                      <li>3. Click "Cookies and other site data"</li>
                      <li>4. Choose your preferred settings</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-brand-dark mb-3">Firefox</h5>
                    <ol className="space-y-1 text-gray-700 text-sm">
                      <li>1. Click the menu button</li>
                      <li>2. Go to Settings &gt; Privacy & Security</li>
                      <li>3. Find "Cookies and Site Data"</li>
                      <li>4. Adjust your preferences</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-brand-dark mb-3">Safari</h5>
                    <ol className="space-y-1 text-gray-700 text-sm">
                      <li>1. Go to Safari &gt; Preferences</li>
                      <li>2. Click the Privacy tab</li>
                      <li>3. Choose "Block all cookies" or customize</li>
                      <li>4. Close preferences to save</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-brand-dark mb-3">Edge</h5>
                    <ol className="space-y-1 text-gray-700 text-sm">
                      <li>1. Click the three dots menu</li>
                      <li>2. Go to Settings &gt; Cookies and site permissions</li>
                      <li>3. Click "Cookies and site data"</li>
                      <li>4. Configure your settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact of Disabling Cookies */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-brand-dark mb-8">What Happens If You Disable Cookies?</h3>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-yellow-600 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-yellow-800 mb-4">Important Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-bold text-yellow-800 mb-2">If you disable essential cookies:</h5>
                      <ul className="space-y-1 text-yellow-700">
                        <li>• You won't be able to stay logged in</li>
                        <li>• Your child's progress won't be saved</li>
                        <li>• Some app features may not work properly</li>
                        <li>• You'll need to re-enter settings each visit</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-bold text-yellow-800 mb-2">If you disable optional cookies:</h5>
                      <ul className="space-y-1 text-yellow-700">
                        <li>• The app will still work normally</li>
                        <li>• You may need to reset preferences each visit</li>
                        <li>• We won't be able to improve the app based on usage data</li>
                        <li>• Some convenience features may not work</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">Questions About Cookies?</h3>
            <p className="text-lg text-gray-700 text-center mb-6">
              If you have any questions about our cookie policy or how we protect your child's privacy, 
              please don't hesitate to contact us.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <h4 className="font-bold text-brand-dark mb-2">Privacy Questions</h4>
                <p className="text-gray-600 mb-4">privacy@zingalinga.com</p>
                <a 
                  href="mailto:privacy@zingalinga.com"
                  className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm"
                >
                  Email Privacy Team
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <h4 className="font-bold text-brand-dark mb-2">General Support</h4>
                <p className="text-gray-600 mb-4">help@zingalinga.com</p>
                <a 
                  href="mailto:help@zingalinga.com"
                  className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
