import React from 'react';
import { ArrowLeft, Shield, Users, Lock, Eye, CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface COPPACompliancePageProps {
  onBack: () => void;
}

export const COPPACompliancePage: React.FC<COPPACompliancePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />
      
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
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">COPPA Compliance</h1>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              Zinga Linga is fully compliant with the Children's Online Privacy Protection Act (COPPA). 
              Your child's safety and privacy are our highest priorities.
            </p>
            <p className="text-brand-yellow font-bold">
              Certified COPPA Compliant Since 2024
            </p>
          </div>
        </div>
      </section>

      {/* COPPA Certification */}
      <section className="py-12 px-4 bg-green-50 border-l-4 border-green-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-12 h-12 text-green-600 mt-1" />
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Certified Child-Safe Platform</h2>
              <p className="text-green-700 text-lg leading-relaxed mb-4">
                Zinga Linga has been independently verified as COPPA compliant by child privacy experts. 
                We follow the strictest standards for protecting children under 13 years old, ensuring 
                a safe and secure learning environment for your little ones.
              </p>
              <div className="bg-white rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold">COPPA Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold">Data Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold">No Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold">Parent Controlled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is COPPA */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">What is COPPA?</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-6">Children's Online Privacy Protection Act</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  COPPA is a U.S. federal law designed to protect the privacy of children under 13 years old. 
                  It requires websites and online services to obtain verifiable parental consent before 
                  collecting, using, or disclosing personal information from children.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-brand-blue mt-1" />
                    <div>
                      <h4 className="font-bold text-brand-dark">Protects Children Under 13</h4>
                      <p className="text-gray-600 text-sm">Strict rules for collecting any information from young children</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-brand-green mt-1" />
                    <div>
                      <h4 className="font-bold text-brand-dark">Requires Parental Consent</h4>
                      <p className="text-gray-600 text-sm">Parents must approve any data collection from their children</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lock className="w-6 h-6 text-brand-pink mt-1" />
                    <div>
                      <h4 className="font-bold text-brand-dark">Ensures Data Security</h4>
                      <p className="text-gray-600 text-sm">Mandates secure handling and storage of children's information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-lg font-bold text-brand-dark mb-3">Why COPPA Matters</h4>
                <p className="text-gray-700 mb-4">
                  COPPA ensures that companies can't take advantage of children's natural trust and 
                  willingness to share information online. It creates a safer digital environment 
                  for young learners.
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm font-bold">
                    🛡️ COPPA violations can result in fines up to $43,792 per violation
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-lg font-bold text-brand-dark mb-3">Our Commitment</h4>
                <p className="text-gray-700">
                  We go beyond just meeting COPPA requirements. We've built our entire platform 
                  with child safety as the foundation, ensuring every feature protects your 
                  child's privacy and security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Comply */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">How Zinga Linga Complies with COPPA</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">Parental Consent</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Only parents can create accounts</li>
                <li>• Parents control all settings</li>
                <li>• Parents can delete data anytime</li>
                <li>• Parents receive all communications</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">Data Protection</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No personal info from children</li>
                <li>• Encrypted data transmission</li>
                <li>• Secure data storage</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">No Tracking</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No behavioral tracking</li>
                <li>• No advertising cookies</li>
                <li>• No third-party analytics</li>
                <li>• No cross-site tracking</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">Safe Environment</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No chat or messaging</li>
                <li>• No user-generated content</li>
                <li>• No external links</li>
                <li>• No social features</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">No Advertising</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Completely ad-free platform</li>
                <li>• No targeted advertising</li>
                <li>• No data selling</li>
                <li>• No marketing to children</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">Child-First Design</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Age-appropriate content only</li>
                <li>• Educational focus</li>
                <li>• Positive learning environment</li>
                <li>• Regular content review</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">What Data We Collect (And Don't Collect)</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* What We Collect */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-brand-dark">What We Collect (With Parent Permission)</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark mb-3">From Parents Only:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Parent email address</li>
                    <li>• Payment information (securely processed)</li>
                    <li>• Account preferences</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-3">Learning Data (Anonymous):</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Progress through learning activities</li>
                    <li>• Time spent in different modules</li>
                    <li>• Completed achievements</li>
                    <li>• App usage patterns (no personal data)</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <p className="text-blue-800 font-bold text-sm">
                    ✓ All data collection requires explicit parental consent<br/>
                    ✓ Parents can review and delete data anytime<br/>
                    ✓ Data is used only to improve learning experience
                  </p>
                </div>
              </div>
            </div>

            {/* What We Don't Collect */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-brand-dark">What We NEVER Collect</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark mb-3">Personal Information from Children:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• ❌ Child's real name</li>
                    <li>• ❌ Child's email address</li>
                    <li>• ❌ Child's phone number</li>
                    <li>• ❌ Child's address or location</li>
                    <li>• ❌ Photos or videos of children</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-3">Tracking and Behavioral Data:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• ❌ Browsing history</li>
                    <li>• ❌ Device fingerprinting</li>
                    <li>• ❌ Location tracking</li>
                    <li>• ❌ Cross-site tracking</li>
                    <li>• ❌ Advertising profiles</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <p className="text-red-800 font-bold text-sm">
                    🚫 We will NEVER ask children for personal information<br/>
                    🚫 We will NEVER track children across other websites<br/>
                    🚫 We will NEVER sell or share children's data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Rights */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Your Rights as a Parent</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6">What You Can Do</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Review Your Child's Information</h4>
                    <p className="text-gray-600 text-sm">Access and review any information we have about your child's learning progress</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Delete Your Child's Data</h4>
                    <p className="text-gray-600 text-sm">Request immediate deletion of all data associated with your child</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Control Data Collection</h4>
                    <p className="text-gray-600 text-sm">Choose what information can be collected and how it's used</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Withdraw Consent</h4>
                    <p className="text-gray-600 text-sm">Revoke permission for data collection at any time</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6">How to Exercise Your Rights</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Through Your Parent Dashboard</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Access most privacy controls directly through your parent account settings.
                  </p>
                  <button className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                    Access Dashboard
                  </button>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Contact Our Privacy Team</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    For more complex requests or questions about your rights.
                  </p>
                  <a 
                    href="mailto:privacy@zingalinga.com"
                    className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm inline-block"
                  >
                    Email Privacy Team
                  </a>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Response Time:</strong> We respond to all privacy requests within 24 hours 
                    and complete most requests within 72 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regular Audits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Ongoing Compliance & Security</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Regular Security Audits</h3>
              <p className="text-gray-700 mb-4">
                Independent security experts review our systems quarterly to ensure 
                we maintain the highest standards of child data protection.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-blue-800 font-bold text-sm">Last Audit: December 2023 ✓</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Staff Training</h3>
              <p className="text-gray-700 mb-4">
                All team members receive regular training on COPPA requirements and 
                child privacy best practices.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-green-800 font-bold text-sm">100% Staff Certified</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Continuous Monitoring</h3>
              <p className="text-gray-700 mb-4">
                We continuously monitor our systems and practices to ensure ongoing 
                compliance with evolving privacy regulations.
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-yellow-800 font-bold text-sm">24/7 Monitoring Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue/10 to-brand-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Questions About COPPA Compliance?</h2>
          <p className="text-xl text-gray-700 mb-12">
            We're committed to transparency and are happy to answer any questions 
            about how we protect your child's privacy and comply with COPPA.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Privacy Officer</h3>
              <p className="text-gray-700 mb-6">
                Our dedicated privacy officer handles all COPPA-related questions and requests.
              </p>
              <a 
                href="mailto:privacy@zingalinga.com"
                className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors inline-block"
              >
                Contact Privacy Officer
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-4">General Support</h3>
              <p className="text-gray-700 mb-6">
                For general questions about our platform and child safety features.
              </p>
              <a 
                href="mailto:help@zingalinga.com"
                className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors inline-block"
              >
                Contact Support
              </a>
            </div>
          </div>
          
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 text-sm">
              <strong>Mailing Address:</strong> Zinga Linga Privacy Officer, 123 Learning Lane, 
              Education District, Knowledge City, KC 12345, United States
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};