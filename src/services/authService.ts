// services/authService.ts
// Service untuk handle authentication dengan API SQLite

import { supabase } from '../lib/supabase';
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message || 'Login gagal')
      }

      if (!data.user) {
        throw new Error('Login gagal - user tidak ditemukan')
      }

      console.log('✅ Login berhasil:', data.user.email)
      
      // Simpan session
      localStorage.setItem('pijatjogja_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email || '',
      })); 
localStorage.setItem('pijatjogja_token', data.user.id || '');
      
      return {
        success: true,
        user: {
        id: data.user.id,
        email: data.user.email!,
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
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;

      return {
        id: data.user.id,
        email: data.user.email!,
      }
    } catch (error: any) {
      console.error('Error getting current user:', error.message)
      return null
    }
  }

  // Check if user is admin
  async checkIsAdmin(): Promise<boolean> {
    return await this.isAuthenticated();
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
