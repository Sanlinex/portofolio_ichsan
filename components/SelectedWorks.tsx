"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE_DATA } from "@/data/profile";

export default function SelectedWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      // Desktop & Tablet (768px and up, including 1024px laptops)
      mm.add("(min-width: 768px)", () => {
        const getScrollDistance = () => {
          if (!track) return 3000;

          // 1. Measured offset of the last child element
          const children = Array.from(track.children) as HTMLElement[];
          let offsetWidth = 0;
          if (children.length > 0) {
            const lastChild = children[children.length - 1];
            offsetWidth = lastChild.offsetLeft + lastChild.offsetWidth + 192;
          }

          // 2. Sum of all individual children widths + gaps + paddings
          let sumWidths = 0;
          children.forEach((c) => {
            sumWidths += c.offsetWidth || 640;
          });
          const sumTotal = sumWidths + (children.length - 1) * 48 + 256;

          // 3. Guaranteed mathematical minimum:
          // 1 Title (400) + 4 Project Cards (4 * 640 = 2560) + 1 Ending Slide (380) + 5 Gaps (240) + Pads (256) = 3836px
          const isLg = window.innerWidth >= 1024;
          const guaranteedMin = isLg ? 3840 : 3400;

          const totalWidth = Math.max(
            track.scrollWidth || 0,
            offsetWidth,
            sumTotal,
            guaranteedMin
          );

          return Math.max(0, totalWidth - window.innerWidth);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${getScrollDistance() + 350}`,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            x: () => -getScrollDistance(),
            ease: "none",
            duration: 1,
          },
          0
        );

        // Pause buffer so Card 04 and Ending Slide stay fully framed before unpinning
        tl.to({}, { duration: 0.15 });

        // Internal Parallax on images directly inside the unified timeline (NO conflicting ScrollTriggers!)
        const images = track.querySelectorAll(".project-inner-img");
        if (images.length > 0) {
          tl.fromTo(
            images,
            { xPercent: 10 },
            {
              xPercent: -10,
              ease: "none",
              duration: 1,
            },
            0
          );
        }
      });

      // Mobile portrait (< 768px)
      mm.add("(max-width: 767px)", () => {
        const cards = container.querySelectorAll(".mobile-project-card");
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: "top 75%",
              },
            }
          );
        }
      });

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        clearTimeout(refreshTimeout);
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-20 w-full bg-background text-foreground border-b border-[#0E0E0E]/15 overflow-hidden"
    >
      {/* Desktop & Tablet Horizontal Track (min-width: 768px, covers 1024px screens) */}
      <div className="hidden md:block h-screen w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full w-max will-change-transform items-center pl-8 sm:pl-16 pr-32 sm:pr-48 gap-8 sm:gap-12"
        >
          {/* Introductory Title Slide */}
          <div className="w-[340px] lg:w-[400px] h-[75vh] min-h-[420px] max-h-[580px] flex flex-col justify-between p-6 sm:p-8 border border-[#0E0E0E]/15 bg-surface/30 flex-shrink-0 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
                  06 // 08
                </span>
                <span className="text-foreground font-semibold">SELECTED WORKS</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
                Engineering & <br />
                <span className="font-serif italic font-normal text-accent">
                  Production Cases.
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="font-sans text-sm text-muted leading-relaxed">
                Empat proyek terpilih yang merepresentasikan keahlian fullstack: modul redaksi CMS, sistem kasir ritel offline-first, ekosistem digital UMKM, dan platform kompetisi cepat.
              </p>
              <div className="flex items-center gap-3 font-mono text-xs text-accent font-semibold">
                <span>SCROLL HORIZONTALLY</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Project Cards (01, 02, 03, 04) */}
          {PROFILE_DATA.projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/work/${proj.slug}`}
              data-cursor="View"
              className="desktop-project-card w-[560px] lg:w-[640px] max-w-[85vw] h-[75vh] min-h-[420px] max-h-[580px] border border-[#0E0E0E]/15 bg-background flex flex-col justify-between p-6 sm:p-8 flex-shrink-0 group hover:border-[#0E0E0E] transition-all duration-300 select-none cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* Slide Top Meta */}
              <div className="flex justify-between items-start border-b border-[#0E0E0E]/10 pb-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-3xl sm:text-4xl text-accent font-normal">
                    {proj.index}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted font-medium line-clamp-1">
                    {proj.client}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-muted flex-shrink-0">
                  <span>{proj.period}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-foreground font-semibold">CASE STUDY</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="py-2 space-y-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-1">
                  {proj.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider text-muted line-clamp-1">
                  {proj.tagline}
                </p>
              </div>

              {/* Screenshot Image Frame with Internal Parallax - Pure Photo, No Fake Text */}
              <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden border border-[#0E0E0E]/15 bg-[#121214] my-auto group-hover:border-[#0E0E0E] transition-colors shadow-inner">
                <div className="project-inner-img absolute -inset-x-8 inset-y-0 w-[116%] h-full flex items-center justify-center will-change-transform">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Slide Bottom Metadata */}
              <div className="pt-3 border-t border-[#0E0E0E]/10 flex justify-between items-center">
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.slice(0, 3).map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-surface border border-[#0E0E0E]/10 text-foreground uppercase"
                    >
                      {st}
                    </span>
                  ))}
                  {proj.stack.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-muted">
                      +{proj.stack.length - 3}
                    </span>
                  )}
                </div>

                <span className="font-mono text-xs text-foreground font-semibold group-hover:text-accent transition-colors flex items-center gap-1.5 flex-shrink-0">
                  <span>VIEW DETAILS</span>
                  <span>→</span>
                </span>
              </div>
            </Link>
          ))}

          {/* Ending Slide: Guarantees user reaches all cards and clearly sees the finish without cutoff */}
          <div className="w-[320px] lg:w-[380px] h-[75vh] min-h-[420px] max-h-[580px] border border-[#0E0E0E]/15 bg-surface/50 p-6 sm:p-8 flex flex-col justify-between flex-shrink-0 shadow-sm">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                [ 04 // 04 COMPLETE ]
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
                All Production Cases Viewed.
              </h3>
            </div>

            <div className="space-y-4">
              <p className="font-sans text-xs text-muted leading-relaxed">
                Seluruh proyek telah dirilis dalam lingkungan produksi dengan standar kode industri dan performa tinggi.
              </p>
              <div className="pt-4 border-t border-[#0E0E0E]/10 font-mono text-xs text-accent font-semibold flex items-center gap-2">
                <span>SCROLL DOWN TO POSTERS</span>
                <span>↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stack Fallback (< 768px) */}
      <div className="block md:hidden px-6 py-20">
        <div className="space-y-4 pb-12 border-b border-[#0E0E0E]/15">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="px-2 py-0.5 border border-accent text-accent font-semibold text-[10px]">
              06 // 08
            </span>
            <span className="text-foreground font-semibold">SELECTED WORKS</span>
          </div>
          <h2 className="text-4xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            Engineering & <br />
            <span className="font-serif italic font-normal text-accent">
              Production Projects.
            </span>
          </h2>
          <p className="font-sans text-sm text-muted leading-relaxed">
            Empat proyek terpilih yang merepresentasikan keahlian fullstack: modul redaksi CMS, sistem kasir ritel offline-first, ekosistem digital UMKM, dan platform kompetisi cepat.
          </p>
        </div>

        <div className="space-y-12 pt-10">
          {PROFILE_DATA.projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/work/${proj.slug}`}
              className="mobile-project-card block border border-[#0E0E0E]/15 bg-background p-6 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-baseline font-mono text-xs text-muted border-b border-[#0E0E0E]/10 pb-3">
                <span className="font-serif italic text-3xl text-accent font-normal">
                  {proj.index}
                </span>
                <span>{proj.period}</span>
              </div>

              {/* Mobile Project Screenshot Frame - Pure Photo, No Fake Text */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#0E0E0E]/15 bg-[#121214] shadow-inner">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover object-top select-none"
                  loading="lazy"
                />
              </div>

              <h3 className="text-2xl font-sans font-bold tracking-tight text-foreground">
                {proj.title}
              </h3>
              <p className="font-sans text-xs text-muted leading-relaxed">
                {proj.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.stack.map((st, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-mono bg-surface border border-[#0E0E0E]/10 text-foreground uppercase"
                  >
                    {st}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#0E0E0E]/10 flex justify-between items-center font-mono text-xs text-accent font-semibold">
                <span>VIEW CASE STUDY</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
