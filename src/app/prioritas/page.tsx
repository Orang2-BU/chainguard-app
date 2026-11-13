import Link from "next/link";
import StatusChip from "@/components/StatusChip";
import { semuaRingkasan } from "@/lib/store";
import { formatKg } from "@/lib/format";

export const dynamic = "force-dynamic";

const NAMA_KOMODITAS: Record<string, string> = {
  cabai: "Cabai",
  bawang_merah: "Bawang merah",
};

export default function Prioritas() {
  const semua = semuaRingkasan();
  return (
    <>
      <Link className="back-link" href="/">
        Kembali ke beranda
      </Link>
      <h1 style={{ marginTop: 10 }}>Urutan jual duluan</h1>
      <p className="lede">
        Batch di urutan atas sebaiknya dijual lebih dulu. Urutan dihitung dari tiga hal: berapa lama
        batch sempat kepanasan atau terlalu lembap, berapa hari sejak panen, dan berapa banyak
        beratnya turun. Alasannya ditulis di tiap baris.
      </p>
      <ol className="rank-list" style={{ marginTop: 20 }}>
        {semua.map((r, i) => (
          <li key={r.batch.id}>
            <Link className="rank-row" href={`/batch/${r.batch.id}`}>
              <span className="rank-num">{i + 1}</span>
              <span className="rank-main">
                <span className="rank-title">
                  <span className={`dot dot-${r.batch.komoditas}`} />
                  {NAMA_KOMODITAS[r.batch.komoditas]} {r.batch.id}
                </span>
                <br />
                <span className="rank-reason">
                  {r.alasanPrioritas.join(" · ")} · di tangan {r.pemegangNama} ·{" "}
                  {formatKg(r.beratSaatIniKg)}
                </span>
              </span>
              <StatusChip status={r.status} />
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
