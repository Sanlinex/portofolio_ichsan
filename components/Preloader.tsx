"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counterObj = { value: 0 };
    const counterEl = counterRef.current;
    const progressEl = progressBarRef.current;
    const statusEl = statusRef.current;
    const container = containerRef.current;

    if (!container || !counterEl) return;

    // Prevent body scroll during preloader
    document.body.style.overflow = "hidden";

    // Smooth counter animation from 0 to 100
    const tl = gsap.timeline({
      onComplete: () => {
        // High-performance GPU accelerated curtain wipe lifting upward
        gsap.to(container, {
          yPercent: -100,
          duration: 1.0,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = "";
            onComplete();
            ScrollTrigger.refresh();
          },
        });
      },
    });

    tl.to(counterObj, {
      value: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.round(counterObj.value);
        if (counterEl) {
          counterEl.textContent = String(val).padStart(3, "0");
        }
        if (progressEl) {
          progressEl.style.transform = `scaleX(${val / 100})`;
        }
        if (statusEl) {
          statusEl.textContent =
            val < 35
              ? "INITIALIZING SYSTEM & FONTS..."
              : val < 75
              ? "LOADING EDITORIAL MODULES..."
              : "PREPARING SCROLL ENGINE...";
        }
      },
    });

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [onComplete]);

  return (
    <aside
      ref={containerRef}
      aria-label="Portfolio Loading"
      className="fixed inset-0 z-[9990] bg-[#0E0E0E] text-[#F2EFE9] flex flex-col justify-between p-8 sm:p-14 select-none will-change-transform"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center text-xs font-mono tracking-widest text-[#9E9B94] uppercase border-b border-white/10 pb-4">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          MUH. RAFLI ICHSAN // ARCHIVE
        </span>
        <span className="hidden sm:inline">ISSUE NO. 01 — EDITORIAL EDITION</span>
        <span>INDEX 2026</span>
      </div>

      {/* Middle: Giant Monospace Counter */}
      <div className="my-auto text-center flex flex-col items-center">
        <div
          ref={counterRef}
          className="font-mono text-7xl sm:text-9xl lg:text-[13rem] font-light tracking-tighter leading-none text-[#F2EFE9] select-none"
        >
          000
        </div>
        <div
          ref={statusRef}
          className="mt-6 font-mono text-xs sm:text-sm tracking-widest uppercase text-accent font-medium"
        >
          INITIALIZING SYSTEM & FONTS...
        </div>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="space-y-4">
        <div className="w-full h-[2px] bg-white/15 relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 h-full w-full bg-accent origin-left transform scale-x-0 transition-transform duration-75"
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono tracking-wider text-[#9E9B94]">
          <span>FULLSTACK WEB ARCHITECT</span>
          <span>TANGERANG — BANTEN // ID</span>
        </div>
      </div>
    </aside>
  );
}
