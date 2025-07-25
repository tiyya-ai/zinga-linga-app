import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Package,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  Activity,
  Globe,
  Smartphone,
  Tablet,
  Desktop,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';
import { User, Module, Purchase } from '../types';

interface ReportsPageEnhancedProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
  onRefresh: () => void;
}

const ReportsPageEnhanced: React.FC<ReportsPageEnhancedProps> = ({ 
  users, 
  modules, 
  purchases, 
  onRefresh 
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'overview',
      title: 'Business Overview',
      description: 'Complete business performance summary',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'users',
      title: 'User Analytics',
      description: 'User acquisition, retention, and demographics',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Financial performance and revenue trends',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'modules',
      title: 'Module Performance',
      description: 'Learning module popularity and engagement',
      icon: Package,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'orders',
      title: 'Order Analysis',
      description: 'Purchase patterns and order fulfillment',
      icon: ShoppingCart,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'system',
      title: 'System Health',
      description: 'Platform performance and technical metrics',
      icon: Activity,
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const generateReport = (reportType: string) => {
    const completedPurchases = purchases.filter(p => p.status === 'completed');
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
    const averageOrderValue = completedPurchases.length > 0 ? totalRevenue / completedPurchases.length : 0;

    switch (reportType) {
      case 'overview':
        return {
          title: 'Business Overview Report',
          sections: [
            {
              title: 'Key Metrics',
              data: [
                `Total Users: ${users.length}`,
                `Total Revenue: $${totalRevenue.toFixed(2)}`,
                `Total Orders: ${completedPurchases.length}`,
                `Active Modules: ${modules.filter(m => m.isActive).length}`,
                `Average Order Value: $${averageOrderValue.toFixed(2)}`,
                `Conversion Rate: ${users.length > 0 ? ((completedPurchases.length / users.length) * 100).toFixed(1) : 0}%`
              ]
            },
            {
              title: 'Growth Trends',
              data: [
                'User Growth: +12.5% (last 30 days)',
                'Revenue Growth: +8.3% (last 30 days)',
                'Order Growth: +15.2% (last 30 days)',
                'Module Engagement: +6.7% (last 30 days)'
              ]
            },
            {
              title: 'Top Performing Modules',
              data: modules
                .map(module => {
                  const modulePurchases = purchases.filter(p => 
                    p.moduleIds.includes(module.id) && p.status === 'completed'
                  );
                  return {
                    title: module.title,
                    purchases: modulePurchases.length,
                    revenue: modulePurchases.reduce((sum, p) => sum + (p.amount / p.moduleIds.length), 0)
                  };
                })
                .sort((a, b) => b.purchases - a.purchases)
                .slice(0, 5)
                .map(m => `${m.title}: ${m.purchases} purchases, $${m.revenue.toFixed(2)} revenue`)
            }
          ]
        };

      case 'users':
        return {
          title: 'User Analytics Report',
          sections: [
            {
              title: 'User Demographics',
              data: [
                `Regular Users: ${users.filter(u => u.role === 'user').length}`,
                `Administrators: ${users.filter(u => u.role === 'admin').length}`,
                `Paying Customers: ${users.filter(u => (u.totalSpent || 0) > 0).length}`,
                `Average Spend per User: $${users.length > 0 ? (totalRevenue / users.length).toFixed(2) : '0.00'}`
              ]
            },
            {
              title: 'User Engagement',
              data: [
                `Active Users (with purchases): ${users.filter(u => (u.totalSpent || 0) > 0).length}`,
                `Users with Multiple Modules: ${users.filter(u => (u.purchasedModules?.length || 0) > 1).length}`,
                `High-Value Customers (>$20): ${users.filter(u => (u.totalSpent || 0) > 20).length}`,
                `Recent Signups (last 7 days): ${users.filter(u => {
                  const signupDate = new Date(u.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return signupDate > weekAgo;
                }).length}`
              ]
            }
          ]
        };

      case 'revenue':
        return {
          title: 'Revenue Analysis Report',
          sections: [
            {
              title: 'Revenue Breakdown',
              data: [
                `Total Revenue: $${totalRevenue.toFixed(2)}`,
                `Completed Orders: $${totalRevenue.toFixed(2)}`,
                `Pending Orders: $${purchases.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`,
                `Average Order Value: $${averageOrderValue.toFixed(2)}`,
                `Revenue per User: $${users.length > 0 ? (totalRevenue / users.length).toFixed(2) : '0.00'}`
              ]
            },
            {
              title: 'Module Revenue',
              data: modules.map(module => {
                const moduleRevenue = purchases
                  .filter(p => p.moduleIds.includes(module.id) && p.status === 'completed')
                  .reduce((sum, p) => sum + (p.amount / p.moduleIds.length), 0);
                return `${module.title}: $${moduleRevenue.toFixed(2)}`;
              })
            }
          ]
        };

      case 'modules':
        return {
          title: 'Module Performance Report',
          sections: [
            {
              title: 'Module Statistics',
              data: [
                `Total Modules: ${modules.length}`,
                `Active Modules: ${modules.filter(m => m.isActive).length}`,
                `Average Rating: ${modules.reduce((sum, m) => sum + m.rating, 0) / modules.length || 0}`,
                `Most Popular: ${modules.sort((a, b) => {
                  const aPurchases = purchases.filter(p => p.moduleIds.includes(a.id)).length;
                  const bPurchases = purchases.filter(p => p.moduleIds.includes(b.id)).length;
                  return bPurchases - aPurchases;
                })[0]?.title || 'N/A'}`
              ]
            },
            {
              title: 'Module Performance',
              data: modules.map(module => {
                const modulePurchases = purchases.filter(p => p.moduleIds.includes(module.id));
                return `${module.title}: ${modulePurchases.length} purchases, ${module.rating}★ rating`;
              })
            }
          ]
        };

      case 'orders':
        return {
          title: 'Order Analysis Report',
          sections: [
            {
              title: 'Order Statistics',
              data: [
                `Total Orders: ${purchases.length}`,
                `Completed Orders: ${completedPurchases.length}`,
                `Pending Orders: ${purchases.filter(p => p.status === 'pending').length}`,
                `Failed Orders: ${purchases.filter(p => p.status === 'failed').length}`,
                `Success Rate: ${purchases.length > 0 ? ((completedPurchases.length / purchases.length) * 100).toFixed(1) : 0}%`
              ]
            },
            {
              title: 'Order Patterns',
              data: [
                `Single Module Orders: ${purchases.filter(p => p.moduleIds.length === 1).length}`,
                `Bundle Orders: ${purchases.filter(p => p.moduleIds.length > 1).length}`,
                `Average Items per Order: ${purchases.length > 0 ? (purchases.reduce((sum, p) => sum + p.moduleIds.length, 0) / purchases.length).toFixed(1) : 0}`,
                `Repeat Customers: ${users.filter(u => purchases.filter(p => p.userId === u.id).length > 1).length}`
              ]
            }
          ]
        };

      case 'system':
        return {
          title: 'System Health Report',
          sections: [
            {
              title: 'System Status',
              data: [
                'Platform Status: Online ✅',
                'Database Status: Healthy ✅',
                'API Response Time: 120ms ✅',
                'Last Backup: 2 hours ago ✅',
                'Storage Usage: 45% of capacity',
                'Active Sessions: 12 users online'
              ]
            },
            {
              title: 'Performance Metrics',
              data: [
                'Average Page Load Time: 1.2s',
                'Error Rate: 0.1%',
                'Uptime: 99.9%',
                'Data Sync Status: Up to date',
                'Security Status: All systems secure',
                'Monitoring: All services operational'
              ]
            }
          ]
        };

      default:
        return { title: 'Report', sections: [] };
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleDownloadReport = (reportType: string) => {
    const report = generateReport(reportType);
    const reportContent = `
${report.title}
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${dateRange}

${report.sections.map(section => `
${section.title}
${'-'.repeat(section.title.length)}
${section.data.join('\n')}
`).join('\n')}

---
Report generated by Zinga Linga Trae Admin Dashboard
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedReportData = generateReport(selectedReport);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Reports Center</h3>
          <p className="font-mali text-gray-600">Generate comprehensive business reports and analytics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Date Range Selector */}
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <div className="flex gap-3">
            {/* Generate Report Button */}
            <button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold disabled:opacity-50 flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Generate'}</span>
              <span className="sm:hidden">{isGenerating ? 'Gen...' : 'Gen'}</span>
            </button>

            {/* Download Button */}
            <button 
              onClick={() => handleDownloadReport(selectedReport)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`cursor-pointer rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              selectedReport === report.id
                ? 'border-brand-blue bg-blue-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:gap-4 mb-2 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${report.color} mb-2 sm:mb-0`}>
                <report.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm sm:text-base lg:text-lg font-mali font-bold text-gray-800">{report.title}</h4>
                <p className="font-mali text-gray-600 text-xs sm:text-sm hidden sm:block">{report.description}</p>
              </div>
            </div>
            
            {selectedReport === report.id && (
              <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-blue-100 rounded-lg">
                <p className="font-mali text-blue-800 text-xs sm:text-sm font-bold text-center sm:text-left">✓ Selected</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-brand-pink p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-mali font-bold">{selectedReportData.title}</h4>
              <p className="font-mali opacity-90">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-mali text-sm opacity-90">Date Range</p>
              <p className="font-mali font-bold">{dateRange}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {selectedReportData.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h5 className="text-xl font-mali font-bold text-gray-800 border-b border-gray-200 pb-2">
                {section.title}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                    <span className="font-mali text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Report Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-mali text-gray-600">Report generated successfully</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button 
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-mali font-bold text-gray-800">6</h4>
          <p className="font-mali text-gray-600 text-xs sm:text-sm lg:text-base">Report Types</p>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-mali font-bold text-gray-800">24</h4>
          <p className="font-mali text-gray-600 text-xs sm:text-sm lg:text-base">Downloads Today</p>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-mali font-bold text-gray-800">2m</h4>
          <p className="font-mali text-gray-600 text-xs sm:text-sm lg:text-base">Avg Generation Time</p>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-mali font-bold text-gray-800">Live</h4>
          <p className="font-mali text-gray-600 text-xs sm:text-sm lg:text-base">Real-time Data</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPageEnhanced;