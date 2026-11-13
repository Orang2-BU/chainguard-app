# DESIGN.md, Arah Visual ChainGuard

Dokumen arah untuk dashboard ChainGuard. antislop adalah filternya,
dokumen ini arahnya. Keduanya dipakai bersamaan.

## Identitas

ChainGuard adalah buku catatan pasar yang rapi. Bukan aplikasi
teknologi yang mencolok, bukan dashboard korporat. Rasanya seperti
catatan tangan pengepul yang ditulis ulang dengan tertib: kertas
hangat, tinta hijau tua, garis-garis tipis seperti buku tulis, dan
warna hanya muncul kalau dia membawa arti.

Penggunanya pelaku pasar yang membuka ini di HP murah, di bawah
cahaya matahari, sambil berdiri di samping tumpukan barang. Semua
keputusan desain tunduk ke situasi itu.

## Palet

- Kertas: #FAF6EE (latar halaman, hangat, tidak silau)
- Permukaan: #FFFFFF (kartu)
- Tinta: #1C2A23 (hijau kehitaman, teks utama)
- Tinta pudar: #66736A (teks pendamping)
- Garis: #E5DFD2 (hairline hangat)
- Hijau daun: #1E7A46 (aman, merek, tautan)
- Hijau dalam: #14532D (blok merek)
- Merah cabai: #BC3B2A (hanya untuk mendesak)
- Kuning kunyit: #A86E0B di atas #FAF0DA (hanya untuk pantau)
- Penanda komoditas: titik merah cabai untuk batch cabai, titik
  ungu bawang #7A4A63 untuk batch bawang merah. Kecil, selalu di
  tempat yang sama, tidak pernah jadi dekorasi besar.

Warna status tidak pernah dipakai untuk hiasan. Kalau sebuah elemen
berwarna merah, artinya ada yang harus ditindak.

## Tipografi

- Judul: Fraunces, serif hangat dengan karakter, 600-700.
- Isi: Inter, 400-700, ukuran dasar 17px, tinggi baris 1.55.
- Angka selalu tabular (font-variant-numeric: tabular-nums) supaya
  berat dan suhu sejajar rapi seperti di buku catatan.
- Label kecil: huruf kapital 12-13px, spasi huruf longgar, tinta
  pudar. Hanya untuk label, tidak pernah untuk kalimat.

## Bentuk dan ruang

- Sudut kartu 14px, bayangan sangat tipis atau tidak ada; pemisah
  utama adalah hairline, bukan bayangan tebal.
- Ritme vertikal longgar: bagian dipisah 34px, isi kartu bernapas.
- Tanda merek: tiga titik yang dihubungkan garis, seperti rute
  batch di context graph, putih di atas blok hijau dalam.
- Grafik: daerah aman digambar sebagai pita hijau muda dengan tepi
  garis putus-putus, garis data tegas, titik terakhir ditandai dan
  diberi nilai. Sumbu waktu selalu tertulis, tidak ditebak.

## Yang dilarang

- Gradien dekoratif, kaca buram (glassmorphism), kartu melayang
  dengan bayangan besar.
- Statistik karangan, lencana "AI", ikon emoji, teks promosi.
- Warna status dipakai di luar arti statusnya.
- Informasi teknis di beranda. Beranda hanya menjawab: batch mana
  yang harus ditindak, kenapa, dan ngapain.

## Logo dan ikon (dari ekosistem 21st.dev)

- Logo adalah komponen React bertipe `Logo` (mark + wordmark, prop
  ukuran dan varian), mengikuti pola komponen brand di paket UI
  21st.dev (components/ui/logo.tsx). Mark tetap tiga titik terhubung
  garis di atas ubin hijau tua membulat.
- Ikon dari Lucide lewat paket lucide-react: pustaka ikon open-source
  yang diagregasi 21st.dev/icons dan dipakai komponen-komponen
  21st.dev sebagai sistem ikonnya. Salin-tempel per ikon dari situs
  21st.dev butuh paket berbayar Builder; pustakanya sendiri
  berlisensi ISC dan diambil lewat npm, jadi path SVG-nya asli,
  bukan gambar ulang.
- Ikon selalu membawa arti dan berdampingan label teks: status
  (segitiga peringatan, mata, centang), jenis masalah (api, tetesan,
  angin, timbangan, jam), label data (orang, pin, kalender, sinkron,
  wadah, alat). Tidak ada ikon hiasan.
- Kategori "logo" di 21st.dev isinya logo cloud untuk dinding logo
  klien; tidak dipakai karena ChainGuard tidak punya daftar logo
  klien dan menampilkannya akan jadi hiasan tanpa arti.
