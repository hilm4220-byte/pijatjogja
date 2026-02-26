// cronjob.js
// Cronjob untuk keep-alive database dan fetch data berkala (Supabase Edition)

require('dotenv').config();
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Inisialisasi Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN_KEY;

if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY) {
  console.error('❌ SUPABASE_URL dan SUPABASE_ADMIN_KEY harus ada di .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

// Konfigurasi
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pijatjogja.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Helper: Log ke Supabase
 */
async function logToCron(taskName, status, message) {
  try {
    const { error } = await supabase
      .from('cron_logs')
      .insert([
        {
          task_name: taskName,
          status: status,
          message: message,
          logged_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error logging to Supabase:', error.message);
    }
  } catch (err) {
    console.error('Error logging to cron_logs:', err.message);
  }
}

function scheduleAdminLogin() {
  console.log('📅 Scheduling admin login cronjob (every 4 days at 00:00)...');
  
  cron.schedule('0 0 */4 * *', async function() {
    console.log('🔐 [CRON] Starting Keep-Alive Login at ' + new Date().toISOString());
    
    try {
      const response = await axios.post(API_BASE_URL + '/auth/login', {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }, { 
        timeout: 10000 
      });

      if (response.data && response.data.user) {
        console.log('✅ [CRON] Keep-Alive Login Successful:', response.data.user.email);
        logToCron('admin_keep_alive', 'success', 'Login as ' + response.data.user.email);
      } else {
        throw new Error('Login failed - no user data');
      }
    } catch (error) {
      console.error('❌ [CRON] Keep-Alive Login Failed:', error.message);
      logToCron('admin_keep_alive', 'failed', error.message);
    }
  });
}

/**
 * Task 2: Fetch data berkala setiap 1 jam
 * Cron pattern: '0 * * * *' = Setiap jam pada menit 0
 */
function scheduleFetchData() {
  console.log('📅 Scheduling fetch data cronjob (every 1 hour)...');
  
  cron.schedule('0 * * * *', async function() {
    console.log('📡 [CRON] Fetching data at ' + new Date().toISOString());
    
    try {
      const pricingResponse = await axios.get(API_BASE_URL + '/pricing', { 
        timeout: 10000 
      });
      
      const settingsResponse = await axios.get(API_BASE_URL + '/settings', { 
        timeout: 10000 
      });
      
      const footerResponse = await axios.get(API_BASE_URL + '/footer', { 
        timeout: 10000 
      });

      console.log('✅ [CRON] Data Fetch Successful');
      var pricingCount = Array.isArray(pricingResponse.data) ? pricingResponse.data.length : 0;
      var settingsCount = settingsResponse.data ? Object.keys(settingsResponse.data).length : 0;
      console.log('   - Pricing packages: ' + pricingCount + ' items');
      console.log('   - Settings: ' + settingsCount + ' items');
      
      logToCron('fetch_data', 'success', 'Fetched ' + pricingCount + ' pricing items');
    } catch (error) {
      console.error('❌ [CRON] Fetch Data Failed:', error.message);
      logToCron('fetch_data', 'failed', error.message);
    }
  });
}

/**
 * Task 3: Cleanup old logs setiap 30 hari
 * Cron pattern: '0 0 1 * *' = Setiap tanggal 1 bulan pada jam 00:00
 */
function scheduleCleanupLogs() {
  console.log('📅 Scheduling cleanup logs cronjob (every month)...');
  
  cron.schedule('0 0 1 * *', async function() {
    console.log('🧹 [CRON] Cleaning up old logs at ' + new Date().toISOString());
    
    try {
      var result = db.prepare("DELETE FROM cron_logs WHERE logged_at < datetime('now', '-30 days')")
        .run();
      
      console.log('✅ [CRON] Cleanup Successful - ' + result.changes + ' old logs deleted');
      logToCron('cleanup_logs', 'success', 'Deleted ' + result.changes + ' old logs');
    } catch (error) {
      console.error('❌ [CRON] Cleanup Failed:', error.message);
      logToCron('cleanup_logs', 'failed', error.message);
    }
  });
}

/**
 * Initialize all cronjobs
 */
async function initializeCronjobs() {
  try {
    // Pastikan tabel cron_logs ada
    console.log('🔍 Checking Supabase connection...');
    const { data, error } = await supabase
      .from('cron_logs')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      console.error('   Pastikan tabel "cron_logs" ada di Supabase');
      process.exit(1);
    }
    
    console.log('✅ Supabase connected successfully');
    console.log('🚀 Initializing Cronjobs...\n');
    
    scheduleAdminLogin();
    scheduleFetchData();
    scheduleCleanupLogs();
    
    console.log('\n✅ All cronjobs initialized successfully!\n');
  } catch (error) {
    console.error('❌ Error initializing cronjobs:', error.message);
    process.exit(1);
  }
}

module.exports = { initializeCronjobs };
