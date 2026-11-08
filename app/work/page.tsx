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

        {/* Comprehensive Projects Grid */}
        <div className="space-y-16 pt-6">
          {PROFILE_DATA.projects.map((proj) => (
            <div
              key={proj.id}
              className="border border-[#0E0E0E]/15 bg-surface p-6 sm:p-10 lg:p-12 space-y-8 hover:border-[#0E0E0E] transition-all shadow-sm"
            >
              {/* Card Top Meta */}
              <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-[#0E0E0E]/10 pb-4 font-mono text-xs">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-3xl sm:text-4xl text-accent font-normal">
                    {proj.index}
                  </span>
                  <span className="text-muted uppercase tracking-wider">
                    {proj.client}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <span>{proj.period}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-foreground font-semibold uppercase">{proj.role}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-foreground tracking-tight">
                  {proj.title}
                </h2>
                <p className="font-serif italic text-lg sm:text-xl text-accent">
                  {proj.tagline}
                </p>
              </div>

              {/* Pure Screenshot Image Frame */}
              <div className="relative w-full aspect-[16/9] max-h-[460px] overflow-hidden border border-[#0E0E0E]/15 bg-[#121214] shadow-inner group">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover object-top select-none group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Summary & Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                <div className="md:col-span-8 space-y-3 font-sans text-sm sm:text-base text-muted leading-relaxed">
                  <p className="text-foreground font-medium">{proj.summary}</p>
                  <p className="text-xs sm:text-sm">{proj.challenge}</p>
                </div>

                <div className="md:col-span-4 space-y-3 font-mono text-xs border-t md:border-t-0 md:border-l border-[#0E0E0E]/10 md:pl-6 pt-4 md:pt-0">
                  <span className="text-muted uppercase block font-semibold">HASIL &amp; METRIK UTAMA:</span>
                  <div className="space-y-2">
                    {proj.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#0E0E0E]/10 pb-1.5">
                        <span className="text-muted text-[11px] uppercase">{m.label}</span>
                        <span className="font-bold text-accent text-sm">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Tech Stack & Action Links */}
              <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-[#0E0E0E]/10 font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((st, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[11px] bg-background border border-[#0E0E0E]/15 text-foreground uppercase tracking-wider"
                    >
                      {st}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={proj.githubUrl || "https://github.com/Sanlinex"}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 border border-[#0E0E0E]/20 hover:border-[#0E0E0E] text-foreground tracking-wider uppercase transition-colors"
                  >
                    GitHub ↗
                  </a>
                  <Link
                    href={`/work/${proj.slug}`}
                    className="py-2.5 px-5 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Studi Kasus Lengkap</span>
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
