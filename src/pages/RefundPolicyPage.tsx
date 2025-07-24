import React from 'react';
import { ArrowLeft, DollarSign, Clock, CheckCircle, AlertCircle, Mail, CreditCard } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface RefundPolicyPageProps {
  onBack: () => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onBack }) => {
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
              <DollarSign className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Refund Policy</h1>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              We want every child to love learning with Kiki and Tano. If you're not completely 
              satisfied, we offer a hassle-free refund policy.
            </p>
            <p className="text-brand-yellow font-bold">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* 30-Day Guarantee */}
      <section className="py-12 px-4 bg-green-50 border-l-4 border-green-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-12 h-12 text-green-600 mt-1" />
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">30-Day Money-Back Guarantee</h2>
              <p className="text-green-700 text-lg leading-relaxed mb-4">
                We're confident your child will love learning with Kiki and Tano! If for any reason 
                you're not completely satisfied with your purchase, we offer a full refund within 
                30 days of purchase - no questions asked.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-green-800 font-bold">
                  ✓ Full refund within 30 days<br/>
                  ✓ No questions asked<br/>
                  ✓ Quick and easy process<br/>
                  ✓ Money back to original payment method
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Request a Refund */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">How to Request a Refund</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Step by Step Process */}
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-8">Simple 3-Step Process</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-dark mb-2">Contact Our Support Team</h4>
                    <p className="text-gray-700 mb-3">
                      Send us an email with your refund request. Include your order number and 
                      the email address used for purchase.
                    </p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 font-bold">Email: refunds@zingalinga.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-dark mb-2">We Process Your Request</h4>
                    <p className="text-gray-700 mb-3">
                      Our team will review your request and confirm your refund within 24 hours. 
                      No lengthy forms or complicated procedures.
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 font-bold">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-dark mb-2">Receive Your Refund</h4>
                    <p className="text-gray-700 mb-3">
                      Your refund will be processed back to your original payment method within 
                      5-10 business days, depending on your bank or card provider.
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-yellow-800 font-bold">5-10 business days to your account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-8 h-8 text-brand-blue" />
                  <h3 className="text-xl font-bold text-brand-dark">Refund Support</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Email Address</h4>
                    <p className="text-gray-700">refunds@zingalinga.com</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Response Time</h4>
                    <p className="text-gray-700">Within 24 hours (usually much faster)</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Business Hours</h4>
                    <p className="text-gray-700">Monday - Friday, 9 AM - 5 PM EST</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href="mailto:refunds@zingalinga.com"
                    className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors inline-block"
                  >
                    Request Refund
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4">What to Include in Your Email</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Your order number or transaction ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Email address used for purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Reason for refund (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Any feedback to help us improve</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Refund Timeline</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-8 h-8 text-brand-blue" />
                  <h3 className="text-xl font-bold text-brand-dark">Processing Times</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3">Request Acknowledgment</h4>
                    <p className="text-gray-700 mb-2">Within 24 hours</p>
                    <p className="text-sm text-gray-600">
                      We'll confirm receipt of your refund request and provide a timeline.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3">Refund Processing</h4>
                    <p className="text-gray-700 mb-2">1-2 business days</p>
                    <p className="text-sm text-gray-600">
                      We process the refund on our end and send it to your payment provider.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3">Credit Card Refunds</h4>
                    <p className="text-gray-700 mb-2">3-5 business days</p>
                    <p className="text-sm text-gray-600">
                      Most credit card refunds appear within 3-5 business days.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-brand-dark mb-3">Bank Account Refunds</h4>
                    <p className="text-gray-700 mb-2">5-10 business days</p>
                    <p className="text-sm text-gray-600">
                      Bank transfers and debit card refunds may take longer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Circumstances */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Special Circumstances</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-brand-dark">After 30 Days</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                While our standard policy is 30 days, we understand that sometimes circumstances 
                are beyond your control. If you have a special situation, please contact us anyway.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-bold text-brand-dark mb-2">We may still help if:</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• You experienced technical issues preventing use</li>
                  <li>• There was a billing error or duplicate charge</li>
                  <li>• You have a medical or family emergency</li>
                  <li>• The content was not as described</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-brand-dark">Payment Method Issues</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                If your original payment method is no longer valid (expired card, closed account), 
                we can work with you to find an alternative refund method.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-bold text-brand-dark mb-2">Alternative options:</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Refund to a different card</li>
                  <li>• Bank transfer (with verification)</li>
                  <li>• Store credit for future purchases</li>
                  <li>• PayPal refund (if available)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partial Refunds */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Bundle and Partial Refunds</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">How Bundle Refunds Work</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-brand-dark mb-3">Complete Bundle Refund</h4>
                  <p className="text-gray-700 mb-3">
                    If you purchased our Complete Adventure Bundle and want a full refund, 
                    we'll refund the entire bundle price ($14.99).
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Example:</strong> Bundle purchase → Full $14.99 refund
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-brand-dark mb-3">Partial Module Refund</h4>
                  <p className="text-gray-700 mb-3">
                    If you only want to return one module from a bundle, we'll calculate 
                    a fair partial refund based on individual module prices.
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Example:</strong> Keep Kiki's module, return Tano's → $6.99 refund
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-brand-dark mb-3">Individual Module Refunds</h4>
                  <p className="text-gray-700 mb-3">
                    Individual module purchases are refunded at their full purchase price.
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Kiki's Letters Hunt:</strong> $11.00 refund<br/>
                      <strong>Tano's Jungle Songs:</strong> $6.99 refund
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Refund FAQ</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">Do I need to give a reason for the refund?</h3>
                <p className="text-gray-700">
                  No, you don't need to provide a reason. However, we appreciate feedback 
                  as it helps us improve our products for other families.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">Can I get a refund if my child used the modules?</h3>
                <p className="text-gray-700">
                  Yes! Our 30-day guarantee applies regardless of usage. We want you to 
                  try the full experience before deciding.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">What if I can't find my order number?</h3>
                <p className="text-gray-700">
                  No problem! Just provide the email address used for purchase and 
                  approximate purchase date. We can locate your order.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">Are there any refund fees?</h3>
                <p className="text-gray-700">
                  No, we don't charge any fees for processing refunds. You'll receive 
                  the full amount you paid.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">Can I exchange for a different module instead?</h3>
                <p className="text-gray-700">
                  Absolutely! We can process an exchange instead of a refund. Just let 
                  us know which module you'd prefer.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-brand-dark mb-3">What happens to my child's progress data?</h3>
                <p className="text-gray-700">
                  Progress data is automatically removed when a refund is processed. 
                  We can provide a summary report before deletion if requested.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Refunds */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue/10 to-brand-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Ready to Request a Refund?</h2>
          <p className="text-xl text-gray-700 mb-12">
            We're here to make the process as simple and quick as possible. 
            Contact our refund team today.
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Email Refund Request</h3>
                <p className="text-gray-700 mb-6">
                  Send us your refund request and we'll process it within 24 hours.
                </p>
                <a 
                  href="mailto:refunds@zingalinga.com?subject=Refund Request&body=Order Number:%0D%0AEmail Address:%0D%0AReason (optional):"
                  className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors inline-block"
                >
                  Email Refund Team
                </a>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Need Help?</h3>
                <p className="text-gray-700 mb-6">
                  Have questions about our refund policy? Contact our support team.
                </p>
                <a 
                  href="mailto:help@zingalinga.com"
                  className="bg-brand-green text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors inline-block"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};