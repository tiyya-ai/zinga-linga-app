import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface PrivacyPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} onNavigate={onNavigate} />
      
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
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              Your child's privacy and safety are our top priorities. 
              We are committed to protecting personal information and being transparent about our practices.
            </p>
            <p className="text-brand-yellow font-bold">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* COPPA Compliance Notice */}
      <section className="py-12 px-4 bg-green-50 border-l-4 border-green-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-3">COPPA Compliant</h2>
              <p className="text-green-700 text-lg leading-relaxed">
                Zinga Linga is fully compliant with the Children's Online Privacy Protection Act (COPPA). 
                We do not knowingly collect personal information from children under 13 without verifiable 
                parental consent, and we implement additional safeguards to protect young users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Information We Collect */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-brand-blue" />
              <h2 className="text-3xl font-bold text-brand-dark">Information We Collect</h2>
            </div>
            
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">From Parents/Guardians</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Email address (for account creation and communication)</li>
                  <li>• Payment information (processed securely by our payment partners)</li>
                  <li>• Child's first name and age range (for personalized learning)</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">From Children (With Parental Consent)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Learning progress and achievements (to track educational milestones)</li>
                  <li>• Time spent in activities (to optimize learning experiences)</li>
                  <li>• Interaction patterns (to improve our educational content)</li>
                  <li>• No personal identifying information is collected from children</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Technical Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Device type and operating system (for compatibility)</li>
                  <li>• App usage analytics (to improve performance)</li>
                  <li>• Crash reports (to fix technical issues)</li>
                  <li>• IP address (for security and fraud prevention)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-brand-green" />
              <h2 className="text-3xl font-bold text-brand-dark">How We Use Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-brand-green/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Educational Purposes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Track learning progress</li>
                  <li>• Personalize content difficulty</li>
                  <li>• Generate progress reports for parents</li>
                  <li>• Improve educational effectiveness</li>
                </ul>
              </div>
              
              <div className="bg-white border-2 border-brand-blue/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Service Delivery</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Provide access to purchased content</li>
                  <li>• Send important updates and notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Process payments securely</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-brand-pink" />
              <h2 className="text-3xl font-bold text-brand-dark">How We Protect Your Data</h2>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Security Measures</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SSL encryption for all data transmission</li>
                    <li>• Secure cloud storage with encryption at rest</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access to personal data</li>
                    <li>• Secure payment processing (PCI DSS compliant)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Privacy Safeguards</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• No advertising or third-party tracking</li>
                    <li>• No sale of personal information</li>
                    <li>• Minimal data collection practices</li>
                    <li>• Regular data retention review</li>
                    <li>• Parental control over child's data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-brand-yellow" />
              <h2 className="text-3xl font-bold text-brand-dark">Your Rights and Choices</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-3">Parental Rights</h3>
                <p className="text-gray-700 mb-4">
                  As a parent or guardian, you have the right to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Review your child's personal information</li>
                  <li>• Request deletion of your child's data</li>
                  <li>• Refuse further collection of your child's information</li>
                  <li>• Update or correct any information</li>
                  <li>• Download your child's learning data</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-3">How to Exercise Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  To exercise any of these rights, please contact us at:
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-brand-dark">Email: privacy@zingalinga.com</p>
                  <p className="text-gray-600">We will respond within 30 days of receiving your request.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-brand-red" />
              <h2 className="text-3xl font-bold text-brand-dark">Data Sharing and Third Parties</h2>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">We Do NOT Share Personal Data</h3>
              <p className="text-red-700 mb-4">
                We do not sell, rent, or share personal information with third parties for marketing purposes. 
                We only share data in these limited circumstances:
              </p>
              <ul className="space-y-2 text-red-700">
                <li>• With your explicit consent</li>
                <li>• To comply with legal obligations</li>
                <li>• To protect the safety of our users</li>
                <li>• With trusted service providers who help us operate our service (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">Questions About Privacy?</h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              We're here to help! If you have any questions about this privacy policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <h3 className="font-bold text-brand-dark mb-2">Privacy Officer</h3>
                <p className="text-gray-600">privacy@zingalinga.com</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <h3 className="font-bold text-brand-dark mb-2">General Support</h3>
                <p className="text-gray-600">help@zingalinga.com</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};