"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PosterItem } from "@/data/profile";

interface PosterStudioClientProps {
  poster: PosterItem;
  prevPoster: PosterItem;
  nextPoster: PosterItem;
}

export default function PosterStudioClient({
  poster,
  prevPoster,
  nextPoster,
}: PosterStudioClientProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activePoster = poster.gallery[activeIndex] || poster.gallery[0];
  const containerRef = useRef<HTMLElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageImgRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const navCardsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation (ArrowLeft & ArrowRight to cycle posters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : poster.gallery.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < poster.gallery.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [poster.gallery.length]);

  // Entrance & High-Impact Parallax on Scroll
  useGSAP(
    () => {
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
        const specs = headerRef.current.querySelectorAll(".anim-spec");

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

        if (specs) {
          tl.fromTo(specs, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.4");
        }
      }

      // Stage Entrance & High-Impact Parallax Scrub
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top 85%",
            },
          }
        );

        if (stageImgRef.current) {
          gsap.fromTo(
            stageImgRef.current,
            { yPercent: -16 },
            {
              yPercent: 16,
              ease: "none",
              scrollTrigger: {
                trigger: stageRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // Thumbnail strip reveal
      if (stripRef.current) {
        const thumbs = stripRef.current.querySelectorAll(".anim-thumb");
        if (thumbs.length > 0) {
          gsap.fromTo(
            thumbs,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: stripRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }

      // Next series navigation cards
      if (navCardsRef.current) {
        gsap.fromTo(
          navCardsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: navCardsRef.current,
              start: "top 88%",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  // Smooth switch animation when active poster changes
  const activeImageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!activeImageRef.current) return;
    gsap.fromTo(
      activeImageRef.current,
      { opacity: 0.3, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [activeIndex]);

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
            href="/poster"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE SEMUA POSTER // ARCHIVE</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-semibold">
              SERI KOLEKSI // {poster.gallery.length} POSTER
            </span>
          </div>
        </div>

        {/* Series Header */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="anim-meta px-2.5 py-1 border border-accent text-accent font-bold">
              SERIES {poster.index}
            </span>
            <span className="anim-meta">/</span>
            <span className="anim-meta text-foreground font-semibold">{poster.category}</span>
            <span className="anim-meta">/</span>
            <span className="anim-meta">{poster.year}</span>
          </div>

          <h1 className="anim-title text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            {poster.title}
          </h1>

          <p className="anim-sub font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            {poster.subtitle}
          </p>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Total Poster</p>
              <p className="font-semibold text-accent">{poster.gallery.length} Desain Lengkap</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Format &amp; Dimensi</p>
              <p className="font-semibold text-foreground">B1 (700 × 1000 MM)</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Grid &amp; Tipografi</p>
              <p className="font-semibold text-foreground">Swiss 12-Col Modular</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Perangkat Desain</p>
              <p className="font-semibold text-foreground">{poster.tools.slice(0, 2).join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Dedicated Interactive Poster Stage */}
        <div ref={stageRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: High-Res Active Poster Viewer Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full bg-[#0A0A0C] border-2 border-[#0E0E0E]/20 overflow-hidden shadow-2xl flex items-center justify-center p-3 sm:p-6 group">
              <div
                ref={stageImgRef}
                className="absolute -inset-y-8 inset-x-0 w-full h-[138%] flex items-center justify-center will-change-transform"
              >
                <img
                  ref={activeImageRef}
                  src={activePoster.image}
                  alt={activePoster.title}
                  className="w-full h-full object-contain select-none transition-transform duration-300"
                />
              </div>

              {/* Navigation Arrows Overlay */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : poster.gallery.length - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0E0E0E]/80 hover:bg-accent text-[#F2EFE9] flex items-center justify-center border border-white/20 transition-colors font-mono text-lg cursor-pointer shadow-xl backdrop-blur-sm"
                aria-label="Poster sebelumnya"
                title="Tekan tanda panah kiri di keyboard"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev < poster.gallery.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0E0E0E]/80 hover:bg-accent text-[#F2EFE9] flex items-center justify-center border border-white/20 transition-colors font-mono text-lg cursor-pointer shadow-xl backdrop-blur-sm"
                aria-label="Poster berikutnya"
                title="Tekan tanda panah kanan di keyboard"
              >
                →
              </button>

              <div className="absolute bottom-4 right-6 font-mono text-[10px] text-[#F2EFE9]/40 tracking-wider pointer-events-none hidden sm:block uppercase">
                POSTER REF: {activePoster.id.toUpperCase()}
              </div>
            </div>

            {/* Developer File Info */}
            <div className="flex flex-wrap justify-between items-center gap-3 font-mono text-xs bg-surface border border-[#0E0E0E]/15 p-4">
              <div className="flex items-center gap-2">
                <span className="text-accent">📁</span>
                <span className="text-muted">
                  File path:{" "}
                  <code className="text-foreground font-semibold">
                    public{activePoster.image}
                  </code>
                </span>
              </div>
              <span className="text-[11px] text-muted hidden sm:inline">
                {activePoster.notes}
              </span>
            </div>
          </div>

          {/* Right Column: Active Poster Concept & Specs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 border-b border-[#0E0E0E]/15 pb-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-2.5 py-1 bg-accent text-white font-bold text-[10px] uppercase">
                  EDISI {activePoster.index}
                </span>
                <span className="text-muted">
                  DARI TOTAL {poster.gallery.length} POSTER
                </span>
              </div>
              <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {activePoster.title}
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                {activePoster.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-1 font-semibold">
                  [ ESENSI &amp; TEMA DESAIN ]
                </span>
                <p className="font-sans text-base text-foreground leading-relaxed">
                  {activePoster.concept}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-1 font-semibold">
                  [ FILOSOFI SERI ]
                </span>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  {poster.description}
                </p>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#0E0E0E]/15 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted uppercase">DIMENSI CETAK</span>
                <span className="font-semibold text-foreground">{activePoster.dimensions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted uppercase">TAHUN KARYA</span>
                <span className="text-accent font-semibold">{poster.year}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted uppercase">TOOLS</span>
                <span className="font-semibold text-foreground">{poster.tools.join(", ")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted uppercase">PALET WARNA</span>
                <div className="flex items-center gap-2">
                  {poster.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-[#0E0E0E]/20 inline-block shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={activePoster.image}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-3 px-6 bg-accent hover:bg-accent/90 text-white font-mono text-xs tracking-wider uppercase transition-colors font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Buka Resolusi Penuh di Tab Baru</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Multi-Poster Strip: "di dalam detail poster ada banyak poster nya" */}
        <div ref={stripRef} className="space-y-6 pt-10 border-t border-[#0E0E0E]/15">
          <div className="flex flex-wrap justify-between items-baseline gap-4 font-mono text-xs">
            <div>
              <span className="text-accent font-bold uppercase tracking-wider block">
                [ KOLEKSI LENGKAP SERI // {poster.gallery.length} DESAIN POSTER ]
              </span>
              <span className="text-muted text-[11px]">
                Klik poster di bawah atau gunakan tombol panah keyboard (← / →) untuk berpindah tampilan:
              </span>
            </div>
            <span className="text-muted">
              EDISI AKTIF: <span className="text-accent font-bold">0{activeIndex + 1}</span> / 0{poster.gallery.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {poster.gallery.map((sub, idx) => (
              <button
                key={sub.id}
                onClick={() => setActiveIndex(idx)}
                className={`anim-thumb p-3 border text-left transition-all cursor-pointer flex flex-col space-y-3 group ${
                  activeIndex === idx
                    ? "border-accent bg-accent/5 ring-2 ring-accent shadow-lg"
                    : "border-[#0E0E0E]/15 bg-surface hover:border-[#0E0E0E] hover:shadow-md"
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0A0C] border border-[#0E0E0E]/10">
                  <img
                    src={sub.image}
                    alt={sub.title}
                    className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {activeIndex === idx && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-[9px] font-mono text-white font-bold tracking-wider uppercase shadow">
                      SEDANG DILIHAT
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] bg-black/80 px-2 py-0.5 text-white/90">
                    {sub.index}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center font-mono text-[10px] text-muted">
                    <span className="text-accent font-semibold">EDISI {sub.index}</span>
                    <span>{sub.dimensions.split(" ")[0]}</span>
                  </div>
                  <h3 className="font-sans text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {sub.title}
                  </h3>
                  <p className="font-mono text-[10px] uppercase text-muted line-clamp-1">
                    {sub.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation to Next / Previous Poster Series */}
        <div ref={navCardsRef} className="pt-12 border-t border-[#0E0E0E]/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href={`/poster/${prevPoster.id}`}
              className="p-6 border border-[#0E0E0E]/15 bg-surface hover:border-[#0E0E0E] transition-all group block space-y-2 shadow-sm"
            >
              <span className="font-mono text-xs text-muted block group-hover:text-accent transition-colors">
                ← PREVIOUS SERIES (SERIES {prevPoster.index})
              </span>
              <p className="font-sans font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                {prevPoster.title}
              </p>
            </Link>

            <Link
              href={`/poster/${nextPoster.id}`}
              className="p-6 border border-[#0E0E0E]/15 bg-surface hover:border-[#0E0E0E] transition-all group block space-y-2 sm:text-right shadow-sm"
            >
              <span className="font-mono text-xs text-muted block group-hover:text-accent transition-colors">
                NEXT SERIES (SERIES {nextPoster.index}) →
              </span>
              <p className="font-sans font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                {nextPoster.title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
