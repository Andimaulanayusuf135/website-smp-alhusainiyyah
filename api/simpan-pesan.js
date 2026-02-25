// ============================================================
// api/simpan-pesan.js
// Vercel Serverless Function — Simpan pesan kontak ke Supabase
// ============================================================

export default async function handler(req, res) {
  // Izinkan CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });

  const { nama, email, subjek, pesan } = req.body;

  // Validasi
  if (!nama || !email || !subjek || !pesan) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
  }

  try {
    // Kirim ke Supabase REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pesan_kontak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ nama, email, subjek, pesan, status: 'belum_dibaca' })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, message: 'Pesan berhasil disimpan.', id: data[0]?.id });

  } catch (error) {
    console.error('Error simpan pesan:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan pesan. Silakan coba lagi.' });
  }
}
