// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // ⭐ Import supabase client Anda

interface Settings {
  site_name: string;
  wa_number: string;
  auto_message: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

// Default values
const defaultSettings: Settings = {
  site_name: 'Pijat Panggilan Jogja',
  wa_number: '6281234567890',
  auto_message: 'Halo, saya ingin memesan layanan pijat'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Fetching settings from Supabase...');
      
      // ⭐ FETCH LANGSUNG DARI SUPABASE
      const { data, error: supabaseError } = await supabase
        .from('settings')
        .select('setting_key, setting_value');

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('📦 Raw Supabase data:', data);

      // Parse response
      let settingsObj: Settings = { ...defaultSettings };

      if (Array.isArray(data) && data.length > 0) {
        // Format: [{setting_key: 'x', setting_value: 'y'}]
        data.forEach((item: any) => {
          if (item.setting_key && item.setting_value !== undefined) {
            settingsObj[item.setting_key as keyof Settings] = item.setting_value;
          }
        });
      }

      console.log('✅ Parsed settings:', settingsObj);
      setSettings(settingsObj);
      setError(null);

    } catch (err) {
      console.error('❌ Fetch settings error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data settings';
      setError(errorMessage);
      
      // Keep using default values on error
      console.warn('⚠️ Using default settings due to error');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Auto-refresh every 30 seconds (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing settings...');
      fetchSettings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen to storage events for cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settings-updated') {
        console.log('🔄 Settings updated in another tab, refreshing...');
        fetchSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen to custom events (same tab)
  useEffect(() => {
    const handleCustomEvent = () => {
      console.log('🔄 Settings updated event received, refreshing...');
      fetchSettings();
    };

    window.addEventListener('settings-updated', handleCustomEvent);
    return () => window.removeEventListener('settings-updated', handleCustomEvent);
  }, []);

  const refreshSettings = async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};