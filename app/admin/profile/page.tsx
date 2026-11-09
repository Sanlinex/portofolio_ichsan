"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  Globe,
  Code2,
  Plus,
  Trash2,
} from "lucide-react";
import type { ProfileData } from "@/data/profile";

export default function AdminProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Raw text helpers
  const [secondarySkillsInput, setSecondarySkillsInput] = useState("");
  const [marquee1Input, setMarquee1Input] = useState("");
  const [marquee2Input, setMarquee2Input] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.skills?.secondary) {
          setSecondarySkillsInput(json.skills.secondary.join(", "));
        }
        if (json.skills?.marqueeRow1) {
          setMarquee1Input(json.skills.marqueeRow1.join(", "));
        }
        if (json.skills?.marqueeRow2) {
          setMarquee2Input(json.skills.marqueeRow2.join(", "));
        }
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat profil." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatChange = (
    index: number,
    field: "value" | "suffix" | "label" | "description",
    val: string | number
  ) => {
    if (!data) return;
    const updated = [...data.personal.stats];
    updated[index] = { ...updated[index], [field]: val };
    setData({
      ...data,
      personal: { ...data.personal, stats: updated },
    });
  };

  const handleCoreSkillChange = (
    index: number,
    field: "name" | "level" | "years" | "summary",
    val: string
  ) => {
    if (!data) return;
    const updated = [...data.skills.core];
    updated[index] = { ...updated[index], [field]: val };
    setData({
      ...data,
      skills: { ...data.skills, core: updated },
    });
  };

  const handleAlsoSkillChange = (
    index: number,
    field: "name" | "level" | "years" | "summary",
    val: string
  ) => {
    if (!data) return;
    const updated = [...data.skills.also];
    updated[index] = { ...updated[index], [field]: val };
    setData({
      ...data,
      skills: { ...data.skills, also: updated },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setFeedback(null);

    const secondaryArray = secondarySkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const marquee1Array = marquee1Input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const marquee2Array = marquee2Input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      personal: data.personal,
      contact: data.contact,
      skills: {
        ...data.skills,
        secondary: secondaryArray,
        marqueeRow1: marquee1Array,
        marqueeRow2: marquee2Array,
      },
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({
          type: "success",
          text: "Biodata, kontak, dan keahlian berhasil diperbarui!",
        });
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan biodata." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#9E9B94]">
        Memuat data profil & keahlian...
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span>[ CRUD MODULE // PROFILE & SKILLS ]</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
            Biodata Personal, Bio & Keahlian
          </h1>
          <p className="text-xs font-mono text-[#9E9B94] mt-1">
            Sunting teks editorial hero, manifesto, kontak sosial, dan matriks keahlian teknis.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "SIMPAN PERUBAHAN"}</span>
        </button>
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

      <form onSubmit={handleSave} className="space-y-10">
        {/* 1. PERSONAL INFORMATION */}
        <div className="border border-white/15 bg-[#121212] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <User className="w-4 h-4 text-accent" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F2EFE9] font-bold">
              1. INFORMASI PERSONAL & EDITORIAL HERO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Nama Lengkap:</label>
              <input
                type="text"
                value={data.personal.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, name: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Role / Judul Posisi:</label>
              <input
                type="text"
                value={data.personal.role}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, role: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Pengalaman Tahun:</label>
              <input
                type="text"
                value={data.personal.experienceYears}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, experienceYears: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Lokasi:</label>
              <input
                type="text"
                value={data.personal.location}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, location: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Status Ketersediaan:</label>
              <input
                type="text"
                value={data.personal.availability}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, availability: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Issue Number Edisi:</label>
              <input
                type="text"
                value={data.personal.issueNumber}
                onChange={(e) =>
                  setData({
                    ...data,
                    personal: { ...data.personal, issueNumber: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase text-[#9E9B94]">
              Bio Editorial Hero (1-2 kalimat pengantar di bawah judul):
            </label>
            <textarea
              rows={2}
              value={data.personal.bioEditorial}
              onChange={(e) =>
                setData({
                  ...data,
                  personal: { ...data.personal, bioEditorial: e.target.value },
                })
              }
              className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Paragraf Narasi Bio 1:
              </label>
              <textarea
                rows={3}
                value={data.personal.bioParagraphs[0] || ""}
                onChange={(e) => {
                  const updated = [...data.personal.bioParagraphs];
                  updated[0] = e.target.value;
                  setData({ ...data, personal: { ...data.personal, bioParagraphs: updated } });
                }}
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Paragraf Narasi Bio 2:
              </label>
              <textarea
                rows={3}
                value={data.personal.bioParagraphs[1] || ""}
                onChange={(e) => {
                  const updated = [...data.personal.bioParagraphs];
                  updated[1] = e.target.value;
                  setData({ ...data, personal: { ...data.personal, bioParagraphs: updated } });
                }}
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* 3 Numerical Stats */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="font-mono text-xs uppercase text-[#9E9B94] font-bold block">
              3 Angka Statistik Kunci (Bagian About):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.personal.stats.map((stat, idx) => (
                <div key={idx} className="border border-white/10 bg-[#0A0A0A] p-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, "value", parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#141414] border border-white/20 px-2 py-1 text-sm font-bold text-accent font-mono"
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => handleStatChange(idx, "suffix", e.target.value)}
                      placeholder="+ / Tahun"
                      className="w-24 bg-[#141414] border border-white/20 px-2 py-1 text-sm font-mono text-[#F2EFE9]"
                    />
                  </div>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="Label statistik"
                    className="w-full bg-[#141414] border border-white/20 px-2 py-1 text-xs font-mono uppercase text-[#F2EFE9]"
                  />
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => handleStatChange(idx, "description", e.target.value)}
                    placeholder="Deskripsi singkat"
                    className="w-full bg-[#141414] border border-white/20 px-2 py-1 text-xs text-[#9E9B94]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. CONTACT & SOCIAL NETWORKS */}
        <div className="border border-white/15 bg-[#121212] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Globe className="w-4 h-4 text-accent" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F2EFE9] font-bold">
              2. KONTAK & JARINGAN SOSIAL
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">Email Resmi:</label>
              <input
                type="email"
                value={data.contact.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    contact: { ...data.contact, email: e.target.value },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">URL Profil GitHub:</label>
              <input
                type="url"
                value={data.contact.github.url}
                onChange={(e) =>
                  setData({
                    ...data,
                    contact: {
                      ...data.contact,
                      github: { ...data.contact.github, url: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">URL Profil LinkedIn:</label>
              <input
                type="url"
                value={data.contact.linkedin.url}
                onChange={(e) =>
                  setData({
                    ...data,
                    contact: {
                      ...data.contact,
                      linkedin: { ...data.contact.linkedin, url: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">URL Profil Instagram:</label>
              <input
                type="url"
                value={data.contact.instagram.url}
                onChange={(e) =>
                  setData({
                    ...data,
                    contact: {
                      ...data.contact,
                      instagram: { ...data.contact.instagram, url: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* 3. SKILLS & KINETIC MARQUEE WORDS */}
        <div className="border border-white/15 bg-[#121212] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Code2 className="w-4 h-4 text-accent" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F2EFE9] font-bold">
              3. ARSENAL KEAHLIAN & TEKS MARQUEE KINETIK
            </h2>
          </div>

          {/* Core Skills Cards */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase text-[#9E9B94] font-bold block">
              Core Web Engineering Cards (Kategori 1):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.skills.core.map((skill, idx) => (
                <div key={idx} className="border border-white/10 bg-[#0A0A0A] p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-accent font-bold">0{idx + 1}</span>
                    <input
                      type="text"
                      value={skill.years}
                      onChange={(e) => handleCoreSkillChange(idx, "years", e.target.value)}
                      placeholder="Tahun pengalaman"
                      className="w-24 bg-[#141414] border border-white/20 px-2 py-0.5 text-xs text-[#9E9B94] font-mono text-right"
                    />
                  </div>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleCoreSkillChange(idx, "name", e.target.value)}
                    placeholder="Nama Skill (Laravel 11)"
                    className="w-full bg-[#141414] border border-white/20 px-2.5 py-1 text-sm font-bold text-[#F2EFE9]"
                  />
                  <input
                    type="text"
                    value={skill.level}
                    onChange={(e) => handleCoreSkillChange(idx, "level", e.target.value)}
                    placeholder="Level (Senior Architecture)"
                    className="w-full bg-[#141414] border border-white/20 px-2 py-0.5 text-xs font-mono text-accent"
                  />
                  <textarea
                    rows={2}
                    value={skill.summary}
                    onChange={(e) => handleCoreSkillChange(idx, "summary", e.target.value)}
                    placeholder="Ringkasan teknis..."
                    className="w-full bg-[#141414] border border-white/20 px-2 py-1 text-xs text-[#9E9B94]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Teks Marquee Kinetik Baris 1 (Pisahkan koma):
              </label>
              <input
                type="text"
                value={marquee1Input}
                onChange={(e) => setMarquee1Input(e.target.value)}
                placeholder="LARAVEL 11, REACT JS, NEXT.JS 14, POSTGRESQL"
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Teks Marquee Kinetik Baris 2 (Pisahkan koma):
              </label>
              <input
                type="text"
                value={marquee2Input}
                onChange={(e) => setMarquee2Input(e.target.value)}
                placeholder="FULLSTACK SYSTEMS, TAILWIND CSS, SWISS EDITORIAL, GSAP"
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Supporting Technologies */}
          <div className="space-y-1.5 pt-4 border-t border-white/10">
            <label className="font-mono text-xs uppercase text-[#9E9B94]">
              Supporting Technologies & Tools (Pisahkan koma):
            </label>
            <input
              type="text"
              value={secondarySkillsInput}
              onChange={(e) => setSecondarySkillsInput(e.target.value)}
              placeholder="Git, Docker, Figma, Postman, Linux VPS, Vercel"
              className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="sticky bottom-4 z-20 border border-white/20 bg-[#141414]/95 backdrop-blur-md p-4 flex justify-between items-center shadow-2xl">
          <span className="font-mono text-xs text-[#9E9B94]">
            Pastikan perubahan telah sesuai sebelum menyimpan.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "SIMPAN PERUBAHAN"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
