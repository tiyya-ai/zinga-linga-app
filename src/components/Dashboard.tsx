import React, { useState } from 'react';
import { User, Module, ContentItem, Cart as CartType, CartItem } from '../types';
import { modules, bundleOffers } from '../data/modules';
import { Kiki, Tano } from './Characters';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
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
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onPurchase: (moduleIds: string[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onPurchase }) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [playingContent, setPlayingContent] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'my-content' | 'store'>('my-content');
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
    // Check if item already exists in cart
    const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      return; // Don't add duplicate items
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
    const bundle = bundleOffers[0]; // Assuming first bundle
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
    // Extract all module IDs from cart items
    const moduleIds: string[] = [];
    cart.items.forEach(item => {
      if (item.moduleIds) {
        moduleIds.push(...item.moduleIds);
      }
    });
    
    // Call the purchase function with all module IDs
    onPurchase(moduleIds);
    
    // Clear cart
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
    // If module is purchased, all content is accessible
    if (user.purchasedModules.includes(moduleId)) {
      return true;
    }
    
    // If module is not purchased, only demo content and first video are accessible
    return content.isDemo || content.id.includes('demo') || 
           (content.type === 'video' && content === modules.find(m => m.id === moduleId)?.fullContent.find(c => c.type === 'video'));
  };

  const getFirstVideoContent = (module: Module) => {
    return module.fullContent.find(content => content.type === 'video');
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

  const LockedContentItem = ({ content, moduleId }: { content: ContentItem; moduleId: string }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 opacity-75">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <p className="font-mali font-bold text-gray-600 text-sm">{content.title}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{content.duration}</span>
            <span className="bg-gray-400 text-white px-2 py-0.5 rounded-full">LOCKED</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-brand-yellow" />
        <span className="text-xs font-mali text-gray-600">Premium</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-brand-yellow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/zinga linga logo.png" 
                alt="Zinga Linga" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-mali font-bold text-brand-green">
                  Welcome back, {user.name}!
                </h1>
                <p className="font-mali text-gray-600">Ready for more jungle adventures?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
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

              <div className="flex items-center gap-2 bg-brand-green/10 px-4 py-2 rounded-full">
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
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('my-content')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-mali font-bold transition-all ${
              activeTab === 'my-content'
                ? 'bg-brand-green text-white shadow-lg'
                : 'bg-white text-brand-green hover:bg-brand-green/10'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            My Content
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-mali font-bold transition-all ${
              activeTab === 'store'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'bg-white text-brand-blue hover:bg-brand-blue/10'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Store
          </button>
        </div>

        {/* My Content Tab */}
        {activeTab === 'my-content' && (
          <div>
            {/* Show all modules - purchased and unpurchased */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map(module => {
                const isPurchased = user.purchasedModules.includes(module.id);
                const firstVideo = getFirstVideoContent(module);
                
                return (
                  <div key={module.id} className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow relative ${!isPurchased ? 'border-2 border-dashed border-brand-yellow' : ''}`}>
                    {/* Premium Badge for unpurchased modules */}
                    {!isPurchased && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-brand-yellow to-brand-red text-white px-3 py-1 rounded-full text-sm font-mali font-bold flex items-center gap-1 shadow-lg">
                        <Crown className="w-4 h-4" />
                        Premium
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
                        {!isPurchased && (
                          <p className="font-mali text-brand-yellow text-xs font-bold">Limited Access</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {module.fullContent.map((content, index) => {
                        const isAccessible = isContentAccessible(content, module.id);
                        
                        if (!isAccessible) {
                          return <LockedContentItem key={content.id} content={content} moduleId={module.id} />;
                        }
                        
                        return (
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
                                  {content.isDemo && <span className="bg-brand-yellow text-white px-2 py-0.5 rounded-full">DEMO</span>}
                                  {!isPurchased && index === 0 && <span className="bg-brand-green text-white px-2 py-0.5 rounded-full">FREE</span>}
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
                        );
                      })}
                    </div>
                    
                    {/* Purchase button for unpurchased modules */}
                    {!isPurchased && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="font-mali text-gray-600 text-sm mb-3">
                            Unlock all {module.fullContent.length} activities
                          </p>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-2xl font-mali font-bold text-brand-green">${module.price}</span>
                            <Sparkles className="w-5 h-5 text-brand-yellow" />
                          </div>
                          <button
                            onClick={() => handleAddModuleToCart(module)}
                            className="w-full bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-3 px-6 rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Empty state if no modules */}
            {modules.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-3xl p-12 max-w-md mx-auto shadow-lg">
                  <Gift className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-mali font-bold text-gray-800 mb-4">
                    No Adventures Yet!
                  </h3>
                  <p className="font-mali text-gray-600 mb-6">
                    Purchase your first module to start the jungle adventure with Kiki and Tano!
                  </p>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                  >
                    Explore Store
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Store Tab */}
        {activeTab === 'store' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-mali font-bold text-brand-green mb-4">
                🌟 Jungle Learning Store
              </h2>
              <p className="text-xl font-mali text-gray-700">
                Unlock amazing adventures for your little explorer!
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

                  {/* Content Preview */}
                  <div className="mb-6">
                    <h4 className="font-mali font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-yellow" />
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
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

            {/* No modules available */}
            {availableModules.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-3xl p-12 max-w-md mx-auto shadow-lg">
                  <Crown className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-mali font-bold text-gray-800 mb-4">
                    All Adventures Unlocked!
                  </h3>
                  <p className="font-mali text-gray-600">
                    You have access to all available content. Check back for new adventures!
                  </p>
                </div>
              </div>
            )}
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
      <Checkout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        onPaymentComplete={handlePaymentComplete}
        onBackToCart={handleBackToCart} user={user}
      />
    </div>
  );
};
