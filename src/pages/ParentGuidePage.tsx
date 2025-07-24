import React from 'react';
import { ArrowLeft, BookOpen, Users, Clock, Star, Shield, Heart, Play, Settings, Award } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Kiki, Tano } from '../components/Characters';

interface ParentGuidePageProps {
  onBack: () => void;
}

export const ParentGuidePage: React.FC<ParentGuidePageProps> = ({ onBack }) => {
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
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-mali font-bold mb-6">Parent Guide</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Everything you need to know to help your child get the most out of 
              their Zinga Linga learning adventure with Kiki and Tano.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Getting Started</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Step 1: Create Account</h3>
              <p className="text-gray-700">
                Sign up for a parent account to access the dashboard and track your child's progress.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Step 2: Choose Module</h3>
              <p className="text-gray-700">
                Select the perfect learning module based on your child's age and interests.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Step 3: Start Learning</h3>
              <p className="text-gray-700">
                Let your child explore and learn with Kiki and Tano while you track their progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Age-Appropriate Learning */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Age-Appropriate Learning</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Choosing the Right Module</h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <Kiki className="scale-50" />
                    <div>
                      <h4 className="text-xl font-bold text-brand-dark">Ages 1-3: Kiki's Adventures</h4>
                      <p className="text-gray-600">Perfect for toddlers and early learners</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Simple letter recognition</li>
                    <li>• Touch-and-learn interactions</li>
                    <li>• Short 5-10 minute sessions</li>
                    <li>• Bright colors and simple sounds</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <Tano className="scale-50" />
                    <div>
                      <h4 className="text-xl font-bold text-brand-dark">Ages 2-6: Tano's Adventures</h4>
                      <p className="text-gray-600">Great for preschoolers and kindergarteners</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Advanced alphabet concepts</li>
                    <li>• Story-based learning</li>
                    <li>• 15-30 minute sessions</li>
                    <li>• Cultural storytelling elements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-brand-dark mb-6">Learning Tips for Parents</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-brand-blue mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Set Regular Learning Times</h4>
                    <p className="text-gray-600 text-sm">Consistency helps children develop learning habits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-brand-green mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Learn Together</h4>
                    <p className="text-gray-600 text-sm">Join your child's learning journey for better engagement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-brand-yellow mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Celebrate Progress</h4>
                    <p className="text-gray-600 text-sm">Acknowledge achievements to build confidence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-brand-pink mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-dark">Create Safe Space</h4>
                    <p className="text-gray-600 text-sm">Ensure a comfortable, distraction-free learning environment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Tracking Your Child's Progress</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-6">Parent Dashboard Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📊</span>
                    </div>
                    <span className="text-gray-700">Detailed progress reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⏱️</span>
                    </div>
                    <span className="text-gray-700">Time spent learning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏆</span>
                    </div>
                    <span className="text-gray-700">Achievements and milestones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📈</span>
                    </div>
                    <span className="text-gray-700">Learning trends and patterns</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Understanding Progress Reports</h3>
                <p className="text-gray-700 mb-4">
                  Our progress reports show you exactly how your child is developing their alphabet skills:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Letter Recognition:</strong> Which letters your child has mastered</li>
                  <li>• <strong>Engagement Level:</strong> How actively they participate in activities</li>
                  <li>• <strong>Learning Speed:</strong> How quickly they're progressing</li>
                  <li>• <strong>Favorite Activities:</strong> What they enjoy most</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Encouraging Your Child</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-brand-green mb-3">Positive Reinforcement</h4>
                  <p className="text-gray-700 mb-3">
                    Celebrate every small victory! When your child learns a new letter or completes an activity:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Give specific praise: "You did great with the letter A!"</li>
                    <li>• Use encouraging words: "I'm proud of how hard you tried!"</li>
                    <li>• Share their excitement about African animals they've learned</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-brand-blue mb-3">When They Struggle</h4>
                  <p className="text-gray-700 mb-3">
                    Every child learns at their own pace. If your child is having difficulty:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Take breaks and return to activities later</li>
                    <li>• Focus on one letter at a time</li>
                    <li>• Use real-world examples to reinforce learning</li>
                    <li>• Contact our support team for personalized tips</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-brand-pink mb-3">Making It Fun</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Sing the alphabet songs together</li>
                    <li>• Act out the African animal movements</li>
                    <li>• Draw letters and animals after learning sessions</li>
                    <li>• Create stories about Kiki and Tano's adventures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Screen Time */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-green text-center mb-12">Safety & Screen Time Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-brand-green" />
                <h3 className="text-2xl font-bold text-brand-dark">Child Safety</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Privacy Protection</h4>
                  <p className="text-gray-700 text-sm">
                    We're COPPA compliant and never collect personal information from children. 
                    All data is securely encrypted and protected.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Ad-Free Environment</h4>
                  <p className="text-gray-700 text-sm">
                    No advertisements, pop-ups, or external links that could lead children away 
                    from their learning experience.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Age-Appropriate Content</h4>
                  <p className="text-gray-700 text-sm">
                    All content is carefully reviewed by child development experts to ensure 
                    it's appropriate and beneficial for young learners.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-brand-blue" />
                <h3 className="text-2xl font-bold text-brand-dark">Screen Time Recommendations</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Ages 1-2 Years</h4>
                  <p className="text-gray-700 text-sm mb-2">5-10 minutes per session, with parent participation</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-800">
                      Focus on simple interactions and sounds. Sit with your child and narrate what's happening.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Ages 3-4 Years</h4>
                  <p className="text-gray-700 text-sm mb-2">15-20 minutes per session, 1-2 times daily</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-800">
                      Children can engage more independently but benefit from occasional guidance and encouragement.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-brand-dark mb-2">Ages 5-6 Years</h4>
                  <p className="text-gray-700 text-sm mb-2">20-30 minutes per session, as part of learning routine</p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      Can handle longer sessions and more complex activities. Great for reinforcing school learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-8">Need More Help?</h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            We're here to support you and your child's learning journey every step of the way.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Help Center</h3>
              <p className="text-gray-700 mb-6">
                Browse our comprehensive FAQ and troubleshooting guides.
              </p>
              <button className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors">
                Visit Help Center
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Parent Community</h3>
              <p className="text-gray-700 mb-6">
                Connect with other parents and share learning experiences.
              </p>
              <button className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">
                Join Community
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">Personal Support</h3>
              <p className="text-gray-700 mb-6">
                Get one-on-one help from our child learning specialists.
              </p>
              <button className="bg-brand-pink text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};