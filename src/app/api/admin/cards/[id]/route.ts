import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { validateInstagramUrl } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const card = storage.getContentCardById(id);
  if (!card) {
    return NextResponse.json({ error: "Content card tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ card });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      summary,
      publisherName,
      instagramUrl,
      projectId,
      thumbnail,
      thumbnailAlt,
      contentDate,
      category,
      status,
      isFeatured,
      sortOrder,
    } = body;

    const errors: Record<string, string> = {};

    if (title !== undefined && !title.trim()) {
      errors.title = "Judul content card tidak boleh kosong";
    }

    if (summary !== undefined && !summary.trim()) {
      errors.summary = "Ringkasan konten tidak boleh kosong";
    }

    if (publisherName !== undefined && !publisherName.trim()) {
      errors.publisherName = "Nama publisher tidak boleh kosong";
    }

    if (instagramUrl !== undefined) {
      const igValidation = validateInstagramUrl(instagramUrl);
      if (!igValidation.valid) {
        errors.instagramUrl = igValidation.error!;
      }
    }

    if (projectId && projectId.trim()) {
      const projectExists = storage.getProjectById(projectId);
      if (!projectExists) {
        errors.projectId = "Proyek yang dipilih tidak valid";
      }
    }

    if (thumbnail && thumbnail.trim() && (!thumbnailAlt || !thumbnailAlt.trim())) {
      errors.thumbnailAlt = "Alt text wajib diisi jika thumbnail informatif digunakan";
    }

    if (status && status !== "draft" && status !== "published") {
      errors.status = "Status harus 'draft' atau 'published'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const updated = storage.updateContentCard(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(summary !== undefined && { summary: summary.trim() }),
      ...(publisherName !== undefined && { publisherName: publisherName.trim() }),
      ...(instagramUrl !== undefined && { instagramUrl: instagramUrl.trim() }),
      ...(projectId !== undefined && { projectId: projectId && projectId.trim() ? projectId : null }),
      ...(thumbnail !== undefined && { thumbnail: thumbnail.trim() }),
      ...(thumbnailAlt !== undefined && { thumbnailAlt: thumbnailAlt.trim() }),
      ...(contentDate !== undefined && { contentDate: contentDate.trim() }),
      ...(category !== undefined && { category: category.trim() }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui content card" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    storage.deleteContentCard(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal menghapus content card" },
      { status: 400 }
    );
  }
}
