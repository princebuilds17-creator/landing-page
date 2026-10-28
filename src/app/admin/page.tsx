import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import {
  FolderGit2,
  Eye,
  Plus,
  MousePointerClick,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Layers,
  ArrowRight,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ringkasan Admin Studio",
};

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const allProjects = storage.getProjects({ includeDrafts: true });
  const allCards = storage.getContentCards({ includeDrafts: true });
  const analytics = storage.getAnalyticsSummary();

  const publishedProjectsCount = allProjects.filter((p) => p.status === "published").length;
  const draftProjectsCount = allProjects.filter((p) => p.status === "draft").length;

  const publishedCardsCount = allCards.filter((c) => c.status === "published").length;
  const draftCardsCount = allCards.filter((c) => c.status === "draft").length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />

      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Title Banner & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Ringkasan Studio &amp; Konten
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary">
                Kelola status publikasi, urutan tampil, dan tautan Instagram multi-publisher
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-lg transition-colors min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek</span>
              </Link>

              <Link
                href="/admin/content/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors min-h-[40px]"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Tambah Card</span>
              </Link>

              <Link
                href="/admin/preview"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors min-h-[40px]"
                title="Lihat Pratinjau Draft"
              >
                <Eye className="w-3.5 h-3.5 text-warning" />
                <span>Preview Draft</span>
              </Link>
            </div>
          </div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Projects Metric */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Katalog Proyek</span>
                <FolderGit2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary font-mono">
                  {allProjects.length}
                </span>
                <span className="text-xs text-text-secondary">total</span>
              </div>
              <div className="flex items-center gap-3 text-xs pt-1 border-t border-border/60">
                <span className="inline-flex items-center gap-1 text-secondary font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  {publishedProjectsCount} Published
                </span>
                <span className="inline-flex items-center gap-1 text-warning font-mono">
                  <Clock className="w-3 h-3" />
                  {draftProjectsCount} Draft
                </span>
              </div>
            </div>

            {/* Content Cards Metric */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Content Cards</span>
                <InstagramIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary font-mono">
                  {allCards.length}
                </span>
                <span className="text-xs text-text-secondary">total</span>
              </div>
              <div className="flex items-center gap-3 text-xs pt-1 border-t border-border/60">
                <span className="inline-flex items-center gap-1 text-secondary font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  {publishedCardsCount} Published
                </span>
                <span className="inline-flex items-center gap-1 text-warning font-mono">
                  <Clock className="w-3 h-3" />
                  {draftCardsCount} Draft
                </span>
              </div>
            </div>

            {/* Outbound Clicks Metric */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Klik Keluar Instagram</span>
                <MousePointerClick className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary font-mono">
                  {analytics.outboundClicks}
                </span>
                <span className="text-xs text-text-secondary">outbound</span>
              </div>
              <div className="text-[11px] text-text-muted pt-1 border-t border-border/60">
                Tautan Instagram publisher spesifik
              </div>
            </div>

            {/* Page & Project Views Metric */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Kunjungan Halaman</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary font-mono">
                  {analytics.pageViews + analytics.projectViews}
                </span>
                <span className="text-xs text-text-secondary">views</span>
              </div>
              <div className="flex items-center gap-3 text-xs pt-1 border-t border-border/60 text-text-muted">
                <span>{analytics.pageViews} Page</span>
                <span>•</span>
                <span>{analytics.projectViews} Detail</span>
              </div>
            </div>
          </div>

          {/* Quick Tables: Recent Projects & Recent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-primary" />
                    <span>Daftar Proyek Terbaru</span>
                  </h2>
                  <p className="text-xs text-text-muted">Proyek studio dalam urutan tersimpan</p>
                </div>
                <Link
                  href="/admin/projects"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Kelola Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border/60">
                {allProjects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary truncate">
                          {project.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            project.status === "published"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-warning/10 text-warning border border-warning/20"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate">
                        Slug: /{project.slug}
                      </p>
                    </div>

                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="px-2.5 py-1 text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded border border-border"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Content Cards */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-primary" />
                    <span>Content Cards Terdaftar</span>
                  </h2>
                  <p className="text-xs text-text-muted">Kartu Instagram dengan publisher spesifik</p>
                </div>
                <Link
                  href="/admin/content"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Kelola Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border/60">
                {allCards.slice(0, 5).map((card) => (
                  <div
                    key={card.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary truncate">
                          {card.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            card.status === "published"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-warning/10 text-warning border border-warning/20"
                          }`}
                        >
                          {card.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-primary font-mono truncate">
                        {card.publisherName} • {card.instagramUrl}
                      </p>
                    </div>

                    <Link
                      href={`/admin/content/${card.id}/edit`}
                      className="px-2.5 py-1 text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded border border-border"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
