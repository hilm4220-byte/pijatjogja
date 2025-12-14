// services/authService.ts
// Service untuk handle authentication dengan Supabase

import { supabase } from '../supabaseClient'

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
        password: credentials.password
      })

      if (error) throw error

      if (!data.user) {
        throw new Error('Login gagal')
      }

      // Check if user is admin
      const isAdmin = await this.checkIsAdmin(data.user.id)
      
      if (!isAdmin) {
        // Logout kalau bukan admin
        await this.logout()
        throw new Error('Anda tidak memiliki akses admin')
      }

      console.log('✅ Login berhasil:', data.user.email)
      
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin'
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
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
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      if (!user) return null

      // Check if admin
      const isAdmin = await this.checkIsAdmin(user.id)
      
      if (!isAdmin) {
        return null
      }

      return {
        id: user.id,
        email: user.email || '',
        role: 'admin'
      }
    } catch (error: any) {
      console.error('Error getting current user:', error.message)
      return null
    }
  }

  // Check if user is admin
  async checkIsAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single()

      if (error) {
        // Jika error karena tidak ada data, return false
        if (error.code === 'PGRST116') {
          return false
        }
        throw error
      }

      return data?.role === 'admin'
    } catch (error: any) {
      console.error('Error checking admin:', error.message)
      return false
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (session?.user) {
        const isAdmin = await this.checkIsAdmin(session.user.id)
        
        if (isAdmin) {
          callback({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin'
          })
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }

  // Check if currently logged in
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }
}

export default new AuthService()