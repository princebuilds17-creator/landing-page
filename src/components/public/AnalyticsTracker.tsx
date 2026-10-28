"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  eventType?: "page_view" | "project_view";
  targetSlug?: string;
  targetId?: string;
}

export function AnalyticsTracker({
  eventType = "page_view",
  targetSlug,
  targetId,
}: AnalyticsTrackerProps) {
  useEffect(() => {
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          targetSlug,
          targetId,
          path: window.location.pathname,
        }),
      }).catch(() => {});
    } catch {}
  }, [eventType, targetSlug, targetId]);

  return null;
}
