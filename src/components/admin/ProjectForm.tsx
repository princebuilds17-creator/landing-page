"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/types";
import { generateSlug, validateSlug, validateExternalUrl } from "@/lib/validation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [category, setCategory] = useState(initialData?.category || "Web Development");
  const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || "");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft");
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder || 1);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");

  // Interaction states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Auto-generate slug from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (submitStatus: "draft" | "published") => {
    setServerError(null);
    setErrors({});

    // Client-side quick checks
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Nama proyek wajib diisi";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug proyek wajib diisi";
    } else {
      const slugVal = validateSlug(slug);
      if (!slugVal.valid) {
        newErrors.slug = slugVal.error!;
      }
    }

    if (!summary.trim()) {
      newErrors.summary = "Ringkasan proyek wajib diisi untuk katalog";
    }

    if (image.trim() && !imageAlt.trim()) {
      newErrors.imageAlt = "Alt text wajib diisi jika gambar disertakan untuk standar aksesibilitas";
    }

    if (externalUrl.trim()) {
      const extVal = validateExternalUrl(externalUrl);
      if (!extVal.valid) {
        newErrors.externalUrl = extVal.error!;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title,
        slug,
        summary,
        description,
        image,
        imageAlt,
        category,
        externalUrl,
        status: submitStatus,
        sortOrder: Number(sortOrder) || 1,
        seoTitle,
        seoDescription,
      };

      const url = isEditing
        ? `/api/admin/projects/${initialData?.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error || "Gagal menyimpan proyek ke server.");
        }
        setIsSaving(false);
        return;
      }

      setIsDirty(false);
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setServerError("Terjadi gangguan jaringan saat menyimpan data proyek.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Proyek</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {isEditing ? `Edit Proyek: ${initialData?.title}` : "Buat Proyek Baru"}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-xl transition-colors disabled:opacity-50 min-h-[42px]"
          >
            <Clock className="w-3.5 h-3.5 text-warning" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-colors shadow-md shadow-primary/20 disabled:opacity-50 min-h-[42px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : "Publikasikan"}</span>
          </button>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-3 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Gagal Menyimpan</span>
            <p className="leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Informasi Utama Proyek
            </h2>

            {/* Nama Proyek */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs font-mono font-medium text-text-secondary">
                Nama Proyek <span className="text-danger">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: MotoCheck Diagnostics"
                className={`w-full px-4 py-2.5 bg-surface-elevated border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:ring-1 outline-none transition-colors ${
                  errors.title
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-danger font-mono mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="slug" className="block text-xs font-mono font-medium text-text-secondary">
                  Slug URL <span className="text-danger">*</span>
                </label>
                <span className="text-[11px] font-mono text-text-muted">
                  /projects/<span className="text-primary">{slug || "..."}</span>
                </span>
              </div>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                  setIsDirty(true);
                }}
                placeholder="motocheck-diagnostics"
                className={`w-full px-4 py-2.5 bg-surface-elevated border rounded-xl text-sm font-mono text-text-primary placeholder:text-text-muted focus:ring-1 outline-none transition-colors ${
                  errors.slug
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.slug && (
                <p className="text-xs text-danger font-mono mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Ringkasan Proyek */}
            <div className="space-y-1.5">
              <label htmlFor="summary" className="block text-xs font-mono font-medium text-text-secondary">
                Ringkasan Singkat (Summary) <span className="text-danger">*</span>
              </label>
              <textarea
                id="summary"
                rows={3}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Deskripsi singkat yang tampil pada kartu proyek (1-2 kalimat padat)..."
                className={`w-full px-4 py-2.5 bg-surface-elevated border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:ring-1 outline-none transition-colors ${
                  errors.summary
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.summary && (
                <p className="text-xs text-danger font-mono mt-1">{errors.summary}</p>
              )}
            </div>

            {/* Deskripsi Lengkap */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-xs font-mono font-medium text-text-secondary">
                  Dokumentasi &amp; Spesifikasi Lengkap (Markdown didukung)
                </label>
                <span className="text-[11px] font-mono text-text-muted">Opsional</span>
              </div>
              <textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Jelaskan arsitektur teknis, tujuan belajar, modul sistem, dan tantangan pengembangan..."
                className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Media & Visual Asset */}
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Media &amp; Thumbnail
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="image" className="block text-xs font-mono font-medium text-text-secondary">
                  Path / URL Gambar Mockup
                </label>
                <input
                  id="image"
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="/images/teaser/1.png atau URL"
                  className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="imageAlt" className="block text-xs font-mono font-medium text-text-secondary">
                  Alt Text Aksesibilitas {image.trim() && <span className="text-danger">*</span>}
                </label>
                <input
                  id="imageAlt"
                  type="text"
                  value={imageAlt}
                  onChange={(e) => {
                    setImageAlt(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Deskripsi makna gambar untuk screen reader"
                  className={`w-full px-4 py-2.5 bg-surface-elevated border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:ring-1 outline-none transition-colors ${
                    errors.imageAlt
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
                {errors.imageAlt && (
                  <p className="text-xs text-danger font-mono mt-1">{errors.imageAlt}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Metadata &amp; Taksonomi
            </h2>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-mono font-medium text-text-secondary">
                Kategori Proyek
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Web Development">Web Development</option>
                <option value="Design System">Design System</option>
                <option value="Backend Fundamentals">Backend Fundamentals</option>
                <option value="AI Research">AI Research</option>
                <option value="Mobile Engineering">Mobile Engineering</option>
                <option value="Open Source Tooling">Open Source Tooling</option>
              </select>
            </div>

            {/* Urutan Tampil (Sort Order) */}
            <div className="space-y-1.5">
              <label htmlFor="sortOrder" className="block text-xs font-mono font-medium text-text-secondary">
                Urutan Tampil (Sort Order)
              </label>
              <input
                id="sortOrder"
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(Number(e.target.value));
                  setIsDirty(true);
                }}
                className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-xl text-sm font-mono text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <span className="text-[11px] text-text-muted font-mono block">
                Angka lebih kecil tampil lebih awal
              </span>
            </div>

            {/* External URL */}
            <div className="space-y-1.5">
              <label htmlFor="externalUrl" className="block text-xs font-mono font-medium text-text-secondary">
                Tautan Eksternal (Opsional)
              </label>
              <input
                id="externalUrl"
                type="url"
                value={externalUrl}
                onChange={(e) => {
                  setExternalUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="https://..."
                className={`w-full px-4 py-2 bg-surface-elevated border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:ring-1 outline-none ${
                  errors.externalUrl
                    ? "border-danger focus:border-danger focus:ring-danger"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {errors.externalUrl && (
                <p className="text-xs text-danger font-mono mt-1">{errors.externalUrl}</p>
              )}
            </div>

            {/* SEO Metadata */}
            <div className="pt-4 border-t border-border space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold block">
                SEO &amp; Berbagi
              </span>

              <div className="space-y-1.5">
                <label htmlFor="seoTitle" className="block text-xs font-mono font-medium text-text-secondary">
                  SEO Title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Fallback ke nama proyek"
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="seoDescription" className="block text-xs font-mono font-medium text-text-secondary">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Fallback ke ringkasan proyek"
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
