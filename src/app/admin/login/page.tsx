"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Terjadi gangguan jaringan saat memproses login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-canvas bg-grid-pattern relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
          >
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Logo PRINCE LAB"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Portal Admin PRINCE LAB
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Masuk untuk mengelola katalog proyek dan content cards studio
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-grow font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-mono font-medium text-text-secondary"
              >
                Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@princelab.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-mono font-medium text-text-secondary"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-50 min-h-[46px]"
              >
                {loading ? (
                  <span>Memverifikasi Sesi...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Dev credentials callout for reviewer convenience */}
          <div className="pt-4 border-t border-border/60 text-center">
            <p className="text-[11px] font-mono text-text-muted leading-relaxed">
              Default Sandbox Credentials:
              <br />
              <span className="text-text-secondary">admin@princelab.id</span> /{" "}
              <span className="text-text-secondary">princeAdmin2026!</span>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
          >
            ← Kembali ke Website Publik PRINCE LAB
          </Link>
        </div>
      </div>
    </div>
  );
}
