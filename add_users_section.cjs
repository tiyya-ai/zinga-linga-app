const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ImprovedAdminDashboard.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Find the location to insert the users section
const insertPoint = content.indexOf('          {/* Other tabs remain the same... */}');

if (insertPoint === -1) {
  console.log('Could not find insertion point');
  process.exit(1);
}

// Users section code
const usersSection = `          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-3xl font-mali font-bold text-gray-800">User Management</h3>
                  <p className="font-mali text-gray-600">Manage user accounts and permissions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.length}</h3>
                  <p className="font-mali opacity-90">Total Users</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <CheckCircle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.filter(u => u.role === 'user').length}</h3>
                  <p className="font-mali opacity-90">Regular Users</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Shield className="w-6 h-6" />
                    </div>
                    <Star className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">{users.filter(u => u.role === 'admin').length}</h3>
                  <p className="font-mali opacity-90">Administrators</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-mali font-bold mb-1">
                    \${users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(0)}
                  </h3>
                  <p className="font-mali opacity-90">Total Spent</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
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
                      {users.map((user) => (
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
                            <span className={\`px-3 py-1 rounded-full text-sm font-mali font-bold \${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }\`}>
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
                                \${(user.totalSpent || 0).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-mali text-gray-800 font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
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
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {user.role !== 'admin' && (
                                <button 
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
              </div>

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
                                \${(selectedUser.totalSpent || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-mali text-gray-600">Modules Owned:</span>
                              <span className="font-mali font-bold">{selectedUser.purchasedModules?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setShowUserModal(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

`;

// Insert the users section
const newContent = content.slice(0, insertPoint) + usersSection + content.slice(insertPoint);

// Write the updated content back to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Users section added successfully!');