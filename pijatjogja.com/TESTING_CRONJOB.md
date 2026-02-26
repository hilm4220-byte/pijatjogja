# 🧪 Testing Guide untuk Cronjob

## Cara Test Cronjob

Ada 3 cara untuk test cronjob Anda:

---

## 1️⃣ AUTOMATED TESTING (Recommended)

### Setup
```bash
# Pastikan sudah di folder root
cd c:\xampp\htdocs\pijatjogja.com

# Install dependencies jika belum
npm install
```

### Jalankan Test Suite

#### Test semua tasks
```bash
node test-cronjob.js all
```

Output contoh:
```
🧪 CRONJOB TEST SUITE

Configuration:
  API_BASE_URL: http://localhost:3001/api
  ADMIN_EMAIL: admin@pijatjogja.com

============================================================

📋 TEST 4: Server Connectivity
------------------------------------------------------------
✅ SERVER RESPONSIVE
  Status: 200
  Response time: OK

📋 TEST 3: Database Connection
------------------------------------------------------------
✅ DATABASE CONNECTED
  Cron logs count: 12

  Last 5 logs:
    1. [SUCCESS] admin_keep_alive - Login as admin@pijatjogja.com
    2. [SUCCESS] fetch_data - Fetched 5 pricing items
    ...

📋 TEST 1: Admin Keep-Alive Login
------------------------------------------------------------
✅ LOGIN SUCCESS
  User: admin@pijatjogja.com
  Role: admin
✅ Logged to database

📋 TEST 2: Fetch Data
------------------------------------------------------------
✅ Pricing fetched: 5 items
✅ Settings fetched: 10 items
✅ Footer settings fetched: success
✅ Logged to database
```

#### Test individual tasks
```bash
# Test login saja
node test-cronjob.js login

# Test fetch data saja
node test-cronjob.js fetch

# Test database connection
node test-cronjob.js db

# Test server connectivity
node test-cronjob.js server
```

#### View logs
```bash
# Lihat semua cronjob logs
node test-cronjob.js logs
```

Output:
```
📋 VIEW ALL CRONJOB LOGS
------------------------------------------------------------
Total logs: 25

1. ✅ [admin_keep_alive] 26/02/2026, 14:30:45
   Message: Login as admin@pijatjogja.com
2. ✅ [fetch_data] 26/02/2026, 14:30:22
   Message: Fetched 5 pricing items
3. ❌ [fetch_data] 26/02/2026, 09:15:18
   Message: timeout of 10000ms exceeded
```

#### Cleanup test data
```bash
# Hapus data yang digenerate saat testing
node test-cronjob.js cleanup
```

---

## 2️⃣ MANUAL TESTING (Untuk Development)

### Option A: Jalankan Cronjob Langsung
Edit `cronjob.js` sementara untuk test dengan interval lebih cepat:

```javascript
// SEBELUM:
cron.schedule('0 0 */4 * *', async function() {  // Setiap 4 hari

// UNTUK TESTING (setiap 1 menit):
cron.schedule('* * * * *', async function() {  // Setiap 1 menit
```

Kemudian jalankan server:
```bash
node server.js
```

Lihat console logs untuk aktivitas cronjob.

**JANGAN LUPA**: Kembalikan schedule ke normal setelah testing!

---

### Option B: Direct Database Query

Buka terminal SQL dan query:

```sql
-- Lihat semua cron logs
SELECT * FROM cron_logs ORDER BY logged_at DESC LIMIT 20;

-- Lihat logs per task
SELECT * FROM cron_logs WHERE task_name = 'admin_keep_alive' ORDER BY logged_at DESC;

-- Lihat error logs saja
SELECT * FROM cron_logs WHERE status = 'failed' ORDER BY logged_at DESC;

-- Lihat summary per task
SELECT task_name, status, COUNT(*) as count 
FROM cron_logs 
GROUP BY task_name, status 
ORDER BY task_name;
```

---

## 3️⃣ MONITORING REAL-TIME

### Gunakan PM2 (Production)

Install PM2:
```bash
npm install -g pm2
```

Start server dengan PM2:
```bash
pm2 start server.js --name "pijatjogja-api"
```

Monitor logs:
```bash
# Real-time logs
pm2 logs pijatjogja-api

# Status
pm2 status

# Delete process
pm2 delete pijatjogja-api
```

---

## 📋 Checklist Testing

Sebelum deploy ke production, pastikan:

- [ ] **Server Connectivity** - Server berjalan dan responsive
- [ ] **Database Connection** - Database accessible dan table created
- [ ] **Admin Login** - Login endpoint working dengan credentials yang benar
- [ ] **Fetch Data** - Semua API endpoints (/pricing, /settings, /footer-settings) responsive
- [ ] **Logging** - Logs tercatat dengan baik di database
- [ ] **Schedule Timing** - Cronjob akan trigger pada waktu yang benar

---

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Pastikan install dependencies
npm install
```

### Error: "Server not running"
```bash
# Start server terlebih dahulu
node server.js
```

### Error: "SQLITE_BUSY"
```bash
# Ada proses lain yang lock database
# Tunggu atau restart server
```

### Error: "Login failed - Invalid credentials"
```bash
# Check .env file
# Pastikan ADMIN_EMAIL dan ADMIN_PASSWORD benar
cat .env
```

### Cronjob tidak jalan
1. Cek apakah server running
2. Cek logs dengan: `node test-cronjob.js logs`
3. Cek console server untuk error messages
4. Pastikan timezone server sesuai

---

## 📊 Contoh Output Testing

### SUCCESS CASE
```
=========== ALL TESTS PASSED ============
✅ Server Connectivity - PASS
✅ Database Connection - PASS  
✅ Admin Login - PASS
✅ Fetch Data - PASS

🎉 SEMUA TEST PASSED! Cronjob siap diproduksi.
```

### FAIL CASE
```
=========== SOME TESTS FAILED ===========
✅ Server Connectivity - PASS
❌ Database Connection - FAIL (Table not found)
❌ Admin Login - FAIL (Unauthorized)
❌ Fetch Data - FAIL (Connection timeout)

⚠️ Beberapa test gagal. Periksa error di atas.
```

---

## 💡 Tips

1. **Selalu test sebelum deploy** - Gunakan `node test-cronjob.js all`
2. **Monitor logs secara regular** - Gunakan `node test-cronjob.js logs`
3. **Backup database** - Sebelum deploy ke production
4. **Set proper timezone** - Server timezone penting untuk cronjob timing
5. **Test credentials** - Pastikan admin login selalu bekerja

---

## 📞 Quick Commands Reference

```bash
# Setup
npm install
cp .env.example .env

# Testing
node test-cronjob.js all          # Test semua
node test-cronjob.js login        # Test login
node test-cronjob.js fetch        # Test fetch data
node test-cronjob.js logs         # Lihat logs
node test-cronjob.js cleanup      # Clean test data

# Production
node server.js                     # Jalankan server
pm2 start server.js --name "api"   # Jalankan dengan PM2

# Database
sqlite3 pijatjogja.db              # Akses database
```

---

**Happy testing! 🚀**
