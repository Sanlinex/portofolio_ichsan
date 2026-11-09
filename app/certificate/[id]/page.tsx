import React from "react";
import { notFound } from "next/navigation";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import CertificateDetailClient from "@/components/CertificateDetailClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface CertificatePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const data = await getProfileData();
  const ach = data.achievements.find((a) => a.id === params.id);
  if (!ach) {
    return {
      title: "Certificate Not Found",
    };
  }

  return {
    title: `${ach.title} (${ach.rank} Place) — Official Record | ${data.personal.name}`,
    description: ach.description,
  };
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const data = await getProfileData();
  const achIndex = data.achievements.findIndex((a) => a.id === params.id);
  if (achIndex === -1) {
    notFound();
  }

  const ach = data.achievements[achIndex];
  const prevAch =
    data.achievements[
      (achIndex - 1 + data.achievements.length) % data.achievements.length
    ];
  const nextAch =
    data.achievements[(achIndex + 1) % data.achievements.length];

  return (
    <CertificateDetailClient
      ach={ach}
      prevAch={prevAch}
      nextAch={nextAch}
    />
  );
}
