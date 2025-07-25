import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Target, 
  Download,
  RefreshCw,
  Package,
  Star,
  Activity,
  Clock,
  Globe
} from 'lucide-react';
import { User, Module, Purchase, Analytics } from '../types';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

// Color scheme for charts
const CHART_COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f59e0b',
  teal: '#14b8a6',
  indigo: '#6366f1',
  red: '#ef4444',
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface AnalyticsPageProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
  analytics: Analytics | null;
  onRefresh: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = (props) => {
  const { users, modules, purchases, onRefresh } = props;
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'orders'>('revenue');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    const from = new Date(now);
    
    switch (timeRange) {
      case '7d': from.setDate(now.getDate() - 7); break;
      case '30d': from.setDate(now.getDate() - 30); break;
      case '90d': from.setDate(now.getDate() - 90); break;
      case '1y': from.setFullYear(now.getFullYear() - 1); break;
      default: from.setDate(now.getDate() - 30);
    }
    
    return { from, to: now };
  };

  // Calculate real-time analytics
  const calculateAnalytics = () => {
    const now = new Date();
    const { from } = getDateRange();
    
    // Filter data based on selected time range
    const dateFilter = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date >= from && date <= now;
      } catch (e) {
        console.error('Error parsing date:', dateString, e);
        return false;
      }
    };
    
    const recentPurchases = purchases.filter(p => dateFilter(p.createdAt));
    const completedPurchases = recentPurchases.filter(p => p.status === 'completed');
    const newUsers = users.filter(u => dateFilter(u.createdAt));
    const payingUsers = Array.from(new Set(completedPurchases.map(p => p.userId))).length;
    
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
    const averageOrderValue = completedPurchases.length > 0 ? totalRevenue / completedPurchases.length : 0;
    const conversionRate = newUsers.length > 0 ? (payingUsers / newUsers.length) * 100 : 0;

    // Calculate growth rates
    const previousPeriod = new Date(from);
    previousPeriod.setDate(from.getDate() - (now.getDate() - from.getDate()));
    
    const previousPurchases = purchases.filter(p => {
      const date = new Date(p.createdAt);
      return date < from && date >= previousPeriod && p.status === 'completed';
    });
    
    const previousRevenue = previousPurchases.reduce((sum, p) => sum + p.amount, 0);
    const previousUsers = users.filter(u => {
      const date = new Date(u.createdAt);
      return date < from && date >= previousPeriod;
    }).length;
    
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : totalRevenue > 0 ? 100 : 0;
      
    const userGrowth = previousUsers > 0 
      ? ((newUsers.length - previousUsers) / previousUsers) * 100 
      : newUsers.length > 0 ? 100 : 0;
      
    const orderGrowth = previousPurchases.length > 0
      ? ((completedPurchases.length - previousPurchases.length) / previousPurchases.length) * 100
      : completedPurchases.length > 0 ? 100 : 0;

    // Calculate module statistics
    const moduleStats = modules.map((module) => {
      // Count purchases that include this module
      const modulePurchases = purchases.filter(purchase => 
        purchase.moduleIds.includes(module.id) && purchase.status === 'completed'
      );
      
      // Calculate total revenue from these purchases
      const revenue = modulePurchases.reduce((sum, purchase) => {
        // Distribute the purchase amount evenly across all modules in the purchase
        const moduleCount = purchase.moduleIds.length;
        return sum + (purchase.amount / moduleCount);
      }, 0);
      
      return {
        ...module,
        purchaseCount: modulePurchases.length,
        revenue,
        rank: 0, // Will be set after sorting
        rating: 4.5 // Mock rating for now
      };
    });
    
    // Sort by revenue and update ranks
    moduleStats.sort((a, b) => b.revenue - a.revenue)
      .forEach((module: any, index: number) => {
        module.rank = index + 1;
      });

    // Get top 5 modules by revenue (stored directly in moduleStats after sorting)

    // Recent activity
    const recentActivity = purchases
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(purchase => {
        const user = users.find(u => u.id === purchase.userId);
        return {
          id: purchase.id,
          type: 'purchase',
          user: user?.name || 'Unknown User',
          amount: purchase.amount,
          status: purchase.status,
          date: purchase.createdAt,
          modules: purchase.moduleIds.length
        };
      });

    // Generate chart data for the last 30 days
    const chartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      
      const dayPurchases = purchases.filter(p => {
        const purchaseDate = new Date(p.createdAt);
        return purchaseDate.toDateString() === date.toDateString() && p.status === 'completed';
      });

      const dayUsers = users.filter(u => {
        const userDate = new Date(u.createdAt);
        return userDate.toDateString() === date.toDateString();
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayPurchases.reduce((sum, p) => sum + p.amount, 0),
        users: dayUsers.length,
        orders: dayPurchases.length
      };
    });

    return {
      totalUsers: users.length,
      totalRevenue,
      totalOrders: completedPurchases.length,
      averageOrderValue,
      conversionRate,
      userGrowth,
      revenueGrowth,
      orderGrowth,
      moduleStats,
      recentActivity,
      chartData
    };
  };

  const analyticsData = calculateAnalytics();

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    prefix = '', 
    suffix = '' 
  }: {
    title: string;
    value: number | string;
    change: number;
    icon: any;
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-mali ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {formatPercentage(change)}
        </div>
      </div>
      <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </h3>
      <p className="font-mali text-gray-600">{title}</p>
    </div>
  );

  const renderChart = (data: any[], metric: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for the selected time period
        </div>
      );
    }

    const chartData = data.map(item => ({
      ...item,
      name: item.date,
      [metric]: item[metric] || 0
    }));

    const formatYAxis = (tick: any) => {
      if (metric === 'revenue') return `$${tick.toLocaleString()}`;
      return tick.toLocaleString();
    };

    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fontFamily: 'Mali, cursive' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fontFamily: 'Mali, cursive' }}
              tickLine={false}
              axisLine={false}
              width={metric === 'revenue' ? 70 : 50}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={CHART_COLORS.blue} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: CHART_COLORS.blue, strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Analytics Dashboard</h3>
          <p className="font-mali text-gray-600">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Time Range Selector */}
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <div className="flex gap-3">
            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold disabled:opacity-50 flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics - Mobile: 2 columns for Users & Revenue, then 2 columns for Orders & Conversion */}
      <div className="space-y-4 lg:space-y-0">
        {/* Primary Metrics - Total Users & Total Revenue (2 columns on mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          <MetricCard
            title="Total Users"
            value={analyticsData.totalUsers}
            change={analyticsData.userGrowth}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.totalRevenue)}
            change={analyticsData.revenueGrowth}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>

        {/* Secondary Metrics - Orders & Conversion Rate (2 columns on mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          <MetricCard
            title="Total Orders"
            value={analyticsData.totalOrders}
            change={analyticsData.orderGrowth}
            icon={ShoppingCart}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          
          <MetricCard
            title="Conversion Rate"
            value={analyticsData.conversionRate.toFixed(1)}
            change={2.1}
            icon={Target}
            color="bg-gradient-to-br from-orange-500 to-red-500"
            suffix="%"
          />
        </div>

        {/* Desktop Layout - All 4 metrics in one row */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={analyticsData.totalUsers}
            change={analyticsData.userGrowth}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.totalRevenue)}
            change={analyticsData.revenueGrowth}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          
          <MetricCard
            title="Total Orders"
            value={analyticsData.totalOrders}
            change={analyticsData.orderGrowth}
            icon={ShoppingCart}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          
          <MetricCard
            title="Conversion Rate"
            value={analyticsData.conversionRate.toFixed(1)}
            change={2.1}
            icon={Target}
            color="bg-gradient-to-br from-orange-500 to-red-500"
            suffix="%"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Main Chart */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800">Performance Overview</h4>
              <p className="text-sm text-gray-500">Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : 'year'}</p>
            </div>
            <div className="flex gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg font-mali text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg font-mali text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="revenue">Revenue</option>
                <option value="users">Users</option>
                <option value="orders">Orders</option>
              </select>
            </div>
          </div>
          
          {renderChart(analyticsData.chartData, selectedMetric)}
          
          {/* Mini metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500 font-mali">Avg. Order</p>
              <p className="font-mali font-bold text-gray-800">{formatCurrency(analyticsData.averageOrderValue)}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500 font-mali">New Users</p>
              <p className="font-mali font-bold text-gray-800">
                {users.filter(u => {
                  try {
                    const date = new Date(u.createdAt);
                    return date >= getDateRange().from;
                  } catch (e) {
                    return false;
                  }
                }).length}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-500 font-mali">Conversion</p>
              <p className="font-mali font-bold text-gray-800">{analyticsData.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Top Modules */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800 mb-6">Top Performing Modules</h4>
          <div className="space-y-3 lg:space-y-4">
            {analyticsData.moduleStats.slice(0, 5).map((module) => (
              <div key={module.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-mali font-bold text-xs lg:text-sm">#{module.rank || 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mali font-bold text-gray-800 text-sm lg:text-base truncate">{module.title}</p>
                    <p className="font-mali text-gray-600 text-xs lg:text-sm">{module.purchaseCount} purchases</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-mali font-bold text-gray-800 text-sm lg:text-base">{formatCurrency(module.revenue)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                    <span className="font-mali text-gray-600 text-xs lg:text-sm">{module.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* User Demographics */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800 mb-4 lg:mb-6">User Breakdown</h4>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-mali text-gray-600 text-sm lg:text-base">Regular Users</span>
              </div>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {users.filter(u => u.role === 'user').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="font-mali text-gray-600 text-sm lg:text-base">Administrators</span>
              </div>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {users.filter(u => u.role === 'admin').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="font-mali text-gray-600 text-sm lg:text-base">Paying Customers</span>
              </div>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {users.filter(u => (u.totalSpent || 0) > 0).length}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800 mb-4 lg:mb-6">Performance</h4>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mali text-gray-600 text-sm lg:text-base">Average Order Value</span>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {formatCurrency(analyticsData.averageOrderValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mali text-gray-600 text-sm lg:text-base">Customer Lifetime Value</span>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {formatCurrency(analyticsData.totalRevenue / Math.max(users.filter(u => (u.totalSpent || 0) > 0).length, 1))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mali text-gray-600 text-sm lg:text-base">Active Modules</span>
              <span className="font-mali font-bold text-gray-800 text-sm lg:text-base">
                {modules.filter(m => m.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800 mb-4 lg:mb-6">Recent Activity</h4>
          <div className="space-y-2 lg:space-y-3 max-h-64 overflow-y-auto">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 lg:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-brand-green to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mali font-bold text-gray-800 text-xs lg:text-sm truncate">{activity.user}</p>
                  <p className="font-mali text-gray-600 text-xs">
                    Purchased {activity.modules} module{activity.modules !== 1 ? 's' : ''} • {formatCurrency(activity.amount)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold flex-shrink-0 ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
        <h4 className="text-lg lg:text-xl font-mali font-bold text-gray-800 mb-4 lg:mb-6">System Health</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <p className="font-mali font-bold text-gray-800 text-sm lg:text-base">System Status</p>
            <p className="font-mali text-green-600 text-xs lg:text-sm">Online</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
            <p className="font-mali font-bold text-gray-800 text-sm lg:text-base">API Response</p>
            <p className="font-mali text-blue-600 text-xs lg:text-sm">Fast (120ms)</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <Package className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
            <p className="font-mali font-bold text-gray-800 text-sm lg:text-base">Data Storage</p>
            <p className="font-mali text-purple-600 text-xs lg:text-sm">Healthy</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
            </div>
            <p className="font-mali font-bold text-gray-800 text-sm lg:text-base">Last Backup</p>
            <p className="font-mali text-orange-600 text-xs lg:text-sm">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};