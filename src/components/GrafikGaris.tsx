import { JENDELA_AMAN } from "@/lib/thresholds";
import type { Bacaan, Komoditas } from "@/lib/types";

// Grafik garis SVG: satu panel suhu, satu panel kelembapan.
// Pita hijau muda bergaris putus-putus adalah jendela aman komoditas.
// Titik terakhir ditandai nilainya, sumbu waktu tertulis di bawah.

const W = 680;
const H = 176;
const KIRI = 40;
const KANAN = 52;
const ATAS = 12;
const BAWAH = 30;

const fmtJam = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function labelWaktu(iso: string): string {
  return fmtJam.format(new Date(iso)).replace(".", ":");
}

function Panel({
  judul,
  satuan,
  titikData,
  bandMin,
  bandMaks,
  warna,
}: {
  judul: string;
  satuan: string;
  titikData: { ts: string; v: number }[];
  bandMin: number;
  bandMaks: number;
  warna: string;
}) {
  const nilai = titikData.map((t) => t.v);
  const lo = Math.min(bandMin, ...nilai);
  const hi = Math.max(bandMaks, ...nilai);
  const rentang = Math.max(hi - lo, 1);
  const lebarPlot = W - KIRI - KANAN;
  const tinggiPlot = H - ATAS - BAWAH;
  const x = (i: number) => KIRI + (nilai.length <= 1 ? lebarPlot / 2 : (i / (nilai.length - 1)) * lebarPlot);
  const y = (v: number) => ATAS + (1 - (v - lo) / rentang) * tinggiPlot;
  const garis = nilai.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${garis} L${x(nilai.length - 1).toFixed(1)},${(ATAS + tinggiPlot).toFixed(1)} L${KANAN - KANAN + KIRI},${(ATAS + tinggiPlot).toFixed(1)} Z`;
  const terakhir = nilai[nilai.length - 1];
  const labelNilai = (v: number) => `${v.toLocaleString("id-ID")}${satuan}`;

  return (
    <div>
      <p className="chart-label">{judul}</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={judul}>
        <rect
          x={KIRI}
          y={y(bandMaks)}
          width={lebarPlot}
          height={Math.max(y(bandMin) - y(bandMaks), 2)}
          fill="#E9F4EC"
        />
        <line x1={KIRI} x2={KIRI + lebarPlot} y1={y(bandMaks)} y2={y(bandMaks)} stroke="#9DB8A4" strokeWidth={1} strokeDasharray="5 4" />
        <line x1={KIRI} x2={KIRI + lebarPlot} y1={y(bandMin)} y2={y(bandMin)} stroke="#9DB8A4" strokeWidth={1} strokeDasharray="5 4" />
        <text x={KIRI - 6} y={y(bandMaks) + 4} fontSize={12} fill="#66736A" textAnchor="end">
          {labelNilai(bandMaks)}
        </text>
        <text x={KIRI - 6} y={y(bandMin) + 4} fontSize={12} fill="#66736A" textAnchor="end">
          {labelNilai(bandMin)}
        </text>
        <path d={area} fill={warna} opacity={0.07} />
        <path d={garis} fill="none" stroke={warna} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(nilai.length - 1)} cy={y(terakhir)} r={4} fill={warna} stroke="#FFFFFF" strokeWidth={1.6} />
        <text x={x(nilai.length - 1) + 9} y={y(terakhir) + 4} fontSize={13} fontWeight={700} fill={warna}>
          {labelNilai(terakhir)}
        </text>
        <text x={KIRI} y={H - 8} fontSize={12} fill="#66736A">
          {titikData.length > 0 ? labelWaktu(titikData[0].ts) : ""}
        </text>
        <text x={KIRI + lebarPlot} y={H - 8} fontSize={12} fill="#66736A" textAnchor="end">
          {titikData.length > 0 ? labelWaktu(titikData[titikData.length - 1].ts) : ""}
        </text>
      </svg>
    </div>
  );
}

export default function GrafikGaris({ bacaan, komoditas }: { bacaan: Bacaan[]; komoditas: Komoditas }) {
  const langkah = Math.max(1, Math.floor(bacaan.length / 160));
  const contoh = bacaan.filter((_, i) => i % langkah === 0);
  const j = JENDELA_AMAN[komoditas];
  return (
    <div className="chart-box">
      <Panel
        judul="Suhu (°C)"
        satuan="°C"
        titikData={contoh.map((b) => ({ ts: b.ts, v: b.suhu }))}
        bandMin={j.suhuMin}
        bandMaks={j.suhuMaks}
        warna="#B3540A"
      />
      <Panel
        judul="Kelembapan udara (%)"
        satuan="%"
        titikData={contoh.map((b) => ({ ts: b.ts, v: b.rh }))}
        bandMin={j.rhMin}
        bandMaks={j.rhMaks}
        warna="#1C5F8A"
      />
      <p className="chart-note">
        Pita terang bergaris putus-putus adalah batas aman untuk komoditas ini (parameter contoh).
        Garis yang keluar dari pita berarti kondisi sempat tidak aman pada jam itu. Angka di ujung
        garis adalah bacaan terakhir dari alat.
      </p>
    </div>
  );
}
