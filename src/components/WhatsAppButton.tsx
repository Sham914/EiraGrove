"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site.config";

interface WhatsAppButtonProps {
  visible?: boolean;
}

export function WhatsAppButton({ visible = true }: WhatsAppButtonProps) {
  const { whatsapp } = siteConfig;
  const href = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto inline-flex items-center gap-3 rounded-full border border-grove-gold/40 bg-grove-charcoal/80 px-8 py-4 font-body text-sm uppercase tracking-luxury text-grove-cream backdrop-blur-md transition-all duration-500 hover:border-grove-gold hover:bg-grove-gold/10 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      aria-label={whatsapp.label}
    >
      <MessageCircle className="h-5 w-5 text-grove-gold" strokeWidth={1.5} />
      {whatsapp.label}
    </a>
  );
}
