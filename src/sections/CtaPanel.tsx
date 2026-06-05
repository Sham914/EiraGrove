"use client";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { smoothstep } from "@/utils/math";

export function CtaPanel() {
  const progress = useScrollProgress();
  const visible = smoothstep(0.9, 0.95, progress);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-16 md:pb-24">
      <WhatsAppButton visible={visible > 0.1} />
    </div>
  );
}
