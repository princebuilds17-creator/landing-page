import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ContentCardItem } from "@/components/public/ContentCardItem";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { storage } from "@/lib/storage";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = storage.getProjectBySlug(slug, { includeDrafts: false });
  if (!project) {
    return {
      title: "Proyek Tidak Ditemukan",
    };
  }
  return {
    title: project.seoTitle || `${project.title} — Dokumentasi Proyek`,
    description: project.seoDescription || project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  // PRD Rule: If project is not found or is NOT published, return 404 (never leak drafts to public)
  const project = storage.getProjectBySlug(slug, { includeDrafts: false });
  if (!project) {
    notFound();
  }

  // Get published cards linked to this project
  const linkedCards = storage.getContentCards({
    includeDrafts: false,
    projectId: project.id,
  });

  return (
    <>
      <AnalyticsTracker
        eventType="project_view"
        targetSlug={project.slug}
        targetId={project.id}
      />
      <Navbar />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog Proyek</span>
            </Link>
          </div>

          {/* Project Header */}
          <header className="space-y-4 mb-10 pb-8 border-b border-border/60">
            <div className="flex flex-wrap items-center gap-3">
              {project.category && (
                <span className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                  {project.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Published Project</span>
              </span>
              {project.publishedAt && (
                <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              {project.summary}
            </p>

            {/* External Links */}
            {project.externalUrl && (
              <div className="pt-2">
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors"
                >
                  <span>Kunjungi Tautan Eksternal Proyek</span>
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                </a>
              </div>
            )}
          </header>

          {/* Media / Mockup Preview */}
          {project.image && (
            <div className="mb-12 relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl">
              <Image
                src={project.image}
                alt={project.imageAlt || `Preview ilustrasi untuk proyek ${project.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
              />
            </div>
          )}

          {/* Detailed Documentation Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-4">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Spesifikasi &amp; Arsitektur Proyek</span>
                </h2>

                <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-line">
                  {project.description ||
                    "Deskripsi teknis lengkap untuk proyek ini sedang dalam penyusunan oleh kontributor dan tim review PRINCE LAB."}
                </div>
              </section>

              {/* Related Instagram Content Cards Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <InstagramIcon className="w-5 h-5 text-primary" />
                      <span>Content Cards Terkait</span>
                    </h2>
                    <p className="text-xs text-text-muted">
                      Catatan rilis dan breakdown visual proyek ini di Instagram
                    </p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {linkedCards.length} Konten
                  </span>
                </div>

                {linkedCards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {linkedCards.map((card) => (
                      <ContentCardItem key={card.id} card={card} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-surface border border-border text-center space-y-2">
                    <p className="text-xs text-text-secondary">
                      Belum ada kartu rilis Instagram yang ditautkan ke proyek ini.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar Meta */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                  Informasi Proyek
                </h3>

                <dl className="space-y-3 text-xs">
                  <div>
                    <dt className="text-text-muted">ID Kontrak</dt>
                    <dd className="font-mono text-text-primary mt-0.5">{project.id}</dd>
                  </div>

                  <div>
                    <dt className="text-text-muted">Identifier Slug</dt>
                    <dd className="font-mono text-text-primary mt-0.5 break-all">{project.slug}</dd>
                  </div>

                  <div>
                    <dt className="text-text-muted">Status</dt>
                    <dd className="mt-0.5">
                      <span className="inline-flex items-center gap-1 text-secondary font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        Terverifikasi Published
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-text-muted">Studio Brand</dt>
                    <dd className="text-text-primary font-medium mt-0.5">PRINCE LAB</dd>
                  </div>
                </dl>
              </div>

              {/* Disclaimer Callout */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <span className="text-[11px] font-mono text-primary font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prinsip Integritas Konten
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Semua tautan yang tercantum diverifikasi sebelum publikasi. Kami tidak mencantumkan
                  klaim metrik yang belum terukur di lingkungan riil.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
