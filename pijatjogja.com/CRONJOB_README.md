# 📅 Cronjob System Documentation

## Overview
Sistem cronjob kami dirancang untuk:
1. **Keep-Alive Login** - Login admin setiap 4 hari untuk menjaga database tetap aktif
2. **Fetch Data** - Mengambil data berkala setiap 1 jam
3. **Cleanup Logs** - Membersihkan log lama setiap bulan

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

Ini akan menginstall `node-cron` dan `axios` yang diperlukan untuk cronjob.

### 2. Setup Environment Variables
Copy file `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env` dengan kredensial admin Anda:
```bash
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-admin-password
PORT=3001
```

### 3. Mulai Server
```bash
node server.js
```

Anda akan melihat output
:<br>
```
✅ Server running on http://localhost:3001
   Database: pijatjogja.db

🚀 Initializing Cronjobs...

📅 Scheduling admin login cronjob (every 4 days at 00:00)...
📅 Scheduling fetch data cronjob (every 1 hour)...
📅 Scheduling cleanup logs cronjob (every month)...

✅ All cronjobs initialized successfully!
```

---

## 📋 Cronjob Tasks

### Task 1: Keep-Alive Login (Setiap 4 Hari)
- **Jadwal:** `0 0 */4 * *` (Setiap 4 hari pada jam 00:00)
- **Fungsi:** Melakukan login admin untuk menjaga koneksi database tetap aktif
- **Logs:** Dicatat di tabel `cron_logs` dengan task_name `admin_keep_alive`

```sql
-- Cek log keep-alive login
SELECT * FROM cron_logs WHERE task_name = 'admin_keep_alive' ORDER BY logged_at DESC;
```

### Task 2: Fetch Data (Setiap 1 Jam)
- **Jadwal:** `0 * * * *` (Setiap jam pada menit 00)
- **Fungsi:** Mengambil data dari API:
  - Pricing packages
  - Settings
  - Footer settings
- **Logs:** Dicatat di tabel `cron_logs` dengan task_name `fetch_data`

```sql
-- Cek log fetch data
SELECT * FROM cron_logs WHERE task_name = 'fetch_data' ORDER BY logged_at DESC;
```

### Task 3: Cleanup Logs (Setiap Bulan)
- **Jadwal:** `0 0 1 * *` (Tanggal 1 setiap bulan pada jam 00:00)
- **Fungsi:** Menghapus log yang lebih dari 30 hari
- **Logs:** Dicatat di tabel `cron_logs` dengan task_name `cleanup_logs`

```sql
-- Cek log cleanup
SELECT * FROM cron_logs WHERE task_name = 'cleanup_logs' ORDER BY logged_at DESC;
```

---

## 🔧 Customize Jadwal Cronjob

Edit file `cronjob.js` untuk mengubah jadwal. Gunakan cron patterns:

| Field | Allowed Values | Contoh |
|-------|---|---|
| Minute | 0-59 | `0` (menit 00) |
| Hour | 0-23 | `0` (jam 00:00) |
| Day of Month | 1-31 | `*/4` (setiap 4 hari), `1` (tanggal 1) |
| Month | 1-12 | `*` (setiap bulan) |
| Day of Week | 0-6 | `*` (setiap hari) |

### Contoh Pattern Lain:

```javascript
// Setiap hari pada jam 3 pagi
cron.schedule('0 3 * * *', async () => { ... });

// Setiap Senin pada jam 9 pagi
cron.schedule('0 9 * * 1', async () => { ... });

// Setiap 30 menit
cron.schedule('*/30 * * * *', async () => { ... });

// Setiap hari pada jam 12 siang dan 6 malam
cron.schedule('0 12,18 * * *', async () => { ... });
```

---

## 📊 Monitoring Cronjobs

### 1. Lihat Console Log
ServerOkay akan menampilkan logs real-time ketika cronjob berjalan:

```
🔐 [CRON] Starting Keep-Alive Login at 2026-02-26T00:00:00.000Z
✅ [CRON] Keep-Alive Login Successful: admin@pijatjogja.com
```

### 2. Query Database Logs
```sql
-- Lihat semua cronjob logs
SELECT * FROM cron_logs ORDER BY logged_at DESC LIMIT 20;

-- Lihat logs error
SELECT * FROM cron_logs WHERE status = 'failed' ORDER BY logged_at DESC;

-- Lihat statistik per task
SELECT task_name, status, COUNT(*) as count 
FROM cron_logs 
GROUP BY task_name, status;
```

### 3. Create Dashboard (Optional)
Tambahkan endpoint API untuk monitoring:

```javascript
// Di server.js
app.get('/api/cron-logs', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM cron_logs 
      ORDER BY logged_at DESC 
      LIMIT 100
    `).all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## ⚠️ Troubleshooting

### Cronjob tidak jalan?
1. **Pastikan server berjalan:** 
   ```bash
   node server.js
   ```

2. **Cek timezone:** Node-cron menggunakan timezone server Anda
   ```bash
   # Windows
   wmic os get timezone
   
   # Linux/Mac
   date
   ```

3. **Cek kredensial admin:** Pastikan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` benar

### Database error "SQLITE_BUSY"?
Database terlocked. Solusi:
- Tutup semua koneksi database lain
- Restart server
- Check file `pijatjogja.db` apakah ada access conflict

### Login error di cronjob?
1. Pastikan endpoint `/api/auth/login` accessible
2. Cek network connectivity
3. Lihat logs di `cron_logs` untuk error detail

---

## 📝 API Endpoints yang Dipanggil

Cronjob menggunakan endpoint ini:

```
POST /api/auth/login
GET /api/pricing
GET /api/settings
GET /api/footer-settings
```

Pastikan semua endpoint:
- Response cepat (timeout max 10 detik)
- Tidak memerlukan authentication (atau gunakan token di cronjob)
- Error handling yang baik

---

## 🔒 Security Notes

1. **Jangan hardcode kredensial!** Gunakan environment variables
2. **Protect `.env` file** - jangan commit ke git
3. **Gunakan strong password** untuk admin account
4. **Monitor cron_logs** untuk aktivitas mencurigakan
5. **Rotate password** secara berkala

---

## 📚 Referensi

- [Node-Cron Documentation](https://github.com/kelektiv/node-cron)
- [Cron Expression Generator](https://crontab.guru/)
- [Better-SQLite3 Docs](https://github.com/WiseLibs/better-sqlite3/wiki)

---

## 📧 Contoh Pengembangan Lebih Lanjut

### Tambah Email Notification
```javascript
const nodemailer = require('nodemailer');

const sendEmail = async (subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject,
    text: message
  });
};
```

### Tambah Database Backup
```javascript
const fs = require('fs');

cron.schedule('0 2 * * 0', () => {
  // Backup setiap Minggu jam 2 pagi
  const backupPath = `backups/pijatjogja_${Date.now()}.db`;
  fs.copyFileSync('pijatjogja.db', backupPath);
});
```

---

**Happy scheduling! 🎉**
