// project/src/api.ts
// API Client untuk koneksi ke server SQLite

import { supabase } from './lib/supabase'
const API_URL = 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Settings
  async getSettings() {
    return this.request<any[]>('/settings');
  }

  async updateSetting(key: string, value: string) {
    return this.request<{ success: boolean }>('/settings', {
      method: 'POST',
      body: JSON.stringify({ setting_key: key, setting_value: value }),
    });
  }

  // Footer
  async getFooter() {
    return this.request<any>('/footer');
  }

  async updateFooter(data: any) {
    return this.request<{ success: boolean }>('/footer', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Pricing
  async getPricing() {
    return this.request<any[]>('/pricing');
  }

  async updatePricing(id: string, data: any) {
    return this.request<{ success: boolean }>(`/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getUser(token: string) {
    return this.request<{ user: any }>('/auth/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Admins
  async getAdmins() {
    return this.request<any[]>('/admins');
  }

  async createAdmin(data: { email: string; password_hash: string; role: string }) {
    return this.request<{ success: boolean; id: string }>('/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAdmin(id: string) {
    return this.request<{ success: boolean }>(`/admins/${id}`, {
      method: 'DELETE',
    });
  }
}

// Temporary fix - use local server or implement Supabase
interface ApiResponse<T> {
  data: T | null
  error: any | null
}

export const api = {
  getPricing: async (): Promise<any[]> => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.getPricing();
    }
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },
  getFooter: async (): Promise<any> => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.getFooter();
    }
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .limit(1)
      .single()
    if (error) throw error
    return data
  },
  getSettings: async (): Promise<any[]> => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.getSettings();
    }
    const { data, error } = await supabase
      .from('settings')
      .select('*')
    if (error) throw error
    return data || []
  },
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data
  },
  updatePricing: async (id: string, data: any) => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.updatePricing(id, data);
    }
    // Supabase: fetch existing row to handle UUID id properly
    const { data: existing, error: fetchError } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;
    if (!existing) {
      throw new Error(`No pricing package found with id: ${id}`);
    }
    const { error } = await supabase
      .from('pricing_packages')
      .update(data)
      .eq('id', existing.id);
    if (error) throw error;
    return { success: true };
  },
  updateFooter: async (data: any) => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.updateFooter(data);
    }
    // Supabase: fetch existing row to get correct UUID id
    const { data: existing, error: fetchError } = await supabase
      .from('footer_settings')
      .select('*')
      .limit(1)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // Ignore no row
    if (!existing) {
      throw new Error('No footer_settings row found in Supabase. Please create one first.');
    }
    const { error } = await supabase
      .from('footer_settings')
      .update(data)
      .eq('id', existing.id);
    if (error) throw error;
    return { success: true };
  },
  updateSetting: async (key: string, value: string) => {
    if (API_URL) {
      const client = new ApiClient(API_URL as string);
      return await client.updateSetting(key, value);
    }
    const { error } = await supabase
      .from('settings')
      .upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' })
    if (error) throw error
    return { success: true }
  }
  // Add more as needed
}


export default api
