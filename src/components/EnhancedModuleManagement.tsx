import React, { useState, useEffect } from 'react';
import { Module, User } from '../types';
import { dataStore } from '../utils/dataStore';
import { notificationService } from '../utils/notificationService';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star, 
  DollarSign, 
  Users, 
  Calendar,
  Search,
  Filter,
  Save,
  X,
  Upload,
  Download,
  Settings,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Zap,
  Globe,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  MoreVertical,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Image,
  Video,
  Music,
  Gamepad2,
  BookOpen,
  Palette,
  Tag,
  Link,
  Code
} from 'lucide-react';

interface EnhancedModuleManagementProps {
  modules: Module[];
  users: User[];
  onModulesUpdate: (modules: Module[]) => void;
  onRefresh: () => void;
}

interface ModuleFormData {
  title: string;
  description: string;
  price: number;
  character: 'kiki' | 'tano';
  ageRange: string;
  features: string[];
  isActive: boolean;
  isVisible: boolean;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  tags: string[];
}

export const EnhancedModuleManagement: React.FC<EnhancedModuleManagementProps> = ({
  modules,
  users,
  onModulesUpdate,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'active' | 'inactive' | 'visible' | 'hidden'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating' | 'created'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [moduleFormData, setModuleFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    price: 0,
    character: 'kiki',
    ageRange: '',
    features: [],
    isActive: true,
    isVisible: true,
    category: 'learning',
    difficulty: 'beginner',
    estimatedDuration: '',
    tags: []
  });
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  // Filter and sort modules
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategory === 'all' ||
                         (filterCategory === 'active' && module.isActive) ||
                         (filterCategory === 'inactive' && !module.isActive) ||
                         (filterCategory === 'visible' && module.isVisible) ||
                         (filterCategory === 'hidden' && !module.isVisible);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const paginatedModules = filteredModules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: modules.length,
    active: modules.filter(m => m.isActive).length,
    visible: modules.filter(m => m.isVisible).length,
    totalRevenue: modules.reduce((sum, m) => {
      const purchases = users.reduce((userSum, user) => {
        return userSum + (user.purchasedModules?.filter(pm => pm === m.id).length || 0);
      }, 0);
      return sum + (purchases * m.price);
    }, 0)
  };

  // Handle module form submission
  const handleModuleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const moduleData: Module = {
      id: editingModule?.id || `module-${Date.now()}`,
      ...moduleFormData,
      rating: editingModule?.rating || 4.5,
      totalRatings: editingModule?.totalRatings || 0,
      createdAt: editingModule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      demoVideo: editingModule?.demoVideo || '',
      fullContent: editingModule?.fullContent || []
    };

    let updatedModules;
    if (editingModule) {
      updatedModules = modules.map(m => m.id === editingModule.id ? moduleData : m);
    } else {
      updatedModules = [...modules, moduleData];
    }

    onModulesUpdate(updatedModules);
    
    // Create notification
    notificationService.createNotification(
      'system',
      editingModule ? '📦 Module Updated' : '🆕 New Module Created',
      `Module "${moduleData.title}" has been ${editingModule ? 'updated' : 'created'} successfully`,
      'medium',
      'admin',
      moduleData.id,
      { module: moduleData }
    );

    setShowModuleModal(false);
    setEditingModule(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setModuleFormData({
      title: '',
      description: '',
      price: 0,
      character: 'kiki',
      ageRange: '',
      features: [],
      isActive: true,
      isVisible: true,
      category: 'learning',
      difficulty: 'beginner',
      estimatedDuration: '',
      tags: []
    });
    setNewFeature('');
    setNewTag('');
  };

  // Handle edit module
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleFormData({
      title: module.title,
      description: module.description,
      price: module.price,
      character: module.character,
      ageRange: module.ageRange,
      features: module.features || [],
      isActive: module.isActive ?? true,
      isVisible: module.isVisible ?? true,
      category: module.category || 'learning',
      difficulty: module.difficulty || 'beginner',
      estimatedDuration: module.estimatedDuration || '',
      tags: module.tags || []
    });
    setShowModuleModal(true);
  };

  // Handle delete module
  const handleDeleteModule = (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      const moduleToDelete = modules.find(m => m.id === moduleId);
      const updatedModules = modules.filter(m => m.id !== moduleId);
      onModulesUpdate(updatedModules);
      
      if (moduleToDelete) {
        notificationService.createNotification(
          'system',
          '🗑️ Module Deleted',
          `Module "${moduleToDelete.title}" has been deleted`,
          'high',
          'admin',
          moduleId,
          { module: moduleToDelete }
        );
      }
    }
  };

  // Toggle module visibility
  const toggleModuleVisibility = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, isVisible: !module.isVisible }
        : module
    );
    onModulesUpdate(updatedModules);
    
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      notificationService.createNotification(
        'system',
        module.isVisible ? '👁️ Module Hidden' : '👁️ Module Visible',
        `Module "${module.title}" is now ${module.isVisible ? 'hidden from' : 'visible to'} users`,
        'medium',
        'admin',
        moduleId,
        { module: { ...module, isVisible: !module.isVisible } }
      );
    }
  };

  // Toggle module active status
  const toggleModuleActive = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, isActive: !module.isActive }
        : module
    );
    onModulesUpdate(updatedModules);
    
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      notificationService.createNotification(
        'system',
        module.isActive ? '⏸️ Module Deactivated' : '▶️ Module Activated',
        `Module "${module.title}" has been ${module.isActive ? 'deactivated' : 'activated'}`,
        'medium',
        'admin',
        moduleId,
        { module: { ...module, isActive: !module.isActive } }
      );
    }
  };

  // Bulk actions
  const handleBulkAction = (action: 'activate' | 'deactivate' | 'show' | 'hide' | 'delete') => {
    if (selectedModules.length === 0) return;

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedModules.length} modules? This action cannot be undone.`)) {
        return;
      }
    }

    let updatedModules = [...modules];

    selectedModules.forEach(moduleId => {
      switch (action) {
        case 'activate':
          updatedModules = updatedModules.map(m => 
            m.id === moduleId ? { ...m, isActive: true } : m
          );
          break;
        case 'deactivate':
          updatedModules = updatedModules.map(m => 
            m.id === moduleId ? { ...m, isActive: false } : m
          );
          break;
        case 'show':
          updatedModules = updatedModules.map(m => 
            m.id === moduleId ? { ...m, isVisible: true } : m
          );
          break;
        case 'hide':
          updatedModules = updatedModules.map(m => 
            m.id === moduleId ? { ...m, isVisible: false } : m
          );
          break;
        case 'delete':
          updatedModules = updatedModules.filter(m => m.id !== moduleId);
          break;
      }
    });

    onModulesUpdate(updatedModules);
    setSelectedModules([]);
    setShowBulkActions(false);

    // Create notification
    notificationService.createNotification(
      'system',
      '📦 Bulk Action Completed',
      `${action} action applied to ${selectedModules.length} modules`,
      'medium',
      'admin',
      undefined,
      { action, count: selectedModules.length }
    );
  };

  // Add feature to form
  const addFeature = () => {
    if (newFeature.trim() && !moduleFormData.features.includes(newFeature.trim())) {
      setModuleFormData({
        ...moduleFormData,
        features: [...moduleFormData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  // Remove feature from form
  const removeFeature = (index: number) => {
    setModuleFormData({
      ...moduleFormData,
      features: moduleFormData.features.filter((_, i) => i !== index)
    });
  };

  // Add tag to form
  const addTag = () => {
    if (newTag.trim() && !moduleFormData.tags.includes(newTag.trim())) {
      setModuleFormData({
        ...moduleFormData,
        tags: [...moduleFormData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remove tag from form
  const removeTag = (index: number) => {
    setModuleFormData({
      ...moduleFormData,
      tags: moduleFormData.tags.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Module Management</h3>
          <p className="font-mali text-gray-600">Control which modules are visible to users</p>
        </div>
        <button
          onClick={() => {
            setEditingModule(null);
            resetForm();
            setShowModuleModal(true);
          }}
          className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Module
        </button>
      </div>

      {/* Statistics Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.total}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Modules</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <Target className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.active}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Active Modules</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.visible}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Visible to Users</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">${stats.totalRevenue.toFixed(0)}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Revenue</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali w-full sm:w-64"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="all">All Modules</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="visible">Visible to Users</option>
              <option value="hidden">Hidden from Users</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="created">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mali text-gray-600 text-sm">
              {filteredModules.length} of {modules.length} modules
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedModules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-mali text-blue-800 font-bold">
              {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-mali text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-mali text-sm"
              >
                <Clock className="w-4 h-4" />
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('show')}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-mali text-sm"
              >
                <Eye className="w-4 h-4" />
                Show
              </button>
              <button
                onClick={() => handleBulkAction('hide')}
                className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-mali text-sm"
              >
                <EyeOff className="w-4 h-4" />
                Hide
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-mali text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setSelectedModules([])}
                className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedModules.map((module) => (
          <div key={module.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Module Header */}
            <div className={`p-4 ${
              module.character === 'kiki' 
                ? 'bg-gradient-to-br from-brand-yellow/10 to-brand-red/10' 
                : 'bg-gradient-to-br from-brand-pink/10 to-brand-red/10'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-mali font-bold text-gray-800 text-lg mb-1 line-clamp-2">{module.title}</h4>
                  <p className="font-mali text-gray-600 text-sm">{module.ageRange}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedModules([...selectedModules, module.id]);
                    } else {
                      setSelectedModules(selectedModules.filter(id => id !== module.id));
                    }
                  }}
                  className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                />
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

              {/* Rating and Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-mali font-bold text-sm">{module.rating}</span>
                  <span className="font-mali text-gray-600 text-xs">({module.totalRatings})</span>
                </div>
                <span className="font-mali font-bold text-brand-green text-lg">${module.price}</span>
              </div>
            </div>

            {/* Module Content */}
            <div className="p-4">
              <p className="font-mali text-gray-600 text-sm mb-4 line-clamp-3">{module.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="font-mali font-bold text-gray-800">{module.fullContent?.length || 0}</div>
                  <div className="font-mali text-gray-600 text-xs">Activities</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="font-mali font-bold text-gray-800">
                    {users.reduce((count, user) => 
                      count + (user.purchasedModules?.filter(pm => pm === module.id).length || 0), 0
                    )}
                  </div>
                  <div className="font-mali text-gray-600 text-xs">Purchases</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleModuleVisibility(module.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                    module.isVisible
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={module.isVisible ? 'Hide from users' : 'Show to users'}
                >
                  {module.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {module.isVisible ? 'Hide' : 'Show'}
                </button>

                <button
                  onClick={() => toggleModuleActive(module.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                    module.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title={module.isActive ? 'Deactivate module' : 'Activate module'}
                >
                  {module.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {module.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* More Actions */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleEditModule(module)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-mali font-bold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteModule(module.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-mali font-bold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="font-mali text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredModules.length)} of {filteredModules.length} modules
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-mali disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 bg-brand-blue text-white rounded-lg font-mali font-bold">
              {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-mali disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Module Form Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
                  {editingModule ? 'Edit Module' : 'Create New Module'}
                </h3>
                <button 
                  onClick={() => setShowModuleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleModuleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">Basic Information</h4>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                      Module Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={moduleFormData.title}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="Enter module title"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={moduleFormData.description}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="Enter module description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        min="0"
                        value={moduleFormData.price}
                        onChange={(e) => setModuleFormData({ ...moduleFormData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="character" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                        Character *
                      </label>
                      <select
                        id="character"
                        value={moduleFormData.character}
                        onChange={(e) => setModuleFormData({ ...moduleFormData, character: e.target.value as 'kiki' | 'tano' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                        required
                      >
                        <option value="kiki">Kiki</option>
                        <option value="tano">Tano</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ageRange" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                      Age Range *
                    </label>
                    <input
                      type="text"
                      id="ageRange"
                      value={moduleFormData.ageRange}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, ageRange: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="e.g., 3-6 years"
                      required
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">Settings & Visibility</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={moduleFormData.category}
                        onChange={(e) => setModuleFormData({ ...moduleFormData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      >
                        <option value="learning">Learning</option>
                        <option value="games">Games</option>
                        <option value="music">Music</option>
                        <option value="stories">Stories</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        id="difficulty"
                        value={moduleFormData.difficulty}
                        onChange={(e) => setModuleFormData({ ...moduleFormData, difficulty: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="estimatedDuration" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      id="estimatedDuration"
                      value={moduleFormData.estimatedDuration}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, estimatedDuration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="e.g., 30 minutes"
                    />
                  </div>

                  {/* Visibility Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-mali font-bold text-gray-800">Active Status</h5>
                        <p className="font-mali text-gray-600 text-sm">Module can be purchased and accessed</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModuleFormData({ ...moduleFormData, isActive: !moduleFormData.isActive })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moduleFormData.isActive ? 'bg-brand-green' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            moduleFormData.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h5 className="font-mali font-bold text-gray-800">User Visibility</h5>
                        <p className="font-mali text-gray-600 text-sm">Module appears in user dashboard and store</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModuleFormData({ ...moduleFormData, isVisible: !moduleFormData.isVisible })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moduleFormData.isVisible ? 'bg-brand-blue' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            moduleFormData.isVisible ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4">Features</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleFormData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mali"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-lg font-mali font-bold text-gray-800 mb-4">Tags</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleFormData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mali"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-brand-green to-brand-blue text-white rounded-lg hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingModule ? 'Update Module' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};