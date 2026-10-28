import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ContentCardItem } from "@/components/public/ContentCardItem";
import {
  Eye,
  AlertTriangle,
  FolderGit2,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pratinjau Draft Internal (Khusus Admin)",
  robots: "noindex, nofollow",
};

export default async function AdminDraftPreviewPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // Load all projects and cards INCLUDING drafts
  const allProjects = storage.getProjects({ includeDrafts: true });
  const allCards = storage.getContentCards({ includeDrafts: true });

  const draftProjects = allProjects.filter((p) => p.status === "draft");
  const draftCards = allCards.filter((c) => c.status === "draft");

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Sticky Contextual Draft Preview Banner (matching Stitch design) */}
      <aside className="sticky top-0 z-50 bg-surface-elevated border-b border-warning/40 px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-warning animate-pulse" />
          <div className="flex items-center gap-2 text-xs font-mono text-warning">
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">
              Mode Pratinjau Draft Aktif: Anda sedang melihat tampilan halaman dengan konten yang belum dipublikasikan.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-xs font-mono px-3 py-1 bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
          >
            Kembali ke Admin
          </Link>
        </div>
      </aside>

      <AdminNavbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 text-xs font-mono text-warning">
              <Clock className="w-3.5 h-3.5" />
              <span>Area Uji Coba Editorial Internal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Pratinjau Gabungan: Draft &amp; Published
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Halaman ini mereplikasi tampilan publik dengan menyertakan item berstatus <code>draft</code>.
              Hanya administrator yang dapat melihat tampilan ini. Item berstatus draft bertanda khusus.
            </p>
          </div>

          {/* Draft Item Count Summary */}
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-wrap items-center gap-6 text-xs font-mono">
            <span className="text-text-muted">Status Draft Terdeteksi:</span>
            <span className="text-warning flex items-center gap-1.5 font-semibold">
              <FolderGit2 className="w-3.5 h-3.5" />
              {draftProjects.length} Proyek Draft
            </span>
            <span className="text-warning flex items-center gap-1.5 font-semibold">
              <InstagramIcon className="w-3.5 h-3.5" />
              {draftCards.length} Content Cards Draft
            </span>
          </div>

          {/* SECTION: Projects Preview */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-primary" />
                  <span>Katalog Proyek (Termasuk Draft)</span>
                </h2>
                <p className="text-xs text-text-muted">Total: {allProjects.length} Proyek</p>
              </div>

              <Link
                href="/admin/projects"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Kelola Proyek</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <div key={project.id} className="relative group">
                  {/* Draft Banner Overlay */}
                  {project.status === "draft" && (
                    <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded bg-warning text-canvas font-mono font-bold text-[10px] uppercase shadow-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      DRAFT PROYEK
                    </div>
                  )}

                  <ProjectCard project={project} />

                  {/* Direct Edit Pill for Admin */}
                  <div className="mt-2 text-right">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-primary"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Proyek Ini</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Content Cards Preview */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <InstagramIcon className="w-5 h-5 text-primary" />
                  <span>Content Cards (Termasuk Draft)</span>
                </h2>
                <p className="text-xs text-text-muted">Total: {allCards.length} Cards</p>
              </div>

              <Link
                href="/admin/content"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Kelola Cards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCards.map((card) => (
                <div key={card.id} className="relative group">
                  {card.status === "draft" && (
                    <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded bg-warning text-canvas font-mono font-bold text-[10px] uppercase shadow-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      DRAFT CARD
                    </div>
                  )}

                  <ContentCardItem card={card} />

                  <div className="mt-2 text-right">
                    <Link
                      href={`/admin/content/${card.id}/edit`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-primary"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Card Ini</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
