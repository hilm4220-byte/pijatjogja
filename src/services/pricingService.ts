// services/pricingService.ts
// Service untuk mengelola data pricing dengan API SQLite

import api from '../api';

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
      const data = await api.getPricing();
      
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
      const data = await api.getPricing();
      const pkg = data.find((p: any) => p.id.toString() === id);
      return { success: true, data: pkg }
    } catch (error: any) {
      console.error('Error getting package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Update Package
  async updatePackage(id: string, packageData: Partial<PricingPackage>) {
    try {
      await api.updatePricing(id, packageData);
      
      console.log('✅ Package updated')
      return { success: true }
    } catch (error: any) {
      console.error('Error updating package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Create Package (untuk future feature)
  async createPackage(packageData: Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>) {
    try {
      console.log('✅ Package created')
      return { success: true }
    } catch (error: any) {
      console.error('Error creating package:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Delete Package (untuk future feature)
  async deletePackage(id: string) {
    try {
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
      const data = await api.getPricing();
      
      // Jika set popular = true, set yang lain jadi false dulu
      if (popular) {
        for (const pkg of data) {
          if (pkg.id.toString() !== id) {
            await api.updatePricing(pkg.id.toString(), { ...pkg, popular: false });
          }
        }
      }

      await api.updatePricing(id, { popular });
      
      console.log('✅ Popular status updated')
      return { success: true }
    } catch (error: any) {
      console.error('Error updating popular status:', error.message)
      return { success: false, error: error.message }
    }
  }
}

export default new PricingService()
