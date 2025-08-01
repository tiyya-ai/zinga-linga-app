import { User } from '../types';
import { neonDataStore } from './neonDataStore';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
  loginTime: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ipAddress?: string;
}

class AuthManager {
  private sessionKey = 'zinga-linga-session';
  private attemptsKey = 'zinga-linga-login-attempts';
  private maxLoginAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
  private adminSessionDuration = 2 * 60 * 60 * 1000; // 2 hours for admin

  // Generate secure token
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const session: AuthSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      localStorage.setItem(this.sessionKey, JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Check if user is locked out
  private isLockedOut(email: string): boolean {
    try {
      const attemptsData = localStorage.getItem(this.attemptsKey);
      if (!attemptsData) return false;

      const attempts: LoginAttempt[] = JSON.parse(attemptsData);
      const recentAttempts = attempts.filter(
        attempt => 
          attempt.email === email && 
          !attempt.success &&
          Date.now() - attempt.timestamp < this.lockoutDuration
      );

      return recentAttempts.length >= this.maxLoginAttempts;
    } catch (error) {
      console.error('Error checking lockout:', error);
      return false;
    }
  }

  // Record login attempt
  private recordLoginAttempt(email: string, success: boolean): void {
    try {
      const attemptsData = localStorage.getItem(this.attemptsKey);
      const attempts: LoginAttempt[] = attemptsData ? JSON.parse(attemptsData) : [];

      const attempt: LoginAttempt = {
        email,
        timestamp: Date.now(),
        success,
        ipAddress: 'localhost', // In real app, get actual IP
      };

      attempts.push(attempt);

      // Keep only last 100 attempts
      if (attempts.length > 100) {
        attempts.splice(0, attempts.length - 100);
      }

      localStorage.setItem(this.attemptsKey, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error recording login attempt:', error);
    }
  }

  // Validate password strength
  private validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true, message: 'Password is strong' };
  }

  // Hash password (simple implementation - in real app use bcrypt)
  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Login with enhanced security
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message: string; session?: AuthSession }> {
    try {
      // Check if user is locked out
      if (this.isLockedOut(email)) {
        return {
          success: false,
          message: `Account locked due to too many failed attempts. Try again in ${Math.ceil(this.lockoutDuration / 60000)} minutes.`
        };
      }

      // Authenticate with API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        this.recordLoginAttempt(email, false);
        return { success: false, message: result.error || 'Invalid email or password' };
      }

      const user = result.user;
      if (!user) {
        this.recordLoginAttempt(email, false);
        return { success: false, message: 'Authentication failed' };
      }

      // Create session
      const sessionDuration = user.role === 'admin' ? this.adminSessionDuration : this.sessionDuration;
      const session: AuthSession = {
        user,
        token: this.generateToken(),
        expiresAt: Date.now() + sessionDuration,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        userAgent: navigator.userAgent,
      };

      // Save session
      localStorage.setItem(this.sessionKey, JSON.stringify(session));

      // Record successful login
      this.recordLoginAttempt(email, true);

      return { success: true, user, message: 'Login successful', session };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  // Check admin privileges
  isAdmin(session: AuthSession | null): boolean {
    return session?.user?.role === 'admin';
  }

  // Check if session is still valid
  isSessionValid(session: AuthSession | null): boolean {
    if (!session) return false;
    return Date.now() < session.expiresAt;
  }

  // Get login attempts for admin view
  getLoginAttempts(): LoginAttempt[] {
    try {
      const attemptsData = localStorage.getItem(this.attemptsKey);
      return attemptsData ? JSON.parse(attemptsData) : [];
    } catch (error) {
      console.error('Error getting login attempts:', error);
      return [];
    }
  }

  // Clear login attempts (admin function)
  clearLoginAttempts(): void {
    localStorage.removeItem(this.attemptsKey);
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string, session: AuthSession): Promise<{ success: boolean; message: string }> {
    try {
      // Validate current password
      const loginResult = await this.login(session.user.email, currentPassword);
      if (!loginResult.success) {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Validate new password strength
      const validation = this.validatePassword(newPassword);
      if (!validation.valid) {
        return { success: false, message: validation.message };
      }

      // In production, update password hash in database
      // For demo, we'll just show success
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: 'An error occurred while changing password' };
    }
  }

  // Create demo accounts with secure passwords
  async createDemoAccounts(): Promise<void> {
    const data = await neonDataStore.loadData();
    
    // Check if demo accounts already exist
    const adminExists = data.users.some(u => u.email === 'admin@zingalinga.com');
    const parentExists = data.users.some(u => u.email === 'parent@demo.com');

    const newUsers = [...data.users];

    if (!adminExists) {
      newUsers.push({
        id: 'admin-demo',
        email: 'admin@zingalinga.com',
        name: 'Admin Demo',
        role: 'admin',
        purchasedModules: [],
        createdAt: new Date().toISOString(),
        lastLogin: undefined,
        totalSpent: 0
      });
    }

    // Only create admin user if it doesn't exist - no demo users
    if (!adminExists) {
      await neonDataStore.saveData({ ...data, users: newUsers });
    }
  }
}

export const authManager = new AuthManager();