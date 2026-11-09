"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { useProfile } from "@/context/ProfileContext";

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const { data } = useProfile();
  const personal = data.personal;
  const { scrollTo } = useLenis();
  const heroRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const roleMetaRef = useRef<HTMLDivElement>(null);
  const cornerLeftRef = useRef<HTMLDivElement>(null);
  const cornerRightRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);

  // Entrance Reveal & Scroll-linked Scrub
  useGSAP(
    () => {
      if (!isLoaded) return;

      // 1. Initial Character Mask Reveal
      const chars = heroRef.current?.querySelectorAll(".hero-char");
      if (chars && chars.length > 0) {
        gsap.fromTo(
          chars,
          { yPercent: 110, rotateZ: 4 },
          {
            yPercent: 0,
            rotateZ: 0,
            duration: 1.1,
            stagger: 0.028,
            ease: "power4.out",
            delay: 0.15,
          }
        );
      }

      // Fade-in metadata & luxury grid frames
      gsap.fromTo(
        [roleMetaRef.current, cornerLeftRef.current, cornerRightRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.65,
        }
      );

      const frame1 = heroRef.current?.querySelector(".hero-box-frame-1");
      const frame2 = heroRef.current?.querySelector(".hero-box-frame-2");
      if (frame1) {
        gsap.fromTo(
          frame1,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );
      }
      if (frame2) {
        gsap.fromTo(
          frame2,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out", delay: 0.45 }
        );
      }

      // 2. High-Impact Scroll-Linked Scrub Parallax (Desktop & Mobile)
      const mm = gsap.matchMedia();

      // Desktop / Tablet (>= 768px)
      mm.add("(min-width: 768px)", () => {
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        if (line1Ref.current && line2Ref.current) {
          scrubTl.to(
            line1Ref.current,
            {
              xPercent: -45,
              y: -40,
              scale: 0.92,
              opacity: 0.1,
              ease: "none",
            },
            0
          );

          scrubTl.to(
            line2Ref.current,
            {
              xPercent: 45,
              y: 40,
              scale: 0.92,
              opacity: 0.1,
              ease: "none",
            },
            0
          );
        }

        const watermark = heroRef.current?.querySelector(".hero-watermark");
        if (watermark) {
          scrubTl.to(watermark, { yPercent: 50, scale: 1.1, opacity: 0.08, ease: "none" }, 0);
        }

        // Luxury grid boxes differential parallax scrub
        const gridMatrix = heroRef.current?.querySelector(".hero-grid-matrix");
        const boxFrame1 = heroRef.current?.querySelector(".hero-box-frame-1");
        const boxFrame2 = heroRef.current?.querySelector(".hero-box-frame-2");
        const boxFrame3 = heroRef.current?.querySelector(".hero-box-frame-3");

        if (gridMatrix) {
          scrubTl.to(gridMatrix, { yPercent: 18, ease: "none" }, 0);
        }
        if (boxFrame1) {
          scrubTl.to(boxFrame1, { y: 70, scale: 0.97, opacity: 0.35, ease: "none" }, 0);
        }
        if (boxFrame2) {
          scrubTl.to(boxFrame2, { y: -50, scale: 1.02, opacity: 0.25, ease: "none" }, 0);
        }
        if (boxFrame3) {
          scrubTl.to(boxFrame3, { y: 95, opacity: 0.1, ease: "none" }, 0);
        }

        if (roleMetaRef.current) {
          scrubTl.to(roleMetaRef.current, { y: 140, opacity: 0, ease: "none" }, 0);
        }
        if (cornerLeftRef.current) {
          scrubTl.to(cornerLeftRef.current, { y: -90, opacity: 0.2, ease: "none" }, 0);
        }
        if (cornerRightRef.current) {
          scrubTl.to(cornerRightRef.current, { y: -70, opacity: 0.2, ease: "none" }, 0);
        }
        if (scrollIndicatorRef.current) {
          scrubTl.to(scrollIndicatorRef.current, { opacity: 0, y: 50, ease: "none" }, 0);
        }
      });

      // Mobile (< 768px): Distinct, smooth opposing parallax without breaking horizontal bounds
      mm.add("(max-width: 767px)", () => {
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        if (line1Ref.current && line2Ref.current) {
          scrubTl.to(
            line1Ref.current,
            {
              xPercent: -28,
              y: -25,
              scale: 0.94,
              opacity: 0.15,
              ease: "none",
            },
            0
          );

          scrubTl.to(
            line2Ref.current,
            {
              xPercent: 28,
              y: 25,
              scale: 0.94,
              opacity: 0.15,
              ease: "none",
            },
            0
          );
        }

        const watermark = heroRef.current?.querySelector(".hero-watermark");
        if (watermark) {
          scrubTl.to(watermark, { yPercent: 35, opacity: 0.06, ease: "none" }, 0);
        }

        const gridMatrix = heroRef.current?.querySelector(".hero-grid-matrix");
        const boxFrame1 = heroRef.current?.querySelector(".hero-box-frame-1");
        if (gridMatrix) {
          scrubTl.to(gridMatrix, { yPercent: 12, ease: "none" }, 0);
        }
        if (boxFrame1) {
          scrubTl.to(boxFrame1, { y: 40, opacity: 0.3, ease: "none" }, 0);
        }

        if (roleMetaRef.current) {
          scrubTl.to(roleMetaRef.current, { y: 80, opacity: 0, ease: "none" }, 0);
        }
        if (cornerLeftRef.current) {
          scrubTl.to(cornerLeftRef.current, { y: -50, opacity: 0.2, ease: "none" }, 0);
        }
      });

      return () => mm.revert();
    },
    { scope: heroRef, dependencies: [isLoaded] }
  );

  const splitTextToChars = (text: string, isSerifItalic = false) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="inline-block overflow-hidden align-top leading-none pb-2"
      >
        <span
          className={`hero-char inline-block will-change-transform ${
            isSerifItalic ? "font-serif italic font-normal text-accent pr-1 sm:pr-2" : "font-sans font-extrabold"
          }`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen pt-28 sm:pt-36 pb-12 px-6 sm:px-10 flex flex-col justify-between border-b border-[#0E0E0E]/15 overflow-hidden select-none bg-background text-foreground"
    >
      {/* LUXURY ARCHITECTURAL MODULAR GRID BOXES MATRIX */}
      <div className="hero-grid-matrix absolute inset-0 pointer-events-none max-w-[1720px] mx-auto z-0 overflow-hidden will-change-transform">
        {/* Full 2D Grid Matrix (GPU-cached texture, 0 CPU layout cost) */}
        <div
          className="relative w-full h-full border-l border-t border-[#0E0E0E]/10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 14, 14, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 14, 14, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "clamp(80px, 8.333vw, 143px) clamp(70px, 16.666vh, 120px)",
          }}
        >
          {/* Subtle Key Architectural Crosshair Markers at strategic intersections */}
          <span className="absolute top-[20%] left-[16.666%] font-mono text-[9px] text-[#0E0E0E]/30 -translate-x-1/2 -translate-y-1/2 select-none">+</span>
          <span className="absolute top-[20%] right-[16.666%] font-mono text-[9px] text-[#0E0E0E]/30 -translate-x-1/2 -translate-y-1/2 select-none">+</span>
          <span className="absolute top-[50%] left-[8.333%] font-mono text-[9px] text-accent/50 -translate-x-1/2 -translate-y-1/2 select-none">+</span>
          <span className="absolute top-[50%] right-[8.333%] font-mono text-[9px] text-[#0E0E0E]/30 -translate-x-1/2 -translate-y-1/2 select-none">+</span>
          <span className="absolute bottom-[20%] left-[25%] font-mono text-[9px] text-accent/50 -translate-x-1/2 -translate-y-1/2 select-none">+</span>
          <span className="absolute bottom-[20%] right-[25%] font-mono text-[9px] text-[#0E0E0E]/30 -translate-x-1/2 -translate-y-1/2 select-none">+</span>

          {/* Micro-coordinates engraved in background */}
          <span className="absolute top-4 left-6 font-mono text-[8px] text-muted/60 tracking-widest uppercase hidden lg:block">
            LOC // 106°49&apos;E
          </span>
          <span className="absolute top-4 right-6 font-mono text-[8px] text-accent/70 tracking-widest uppercase font-semibold hidden sm:block">
            ● ARCHIVE 2026
          </span>
          <span className="absolute bottom-4 left-6 font-mono text-[8px] text-muted/50 tracking-widest uppercase hidden lg:block">
            SWISS EDITORIAL MATRIX
          </span>
          <span className="absolute bottom-4 right-6 font-mono text-[8px] text-accent/60 tracking-widest uppercase font-semibold hidden sm:block">
            + REKAYASA RPL
          </span>
        </div>

        {/* LUXURY FLOATING ARCHITECTURAL FRAMES (Framing MUH RAFLI ICHSAN) */}
        {/* Frame 1: Prominent Luxury Double-Border Box */}
        <div className="hero-box-frame-1 absolute top-[28%] sm:top-[26%] left-[4%] sm:left-[8%] right-[4%] sm:right-[10%] h-[44%] sm:h-[48%] border border-[#0E0E0E]/15 bg-surface/50 shadow-sm pointer-events-none will-change-transform">
          {/* Subtle Inner Double Border */}
          <div className="absolute inset-1.5 border border-[#0E0E0E]/10 pointer-events-none" />

          {/* 4 Luxury Corner Accent Brackets */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-accent" />

          {/* Top Edge Luxury Metric Badge */}
          <div className="absolute -top-3 left-6 sm:left-10 bg-background px-3 py-0.5 border border-[#0E0E0E]/15 font-mono text-[9px] tracking-widest uppercase text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-foreground font-semibold">TYPOGRAPHIC MASTHEAD MATRIX</span>
            <span className="text-[#0E0E0E]/30">//</span>
            <span>ISSUE 01</span>
          </div>

          {/* Bottom Edge Registration Ticks */}
          <div className="absolute -bottom-2.5 right-6 sm:right-10 bg-background px-2.5 py-0.5 border border-[#0E0E0E]/15 font-mono text-[8px] tracking-wider text-muted/80 uppercase hidden sm:flex items-center gap-1.5">
            <span>CALIBRATION: 100% PRECISE</span>
            <span className="text-accent">✓</span>
          </div>
        </div>

        {/* Frame 2: Offset Geometric Blueprint Dashed Box (Opposing Depth) */}
        <div className="hero-box-frame-2 absolute top-[34%] sm:top-[32%] left-[8%] sm:left-[14%] right-[2%] sm:right-[6%] h-[40%] sm:h-[44%] border border-dashed border-accent/25 pointer-events-none will-change-transform">
          <div className="absolute top-2 right-3 font-mono text-[8px] text-[#0E0E0E]/30 tracking-widest uppercase hidden md:block">
            BOX REF // MRI-2026-X
          </div>
        </div>

        {/* Frame 3: Small luxury coordinate spec box in upper-right */}
        <div className="hero-box-frame-3 absolute top-[20%] right-[6%] w-40 sm:w-48 h-20 sm:h-24 border border-[#0E0E0E]/15 bg-background/95 p-2.5 font-mono text-[9px] text-muted space-y-1 hidden md:block will-change-transform shadow-xs">
          <div className="flex justify-between items-center text-[8px] text-accent font-bold border-b border-[#0E0E0E]/10 pb-1">
            <span>SPEC. RATIO</span>
            <span>16:9 GRID</span>
          </div>
          <div className="flex justify-between items-center text-[8px]">
            <span>ENGINE</span>
            <span className="text-foreground font-semibold">LARAVEL + NEXT</span>
          </div>
          <div className="flex justify-between items-center text-[8px]">
            <span>CRAFT</span>
            <span className="text-foreground font-semibold">SWISS EDITORIAL</span>
          </div>
        </div>
      </div>

      {/* Floating Parallax Editorial Watermark */}
      <div className="hero-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[20vw] sm:text-[18vw] font-sans font-black text-[#0E0E0E]/[0.035] select-none whitespace-nowrap z-0 will-change-transform">
        MUH. RAFLI
      </div>

      {/* Top Marginalia / Masthead Meta */}
      <div className="max-w-[1720px] mx-auto w-full relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#0E0E0E]/10 font-mono text-xs tracking-wider text-muted">
          <div ref={cornerLeftRef} className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              01 // 08
            </span>
            <span className="text-foreground font-semibold">
              {personal.issueNumber}
            </span>
          </div>

          <div ref={cornerRightRef} className="flex items-center gap-6">
            <span className="hidden sm:inline">SMK RPL ROOTS</span>
            <span className="text-[#0E0E0E]/20 hidden sm:inline">/</span>
            <span className="text-foreground font-medium">{personal.experienceYears} DEV EXP</span>
            <span className="text-[#0E0E0E]/20">/</span>
            <span className="text-accent font-semibold">{personal.location}</span>
          </div>
        </div>
      </div>

      {/* Center: Giant Two-Line Editorial Headline */}
      <div className="max-w-[1720px] mx-auto w-full my-auto py-12 sm:py-16 relative z-10 flex flex-col justify-center">
        {/* Line 1: MUH. RAFLI */}
        <div
          ref={line1Ref}
          className="will-change-transform text-hero-giant tracking-tightest leading-[0.84] text-foreground flex flex-wrap items-baseline gap-x-2 sm:gap-x-6"
        >
          <div className="inline-block whitespace-nowrap">
            {splitTextToChars("MUH.")}
          </div>
          <div className="inline-block whitespace-nowrap">
            {splitTextToChars("RAFLI", true)}
          </div>
        </div>

        {/* Line 2: ICHSAN */}
        <div
          ref={line2Ref}
          className="will-change-transform text-hero-giant tracking-tightest leading-[0.84] text-foreground mt-1 sm:mt-3"
        >
          <div className="inline-block whitespace-nowrap">
            {splitTextToChars("ICHSAN")}
          </div>
        </div>

        {/* Hero Role & Marginalia Subtext */}
        <div
          ref={roleMetaRef}
          className="mt-8 sm:mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6 border-t border-[#0E0E0E]/10"
        >
          <div className="max-w-xl">
            <span className="font-mono text-xs tracking-widest text-accent uppercase font-bold block mb-2">
              [ ROLE // POSITION ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
              {personal.role}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed font-sans">
              {personal.bioEditorial}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-right font-mono text-xs text-muted space-y-1">
            <span className="text-foreground font-semibold">CORE ARCHITECTURE</span>
            <span>LARAVEL • REACT JS • NEXT.JS</span>
            <span className="text-accent font-medium">AWWWARDS STANDARD CRAFT</span>
          </div>
        </div>
      </div>

      {/* Bottom: Pulsing Editorial Scroll Indicator */}
      <div className="max-w-[1720px] mx-auto w-full relative z-10 flex justify-between items-end pt-6 border-t border-[#0E0E0E]/10">
        <div className="hidden sm:block font-mono text-[11px] tracking-widest text-muted uppercase">
          [ SCROLL TO EXPLORE ARCHIVE ]
        </div>

        <button
          ref={scrollIndicatorRef}
          onClick={() => scrollTo("#about")}
          className="mx-auto sm:mr-0 group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
          aria-label="Scroll to About section"
        >
          <span className="font-mono text-[10px] tracking-widest text-foreground uppercase group-hover:text-accent transition-colors font-semibold">
            SCROLL
          </span>
          <div className="w-[1px] h-9 bg-[#0E0E0E]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-accent animate-pulse-subtle" />
          </div>
        </button>
      </div>
    </section>
  );
}
