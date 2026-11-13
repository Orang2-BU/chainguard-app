import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Cpu,
  MapPin,
  Package,
  RefreshCw,
  Scale,
  User,
} from "lucide-react";
import GrafikGaris from "@/components/GrafikGaris";
import StatusChip from "@/components/StatusChip";
import { detailBatch, namaPelakuPublik } from "@/lib/store";
import { formatDurasi, formatKg, formatPersen, formatWaktu } from "@/lib/format";

export const dynamic = "force-dynamic";

const NAMA_KOMODITAS: Record<string, string> = {
  cabai: "Cabai",
  bawang_merah: "Bawang merah",
};

const LABEL_MASALAH: Record<string, string> = {
  panas: "Kepanasan",
  lembap: "Kelembapan terlalu tinggi",
  kering: "Udara terlalu kering",
};

export default async function DetailBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = detailBatch(id);
  if (!detail) notFound();
  const r = detail.ringkasan;
  const b = r.batch;

  return (
    <>
      <Link className="back-link" href="/">
        <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
        Kembali ke beranda
      </Link>
      <h1 style={{ marginTop: 10 }}>
        {NAMA_KOMODITAS[b.komoditas]} {b.id} <StatusChip status={r.status} />
      </h1>

      {r.kalimatMasalah && (
        <div className={`alert-box alert-${r.status}`}>
          <p className="problem">{r.kalimatMasalah}</p>
          {r.tindakan && (
            <p style={{ marginTop: 6 }}>
              <strong>Yang perlu dilakukan:</strong> {r.tindakan}
            </p>
          )}
        </div>
      )}

      <dl className="info-grid">
        <div>
          <dt>
            <User size={13} strokeWidth={2.2} aria-hidden="true" />
            Sekarang di tangan
          </dt>
          <dd>
            {r.pemegangNama} ({r.pemegangPeran})
          </dd>
        </div>
        <div>
          <dt>
            <MapPin size={13} strokeWidth={2.2} aria-hidden="true" />
            Lokasi
          </dt>
          <dd>{r.lokasiSaatIni}</dd>
        </div>
        <div>
          <dt>
            <Scale size={13} strokeWidth={2.2} aria-hidden="true" />
            Berat panen
          </dt>
          <dd>{formatKg(b.beratPanenKg)}</dd>
        </div>
        <div>
          <dt>
            <Scale size={13} strokeWidth={2.2} aria-hidden="true" />
            Berat sekarang
          </dt>
          <dd>
            {formatKg(r.beratSaatIniKg)}
            {r.susutPersen > 0.05 && ` (turun ${formatPersen(r.susutPersen)})`}
          </dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={13} strokeWidth={2.2} aria-hidden="true" />
            Dipanen
          </dt>
          <dd>{formatWaktu(b.waktuPanen)}</dd>
        </div>
        <div>
          <dt>
            <RefreshCw size={13} strokeWidth={2.2} aria-hidden="true" />
            Data terakhir dari alat
          </dt>
          <dd>{r.sinkronTerakhir ? formatWaktu(r.sinkronTerakhir) : "Belum ada data"}</dd>
        </div>
        <div>
          <dt>
            <Package size={13} strokeWidth={2.2} aria-hidden="true" />
            Wadah
          </dt>
          <dd>{b.wadah}</dd>
        </div>
        <div>
          <dt>
            <Cpu size={13} strokeWidth={2.2} aria-hidden="true" />
            Alat pencatat
          </dt>
          <dd>{b.loggerId}</dd>
        </div>
      </dl>

      <h2>Suhu dan kelembapan selama perjalanan</h2>
      <GrafikGaris bacaan={detail.bacaan} komoditas={b.komoditas} />

      <h2>Perjalanan batch</h2>
      {detail.legs.map((leg, i) => (
        <div key={i} className={`leg ${leg.menitDiLuarJendela >= 45 ? "leg-bad" : ""}`}>
          <p className="leg-title">
            {leg.dariNama === leg.keNama
              ? `Di tangan ${leg.dariNama}`
              : `${leg.dariNama} ke ${leg.keNama}`}
          </p>
          <p className="leg-meta">
            {formatWaktu(leg.mulai)} s/d {formatWaktu(leg.selesai)}
          </p>
          <p>
            {leg.menitDiLuarJendela === 0
              ? "Aman sepanjang perjalanan ini."
              : `${leg.masalahUtama ? LABEL_MASALAH[leg.masalahUtama] : "Kondisi di luar batas aman"} selama ${formatDurasi(leg.menitDiLuarJendela)}. Suhu tertinggi ${leg.suhuMaks.toLocaleString("id-ID")}°C, kelembapan tertinggi ${leg.rhMaks}%.`}
          </p>
        </div>
      ))}

      <h2>Riwayat serah terima</h2>
      <ul className="timeline">
        <li>
          <p className="leg-title">Dipanen oleh {detail.petaniNama}</p>
          <p className="leg-meta">
            {formatWaktu(b.waktuPanen)} · {formatKg(b.beratPanenKg)}
          </p>
        </li>
        {detail.serahTerima.map((st) => (
          <li key={st.id}>
            <p className="leg-title">
              {st.dariId ? `${namaPelakuPublik(st.dariId)} ke ` : "Diterima oleh "}
              {namaPelakuPublik(st.keId)}
            </p>
            <p className="leg-meta">
              {formatWaktu(st.waktu)} · {formatKg(st.beratKg)} · {st.lokasi}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
