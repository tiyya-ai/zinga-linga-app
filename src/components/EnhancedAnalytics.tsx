import React from 'react';
import { Analytics } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Calendar,
  Target,
  Award
} from 'lucide-react';

interface EnhancedAnalyticsProps {
  analytics: Analytics | null;
}

export const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-mali">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-mali font-bold flex items-center gap-1 ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-mali font-bold text-gray-800 mb-2">{value}</h3>
      <p className="font-mali text-gray-600">{title}</p>
    </div>
  );

  const SimpleBarChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.revenue || d.users || d.purchases || 0));
          const percentage = maxValue > 0 ? ((item.revenue || item.users || item.purchases || 0) / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 text-sm font-mali font-bold text-gray-600">
                {item.month || item.title}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-blue to-brand-green h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-sm font-mali font-bold text-gray-800 text-right">
                {item.revenue ? `$${item.revenue}` : (item.users || item.purchases || 0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          change="+12%"
          icon={Users}
          color="bg-brand-blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+8%"
          icon={DollarSign}
          color="bg-brand-green"
        />
        <MetricCard
          title="Total Purchases"
          value={analytics.totalPurchases.toLocaleString()}
          change="+15%"
          icon={ShoppingCart}
          color="bg-brand-pink"
        />
        <MetricCard
          title="Active Modules"
          value={analytics.activeModules}
          icon={Target}
          color="bg-brand-yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimpleBarChart 
          data={analytics.revenueByMonth} 
          title="Revenue by Month" 
        />
        <SimpleBarChart 
          data={analytics.userGrowth} 
          title="User Growth" 
        />
      </div>

      {/* Popular Modules */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-mali font-bold text-gray-800 mb-6">Popular Modules</h3>
        <div className="space-y-4">
          {analytics.popularModules.map((module, index) => (
            <div key={module.moduleId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center w-8 h-8 bg-brand-blue text-white rounded-full font-mali font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-mali font-bold text-gray-800">{module.title}</h4>
                <p className="font-mali text-gray-600 text-sm">{module.purchases} purchases</p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-yellow" />
                <span className="font-mali font-bold text-gray-800">{module.purchases}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-blue to-brand-pink rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-xl font-mali font-bold">Growth Rate</h3>
          </div>
          <p className="text-3xl font-mali font-bold mb-2">+24%</p>
          <p className="font-mali text-blue-100">Monthly user growth</p>
        </div>

        <div className="bg-gradient-to-br from-brand-green to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8" />
            <h3 className="text-xl font-mali font-bold">Avg. Revenue</h3>
          </div>
          <p className="text-3xl font-mali font-bold mb-2">
            ${analytics.totalUsers > 0 ? (analytics.totalRevenue / analytics.totalUsers).toFixed(2) : '0.00'}
          </p>
          <p className="font-mali text-green-100">Per user</p>
        </div>

        <div className="bg-gradient-to-br from-brand-yellow to-brand-red rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <h3 className="text-xl font-mali font-bold">Conversion</h3>
          </div>
          <p className="text-3xl font-mali font-bold mb-2">
            {analytics.totalUsers > 0 ? ((analytics.totalPurchases / analytics.totalUsers) * 100).toFixed(1) : '0.0'}%
          </p>
          <p className="font-mali text-yellow-100">Purchase rate</p>
        </div>
      </div>
    </div>
  );
};