"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  Palette,
  Briefcase,
  UserCheck,
  Database,
  ExternalLink,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clock, setClock] = useState("");

  const isLoginPage = pathname === "/admin/login";

  // Check auth on mount
  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
      } catch {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Live WIB clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // If on login page, render children directly without dashboard sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[#0E0E0E] text-[#F2EFE9] flex flex-col items-center justify-center p-6 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[#9E9B94] tracking-widest uppercase">
          MEMVERIFIKASI SESI ADMIN STUDIO...
        </span>
      </div>
    );
  }

  const navLinks = [
    { label: "Ringkasan", href: "/admin", icon: LayoutDashboard },
    { label: "Proyek & Portfolio", href: "/admin/projects", icon: FolderGit2 },
    { label: "Sertifikat & Juara", href: "/admin/certificates", icon: Award },
    { label: "Poster & Artwork", href: "/admin/posters", icon: Palette },
    { label: "Pengalaman Kerja", href: "/admin/experience", icon: Briefcase },
    { label: "Biodata & Skills", href: "/admin/profile", icon: UserCheck },
    { label: "Backup & Database", href: "/admin/backup", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F2EFE9] flex flex-col lg:flex-row font-sans selection:bg-accent selection:text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#121212] sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>RAFLI CMS // STUDIO</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border border-white/20 text-[#F2EFE9] focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#121212] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Masthead */}
        <div className="p-6 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#9E9B94]">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold">
              CMS V2.0
            </span>
            <span>{clock}</span>
          </div>
          <div>
            <h2 className="font-sans font-bold text-lg text-[#F2EFE9] tracking-tight">
              Studio Matrix CMS
            </h2>
            <p className="font-mono text-[11px] text-[#9E9B94]">
              MUH. RAFLI ICHSAN // ADMIN
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9B94]/70 px-3 py-2 block">
            MANAJEMEN KONTEN
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 font-mono text-xs transition-all duration-200 group ${
                  isActive
                    ? "bg-accent text-white font-semibold shadow-sm"
                    : "text-[#9E9B94] hover:bg-white/5 hover:text-[#F2EFE9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? "translate-x-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-[#9E9B94] hover:text-[#F2EFE9] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Website Live</span>
            </div>
            <span className="text-[10px] text-accent">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Keluar / Logout</span>
            </div>
            <span className="text-[10px]">✕</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#0A0A0A] overflow-y-auto min-h-screen">
        {/* Top Sub-Bar */}
        <div className="border-b border-white/10 bg-[#101010] px-6 sm:px-10 py-3 flex flex-wrap justify-between items-center gap-4 font-mono text-xs text-[#9E9B94]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white font-medium">Sistem Dinamis Aktif</span>
            <span className="text-white/20">|</span>
            <span className="hidden sm:inline">Perubahan langsung tersimpan ke database runtime</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/backup"
              className="text-accent hover:underline flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backup Data JSON</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
