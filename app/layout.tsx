import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { PROFILE_DATA } from "@/data/profile";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: false,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rafliichsan.dev"),
  title: `${PROFILE_DATA.personal.name} — ${PROFILE_DATA.personal.role}`,
  description: `${PROFILE_DATA.personal.name} (${PROFILE_DATA.personal.role}). ±3 Tahun Pengalaman. Lulusan SMK RPL, Intern Transisi Media & Pake-POS. Juara 1 Web Dev Kab. Tangerang, Juara 3 Banten, Juara 3 Olimpiade UMKM. Minimalist Editorial & Typographic Archive.`,
  keywords: [
    "Muh. Rafli Ichsan",
    "Fullstack Web Developer",
    "Laravel",
    "React JS",
    "Next.js",
    "Web Developer Tangerang",
    "Web Developer Banten",
    "Portfolio Editorial",
    "Juara LKS Web Developer",
  ],
  authors: [{ name: PROFILE_DATA.personal.name }],
  creator: PROFILE_DATA.personal.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rafliichsan.dev",
    title: `${PROFILE_DATA.personal.name} — ${PROFILE_DATA.personal.role}`,
    description:
      "Minimalist Editorial & Typographic Web Portfolio. High-performance fullstack systems, Awwwards-standard craft, and tactile interactions.",
    siteName: `${PROFILE_DATA.personal.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE_DATA.personal.name} — ${PROFILE_DATA.personal.role}`,
    description: "Minimalist Editorial & Typographic Portfolio by Muh. Rafli Ichsan.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased min-h-screen relative selection:bg-accent selection:text-[#F2EFE9]">
        <SmoothScroll>
          {/* Subtle tactile paper grain overlay */}
          <div className="grain-overlay" aria-hidden="true" />
          {/* Global custom cursor */}
          <CustomCursor />
          <main className="relative z-10 w-full">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
