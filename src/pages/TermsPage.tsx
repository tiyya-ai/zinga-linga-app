import React from 'react';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface TermsPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-green via-brand-blue to-brand-pink">
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
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Terms of Service</h1>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              These terms govern your use of Zinga Linga's educational platform. 
              By using our service, you agree to these terms.
            </p>
            <p className="text-brand-yellow font-bold">
              Effective Date: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-brand-green mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              Terms Summary (The Simple Version)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-brand-dark mb-3">What You Get:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Access to educational content for your child</li>
                  <li>• Safe, ad-free learning environment</li>
                  <li>• Progress tracking and parental controls</li>
                  <li>• Customer support when you need it</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-brand-dark mb-3">What We Ask:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Use the service appropriately and safely</li>
                  <li>• Provide accurate account information</li>
                  <li>• Respect our intellectual property</li>
                  <li>• Follow our community guidelines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Terms Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Acceptance of Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-brand-blue" />
              <h2 className="text-3xl font-bold text-brand-dark">1. Acceptance of Terms</h2>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using Zinga Linga's educational platform, you agree to be bound by these Terms of Service 
                and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These terms apply to all users, including parents, guardians, children, and visitors to our platform.
              </p>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">2. Service Description</h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">What Zinga Linga Provides</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Interactive educational content for children ages 1-6</li>
                  <li>• African-themed alphabet learning modules</li>
                  <li>• Progress tracking and parental dashboard</li>
                  <li>• Customer support and technical assistance</li>
                  <li>• Safe, COPPA-compliant learning environment</li>
                </ul>
              </div>
              
              <div className="bg-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Service Availability</h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide continuous access to our service, but we cannot guarantee 100% uptime. 
                  We may temporarily suspend service for maintenance, updates, or technical issues. 
                  We will provide advance notice when possible.
                </p>
              </div>
            </div>
          </div>

          {/* User Accounts */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">3. User Accounts and Responsibilities</h2>
            <div className="space-y-6">
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Account Creation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Only parents or legal guardians may create accounts</li>
                  <li>• You must provide accurate and complete information</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>�� One account may be used for multiple children in the same family</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Acceptable Use</h3>
                <p className="text-gray-700 leading-relaxed mb-4">You agree to use our service only for its intended educational purpose. You will not:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Share account credentials with unauthorized users</li>
                  <li>• Attempt to reverse engineer or copy our content</li>
                  <li>• Use the service for any commercial purpose</li>
                  <li>• Interfere with the service's security or functionality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment and Refunds */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">4. Payment Terms and Refunds</h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Pricing and Payment</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• All prices are listed in USD and include applicable taxes</li>
                  <li>• Payment is required before accessing premium content</li>
                  <li>• We accept major credit cards and secure payment methods</li>
                  <li>• Prices may change with 30 days notice to existing users</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Refund Policy</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-brand-dark mb-2">30-Day Money-Back Guarantee</h4>
                    <p className="text-gray-700">
                      If you're not satisfied with your purchase, request a full refund within 30 days. 
                      Contact our support team at refunds@zingalinga.com.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-brand-dark mb-2">Refund Process</h4>
                    <p className="text-gray-700">
                      Refunds are processed within 5-10 business days to your original payment method. 
                      Access to content will be revoked upon refund processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-brand-pink" />
              <h2 className="text-3xl font-bold text-brand-dark">5. Intellectual Property Rights</h2>
            </div>
            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on Zinga Linga, including but not limited to text, graphics, logos, images, audio clips, 
                video clips, digital downloads, and software, is the property of Zinga Linga or its content suppliers 
                and is protected by copyright and other intellectual property laws.
              </p>
              
              <h3 className="text-xl font-bold text-brand-dark mb-4 mt-6">Your License</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our content 
                for personal, educational use only. This license does not include:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Resale or commercial use of our content</li>
                <li>• Distribution or public performance of our content</li>
                <li>• Modification or derivative works of our content</li>
                <li>• Systematic downloading or copying of content</li>
              </ul>
            </div>
          </div>

          {/* Privacy and Children */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">6. Children's Privacy and Safety</h2>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">COPPA Compliance</h3>
                  <p className="text-green-700 leading-relaxed mb-4">
                    We are committed to protecting children's privacy and comply with the Children's Online Privacy 
                    Protection Act (COPPA). We do not knowingly collect personal information from children under 13 
                    without verifiable parental consent.
                  </p>
                  <ul className="space-y-2 text-green-700">
                    <li>• No advertising or third-party tracking</li>
                    <li>• No social features or communication tools</li>
                    <li>• Parental controls over all account settings</li>
                    <li>• Regular safety and content reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-brand-red" />
              <h2 className="text-3xl font-bold text-brand-dark">7. Limitation of Liability</h2>
            </div>
            <div className="bg-red-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive to provide a high-quality educational service, we cannot guarantee specific learning 
                outcomes. Our service is provided "as is" without warranties of any kind.
              </p>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Zinga Linga shall not be liable for any indirect, incidental, 
                special, or consequential damages arising from your use of our service.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">8. Termination</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Your Right to Terminate</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may terminate your account at any time by contacting our support team. 
                  Upon termination, your access to paid content will cease, but you may be eligible 
                  for a prorated refund based on our refund policy.
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Our Right to Terminate</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may suspend or terminate your account if you violate these terms, engage in fraudulent activity, 
                  or if we discontinue the service. We will provide reasonable notice when possible.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">9. Changes to These Terms</h2>
            <div className="bg-purple-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update these terms from time to time to reflect changes in our service or legal requirements. 
                We will notify you of significant changes by email or through our service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our service after changes take effect constitutes acceptance of the new terms.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">Questions About These Terms?</h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              If you have any questions about these Terms of Service, please contact us. 
              We're here to help clarify anything you need to know.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <h3 className="font-bold text-brand-dark mb-2">Legal Questions</h3>
                <p className="text-gray-600">legal@zingalinga.com</p>
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