import { BACAAN_AWAL, BATCHES, PELAKU, SERAH_TERIMA } from "./seed";
import { hitungLegs, ringkasBatch } from "./logic";
import type { Bacaan, Batch, Pelaku, RingkasanBatch, RingkasanLeg, SerahTerima } from "./types";

// Store in-memory untuk prototipe. Data contoh dimuat dari seed.ts.
// Kiriman dari logger dan aplikasi serah terima masuk lewat API dan
// menambah data di sini. Untuk produksi, ganti isi store ini dengan
// database; kontrak API dan logika ringkasan tidak berubah.

interface Store {
  pelaku: Map<string, Pelaku>;
  batches: Map<string, Batch>;
  bacaan: Map<string, Bacaan[]>;
  serahTerima: Map<string, SerahTerima[]>;
}

function buatStore(): Store {
  const bacaan = new Map<string, Bacaan[]>();
  for (const b of BACAAN_AWAL) {
    const arr = bacaan.get(b.batchId) ?? [];
    arr.push(b);
    bacaan.set(b.batchId, arr);
  }
  const serahTerima = new Map<string, SerahTerima[]>();
  for (const st of SERAH_TERIMA) {
    const arr = serahTerima.get(st.batchId) ?? [];
    arr.push(st);
    serahTerima.set(st.batchId, arr);
  }
  return {
    pelaku: new Map(PELAKU.map((p) => [p.id, p])),
    batches: new Map(BATCHES.map((b) => [b.id, b])),
    bacaan,
    serahTerima,
  };
}

const globalStore = globalThis as unknown as { __cgStore?: Store };

function store(): Store {
  if (!globalStore.__cgStore) globalStore.__cgStore = buatStore();
  return globalStore.__cgStore;
}

export function semuaRingkasan(): RingkasanBatch[] {
  const s = store();
  return [...s.batches.values()]
    .map((b) => ringkasBatch(b, s.pelaku, s.serahTerima.get(b.id) ?? [], s.bacaan.get(b.id) ?? []))
    .sort((a, b) => b.skorPrioritas - a.skorPrioritas);
}

export interface DetailBatch {
  ringkasan: RingkasanBatch;
  bacaan: Bacaan[];
  serahTerima: SerahTerima[];
  legs: RingkasanLeg[];
  petaniNama: string;
}

export function detailBatch(id: string): DetailBatch | null {
  const s = store();
  const batch = s.batches.get(id);
  if (!batch) return null;
  const bacaan = [...(s.bacaan.get(id) ?? [])].sort((a, b) => a.ts.localeCompare(b.ts));
  const serahTerima = [...(s.serahTerima.get(id) ?? [])].sort((a, b) => a.waktu.localeCompare(b.waktu));
  return {
    ringkasan: ringkasBatch(batch, s.pelaku, serahTerima, bacaan),
    bacaan,
    serahTerima,
    legs: hitungLegs(batch, s.pelaku, serahTerima, bacaan),
    petaniNama: s.pelaku.get(batch.petaniId)?.nama ?? batch.petaniId,
  };
}

export interface HasilIngest {
  diterima: number;
  duplikat: number;
  ackSeq: number;
}

export function tambahBacaan(payload: {
  device_id?: string;
  batch_id?: string;
  readings?: { seq?: number; ts?: string; suhu?: number; rh?: number }[];
}): HasilIngest {
  const s = store();
  if (!payload.batch_id || !payload.device_id || !Array.isArray(payload.readings)) {
    throw new Error("Payload tidak lengkap: wajib ada device_id, batch_id, readings.");
  }
  const batch = s.batches.get(payload.batch_id);
  if (!batch) throw new Error(`Batch ${payload.batch_id} tidak dikenal.`);
  if (batch.loggerId !== payload.device_id) {
    throw new Error(`Alat ${payload.device_id} tidak terdaftar untuk batch ${payload.batch_id}.`);
  }
  const arr = s.bacaan.get(batch.id) ?? [];
  const sudahAda = new Set(arr.filter((b) => b.deviceId === payload.device_id).map((b) => b.seq));
  let diterima = 0;
  let duplikat = 0;
  for (const r of payload.readings) {
    if (typeof r.seq !== "number" || !r.ts || typeof r.suhu !== "number" || typeof r.rh !== "number") {
      throw new Error("Setiap bacaan wajib punya seq, ts, suhu, rh.");
    }
    if (sudahAda.has(r.seq)) {
      duplikat += 1;
      continue;
    }
    sudahAda.add(r.seq);
    arr.push({ deviceId: payload.device_id, batchId: batch.id, seq: r.seq, ts: r.ts, suhu: r.suhu, rh: r.rh });
    diterima += 1;
  }
  arr.sort((a, b) => a.ts.localeCompare(b.ts));
  s.bacaan.set(batch.id, arr);
  const ackSeq = arr.filter((b) => b.deviceId === payload.device_id).reduce((m, b) => Math.max(m, b.seq), 0);
  return { diterima, duplikat, ackSeq };
}

export function tambahSerahTerima(payload: {
  batch_id?: string;
  dari_id?: string | null;
  ke_id?: string;
  waktu?: string;
  berat_kg?: number;
  lokasi?: string;
}): SerahTerima {
  const s = store();
  if (!payload.batch_id || !payload.ke_id || !payload.waktu || typeof payload.berat_kg !== "number") {
    throw new Error("Payload tidak lengkap: wajib ada batch_id, ke_id, waktu, berat_kg.");
  }
  if (!s.batches.has(payload.batch_id)) throw new Error(`Batch ${payload.batch_id} tidak dikenal.`);
  if (!s.pelaku.has(payload.ke_id)) throw new Error(`Pelaku ${payload.ke_id} tidak dikenal.`);
  if (payload.dari_id && !s.pelaku.has(payload.dari_id)) {
    throw new Error(`Pelaku ${payload.dari_id} tidak dikenal.`);
  }
  const st: SerahTerima = {
    id: `ST-${Date.now()}`,
    batchId: payload.batch_id,
    dariId: payload.dari_id ?? null,
    keId: payload.ke_id,
    waktu: payload.waktu,
    beratKg: payload.berat_kg,
    lokasi: payload.lokasi ?? "",
  };
  const arr = s.serahTerima.get(st.batchId) ?? [];
  arr.push(st);
  s.serahTerima.set(st.batchId, arr);
  return st;
}

export function namaPelakuPublik(id: string): string {
  return store().pelaku.get(id)?.nama ?? id;
}
