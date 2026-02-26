# 🚀 Supabase Setup Guide untuk Cronjob

## 📋 Langkah-Langkah Setup

### 1️⃣ Create cron_logs Table di Supabase

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project: **szftlqjboiifgzrgoqla**
3. Buka **SQL Editor** → **New Query**
4. Copy seluruh content dari file `supabase-migration.sql`
5. Paste di SQL Editor dan **Run**

**SQL yang akan dijalankan:**
- CREATE TABLE `cron_logs`
- CREATE INDEX untuk task_name, logged_at, status
- ENABLE Row Level Security (RLS)
- CREATE POLICY untuk service_role

---

### 2️⃣ Verify .env File

Cek `C:\xampp\htdocs\pijatjogja.com\.env` sudah punya nilai:

```env
SUPABASE_URL=https://szftlqjboiifgzrgoqla.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_ADMIN_KEY=eyJhbGc...
ADMIN_EMAIL=admin@pijatjogja.com
ADMIN_PASSWORD=admin123
PORT=3001
API_BASE_URL=http://localhost:3001/api
```

✅ Pastikan semua values betul, terutama **ADMIN_KEY**!

---

### 3️⃣ Test Supabase Connection

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Test cronjob
npm test
```

**Expected Output:**
```
🧪 CRONJOB TEST SUITE (Supabase Edition)

Configuration:
  API_BASE_URL: http://localhost:3001/api
  ADMIN_EMAIL: admin@pijatjogja.com
  Supabase Project: https://szftlqjboiifgzrgoqla.supabase.co

============================================================

📋 TEST 4: Server Connectivity
✅ SERVER RESPONSIVE

📋 TEST 3: Supabase Connection
✅ SUPABASE CONNECTED
  Cron logs count: 0

📋 TEST 1: Admin Keep-Alive Login
✅ LOGIN SUCCESS

📋 TEST 2: Fetch Data
✅ Pricing fetched: X items
✅ Settings fetched: X items
✅ Footer settings fetched: success

============================================================
📊 TEST SUMMARY
===================== ===========================================
  Server Connectivity: ✅ PASS
  Supabase Connection: ✅ PASS
  Admin Login: ✅ PASS
  Fetch Data: ✅ PASS

🎉 SEMUA TEST PASSED! Cronjob siap diproduksi dengan Supabase.
```

---

## 📊 Monitoring Logs

### Via Supabase Dashboard
1. Buka Supabase Dashboard
2. Buka **Table Editor**
3. Pilih table **cron_logs**
4. Lihat real-time logs dari cronjob

### Via Terminal
```bash
# Lihat semua logs
npm run test:logs

# View specific logs 
select * from cron_logs where task_name = 'admin_keep_alive' order by logged_at desc;
```

---

## 🔍 Troubleshooting

### Error: "SUPABASE_URL dan SUPABASE_ADMIN_KEY harus ada"
```
❌ Error: SUPABASE_URL dan SUPABASE_ADMIN_KEY harus ada di .env
```

**Solusi:**
- Cek .env file di `C:\xampp\htdocs\pijatjogja.com\.env`
- Pastikan SUPABASE_URL dan SUPABASE_ADMIN_KEY tidak kosong
- Jangan pakai VITE_ prefix (itu untuk frontend)

### Error: "Supabase connection failed"
```
❌ SUPABASE CONNECTION FAILED
  Error: 42P01: relation "public.cron_logs" does not exist
```

**Solusi:**
- Table `cron_logs` belum ada di Supabase
- Run SQL migration dari `supabase-migration.sql`

### Error: "Row Level Security violation"
```
❌ Error: new row violates row level security policy
```

**Solusi:**
- Policy mungkin tidak ter-setup dengan benar
- Run migration SQL lagi atau check RLS policy di Supabase

---

## 📝 Cronjob Tasks

### 1. Admin Keep-Alive Login (Setiap 4 Hari)
- **Jadwal**: `0 0 */4 * *` (00:00 setiap 4 hari)
- **Fungsi**: Login admin untuk keep database active
- **Log Level**: INFO / ERROR

### 2. Fetch Data (Setiap 1 Jam)
- **Jadwal**: `0 * * * *` (00:00 setiap jam)
- **Fetch**:
  - `/api/pricing`
  - `/api/settings`
  - `/api/footer`
- **Log Level**: INFO / ERROR

### 3. Cleanup Logs (Setiap 1 Bulan)
- **Jadwal**: `0 0 1 * *` (00:00 tanggal 1)
- **Fungsi**: Hapus logs lebih dari 30 hari
- **Log Level**: INFO / ERROR

---

## 🔐 Security Notes

### Admin Key (.env)
- ⚠️ **CONFIDENTIAL!** Jangan share public
- ⚠️ Jangan commit ke git
- ✅ Simpan di `.env` (sudah ada di .gitignore)
- ✅ Rotate key secara berkala

### Credentials
- Admin email/password untuk keep-alive login
- Pastikan benar sebelum produksi

---

## 📱 Quick Commands

```bash
# Setup
npm install
npm start              # Terminal 1

# Testing
npm test               # All tests
npm run test:supabase  # Supabase only
npm run test:logs      # View logs
npm run test:cleanup   # Clean test data

# Monitoring
npm run test:logs      # View latest logs
```

---

## ✅ Deployment Checklist

Sebelum produktif:

- [ ] SQL migration sudah dijalankan
- [ ] .env file sudah di-configure dengan benar
- [ ] `npm test` menunjukkan all PASS
- [ ] Supabase logs terlihat normal
- [ ] Admin credentials sudah diverify
- [ ] Set timezone server dengan benar
- [ ] Backup database sebelum production

---

## 🎯 Hasil Akhir

Setup Supabase cronjob sudah selesai! Cronjob akan:

✅ Login admin setiap 4 hari  
✅ Fetch data setiap jam  
✅ Cleanup logs setiap bulan  
✅ Semua terintegrasi dengan Supabase  
✅ Real-time monitoring di dashboard  

**Happy cronjobbing!** 🚀
