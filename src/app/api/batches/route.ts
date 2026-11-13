import { NextResponse } from "next/server";
import { semuaRingkasan } from "@/lib/store";

export const dynamic = "force-dynamic";

// Ringkasan semua batch dalam JSON, untuk aplikasi pelaku dan pengujian
// integrasi. Urutan = prioritas jual, yang paling mendesak duluan.
export async function GET() {
  const data = semuaRingkasan().map((r) => ({
    batch_id: r.batch.id,
    komoditas: r.batch.komoditas,
    status: r.status,
    pemegang: r.pemegangNama,
    lokasi: r.lokasiSaatIni,
    berat_kg: r.beratSaatIniKg,
    susut_persen: Math.round(r.susutPersen * 10) / 10,
    paparan_menit: r.totalMenitPaparan,
    masalah: r.kalimatMasalah,
    tindakan: r.tindakan,
    alasan_prioritas: r.alasanPrioritas,
    sinkron_terakhir: r.sinkronTerakhir,
  }));
  return NextResponse.json({ ok: true, data });
}
