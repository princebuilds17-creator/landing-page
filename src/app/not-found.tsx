import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          {/* 404 Badge */}
          <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border text-primary mx-auto flex items-center justify-center">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Error 404 • Resource Not Found
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tautan yang Anda tuju mungkin sudah dipindahkan, belum dipublikasikan, atau alamat URL yang dimasukkan salah.
            </p>
          </div>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-colors min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-text-primary bg-surface-elevated hover:bg-surface-hover border border-border rounded-xl transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Katalog Proyek</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
