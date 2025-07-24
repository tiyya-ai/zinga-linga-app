import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShoppingCart, 
  Play, 
  Download, 
  Star, 
  Clock, 
  Award, 
  TrendingUp,
  BookOpen,
  Video,
  Music,
  Gamepad2,
  Heart,
  Share2,
  Settings,
  LogOut,
  CheckCircle,
  Lock,
  Gift,
  Crown,
  Zap
} from 'lucide-react';
import { realDatabase } from '../utils/realDatabase';

interface RealUserDashboardProps {
  user: any;
  onLogout: () => void;
}

export const RealUserDashboard: React.FC<RealUserDashboardProps> = ({ user, onLogout }) => {
  const [userPurchases, setUserPurchases] = useState<any[]>([]);
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Get user's purchases
      const allPurchases = await realDatabase.getAllPurchases();
      const myPurchases = allPurchases.filter(p => p.userId === user.id);
      setUserPurchases(myPurchases);

      // Get available modules (this would come from your module database)
      const modules = [
        {
          id: 'kiki-letters-1',
          title: "Kiki's African Animal Alphabet",
          description: "Learn the alphabet with amazing African animals!",
          character: 'kiki',
          price: 11.00,
          ageRange: '1-3 years',
          rating: 4.9,
          totalRatings: 1247,
          duration: '45 minutes',
          activities: 26,
          preview: true
        },
        {
          id: 'tano-songs-1',
          title: "Tano's Jungle Songs",
          description: "Sing along with Tano in the African jungle!",
          character: 'tano',
          price: 6.99,
          ageRange: '2-6 years',
          rating: 4.8,
          totalRatings: 892,
          duration: '30 minutes',
          activities: 15,
          preview: true
        },
        {
          id: 'kiki-numbers-1',
          title: "Kiki's Counting Safari",
          description: "Count with Kiki on an exciting African safari!",
          character: 'kiki',
          price: 9.99,
          ageRange: '2-5 years',
          rating: 4.7,
          totalRatings: 634,
          duration: '35 minutes',
          activities: 20,
          preview: false
        }
      ];
      setAvailableModules(modules);

      // Calculate user stats
      const completedPurchases = myPurchases.filter(p => p.status === 'completed');
      const totalSpent = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
      const modulesOwned = completedPurchases.reduce((acc, p) => acc + p.moduleIds.length, 0);
      
      setUserStats({
        totalSpent,
        modulesOwned,
        totalPurchases: myPurchases.length,
        memberSince: new Date(user.createdAt).toLocaleDateString(),
        lastActivity: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (moduleId: string, price: number) => {
    try {
      const purchase = await realDatabase.recordPurchase({
        userId: user.id,
        moduleIds: [moduleId],
        amount: price,
        paymentMethod: 'Credit Card'
      });

      // In a real app, you'd integrate with Stripe or another payment processor here
      // For demo purposes, we'll immediately confirm the payment
      await realDatabase.confirmPayment(purchase.id);
      
      // Reload user data to show the new purchase
      await loadUserData();
      
      alert('Purchase successful! You now have access to this module.');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-pink to-brand-red flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-mali text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const ownedModuleIds = userPurchases
    .filter(p => p.status === 'completed')
    .flatMap(p => p.moduleIds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-pink to-brand-red">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-yellow to-brand-red rounded-full flex items-center justify-center">
                <span className="text-white font-mali font-bold text-xl">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-mali font-bold text-white">
                  Welcome back, {user.profile?.parentName || user.name}!
                </h1>
                <p className="font-mali text-white/80">
                  {user.profile?.childName ? `${user.profile.childName}'s Learning Journey` : 'Your Learning Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-white/80 hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors font-mali"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-brand-yellow" />
              <div>
                <h3 className="text-2xl font-mali font-bold text-white">{userStats?.modulesOwned || 0}</h3>
                <p className="font-mali text-white/80">Modules Owned</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8 text-brand-green" />
              <div>
                <h3 className="text-2xl font-mali font-bold text-white">${userStats?.totalSpent?.toFixed(2) || '0.00'}</h3>
                <p className="font-mali text-white/80">Total Invested</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-brand-pink" />
              <div>
                <h3 className="text-lg font-mali font-bold text-white">{userStats?.memberSince}</h3>
                <p className="font-mali text-white/80">Member Since</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-brand-red" />
              <div>
                <h3 className="text-lg font-mali font-bold text-white">{userStats?.lastActivity}</h3>
                <p className="font-mali text-white/80">Last Activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real User Info */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-mali font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-6 h-6" />
            Your Real Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-mali font-bold text-white mb-2">Account Details</h3>
              <div className="space-y-2 text-white/80 font-mali">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Account Type:</strong> Real User Account</p>
              </div>
            </div>
            {user.profile && (
              <div>
                <h3 className="font-mali font-bold text-white mb-2">Child Information</h3>
                <div className="space-y-2 text-white/80 font-mali">
                  {user.profile.childName && <p><strong>Child's Name:</strong> {user.profile.childName}</p>}
                  {user.profile.childAge && <p><strong>Child's Age:</strong> {user.profile.childAge} years old</p>}
                  <p><strong>Recommended Content:</strong> Ages {user.profile.childAge ? `${Math.max(1, user.profile.childAge - 1)}-${user.profile.childAge + 2}` : '1-6'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Modules */}
        <div className="mb-8">
          <h2 className="text-3xl font-mali font-bold text-white mb-6">Available Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => {
              const isOwned = ownedModuleIds.includes(module.id);
              
              return (
                <div key={module.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                  {isOwned && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-mali font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      OWNED
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      module.character === 'kiki' ? 'bg-brand-yellow' : 'bg-brand-pink'
                    }`}>
                      <span className="text-white font-mali font-bold text-2xl">
                        {module.character === 'kiki' ? 'K' : 'T'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-mali font-bold text-white mb-2">{module.title}</h3>
                    <p className="font-mali text-white/80 text-sm mb-3">{module.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-white/70 font-mali mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {module.activities} activities
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(module.rating) ? 'text-brand-yellow fill-current' : 'text-white/30'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-white/80 font-mali text-sm">
                        {module.rating} ({module.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-mali font-bold text-white">
                      ${module.price}
                    </div>
                    
                    {isOwned ? (
                      <button className="bg-green-500 text-white px-6 py-2 rounded-full font-mali font-bold flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Play Now
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {module.preview && (
                          <button className="bg-white/20 text-white px-4 py-2 rounded-full font-mali font-bold hover:bg-white/30 transition-colors">
                            Preview
                          </button>
                        )}
                        <button 
                          onClick={() => handlePurchase(module.id, module.price)}
                          className="bg-gradient-to-r from-brand-yellow to-brand-red text-white px-6 py-2 rounded-full font-mali font-bold hover:from-brand-yellow hover:to-brand-red transition-all flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase History */}
        {userPurchases.length > 0 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-mali font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Your Purchase History
            </h2>
            <div className="space-y-4">
              {userPurchases.map((purchase) => (
                <div key={purchase.id} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mali font-bold text-white">
                      Order #{purchase.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-mali text-white/80 text-sm">
                      {new Date(purchase.createdAt).toLocaleDateString()} • {purchase.moduleIds.length} module(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mali font-bold text-white">${purchase.amount.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                      purchase.status === 'completed' ? 'bg-green-500 text-white' :
                      purchase.status === 'pending' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {purchase.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};