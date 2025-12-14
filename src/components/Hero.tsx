import { Phone, Clock, MapPin, Shield } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Hero() {
  const { settings, loading, error } = useSettings();
  
  // Encode message untuk URL WhatsApp
  const encodedMessage = encodeURIComponent(settings.auto_message);
  const waUrl = `https://wa.me/${settings.wa_number}?text=${encodedMessage}`;

  return (
    <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {settings.site_name}
              <span className="block text-green-600 mt-2">Profesional, Nyaman, & Terpercaya</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Layanan pijat datang ke rumah, hotel, atau kos Anda. Area Yogyakarta dan sekitarnya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {loading ? (
                <button
                  disabled
                  className="flex items-center justify-center space-x-2 bg-gray-400 text-white px-8 py-4 rounded-full cursor-not-allowed"
                >
                  <Phone size={22} />
                  <span className="font-semibold text-lg">Memuat...</span>
                </button>
              ) : error ? (
                <button
                  disabled
                  className="flex items-center justify-center space-x-2 bg-red-400 text-white px-8 py-4 rounded-full cursor-not-allowed"
                >
                  <Phone size={22} />
                  <span className="font-semibold text-lg">Error: {error}</span>
                </button>
              ) : settings.wa_number ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                  <Phone size={22} />
                  <span className="font-semibold text-lg">Pesan Sekarang via WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center space-x-2 bg-gray-400 text-white px-8 py-4 rounded-full cursor-not-allowed"
                >
                  <Phone size={22} />
                  <span className="font-semibold text-lg">Nomor WhatsApp belum diatur</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Shield className="text-green-600" size={24} />
                </div>
                <span className="text-sm text-gray-700 font-medium">Tersertifikasi</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Clock className="text-green-600" size={24} />
                </div>
                <span className="text-sm text-gray-700 font-medium">24 Jam</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <span className="text-sm text-gray-700 font-medium">Area Jogja</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Phone className="text-green-600" size={24} />
                </div>
                <span className="text-sm text-gray-700 font-medium">Fast Response</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3764568/pexels-photo-3764568.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Massage Therapy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold text-green-600">4.9/5.0</p>
              <p className="text-sm text-gray-600">Rating Pelanggan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}