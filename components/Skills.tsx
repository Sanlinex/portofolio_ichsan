"use client";

import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { PROFILE_DATA } from "@/data/profile";

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const marquee1Ref = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();

  // Scroll Velocity & SkewX Reaction
  useEffect(() => {
    if (!lenis) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = (e: { velocity: number }) => {
      const velocity = e.velocity || 0;
      const targetSkew = Math.max(-10, Math.min(10, velocity * 0.7));

      if (marquee1Ref.current && marquee2Ref.current) {
        gsap.to([marquee1Ref.current, marquee2Ref.current], {
          skewX: targetSkew,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (marquee1Ref.current && marquee2Ref.current) {
          gsap.to([marquee1Ref.current, marquee2Ref.current], {
            skewX: 0,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      }, 100);
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lenis]);

  // Entrance Reveal & Parallax Scrub
  useGSAP(
    () => {
      // 1. Floating Background Parallax Watermark
      const watermark = containerRef.current?.querySelector(".skills-watermark");
      if (watermark) {
        gsap.fromTo(
          watermark,
          { yPercent: -30, opacity: 0.02 },
          {
            yPercent: 30,
            opacity: 0.045,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // 2. Skill Cards Stagger Reveal & Subtle Parallax Drift
      const skillCards = skillsGridRef.current?.querySelectorAll(".skill-card-item");
      if (skillCards) {
        gsap.fromTo(
          skillCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skillsGridRef.current,
              start: "top 80%",
            },
          }
        );

        // Differential parallax for alternating cards
        skillCards.forEach((card, idx) => {
          const shift = idx % 2 === 0 ? -15 : 15;
          gsap.fromTo(
            card,
            { y: shift },
            {
              y: -shift,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen w-full bg-background text-foreground border-b border-[#0E0E0E]/15 py-20 sm:py-28 overflow-hidden"
    >
      {/* Floating Parallax Editorial Watermark */}
      <div className="skills-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[22vw] sm:text-[18vw] font-sans font-black text-[#0E0E0E]/[0.03] select-none whitespace-nowrap z-0 will-change-transform">
        ARSENAL // 05
      </div>

      {/* Section Header */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 pb-12 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#0E0E0E]/15 font-mono text-xs tracking-wider text-muted">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              05 // 08
            </span>
            <span className="text-foreground font-semibold">ARSENAL // SKILLS & TOOLS</span>
          </div>
          <span className="text-muted hidden sm:inline">VELOCITY-REACTIVE MARQUEE</span>
        </div>
      </div>

      {/* Two Giant Kinetic Typography Marquees */}
      <div className="space-y-4 sm:space-y-6 py-6 border-y border-[#0E0E0E]/15 bg-surface/50 select-none overflow-hidden">
        {/* Row 1: Leftward Infinite Marquee */}
        <div
          ref={marquee1Ref}
          className="flex whitespace-nowrap will-change-transform font-serif italic text-4xl sm:text-6xl lg:text-7xl tracking-tight text-foreground"
        >
          <div className="flex items-center gap-8 animate-[marquee_38s_linear_infinite]">
            {PROFILE_DATA.skills.marqueeRow1.concat(PROFILE_DATA.skills.marqueeRow1).map((item, idx) => (
              <span key={`m1-${idx}`} className="flex items-center gap-8">
                <span>{item}</span>
                <span className="text-accent font-sans not-italic text-2xl font-bold">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Reverse Marquee */}
        <div
          ref={marquee2Ref}
          className="flex whitespace-nowrap will-change-transform font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground/80 uppercase"
        >
          <div className="flex items-center gap-8 animate-[marquee-reverse_38s_linear_infinite]">
            {PROFILE_DATA.skills.marqueeRow2.concat(PROFILE_DATA.skills.marqueeRow2).map((item, idx) => (
              <span key={`m2-${idx}`} className="flex items-center gap-8">
                <span className={idx % 2 === 0 ? "text-accent" : ""}>{item}</span>
                <span className="text-muted/40 font-mono text-xl">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Editorial Skill Grid: "Core" & "Also" */}
      <div
        ref={skillsGridRef}
        className="max-w-[1720px] mx-auto px-6 sm:px-10 pt-16 sm:pt-24 space-y-16"
      >
        {/* Category: CORE ENGINE */}
        <div>
          <div className="flex items-baseline gap-4 pb-4 border-b border-[#0E0E0E]/15">
            <span className="font-mono text-xs text-accent font-bold tracking-widest uppercase">
              [ CATEGORY 01 ]
            </span>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
              Core Web Engineering
            </h3>
            <span className="font-mono text-xs text-muted ml-auto hidden sm:inline">
              PRIMARY ARSENAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8">
            {PROFILE_DATA.skills.core.map((skill, idx) => (
              <div
                key={idx}
                className="skill-card-item border border-[#0E0E0E]/15 bg-background p-6 sm:p-8 flex flex-col justify-between hover:border-accent transition-colors duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start font-mono text-xs text-muted mb-4">
                    <span className="text-accent font-bold">0{idx + 1}</span>
                    <span>{skill.years}</span>
                  </div>
                  <h4 className="font-serif italic text-3xl sm:text-4xl text-foreground group-hover:text-accent transition-colors">
                    {skill.name}
                  </h4>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted font-medium block mt-1">
                    {skill.level}
                  </span>
                </div>
                <p className="mt-6 font-sans text-xs sm:text-sm text-muted leading-relaxed border-t border-[#0E0E0E]/10 pt-4">
                  {skill.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category: ALSO (Poster Design & Article Dashboard) */}
        <div>
          <div className="flex items-baseline gap-4 pb-4 border-b border-[#0E0E0E]/15">
            <span className="font-mono text-xs text-accent font-bold tracking-widest uppercase">
              [ CATEGORY 02 ]
            </span>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
              Also // Visual Direction & Content Systems
            </h3>
            <span className="font-mono text-xs text-muted ml-auto hidden sm:inline">
              EDITORIAL CRAFT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-8">
            {PROFILE_DATA.skills.also.map((skill, idx) => (
              <div
                key={idx}
                className="skill-card-item border border-[#0E0E0E]/15 bg-background p-6 sm:p-8 flex flex-col justify-between hover:border-accent transition-colors duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start font-mono text-xs text-muted mb-4">
                    <span className="text-accent font-bold">0{idx + 4}</span>
                    <span>{skill.years}</span>
                  </div>
                  <h4 className="font-serif italic text-3xl sm:text-4xl text-foreground group-hover:text-accent transition-colors">
                    {skill.name}
                  </h4>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted font-medium block mt-1">
                    {skill.level}
                  </span>
                </div>
                <p className="mt-6 font-sans text-xs sm:text-sm text-muted leading-relaxed border-t border-[#0E0E0E]/10 pt-4">
                  {skill.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Supporting Technologies */}
        <div className="pt-8 border-t border-[#0E0E0E]/10">
          <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-4">
            SUPPORTING TECHNOLOGIES & WORKFLOWS:
          </span>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PROFILE_DATA.skills.secondary.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 font-mono text-xs bg-surface border border-[#0E0E0E]/15 text-foreground hover:bg-[#0E0E0E] hover:text-[#F2EFE9] transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
