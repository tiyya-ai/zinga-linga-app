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
  Menu,
  X as XIcon,
  Home as HomeIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onPurchase: (moduleIds: string[]) => void;
}

// Reusable NavButton component for desktop
const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mali font-bold transition-all ${
      active
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

// Mobile NavButton with larger touch targets
const MobileNavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mali font-bold text-left transition-all ${
      active
        ? 'bg-white/20 text-white'
        : 'text-white/90 hover:bg-white/10'
    }`}
  >
    <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-white/10'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-lg">{label}</span>
  </button>
);

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onPurchase }) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [playingContent, setPlayingContent] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-content' | 'store' | 'favorites'>('dashboard');
  const [cart, setCart] = useState<CartType>({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoriteModules, setFavoriteModules] = useState<string[]>([]);

  const purchasedModules = modules.filter(module => 
    user.purchasedModules.includes(module.id)
  );

  const availableModules = modules.filter(module => 
    !user.purchasedModules.includes(module.id) && 
    module.isVisible !== false && 
    module.isActive !== false
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
    return content.isDemo || content.id.includes('preview');
  };

  const ContentPlayer = ({ content }: { content: ContentItem }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-mali font-bold text-gray-800">{content.title}</h3>
          <button 
            onClick={() => setPlayingContent(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-pink rounded-2xl flex items-center justify-center mb-6">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {getContentIcon(content.type)}
            </div>
            <p className="font-mali text-lg">
              {content.isDemo ? 'Preview Content' : 'Full Content'} - {content.duration}
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
              🎉 This is a free preview! Purchase the full module to unlock all content.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Menu-Style Header */}
      <header className="bg-gradient-to-r from-brand-green via-brand-blue to-brand-pink shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden mr-2 p-2 text-white hover:bg-white/10 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <img 
                src="/zinga linga logo.png" 
                alt="Zinga Linga" 
                className="h-12 sm:h-16 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavButton 
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                icon={TrendingUp}
                label="Home"
              />
              <NavButton 
                active={activeTab === 'my-content'}
                onClick={() => setActiveTab('my-content')}
                icon={BookOpen}
                label="My Learning"
              />
              <NavButton 
                active={activeTab === 'store'}
                onClick={() => setActiveTab('store')}
                icon={ShoppingCart}
                label="Store"
              />
              <NavButton 
                active={activeTab === 'favorites'}
                onClick={() => setActiveTab('favorites')}
                icon={Heart}
                label="Favorites"
              />
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-mali font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-mali font-bold text-sm">{user.name.charAt(0)}</span>
                </div>
                <span className="hidden sm:block text-white font-mali font-bold text-sm">{user.name}</span>
              </div>

              {/* Logout */}
              <button 
                onClick={onLogout}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg font-mali font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </button>
              <button
                onClick={() => setActiveTab('my-content')}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg font-mali font-bold transition-all ${
                  activeTab === 'my-content'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-xs">Learning</span>
              </button>
              <button
                onClick={() => setActiveTab('store')}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg font-mali font-bold transition-all ${
                  activeTab === 'store'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Store</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg font-mali font-bold transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs">Favorites</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white/10 backdrop-blur-sm rounded-xl mt-2 p-4`}>
            <nav className="flex flex-col gap-2">
              <MobileNavButton 
                active={activeTab === 'dashboard'}
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                icon={HomeIcon}
                label="Home"
              />
              <MobileNavButton 
                active={activeTab === 'my-content'}
                onClick={() => {
                  setActiveTab('my-content');
                  setMobileMenuOpen(false);
                }}
                icon={BookOpen}
                label="My Learning"
              />
              <MobileNavButton 
                active={activeTab === 'store'}
                onClick={() => {
                  setActiveTab('store');
                  setMobileMenuOpen(false);
                }}
                icon={ShoppingCart}
                label="Store"
              />
              <MobileNavButton 
                active={activeTab === 'favorites'}
                onClick={() => {
                  setActiveTab('favorites');
                  setMobileMenuOpen(false);
                }}
                icon={Heart}
                label="Favorites"
              />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-green via-brand-blue to-brand-pink rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-20">
                <Sparkles className="w-16 h-16 text-white/30" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-mali font-bold mb-4">Welcome back, {user.name.split(' ')[0]}! 🌟</h2>
                <p className="text-lg sm:text-xl font-mali mb-6 opacity-90">
                  You've unlocked {user.purchasedModules.length} learning adventure{user.purchasedModules.length !== 1 ? 's' : ''}!
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
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

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
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

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
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
            {/* Enhanced Header Section */}
            <div className="bg-gradient-to-r from-brand-green via-brand-blue to-brand-pink rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-20">
                <BookOpen className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mali font-bold mb-4">📚 Your Learning Library</h2>
                <p className="text-lg sm:text-xl font-mali mb-6 opacity-90">
                  {purchasedModules.length > 0 
                    ? `${purchasedModules.length} amazing adventure${purchasedModules.length !== 1 ? 's' : ''} waiting for you!`
                    : 'Start your learning journey today!'
                  }
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <Play className="w-4 h-4" />
                    <span className="font-mali font-bold text-sm">
                      {purchasedModules.reduce((total, module) => total + module.fullContent.length, 0)} Activities
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="font-mali font-bold text-sm">Hours of Fun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search your content..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali w-full sm:w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali">
                    <option>All Content</option>
                    <option>Videos</option>
                    <option>Audio</option>
                    <option>Games</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access Section */}
            {purchasedModules.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-mali font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-yellow" />
                  Continue Learning
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchasedModules.slice(0, 3).map(module => (
                    <div key={module.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`rounded-full p-2 ${
                          module.character === 'kiki' 
                            ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                            : 'bg-gradient-to-br from-brand-pink to-brand-red'
                        }`}>
                          {module.character === 'kiki' ? <Kiki className="scale-25" /> : <Tano className="scale-25" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-mali font-bold text-gray-800 text-sm">{module.title}</h4>
                          <p className="font-mali text-xs text-gray-600">Last activity: Today</p>
                        </div>
                        <div className="text-right">
                          <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center">
                            <span className="text-brand-green font-mali font-bold text-xs">75%</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setPlayingContent(module.fullContent[0])}
                        className="w-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform text-sm flex items-center justify-center gap-2"
                      >
                        <Play className="w-3 h-3" />
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {modules.map(module => {
                const isPurchased = user.purchasedModules.includes(module.id);
                
                return (
                  <div key={module.id} className={`bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${!isPurchased ? 'opacity-60' : 'hover:scale-[1.02]'}`}>
                    {/* Module Header */}
                    <div className={`p-4 sm:p-6 ${
                      module.character === 'kiki' 
                        ? 'bg-gradient-to-br from-brand-yellow/10 to-brand-red/10' 
                        : 'bg-gradient-to-br from-brand-pink/10 to-brand-red/10'
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`rounded-full p-3 ${
                          module.character === 'kiki' 
                            ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                            : 'bg-gradient-to-br from-brand-pink to-brand-red'
                        } shadow-lg`}>
                          {module.character === 'kiki' ? <Kiki className="scale-50" /> : <Tano className="scale-50" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">{module.title}</h3>
                          <p className="font-mali text-gray-600 text-sm">{module.ageRange}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(module.rating) ? 'text-brand-yellow fill-current' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-xs font-mali text-gray-600">({module.totalRatings})</span>
                          </div>
                        </div>
                        {isPurchased && (
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-mali font-bold">
                              OWNED
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar for Purchased Modules */}
                      {isPurchased && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-mali text-gray-600">Progress</span>
                            <span className="text-sm font-mali font-bold text-brand-green">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-brand-green to-brand-blue h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content List */}
                    <div className="p-4 sm:p-6">
                      {!isPurchased ? (
                        <div className="text-center py-8">
                          <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="font-mali font-bold text-gray-600 mb-2">Preview Available</p>
                          <p className="font-mali text-gray-500 text-sm mb-4">Get full access to all {module.fullContent.length} activities</p>
                          <button
                            onClick={() => {
                              setActiveTab('store');
                            }}
                            className="bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform text-sm"
                          >
                            Unlock Now - ${module.price}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-mali font-bold text-gray-800">Activities ({module.fullContent.length})</h4>
                          </div>
                          
                          {module.fullContent.map((content, index) => (
                            <div key={content.id} className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  content.type === 'video' ? 'bg-brand-blue/20 text-brand-blue' :
                                  content.type === 'audio' ? 'bg-brand-pink/20 text-brand-pink' :
                                  'bg-brand-green/20 text-brand-green'
                                } group-hover:scale-110 transition-transform`}>
                                  {getContentIcon(content.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-mali font-bold text-gray-800 text-sm truncate">{content.title}</p>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{content.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      <span>Watched</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    console.log('Added to favorites');
                                  }}
                                  className="p-2 text-gray-400 hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setPlayingContent(content)}
                                  className="bg-brand-green text-white p-2 rounded-full hover:bg-brand-green/80 transition-all duration-200 hover:scale-110 shadow-lg"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* Module Actions */}
                          <div className="pt-4 border-t border-gray-200 mt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="font-mali">Last played: Today</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-brand-green transition-colors">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
              <h2 className="text-3xl sm:text-4xl font-mali font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent mb-4">
                🌟 Learning Store
              </h2>
              <p className="text-lg sm:text-xl font-mali text-gray-700">
                Discover amazing new adventures for your little explorer!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
              {availableModules.map(module => (
                <div key={module.id} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-brand-yellow/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`rounded-full p-4 ${
                      module.character === 'kiki' 
                        ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                        : 'bg-gradient-to-br from-brand-pink to-brand-red'
                    }`}>
                      {module.character === 'kiki' ? <Kiki className="scale-75" /> : <Tano className="scale-75" />}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-mali font-bold text-gray-800">{module.title}</h3>
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
                      <div className="text-2xl sm:text-3xl font-mali font-bold text-brand-green">${module.price}</div>
                      <button
                        onClick={() => handleAddModuleToCart(module)}
                        className="bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-3 px-6 sm:px-8 rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                    <p className="font-mali text-gray-500 text-sm text-center">One-time purchase • Lifetime access</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Offer */}
            {availableModules.length > 1 && bundleOffers.length > 0 && (
              <div className="bg-gradient-to-r from-brand-yellow to-brand-red rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-mali font-bold mb-4">🎉 {bundleOffers[0].title}</h3>
                  <p className="font-mali text-white/90 text-base sm:text-lg mb-6">
                    {bundleOffers[0].description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <span className="text-xl sm:text-2xl font-mali text-white/70 line-through">${bundleOffers[0].originalPrice.toFixed(2)}</span>
                    <span className="text-3xl sm:text-4xl font-mali font-bold">${bundleOffers[0].bundlePrice.toFixed(2)}</span>
                    <span className="bg-brand-red text-white px-3 py-1 rounded-full text-sm font-mali font-bold">SAVE ${bundleOffers[0].savings.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleAddBundleToCart}
                    className="bg-white text-brand-red font-mali font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg sm:text-xl flex items-center gap-3 mx-auto"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-mali font-bold text-gray-800 mb-4">Your Favorites ❤️</h2>
              <p className="text-lg sm:text-xl font-mali text-gray-600">Quick access to your most loved content</p>
            </div>

            {/* Recently Played */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-mali font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                Recently Played
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchasedModules.slice(0, 3).map(module => (
                  <div key={module.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`rounded-full p-2 ${
                        module.character === 'kiki' 
                          ? 'bg-gradient-to-br from-brand-yellow to-brand-red' 
                          : 'bg-gradient-to-br from-brand-pink to-brand-red'
                      }`}>
                        {module.character === 'kiki' ? <Kiki className="scale-25" /> : <Tano className="scale-25" />}
                      </div>
                      <div>
                        <h4 className="font-mali font-bold text-gray-800 text-sm">{module.title}</h4>
                        <p className="font-mali text-xs text-gray-600">Last played today</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('my-content')}
                      className="w-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform text-sm"
                    >
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-brand-yellow to-brand-red rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Bookmark className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-mali font-bold">Bookmarks</h3>
                    <p className="text-white/80 font-mali">Save your favorite moments</p>
                  </div>
                </div>
                <button className="bg-white/20 text-white font-mali font-bold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                  View All Bookmarks
                </button>
              </div>

              <div className="bg-gradient-to-br from-brand-green to-brand-blue rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-mali font-bold">Downloads</h3>
                    <p className="text-white/80 font-mali">Offline learning content</p>
                  </div>
                </div>
                <button className="bg-white/20 text-white font-mali font-bold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                  Manage Downloads
                </button>
              </div>
            </div>

            {/* Learning Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-mali font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-yellow" />
                Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h4 className="font-mali font-bold text-gray-800">Learning Streak</h4>
                    <p className="font-mali text-sm text-gray-600">5 days in a row! 🔥</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <Star className="w-8 h-8 text-green-600" />
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
