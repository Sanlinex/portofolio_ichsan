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
} from "lucide-react";
import type { ProjectItem } from "@/data/profile";

const EMPTY_PROJECT: ProjectItem = {
  id: "",
  slug: "",
  index: "",
  title: "",
  tagline: "",
  role: "Fullstack Web Developer",
  period: "2024",
  client: "Independent / Production Case",
  stack: ["Next.js", "Laravel", "Tailwind CSS"],
  liveUrl: "",
  githubUrl: "",
  summary: "",
  challenge: "",
  solution: "",
  deliverables: [
    "Arsitektur database & REST API",
    "Komponen UI/UX responsif & interaktif",
    "Optimasi performa & SEO",
  ],
  metrics: [
    { label: "Performance", value: "99/100" },
    { label: "Latency", value: "<100ms" },
  ],
  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
};

export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState<ProjectItem>(EMPTY_PROJECT);
  const [stackInput, setStackInput] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat daftar proyek." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle URL query action (?action=create or ?edit=id)
  useEffect(() => {
    const action = searchParams.get("action");
    const editId = searchParams.get("edit");

    if (action === "create") {
      openCreateModal();
    } else if (editId && projects.length > 0) {
      const target = projects.find((p) => p.id === editId || p.slug === editId);
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, projects]);

  const openCreateModal = () => {
    setIsNew(true);
    const newIdx = (projects.length + 1).toString().padStart(2, "0");
    const initData: ProjectItem = {
      ...EMPTY_PROJECT,
      id: `proj-${Date.now()}`,
      index: `${newIdx} // ${newIdx}`,
    };
    setFormData(initData);
    setStackInput(initData.stack.join(", "));
    setDeliverablesInput(initData.deliverables.join("\n"));
    setModalOpen(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setIsNew(false);
    setEditingProject(proj);
    setFormData({ ...proj });
    setStackInput(proj.stack.join(", "));
    setDeliverablesInput(proj.deliverables.join("\n"));
    setModalOpen(true);
  };

  const handleSlugAuto = (title: string) => {
    if (isNew) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, title, slug: autoSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleMetricChange = (index: number, field: "label" | "value", val: string) => {
    const updated = [...formData.metrics];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, metrics: updated }));
  };

  const addMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { label: "Metrik", value: "100%" }],
    }));
  };

  const removeMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Parse stack and deliverables
    const stackArray = stackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const deliverablesArray = deliverablesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: ProjectItem = {
      ...formData,
      stack: stackArray,
      deliverables: deliverablesArray,
    };

    try {
      const endpoint = isNew ? "/api/projects" : `/api/projects/${formData.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: resData.message || "Proyek berhasil disimpan!" });
        setModalOpen(false);
        fetchProjects();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan proyek." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus proyek "${title}"? Tindakan ini permanen.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: `Proyek "${title}" berhasil dihapus.` });
        fetchProjects();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menghapus proyek." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan saat menghapus." });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span>[ CRUD MODULE // PROJECTS ]</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
            Manajemen Proyek Portofolio
          </h1>
          <p className="text-xs font-mono text-[#9E9B94] mt-1">
            Tambah, sunting, atau hapus studi kasus rekayasa web dan aplikasi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH PROYEK BARU</span>
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
          <button
            onClick={() => setFeedback(null)}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-[#9E9B94]">
          Memuat data proyek...
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-white/20 p-12 text-center space-y-4">
          <p className="font-mono text-xs text-[#9E9B94]">Belum ada data proyek.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-accent text-white font-mono text-xs uppercase"
          >
            + Buat Proyek Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="border border-white/10 bg-[#121212] p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/25 transition-colors"
            >
              {/* Left: Thumbnail & Info */}
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-24 sm:w-32 aspect-[16/10] bg-[#0A0A0A] border border-white/10 overflow-hidden flex-shrink-0 relative">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-black/80 px-1 font-mono text-[9px] text-accent">
                    {proj.index}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-[#F2EFE9] font-bold text-base sm:text-lg">
                      {proj.title}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-accent">{proj.period}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#9E9B94]">{proj.client}</span>
                  </div>

                  <p className="text-xs font-sans text-[#9E9B94] line-clamp-2 max-w-2xl">
                    {proj.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono text-[#F2EFE9]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 font-mono text-xs self-end md:self-center flex-shrink-0">
                <a
                  href={`/work/${proj.slug}`}
                  target="_blank"
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-[#F2EFE9] transition-colors"
                  title="Lihat halaman detail live"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openEditModal(proj)}
                  className="px-3 py-2 border border-accent/40 bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sunting</span>
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="p-2 border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  title="Hapus proyek"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL DRAWER */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="border border-white/20 bg-[#141414] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
              <div className="font-mono text-xs">
                <span className="text-accent font-bold uppercase tracking-widest block">
                  {isNew ? "[ FORM TAMBAH PROYEK ]" : "[ FORM SUNTING PROYEK ]"}
                </span>
                <span className="text-[#F2EFE9] font-bold text-lg font-sans">
                  {isNew ? "Buat Proyek Portofolio Baru" : `Edit: ${formData.title}`}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#9E9B94] hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Judul Proyek: *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleSlugAuto(e.target.value)}
                    required
                    placeholder="Contoh: Transisi Article Dashboard"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    URL Slug: * (Unik)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="transisi-article-dashboard"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Index & Period */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Nomor Index / Urutan:
                  </label>
                  <input
                    type="text"
                    value={formData.index}
                    onChange={(e) => setFormData({ ...formData, index: e.target.value })}
                    placeholder="01 // 04"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Periode Pengerjaan:
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Client & Role */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Klien / Instansi / Tipe:
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="PT Transisi Media Visual"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Peran / Role Anda:
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Fullstack Developer"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Tagline / Subjudul Pendek:
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Platform redaksi konten cepat dengan optimasi database relasional"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              {/* Image URL & Preview */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  URL Gambar Thumbnail / Screenshot Proyek:
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... atau /projects/image.png"
                    className="flex-1 bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                  {formData.image && (
                    <div className="w-16 h-10 border border-white/20 overflow-hidden bg-black flex-shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack (Comma-separated) */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Tech Stack (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="Laravel 11, React JS, Next.js, PostgreSQL, Tailwind CSS"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Live Demo URL (Opsional):
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl || ""}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://transisi.id"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    GitHub URL (Opsional):
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ""}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Ringkasan / Summary: *
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  required
                  placeholder="Deskripsi singkat tentang proyek ini..."
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Tantangan Teknis (The Challenge):
                  </label>
                  <textarea
                    rows={4}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    placeholder="Tantangan arsitektur atau performa..."
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Solusi Rekayasa (The Solution):
                  </label>
                  <textarea
                    rows={4}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Solusi teknis yang diterapkan..."
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Deliverables (Newline-separated) */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Poin Deliverables (1 poin per baris):
                </label>
                <textarea
                  rows={3}
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Arsitektur database relasional&#10;Implementasi sistem kasir offline-first&#10;Audit Lighthouse 99/100"
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                />
              </div>

              {/* Key Metrics Editor */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase text-[#9E9B94] font-bold">
                    Key Performance Metrics / Angka Kunci:
                  </span>
                  <button
                    type="button"
                    onClick={addMetric}
                    className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Metrik</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.metrics.map((met, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={met.label}
                        onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                        placeholder="Label (contoh: Lighthouse Score)"
                        className="flex-1 bg-[#0A0A0A] border border-white/20 px-3 py-1.5 text-xs text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={met.value}
                        onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                        placeholder="Nilai (contoh: 99/100)"
                        className="w-36 bg-[#0A0A0A] border border-white/20 px-3 py-1.5 text-xs text-accent font-bold font-mono focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="text-red-400 hover:text-red-300 p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
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
                  <span>{saving ? "Menyimpan..." : "Simpan Proyek"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
