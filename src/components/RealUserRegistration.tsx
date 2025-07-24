import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { realDatabase } from '../utils/realDatabase';

interface RealUserRegistrationProps {
  onUserRegistered: (user: any) => void;
  onClose: () => void;
}

export const RealUserRegistration: React.FC<RealUserRegistrationProps> = ({ 
  onUserRegistered, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Child age validation
    if (formData.childAge && (isNaN(Number(formData.childAge)) || Number(formData.childAge) < 1 || Number(formData.childAge) > 12)) {
      newErrors.childAge = 'Please enter a valid age between 1-12';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Check if email already exists
      const existingUser = await realDatabase.getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: 'An account with this email already exists' });
        setIsLoading(false);
        return;
      }

      // Register the real user
      const newUser = await realDatabase.registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password // In production, this would be hashed
      });

      // Update user profile with child information
      if (formData.childName || formData.childAge) {
        newUser.profile = {
          ...newUser.profile,
          childName: formData.childName.trim(),
          childAge: formData.childAge ? Number(formData.childAge) : null,
          parentName: formData.name.trim()
        };
        await realDatabase.updateUser(newUser);
      }

      setSuccess(true);
      
      // Show success message briefly, then call onUserRegistered
      setTimeout(() => {
        onUserRegistered(newUser);
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-mali font-bold text-gray-800 mb-2">Welcome to Zinga Linga!</h3>
          <p className="font-mali text-gray-600 mb-4">
            Your account has been created successfully. You can now access all our learning modules!
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-mali font-bold text-gray-800">Create Your Account</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="font-mali text-gray-600 mt-2">Join thousands of parents giving their children the best start!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-mali text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Parent Information */}
          <div className="space-y-4">
            <h4 className="font-mali font-bold text-gray-800">Parent Information</h4>
            
            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="font-mali text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="font-mali text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="font-mali text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="font-mali text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Child Information */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h4 className="font-mali font-bold text-gray-800">Child Information (Optional)</h4>
            
            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Child's Name
              </label>
              <input
                type="text"
                value={formData.childName}
                onChange={(e) => handleInputChange('childName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali"
                placeholder="Your child's name"
              />
            </div>

            <div>
              <label className="block font-mali font-bold text-gray-700 mb-2">
                Child's Age
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-mali ${
                  errors.childAge ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Age (1-12 years)"
              />
              {errors.childAge && <p className="font-mali text-red-600 text-sm mt-1">{errors.childAge}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <span className="font-mali text-gray-700 text-sm">
                I agree to the <a href="#" className="text-brand-blue hover:underline">Terms of Service</a> and <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a>. I understand that this creates a real account with my actual information.
              </span>
            </label>
            {errors.terms && <p className="font-mali text-red-600 text-sm mt-1">{errors.terms}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-pink text-white font-mali font-bold py-4 px-6 rounded-lg hover:from-brand-blue hover:to-brand-pink transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create My Real Account
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="font-mali text-gray-600 text-sm">
              Already have an account? 
              <button 
                type="button"
                onClick={onClose}
                className="text-brand-blue hover:underline ml-1"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};