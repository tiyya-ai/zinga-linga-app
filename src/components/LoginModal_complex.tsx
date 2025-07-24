import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, TreePine, Leaf, Sun, Shield, User as UserIcon, Crown, Sparkles, ArrowRight, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, UserPlus } from 'lucide-react';
import { User } from '../types';
import { authManager } from '../utils/auth';
import { realDatabase } from '../utils/realDatabase';
import { RealUserRegistration } from './RealUserRegistration';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [showQuickLogin, setShowQuickLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showRealRegistration, setShowRealRegistration] = useState(false);

  // Initialize demo accounts
  useEffect(() => {
    if (isOpen) {
      authManager.createDemoAccounts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength < 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak', width: '20%' };
    if (strength < 4) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium', width: '60%' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // For demo, we'll just create a basic user
        const mockUser: User = {
          id: Date.now().toString(),
          email: email,
          name: name,
          role: 'user',
          purchasedModules: [],
          createdAt: new Date().toISOString(),
          totalSpent: 0
        };
        
        onLogin(mockUser);
        onClose();
      } else {
        const result = await authManager.login(email, password);
        
        if (result.success && result.user) {
          onLogin(result.user);
          onClose();
          setEmail('');
          setPassword('');
          setError('');
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userType: 'admin' | 'user') => {
    setIsLoading(true);
    setError('');

    const credentials = userType === 'admin' 
      ? { email: 'admin@zingalinga.com', password: 'Admin123!' }
      : { email: 'parent@demo.com', password: 'Parent123!' };

    try {
      const result = await authManager.login(credentials.email, credentials.password);
      
      if (result.success && result.user) {
        onLogin(result.user);
        onClose();
        setEmail('');
        setPassword('');
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-brand-green via-brand-blue to-brand-pink rounded-3xl p-8 max-w-lg w-full relative overflow-hidden shadow-2xl">
          {/* Jungle background elements */}
          <div className="absolute inset-0 opacity-20">
            <TreePine className="absolute top-4 left-4 w-8 h-8 text-green-800" />
            <Leaf className="absolute top-8 right-8 w-6 h-6 text-green-700" />
            <Sun className="absolute bottom-4 left-8 w-10 h-10 text-brand-yellow" />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-brand-yellow transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-mali font-bold text-white mb-2 text-center">
              {showQuickLogin ? 'Welcome to Zinga Linga!' : (isSignUp ? 'Join the Adventure' : 'Secure Login')}
            </h2>
            <p className="font-mali text-green-100 text-center mb-6">
              {showQuickLogin ? 'Choose your login type' : (isSignUp ? 'Create your explorer account!' : 'Enter with your credentials')}
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-300" />
                <span className="text-red-100 font-mali text-sm">{error}</span>
              </div>
            )}

            {showQuickLogin ? (
              <div className="space-y-4">
                {/* Quick Login Options */}
                <div className="space-y-4">
                  {/* Admin Login */}
                  <button
                    onClick={() => handleQuickLogin('admin')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-mali font-bold py-4 px-6 rounded-2xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        {isLoading ? <Clock className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <div className="text-lg">Admin Login</div>
                        <div className="text-sm opacity-90">Password: Admin123!</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Real User Registration */}
                  <button
                    onClick={() => setShowRealRegistration(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-mali font-bold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg">Create Real Account</div>
                        <div className="text-sm opacity-90">Join with your actual information</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Parent/User Login */}
                  <button
                    onClick={() => handleQuickLogin('user')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-4 px-6 rounded-2xl hover:from-brand-yellow hover:to-brand-red transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        {isLoading ? <Clock className="w-6 h-6 animate-spin" /> : <UserIcon className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <div className="text-lg">Parent Login</div>
                        <div className="text-sm opacity-90">Password: Parent123!</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Security Features Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-6">
                  <h3 className="text-white font-mali font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Real User Features
                  </h3>
                  <div className="space-y-2 text-sm text-green-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>Real user registration with actual data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>Persistent user accounts and purchases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>Real payment processing simulation</span>
                    </div>
                  </div>
                </div>

                {/* Demo Accounts Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <h3 className="text-white font-mali font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Demo Accounts
                  </h3>
                  <div className="space-y-2 text-sm text-green-100">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-red-400" />
                      <span><strong>Admin:</strong> Full dashboard access, user management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3 h-3 text-yellow-400" />
                      <span><strong>Parent:</strong> Learning content, progress tracking</span>
                    </div>
                  </div>
                </div>

                {/* Custom Login Option */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowQuickLogin(false)}
                    className="text-brand-yellow underline cursor-pointer hover:text-yellow-200 font-mali text-sm"
                  >
                    Or use custom login
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Parent/Guardian Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 transition-all font-mali"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-green w-5 h-5" />
                    <input 
                      type="email" 
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 transition-all font-mali"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-green w-5 h-5" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setShowPasswordRequirements(true)}
                      className="w-full pl-12 pr-12 py-3 rounded-2xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 transition-all font-mali"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && showPasswordRequirements && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mali text-sm">Password Strength</span>
                        <span className={`text-sm font-mali ${
                          passwordStrength.level === 'strong' ? 'text-green-300' :
                          passwordStrength.level === 'medium' ? 'text-yellow-300' : 'text-red-300'
                        }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        ></div>
                      </div>
                      <div className="space-y-1 text-xs text-green-100">
                        <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-300' : 'text-red-300'}`}>
                          {password.length >= 8 ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-300' : 'text-red-300'}`}>
                          {/[A-Z]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-300' : 'text-red-300'}`}>
                          {/[a-z]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>One lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-300' : 'text-red-300'}`}>
                          {/[0-9]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>One number</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-300' : 'text-red-300'}`}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>One special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-brand-yellow to-brand-red text-white font-mali font-bold py-3 px-6 rounded-2xl hover:from-brand-yellow hover:to-brand-red transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      isSignUp ? 'Start Exploring' : 'Secure Login'
                    )}
                  </button>
                </form>
                
                <div className="text-center mt-4 space-y-2">
                  {!isSignUp && (
                    <p className="text-green-100 text-sm font-mali">
                      Demo passwords: Admin123! or Parent123!
                    </p>
                  )}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-brand-yellow underline cursor-pointer hover:text-yellow-200 font-mali block mx-auto"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'New explorer? Join us!'}
                  </button>
                  <button
                    onClick={() => setShowQuickLogin(true)}
                    className="text-white/80 underline cursor-pointer hover:text-white font-mali text-sm block mx-auto"
                  >
                    Back to quick login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real User Registration Modal */}
      {showRealRegistration && (
        <RealUserRegistration
          onUserRegistered={(user) => {
            setShowRealRegistration(false);
            onLogin(user);
            onClose();
          }}
          onClose={() => setShowRealRegistration(false)}
        />
      )}
    </>
  );
};