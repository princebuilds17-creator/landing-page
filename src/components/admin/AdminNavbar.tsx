"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Eye,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi admin?")) {
      setLoggingOut(true);
      try {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      } catch {
        setLoggingOut(false);
      }
    }
  };

  const navItems = [
    { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Proyek", icon: FolderGit2 },
    { href: "/admin/content", label: "Content Cards", icon: InstagramIcon },
    { href: "/admin/preview", label: "Pratinjau Draft", icon: Eye },
  ];

  return (
    <header className="bg-surface-elevated border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-text-primary">PRINCE LAB</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 uppercase font-bold tracking-wider">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-text-inverted font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors"
            title="Buka Website Publik (Tab Baru)"
          >
            <span>Lihat Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Keluar..." : "Logout"}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary bg-surface border border-border rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-primary text-text-inverted font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary py-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Website Publik</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-danger font-medium py-2 px-3 hover:underline"
            >
              Logout Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
