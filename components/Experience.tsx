"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Divider 1px Lines "Draw" from left to right (scaleX scrub)
      const dividerLines = containerRef.current?.querySelectorAll(".exp-divider-line");
      if (dividerLines) {
        dividerLines.forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: line,
                start: "top 90%",
                end: "top 60%",
                scrub: prefersReducedMotion ? false : 0.6,
              },
            }
          );
        });
      }

      // 2. Rows Stagger Entrance
      const rowItems = rowsRef.current?.querySelectorAll(".exp-row-item");
      if (rowItems && !prefersReducedMotion) {
        gsap.fromTo(
          rowItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rowsRef.current,
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
      id="experience"
      ref={containerRef}
      className="relative min-h-screen w-full bg-background text-foreground border-b border-[#0E0E0E]/15 px-6 sm:px-10 py-20 sm:py-28"
    >
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Sticky Left Column: Editorial Marginalia */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted">
              <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
                03 // 08
              </span>
              <span className="text-foreground font-semibold">CAREER & INTERNSHIPS</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
              Experience & <br />
              <span className="font-serif italic font-normal text-accent">
                Production Record.
              </span>
            </h2>

            <p className="font-sans text-sm text-muted leading-relaxed max-w-sm">
              Rekam jejak kerja nyata dari perancangan arsitektur CMS media digital hingga modul transaksi kasir ritel berkecepatan tinggi.
            </p>

            <div className="pt-6 border-t border-[#0E0E0E]/10 font-mono text-xs text-muted space-y-2">
              <div className="flex justify-between">
                <span>TOTAL SPAN</span>
                <span className="text-foreground font-medium">±3 TAHUN REKAYASA</span>
              </div>
              <div className="flex justify-between">
                <span>INTERNSHIPS</span>
                <span className="text-foreground font-medium">TRANSISI & PAKE-POS</span>
              </div>
              <div className="flex justify-between">
                <span>SPECIALIZATION</span>
                <span className="text-accent font-medium">FULLSTACK & SYSTEMS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Giant Typographic Rows */}
        <div ref={rowsRef} className="lg:col-span-8 flex flex-col">
          {PROFILE_DATA.experiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="exp-row-item group relative py-10 sm:py-14 transition-transform duration-300 hover:translate-x-3 cursor-pointer"
            >
              {/* Top 1px Animated Divider Line */}
              <div className="exp-divider-line absolute top-0 left-0 right-0 h-[1px] bg-[#0E0E0E]/20 origin-left" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                {/* Index & Period */}
                <div className="md:col-span-3 flex flex-col font-mono text-xs text-muted space-y-1">
                  <span className="text-accent font-semibold">[{exp.index}]</span>
                  <span className="text-foreground font-medium">{exp.period}</span>
                  <span className="text-[11px] uppercase tracking-wider text-muted/70">
                    {exp.type}
                  </span>
                </div>

                {/* Company Name as Giant Headline & Role */}
                <div className="md:col-span-9 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-foreground transition-all duration-300 group-hover:font-serif group-hover:italic group-hover:text-accent">
                      {exp.company}
                    </h3>
                    <span className="font-mono text-2xl text-accent opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      →
                    </span>
                  </div>

                  <div className="font-mono text-xs sm:text-sm uppercase tracking-wider text-muted font-medium">
                    {exp.role} <span className="text-[#0E0E0E]/30 mx-2">•</span> {exp.location}
                  </div>

                  <p className="font-sans text-sm sm:text-base text-muted leading-relaxed pt-2">
                    {exp.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-foreground/80 font-sans list-disc list-inside">
                    {exp.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {exp.stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 text-[11px] font-mono tracking-wider bg-surface border border-[#0E0E0E]/10 text-foreground uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom 1px Animated Divider Line on last element */}
              {idx === PROFILE_DATA.experiences.length - 1 && (
                <div className="exp-divider-line absolute bottom-0 left-0 right-0 h-[1px] bg-[#0E0E0E]/20 origin-left" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
