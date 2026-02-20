// services/authService.ts
// Service untuk handle authentication dengan API SQLite

import api from '../api';

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  role?: string
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials) {
    try {
      const data = await api.login(credentials.email, credentials.password);

      if (!data.user) {
        throw new Error('Login gagal')
      }

      // Check if user is admin
      const isAdmin = data.user.role === 'admin' || data.user.role === 'super_admin';
      
      if (!isAdmin) {
        throw new Error('Anda tidak memiliki akses admin')
      }

      console.log('✅ Login berhasil:', data.user.email)
      
      // Simpan session
      localStorage.setItem('pijatjogja_session', JSON.stringify(data.user));
      localStorage.setItem('pijatjogja_token', data.user.id);
      
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role
        }
      }
    } catch (error: any) {
      console.error('❌ Login error:', error.message)
      return {
        success: false,
        error: error.message || 'Login gagal'
      }
    }
  }

  // Logout
  async logout() {
    try {
      localStorage.removeItem('pijatjogja_session');
      localStorage.removeItem('pijatjogja_token');
      console.log('✅ Logout berhasil')
      return { success: true }
    } catch (error: any) {
      console.error('❌ Logout error:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get Current User
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('pijatjogja_token');
      if (!token) return null;

      const data = await api.getUser(token);
      if (!data.user) return null;

      const isAdmin = data.user.role === 'admin' || data.user.role === 'super_admin';
      if (!isAdmin) return null;

      return {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role
      }
    } catch (error: any) {
      console.error('Error getting current user:', error.message)
      return null
    }
  }

  // Check if user is admin
  async checkIsAdmin(userId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('pijatjogja_token');
      if (!token) return false;

      const data = await api.getUser(token);
      return data.user?.role === 'admin' || data.user?.role === 'super_admin';
    } catch (error: any) {
      console.error('Error checking admin:', error.message)
      return false
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    // Check session periodically
    const checkSession = async () => {
      const user = await this.getCurrentUser();
      callback(user);
    };
    
    checkSession();
    
    // Return unsubscribe function
    return { 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    };
  }

  // Check if currently logged in
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }
}

export default new AuthService()
