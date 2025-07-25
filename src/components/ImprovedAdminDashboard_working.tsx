import React, { useState, useEffect } from 'react';
import { User, Module, Purchase, Analytics, ContentFile } from '../types';
import { dataStore } from '../utils/dataStore';
import { notificationService } from '../utils/notificationService';
import { EnhancedOrderManagement } from '../components/EnhancedOrderManagement';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  LogOut,
  Shield,
  Package,
  Activity,
  RefreshCw,
  FileText,
  Home,
  // Bell, // Removed unused import
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Monitor,
  X
} from 'lucide-react';

interface ImprovedAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const ImprovedAdminDashboard: React.FC<ImprovedAdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'modules' | 'content' | 'purchases' | 'analytics' | 'reports' | 'settings' | 'system' | 'support'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load real data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load data from storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = dataStore.loadData();
      setUsers(data.users);
      setModules(data.modules);
      setPurchases(data.purchases);
      setContentFiles(data.contentFiles || []);
      
      // Set real notifications count
      const pendingCount = data.purchases.filter(p => p.status === 'pending').length;
      setNotifications(pendingCount);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced sidebar menu items with better organization
  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      badge: null,
      description: 'Overview & quick stats'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      badge: users.length,
      description: 'Manage user accounts'
    },
    { 
      id: 'modules', 
      label: 'Modules', 
      icon: Package, 
      badge: modules.length,
      description: 'Learning content modules'
    },
    { 
      id: 'content', 
      label: 'Content', 
      icon: BookOpen, 
      badge: contentFiles.length,
      description: 'Media & file library'
    },
    { 
      id: 'purchases', 
      label: 'Orders', 
      icon: ShoppingCart, 
      badge: purchases.filter(p => p.status === 'pending').length,
      description: 'Orders & payments'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      badge: null,
      description: 'Performance insights'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      badge: null,
      description: 'Generate reports'
    },
    { 
      id: 'system', 
      label: 'System', 
      icon: Monitor, 
      badge: null,
      description: 'System monitoring'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      badge: null,
      description: 'App configuration'
    },
    { 
      id: 'support', 
      label: 'Support', 
      icon: HelpCircle, 
      badge: notifications,
      description: 'Help & support'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="font-mali text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 transition-all duration-300 z-50 ${
        isMobile 
          ? showMobileSidebar 
            ? 'w-80 translate-x-0' 
            : 'w-80 -translate-x-full'
          : sidebarCollapsed 
            ? 'w-20' 
            : 'w-80'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-brand-blue/5 to-brand-pink/5">
          <div className="flex items-center justify-between">
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-brand-blue to-brand-pink rounded-lg shadow-lg">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Admin Panel</h1>
                  <p className="text-xs sm:text-sm font-mali text-gray-600">Zinga Linga Management</p>
                </div>
              </div>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 sm:p-4 space-y-2 flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
          {sidebarItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (isMobile) {
                    setShowMobileSidebar(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-mali font-medium transition-all relative ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-brand-blue to-brand-pink text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-brand-pink/10 hover:text-gray-900 hover:shadow-md'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!sidebarCollapsed || isMobile) && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm sm:text-base">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${
                        activeTab === item.id 
                          ? 'bg-white text-brand-blue' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-green to-brand-blue rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-mali font-bold text-base sm:text-lg">{user.name.charAt(0)}</span>
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex-1">
                <p className="font-mali font-bold text-gray-800 text-sm sm:text-base">{user.name}</p>
                <p className="font-mali text-gray-600 text-xs sm:text-sm capitalize">{user.role} Account</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 font-mali font-medium shadow-sm hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            {(!sidebarCollapsed || isMobile) && <span className="text-sm sm:text-base">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-80'
      }`}>
        {/* Enhanced Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-mali font-bold text-gray-800 capitalize truncate">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Refresh Button */}
              <button 
                onClick={loadData}
                className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* System Status - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="font-mali text-green-600 font-bold text-sm">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">
                    Welcome to the Admin Dashboard, {user.name}!
                  </h2>
                  <p className="font-mali text-gray-600 text-lg mb-6">
                    Manage your Zinga Linga Trae platform with ease. Monitor users, modules, orders, and system performance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab - SIMPLE TEST VERSION */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Test Header */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h1 className="text-4xl font-mali font-bold text-gray-800 mb-4">
                  🎉 Reports Page Test - SUCCESS!
                </h1>
                <p className="text-xl font-mali text-gray-600 mb-4">
                  If you can see this, the reports section is rendering correctly!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-mali text-green-800">
                    ✅ Component is working! Data: Users: {users.length}, Modules: {modules.length}, Purchases: {purchases.length}
                  </p>
                </div>
              </div>

              {/* Test Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-mali font-bold text-gray-800">{users.length}</h4>
                      <p className="font-mali text-gray-600">Actual Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-mali font-bold text-gray-800">
                        ${purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                      </h4>
                      <p className="font-mali text-gray-600">Actual Revenue</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100">
                      <ShoppingCart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-mali font-bold text-gray-800">{purchases.length}</h4>
                      <p className="font-mali text-gray-600">Actual Orders</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-mali font-bold text-gray-800">{modules.length}</h4>
                      <p className="font-mali text-gray-600">Actual Modules</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h4 className="text-2xl font-mali font-bold text-gray-800 mb-6">Debug Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-lg font-mali font-bold text-gray-800 mb-4">Component Status</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Rendering:</span>
                        <span className="font-mali font-bold text-green-600">✅ Success</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Data Loading:</span>
                        <span className="font-mali font-bold text-green-600">✅ Complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">CSS Classes:</span>
                        <span className="font-mali font-bold text-green-600">✅ Applied</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Icons:</span>
                        <span className="font-mali font-bold text-green-600">✅ Loaded</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-mali font-bold text-gray-800 mb-4">Data Summary</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-mali text-blue-800 text-sm">
                          Users Array Length: {users.length}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-mali text-green-800 text-sm">
                          Modules Array Length: {modules.length}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-mali text-purple-800 text-sm">
                          Purchases Array Length: {purchases.length}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="font-mali text-yellow-800 text-sm">
                          Active Tab: {activeTab}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders/Purchases Tab */}
          {activeTab === 'purchases' && (
            <div>
              <EnhancedOrderManagement 
                purchases={purchases}
                users={users}
                modules={modules}
                searchTerm={''}
                setSearchTerm={() => {}}
                filterStatus={'all'}
                setFilterStatus={() => {}}
                sortBy={'date'}
                setSortBy={() => {}}
                sortOrder={'desc'}
                setSortOrder={() => {}}
                onRefresh={loadData}
              />
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'reports' && activeTab !== 'purchases' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <h3 className="text-2xl font-mali font-bold text-gray-800 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="font-mali text-gray-600">
                This section is under development. Click on "Reports" to test the reports page!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};