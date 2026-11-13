// Komponen Logo mengikuti pola komponen brand di paket UI 21st.dev
// (mark SVG + wordmark dalam satu komponen bertipe, dengan varian).
// Mark ChainGuard: tiga titik yang dihubungkan garis, rute satu batch
// menyusuri context graph dari panen sampai pasar.

interface LogoProps {
  ukuran?: number;
  denganWordmark?: boolean;
}

export default function Logo({ ukuran = 34, denganWordmark = true }: LogoProps) {
  return (
    <span className="logo">
      <svg width={ukuran} height={ukuran} viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="9" fill="#14532D" />
        <path
          d="M10 23 L17 10 L24 20"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="10" cy="23" r="3" fill="#FFFFFF" />
        <circle cx="17" cy="10" r="3" fill="#FFFFFF" />
        <circle cx="24" cy="20" r="3" fill="#F2B035" />
      </svg>
      {denganWordmark && <span className="logo-text">ChainGuard</span>}
    </span>
  );
}
