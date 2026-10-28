import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { validateSlug, validateExternalUrl } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = storage.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ project });
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
      slug,
      summary,
      description,
      image,
      imageAlt,
      category,
      externalUrl,
      status,
      sortOrder,
      seoTitle,
      seoDescription,
    } = body;

    const errors: Record<string, string> = {};

    if (title !== undefined && !title.trim()) {
      errors.title = "Nama proyek tidak boleh kosong";
    }

    if (slug !== undefined) {
      const slugValidation = validateSlug(slug);
      if (!slugValidation.valid) {
        errors.slug = slugValidation.error!;
      }
    }

    if (summary !== undefined && !summary.trim()) {
      errors.summary = "Ringkasan proyek tidak boleh kosong";
    }

    if (image && image.trim() && (!imageAlt || !imageAlt.trim())) {
      errors.imageAlt = "Alt text wajib diisi jika gambar proyek disertakan";
    }

    if (externalUrl && externalUrl.trim()) {
      const urlValidation = validateExternalUrl(externalUrl);
      if (!urlValidation.valid) {
        errors.externalUrl = urlValidation.error!;
      }
    }

    if (status && status !== "draft" && status !== "published") {
      errors.status = "Status harus 'draft' atau 'published'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const updated = storage.updateProject(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(slug !== undefined && { slug: slug.trim().toLowerCase() }),
      ...(summary !== undefined && { summary: summary.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(image !== undefined && { image: image.trim() }),
      ...(imageAlt !== undefined && { imageAlt: imageAlt.trim() }),
      ...(category !== undefined && { category: category.trim() }),
      ...(externalUrl !== undefined && { externalUrl: externalUrl.trim() }),
      ...(status !== undefined && { status }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      ...(seoTitle !== undefined && { seoTitle: seoTitle.trim() }),
      ...(seoDescription !== undefined && { seoDescription: seoDescription.trim() }),
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui proyek" },
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
  const url = new URL(request.url);
  const detach = url.searchParams.get("detach") === "true";

  try {
    const result = storage.deleteProject(id, { detachCards: detach });
    if (!result.success) {
      return NextResponse.json(
        {
          error: `Tidak dapat menghapus proyek karena masih terhubung dengan ${result.linkedCardsCount} content card (${result.cardTitles.join(", ")}). Harap lepaskan atau pindahkan relasi card terlebih dahulu.`,
          linkedCardsCount: result.linkedCardsCount,
          cardTitles: result.cardTitles,
          canDetach: true,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, detachedCount: result.detachedCount || 0 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal menghapus proyek" },
      { status: 400 }
    );
  }
}
