import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Globe, Phone, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import api from '../../api';

interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface Settings {
  site_name: string;
  wa_number: string;
  auto_message: string;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    site_name: '',
    wa_number: '',
    auto_message: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      
      // Parse settings
      const settingsObj: Settings = {
        site_name: '',
        wa_number: '',
        auto_message: ''
      };
      
      data.forEach((item: any) => {
        if (item.setting_key === 'site_name') settingsObj.site_name = item.setting_value;
        if (item.setting_key === 'wa_number') settingsObj.wa_number = item.setting_value;
        if (item.setting_key === 'auto_message') settingsObj.auto_message = item.setting_value;
      });
      
      setSettings(settingsObj);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: 'Gagal memuat pengaturan: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save each setting
      await api.updateSetting('site_name', settings.site_name);
      await api.updateSetting('wa_number', settings.wa_number);
      await api.updateSetting('auto_message', settings.auto_message);
      
      setAlert({
        type: 'success',
        message: 'Pengaturan berhasil disimpan!'
      });
      
      // Trigger refresh
      window.dispatchEvent(new Event('settings-updated'));
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: 'Gagal menyimpan: ' + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="text-green-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Website</h2>
          <p className="text-sm text-gray-500">Kelola informasi dasar website Anda</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg ${
            alert.type === 'success' ? 'bg-green-50 text-green-800' : 
            alert.type === 'error' ? 'bg-red-50 text-red-800' : 
            alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' : 
            'bg-blue-50 text-blue-800'
          }`}
        >
          {alert.type === 'success' ? <CheckCircle size={20} /> : 
           alert.type === 'error' ? <AlertCircle size={20} /> :
           <AlertCircle size={20} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Site Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Globe size={18} />
            <span>Nama Website</span>
          </label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => handleChange('site_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Masukkan nama website"
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Phone size={18} />
            <span>Nomor WhatsApp</span>
          </label>
          <input
            type="text"
            value={settings.wa_number}
            onChange={(e) => handleChange('wa_number', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="6281234567890"
          />
          <p className="text-xs text-gray-500 mt-1">Contoh: 6281234567890</p>
        </div>

        {/* Auto Message */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MessageSquare size={18} />
            <span>Pesan Otomatis WhatsApp</span>
          </label>
          <textarea
            value={settings.auto_message}
            onChange={(e) => handleChange('auto_message', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
            placeholder="Pesan yang akan dikirim otomatis ke WhatsApp"
          />
        </div>

        {/* Catatan */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Catatan:</p>
              <p>Untuk mengedit kontak, alamat, email, sosial media, dan copyright footer, silakan ke tab <span className="font-semibold">"Edit Footer"</span></p>
            </div>
          </div>

        {/* Preview Section */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preview Data
          </label>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <Globe size={16} className="text-gray-500 mt-0.5" />
              <div>
                <span className="text-gray-600 font-medium">Nama Website:</span>
                <span className="text-gray-900 ml-2">{settings.site_name || '(Belum diisi)'}</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone size={16} className="text-gray-500 mt-0.5" />
              <div>
                <span className="text-gray-600 font-medium">WhatsApp:</span>
                <span className="text-gray-900 ml-2">{settings.wa_number || '(Belum diisi)'}</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MessageSquare size={16} className="text-gray-500 mt-0.5" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium">Pesan Auto:</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{settings.auto_message || '(Belum diisi)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Save size={18} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
