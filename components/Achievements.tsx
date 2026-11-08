"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA, AchievementItem } from "@/data/profile";

export default function Achievements() {
  const containerRef = useRef<HTMLElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeAchievement, setActiveAchievement] = useState<AchievementItem | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Floating Preview Cursor Follower with Lerp
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const xTo = gsap.quickTo(preview, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.35, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX + 24);
      yTo(e.clientY - 120);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Entrance Clip-Path Reveal
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const rows = rowsContainerRef.current?.querySelectorAll(".ach-row");
      if (rows) {
        gsap.fromTo(
          rows,
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
              trigger: rowsContainerRef.current,
              start: "top 80%",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative min-h-screen w-full bg-background text-foreground border-b border-[#0E0E0E]/15 px-6 sm:px-10 py-20 sm:py-28 overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#0E0E0E]/15 font-mono text-xs tracking-wider text-muted">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              04 // 08
            </span>
            <span className="text-foreground font-semibold">HONORS &amp; COMPETITIVE AWARDS</span>
          </div>
          <span className="text-muted hidden sm:inline">KLIK BARIS UNTUK BUKA SERTIFIKAT RESMI</span>
        </div>

        <div className="py-10">
          <h2 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight text-foreground">
            Podium Honors &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Official Competitive Record.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted font-sans max-w-xl leading-relaxed">
            Pencapaian rekayasa web kompetitif di bawah tekanan waktu, dinilai langsung oleh praktisi industri dan dinas pendidikan.
          </p>
        </div>

        {/* Editorial Table */}
        <div ref={rowsContainerRef} className="border-t border-[#0E0E0E]/15 flex flex-col">
          {PROFILE_DATA.achievements.map((ach) => (
            <Link
              key={ach.id}
              href={`/certificate/${ach.id}`}
              aria-label={`Buka halaman detail sertifikat resmi ${ach.title}`}
              data-cursor="Inspect"
              onMouseEnter={() => {
                setActiveAchievement(ach);
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
              }}
              className="ach-row group relative border-b border-[#0E0E0E]/15 px-4 sm:px-8 py-8 sm:py-12 transition-colors duration-400 hover:bg-[#0E0E0E] hover:text-[#F2EFE9] cursor-pointer focus:outline-none focus:bg-[#0E0E0E] focus:text-[#F2EFE9] block"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
                {/* Massive Rank Typography */}
                <div className="lg:col-span-3 flex items-baseline gap-4">
                  <span className="font-serif italic text-6xl sm:text-7xl lg:text-8xl font-normal leading-none text-accent group-hover:text-accent transition-colors">
                    {ach.rank}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted group-hover:text-[#9E9B94]">
                    PLACE
                  </span>
                </div>

                {/* Title & Category */}
                <div className="lg:col-span-6 space-y-2">
                  <h3 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-foreground group-hover:text-[#F2EFE9] transition-colors">
                    {ach.title}
                  </h3>
                  <div className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-[#9E9B94]">
                    {ach.category}
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-muted group-hover:text-[#F2EFE9]/80 leading-relaxed pt-1">
                    {ach.description}
                  </p>
                </div>

                {/* Issuer, Year & Clickable CTA Pill */}
                <div className="lg:col-span-3 flex lg:flex-col justify-between items-start lg:items-end font-mono text-xs text-muted group-hover:text-[#9E9B94] space-y-2">
                  <span className="text-foreground group-hover:text-[#F2EFE9] font-medium text-right">
                    {ach.issuer}
                  </span>
                  <span className="text-accent font-semibold">{ach.year}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-accent/40 bg-accent/10 group-hover:bg-accent group-hover:text-[#F2EFE9] text-accent text-[11px] font-mono tracking-wider uppercase transition-all duration-300 rounded-full mt-2">
                    <span>LIHAT SERTIFIKAT</span>
                    <span>↗</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Certificate / Honor Preview Following Cursor */}
      <div
        ref={previewRef}
        className={`pointer-events-none fixed top-0 left-0 z-50 w-72 bg-[#121214] text-[#F2EFE9] border border-white/20 p-4 shadow-2xl transition-opacity duration-300 ${
          isHovering && activeAchievement ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        {activeAchievement && (
          <div className="space-y-3">
            <div className="relative aspect-[1200/850] w-full overflow-hidden border border-white/10 bg-[#F8F6F0]">
              <img
                src={activeAchievement.certificatePlaceholder}
                alt={activeAchievement.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] text-accent border-b border-white/10 pb-1">
              <span>PODIUM RECORD</span>
              <span>{activeAchievement.year}</span>
            </div>
            <div className="font-sans font-bold text-sm text-[#F2EFE9] line-clamp-1">
              {activeAchievement.title}
            </div>
            <div className="font-mono text-[10px] text-[#9E9B94] tracking-wider uppercase">
              {activeAchievement.issuer}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
