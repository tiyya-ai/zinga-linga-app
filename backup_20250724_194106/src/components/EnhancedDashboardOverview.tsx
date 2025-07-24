import React from 'react';
import { User, Module, Purchase, Analytics } from '../types';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Package,
  TrendingUp,
  Clock,
  Star,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface EnhancedDashboardOverviewProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
  analytics: Analytics | null;
  onNavigateToTab: (tab: string) => void;
}

export const EnhancedDashboardOverview: React.FC<EnhancedDashboardOverviewProps> = ({
  users,
  modules,
  purchases,
  analytics,
  onNavigateToTab
}) => {
  const pendingPurchases = purchases.filter(p => p.status === 'pending').length;
  const completedPurchases = purchases.filter(p => p.status === 'completed').length;
  const failedPurchases = purchases.filter(p => p.status === 'failed').length;
  const activeModules = modules.filter(m => m.isActive).length;
  const totalRevenue = purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color, 
    onClick,
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color: string;
    onClick?: () => void;
    subtitle?: string;
  }) => (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-mali font-bold flex items-center gap-1 ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-mali font-bold text-gray-800 mb-1">{value}</h3>
      <p className="font-mali text-gray-600">{title}</p>
      {subtitle && (
        <p className="font-mali text-gray-500 text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color, 
    onClick 
  }: {
    title: string;
    description: string;
    icon: any;
    color: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full p-6 ${color} rounded-2xl text-white hover:opacity-90 transition-all hover:scale-105 text-left`}
    >
      <div className="flex items-center gap-4 mb-3">
        <Icon className="w-8 h-8" />
        <h3 className="text-xl font-mali font-bold">{title}</h3>
      </div>
      <p className="font-mali text-white/90">{description}</p>
    </button>
  );

  const ActivityItem = ({ 
    icon: Icon, 
    title, 
    description, 
    time, 
    color 
  }: {
    icon: any;
    title: string;
    description: string;
    time: string;
    color: string;
  }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className={`p-2 rounded-full ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-mali font-bold text-gray-800">{title}</h4>
        <p className="font-mali text-gray-600 text-sm">{description}</p>
      </div>
      <span className="font-mali text-gray-500 text-sm">{time}</span>
    </div>
  );

  const recentPurchases = purchases
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-pink rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mali font-bold mb-2">Welcome to Zinga Linga Admin</h1>
            <p className="font-mali text-blue-100 text-lg">
              Manage your educational platform with ease
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-16 h-16 text-white/30" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length.toLocaleString()}
          icon={Users}
          trend="+12%"
          color="bg-brand-blue"
          onClick={() => onNavigateToTab('users')}
          subtitle="Active learners"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8%"
          color="bg-brand-green"
          onClick={() => onNavigateToTab('purchases')}
          subtitle="This month"
        />
        <StatCard
          title="Active Modules"
          value={activeModules}
          icon={Package}
          color="bg-brand-pink"
          onClick={() => onNavigateToTab('modules')}
          subtitle={`${modules.length} total`}
        />
        <StatCard
          title="Pending Orders"
          value={pendingPurchases}
          icon={Clock}
          trend={pendingPurchases > 0 ? `${pendingPurchases} new` : ''}
          color="bg-brand-yellow"
          onClick={() => onNavigateToTab('purchases')}
          subtitle="Needs attention"
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-mali font-bold text-gray-800 mb-4">Purchase Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-mali text-gray-700">Completed</span>
              </div>
              <span className="font-mali font-bold text-gray-800">{completedPurchases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-mali text-gray-700">Pending</span>
              </div>
              <span className="font-mali font-bold text-gray-800">{pendingPurchases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-mali text-gray-700">Failed</span>
              </div>
              <span className="font-mali font-bold text-gray-800">{failedPurchases}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-mali font-bold text-gray-800 mb-4">Module Performance</h3>
          <div className="space-y-3">
            {analytics?.popularModules.slice(0, 3).map((module, index) => (
              <div key={module.moduleId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-xs font-mali font-bold">
                    {index + 1}
                  </div>
                  <span className="font-mali text-gray-700 text-sm">{module.title}</span>
                </div>
                <span className="font-mali font-bold text-gray-800">{module.purchases}</span>
              </div>
            )) || (
              <p className="font-mali text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-mali font-bold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-mali text-gray-700">Server Status</span>
              </div>
              <span className="font-mali font-bold text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-mali text-gray-700">Database</span>
              </div>
              <span className="font-mali font-bold text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-mali text-gray-700">Storage</span>
              </div>
              <span className="font-mali font-bold text-yellow-600">75% Used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Add New User"
          description="Create a new user account with custom permissions"
          icon={Users}
          color="bg-gradient-to-br from-brand-blue to-brand-pink"
          onClick={() => onNavigateToTab('users')}
        />
        <QuickActionCard
          title="Create Module"
          description="Add a new learning module for Kiki or Tano"
          icon={Package}
          color="bg-gradient-to-br from-brand-green to-teal-500"
          onClick={() => onNavigateToTab('modules')}
        />
        <QuickActionCard
          title="View Analytics"
          description="Check detailed performance metrics and insights"
          icon={Target}
          color="bg-gradient-to-br from-brand-yellow to-brand-red"
          onClick={() => onNavigateToTab('analytics')}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Recent Purchases</h3>
          <div className="space-y-4">
            {recentPurchases.length > 0 ? recentPurchases.map((purchase) => {
              const user = users.find(u => u.id === purchase.userId);
              return (
                <ActivityItem
                  key={purchase.id}
                  icon={ShoppingCart}
                  title={`Purchase by ${user?.name || 'Unknown User'}`}
                  description={`$${purchase.amount} - ${purchase.status}`}
                  time={new Date(purchase.createdAt).toLocaleDateString()}
                  color={purchase.status === 'completed' ? 'bg-green-500' : 
                         purchase.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}
                />
              );
            }) : (
              <p className="font-mali text-gray-500 text-center py-4">No recent purchases</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">New Users</h3>
          <div className="space-y-4">
            {recentUsers.length > 0 ? recentUsers.map((user) => (
              <ActivityItem
                key={user.id}
                icon={Users}
                title={user.name}
                description={`${user.email} - ${user.role}`}
                time={new Date(user.createdAt).toLocaleDateString()}
                color="bg-brand-blue"
              />
            )) : (
              <p className="font-mali text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};