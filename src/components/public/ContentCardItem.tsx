"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { ContentCard } from "@/types";

interface ContentCardProps {
  card: ContentCard;
}

export function ContentCardItem({ card }: ContentCardProps) {
  const handleOutboundClick = () => {
    // Record outbound analytics non-blocking
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "instagram_outbound_click",
          targetId: card.id,
          targetUrl: card.instagramUrl,
          path: window.location.pathname,
        }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <a
      href={card.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleOutboundClick}
      className="group relative flex flex-col bg-surface hover:bg-surface-hover border border-border hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm hover:shadow-lg hover:shadow-primary/5"
      aria-label={`Buka konten Instagram: ${card.title} oleh ${card.publisherName} (buka tab baru)`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-surface-elevated overflow-hidden border-b border-border/60">
        {card.thumbnail ? (
          <Image
            src={card.thumbnail}
            alt={card.thumbnailAlt || `Thumbnail untuk konten ${card.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2 bg-gradient-to-br from-surface to-surface-elevated">
            <InstagramIcon className="w-8 h-8 opacity-40 text-primary" />
            <span className="text-xs font-mono">PRINCE LAB Content</span>
          </div>
        )}

        {/* Publisher Pill Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas/85 backdrop-blur-md border border-border/80 text-xs font-mono font-medium text-text-primary">
          <InstagramIcon className="w-3.5 h-3.5 text-primary" />
          <span>{card.publisherName}</span>
        </div>

        {/* External Link Pill */}
        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-canvas/85 backdrop-blur-md border border-border/80 text-text-secondary group-hover:text-primary transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {card.category && (
            <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
              {card.category}
            </span>
          )}
          <h3 className="font-semibold text-base text-text-primary group-hover:text-primary transition-colors leading-snug">
            {card.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {card.summary}
          </p>
        </div>

        {/* Card Footer Info */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted font-mono">
          <span>{card.contentDate ? `Diposting: ${card.contentDate}` : "Instagram Post"}</span>
          <span className="text-primary group-hover:underline flex items-center gap-1">
            Buka di Instagram
          </span>
        </div>
      </div>
    </a>
  );
}
