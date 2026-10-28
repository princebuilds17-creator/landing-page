import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, targetId, targetSlug, targetUrl, path } = body;

    // Allowed event types according to PRD FR-12
    const validEvents = ["page_view", "project_view", "instagram_outbound_click"];
    if (!eventType || !validEvents.includes(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    storage.recordAnalytics({
      eventType,
      targetId: typeof targetId === "string" ? targetId.slice(0, 50) : undefined,
      targetSlug: typeof targetSlug === "string" ? targetSlug.slice(0, 100) : undefined,
      targetUrl: typeof targetUrl === "string" ? targetUrl.slice(0, 255) : undefined,
      path: typeof path === "string" ? path.slice(0, 100) : "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 });
  }
}
