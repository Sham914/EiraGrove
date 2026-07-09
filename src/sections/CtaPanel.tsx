"use client";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site.config";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { smoothstep } from "@/utils/math";

export function CtaPanel() {
  const progress = useScrollProgress();
  const visible = smoothstep(0.84, 0.94, progress);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:pb-24">
      <div className="pointer-events-auto w-full max-w-2xl rounded-[2rem] border border-grove-gold/15 bg-grove-night/70 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-body text-xs uppercase tracking-luxury text-grove-gold/90 sm:text-sm">
            {siteConfig.cta.explore}
          </p>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-light text-grove-cream sm:text-4xl">
              {siteConfig.cta.reserveHeadline}
            </h2>
            <p className="font-body max-w-md text-sm leading-relaxed text-grove-cream/65 sm:text-base">
              {siteConfig.cta.reserveSubheadline}
            </p>
          </div>
          <WhatsAppButton
            visible={visible > 0.1}
            className="w-full justify-center sm:w-auto sm:min-w-[18rem]"
          />
        </div>
      </div>
    </div>
  );
}
