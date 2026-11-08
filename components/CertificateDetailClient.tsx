"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AchievementItem } from "@/data/profile";

interface CertificateDetailClientProps {
  ach: AchievementItem;
  prevAch: AchievementItem;
  nextAch: AchievementItem;
}

export default function CertificateDetailClient({
  ach,
  prevAch,
  nextAch,
}: CertificateDetailClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const diplomaRef = useRef<HTMLDivElement>(null);
  const diplomaInnerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const navCardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
        const category = headerRef.current.querySelector(".anim-cat");
        const rank = headerRef.current.querySelector(".anim-rank");
        const facts = headerRef.current.querySelectorAll(".anim-fact");

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

        if (category) {
          tl.fromTo(category, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
        }

        if (rank) {
          tl.fromTo(rank, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6");
        }

        if (facts) {
          tl.fromTo(facts, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, "-=0.4");
        }
      }

      // Diploma Showcase Entrance & High-Impact Parallax Scrub
      if (diplomaRef.current) {
        gsap.fromTo(
          diplomaRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: diplomaRef.current,
              start: "top 85%",
            },
          }
        );

        if (diplomaInnerRef.current) {
          gsap.fromTo(
            diplomaInnerRef.current,
            { yPercent: -16 },
            {
              yPercent: 16,
              ease: "none",
              scrollTrigger: {
                trigger: diplomaRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // Narrative Reveal on Scroll
      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: "top 82%",
            },
          }
        );
      }

      // Next / Previous Record Cards
      if (navCardsRef.current) {
        gsap.fromTo(
          navCardsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: navCardsRef.current,
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
            href="/certificate"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE SEMUA SERTIFIKAT // ARCHIVE</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-semibold">
              VERIFIED RECORD // {ach.year}
            </span>
          </div>
        </div>

        {/* Certificate Header */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="anim-meta px-2.5 py-1 border border-accent text-accent font-bold">
              PODIUM {ach.rank.toUpperCase()}
            </span>
            <span className="anim-meta">/</span>
            <span className="anim-meta text-foreground font-semibold">{ach.issuer}</span>
            <span className="anim-meta">/</span>
            <span className="anim-meta">TAHUN {ach.year}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="anim-title text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
                {ach.title}
              </h1>
              <p className="anim-cat font-serif italic text-2xl sm:text-3xl text-accent">
                {ach.category}
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <span className="anim-rank font-serif italic text-7xl sm:text-8xl lg:text-9xl text-accent leading-none block">
                {ach.rank}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted block mt-1">
                COMPETITIVE STANDING
              </span>
            </div>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div className="anim-fact">
              <p className="text-muted uppercase tracking-wider mb-1">Penyelenggara</p>
              <p className="font-semibold text-foreground">{ach.issuer}</p>
            </div>
            <div className="anim-fact">
              <p className="text-muted uppercase tracking-wider mb-1">Tahun Perolehan</p>
              <p className="font-semibold text-accent">{ach.year}</p>
            </div>
            <div className="anim-fact">
              <p className="text-muted uppercase tracking-wider mb-1">Tingkat Wilayah</p>
              <p className="font-semibold text-foreground">Kab. Tangerang &amp; Banten</p>
            </div>
            <div className="anim-fact">
              <p className="text-muted uppercase tracking-wider mb-1">Status Autentikasi</p>
              <p className="font-semibold text-accent">Terverifikasi Resmi</p>
            </div>
          </div>
        </div>

        {/* Dedicated Certificate Diploma Showcase Canvas */}
        <div ref={diplomaRef} className="space-y-4">
          <div className="relative w-full aspect-[1200/850] bg-[#F8F6F0] border-2 border-[#0E0E0E]/20 overflow-hidden shadow-xl flex items-center justify-center p-3 sm:p-6 group">
            <div
              ref={diplomaInnerRef}
              className="absolute -inset-y-6 inset-x-0 w-full h-[135%] flex items-center justify-center will-change-transform"
            >
              <img
                src={ach.certificatePlaceholder}
                alt={`Sertifikat ${ach.title} - ${ach.issuer}`}
                className="w-full h-full object-contain select-none"
              />
            </div>

            {/* Subtle Watermark */}
            <div className="absolute bottom-4 right-6 font-mono text-[10px] text-[#0E0E0E]/40 tracking-wider pointer-events-none hidden sm:block uppercase">
              MUH. RAFLI ICHSAN // OFFICIAL VERIFICATION
            </div>
          </div>

          {/* Action Toolbar & File Note */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-muted">
              <span className="text-accent">📁</span>
              <span>
                File berkas:{" "}
                <code className="text-foreground font-semibold">
                  public{ach.certificatePlaceholder}
                </code>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={ach.certificatePlaceholder}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Buka Berkas Asli (Resolusi Penuh)</span>
                <span>↗</span>
              </a>
              <Link
                href="/certificate"
                className="py-2.5 px-4 border border-[#0E0E0E]/20 hover:border-[#0E0E0E] text-foreground tracking-wider uppercase transition-colors"
              >
                Semua Sertifikat
              </Link>
            </div>
          </div>
        </div>

        {/* Deep Dive Narrative: Evaluasi Rekayasa & Konteks Kompetisi */}
        <div ref={narrativeRef} className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-[#0E0E0E]/15">
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
              [ THE COMPETITIVE CONTEXT ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground">
              Tinjauan Teknis &amp; Standar Evaluasi
            </h2>
          </div>
          <div className="md:col-span-8 font-sans text-base text-muted leading-relaxed space-y-5">
            <p className="text-lg text-foreground font-medium">{ach.description}</p>
            <p>
              Kompetisi ini menguji kemampuan rekayasa perangkat lunak dan arsitektur web secara menyeluruh di bawah batas waktu pengerjaan yang ketat. Kriteria penilaian mencakup normalisasi skema basis data, implementasi RESTful API yang aman, serta responsivitas UI dengan kepatuhan terhadap standar aksesibilitas web modern.
            </p>
            <p>
              Pengakuan resmi ini menegaskan konsistensi eksekusi teknis dan dedikasi dalam membangun perangkat lunak berkualitas tinggi, baik dalam kompetisi individu maupun proyek produksi skala penuh.
            </p>
          </div>
        </div>

        {/* Navigation to Next / Previous Record */}
        <div ref={navCardsRef} className="pt-12 border-t border-[#0E0E0E]/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href={`/certificate/${prevAch.id}`}
              className="p-6 border border-[#0E0E0E]/15 bg-surface hover:border-[#0E0E0E] transition-all group block space-y-2 shadow-sm"
            >
              <span className="font-mono text-xs text-muted block group-hover:text-accent transition-colors">
                ← PREVIOUS RECORD ({prevAch.rank} PLACE)
              </span>
              <p className="font-sans font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                {prevAch.title}
              </p>
            </Link>

            <Link
              href={`/certificate/${nextAch.id}`}
              className="p-6 border border-[#0E0E0E]/15 bg-surface hover:border-[#0E0E0E] transition-all group block space-y-2 sm:text-right shadow-sm"
            >
              <span className="font-mono text-xs text-muted block group-hover:text-accent transition-colors">
                NEXT RECORD ({nextAch.rank} PLACE) →
              </span>
              <p className="font-sans font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                {nextAch.title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
