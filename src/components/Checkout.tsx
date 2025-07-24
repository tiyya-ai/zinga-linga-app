import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, ArrowLeft, Shield, Star, Sparkles, Gift } from 'lucide-react';
import { Cart as CartType, PaymentInfo, Purchase, User } from '../types';
import { dataStore } from '../utils/dataStore';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartType;
  onPaymentComplete: () => void;
  onBackToCart: () => void;
  user?: User; // Add user prop to track who is making the purchase
}

export const Checkout: React.FC<CheckoutProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onPaymentComplete,
  onBackToCart,
  user 
}) => {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Create purchase record and save to dataStore
      savePurchaseToAdmin();
      setStep('success');
      setTimeout(() => {
        onPaymentComplete();
        onClose();
        setStep('payment');
      }, 3000);
    }, 2000);
  };

  const savePurchaseToAdmin = () => {
    try {
      // Load current data
      const currentData = dataStore.loadData();
      
      // Extract module IDs from cart items
      const moduleIds: string[] = [];
      let bundleId: string | undefined;
      
      cart.items.forEach(item => {
        if (item.type === 'module') {
          moduleIds.push(item.id);
        } else if (item.type === 'bundle' && item.moduleIds) {
          bundleId = item.id;
          moduleIds.push(...item.moduleIds);
        }
      });

      // Create new purchase record
      const newPurchase: Purchase = {
        id: dataStore.generateId(),
        userId: user?.id || 'guest-user',
        moduleIds: moduleIds,
        bundleId: bundleId,
        amount: cart.total,
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      // Add purchase to the data
      const updatedData = {
        ...currentData,
        purchases: [...currentData.purchases, newPurchase]
      };

      // Update user's purchased modules and total spent if user exists
      if (user) {
        const userIndex = updatedData.users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          updatedData.users[userIndex] = {
            ...updatedData.users[userIndex],
            purchasedModules: [...new Set([...updatedData.users[userIndex].purchasedModules, ...moduleIds])],
            totalSpent: (updatedData.users[userIndex].totalSpent || 0) + cart.total
          };
        }
      }

      // Save updated data
      dataStore.saveData(updatedData);
      
      console.log('Purchase saved to admin dashboard:', newPurchase);
    } catch (error) {
      console.error('Error saving purchase to admin:', error);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border border-gray-100">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-brand-green mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-brand-green animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-mali font-bold text-gray-800 mb-4">Processing Payment</h2>
          <p className="font-mali text-gray-600 mb-6">Please wait while we securely process your payment...</p>
          <div className="flex items-center justify-center gap-2 text-sm font-mali text-gray-500">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="mt-4 text-xs font-mali text-gray-400">
            💡 Your purchase will appear in the admin dashboard instantly!
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Celebration Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 animate-bounce delay-100">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute top-8 right-6 animate-bounce delay-300">
              <Star className="w-5 h-5 text-pink-400" />
            </div>
            <div className="absolute bottom-8 left-8 animate-bounce delay-500">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div className="absolute bottom-4 right-4 animate-bounce delay-700">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-mali font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h2>
            <p className="font-mali text-gray-600 mb-6 text-lg">
              🎉 Welcome to your learning adventure! Your modules are now ready.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <p className="font-mali font-bold text-green-800">What's Next?</p>
              </div>
              <p className="font-mali text-green-700 text-sm mb-2">
                You'll be redirected to your dashboard where you can start exploring your new learning modules!
              </p>
              <div className="text-xs font-mali text-green-600 bg-green-100 rounded-lg p-2 mt-3">
                ✅ Purchase recorded in admin dashboard
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToCart}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-brand-green to-brand-blue rounded-full">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-mali font-bold text-gray-800">Secure Checkout</h2>
                <p className="font-mali text-gray-600">Complete your learning journey</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary - Enhanced */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 h-fit sticky top-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Gift className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="text-2xl font-mali font-bold text-gray-800">Your Order</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.type === 'bundle' 
                              ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                              : 'bg-gradient-to-r from-blue-400 to-green-400'
                          }`}></div>
                          <span className={`text-xs font-mali font-bold px-2 py-1 rounded-full ${
                            item.type === 'bundle' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type === 'bundle' ? 'Bundle Package' : 'Learning Module'}
                          </span>
                        </div>
                        <p className="font-mali font-bold text-gray-800 mb-1">{item.title}</p>
                        <p className="font-mali text-sm text-gray-600">
                          {item.type === 'bundle' ? 'Complete learning experience' : 'Interactive module'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-mali font-bold text-xl text-brand-green">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mali text-gray-600">Subtotal:</span>
                  <span className="font-mali font-bold text-gray-800">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mali text-gray-600">Processing Fee:</span>
                  <span className="font-mali font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xl font-mali font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-mali font-bold bg-gradient-to-r from-brand-green to-brand-blue bg-clip-text text-transparent">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm font-mali text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Encrypted</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs font-mali text-gray-500 bg-blue-50 rounded-lg p-2">
                    📊 Purchase will be tracked in admin dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Enhanced */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-mali font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-blue" />
                  Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-4 border-2 border-brand-blue shadow-sm">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-brand-blue mx-auto mb-2" />
                      <p className="font-mali font-bold text-sm text-gray-800">Credit Card</p>
                      <p className="font-mali text-xs text-gray-600">Visa, Mastercard</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 opacity-50">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                      <p className="font-mali font-bold text-sm text-gray-500">PayPal</p>
                      <p className="font-mali text-xs text-gray-400">Coming Soon</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 opacity-50">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                      <p className="font-mali font-bold text-sm text-gray-500">Apple Pay</p>
                      <p className="font-mali text-xs text-gray-400">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-mali font-bold text-gray-800 mb-6">Card Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        cardholderName: e.target.value
                      })}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali text-lg"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-mali font-bold text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: formatCardNumber(e.target.value)
                      })}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali text-lg tracking-wider"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: formatExpiryDate(e.target.value)
                        })}
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali text-lg"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({
                          ...paymentInfo,
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                        })}
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali text-lg"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-mali font-bold text-gray-800 mb-6">Billing Address</h4>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={paymentInfo.billingAddress.street}
                    onChange={(e) => setPaymentInfo({
                      ...paymentInfo,
                      billingAddress: {
                        ...paymentInfo.billingAddress,
                        street: e.target.value
                      }
                    })}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali"
                    placeholder="Street Address"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={paymentInfo.billingAddress.city}
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        billingAddress: {
                          ...paymentInfo.billingAddress,
                          city: e.target.value
                        }
                      })}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali"
                      placeholder="City"
                      required
                    />
                    <input
                      type="text"
                      value={paymentInfo.billingAddress.zipCode}
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        billingAddress: {
                          ...paymentInfo.billingAddress,
                          zipCode: e.target.value
                        }
                      })}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all font-mali"
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Shield className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-mali font-bold text-gray-800 mb-1">Your payment is secure</p>
                    <p className="font-mali text-gray-600 text-sm">
                      We use industry-standard 256-bit SSL encryption to protect your payment information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-mali font-bold py-6 px-8 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 text-xl"
              >
                <Lock className="w-6 h-6" />
                Complete Purchase - ${cart.total.toFixed(2)}
                <Sparkles className="w-6 h-6" />
              </button>

              {/* Additional Trust Elements */}
              <div className="text-center pt-4">
                <p className="font-mali text-gray-500 text-sm mb-2">
                  By completing this purchase, you agree to our Terms of Service
                </p>
                <div className="flex items-center justify-center gap-6 text-xs font-mali text-gray-400">
                  <span>30-day money-back guarantee</span>
                  <span>•</span>
                  <span>Instant access</span>
                  <span>•</span>
                  <span>24/7 support</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};