import { NextResponse } from "next/server";
import { tambahSerahTerima } from "@/lib/store";

export const dynamic = "force-dynamic";

// Pencatatan serah terima dari aplikasi pelaku (hasil scan QR di wadah).
// Boleh dikirim telat: aplikasi pelaku juga mengantre saat tidak ada sinyal.
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const st = tambahSerahTerima(payload);
    return NextResponse.json({ ok: true, serah_terima: st });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Payload tidak valid." },
      { status: 400 },
    );
  }
}
