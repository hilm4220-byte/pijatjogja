import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Phone, MapPin, Mail, Instagram, FileText, Globe, MessageCircle } from 'lucide-react';
import footerService, { FooterData } from '../../services/footerService';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

const AdminFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    site_name: '',
    site_description: '',
    wa_number: '',
    wa_message: '',
    phone_display: '',
    email: '',
    alamat: '',
    instagram_url: '',
    copyright_text: '',
    copyright_subtext: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    fetchFooter();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchFooter = async () => {
    try {
      const result = await footerService.getFooter();

      if (result.success && result.data) {
        const data = result.data;
        console.log('📥 Footer data:', data);

        setFooterData({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          wa_number: data.wa_number || '',
          wa_message: data.wa_message || '',
          phone_display: data.phone_display || '',
          email: data.email || '',
          alamat: data.alamat || '',
          instagram_url: data.instagram_url || '',
          copyright_text: data.copyright_text || '',
          copyright_subtext: data.copyright_subtext || ''
        });
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Gagal mengambil data footer'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footerData.site_name.trim()) {
      setAlert({ type: 'error', message: 'Nama website tidak boleh kosong' });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        site_name: footerData.site_name.trim(),
        site_description: footerData.site_description.trim(),
        wa_number: footerData.wa_number.trim(),
        wa_message: footerData.wa_message.trim(),
        phone_display: footerData.phone_display.trim(),
        email: footerData.email.trim(),
        alamat: footerData.alamat.trim(),
        instagram_url: footerData.instagram_url.trim(),
        copyright_text: footerData.copyright_text.trim(),
        copyright_subtext: footerData.copyright_subtext.trim()
      };

      console.log('📤 Sending footer data:', payload);

      const result = await footerService.updateFooter(payload);

      if (result.success) {
        setAlert({ type: 'success', message: 'Footer berhasil disimpan ✅' });
        setTimeout(fetchFooter, 800);
      } else {
        throw new Error(result.error || 'Gagal menyimpan footer');
      }
    } catch (error) {
      console.error('Save error:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof FooterData, value: string) => {
    setFooterData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg ${
            alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Footer Website</h2>
        <p className="text-sm text-gray-600 mt-1">
          Kelola semua informasi yang ditampilkan di footer website
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-8">
        {/* Identitas Website */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Identitas Website</h3>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Globe size={18} />
              <span>Nama Website</span>
            </label>
            <input
              type="text"
              value={footerData.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: Pijat Jogja"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={18} />
              <span>Deskripsi Singkat</span>
            </label>
            <textarea
              value={footerData.site_description}
              onChange={(e) => handleChange('site_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Layanan pijat panggilan profesional area Yogyakarta..."
            />
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Kontak</h3>

          {/* Nomor WhatsApp */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={18} />
              <span>Nomor WhatsApp (untuk link)</span>
            </label>
            <input
              type="text"
              value={footerData.wa_number}
              onChange={(e) => handleChange('wa_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: 6281234567890"
            />
          </div>

          {/* Pesan Otomatis WhatsApp */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MessageCircle size={18} />
              <span>Pesan Otomatis WhatsApp</span>
            </label>
            <textarea
              value={footerData.wa_message}
              onChange={(e) => handleChange('wa_message', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Halo, saya ingin pesan pijat."
            />
            <p className="text-xs text-gray-500 mt-1">
              Pesan ini akan otomatis terisi saat pengguna klik tombol WhatsApp
            </p>
          </div>

          {/* Telepon */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={18} />
              <span>Nomor Telepon (untuk ditampilkan)</span>
            </label>
            <input
              type="text"
              value={footerData.phone_display}
              onChange={(e) => handleChange('phone_display', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: +62 812-3456-7890"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={footerData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: info@pijatjogja.com"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={18} />
              <span>Alamat</span>
            </label>
            <textarea
              value={footerData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Yogyakarta, Indonesia"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Instagram size={18} />
              <span>Instagram URL</span>
            </label>
            <input
              type="url"
              value={footerData.instagram_url}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Copyright</h3>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={18} />
              <span>Teks Copyright</span>
            </label>
            <input
              type="text"
              value={footerData.copyright_text}
              onChange={(e) => handleChange('copyright_text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="PT. Pijat Jogja Indonesia"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={18} />
              <span>Sub Teks Copyright</span>
            </label>
            <input
              type="text"
              value={footerData.copyright_subtext}
              onChange={(e) => handleChange('copyright_subtext', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Layanan pijat profesional dan terpercaya"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Preview Footer</label>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {footerData.site_name.substring(0, 2).toUpperCase() || 'PJ'}
                  </div>
                  <span className="font-semibold">{footerData.site_name || '(Nama Website)'}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {footerData.site_description || '(Deskripsi)'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Kontak</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>📞 {footerData.phone_display || '(Nomor telepon)'}</p>
                  <p>📍 {footerData.alamat || '(Alamat)'}</p>
                  <p>📧 {footerData.email || '(Email)'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Sosial Media</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>📱 Instagram: {footerData.instagram_url ? 'Tersedia' : '(Belum diisi)'}</p>
                  <p>💬 WhatsApp: {footerData.wa_number || '(Belum diisi)'}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
              <p>© {new Date().getFullYear()} {footerData.copyright_text || '(Copyright text)'}</p>
              <p className="text-xs mt-1">{footerData.copyright_subtext || '(Sub text)'}</p>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            <Save size={18} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFooter;