import { NextResponse } from "next/server";
import { detailBatch, tambahBacaan } from "@/lib/store";

export const dynamic = "force-dynamic";

// Titik masuk data logger (store-and-forward).
// Logger mengirim antrean bacaan saat dapat koneksi, server membalas
// ack_seq: semua baris lokal dengan seq <= ack_seq boleh dihapus alat.
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const hasil = tambahBacaan(payload);
    return NextResponse.json({ ok: true, ...hasil });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Payload tidak valid." },
      { status: 400 },
    );
  }
}

export async function GET(req: Request) {
  const batchId = new URL(req.url).searchParams.get("batch_id");
  if (!batchId) {
    return NextResponse.json({ ok: false, error: "Parameter batch_id wajib diisi." }, { status: 400 });
  }
  const detail = detailBatch(batchId);
  if (!detail) {
    return NextResponse.json({ ok: false, error: `Batch ${batchId} tidak dikenal.` }, { status: 404 });
  }
  return NextResponse.json({ ok: true, batch_id: batchId, readings: detail.bacaan });
}
