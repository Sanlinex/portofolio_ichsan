import React from "react";
import Link from "next/link";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `All Poster Collections & Visual Direction | ${PROFILE_DATA.personal.name}`,
  description:
    "Arsip lengkap koleksi poster tipografi Swiss International Style, desain editorial majalah independen, dan estetika visual brutalist karya Muh. Rafli Ichsan.",
};

export default function AllPostersArchivePage() {
  const totalPosters = PROFILE_DATA.posters.reduce(
    (acc, curr) => acc + curr.gallery.length,
    0
  );

  return (
    <article className="min-h-screen w-full bg-background text-foreground pt-28 pb-24 px-6 sm:px-10 lg:px-16 selection:bg-accent selection:text-[#F2EFE9]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0E0E0E]/15 pb-6 font-mono text-xs uppercase tracking-widest text-muted">
          <Link
            href="/#posters"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE HOME // POSTER GALLERY</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-semibold">
              COMPLETE ARCHIVE // {PROFILE_DATA.posters.length} SERIES ({totalPosters} POSTERS)
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="px-2.5 py-1 border border-accent text-accent font-bold">
              VISUAL DIRECTION
            </span>
            <span>/</span>
            <span className="text-foreground font-semibold">SWISS POSTER ARCHIVE</span>
            <span>/</span>
            <span>2023 — 2024</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            Complete Poster Series &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Typographic Studio.
            </span>
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            Arsip lengkap eksplorasi tipografi Swiss International Style, ritme skala ekstrem, ruang negatif, dan manifesto editorial digital.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Total Seri Terkurasi</p>
              <p className="font-semibold text-accent">{PROFILE_DATA.posters.length} Seri Desain</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Total Karya Poster</p>
              <p className="font-semibold text-foreground">{totalPosters} Desain Lengkap</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Format Standar</p>
              <p className="font-semibold text-foreground">B1 (700 × 1000 MM)</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Disiplin Grid</p>
              <p className="font-semibold text-accent">12-Column Asymmetric</p>
            </div>
          </div>
        </div>

        {/* Series List with Interactive Multi-Poster Previews */}
        <div className="space-y-20 pt-6">
          {PROFILE_DATA.posters.map((poster) => (
            <div
              key={poster.id}
              className="border border-[#0E0E0E]/15 bg-surface p-6 sm:p-10 lg:p-12 space-y-8 hover:border-[#0E0E0E] transition-all shadow-sm"
            >
              {/* Series Top Bar */}
              <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-[#0E0E0E]/10 pb-4 font-mono text-xs">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-4xl text-accent font-normal">
                    {poster.index}
                  </span>
                  <span className="text-muted uppercase tracking-wider">
                    {poster.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold">[{poster.gallery.length} POSTER DI DALAM]</span>
                  <span className="text-muted">/</span>
                  <span className="text-foreground">{poster.year}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-foreground tracking-tight">
                  {poster.title}
                </h2>
                <p className="font-serif italic text-lg sm:text-xl text-accent">
                  {poster.subtitle}
                </p>
              </div>

              {/* Multi-Poster Grid Preview */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted block">
                  Koleksi Karya dalam Seri Ini ({poster.gallery.length} Desain):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {poster.gallery.map((item) => (
                    <Link
                      key={item.id}
                      href={`/poster/${poster.id}`}
                      className="group/sub p-2 border border-[#0E0E0E]/15 bg-background hover:border-accent transition-all block space-y-2 shadow-sm"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0A0C] border border-[#0E0E0E]/10">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-top select-none group-hover/sub:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-1.5 left-1.5 font-mono text-[9px] bg-black/80 text-white/90 px-1.5 py-0.5">
                          {item.index}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-sans text-xs font-bold text-foreground group-hover/sub:text-accent transition-colors line-clamp-1">
                          {item.title}
                        </p>
                        <p className="font-mono text-[10px] text-muted line-clamp-1 uppercase">
                          {item.dimensions}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Description & Tools */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-[#0E0E0E]/10">
                <div className="md:col-span-8 font-sans text-sm sm:text-base text-muted leading-relaxed">
                  <p>{poster.description}</p>
                </div>
                <div className="md:col-span-4 flex flex-col justify-between space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-muted uppercase block mb-1">TOOLS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {poster.tools.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-background border border-[#0E0E0E]/10 text-foreground text-[10px] uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/poster/${poster.id}`}
                      className="py-2.5 px-5 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5 w-full text-center"
                    >
                      <span>Buka Studio Seri {poster.index}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
