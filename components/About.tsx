"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const pinContentRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const pill1Ref = useRef<HTMLSpanElement>(null);
  const pill2Ref = useRef<HTMLSpanElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Word-by-word opacity scrub
      const words = paragraphRef.current?.querySelectorAll(".about-word");
      if (!words || words.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: "+=170%",
          scrub: 0.8,
        },
      });

      // Floating Background Parallax Watermark
      const watermark = containerRef.current?.querySelector(".about-watermark");
      if (watermark) {
        tl.fromTo(
          watermark,
          { yPercent: -35, opacity: 0.02 },
          { yPercent: 35, opacity: 0.05, ease: "none" },
          0
        );
      }

      // 1. Scrub words from opacity 0.15 to 1.0 with subtle spatial rise
      tl.to(
        words,
        {
          opacity: 1,
          stagger: 0.05,
          ease: "power1.inOut",
        },
        0
      );

      // Paragraph gentle vertical floating depth
      if (paragraphRef.current) {
        tl.fromTo(
          paragraphRef.current,
          { y: 25 },
          { y: -25, ease: "none" },
          0
        );
      }

      // 2. Expand Pill 1 & Pill 2 via clip-path
      if (pill1Ref.current) {
        tl.fromTo(
          pill1Ref.current,
          { clipPath: "circle(0% at 50% 50%)", scale: 0.5, y: 15 },
          { clipPath: "circle(100% at 50% 50%)", scale: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.25
        );
      }

      if (pill2Ref.current) {
        tl.fromTo(
          pill2Ref.current,
          { clipPath: "circle(0% at 50% 50%)", scale: 0.5, y: 15 },
          { clipPath: "circle(100% at 50% 50%)", scale: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.6
        );
      }

      // 3. Counter Animation for 3 Stats
      const statElements = statsRef.current?.querySelectorAll(".stat-counter");
      if (statElements) {
        statElements.forEach((el, idx) => {
          const targetVal = PROFILE_DATA.personal.stats[idx]?.value || 0;
          const counterObj = { val: 0 };

          tl.to(
            counterObj,
            {
              val: targetVal,
              duration: 0.35,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counterObj.val));
              },
            },
            0.65 + idx * 0.1
          );
        });
      }
    },
    { scope: containerRef }
  );

  // Split sentence into words with pill placeholders inserted
  const manifestoSentencePart1 =
    "Saya merancang dan membangun sistem digital dengan disiplin rekayasa kejuruan RPL, menggabungkan arsitektur backend Laravel yang tangguh";
  const manifestoSentencePart2 =
    "serta antarmuka frontend React & Next.js yang presisi secara tipografi editorial,";
  const manifestoSentencePart3 =
    "menghasilkan software yang cepat, andal, dan terasa hidup di setiap interaksi.";

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 min-h-screen w-full bg-background text-foreground border-b border-[#0E0E0E]/15 overflow-hidden flex flex-col justify-center"
    >
      {/* Floating Parallax Editorial Watermark */}
      <div className="about-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[22vw] sm:text-[18vw] font-serif italic font-normal text-[#0E0E0E]/[0.03] select-none whitespace-nowrap z-0 will-change-transform">
        MANIFESTO // 02
      </div>

      <div
        ref={pinContentRef}
        className="max-w-[1720px] mx-auto w-full px-6 sm:px-10 py-16 sm:py-24 flex flex-col justify-between min-h-[90vh] relative z-10"
      >
        {/* Section Header Marginalia */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#0E0E0E]/10 font-mono text-xs tracking-wider text-muted">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              02 // 08
            </span>
            <span className="text-foreground font-semibold">ABOUT // EDITORIAL MANIFESTO</span>
          </div>
          <span className="text-muted hidden sm:inline">DISCIPLINE OF CRAFT & CODE</span>
        </div>

        {/* Big Word-by-Word Scrub Manifesto with 2 Expandable Inline Pills */}
        <div className="my-auto py-10 sm:py-16 max-w-6xl">
          <p
            ref={paragraphRef}
            className="text-editorial-quote font-serif font-normal text-foreground leading-[1.25] tracking-tight select-none"
          >
            <span className="editorial-drop-cap font-serif italic text-accent pr-1">S</span>
            {manifestoSentencePart1.slice(1).split(" ").map((word, i) => (
              <span
                key={`p1-${i}`}
                className="about-word inline-block opacity-15 transition-opacity mr-[0.28em]"
              >
                {word}
              </span>
            ))}

            {/* Pill Thumbnail 1: Inline Pill Badge */}
            <span
              ref={pill1Ref}
              className="inline-flex items-center justify-center align-middle mx-2 px-3 py-1 bg-[#0E0E0E] text-[#F2EFE9] rounded-full text-xs font-mono tracking-widest uppercase border border-accent will-change-transform select-none shadow-sm"
              style={{ clipPath: "circle(0% at 50% 50%)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
              <span>LARAVEL CORE</span>
            </span>

            {manifestoSentencePart2.split(" ").map((word, i) => (
              <span
                key={`p2-${i}`}
                className="about-word inline-block opacity-15 transition-opacity mr-[0.28em]"
              >
                {word}
              </span>
            ))}

            {/* Pill Thumbnail 2: Award / Trophy Badge */}
            <span
              ref={pill2Ref}
              className="inline-flex items-center justify-center align-middle mx-2 px-3 py-1 bg-accent text-[#F2EFE9] rounded-full text-xs font-mono tracking-widest uppercase border border-[#0E0E0E] will-change-transform select-none shadow-sm"
              style={{ clipPath: "circle(0% at 50% 50%)" }}
            >
              <span>AWARD WINNER 🏆</span>
            </span>

            {manifestoSentencePart3.split(" ").map((word, i) => (
              <span
                key={`p3-${i}`}
                className="about-word inline-block opacity-15 transition-opacity mr-[0.28em]"
              >
                {word}
              </span>
            ))}
          </p>

          {/* Secondary Editorial Narrative Bio */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#0E0E0E]/10 font-sans text-sm sm:text-base text-muted leading-relaxed">
            <p>{PROFILE_DATA.personal.bioParagraphs[0]}</p>
            <p>{PROFILE_DATA.personal.bioParagraphs[1]}</p>
          </div>
        </div>

        {/* 3 Key Statistics with Scrub-Triggered Numerical Counter */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-[#0E0E0E]/15"
        >
          {PROFILE_DATA.personal.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col border-l-2 border-accent pl-4 sm:pl-6">
              <div className="flex items-baseline gap-1 font-mono text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
                <span className="stat-counter">0</span>
                <span className="text-accent font-semibold">{stat.suffix}</span>
              </div>
              <span className="mt-2 font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                {stat.label}
              </span>
              <p className="mt-1 font-sans text-xs text-muted leading-normal">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
