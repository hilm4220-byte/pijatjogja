import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Globe, Phone, MessageSquare, Settings as SettingsIcon, Database } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// KONFIGURASI SUPABASE
// ============================================
// Cara setup:
// 1. Buat file .env di root project
// 2. Isi dengan:
//    VITE_SUPABASE_URL=https://xxxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=eyJxxx...
// 3. Restart dev server (npm run dev)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validasi credentials
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl.startsWith('https://') &&
                     supabaseAnonKey.length > 20;

let supabase: any = null;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client initialized');
} else {
  console.error('❌ Supabase credentials tidak valid!');
  console.log('📝 Setup Instructions:');
  console.log('1. Buat file .env di root project');
  console.log('2. Tambahkan:');
  console.log('   VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.log('   VITE_SUPABASE_ANON_KEY=eyJxxx...');
  console.log('3. Dapatkan credentials dari: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api');
  console.log('4. Restart server: npm run dev');
}

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
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (isConfigured && supabase) {
      fetchSettings();
    } else {
      setLoading(false);
      setAlert({
        type: 'error',
        message: 'Supabase belum dikonfigurasi. Silakan cek browser console untuk instruksi setup.'
      });
    }
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
      console.log('📥 Fetching settings from Supabase...');

      const { data, error, status, statusText } = await supabase
        .from('settings')
        .select('setting_key, setting_value');

      // Debug info
      const debug = {
        timestamp: new Date().toISOString(),
        status,
        statusText,
        error: error ? {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        } : null,
        dataReceived: data ? data.length : 0,
        rawData: data
      };
      setDebugInfo(debug);
      console.log('🔍 Fetch Debug Info:', debug);

      if (error) {
        console.error('❌ Supabase error:', error);
        
        // Pesan error yang lebih helpful
        let errorMessage = 'Gagal mengambil data: ';
        if (error.code === 'PGRST116') {
          errorMessage += 'Tabel "settings" tidak ditemukan. Silakan buat tabel terlebih dahulu menggunakan SQL schema.';
        } else if (error.message.includes('JWT')) {
          errorMessage += 'Authentication error. Cek SUPABASE_ANON_KEY Anda.';
        } else if (error.message.includes('policy')) {
          errorMessage += 'Row Level Security memblokir akses. Coba disable RLS atau tambahkan policy yang sesuai.';
        } else {
          errorMessage += error.message;
        }
        
        throw new Error(errorMessage);
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Tabel settings kosong');
        setAlert({
          type: 'warning',
          message: 'Tabel settings kosong. Silakan isi data atau jalankan SQL insert default.'
        });
        return;
      }

      // Convert array to object
      const settingsObj: any = {};
      data.forEach((item: any) => {
        settingsObj[item.setting_key] = item.setting_value || '';
      });

      setSettings({
        site_name: settingsObj.site_name || '',
        wa_number: settingsObj.wa_number || '',
        auto_message: settingsObj.auto_message || ''
      });

      console.log('✅ Settings loaded:', settingsObj);

    } catch (error) {
      console.error('❌ Fetch error:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal mengambil data pengaturan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validasi Supabase config
    if (!isConfigured || !supabase) {
      setAlert({
        type: 'error',
        message: 'Supabase belum dikonfigurasi. Silakan setup credentials terlebih dahulu.'
      });
      return;
    }

    // Validasi data
    if (!settings.site_name.trim()) {
      setAlert({
        type: 'error',
        message: 'Nama website tidak boleh kosong'
      });
      return;
    }

    if (!settings.wa_number.trim()) {
      setAlert({
        type: 'error',
        message: 'Nomor WhatsApp tidak boleh kosong'
      });
      return;
    }

    // Validasi format nomor WA
    const waPattern = /^62\d{9,13}$/;
    if (!waPattern.test(settings.wa_number.trim())) {
      setAlert({
        type: 'error',
        message: 'Format nomor WhatsApp tidak valid. Harus diawali 62 dan tanpa spasi/karakter khusus'
      });
      return;
    }

    setSaving(true);

    try {
      const updates = [
        { key: 'site_name', value: settings.site_name.trim() },
        { key: 'wa_number', value: settings.wa_number.trim() },
        { key: 'auto_message', value: settings.auto_message.trim() }
      ];

      console.log('💾 Saving settings:', updates);

      // Update settings satu per satu
      for (const update of updates) {
        const { data, error } = await supabase
          .from('settings')
          .update({ 
            setting_value: update.value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', update.key)
          .select();

        if (error) {
          console.error(`❌ Error updating ${update.key}:`, error);
          throw new Error(`Gagal update ${update.key}: ${error.message}`);
        }

        console.log(`✅ ${update.key} saved:`, data);
      }

      setAlert({
        type: 'success',
        message: '✅ Pengaturan berhasil disimpan!'
      });
      
      // ⭐ TRIGGER REFRESH untuk Landing Page
      // Method 1: Broadcast via localStorage (untuk cross-tab sync)
      localStorage.setItem('settings-updated', Date.now().toString());
      
      // Method 2: Custom event (untuk same-tab sync)
      window.dispatchEvent(new CustomEvent('settings-updated'));
      
      console.log('📢 Settings update broadcast sent');
      
      // Refresh data di admin panel
      setTimeout(() => {
        fetchSettings();
      }, 500);

    } catch (error) {
      console.error('❌ Save error:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menyimpan pengaturan'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Jika Supabase tidak configured
  if (!isConfigured) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                ⚠️ Supabase Belum Dikonfigurasi
              </h3>
              <div className="text-sm text-red-800 space-y-3">
                <p>Untuk menggunakan fitur ini, Anda perlu setup Supabase terlebih dahulu:</p>
                
                <div className="bg-white rounded p-4 space-y-2">
                  <p className="font-semibold">Langkah Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Buat file <code className="bg-gray-200 px-2 py-0.5 rounded">.env</code> di root project</li>
                    <li>Tambahkan credentials Supabase Anda:
                      <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...`}
                      </pre>
                    </li>
                    <li>Dapatkan credentials dari: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a> → Settings → API</li>
                    <li>Jalankan SQL schema untuk membuat tabel <code className="bg-gray-200 px-2 py-0.5 rounded">settings</code></li>
                    <li>Restart dev server: <code className="bg-gray-200 px-2 py-0.5 rounded">npm run dev</code></li>
                  </ol>
                </div>

                <p className="font-medium mt-4">Current values:</p>
                <ul className="text-xs bg-gray-800 text-gray-300 p-3 rounded space-y-1">
                  <li>VITE_SUPABASE_URL: {supabaseUrl || '❌ not set'}</li>
                  <li>VITE_SUPABASE_ANON_KEY: {supabaseAnonKey ? '✅ set (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ not set'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-pulse flex space-x-2 justify-center mb-3">
            <div className="h-3 w-3 bg-green-600 rounded-full animate-bounce"></div>
            <div className="h-3 w-3 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="h-3 w-3 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-gray-500">Memuat data dari Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Alert */}
      {alert && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg animate-fade-in ${
            alert.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : alert.type === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : alert.type === 'info'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span className="flex-1">{alert.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Website</h2>
          <p className="text-sm text-gray-600 mt-1">
            Kelola pengaturan umum dan WhatsApp website Anda
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={async () => {
              console.log('=== SUPABASE DEBUG ===');
              console.log('URL:', supabaseUrl);
              console.log('KEY:', supabaseAnonKey?.substring(0, 30) + '...');
              
              try {
                const { data, error } = await supabase.from('settings').select('*');
                console.log('Test Query Result:');
                console.log('Data:', data);
                console.log('Error:', error);
                
                setAlert({
                  type: 'info',
                  message: '✅ Debug info logged to console (F12). Check browser console!'
                });
              } catch (e) {
                console.error('Test Query Failed:', e);
                setAlert({
                  type: 'error',
                  message: 'Debug failed. Check console for details.'
                });
              }
            }}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center space-x-1"
          >
            <Database size={14} />
            <span>Test Connection</span>
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <SettingsIcon size={16} />
            <span>{showDebug ? 'Hide' : 'Show'} Debug</span>
          </button>
        </div>
      </div>

      {/* Debug Info */}
      {showDebug && debugInfo && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Site Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Globe size={18} className="text-green-600" />
            <span>Nama Website</span>
          </label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => handleChange('site_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Contoh: Pijat Jogja"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nama website yang akan ditampilkan di header dan title
          </p>
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Phone size={18} className="text-green-600" />
            <span>Nomor WhatsApp</span>
          </label>
          <input
            type="text"
            value={settings.wa_number}
            onChange={(e) => handleChange('wa_number', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Contoh: 6281234567890"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 62 diikuti nomor tanpa 0 dan tanpa spasi/karakter khusus
          </p>
        </div>

        {/* Auto Message */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MessageSquare size={18} className="text-green-600" />
            <span>Pesan Otomatis WhatsApp</span>
          </label>
          <textarea
            value={settings.auto_message}
            onChange={(e) => handleChange('auto_message', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
            placeholder="Contoh: Halo, saya ingin memesan layanan pijat..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Pesan yang akan otomatis muncul saat customer klik tombol WhatsApp
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Catatan:</p>
              <p>Untuk mengedit kontak, alamat, email, sosial media, dan copyright footer, silakan ke tab <span className="font-semibold">"Edit Footer"</span></p>
            </div>
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