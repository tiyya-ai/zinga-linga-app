import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle, AlertTriangle, Clock, Tag, Eye, EyeOff, Gift, Percent, DollarSign, Mail, Phone, MapPin, Star, Zap } from 'lucide-react';
import { Cart, PaymentInfo, User } from '../types';
import { checkoutManager, PaymentMethod, CheckoutSession } from '../utils/checkout';
import { notificationService } from '../utils/notificationService';

interface EnhancedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  user: User;
  onSuccess: (purchaseId: string) => void;
}

export const EnhancedCheckout: React.FC<EnhancedCheckoutProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  onSuccess
}) => {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
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
      country: 'United States'
    }
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCvv, setShowCvv] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isOpen && cart.items.length > 0) {
      const newSession = checkoutManager.createCheckoutSession(user.id, cart);
      setSession(newSession);
      const paymentMethods = checkoutManager.getPaymentMethods();
      setSelectedPaymentMethod(paymentMethods[0]);
    }
  }, [isOpen, cart, user.id]);

  if (!isOpen || !session) return null;

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: '' });
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;

    const result = checkoutManager.applyDiscountCode(discountCode, cart.total);
    if (result.success) {
      setDiscountApplied(true);
      setDiscountAmount(result.discount);
      
      const updatedSession = checkoutManager.updateSession({
        discountCode: discountCode,
        discountAmount: result.discount,
        totalAmount: cart.total + session.taxAmount - result.discount
      });
      if (updatedSession) {
        setSession(updatedSession);
      }
      
      // Show success message
      alert(`🎉 Coupon Applied!\n\nYou saved $${result.discount.toFixed(2)} with code "${discountCode}"`);
    } else {
      setErrors({ ...errors, discountCode: result.message });
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrors({});

    try {
      const validation = checkoutManager.validatePaymentInfo(paymentInfo);
      if (!validation.valid) {
        setErrors(validation.errors);
        setIsProcessing(false);
        return;
      }

      if (!agreedToTerms) {
        setErrors({ terms: 'Please agree to the terms and conditions' });
        setIsProcessing(false);
        return;
      }

      if (!selectedPaymentMethod) {
        setErrors({ payment: 'Please select a payment method' });
        setIsProcessing(false);
        return;
      }

      const updatedSession = checkoutManager.updateSession({
        paymentMethod: selectedPaymentMethod,
        paymentInfo: paymentInfo,
        status: 'processing'
      });

      if (!updatedSession) {
        throw new Error('Failed to update checkout session');
      }

      const result = await checkoutManager.processPayment(updatedSession, paymentInfo);

      if (result.success && result.purchase) {
        // Send email notifications
        await sendEmailNotifications(result.purchase);
        
        onSuccess(result.purchase.id);
        onClose();
        
        // Show success message
        alert(`🎉 Payment Successful!\n\nOrder ID: ${result.purchase.id.slice(-8).toUpperCase()}\nAmount: $${result.purchase.amount.toFixed(2)}\n\nCheck your email for confirmation details.`);
      } else {
        setErrors({ payment: result.message });
      }
    } catch (error) {
      setErrors({ payment: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendEmailNotifications = async (purchase: any) => {
    try {
      // Send admin notification
      const adminEmail = 'admin@zingalinga.com'; // You can change this
      
      // Create notification in system
      notificationService.createNotification(
        'purchase',
        '🛒 New Purchase!',
        `${user.name} purchased modules for $${purchase.amount.toFixed(2)}`,
        'high',
        user.id,
        purchase.id,
        { 
          purchase, 
          user, 
          discountUsed: discountApplied ? discountCode : null,
          discountAmount: discountApplied ? discountAmount : 0
        }
      );

      console.log('📧 Email notifications sent to:', {
        admin: adminEmail,
        customer: user.email,
        sms: smsNotifications ? phoneNumber : 'disabled'
      });
      
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const availableCoupons = [
    { code: 'WELCOME10', description: '10% off your first purchase', type: 'percentage', value: 10 },
    { code: 'SAVE5', description: '$5 off orders over $15', type: 'fixed', value: 5 },
    { code: 'FAMILY20', description: '20% off family bundles', type: 'percentage', value: 20 }
  ];

  const paymentMethods = checkoutManager.getPaymentMethods();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-green p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-2xl font-mali font-bold">Secure Checkout</h2>
              <p className="font-mali opacity-90 text-sm sm:text-base">Complete your purchase safely and securely</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-brand-yellow transition-colors touch-manipulation">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {/* Progress Steps - Hidden on mobile */}
          <div className="hidden sm:flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mali font-bold ${
                  currentStep >= step ? 'bg-white text-brand-blue' : 'bg-white/30 text-white'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-white' : 'bg-white/30'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:flex justify-center mt-2 space-x-8">
            <span className="font-mali text-sm opacity-90">Order Review</span>
            <span className="font-mali text-sm opacity-90">Payment</span>
            <span className="font-mali text-sm opacity-90">Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(98vh-140px)] sm:max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            
            {/* Left Column - Order Summary & Coupons */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-mali font-bold text-gray-800 text-sm sm:text-base truncate">{item.title}</p>
                        <p className="font-mali text-gray-600 text-xs sm:text-sm truncate">{item.description}</p>
                      </div>
                      <span className="font-mali font-bold text-brand-green text-sm sm:text-base ml-2">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="font-mali text-gray-600">Subtotal</span>
                      <span className="font-mali font-bold">${cart.total.toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-600 text-sm sm:text-base">
                        <span className="font-mali">Discount ({discountCode})</span>
                        <span className="font-mali font-bold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="font-mali text-gray-600">Tax</span>
                      <span className="font-mali font-bold">${session.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-mali font-bold text-base sm:text-lg">Total</span>
                      <span className="font-mali font-bold text-base sm:text-lg text-brand-green">
                        ${session.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  Discount Codes
                </h4>
                
                {!discountApplied ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation"
                      />
                      <button
                        onClick={handleApplyDiscount}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {/* Available Coupons */}
                    <div className="space-y-2">
                      <p className="font-mali text-gray-700 text-xs sm:text-sm font-bold">Available Coupons:</p>
                      {availableCoupons.map((coupon) => (
                        <div key={coupon.code} className="bg-white rounded-lg p-3 border border-yellow-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <span className="font-mali font-bold text-brand-blue text-sm sm:text-base">{coupon.code}</span>
                              <p className="font-mali text-gray-600 text-xs truncate">{coupon.description}</p>
                            </div>
                            <button
                              onClick={() => setDiscountCode(coupon.code)}
                              className="text-brand-blue hover:text-brand-blue/80 font-mali text-xs sm:text-sm underline ml-2 touch-manipulation"
                            >
                              Use Code
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-100 rounded-lg p-3 sm:p-4 border border-green-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-mali font-bold text-green-800 text-sm sm:text-base block truncate">
                            Coupon Applied: {discountCode}
                          </span>
                          <p className="font-mali text-green-700 text-xs sm:text-sm">
                            You saved ${discountAmount.toFixed(2)}!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDiscountApplied(false);
                          setDiscountAmount(0);
                          setDiscountCode('');
                          const updatedSession = checkoutManager.updateSession({
                            discountCode: undefined,
                            discountAmount: 0,
                            totalAmount: cart.total + session.taxAmount
                          });
                          if (updatedSession) setSession(updatedSession);
                        }}
                        className="text-red-600 hover:text-red-800 font-mali text-xs sm:text-sm underline ml-2 touch-manipulation"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                {errors.discountCode && (
                  <p className="text-red-600 font-mali text-xs sm:text-sm mt-2">{errors.discountCode}</p>
                )}
              </div>

              {/* Notification Preferences - Hidden on mobile to save space */}
              <div className="hidden sm:block bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                <h4 className="text-base sm:text-lg font-mali font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Notification Preferences
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-start gap-3 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                    />
                    <div>
                      <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">Email Notifications</span>
                      <p className="font-mali text-gray-600 text-xs sm:text-sm">Receive order confirmations and updates</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded mt-0.5 touch-manipulation"
                    />
                    <div>
                      <span className="font-mali font-bold text-gray-800 text-sm sm:text-base">SMS Notifications</span>
                      <p className="font-mali text-gray-600 text-xs sm:text-sm">Get text updates about your order</p>
                    </div>
                  </label>
                  
                  {smsNotifications && (
                    <div className="ml-7">
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Payment Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-mali font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  Payment Method
                </h3>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-brand-blue bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">{method.icon}</span>
                        <span className="font-mali font-bold text-xs sm:text-sm">{method.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Credit Card Form */}
                {selectedPaymentMethod?.type === 'credit_card' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2 text-sm sm:text-base">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2 text-sm sm:text-base">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength={5}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-mali font-bold text-gray-700 mb-2 text-sm sm:text-base">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? "text" : "password"}
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            maxLength={4}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                              errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 touch-manipulation"
                          >
                            {showCvv ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                          </button>
                        </div>
                        {errors.cvv && (
                          <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-mali font-bold text-gray-700 mb-2 text-sm sm:text-base">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardholderName && (
                        <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.cardholderName}</p>
                      )}
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-mali font-bold text-gray-800 text-sm sm:text-base">Billing Address</h4>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={paymentInfo.billingAddress.street}
                          onChange={(e) => setPaymentInfo({
                            ...paymentInfo,
                            billingAddress: { ...paymentInfo.billingAddress, street: e.target.value }
                          })}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                            errors.street ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.street && (
                          <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.street}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={paymentInfo.billingAddress.city}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: { ...paymentInfo.billingAddress, city: e.target.value }
                            })}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                              errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.city && (
                            <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={paymentInfo.billingAddress.zipCode}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: { ...paymentInfo.billingAddress, zipCode: e.target.value }
                            })}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-sm sm:text-base min-h-[44px] touch-manipulation ${
                              errors.zipCode ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.zipCode && (
                            <p className="text-red-600 font-mali text-xs sm:text-sm mt-1">{errors.zipCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Payment Methods */}
                {selectedPaymentMethod?.type !== 'credit_card' && (
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                    <p className="font-mali text-blue-800 text-sm sm:text-base">
                      You will be redirected to {selectedPaymentMethod?.name} to complete your payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Terms and Security */}
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <label className="flex items-start gap-3 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded touch-manipulation"
                    />
                    <span className="font-mali text-gray-700 text-xs sm:text-sm">
                      I agree to the{' '}
                      <a href="#" className="text-brand-blue underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-brand-blue underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-600 font-mali text-xs sm:text-sm mt-2">{errors.terms}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-6 text-gray-600">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mali text-xs sm:text-sm">SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mali text-xs sm:text-sm">256-bit Encryption</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mali text-xs sm:text-sm">PCI Compliant</span>
                  </div>
                </div>
              </div>

              {errors.payment && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <p className="font-mali text-red-800 text-sm sm:text-base">{errors.payment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="text-gray-600 text-center sm:text-left">
              <p className="font-mali text-xs sm:text-sm">
                🔒 Your payment information is encrypted and secure
              </p>
            </div>
            
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-brand-green text-white rounded-xl hover:bg-brand-green/90 transition-colors font-mali font-bold disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg min-h-[48px] touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Complete Payment ${session.totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};