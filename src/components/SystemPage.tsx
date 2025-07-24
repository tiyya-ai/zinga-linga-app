import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Activity,
  Globe,
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Users,
  Eye,
  Settings,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Info,
  AlertCircle,
  Bell,
  Mail,
  Phone
} from 'lucide-react';
import { User, Module, Purchase } from '../types';

interface SystemPageProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
  onRefresh: () => void;
}

export const SystemPage: React.FC<SystemPageProps> = ({ 
  users, 
  modules, 
  purchases, 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'security' | 'logs' | 'backup'>('overview');
  const [systemStats, setSystemStats] = useState({
    uptime: '99.9%',
    responseTime: 120,
    activeUsers: 12,
    dataUsage: 45,
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 34,
    networkLatency: 15
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50) + 100,
        activeUsers: Math.floor(Math.random() * 20) + 5,
        cpuUsage: Math.floor(Math.random() * 30) + 15,
        memoryUsage: Math.floor(Math.random() * 20) + 60,
        networkLatency: Math.floor(Math.random() * 10) + 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const systemServices = [
    { name: 'Web Server', status: 'online', uptime: '99.9%', lastCheck: '2 min ago' },
    { name: 'Database', status: 'online', uptime: '99.8%', lastCheck: '1 min ago' },
    { name: 'API Gateway', status: 'online', uptime: '99.9%', lastCheck: '30 sec ago' },
    { name: 'File Storage', status: 'online', uptime: '99.7%', lastCheck: '1 min ago' },
    { name: 'Email Service', status: 'online', uptime: '99.5%', lastCheck: '3 min ago' },
    { name: 'Payment Gateway', status: 'online', uptime: '99.9%', lastCheck: '45 sec ago' }
  ];

  const securityEvents = [
    { type: 'login', message: 'Admin login from 192.168.1.100', time: '2 min ago', severity: 'info' },
    { type: 'security', message: 'SSL certificate renewed', time: '1 hour ago', severity: 'success' },
    { type: 'access', message: 'New user registration', time: '15 min ago', severity: 'info' },
    { type: 'system', message: 'Backup completed successfully', time: '2 hours ago', severity: 'success' },
    { type: 'warning', message: 'High memory usage detected', time: '30 min ago', severity: 'warning' }
  ];

  const performanceMetrics = [
    { name: 'Page Load Time', value: '1.2s', target: '<2s', status: 'good' },
    { name: 'API Response Time', value: `${systemStats.responseTime}ms`, target: '<200ms', status: 'good' },
    { name: 'Error Rate', value: '0.1%', target: '<1%', status: 'excellent' },
    { name: 'Throughput', value: '450 req/min', target: '>300 req/min', status: 'good' },
    { name: 'Availability', value: '99.9%', target: '>99%', status: 'excellent' },
    { name: 'Data Transfer', value: '2.3 GB/day', target: '<5 GB/day', status: 'good' }
  ];

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      warning: 'bg-yellow-500',
      maintenance: 'bg-blue-500'
    };
    
    return (
      <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-500'} animate-pulse`} />
    );
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }) => (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <div className={`p-2 sm:p-3 rounded-full ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
            {trend === 'stable' && <Activity className="w-3 h-3 sm:w-4 sm:h-4" />}
          </div>
        )}
      </div>
      <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold text-gray-800 mb-1">{value}</h3>
      <p className="font-mali text-gray-600 text-xs sm:text-sm lg:text-base">{title}</p>
    </div>
  );

  const ProgressBar = ({ value, max = 100, color = 'bg-blue-500' }: { value: number; max?: number; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-3xl font-mali font-bold text-gray-800">System Monitoring</h3>
          <p className="font-mali text-gray-600">Real-time system health and performance monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="font-mali text-green-600 font-bold text-sm">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
        {[
          { id: 'overview', label: 'Overview', icon: Monitor },
          { id: 'performance', label: 'Performance', icon: BarChart3 },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'logs', label: 'System Logs', icon: Eye },
          { id: 'backup', label: 'Backup & Storage', icon: HardDrive }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-mali font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-brand-blue to-brand-pink text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* System Metrics - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <MetricCard
              title="System Uptime"
              value={systemStats.uptime}
              icon={Clock}
              color="bg-gradient-to-br from-green-500 to-green-600"
              trend="stable"
            />
            
            <MetricCard
              title="Response Time"
              value={`${systemStats.responseTime}ms`}
              icon={Zap}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              trend="stable"
            />
            
            <MetricCard
              title="Active Users"
              value={systemStats.activeUsers}
              icon={Users}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              trend="up"
            />
            
            <MetricCard
              title="Data Usage"
              value={`${systemStats.dataUsage}%`}
              icon={Database}
              color="bg-gradient-to-br from-orange-500 to-red-500"
              trend="stable"
            />
          </div>

          {/* System Services Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-blue to-brand-pink p-6 text-white">
              <h4 className="text-xl font-mali font-bold">System Services</h4>
              <p className="font-mali opacity-90">Real-time status of all system components</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <StatusIndicator status={service.status} />
                      <div>
                        <p className="font-mali font-bold text-gray-800">{service.name}</p>
                        <p className="font-mali text-gray-600 text-sm">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mali text-gray-600 text-sm">{service.lastCheck}</p>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-mali font-bold">
                        Online
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-6">Resource Usage</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">CPU Usage</span>
                    <span className="font-mali font-bold text-gray-800">{systemStats.cpuUsage}%</span>
                  </div>
                  <ProgressBar value={systemStats.cpuUsage} color="bg-blue-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Memory Usage</span>
                    <span className="font-mali font-bold text-gray-800">{systemStats.memoryUsage}%</span>
                  </div>
                  <ProgressBar value={systemStats.memoryUsage} color="bg-purple-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Disk Usage</span>
                    <span className="font-mali font-bold text-gray-800">{systemStats.diskUsage}%</span>
                  </div>
                  <ProgressBar value={systemStats.diskUsage} color="bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Network Latency</span>
                    <span className="font-mali font-bold text-gray-800">{systemStats.networkLatency}ms</span>
                  </div>
                  <ProgressBar value={systemStats.networkLatency} max={100} color="bg-orange-500" />
                </div>
              </div>
            </div>

            {/* User Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-6">User Analytics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-mali font-bold text-gray-800">Total Users</p>
                      <p className="font-mali text-gray-600 text-sm">Registered accounts</p>
                    </div>
                  </div>
                  <span className="text-2xl font-mali font-bold text-blue-600">{users.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-mali font-bold text-gray-800">Active Sessions</p>
                      <p className="font-mali text-gray-600 text-sm">Currently online</p>
                    </div>
                  </div>
                  <span className="text-2xl font-mali font-bold text-green-600">{systemStats.activeUsers}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-mali font-bold text-gray-800">Conversion Rate</p>
                      <p className="font-mali text-gray-600 text-sm">Purchase conversion</p>
                    </div>
                  </div>
                  <span className="text-2xl font-mali font-bold text-purple-600">
                    {users.length > 0 ? ((purchases.filter(p => p.status === 'completed').length / users.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-green to-green-600 p-6 text-white">
              <h4 className="text-xl font-mali font-bold">Performance Metrics</h4>
              <p className="font-mali opacity-90">System performance indicators and benchmarks</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-mali font-bold text-gray-800">{metric.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-mali font-bold ${
                        metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                    <p className="text-2xl font-mali font-bold text-gray-800 mb-1">{metric.value}</p>
                    <p className="font-mali text-gray-600 text-sm">Target: {metric.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Security Status</h4>
              <p className="font-mali text-green-600 font-bold">All Systems Secure</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">SSL Certificate</h4>
              <p className="font-mali text-blue-600 font-bold">Valid & Active</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-2">Monitoring</h4>
              <p className="font-mali text-purple-600 font-bold">24/7 Active</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-red to-red-600 p-6 text-white">
              <h4 className="text-xl font-mali font-bold">Security Events</h4>
              <p className="font-mali opacity-90">Recent security and access events</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {securityEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.severity === 'success' ? 'bg-green-100' :
                      event.severity === 'warning' ? 'bg-yellow-100' :
                      event.severity === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {event.severity === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {event.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                      {event.severity === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {event.severity === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-mali font-bold text-gray-800">{event.message}</p>
                      <p className="font-mali text-gray-600 text-sm">{event.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mali font-bold ${
                      event.severity === 'success' ? 'bg-green-100 text-green-800' :
                      event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      event.severity === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-purple to-purple-600 p-6 text-white">
            <h4 className="text-xl font-mali font-bold">System Logs</h4>
            <p className="font-mali opacity-90">Real-time system activity and error logs</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
              <div>[{new Date().toISOString()}] INFO: System startup completed successfully</div>
              <div>[{new Date().toISOString()}] INFO: Database connection established</div>
              <div>[{new Date().toISOString()}] INFO: API server listening on port 3000</div>
              <div>[{new Date().toISOString()}] INFO: User authentication service started</div>
              <div>[{new Date().toISOString()}] INFO: Payment gateway connection verified</div>
              <div>[{new Date().toISOString()}] INFO: Email service initialized</div>
              <div>[{new Date().toISOString()}] INFO: File storage service ready</div>
              <div>[{new Date().toISOString()}] INFO: Backup service scheduled</div>
              <div>[{new Date().toISOString()}] INFO: Security monitoring active</div>
              <div>[{new Date().toISOString()}] INFO: All systems operational</div>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Storage Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-6">Backup Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div>
                    <p className="font-mali font-bold text-gray-800">Last Backup</p>
                    <p className="font-mali text-gray-600 text-sm">2 hours ago</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="font-mali font-bold text-gray-800">Next Backup</p>
                    <p className="font-mali text-gray-600 text-sm">In 22 hours</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="font-mali font-bold text-gray-800">Backup Size</p>
                    <p className="font-mali text-gray-600 text-sm">2.3 GB</p>
                  </div>
                  <HardDrive className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-xl font-mali font-bold text-gray-800 mb-6">Storage Usage</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Database</span>
                    <span className="font-mali font-bold text-gray-800">1.2 GB</span>
                  </div>
                  <ProgressBar value={24} color="bg-blue-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Media Files</span>
                    <span className="font-mali font-bold text-gray-800">800 MB</span>
                  </div>
                  <ProgressBar value={16} color="bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Backups</span>
                    <span className="font-mali font-bold text-gray-800">2.3 GB</span>
                  </div>
                  <ProgressBar value={46} color="bg-purple-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mali text-gray-600">Logs</span>
                    <span className="font-mali font-bold text-gray-800">150 MB</span>
                  </div>
                  <ProgressBar value={3} color="bg-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};