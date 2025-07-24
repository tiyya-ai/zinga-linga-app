import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Mail, 
  ShoppingCart, 
  User, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Search,
  Download,
  MoreVertical,
  Plus
} from 'lucide-react';
import { Notification, notificationService } from '../utils/notificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'purchase' | 'user_registration' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('NotificationCenter: Component mounted');
    
    // Load initial notifications
    try {
      const initialNotifications = notificationService.getNotifications();
      console.log('NotificationCenter: Initial notifications loaded:', initialNotifications.length);
      setNotifications(initialNotifications);

      // Create demo notifications if none exist
      if (initialNotifications.length === 0) {
        console.log('NotificationCenter: Creating demo notifications...');
        
        notificationService.createNotification(
          'purchase',
          '🛒 New Purchase!',
          'Demo user purchased African Alphabet Adventure for $9.99',
          'high',
          'demo-user-1',
          'demo-purchase-1',
          { amount: 9.99, customer: 'Demo User' }
        );
        
        notificationService.createNotification(
          'user_registration',
          '👤 New User Registered',
          'Sarah Johnson just joined the platform',
          'medium',
          'demo-user-2',
          undefined,
          { user: { name: 'Sarah Johnson', email: 'sarah@example.com' } }
        );
        
        notificationService.createNotification(
          'system',
          '⚡ System Update',
          'Platform updated to version 2.1.0',
          'low',
          undefined,
          undefined,
          { version: '2.1.0' }
        );

        notificationService.createNotification(
          'purchase',
          '💰 Another Purchase!',
          'John Doe bought Tano\'s Number Game for $14.99',
          'high',
          'demo-user-3',
          'demo-purchase-2',
          { amount: 14.99, customer: 'John Doe' }
        );

        // Update notifications after creating demo data
        const updatedNotifications = notificationService.getNotifications();
        console.log('NotificationCenter: Demo notifications created:', updatedNotifications.length);
        setNotifications(updatedNotifications);
      }

      // Listen for real-time updates
      const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
        console.log('NotificationCenter: Notification update received:', updatedNotifications.length);
        setNotifications(updatedNotifications);
      };

      notificationService.addListener(handleNotificationUpdate);
      setIsLoading(false);

      return () => {
        notificationService.removeListener(handleNotificationUpdate);
      };
    } catch (error) {
      console.error('NotificationCenter: Error loading notifications:', error);
      setIsLoading(false);
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    notificationService.requestNotificationPermission();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      notification.type === filter;
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const stats = notificationService.getStats();

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
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notificationService.clearAllNotifications();
    }
  };

  const handleCreateTestNotification = () => {
    const testTypes: Notification['type'][] = ['purchase', 'user_registration', 'system', 'payment_failed'];
    const randomType = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    const testMessages = {
      purchase: {
        title: '🛒 Test Purchase!',
        message: `Test customer purchased Learning Module for $${(Math.random() * 20 + 5).toFixed(2)}`
      },
      user_registration: {
        title: '👤 Test User Registered',
        message: 'Test User just joined the platform'
      },
      system: {
        title: '⚡ Test System Alert',
        message: 'This is a test system notification'
      },
      payment_failed: {
        title: '❌ Test Payment Failed',
        message: 'Test payment failure notification'
      }
    };

    const testMessage = testMessages[randomType];
    notificationService.createNotification(
      randomType,
      testMessage.title,
      testMessage.message,
      'medium',
      'test-user',
      'test-id',
      { test: true }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-brand-blue to-brand-pink rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-mali font-bold text-gray-800">Notifications</h3>
                <p className="text-sm font-mali text-gray-600">
                  {isLoading ? 'Loading...' : `${unreadCount} unread`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateTestNotification}
                className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                title="Create Test Notification"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'purchase', label: 'Purchases', count: stats.byType.purchase || 0 },
              { id: 'user_registration', label: 'Users', count: stats.byType.user_registration || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-2 rounded-lg font-mali font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-mali text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-mali text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
              <h4 className="text-lg font-mali font-bold text-gray-600 mb-2">Loading notifications...</h4>
              <p className="font-mali text-gray-500">Please wait while we load your notifications</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <h4 className="text-lg font-mali font-bold text-gray-600 mb-2">No notifications</h4>
              <p className="font-mali text-gray-500 mb-4">
                {filter === 'unread' ? 'All caught up!' : 'No notifications to show'}
              </p>
              <button
                onClick={handleCreateTestNotification}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
              >
                <Plus className="w-4 h-4" />
                Create Test Notification
              </button>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md group ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-mali font-bold text-gray-800 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="font-mali text-gray-600 text-sm mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mali text-xs text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                            notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            notification.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.priority}
                          </span>
                          
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-mali text-xs"
                            >
                              <Eye className="w-3 h-3" />
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Additional data for purchase notifications */}
                      {notification.type === 'purchase' && notification.data && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-2 text-xs font-mali">
                            <div>
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-bold text-green-600 ml-1">
                                ${notification.data.amount?.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Customer:</span>
                              <span className="font-bold ml-1">{notification.data.customer}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="font-mali font-bold text-gray-800 mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-700">Browser Notifications</span>
                <button className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-700">Email Notifications</span>
                <button className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-700">Sound Alerts</span>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-mali font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs font-mali text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-mali font-bold text-blue-600">{unreadCount}</p>
              <p className="text-xs font-mali text-gray-600">Unread</p>
            </div>
            <div>
              <p className="text-2xl font-mali font-bold text-green-600">{stats.byType.purchase || 0}</p>
              <p className="text-xs font-mali text-gray-600">Purchases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};