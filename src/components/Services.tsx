import { Heart, FootprintsIcon, Sparkles, Baby, Smile, Wind } from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: 'Pijat Tradisional',
    description: 'Teknik pijat warisan nusantara untuk relaksasi total'
  },
  {
    icon: FootprintsIcon,
    title: 'Pijat Refleksi Kaki',
    description: 'Stimulasi titik-titik refleksi untuk kesehatan optimal'
  },
  {
    icon: Sparkles,
    title: 'Pijat Lulur / Scrub',
    description: 'Perawatan kulit dengan lulur tradisional'
  },
  {
    icon: Baby,
    title: 'Pijat Ibu Hamil',
    description: 'Teknik khusus untuk ibu hamil yang aman dan nyaman'
  },
  {
    icon: Smile,
    title: 'Pijat Totok Wajah',
    description: 'Terapi wajah untuk meremajakan kulit wajah'
  },
  {
    icon: Wind,
    title: 'Layanan Tambahan',
    description: 'Kerokan, Bekam, Essential Oil'
  }
];

export default function Services() {
  return (
    <section id="layanan" className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Layanan yang Tersedia
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berbagai pilihan layanan pijat profesional untuk kebutuhan Anda
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
