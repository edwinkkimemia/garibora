"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

function XIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/** Brand-colour share buttons: WhatsApp, X, Facebook + copy link. */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const share = (network: "whatsapp" | "x" | "facebook") => {
    const url = typeof window !== "undefined" ? window.location.href : path;
    const text = `${title} — on Motiva`;
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    window.open(links[network], "_blank", "noopener,width=600,height=540");
  };

  return (
    <div className="flex items-center gap-1.5" aria-label="Share this listing">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share</span>
      <button onClick={() => share("whatsapp")} aria-label="Share on WhatsApp" title="WhatsApp"
        className="grid size-9 place-items-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:scale-105"><WhatsAppIcon className="size-4" /></button>
      <button onClick={() => share("x")} aria-label="Share on X" title="X"
        className="grid size-9 place-items-center rounded-full bg-black text-white shadow-sm transition hover:scale-105"><XIcon /></button>
      <button onClick={() => share("facebook")} aria-label="Share on Facebook" title="Facebook"
        className="grid size-9 place-items-center rounded-full bg-[#1877F2] text-white shadow-sm transition hover:scale-105"><FacebookIcon /></button>
      <button
        aria-label="Copy link" title="Copy link"
        onClick={async () => {
          try { await navigator.clipboard.writeText(window.location.href); } catch { /* clipboard unavailable */ }
          setCopied(true); setTimeout(() => setCopied(false), 1500);
        }}
        className="grid size-9 place-items-center rounded-full border bg-background shadow-sm transition hover:scale-105">
        {copied ? <Check className="size-4 text-emerald-600" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
