import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Instagram, Mail } from 'lucide-react';
import footerService from '../services/footerService';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // State untuk data dari database
  const [siteName, setSiteName] = useState('Pijat Jogja');
  const [siteDescription, setSiteDescription] = useState('Layanan pijat panggilan profesional area Yogyakarta. Terapis bersertifikat, layanan 24 jam, harga terjangkau.');
  const [waNumber, setWaNumber] = useState('6281234567890');
  const [waMessage, setWaMessage] = useState('Halo, saya ingin pesan pijat.');
  const [phoneDisplay, setPhoneDisplay] = useState('+62 812-3456-7890');
  const [email, setEmail] = useState('info@pijatjogja.com');
  const [alamat, setAlamat] = useState('Yogyakarta, Indonesia');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/pijatjogja');
  const [copyrightText, setCopyrightText] = useState('PijatJogja.com - All rights reserved');
  const [copyrightSubtext, setCopyrightSubtext] = useState('Layanan Pijat Panggilan Profesional Area Yogyakarta');

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const result = await footerService.getFooter();
      
      if (result.success && result.data) {
        const data = result.data;
        console.log('Footer data loaded:', data);
        
        if (data.site_name) setSiteName(data.site_name);
        if (data.site_description) setSiteDescription(data.site_description);
        if (data.wa_number) setWaNumber(data.wa_number.replace(/\D/g, ''));
        if (data.wa_message) setWaMessage(data.wa_message);
        if (data.phone_display) setPhoneDisplay(data.phone_display);
        if (data.email) setEmail(data.email);
        if (data.alamat) setAlamat(data.alamat);
        if (data.instagram_url) setInstagramUrl(data.instagram_url);
        if (data.copyright_text) setCopyrightText(data.copyright_text);
        if (data.copyright_subtext) setCopyrightSubtext(data.copyright_subtext);
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
    }
  };

  // Fungsi untuk generate WhatsApp URL dengan pesan
  const getWhatsAppUrl = () => {
    const encodedMessage = encodeURIComponent(waMessage);
    return `https://wa.me/${waNumber}?text=${encodedMessage}`;
  };

  return (
    <footer id="kontak" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {siteName.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-2xl font-semibold">{siteName}</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              {siteDescription}
            </p>
            <div className="flex space-x-4">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition"
                aria-label="WhatsApp"
              >
                <Phone size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:opacity-90 transition"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Layanan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Pijat Tradisional</li>
              <li>Pijat Refleksi</li>
              <li>Pijat Lulur</li>
              <li>Pijat Ibu Hamil</li>
              <li>Totok Wajah</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-2">
                <Phone className="flex-shrink-0 mt-1" size={18} />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition"
                >
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="flex-shrink-0 mt-1" size={18} />
                <span>{alamat}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="flex-shrink-0 mt-1" size={18} />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {copyrightText}</p>
          <p className="mt-2 text-sm">{copyrightSubtext}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;