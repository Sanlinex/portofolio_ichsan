import React from "react";
import Link from "next/link";
import { PROFILE_DATA } from "@/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `All Certificates & Honors Archive | ${PROFILE_DATA.personal.name}`,
  description:
    "Arsip lengkap sertifikat kejuaraan rekayasa web Lomba Kompetensi Siswa (LKS), Olimpiade Digital UMKM, dan rekognisi resmi yang diperoleh Muh. Rafli Ichsan.",
};

export default function AllCertificatesArchivePage() {
  return (
    <article className="min-h-screen w-full bg-background text-foreground pt-28 pb-24 px-6 sm:px-10 lg:px-16 selection:bg-accent selection:text-[#F2EFE9]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0E0E0E]/15 pb-6 font-mono text-xs uppercase tracking-widest text-muted">
          <Link
            href="/#achievements"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors font-semibold"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>KEMBALI KE HOME // HONORS</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-semibold">
              OFFICIAL RECORD // {PROFILE_DATA.achievements.length} AWARDS VERIFIED
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="px-2.5 py-1 border border-accent text-accent font-bold">
              VERIFIED DIPLOMAS
            </span>
            <span>/</span>
            <span className="text-foreground font-semibold">COMPETITIVE WEB RECORD</span>
            <span>/</span>
            <span>2022 — 2023</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground leading-[1.05]">
            Podium Honors &amp; <br />
            <span className="font-serif italic font-normal text-accent">
              Verified Certificates.
            </span>
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-muted max-w-4xl leading-relaxed">
            Arsip lengkap rekam jejak kejuaraan rekayasa web di bawah batas waktu pengerjaan ketat, dinilai langsung oleh praktisi industri dan dinas pendidikan.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#0E0E0E]/15 font-mono text-xs">
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Total Penghargaan</p>
              <p className="font-semibold text-accent">{PROFILE_DATA.achievements.length} Juara Podium Resmi</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Peringkat Tertinggi</p>
              <p className="font-semibold text-foreground">Juara 1 Web Developer</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Cakupan Wilayah</p>
              <p className="font-semibold text-foreground">Kab. Tangerang &amp; Banten</p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-1">Status Autentikasi</p>
              <p className="font-semibold text-accent">Semua Terverifikasi Asli</p>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="space-y-16 pt-6">
          {PROFILE_DATA.achievements.map((ach) => (
            <div
              key={ach.id}
              className="border border-[#0E0E0E]/15 bg-surface p-6 sm:p-10 lg:p-12 space-y-8 hover:border-[#0E0E0E] transition-all shadow-sm"
            >
              {/* Header Row */}
              <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-[#0E0E0E]/10 pb-4 font-mono text-xs">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-4xl sm:text-5xl text-accent font-normal">
                    {ach.rank}
                  </span>
                  <span className="text-muted uppercase tracking-wider">
                    PLACE // {ach.year}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-foreground font-semibold uppercase">{ach.issuer}</span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-foreground tracking-tight">
                  {ach.title}
                </h2>
                <p className="font-serif italic text-lg sm:text-xl text-accent">
                  {ach.category}
                </p>
              </div>

              {/* Certificate Diploma Visual Preview */}
              <div className="relative w-full aspect-[1200/850] max-h-[500px] bg-[#F8F6F0] border-2 border-[#0E0E0E]/15 overflow-hidden shadow-md flex items-center justify-center p-3 sm:p-6 group">
                <img
                  src={ach.certificatePlaceholder}
                  alt={`Sertifikat ${ach.title} - ${ach.issuer}`}
                  className="w-full h-full object-contain select-none group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-4 font-mono text-[9px] text-[#0E0E0E]/40 tracking-wider pointer-events-none hidden sm:block uppercase">
                  MUH. RAFLI ICHSAN // VERIFIED DIPLOMA
                </div>
              </div>

              {/* Description & Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                <div className="md:col-span-8 space-y-3 font-sans text-sm sm:text-base text-muted leading-relaxed">
                  <p className="text-foreground font-medium">{ach.description}</p>
                  <p className="text-xs sm:text-sm">
                    Karya rekayasa diuji langsung oleh dewan juri ahli dengan parameter penilaian arsitektur database, keamanan autentikasi API, dan kesesuaian antarmuka dengan spesifikasi instruksi LKS.
                  </p>
                </div>

                <div className="md:col-span-4 space-y-3 font-mono text-xs border-t md:border-t-0 md:border-l border-[#0E0E0E]/10 md:pl-6 pt-4 md:pt-0">
                  <span className="text-muted uppercase block font-semibold">INFORMASI DOKUMEN:</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-[#0E0E0E]/10 pb-1.5">
                      <span className="text-muted">Penyelenggara:</span>
                      <span className="font-medium text-foreground text-right">{ach.issuer}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#0E0E0E]/10 pb-1.5">
                      <span className="text-muted">Tahun:</span>
                      <span className="font-bold text-accent">{ach.year}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#0E0E0E]/10 pb-1.5">
                      <span className="text-muted">Status:</span>
                      <span className="font-semibold text-accent">Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-[#0E0E0E]/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-muted">
                  <span className="text-accent">📁</span>
                  <span>
                    File path:{" "}
                    <code className="text-foreground font-semibold">
                      public{ach.certificatePlaceholder}
                    </code>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={ach.certificatePlaceholder}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 border border-[#0E0E0E]/20 hover:border-[#0E0E0E] text-foreground tracking-wider uppercase transition-colors"
                  >
                    Buka Berkas Asli ↗
                  </a>
                  <Link
                    href={`/certificate/${ach.id}`}
                    className="py-2.5 px-5 bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Detail Sertifikat Lengkap</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
