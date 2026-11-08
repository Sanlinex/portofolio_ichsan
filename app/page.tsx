"use client";

import React, { useState, useEffect, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Skills from "@/components/Skills";
import SelectedWorks from "@/components/SelectedWorks";
import PosterGallery from "@/components/PosterGallery";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import { ScrollTrigger } from "@/lib/gsap";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Refresh ScrollTrigger after DOM, Fonts & Preloader complete
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    if (isLoaded) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isLoaded]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col relative selection:bg-accent selection:text-[#F2EFE9]">
      {/* 0. Editorial Preloader (0 - 100 Counter & Curtain Wipe) */}
      {!isLoaded && <Preloader onComplete={handleLoaded} />}

      {/* 1. Minimal Fixed Editorial Navigation */}
      <Navbar />

      {/* 2. Giant Kinetic Typography Hero */}
      <Hero isLoaded={isLoaded} />

      {/* 3. Pinned Manifesto Section with Word-by-Word Scrub */}
      <About />

      {/* 4. Experience & Internships with 1px Line Draw */}
      <Experience />

      {/* 5. Competitive Honors & Achievements Editorial Table */}
      <Achievements />

      {/* 6. Velocity-Reactive Typography Marquees & Skill Categories */}
      <Skills />

      {/* 7. Selected Works Pinned Horizontal Scroll */}
      <SelectedWorks />

      {/* 8. Asymmetric Poster Gallery with Differential Parallax */}
      <PosterGallery />

      {/* 9. Academic Foundation / Education */}
      <Education />

      {/* 10. Contact Section & Editorial Colophon Footer */}
      <Footer />
    </div>
  );
}
