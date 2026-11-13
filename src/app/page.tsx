import Link from "next/link";
import { ArrowRight, Clock, Droplets, Flame, Scale, Wind } from "lucide-react";
import StatusChip from "@/components/StatusChip";
import { semuaRingkasan } from "@/lib/store";
import { formatKg, formatTanggal, formatWaktu } from "@/lib/format";
import type { RingkasanBatch } from "@/lib/types";

export const dynamic = "force-dynamic";

const NAMA_KOMODITAS: Record<string, string> = {
  cabai: "Cabai",
  bawang_merah: "Bawang merah",
};

// Ikon masalah mengikuti jenis masalahnya, bukan hiasan:
// panas = api, kelembapan = tetesan, kering = angin, susut = timbangan,
// umur = jam. Ikon dari Lucide (pustaka open-source di 21st.dev/icons).
function IkonMasalah({ r }: { r: RingkasanBatch }) {
  const props = { size: 19, strokeWidth: 2, "aria-hidden": true } as const;
  if (r.masalahUtama === "panas") return <Flame {...props} />;
  if (r.masalahUtama === "lembap") return <Droplets {...props} />;
  if (r.masalahUtama === "kering") return <Wind {...props} />;
  if (r.kalimatMasalah?.startsWith("Berat turun")) return <Scale {...props} />;
  return <Clock {...props} />;
}

function KartuTindakan({ r, kelas }: { r: RingkasanBatch; kelas: "urgent" | "watch" }) {
  return (
    <article className={`card card-${kelas}`}>
      <p className="card-title">
        <span className={`dot dot-${r.batch.komoditas}`} />
        {NAMA_KOMODITAS[r.batch.komoditas]} {r.batch.id}
        <StatusChip status={r.status} />
      </p>
      <div className="problem-row">
        <span className={`problem-icon problem-icon-${kelas}`}>
          <IkonMasalah r={r} />
        </span>
        <p className="problem">{r.kalimatMasalah}</p>
      </div>
      <p className="card-meta">
        Sekarang di tangan {r.pemegangNama} ({r.pemegangPeran}), {r.lokasiSaatIni}. Berat{" "}
        {formatKg(r.beratSaatIniKg)}.
      </p>
      {r.tindakan && (
        <div className={`action-box action-${kelas}`}>
          <strong>Yang perlu dilakukan</strong>
          {r.tindakan}
        </div>
      )}
      <Link className="detail-link" href={`/batch/${r.batch.id}`}>
        Lihat rincian batch
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function Beranda() {
  const semua = semuaRingkasan();
  const mendesak = semua.filter((r) => r.status === "mendesak");
  const pantau = semua.filter((r) => r.status === "pantau");
  const aman = semua.filter((r) => r.status === "aman");
  const sinkronTerbaru = semua
    .map((r) => r.sinkronTerakhir)
    .filter((t): t is string => t !== null)
    .sort()
    .pop();

  return (
    <>
      <h1>Kondisi batch hari ini</h1>
      <p className="lede">
        {sinkronTerbaru ? `${formatTanggal(sinkronTerbaru)}. ` : ""}
        {semua.length} batch sedang berjalan. Yang ditampilkan paling atas adalah yang paling
        membutuhkan perhatian.
      </p>

      <div className="summary-strip">
        <div className="summary-cell">
          <p className="summary-value">{semua.length}</p>
          <p className="summary-label">Batch berjalan</p>
        </div>
        <div className="summary-cell">
          <p className="summary-value red">{mendesak.length}</p>
          <p className="summary-label">Perlu ditindak sekarang</p>
        </div>
        <div className="summary-cell">
          <p className="summary-value amber">{pantau.length}</p>
          <p className="summary-label">Perlu dipantau</p>
        </div>
        <div className="summary-cell">
          <p className="summary-value green">{aman.length}</p>
          <p className="summary-label">Aman</p>
        </div>
      </div>

      <h2>Perlu ditindak sekarang</h2>
      {mendesak.length === 0 ? (
        <p className="empty-note">Tidak ada batch yang mendesak saat ini.</p>
      ) : (
        mendesak.map((r) => <KartuTindakan key={r.batch.id} r={r} kelas="urgent" />)
      )}

      {pantau.length > 0 && (
        <>
          <h2>Perlu dipantau</h2>
          {pantau.map((r) => (
            <KartuTindakan key={r.batch.id} r={r} kelas="watch" />
          ))}
        </>
      )}

      <h2>Urutan jual duluan</h2>
      <ol className="rank-list">
        {semua.slice(0, 5).map((r, i) => (
          <li key={r.batch.id}>
            <Link className="rank-row" href={`/batch/${r.batch.id}`}>
              <span className="rank-num">{i + 1}</span>
              <span className="rank-main">
                <span className="rank-title">
                  <span className={`dot dot-${r.batch.komoditas}`} />
                  {NAMA_KOMODITAS[r.batch.komoditas]} {r.batch.id}
                </span>
                <br />
                <span className="rank-reason">{r.alasanPrioritas.join(" · ")}</span>
              </span>
              <StatusChip status={r.status} />
            </Link>
          </li>
        ))}
      </ol>
      <Link className="detail-link" href="/prioritas">
        Lihat urutan lengkap
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </Link>

      <h2>Semua batch</h2>
      <ul className="plain-list">
        {semua.map((r) => (
          <li key={r.batch.id}>
            <Link className="plain-row" href={`/batch/${r.batch.id}`}>
              <span className="rank-main">
                <span className="rank-title">
                  <span className={`dot dot-${r.batch.komoditas}`} />
                  {NAMA_KOMODITAS[r.batch.komoditas]} {r.batch.id}
                </span>
                <span className="rank-reason">
                  di tangan {r.pemegangNama} · {formatKg(r.beratSaatIniKg)}
                </span>
              </span>
              {r.sinkronTerakhir && (
                <span className="freshness">data terakhir {formatWaktu(r.sinkronTerakhir)}</span>
              )}
              <StatusChip status={r.status} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
