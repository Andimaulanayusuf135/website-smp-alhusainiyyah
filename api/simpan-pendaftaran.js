// ============================================================
// api/simpan-pendaftaran.js
// Vercel Serverless Function — Simpan pendaftaran siswa ke Supabase
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });

  const {
    nama_lengkap, tempat_lahir, tanggal_lahir,
    jenis_kelamin, agama, nama_orang_tua,
    no_telepon, alamat, asal_sekolah
  } = req.body;

  // Validasi field wajib
  const required = { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, nama_orang_tua, no_telepon, alamat };
  for (const [key, val] of Object.entries(required)) {
    if (!val || !val.toString().trim()) {
      return res.status(400).json({ success: false, message: `Field '${key}' wajib diisi.` });
    }
  }

  try {
    // Generate nomor pendaftaran: PSB-2025-XXXX
    const tahun = new Date().getFullYear();

    // Hitung jumlah pendaftaran tahun ini
    const countResp = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/pendaftaran?select=id&tanggal_daftar=gte.${tahun}-01-01`,
      {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      }
    );
    const countData = await countResp.json();
    const urutan = (countData.length || 0) + 1;
    const nomor_pendaftaran = `PSB-${tahun}-${String(urutan).padStart(4, '0')}`;

    // Simpan ke Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pendaftaran`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        nomor_pendaftaran,
        nama_lengkap: nama_lengkap.trim(),
        tempat_lahir: tempat_lahir.trim(),
        tanggal_lahir,
        jenis_kelamin,
        agama,
        nama_orang_tua: nama_orang_tua.trim(),
        no_telepon: no_telepon.trim(),
        alamat: alamat.trim(),
        asal_sekolah: asal_sekolah?.trim() || null,
        status: 'menunggu'
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return res.status(200).json({
      success: true,
      message: 'Pendaftaran berhasil disimpan.',
      nomor_pendaftaran
    });

  } catch (error) {
    console.error('Error simpan pendaftaran:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan data. Silakan coba lagi.' });
  }
}
