"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import TextRoll from "@/components/TextRoll";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";

export default function Footer() {
  const { data } = useProfile();
  const contact = data.contact;
  const personal = data.personal;
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
      // 1. Scrub background color from off-white #F2EFE9 to deep black #0E0E0E
      if (footerRef.current) {
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

      // 2. Floating Background Parallax Watermark
      const watermark = footerRef.current?.querySelector(".footer-watermark");
      if (watermark) {
        gsap.fromTo(
          watermark,
          { yPercent: -30, opacity: 0.02 },
          {
            yPercent: 30,
            opacity: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Line-by-line reveal of giant "LET'S WORK TOGETHER"
      const lines = headlineRef.current?.querySelectorAll(".headline-line");
      if (lines && lines.length > 0) {
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

        // Opposing parallax scrub on headline lines
        const line1 = lines[0];
        const line2 = lines[1];
        if (line1 && line2) {
          gsap.fromTo(
            line1,
            { x: -30 },
            {
              x: 30,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );

          gsap.fromTo(
            line2,
            { x: 30 },
            {
              x: -30,
              ease: "none",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
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
      {/* Floating Parallax Editorial Watermark */}
      <div className="footer-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[22vw] sm:text-[18vw] font-serif italic font-normal text-white/[0.03] select-none whitespace-nowrap z-0 will-change-transform">
        CONNECT // 09
      </div>

      {/* Top Header Colophon Bar */}
      <div className="max-w-[1720px] mx-auto w-full border-b border-white/10 pb-8 flex flex-wrap justify-between items-center gap-4 font-mono text-xs text-[#9E9B94] uppercase tracking-wider relative z-10">
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
              href={`mailto:${contact.email}`}
              data-cursor="Email"
              className="group relative inline-block font-mono text-2xl sm:text-4xl lg:text-6xl font-light text-[#F2EFE9] hover:text-accent transition-colors duration-300 py-2"
            >
              <span>{contact.email}</span>
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
              href={contact.github.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <TextRoll text="GITHUB" />
            </a>
            <a
              href={contact.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <TextRoll text="LINKEDIN" />
            </a>
            <a
              href={contact.instagram.url}
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
          <Link
            href="/admin"
            className="text-[11px] font-mono tracking-wider text-muted hover:text-accent border border-white/15 px-3 py-1.5 transition-colors uppercase"
          >
            STUDIO CMS // DASHBOARD ↗
          </Link>

          <Magnetic strength={0.25}>
            <button
              onClick={() => scrollTo(0)}
              className="px-5 py-2.5 border border-white/20 bg-transparent text-[#F2EFE9] hover:bg-accent hover:border-accent hover:text-[#F2EFE9] transition-all duration-300 font-mono text-xs tracking-widest uppercase cursor-pointer"
            >
              ↑ BACK TO TOP
            </button>
          </Magnetic>

          <div className="font-mono text-xs text-[#9E9B94] space-y-0.5">
            <div>© 2026 {personal.name.toUpperCase()}.</div>
            <div className="text-[10px] text-[#9E9B94]/70">
              MINIMALIST EDITORIAL & TYPOGRAPHIC ARCHIVE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
