"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award,
} from "lucide-react";
import type { AchievementItem } from "@/data/profile";
import ImageFieldWithEditor from "@/components/admin/ImageFieldWithEditor";

const EMPTY_CERTIFICATE: AchievementItem = {
  id: "",
  rank: "1st",
  rankNumeric: "01",
  title: "",
  category: "Web Technologies & Systems",
  issuer: "Dinas Pendidikan / Penyelenggara Resmi",
  year: "2024",
  description: "",
  certificatePlaceholder: "/cert-preview.png",
};

export default function AdminCertificatesPage() {
  const searchParams = useSearchParams();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<AchievementItem>(EMPTY_CERTIFICATE);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements || []);
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat sertifikat." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    const editId = searchParams.get("edit");

    if (action === "create") {
      openCreateModal();
    } else if (editId && achievements.length > 0) {
      const target = achievements.find((a) => a.id === editId);
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, achievements]);

  const openCreateModal = () => {
    setIsNew(true);
    const newId = `ach-${Date.now()}`;
    const nextNum = (achievements.length + 1).toString().padStart(2, "0");
    setFormData({
      ...EMPTY_CERTIFICATE,
      id: newId,
      rankNumeric: nextNum,
    });
    setModalOpen(true);
  };

  const openEditModal = (ach: AchievementItem) => {
    setIsNew(false);
    setFormData({ ...ach });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const endpoint = isNew ? "/api/certificates" : `/api/certificates/${formData.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({
          type: "success",
          text: resData.message || "Sertifikat berhasil disimpan!",
        });
        setModalOpen(false);
        fetchAchievements();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan sertifikat." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus sertifikat "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: `Sertifikat "${title}" berhasil dihapus.` });
        fetchAchievements();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menghapus sertifikat." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan saat menghapus." });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span>[ CRUD MODULE // CERTIFICATES & HONORS ]</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
            Sertifikat Kejuaraan & Prestasi
          </h1>
          <p className="text-xs font-mono text-[#9E9B94] mt-1">
            Kelola penghargaan Lomba Kompetensi Siswa (LKS), olimpiade, dan lisensi resmi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH SERTIFIKAT BARU</span>
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

      {/* List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-[#9E9B94]">
          Memuat sertifikat...
        </div>
      ) : achievements.length === 0 ? (
        <div className="border border-dashed border-white/20 p-12 text-center space-y-4">
          <p className="font-mono text-xs text-[#9E9B94]">Belum ada sertifikat.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-accent text-white font-mono text-xs uppercase"
          >
            + Tambah Sertifikat Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="border border-white/10 bg-[#121212] p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/25 transition-colors"
            >
              <div className="flex items-start gap-5">
                {/* Big Rank Badge */}
                <div className="w-16 h-16 border border-accent/40 bg-accent/10 flex flex-col items-center justify-center font-serif italic text-accent flex-shrink-0">
                  <span className="text-2xl font-bold leading-none">{ach.rank}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#9E9B94] not-italic mt-1">
                    PLACE
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-[#F2EFE9] font-bold text-base sm:text-lg">
                      {ach.title}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-accent">{ach.year}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#9E9B94]">{ach.category}</span>
                  </div>

                  <p className="text-xs font-sans text-[#9E9B94] max-w-2xl">
                    {ach.description}
                  </p>

                  <div className="font-mono text-[11px] text-muted">
                    Penerbit / Penyelenggara:{" "}
                    <span className="text-[#F2EFE9] font-medium">{ach.issuer}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 font-mono text-xs self-end md:self-center flex-shrink-0">
                <a
                  href={`/certificate/${ach.id}`}
                  target="_blank"
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-[#F2EFE9] transition-colors"
                  title="Lihat detail live"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openEditModal(ach)}
                  className="px-3 py-2 border border-accent/40 bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sunting</span>
                </button>
                <button
                  onClick={() => handleDelete(ach.id, ach.title)}
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="border border-white/20 bg-[#141414] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
              <div className="font-mono text-xs">
                <span className="text-accent font-bold uppercase tracking-widest block">
                  {isNew ? "[ TAMBAH SERTIFIKAT ]" : "[ SUNTING SERTIFIKAT ]"}
                </span>
                <span className="text-[#F2EFE9] font-bold text-lg font-sans">
                  {isNew ? "Data Sertifikat & Prestasi Baru" : `Edit: ${formData.title}`}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#9E9B94] hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Nama Kejuaraan / Sertifikat: *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Contoh: LKS SMK Tingkat Provinsi Banten — Bidang Web Technologies"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Peringkat / Juara: *
                  </label>
                  <input
                    type="text"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    required
                    placeholder="1st, 2nd, 3rd, Finalist"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Angka Urutan:
                  </label>
                  <input
                    type="text"
                    value={formData.rankNumeric}
                    onChange={(e) => setFormData({ ...formData, rankNumeric: e.target.value })}
                    placeholder="01, 02"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Tahun: *
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    placeholder="2024"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Kategori Lomba / Bidang:
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Web Technologies & Systems"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Penerbit / Penyelenggara Resmi:
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Dinas Pendidikan dan Kebudayaan Provinsi Banten"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Deskripsi / Konteks Perlombaan:
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsikan modul perlombaan, teknologi yang diuji, atau pencapaian..."
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              {/* Image Uploader & Photo Editor */}
              <ImageFieldWithEditor
                label="Foto / Sertifikat Resmi: *"
                value={formData.certificatePlaceholder}
                onChange={(newUrl) =>
                  setFormData({ ...formData, certificatePlaceholder: newUrl })
                }
                aspectPreset="4:3"
                helperText="Mendukung unggah foto sertifikat fisik, crop rasio 4:3 standar sertifikat, rotasi, dan penyesuaian kontras."
              />

              <div className="border-t border-white/10 pt-6 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-white/20 text-[#F2EFE9] font-mono text-xs uppercase hover:bg-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Sertifikat"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
