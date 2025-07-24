import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  Mail,
  Printer,
  Share2,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Globe,
  Smartphone,
  Monitor,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

interface ReportsPageProps {
  users: any[];
  purchases: any[];
  modules: any[];
  onRefresh: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  users,
  purchases,
  modules,
  onRefresh
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('revenue');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  // Report templates
  const reportTemplates = [
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Comprehensive revenue analysis with trends and breakdowns',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      category: 'Financial'
    },
    {
      id: 'users',
      title: 'User Analytics Report',
      description: 'User acquisition, retention, and demographic analysis',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      category: 'Users'
    },
    {
      id: 'content',
      title: 'Content Performance Report',
      description: 'Module popularity, engagement, and ROI analysis',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      category: 'Content'
    },
    {
      id: 'operations',
      title: 'Operations Report',
      description: 'Platform performance, system metrics, and operational insights',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      category: 'Operations'
    },
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level business overview for stakeholders and investors',
      icon: Award,
      color: 'from-red-500 to-red-600',
      category: 'Executive'
    },
    {
      id: 'financial',
      title: 'Financial Statement',
      description: 'Detailed financial data for accounting and tax purposes',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600',
      category: 'Financial'
    }
  ];

  // Calculate report data
  const calculateReportData = () => {
    const now = new Date();
    const timeRanges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };

    let startDate: Date;
    let endDate = now;

    if (dateRange === 'custom') {
      startDate = customStartDate ? new Date(customStartDate) : new Date(now.getTime() - timeRanges['30d']);
      endDate = customEndDate ? new Date(customEndDate) : now;
    } else {
      startDate = new Date(now.getTime() - timeRanges[dateRange]);
    }

    const filteredUsers = users.filter(u => {
      const userDate = new Date(u.createdAt);
      return userDate >= startDate && userDate <= endDate;
    });

    const filteredPurchases = purchases.filter(p => {
      const purchaseDate = new Date(p.createdAt);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });

    const completedPurchases = filteredPurchases.filter(p => p.status === 'completed');
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);

    return {
      startDate,
      endDate,
      filteredUsers,
      filteredPurchases,
      completedPurchases,
      totalRevenue,
      newUsers: filteredUsers.length,
      totalOrders: completedPurchases.length,
      averageOrderValue: completedPurchases.length > 0 ? totalRevenue / completedPurchases.length : 0,
      conversionRate: users.length > 0 ? (completedPurchases.length / users.length) * 100 : 0
    };
  };

  const reportData = calculateReportData();

  // Generate report content based on type
  const generateReportContent = (reportType: string) => {
    const data = calculateReportData();
    
    switch (reportType) {
      case 'revenue':
        return {
          title: 'Revenue Analysis Report',
          sections: [
            {
              title: 'Revenue Summary',
              content: [
                `Total Revenue: $${data.totalRevenue.toFixed(2)}`,
                `Number of Transactions: ${data.totalOrders}`,
                `Average Order Value: $${data.averageOrderValue.toFixed(2)}`,
                `Period: ${data.startDate.toLocaleDateString()} - ${data.endDate.toLocaleDateString()}`
              ]
            },
            {
              title: 'Revenue by Module',
              content: modules.map(module => {
                const moduleRevenue = data.completedPurchases
                  .filter(p => p.moduleIds.includes(module.id))
                  .reduce((sum, p) => sum + (p.amount / p.moduleIds.length), 0);
                return `${module.title}: $${moduleRevenue.toFixed(2)}`;
              })
            },
            {
              title: 'Payment Methods',
              content: [
                'Credit Card: 85%',
                'PayPal: 10%',
                'Other: 5%'
              ]
            }
          ]
        };

      case 'users':
        return {
          title: 'User Analytics Report',
          sections: [
            {
              title: 'User Growth',
              content: [
                `New Users: ${data.newUsers}`,
                `Total Users: ${users.length}`,
                `Growth Rate: ${data.newUsers > 0 ? '+' : ''}${((data.newUsers / users.length) * 100).toFixed(1)}%`,
                `Active Users: ${users.filter(u => u.lastLogin).length}`
              ]
            },
            {
              title: 'User Demographics',
              content: [
                `Regular Users: ${users.filter(u => u.role === 'user').length}`,
                `Administrators: ${users.filter(u => u.role === 'admin').length}`,
                `Paying Customers: ${users.filter(u => (u.totalSpent || 0) > 0).length}`,
                `Average Spending: $${(users.reduce((sum, u) => sum + (u.totalSpent || 0), 0) / users.length).toFixed(2)}`
              ]
            }
          ]
        };

      case 'content':
        return {
          title: 'Content Performance Report',
          sections: [
            {
              title: 'Module Performance',
              content: modules.map(module => {
                const purchases = data.completedPurchases.filter(p => p.moduleIds.includes(module.id)).length;
                return `${module.title}: ${purchases} purchases (Rating: ${module.rating}/5)`;
              })
            },
            {
              title: 'Content Metrics',
              content: [
                `Total Modules: ${modules.length}`,
                `Active Modules: ${modules.filter(m => m.isActive).length}`,
                `Average Rating: ${(modules.reduce((sum, m) => sum + m.rating, 0) / modules.length).toFixed(1)}/5`,
                `Total Reviews: ${modules.reduce((sum, m) => sum + m.totalRatings, 0)}`
              ]
            }
          ]
        };

      case 'executive':
        return {
          title: 'Executive Summary Report',
          sections: [
            {
              title: 'Key Performance Indicators',
              content: [
                `Total Revenue: $${data.totalRevenue.toFixed(2)}`,
                `Total Users: ${users.length}`,
                `Conversion Rate: ${data.conversionRate.toFixed(1)}%`,
                `Average Order Value: $${data.averageOrderValue.toFixed(2)}`
              ]
            },
            {
              title: 'Business Highlights',
              content: [
                `Platform has ${users.length} registered users`,
                `Generated $${data.totalRevenue.toFixed(2)} in revenue`,
                `${modules.length} learning modules available`,
                `${data.totalOrders} successful transactions completed`
              ]
            }
          ]
        };

      default:
        return {
          title: 'Standard Report',
          sections: [
            {
              title: 'Overview',
              content: ['Report data will be displayed here']
            }
          ]
        };
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportContent = generateReportContent(selectedReport);
    const newReport = {
      id: Date.now().toString(),
      type: selectedReport,
      title: reportContent.title,
      content: reportContent,
      generatedAt: new Date().toISOString(),
      dateRange: `${reportData.startDate.toLocaleDateString()} - ${reportData.endDate.toLocaleDateString()}`,
      status: 'completed'
    };
    
    setGeneratedReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
  };

  const handleDownloadReport = (report: any, format: 'pdf' | 'excel' | 'csv') => {
    // Simulate download
    const blob = new Blob([JSON.stringify(report.content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${report.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">Reports Center</h3>
          <p className="font-mali text-gray-600">Generate comprehensive business reports and analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-xl font-mali font-bold text-gray-800 mb-6">Generate New Report</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Type Selection */}
          <div>
            <label className="block font-mali font-bold text-gray-700 mb-3">Report Type</label>
            <div className="space-y-2">
              {reportTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedReport(template.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedReport === template.id
                      ? 'border-brand-blue bg-blue-50 text-brand-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color}`}>
                      <template.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-mali font-bold text-sm">{template.title}</p>
                      <p className="font-mali text-gray-600 text-xs">{template.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block font-mali font-bold text-gray-700 mb-3">Date Range</label>
            <div className="space-y-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom range</option>
              </select>
              
              {dateRange === 'custom' && (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mali focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="End date"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Report Preview & Generate */}
          <div>
            <label className="block font-mali font-bold text-gray-700 mb-3">Report Preview</label>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                {reportTemplates.find(t => t.id === selectedReport) && (
                  <>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${reportTemplates.find(t => t.id === selectedReport)?.color}`}>
                      {React.createElement(reportTemplates.find(t => t.id === selectedReport)?.icon!, { className: "w-4 h-4 text-white" })}
                    </div>
                    <div>
                      <p className="font-mali font-bold text-gray-800">
                        {reportTemplates.find(t => t.id === selectedReport)?.title}
                      </p>
                      <p className="font-mali text-gray-600 text-sm">
                        {reportData.startDate.toLocaleDateString()} - {reportData.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-2 text-sm font-mali text-gray-600">
                <p>• Total Revenue: {formatCurrency(reportData.totalRevenue)}</p>
                <p>• New Users: {reportData.newUsers}</p>
                <p>• Total Orders: {reportData.totalOrders}</p>
                <p>• Conversion Rate: {reportData.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
            
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-pink text-white font-mali font-bold py-3 px-4 rounded-lg hover:from-brand-blue hover:to-brand-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-mali font-bold text-gray-800">Generated Reports</h4>
          <div className="flex items-center gap-2">
            <span className="font-mali text-gray-600 text-sm">{generatedReports.length} reports</span>
          </div>
        </div>

        {generatedReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h5 className="text-lg font-mali font-bold text-gray-800 mb-2">No Reports Generated</h5>
            <p className="font-mali text-gray-600 mb-4">Generate your first report to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generatedReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-mali font-bold text-gray-800">{report.title}</h5>
                      <p className="font-mali text-gray-600 text-sm">
                        Generated on {new Date(report.generatedAt).toLocaleString()} • {report.dateRange}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport(report, 'pdf')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report, 'excel')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Excel"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share Report"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Report Preview */}
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {report.content.sections.slice(0, 2).map((section: any, index: number) => (
                      <div key={index}>
                        <h6 className="font-mali font-bold text-gray-800 mb-1">{section.title}</h6>
                        <ul className="font-mali text-gray-600 space-y-1">
                          {section.content.slice(0, 3).map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h5 className="text-2xl font-mali font-bold text-gray-800 mb-1">
            {formatCurrency(reportData.totalRevenue)}
          </h5>
          <p className="font-mali text-gray-600">Period Revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h5 className="text-2xl font-mali font-bold text-gray-800 mb-1">{reportData.newUsers}</h5>
          <p className="font-mali text-gray-600">New Users</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
          </div>
          <h5 className="text-2xl font-mali font-bold text-gray-800 mb-1">{reportData.totalOrders}</h5>
          <p className="font-mali text-gray-600">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <h5 className="text-2xl font-mali font-bold text-gray-800 mb-1">
            {reportData.conversionRate.toFixed(1)}%
          </h5>
          <p className="font-mali text-gray-600">Conversion Rate</p>
        </div>
      </div>
    </div>
  );
};