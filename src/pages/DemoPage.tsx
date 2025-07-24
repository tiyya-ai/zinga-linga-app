import React from 'react';
import { ArrowLeft, Play, Volume2, Gamepad2, Star, Heart, Download } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface DemoPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-yellow/20 via-white to-brand-blue/20">
      <Header onLoginClick={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mali font-bold">Back to Home</span>
          </button>
          
          <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-mali font-bold text-gray-800 mb-6">
            Experience the Magic of Learning!
          </h2>
          <p className="text-xl text-gray-600 font-mali max-w-3xl mx-auto mb-8">
            Try our interactive demos and see how Kiki and Tano make learning the African alphabet 
            fun and engaging for children ages 1-6.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-brand-yellow">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-mali font-bold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-brand-pink">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-mali font-bold">1,200+ Happy Families</span>
            </div>
          </div>
        </div>

        {/* Demo Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Kiki's Alphabet Demo */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-green to-brand-blue p-6 text-white">
              <h3 className="text-2xl font-mali font-bold mb-2">Kiki's African Animal Alphabet</h3>
              <p className="font-mali opacity-90">Learn letters A-Z with amazing African animals!</p>
            </div>
            
            <div className="p-6">
              {/* Demo Video Placeholder */}
              <div className="bg-gray-100 rounded-2xl aspect-video mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-blue/20"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Play className="w-8 h-8 text-brand-blue ml-1" />
                  </div>
                  <p className="font-mali font-bold text-gray-700">Click to Play Demo</p>
                  <p className="font-mali text-gray-500 text-sm">Letter A - Antelope Adventure</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-brand-green" />
                  <span className="font-mali text-gray-700">Native pronunciation audio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-brand-blue" />
                  <span className="font-mali text-gray-700">Interactive animal games</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-brand-yellow" />
                  <span className="font-mali text-gray-700">Beautiful illustrations</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-brand-green to-brand-blue text-white py-3 px-4 rounded-xl font-mali font-bold hover:shadow-lg transition-all">
                  Try Full Demo
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tano's Songs Demo */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-yellow to-brand-red p-6 text-white">
              <h3 className="text-2xl font-mali font-bold mb-2">Tano's Jungle Songs</h3>
              <p className="font-mali opacity-90">Discover African music and cultural stories!</p>
            </div>
            
            <div className="p-6">
              {/* Demo Video Placeholder */}
              <div className="bg-gray-100 rounded-2xl aspect-video mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 to-brand-red/20"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Play className="w-8 h-8 text-brand-red ml-1" />
                  </div>
                  <p className="font-mali font-bold text-gray-700">Click to Play Demo</p>
                  <p className="font-mali text-gray-500 text-sm">African Drum Circle</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-brand-yellow" />
                  <span className="font-mali text-gray-700">Traditional African music</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-brand-red" />
                  <span className="font-mali text-gray-700">Rhythm matching games</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-brand-yellow" />
                  <span className="font-mali text-gray-700">Cultural storytelling</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-brand-yellow to-brand-red text-white py-3 px-4 rounded-xl font-mali font-bold hover:shadow-lg transition-all">
                  Try Full Demo
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-brand-green to-brand-blue rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl font-mali font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-xl font-mali mb-6 opacity-90">
            Join over 1,200 families who are already enjoying our educational adventures!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-blue px-8 py-3 rounded-xl font-mali font-bold hover:shadow-lg transition-all">
              Get Full Access - $11.00
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-mali font-bold hover:bg-white hover:text-brand-blue transition-all">
              Bundle Deal - $14.99
            </button>
          </div>
        </div>
        </div>
      </section>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
};