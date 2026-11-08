import React from "react";
import { notFound } from "next/navigation";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import PosterStudioClient from "@/components/PosterStudioClient";

interface PosterDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return PROFILE_DATA.posters.map((poster) => ({
    id: poster.id,
  }));
}

export function generateMetadata({ params }: PosterDetailPageProps): Metadata {
  const poster = PROFILE_DATA.posters.find((p) => p.id === params.id);
  if (!poster) {
    return {
      title: "Poster Series Not Found",
    };
  }

  return {
    title: `${poster.title} — Swiss Poster Series | ${PROFILE_DATA.personal.name}`,
    description: poster.description,
  };
}

export default function PosterDetailPage({ params }: PosterDetailPageProps) {
  const posterIndex = PROFILE_DATA.posters.findIndex((p) => p.id === params.id);
  if (posterIndex === -1) {
    notFound();
  }

  const poster = PROFILE_DATA.posters[posterIndex];
  const prevPoster =
    PROFILE_DATA.posters[
      (posterIndex - 1 + PROFILE_DATA.posters.length) % PROFILE_DATA.posters.length
    ];
  const nextPoster =
    PROFILE_DATA.posters[(posterIndex + 1) % PROFILE_DATA.posters.length];

  return (
    <PosterStudioClient
      poster={poster}
      prevPoster={prevPoster}
      nextPoster={nextPoster}
    />
  );
}
