import React from "react";
import { notFound } from "next/navigation";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import CertificateDetailClient from "@/components/CertificateDetailClient";

interface CertificatePageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return PROFILE_DATA.achievements.map((ach) => ({
    id: ach.id,
  }));
}

export function generateMetadata({ params }: CertificatePageProps): Metadata {
  const ach = PROFILE_DATA.achievements.find((a) => a.id === params.id);
  if (!ach) {
    return {
      title: "Certificate Not Found",
    };
  }

  return {
    title: `${ach.title} (${ach.rank} Place) — Official Record | ${PROFILE_DATA.personal.name}`,
    description: ach.description,
  };
}

export default function CertificateDetailPage({ params }: CertificatePageProps) {
  const achIndex = PROFILE_DATA.achievements.findIndex((a) => a.id === params.id);
  if (achIndex === -1) {
    notFound();
  }

  const ach = PROFILE_DATA.achievements[achIndex];
  const prevAch =
    PROFILE_DATA.achievements[
      (achIndex - 1 + PROFILE_DATA.achievements.length) % PROFILE_DATA.achievements.length
    ];
  const nextAch =
    PROFILE_DATA.achievements[(achIndex + 1) % PROFILE_DATA.achievements.length];

  return (
    <CertificateDetailClient
      ach={ach}
      prevAch={prevAch}
      nextAch={nextAch}
    />
  );
}
