import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

interface FooterData {
  phone: string;
  location: string;
  email: string;
  description: string;
  copyright: string;
  tagline: string;
}

interface FooterContextType {
  footer: FooterData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Default values
const defaultFooter: FooterData = {
  phone: '+62 812-3456-7890',
  location: 'Yogyakarta, Indonesia',
  email: 'info@pijatjogja.com',
  description: 'Layanan pijat panggilan profesional area Yogyakarta.',
  copyright: '© 2025 PijatJogja.com - All rights reserved',
  tagline: 'Layanan Pijat Panggilan Profesional Area Yogyakarta'
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [footer, setFooter] = useState<FooterData>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dari Supabase table 'footer_settings'
      const { data, error: supabaseError } = await supabase
        .from('footer_settings')
        .select('*')
        .single(); // Ambil 1 row saja

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data) {
        setFooter({
          phone: data.phone || defaultFooter.phone,
          location: data.location || defaultFooter.location,
          email: data.email || defaultFooter.email,
          description: data.description || defaultFooter.description,
          copyright: data.copyright || defaultFooter.copyright,
          tagline: data.tagline || defaultFooter.tagline
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data footer';
      setError(errorMessage);
      
      // Keep using default values on error
      setFooter(defaultFooter);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchFooter();
  };

  // Fetch on mount
  useEffect(() => {
    fetchFooter();
  }, []);

  return (
    <FooterContext.Provider value={{ footer, loading, error, refresh }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};