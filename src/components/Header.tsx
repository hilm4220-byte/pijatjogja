import { Phone, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();
  
  // ✅ Gunakan auto_message (bukan wa_message)
  const encodedMessage = encodeURIComponent(settings.auto_message);
  const waUrl = `https://wa.me/${settings.wa_number}?text=${encodedMessage}`;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">PJ</span>
            </div>
            {/* ✅ Gunakan site_name (bukan site_title) */}
            <span className="text-xl font-semibold text-gray-800">{settings.site_name}</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition">Home</button>
            <button onClick={() => scrollToSection('layanan')} className="text-gray-700 hover:text-green-600 transition">Layanan</button>
            <button onClick={() => scrollToSection('harga')} className="text-gray-700 hover:text-green-600 transition">Harga</button>
            <button onClick={() => scrollToSection('testimoni')} className="text-gray-700 hover:text-green-600 transition">Testimoni</button>
            <button onClick={() => scrollToSection('kontak')} className="text-gray-700 hover:text-green-600 transition">Kontak</button>

            {/* ✅ Link Admin - Desktop */}
            <Link 
              to="/admin/login" 
              className="text-gray-700 hover:text-green-600 transition flex items-center space-x-1"
            >
              <Shield size={16} />
              <span>Admin</span>
            </Link>
          </nav>

          {/* ✅ Tombol WhatsApp - Desktop */}
          {settings.wa_number ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition shadow-md"
            >
              <Phone size={18} />
              <span className="font-medium">Pesan via WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              className="hidden md:flex items-center space-x-2 bg-gray-400 text-white px-6 py-2.5 rounded-full cursor-not-allowed"
            >
              <Phone size={18} />
              <span className="font-medium">WhatsApp</span>
            </button>
          )}

          {/* ✅ Tombol menu (mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* ✅ Menu Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition text-left">Home</button>
            <button onClick={() => scrollToSection('layanan')} className="text-gray-700 hover:text-green-600 transition text-left">Layanan</button>
            <button onClick={() => scrollToSection('harga')} className="text-gray-700 hover:text-green-600 transition text-left">Harga</button>
            <button onClick={() => scrollToSection('testimoni')} className="text-gray-700 hover:text-green-600 transition text-left">Testimoni</button>
            <button onClick={() => scrollToSection('kontak')} className="text-gray-700 hover:text-green-600 transition text-left">Kontak</button>

            {/* ✅ Link Admin - Mobile */}
            <Link 
              to="/admin/login" 
              className="text-gray-700 hover:text-green-600 transition text-left flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield size={16} />
              <span>Login Admin</span>
            </Link>

            {/* ✅ Tombol WhatsApp - Mobile */}
            {settings.wa_number ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition"
              >
                <Phone size={18} />
                <span className="font-medium">Pesan via WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center space-x-2 bg-gray-400 text-white px-6 py-2.5 rounded-full cursor-not-allowed"
              >
                <Phone size={18} />
                <span className="font-medium">WhatsApp (Belum diatur)</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}