import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { validateSlug, validateExternalUrl } from "@/lib/validation";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = storage.getProjects({ includeDrafts: true });
  return NextResponse.json({ projects });
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
      slug,
      summary,
      description,
      image,
      imageAlt,
      category,
      externalUrl,
      status,
      seoTitle,
      seoDescription,
    } = body;

    const errors: Record<string, string> = {};

    if (!title || !title.trim()) {
      errors.title = "Nama proyek wajib diisi";
    }

    if (!slug || !slug.trim()) {
      errors.slug = "Slug proyek wajib diisi";
    } else {
      const slugValidation = validateSlug(slug);
      if (!slugValidation.valid) {
        errors.slug = slugValidation.error!;
      }
    }

    if (!summary || !summary.trim()) {
      errors.summary = "Ringkasan proyek wajib diisi";
    }

    if (image && image.trim() && (!imageAlt || !imageAlt.trim())) {
      errors.imageAlt = "Alt text wajib diisi jika gambar proyek disertakan untuk aksesibilitas (WCAG)";
    }

    if (externalUrl && externalUrl.trim()) {
      const urlValidation = validateExternalUrl(externalUrl);
      if (!urlValidation.valid) {
        errors.externalUrl = urlValidation.error!;
      }
    }

    if (status !== "draft" && status !== "published") {
      errors.status = "Status harus 'draft' atau 'published'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const created = storage.createProject({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      summary: summary.trim(),
      description: description ? description.trim() : undefined,
      image: image ? image.trim() : undefined,
      imageAlt: imageAlt ? imageAlt.trim() : undefined,
      category: category ? category.trim() : undefined,
      externalUrl: externalUrl ? externalUrl.trim() : undefined,
      status: status || "draft",
      sortOrder: body.sortOrder,
      seoTitle: seoTitle ? seoTitle.trim() : undefined,
      seoDescription: seoDescription ? seoDescription.trim() : undefined,
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat proyek" },
      { status: 400 }
    );
  }
}
