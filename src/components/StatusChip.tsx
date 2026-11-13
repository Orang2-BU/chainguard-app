import { CircleCheck, Eye, TriangleAlert } from "lucide-react";
import type { StatusBatch } from "@/lib/types";

// Ikon dari Lucide, pustaka ikon open-source yang diagregasi
// 21st.dev/icons dan dipakai komponen-komponen 21st.dev.
const IKON: Record<StatusBatch, typeof CircleCheck> = {
  aman: CircleCheck,
  pantau: Eye,
  mendesak: TriangleAlert,
};

const LABEL: Record<StatusBatch, string> = {
  aman: "Aman",
  pantau: "Perlu dipantau",
  mendesak: "Perlu ditindak sekarang",
};

export default function StatusChip({ status }: { status: StatusBatch }) {
  const Ikon = IKON[status];
  return (
    <span className={`chip chip-${status}`}>
      <Ikon size={14} strokeWidth={2.2} aria-hidden="true" />
      {LABEL[status]}
    </span>
  );
}
