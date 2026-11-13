# ChainGuard, Perangkat Lunak

Dashboard dan server penerima data untuk ChainGuard: sistem telusur
cabai dan bawang merah berbasis context graph dan logger IoT.

Status: prototipe perangkat lunak yang berjalan penuh dengan data contoh.
Belum terhubung ke alat fisik dan belum berisi data lapangan. Semua
halaman menampilkan label "Data contoh".

## Menjalankan

```
npm install
npm run dev     # pengembangan, http://localhost:3000
npm run build   # build produksi
npm start       # jalankan build produksi
```

## Isi

- **Beranda (`/`)** menjawab satu pertanyaan: batch mana yang harus
  ditindak sekarang. Urutannya: yang mendesak, yang perlu dipantau,
  urutan jual duluan, lalu semua batch. Detail teknis tidak ditampilkan
  di sini.
- **Urutan Jual (`/prioritas`)** daftar semua batch terurut prioritas
  jual, dengan alasan dalam kalimat biasa: lama paparan di luar batas
  aman, umur sejak panen, dan susut berat.
- **Rincian batch (`/batch/[id]`)** paspor penanganan satu batch: grafik
  suhu dan kelembapan terhadap batas aman, ringkasan kondisi tiap
  perjalanan antar pelaku, dan riwayat serah terima dengan beratnya.
- **API integrasi** (`/api/readings`, `/api/handover`, `/api/batches`)
  menerima kiriman logger dan aplikasi pelaku. Format lengkapnya di
  `INTEGRASI_IOT.md`.

## Prinsip tampilan

- Bahasa pasar, bukan istilah teknis: "kepanasan", "berat turun",
  "di tangan siapa". Tidak ada angka yang ditampilkan kalau tidak bisa
  ditindaklanjuti pembacanya.
- Setiap angka selalu ditemani kesegarannya: "data terakhir jam
  berapa", karena data bisa datang telat dari alat yang offline.
- Status hanya tiga: Aman, Perlu dipantau, Perlu ditindak sekarang.
- Batas aman dan ambang adalah parameter contoh di
  `src/lib/thresholds.ts`, dikunci ulang dari literatur dan kesepakatan
  pelaku sebelum uji lapangan.

## Checklist verifikasi (dijalankan 11 Nov 2026)

- [x] `npx tsc --noEmit` bersih, tanpa error
- [x] `npm run build` berhasil, semua rute terbangun
- [x] Halaman `/`, `/prioritas`, `/batch/CAB-014` merespons 200,
      batch yang tidak ada merespons 404
- [x] `GET /api/batches` mengembalikan ringkasan sesuai cerita data
      contoh (CAB-014 mendesak karena kepanasan 3 jam, BM-007 dipantau
      karena kelembapan, BM-009 dipantau karena susut 5,3%)
- [x] `POST /api/readings` menerima bacaan baru dan membalas `ack_seq`
- [x] Kiriman ulang bacaan yang sama tersaring sebagai duplikat,
      tidak menggandakan data
- [x] Kiriman dari alat yang tidak terdaftar untuk batch itu ditolak
      dengan pesan yang jelas
- [x] `POST /api/handover` tercatat, dan ringkasan batch langsung
      berpindah tangan, berat, dan lokasi mengikuti catatan baru
- [x] Label "Data contoh" tampil di semua halaman
- [x] Tidak ada karakter em dash di kode maupun halaman hasil render

## Langkah berikutnya menuju uji lapangan

1. Ganti store in-memory (`src/lib/store.ts`) dengan database.
2. Tambah autentikasi alat dan pengguna.
3. Kunci parameter di `src/lib/thresholds.ts` dari literatur dan
   kesepakatan pelaku.
4. Hubungkan pengirim notifikasi WhatsApp ke `GET /api/batches`.
