import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle, AlertTriangle, Clock, Tag, Eye, EyeOff } from 'lucide-react';
import { Cart, PaymentInfo, User } from '../types';
import { checkoutManager, PaymentMethod, CheckoutSession } from '../utils/checkout';

interface CompactCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  user: User;
  onSuccess: (purchaseId: string) => void;
}

export const CompactCheckout: React.FC<CompactCheckoutProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  onSuccess
}) => {
  const [session, setSession] = useState<CheckoutSession | null>(null);
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
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCvv, setShowCvv] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (isOpen && cart.items.length > 0) {
      const newSession = checkoutManager.createCheckoutSession(user.id, cart);
      setSession(newSession);
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

      const paymentMethod = checkoutManager.getPaymentMethods()[0];
      const updatedSession = checkoutManager.updateSession({
        paymentMethod: paymentMethod,
        paymentInfo: paymentInfo,
        status: 'processing'
      });

      if (!updatedSession) {
        throw new Error('Failed to update checkout session');
      }

      const result = await checkoutManager.processPayment(updatedSession, paymentInfo);

      if (result.success && result.purchase) {
        onSuccess(result.purchase.id);
        onClose();
      } else {
        setErrors({ payment: result.message });
      }
    } catch (error) {
      setErrors({ payment: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full max-h-[98vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-green p-3 sm:p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-mali font-bold">Secure Checkout</h2>
              <p className="font-mali text-xs sm:text-sm opacity-90">SSL Protected</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-brand-yellow transition-colors touch-manipulation">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(98vh-120px)] sm:max-h-[calc(90vh-140px)] space-y-3 sm:space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-3 rounded-xl">
            <h3 className="font-mali font-bold text-gray-800 mb-2 text-sm sm:text-base">Order Summary</h3>
            <div className="space-y-1 text-xs sm:text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="font-mali text-gray-600 truncate flex-1 mr-2">{item.title}</span>
                  <span className="font-mali font-bold">${item.price.toFixed(2)}</span>
                </div>
              ))}
              {discountApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="font-mali">Discount</span>
                  <span className="font-mali font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-mali text-gray-600">Tax</span>
                <span className="font-mali font-bold">${session.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 flex justify-between">
                <span className="font-mali font-bold">Total</span>
                <span className="font-mali font-bold text-brand-green">
                  ${session.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-blue-50 p-3 rounded-xl">
            <h4 className="font-mali font-bold text-gray-800 mb-2 text-xs sm:text-sm flex items-center gap-1">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              Discount Code
            </h4>
            {!discountApplied ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-3 sm:px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-mali font-bold text-xs sm:text-sm min-h-[40px] touch-manipulation"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-100 p-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="font-mali font-bold text-green-800 text-xs sm:text-sm">
                    Code applied
                  </span>
                </div>
                <button
                  onClick={() => {
                    setDiscountApplied(false);
                    setDiscountAmount(0);
                    setDiscountCode('');
                  }}
                  className="text-red-600 hover:text-red-800 font-mali text-xs underline touch-manipulation"
                >
                  Remove
                </button>
              </div>
            )}
            {errors.discountCode && (
              <p className="text-red-600 font-mali text-xs mt-1">{errors.discountCode}</p>
            )}
          </div>

          {/* Payment Form */}
          <div className="space-y-3">
            <h3 className="font-mali font-bold text-gray-800 text-xs sm:text-sm">Payment Information</h3>
            
            <div>
              <input
                type="text"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-600 font-mali text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-600 font-mali text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showCvv ? "text" : "password"}
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCvv(!showCvv)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 touch-manipulation"
                >
                  {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                {errors.cvv && (
                  <p className="text-red-600 font-mali text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={paymentInfo.cardholderName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-600 font-mali text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="City"
                value={paymentInfo.billingAddress.city}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, city: e.target.value }
                })}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={paymentInfo.billingAddress.zipCode}
                onChange={(e) => setPaymentInfo({
                  ...paymentInfo,
                  billingAddress: { ...paymentInfo.billingAddress, zipCode: e.target.value }
                })}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali text-xs sm:text-sm min-h-[40px] touch-manipulation ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="flex items-start gap-2 touch-manipulation">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded touch-manipulation"
              />
              <span className="font-mali text-gray-700 text-xs">
                I agree to the <a href="#" className="text-brand-blue underline">Terms</a> and{' '}
                <a href="#" className="text-brand-blue underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-600 font-mali text-xs mt-1">{errors.terms}</p>
            )}
          </div>

          {errors.payment && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <p className="font-mali text-red-800 text-xs sm:text-sm">{errors.payment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="border-t bg-gray-50 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 text-gray-600">
              <Lock className="w-3 h-3" />
              <span className="font-mali text-xs">SSL Secure</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Shield className="w-3 h-3" />
              <span className="font-mali text-xs">256-bit Encryption</span>
            </div>
          </div>

          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full py-3 bg-brand-green text-white rounded-xl hover:bg-brand-green/90 transition-colors font-mali font-bold disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
          >
            {isProcessing ? (
              <>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                Complete Payment ${session.totalAmount.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};