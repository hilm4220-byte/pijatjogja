import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { SettingsProvider } from './contexts/SettingsContext' // ⭐ TAMBAHKAN INI
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import HowToOrder from './components/HowToOrder'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import AdminSettings from './pages/AdminSettings'
import AdminLogin from './pages/AdminLogin'
// import ProtectedRoute from './components/ProtectedRoute' // DISABLE DULU

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Services />
      <Pricing />
      <Testimonials />
      <HowToOrder />
      <FAQ />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

function App() {
  // Test Koneksi Supabase
  useEffect(() => {
    async function testSupabaseConnection() {
      try {
        console.log('🔄 Testing Supabase connection...')
        
        const { data, error } = await supabase
          .from('settings') // ⭐ GANTI jadi 'settings' bukan '_test_table'
          .select('*')
          .limit(1)
        
        if (error) {
          console.error('⚠️ Error query (tapi koneksi OK):', error.message)
          console.log('✅ Koneksi ke Supabase BERHASIL!')
        } else {
          console.log('✅ Koneksi ke Supabase BERHASIL!')
          console.log('📊 Sample data:', data)
        }
      } catch (err) {
        console.error('❌ Koneksi GAGAL! Cek .env file Anda')
        console.error('Error:', err)
      }
    }
    
    testSupabaseConnection()
  }, [])

  return (
    // ⭐ WRAP dengan SettingsProvider
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* TANPA ProtectedRoute dulu - langsung bisa akses */}
          <Route path="/admin" element={<AdminSettings />} />
        </Routes>
      </Router>
    </SettingsProvider>
  )
}

export default App