import React, { useState } from 'react';
import { User, Module, Purchase } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  UserCheck,
  UserX,
  Shield,
  DollarSign,
  Package,
  Calendar,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreVertical,
  ArrowUpDown,
  Save,
  X,
  Star,
  Activity,
  Clock
} from 'lucide-react';

interface UsersPageProps {
  users: User[];
  modules: Module[];
  purchases: Purchase[];
  onUsersUpdate: (users: User[]) => void;
  onRefresh: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ 
  users, 
  modules, 
  purchases, 
  onUsersUpdate, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'spent'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    totalSpent: 0
  });

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'spent':
          comparison = (a.totalSpent || 0) - (b.totalSpent || 0);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;
  const totalSpent = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  // Handle user editing
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      totalSpent: user.totalSpent || 0
    });
    setShowEditModal(true);
  };

  // Handle user form submission
  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              name: userFormData.name,
              email: userFormData.email,
              role: userFormData.role,
              totalSpent: userFormData.totalSpent
            }
          : user
      );
      onUsersUpdate(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        totalSpent: userFormData.totalSpent,
        createdAt: new Date().toISOString(),
        purchasedModules: []
      };
      onUsersUpdate([...users, newUser]);
      setShowAddModal(false);
    }
    
    // Reset form
    setUserFormData({
      name: '',
      email: '',
      role: 'user',
      totalSpent: 0
    });
  };

  // Handle user deletion - GUARANTEED SAVE
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      onUsersUpdate(updatedUsers);
    }
  };

  // Get user's purchase count
  const getUserPurchaseCount = (userId: string) => {
    return purchases.filter(p => p.userId === userId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-mali font-bold text-gray-800">Users Management</h3>
          <p className="font-mali text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mali font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-mali font-bold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors font-mali font-bold">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{totalUsers}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{regularUsers}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Regular Users</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">{adminUsers}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Administrators</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 opacity-80" />
          </div>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-mali font-bold mb-1">${totalSpent.toFixed(0)}</h3>
          <p className="font-mali opacity-90 text-xs sm:text-sm lg:text-base">Total Spent</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Join Date</option>
              <option value="spent">Sort by Amount Spent</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="p-4 space-y-4">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                    <span className="text-white font-mali font-bold text-lg">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-mali font-bold text-gray-800">{user.name}</p>
                    <p className="font-mali text-gray-600 text-sm">{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mali font-bold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mali text-gray-600">Modules</p>
                    <p className="font-mali font-bold">{user.purchasedModules?.length || 0}</p>
                  </div>
                  <div>
                    <p className="font-mali text-gray-600">Total Spent</p>
                    <p className="font-mali font-bold text-green-600">${(user.totalSpent || 0).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="font-mali text-gray-600 text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">User</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Role</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Modules</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Total Spent</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Join Date</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-pink rounded-full flex items-center justify-center">
                        <span className="text-white font-mali font-bold text-lg">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-mali font-bold text-gray-800">{user.name}</p>
                        <p className="font-mali text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="font-mali font-bold text-gray-800">
                        {user.purchasedModules?.length || 0}
                      </span>
                      <span className="font-mali text-gray-600 text-sm">modules</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-mali font-bold text-gray-800 text-lg">
                        ${(user.totalSpent || 0).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-mali text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mali text-gray-600 text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-mali"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg font-mali ${
                      currentPage === page
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-mali"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
                  User Details: {selectedUser.name}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">User Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Name:</span>
                      <span className="font-mali font-bold">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Email:</span>
                      <span className="font-mali font-bold">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Role:</span>
                      <span className="font-mali font-bold">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Join Date:</span>
                      <span className="font-mali font-bold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-mali font-bold text-gray-800">Purchase Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Total Spent:</span>
                      <span className="font-mali font-bold text-lg text-green-600">
                        ${(selectedUser.totalSpent || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Modules Owned:</span>
                      <span className="font-mali font-bold">{selectedUser.purchasedModules?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mali text-gray-600">Total Orders:</span>
                      <span className="font-mali font-bold">{getUserPurchaseCount(selectedUser.id)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add User Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-mali font-bold text-gray-800">
                  {editingUser ? `Edit User: ${editingUser.name}` : 'Add New User'}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUserFormSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    User Role
                  </label>
                  <select
                    id="role"
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'user' | 'admin' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="totalSpent" className="block text-sm font-mali font-bold text-gray-700 mb-2">
                    Total Spent ($)
                  </label>
                  <input
                    type="number"
                    id="totalSpent"
                    step="0.01"
                    min="0"
                    value={userFormData.totalSpent}
                    onChange={(e) => setUserFormData({ ...userFormData, totalSpent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-brand-green to-brand-blue text-white rounded-lg hover:shadow-lg transition-all duration-300 font-mali font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};