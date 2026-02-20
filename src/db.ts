// src/db.ts
// SQLite-like database using localStorage for persistence
// Provides Supabase-like API for compatibility

const DB_PREFIX = 'pijatjogja_db_';

// Initialize default data
const initializeDefaultData = () => {
  // Settings table
  if (!localStorage.getItem(DB_PREFIX + 'settings')) {
    const defaultSettings = [
      { id: '1', setting_key: 'site_name', setting_value: 'Pijat Panggilan Jogja' },
      { id: '2', setting_key: 'wa_number', setting_value: '6281234567890' },
      { id: '3', setting_key: 'auto_message', setting_value: 'Halo, saya ingin memesan layanan pijat' }
    ];
    localStorage.setItem(DB_PREFIX + 'settings', JSON.stringify(defaultSettings));
  }

  // Footer settings table
  if (!localStorage.getItem(DB_PREFIX + 'footer_settings')) {
    const defaultFooter = [{
      id: '1',
      site_name: 'Pijat Jogja',
      site_description: 'Layanan pijat panggilan profesional area Yogyakarta. Terapis bersertifikat, layanan 24 jam, harga terjangkau.',
      wa_number: '6281234567890',
      wa_message: 'Halo, saya ingin memesan layanan pijat panggilan.',
      phone_display: '+62 812-3456-7890',
      email: 'info@pijatjogja.com',
      alamat: 'Yogyakarta, Indonesia',
      instagram_url: 'https://instagram.com/pijatjogja',
      copyright_text: 'PijatJogja.com - All rights reserved',
      copyright_subtext: 'Layanan Pijat Panggilan Profesional Area Yogyakarta',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }];
    localStorage.setItem(DB_PREFIX + 'footer_settings', JSON.stringify(defaultFooter));
  }

  // Pricing packages table
  if (!localStorage.getItem(DB_PREFIX + 'pricing_packages')) {
    const defaultPackages = [
      {
        id: '1',
        name: 'Pijat Relaxation',
        price: '150.000',
        duration: '60 menit',
        features: ['Pijat Seluruh Tubuh', 'Aromaterapi', 'Minyak Biji Bunga Matahari'],
        popular: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Pijat Sport',
        price: '200.000',
        duration: '90 menit',
        features: ['Pijat Deep Tissue', 'Relaksasi Otot', 'Minyak Esensial'],
        popular: false,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Pijat Premium',
        price: '350.000',
        duration: '120 menit',
        features: ['Pijat Full Body', 'Scrub Kopi', 'Lulur Tradisional', 'Facial'],
        popular: false,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(DB_PREFIX + 'pricing_packages', JSON.stringify(defaultPackages));
  }

  // User roles table
  if (!localStorage.getItem(DB_PREFIX + 'user_roles')) {
    // Default admin user - password: admin123
    const defaultUsers = [
      { id: '1', user_id: 'admin-001', email: 'admin@pijatjogja.com', role: 'admin', password_hash: 'admin123' }
    ];
    localStorage.setItem(DB_PREFIX + 'user_roles', JSON.stringify(defaultUsers));
  }
};

// Initialize on load
initializeDefaultData();

// Database class mimicking Supabase
class Database {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getKey(): string {
    return DB_PREFIX + this.tableName;
  }

  private getAll(): any[] {
    const data = localStorage.getItem(this.getKey());
    return data ? JSON.parse(data) : [];
  }

  private saveAll(data: any[]): void {
    localStorage.setItem(this.getKey(), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // SELECT
  async select(query?: { 
    eq?: (column: string, value: any) => any;
    neq?: (column: string, value: any) => any;
    order?: (column: string, options?: { ascending?: boolean }) => any;
    limit?: number;
  }): Promise<{ data: any[]; error: null }> {
    try {
      let data = this.getAll();
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error: null };
    }
  }

  // SELECT with chainable methods
  eq(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'eq', column, value);
  }

  neq(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'neq', column, value);
  }

  gt(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'gt', column, value);
  }

  gte(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'gte', column, value);
  }

  lt(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'lt', column, value);
  }

  lte(column: string, value: any) {
    return new FilterBuilder(this.tableName, 'lte', column, value);
  }

  // INSERT
  async insert(records: any[]): Promise<{ data: any[]; error: { message: string } | null }> {
    try {
      const data = this.getAll();
      const newRecords = records.map(record => ({
        ...record,
        id: record.id || this.generateId(),
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString()
      }));
      
      data.push(...newRecords);
      this.saveAll(data);
      
      return { data: newRecords, error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message } };
    }
  }

  // UPDATE - Update by ID
  async updateById(id: string, updates: any): Promise<{ data: any[]; error: { message: string } | null }> {
    try {
      const data = this.getAll();
      const index = data.findIndex((item: any) => item.id === id);
      
      if (index === -1) {
        return { data: [], error: { message: 'Record not found' } };
      }
      
      data[index] = {
        ...data[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      this.saveAll(data);
      
      return { data: [data[index]], error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message } };
    }
  }

  // UPDATE
  async update(updates: any): Promise<{ data: any[]; error: { message: string } | null }> {
    try {
      const data = this.getAll();
      const updatedData = data.map(item => ({
        ...item,
        ...updates,
        updated_at: new Date().toISOString()
      }));
      
      this.saveAll(updatedData);
      
      return { data: [updates], error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message } };
    }
  }

  // DELETE
  async delete(): Promise<{ data: null; error: { message: string } | null }> {
    try {
      this.saveAll([]);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }
}

// Filter Builder for chainable queries
class FilterBuilder {
  private tableName: string;
  private filterType: string;
  private column: string;
  private value: any;

