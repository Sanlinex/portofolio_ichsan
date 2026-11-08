"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";

export default function PosterGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  // Entrance & Differential Scroll Parallax
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // Differential column parallax speeds
      if (col1Ref.current && col2Ref.current) {
        gsap.to(col1Ref.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(col2Ref.current, {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Clip-path reveal for poster cards
      const cards = containerRef.current?.querySelectorAll(".poster-card");
      if (cards) {
        gsap.fromTo(
          cards,
          {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            opacity: 0,
            y: 40,
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="posters"
      ref={containerRef}
      className="relative z-10 min-h-screen w-full bg-background text-foreground border-b border-[#0E0E0E]/15 px-6 sm:px-10 py-20 sm:py-28 overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#0E0E0E]/15 font-mono text-xs tracking-wider text-muted">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              07 // 08
            </span>
            <span className="text-foreground font-semibold">
              POSTER GALLERY // SWISS TYPOGRAPHY &amp; VISUAL DIRECTION
            </span>
          </div>
          <Link
            href="/poster"
            className="text-accent hover:underline font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>LIHAT SEMUA POSTER ({PROFILE_DATA.posters.length} SERI)</span>
            <span>↗</span>
          </Link>
        </div>

        <div className="py-10 max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight text-foreground">
            Visual Direction &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Swiss Typographic Posters.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted font-sans leading-relaxed">
            Eksplorasi tata letak asimetris, ritme tipografi berskala ekstrem, dan grid editorial.
            Setiap seri memuat banyak variasi poster tematik yang dapat ditinjau di halaman studio khusus.
          </p>
        </div>

        {/* Asymmetrical 2-Column Grid with Differential Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pt-10">
          {/* Column 1: Series 01 (Large Hero Series) */}
          <div ref={col1Ref} className="space-y-12 sm:space-y-16">
            {PROFILE_DATA.posters.slice(0, 1).map((poster) => (
              <Link
                key={poster.id}
                href={`/poster/${poster.id}`}
                data-cursor="Explore"
                className="poster-card block border border-[#0E0E0E]/15 bg-surface p-6 sm:p-8 space-y-6 group hover:border-[#0E0E0E] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                {/* Poster Graphic Frame with Real Artwork Image */}
                <div className="relative aspect-[3/4] w-full bg-[#0E0E0E] overflow-hidden border border-[#0E0E0E]/15 group-hover:scale-[1.01] transition-transform duration-500 shadow-inner">
                  <img
                    src={poster.coverImage}
                    alt={poster.title}
                    className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Badge & Poster Count Pill */}
                  <div className="absolute top-4 left-4 font-mono text-[10px] bg-[#0E0E0E]/85 text-[#F2EFE9] border border-white/20 px-2.5 py-1 tracking-widest uppercase backdrop-blur-sm">
                    {poster.index} // SERI UTAMA
                  </div>
                  <div className="absolute top-4 right-4 font-mono text-[10px] bg-accent text-white font-bold px-2.5 py-1 tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <span>{poster.gallery.length} POSTER DI DALAM</span>
                    <span>↗</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-[10px] font-mono tracking-wider text-[#F2EFE9] bg-[#0E0E0E]/80 backdrop-blur-sm px-3 py-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>BUKA HALAMAN STUDIO SERI</span>
                    <span className="text-accent font-bold">BUKA LENGKAP ↗</span>
                  </div>
                </div>

                {/* Mini Multi-Poster Thumbnail Preview Strip */}
                <div className="pt-2 border-t border-[#0E0E0E]/10 space-y-2">
                  <div className="flex justify-between items-center font-mono text-[10px] text-muted uppercase">
                    <span>Koleksi Seri ({poster.gallery.length} Desain):</span>
                    <span className="text-accent font-semibold">[BUKA STUDIO ↗]</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {poster.gallery.map((sub) => (
                      <div
                        key={sub.id}
                        className="relative aspect-[3/4] overflow-hidden border border-[#0E0E0E]/15 bg-background group/mini"
                      >
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="w-full h-full object-cover object-top select-none group-hover/mini:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-[#0E0E0E]/80 text-[#F2EFE9] font-mono text-[8px] text-center py-0.5">
                          {sub.index}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Poster Editorial Metadata */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-accent font-bold">[{poster.category}]</span>
                    <span className="text-muted">{poster.year}</span>
                  </div>
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-foreground group-hover:text-accent transition-colors">
                    {poster.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">
                    {poster.subtitle}
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed pt-1">
                    {poster.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {poster.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-background border border-[#0E0E0E]/10 text-foreground uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Column 2: Series 02 & Series 03 (Differential Parallax Offset) */}
          <div ref={col2Ref} className="space-y-12 sm:space-y-16 md:pt-12">
            {PROFILE_DATA.posters.slice(1).map((poster) => (
              <Link
                key={poster.id}
                href={`/poster/${poster.id}`}
                data-cursor="Explore"
                className="poster-card block border border-[#0E0E0E]/15 bg-surface p-6 sm:p-8 space-y-6 group hover:border-[#0E0E0E] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                {/* Poster Graphic Frame with Real Artwork Image */}
                <div className="relative aspect-[3/4] w-full bg-[#0E0E0E] overflow-hidden border border-[#0E0E0E]/15 group-hover:scale-[1.01] transition-transform duration-500 shadow-inner">
                  <img
                    src={poster.coverImage}
                    alt={poster.title}
                    className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Badge & Poster Count Pill */}
                  <div className="absolute top-4 left-4 font-mono text-[10px] bg-[#0E0E0E]/85 text-[#F2EFE9] border border-white/20 px-2.5 py-1 tracking-widest uppercase backdrop-blur-sm">
                    {poster.index} // ARCHIVE
                  </div>
                  <div className="absolute top-4 right-4 font-mono text-[10px] bg-accent text-white font-bold px-2.5 py-1 tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <span>{poster.gallery.length} POSTER DI DALAM</span>
                    <span>↗</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-[10px] font-mono tracking-wider text-[#F2EFE9] bg-[#0E0E0E]/80 backdrop-blur-sm px-3 py-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>BUKA HALAMAN STUDIO SERI</span>
                    <span className="text-accent font-bold">BUKA LENGKAP ↗</span>
                  </div>
                </div>

                {/* Mini Multi-Poster Thumbnail Preview Strip */}
                <div className="pt-2 border-t border-[#0E0E0E]/10 space-y-2">
                  <div className="flex justify-between items-center font-mono text-[10px] text-muted uppercase">
                    <span>Koleksi Seri ({poster.gallery.length} Desain):</span>
                    <span className="text-accent font-semibold">[BUKA STUDIO ↗]</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {poster.gallery.map((sub) => (
                      <div
                        key={sub.id}
                        className="relative aspect-[3/4] overflow-hidden border border-[#0E0E0E]/15 bg-background group/mini"
                      >
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="w-full h-full object-cover object-top select-none group-hover/mini:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-[#0E0E0E]/80 text-[#F2EFE9] font-mono text-[8px] text-center py-0.5">
                          {sub.index}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Poster Editorial Metadata */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-accent font-bold">[{poster.category}]</span>
                    <span className="text-muted">{poster.year}</span>
                  </div>
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-foreground group-hover:text-accent transition-colors">
                    {poster.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">
                    {poster.subtitle}
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed pt-1">
                    {poster.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {poster.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-background border border-[#0E0E0E]/10 text-foreground uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom See All Posters Callout Banner */}
        <div className="pt-16 flex flex-wrap justify-between items-center gap-4 border-t border-[#0E0E0E]/15 mt-16">
          <p className="font-sans text-xs text-muted">
            Eksplorasi tipografi Swiss, manifesto jurnalisme editorial, dan estetika visual brutalist lengkap.
          </p>
          <Link
            href="/poster"
            className="py-3 px-6 border border-accent bg-accent/10 hover:bg-accent hover:text-white text-accent font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <span>Buka Arsip Lengkap Seluruh Koleksi Poster (See All)</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
