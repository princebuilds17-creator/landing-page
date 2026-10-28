import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderGit2 } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col bg-surface hover:bg-surface-hover border border-border hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary shadow-sm hover:shadow-lg hover:shadow-primary/5">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] w-full bg-surface-elevated overflow-hidden border-b border-border/60">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt || `Mockup preview proyek ${project.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2 bg-gradient-to-br from-surface to-surface-elevated">
            <FolderGit2 className="w-8 h-8 opacity-40 text-primary" />
            <span className="text-xs font-mono">PRINCE LAB Project</span>
          </div>
        )}

        {/* Category Pill */}
        {project.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-canvas/85 backdrop-blur-md border border-border/80 text-[11px] font-mono text-primary font-medium">
            {project.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-5">
        <div className="space-y-2.5">
          <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors leading-snug">
            <Link
              href={`/projects/${project.slug}`}
              className="focus-visible:outline-none after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-medium text-text-muted">
          <span className="font-mono text-[11px]">Dokumentasi & Arsitektur</span>
          <span className="inline-flex items-center gap-1.5 text-primary group-hover:translate-x-1 transition-transform">
            <span>Pelajari</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
