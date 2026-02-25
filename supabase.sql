-- ============================================================
-- DATABASE SUPABASE — SMP AL-HUSAINIYYAH
-- Jalankan script ini di Supabase SQL Editor
-- Caranya: supabase.com → Project → SQL Editor → New Query → Paste → Run
-- ============================================================

-- TABEL 1: PENDAFTARAN SISWA BARU
CREATE TABLE IF NOT EXISTS pendaftaran (
  id                  BIGSERIAL PRIMARY KEY,
  nomor_pendaftaran   TEXT NOT NULL UNIQUE,
  nama_lengkap        TEXT NOT NULL,
  tempat_lahir        TEXT NOT NULL,
  tanggal_lahir       DATE NOT NULL,
  jenis_kelamin       TEXT NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  agama               TEXT NOT NULL,
  nama_orang_tua      TEXT NOT NULL,
  no_telepon          TEXT NOT NULL,
  alamat              TEXT NOT NULL,
  asal_sekolah        TEXT,
  status              TEXT NOT NULL DEFAULT 'menunggu'
                        CHECK (status IN ('menunggu','diterima','ditolak','daftar_ulang')),
  catatan_admin       TEXT,
  tanggal_daftar      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ
);

-- TABEL 2: PESAN KONTAK
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id          BIGSERIAL PRIMARY KEY,
  nama        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subjek      TEXT NOT NULL,
  pesan       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'belum_dibaca'
                CHECK (status IN ('belum_dibaca','sudah_dibaca','dibalas')),
  balasan     TEXT,
  tanggal     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ
);

-- TABEL 3: BERITA / PENGUMUMAN
CREATE TABLE IF NOT EXISTS berita (
  id              BIGSERIAL PRIMARY KEY,
  judul           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  isi             TEXT NOT NULL,
  ringkasan       TEXT,
  gambar          TEXT,
  kategori        TEXT NOT NULL DEFAULT 'berita'
                    CHECK (kategori IN ('berita','pengumuman','kegiatan','prestasi')),
  penulis         TEXT DEFAULT 'Admin',
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','tayang','arsip')),
  tanggal_tayang  DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ
);

-- ============================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) — Wajib di Supabase
-- ============================================================
ALTER TABLE pendaftaran  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita       ENABLE ROW LEVEL SECURITY;

-- Izinkan INSERT dari publik (website bisa kirim data)
CREATE POLICY "allow_insert_pendaftaran"
  ON pendaftaran FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_pesan"
  ON pesan_kontak FOR INSERT TO anon WITH CHECK (true);

-- Izinkan SELECT berita yang sudah tayang (publik bisa baca)
CREATE POLICY "allow_read_berita_tayang"
  ON berita FOR SELECT TO anon USING (status = 'tayang');

-- Izinkan SELECT semua untuk authenticated (admin)
CREATE POLICY "allow_all_authenticated_pendaftaran"
  ON pendaftaran FOR ALL TO authenticated USING (true);

CREATE POLICY "allow_all_authenticated_pesan"
  ON pesan_kontak FOR ALL TO authenticated USING (true);

CREATE POLICY "allow_all_authenticated_berita"
  ON berita FOR ALL TO authenticated USING (true);

-- ============================================================
-- DATA CONTOH BERITA (opsional)
-- ============================================================
INSERT INTO berita (judul, slug, isi, ringkasan, kategori, status, tanggal_tayang) VALUES
(
  'Pembukaan PPDB Tahun Ajaran 2025/2026',
  'ppdb-2025-2026',
  '<p>SMP Al-Husainiyyah membuka Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2025/2026. Pendaftaran dibuka mulai 1 Januari hingga 30 Juni 2025.</p>',
  'PPDB 2025/2026 resmi dibuka. Daftarkan putra-putri Anda sekarang!',
  'pengumuman', 'tayang', '2025-01-01'
),
(
  'Siswa SMP Al-Husainiyyah Raih Juara Olimpiade Sains',
  'juara-olimpiade-sains-2025',
  '<p>Alhamdulillah, siswa kami berhasil meraih juara 1 pada Olimpiade Sains Nasional tingkat Kota Bandung.</p>',
  'Siswa kita meraih juara 1 Olimpiade Sains tingkat Kota Bandung.',
  'prestasi', 'tayang', '2025-03-15'
);

-- ============================================================
-- SELESAI ✅
-- ============================================================
