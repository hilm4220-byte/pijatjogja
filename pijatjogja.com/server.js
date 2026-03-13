// server.js
// Express + SQLite Server untuk PijatJogja

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const { initializeCronjobs } = require('./cronjob');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route - TEST ONLY
app.get('/test', (req, res) => {
  res.json({ status: 'Server is working!' });
});

console.log('Routes registered. Waiting for database...');

// Inisialisasi Database SQLite
const db = new Database('pijatjogja.db');

// Buat tabel-tabel
db.exec(`
  -- Settings table
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Footer settings table
  CREATE TABLE IF NOT EXISTS footer_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT,
    site_description TEXT,
    wa_number TEXT,
    wa_message TEXT,
    phone_display TEXT,
    email TEXT,
    alamat TEXT,
    instagram_url TEXT,
    copyright_text TEXT,
    copyright_subtext TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Pricing packages table
  CREATE TABLE IF NOT EXISTS pricing_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT,
    duration TEXT,
    features TEXT,
    popular INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- User roles table
  CREATE TABLE IF NOT EXISTS user_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data default jika kosong
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (settingsCount.count === 0) {
  const insertSettings = db.prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)');
  insertSettings.run('site_name', 'Pijat Panggilan Jogja');
  insertSettings.run('wa_number', '6281234567890');
  insertSettings.run('auto_message', 'Halo, saya ingin memesan layanan pijat');
}

const footerCount = db.prepare('SELECT COUNT(*) as count FROM footer_settings').get();
if (footerCount.count === 0) {
  const insertFooter = db.prepare(`
    INSERT INTO footer_settings (site_name, site_description, wa_number, wa_message, phone_display, email, alamat, instagram_url, copyright_text, copyright_subtext)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertFooter.run(
    'Pijat Jogja',
    'Layanan pijat panggilan profesional area Yogyakarta. Terapis bersertifikat, layanan 24 jam, harga terjangkau.',
    '6281234567890',
    'Halo, saya ingin memesan layanan pijat panggilan.',
    '+62 812-3456-7890',
    'info@pijatjogja.com',
    'Yogyakarta, Indonesia',
    'https://instagram.com/pijatjogja',
    'PijatJogja.com - All rights reserved',
    'Layanan Pijat Panggilan Profesional Area Yogyakarta'
  );
}

const pricingCount = db.prepare('SELECT COUNT(*) as count FROM pricing_packages').get();
if (pricingCount.count === 0) {
  const insertPricing = db.prepare(`
    INSERT INTO pricing_packages (name, price, duration, features, popular, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertPricing.run('Pijat Relaxation', '150.000', '60 menit', JSON.stringify(['Pijat Seluruh Tubuh', 'Aromaterapi', 'Minyak Biji Bunga Matahari']), 1, 1);
  insertPricing.run('Pijat Sport', '200.000', '90 menit', JSON.stringify(['Pijat Deep Tissue', 'Relaksasi Otot', 'Minyak Esensial']), 0, 2);
  insertPricing.run('Pijat Premium', '350.000', '120 menit', JSON.stringify(['Pijat Full Body', 'Scrub Kopi', 'Lulur Tradisional', 'Facial']), 0, 3);
}

const userCount = db.prepare('SELECT COUNT(*) as count FROM user_roles').get();
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO user_roles (user_id, email, role, password_hash) VALUES (?, ?, ?, ?)');
  insertUser.run('admin-001', 'admin@pijatjogja.com', 'admin', 'admin123');
}

console.log('✅ Database SQLite initialized');

// ============ API ROUTES ============

// Settings
app.get('/api/settings', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM settings').all();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { setting_key, setting_value } = req.body;
    const stmt = db.prepare(`
      INSERT INTO settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(setting_key, setting_value, setting_value);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Footer Settings
app.get('/api/footer', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM footer_settings LIMIT 1').get();
    if (data && data.features) {
      data.features = JSON.parse(data.features);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/footer', (req, res) => {
  try {
    const fields = Object.keys(req.body).filter(k => k !== 'id' && k !== 'created_at');
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => {
      const val = req.body[f];
      return Array.isArray(val) ? JSON.stringify(val) : val;
    });
    
    const stmt = db.prepare(`UPDATE footer_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values, req.body.id || 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pricing Packages
app.get('/api/pricing', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM pricing_packages ORDER BY sort_order').all();
    data.forEach(p => {
      if (p.features) {
        try {
          p.features = JSON.parse(p.features);
        } catch (e) {
          p.features = [];
        }
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pricing/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, features, popular, sort_order } = req.body;
    
    // Get existing data first
    const existing = db.prepare('SELECT * FROM pricing_packages WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : (features || existing.features);
    
    const stmt = db.prepare(`
      UPDATE pricing_packages 
      SET name = ?, price = ?, duration = ?, features = ?, popular = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      name || existing.name, 
      price || existing.price, 
      duration || existing.duration, 
      featuresStr, 
      popular !== undefined ? (popular ? 1 : 0) : existing.popular, 
      sort_order || existing.sort_order, 
      id
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM user_roles WHERE email = ? AND password_hash = ?').get(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/user', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token' });
    }
    // Simplified - in production use JWT
    const userId = authHeader.replace('Bearer ', '');
    const user = db.prepare('SELECT * FROM user_roles WHERE user_id = ?').get(userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Users
app.get('/api/admins', (req, res) => {
  try {
    const data = db.prepare('SELECT id, user_id, email, role, created_at FROM user_roles').all();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admins', (req, res) => {
  try {
    const { email, password_hash, role } = req.body;
    const user_id = `admin-${Date.now()}`;
    
    const stmt = db.prepare('INSERT INTO user_roles (user_id, email, password_hash, role) VALUES (?, ?, ?, ?)');
    stmt.run(user_id, email, password_hash, role || 'admin');
    res.json({ success: true, id: user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admins/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM user_roles WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT} (all devices)`);
  console.log(`   IP Access: Find your IP with 'ipconfig' (Windows) or 'ifconfig'`);
  console.log(`   Database: pijatjogja.db`);
});

// Initialize cronjobs separately (don't block server startup)
initializeCronjobs().catch(error => {
  console.error('❌ Error during cronjob initialization:', error.message);
});
