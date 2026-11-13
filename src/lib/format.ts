const fmtWaktu = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const fmtTanggal = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatWaktu(iso: string): string {
  return fmtWaktu.format(new Date(iso)).replace(".", ":") + " WIB";
}

export function formatTanggal(iso: string): string {
  return fmtTanggal.format(new Date(iso));
}

export function formatDurasi(menit: number): string {
  const m = Math.round(menit);
  if (m < 60) return `${m} menit`;
  const jam = Math.floor(m / 60);
  const sisa = m % 60;
  return sisa === 0 ? `${jam} jam` : `${jam} jam ${sisa} menit`;
}

export function formatUmur(jam: number): string {
  if (jam < 24) return `${Math.floor(jam)} jam`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari`;
}

export function formatKg(kg: number): string {
  return kg.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " kg";
}

export function formatPersen(p: number): string {
  return p.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "%";
}
