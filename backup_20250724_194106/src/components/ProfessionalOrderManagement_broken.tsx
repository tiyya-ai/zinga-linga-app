import React, { useState } from 'react';
import { dataStore } from '../utils/dataStore';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  RefreshCw, 
  MoreVertical, 
  ArrowUpDown,
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Star,
  X,
  Check,
  Ban,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  User,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle
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
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [refundReason, setRefundReason] = useState('');
  const [newStatus, setNewStatus] = useState('');

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

  const processRefund = () => {
    if (selectedOrder) {
      // Load current data
      const data = dataStore.loadData();
      
      // Update the specific order
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
      
      // Save updated data
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      
      // Refresh the data in parent component
      onRefresh();
      
      setShowRefundModal(false);
      setRefundReason('');
      setSelectedOrder(null);
    }
  };

  const updateOrderStatus = () => {
    if (selectedOrder && newStatus) {
      // Load current data
      const data = dataStore.loadData();
      
      // Update the specific order
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
      
      // Save updated data
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      
      // Refresh the data in parent component
      onRefresh();
      
      setShowStatusModal(false);
      setNewStatus('');
      setSelectedOrder(null);
    }
  };

  const deleteOrder = () => {
    if (selectedOrder) {
      // Load current data
      const data = dataStore.loadData();
      
      // Remove the order
      const updatedPurchases = data.purchases.filter(purchase => purchase.id !== selectedOrder.id);
      
      // Save updated data
      dataStore.saveData({ ...data, purchases: updatedPurchases });
      
      // Refresh the data in parent component
      onRefresh();
      
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Date'],
      ...purchases.map(p => {
        const user = users.find(u => u.id === p.userId);
        return [
          p.id.slice(-8).toUpperCase(),
          user?.name || 'Unknown',
          user?.email || 'No email',
          p.amount.toFixed(2),
          p.status,
          new Date(p.createdAt).toLocaleDateString()
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Advanced Controls */}
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
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-mali font-bold">
            <Plus className="w-4 h-4" />
            Manual Order
          </button>
        </div>
      </div>

      {/* Advanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="mt-2 text-sm opacity-75">
            +{purchases.filter(p => p.status === 'completed' && new Date(p.createdAt).getMonth() === new Date().getMonth()).length} this month
          </div>
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
          <div className="mt-2 text-sm opacity-75">
            {purchases.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length} today
          </div>
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
          <div className="mt-2 text-sm opacity-75">
            Requires attention
          </div>
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
          <div className="mt-2 text-sm opacity-75">
            Per transaction
          </div>
        </div>
      </div>

      {/* Advanced Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders, customers, or order IDs..."
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
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mali text-gray-600 text-sm">
              {purchases.filter(p => {
                const matchesSearch = searchTerm === '' || 
                  p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  users.find(u => u.id === p.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  users.find(u => u.id === p.userId)?.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
                return matchesSearch && matchesStatus;
              }).length} orders found
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSortBy('date');
                setSortOrder('desc');
              }}
              className="text-brand-blue hover:text-brand-blue/80 font-mali text-sm"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Professional Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Order Details</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Customer</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Items</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Amount</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Date</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases
                .filter(p => {
                  const matchesSearch = searchTerm === '' || 
                    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    users.find(u => u.id === p.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    users.find(u => u.id === p.userId)?.email.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
                  return matchesSearch && matchesStatus;
                })
                .sort((a, b) => {
                  let aVal, bVal;
                  switch (sortBy) {
                    case 'amount':
                      aVal = a.amount;
                      bVal = b.amount;
                      break;
                    case 'customer':
                      aVal = users.find(u => u.id === a.userId)?.name || '';
                      bVal = users.find(u => u.id === b.userId)?.name || '';
                      break;
                    case 'status':
                      aVal = a.status;
                      bVal = b.status;
                      break;
                    default:
                      aVal = new Date(a.createdAt).getTime();
                      bVal = new Date(b.createdAt).getTime();
                  }
                  if (sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                  } else {
                    return aVal < bVal ? 1 : -1;
                  }
                })
                .map((purchase) => {
                  const user = users.find(u => u.id === purchase.userId);
                  const purchaseModules = modules.filter(m => purchase.moduleIds.includes(m.id));
                  
                  return (
                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
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
                              {purchase.paymentMethod}
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
                        <div className="flex flex-col gap-1">
                          {purchaseModules.slice(0, 2).map((module) => (
                            <div key={module.id} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                module.character === 'kiki' ? 'bg-yellow-500' : 'bg-pink-500'
                              }`}></div>
                              <span className="font-mali text-gray-700 text-sm truncate max-w-32">
                                {module.title}
                              </span>
                            </div>
                          ))}
                          {purchaseModules.length > 2 && (
                            <span className="font-mali text-gray-500 text-xs">
                              +{purchaseModules.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-mali font-bold text-gray-800 text-lg">
                            ${purchase.amount.toFixed(2)}
                          </span>
                          <p className="font-mali text-gray-500 text-xs">
                            {purchaseModules.length} item{purchaseModules.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold w-fit ${
                            purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                            purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            purchase.status === 'failed' ? 'bg-red-100 text-red-800' :
                            purchase.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                          {purchase.completedAt && (
                            <span className="font-mali text-gray-500 text-xs">
                              Completed {new Date(purchase.completedAt).toLocaleDateString()}
                            </span>
                          )}
                          {purchase.refundedAt && (
                            <span className="font-mali text-gray-500 text-xs">
                              Refunded {new Date(purchase.refundedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-mali text-gray-800 font-medium">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-mali text-gray-600 text-sm">
                            {new Date(purchase.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
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

              <div className="flex justify-end gap-3 pt-4"<button 
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
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
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">Order Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Order ID:</span>
                      <span className="font-mali font-bold">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-mali font-bold ${
                        selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.status === 'failed' ? 'bg-red-100 text-red-800' :
                        selectedOrder.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Payment Method:</span>
                      <span className="font-mali font-bold">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Total Amount:</span>
                      <span className="font-mali font-bold text-lg">${selectedOrder.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Order Date:</span>
                      <span className="font-mali font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedOrder.completedAt && (
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Completed:</span>
                        <span className="font-mali font-bold">{new Date(selectedOrder.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.refundedAt && (
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Refunded:</span>
                        <span className="font-mali font-bold">{new Date(selectedOrder.refundedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.refundReason && (
                      <div className="flex justify-between">
                        <span className="font-mali text-gray-600">Refund Reason:</span>
                        <span className="font-mali font-bold">{selectedOrder.refundReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">Customer Information</h4>
                  {(() => {
                    const customer = users.find(u => u.id === selectedOrder.userId);
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                            <span className="text-white font-mali font-bold">
                              {customer?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-mali font-bold text-gray-800">{customer?.name || 'Unknown User'}</p>
                            <p className="font-mali text-gray-600">{customer?.email || 'No email'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">User ID:</span>
                          <span className="font-mali font-bold">{selectedOrder.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">Total Spent:</span>
                          <span className="font-mali font-bold">${customer?.totalSpent?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-mali text-gray-600">Member Since:</span>
                          <span className="font-mali font-bold">{customer ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Purchased Items */}
              <div className="space-y-4">
                <h4 className="text-lg font-mali font-bold text-gray-800">Purchased Items</h4>
                <div className="space-y-3">
                  {modules.filter(m => selectedOrder.moduleIds.includes(m.id)).map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          module.character === 'kiki' ? 'bg-yellow-500' : 'bg-pink-500'
                        }`}>
                          <span className="text-white font-mali font-bold text-sm">
                            {module.character === 'kiki' ? 'K' : 'T'}
                          </span>
                        </div>
                        <div>
                          <p className="font-mali font-bold text-gray-800">{module.title}</p>
                          <p className="font-mali text-gray-600 text-sm">{module.character}'s Module • {module.ageRange}</p>
                          <p className="font-mali text-gray-500 text-xs">{module.fullContent.length} activities</p>
                        </div>
                      </div>
                      <span className="font-mali font-bold text-gray-800">${module.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
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
                  onClick={() => {
                    setShowOrderDetails(false);
                    handleRefundOrder(selectedOrder);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-mali font-bold"
                >
                  Process Refund
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

      {/* Empty State */}
      {purchases.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-mali font-bold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="font-mali text-gray-600 mb-6 max-w-md mx-auto">
              Orders will appear here when customers make purchases. Your professional order management system is ready!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};