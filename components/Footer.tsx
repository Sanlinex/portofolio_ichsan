"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import TextRoll from "@/components/TextRoll";
import { PROFILE_DATA } from "@/data/profile";

export default function Footer() {
  const { scrollTo } = useLenis();
  const footerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLocalTime(`${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Scrub background color from off-white #F2EFE9 to deep black #0E0E0E
      if (!prefersReducedMotion && footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { backgroundColor: "#F2EFE9", color: "#0E0E0E" },
          {
            backgroundColor: "#0E0E0E",
            color: "#F2EFE9",
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
              end: "top 25%",
              scrub: 1,
            },
          }
        );
      }

      // 2. Line-by-line reveal of giant "LET'S WORK TOGETHER"
      const lines = headlineRef.current?.querySelectorAll(".headline-line");
      if (lines && !prefersReducedMotion) {
        gsap.fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 75%",
            },
          }
        );
      }
    },
    { scope: footerRef }
  );

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative w-full min-h-screen px-6 sm:px-10 py-20 sm:py-28 flex flex-col justify-between overflow-hidden transition-colors"
      style={{ backgroundColor: "#0E0E0E", color: "#F2EFE9" }}
    >
      {/* Top Header Colophon Bar */}
      <div className="max-w-[1720px] mx-auto w-full border-b border-white/10 pb-8 flex flex-wrap justify-between items-center gap-4 font-mono text-xs text-[#9E9B94] uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[#F2EFE9] font-semibold">09 // 09 CONTACT & COLOPHON</span>
        </div>
        <div className="flex items-center gap-6">
          <span>{localTime || "00:00:00 WIB"}</span>
          <span className="hidden sm:inline">TANGERANG — BANTEN // ID</span>
        </div>
      </div>

      {/* Center: Giant Editorial Contact Headline & Magnetic Email */}
      <div className="max-w-[1720px] mx-auto w-full my-auto py-16 sm:py-24 space-y-12">
        <div ref={headlineRef} className="overflow-hidden space-y-1 select-none">
          <div className="overflow-hidden">
            <span className="headline-line block font-serif italic text-section-giant font-normal tracking-tight text-[#F2EFE9] leading-[0.9]">
              Let’s work
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="headline-line block font-sans font-extrabold text-section-giant tracking-tight text-accent leading-[0.9]">
              TOGETHER.
            </span>
          </div>
        </div>

        <p className="font-sans text-base sm:text-xl text-[#9E9B94] max-w-2xl leading-relaxed">
          Terbuka untuk kolaborasi proyek aplikasi web fullstack, peluang kerja sama rekayasa sistem, dan tantangan digital berdampak tinggi.
        </p>

        {/* Massive Interactive Magnetic Email with Draw-Underline */}
        <div className="pt-4">
          <Magnetic strength={0.3}>
            <a
              href={`mailto:${PROFILE_DATA.contact.email}`}
              data-cursor="Email"
              className="group relative inline-block font-mono text-2xl sm:text-4xl lg:text-6xl font-light text-[#F2EFE9] hover:text-accent transition-colors duration-300 py-2"
            >
              <span>{PROFILE_DATA.contact.email}</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bottom Directory, Socials, Back-to-Top, and Copyright */}
      <div className="max-w-[1720px] mx-auto w-full border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        {/* Social Links with TextRoll */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] tracking-widest text-[#9E9B94] uppercase block">
            SOCIAL REPOSITORIES & NETWORKS
          </span>
          <div className="flex flex-wrap gap-6 font-mono text-xs text-[#F2EFE9]">
            <a
              href={PROFILE_DATA.contact.github.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <TextRoll text="GITHUB" />
            </a>
            <a
              href={PROFILE_DATA.contact.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <TextRoll text="LINKEDIN" />
            </a>
            <a
              href={PROFILE_DATA.contact.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <TextRoll text="INSTAGRAM" />
            </a>
          </div>
        </div>

        {/* Back to Top Button via Lenis */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Magnetic strength={0.25}>
            <button
              onClick={() => scrollTo(0)}
              className="px-5 py-2.5 border border-white/20 bg-transparent text-[#F2EFE9] hover:bg-accent hover:border-accent hover:text-[#F2EFE9] transition-all duration-300 font-mono text-xs tracking-widest uppercase cursor-pointer"
            >
              ↑ BACK TO TOP
            </button>
          </Magnetic>

          <div className="font-mono text-xs text-[#9E9B94] space-y-0.5">
            <div>© 2026 MUH. RAFLI ICHSAN.</div>
            <div className="text-[10px] text-[#9E9B94]/70">
              MINIMALIST EDITORIAL & TYPOGRAPHIC ARCHIVE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
