"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Password tidak cocok. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0E0E0E] text-[#F2EFE9] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none font-sans">
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Header Colophon */}
      <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center border-b border-white/10 pb-6 relative z-10 font-mono text-xs text-[#9E9B94]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[#F2EFE9] font-bold">STUDIO CMS // MATRIX CONTROL</span>
          <span className="text-white/30 hidden sm:inline">//</span>
          <span className="hidden sm:inline">RESTRICTED ACCESS</span>
        </div>
        <Link
          href="/"
          className="hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <span>← BACK TO PORTFOLIO</span>
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-10">
        <div className="border border-white/15 bg-[#141414] p-8 sm:p-10 shadow-2xl relative">
          {/* Corner Accent Brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent" />

          {/* Heading */}
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 font-mono text-[10px] text-accent font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHENTICATION GATEWAY</span>
            </div>
            <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9]">
              Portfolio Matrix CMS
            </h1>
            <p className="text-xs text-[#9E9B94] font-mono leading-relaxed">
              Masuk untuk mengelola seluruh data proyek, sertifikat kejuaraan, poster studio, dan biodata profil.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-mono text-xs uppercase tracking-wider text-[#9E9B94]"
              >
                Admin Security Key / Password:
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  required
                  autoFocus
                  className="w-full bg-[#0A0A0A] border border-white/20 px-4 py-3 text-sm text-[#F2EFE9] placeholder-[#9E9B94]/40 font-mono focus:outline-none focus:border-accent transition-colors"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9B94]">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] font-mono text-[#9E9B94]/70 pt-1">
                Default key: <span className="text-accent font-semibold">rafli2026</span> (dapat diubah di .env.local via ADMIN_PASSWORD)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-widest py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md"
            >
              <span>{loading ? "MEMVERIFIKASI KUNCI..." : "MASUK KE DASHBOARD"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer Meta */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-wrap justify-between items-center gap-4 border-t border-white/10 pt-6 relative z-10 font-mono text-xs text-[#9E9B94]">
        <span>© 2026 MUH. RAFLI ICHSAN // ALL RIGHTS RESERVED</span>
        <span className="text-[11px] text-accent">SWISS EDITORIAL CMS ENGINE</span>
      </div>
    </div>
  );
}