  constructor(tableName: string, filterType: string, column: string, value: any) {
    this.tableName = tableName;
    this.filterType = filterType;
    this.column = column;
    this.value = value;
  }

  private getKey(): string {
    return DB_PREFIX + this.tableName;
  }

  private getAll(): any[] {
    const data = localStorage.getItem(this.getKey());
    return data ? JSON.parse(data) : [];
  }

  private saveAll(data: any[]): void {
    localStorage.setItem(this.getKey(), JSON.stringify(data));
  }

  async single(): Promise<{ data: any; error: { message: string; code?: string } | null }> {
    try {
      let data = this.getAll();
      
      // Apply filter
      data = data.filter(item => {
        switch (this.filterType) {
          case 'eq': return item[this.column] === this.value;
          case 'neq': return item[this.column] !== this.value;
          case 'gt': return item[this.column] > this.value;
          case 'gte': return item[this.column] >= this.value;
          case 'lt': return item[this.column] < this.value;
          case 'lte': return item[this.column] <= this.value;
          default: return true;
        }
      });

      if (data.length === 0) {
        return { data: null, error: { message: 'No data found', code: 'PGRST116' } };
      }

      return { data: data[0], error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // UPDATE with filter - supports .eq().update()
  async update(updates: any): Promise<{ data: any[]; error: { message: string } | null }> {
    try {
      const data = this.getAll();
      
      // Apply filter and update
      const updatedData = data.map(item => {
        let shouldUpdate = false;
        switch (this.filterType) {
          case 'eq': shouldUpdate = item[this.column] === this.value; break;
          case 'neq': shouldUpdate = item[this.column] !== this.value; break;
          case 'gt': shouldUpdate = item[this.column] > this.value; break;
          case 'gte': shouldUpdate = item[this.column] >= this.value; break;
          case 'lt': shouldUpdate = item[this.column] < this.value; break;
          case 'lte': shouldUpdate = item[this.column] <= this.value; break;
          default: shouldUpdate = true;
        }
        
        if (shouldUpdate) {
          return {
            ...item,
            ...updates,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });
      
      this.saveAll(updatedData);
      
      // Return the updated records
      const filteredData = updatedData.filter(item => {
        switch (this.filterType) {
          case 'eq': return item[this.column] === this.value;
          case 'neq': return item[this.column] !== this.value;
          case 'gt': return item[this.column] > this.value;
          case 'gte': return item[this.column] >= this.value;
          case 'lt': return item[this.column] < this.value;
          case 'lte': return item[this.column] <= this.value;
          default: return true;
        }
      });
      
      return { data: filteredData, error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message } };
    }
  }

  // DELETE with filter
  async delete(): Promise<{ data: null; error: { message: string } | null }> {
    try {
      const data = this.getAll();
      
      // Filter out matching items
      const filteredData = data.filter(item => {
        switch (this.filterType) {
          case 'eq': return item[this.column] !== this.value;
          case 'neq': return item[this.column] === this.value;
          case 'gt': return item[this.column] <= this.value;
          case 'gte': return item[this.column] < this.value;
          case 'lt': return item[this.column] >= this.value;
          case 'lte': return item[this.column] > this.value;
          default: return true;
        }
      });
      
      this.saveAll(filteredData);
      
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async then(resultFn: (value: { data: any; error: null }) => void, errorFn?: (error: any) => void): Promise<any> {
    try {
      let data = this.getAll();
      
      // Apply filter
      data = data.filter(item => {
        switch (this.filterType) {
          case 'eq': return item[this.column] === this.value;
          case 'neq': return item[this.column] !== this.value;
          case 'gt': return item[this.column] > this.value;
          case 'gte': return item[this.column] >= this.value;
          case 'lt': return item[this.column] < this.value;
          case 'lte': return item[this.column] <= this.value;
          default: return true;
        }
      });

      return resultFn({ data, error: null });
    } catch (error: any) {
      if (errorFn) errorFn(error);
      return { data: [], error: { message: error.message } };
    }
  }
}

// Main database interface
const db = {
  from: (tableName: string) => new Database(tableName)
};

export default db;

// Auth service using localStorage
export const auth = {
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    try {
      const users = JSON.parse(localStorage.getItem(DB_PREFIX + 'user_roles') || '[]');
      const user = users.find((u: any) => 
        u.email === credentials.email && u.password_hash === credentials.password
      );

      if (!user) {
        return { data: { user: null }, error: { message: 'Invalid credentials' } };
      }

      return {
        data: {
          user: {
            id: user.user_id,
            email: user.email,
          }
        },
        error: null
      };
    } catch (error: any) {
      return { data: { user: null }, error: { message: error.message } };
    }
  },

  signOut: async () => {
    return { error: null };
  },

  getUser: async () => {
    // Check if user is stored in session
    const session = localStorage.getItem('pijatjogja_session');
    if (session) {
      const user = JSON.parse(session);
      return { data: { user }, error: null };
    }
    return { data: { user: null }, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Simple implementation - in real app, would use storage events
    const checkSession = () => {
      const session = localStorage.getItem('pijatjogja_session');
      if (session) {
        callback('SIGNED_IN', JSON.parse(session));
      } else {
        callback('SIGNED_OUT', null);
      }
    };
    
    // Check immediately
    checkSession();
    
    // Return unsubscribe function
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

// Helper to set session
export const setSession = (user: any) => {
  localStorage.setItem('pijatjogja_session', JSON.stringify(user));
};

// Helper to clear session
export const clearSession = () => {
  localStorage.removeItem('pijatjogja_session');
};
