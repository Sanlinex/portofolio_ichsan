import React from "react";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import AllWorksClient from "@/components/AllWorksClient";

export const metadata: Metadata = {
  title: `All Projects & Engineering Archive | ${PROFILE_DATA.personal.name}`,
  description:
    "Katalog lengkap studi kasus rekayasa web, arsitektur aplikasi fullstack, CMS redaksi berita, dan sistem kasir ritel offline-first karya Muh. Rafli Ichsan.",
};

export default function AllWorksArchivePage() {
  return <AllWorksClient projects={PROFILE_DATA.projects} />;
}
