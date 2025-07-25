import React, { useState, useEffect } from 'react';
import { Module, User, Purchase } from '../types';
import { dataStore } from '../utils/dataStore';
import { 
  Package, 
  Users, 
  DollarSign,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Star,
  ShoppingCart,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Target,
  Award,
  Globe,
  Settings,
  Save,
  X,
  ArrowRight,
  UserCheck,
  Package2,
  CreditCard,
  Activity
} from 'lucide-react';

interface ProductUserManagementProps {
  modules: Module[];
  users: User[];
  purchases: Purchase[];
  onModulesUpdate: (modules: Module[]) => void;
  onRefresh: () => void;
}

export const ProductUserManagement: React.FC<ProductUserManagementProps> = ({
  modules,
  users,
  purchases,
  onModulesUpdate,
  onRefresh
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'users' | 'sales'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Module | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Calculate product-user statistics
  const getProductStats = (moduleId: string) => {
    const moduleUsers = users.filter(user => 
      user.purchasedModules?.includes(moduleId)
    );
    const modulePurchases = purchases.filter(purchase => 
      purchase.moduleIds.includes(moduleId) && purchase.status === 'completed'
    );
    const revenue = modulePurchases.reduce((sum, purchase) => {
      const module = modules.find(m => m.id === moduleId);
      return sum + (module?.price || 0);
    }, 0);

    return {
      totalUsers: moduleUsers.length,
      totalPurchases: modulePurchases.length,
      revenue,
      recentUsers: moduleUsers.slice(0, 5)
    };
  };

  // Get user's product statistics
  const getUserProductStats = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userPurchases = purchases.filter(p => p.userId === userId && p.status === 'completed');
    const userModules = modules.filter(m => user?.purchasedModules?.includes(m.id));
    
    return {
      totalProducts: userModules.length,
      totalSpent: user?.totalSpent || 0,
      recentPurchases: userPurchases.slice(0, 3),
      favoriteCategory: userModules.length > 0 ? userModules[0].category : 'none'
    };
  };

  // Toggle product visibility
  const toggleProductVisibility = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, isVisible: !module.isVisible }
        : module
    );
    onModulesUpdate(updatedModules);
  };

  // Toggle product active status
  const toggleProductActive = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, isActive: !module.isActive }
        : module
    );
    onModulesUpdate(updatedModules);
  };

  // Filter products based on search
  const filteredProducts = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overall statistics
  const overallStats = {
    totalProducts: modules.length,
    activeProducts: modules.filter(m => m.isActive).length,
    visibleProducts: modules.filter(m => m.isVisible).length,
    totalUsers: users.length,
    totalRevenue: purchases
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalSales: purchases.filter(p => p.status === 'completed').length,
    averageOrderValue: purchases.filter(p => p.status === 'completed').length > 0 
      ? purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) / purchases.filter(p => p.status === 'completed').length 
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Product & User Management</h3>
          <p className="font-mali text-gray-600">Manage products and track user engagement</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'sales', label: 'Sales', icon: DollarSign }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mali font-medium transition-all ${
                activeView === view.id
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Dashboard */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2 lg:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
              </div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{overallStats.totalProducts}</h3>
              <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Products</p>
              <p className="font-mali opacity-75 text-xs mt-1">{overallStats.activeProducts} active</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2 lg:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
              </div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{overallStats.totalUsers}</h3>
              <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Users</p>
              <p className="font-mali opacity-75 text-xs mt-1">{users.filter(u => u.role === 'user').length} customers</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2 lg:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
              </div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">${overallStats.totalRevenue.toFixed(0)}</h3>
              <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Revenue</p>
              <p className="font-mali opacity-75 text-xs mt-1">${overallStats.averageOrderValue.toFixed(2)} avg order</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2 lg:mb-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
              </div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{overallStats.totalSales}</h3>
              <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Sales</p>
              <p className="font-mali opacity-75 text-xs mt-1">{purchases.filter(p => p.status === 'pending').length} pending</p>
            </div>
          </div>

          {/* Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-4">Top Performing Products</h4>
              <div className="space-y-4">
                {modules
                  .map(module => ({
                    ...module,
                    stats: getProductStats(module.id)
                  }))
                  .sort((a, b) => b.stats.revenue - a.stats.revenue)
                  .slice(0, 5)
                  .map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-mali font-bold text-gray-800">{module.title}</h5>
                        <p className="font-mali text-gray-600 text-sm">{module.stats.totalUsers} users • ${module.stats.revenue.toFixed(2)} revenue</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                          module.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {module.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => setActiveView('products')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-4">Recent Customer Activity</h4>
              <div className="space-y-4">
                {users
                  .filter(u => u.role === 'user')
                  .map(user => ({
                    ...user,
                    stats: getUserProductStats(user.id)
                  }))
                  .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
                  .slice(0, 5)
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                          <span className="text-white font-mali font-bold text-sm">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h5 className="font-mali font-bold text-gray-800">{user.name}</h5>
                          <p className="font-mali text-gray-600 text-sm">{user.stats.totalProducts} products • ${(user.totalSpent || 0).toFixed(2)} spent</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveView('users')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products View */}
      {activeView === 'products' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali w-full"
                />
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShowProductModal(true);
                }}
                className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((module) => {
              const stats = getProductStats(module.id);
              return (
                <div key={module.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Product Header */}
                  <div className={`p-4 ${
                    module.character === 'kiki' 
                      ? 'bg-gradient-to-br from-brand-yellow/10 to-brand-red/10' 
                      : 'bg-gradient-to-br from-brand-pink/10 to-brand-red/10'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-mali font-bold text-gray-800 text-lg mb-1">{module.title}</h4>
                        <p className="font-mali text-gray-600 text-sm">{module.ageRange} • {module.character}</p>
                      </div>
                      <span className="font-mali font-bold text-brand-green text-lg">${module.price}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                        module.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {module.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                        module.isVisible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {module.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-mali font-bold text-sm">{module.rating}</span>
                      <span className="font-mali text-gray-600 text-xs">({module.totalRatings})</span>
                    </div>
                  </div>

                  {/* Product Stats */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="font-mali font-bold text-blue-600">{stats.totalUsers}</div>
                        <div className="font-mali text-blue-600 text-xs">Users</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-mali font-bold text-green-600">{stats.totalPurchases}</div>
                        <div className="font-mali text-green-600 text-xs">Sales</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="font-mali font-bold text-purple-600">${stats.revenue.toFixed(0)}</div>
                        <div className="font-mali text-purple-600 text-xs">Revenue</div>
                      </div>
                    </div>

                    {/* Recent Users */}
                    {stats.recentUsers.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-mali font-bold text-gray-700 text-sm mb-2">Recent Users</h5>
                        <div className="flex -space-x-2">
                          {stats.recentUsers.slice(0, 4).map((user) => (
                            <div
                              key={user.id}
                              className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center border-2 border-white"
                              title={user.name}
                            >
                              <span className="text-white font-mali font-bold text-xs">{user.name.charAt(0)}</span>
                            </div>
                          ))}
                          {stats.recentUsers.length > 4 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-gray-600 font-mali font-bold text-xs">+{stats.recentUsers.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleProductVisibility(module.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                            module.isVisible
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {module.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {module.isVisible ? 'Hide' : 'Show'}
                        </button>

                        <button
                          onClick={() => toggleProductActive(module.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                            module.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {module.isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {module.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(module);
                            setShowProductModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-mali font-bold text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              const updatedModules = modules.filter(m => m.id !== module.id);
                              onModulesUpdate(updatedModules);
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-mali font-bold text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users View */}
      {activeView === 'users' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali w-full"
              />
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers
              .filter(user => user.role === 'user')
              .map((user) => {
                const stats = getUserProductStats(user.id);
                const userModules = modules.filter(m => user.purchasedModules?.includes(m.id));
                
                return (
                  <div key={user.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    {/* User Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                        <span className="text-white font-mali font-bold text-xl">{user.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-mali font-bold text-gray-800 text-lg">{user.name}</h4>
                        <p className="font-mali text-gray-600 text-sm">{user.email}</p>
                        <p className="font-mali text-gray-500 text-xs">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-mali font-bold text-blue-600 text-lg">{stats.totalProducts}</div>
                        <div className="font-mali text-blue-600 text-xs">Products Owned</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-mali font-bold text-green-600 text-lg">${stats.totalSpent.toFixed(0)}</div>
                        <div className="font-mali text-green-600 text-xs">Total Spent</div>
                      </div>
                    </div>

                    {/* User's Products */}
                    {userModules.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-mali font-bold text-gray-700 text-sm mb-2">Owned Products</h5>
                        <div className="space-y-2">
                          {userModules.slice(0, 3).map((module) => (
                            <div key={module.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="font-mali text-gray-800 text-sm">{module.title}</span>
                              <span className="font-mali text-gray-600 text-xs">${module.price}</span>
                            </div>
                          ))}
                          {userModules.length > 3 && (
                            <div className="text-center p-2 bg-gray-100 rounded-lg">
                              <span className="font-mali text-gray-600 text-xs">+{userModules.length - 3} more products</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('sales')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-mali font-bold text-sm"
                      >
                        <CreditCard className="w-4 h-4" />
                        View Orders
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to user details
                          console.log('View user details:', user.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-mali font-bold text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Sales View */}
      {activeView === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="text-xl font-mali font-bold text-gray-800 mb-4">Recent Sales</h4>
            <div className="space-y-4">
              {purchases
                .filter(p => p.status === 'completed')
                .slice(0, 10)
                .map((purchase) => {
                  const user = users.find(u => u.id === purchase.userId);
                  const purchaseModules = modules.filter(m => purchase.moduleIds.includes(m.id));
                  
                  return (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-mali font-bold text-gray-800">{user?.name || 'Unknown User'}</h5>
                          <p className="font-mali text-gray-600 text-sm">
                            {purchaseModules.map(m => m.title).join(', ')}
                          </p>
                          <p className="font-mali text-gray-500 text-xs">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mali font-bold text-green-600 text-lg">${purchase.amount.toFixed(2)}</div>
                        <div className="font-mali text-gray-600 text-sm">{purchase.paymentMethod}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};