import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  RefreshCw, 
  Clock, 
  Check, 
  CheckCircle, 
  ShoppingCart, 
  User, 
  Settings, 
  AlertTriangle,
  Eye,
  Trash2,
  X,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Package,
  Mail,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { notificationService, Notification } from '../utils/notificationService';

interface NotificationsPageProps {
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 10;

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onRefresh }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | string>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load notifications on component mount
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

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const allNotifications = notificationService.getNotifications();
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadNotifications();
      if (onRefresh) onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(notification =>
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = filterType === 'unread' 
        ? result.filter(n => !n.read)
        : result.filter(n => n.type === filterType);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter(n => n.priority === filterPriority);
    }

    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        // Sort by type
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });
  }, [notifications, searchTerm, filterType, filterPriority, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const getCurrentPageNotifications = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Statistics
  const stats = useMemo(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: notifications.length,
      unread: unreadCount,
      byType
    };
  }, [notifications]);

  // Helper functions
  const getNotificationIcon = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'purchase':
        return <ShoppingCart className={`${iconClass} text-green-600`} />;
      case 'user_registration':
        return <User className={`${iconClass} text-blue-600`} />;
      case 'system':
        return <Settings className={`${iconClass} text-purple-600`} />;
      case 'payment_failed':
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  // Action handlers
  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = getCurrentPageNotifications().map(n => n.id);
    const allSelected = currentPageIds.every(id => selectedNotifications.includes(id));
    
    if (allSelected) {
      setSelectedNotifications(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedNotifications(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      notificationService.deleteNotification(id);
    }
  };

  const handleBulkAction = (action: 'read' | 'delete') => {
    if (selectedNotifications.length === 0) return;

    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedNotifications.length} notifications?`)) return;
      selectedNotifications.forEach(id => notificationService.deleteNotification(id));
    } else {
      selectedNotifications.forEach(id => notificationService.markAsRead(id));
    }
    
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Notifications</h3>
          <p className="font-mali text-gray-600">
            {stats.unread > 0 ? `${stats.unread} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mali font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.total}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.unread}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Unread</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.byType.purchase || 0}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Purchases</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{stats.byType.user_registration || 0}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">New Users</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
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
            onChange={(e) => setFilterType(e.target.value)}
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
            onChange={(e) => setFilterPriority(e.target.value)}
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl lg:rounded-2xl p-4">
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
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
              <p className="font-mali text-gray-500">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'No notifications to display'}
              </p>
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
                    <div className="p-2 rounded-full bg-gray-100">
                      {getNotificationIcon(notification.type)}
                    </div>
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
                          <span className="font-mali text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
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
                                  ${notification.data.purchase?.amount?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Customer:</span>
                                <span className="font-bold ml-2">{notification.data.user?.name || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Additional data for user registration */}
                        {notification.type === 'user_registration' && notification.data && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="text-sm font-mali">
                              <span className="text-gray-500">Email:</span>
                              <span className="font-bold ml-2">{notification.data.user?.email || 'Unknown'}</span>
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
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)} of {filteredNotifications.length} notifications
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