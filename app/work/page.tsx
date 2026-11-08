import React from "react";
import Link from "next/link";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `All Projects & Engineering Archive | ${PROFILE_DATA.personal.name}`,
  description:
    "Katalog lengkap studi kasus rekayasa web, arsitektur aplikasi fullstack, CMS redaksi berita, dan sistem kasir ritel offline-first karya Muh. Rafli Ichsan.",
};

export default function AllWorksArchivePage() {
  return (
    <article className="min-h-screen w-full bg-background text-foreground pt-28 pb-24 px-6 sm:px-10 lg:px-16 selection:bg-accent selection:text-[#F2EFE9]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0E0E0E]/15 pb-6 font-mono text-xs uppercase tracking-widest text-muted">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE HOME // SELECTED WORKS</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-semibold">
              COMPLETE PORTFOLIO // {PROFILE_DATA.projects.length} PROJECTS
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="px-2.5 py-1 border border-accent text-accent font-bold">
              FULL ARCHIVE
            </span>
            <span>/</span>
            <span className="text-foreground font-semibold">FULLSTACK WEB ENGINEERING</span>
            <span>/</span>
            <span>2022 — SEKARANG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            Complete Projects &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Engineering Cases.
            </span>
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            Arsip lengkap sistem web komprehensif, arsitektur dashboard redaksi CMS, terminal kasir ritel offline-first, dan solusi digital UMKM.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Total Proyek</p>
              <p className="font-semibold text-accent">{PROFILE_DATA.projects.length} Studi Kasus Lengkap</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Fokus Stack</p>
              <p className="font-semibold text-foreground">Next.js, Laravel, React, TS</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Pengalaman</p>
              <p className="font-semibold text-foreground">±3 Tahun Fullstack</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Status Sistem</p>
              <p className="font-semibold text-accent">Production Ready &amp; Audited</p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Grid (Compact & Well-Proportioned) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {PROFILE_DATA.projects.map((proj) => (
            <div
              key={proj.id}
              className="border border-[#0E0E0E]/15 bg-surface p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#0E0E0E] transition-all shadow-sm group"
            >
              <div className="space-y-4">
                {/* Card Top Meta */}
                <div className="flex justify-between items-baseline border-b border-[#0E0E0E]/10 pb-3 font-mono text-xs">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif italic text-3xl text-accent font-normal">
                      {proj.index}
                    </span>
                    <span className="text-muted uppercase tracking-wider text-[11px] line-clamp-1">
                      {proj.client}
                    </span>
                  </div>
                  <span className="text-foreground font-semibold text-[11px] uppercase flex-shrink-0">
                    {proj.period}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-sans font-bold text-foreground tracking-tight group-hover:text-accent transition-colors line-clamp-1">
                    {proj.title}
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted line-clamp-1">
                    {proj.tagline}
                  </p>
                </div>

                {/* Pure Screenshot Image Frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#0E0E0E]/15 bg-[#121214] shadow-inner">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Summary */}
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {proj.summary}
                </p>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  {proj.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="bg-background border border-[#0E0E0E]/10 p-2">
                      <span className="text-muted uppercase text-[9px] block">{m.label}</span>
                      <span className="font-bold text-accent text-xs">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Tech Stack & Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-[#0E0E0E]/10 font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.slice(0, 4).map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] bg-background border border-[#0E0E0E]/10 text-foreground uppercase tracking-wider"
                    >
                      {st}
                    </span>
                  ))}
                  {proj.stack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-muted">
                      +{proj.stack.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={proj.githubUrl || "https://github.com/Sanlinex"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 px-3 border border-[#0E0E0E]/20 hover:border-[#0E0E0E] text-foreground tracking-wider uppercase transition-colors text-xs font-semibold"
                  >
                    GitHub ↗
                  </a>
                  <Link
                    href={`/work/${proj.slug}`}
                    className="flex-1 text-center py-2 px-3 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Studi Kasus</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="p-8 sm:p-12 border border-[#0E0E0E]/15 bg-background text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
            [ READY FOR NEW CHALLENGES ]
          </span>
          <h3 className="font-serif italic text-3xl sm:text-4xl text-foreground">
            Punya ide atau proyek web yang ingin diwujudkan?
          </h3>
          <p className="font-sans text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Terbuka untuk kolaborasi fullstack kustom, perancangan dashboard CMS berita, atau sistem antarmuka web performan tinggi.
          </p>
          <div className="pt-2">
            <Link
              href="/#contact"
              className="inline-block py-3 px-8 bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold tracking-widest uppercase transition-colors shadow-md"
            >
              Hubungi Rafli Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
