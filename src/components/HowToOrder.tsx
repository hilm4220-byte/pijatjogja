import { MessageCircle, MapPin, User } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Chat WhatsApp',
    description: 'Klik tombol WhatsApp dan chat dengan tim kami'
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Pilih Layanan & Lokasi',
    description: 'Tentukan jenis pijat dan lokasi Anda di area Jogja'
  },
  {
    icon: User,
    number: '03',
    title: 'Terapis Datang',
    description: 'Terapis profesional kami akan datang ke lokasi Anda'
  }
];

export default function HowToOrder() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cara Pemesanan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mudah dan cepat, hanya 3 langkah untuk mendapatkan layanan pijat profesional
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-24 left-1/2 w-full h-1 bg-gradient-to-r from-green-300 to-green-200 z-0" />
                  )}

                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition-transform">
                      <Icon className="text-white" size={36} />
                    </div>

                    <div className="mb-4">
                      <span className="text-5xl font-bold text-green-100">{step.number}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
