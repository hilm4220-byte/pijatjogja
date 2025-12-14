import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Siti R.',
    location: 'Sleman',
    rating: 5,
    text: 'Terapis datang tepat waktu, pijatnya enak dan profesional! Saya pesan untuk di hotel, pelayanannya sangat memuaskan.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Budi S.',
    location: 'Condongcatur',
    rating: 5,
    text: 'Recommended banget! Harga terjangkau, terapis ramah dan skillnya oke. Badan jadi fresh setelah dipijat.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Maya L.',
    location: 'Kota Jogja',
    rating: 5,
    text: 'Pelayanan 24 jam sangat membantu! Saya pesan tengah malam karena pegal-pegal, responnya cepat dan langsung datang.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Agus W.',
    location: 'Bantul',
    rating: 5,
    text: 'Sudah langganan berkali-kali. Terapis profesional, peralatan bersih, dan harganya worth it!',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Dewi P.',
    location: 'Kalasan',
    rating: 5,
    text: 'Pijat ibu hamilnya luar biasa! Terapis sangat hati-hati dan paham tekniknya. Bikin rileks banget.',
    image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Rendi K.',
    location: 'Depok',
    rating: 5,
    text: 'Fast response via WhatsApp, booking gampang, terapis datang on time. Pokoknya top service!',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Testimoni Pelanggan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 text-green-200" size={32} />
                <p className="text-gray-700 leading-relaxed pl-6">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
