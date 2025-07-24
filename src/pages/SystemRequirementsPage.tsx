import React from 'react';
import { ArrowLeft, Monitor, Smartphone, Wifi, HardDrive, Cpu, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SystemRequirementsPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const SystemRequirementsPage: React.FC<SystemRequirementsPageProps> = ({ onBack, onNavigate }) => {
  const requirements = {
    minimum: {
      mobile: {
        ios: 'iOS 12.0 or later',
        android: 'Android 7.0 (API level 24)',
        storage: '500 MB free space',
        ram: '2 GB RAM',
        processor: 'A10 Bionic / Snapdragon 660 or equivalent'
      },
      desktop: {
        os: 'Windows 10 / macOS 10.14 / Ubuntu 18.04',
        browser: 'Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+',
        storage: '1 GB free space',
        ram: '4 GB RAM',
        processor: 'Intel Core i3 / AMD Ryzen 3 or equivalent'
      },
      network: {
        speed: '5 Mbps for streaming',
        connection: 'Stable internet required',
        latency: 'Under 100ms recommended'
      }
    },
    recommended: {
      mobile: {
        ios: 'iOS 15.0 or later',
        android: 'Android 10.0 (API level 29)',
        storage: '2 GB free space',
        ram: '4 GB RAM',
        processor: 'A12 Bionic / Snapdragon 855 or newer'
      },
      desktop: {
        os: 'Windows 11 / macOS 12.0 / Ubuntu 20.04',
        browser: 'Latest versions of Chrome, Firefox, Safari, or Edge',
        storage: '5 GB free space',
        ram: '8 GB RAM',
        processor: 'Intel Core i5 / AMD Ryzen 5 or better'
      },
      network: {
        speed: '25 Mbps for optimal experience',
        connection: 'WiFi or high-speed broadband',
        latency: 'Under 50ms for best performance'
      }
    }
  };

  const browserSupport = [
    { name: 'Google Chrome', version: '90+', status: 'fully-supported', note: 'Recommended for best experience' },
    { name: 'Mozilla Firefox', version: '88+', status: 'fully-supported', note: 'Excellent compatibility' },
    { name: 'Safari', version: '14+', status: 'fully-supported', note: 'Optimized for macOS and iOS' },
    { name: 'Microsoft Edge', version: '90+', status: 'fully-supported', note: 'Great performance on Windows' },
    { name: 'Opera', version: '76+', status: 'supported', note: 'Good compatibility' },
    { name: 'Internet Explorer', version: 'Any', status: 'not-supported', note: 'Please upgrade to a modern browser' }
  ];

  const deviceCompatibility = [
    { category: 'Tablets', devices: 'iPad (6th gen+), Samsung Galaxy Tab, Amazon Fire HD', status: 'excellent' },
    { category: 'Smartphones', devices: 'iPhone 8+, Samsung Galaxy S8+, Google Pixel 3+', status: 'excellent' },
    { category: 'Laptops', devices: 'MacBook Air 2018+, Windows laptops with 4GB+ RAM', status: 'excellent' },
    { category: 'Desktops', devices: 'iMac 2017+, Windows 10+ PCs, Linux Ubuntu 18.04+', status: 'excellent' },
    { category: 'Chromebooks', devices: 'Chrome OS 88+ with Android app support', status: 'good' },
    { category: 'Smart TVs', devices: 'Android TV, Apple TV 4K, Roku (via casting)', status: 'limited' }
  ];

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
              <Monitor className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">System Requirements</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Make sure your device is ready for the best Zinga Linga learning experience 
              with Kiki and Tano.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Check */}
      <section className="py-12 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-green mb-8">Quick Compatibility Check</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <Monitor className="w-12 h-12 text-brand-blue mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Modern Browser</h3>
              <p className="text-sm text-gray-600">Chrome, Firefox, Safari, or Edge</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <Wifi className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Internet Connection</h3>
              <p className="text-sm text-gray-600">5+ Mbps for smooth streaming</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <HardDrive className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Storage Space</h3>
              <p className="text-sm text-gray-600">500 MB+ available space</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <Cpu className="w-12 h-12 text-brand-pink mx-auto mb-4" />
              <h3 className="font-bold text-brand-dark mb-2">Device Performance</h3>
              <p className="text-sm text-gray-600">2+ GB RAM recommended</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Requirements */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Detailed System Requirements</h2>
          
          {/* Mobile Requirements */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Smartphone className="w-8 h-8 text-brand-blue" />
              <h3 className="text-3xl font-bold text-brand-dark">Mobile Devices</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Minimum Requirements */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  Minimum Requirements
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-brand-dark mb-2">iOS Devices</h5>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• {requirements.minimum.mobile.ios}</li>
                      <li>• {requirements.minimum.mobile.storage}</li>
                      <li>• {requirements.minimum.mobile.ram}</li>
                      <li>• {requirements.minimum.mobile.processor}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark mb-2">Android Devices</h5>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• {requirements.minimum.mobile.android}</li>
                      <li>• {requirements.minimum.mobile.storage}</li>
                      <li>• {requirements.minimum.mobile.ram}</li>
                      <li>• {requirements.minimum.mobile.processor}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Requirements */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Recommended Specifications
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-brand-dark mb-2">iOS Devices</h5>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• {requirements.recommended.mobile.ios}</li>
                      <li>• {requirements.recommended.mobile.storage}</li>
                      <li>• {requirements.recommended.mobile.ram}</li>
                      <li>• {requirements.recommended.mobile.processor}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark mb-2">Android Devices</h5>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• {requirements.recommended.mobile.android}</li>
                      <li>• {requirements.recommended.mobile.storage}</li>
                      <li>• {requirements.recommended.mobile.ram}</li>
                      <li>• {requirements.recommended.mobile.processor}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Requirements */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Monitor className="w-8 h-8 text-brand-green" />
              <h3 className="text-3xl font-bold text-brand-dark">Desktop & Laptop Computers</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Minimum Requirements */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  Minimum Requirements
                </h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-brand-dark">Operating System</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.desktop.os}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Web Browser</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.desktop.browser}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Storage</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.desktop.storage}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Memory</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.desktop.ram}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Processor</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.desktop.processor}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Requirements */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Recommended Specifications
                </h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-brand-dark">Operating System</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.desktop.os}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Web Browser</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.desktop.browser}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Storage</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.desktop.storage}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Memory</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.desktop.ram}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Processor</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.desktop.processor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Requirements */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Wifi className="w-8 h-8 text-brand-yellow" />
              <h3 className="text-3xl font-bold text-brand-dark">Network & Internet</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6">Internet Connection</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-brand-dark">Minimum Speed</h5>
                    <p className="text-gray-700 text-sm">{requirements.minimum.network.speed}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Recommended Speed</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.network.speed}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Connection Type</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.network.connection}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-dark">Latency</h5>
                    <p className="text-gray-700 text-sm">{requirements.recommended.network.latency}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-brand-dark mb-6">Offline Capabilities</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Download className="w-6 h-6 text-brand-green mt-1" />
                    <div>
                      <h5 className="font-bold text-brand-dark">Download for Offline</h5>
                      <p className="text-gray-700 text-sm">
                        Download modules when connected to WiFi for offline learning during travel or limited connectivity.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-bold text-brand-dark mb-2">What Works Offline:</h5>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Downloaded video content</li>
                      <li>• Interactive games and activities</li>
                      <li>• Audio narration and songs</li>
                      <li>• Progress tracking (syncs when online)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Browser Compatibility</h2>
          
          <div className="space-y-4">
            {browserSupport.map((browser, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      browser.status === 'fully-supported' ? 'bg-green-100' :
                      browser.status === 'supported' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {browser.status === 'fully-supported' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : browser.status === 'supported' ? (
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-dark">{browser.name}</h3>
                      <p className="text-gray-600">Version {browser.version}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      browser.status === 'fully-supported' ? 'bg-green-100 text-green-800' :
                      browser.status === 'supported' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {browser.status === 'fully-supported' ? 'Fully Supported' :
                       browser.status === 'supported' ? 'Supported' : 'Not Supported'}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">{browser.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Device Compatibility</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deviceCompatibility.map((device, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-brand-dark">{device.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    device.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    device.status === 'good' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {device.status === 'excellent' ? 'Excellent' :
                     device.status === 'good' ? 'Good' : 'Limited'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{device.devices}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Performance Optimization Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6">For Best Performance</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Close other apps and browser tabs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Use WiFi instead of mobile data when possible</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Keep your browser updated to the latest version</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Clear browser cache regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Ensure adequate device storage space</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6">Troubleshooting Slow Performance</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <span className="text-gray-700">Restart your device if experiencing lag</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <span className="text-gray-700">Check available storage space (need 500MB+)</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <span className="text-gray-700">Test internet speed (should be 5+ Mbps)</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <span className="text-gray-700">Disable browser extensions temporarily</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <span className="text-gray-700">Contact support if issues persist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};