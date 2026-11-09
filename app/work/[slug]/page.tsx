import React from "react";
import { notFound } from "next/navigation";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import WorkDetailClient from "@/components/WorkDetailClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface WorkDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const data = await getProfileData();
  const project = data.projects.find((p) => p.slug === params.slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Case Study | ${data.personal.name}`,
    description: project.summary,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const data = await getProfileData();
  const projectIndex = data.projects.findIndex((p) => p.slug === params.slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = data.projects[projectIndex];
  const nextProject = data.projects[(projectIndex + 1) % data.projects.length];

  return <WorkDetailClient project={project} nextProject={nextProject} />;
}
