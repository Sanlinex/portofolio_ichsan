"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";
import Magnetic from "@/components/Magnetic";
import TextRoll from "@/components/TextRoll";
import { PROFILE_DATA } from "@/data/profile";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Navbar() {
  const { scrollTo } = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeSection, setActiveSection] = useState("01");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  // Live Local Time (WIB / UTC+7)
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
      setCurrentTime(`${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Progress & Hide on Scroll Down, Show on Scroll Up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? currentScrollY / docHeight : 0;
      setScrollProgress(progress);

      if (currentScrollY < 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setIsVisible(false); // scrolling down
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsVisible(true); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Section Tracking
  useEffect(() => {
    const sections = [
      { id: "hero", num: "01" },
      { id: "about", num: "02" },
      { id: "experience", num: "03" },
      { id: "achievements", num: "04" },
      { id: "skills", num: "05" },
      { id: "projects", num: "06" },
      { id: "posters", num: "07" },
      { id: "contact", num: "08" },
    ];

    const triggers = sections.map(({ id, num }) => {
      return ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(num),
        onEnterBack: () => setActiveSection(num),
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const menuItems = [
    { label: "INDEX // HERO", target: "#hero", index: "01" },
    { label: "ABOUT // MANIFESTO", target: "#about", index: "02" },
    { label: "EXPERIENCE // ARCHIVE", target: "#experience", index: "03" },
    { label: "HONORS // AWARDS", target: "#achievements", index: "04" },
    { label: "ARSENAL // SKILLS", target: "#skills", index: "05" },
    { label: "SELECTED WORKS", target: "#projects", index: "06" },
    { label: "POSTER GALLERY", target: "#posters", index: "07" },
    { label: "EDUCATION", target: "#education", index: "08" },
    { label: "CONTACT // COLOPHON", target: "#contact", index: "09" },
  ];

  const handleNavClick = (target: string) => {
    setIsMenuOpen(false);
    scrollTo(target);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* 1. Thin Top Scroll Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9995] pointer-events-none">
        <div
          className="h-full bg-accent origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* 2. Floating Section Indicator on Screen Edge (Right) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[9990] hidden lg:flex flex-col items-center gap-3 pointer-events-none select-none">
        <span className="font-mono text-[10px] tracking-widest text-[#0E0E0E]/40 font-semibold uppercase [writing-mode:vertical-rl]">
          SECTION
        </span>
        <div className="font-mono text-xs font-semibold tracking-wider text-[#0E0E0E] bg-white/70 backdrop-blur-sm border border-[#0E0E0E]/10 px-2 py-1.5 shadow-sm">
          {activeSection} <span className="text-muted text-[10px]">/ 08</span>
        </div>
      </div>

      {/* 3. Main Fixed Navbar */}
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9991] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between border-b border-[#0E0E0E]/10 bg-[#F2EFE9]/90 backdrop-blur-md">
          {/* Left: Identity & Availability */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => scrollTo("#hero")}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Scroll to top"
            >
              <span className="font-sans font-bold text-sm tracking-tight text-foreground block group-hover:text-accent transition-colors">
                {PROFILE_DATA.personal.name}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-muted uppercase block">
                {PROFILE_DATA.personal.role}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#0E0E0E]/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-medium">
                Available for work
              </span>
            </div>
          </div>

          {/* Right: Masthead Info, Live Clock, & Menu Button */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="hidden sm:flex flex-col items-end font-mono text-[11px] tracking-wider text-muted">
              <span className="text-foreground font-medium">{currentTime || "00:00:00 WIB"}</span>
              <span className="text-[9px] uppercase tracking-widest text-muted/80">
                TANGERANG // UTC+7
              </span>
            </div>

            <Magnetic strength={0.25}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative px-4 py-2 border border-[#0E0E0E] bg-[#0E0E0E] text-[#F2EFE9] hover:bg-accent hover:border-accent transition-all duration-300 font-mono text-xs tracking-widest uppercase flex items-center gap-3 cursor-pointer group"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span>{isMenuOpen ? "CLOSE" : "MENU"}</span>
                <span className="flex flex-col gap-1 w-3.5">
                  <span
                    className={`h-[1px] bg-[#F2EFE9] transition-transform duration-300 ${
                      isMenuOpen ? "rotate-45 translate-y-[2.5px]" : ""
                    }`}
                  />
                  <span
                    className={`h-[1px] bg-[#F2EFE9] transition-transform duration-300 ${
                      isMenuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""
                    }`}
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* 4. Fullscreen Masked Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9994] bg-[#0E0E0E] text-[#F2EFE9] overflow-y-auto overscroll-contain"
          >
            <div className="min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 max-w-[1720px] mx-auto">
              {/* Overlay Top Bar */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 sm:pb-6 font-mono text-xs tracking-widest text-[#9E9B94] uppercase flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>NAVIGATION DIRECTORY // ISSUE 01</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#F2EFE9] hover:text-accent font-mono text-xs tracking-widest uppercase transition-colors py-1.5 px-3 border border-white/10 hover:border-accent"
                  aria-label="Close menu"
                >
                  [ESC // CLOSE]
                </button>
              </div>

              {/* Middle: 2-Column Editorial Navigation Directory */}
              <nav className="my-auto py-6 sm:py-8 w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-3 sm:gap-y-4">
                  {/* Column 1: Items 01 - 05 */}
                  <ul className="space-y-2.5 sm:space-y-3.5">
                    {menuItems.slice(0, 5).map((item, idx) => (
                      <li key={item.index} className="overflow-hidden">
                        <motion.div
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "110%" }}
                          transition={{
                            duration: 0.6,
                            ease: [0.33, 1, 0.68, 1],
                            delay: 0.1 + idx * 0.035,
                          }}
                        >
                          <button
                            onClick={() => handleNavClick(item.target)}
                            className="group flex items-baseline gap-3 sm:gap-4 text-left w-full cursor-pointer focus:outline-none"
                          >
                            <span className="font-mono text-xs text-accent tracking-widest flex-shrink-0">
                              {item.index}
                            </span>
                            <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-[#F2EFE9] tracking-tight group-hover:text-accent group-hover:translate-x-3 transition-all duration-300 leading-tight">
                              {item.label}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs sm:text-sm text-accent">
                              →
                            </span>
                          </button>
                        </motion.div>
                      </li>
                    ))}
                  </ul>

                  {/* Column 2: Items 06 - 09 */}
                  <ul className="space-y-2.5 sm:space-y-3.5">
                    {menuItems.slice(5).map((item, idx) => (
                      <li key={item.index} className="overflow-hidden">
                        <motion.div
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "110%" }}
                          transition={{
                            duration: 0.6,
                            ease: [0.33, 1, 0.68, 1],
                            delay: 0.1 + (idx + 5) * 0.035,
                          }}
                        >
                          <button
                            onClick={() => handleNavClick(item.target)}
                            className="group flex items-baseline gap-3 sm:gap-4 text-left w-full cursor-pointer focus:outline-none"
                          >
                            <span className="font-mono text-xs text-accent tracking-widest flex-shrink-0">
                              {item.index}
                            </span>
                            <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-[#F2EFE9] tracking-tight group-hover:text-accent group-hover:translate-x-3 transition-all duration-300 leading-tight">
                              {item.label}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs sm:text-sm text-accent">
                              →
                            </span>
                          </button>
                        </motion.div>
                      </li>
                    ))}

                    {/* Dedicated Archive Directory Links */}
                    <li className="pt-4 border-t border-white/10 space-y-2">
                      <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest block">
                        [ DEDICATED ARCHIVE DIRECTORIES ]
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs font-mono">
                        <Link
                          href="/work"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-accent hover:text-white border border-white/10 transition-colors"
                        >
                          ALL PROJECTS (04) ↗
                        </Link>
                        <Link
                          href="/certificate"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-accent hover:text-white border border-white/10 transition-colors"
                        >
                          ALL CERTIFICATES (03) ↗
                        </Link>
                        <Link
                          href="/poster"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-accent hover:text-white border border-white/10 transition-colors"
                        >
                          ALL POSTERS (10) ↗
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>

              {/* Overlay Bottom Bar Colophon */}
              <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-wrap justify-between items-center gap-4 sm:gap-6 font-mono text-xs tracking-wider text-[#9E9B94] flex-shrink-0">
                <div>
                  <span className="block text-[#F2EFE9] font-medium">MUH. RAFLI ICHSAN</span>
                  <span className="text-[10px] text-muted">{PROFILE_DATA.personal.location} // FULLSTACK ARCHITECT</span>
                </div>
                <div className="flex gap-4 sm:gap-6 text-xs">
                  <a
                    href={`mailto:${PROFILE_DATA.contact.email}`}
                    className="hover:text-accent transition-colors"
                  >
                    {PROFILE_DATA.contact.email}
                  </a>
                  <a
                    href={PROFILE_DATA.contact.github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors hidden sm:inline"
                  >
                    GitHub
                  </a>
                  <a
                    href={PROFILE_DATA.contact.linkedin.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors hidden sm:inline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
