// test-cronjob.js
// Testing script untuk cronjob tasks
// Jalankan dengan: node test-cronjob.js [all|login|fetch|logs|help]

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Inisialisasi Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN_KEY;

if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY) {
  console.error('❌ Error: SUPABASE_URL dan SUPABASE_ADMIN_KEY harus ada di .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

// Konfigurasi
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pijatjogja.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

console.log('🧪 CRONJOB TEST SUITE (Supabase Edition)\n');
console.log('Configuration:');
console.log('  API_BASE_URL:', API_BASE_URL);
console.log('  ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('  Supabase Project:', SUPABASE_URL);
console.log('\n' + '='.repeat(60) + '\n');

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

/**
 * TEST 1: Admin Login
 */
async function testAdminLogin() {
  console.log('📋 TEST 1: Admin Keep-Alive Login');
  console.log('-'.repeat(60));
  
  try {
    console.log('Attempting login to:', API_BASE_URL + '/auth/login');
    
    const response = await axios.post(API_BASE_URL + '/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    }, { 
      timeout: 10000 
    });

    if (response.data && response.data.user) {
      console.log('✅ LOGIN SUCCESS');
      console.log('  User:', response.data.user.email);
      console.log('  Role:', response.data.user.role);
      
      logToCron('admin_keep_alive', 'success', 'Test login as ' + response.data.user.email);
      console.log('✅ Logged to database\n');
      return true;
    } else {
      throw new Error('No user data in response');
    }
  } catch (error) {
    console.error('❌ LOGIN FAILED');
    console.error('  Error:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    }
    
    logToCron('admin_keep_alive', 'failed', 'Test login error: ' + error.message);
    console.log('❌ Error logged to database\n');
    return false;
  }
}

/**
 * TEST 2: Fetch Data
 */
async function testFetchData() {
  console.log('📋 TEST 2: Fetch Data');
  console.log('-'.repeat(60));
  
  try {
    console.log('Fetching from:', API_BASE_URL);
    
    const pricingResponse = await axios.get(API_BASE_URL + '/pricing', { 
      timeout: 10000 
    });
    console.log('✅ Pricing fetched:', pricingResponse.data.length || 0, 'items');
    
    const settingsResponse = await axios.get(API_BASE_URL + '/settings', { 
      timeout: 10000 
    });
    console.log('✅ Settings fetched:', Object.keys(settingsResponse.data || {}).length, 'items');
    
    const footerResponse = await axios.get(API_BASE_URL + '/footer', { 
      timeout: 10000 
    });
    console.log('✅ Footer settings fetched:', footerResponse.data ? 'success' : 'empty');
    
    var pricingCount = Array.isArray(pricingResponse.data) ? pricingResponse.data.length : 0;
    logToCron('fetch_data', 'success', 'Test: Fetched ' + pricingCount + ' pricing items');
    console.log('✅ Logged to database\n');
    return true;
  } catch (error) {
    console.error('❌ FETCH DATA FAILED');
    console.error('  Error:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
    }
    
    logToCron('fetch_data', 'failed', 'Test fetch error: ' + error.message);
    console.log('❌ Error logged to database\n');
    return false;
  }
}

/**
 * TEST 3: Supabase Connection
 */
async function testSupabaseConnection() {
  console.log('📋 TEST 3: Supabase Connection');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await supabase
      .from('cron_logs')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ SUPABASE CONNECTION FAILED');
      console.error('  Error:', error.message);
      console.log();
      return false;
    }
    
    console.log('✅ SUPABASE CONNECTED');
    console.log('  Cron logs count:', data || 0);
    
    // Show last 5 logs
    const { data: logs, error: logsError } = await supabase
      .from('cron_logs')
      .select('*')
      .order('logged_at', { ascending: false })
      .limit(5);
    
    if (!logsError && logs && logs.length > 0) {
      console.log('\n  Last 5 logs:');
      logs.forEach((log, index) => {
        const status = log.status === 'success' ? '✅' : '❌';
        console.log('    ' + (index + 1) + '. ' + status + ' ' + log.task_name + ' - ' + log.message);
      });
    }
    console.log();
    return true;
  } catch (error) {
    console.error('❌ SUPABASE CONNECTION FAILED');
    console.error('  Error:', error.message);
    console.log();
    return false;
  }
}

/**
 * TEST 4: Server Connectivity
 */
async function testServerConnectivity() {
  console.log('📋 TEST 4: Server Connectivity');
  console.log('-'.repeat(60));
  
  try {
    const response = await axios.get(API_BASE_URL + '/pricing', { 
      timeout: 5000 
    });
    console.log('✅ SERVER RESPONSIVE');
    console.log('  Status:', response.status);
    console.log('  Response time:', 'OK');
    console.log();
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ SERVER NOT RUNNING');
      console.error('  Make sure server is running: node server.js');
    } else {
      console.error('❌ SERVER CONNECTION FAILED');
      console.error('  Error:', error.message);
    }
    console.log();
    return false;
  }
}

