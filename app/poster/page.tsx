import React from "react";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";
import AllPostersClient from "@/components/AllPostersClient";

export const metadata: Metadata = {
  title: `All Poster Collections & Visual Direction | ${PROFILE_DATA.personal.name}`,
  description:
    "Arsip lengkap koleksi poster tipografi Swiss International Style, desain editorial majalah independen, dan estetika visual brutalist karya Muh. Rafli Ichsan.",
};

export default function AllPostersArchivePage() {
  return <AllPostersClient posters={PROFILE_DATA.posters} />;
}
