import React from "react";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import AllPostersClient from "@/components/AllPostersClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProfileData();
  return {
    title: `All Poster Collections & Visual Direction | ${data.personal.name}`,
    description:
      "Arsip lengkap koleksi poster tipografi Swiss International Style, desain editorial majalah independen, dan estetika visual brutalist karya Muh. Rafli Ichsan.",
  };
}

export default async function AllPostersArchivePage() {
  const data = await getProfileData();
  return <AllPostersClient posters={data.posters} />;
}
