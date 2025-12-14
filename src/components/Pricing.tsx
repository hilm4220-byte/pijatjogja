import { useEffect, useState } from 'react';
import { Check, Phone } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import pricingService, { PricingPackage } from '../services/pricingService';

export default function Pricing() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari Supabase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const result = await pricingService.getAllPackages();

        if (result.success && result.data) {
          console.log('✅ Pricing loaded for homepage:', result.data);
          setPackages(result.data);
        } else {
          console.error('❌ Error loading pricing:', result.error);
        }
      } catch (err) {
        console.error('Gagal mengambil data harga:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Buat URL WhatsApp dengan pesan otomatis
  const getWhatsAppUrl = (packageName: string) => {
    const customMessage = `Halo, saya ingin memesan layanan ${encodeURIComponent(packageName)}`;
    return `https://wa.me/${settings.wa_number}?text=${customMessage}`;
  };

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat data paket...</p>
      </section>
    );
  }

  return (
    <section id="harga" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Harga Paket
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda. Harga transparan tanpa biaya tambahan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                pkg.popular ? 'border-4 border-green-500' : 'border border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-500 mb-6">{pkg.duration}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-600">{pkg.price}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
                    pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="text-green-600" size={14} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">Tidak ada fitur yang tersedia</li>
                  )}
                </ul>

                <a
                  href={getWhatsAppUrl(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-full font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-green-50 border-2 border-gray-200 hover:border-green-500'
                  }`}
                >
                  <Phone size={18} />
                  <span>Pesan di WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Tidak ada paket yang tersedia saat ini
          </div>
        )}
      </div>
    </section>
  );
}