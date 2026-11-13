# Kontrak Integrasi IoT ChainGuard

Dokumen ini adalah kesepakatan format data antara firmware logger
(ESP32 + DS18B20 + sensor kelembapan), aplikasi serah terima di HP pelaku,
dan server dashboard ini. Kalau tiga sisi ini mengikuti kontrak yang sama,
data mengalir tanpa perlu saling menunggu.

## 1. Logger mengirim bacaan sensor

Logger menyimpan bacaan secara lokal dulu (store-and-forward). Setiap
bacaan punya nomor urut (`seq`) yang naik terus per alat dan tidak pernah
dipakai ulang. Saat koneksi tersedia (WiFi kantor, hotspot HP, atau MiFi
yang menemani muatan), logger mengirim antreannya:

```
POST /api/readings
Content-Type: application/json

{
  "device_id": "LG-01",
  "batch_id": "CAB-014",
  "readings": [
    { "seq": 121, "ts": "2026-11-11T02:00:00Z", "suhu": 30.1, "rh": 82 },
    { "seq": 122, "ts": "2026-11-11T02:05:00Z", "suhu": 30.4, "rh": 83 }
  ]
}
```

Aturan:

- `ts` adalah waktu kejadian di alat (UTC, format ISO 8601). Karena itu
  jam alat harus benar: pakai RTC, atau sinkronkan jam setiap kali alat
  berhasil terhubung.
- Interval sampling yang dipakai sistem: 5 menit.
- Server membalas:

```
{ "ok": true, "diterima": 2, "duplikat": 0, "ack_seq": 122 }
```

- `ack_seq` adalah seq tertinggi yang sudah tersimpan aman di server.
  Logger boleh menghapus baris lokal dengan `seq <= ack_seq`. Baris di
  atasnya tetap disimpan dan dikirim ulang pada kesempatan berikutnya.
- Kiriman ganda aman: server menyaring duplikat dari `device_id + seq`,
  jadi logger tidak perlu takut mengirim ulang setelah koneksi putus di
  tengah jalan.
- `device_id` harus sesuai alat yang terdaftar untuk batch itu. Kiriman
  dari alat yang tidak terdaftar ditolak dengan `ok: false` dan pesan
  error yang menjelaskan sebabnya.

## 2. Aplikasi pelaku mencatat serah terima

Setelah scan QR di wadah dan penimbangan, aplikasi mengirim:

```
POST /api/handover
Content-Type: application/json

{
  "batch_id": "CAB-014",
  "dari_id": "P2",
  "ke_id": "P3",
  "waktu": "2026-11-11T01:30:00Z",
  "berat_kg": 115,
  "lokasi": "Pasar Induk, Jember"
}
```

Aplikasi juga mengantre secara lokal saat tidak ada sinyal dan mengirim
saat koneksi kembali. Urutan waktu disusun server dari `waktu`, bukan dari
waktu tiba, jadi kiriman telat tidak merusak riwayat.

## 3. Membaca ringkasan

```
GET /api/batches
```

Mengembalikan semua batch terurut prioritas jual (yang paling mendesak
di atas), lengkap dengan status (`aman`, `pantau`, `mendesak`), masalah
dalam kalimat biasa, tindakan yang disarankan, dan waktu sinkron
terakhir. Endpoint ini yang dipakai aplikasi pelaku dan pengirim
notifikasi WhatsApp untuk tahu batch mana yang butuh tindakan dan lagi
di tangan siapa.

```
GET /api/readings?batch_id=CAB-014
```

Mengembalikan seluruh bacaan mentah satu batch, untuk keperluan grafik
dan audit.

## 4. Yang belum ada di prototipe ini

- Autentikasi alat dan pengguna (wajib sebelum produksi).
- Penyimpanan database (prototipe memakai memori; data contoh dimuat
  ulang setiap server dimulai ulang).
- Pengiriman notifikasi WhatsApp otomatis (dipicu dari ringkasan
  `GET /api/batches` oleh layanan terpisah).
