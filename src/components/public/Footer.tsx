import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            >
              <div className="relative w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo PRINCE LAB"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg text-text-primary">
                PRINCE<span className="text-primary font-mono ml-1">LAB</span>
              </span>
            </Link>

            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Personal tech brand & digital project studio untuk IT students dan pemula. Ruang
              eksplorasi proses rekayasa perangkat lunak dengan pendekatan nyata dan transparan.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Tagline: Learn. Build. Share.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href="/"
                  className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1 block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1 block"
                >
                  Katalog Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="/#tentang"
                  className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1 block"
                >
                  Tentang Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/#ekosistem"
                  className="hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1 block"
                >
                  Ekosistem Brand
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels & Admin */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Kanal Resmi & Akses
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a
                  href="https://www.instagram.com/princee.lab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1"
                >
                  <span>@princee.lab</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/prince.builds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1"
                >
                  <span>@prince.builds (Personal)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded py-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Studio Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} PRINCE LAB. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan dedikasi rekayasa sistem</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
