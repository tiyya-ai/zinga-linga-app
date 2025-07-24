import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Send, Clock, Globe } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-pink via-brand-blue to-brand-green">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-8 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-5xl font-mali font-bold mb-6">Contact Us</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We'd love to hear from you! Whether you have questions, feedback, or need support, 
              our friendly team is here to help make your child's learning journey amazing.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            {/* Email */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Email Support</h3>
              <p className="text-gray-600 mb-6">
                Get detailed help and support via email. We typically respond within 24 hours.
              </p>
              <div className="space-y-2">
                <a href="mailto:help@zingalinga.com" className="block text-brand-blue font-bold hover:underline">
                  help@zingalinga.com
                </a>
                <p className="text-sm text-gray-500">General Support</p>
              </div>
              <div className="mt-4 space-y-2">
                <a href="mailto:billing@zingalinga.com" className="block text-brand-blue font-bold hover:underline">
                  billing@zingalinga.com
                </a>
                <p className="text-sm text-gray-500">Billing & Payments</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Phone Support</h3>
              <p className="text-gray-600 mb-6">
                Speak directly with our support team for immediate assistance.
              </p>
              <a href="tel:+15551234567" className="text-2xl font-bold text-brand-green hover:underline block mb-2">
                +1 (555) 123-KIDS
              </a>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Monday - Friday</span>
                </div>
                <p>9:00 AM - 5:00 PM EST</p>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Live Chat</h3>
              <p className="text-gray-600 mb-6">
                Chat with our support team in real-time for quick answers to your questions.
              </p>
              <button className="bg-brand-pink text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-colors">
                Start Chat
              </button>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Usually responds in minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form and Office Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-brand-dark mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-brand-dark mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-brand-dark mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="media">Media & Press</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-brand-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white py-4 px-6 rounded-lg font-bold hover:from-blue-600 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              
              {/* Office Location */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-brand-yellow" />
                  <h3 className="text-2xl font-bold text-brand-dark">Our Office</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-brand-dark mb-2">Zinga Linga Educational Center</h4>
                    <p className="text-gray-700">
                      123 Learning Lane<br />
                      Education District<br />
                      Knowledge City, KC 12345<br />
                      United States
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>Serving families worldwide</span>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-8 h-8 text-brand-blue" />
                  <h3 className="text-2xl font-bold text-brand-dark">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="font-bold text-brand-dark">9:00 AM - 5:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Saturday</span>
                    <span className="font-bold text-brand-dark">10:00 AM - 2:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Our online platform is available 24/7. 
                      Support responses may be delayed on weekends and holidays.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Looking for Quick Answers?</h3>
                <p className="text-gray-700 mb-6">
                  Check out our comprehensive FAQ section for instant answers to common questions.
                </p>
                <button className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">
                  Visit Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
};