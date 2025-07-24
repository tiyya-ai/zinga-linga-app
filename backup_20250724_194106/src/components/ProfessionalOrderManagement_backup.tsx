import React, { useState } from 'react';
import { dataStore } from '../utils/dataStore';
import { 
  Search, 
  Download, 
  Plus, 
  Eye, 
  RefreshCw, 
  ArrowUpDown,
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Star,
  X,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  User,
  CreditCard
} from 'lucide-react';

interface ProfessionalOrderManagementProps {
  purchases: any[];
  users: any[];
  modules: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onRefresh: () => void;
}

export const ProfessionalOrderManagement: React.FC<ProfessionalOrderManagementProps> = ({
  purchases,
  users,
  modules,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onRefresh
}) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [manualOrder, setManualOrder] = useState({
    customerEmail: '',
    customerName: '',
    moduleIds: [] as string[],
    amount: 0,
    paymentMethod: 'manual',
    status: 'completed',
    notes: ''
  });

  // Handle order actions
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleRefundOrder = (order: any) => {
    setSelectedOrder(order);
    setShowRefundModal(true);
  };

  const handleChangeStatus = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleDeleteOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleManualOrder = () => {
    setManualOrder({
      customerEmail: '',
      customerName: '',
      moduleIds: [],
      amount: 0,
      paymentMethod: 'manual',
      status: 'completed',
      notes: ''
    });
    setShowManualOrderModal(true);
  };

  const processRefund = () => {
    if (selectedOrder) {
      const data = dataStore.loadData();
      const updatedPurchases = data.purchases.map(purchase => 
        purchase.id === selectedOrder.id 
          ? { 
              ...purchase, 
              status: 'refunded', 
              refundReason, 
              refundedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : purchase
      );
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      onRefresh();
      setShowRefundModal(false);
      setRefundReason('');
      setSelectedOrder(null);
    }
  };

  const updateOrderStatus = () => {
    if (selectedOrder && newStatus) {
      const data = dataStore.loadData();
      const updatedPurchases = data.purchases.map(purchase => 
        purchase.id === selectedOrder.id 
          ? { 
              ...purchase, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : purchase.completedAt,
              updatedAt: new Date().toISOString()
            }
          : purchase
      );
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      onRefresh();
      setShowStatusModal(false);
      setNewStatus('');
      setSelectedOrder(null);
    }
  };

  const deleteOrder = () => {
    if (selectedOrder) {
      const data = dataStore.loadData();
      const updatedPurchases = data.purchases.filter(purchase => purchase.id !== selectedOrder.id);
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      onRefresh();
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  const createManualOrder = () => {
    if (!manualOrder.customerEmail || !manualOrder.customerName || manualOrder.moduleIds.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const data = dataStore.loadData();
      
      // Find or create user
      let user = data.users.find(u => u.email === manualOrder.customerEmail);
      if (!user) {
        user = {
          id: `user-${Date.now()}`,
          email: manualOrder.customerEmail,
          name: manualOrder.customerName,
          role: 'user',
          purchasedModules: [],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          totalSpent: 0
        };
        data.users.push(user);
      }

      // Create purchase record
      const newPurchase = {
        id: `purchase-${Date.now()}`,
        userId: user.id,
        moduleIds: manualOrder.moduleIds,
        amount: manualOrder.amount,
        paymentMethod: manualOrder.paymentMethod,
        status: manualOrder.status,
        notes: manualOrder.notes,
        isManual: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: manualOrder.status === 'completed' ? new Date().toISOString() : null
      };

      // Update user's purchased modules and total spent
      user.purchasedModules = [...new Set([...user.purchasedModules, ...manualOrder.moduleIds])];
      user.totalSpent = (user.totalSpent || 0) + manualOrder.amount;

      data.purchases.push(newPurchase);
      
      // Ensure we save the complete data structure
      const completeData = {
        users: data.users,
        modules: data.modules || [],
        purchases: data.purchases,
        analytics: data.analytics || {},
        contentFiles: data.contentFiles || []
      };
      
      dataStore.saveData(completeData);
      
      // Force refresh to show new order
      setTimeout(() => {
        onRefresh();
      }, 100);
      
      setShowManualOrderModal(false);
      setManualOrder({
        customerEmail: '',
        customerName: '',
        moduleIds: [],
        amount: 0,
        paymentMethod: 'manual',
        status: 'completed',
        notes: ''
      });

      alert(`✅ Manual Order Created Successfully!\n\nOrder ID: ${newPurchase.id.slice(-8).toUpperCase()}\nCustomer: ${manualOrder.customerName}\nAmount: $${manualOrder.amount.toFixed(2)}\n\nThe order has been saved and will appear in the list.`);
      
    } catch (error) {
      console.error('Error creating manual order:', error);
      alert('❌ Error creating manual order. Please try again.');
    }
  };

  const handleModuleSelection = (moduleId: string) => {
    const updatedModuleIds = manualOrder.moduleIds.includes(moduleId)
      ? manualOrder.moduleIds.filter(id => id !== moduleId)
      : [...manualOrder.moduleIds, moduleId];
    
    const selectedModules = modules.filter(m => updatedModuleIds.includes(m.id));
    const totalAmount = selectedModules.reduce((sum, module) => sum + module.price, 0);
    
    setManualOrder({
      ...manualOrder,
      moduleIds: updatedModuleIds,
      amount: totalAmount
    });
  };

  const exportOrders = () => {
    try {
      const csvContent = [
        ['Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Payment Method', 'Date', 'Type', 'Notes'],
        ...purchases.map(p => {
          const user = users.find(u => u.id === p.userId);
          return [
            p.id.slice(-8).toUpperCase(),
            user?.name || 'Unknown',
            user?.email || 'No email',
            p.amount.toFixed(2),
            p.status,
            p.paymentMethod || 'card',
            new Date(p.createdAt).toLocaleDateString(),
            p.isManual ? 'Manual' : 'Online',
            p.notes || ''
          ];
        })
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zinga_linga_orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert(`📥 Export Complete!\n\nDownloaded: zinga_linga_orders_${new Date().toISOString().split('T')[0]}.csv\nTotal Orders: ${purchases.length}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Order Management</h3>
          <p className="font-mali text-gray-600">Professional order tracking and management system</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportOrders}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-mali font-bold"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={handleManualOrder}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-mali font-bold"
          >
            <Plus className="w-4 h-4" />
            Manual Order
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">
            ${purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </h3>
          <p className="font-mali opacity-90">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <BarChart3 className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{purchases.length}</h3>
          <p className="font-mali opacity-90">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Clock className="w-6 h-6" />
            </div>
            <AlertCircle className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{purchases.filter(p => p.status === 'pending').length}</h3>
          <p className="font-mali opacity-90">Pending Orders</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
            <Star className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">
            ${purchases.length > 0 ? (purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) / purchases.filter(p => p.status === 'completed').length).toFixed(0) : '0'}
          </h3>
          <p className="font-mali opacity-90">Avg Order Value</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <Plus className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{purchases.filter(p => p.isManual).length}</h3>
          <p className="font-mali opacity-90">Manual Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders, customers, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Order</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Customer</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Amount</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Type</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Date</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases
                .filter(p => {
                  const user = users.find(u => u.id === p.userId);
                  const matchesSearch = searchTerm === '' || 
                    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user?.email.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
                  return matchesSearch && matchesStatus;
                })
                .map((purchase) => {
                  const user = users.find(u => u.id === purchase.userId);
                  
                  return (
                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            purchase.status === 'completed' ? 'bg-green-500' :
                            purchase.status === 'pending' ? 'bg-yellow-500' :
                            purchase.status === 'failed' ? 'bg-red-500' :
                            purchase.status === 'refunded' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="font-mali font-bold text-gray-800">
                              #{purchase.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="font-mali text-gray-500 text-xs">
                              {purchase.paymentMethod || 'card'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                            <span className="text-white font-mali font-bold text-sm">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-mali font-bold text-gray-800">
                              {user?.name || 'Unknown User'}
                            </p>
                            <p className="font-mali text-gray-600 text-sm">
                              {user?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mali font-bold text-gray-800 text-lg">
                          ${purchase.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold w-fit ${
                          purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          purchase.status === 'failed' ? 'bg-red-100 text-red-800' :
                          purchase.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                          purchase.isManual ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {purchase.isManual ? 'Manual' : 'Online'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mali text-gray-800 font-medium">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleViewOrder(purchase)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleChangeStatus(purchase)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Change Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRefundOrder(purchase)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Process Refund"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(purchase)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Order Modal */}
      {showManualOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mali font-bold text-gray-800">Create Manual Order</h3>
                <button 
                  onClick={() => setShowManualOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-mali font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={manualOrder.customerName}
                      onChange={(e) => setManualOrder({...manualOrder, customerName: e.target.value})}
                      placeholder="Enter customer name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Customer Email *</label>
                    <input
                      type="email"
                      value={manualOrder.customerEmail}
                      onChange={(e) => setManualOrder({...manualOrder, customerEmail: e.target.value})}
                      placeholder="Enter customer email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                </div>
              </div>

              {/* Module Selection */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-mali font-bold text-green-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Select Modules *
                </h4>
                <div className="space-y-3">
                  {modules.map(module => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={manualOrder.moduleIds.includes(module.id)}
                          onChange={() => handleModuleSelection(module.id)}
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                        />
                        <div>
                          <p className="font-mali font-bold text-gray-800">{module.title}</p>
                          <p className="font-mali text-gray-600 text-sm">{module.description}</p>
                        </div>
                      </div>
                      <span className="font-mali font-bold text-green-600">${module.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-mali font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={manualOrder.paymentMethod}
                      onChange={(e) => setManualOrder({...manualOrder, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="manual">Manual/Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Order Status</label>
                    <select
                      value={manualOrder.status}
                      onChange={(e) => setManualOrder({...manualOrder, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block font-mali font-bold text-gray-700 mb-2">Total Amount</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mali font-bold text-green-600">${manualOrder.amount.toFixed(2)}</span>
                    <span className="text-sm font-mali text-gray-600">(Auto-calculated from selected modules)</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-mali font-bold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={manualOrder.notes}
                  onChange={(e) => setManualOrder({...manualOrder, notes: e.target.value})}
                  placeholder="Add any additional notes about this order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowManualOrderModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={createManualOrder}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-mali font-bold"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mali font-bold text-gray-800">
                  Order Details #{selectedOrder.id.slice(-8).toUpperCase()}
                </h3>
                <button 
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-mali text-gray-600">Order ID:</span>
                  <p className="font-mali font-bold">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <span className="font-mali text-gray-600">Status:</span>
                  <p className="font-mali font-bold">{selectedOrder.status}</p>
                </div>
                <div>
                  <span className="font-mali text-gray-600">Amount:</span>
                  <p className="font-mali font-bold">${selectedOrder.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-mali text-gray-600">Type:</span>
                  <p className="font-mali font-bold">{selectedOrder.isManual ? 'Manual' : 'Online'}</p>
                </div>
                <div>
                  <span className="font-mali text-gray-600">Payment Method:</span>
                  <p className="font-mali font-bold">{selectedOrder.paymentMethod || 'card'}</p>
                </div>
                <div>
                  <span className="font-mali text-gray-600">Date:</span>
                  <p className="font-mali font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="font-mali text-gray-600">Notes:</span>
                  <p className="font-mali font-bold mt-1">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowOrderDetails(false);
                    handleChangeStatus(selectedOrder);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-mali font-bold"
                >
                  Change Status
                </button>
                <button 
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mali font-bold text-gray-800">Change Order Status</h3>
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-mali font-bold text-blue-800">Order #{selectedOrder.id.slice(-8).toUpperCase()}</p>
                <p className="font-mali text-blue-700 text-sm">Current Status: {selectedOrder.status}</p>
              </div>

              <div>
                <label className="block font-mali font-bold text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={updateOrderStatus}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-mali font-bold"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mali font-bold text-gray-800">Process Refund</h3>
                <button 
                  onClick={() => setShowRefundModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="font-mali font-bold text-yellow-800">Refund Order #{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>
                <p className="font-mali text-yellow-700 text-sm mt-2">
                  Amount: ${selectedOrder.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block font-mali font-bold text-gray-700 mb-2">Refund Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={processRefund}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mali font-bold"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mali font-bold text-gray-800">Delete Order</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="font-mali font-bold text-red-800">Warning: This action cannot be undone</p>
                </div>
                <p className="font-mali text-red-700 text-sm mt-2">
                  Are you sure you want to delete order #{selectedOrder.id.slice(-8).toUpperCase()}?
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteOrder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mali font-bold"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};