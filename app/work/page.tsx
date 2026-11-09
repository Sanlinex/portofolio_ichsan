import React from "react";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import AllWorksClient from "@/components/AllWorksClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProfileData();
  return {
    title: `All Projects & Engineering Archive | ${data.personal.name}`,
    description:
      "Katalog lengkap studi kasus rekayasa web, arsitektur aplikasi fullstack, CMS redaksi berita, dan sistem kasir ritel offline-first karya Muh. Rafli Ichsan.",
  };
}

export default async function AllWorksArchivePage() {
  const data = await getProfileData();
  return <AllWorksClient projects={data.projects} />;
}
