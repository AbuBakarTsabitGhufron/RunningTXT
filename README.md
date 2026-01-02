# Running Text - Panduan Setup & Penggunaan

## 📋 Daftar Isi
1. [Setup VLC](#setup-vlc)
2. [Konfigurasi Project](#konfigurasi-project)
3. [Menjalankan Project](#menjalankan-project)
4. [Troubleshooting](#troubleshooting)

---

## 🎬 Setup VLC

Sebelum menjalankan project, VLC harus dikonfigurasi agar bisa berkomunikasi dengan aplikasi running text melalui HTTP interface.

### Langkah Setup VLC:

1. **Buka VLC** → Klik menu **Tools** → pilih **Preferences** (atau tekan `Ctrl + ,`)

2. **Tampilkan Semua Setting:**
   - Di bawah, klik radio button **All** untuk menampilkan semua pengaturan

3. **Aktifkan Interface:**
   - Di panel kiri, navigasi ke: **Interface** → **Main interfaces**
   - Centang pilihan:
     - ✅ **Lua interface**
     - ✅ **Web interface**

4. **Set Password Lua:**
   - Masih di **Interface**, cari submenu **Lua**
   - Atur **Password** menjadi: `dentri`

5. **Simpan Setting:**
   - Klik **Save** di bawah window
   - Restart VLC untuk mengaplikasikan perubahan

---

## ⚙️ Konfigurasi Project

### File yang perlu disesuaikan:

#### 1. `cctvName.js`
```javascript
const VLC_AUTH = {
  username: "",
  password: "dentri"  // Sesuaikan dengan password VLC Anda
};
```

#### 2. Pastikan playlist file ada:
- `nataru_2025.xspf` - Untuk CCTV/display utama
- `Gending/lagu.xspf` - Untuk musik background

---

## 🚀 Menjalankan Project

### Opsi 1: Otomatis (Recommended) - Menggunakan Batch Script

Saya sudah membuat script untuk menyederhanakan startup. Cukup jalankan satu file saja:

**Windows CMD:**
```bash
start-all.bat
```

**PowerShell:**
```powershell
.\start-all.ps1
```

Script ini akan otomatis:
- ✅ Membuka VLC untuk CCTV (port 8080)
- ✅ Membuka VLC untuk musik (port 8081)
- ✅ Menjalankan Node.js server
- ✅ Membuka browser ke `localhost:3000/cctvName`

---

### Opsi 2: Manual - Buka CMD/PowerShell dan jalankan 3 perintah berikut:

**Jendela CMD #1 - VLC untuk CCTV (port 8080):**
```cmd
"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe" --http-port=8080 --playlist-autostart nataru_2025.xspf
```

**Jendela CMD #2 - VLC untuk Musik (port 8081):**
```cmd
"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe" --http-port=8081 --playlist-autostart Gending\lagu.xspf
```

**Jendela CMD #3 - Node.js Server:**
```cmd
node server.js
```

Kemudian buka browser dan akses:
- **Display CCTV:** `http://localhost:3000/cctvName`
- **Display Musik:** `http://localhost:3000/musicName`

---

## 🛠️ Troubleshooting

### Error: "Connection refused" pada running text
**Solusi:**
- Pastikan VLC sudah running dan dapat diakses
- Cek apakah password di `cctvName.js` sesuai dengan VLC
- Coba akses `http://localhost:8080/requests/status.json` di browser

### VLC tidak membuka
**Solusi:**
- Pastikan path VLC benar: `C:\Program Files (x86)\VideoLAN\VLC\vlc.exe`
- Jika VLC di lokasi berbeda, sesuaikan path di script

### Port sudah dipakai
**Solusi:**
- Ubah port di script (default: 8080 untuk CCTV, 8081 untuk musik)
- Atau tutup aplikasi lain yang menggunakan port tersebut

---

## 💡 Saran Penyederhanaan

### Rekomendasi untuk Future:

1. **Buat Batch Script (.bat)** - Sudah saya rekomendasikan
   - User tinggal double-click 1 file
   - Semua proses berjalan otomatis

2. **Environment Variables**
   - Simpan path VLC & port di `.env` file
   - Lebih mudah dikonfigurasi tanpa edit kode

3. **Electron App**
   - Buat desktop app dengan UI simple
   - User tidak perlu sentuh CMD/PowerShell

4. **Health Check Dashboard**
   - Buat halaman web di port 3000 yang menampilkan status VLC
   - User bisa monitor semua dari satu tempat

---

## 📝 Catatan Teknis

- **Server Port:** 3000 (Node.js)
- **VLC CCTV Port:** 8080
- **VLC Musik Port:** 8081
- **VLC Password:** dentri
- **Update interval:** 2 detik