/**
 * VIEW LOGS
 */
async function viewCronLogs() {
  console.log('📋 VIEW ALL CRONJOB LOGS');
  console.log('-'.repeat(60));
  
  try {
    const { data: logs, error } = await supabase
      .from('cron_logs')
      .select('*')
      .order('logged_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error reading logs:', error.message);
      return;
    }
    
    if (!logs || logs.length === 0) {
      console.log('No logs found\n');
      return;
    }
    
    console.log('Total logs: ' + logs.length + '\n');
    logs.forEach((log, index) => {
      const status = log.status === 'success' ? '✅' : '❌';
      const time = new Date(log.logged_at).toLocaleString('id-ID');
      console.log((index + 1) + '. ' + status + ' [' + log.task_name + '] ' + time);
      console.log('   Message: ' + log.message);
    });
    console.log();
  } catch (error) {
    console.error('Error reading logs:', error.message);
  }
}

/**
 * CLEANUP TEST DATA
 */
async function cleanupTestData() {
  console.log('📋 CLEANUP TEST DATA');
  console.log('-'.repeat(60));
  
  try {
    const { error } = await supabase
      .from('cron_logs')
      .delete()
      .ilike('message', '%Test%');
    
    if (error) {
      console.error('Error cleaning up:', error.message);
      return;
    }
    
    console.log('✅ Cleaned up test records\n');
  } catch (error) {
    console.error('Error cleaning up:', error.message);
  }
}

/**
 * MAIN TEST RUNNER
 */
async function runAllTests() {
  // Get command line argument
  const args = process.argv.slice(2);
  const testMode = args[0] || 'all';

  if (testMode === 'help' || testMode === '--help' || testMode === '-h') {
    console.log('Usage: node test-cronjob.js [command]\n');
    console.log('Commands:');
    console.log('  all          - Run all tests (default)');
    console.log('  login        - Test admin login only');
    console.log('  fetch        - Test fetch data only');
    console.log('  supabase     - Test Supabase connection only');
    console.log('  server       - Test server connectivity only');
    console.log('  logs         - View all cronjob logs');
    console.log('  cleanup      - Cleanup test data');
    console.log('  help         - Show this help message\n');
    return;
  }

  if (testMode === 'logs') {
    await viewCronLogs();
    return;
  }

  if (testMode === 'cleanup') {
    await cleanupTestData();
    return;
  }

  // Run tests based on mode
  const results = {
    server: false,
    supabase: false,
    login: false,
    fetch: false
  };

  // Always test server and supabase first
  results.server = await testServerConnectivity();
  results.supabase = await testSupabaseConnection();

  if (!results.server) {
    console.log('\n⚠️  Server is not running. Cannot continue with other tests.');
    console.log('Please start the server with: npm start\n');
    return;
  }

  if (!results.supabase) {
    console.log('\n⚠️  Supabase connection failed. Check your .env file!');
    console.log('Make sure SUPABASE_URL and SUPABASE_ADMIN_KEY are correct.\n');
    return;
  }

  // Run specific tests or all
  if (testMode === 'all' || testMode === 'login') {
    results.login = await testAdminLogin();
  }

  if (testMode === 'all' || testMode === 'fetch') {
    results.fetch = await testFetchData();
  }

  if (testMode === 'supabase') {
    // Already tested above
    return;
  }

  if (testMode === 'server') {
    // Already tested above
    return;
  }

  // Summary
  if (testMode === 'all') {
    console.log('='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('  Server Connectivity:', results.server ? '✅ PASS' : '❌ FAIL');
    console.log('  Supabase Connection:', results.supabase ? '✅ PASS' : '❌ FAIL');
    console.log('  Admin Login:', results.login ? '✅ PASS' : '❌ FAIL');
    console.log('  Fetch Data:', results.fetch ? '✅ PASS' : '❌ FAIL');
    console.log('='.repeat(60));
    console.log();
    
    if (results.server && results.supabase && results.login && results.fetch) {
      console.log('🎉 SEMUA TEST PASSED! Cronjob siap diproduksi dengan Supabase.\n');
    } else {
      console.log('⚠️  Beberapa test gagal. Periksa error di atas.\n');
    }
  }
}

// Run tests
runAllTests();
