import React from 'react';
import { User, Module, Purchase } from '../types';
import { FileText, Download, Users, Package, DollarSign } from 'lucide-react';

interface ReportsCenterProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
}

// Add default props to prevent crashes if data is not ready
const defaultProps: ReportsCenterProps = {
  users: [],
  modules: [],
  purchases: [],
};

export const ReportsCenter: React.FC<ReportsCenterProps> = (props) => {
  const { users, modules, purchases } = { ...defaultProps, ...props };

  const handleGenerateReport = (reportType: string) => {
    alert(`Generating ${reportType} report...`);
    // In a real application, you would generate a PDF or CSV here.
  };

  const totalRevenue = (purchases || [])
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Reports Center</h3>
          <p className="font-mali text-gray-600">Simple, one-click reports for your key business data.</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Report Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">User Report</h4>
          <p className="font-mali text-gray-600 mb-4">A complete list of all registered users.</p>
          <p className="font-mali font-bold text-2xl text-blue-600 mb-4">{users.length} Users</p>
          <button
            onClick={() => handleGenerateReport('User')}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Module Report Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Module Report</h4>
          <p className="font-mali text-gray-600 mb-4">A complete list of all your products.</p>
          <p className="font-mali font-bold text-2xl text-purple-600 mb-4">{modules.length} Modules</p>
          <button
            onClick={() => handleGenerateReport('Module')}
            className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-mali font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Sales Report Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Sales Report</h4>
          <p className="font-mali text-gray-600 mb-4">A summary of all completed sales.</p>
          <p className="font-mali font-bold text-2xl text-green-600 mb-4">${totalRevenue.toFixed(2)}</p>
          <button
            onClick={() => handleGenerateReport('Sales')}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-mali font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};
