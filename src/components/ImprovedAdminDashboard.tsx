import React, { useState, useEffect } from 'react';
import { User, Module, Purchase, Analytics, BundleOffer, ContentItem, ContentFile, ContentStats } from '../types';
import { dataStore } from '../utils/dataStore';
import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPageEnhanced } from './ReportsPageEnhanced';
import { SystemPage } from './SystemPage';
import { NotificationCenter } from './NotificationCenter';
import { NotificationsPage } from './NotificationsPage';
import { EmailNotificationSettings } from './EmailNotificationSettings';
import { CouponManagement } from './CouponManagement';
import { AdminSettings } from './AdminSettings';
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
  ChevronUp
} from 'lucide-react';

interface ImprovedAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const ImprovedAdminDashboard: React.FC<ImprovedAdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'modules' | 'content' | 'purchases' | 'analytics' | 'reports' | 'settings' | 'system' | 'support'>('dashboard');
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

    // Create some demo notifications if none exist
    const allNotifications = notificationService.getNotifications();
    if (allNotifications.length === 0) {
      // Create demo notifications
      notificationService.createNotification(
        'purchase',
        '🛒 New Purchase!',
        'Demo user purchased African Alphabet Adventure for $9.99',
        'high',
        'demo-user-1',
        'demo-purchase-1',
        { amount: 9.99, customer: 'Demo User' }
      );
      
      notificationService.createNotification(
        'user_registration',
        '👤 New User Registered',
        'Sarah Johnson just joined the platform',
        'medium',
        'demo-user-2',
        undefined,
        { user: { name: 'Sarah Johnson', email: 'sarah@example.com' } }
      );
      
      notificationService.createNotification(
        'system',
        '⚡ System Update',
        'Platform updated to version 2.1.0',
        'low',
        undefined,
        undefined,
        { version: '2.1.0' }
      );
      
      // Update unread count after creating demo notifications
      const newUnread = notificationService.getUnreadNotifications().length;
      setUnreadNotifications(newUnread);
      console.log('Created demo notifications, new unread count:', newUnread);
    }

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

  // Save data to storage
  const saveData = () => {
    const data = { users, modules, purchases, contentFiles };
    dataStore.saveData(data);
    
    // Regenerate analytics
    const realAnalytics = dataStore.generateAnalytics(users, modules, purchases);
    setAnalytics(realAnalytics);
    
    // Update notifications
    const pendingCount = purchases.filter(p => p.status === 'pending').length;
    setNotifications(pendingCount);
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
                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab.replace('-', ' ')}
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
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{purchases.filter(p => p.status === 'pending').length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Pending Orders</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <h2 className="text-3xl font-mali font-bold text-gray-800 mb-4">
                    Welcome to the Admin Dashboard, {user.name}!
                  </h2>
                  <p className="font-mali text-gray-600 text-lg mb-6">
                    Manage your Zinga Linga Trae platform with ease. Monitor users, modules, orders, and system performance.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="bg-gradient-to-r from-brand-blue to-brand-pink text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold"
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => setActiveTab('modules')}
                      className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold"
                    >
                      Manage Modules
                    </button>
                    <button
                      onClick={() => {
                        // Test notification
                        notificationService.createNotification(
                          'purchase',
                          '🛒 Test Purchase!',
                          `Test user purchased Learning Module for ${(Math.random() * 20 + 5).toFixed(2)}`,
                          'high',
                          'test-user',
                          'test-purchase',
                          { amount: Math.random() * 20 + 5, customer: 'Test User' }
                        );
                      }}
                      className="bg-gradient-to-r from-brand-yellow to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold"
                    >
                      Test Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.length}</h3>
                  <p className="font-mali opacity-90">Total Users</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <CheckCircle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.filter(u => u.role === 'user').length}</h3>
                  <p className="font-mali opacity-90">Regular Users</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Shield className="w-6 h-6" />
                    </div>
                    <Star className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.filter(u => u.role === 'admin').length}</h3>
                  <p className="font-mali opacity-90">Administrators</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">
                    ${users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(0)}
                  </h3>
                  <p className="font-mali opacity-90">Total Spent</p>
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
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
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
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="font-mali font-bold text-gray-800">
                                {user.purchasedModules?.length || 0}
                              </span>
                              <span className="font-mali text-gray-600 text-sm">modules</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-mali font-bold text-gray-800 text-lg">
                                ${(user.totalSpent || 0).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-mali text-gray-800 font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {user.role !== 'admin' && (
                                <button 
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-mali font-bold text-gray-800">
                          User Details: {selectedUser.name}
                        </h3>
                        <button 
                          onClick={() => setShowUserModal(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-mali font-bold text-gray-800">User Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Name:</span>
                              <span className="font-mali font-bold">{selectedUser.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Email:</span>
                              <span className="font-mali font-bold">{selectedUser.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Role:</span>
                              <span className="font-mali font-bold">{selectedUser.role}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Join Date:</span>
                              <span className="font-mali font-bold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-mali font-bold text-gray-800">Purchase Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Total Spent:</span>
                              <span className="font-mali font-bold text-lg text-green-600">
                                ${(selectedUser.totalSpent || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Modules Owned:</span>
                              <span className="font-mali font-bold">{selectedUser.purchasedModules?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setShowUserModal(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
            <AdminSettings user={user} />
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Documentation</h4>
                  <p className="font-mali text-gray-600 mb-4">Access comprehensive guides and tutorials</p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold">
                    View Docs
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Live Chat</h4>
                  <p className="font-mali text-gray-600 mb-4">Get instant help from our support team</p>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-mali font-bold">
                    Start Chat
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Email Support</h4>
                  <p className="font-mali text-gray-600 mb-4">Send us a detailed support request</p>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-mali font-bold">
                    Send Email
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-mali font-bold text-gray-800 mb-6">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Version:</span>
                      <span className="font-mali font-bold">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Last Update:</span>
                      <span className="font-mali font-bold">2024-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Environment:</span>
                      <span className="font-mali font-bold">Production</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Database:</span>
                      <span className="font-mali font-bold">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Storage:</span>
                      <span className="font-mali font-bold">45% Used</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Uptime:</span>
                      <span className="font-mali font-bold">99.9%</span>
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
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">Age Range:</span>
                          <span className="font-mali font-bold">{module.ageRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-mali font-bold text-gray-800 mb-6">Content Library</h3>
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-mali font-bold text-gray-600 mb-2">Content Management</h4>
                  <p className="font-mali text-gray-500">Upload and manage learning content, videos, and resources</p>
                  <button className="mt-4 bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold">
                    Upload Content
                  </button>
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
