"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import type { ExperienceItem, EducationItem } from "@/data/profile";

const EMPTY_EXPERIENCE: ExperienceItem = {
  id: "",
  index: "01",
  company: "",
  role: "Web Developer Intern",
  period: "2024",
  location: "Tangerang, Indonesia",
  type: "Internship / Fullstack",
  description: "",
  highlights: ["Pengembangan modul sistem web", "Optimasi query database"],
  stack: ["Laravel", "React JS", "MySQL"],
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Experience modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [isNewExp, setIsNewExp] = useState(false);
  const [expForm, setExpForm] = useState<ExperienceItem>(EMPTY_EXPERIENCE);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [stackInput, setStackInput] = useState("");

  // Education state
  const [eduCoursesInput, setEduCoursesInput] = useState("");
  const [savingEdu, setSavingEdu] = useState(false);

  const [savingExp, setSavingExp] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setExperiences(json.experiences || []);
        setEducation(json.education || null);
        if (json.education?.courses) {
          setEduCoursesInput(json.education.courses.join(", "));
        }
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat data pengalaman." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateExp = () => {
    setIsNewExp(true);
    const newId = `exp-${Date.now()}`;
    const nextIdx = (experiences.length + 1).toString().padStart(2, "0");
    const initData: ExperienceItem = {
      ...EMPTY_EXPERIENCE,
      id: newId,
      index: nextIdx,
    };
    setExpForm(initData);
    setHighlightsInput(initData.highlights.join("\n"));
    setStackInput(initData.stack.join(", "));
    setExpModalOpen(true);
  };

  const openEditExp = (exp: ExperienceItem) => {
    setIsNewExp(false);
    setExpForm({ ...exp });
    setHighlightsInput(exp.highlights.join("\n"));
    setStackInput(exp.stack.join(", "));
    setExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExp(true);
    setFeedback(null);

    const highlightsArray = highlightsInput
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);
    const stackArray = stackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: ExperienceItem = {
      ...expForm,
      highlights: highlightsArray,
      stack: stackArray,
    };

    try {
      const endpoint = isNewExp ? "/api/experiences" : `/api/experiences/${expForm.id}`;
      const method = isNewExp ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: resData.message || "Pengalaman berhasil disimpan!" });
        setExpModalOpen(false);
        fetchData();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan pengalaman." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSavingExp(false);
    }
  };

  const handleDeleteExp = async (id: string, company: string) => {
    if (!window.confirm(`Yakin ingin menghapus pengalaman di "${company}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: `Pengalaman di "${company}" berhasil dihapus.` });
        fetchData();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menghapus pengalaman." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan saat menghapus." });
    }
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!education) return;
    setSavingEdu(true);
    setFeedback(null);

    const coursesArray = eduCoursesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedEdu: EducationItem = {
      ...education,
      courses: coursesArray,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ education: updatedEdu }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: "Data pendidikan akademik berhasil diperbarui!" });
        setEducation(updatedEdu);
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan data pendidikan." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSavingEdu(false);
    }
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span>[ CRUD MODULE // EXPERIENCES & EDUCATION ]</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
            Pengalaman Kerja & Pendidikan
          </h1>
          <p className="text-xs font-mono text-[#9E9B94] mt-1">
            Kelola histori pengalaman industri, magang rekayasa perangkat lunak, dan fondasi akademik.
          </p>
        </div>

        <button
          onClick={openCreateExp}
          className="bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH PENGALAMAN</span>
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

      {/* SECTION 1: WORK EXPERIENCES LIST */}
      <div className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#9E9B94] font-bold flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent" />
          <span>DAFTAR PENGALAMAN KERJA & MAGANG ({experiences.length})</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-[#9E9B94]">
            Memuat pengalaman kerja...
          </div>
        ) : experiences.length === 0 ? (
          <div className="border border-dashed border-white/20 p-8 text-center text-xs font-mono text-[#9E9B94]">
            Belum ada pengalaman kerja.
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="border border-white/10 bg-[#121212] p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/25 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-accent font-bold">[{exp.index}]</span>
                    <span className="text-[#F2EFE9] font-bold text-lg">{exp.company}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-accent">{exp.role}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#9E9B94]">{exp.period}</span>
                  </div>

                  <p className="text-xs font-sans text-[#9E9B94] max-w-2xl">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.stack.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono text-[#F2EFE9]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => openEditExp(exp)}
                    className="px-3 py-2 border border-accent/40 bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sunting</span>
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id, exp.company)}
                    className="p-2 border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: EDUCATION EDITOR */}
      {education && (
        <div className="border border-white/15 bg-[#121212] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#F2EFE9] font-bold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span>FONDASI PENDIDIKAN AKADEMIK</span>
            </h2>
            <span className="font-mono text-[11px] text-accent">SMK RPL ROOTS</span>
          </div>

          <form onSubmit={handleSaveEducation} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Nama Institusi / Sekolah:
                </label>
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                  required
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Jurusan / Gelar / Degree:
                </label>
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  required
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Periode Pendidikan:
                </label>
                <input
                  type="text"
                  value={education.period}
                  onChange={(e) => setEducation({ ...education, period: e.target.value })}
                  required
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Lokasi:
                </label>
                <input
                  type="text"
                  value={education.location}
                  onChange={(e) => setEducation({ ...education, location: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Deskripsi Pendidikan:
              </label>
              <textarea
                rows={3}
                value={education.description}
                onChange={(e) => setEducation({ ...education, description: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase text-[#9E9B94]">
                Fokus Kompetensi Keahlian (Pisahkan dengan koma):
              </label>
              <input
                type="text"
                value={eduCoursesInput}
                onChange={(e) => setEduCoursesInput(e.target.value)}
                placeholder="Rekayasa Perangkat Lunak, Basis Data Relasional, Pemrograman Berorientasi Objek"
                className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingEdu}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{savingEdu ? "Menyimpan..." : "Simpan Data Pendidikan"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="border border-white/20 bg-[#141414] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
              <div className="font-mono text-xs">
                <span className="text-accent font-bold uppercase tracking-widest block">
                  {isNewExp ? "[ TAMBAH PENGALAMAN ]" : "[ SUNTING PENGALAMAN ]"}
                </span>
                <span className="text-[#F2EFE9] font-bold text-lg font-sans">
                  {isNewExp ? "Pengalaman Kerja / Magang Baru" : `Edit: ${expForm.company}`}
                </span>
              </div>
              <button
                onClick={() => setExpModalOpen(false)}
                className="p-2 text-[#9E9B94] hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Nama Perusahaan / Organisasi: *
                  </label>
                  <input
                    type="text"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    required
                    placeholder="PT Transisi Media Visual"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Posisi / Role: *
                  </label>
                  <input
                    type="text"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    required
                    placeholder="Fullstack Developer Intern"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Periode Waktu:
                  </label>
                  <input
                    type="text"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="Jan 2024 — Apr 2024"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Tipe Pekerjaan:
                  </label>
                  <input
                    type="text"
                    value={expForm.type}
                    onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                    placeholder="Internship / Fullstack"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Deskripsi Tanggung Jawab:
                </label>
                <textarea
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  placeholder="Deskripsikan kontribusi Anda di perusahaan ini..."
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Poin Prestasi / Highlights (1 per baris):
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Meningkatkan kecepatan query sebesar 42%&#10;Membangun dashboard redaksi internal"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Teknologi yang Dipakai (Pisahkan koma):
                </label>
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="Laravel, React JS, MySQL, REST API"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-5 py-2.5 border border-white/20 text-[#F2EFE9] font-mono text-xs uppercase hover:bg-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingExp}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingExp ? "Menyimpan..." : "Simpan Pengalaman"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
