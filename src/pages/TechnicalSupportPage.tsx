import React, { useState } from 'react';
import { ArrowLeft, Settings, Smartphone, Monitor, Wifi, Download, RefreshCw, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface TechnicalSupportPageProps {
  onBack: () => void;
}

export const TechnicalSupportPage: React.FC<TechnicalSupportPageProps> = ({ onBack }) => {
  const [selectedIssue, setSelectedIssue] = useState('');

  const commonIssues = [
    {
      id: 'loading',
      title: 'App Won\'t Load',
      icon: RefreshCw,
      description: 'The app is stuck on loading screen or won\'t start',
      solutions: [
        'Check your internet connection',
        'Clear your browser cache and cookies',
        'Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)',
        'Disable browser extensions temporarily',
        'Try using a different browser (Chrome, Firefox, Safari)'
      ]
    },
    {
      id: 'audio',
      title: 'No Sound or Audio Issues',
      icon: AlertCircle,
      description: 'Can\'t hear Kiki and Tano or background music',
      solutions: [
        'Check your device volume is turned up',
        'Ensure the app volume slider is not muted',
        'Check if other apps/websites have sound',
        'Try using headphones to test audio',
        'Restart your browser or app'
      ]
    },
    {
      id: 'video',
      title: 'Video Not Playing',
      icon: Monitor,
      description: 'Videos are not loading or playing properly',
      solutions: [
        'Check your internet speed (minimum 5 Mbps recommended)',
        'Close other apps using internet bandwidth',
        'Try lowering video quality in settings',
        'Clear browser cache and reload',
        'Update your browser to the latest version'
      ]
    },
    {
      id: 'touch',
      title: 'Touch/Click Not Working',
      icon: Smartphone,
      description: 'Interactive elements not responding to touch or clicks',
      solutions: [
        'Make sure your screen is clean (for touch devices)',
        'Try using a different finger or stylus',
        'Check if the issue occurs in other apps',
        'Restart the app or refresh the browser',
        'Update your device software'
      ]
    },
    {
      id: 'slow',
      title: 'App Running Slowly',
      icon: Download,
      description: 'The app is laggy or responding slowly',
      solutions: [
        'Close other apps running in the background',
        'Check available storage space on your device',
        'Restart your device',
        'Clear app cache and data',
        'Check if your device meets minimum requirements'
      ]
    },
    {
      id: 'login',
      title: 'Login Problems',
      icon: Settings,
      description: 'Can\'t log in or access parent dashboard',
      solutions: [
        'Double-check your email and password',
        'Try the "Forgot Password" option',
        'Clear browser cookies and cache',
        'Disable password managers temporarily',
        'Contact support if account is locked'
      ]
    }
  ];

  const systemRequirements = {
    mobile: {
      ios: 'iOS 12.0 or later',
      android: 'Android 7.0 (API level 24) or later',
      storage: '500 MB free space',
      ram: '2 GB RAM minimum'
    },
    desktop: {
      browsers: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
      os: 'Windows 10, macOS 10.14, Ubuntu 18.04 or later',
      storage: '1 GB free space',
      ram: '4 GB RAM minimum'
    },
    network: {
      speed: '5 Mbps for video streaming',
      connection: 'Stable internet connection required',
      offline: 'Limited offline functionality available'
    }
  };

  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-blue via-brand-green to-brand-pink">
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
              <Settings className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Technical Support</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Having technical issues? We're here to help you get back to learning 
              with Kiki and Tano as quickly as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Fixes */}
      <section className="py-12 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-green text-center mb-8">Quick Fixes to Try First</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <RefreshCw className="w-12 h-12 text-brand-blue mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Refresh Page</h3>
              <p className="text-sm text-gray-600">Press Ctrl+F5 (PC) or Cmd+Shift+R (Mac)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <Wifi className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Check Internet</h3>
              <p className="text-sm text-gray-600">Ensure you have a stable connection</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <Monitor className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Update Browser</h3>
              <p className="text-sm text-gray-600">Use the latest version of your browser</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <Settings className="w-12 h-12 text-brand-pink mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Clear Cache</h3>
              <p className="text-sm text-gray-600">Clear browser cache and cookies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Common Issues & Solutions</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Issue List */}
            <div className="space-y-4">
              {commonIssues.map((issue) => (
                <div 
                  key={issue.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all ${
                    selectedIssue === issue.id 
                      ? 'border-brand-blue bg-blue-50' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedIssue(selectedIssue === issue.id ? '' : issue.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedIssue === issue.id ? 'bg-brand-blue' : 'bg-gray-100'
                    }`}>
                      <issue.icon className={`w-6 h-6 ${
                        selectedIssue === issue.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-brand-dark">{issue.title}</h3>
                      <p className="text-gray-600 text-sm">{issue.description}</p>
                    </div>
                    <HelpCircle className={`w-5 h-5 ${
                      selectedIssue === issue.id ? 'text-brand-blue' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Solutions */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              {selectedIssue ? (
                <div>
                  {(() => {
                    const issue = commonIssues.find(i => i.id === selectedIssue);
                    return issue ? (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <issue.icon className="w-8 h-8 text-brand-blue" />
                          <h3 className="text-2xl font-bold text-brand-dark">{issue.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{issue.description}</p>
                        <h4 className="text-lg font-bold text-brand-dark mb-4">Try these solutions:</h4>
                        <div className="space-y-3">
                          {issue.solutions.map((solution, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-white text-xs font-bold">{index + 1}</span>
                              </div>
                              <p className="text-gray-700">{solution}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-white rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Still having issues?</strong> Contact our support team with details about 
                            your device, browser, and what you were trying to do when the problem occurred.
                          </p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              ) : (
                <div className="text-center">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">Select an Issue</h3>
                  <p className="text-gray-400">
                    Click on any issue from the list to see detailed solutions and troubleshooting steps.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">System Requirements</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mobile Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-8 h-8 text-brand-blue" />
                <h3 className="text-2xl font-bold text-brand-dark">Mobile Devices</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">iOS Devices</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.mobile.ios}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Android Devices</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.mobile.android}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Storage</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.mobile.storage}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Memory</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.mobile.ram}</p>
                </div>
              </div>
            </div>

            {/* Desktop Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Monitor className="w-8 h-8 text-brand-green" />
                <h3 className="text-2xl font-bold text-brand-dark">Desktop/Laptop</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Browsers</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.desktop.browsers}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Operating System</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.desktop.os}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Storage</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.desktop.storage}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Memory</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.desktop.ram}</p>
                </div>
              </div>
            </div>

            {/* Network Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Wifi className="w-8 h-8 text-brand-yellow" />
                <h3 className="text-2xl font-bold text-brand-dark">Network</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Internet Speed</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.network.speed}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Connection</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.network.connection}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Offline Mode</h4>
                  <p className="text-gray-700 text-sm">{systemRequirements.network.offline}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Tip:</strong> Download content when connected to WiFi for offline learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Still Need Help?</h2>
          <p className="text-xl text-gray-700 mb-12">
            Our technical support team is ready to help you resolve any issues quickly.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Email Technical Support</h3>
              <p className="text-gray-700 mb-6">
                Send us detailed information about your issue and we'll respond within 24 hours.
              </p>
              <a 
                href="mailto:tech@zingalinga.com"
                className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors inline-block"
              >
                tech@zingalinga.com
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Live Chat Support</h3>
              <p className="text-gray-700 mb-6">
                Get instant help from our technical support specialists during business hours.
              </p>
              <button className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">
                Start Live Chat
              </button>
            </div>
          </div>
          
          <div className="mt-12 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">When Contacting Support, Please Include:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <ul className="space-y-2 text-yellow-700">
                <li>• Device type and operating system</li>
                <li>• Browser name and version</li>
                <li>• Description of the problem</li>
              </ul>
              <ul className="space-y-2 text-yellow-700">
                <li>• Steps you've already tried</li>
                <li>• When the issue started</li>
                <li>• Any error messages you see</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};