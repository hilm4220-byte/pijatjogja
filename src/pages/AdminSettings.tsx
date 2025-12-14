import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Users, FileText } from 'lucide-react';
import authService from '../services/authService';
import AdminSettings from '../components/admin/AdminSettings';
import AdminManagement from '../components/admin/AdminManagement';
import AdminFooter from '../components/admin/AdminFooter';
import AdminPricingSettings from '../components/admin/AdminPricingSettings';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'settings' | 'admins' | 'footer' | 'pricing'>('settings');
  const [userRole, setUserRole] = useState<string>('admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.log('❌ Not authenticated, redirect to login');
        navigate('/admin/login', { replace: true });
        return;
      }

      console.log('✅ User authenticated:', user.email);
      setUserRole(user.role || 'admin');
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin/login', { replace: true });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log('✅ Logged out');
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect anyway
      navigate('/admin/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={18} />
              <span>Pengaturan Website</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'footer'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={18} />
              <span>Edit Footer</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'pricing'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={18} />
              <span>Harga Paket</span>
            </button>

            {userRole === 'super_admin' && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'admins'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={18} />
                <span>Kelola Admin</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'footer' && <AdminFooter />}
        {activeTab === 'pricing' && <AdminPricingSettings />}
        {activeTab === 'admins' && userRole === 'super_admin' && <AdminManagement />}
      </div>

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <a href="/" className="text-green-600 hover:text-green-700 font-medium">
          ← Kembali ke Halaman Utama
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;