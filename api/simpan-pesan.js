// api/simpan-pesan.js
// Vercel Serverless Function — Simpan pesan kontak ke Supabase

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });

  const { nama, email, subjek, pesan } = req.body;

  if (!nama || !email || !subjek || !pesan) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pesan_kontak`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        nama: nama.trim(), 
        email: email.trim(), 
        subjek: subjek.trim(), 
        pesan: pesan.trim(), 
        status: 'belum_dibaca' 
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Supabase error:', response.status, responseText);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal menyimpan pesan: ' + responseText 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Pesan berhasil disimpan.' 
    });

  } catch (error) {
    console.error('Error simpan pesan:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan pesan: ' + error.message });
  }
}
