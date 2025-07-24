import React, { useState, useEffect } from 'react';
import { User, Module, Purchase, Analytics, BundleOffer, ContentItem, ContentFile, ContentStats } from '../types';
import { dataStore } from '../utils/dataStore';
import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPageEnhanced } from './ReportsPageEnhanced';
import { SystemPage } from './SystemPage';
import { NotificationCenter } from './NotificationCenter';
import { NotificationsPage } from './NotificationsPage';
import { CouponManagement } from './CouponManagement';
import { EmailNotificationSettings } from './EmailNotificationSettings';
import { notificationService } from '../utils/notificationService';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  Download,
  Search,
  Filter,
  LogOut,
  Shield,
  Package,
  Star,
  Activity,
  Save,
  X,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  RefreshCw,
  FileText,
  Database,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  TrendingDown,
  AlertCircle,
  Info,
  Home,
  MessageSquare,
  Bell,
  HelpCircle,
  Zap,
  Target,
  Award,
  Layers,
  PieChart,
  LineChart,
  Monitor,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Video,
  Music,
  Gamepad2,
  Image,
  Folder,
  Tag,
  Link,
  Code,
  Palette,
  Layout,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  ExternalLink,
  Copy,
  MoreVertical,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Gift
} from 'lucide-react';

interface AdminDashboardWithCouponsProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboardWithCoupons: React.FC<AdminDashboardWithCouponsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'modules' | 'content' | 'purchases' | 'analytics' | 'reports' | 'settings' | 'system' | 'support' | 'coupons' | 'emails'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'revenue'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [selectedContentFile, setSelectedContentFile] = useState<ContentFile | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load real data on component mount
  useEffect(() => {
    loadData();
    
    // Listen for notification updates
    const handleNotificationUpdate = (notifications: any[]) => {
      const unread = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unread);
      console.log('Notification update:', { total: notifications.length, unread });
    };

    notificationService.addListener(handleNotificationUpdate);
    
    // Set initial unread count
    const initialUnread = notificationService.getUnreadNotifications().length;
    setUnreadNotifications(initialUnread);
    console.log('Initial unread notifications:', initialUnread);

    return () => {
      notificationService.removeListener(handleNotificationUpdate);
    };
  }, []);

  // Load data from storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = dataStore.loadData();
      setUsers(data.users);
      setModules(data.modules);
      setPurchases(data.purchases);
      
      // Generate real analytics from actual data
      const realAnalytics = dataStore.generateAnalytics(data.users, data.modules, data.purchases);
      setAnalytics(realAnalytics);
      
      // Generate content stats
      const stats = dataStore.generateContentStats(data.contentFiles || []);
      setContentStats(stats);
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

  // Enhanced sidebar menu items with coupon and email management
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
      id: 'purchases', 
      label: 'Orders', 
      icon: ShoppingCart, 
      badge: purchases.filter(p => p.status === 'pending').length,
      description: 'Orders & payments'
    },
    { 
      id: 'coupons', 
      label: 'Coupons', 
      icon: Gift, 
      badge: null,
      description: 'Manage discount codes'
    },
    { 
      id: 'emails', 
      label: 'Email Settings', 
      icon: Mail, 
      badge: null,
      description: 'Configure notifications'
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
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-brand-blue to-brand-pink rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-mali font-bold text-gray-800">Admin Panel</h1>
                  <p className="text-sm font-mali text-gray-600">Zinga Linga Management</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mali font-medium transition-all relative ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-brand-blue to-brand-pink text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-bold">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        activeTab === item.id ? 'bg-white text-brand-blue' : 'bg-red-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
              
              {/* Tooltip for collapsed sidebar */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-blue rounded-full flex items-center justify-center">
              <span className="text-white font-mali font-bold text-lg">{user.name.charAt(0)}</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-mali font-bold text-gray-800">{user.name}</p>
                <p className="font-mali text-gray-600 text-sm capitalize">{user.role} Account</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 transition-colors font-mali font-medium"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Enhanced Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-mali font-bold text-gray-800 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                 activeTab === 'coupons' ? 'Coupon Management' :
                 activeTab === 'emails' ? 'Email Settings' :
                 activeTab.replace('-', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Refresh Button */}
              <button 
                onClick={loadData}
                className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button 
                onClick={() => setShowNotificationCenter(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* System Status */}
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="font-mali text-green-600 font-bold text-sm">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-brand-blue to-blue-600">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{users.length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Total Users</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-brand-green to-green-600">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">
                    ${purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </h3>
                  <p className="font-mali text-gray-600 text-lg">Total Revenue</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-brand-pink to-pink-600">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{modules.filter(m => m.isActive).length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Active Modules</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-brand-yellow to-yellow-600">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">3</h3>
                  <p className="font-mali text-gray-600 text-lg">Active Coupons</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">
                    Welcome to the Enhanced Admin Dashboard, {user.name}!
                  </h2>
                  <p className="font-mali text-gray-600 text-lg mb-6">
                    Manage your Zinga Linga Trae platform with new coupon management and email notification features.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('coupons')}
                      className="bg-gradient-to-r from-brand-yellow to-brand-red text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                    >
                      <Gift className="w-5 h-5" />
                      Manage Coupons
                    </button>
                    <button
                      onClick={() => setActiveTab('emails')}
                      className="bg-gradient-to-r from-brand-blue to-brand-pink text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Email Settings
                    </button>
                    <button
                      onClick={() => setActiveTab('purchases')}
                      className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Coupon Management */}
          {activeTab === 'coupons' && <CouponManagement />}

          {/* Email Settings */}
          {activeTab === 'emails' && <EmailNotificationSettings />}

          {/* Professional Order Management */}
          {activeTab === 'purchases' && (
            <ProfessionalOrderManagement
              purchases={purchases}
              users={users}
              modules={modules}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onRefresh={loadData}
            />
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">User Management</h3>
                  <p className="font-mali text-gray-600">Manage user accounts and permissions</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">User</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Role</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Modules</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Total Spent</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                                <span className="text-white font-mali font-bold text-lg">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-mali font-bold text-gray-800">{user.name}</p>
                                <p className="font-mali text-gray-600 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrator' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mali font-bold text-gray-800">
                              {user.purchasedModules?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mali font-bold text-gray-800 text-lg">
                              ${(user.totalSpent || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-mali text-gray-800 font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <AnalyticsPage
              users={users}
              modules={modules}
              purchases={purchases}
              analytics={analytics}
              onRefresh={loadData}
            />
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <ReportsPageEnhanced
              users={users}
              modules={modules}
              purchases={purchases}
              onRefresh={loadData}
            />
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <SystemPage
              users={users}
              modules={modules}
              purchases={purchases}
              onRefresh={loadData}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-mali font-bold text-gray-800 mb-6">Application Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-mali font-bold text-gray-800">General Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mali text-gray-700">Maintenance Mode</span>
                        <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mali text-gray-700">User Registration</span>
                        <button className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mali text-gray-700">Email Notifications</span>
                        <button className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-mali font-bold text-gray-800">Security Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mali text-gray-700">Two-Factor Auth</span>
                        <button className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mali text-gray-700">SSL Enforcement</span>
                        <button className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-mali font-bold text-gray-800 mb-6">Module Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-mali font-bold text-gray-800">{module.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                          module.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {module.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="font-mali text-gray-600 text-sm mb-4">{module.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">Price:</span>
                          <span className="font-mali font-bold">${module.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-mali font-bold">{module.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </div>
  );
};