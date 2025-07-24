import React from 'react';
import { NotificationsPage } from './NotificationsPage';
import { User } from '../types';

interface AdminNotificationsPageProps {
  user: User;
  onBack: () => void;
}

export const AdminNotificationsPage: React.FC<AdminNotificationsPageProps> = ({ user, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mali font-bold"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-mali font-bold text-gray-800">All Notifications</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-blue rounded-full flex items-center justify-center">
              <span className="text-white font-mali font-bold">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-mali font-bold text-gray-800">{user.name}</p>
              <p className="font-mali text-gray-600 text-sm capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <NotificationsPage onRefresh={() => {}} />
      </main>
    </div>
  );
};