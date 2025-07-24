import React, { useState, useEffect } from 'react';
import { User, Module, Purchase, Analytics, BundleOffer, ContentItem, ContentFile, ContentStats } from '../types';
import { dataStore } from '../utils/dataStore';
import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';
import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';
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
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-mali font-bold text-gray-800">Content Management</h3>
                  <p className="font-mali text-gray-600">Manage media files, images, videos, and other content</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold">
                  <Upload className="w-4 h-4" />
                  Upload Content
                </button>
              </div>

              {/* Content Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{contentFiles.filter(f => f.type === 'image').length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Images</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{contentFiles.filter(f => f.type === 'video').length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Videos</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-green-600">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{contentFiles.filter(f => f.type === 'audio').length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Audio Files</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{contentFiles.filter(f => f.type === 'document').length}</h3>
                  <p className="font-mali text-gray-600 text-lg">Documents</p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-mali font-bold text-gray-800">Content Library</h4>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search content..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        />
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue">
                        <option value="all">All Types</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                        <option value="audio">Audio</option>
                        <option value="document">Documents</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {contentFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {contentFiles.map((file) => (
                        <div key={file.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${
                              file.type === 'image' ? 'bg-blue-100 text-blue-600' :
                              file.type === 'video' ? 'bg-purple-100 text-purple-600' :
                              file.type === 'audio' ? 'bg-green-100 text-green-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {file.type === 'image' && <Image className="w-5 h-5" />}
                              {file.type === 'video' && <Video className="w-5 h-5" />}
                              {file.type === 'audio' && <Music className="w-5 h-5" />}
                              {file.type === 'document' && <FileText className="w-5 h-5" />}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <h5 className="font-mali font-bold text-gray-800 mb-1 truncate">{file.name}</h5>
                          <p className="font-mali text-gray-600 text-sm mb-2">{file.size}</p>
                          <p className="font-mali text-gray-500 text-xs">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-mali font-bold text-gray-600 mb-2">No content found</h3>
                      <p className="font-mali text-gray-500 mb-6">
                        Upload your first content file to get started
                      </p>
                      <button className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold">
                        Upload Content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === 'reports' || activeTab === 'system' || activeTab === 'support') && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-mali font-bold text-gray-600 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="font-mali text-gray-500">
                Full functionality coming soon! These sections will include comprehensive {activeTab === 'reports' ? 'reporting and data export' : activeTab === 'system' ? 'system monitoring and performance' : 'help desk and customer support'} tools.
              </p>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-mali font-bold text-gray-800">User Management</h3>
                  <p className="font-mali text-gray-600">Manage user accounts and permissions</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">User</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Role</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Modules</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Spent</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                                <span className="text-white font-mali font-bold">{user.name.charAt(0)}</span>
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
                              {user.purchasedModules.length}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mali font-bold text-gray-800">
                              ${(user.totalSpent || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mali text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-mali font-bold text-gray-800">Module Management</h3>
                  <p className="font-mali text-gray-600">Manage learning modules and content</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <div key={module.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className={`p-4 ${
                      module.character === 'kiki' 
                        ? 'bg-gradient-to-r from-brand-yellow to-brand-red' 
                        : 'bg-gradient-to-r from-brand-pink to-brand-red'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white font-mali font-bold text-sm">
                              {module.character === 'kiki' ? 'K' : 'T'}
                            </span>
                          </div>
                          <span className="text-white font-mali font-bold text-sm capitalize">
                            {module.character}'s Module
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                          module.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {module.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-mali font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors">
                        {module.title}
                      </h4>
                      <p className="font-mali text-gray-600 text-sm mb-4 line-clamp-2">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(module.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="font-mali text-gray-600 text-sm ml-1">
                            ({module.totalRatings})
                          </span>
                        </div>
                        <span className="text-2xl font-mali font-bold text-brand-green">
                          ${module.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-mali font-bold">
                          {module.ageRange}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-mali font-bold">
                          {module.fullContent.length} items
                        </span>
                      </div>

                      <div className="text-xs font-mali text-gray-500 mb-4">
                        Created: {new Date(module.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {modules.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-mali font-bold text-gray-800 mb-3">Module Library</h3>
                    <p className="font-mali text-gray-600 mb-6 max-w-md mx-auto">
                      Create engaging learning modules for Kiki and Trae. Each module can contain videos, activities, games, and educational content.
                    </p>
                    
                    {/* Quick Module Templates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                      <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-red/10 border border-brand-yellow/20 rounded-xl p-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-yellow to-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-mali font-bold text-lg">K</span>
                        </div>
                        <h4 className="font-mali font-bold text-gray-800 mb-2">Kiki's Module</h4>
                        <p className="font-mali text-gray-600 text-sm mb-3">Perfect for creative and artistic learning experiences</p>
                        <button className="w-full bg-gradient-to-r from-brand-yellow to-brand-red text-white px-4 py-2 rounded-lg font-mali font-bold hover:shadow-lg transition-all duration-300">
                          Create Kiki Module
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-brand-pink/10 to-brand-red/10 border border-brand-pink/20 rounded-xl p-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-pink to-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-mali font-bold text-lg">T</span>
                        </div>
                        <h4 className="font-mali font-bold text-gray-800 mb-2">Trae's Module</h4>
                        <p className="font-mali text-gray-600 text-sm mb-3">Great for logical and analytical learning activities</p>
                        <button className="w-full bg-gradient-to-r from-brand-pink to-brand-red text-white px-4 py-2 rounded-lg font-mali font-bold hover:shadow-lg transition-all duration-300">
                          Create Trae Module
                        </button>
                      </div>
                    </div>

                    {/* Module Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Video className="w-6 h-6 text-blue-600" />
                        </div>
                        <h5 className="font-mali font-bold text-gray-800 mb-2">Rich Media</h5>
                        <p className="font-mali text-gray-600 text-sm">Add videos, images, audio, and interactive content</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Gamepad2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h5 className="font-mali font-bold text-gray-800 mb-2">Interactive Games</h5>
                        <p className="font-mali text-gray-600 text-sm">Engage children with fun learning activities</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <h5 className="font-mali font-bold text-gray-800 mb-2">Progress Tracking</h5>
                        <p className="font-mali text-gray-600 text-sm">Monitor learning progress and achievements</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-gradient-to-r from-brand-blue to-brand-pink text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create New Module
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-mali font-bold flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Import Module
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-mali font-bold text-gray-800">Order Management</h3>
                  <p className="font-mali text-gray-600">Track and manage customer orders</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-200">
                    <span className="font-mali text-gray-600">Total Revenue: </span>
                    <span className="font-mali font-bold text-brand-green text-lg">
                      ${purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Order ID</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Customer</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Amount</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Status</th>
                        <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {purchases.map((purchase) => {
                        const user = users.find(u => u.id === purchase.userId);
                        
                        return (
                          <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-mali font-bold text-gray-800">
                                #{purchase.id.slice(-8).toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-mali font-bold text-gray-800">
                                  {user?.name || 'Unknown User'}
                                </p>
                                <p className="font-mali text-gray-600 text-sm">
                                  {user?.email || 'No email'}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-mali font-bold text-gray-800 text-lg">
                                ${purchase.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${
                                purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                purchase.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-mali text-gray-800">
                                  {new Date(purchase.createdAt).toLocaleDateString()}
                                </p>
                                <p className="font-mali text-gray-600 text-sm">
                                  {new Date(purchase.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {purchases.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-mali font-bold text-gray-600 mb-2">No orders found</h3>
                  <p className="font-mali text-gray-500">
                    Orders will appear here when customers make purchases
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-mali font-bold text-gray-800">Analytics Dashboard</h3>
                <p className="font-mali text-gray-600">Performance insights and trends</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">{analytics.totalUsers}</h3>
                  <p className="font-mali text-gray-600">Total Users</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">${analytics.totalRevenue}</h3>
                  <p className="font-mali text-gray-600">Total Revenue</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">{analytics.totalModules}</h3>
                  <p className="font-mali text-gray-600">Total Modules</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <ShoppingCart className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">{analytics.totalPurchases}</h3>
                  <p className="font-mali text-gray-600">Total Orders</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-mali font-bold text-gray-800">System Settings</h3>
                <p className="font-mali text-gray-600">Configure application settings and preferences</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-xl font-mali font-bold text-gray-800 mb-4">General Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="Zinga Linga Trae"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@zingalingatrae.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

