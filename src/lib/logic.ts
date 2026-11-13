import { JENDELA_AMAN, MENIT_MENDESAK, MENIT_PANTAU } from "./thresholds";
import { formatDurasi, formatPersen, formatUmur } from "./format";
import type {
  Bacaan,
  Batch,
  Komoditas,
  Pelaku,
  RingkasanBatch,
  RingkasanLeg,
  SerahTerima,
  StatusBatch,
} from "./types";

export type JenisMasalah = "panas" | "lembap" | "kering" | "dingin";

export function jenisMasalah(komoditas: Komoditas, suhu: number, rh: number): JenisMasalah | null {
  const j = JENDELA_AMAN[komoditas];
  if (suhu > j.suhuMaks) return "panas";
  if (rh > j.rhMaks) return "lembap";
  if (rh < j.rhMin) return "kering";
  if (suhu < j.suhuMin) return "dingin";
  return null;
}

const LABEL_MASALAH: Record<string, string> = {
  panas: "Kepanasan",
  lembap: "Kelembapan terlalu tinggi",
  kering: "Udara terlalu kering",
  dingin: "Terlalu dingin",
};

const TINDAKAN: Record<string, string> = {
  panas:
    "Pindahkan ke tempat teduh yang berventilasi, longgarkan tumpukan, pisahkan yang mulai busuk, dan dahulukan jual batch ini.",
  lembap:
    "Hamparkan lebih tipis, buka ventilasi, jauhkan dari tempat basah, dan pisahkan yang berjamur.",
  kering:
    "Jauhkan dari panas dan angin kering, lalu dahulukan jual sebelum beratnya turun lebih banyak.",
  dingin: "Pindahkan ke tempat yang lebih hangat dan dahulukan jual batch ini.",
  susut: "Dahulukan jual batch ini sebelum beratnya turun lebih banyak.",
  umur: "Dahulukan jual batch ini, umurnya termasuk yang paling tua di antara batch yang aktif.",
};

function namaPelaku(pelaku: Map<string, Pelaku>, id: string): string {
  return pelaku.get(id)?.nama ?? id;
}

export function hitungLegs(
  batch: Batch,
  pelaku: Map<string, Pelaku>,
  serahTerima: SerahTerima[],
  bacaan: Bacaan[],
): RingkasanLeg[] {
  const urutST = [...serahTerima].sort((a, b) => a.waktu.localeCompare(b.waktu));
  const urutBacaan = [...bacaan].sort((a, b) => a.ts.localeCompare(b.ts));
  const titik: { holderId: string; mulai: string; selesai: string; berikutId: string }[] = [];
  let holder = batch.petaniId;
  let mulai = batch.waktuPanen;
  for (const st of urutST) {
    titik.push({ holderId: holder, mulai, selesai: st.waktu, berikutId: st.keId });
    holder = st.keId;
    mulai = st.waktu;
  }
  const selesaiAkhir = urutBacaan.length > 0 ? urutBacaan[urutBacaan.length - 1].ts : mulai;
  titik.push({ holderId: holder, mulai, selesai: selesaiAkhir, berikutId: holder });

  return titik.map((t) => {
    const dalam = urutBacaan.filter((b) => b.ts >= t.mulai && b.ts <= t.selesai);
    let menit = 0;
    const hitungJenis = new Map<string, number>();
    for (let i = 0; i < dalam.length; i++) {
      const jenis = jenisMasalah(batch.komoditas, dalam[i].suhu, dalam[i].rh);
      if (!jenis) continue;
      const berikut = dalam[i + 1];
      const akhir = berikut ? new Date(berikut.ts).getTime() : new Date(t.selesai).getTime();
      const interval = Math.min((akhir - new Date(dalam[i].ts).getTime()) / 60000, 120);
      if (interval > 0) menit += interval;
      hitungJenis.set(jenis, (hitungJenis.get(jenis) ?? 0) + 1);
    }
    let masalahUtama: RingkasanLeg["masalahUtama"] = null;
    let terbanyak = 0;
    for (const [jenis, n] of hitungJenis) {
      if ((jenis === "panas" || jenis === "lembap" || jenis === "kering") && n > terbanyak) {
        terbanyak = n;
        masalahUtama = jenis;
      }
    }
    return {
      dariNama: namaPelaku(pelaku, t.holderId),
      keNama: namaPelaku(pelaku, t.berikutId),
      mulai: t.mulai,
      selesai: t.selesai,
      menitDiLuarJendela: Math.round(menit),
      suhuMaks: dalam.length ? Math.max(...dalam.map((b) => b.suhu)) : 0,
      rhMaks: dalam.length ? Math.max(...dalam.map((b) => b.rh)) : 0,
      rhMin: dalam.length ? Math.min(...dalam.map((b) => b.rh)) : 0,
      masalahUtama,
    };
  });
}

