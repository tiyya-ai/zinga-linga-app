import React, { useState } from 'react';
import { User, Module, ContentItem, Cart as CartType, CartItem } from '../types';
import { modules, bundleOffers } from '../data/modules';
import { Kiki, Tano } from './Characters';
import { Cart } from './Cart';
import { CompactCheckout } from './CompactCheckout';
import { 
  Play, 
  Lock, 
  Star, 
  ShoppingCart, 
  Video, 
  Music, 
  Gamepad2, 
  Clock,
  LogOut,
  User as UserIcon,
  BookOpen,
  Gift,
  Crown,
  Sparkles,
  Award,
  TrendingUp,
  Calendar,
  Heart,
  Download,
  Settings,
  Bell,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  Trash2,
  Plus,
  Filter,
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Bookmark,
  Share2,
  MessageCircle,
  ThumbsUp,
  RefreshCw,
  Zap,
  Target,
  Trophy,
  Flame,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onPurchase: (moduleIds: string[]) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onPurchase }) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [playingContent, setPlayingContent] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-content' | 'store' | 'progress'>('dashboard');
  const [cart, setCart] = useState<CartType>({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const purchasedModules = modules.filter(module => 
    user.purchasedModules.includes(module.id)
  );

  const availableModules = modules.filter(module => 
    !user.purchasedModules.includes(module.id)
  );

  const addToCart = (item: CartItem) => {
    const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      return;
    }

    const newCart = {
      items: [...cart.items, item],
      total: cart.total + item.price
    };
    setCart(newCart);
    setShowCart(true);
  };

  const removeFromCart = (itemId: string) => {
    const itemToRemove = cart.items.find(item => item.id === itemId);
    if (!itemToRemove) return;

    const newCart = {
      items: cart.items.filter(item => item.id !== itemId),
      total: cart.total - itemToRemove.price
    };
    setCart(newCart);
  };

  const handleAddModuleToCart = (module: Module) => {
    const cartItem: CartItem = {
      id: module.id,
      title: module.title,
      price: module.price,
      type: 'module',
      moduleIds: [module.id]
    };
    addToCart(cartItem);
  };

  const handleAddBundleToCart = () => {
    const bundle = bundleOffers[0];
    if (!bundle) return;

    const cartItem: CartItem = {
      id: bundle.id,
      title: bundle.title,
      price: bundle.bundlePrice,
      type: 'bundle',
      moduleIds: bundle.modules
    };
    addToCart(cartItem);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePaymentComplete = () => {
    const moduleIds: string[] = [];
    cart.items.forEach(item => {
      if (item.moduleIds) {
        moduleIds.push(...item.moduleIds);
      }
    });
    
    onPurchase(moduleIds);
    setCart({ items: [], total: 0 });
    setShowCheckout(false);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
    setShowCart(true);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const isContentAccessible = (content: ContentItem, moduleId: string) => {
    if (user.purchasedModules.includes(moduleId)) {
      return true;
    }
    return content.isDemo || content.id.includes('demo');
  };

  const ContentPlayer = ({ content }: { content: ContentItem }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-mali font-bold text-gray-800">{content.title}</h3>
          <button 
            onClick={() => setPlayingContent(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-pink rounded-2xl flex items-center justify-center mb-6">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {getContentIcon(content.type)}
            </div>
            <p className="font-mali text-lg">
              {content.isDemo ? 'Demo Content' : 'Full Content'} - {content.duration}
            </p>
            <p className="font-mali text-sm opacity-80 mt-2">
              {content.type === 'video' && 'Interactive video experience'}
              {content.type === 'audio' && 'Musical learning adventure'}
              {content.type === 'game' && 'Interactive learning game'}
            </p>
          </div>
        </div>
        
        {content.isDemo && (
          <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-4 text-center">
            <p className="font-mali text-brand-yellow font-bold">
              🎉 This is a free demo! Purchase the full module to unlock all content.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const ProgressCard = ({ title, progress, icon: Icon, color }: {
    title: string;
    progress: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-mali font-bold text-gray-800">{title}</h3>
          <p className="font-mali text-sm text-gray-600">{progress}% Complete</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color.replace('bg-', 'bg-')}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/zinga linga logo.png" 
                alt="Zinga Linga" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-mali font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent">
                  Welcome back, {user.name}! 🌟
                </h1>
                <p className="font-mali text-gray-600">Ready for your next adventure?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 bg-brand-blue/10 px-4 py-2 rounded-full hover:bg-brand-blue/20 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 text-brand-blue" />
                <span className="font-mali text-brand-blue font-bold">Cart</span>
                {cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-mali font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-brand-green/10 to-brand-blue/10 px-4 py-2 rounded-full">
                  <UserIcon className="w-4 h-4 text-brand-green" />
                  <span className="font-mali text-brand-green font-bold">
                    {user.purchasedModules.length} Module{user.purchasedModules.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-mali">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'my-content', label: 'My Content', icon: BookOpen },
            { id: 'store', label: 'Store', icon: ShoppingCart },
            { id: 'progress', label: 'Progress', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-mali font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-green to-brand-blue text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-yellow via-brand-pink to-brand-red rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-30">
                <Kiki className="scale-75" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-mali font-bold mb-4">🎉 Your Learning Journey</h2>
                <p className="text-xl font-mali mb-6 opacity-90">
                  You've unlocked {user.purchasedModules.length} learning adventure{user.purchasedModules.length !== 1 ? 's' : ''}!
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveTab('my-content')}
                    className="bg-white text-brand-red font-mali font-bold py-3 px-6 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    Continue Learning
                  </button>
                  <button 
                    onClick={() => setActiveTab('store')}
                    className="bg-white/20 text-white font-mali font-bold py-3 px-6 rounded-2xl hover:bg-white/30 transition-colors"
                  >
                    Explore More
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-brand-green rounded-full">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-mali font-bold text-gray-800">{user.purchasedModules.length}</h3>
                    <p className="font-mali text-gray-600">Modules Owned</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-brand-blue rounded-full">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-mali font-bold text-gray-800">
                      {purchasedModules.reduce((total, module) => total + module.fullContent.length, 0)}
                    </h3>
                    <p className="font-mali text-gray-600">Activities Available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-brand-pink rounded-full">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-mali font-bold text-gray-800">
                      ${user.totalSpent?.toFixed(2) || '0.00'}
                    </h3>
                    <p className="font-mali text-gray-600">Total Investment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Continue Your Adventure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedModules.slice(0, 3).map(module => (
                  <div key={module.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`rounded-full p-2 ${
                        module.character === 'kiki' 
                          ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                          : 'bg-gradient-to-br from-brand-pink to-brand-red'
                      }`}>
                        {module.character === 'kiki' ? <Kiki className="scale-25" /> : <Tano className="scale-25" />}
                      </div>
                      <div>
                        <h4 className="font-mali font-bold text-gray-800">{module.title}</h4>
                        <p className="font-mali text-sm text-gray-600">{module.fullContent.length} activities</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('my-content')}
                      className="w-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-2 px-4 rounded-xl hover:scale-105 transition-transform"
                    >
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Content Tab */}
        {activeTab === 'my-content' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">Your Learning Library</h2>
              <p className="text-xl font-mali text-gray-600">Access all your purchased content</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map(module => {
                const isPurchased = user.purchasedModules.includes(module.id);
                
                return (
                  <div key={module.id} className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow relative ${!isPurchased ? 'opacity-50' : ''}`}>
                    {!isPurchased && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded-3xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-12 h-12 mx-auto mb-4" />
                          <p className="font-mali font-bold">Not Purchased</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`rounded-full p-3 ${
                        module.character === 'kiki' 
                          ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                          : 'bg-gradient-to-br from-brand-pink to-brand-red'
                      }`}>
                        {module.character === 'kiki' ? <Kiki className="scale-50" /> : <Tano className="scale-50" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-mali font-bold text-gray-800">{module.title}</h3>
                        <p className="font-mali text-gray-600 text-sm">{module.ageRange}</p>
                      </div>
                    </div>
                    
                    {isPurchased && (
                      <div className="space-y-3">
                        {module.fullContent.map((content) => (
                          <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                content.type === 'video' ? 'bg-brand-blue/20 text-brand-blue' :
                                content.type === 'audio' ? 'bg-brand-pink/20 text-brand-pink' :
                                'bg-brand-green/20 text-brand-green'
                              }`}>
                                {getContentIcon(content.type)}
                              </div>
                              <div>
                                <p className="font-mali font-bold text-gray-800 text-sm">{content.title}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{content.duration}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setPlayingContent(content)}
                              className="bg-brand-green text-white p-2 rounded-full hover:bg-brand-green/80 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Store Tab */}
        {activeTab === 'store' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-mali font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent mb-4">
                🌟 Learning Store
              </h2>
              <p className="text-xl font-mali text-gray-700">
                Discover amazing new adventures for your little explorer!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {availableModules.map(module => (
                <div key={module.id} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-brand-yellow/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`rounded-full p-4 ${
                      module.character === 'kiki' 
                        ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                        : 'bg-gradient-to-br from-brand-pink to-brand-red'
                    }`}>
                      {module.character === 'kiki' ? <Kiki className="scale-75" /> : <Tano className="scale-75" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-mali font-bold text-gray-800">{module.title}</h3>
                      <p className="font-mali text-gray-600">{module.ageRange}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(module.rating) ? 'text-brand-yellow fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm font-mali text-gray-600">({module.totalRatings})</span>
                      </div>
                    </div>
                  </div>

                  <p className="font-mali text-gray-700 mb-6">{module.description}</p>

                  <div className="mb-6">
                    <h4 className="font-mali font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-yellow" />
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                          <span className="font-mali">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-mali font-bold text-brand-green">${module.price}</div>
                      <button
                        onClick={() => handleAddModuleToCart(module)}
                        className="bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                    <p className="font-mali text-gray-500 text-sm text-center">One-time purchase • Lifetime access</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Offer */}
            {availableModules.length > 1 && bundleOffers.length > 0 && (
              <div className="bg-gradient-to-r from-brand-yellow to-brand-red rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center">
                  <h3 className="text-3xl font-mali font-bold mb-4">🎉 {bundleOffers[0].title}</h3>
                  <p className="font-mali text-white/90 text-lg mb-6">
                    {bundleOffers[0].description}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-2xl font-mali text-white/70 line-through">${bundleOffers[0].originalPrice.toFixed(2)}</span>
                    <span className="text-4xl font-mali font-bold">${bundleOffers[0].bundlePrice.toFixed(2)}</span>
                    <span className="bg-brand-red text-white px-3 py-1 rounded-full text-sm font-mali font-bold">SAVE ${bundleOffers[0].savings.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleAddBundleToCart}
                    className="bg-white text-brand-red font-mali font-bold py-4 px-12 rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg text-xl flex items-center gap-3 mx-auto"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">Learning Progress</h2>
              <p className="text-xl font-mali text-gray-600">Track your amazing journey!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressCard
                title="Overall Progress"
                progress={75}
                icon={TrendingUp}
                color="bg-brand-green"
              />
              <ProgressCard
                title="Video Lessons"
                progress={60}
                icon={Video}
                color="bg-brand-blue"
              />
              <ProgressCard
                title="Audio Adventures"
                progress={80}
                icon={Music}
                color="bg-brand-pink"
              />
              <ProgressCard
                title="Interactive Games"
                progress={45}
                icon={Gamepad2}
                color="bg-brand-yellow"
              />
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Achievements 🏆</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h4 className="font-mali font-bold text-gray-800">First Purchase</h4>
                    <p className="font-mali text-sm text-gray-600">Unlocked your first module!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Star className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-mali font-bold text-gray-800">Learning Streak</h4>
                    <p className="font-mali text-sm text-gray-600">7 days in a row!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <Heart className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-mali font-bold text-gray-800">Explorer</h4>
                    <p className="font-mali text-sm text-gray-600">Completed 10 activities!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Player Modal */}
      {playingContent && <ContentPlayer content={playingContent} />}

      {/* Cart Modal */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CompactCheckout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        onSuccess={handlePaymentComplete}
        user={user}
      />
    </div>
  );
};

