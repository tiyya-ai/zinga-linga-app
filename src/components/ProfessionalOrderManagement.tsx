import React, { useState, useMemo, ReactNode } from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  Plus,
  Eye,
  RefreshCw,
  ArrowUpDown,
  DollarSign,
  ShoppingCart,
  Clock,
  X,
  Download,
  User,
  Trash2,
  CreditCard as CreditCardIcon,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Star
} from 'lucide-react';
import type { Module as ModuleType, Purchase, User } from '../types';

type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'all';

interface ProfessionalOrderManagementProps {
  purchases: Purchase[];
  users: UserType[];
  filterStatus: OrderStatus;
  setFilterStatus: (status: OrderStatus) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  handleSort: (field: string) => void;
}

// Type for credit card payment method
type CreditCardPayment = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

// Type guard for CreditCardPayment
function isCreditCard(payment: unknown): payment is CreditCardPayment {
  if (!payment || typeof payment !== 'object') return false;
  const p = payment as Record<string, unknown>;
  return (
    typeof p.brand === 'string' && 
    typeof p.last4 === 'string' &&
    typeof p.expMonth === 'number' &&
    typeof p.expYear === 'number' &&
    (p.isDefault === undefined || typeof p.isDefault === 'boolean')
  );
}

// Type for generic payment method
type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer' | 'other' | string;

// Type for payment method
type PaymentMethod = {
  type: PaymentMethodType;
  [key: string]: unknown; // Allow additional properties
};

// Type guard for PaymentMethod
function isPaymentMethod(payment: unknown): payment is PaymentMethod {
  if (!payment || typeof payment !== 'object') return false;
  const p = payment as Record<string, unknown>;
  return (
    'type' in p && 
    typeof p.type === 'string' &&
    (p.type === 'credit_card' || p.type === 'paypal' || p.type === 'bank_transfer' || p.type === 'other')
  );
}

// Type for filter status
type FilterStatus = OrderStatus | '';

// Helper function to render payment method
const renderPaymentMethod = (payment: unknown) => {
  if (!payment || typeof payment !== 'object') return <span>N/A</span>;
  
  if (isCreditCard(payment)) {
    return (
      <div className="flex items-center">
        <CreditCardIcon className="w-4 h-4 mr-1" />
        {payment.brand} •••• {payment.last4}
      </div>
    );
  }
  
  if (isPaymentMethod(payment)) {
    return <span className="capitalize">{payment.type}</span>;
  }
  
  return <span>N/A</span>;
};

// Type definitions
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  purchasedModules: string[];
  createdAt: string;
  lastLogin: string;
  totalSpent: number;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other';
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Module extends ModuleType {}

interface Purchase {
  id: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  modules: ModuleType[];
  paymentMethod: PaymentMethod | CreditCardPayment | string;
  isManual?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundReason?: string;
}

interface ProfessionalOrderManagementProps {
  purchases: Purchase[];
  users: User[];
  modules?: ModuleType[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: OrderStatus;
  setFilterStatus: (status: OrderStatus) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onRefresh?: () => void;
}

export const ProfessionalOrderManagement: React.FC<ProfessionalOrderManagementProps> = ({
  purchases = [],
  users = [],
  modules = [],
  searchTerm = '',
  setSearchTerm = () => {},
  filterStatus = 'all',
  setFilterStatus = () => {},
  sortBy = 'date',
  setSortBy = () => {},
  sortOrder = 'desc',
  setSortOrder = () => {},
  onRefresh = () => {}
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Process and filter orders
  const processedOrders = useMemo(() => {
    return purchases
      .filter((purchase: Purchase) => {
        const matchesSearch = 
          purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          users.find((u: User) => u.id === purchase.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || purchase.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a: Purchase, b: Purchase) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortBy === 'customer') {
          const userA = users.find((u: User) => u.id === a.userId)?.name || '';
          const userB = users.find((u: User) => u.id === b.userId)?.name || '';
          return sortOrder === 'asc'
            ? userA.localeCompare(userB)
            : userB.localeCompare(userA);
        } else {
          return 0;
        }
      });
  }, [purchases, searchTerm, filterStatus, sortBy, sortOrder, users]);

  // Use the processed orders in the component
  const displayedOrders = processedOrders;

  // Calculate summary stats
  const stats = useMemo(() => ({
    totalOrders: purchases.length,
    totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0),
    pendingOrders: purchases.filter(p => p.status === 'pending').length,
    completedOrders: purchases.filter(p => p.status === 'completed').length
  }), [purchases]);

  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
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
  const handleViewOrder = (order: Purchase) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleChangeStatus = (order: Purchase) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleRefundOrder = (order: Purchase) => {
    setSelectedOrder(order);
    setShowRefundModal(true);
  };

