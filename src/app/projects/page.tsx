import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { storage } from "@/lib/storage";
import { Layers, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Katalog Proyek Digital",
  description:
    "Daftar proyek aktif dan studi kasus arsitektur web yang dipublikasikan oleh PRINCE LAB.",
};

export default function ProjectsCatalogPage() {
  const publishedProjects = storage.getProjects({ includeDrafts: false });

  // Extract categories for simple filter chips
  const categories = Array.from(
    new Set(publishedProjects.map((p) => p.category).filter(Boolean) as string[])
  );

  return (
    <>
      <AnalyticsTracker eventType="page_view" />
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Katalog Terbuka</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
              Proyek &amp; Studi Kasus Studio
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Jelajahi dokumentasi proyek rekayasa perangkat lunak, eksplorasi arsitektur frontend,
              backend native, hingga studi desain sistem yang dirancang untuk pembelajaran terapan.
            </p>
          </div>

          {/* Category Chips if present */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-mono text-text-muted mr-1">Kategori:</span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-primary text-text-inverted font-semibold">
                Semua ({publishedProjects.length})
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs font-mono rounded-full bg-surface border border-border text-text-secondary"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Project Grid / Empty State */}
          {publishedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5 my-12">
              <div className="w-12 h-12 rounded-xl bg-surface-elevated text-primary mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-text-primary">
                  Belum Ada Proyek yang Dipublikasikan
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Proyek baru sedang dalam kurasi teknis oleh tim studio. Kunjungi Instagram resmi
                  kami untuk melihat preview progress pengembangan.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/princee.lab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-lg transition-colors"
                >
                  <span>Pantau di Instagram @princee.lab</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
