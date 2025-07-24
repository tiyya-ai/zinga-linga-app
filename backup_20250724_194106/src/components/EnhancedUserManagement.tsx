import React, { useState, useMemo } from 'react';
import { User, Module } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  DollarSign,
  CheckSquare,
  Square,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';

interface EnhancedUserManagementProps {
  users: User[];
  modules: Module[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  users,
  modules,
  searchTerm,
  onSearchChange,
  onCreateUser,
  onEditUser,
  onViewUser,
  onDeleteUser,
  onToggleUserStatus
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'created' | 'spent'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'spent':
          aValue = a.totalSpent || 0;
          bValue = b.totalSpent || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, filterRole, sortBy, sortOrder]);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      selectedUsers.forEach(userId => onDeleteUser(userId));
      setSelectedUsers([]);
    }
  };

  const handleBatchToggleRole = () => {
    if (window.confirm(`Are you sure you want to toggle roles for ${selectedUsers.length} users?`)) {
      selectedUsers.forEach(userId => onToggleUserStatus(userId));
      setSelectedUsers([]);
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Total Spent', 'Purchased Modules', 'Created At'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.totalSpent || 0,
        user.purchasedModules.length,
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-mali font-bold text-gray-800">User Management</h2>
          <p className="font-mali text-gray-600">{filteredUsers.length} users found</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onCreateUser}
            className="bg-brand-green text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-green/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
          <button
            onClick={exportUsers}
            className="bg-brand-blue text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="spent">Sort by Spent</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-mali font-bold text-brand-blue">
              {selectedUsers.length} users selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBatchToggleRole}
                className="bg-brand-yellow text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-brand-yellow/90 transition-colors text-sm"
              >
                Toggle Roles
              </button>
              <button
                onClick={handleBatchDelete}
                className="bg-red-500 text-white font-mali font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? 
                      <CheckSquare className="w-5 h-5 text-brand-blue" /> : 
                      <Square className="w-5 h-5 text-gray-400" />
                    }
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">User</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">Modules</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">Spent</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">Created</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectUser(user.id)}
                      className="flex items-center"
                    >
                      {selectedUsers.includes(user.id) ? 
                        <CheckSquare className="w-5 h-5 text-brand-blue" /> : 
                        <Square className="w-5 h-5 text-gray-400" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center">
                        <span className="text-white font-mali font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
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
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mali text-gray-800">
                      {user.purchasedModules.length} modules
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mali font-bold text-gray-800">
                      ${(user.totalSpent || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mali text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewUser(user)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Toggle Role"
                      >
                        {user.role === 'admin' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-mali text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};