  const handleDeleteOrder = (order: Purchase) => {
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
      const updatedPurchases = data.purchases.map((purchase: Purchase) => 
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
      
      // Save all data including updated analytics
      const success = dataStore.saveData({
        users: data.users,
        modules: data.modules,
        purchases: updatedPurchases,
        contentFiles: data.contentFiles || [],
        analytics: dataStore.generateAnalytics(data.users, data.modules, updatedPurchases),
        lastUpdated: new Date().toISOString()
      });
      
      if (success) {
        onRefresh();
        setShowRefundModal(false);
        setRefundReason('');
        setSelectedOrder(null);
      } else {
        console.error('Failed to process refund');
      }
    }
  };

  const updateOrderStatus = () => {
    if (selectedOrder && newStatus) {
      const data = dataStore.loadData();
      const updatedPurchases = data.purchases.map((purchase: Purchase) => 
        purchase.id === selectedOrder.id 
          ? { 
              ...purchase, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : purchase.completedAt,
              updatedAt: new Date().toISOString()
            }
          : purchase
      );
      
      // Save all data including updated analytics
      const success = dataStore.saveData({
        users: data.users,
        modules: data.modules,
        purchases: updatedPurchases,
        contentFiles: data.contentFiles || [],
        analytics: dataStore.generateAnalytics(data.users, data.modules, updatedPurchases),
        lastUpdated: new Date().toISOString()
      });
      
      if (success) {
        onRefresh();
        setShowStatusModal(false);
        setNewStatus('');
        setSelectedOrder(null);
      } else {
        console.error('Failed to update order status');
      }
    }
  };

  const deleteOrder = () => {
    if (selectedOrder) {
      const data = dataStore.loadData();
      const updatedPurchases = data.purchases.filter((purchase: Purchase) => purchase.id !== selectedOrder.id);
      
      // Save all data including updated analytics
      const success = dataStore.saveData({
        users: data.users,
        modules: data.modules,
        purchases: updatedPurchases,
        contentFiles: data.contentFiles || [],
        analytics: dataStore.generateAnalytics(data.users, data.modules, updatedPurchases),
        lastUpdated: new Date().toISOString()
      });
      
      if (success) {
        onRefresh();
        setShowDeleteModal(false);
        setSelectedOrder(null);
      } else {
        console.error('Failed to delete order');
      }
    }
  };

  const createManualOrder = () => {
    if (!manualOrder.customerEmail || !manualOrder.customerName || manualOrder.moduleIds.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Load fresh data
      const data = dataStore.loadData();
      console.log('Current data before manual order:', data);
      
      // Find or create user
      let user = data.users.find((u: User) => u.email === manualOrder.customerEmail);
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
        console.log('Created new user:', user);
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

      console.log('Creating manual order:', newPurchase);

      // Update user's purchased modules and total spent
      user.purchasedModules = [...new Set([...user.purchasedModules, ...manualOrder.moduleIds])];
      user.totalSpent = (user.totalSpent || 0) + manualOrder.amount;

      // Add to purchases
      data.purchases.push(newPurchase);
      
      console.log('Total purchases after adding:', data.purchases.length);
      console.log('All purchases:', data.purchases.map((p: Purchase) => ({ id: p.id, amount: p.amount, isManual: p.isManual })));
      
      // Save data with explicit structure
      const savedData = {
        users: data.users,
        modules: data.modules,
        purchases: data.purchases,
        analytics: data.analytics || {},
        contentFiles: data.contentFiles || []
      };
      
      dataStore.saveData(savedData);
      console.log('Data saved successfully');
      
      // Verify save worked
      const verifyData = dataStore.loadData();
      console.log('Verification - Total purchases after save:', verifyData.purchases.length);
      
      // Close modal and reset form
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

      // Show success message
      alert(`✅ Manual Order Created Successfully!\n\nOrder ID: ${newPurchase.id.slice(-8).toUpperCase()}\nCustomer: ${manualOrder.customerName}\nAmount: $${manualOrder.amount.toFixed(2)}\n\nRefreshing data...`);
      
      // Force refresh
      onRefresh();
      
    } catch (error) {
      console.error('Error creating manual order:', error);
      alert('❌ Error creating manual order. Please try again.');
    }
  };

