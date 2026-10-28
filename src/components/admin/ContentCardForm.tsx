"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContentCard, Project } from "@/types";
import { validateInstagramUrl } from "@/lib/validation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  FolderGit2,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface ContentCardFormProps {
  initialData?: ContentCard;
  projects: Project[];
  isEditing?: boolean;
}

export function ContentCardForm({
  initialData,
  projects,
  isEditing = false,
}: ContentCardFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [publisherName, setPublisherName] = useState(
    initialData?.publisherName || "@princee.lab"
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialData?.instagramUrl || "https://www.instagram.com/princee.lab/"
  );
  const [projectId, setProjectId] = useState(initialData?.projectId || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [thumbnailAlt, setThumbnailAlt] = useState(initialData?.thumbnailAlt || "");
  const [contentDate, setContentDate] = useState(initialData?.contentDate || "");
  const [category, setCategory] = useState(initialData?.category || "Announcement");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured || false);
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder || 1);

  // Interaction states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Unsaved changes alert
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

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Judul content card wajib diisi";
    }

    if (!summary.trim()) {
      newErrors.summary = "Ringkasan konten wajib diisi";
    }

    if (!publisherName.trim()) {
      newErrors.publisherName = "Nama akun / publisher Instagram wajib diisi (contoh: @princee.lab)";
    }

    if (!instagramUrl.trim()) {
      newErrors.instagramUrl = "URL Instagram wajib diisi";
    } else {
      const igValidation = validateInstagramUrl(instagramUrl);
      if (!igValidation.valid) {
        newErrors.instagramUrl = igValidation.error!;
      }
    }

    if (thumbnail.trim() && !thumbnailAlt.trim()) {
      newErrors.thumbnailAlt = "Alt text wajib diisi jika thumbnail digunakan";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title,
        summary,
        publisherName,
        instagramUrl,
        projectId: projectId || null,
        thumbnail,
        thumbnailAlt,
        contentDate,
        category,
        status: submitStatus,
        isFeatured,
        sortOrder: Number(sortOrder) || 1,
      };

      const url = isEditing
        ? `/api/admin/cards/${initialData?.id}`
        : "/api/admin/cards";
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
          setServerError(data.error || "Gagal menyimpan content card.");
        }
        setIsSaving(false);
        return;
      }

      setIsDirty(false);
      router.push("/admin/content");
      router.refresh();
    } catch {
      setServerError("Terjadi gangguan jaringan saat menyimpan content card.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Content Cards</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {isEditing ? `Edit Content Card: ${initialData?.title}` : "Buat Content Card Baru"}
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

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Informasi Konten Instagram
            </h2>

            {/* Judul Card */}
            <div className="space-y-1.5">
              <label htmlFor="card-title" className="block text-xs font-mono font-medium text-text-secondary">
                Judul Content Card <span className="text-danger">*</span>
              </label>
              <input
                id="card-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Contoh: Bedah Arsitektur MotoCheck: Dari Ide ke Kode"
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

            {/* Ringkasan Konten */}
            <div className="space-y-1.5">
              <label htmlFor="card-summary" className="block text-xs font-mono font-medium text-text-secondary">
                Ringkasan Konten <span className="text-danger">*</span>
              </label>
              <textarea
                id="card-summary"
                rows={3}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Rangkuman poin pembahasan yang tampil pada preview card..."
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

            {/* Publisher & Instagram URL (PRD Requirement: Stored separately per card!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              {/* Publisher Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="publisherName"
                  className="block text-xs font-mono font-medium text-text-secondary"
                >
                  Nama Publisher Akun <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="publisherName"
                    type="text"
                    value={publisherName}
                    onChange={(e) => {
                      setPublisherName(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="@princee.lab"
                    className={`w-full pl-9 pr-3 py-2 bg-surface-elevated border rounded-xl text-xs font-mono text-text-primary placeholder:text-text-muted focus:ring-1 outline-none ${
                      errors.publisherName
                        ? "border-danger focus:border-danger focus:ring-danger"
                        : "border-border focus:border-primary focus:ring-primary"
                    }`}
                  />
                </div>
                {errors.publisherName && (
                  <p className="text-xs text-danger font-mono mt-1">{errors.publisherName}</p>
                )}
                <span className="text-[10px] text-text-muted block font-mono">
                  Contoh: @princee.lab atau @prince.builds
                </span>
              </div>

              {/* Instagram URL */}
              <div className="space-y-1.5">
                <label
                  htmlFor="instagramUrl"
                  className="block text-xs font-mono font-medium text-text-secondary"
                >
                  URL Tujuan Instagram <span className="text-danger">*</span>
                </label>
                <input
                  id="instagramUrl"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => {
                    setInstagramUrl(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="https://www.instagram.com/princee.lab/"
                  className={`w-full px-3 py-2 bg-surface-elevated border rounded-xl text-xs font-mono text-text-primary placeholder:text-text-muted focus:ring-1 outline-none ${
                    errors.instagramUrl
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
                {errors.instagramUrl && (
                  <p className="text-xs text-danger font-mono mt-1">{errors.instagramUrl}</p>
                )}
                <span className="text-[10px] text-text-muted block font-mono">
                  Harus HTTPS dan domain instagram.com
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Thumbnail &amp; Media Card
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="card-thumbnail" className="block text-xs font-mono font-medium text-text-secondary">
                  Path / URL Thumbnail
                </label>
                <input
                  id="card-thumbnail"
                  type="text"
                  value={thumbnail}
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="/images/teaser/1.png atau URL eksternal"
                  className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="thumbnailAlt" className="block text-xs font-mono font-medium text-text-secondary">
                  Alt Text {thumbnail.trim() && <span className="text-danger">*</span>}
                </label>
                <input
                  id="thumbnailAlt"
                  type="text"
                  value={thumbnailAlt}
                  onChange={(e) => {
                    setThumbnailAlt(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Deskripsi makna poster/grafik"
                  className={`w-full px-4 py-2 bg-surface-elevated border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:ring-1 outline-none ${
                    errors.thumbnailAlt
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
                {errors.thumbnailAlt && (
                  <p className="text-xs text-danger font-mono mt-1">{errors.thumbnailAlt}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Relasi &amp; Penataan
            </h2>

            {/* Proyek Terkait (Relation) */}
            <div className="space-y-1.5">
              <label htmlFor="projectId" className="block text-xs font-mono font-medium text-text-secondary">
                Tautkan ke Proyek (Opsional)
              </label>
              <select
                id="projectId"
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary focus:border-primary outline-none"
              >
                <option value="">-- Tanpa Proyek (Standalone) --</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({proj.status})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-text-muted font-mono block">
                Jika ditautkan ke proyek draft, card otomatis tidak muncul di situs publik.
              </span>
            </div>

            {/* Kategori Card */}
            <div className="space-y-1.5">
              <label htmlFor="card-category" className="block text-xs font-mono font-medium text-text-secondary">
                Kategori Konten
              </label>
              <select
                id="card-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary focus:border-primary outline-none"
              >
                <option value="Announcement">Announcement</option>
                <option value="Architecture">Architecture</option>
                <option value="Career & Learning">Career &amp; Learning</option>
                <option value="Release Note">Release Note</option>
                <option value="Tutorial Breakdown">Tutorial Breakdown</option>
                <option value="AI Research">AI Research</option>
              </select>
            </div>

            {/* Tanggal Konten */}
            <div className="space-y-1.5">
              <label htmlFor="contentDate" className="block text-xs font-mono font-medium text-text-secondary">
                Tanggal Postingan Instagram (Opsional)
              </label>
              <input
                id="contentDate"
                type="date"
                value={contentDate}
                onChange={(e) => {
                  setContentDate(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-text-primary focus:border-primary outline-none"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label htmlFor="card-sortOrder" className="block text-xs font-mono font-medium text-text-secondary">
                Urutan Tampil (Sort Order)
              </label>
              <input
                id="card-sortOrder"
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(Number(e.target.value));
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-text-primary focus:border-primary outline-none"
              />
            </div>

            {/* Is Featured Checkbox */}
            <div className="pt-3 border-t border-border flex items-start gap-2.5">
              <input
                id="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  setIsFeatured(e.target.checked);
                  setIsDirty(true);
                }}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary bg-surface-elevated"
              />
              <label htmlFor="isFeatured" className="text-xs text-text-secondary leading-snug">
                Tandai sebagai <strong>Konten Unggulan (Featured)</strong> di beranda studio
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
