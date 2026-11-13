import type { Komoditas } from "./types";

// Jendela aman dua sisi per komoditas.
// Status parameter: CONTOH untuk demo perangkat lunak.
// - Bawang merah: RH ideal 65-70% mengikuti proposal tim (rujukan [7] di proposal).
// - Angka lain: placeholder wajar untuk pengujian, WAJIB dikunci ulang dari
//   literatur dan kesepakatan pelaku sebelum uji lapangan. Jangan kutip angka
//   di file ini sebagai fakta agronomi.
export interface JendelaAman {
  suhuMin: number;
  suhuMaks: number;
  rhMin: number;
  rhMaks: number;
}

export const JENDELA_AMAN: Record<Komoditas, JendelaAman> = {
  cabai: { suhuMin: 18, suhuMaks: 32, rhMin: 60, rhMaks: 90 },
  bawang_merah: { suhuMin: 25, suhuMaks: 32, rhMin: 65, rhMaks: 70 },
};

// Ambang durasi paparan (menit kumulatif) untuk status dan notifikasi.
// Juga parameter contoh, dikunci bersama pelaku saat pilot.
export const MENIT_PANTAU = 45;
export const MENIT_MENDESAK = 120;