  const handleModuleSelection = (moduleId: string) => {
    const updatedModuleIds = manualOrder.moduleIds.includes(moduleId)
      ? manualOrder.moduleIds.filter(id => id !== moduleId)
      : [...manualOrder.moduleIds, moduleId];
    
    const selectedModules = modules.filter((m: Module) => updatedModuleIds.includes(m.id));
    const totalAmount = selectedModules.reduce((sum: number, module: Module) => sum + module.price, 0);
    
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
          
          // Get payment method display text
          let paymentMethodDisplay = 'N/A';
          if (p.paymentMethod) {
            if (typeof p.paymentMethod === 'string') {
              paymentMethodDisplay = p.paymentMethod;
            } else if (typeof p.paymentMethod === 'object' && p.paymentMethod !== null) {
              // Handle object payment methods
              const pm = p.paymentMethod as Record<string, unknown>;
              if (isCreditCard(pm)) {
                paymentMethodDisplay = `${pm.brand} •••• ${pm.last4}`;
              } else if (isPaymentMethod(pm)) {
                paymentMethodDisplay = pm.type;
              } else if ('type' in pm && typeof pm.type === 'string') {
                paymentMethodDisplay = pm.type;
              } else if ('brand' in pm && 'last4' in pm) {
                paymentMethodDisplay = `${pm.brand} •••• ${pm.last4}`;
              }
            }
          }
          
          return [
            p.id.slice(-8).toUpperCase(),
            user?.name || 'Unknown',
            user?.email || 'No email',
            p.amount.toFixed(2),
            p.status,
            paymentMethodDisplay,
            new Date(p.createdAt).toLocaleDateString(),
            (p as any).isManual ? 'Manual' : 'Online',
            (p as any).notes || ''
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

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate stats
  const stats = useMemo(() => ({
    totalOrders: purchases.length,
    totalRevenue: purchases
      .filter((p: Purchase) => p.status === 'completed')
      .reduce((sum: number, p: Purchase) => sum + p.amount, 0),
    pendingOrders: purchases.filter((p: Purchase) => p.status === 'pending').length,
    completedOrders: purchases.filter((p: Purchase) => p.status === 'completed').length
  }), [purchases]);

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
            ${stats.totalRevenue.toLocaleString()}
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
          <h3 className="text-3xl font-mali font-bold mb-1">{stats.totalOrders}</h3>
          <p className="font-mali opacity-90">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Clock className="w-6 h-6" />
            </div>
            <AlertCircle className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{stats.pendingOrders}</h3>
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
            ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : '0'}
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
          <h3 className="text-3xl font-mali font-bold mb-1">{stats.completedOrders}</h3>
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value as FilterStatus;
                setFilterStatus(value === 'all' ? '' : value);
              }}
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
              onChange={(e) => handleSort(e.target.value)}
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
                  const matchesStatus = filterStatus === '' || p.status === filterStatus;
                  return matchesSearch && matchesStatus;
                })
                .map((purchase) => {
                  const user = users.find(u => u.id === purchase.userId);
                  const purchaseDate = purchase.createdAt ? new Date(purchase.createdAt) : null;
                  
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
                            <div className="font-mali text-gray-500 text-xs">
                              {purchase.paymentMethod ? (
                                isCreditCard(purchase.paymentMethod) ? (
                                  <div className="flex items-center">
                                    <CreditCardIcon className="w-4 h-4 mr-1" />
                                    {purchase.paymentMethod.brand} •••• {purchase.paymentMethod.last4}
                                  </div>
                                ) : (
                                  <span className="capitalize">
                                    {purchase.paymentMethod.type || 'N/A'}
                                  </span>
                                )
                              ) : (
                                <span>N/A</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                            <span className="text-white font-mali font-bold text-sm">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                        <p className="font-mali text-gray-800">
                          {purchase.moduleIds?.length > 0 
                            ? purchase.moduleIds
                                .map(moduleId => {
                                  const module = modules.find(m => m.id === moduleId);
                                  return module?.title || 'Unknown Module';
                                })
                                .join(', ')
                            : 'No modules'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mali font-bold text-gray-800 text-lg">
                          ${purchase.amount ? purchase.amount.toFixed(2) : '0.00'}
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
                        <p className="font-mali font-bold text-gray-800">{purchase.isManual ? 'Manual' : 'Online'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mali text-gray-800 font-medium">
                          {purchaseDate 
                            ? purchaseDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
                  <div className="font-mali font-bold">
                    {typeof selectedOrder.paymentMethod === 'string' ? (
                      <span className="capitalize">{selectedOrder.paymentMethod}</span>
                    ) : (
                      renderPaymentMethod(selectedOrder.paymentMethod)
                    )}
                  </div>
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
      
      {/* Export Button */}
      <div className="mt-4">
        <button 
          onClick={exportOrders}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="-ml-1 mr-2 h-4 w-4" />
          Export
        </button>
      </div>

            {/* Orders Table */}
            <div className="mt-6 bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'id', label: 'Order ID' },
                      { key: 'customer', label: 'Customer' },
                      { key: 'date', label: 'Date' },
                      { key: 'amount', label: 'Amount' },
                      { key: 'status', label: 'Status' },
                      { key: 'actions', label: 'Actions' }
                    ].map((header) => (
                      <th 
                        key={header.key}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.key !== 'actions' ? (
                          <button 
                            onClick={() => handleSort(header.key)}
                            className="group inline-flex items-center"
                          >
                            {header.label}
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                          </button>
                        ) : header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map((order: Purchase) => {
                      const user = users.find((u: User) => u.id === order.userId);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user?.name || 'Unknown User'}</div>
                            <div className="text-sm text-gray-500">{user?.email || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(order.createdAt), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      };
      
      // Main component JSX is already properly closed in the existing code
      return (
        <div className="min-h-screen bg-gray-100">
          {/* Main content */}
          <main className="p-6">
            {/* Stats and other components */}
          </main>
        </div>
      );