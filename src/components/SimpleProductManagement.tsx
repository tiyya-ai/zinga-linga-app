import React, { useState } from 'react';
import { Module, User, Purchase } from '../types';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Star, 
  DollarSign, 
  Search,
  Save,
  X,
  CheckCircle,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SimpleProductManagementProps {
  modules: Module[];
  users: User[];
  purchases: Purchase[];
  onModulesUpdate: (modules: Module[]) => void;
  onRefresh: () => void;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  character: 'kiki' | 'tano';
  ageRange: string;
  isActive: boolean;
  isVisible: boolean;
}

export const SimpleProductManagement: React.FC<SimpleProductManagementProps> = ({
  modules,
  users,
  purchases,
  onModulesUpdate,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Module | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    character: 'kiki',
    ageRange: '',
    isActive: true,
    isVisible: true
  });

  // Filter products based on search
  const filteredProducts = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit product
  const handleEditProduct = (product: Module) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      character: product.character,
      ageRange: product.ageRange,
      isActive: product.isActive ?? true,
      isVisible: product.isVisible ?? true
    });
    setShowProductModal(true);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedModules = modules.map(module => 
        module.id === editingProduct.id 
          ? {
              ...module,
              title: productFormData.title,
              description: productFormData.description,
              price: productFormData.price,
              character: productFormData.character,
              ageRange: productFormData.ageRange,
              isActive: productFormData.isActive,
              isVisible: productFormData.isVisible,
              updatedAt: new Date().toISOString()
            }
          : module
      );
      onModulesUpdate(updatedModules);
    } else {
      // Add new product
      const newProduct: Module = {
        id: `module-${Date.now()}`,
        title: productFormData.title,
        description: productFormData.description,
        price: productFormData.price,
        character: productFormData.character,
        ageRange: productFormData.ageRange,
        isActive: productFormData.isActive,
        isVisible: productFormData.isVisible,
        rating: 4.5,
        totalRatings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'learning',
        difficulty: 'beginner',
        estimatedDuration: '30 minutes',
        tags: [],
        features: [],
        demoVideo: '',
        fullContent: []
      };
      onModulesUpdate([...modules, newProduct]);
    }

    setShowProductModal(false);
    setEditingProduct(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setProductFormData({
      title: '',
      description: '',
      price: 0,
      character: 'kiki',
      ageRange: '',
      isActive: true,
      isVisible: true
    });
  };

  // Toggle product visibility (affects user dashboard)
  const toggleProductVisibility = (productId: string) => {
    const updatedModules = modules.map(module => 
      module.id === productId 
        ? { ...module, isVisible: !module.isVisible, updatedAt: new Date().toISOString() }
        : module
    );
    onModulesUpdate(updatedModules);
  };

  // Toggle product active status
  const toggleProductActive = (productId: string) => {
    const updatedModules = modules.map(module => 
      module.id === productId 
        ? { ...module, isActive: !module.isActive, updatedAt: new Date().toISOString() }
        : module
    );
    onModulesUpdate(updatedModules);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will remove it from all user dashboards.')) {
      const updatedModules = modules.filter(module => module.id !== productId);
      onModulesUpdate(updatedModules);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Product Management</h3>
          <p className="font-mali text-gray-600">Edit products - changes sync to user dashboard automatically</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowProductModal(true);
          }}
          className="bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali w-full"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Product Header */}
            <div className={`p-4 ${
              product.character === 'kiki' 
                ? 'bg-gradient-to-br from-brand-yellow/10 to-brand-red/10' 
                : 'bg-gradient-to-br from-brand-pink/10 to-brand-red/10'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-mali font-bold text-gray-800 text-lg mb-1">{product.title}</h4>
                  <p className="font-mali text-gray-600 text-sm">{product.ageRange} • {product.character}</p>
                </div>
                <span className="font-mali font-bold text-brand-green text-lg">${product.price}</span>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                  product.isVisible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isVisible ? 'Visible to Users' : 'Hidden from Users'}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-mali font-bold text-sm">{product.rating}</span>
                <span className="font-mali text-gray-600 text-xs">({product.totalRatings})</span>
              </div>
            </div>

            {/* Product Content */}
            <div className="p-4">
              <p className="font-mali text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="font-mali font-bold text-blue-600">
                    {users.filter(user => user.purchasedModules?.includes(product.id)).length}
                  </div>
                  <div className="font-mali text-blue-600 text-xs">Users Own This</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="font-mali font-bold text-green-600">
                    {purchases.filter(p => p.moduleIds.includes(product.id) && p.status === 'completed').length}
                  </div>
                  <div className="font-mali text-green-600 text-xs">Total Sales</div>
                </div>
              </div>

              {/* Quick Toggle Buttons */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => toggleProductVisibility(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                    product.isVisible
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={product.isVisible ? 'Hide from user dashboard' : 'Show in user dashboard'}
                >
                  {product.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {product.isVisible ? 'Hide' : 'Show'}
                </button>

                <button
                  onClick={() => toggleProductActive(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors font-mali font-bold text-sm ${
                    product.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title={product.isActive ? 'Deactivate product' : 'Activate product'}
                >
                  {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-mali font-bold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
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

      {/* Product Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={productFormData.title}
                    onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="Enter product description"
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
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })}
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
                      value={productFormData.character}
                      onChange={(e) => setProductFormData({ ...productFormData, character: e.target.value as 'kiki' | 'tano' })}
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
                    value={productFormData.ageRange}
                    onChange={(e) => setProductFormData({ ...productFormData, ageRange: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="e.g., 3-6 years"
                    required
                  />
                </div>

                {/* Visibility Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-mali font-bold text-gray-800">Active Status</h5>
                      <p className="font-mali text-gray-600 text-sm">Product can be purchased</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, isActive: !productFormData.isActive })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        productFormData.isActive ? 'bg-brand-green' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          productFormData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h5 className="font-mali font-bold text-gray-800">User Dashboard Visibility</h5>
                      <p className="font-mali text-gray-600 text-sm">Product appears in user dashboard</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, isVisible: !productFormData.isVisible })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        productFormData.isVisible ? 'bg-brand-blue' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          productFormData.isVisible ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-brand-green to-brand-blue text-white rounded-lg hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};