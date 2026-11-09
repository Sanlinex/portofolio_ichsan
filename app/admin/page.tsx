"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Award,
  Palette,
  Briefcase,
  Plus,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import type { ProfileData } from "@/data/profile";

export default function AdminDashboardPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-[#9E9B94]">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
        <span>MEMUAT DATA STUDIO...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center font-mono text-xs text-red-400">
        Gagal memuat data portfolio. Silakan refresh halaman.
      </div>
    );
  }

  const statCards = [
    {
      title: "PROYEK REKAYASA",
      count: data.projects.length,
      href: "/admin/projects",
      icon: FolderGit2,
      subtitle: "Studi kasus web & app",
      color: "border-accent/40",
    },
    {
      title: "PENGHARGAAN & LKS",
      count: data.achievements.length,
      href: "/admin/certificates",
      icon: Award,
      subtitle: "Juara kompetisi & sertifikat",
      color: "border-emerald-500/40",
    },
    {
      title: "POSTER & ARTWORK",
      count: data.posters.length,
      href: "/admin/posters",
      icon: Palette,
      subtitle: "Koleksi seri visual Swiss",
      color: "border-amber-500/40",
    },
    {
      title: "PENGALAMAN KERJA",
      count: data.experiences.length,
      href: "/admin/experience",
      icon: Briefcase,
      subtitle: "Rekam jejak industri & magang",
      color: "border-blue-500/40",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Welcome Banner */}
      <div className="border border-white/15 bg-[#121212] p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">
              STUDIO CMS // KONTROL UTAMA
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-[#F2EFE9]">
            Halo, {data.personal.name}
          </h1>
          <p className="text-sm font-sans text-[#9E9B94] max-w-xl leading-relaxed">
            Kelola seluruh konten portofolio Anda secara dinamis. Setiap perubahan yang disimpan langsung tayang di website publik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 font-mono text-xs">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-[#F2EFE9] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`block border ${card.color} bg-[#141414] p-6 hover:bg-[#1a1a1a] transition-all duration-200 group relative`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs text-[#9E9B94] font-medium tracking-wider uppercase">
                  {card.title}
                </span>
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif italic text-4xl sm:text-5xl text-[#F2EFE9] group-hover:text-accent transition-colors">
                  {card.count.toString().padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>Kelola</span>
                  <span>→</span>
                </span>
              </div>
              <p className="mt-3 font-sans text-xs text-[#9E9B94]">
                {card.subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Matrix */}
      <div className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#9E9B94] font-bold">
          [ AKSI CEPAT // TAMBAH KONTEN BARU ]
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <Link
            href="/admin/projects?action=create"
            className="border border-white/15 bg-[#141414] p-5 hover:border-accent hover:bg-accent/10 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-foreground font-bold">Tambah Proyek Baru</span>
                <span className="text-[11px] text-[#9E9B94]">Studi kasus, stack, metrik</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9E9B94] group-hover:text-accent transition-colors" />
          </Link>

          <Link
            href="/admin/certificates?action=create"
            className="border border-white/15 bg-[#141414] p-5 hover:border-accent hover:bg-accent/10 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-foreground font-bold">Tambah Sertifikat Baru</span>
                <span className="text-[11px] text-[#9E9B94]">Juara LKS, olimpiade, rekognisi</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9E9B94] group-hover:text-accent transition-colors" />
          </Link>

          <Link
            href="/admin/posters?action=create"
            className="border border-white/15 bg-[#141414] p-5 hover:border-accent hover:bg-accent/10 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-foreground font-bold">Tambah Poster Seri Baru</span>
                <span className="text-[11px] text-[#9E9B94]">Koleksi Swiss & editorial art</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9E9B94] group-hover:text-accent transition-colors" />
          </Link>
        </div>
      </div>

      {/* Two-Column Overview Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="border border-white/15 bg-[#121212] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 font-mono text-xs">
            <span className="text-[#F2EFE9] font-bold uppercase tracking-wider">
              Daftar Proyek Aktif ({data.projects.length})
            </span>
            <Link href="/admin/projects" className="text-accent hover:underline">
              Kelola Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {data.projects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 border border-white/5 bg-[#161616] flex justify-between items-center hover:border-white/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-accent font-semibold">{proj.index}</span>
                    <span className="text-[#F2EFE9] font-bold">{proj.title}</span>
                  </div>
                  <p className="text-xs text-[#9E9B94] font-sans line-clamp-1">
                    {proj.tagline || proj.summary}
                  </p>
                </div>
                <Link
                  href={`/admin/projects?edit=${proj.id}`}
                  className="font-mono text-xs text-accent hover:underline ml-4 flex-shrink-0"
                >
                  Edit ✎
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="border border-white/15 bg-[#121212] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 font-mono text-xs">
            <span className="text-[#F2EFE9] font-bold uppercase tracking-wider">
              Sertifikat & Prestasi ({data.achievements.length})
            </span>
            <Link href="/admin/certificates" className="text-accent hover:underline">
              Kelola Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {data.achievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                className="p-3.5 border border-white/5 bg-[#161616] flex justify-between items-center hover:border-white/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-accent/20 text-accent font-bold">
                      {ach.rank}
                    </span>
                    <span className="text-[#F2EFE9] font-semibold">{ach.title}</span>
                  </div>
                  <p className="text-xs text-[#9E9B94] font-sans">
                    {ach.issuer} ({ach.year})
                  </p>
                </div>
                <Link
                  href={`/admin/certificates?edit=${ach.id}`}
                  className="font-mono text-xs text-accent hover:underline ml-4 flex-shrink-0"
                >
                  Edit ✎
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
