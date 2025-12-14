import { Award, Clock, Home, Sparkles, DollarSign, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Terapis Profesional & Bersertifikat',
    description: 'Tim terapis berpengalaman dan terlatih dengan sertifikasi resmi'
  },
  {
    icon: Clock,
    title: 'Layanan 24 Jam Area Jogja',
    description: 'Tersedia setiap hari, kapan saja Anda membutuhkan'
  },
  {
    icon: Home,
    title: 'Pijat Datang ke Lokasi Anda',
    description: 'Ke rumah, hotel, apartemen, atau kos-kosan'
  },
  {
    icon: Sparkles,
    title: 'Peralatan Bersih & Higienis',
    description: 'Standar kebersihan tinggi untuk kenyamanan Anda'
  },
  {
    icon: DollarSign,
    title: 'Harga Transparan',
    description: 'Tanpa biaya tersembunyi atau biaya tambahan'
  },
  {
    icon: Users,
    title: 'Pilihan Terapis',
    description: 'Tersedia terapis perempuan dan laki-laki sesuai preferensi'
  }
];

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Pilih Kami?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Komitmen kami adalah memberikan layanan pijat terbaik dengan kenyamanan maksimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-amber-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
