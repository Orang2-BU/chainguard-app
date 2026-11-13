import type { Bacaan, Batch, Pelaku, SerahTerima } from "./types";

// DATA CONTOH. Semua batch, pelaku, dan bacaan di file ini adalah contoh
// yang disusun agar dashboard bisa dilihat dan diuji sebelum uji lapangan.
// Bukan data lapangan. UI wajib selalu menampilkan label "Data contoh".

export const PELAKU: Pelaku[] = [
  { id: "P1", nama: "Slamet Riyadi", peran: "petani", lokasi: "Ajung, Jember" },
  { id: "P2", nama: "Budi Santoso", peran: "pengepul", lokasi: "Pasar Tanjung, Jember" },
  { id: "P3", nama: "Rina Wijaya", peran: "pedagang", lokasi: "Pasar Induk, Jember" },
  { id: "P4", nama: "Gudang Segar Abadi", peran: "distributor", lokasi: "Kaliwates, Jember" },
  { id: "P5", nama: "Darto Wibowo", peran: "petani", lokasi: "Kalisat, Jember" },
];

export const BATCHES: Batch[] = [
  { id: "CAB-014", komoditas: "cabai", petaniId: "P1", waktuPanen: "2026-11-09T23:00:00Z", beratPanenKg: 120, wadah: "keranjang kayu", loggerId: "LG-01" },
  { id: "BM-007", komoditas: "bawang_merah", petaniId: "P5", waktuPanen: "2026-11-08T01:00:00Z", beratPanenKg: 200, wadah: "karung jala merah", loggerId: "LG-02" },
  { id: "CAB-015", komoditas: "cabai", petaniId: "P1", waktuPanen: "2026-11-11T00:00:00Z", beratPanenKg: 80, wadah: "keranjang kayu", loggerId: "LG-03" },
  { id: "BM-008", komoditas: "bawang_merah", petaniId: "P5", waktuPanen: "2026-11-10T01:00:00Z", beratPanenKg: 150, wadah: "karung jala merah", loggerId: "LG-04" },
  { id: "CAB-016", komoditas: "cabai", petaniId: "P1", waktuPanen: "2026-11-07T02:00:00Z", beratPanenKg: 100, wadah: "keranjang bambu", loggerId: "LG-05" },
  { id: "BM-009", komoditas: "bawang_merah", petaniId: "P5", waktuPanen: "2026-11-08T00:30:00Z", beratPanenKg: 300, wadah: "karung jala merah", loggerId: "LG-06" },
];

export const SERAH_TERIMA: SerahTerima[] = [
  { id: "ST-01", batchId: "CAB-014", dariId: "P1", keId: "P2", waktu: "2026-11-10T02:00:00Z", beratKg: 118, lokasi: "Ajung, Jember" },
  { id: "ST-02", batchId: "CAB-014", dariId: "P2", keId: "P3", waktu: "2026-11-11T01:30:00Z", beratKg: 115, lokasi: "Pasar Induk, Jember" },
  { id: "ST-03", batchId: "BM-007", dariId: "P5", keId: "P2", waktu: "2026-11-09T03:00:00Z", beratKg: 196, lokasi: "Pasar Tanjung, Jember" },
  { id: "ST-04", batchId: "BM-008", dariId: "P5", keId: "P4", waktu: "2026-11-10T09:00:00Z", beratKg: 148, lokasi: "Kaliwates, Jember" },
  { id: "ST-05", batchId: "CAB-016", dariId: "P1", keId: "P2", waktu: "2026-11-08T02:00:00Z", beratKg: 97, lokasi: "Pasar Tanjung, Jember" },
  { id: "ST-06", batchId: "CAB-016", dariId: "P2", keId: "P3", waktu: "2026-11-10T03:00:00Z", beratKg: 95, lokasi: "Pasar Induk, Jember" },
  { id: "ST-07", batchId: "BM-009", dariId: "P5", keId: "P4", waktu: "2026-11-09T00:30:00Z", beratKg: 291, lokasi: "Kaliwates, Jember" },
  { id: "ST-08", batchId: "BM-009", dariId: "P4", keId: "P3", waktu: "2026-11-10T12:00:00Z", beratKg: 284, lokasi: "Pasar Induk, Jember" },
];

interface Segmen {
  dari: string;
  sampai: string;
  suhu: [number, number];
  rh: [number, number];
}

