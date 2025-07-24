import React, { useState, useMemo } from 'react';
import { Module } from '../types';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  DollarSign,
  Calendar,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Download,
  TrendingUp,
  Users,
  Play
} from 'lucide-react';

interface EnhancedModuleManagementProps {
  modules: Module[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateModule: () => void;
  onEditModule: (module: Module) => void;
  onViewModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onToggleModuleStatus: (moduleId: string) => void;
}

export const EnhancedModuleManagement: React.FC<EnhancedModuleManagementProps> = ({
  modules,
  searchTerm,
  onSearchChange,
  onCreateModule,
  onEditModule,
  onViewModule,
  onDeleteModule,
  onToggleModuleStatus
}) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCharacter, setFilterCharacter] = useState<'all' | 'kiki' | 'tano'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating' | 'created'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted modules
  const filteredModules = useMemo(() => {
    let filtered = modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && module.isActive) ||
        (filterStatus === 'inactive' && !module.isActive);
      const matchesCharacter = filterCharacter === 'all' || module.character === filterCharacter;
      
      return matchesSearch && matchesStatus && matchesCharacter;
    });

    // Sort modules
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
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

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [modules, searchTerm, filterStatus, filterCharacter, sortBy, sortOrder]);

  const handleSelectAll = () => {
    if (selectedModules.length === filteredModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(filteredModules.map(m => m.id));
    }
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedModules.length} modules?`)) {
      selectedModules.forEach(moduleId => onDeleteModule(moduleId));
      setSelectedModules([]);
    }
  };

  const handleBatchToggleStatus = () => {
    if (window.confirm(`Are you sure you want to toggle status for ${selectedModules.length} modules?`)) {
      selectedModules.forEach(moduleId => onToggleModuleStatus(moduleId));
      setSelectedModules([]);
    }
  };

  const exportModules = () => {
    const csvContent = [
      ['Title', 'Character', 'Price', 'Rating', 'Status', 'Created At'],
      ...filteredModules.map(module => [
        module.title,
        module.character,
        module.price,
        module.rating,
        module.isActive ? 'Active' : 'Inactive',
        new Date(module.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modules-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCharacterColor = (character: string) => {
    return character === 'kiki' ? 'bg-brand-yellow' : 'bg-brand-pink';
  };

  const getCharacterTextColor = (character: string) => {
    return character === 'kiki' ? 'text-brand-yellow' : 'text-brand-pink';
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-mali font-bold text-gray-800">Module Management</h2>
          <p className="font-mali text-gray-600">{filteredModules.length} modules found</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onCreateModule}
            className="bg-brand-green text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-green/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
          <button
            onClick={exportModules}
            className="bg-brand-blue text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Character Filter */}
          <select
            value={filterCharacter}
            onChange={(e) => setFilterCharacter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="all">All Characters</option>
            <option value="kiki">Kiki</option>
            <option value="tano">Tano</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="created">Sort by Created</option>
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedModules.length > 0 && (
        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-mali font-bold text-brand-blue">
              {selectedModules.length} modules selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBatchToggleStatus}
                className="bg-brand-yellow text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-yellow/90 transition-colors text-sm"
              >
                Toggle Status
              </button>
              <button
                onClick={handleBatchDelete}
                className="bg-red-500 text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Module Header */}
            <div className="relative">
              <div className={`h-32 ${getCharacterColor(module.character)} flex items-center justify-center`}>
                <Package className="w-12 h-12 text-white" />
              </div>
              
              {/* Selection Checkbox */}
              <button
                onClick={() => handleSelectModule(module.id)}
                className="absolute top-3 left-3 p-1 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                {selectedModules.includes(module.id) ? 
                  <CheckSquare className="w-5 h-5 text-white" /> : 
                  <Square className="w-5 h-5 text-white" />
                }
              </button>

              {/* Status Toggle */}
              <button
                onClick={() => onToggleModuleStatus(module.id)}
                className="absolute top-3 right-3 p-1 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                {module.isActive ? 
                  <ToggleRight className="w-6 h-6 text-white" /> : 
                  <ToggleLeft className="w-6 h-6 text-white/60" />
                }
              </button>

              {/* Character Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-mali font-bold capitalize">
                  {module.character}
                </span>
              </div>
            </div>

            {/* Module Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-mali font-bold text-gray-800 line-clamp-2">
                  {module.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                  module.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {module.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="font-mali text-gray-600 text-sm mb-4 line-clamp-2">
                {module.description}
              </p>

              {/* Module Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-brand-green mx-auto mb-1" />
                  <p className="text-lg font-mali font-bold text-gray-800">${module.price}</p>
                  <p className="text-xs font-mali text-gray-600">Price</p>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-brand-yellow mx-auto mb-1" />
                  <p className="text-lg font-mali font-bold text-gray-800">{module.rating.toFixed(1)}</p>
                  <p className="text-xs font-mali text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                  <p className="text-lg font-mali font-bold text-gray-800">{module.totalRatings}</p>
                  <p className="text-xs font-mali text-gray-600">Reviews</p>
                </div>
              </div>

              {/* Age Range */}
              <div className="mb-4">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-mali">
                  Ages {module.ageRange}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewModule(module)}
                  className="flex-1 bg-gray-100 text-gray-700 font-mali font-bold py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => onEditModule(module)}
                  className="flex-1 bg-brand-blue text-white font-mali font-bold py-2 px-3 rounded-xl hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteModule(module.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="font-mali text-gray-500">No modules found</p>
        </div>
      )}
    </div>
  );
};