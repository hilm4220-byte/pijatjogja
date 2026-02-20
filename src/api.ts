// project/src/api.ts
// API Client untuk koneksi ke server SQLite

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

export const api = new ApiClient(API_URL);
export default api;
