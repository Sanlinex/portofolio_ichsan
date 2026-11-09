import React from "react";
import { notFound } from "next/navigation";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import PosterStudioClient from "@/components/PosterStudioClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PosterDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PosterDetailPageProps): Promise<Metadata> {
  const data = await getProfileData();
  const poster = data.posters.find((p) => p.id === params.id);
  if (!poster) {
    return {
      title: "Poster Series Not Found",
    };
  }

  return {
    title: `${poster.title} — Swiss Poster Series | ${data.personal.name}`,
    description: poster.description,
  };
}

export default async function PosterDetailPage({ params }: PosterDetailPageProps) {
  const data = await getProfileData();
  const posterIndex = data.posters.findIndex((p) => p.id === params.id);
  if (posterIndex === -1) {
    notFound();
  }

  const poster = data.posters[posterIndex];
  const prevPoster =
    data.posters[
      (posterIndex - 1 + data.posters.length) % data.posters.length
    ];
  const nextPoster =
    data.posters[(posterIndex + 1) % data.posters.length];

  return (
    <PosterStudioClient
      poster={poster}
      prevPoster={prevPoster}
      nextPoster={nextPoster}
    />
  );
}
