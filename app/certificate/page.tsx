import React from "react";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import AllCertificatesClient from "@/components/AllCertificatesClient";

export const metadata: Metadata = {
  title: `All Certificates & Honors Archive | ${PROFILE_DATA.personal.name}`,
  description:
    "Arsip lengkap sertifikat kejuaraan rekayasa web Lomba Kompetensi Siswa (LKS), Olimpiade Digital UMKM, dan rekognisi resmi yang diperoleh Muh. Rafli Ichsan.",
};

export default function AllCertificatesArchivePage() {
  return <AllCertificatesClient achievements={PROFILE_DATA.achievements} />;
}
