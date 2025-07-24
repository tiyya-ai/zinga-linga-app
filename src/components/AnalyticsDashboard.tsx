import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Target,
  Award,
  Activity,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Star,
  Package,
  CreditCard,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsDashboardProps {
  users: any[];
  purchases: any[];
  modules: any[];
  onRefresh: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  users,
  purchases,
  modules,
  onRefresh
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };
    
    const cutoffDate = new Date(now.getTime() - timeRanges[timeRange]);
    
    // Filter data by time range
    const recentUsers = users.filter(u => new Date(u.createdAt) >= cutoffDate);
    const recentPurchases = purchases.filter(p => new Date(p.createdAt) >= cutoffDate);
    const completedPurchases = recentPurchases.filter(p => p.status === 'completed');
    
    // Calculate metrics
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
    const totalUsers = users.length;
    const newUsers = recentUsers.length;
    const totalPurchases = completedPurchases.length;
    const averageOrderValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
    const conversionRate = totalUsers > 0 ? (totalPurchases / totalUsers) * 100 : 0;
    
    // Calculate growth rates
    const previousPeriodStart = new Date(cutoffDate.getTime() - timeRanges[timeRange]);
    const previousUsers = users.filter(u => {
      const date = new Date(u.createdAt);
      return date >= previousPeriodStart && date < cutoffDate;
    });
    const previousPurchases = purchases.filter(p => {
      const date = new Date(p.createdAt);
      return date >= previousPeriodStart && date < cutoffDate && p.status === 'completed';
    });
    
    const userGrowth = previousUsers.length > 0 ? 
      ((newUsers - previousUsers.length) / previousUsers.length) * 100 : 100;
    const revenueGrowth = previousPurchases.length > 0 ? 
      ((totalRevenue - previousPurchases.reduce((sum, p) => sum + p.amount, 0)) / 
       previousPurchases.reduce((sum, p) => sum + p.amount, 0)) * 100 : 100;
    
    // Generate daily data for charts
    const dailyData = [];
    for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365); i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayUsers = users.filter(u => {
        const userDate = new Date(u.createdAt);
        return userDate >= dayStart && userDate < dayEnd;
      }).length;
      
      const dayRevenue = purchases.filter(p => {
        const purchaseDate = new Date(p.createdAt);
        return purchaseDate >= dayStart && purchaseDate < dayEnd && p.status === 'completed';
      }).reduce((sum, p) => sum + p.amount, 0);
      
      dailyData.unshift({
        date: date.toLocaleDateString(),
        users: dayUsers,
        revenue: dayRevenue,
        day: date.getDate()
      });
    }
    
    // Top modules
    const moduleStats = modules.map(module => {
      const modulePurchases = completedPurchases.filter(p => 
        p.moduleIds.includes(module.id)
      ).length;
      const moduleRevenue = completedPurchases
        .filter(p => p.moduleIds.includes(module.id))
        .reduce((sum, p) => sum + (p.amount / p.moduleIds.length), 0);
      
      return {
        ...module,
        purchases: modulePurchases,
        revenue: moduleRevenue
      };
    }).sort((a, b) => b.purchases - a.purchases);
    
    // User demographics
    const usersByRole = {
      admin: users.filter(u => u.role === 'admin').length,
      user: users.filter(u => u.role === 'user').length
    };
    
    // Recent activity
    const recentActivity = [
      ...recentUsers.slice(0, 5).map(u => ({
        type: 'user_signup',
        message: `${u.name} joined the platform`,
        time: u.createdAt,
        icon: Users
      })),
      ...recentPurchases.slice(0, 5).map(p => {
        const user = users.find(u => u.id === p.userId);
        return {
          type: 'purchase',
          message: `${user?.name || 'User'} made a purchase of $${p.amount}`,
          time: p.createdAt,
          icon: ShoppingCart
        };
      })
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
    
    return {
      totalRevenue,
      totalUsers,
      newUsers,
      totalPurchases,
      averageOrderValue,
      conversionRate,
      userGrowth,
      revenueGrowth,
      dailyData,
      moduleStats,
      usersByRole,
      recentActivity
    };
  }, [users, purchases, modules, timeRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await onRefresh();
    setTimeout(() => setIsLoading(false), 1000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Analytics Dashboard</h3>
          <p className="font-mali text-gray-600">Real-time insights from your platform data</p>
        </div>
        
        <div className="flex items-center gap-4">
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
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-mali font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-mali font-bold">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-mali ${
              analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(analytics.revenueGrowth)}
            </div>
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">
            {formatCurrency(analytics.totalRevenue)}
          </h3>
          <p className="font-mali text-gray-600">Total Revenue</p>
          <p className="font-mali text-gray-500 text-sm mt-1">
            {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last 90 days' : 'Last year'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-mali ${
              analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.userGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(analytics.userGrowth)}
            </div>
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{analytics.totalUsers}</h3>
          <p className="font-mali text-gray-600">Total Users</p>
          <p className="font-mali text-gray-500 text-sm mt-1">
            +{analytics.newUsers} new users
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-mali text-blue-600">
              <Target className="w-4 h-4" />
              {analytics.conversionRate.toFixed(1)}%
            </div>
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{analytics.totalPurchases}</h3>
          <p className="font-mali text-gray-600">Total Orders</p>
          <p className="font-mali text-gray-500 text-sm mt-1">
            Conversion rate: {analytics.conversionRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-mali text-green-600">
              <Award className="w-4 h-4" />
              AOV
            </div>
          </div>
          <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">
            {formatCurrency(analytics.averageOrderValue)}
          </h3>
          <p className="font-mali text-gray-600">Avg Order Value</p>
          <p className="font-mali text-gray-500 text-sm mt-1">
            Per transaction
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-mali font-bold text-gray-800">Revenue Trend</h4>
            <LineChart className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.dailyData.slice(-14).map((day, index) => {
              const maxRevenue = Math.max(...analytics.dailyData.map(d => d.revenue));
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-xs font-mali text-gray-600">
                    {formatCurrency(day.revenue)}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg min-h-[4px] transition-all duration-300 hover:from-green-600 hover:to-green-500"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${day.date}: ${formatCurrency(day.revenue)}`}
                  ></div>
                  <div className="text-xs font-mali text-gray-500">
                    {day.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-mali font-bold text-gray-800">User Growth</h4>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.dailyData.slice(-14).map((day, index) => {
              const maxUsers = Math.max(...analytics.dailyData.map(d => d.users));
              const height = maxUsers > 0 ? (day.users / maxUsers) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-xs font-mali text-gray-600">
                    {day.users}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px] transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${day.date}: ${day.users} users`}
                  ></div>
                  <div className="text-xs font-mali text-gray-500">
                    {day.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Modules & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Modules */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-mali font-bold text-gray-800">Top Performing Modules</h4>
            <Package className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {analytics.moduleStats.slice(0, 5).map((module, index) => (
              <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    module.character === 'kiki' ? 'bg-yellow-500' : 'bg-pink-500'
                  }`}>
                    <span className="text-white font-mali font-bold">
                      {module.character === 'kiki' ? 'K' : 'T'}
                    </span>
                  </div>
                  <div>
                    <p className="font-mali font-bold text-gray-800">{module.title}</p>
                    <p className="font-mali text-gray-600 text-sm">{module.purchases} purchases</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mali font-bold text-green-600">{formatCurrency(module.revenue)}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-mali text-gray-600 text-sm">{module.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-mali font-bold text-gray-800">Recent Activity</h4>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'user_signup' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'user_signup' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-mali text-gray-800 text-sm">{activity.message}</p>
                  <p className="font-mali text-gray-500 text-xs">
                    {new Date(activity.time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Demographics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-mali font-bold text-gray-800">User Demographics</h4>
          <PieChart className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Types */}
          <div>
            <h5 className="font-mali font-bold text-gray-700 mb-4">User Types</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-mali text-gray-600">Regular Users</span>
                </div>
                <span className="font-mali font-bold text-gray-800">{analytics.usersByRole.user}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-mali text-gray-600">Administrators</span>
                </div>
                <span className="font-mali font-bold text-gray-800">{analytics.usersByRole.admin}</span>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div>
            <h5 className="font-mali font-bold text-gray-700 mb-4">Growth Metrics</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-600">User Growth</span>
                <span className={`font-mali font-bold ${
                  analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(analytics.userGrowth)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-600">Revenue Growth</span>
                <span className={`font-mali font-bold ${
                  analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(analytics.revenueGrowth)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h5 className="font-mali font-bold text-gray-700 mb-4">Performance</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-600">Conversion Rate</span>
                <span className="font-mali font-bold text-blue-600">
                  {analytics.conversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mali text-gray-600">Avg Order Value</span>
                <span className="font-mali font-bold text-green-600">
                  {formatCurrency(analytics.averageOrderValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};