const SEGMEN: Record<string, Segmen[]> = {
  "CAB-014": [
    { dari: "2026-11-09T23:00:00Z", sampai: "2026-11-10T02:00:00Z", suhu: [27, 29], rh: [78, 82] },
    { dari: "2026-11-10T02:00:00Z", sampai: "2026-11-10T22:00:00Z", suhu: [28, 30], rh: [80, 85] },
    { dari: "2026-11-10T22:00:00Z", sampai: "2026-11-11T00:15:00Z", suhu: [31, 38], rh: [76, 66] },
    { dari: "2026-11-11T00:15:00Z", sampai: "2026-11-11T01:30:00Z", suhu: [38, 33], rh: [66, 72] },
    { dari: "2026-11-11T01:30:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [30, 29], rh: [80, 84] },
  ],
  "BM-007": [
    { dari: "2026-11-08T01:00:00Z", sampai: "2026-11-09T03:00:00Z", suhu: [28, 30], rh: [66, 69] },
    { dari: "2026-11-09T03:00:00Z", sampai: "2026-11-10T15:00:00Z", suhu: [29, 30], rh: [68, 69] },
    { dari: "2026-11-10T15:00:00Z", sampai: "2026-11-10T16:00:00Z", suhu: [30, 31], rh: [69, 80] },
    { dari: "2026-11-10T16:00:00Z", sampai: "2026-11-10T17:00:00Z", suhu: [31, 30], rh: [80, 68] },
    { dari: "2026-11-10T17:00:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [29, 28], rh: [67, 69] },
  ],
  "CAB-015": [
    { dari: "2026-11-11T00:00:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [26, 29], rh: [78, 84] },
  ],
  "BM-008": [
    { dari: "2026-11-10T01:00:00Z", sampai: "2026-11-10T09:00:00Z", suhu: [27, 29], rh: [66, 68] },
    { dari: "2026-11-10T09:00:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [28, 30], rh: [67, 69] },
  ],
  "CAB-016": [
    { dari: "2026-11-07T02:00:00Z", sampai: "2026-11-08T02:00:00Z", suhu: [27, 30], rh: [78, 84] },
    { dari: "2026-11-08T02:00:00Z", sampai: "2026-11-09T05:00:00Z", suhu: [28, 30], rh: [80, 84] },
    { dari: "2026-11-09T05:00:00Z", sampai: "2026-11-09T05:30:00Z", suhu: [30, 33.5], rh: [84, 83] },
    { dari: "2026-11-09T05:30:00Z", sampai: "2026-11-09T06:30:00Z", suhu: [33.5, 30], rh: [83, 84] },
    { dari: "2026-11-09T06:30:00Z", sampai: "2026-11-10T03:00:00Z", suhu: [30, 29], rh: [84, 86] },
    { dari: "2026-11-10T03:00:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [29, 28], rh: [84, 88] },
  ],
  "BM-009": [
    { dari: "2026-11-08T00:30:00Z", sampai: "2026-11-09T00:30:00Z", suhu: [27, 29], rh: [66, 68] },
    { dari: "2026-11-09T00:30:00Z", sampai: "2026-11-10T12:00:00Z", suhu: [28, 30], rh: [67, 69] },
    { dari: "2026-11-10T12:00:00Z", sampai: "2026-11-11T05:30:00Z", suhu: [29, 28], rh: [68, 69] },
  ],
};

const INTERVAL_MENIT = 30; // data contoh dibuat per 30 menit agar ringkas

function buatBacaan(batch: Batch): Bacaan[] {
  const hasil: Bacaan[] = [];
  let seq = 0;
  for (const seg of SEGMEN[batch.id] ?? []) {
    const mulai = new Date(seg.dari).getTime();
    const selesai = new Date(seg.sampai).getTime();
    for (let t = mulai; t <= selesai; t += INTERVAL_MENIT * 60000) {
      if (hasil.length > 0 && t <= new Date(hasil[hasil.length - 1].ts).getTime()) continue;
      const p = selesai === mulai ? 0 : (t - mulai) / (selesai - mulai);
      seq += 1;
      const goyangan = Math.sin(seq * 1.7) * 0.3;
      hasil.push({
        deviceId: batch.loggerId,
        batchId: batch.id,
        seq,
        ts: new Date(t).toISOString(),
        suhu: Math.round((seg.suhu[0] + (seg.suhu[1] - seg.suhu[0]) * p + goyangan) * 10) / 10,
        rh: Math.round(seg.rh[0] + (seg.rh[1] - seg.rh[0]) * p + goyangan * 2),
      });
    }
  }
  return hasil;
}

export const BACAAN_AWAL: Bacaan[] = BATCHES.flatMap(buatBacaan);
