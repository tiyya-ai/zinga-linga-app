import React, { useState } from 'react';
import { ArrowLeft, Search, AlertTriangle, CheckCircle, RefreshCw, Settings, Wifi, Volume2, Play, Monitor } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface TroubleshootingPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const TroubleshootingPage: React.FC<TroubleshootingPageProps> = ({ onBack, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Issues', icon: AlertTriangle },
    { id: 'loading', name: 'Loading Problems', icon: RefreshCw },
    { id: 'audio', name: 'Audio Issues', icon: Volume2 },
    { id: 'video', name: 'Video Problems', icon: Play },
    { id: 'connection', name: 'Connection', icon: Wifi },
    { id: 'performance', name: 'Performance', icon: Monitor }
  ];

  const troubleshootingSteps = [
    {
      id: 'app-wont-load',
      category: 'loading',
      title: 'App Won\'t Load or Start',
      severity: 'high',
      description: 'The Zinga Linga app is stuck on the loading screen or won\'t start at all.',
      quickFix: 'Refresh your browser (Ctrl+F5 or Cmd+Shift+R)',
      steps: [
        {
          step: 1,
          title: 'Check Internet Connection',
          description: 'Ensure you have a stable internet connection',
          details: [
            'Try loading other websites to test connectivity',
            'Switch from WiFi to mobile data or vice versa',
            'Restart your router if using WiFi',
            'Check if other devices can connect to the internet'
          ]
        },
        {
          step: 2,
          title: 'Clear Browser Cache',
          description: 'Clear your browser\'s cache and cookies',
          details: [
            'Chrome: Settings &gt; Privacy > Clear browsing data',
            'Firefox: Settings &gt; Privacy > Clear Data',
            'Safari: Develop &gt; Empty Caches',
            'Edge: Settings &gt; Privacy > Clear browsing data'
          ]
        },
        {
          step: 3,
          title: 'Update Your Browser',
          description: 'Make sure you\'re using the latest browser version',
          details: [
            'Chrome: Settings &gt; About Chrome',
            'Firefox: Help > About Firefox',
            'Safari: Updates through System Preferences',
            'Edge: Settings &gt; About Microsoft Edge'
          ]
        },
        {
          step: 4,
          title: 'Disable Extensions',
          description: 'Temporarily disable browser extensions',
          details: [
            'Try opening the app in incognito/private mode',
            'Disable ad blockers and other extensions',
            'Test if the app loads without extensions',
            'Re-enable extensions one by one to identify conflicts'
          ]
        }
      ]
    },
    {
      id: 'no-sound',
      category: 'audio',
      title: 'No Sound or Audio Problems',
      severity: 'medium',
      description: 'Can\'t hear Kiki and Tano\'s voices, music, or sound effects.',
      quickFix: 'Check device volume and unmute the app',
      steps: [
        {
          step: 1,
          title: 'Check Device Volume',
          description: 'Ensure your device volume is turned up',
          details: [
            'Check the main volume on your device',
            'Look for a mute button or switch',
            'Test volume with other apps or videos',
            'Try adjusting volume while the app is playing'
          ]
        },
        {
          step: 2,
          title: 'Check App Audio Settings',
          description: 'Verify audio settings within the app',
          details: [
            'Look for volume controls in the app',
            'Check if audio is muted in the app settings',
            'Try toggling audio on/off in the app',
            'Restart the current activity or lesson'
          ]
        },
        {
          step: 3,
          title: 'Test with Headphones',
          description: 'Try using headphones or external speakers',
          details: [
            'Connect headphones to test audio output',
            'Try different headphones if available',
            'Check headphone connection and volume',
            'Test with Bluetooth speakers if applicable'
          ]
        },
        {
          step: 4,
          title: 'Browser Audio Permissions',
          description: 'Check if browser has audio permissions',
          details: [
            'Look for audio permission prompts',
            'Check browser settings for audio permissions',
            'Allow audio autoplay for the Zinga Linga website',
            'Refresh the page after changing permissions'
          ]
        }
      ]
    },
    {
      id: 'video-not-playing',
      category: 'video',
      title: 'Videos Not Playing or Loading',
      severity: 'medium',
      description: 'Video content with Kiki and Tano won\'t play or keeps buffering.',
      quickFix: 'Check internet speed and refresh the page',
      steps: [
        {
          step: 1,
          title: 'Check Internet Speed',
          description: 'Ensure you have sufficient bandwidth for video streaming',
          details: [
            'Test your internet speed (need 5+ Mbps)',
            'Close other apps using internet bandwidth',
            'Pause downloads or streaming on other devices',
            'Switch to a faster internet connection if available'
          ]
        },
        {
          step: 2,
          title: 'Lower Video Quality',
          description: 'Try reducing video quality for smoother playback',
          details: [
            'Look for quality settings in the video player',
            'Choose a lower resolution (480p instead of 720p)',
            'Allow videos to buffer before playing',
            'Try playing videos during off-peak hours'
          ]
        },
        {
          step: 3,
          title: 'Update Browser/App',
          description: 'Ensure you have the latest version',
          details: [
            'Update your web browser to the latest version',
            'Clear browser cache after updating',
            'Enable hardware acceleration in browser settings',
            'Try a different browser if issues persist'
          ]
        },
        {
          step: 4,
          title: 'Check Video Format Support',
          description: 'Verify your browser supports the video format',
          details: [
            'Try playing videos in a different browser',
            'Enable HTML5 video support',
            'Update video drivers on your computer',
            'Contact support if videos work in other browsers'
          ]
        }
      ]
    },
    {
      id: 'slow-performance',
      category: 'performance',
      title: 'App Running Slowly or Lagging',
      severity: 'medium',
      description: 'The app is slow to respond, animations are choppy, or interactions are delayed.',
      quickFix: 'Close other apps and restart your browser',
      steps: [
        {
          step: 1,
          title: 'Close Other Applications',
          description: 'Free up system resources',
          details: [
            'Close unnecessary browser tabs',
            'Quit other applications running in background',
            'Check task manager for resource-heavy programs',
            'Restart your device if it\'s been on for a long time'
          ]
        },
        {
          step: 2,
          title: 'Check Available Storage',
          description: 'Ensure you have enough free space',
          details: [
            'Check available storage on your device',
            'Delete unnecessary files or apps',
            'Clear browser cache and temporary files',
            'Ensure at least 1GB of free space'
          ]
        },
        {
          step: 3,
          title: 'Optimize Browser Settings',
          description: 'Adjust browser settings for better performance',
          details: [
            'Enable hardware acceleration',
            'Disable unnecessary browser extensions',
            'Clear browsing data regularly',
            'Update graphics drivers on your computer'
          ]
        },
        {
          step: 4,
          title: 'Check System Requirements',
          description: 'Verify your device meets minimum requirements',
          details: [
            'Check if your device meets minimum specs',
            'Consider using a more powerful device',
            'Try using the app during less busy times',
            'Contact support for device-specific optimization tips'
          ]
        }
      ]
    },
    {
      id: 'connection-lost',
      category: 'connection',
      title: 'Lost Connection or Can\'t Connect',
      severity: 'high',
      description: 'The app loses connection frequently or can\'t connect to the internet.',
      quickFix: 'Check WiFi connection and restart your router',
      steps: [
        {
          step: 1,
          title: 'Test Internet Connection',
          description: 'Verify your internet is working properly',
          details: [
            'Try loading other websites or apps',
            'Run an internet speed test',
            'Check if other devices can connect',
            'Look for internet service provider outages'
          ]
        },
        {
          step: 2,
          title: 'Restart Network Equipment',
          description: 'Reset your network connection',
          details: [
            'Unplug your router for 30 seconds, then plug back in',
            'Restart your modem if you have one',
            'Forget and reconnect to your WiFi network',
            'Try connecting to a different WiFi network'
          ]
        },
        {
          step: 3,
          title: 'Check Firewall Settings',
          description: 'Ensure the app isn\'t blocked by security software',
          details: [
            'Check if antivirus software is blocking the app',
            'Add Zinga Linga to firewall exceptions',
            'Temporarily disable VPN if you\'re using one',
            'Check parental control settings'
          ]
        },
        {
          step: 4,
          title: 'Use Mobile Data',
          description: 'Try switching to mobile data as a test',
          details: [
            'Switch from WiFi to mobile data',
            'Check if the app works on mobile data',
            'If it works, the issue is with your WiFi',
            'Contact your internet provider if WiFi issues persist'
          ]
        }
      ]
    },
    {
      id: 'touch-not-working',
      category: 'loading',
      title: 'Touch or Click Not Responding',
      severity: 'medium',
      description: 'Interactive elements like buttons and games don\'t respond to touch or clicks.',
      quickFix: 'Clean your screen and restart the app',
      steps: [
        {
          step: 1,
          title: 'Clean Your Screen',
          description: 'Ensure your screen is clean and responsive',
          details: [
            'Clean your device screen with a soft cloth',
            'Remove any screen protectors that might interfere',
            'Check if touch works in other apps',
            'Try using a different finger or stylus'
          ]
        },
        {
          step: 2,
          title: 'Restart the App',
          description: 'Close and reopen the application',
          details: [
            'Close the browser tab completely',
            'Clear browser cache',
            'Reopen the Zinga Linga website',
            'Try refreshing the page (F5 or Ctrl+R)'
          ]
        },
        {
          step: 3,
          title: 'Check Browser Compatibility',
          description: 'Ensure your browser supports touch interactions',
          details: [
            'Try using a different browser',
            'Update your current browser',
            'Enable touch support in browser settings',
            'Test on a different device if available'
          ]
        },
        {
          step: 4,
          title: 'Device-Specific Issues',
          description: 'Check for device-specific touch problems',
          details: [
            'Restart your device completely',
            'Check for system updates',
            'Test touch sensitivity in device settings',
            'Contact device manufacturer if touch issues persist'
          ]
        }
      ]
    }
  ];

  const filteredSteps = troubleshootingSteps.filter(step => {
    const matchesCategory = selectedCategory === 'all' || step.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-red via-brand-pink to-brand-blue">
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
            <h1 className="text-5xl font-mali font-bold mb-6">Troubleshooting Guide</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Step-by-step solutions to common issues. Get back to learning 
              with Kiki and Tano quickly and easily.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for your issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 font-mali text-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Emergency Fixes */}
      <section className="py-12 px-4 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-red-800 text-center mb-8">🚨 Quick Emergency Fixes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-red-200">
              <RefreshCw className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-red-800 mb-2">Refresh Page</h3>
              <p className="text-sm text-red-700">Ctrl+F5 (PC) or Cmd+Shift+R (Mac)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-red-200">
              <Wifi className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-red-800 mb-2">Check Internet</h3>
              <p className="text-sm text-red-700">Test other websites</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-red-200">
              <Volume2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-red-800 mb-2">Check Volume</h3>
              <p className="text-sm text-red-700">Device and app volume</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-red-200">
              <Monitor className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-red-800 mb-2">Close Other Apps</h3>
              <p className="text-sm text-red-700">Free up memory</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting Steps */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Step-by-Step Solutions</h2>
          
          <div className="space-y-8">
            {filteredSteps.map((issue) => (
              <div key={issue.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Issue Header */}
                <div className={`p-6 ${
                  issue.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                  issue.severity === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                  'bg-green-50 border-l-4 border-green-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark mb-2">{issue.title}</h3>
                      <p className="text-gray-700 mb-4">{issue.description}</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                        Quick Fix: {issue.quickFix}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solution Steps */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-brand-dark mb-6">Detailed Solution Steps:</h4>
                  <div className="space-y-6">
                    {issue.steps.map((step) => (
                      <div key={step.step} className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h5>
                          <p className="text-gray-700 mb-3">{step.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <ul className="space-y-2">
                              {step.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSteps.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-500 mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-green/10 to-brand-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Still Having Issues?</h2>
          <p className="text-xl text-gray-700 mb-12">
            If these steps don't solve your problem, our support team is here to help!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Contact Technical Support</h3>
              <p className="text-gray-700 mb-6">
                Get personalized help from our technical support specialists.
              </p>
              <a 
                href="mailto:tech@zingalinga.com"
                className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors inline-block"
              >
                Email Tech Support
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Live Chat Help</h3>
              <p className="text-gray-700 mb-6">
                Get instant assistance during business hours for urgent issues.
              </p>
              <button className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
