import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Gift, Percent, DollarSign, Calendar, Users, Eye, EyeOff, Copy, CheckCircle, AlertTriangle, Tag, TrendingUp, BarChart3 } from 'lucide-react';
import { checkoutManager, DiscountCode } from '../utils/checkout';

export const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<DiscountCode[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCode | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<DiscountCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    minAmount: 0,
    maxDiscount: undefined,
    expiresAt: '',
    usageLimit: undefined,
    active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const allCoupons = checkoutManager.getDiscountCodes();
    setCoupons(allCoupons);
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) {
      alert('Please fill in all required fields');
      return;
    }

    const result = checkoutManager.createDiscountCode({
      code: newCoupon.code!.toUpperCase(),
      type: newCoupon.type!,
      value: newCoupon.value!,
      minAmount: newCoupon.minAmount,
      maxDiscount: newCoupon.maxDiscount,
      expiresAt: newCoupon.expiresAt,
      usageLimit: newCoupon.usageLimit,
      active: newCoupon.active!
    });

    if (result.success) {
      loadCoupons();
      setShowCreateModal(false);
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        minAmount: 0,
        maxDiscount: undefined,
        expiresAt: '',
        usageLimit: undefined,
        active: true
      });
      alert('✅ Coupon created successfully!');
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;

    const result = checkoutManager.updateDiscountCode(editingCoupon.code, editingCoupon);
    
    if (result.success) {
      loadCoupons();
      setEditingCoupon(null);
      alert('✅ Coupon updated successfully!');
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleDeleteCoupon = (code: string) => {
    if (confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      const result = checkoutManager.deleteDiscountCode(code);
      
      if (result.success) {
        loadCoupons();
        alert('✅ Coupon deleted successfully!');
      } else {
        alert('❌ ' + result.message);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`📋 Copied "${text}" to clipboard!`);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getUsagePercentage = (coupon: DiscountCode) => {
    if (!coupon.usageLimit) return 0;
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const isExpired = (coupon: DiscountCode) => {
    return coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
  };

  const totalSavings = coupons.reduce((sum, coupon) => {
    // Estimate savings based on usage
    const avgOrderValue = 15; // Estimated average order value
    const estimatedSavings = coupon.type === 'percentage' 
      ? (avgOrderValue * coupon.value / 100) * coupon.usedCount
      : coupon.value * coupon.usedCount;
    return sum + estimatedSavings;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-mali font-bold text-gray-800">Coupon Management</h2>
          <p className="font-mali text-gray-600">Create and manage discount codes for your customers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green/90 transition-colors font-mali font-bold"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Tag className="w-6 h-6" />
            </div>
            <BarChart3 className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{coupons.length}</h3>
          <p className="font-mali opacity-90">Total Coupons</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{coupons.filter(c => c.active).length}</h3>
          <p className="font-mali opacity-90">Active Coupons</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <BarChart3 className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</h3>
          <p className="font-mali opacity-90">Total Uses</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl font-mali font-bold mb-1">${totalSavings.toFixed(0)}</h3>
          <p className="font-mali opacity-90">Customer Savings</p>
        </div>
      </div>

      {/* Coupons Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Code</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Type</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Value</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Usage</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Expires</th>
                <th className="px-6 py-4 text-left font-mali font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-blue/10 rounded-lg">
                        <Gift className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <p className="font-mali font-bold text-gray-800">{coupon.code}</p>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="font-mali text-gray-500 text-xs hover:text-brand-blue flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {coupon.type === 'percentage' ? (
                        <Percent className="w-4 h-4 text-green-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-mali font-bold text-gray-800 capitalize">
                        {coupon.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mali font-bold text-lg text-gray-800">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}`}
                    </span>
                    {coupon.minAmount && (
                      <p className="font-mali text-gray-500 text-xs">
                        Min: ${coupon.minAmount}
                      </p>
                    )}
                    {coupon.maxDiscount && (
                      <p className="font-mali text-gray-500 text-xs">
                        Max: ${coupon.maxDiscount}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mali font-bold text-gray-800">
                          {coupon.usedCount}
                        </span>
                        {coupon.usageLimit && (
                          <span className="font-mali text-gray-500">
                            / {coupon.usageLimit}
                          </span>
                        )}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-blue h-2 rounded-full"
                            style={{ width: `${Math.min(getUsagePercentage(coupon), 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-mali font-bold ${
                      !coupon.active ? 'bg-gray-100 text-gray-800' :
                      isExpired(coupon) ? 'bg-red-100 text-red-800' :
                      coupon.usageLimit && coupon.usedCount >= coupon.usageLimit ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {!coupon.active ? 'Inactive' :
                       isExpired(coupon) ? 'Expired' :
                       coupon.usageLimit && coupon.usedCount >= coupon.usageLimit ? 'Used Up' :
                       'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.expiresAt ? (
                      <div>
                        <p className="font-mali text-gray-800 font-medium">
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </p>
                        <p className="font-mali text-gray-500 text-xs">
                          {isExpired(coupon) ? 'Expired' : 
                           Math.ceil((new Date(coupon.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' days left'}
                        </p>
                      </div>
                    ) : (
                      <span className="font-mali text-gray-500">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingCoupon(coupon)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.code)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Coupon"
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
      </div>

      {/* Coupons Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                {/* Code and Type */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-blue/10 rounded-lg">
                    <Gift className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mali font-bold text-gray-800 text-lg">{coupon.code}</p>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="font-mali text-gray-500 text-xs hover:text-brand-blue flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {coupon.type === 'percentage' ? (
                        <Percent className="w-4 h-4 text-green-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-mali font-medium text-gray-600 capitalize text-sm">
                        {coupon.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Value and Constraints */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-mali text-gray-500 text-xs uppercase tracking-wide">Value</p>
                    <p className="font-mali font-bold text-lg text-gray-800">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}`}
                    </p>
                    {coupon.minAmount && (
                      <p className="font-mali text-gray-500 text-xs">
                        Min: ${coupon.minAmount}
                      </p>
                    )}
                    {coupon.maxDiscount && (
                      <p className="font-mali text-gray-500 text-xs">
                        Max: ${coupon.maxDiscount}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="font-mali text-gray-500 text-xs uppercase tracking-wide">Usage</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mali font-bold text-gray-800">
                        {coupon.usedCount}
                      </span>
                      {coupon.usageLimit && (
                        <span className="font-mali text-gray-500">
                          / {coupon.usageLimit}
                        </span>
                      )}
                    </div>
                    {coupon.usageLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-brand-blue h-2 rounded-full"
                          style={{ width: `${Math.min(getUsagePercentage(coupon), 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Expiry */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <p className="font-mali text-gray-500 text-xs uppercase tracking-wide mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-mali font-bold ${
                      !coupon.active ? 'bg-gray-100 text-gray-800' :
                      isExpired(coupon) ? 'bg-red-100 text-red-800' :
                      coupon.usageLimit && coupon.usedCount >= coupon.usageLimit ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {!coupon.active ? 'Inactive' :
                       isExpired(coupon) ? 'Expired' :
                       coupon.usageLimit && coupon.usedCount >= coupon.usageLimit ? 'Used Up' :
                       'Active'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="font-mali text-gray-500 text-xs uppercase tracking-wide mb-1">Expires</p>
                    {coupon.expiresAt ? (
                      <div>
                        <p className="font-mali text-gray-800 font-medium text-sm">
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </p>
                        <p className="font-mali text-gray-500 text-xs">
                          {isExpired(coupon) ? 'Expired' : 
                           Math.ceil((new Date(coupon.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' days left'}
                        </p>
                      </div>
                    ) : (
                      <span className="font-mali text-gray-500 text-sm">Never</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={() => setEditingCoupon(coupon)}
                  className="flex-1 sm:flex-none px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-mali font-medium text-sm flex items-center justify-center gap-2"
                  title="Edit Coupon"
                >
                  <Edit className="w-4 h-4" />
                  <span className="sm:hidden">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.code)}
                  className="flex-1 sm:flex-none px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-mali font-medium text-sm flex items-center justify-center gap-2"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Create New Coupon</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Coupon Code *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      placeholder="WELCOME10"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                    <button
                      onClick={() => setNewCoupon({...newCoupon, code: generateRandomCode()})}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mali text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Discount Type *</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">
                    {newCoupon.type === 'percentage' ? 'Percentage' : 'Amount'} *
                  </label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value) || 0})}
                    placeholder={newCoupon.type === 'percentage' ? '10' : '5.00'}
                    min="0"
                    step={newCoupon.type === 'percentage' ? '1' : '0.01'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Minimum Order Amount</label>
                  <input
                    type="number"
                    value={newCoupon.minAmount}
                    onChange={(e) => setNewCoupon({...newCoupon, minAmount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>

                {newCoupon.type === 'percentage' && (
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">Maximum Discount</label>
                    <input
                      type="number"
                      value={newCoupon.maxDiscount || ''}
                      onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: parseFloat(e.target.value) || undefined})}
                      placeholder="10.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit || ''}
                    onChange={(e) => setNewCoupon({...newCoupon, usageLimit: parseInt(e.target.value) || undefined})}
                    placeholder="100"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={newCoupon.expiresAt ? newCoupon.expiresAt.split('T')[0] : ''}
                    onChange={(e) => setNewCoupon({...newCoupon, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newCoupon.active}
                  onChange={(e) => setNewCoupon({...newCoupon, active: e.target.checked})}
                  className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label className="font-mali font-bold text-gray-700">Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCoupon}
                  className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors font-mali font-bold"
                >
                  Create Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800">Edit Coupon: {editingCoupon.code}</h3>
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={editingCoupon.code}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={editingCoupon.type}
                    onChange={(e) => setEditingCoupon({...editingCoupon, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">
                    {editingCoupon.type === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={editingCoupon.value}
                    onChange={(e) => setEditingCoupon({...editingCoupon, value: parseFloat(e.target.value) || 0})}
                    min="0"
                    step={editingCoupon.type === 'percentage' ? '1' : '0.01'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={editingCoupon.usageLimit || ''}
                    onChange={(e) => setEditingCoupon({...editingCoupon, usageLimit: parseInt(e.target.value) || undefined})}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Used Count</label>
                  <input
                    type="number"
                    value={editingCoupon.usedCount}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-mali"
                  />
                </div>

                <div>
                  <label className="block font-mali font-bold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCoupon.expiresAt ? editingCoupon.expiresAt.split('T')[0] : ''}
                    onChange={(e) => setEditingCoupon({...editingCoupon, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingCoupon.active}
                  onChange={(e) => setEditingCoupon({...editingCoupon, active: e.target.checked})}
                  className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label className="font-mali font-bold text-gray-700">Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-mali font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCoupon}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold"
                >
                  Update Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};