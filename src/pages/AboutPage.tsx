import React, { useState } from 'react';
import { ArrowLeft, Heart, Globe, Users, Award, BookOpen, Music, Video } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GoToTopWithProgress } from '../components/GoToTop';
import { Kiki, Tano } from '../components/Characters';

interface AboutPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-mali">
      <Header onLoginClick={() => {}} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-blue via-brand-pink to-brand-red">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-8 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-5xl font-mali font-bold mb-6">About Zinga Linga</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Bringing African culture and alphabet learning together in a magical, 
              educational adventure for children ages 1-6.
            </p>
            
            <div className="flex justify-center items-center gap-12 mb-8">
              <div className="text-center">
                <Kiki className="mx-auto mb-2 scale-75" />
                <p className="font-bold">Meet Kiki</p>
              </div>
              <div className="text-center">
                <Tano className="mx-auto mb-2 scale-75" />
                <p className="font-bold">Meet Tano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-brand-green mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Zinga Linga was born from a simple belief: learning should be an adventure! 
                We wanted to create something special that would help children discover the 
                alphabet while celebrating the rich, vibrant culture of Africa.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our founders, passionate about both education and cultural diversity, 
                noticed that most alphabet learning tools lacked cultural richness. 
                That's when Kiki and Tano came to life - two lovable characters who 
                would guide children through the African alphabet adventure.
              </p>
              <div className="flex items-center gap-3 text-brand-red">
                <Heart className="w-6 h-6" />
                <span className="font-bold text-lg">Made with love for children's education</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-brand-yellow/20 to-brand-green/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Why Zinga Linga?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-brand-blue mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Cultural Learning</h4>
                    <p className="text-gray-600">Discover African animals, stories, and traditions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-brand-green mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Educational Excellence</h4>
                    <p className="text-gray-600">Research-based learning methods for young minds</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-brand-pink mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Family-Friendly</h4>
                    <p className="text-gray-600">Safe, age-appropriate content for children</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Our Mission</h2>
          <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            To make learning the alphabet an exciting, culturally rich adventure that 
            sparks curiosity, builds confidence, and celebrates the beautiful diversity 
            of African culture.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Educational Excellence</h3>
              <p className="text-gray-600">
                Every module is designed with child development experts to ensure 
                effective and engaging learning experiences.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Cultural Celebration</h3>
              <p className="text-gray-600">
                We proudly showcase African heritage through authentic stories, 
                animals, and traditions that enrich the learning journey.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Child-Centered Design</h3>
              <p className="text-gray-600">
                Everything we create puts children first - from safety and privacy 
                to age-appropriate content and intuitive interfaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">What Makes Us Special</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Interactive Learning Adventures</h3>
              <p className="text-lg text-gray-700 mb-6">
                Our modules aren't just videos or games - they're complete adventures! 
                Children join Kiki and Tano on journeys through the African savanna, 
                meeting amazing animals and learning letters along the way.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-brand-blue" />
                  <span>Animated video stories</span>
                </li>
                <li className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-brand-pink" />
                  <span>Catchy alphabet songs</span>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                  <span>Interactive touch games</span>
                </li>
              </ul>
            </div>
            
            <div className="order-1 md:order-2 bg-gradient-to-br from-brand-blue/10 to-brand-pink/10 rounded-3xl p-8">
              <div className="text-center">
                <div className="flex justify-center gap-8 mb-4">
                  <Kiki className="scale-50" />
                  <Tano className="scale-50" />
                </div>
                <p className="text-brand-dark font-bold">
                  "Learning is always more fun with friends!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-green/10 to-brand-blue/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Our Values</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in everything we create.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Inclusivity</h3>
              <p className="text-gray-600">
                Every child deserves access to quality educational content.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Care</h3>
              <p className="text-gray-600">
                We care deeply about children's safety, privacy, and well-being.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Culture</h3>
              <p className="text-gray-600">
                We celebrate and honor African heritage in all our content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
      
      {/* Go to Top Button */}
      <GoToTopWithProgress showAfter={300} />
    </div>
  );
};