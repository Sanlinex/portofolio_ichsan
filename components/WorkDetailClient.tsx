"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ProjectItem } from "@/data/profile";

interface WorkDetailClientProps {
  project: ProjectItem;
  nextProject: ProjectItem;
}

export default function WorkDetailClient({
  project,
  nextProject,
}: WorkDetailClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const challengeRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // 1. Initial Page Entrance Stagger
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
        const tagline = headerRef.current.querySelector(".anim-tagline");
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

        if (tagline) {
          tl.fromTo(
            tagline,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5"
          );
        }

        if (specs) {
          tl.fromTo(
            specs,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            "-=0.4"
          );
        }
      }

      // 2. Visual Canvas Entrance & Internal Parallax on Scroll
      if (canvasRef.current) {
        gsap.fromTo(
          canvasRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: canvasRef.current,
              start: "top 85%",
            },
          }
        );

        if (imageInnerRef.current) {
          gsap.fromTo(
            imageInnerRef.current,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: canvasRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // 3. Narrative Sections Reveal on Scroll
      if (challengeRef.current) {
        gsap.fromTo(
          challengeRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: challengeRef.current,
              start: "top 82%",
            },
          }
        );
      }

      if (solutionRef.current) {
        gsap.fromTo(
          solutionRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: solutionRef.current,
              start: "top 82%",
            },
          }
        );
      }

      // 4. Next Project Card Reveal
      if (nextCardRef.current) {
        gsap.fromTo(
          nextCardRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: nextCardRef.current,
              start: "top 88%",
            },
          }
        );
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
            href="/work"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE SEMUA PROYEK // ARCHIVE</span>
          </Link>
          <span className="text-accent font-semibold">ISSUE NO. 01 // CASE STUDY</span>
        </div>

        {/* Project Header */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="anim-meta px-2.5 py-1 border border-accent text-accent font-bold">
              INDEX {project.index}
            </span>
            <span className="anim-meta">/</span>
            <span className="anim-meta text-foreground font-semibold">{project.client}</span>
            <span className="anim-meta">/</span>
            <span className="anim-meta">YEAR {project.period}</span>
          </div>

          <h1 className="anim-title text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            {project.title}
          </h1>

          <p className="anim-tagline font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            {project.tagline}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Role / Peran</p>
              <p className="font-semibold text-foreground">{project.role}</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Periode</p>
              <p className="font-semibold text-foreground">{project.period}</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Klien / Lembaga</p>
              <p className="font-semibold text-accent">{project.client}</p>
            </div>
            <div className="anim-spec">
              <p className="text-muted uppercase tracking-wider mb-1">Repository / Link</p>
              <a
                href={project.githubUrl || "https://github.com/Sanlinex"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-semibold flex items-center gap-1"
              >
                <span>Code Repository</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Project Visual Showcase Canvas with Smooth Parallax */}
        <div ref={canvasRef} className="space-y-4">
          <div className="relative w-full aspect-[16/9] max-h-[520px] border border-[#0E0E0E]/15 bg-[#121214] overflow-hidden shadow-lg">
            <div
              ref={imageInnerRef}
              className="absolute -inset-y-6 inset-x-0 w-full h-[120%] will-change-transform"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top select-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-xs text-muted border-b border-[#0E0E0E]/10 pb-3">
            <span className="uppercase tracking-widest">SCREENSHOT PREVIEW // {project.slug}</span>
            <span className="text-accent font-semibold">{project.client}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono text-xs">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col bg-surface border border-[#0E0E0E]/10 p-4 shadow-sm">
                <span className="text-muted uppercase tracking-wider text-[11px]">{m.label}</span>
                <span className="text-2xl font-serif italic text-accent font-bold mt-1">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Narrative: Challenge & Solution */}
        <div ref={challengeRef} className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6">
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
              [ THE CONTEXT &amp; CHALLENGE ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground">
              Tantangan Rekayasa &amp; Hambatan Sistem
            </h2>
          </div>
          <div className="md:col-span-8 font-sans text-base text-muted leading-relaxed space-y-4">
            <p className="text-lg text-foreground font-medium">{project.summary}</p>
            <p>{project.challenge}</p>
          </div>
        </div>

        {/* Architectural Solution */}
        <div ref={solutionRef} className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6 border-t border-[#0E0E0E]/10">
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
              [ THE ARCHITECTURE &amp; SOLUTION ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground">
              Implementasi &amp; Hasil Rekayasa
            </h2>
          </div>
          <div className="md:col-span-8 font-sans text-base text-muted leading-relaxed space-y-6">
            <p>{project.solution}</p>

            <div className="space-y-3 pt-4">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold block">
                DELIVERABLES &amp; MODUL UTAMA:
              </span>
              <ul className="space-y-2 font-mono text-xs">
                {project.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-muted">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                    <span className="text-foreground">{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold block mb-3">
                TEKNOLOGI &amp; DEPENDENSI:
              </span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((st, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-mono bg-surface border border-[#0E0E0E]/10 text-foreground uppercase tracking-wider"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Case Study Navigation Card */}
        <div ref={nextCardRef} className="pt-12 border-t border-[#0E0E0E]/15">
          <Link
            href={`/work/${nextProject.slug}`}
            className="group block border border-[#0E0E0E]/15 bg-surface p-8 sm:p-12 hover:border-[#0E0E0E] transition-all space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center font-mono text-xs text-muted uppercase tracking-wider">
              <span>NEXT CASE STUDY // INDEX {nextProject.index}</span>
              <span className="text-accent group-hover:translate-x-2 transition-transform duration-300">
                PROCEED →
              </span>
            </div>
            <h3 className="font-serif italic text-3xl sm:text-5xl text-foreground group-hover:text-accent transition-colors">
              {nextProject.title}
            </h3>
            <p className="font-sans text-sm text-muted max-w-2xl line-clamp-2">
              {nextProject.tagline}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
