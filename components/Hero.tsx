"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";
import { useLenis } from "@/components/SmoothScroll";

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
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

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      // Fade-in metadata
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

      if (prefersReducedMotion) return;

      // 2. Scroll-Linked Scrub Animation
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Line 1 moves left, Line 2 moves right, both shrink and fade
      if (line1Ref.current && line2Ref.current) {
        scrubTl.to(
          line1Ref.current,
          {
            xPercent: -20,
            scale: 0.94,
            opacity: 0.12,
            ease: "none",
          },
          0
        );

        scrubTl.to(
          line2Ref.current,
          {
            xPercent: 20,
            scale: 0.94,
            opacity: 0.12,
            ease: "none",
          },
          0
        );
      }

      // Parallax corner & role metadata
      if (roleMetaRef.current) {
        scrubTl.to(roleMetaRef.current, { y: 120, opacity: 0, ease: "none" }, 0);
      }
      if (cornerLeftRef.current) {
        scrubTl.to(cornerLeftRef.current, { y: -80, opacity: 0.2, ease: "none" }, 0);
      }
      if (cornerRightRef.current) {
        scrubTl.to(cornerRightRef.current, { y: -60, opacity: 0.2, ease: "none" }, 0);
      }
      if (scrollIndicatorRef.current) {
        scrubTl.to(scrollIndicatorRef.current, { opacity: 0, y: 40, ease: "none" }, 0);
      }
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
      {/* Editorial Grid Lines in Background */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-6 lg:grid-cols-12 gap-0 border-x border-[#0E0E0E]/5 max-w-[1720px] mx-auto opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-[#0E0E0E]/5 h-full" />
        ))}
      </div>

      {/* Top Marginalia / Masthead Meta */}
      <div className="max-w-[1720px] mx-auto w-full relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#0E0E0E]/10 font-mono text-xs tracking-wider text-muted">
          <div ref={cornerLeftRef} className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              01 // 08
            </span>
            <span className="text-foreground font-semibold">
              {PROFILE_DATA.personal.issueNumber}
            </span>
          </div>

          <div ref={cornerRightRef} className="flex items-center gap-6">
            <span className="hidden sm:inline">SMK RPL ROOTS</span>
            <span className="text-[#0E0E0E]/20 hidden sm:inline">/</span>
            <span className="text-foreground font-medium">±3 YEARS DEV EXP</span>
            <span className="text-[#0E0E0E]/20">/</span>
            <span className="text-accent font-semibold">{PROFILE_DATA.personal.location}</span>
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
              {PROFILE_DATA.personal.role}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed font-sans">
              {PROFILE_DATA.personal.bioEditorial}
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
