import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './contexts/SettingsContext'
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
import ProtectedRoute from './components/ProtectedRoute'

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

function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminSettings />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </SettingsProvider>
  )
}

export default App
