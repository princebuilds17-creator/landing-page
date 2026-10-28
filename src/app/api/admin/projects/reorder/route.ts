import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Format payload tidak valid. Diperlukan array orderedIds." },
        { status: 400 }
      );
    }

    const reordered = storage.reorderProjects(orderedIds);
    return NextResponse.json({ success: true, projects: reordered });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal mengurutkan proyek" },
      { status: 500 }
    );
  }
}
