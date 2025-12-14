import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Apakah melayani 24 jam?',
    answer: 'Ya, kami melayani 24 jam setiap hari untuk kenyamanan Anda. Anda bisa booking kapan saja sesuai kebutuhan.'
  },
  {
    question: 'Apakah bisa ke hotel atau kos?',
    answer: 'Tentu bisa! Kami melayani panggilan ke rumah, hotel, apartemen, kos-kosan, dan villa di area Yogyakarta dan sekitarnya.'
  },
  {
    question: 'Apakah ada terapis perempuan/laki-laki?',
    answer: 'Ya, kami memiliki terapis perempuan dan laki-laki. Anda bisa memilih sesuai preferensi saat booking.'
  },
  {
    question: 'Bagaimana cara booking?',
    answer: 'Sangat mudah! Cukup klik tombol WhatsApp, chat dengan kami, tentukan layanan dan lokasi, lalu terapis akan datang ke tempat Anda.'
  },
  {
    question: 'Berapa lama waktu kedatangan terapis?',
    answer: 'Waktu kedatangan biasanya 30-60 menit setelah booking, tergantung lokasi dan ketersediaan terapis.'
  },
  {
    question: 'Apakah harga sudah termasuk biaya transportasi?',
    answer: 'Ya, harga yang tercantum sudah termasuk biaya terapis datang ke lokasi Anda. Tidak ada biaya tambahan.'
  },
  {
    question: 'Apa saja yang perlu disiapkan?',
    answer: 'Anda hanya perlu menyediakan tempat yang nyaman seperti kasur atau matras. Terapis akan membawa semua peralatan yang diperlukan.'
  },
  {
    question: 'Apakah ada paket untuk beberapa orang?',
    answer: 'Ya, kami melayani paket untuk beberapa orang sekaligus. Silakan tanyakan detailnya via WhatsApp untuk penawaran terbaik.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan kami
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-green-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
