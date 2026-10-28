import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { validateInstagramUrl } from "@/lib/validation";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = storage.getContentCards({ includeDrafts: true });
  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (!title || !title.trim()) {
      errors.title = "Judul content card wajib diisi";
    }

    if (!summary || !summary.trim()) {
      errors.summary = "Ringkasan konten wajib diisi";
    }

    if (!publisherName || !publisherName.trim()) {
      errors.publisherName = "Nama akun / publisher Instagram wajib diisi (contoh: @princee.lab)";
    }

    if (!instagramUrl || !instagramUrl.trim()) {
      errors.instagramUrl = "URL postingan / profil Instagram wajib diisi";
    } else {
      const igValidation = validateInstagramUrl(instagramUrl);
      if (!igValidation.valid) {
        errors.instagramUrl = igValidation.error!;
      }
    }

    if (projectId && projectId.trim()) {
      const projectExists = storage.getProjectById(projectId);
      if (!projectExists) {
        errors.projectId = "Proyek yang dipilih tidak valid atau sudah dihapus";
      }
    }

    if (thumbnail && thumbnail.trim() && (!thumbnailAlt || !thumbnailAlt.trim())) {
      errors.thumbnailAlt = "Alt text wajib diisi jika thumbnail informatif digunakan";
    }

    if (status !== "draft" && status !== "published") {
      errors.status = "Status harus 'draft' atau 'published'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const created = storage.createContentCard({
      title: title.trim(),
      summary: summary.trim(),
      publisherName: publisherName.trim(),
      instagramUrl: instagramUrl.trim(),
      projectId: projectId && projectId.trim() ? projectId : null,
      thumbnail: thumbnail ? thumbnail.trim() : undefined,
      thumbnailAlt: thumbnailAlt ? thumbnailAlt.trim() : undefined,
      contentDate: contentDate ? contentDate.trim() : undefined,
      category: category ? category.trim() : undefined,
      status: status || "draft",
      isFeatured: Boolean(isFeatured),
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
    });

    return NextResponse.json({ success: true, card: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat content card" },
      { status: 400 }
    );
  }
}
