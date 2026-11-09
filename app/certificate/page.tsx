import React from "react";
import { getProfileData } from "@/lib/db";
import type { Metadata } from "next";
import AllCertificatesClient from "@/components/AllCertificatesClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProfileData();
  return {
    title: `All Certificates & Honors Archive | ${data.personal.name}`,
    description:
      "Arsip lengkap sertifikat kejuaraan rekayasa web Lomba Kompetensi Siswa (LKS), Olimpiade Digital UMKM, dan rekognisi resmi yang diperoleh Muh. Rafli Ichsan.",
  };
}

export default async function AllCertificatesArchivePage() {
  const data = await getProfileData();
  return <AllCertificatesClient achievements={data.achievements} />;
}
