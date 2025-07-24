import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  Check, 
  X, 
  ShoppingCart, 
  User, 
  AlertTriangle, 
  Settings, 
  RefreshCw,
  Download,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  MoreVertical,
  Archive,
  Flag,
  MessageSquare
} from 'lucide-react';
import { Notification, notificationService } from '../utils/notificationService';

interface NotificationsPageProps {
  onRefresh: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onRefresh }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'purchase' | 'user_registration' | 'system' | 'payment_failed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    // Listen for real-time updates
    const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications);
    };

    notificationService.addListener(handleNotificationUpdate);

    return () => {
      notificationService.removeListener(handleNotificationUpdate);
    };
  }, []);

  useEffect(() => {
    filterAndSortNotifications();
  }, [notifications, searchTerm, filterType, filterPriority, sortBy, sortOrder]);

  const loadNotifications = () => {
    setIsLoading(true);
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
    setIsLoading(false);
  };

  const filterAndSortNotifications = () => {
    let filtered = [...notifications];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      if (filterType === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = filtered.filter(n => n.type === filterType);
      }
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredNotifications(filtered);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'user_registration':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'payment_failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return time.toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const handleBulkAction = (action: 'read' | 'delete') => {
    selectedNotifications.forEach(id => {
      if (action === 'read') {
        notificationService.markAsRead(id);
      } else if (action === 'delete') {
        notificationService.deleteNotification(id);
      }
    });
    setSelectedNotifications([]);
    setShowBulkActions(false);
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const currentPageNotifications = getCurrentPageNotifications();
    const allSelected = currentPageNotifications.every(n => selectedNotifications.includes(n.id));
    
    if (allSelected) {
      setSelectedNotifications(prev => prev.filter(id => !currentPageNotifications.map(n => n.id).includes(id)));
    } else {
      setSelectedNotifications(prev => [...new Set([...prev, ...currentPageNotifications.map(n => n.id)])]);
    }
  };

  const getCurrentPageNotifications = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNotifications.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const unreadCount = notifications.filter(n => !n.read).length;
  const stats = notificationService.getStats();

  const createTestNotification = () => {
    const types: Notification['type'][] = ['purchase', 'user_registration', 'system', 'payment_failed'];
    const priorities: Notification['priority'][] = ['urgent', 'high', 'medium', 'low'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const messages = {
      purchase: `New purchase of $${(Math.random() * 50 + 10).toFixed(2)} from customer`,
      user_registration: 'New user registered on the platform',
      system: 'System maintenance completed successfully',
      payment_failed: 'Payment processing failed for order'
    };

    notificationService.createNotification(
      randomType,
      `🔔 ${randomType.replace('_', ' ').toUpperCase()}`,
      messages[randomType],
      randomPriority,
      `user-${Date.now()}`,
      `item-${Date.now()}`,
      { test: true, timestamp: new Date().toISOString() }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">All Notifications</h3>
          <p className="font-mali text-gray-600">Manage and view all system notifications</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={createTestNotification}
            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors font-mali font-bold"
          >
            <Plus className="w-4 h-4" />
            Test Notification
          </button>
          
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
          
          <button
            onClick={() => {
              setIsLoading(true);
              onRefresh();
              loadNotifications();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{stats.total}</h3>
          <p className="font-mali text-gray-600">Total Notifications</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-red-600">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{unreadCount}</h3>
          <p className="font-mali text-gray-600">Unread</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-green-600">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{stats.byType.purchase || 0}</h3>
          <p className="font-mali text-gray-600">Purchases</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
              <User className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{stats.byType.user_registration || 0}</h3>
          <p className="font-mali text-gray-600">New Users</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="all">All Types</option>
            <option value="unread">Unread Only</option>
            <option value="purchase">Purchases</option>
            <option value="user_registration">User Registration</option>
            <option value="system">System</option>
            <option value="payment_failed">Payment Failed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-mali text-blue-800 font-bold">
              {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('read')}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-mali text-sm"
              >
                <Check className="w-4 h-4" />
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-mali text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={getCurrentPageNotifications().length > 0 && getCurrentPageNotifications().every(n => selectedNotifications.includes(n.id))}
              onChange={handleSelectAll}
              className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
            />
            <span className="font-mali font-bold text-gray-800">
              Select All ({getCurrentPageNotifications().length})
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="divide-y divide-gray-200">
          {getCurrentPageNotifications().length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-mali font-bold text-gray-600 mb-2">No notifications found</h4>
              <p className="font-mali text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            getCurrentPageNotifications().map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue mt-1"
                  />
                  
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-mali font-bold text-gray-800 mb-1 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="font-mali text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-mali text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold border ${
                            getPriorityColor(notification.priority)
                          }`}>
                            {notification.priority}
                          </span>
                          
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-mali font-bold">
                            {notification.type.replace('_', ' ')}
                          </span>
                          
                          {!notification.read && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-mali font-bold">
                              Unread
                            </span>
                          )}
                        </div>

                        {/* Additional data for purchase notifications */}
                        {notification.type === 'purchase' && notification.data && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm font-mali">
                              <div>
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-bold text-green-600 ml-2">
                                  ${notification.data.amount?.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Customer:</span>
                                <span className="font-bold ml-2">{notification.data.customer}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="font-mali text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length} notifications
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
          </div>
        )}
      </div>
    </div>
  );
};