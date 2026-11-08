import React from "react";
import { notFound } from "next/navigation";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import WorkDetailClient from "@/components/WorkDetailClient";

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

  return <WorkDetailClient project={project} nextProject={nextProject} />;
}
