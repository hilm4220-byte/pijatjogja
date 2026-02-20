// services/footerService.ts
// Service untuk mengelola data footer dengan API SQLite

import api from '../api';

export interface FooterData {
  id?: string
  site_name: string
  site_description: string
  wa_number: string
  wa_message: string
  phone_display: string
  email: string
  alamat: string
  instagram_url: string
  copyright_text: string
  copyright_subtext: string
  created_at?: string
  updated_at?: string
}

class FooterService {
  // Get Footer Data
  async getFooter() {
    try {
      const data = await api.getFooter();
      
      console.log('✅ Footer data loaded:', data)
      return { success: true, data }
    } catch (error: any) {
      console.error('Error getting footer:', error.message)
      return { 
        success: false, 
        error: error.message,
        data: this.getDefaultFooter() // Return default jika error
      }
    }
  }

  // Update Footer Data
  async updateFooter(footerData: Partial<FooterData>) {
    try {
      const result = await api.updateFooter(footerData);
      console.log('✅ Footer updated')
      return { success: true }
    } catch (error: any) {
      console.error('Error updating footer:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Get Default Footer (fallback)
  getDefaultFooter(): FooterData {
    return {
      site_name: 'Pijat Jogja',
      site_description: 'Layanan pijat panggilan profesional area Yogyakarta. Terapis bersertifikat, layanan 24 jam, harga terjangkau.',
      wa_number: '6281234567890',
      wa_message: 'Halo, saya ingin memesan layanan pijat panggilan.',
      phone_display: '+62 812-3456-7890',
      email: 'info@pijatjogja.com',
      alamat: 'Yogyakarta, Indonesia',
      instagram_url: 'https://instagram.com/pijatjogja',
      copyright_text: 'PijatJogja.com - All rights reserved',
      copyright_subtext: 'Layanan Pijat Panggilan Profesional Area Yogyakarta'
    }
  }
}

export default new FooterService()
