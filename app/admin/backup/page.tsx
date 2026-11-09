"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { ProfileData } from "@/data/profile";

export default function AdminBackupPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Download JSON file
  const handleDownloadJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rafli-portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedback({ type: "success", text: "File backup JSON berhasil diunduh!" });
  };

  // Import JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.personal || !json.projects || !json.achievements) {
          setFeedback({
            type: "error",
            text: "Format file JSON tidak sesuai struktur ProfileData.",
          });
          return;
        }

        const res = await fetch("/api/data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });

        if (res.ok) {
          setFeedback({ type: "success", text: "Data berhasil dipulihkan dari file JSON!" });
          fetchData();
        } else {
          setFeedback({ type: "error", text: "Gagal mengunggah data ke server." });
        }
      } catch {
        setFeedback({ type: "error", text: "File bukan JSON yang valid." });
      }
    };
    reader.readAsText(file);
  };

  // Copy TypeScript code
  const handleCopyTS = () => {
    if (!data) return;
    const tsCode = `import { ProfileData } from "./profile";\n\nexport const PROFILE_DATA: ProfileData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
    navigator.clipboard.writeText(tsCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
    setFeedback({
      type: "success",
      text: "Kode TypeScript berhasil disalin ke clipboard! Anda dapat menempelkannya ke data/profile.ts.",
    });
  };

  // Factory reset
  const handleResetDefault = async () => {
    if (
      !window.confirm(
        "PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke setelan default bawaan? Data custom akan ditimpa."
      )
    ) {
      return;
    }

    setResetting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/data/reset", { method: "POST" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: "Data berhasil dikembalikan ke default bawaan." });
        fetchData();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal mereset data." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan saat mereset." });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-10 font-sans pb-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-accent">
          <span>[ PERSISTENCE & STORAGE UTILITY ]</span>
        </div>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
          Backup, Sinkronisasi & Database Cloud
        </h1>
        <p className="text-xs font-mono text-[#9E9B94] mt-1">
          Unduh backup JSON, pulihkan data, salin ke kode sumber Git, atau hubungkan ke database cloud Supabase/PostgreSQL.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 font-mono text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Grid Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Download JSON */}
        <div className="border border-white/15 bg-[#121212] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent/15 border border-accent/40 text-accent flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-[#F2EFE9]">
                Unduh Cadangan JSON
              </h3>
              <p className="font-mono text-xs text-[#9E9B94]">
                Export seluruh data runtime portofolio ke file .json
              </p>
            </div>
          </div>
          <p className="text-xs font-sans text-[#9E9B94] leading-relaxed">
            Menyimpan salinan lengkap proyek, sertifikat, poster, pengalaman, dan biodata ke komputer Anda. Berguna sebagai arsip aman sebelum melakukan pembaruan besar.
          </p>
          <button
            onClick={handleDownloadJSON}
            disabled={!data || loading}
            className="w-full bg-[#1A1A1A] hover:bg-white/10 border border-white/20 text-[#F2EFE9] font-mono text-xs font-semibold uppercase py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>UNDUH FILE BACKUP (.JSON)</span>
          </button>
        </div>

        {/* Card 2: Restore from JSON */}
        <div className="border border-white/15 bg-[#121212] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-[#F2EFE9]">
                Pulihkan dari File JSON
              </h3>
              <p className="font-mono text-xs text-[#9E9B94]">
                Import data dari file backup JSON sebelumnya
              </p>
            </div>
          </div>
          <p className="text-xs font-sans text-[#9E9B94] leading-relaxed">
            Pilih file backup .json dari komputer Anda untuk memulihkan seluruh proyek dan konten ke status sebelumnya secara instan.
          </p>
          <label className="w-full bg-[#1A1A1A] hover:bg-white/10 border border-white/20 text-[#F2EFE9] font-mono text-xs font-semibold uppercase py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
            <Upload className="w-4 h-4" />
            <span>PILIH FILE JSON UNTUK RESTORE</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Card 3: Copy TypeScript Code (Git Permanent Deploy) */}
        <div className="border border-white/15 bg-[#121212] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-[#F2EFE9]">
                Salin Kode ke `data/profile.ts`
              </h3>
              <p className="font-mono text-xs text-[#9E9B94]">
                Bake data permanen ke Git tanpa butuh database
              </p>
            </div>
          </div>
          <p className="text-xs font-sans text-[#9E9B94] leading-relaxed">
            Salin objek kode TypeScript lengkap. Anda bisa menempelkannya ke file <code className="text-accent bg-black px-1">data/profile.ts</code> lalu push ke GitHub agar data tersimpan permanen di Vercel secara gratis selamanya!
          </p>
          <button
            onClick={handleCopyTS}
            disabled={!data || loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? "BERHASIL DISALIN!" : "SALIN KODE TYPESCRIPT"}</span>
          </button>
        </div>

        {/* Card 4: Factory Reset */}
        <div className="border border-red-500/20 bg-[#121212] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-red-400">
                Kembalikan ke Setelan Pabrik
              </h3>
              <p className="font-mono text-xs text-[#9E9B94]">
                Reset ke default awal Muh. Rafli Ichsan
              </p>
            </div>
          </div>
          <p className="text-xs font-sans text-[#9E9B94] leading-relaxed">
            Jika ada kesalahan atau data yang ingin dibersihkan, tombol ini akan mengembalikan data proyek, sertifikat, dan poster ke data awal.
          </p>
          <button
            onClick={handleResetDefault}
            disabled={resetting}
            className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs font-semibold uppercase py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetting ? "MERESET DATA..." : "RESET KE DEFAULT AWAL"}</span>
          </button>
        </div>
      </div>

      {/* Cloud Database Integration Guide (Supabase / Postgres on Vercel) */}
      <div className="border border-white/15 bg-[#121212] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Cloud className="w-5 h-5 text-accent" />
          <div>
            <h2 className="font-sans font-bold text-lg text-[#F2EFE9]">
              Panduan Database Cloud untuk Vercel (Opsional)
            </h2>
            <p className="font-mono text-xs text-[#9E9B94]">
              Simpan data secara cloud permanen saat website di-deploy ke Vercel
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-sans text-[#9E9B94] leading-relaxed">
          <p>
            Di lingkungan serverless Vercel, sistem file bersifat <em>ephemeral / read-only</em>. Jika Anda ingin melakukan CRUD langsung di website yang sudah live di Vercel tanpa perlu push git ulang, Anda cukup menghubungkan <strong>Supabase (Gratis)</strong>:
          </p>

          <ol className="list-decimal pl-5 space-y-2 font-mono text-[11px] text-[#F2EFE9]">
            <li>
              Buat project gratis di{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                supabase.com
              </a>
              .
            </li>
            <li>
              Di menu <strong>SQL Editor</strong> Supabase, jalankan perintah ini (hanya 1 tabel):
              <pre className="mt-2 p-3 bg-black border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`CREATE TABLE portfolio_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </li>
            <li>
              Di dashboard <strong>Vercel Settings → Environment Variables</strong> (atau file <code className="text-accent">.env.local</code> di lokal), tambahkan 2 variabel:
              <pre className="mt-2 p-3 bg-black border border-white/10 text-accent font-mono text-[11px] overflow-x-auto">
{`SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
            </li>
            <li>
              Selesai! Sistem akan otomatis mendeteksi Supabase dan menyimpan setiap CRUD secara real-time ke cloud database tanpa biaya.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
