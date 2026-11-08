"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PosterItem } from "@/data/profile";

interface AllPostersClientProps {
  posters: PosterItem[];
}

export default function AllPostersClient({ posters }: AllPostersClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPosters = posters.reduce(
    (acc, curr) => acc + curr.gallery.length,
    0
  );

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (breadcrumbRef.current) {
        tl.fromTo(
          breadcrumbRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 }
        );
      }

      if (headerRef.current) {
        const metaPills = headerRef.current.querySelectorAll(".anim-meta");
        const title = headerRef.current.querySelector(".anim-title");
        const subtitle = headerRef.current.querySelector(".anim-sub");
        const stats = headerRef.current.querySelectorAll(".anim-stat");

        tl.fromTo(
          metaPills,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "-=0.3"
        );

        if (title) {
          tl.fromTo(
            title,
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 35, opacity: 0 },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
            "-=0.3"
          );
        }

        if (subtitle) {
          tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");
        }

        if (stats) {
          tl.fromTo(stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.4");
        }
      }

      // Card reveals on scroll
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".archive-poster-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
            }
          );
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <article
      ref={containerRef}
      className="min-h-screen w-full bg-background text-foreground pt-28 pb-24 px-6 sm:px-10 lg:px-16 selection:bg-accent selection:text-[#F2EFE9]"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation Breadcrumb Bar */}
        <div
          ref={breadcrumbRef}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0E0E0E]/15 pb-6 font-mono text-xs uppercase tracking-widest text-muted"
        >
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
              COMPLETE ARCHIVE // {posters.length} SERIES ({totalPosters} POSTERS)
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="anim-meta px-2.5 py-1 border border-accent text-accent font-bold">
              VISUAL DIRECTION
            </span>
            <span className="anim-meta">/</span>
            <span className="anim-meta text-foreground font-semibold">SWISS POSTER ARCHIVE</span>
            <span className="anim-meta">/</span>
            <span className="anim-meta">2023 — 2024</span>
          </div>

          <h1 className="anim-title text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            Complete Poster Series &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Typographic Studio.
            </span>
          </h1>

          <p className="anim-sub font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            Arsip lengkap eksplorasi tipografi Swiss International Style, ritme skala ekstrem, ruang negatif, dan manifesto editorial digital.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div className="anim-stat">
              <p className="text-muted uppercase tracking-wider mb-1">Total Seri Terkurasi</p>
              <p className="font-semibold text-accent">{posters.length} Seri Desain</p>
            </div>
            <div className="anim-stat">
              <p className="text-muted uppercase tracking-wider mb-1">Total Karya Poster</p>
              <p className="font-semibold text-foreground">{totalPosters} Desain Lengkap</p>
            </div>
            <div className="anim-stat">
              <p className="text-muted uppercase tracking-wider mb-1">Format Standar</p>
              <p className="font-semibold text-foreground">B1 (700 × 1000 MM)</p>
            </div>
            <div className="anim-stat">
              <p className="text-muted uppercase tracking-wider mb-1">Disiplin Grid</p>
              <p className="font-semibold text-accent">12-Column Asymmetric</p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Grid for Poster Series */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {posters.map((poster) => (
            <div
              key={poster.id}
              className="archive-poster-card border border-[#0E0E0E]/15 bg-surface p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#0E0E0E] transition-all shadow-sm group"
            >
              <div className="space-y-4">
                {/* Series Top Bar */}
                <div className="flex justify-between items-baseline border-b border-[#0E0E0E]/10 pb-3 font-mono text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif italic text-3xl text-accent font-normal">
                      {poster.index}
                    </span>
                    <span className="text-muted uppercase tracking-wider text-[11px] truncate max-w-[160px]">
                      {poster.category}
                    </span>
                  </div>
                  <span className="text-accent font-bold text-[11px]">
                    [{poster.gallery.length} POSTER]
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-sans font-bold text-foreground tracking-tight group-hover:text-accent transition-colors line-clamp-1">
                    {poster.title}
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted line-clamp-1">
                    {poster.subtitle}
                  </p>
                </div>

                {/* Multi-Poster Thumbnail Grid Preview */}
                <div className="space-y-2">
                  <span className="font-mono text-[11px] text-muted uppercase block">
                    Koleksi ({poster.gallery.length} Edisi Poster):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {poster.gallery.map((item) => (
                      <Link
                        key={item.id}
                        href={`/poster/${poster.id}`}
                        className="group/sub relative aspect-[3/4] overflow-hidden border border-[#0E0E0E]/15 bg-[#0A0A0C] hover:border-accent transition-all block"
                        title={item.title}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-top select-none group-hover/sub:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-1 left-1 font-mono text-[8px] bg-black/80 text-white/90 px-1 py-0.5">
                          {item.index}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {poster.description}
                </p>
              </div>

              {/* Tools & CTA Button */}
              <div className="space-y-4 pt-4 border-t border-[#0E0E0E]/10 font-mono text-xs">
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

                <Link
                  href={`/poster/${poster.id}`}
                  className="py-2.5 px-4 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5 w-full text-center text-xs"
                >
                  <span>Buka Studio Seri {poster.index}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
