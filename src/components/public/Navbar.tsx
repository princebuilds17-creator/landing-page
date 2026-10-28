"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/projects", label: "Proyek" },
    { href: "/#tentang", label: "Tentang" },
    { href: "/#ekosistem", label: "Ekosistem" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "bg-canvas/90 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          aria-label="PRINCE LAB — Ke Halaman Beranda"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Logo PRINCE LAB"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-text-primary group-hover:text-primary transition-colors">
              PRINCE<span className="text-primary font-mono ml-1">LAB</span>
            </span>
            <span className="text-[10px] text-text-muted font-mono tracking-wider uppercase -mt-1 hidden sm:block">
              Learn • Build • Share
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Navigasi Utama">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://www.instagram.com/princee.lab/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-all min-h-[40px]"
            aria-label="Kunjungi Instagram Resmi PRINCE LAB (buka tab baru)"
          >
            <span>Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
          </a>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center p-2 text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border rounded-lg transition-colors min-h-[40px] min-w-[40px]"
            title="Portal Admin"
            aria-label="Masuk ke Portal Admin"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className="p-2 text-text-muted hover:text-text-primary rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Portal Admin"
          >
            <ShieldCheck className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary bg-surface border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-border bg-surface-elevated/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fade-in"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border/60">
            <a
              href="https://www.instagram.com/princee.lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg min-h-[44px]"
            >
              <span>Instagram @princee.lab</span>
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
