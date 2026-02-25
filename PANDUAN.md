# 🚀 Panduan Deploy Website SMP Al-Husainiyyah
## Vercel (Gratis) + Supabase (Gratis)

---

## 📁 Struktur File yang Perlu Di-upload ke Vercel

```
project-vercel/
├── index.html              ← Website utama
├── vercel.json             ← Konfigurasi Vercel
├── supabase.sql            ← Script database (dijalankan di Supabase)
├── api/
│   ├── simpan-pesan.js     ← Backend simpan pesan kontak
│   └── simpan-pendaftaran.js ← Backend simpan pendaftaran
└── PANDUAN.md              ← File ini
```

---

## LANGKAH 1 — Buat Akun Supabase (Database Gratis)

1. Buka **https://supabase.com**
2. Klik **"Start your project"**
3. Daftar menggunakan akun **GitHub** (lebih mudah)
4. Setelah masuk, klik **"New Project"**
5. Isi:
   - **Name**: `smp-alhusainiyyah`
   - **Database Password**: buat password yang kuat (simpan baik-baik!)
   - **Region**: pilih **Southeast Asia (Singapore)**
6. Klik **"Create new project"** — tunggu ~2 menit

---

## LANGKAH 2 — Buat Tabel Database di Supabase

1. Di dashboard Supabase, klik menu **"SQL Editor"** (ikon database di kiri)
2. Klik **"New Query"**
3. **Copy semua isi file `supabase.sql`** dan paste di sana
4. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
5. Pastikan muncul pesan **"Success"**

---

## LANGKAH 3 — Ambil API Keys Supabase

1. Di dashboard Supabase, klik **"Project Settings"** (ikon ⚙️ di kiri bawah)
2. Klik menu **"API"**
3. Catat dua hal ini:
   - **Project URL** → contoh: `https://abcdefgh.supabase.co`
   - **anon / public key** → string panjang dimulai dengan `eyJ...`

> ⚠️ Jangan bagikan key ini ke orang lain!

---

## LANGKAH 4 — Upload ke GitHub

Sebelum deploy ke Vercel, file perlu ada di GitHub dulu:

1. Buka **https://github.com** → Login / Daftar
2. Klik **"New Repository"**
3. Nama repo: `website-smp-alhusainiyyah`
4. Pilih **Public**, klik **"Create repository"**
5. Upload semua file dari folder `project-vercel/` ke repo tersebut
   - Klik **"uploading an existing file"**
   - Drag & drop semua file (termasuk folder `api/`)
   - Klik **"Commit changes"**

---

## LANGKAH 5 — Deploy ke Vercel

1. Buka **https://vercel.com** → Login dengan akun yang sudah Anda punya
2. Klik **"Add New Project"**
3. Pilih **"Import Git Repository"**
4. Pilih repo `website-smp-alhusainiyyah` yang baru dibuat
5. Klik **"Deploy"** — tunggu sebentar

---

## LANGKAH 6 — Tambahkan API Keys Supabase ke Vercel ⭐ PENTING!

Ini langkah yang paling penting agar database bisa terhubung:

1. Di dashboard Vercel, buka project Anda
2. Klik tab **"Settings"**
3. Klik menu **"Environment Variables"**
4. Tambahkan 2 variabel berikut:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (dari langkah 3) |
| `SUPABASE_ANON_KEY` | `eyJ...` (dari langkah 3) |

5. Klik **"Save"**
6. Kembali ke tab **"Deployments"** → klik **"Redeploy"** agar perubahan aktif

---

## LANGKAH 7 — Selesai! ✅

Website Anda sudah online! Akses di:
```
https://website-smp-alhusainiyyah.vercel.app
```
(atau domain yang diberikan Vercel)

---

## 📊 Cara Lihat Data di Supabase (Pengganti Panel Admin)

1. Buka **https://supabase.com** → Login
2. Buka project Anda
3. Klik menu **"Table Editor"** di sebelah kiri
4. Pilih tabel yang ingin dilihat:
   - **`pendaftaran`** → data formulir pendaftaran siswa
   - **`pesan_kontak`** → pesan dari form kontak
   - **`berita`** → data berita/pengumuman

Anda bisa langsung edit, hapus, atau ubah status data di sana.

---

## ✅ Ringkasan Biaya

| Layanan | Biaya |
|---------|-------|
| Vercel (Hosting) | **GRATIS** |
| Supabase (Database) | **GRATIS** (hingga 500MB & 50.000 baris) |
| **TOTAL** | **Rp 0** 🎉 |

---

## ❓ Masalah Umum

**Form tidak tersimpan ke database?**
→ Pastikan Environment Variables di Vercel sudah diisi dan sudah di-Redeploy.

**Muncul error CORS?**
→ Pastikan URL Supabase di Environment Variables tidak ada spasi atau slash di akhir.

**Data tidak muncul di Supabase?**
→ Cek apakah SQL di langkah 2 berhasil dijalankan (tabel sudah terbuat).
