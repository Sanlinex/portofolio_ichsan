"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";

export default function Education() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const lines = cardRef.current?.querySelectorAll(".edu-reveal");
      if (lines) {
        gsap.fromTo(
          lines,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
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
      id="education"
      ref={containerRef}
      className="relative w-full bg-background text-foreground border-b border-[#0E0E0E]/15 px-6 sm:px-10 py-20 sm:py-24"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#0E0E0E]/15 font-mono text-xs tracking-wider text-muted">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              08 // 08
            </span>
            <span className="text-foreground font-semibold">ACADEMIC FOUNDATION // EDUCATION</span>
          </div>
          <span className="text-muted hidden sm:inline">TECHNICAL DISCIPLINE</span>
        </div>

        {/* Clean, Refined Block */}
        <div
          ref={cardRef}
          className="mt-12 max-w-4xl border border-[#0E0E0E]/15 bg-surface/40 p-8 sm:p-12 space-y-6"
        >
          <div className="edu-reveal flex flex-wrap justify-between items-baseline gap-4 font-mono text-xs text-muted border-b border-[#0E0E0E]/10 pb-4">
            <span className="text-accent font-bold uppercase tracking-widest">
              [ KEJURUAN TEKNIK // RPL ]
            </span>
            <span className="text-foreground font-semibold">
              {PROFILE_DATA.education.period}
            </span>
          </div>

          <div className="edu-reveal space-y-2">
            <h3 className="font-serif italic text-3xl sm:text-5xl text-foreground">
              {PROFILE_DATA.education.degree}
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-muted font-medium">
              {PROFILE_DATA.education.institution}
            </p>
          </div>

          <p className="edu-reveal font-sans text-sm sm:text-base text-muted leading-relaxed">
            {PROFILE_DATA.education.description}
          </p>

          <div className="edu-reveal pt-4 border-t border-[#0E0E0E]/10">
            <span className="font-mono text-xs text-foreground font-semibold uppercase tracking-wider block mb-3">
              FOKUS KOMPETENSI REKAYASA:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs sm:text-sm text-foreground/80">
              {PROFILE_DATA.education.courses.map((course, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
