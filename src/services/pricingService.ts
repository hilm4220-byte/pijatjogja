// services/pricingService.ts
// Service untuk mengelola data pricing dengan Supabase

import { supabase } from '../supabaseClient'

export interface PricingPackage {
  id?: string
  name: string
  price: string
  duration: string
  features: string[]
  popular: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

class PricingService {
  // Get All Packages
  async getAllPackages() {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      
      console.log('✅ Pricing packages loaded:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error getting packages:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Get Package by ID
  async getPackageById(id: string) {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      console.error('Error getting package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Update Package
  async updatePackage(id: string, packageData: Partial<PricingPackage>) {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .update(packageData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      console.log('✅ Package updated:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Create Package (untuk future feature)
  async createPackage(packageData: Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .insert([packageData])
        .select()
        .single()
      
      if (error) throw error
      
      console.log('✅ Package created:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Delete Package (untuk future feature)
  async deletePackage(id: string) {
    try {
      const { error } = await supabase
        .from('pricing_packages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      console.log('✅ Package deleted')
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Set Popular Package
  async setPopular(id: string, popular: boolean) {
    try {
      // Jika set popular = true, set yang lain jadi false dulu
      if (popular) {
        await supabase
          .from('pricing_packages')
          .update({ popular: false })
          .neq('id', id)
      }

      const { data, error } = await supabase
        .from('pricing_packages')
        .update({ popular })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      console.log('✅ Popular status updated:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating popular status:', error.message)
      return { success: false, error: error.message }
    }
  }
}

export default new PricingService()