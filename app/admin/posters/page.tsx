"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Palette,
  Image as ImageIcon,
} from "lucide-react";
import type { PosterItem, PosterSubItem } from "@/data/profile";
import ImageFieldWithEditor from "@/components/admin/ImageFieldWithEditor";

const EMPTY_POSTER: PosterItem = {
  id: "",
  index: "",
  title: "",
  subtitle: "Swiss Editorial Poster Exploration",
  year: "2024",
  category: "Swiss International Style",
  aspectRatio: "portrait",
  description: "Eksplorasi tata letak asimetris dan ritme tipografi berskala ekstrem.",
  palette: ["#0E0E0E", "#F2EFE9", "#FF4D1C"],
  image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
  tools: ["Adobe Illustrator", "Photoshop"],
  gallery: [],
};

export default function AdminPostersPage() {
  const searchParams = useSearchParams();
  const [posters, setPosters] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<PosterItem>(EMPTY_POSTER);
  const [toolsInput, setToolsInput] = useState("");
  const [paletteInput, setPaletteInput] = useState("");

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPosters(data.posters || []);
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memuat poster." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    const editId = searchParams.get("edit");

    if (action === "create") {
      openCreateModal();
    } else if (editId && posters.length > 0) {
      const target = posters.find((p) => p.id === editId);
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, posters]);

  const openCreateModal = () => {
    setIsNew(true);
    const newId = `poster-${Date.now()}`;
    const nextNum = (posters.length + 1).toString().padStart(2, "0");
    const initData: PosterItem = {
      ...EMPTY_POSTER,
      id: newId,
      index: `${nextNum} // ${nextNum}`,
      gallery: [
        {
          id: `sub-1`,
          index: "01",
          title: "Karya Desain 01",
          subtitle: "Studi Tipografi",
          image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
          dimensions: "70 × 100 cm",
          concept: "Grid asimetris",
          notes: "Cetakan uji coba",
        },
      ],
    };
    setFormData(initData);
    setToolsInput(initData.tools.join(", "));
    setPaletteInput(initData.palette.join(", "));
    setModalOpen(true);
  };

  const openEditModal = (poster: PosterItem) => {
    setIsNew(false);
    setFormData({ ...poster });
    setToolsInput(poster.tools.join(", "));
    setPaletteInput(poster.palette.join(", "));
    setModalOpen(true);
  };

  const handleSubItemChange = (
    index: number,
    field: keyof PosterSubItem,
    value: string
  ) => {
    const updated = [...formData.gallery];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, gallery: updated }));
  };

  const addSubItem = () => {
    const nextIdx = (formData.gallery.length + 1).toString().padStart(2, "0");
    const newSub: PosterSubItem = {
      id: `sub-${Date.now()}`,
      index: nextIdx,
      title: `Varian Poster ${nextIdx}`,
      subtitle: "Eksplorasi Tambahan",
      image: formData.coverImage,
      dimensions: "70 × 100 cm",
      concept: "Konsep tata letak editorial",
      notes: "Koleksi studio",
    };
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newSub] }));
  };

  const removeSubItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const toolsArray = toolsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const paletteArray = paletteInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const payload: PosterItem = {
      ...formData,
      image: formData.coverImage,
      tools: toolsArray,
      palette: paletteArray,
    };

    try {
      const endpoint = isNew ? "/api/posters" : `/api/posters/${formData.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({
          type: "success",
          text: resData.message || "Seri poster berhasil disimpan!",
        });
        setModalOpen(false);
        fetchPosters();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menyimpan poster." });
      }
    } catch {
      setFeedback({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus seri poster "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/posters/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setFeedback({ type: "success", text: `Seri poster "${title}" berhasil dihapus.` });
        fetchPosters();
      } else {
        setFeedback({ type: "error", text: resData.error || "Gagal menghapus poster." });
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
            <span>[ CRUD MODULE // POSTERS & VISUAL DIRECTION ]</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#F2EFE9] mt-1">
            Poster Studio & Visual Design
          </h1>
          <p className="text-xs font-mono text-[#9E9B94] mt-1">
            Kelola seri poster tipografi Swiss International Style, palet warna, dan galeri desain.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH SERI POSTER BARU</span>
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

      {/* Posters Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-[#9E9B94]">
          Memuat poster studio...
        </div>
      ) : posters.length === 0 ? (
        <div className="border border-dashed border-white/20 p-12 text-center space-y-4">
          <p className="font-mono text-xs text-[#9E9B94]">Belum ada seri poster.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-accent text-white font-mono text-xs uppercase"
          >
            + Buat Seri Poster Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posters.map((poster) => (
            <div
              key={poster.id}
              className="border border-white/10 bg-[#121212] p-6 flex flex-col justify-between space-y-5 hover:border-white/25 transition-colors"
            >
              <div className="flex gap-5">
                {/* Poster Cover Thumbnail */}
                <div className="w-28 aspect-[3/4] bg-[#0A0A0A] border border-white/10 overflow-hidden flex-shrink-0 relative">
                  <img
                    src={poster.coverImage}
                    alt={poster.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-black/85 px-1 font-mono text-[9px] text-accent">
                    {poster.index}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start font-mono text-xs">
                    <span className="text-accent font-semibold">{poster.category}</span>
                    <span className="text-[#9E9B94]">{poster.year}</span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#F2EFE9] leading-snug">
                    {poster.title}
                  </h3>

                  <p className="font-mono text-xs text-[#9E9B94]">{poster.subtitle}</p>

                  {/* Palette Preview */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {poster.palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    <span className="font-mono text-[10px] text-[#9E9B94] ml-2">
                      {poster.gallery.length} Desain
                    </span>
                  </div>
                </div>
              </div>

              {/* Tools & Actions */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {poster.tools.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] text-[#9E9B94]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/poster/${poster.id}`}
                    target="_blank"
                    className="p-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-[#F2EFE9]"
                    title="Buka halaman studio live"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => openEditModal(poster)}
                    className="px-2.5 py-1.5 border border-accent/40 bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(poster.id, poster.title)}
                    className="p-1.5 border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="border border-white/20 bg-[#141414] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
              <div className="font-mono text-xs">
                <span className="text-accent font-bold uppercase tracking-widest block">
                  {isNew ? "[ TAMBAH SERI POSTER ]" : "[ SUNTING SERI POSTER ]"}
                </span>
                <span className="text-[#F2EFE9] font-bold text-lg font-sans">
                  {isNew ? "Seri Poster Studio Baru" : `Edit: ${formData.title}`}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Judul Seri Poster: *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Contoh: Brutalist Typography Archive"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Subjudul / Deskripsi Tema:
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Swiss Typography & Asymmetrical Grid"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Kategori Desain:
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Swiss International Style"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Tahun / Periode:
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Cover Image Uploader & Photo Editor */}
              <ImageFieldWithEditor
                label="Gambar Sampul Utama (Cover Image): *"
                value={formData.coverImage}
                onChange={(newUrl) =>
                  setFormData({ ...formData, coverImage: newUrl, image: newUrl })
                }
                aspectPreset="3:4"
                helperText="Rasio 3:4 portrait sangat ideal untuk poster tipografi Swiss International Style."
              />

              {/* Palette Hexes & Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Palet Warna Hex (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    value={paletteInput}
                    onChange={(e) => setPaletteInput(e.target.value)}
                    placeholder="#0E0E0E, #F2EFE9, #FF4D1C"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase text-[#9E9B94]">
                    Software / Tools (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="Adobe Illustrator, Photoshop, Figma"
                    className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase text-[#9E9B94]">
                  Deskripsi Konsep Desain:
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan latar belakang eksplorasi visual, tipografi, dan pendekatan artistiknya..."
                  className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2.5 text-sm text-[#F2EFE9] focus:outline-none focus:border-accent"
                />
              </div>

              {/* Sub-Gallery Items Editor */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase text-[#9E9B94] font-bold">
                    Koleksi Desain dalam Seri Ini ({formData.gallery.length} Desain):
                  </span>
                  <button
                    type="button"
                    onClick={addSubItem}
                    className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Desain Varian</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.gallery.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="border border-white/10 bg-[#0E0E0E] p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-accent font-semibold">
                          #{idx + 1} Varian Poster ({sub.index})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSubItem(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕ Hapus
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => handleSubItemChange(idx, "title", e.target.value)}
                          placeholder="Judul varian"
                          className="bg-[#141414] border border-white/15 px-3 py-1.5 text-xs text-[#F2EFE9]"
                        />
                        <input
                          type="text"
                          value={sub.dimensions}
                          onChange={(e) =>
                            handleSubItemChange(idx, "dimensions", e.target.value)
                          }
                          placeholder="Dimensi (70 × 100 cm)"
                          className="bg-[#141414] border border-white/15 px-3 py-1.5 text-xs text-[#F2EFE9] font-mono"
                        />
                      </div>

                      <ImageFieldWithEditor
                        label="Foto / Artwork Varian Poster:"
                        value={sub.image}
                        onChange={(newUrl) => handleSubItemChange(idx, "image", newUrl)}
                        aspectPreset="3:4"
                      />
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
                  <span>{saving ? "Menyimpan..." : "Simpan Seri Poster"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
