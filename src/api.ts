import { supabase } from './lib/supabase'

// Pure Supabase - Disable Local for Global Access
const API_URL = null;

export const api = {
  // Footer
  getFooter: async (): Promise<any> => {
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  },

  updateFooter: async (data: any): Promise<{ success: boolean }> => {
    // Fetch existing to get UUID
    const { data: existing } = await supabase
      .from('footer_settings')
      .select('*')
      .limit(1)
      .single();

    if (!existing) {
      throw new Error('No footer_settings row. Create in Supabase dashboard.');
    }

    const { error } = await supabase
      .from('footer_settings')
      .update(data)
      .eq('id', existing.id);
    if (error) throw error;
    return { success: true };
  },

  // Pricing
  getPricing: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data || [];
  },

  updatePricing: async (id: string, data: any): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from('pricing_packages')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Settings
  getSettings: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    if (error) throw error;
    return data || [];
  },


  updateSetting: async (key: string, value: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from('settings')
      .upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' });
    if (error) throw error;
    return { success: true };
  }

};

export default api;

