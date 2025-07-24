import React, { useState, useEffect } from 'react';
import { Purchase, User, Module } from '../types';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign,
  Calendar,
  User as UserIcon,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreVertical,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Mail,
  Phone
} from 'lucide-react';

interface OrdersPageProps {
  purchases: Purchase[];
  users: User[];
  modules: Module[];
  onRefresh: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ purchases, users, modules, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'user'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort orders
  const filteredOrders = purchases
    .filter(order => {
      const user = users.find(u => u.id === order.userId);
      const matchesSearch = !searchTerm || 
        user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'user':
          const userA = users.find(u => u.id === a.userId)?.name || '';
          const userB = users.find(u => u.id === b.userId)?.name || '';
          comparison = userA.localeCompare(userB);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalRevenue = purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingOrders = purchases.filter(p => p.status === 'pending').length;
  const completedOrders = purchases.filter(p => p.status === 'completed').length;
  const failedOrders = purchases.filter(p => p.status === 'failed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Orders Management</h3>
          <p className="font-mali text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mali font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">${totalRevenue.toLocaleString()}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{completedOrders}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Completed Orders</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{pendingOrders}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Pending Orders</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{failedOrders}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Failed Orders</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, users, or order IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="user">Sort by User</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="p-4 space-y-4">
            {paginatedOrders.map((order) => {
              const user = users.find(u => u.id === order.userId);
              const module = modules.find(m => m.id === order.moduleId);
              
              return (
                <div key={order.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mali font-bold text-gray-800">#{order.id.slice(0, 8)}</p>
                      <p className="font-mali text-gray-600 text-sm">{user?.name || 'Unknown User'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mali font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mali text-gray-600 text-sm">Amount</p>
                      <p className="font-mali font-bold text-lg text-green-600">${order.amount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mali text-gray-600 text-sm">Date</p>
                      <p className="font-mali font-medium">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <p className="font-mali text-gray-600 text-sm">{module?.title || 'Unknown Module'}</p>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Order ID</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Customer</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Module</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Amount</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Date</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => {
                const user = users.find(u => u.id === order.userId);
                const module = modules.find(m => m.id === order.moduleId);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="font-mali font-bold text-gray-800">#{order.id.slice(0, 8)}</span>
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
                          <p className="font-mali font-bold text-gray-800">{user?.name || 'Unknown User'}</p>
                          <p className="font-mali text-gray-600 text-sm">{user?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-mali font-medium text-gray-800">{module?.title || 'Unknown Module'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-mali font-bold text-gray-800 text-lg">${order.amount.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-mali text-gray-800">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mali text-gray-600 text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-mali"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg font-mali ${
                      currentPage === page
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-mali"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
                  Order Details #{selectedOrder.id.slice(0, 8)}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {(() => {
                const user = users.find(u => u.id === selectedOrder.userId);
                const module = modules.find(m => m.id === selectedOrder.moduleId);
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-mali font-bold text-gray-800">Customer Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Name:</span>
                            <span className="font-mali font-bold">{user?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Email:</span>
                            <span className="font-mali font-bold">{user?.email || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">User ID:</span>
                            <span className="font-mali font-bold">{selectedOrder.userId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-mali font-bold text-gray-800">Order Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Order ID:</span>
                            <span className="font-mali font-bold">{selectedOrder.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Date:</span>
                            <span className="font-mali font-bold">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-mali text-gray-600">Amount:</span>
                            <span className="font-mali font-bold text-lg text-green-600">${selectedOrder.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-mali font-bold text-gray-800">Module Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-8 h-8 text-brand-blue" />
                          <div>
                            <p className="font-mali font-bold text-gray-800">{module?.title || 'Unknown Module'}</p>
                            <p className="font-mali text-gray-600">{module?.description || 'No description available'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowOrderModal(false)}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali font-bold"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};