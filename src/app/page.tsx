import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ContentCardItem } from "@/components/public/ContentCardItem";
import { EcosystemSection } from "@/components/public/EcosystemSection";
import { AnalyticsTracker } from "@/components/public/AnalyticsTracker";
import { storage } from "@/lib/storage";
import { ArrowRight, ArrowUpRight, Terminal, Sparkles, BookOpen, Layers } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const publishedProjects = storage.getProjects({ includeDrafts: false }).slice(0, 3);
  const publishedCards = storage.getContentCards({ includeDrafts: false }).slice(0, 6);

  return (
    <>
      <AnalyticsTracker eventType="page_view" />
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-grid-pattern border-b border-border/40">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[400px] bg-primary/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-text-primary font-medium">PRINCE LAB Platform</span>
                <span className="text-text-muted">•</span>
                <span>Personal Tech Studio</span>
              </div>

              {/* Tagline & Title */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                  Learn. Build.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-hover to-secondary">
                    Share.
                  </span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl font-normal">
                  Personal tech brand & digital project studio untuk IT students dan pemula.
                  Membongkar proses rekayasa perangkat lunak, membangun produk nyata, dan
                  membagikan setiap catatan proses secara transparan.
                </p>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-md shadow-primary/20 min-h-[48px] min-w-[140px]"
                >
                  <span>Lihat Proyek Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://www.instagram.com/princee.lab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-xl transition-all min-h-[48px]"
                >
                  <InstagramIcon className="w-4 h-4 text-primary" />
                  <span>Instagram @princee.lab</span>
                  <ArrowUpRight className="w-4 h-4 text-text-muted" />
                </a>
              </div>

              {/* Value Pillars Banner */}
              <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border/60">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/40">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-text-primary">Learn</h2>
                    <p className="text-[11px] text-text-muted">Konsep dasar & arsitektur</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/40">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-text-primary">Build</h2>
                    <p className="text-[11px] text-text-muted">Aplikasi & modul nyata</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/40">
                  <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center font-mono font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-text-primary">Share</h2>
                    <p className="text-[11px] text-text-muted">Konten & breakdown solusi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TENTANG PRINCE LAB */}
        <section id="tentang" className="py-16 sm:py-24 bg-surface-subtle border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Filosofi & Ruang Belajar</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary leading-tight">
                  Mendampingi Langkah Pertama Mahasiswa IT dan Pengembang Pemula
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                  <p>
                    Dunia teknologi sering kali tampak mengintimidasi bagi pemula yang dibanjiri
                    istilah rumit, dokumentasi teoritis, dan tutorial tanpa konteks produksi.
                    <strong> PRINCE LAB</strong> hadir untuk membalik pola tersebut.
                  </p>
                  <p>
                    Sebagai digital project studio sekaligus personal tech brand, kami fokus pada
                    proses rekayasa nyata: bagaimana ide diterjemahkan menjadi model data,
                    bagaimana antarmuka dibuat aksesibel, serta bagaimana masalah performa
                    diidentifikasi dan diatasi secara sistematis.
                  </p>
                  <p className="text-xs font-mono text-text-muted pt-2 border-t border-border">
                    * Catatan: Seluruh data proyek dan metrik bersifat terverifikasi. Kami menolak
                    mencantumkan statistik fiktif atau klaim keberhasilan yang tidak berdasar.
                  </p>
                </div>
              </div>

              {/* Graphic Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-xs font-mono text-text-muted">princelab/manifesto</span>
                    <span className="text-xs font-mono text-secondary flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      verified
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-text-secondary">
                    <p className="text-text-primary">const princelab = &#123;</p>
                    <p className="pl-4">mission: &quot;Demistifikasi Rekayasa Software&quot;,</p>
                    <p className="pl-4">audience: &quot;IT Students &amp; Early Builders&quot;,</p>
                    <p className="pl-4">principles: [&quot;High Contrast&quot;, &quot;Accessible&quot;, &quot;Honest Data&quot;],</p>
                    <p className="pl-4">output: &quot;Clean Code + Actionable Content&quot;</p>
                    <p>&#125;;</p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                    <span>Versi Desain 2026</span>
                    <span className="text-primary font-mono">Dark Tech Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EKOSISTEM BRAND PRINCE */}
        <EcosystemSection />

        {/* PILIHAN PROYEK TERBARU */}
        <section className="py-16 sm:py-24 border-t border-border/60 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Karya Studio Terpilih</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Proyek Pilihan PRINCE LAB
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Eksplorasi modul perangkat lunak dan studi kasus yang dapat dipelajari arsitekturnya.
                </p>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-1 self-start md:self-auto"
              >
                <span>Lihat Semua Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Projects Grid or Empty State */}
            {publishedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-lg mx-auto space-y-4">
                <Layers className="w-10 h-10 text-text-muted mx-auto opacity-50" />
                <h3 className="text-base font-semibold text-text-primary">
                  Belum Ada Proyek Publikasi
                </h3>
                <p className="text-xs text-text-secondary">
                  Proyek sedang dalam proses kurasi dan verifikasi teknis sebelum dirilis ke publik.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CONTENT CARDS TERKINI */}
        <section className="py-16 sm:py-24 border-t border-border/60 bg-surface-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Kanal Media &amp; Catatan Belajar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Content Cards Terdistribusi
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Setiap kartu konten terhubung langsung ke akun Instagram publisher resmi yang
                  menerbitkannya secara spesifik.
                </p>
              </div>

              <div className="text-xs text-text-muted font-mono flex items-center gap-2 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>Multi-Publisher Verified</span>
              </div>
            </div>

            {/* Cards Grid or Empty State */}
            {publishedCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedCards.map((card) => (
                  <ContentCardItem key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-lg mx-auto space-y-4">
                <InstagramIcon className="w-10 h-10 text-text-muted mx-auto opacity-50" />
                <h3 className="text-base font-semibold text-text-primary">
                  Belum Ada Kartu Konten
                </h3>
                <p className="text-xs text-text-secondary">
                  Konten rilis Instagram sedang dalam kurasi editorial oleh tim admin.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SOCIAL CALL TO ACTION */}
        <section className="py-16 sm:py-20 border-t border-border/60 bg-canvas relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Ingin Berdiskusi atau Menjelajahi Proses Pembuatan?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Ikuti pembaruan rutin arsitektur perangkat lunak, studi kasus proyek, dan tips belajar
              IT melalui kanal Instagram resmi kami.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/princee.lab/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-md shadow-primary/20 min-h-[48px]"
              >
                <span>Ikuti @princee.lab</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/prince.builds"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-xl transition-all min-h-[48px]"
              >
                <span>Ikuti @prince.builds</span>
                <ArrowUpRight className="w-4 h-4 text-text-muted" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
