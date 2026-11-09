"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const outerCursorRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchOnly, setIsTouchOnly] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    // Only disable custom cursor on purely touch devices with no mouse pointer
    const isCoarseTouchOnly =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isCoarseTouchOnly) {
      setIsTouchOnly(true);
      return;
    }

    setIsTouchOnly(false);
    document.body.classList.add("custom-cursor-active");

    const outer = outerCursorRef.current;
    const dot = innerDotRef.current;
    if (!outer || !dot) return;

    // Fast and smooth GSAP quickTo setters
    const xOuterTo = gsap.quickTo(outer, "x", { duration: 0.28, ease: "power3.out" });
    const yOuterTo = gsap.quickTo(outer, "y", { duration: 0.28, ease: "power3.out" });
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    let hasPositionedInitial = false;
    let hasShown = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasPositionedInitial) {
        // Set immediate position on first movement to avoid starting at (0, 0)
        gsap.set([outer, dot], { x: e.clientX, y: e.clientY });
        hasPositionedInitial = true;
      }

      if (!hasShown) {
        hasShown = true;
        setIsVisible(true);
      }

      xOuterTo(e.clientX);
      yOuterTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      const clickableTarget = target.closest(
        "a, button, [role='button'], input, textarea, select, .cursor-pointer"
      );

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        setCursorText(text);
        setIsHovered(true);
      } else if (clickableTarget) {
        setCursorText("");
        setIsHovered(true);
      } else {
        setCursorText("");
        setIsHovered(false);
      }
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
      setIsHovered(false);
      setCursorText("");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
    };
  }, [isAdmin]);

  if (isTouchOnly || isAdmin) return null;

  return (
    <>
      {/* 1. Precise Inner Dot (Instant Response & Always High Contrast) */}
      <div
        ref={innerDotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200 ${
          isVisible && !cursorText ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-[#0E0E0E] shadow-[0_0_8px_rgba(255,77,28,0.9)]" />
      </div>

      {/* 2. Outer Smooth Follower Ring / Label Badge (Always High Contrast on Light & Dark) */}
      <div
        ref={outerCursorRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: cursorText ? "84px" : isHovered ? "48px" : "32px",
          height: cursorText ? "84px" : isHovered ? "48px" : "32px",
        }}
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ease-out border ${
            cursorText
              ? "bg-accent text-white border-2 border-white shadow-[0_8px_24px_rgba(255,77,28,0.45)] scale-100"
              : isHovered
              ? "bg-accent/15 border-accent scale-100 shadow-[0_0_12px_rgba(255,77,28,0.3)]"
              : "bg-transparent border border-accent/60 scale-100"
          }`}
        >
          {cursorText && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white select-none">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