export function ringkasBatch(
  batch: Batch,
  pelaku: Map<string, Pelaku>,
  serahTerima: SerahTerima[],
  bacaan: Bacaan[],
): RingkasanBatch {
  const urutST = [...serahTerima].sort((a, b) => a.waktu.localeCompare(b.waktu));
  const urutBacaan = [...bacaan].sort((a, b) => a.ts.localeCompare(b.ts));
  const legs = hitungLegs(batch, pelaku, serahTerima, bacaan);
  const totalPaparan = legs.reduce((s, l) => s + l.menitDiLuarJendela, 0);
  const legTerburuk = legs.reduce<RingkasanLeg | null>(
    (acc, l) => (acc === null || l.menitDiLuarJendela > acc.menitDiLuarJendela ? l : acc),
    null,
  );

  const stTerakhir = urutST[urutST.length - 1];
  const pemegangId = stTerakhir ? stTerakhir.keId : batch.petaniId;
  const pemegang = pelaku.get(pemegangId);
  const beratSaatIni = stTerakhir ? stTerakhir.beratKg : batch.beratPanenKg;
  const susutPersen = ((batch.beratPanenKg - beratSaatIni) / batch.beratPanenKg) * 100;

  const acuan =
    urutBacaan.length > 0
      ? urutBacaan[urutBacaan.length - 1].ts
      : stTerakhir
        ? stTerakhir.waktu
        : batch.waktuPanen;
  const umurJam = (new Date(acuan).getTime() - new Date(batch.waktuPanen).getTime()) / 3600000;

  let status: StatusBatch = "aman";
  if (totalPaparan >= MENIT_MENDESAK) status = "mendesak";
  else if (totalPaparan >= MENIT_PANTAU || susutPersen >= 4 || umurJam >= 96) status = "pantau";

  const masalahUtama =
    legTerburuk && legTerburuk.menitDiLuarJendela >= MENIT_PANTAU ? legTerburuk.masalahUtama : null;

  let kalimatMasalah: string | null = null;
  let tindakan: string | null = null;
  if (masalahUtama && legTerburuk) {
    kalimatMasalah = `${LABEL_MASALAH[masalahUtama]} ${formatDurasi(legTerburuk.menitDiLuarJendela)} saat di tangan ${legTerburuk.dariNama}.`;
    tindakan = TINDAKAN[masalahUtama];
  } else if (susutPersen >= 4) {
    kalimatMasalah = `Berat turun ${formatPersen(susutPersen)} sejak panen.`;
    tindakan = TINDAKAN.susut;
  } else if (umurJam >= 96) {
    kalimatMasalah = `Sudah ${formatUmur(umurJam)} sejak panen.`;
    tindakan = TINDAKAN.umur;
  }

  const alasan: string[] = [];
  if (masalahUtama && legTerburuk) {
    alasan.push(`${LABEL_MASALAH[masalahUtama]} ${formatDurasi(legTerburuk.menitDiLuarJendela)}`);
  }
  if (susutPersen >= 3) alasan.push(`Berat turun ${formatPersen(susutPersen)}`);
  if (umurJam >= 24) alasan.push(`Sudah ${formatUmur(umurJam)} sejak panen`);
  if (alasan.length === 0) alasan.push("Kondisi normal");

  const skor =
    totalPaparan / 30 + umurJam / 12 + susutPersen * 5 + (status === "mendesak" ? 25 : status === "pantau" ? 8 : 0);

  return {
    batch,
    pemegangNama: pemegang?.nama ?? pemegangId,
    pemegangPeran: pemegang?.peran ?? "",
    lokasiSaatIni: stTerakhir ? stTerakhir.lokasi : (pelaku.get(batch.petaniId)?.lokasi ?? ""),
    beratSaatIniKg: beratSaatIni,
    susutPersen,
    umurJam,
    totalMenitPaparan: totalPaparan,
    status,
    masalahUtama,
    kalimatMasalah,
    tindakan,
    alasanPrioritas: alasan,
    skorPrioritas: Math.round(skor * 10) / 10,
    sinkronTerakhir: urutBacaan.length > 0 ? urutBacaan[urutBacaan.length - 1].ts : null,
  };
}
