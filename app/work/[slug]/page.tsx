import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";

interface WorkDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return PROFILE_DATA.projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: WorkDetailPageProps): Metadata {
  const project = PROFILE_DATA.projects.find((p) => p.slug === params.slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Case Study | ${PROFILE_DATA.personal.name}`,
    description: project.summary,
  };
}

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const projectIndex = PROFILE_DATA.projects.findIndex((p) => p.slug === params.slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = PROFILE_DATA.projects[projectIndex];
  const nextProject = PROFILE_DATA.projects[(projectIndex + 1) % PROFILE_DATA.projects.length];

  return (
    <article className="min-h-screen w-full bg-background text-foreground pt-28 pb-24 px-6 sm:px-10 lg:px-16 selection:bg-accent selection:text-[#F2EFE9]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-[#0E0E0E]/15 pb-6 font-mono text-xs uppercase tracking-widest text-muted">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>RETURN TO ARCHIVE</span>
          </Link>
          <span className="text-accent font-semibold">ISSUE NO. 01 // CASE STUDY</span>
        </div>

        {/* Project Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase text-accent font-semibold tracking-wider">
            <span>INDEX {project.index}</span>
            <span>/</span>
            <span>YEAR {project.period}</span>
            <span>/</span>
            <span className="text-foreground">{project.client}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            {project.title}
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            {project.tagline}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Role / Peran</p>
              <p className="font-semibold text-foreground">{project.role}</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Periode</p>
              <p className="font-semibold text-foreground">{project.period}</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Klien / Lembaga</p>
              <p className="font-semibold text-accent">{project.client}</p>
            </div>
            <div>
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

        {/* Project Visual Showcase Canvas - Pure Screenshot Frame */}
        <div className="space-y-4">
          <div className="border border-[#0E0E0E]/15 bg-[#121214] overflow-hidden shadow-md">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover object-top select-none"
            />
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-xs text-muted border-b border-[#0E0E0E]/10 pb-3">
            <span className="uppercase tracking-widest">SCREENSHOT PREVIEW // {project.slug}</span>
            <span className="text-accent font-semibold">{project.client}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono text-xs">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col bg-surface border border-[#0E0E0E]/10 p-4">
                <span className="text-muted uppercase tracking-wider">{m.label}</span>
                <span className="text-2xl font-serif italic text-accent font-bold mt-1">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Narrative: Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6">
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
              [ THE CONTEXT & CHALLENGE ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground">
              Tantangan Rekayasa & Hambatan Sistem
            </h2>
          </div>
          <div className="md:col-span-8 font-sans text-base text-muted leading-relaxed space-y-4">
            <p className="text-lg text-foreground font-medium">{project.summary}</p>
            <p>{project.challenge}</p>
          </div>
        </div>

        {/* Architectural Solution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6 border-t border-[#0E0E0E]/10">
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
              [ THE ARCHITECTURE & SOLUTION ]
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-foreground">
              Implementasi & Hasil Rekayasa
            </h2>
          </div>
          <div className="md:col-span-8 font-sans text-base text-muted leading-relaxed space-y-6">
            <p>{project.solution}</p>

            <div className="space-y-3 pt-4">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold block">
                DELIVERABLES & MODUL KUNCI:
              </span>
              <ul className="space-y-2 font-sans text-sm text-foreground list-disc list-inside">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack Tags */}
            <div className="pt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-3">
                TECH STACK IMPLEMENTASI:
              </span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((st, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-surface border border-[#0E0E0E]/15 font-mono text-xs text-foreground uppercase"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Project Footer Bar */}
        <div className="border-t border-[#0E0E0E]/15 pt-12 flex justify-between items-center">
          <Link
            href="/#projects"
            className="font-mono text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest"
          >
            ← BACK TO ALL WORKS
          </Link>

          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex flex-col items-end text-right font-mono text-xs"
          >
            <span className="text-muted uppercase tracking-widest">NEXT CASE STUDY →</span>
            <span className="font-serif italic text-2xl text-foreground group-hover:text-accent transition-colors">
              {nextProject.title}
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
