"use client";

import { siteConfig } from "@/config/site.config";

export function FallbackExperience() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-grove-night via-[#1a2838] to-grove-night px-6 text-center">
      <p className="font-body mb-4 text-xs uppercase tracking-luxury text-grove-gold">
        {siteConfig.location}
      </p>
      <h1 className="font-display mb-4 text-4xl font-light text-grove-cream md:text-6xl">
        {siteConfig.name}
      </h1>
      <p className="font-body mb-8 max-w-md text-sm text-grove-cream/60">
        {siteConfig.tagline}. Your browser could not load the 3D experience —
        explore our sanctuary below.
      </p>
      <a
        href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-grove-gold/40 px-8 py-3 font-body text-sm uppercase tracking-luxury text-grove-cream transition-colors hover:border-grove-gold"
      >
        {siteConfig.cta.primary}
      </a>
    </div>
  );
}
