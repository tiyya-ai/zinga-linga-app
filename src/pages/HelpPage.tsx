import React, { useState } from 'react';
import { ArrowLeft, Search, HelpCircle, Book, Video, Settings, MessageCircle, Phone, Mail } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface HelpPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBack, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Book },
    { id: 'technical', name: 'Technical Support', icon: Settings },
    { id: 'modules', name: 'Learning Modules', icon: Video },
    { id: 'account', name: 'Account & Billing', icon: MessageCircle },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with Zinga Linga?',
      answer: 'Simply create a parent account, choose a learning module for your child, and let Kiki and Tano guide them through the African alphabet adventure! Each module includes interactive games, videos, and songs designed for different age groups.'
    },
    {
      category: 'getting-started',
      question: 'What age group is Zinga Linga designed for?',
      answer: 'Zinga Linga is perfect for children ages 1-6 years. Our modules are specifically designed with different age ranges: Kiki\'s modules for ages 1-3, and Tano\'s adventures for ages 2-6.'
    },
    {
      category: 'modules',
      question: 'What learning modules are available?',
      answer: 'We currently offer Kiki\'s African Animal Alphabet ($11.00) and Tano\'s Jungle Songs ($6.99). You can also get both in our Complete Adventure Bundle for $14.99 and save $3!'
    },
    {
      category: 'modules',
      question: 'How long does each module take to complete?',
      answer: 'Each module is designed for flexible learning. Children can spend 10-30 minutes per session, and modules can be repeated as many times as they like. The full alphabet adventure typically takes 2-4 weeks of regular play.'
    },
    {
      category: 'technical',
      question: 'What devices can I use Zinga Linga on?',
      answer: 'Zinga Linga works on tablets, smartphones, and computers. We recommend tablets for the best interactive experience. The app works on iOS, Android, and web browsers.'
    },
    {
      category: 'technical',
      question: 'Do I need an internet connection?',
      answer: 'You need an internet connection to download modules initially. Once downloaded, many activities can be enjoyed offline, perfect for car trips or areas with limited connectivity.'
    },
    {
      category: 'account',
      question: 'How do I manage my child\'s progress?',
      answer: 'Parents can log into their dashboard to view detailed progress reports, see which letters your child has mastered, track time spent learning, and celebrate achievements together.'
    },
    {
      category: 'account',
      question: 'Can I get a refund if my child doesn\'t like the modules?',
      answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not completely satisfied, contact our support team for a full refund. We want every child to love learning with Kiki and Tano.'
    },
    {
      category: 'technical',
      question: 'Is my child\'s data safe and private?',
      answer: 'Absolutely! We are COPPA compliant and take children\'s privacy very seriously. We don\'t collect personal information from children, don\'t share data with third parties, and use secure encryption for all data.'
    },
    {
      category: 'modules',
      question: 'Can multiple children use the same account?',
      answer: 'Yes! You can create profiles for multiple children under one parent account. Each child will have their own progress tracking and can learn at their own pace.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <h1 className="text-5xl font-mali font-bold mb-6">Help Center</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions and get the support you need for 
              your child's learning adventure with Kiki and Tano.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 font-mali text-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-12 px-4 bg-brand-yellow/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
              <a href="mailto:help@zingalinga.com" className="text-brand-blue font-bold hover:underline">
                help@zingalinga.com
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <button className="bg-brand-green text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors">
                Start Chat
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us Monday-Friday 9AM-5PM EST</p>
              <a href="tel:+15551234567" className="text-brand-pink font-bold hover:underline">
                +1 (555) 123-KIDS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
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

          {/* FAQ List */}
          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-brand-dark mb-3 flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-brand-blue mt-1 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-500 mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-blue/10 to-brand-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-6">Still Need Help?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Our friendly support team is here to help you and your child have the best 
            possible experience with Zinga Linga.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:help@zingalinga.com"
              className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <button className="bg-brand-green text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-3">
              <MessageCircle className="w-5 h-5" />
              Start Live Chat
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};