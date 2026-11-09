"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Check,
  X,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectPreset?: "16:10" | "3:4" | "4:3" | "1:1" | "free";
  helperText?: string;
}

export default function ImageFieldWithEditor({
  label,
  value,
  onChange,
  aspectPreset = "16:10",
  helperText,
}: ImageFieldProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct file upload from computer
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengunggah.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 font-sans">
      <div className="flex justify-between items-center">
        <label className="font-mono text-xs uppercase tracking-wider text-[#9E9B94]">
          {label}
        </label>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[#9E9B94] hover:text-[#F2EFE9] transition-colors underline"
          >
            {showUrlInput ? "Sembunyikan Input URL" : "Ketik URL Manual"}
          </button>
        </div>
      </div>

      {/* Main Image Control Box */}
      <div className="border border-white/15 bg-[#0E0E0E] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Thumbnail Preview */}
        <div className="flex items-center gap-4">
          <div className="w-20 sm:w-24 aspect-[16/10] bg-[#161616] border border-white/20 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-[#9E9B94]/40" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs text-[#F2EFE9] font-medium block line-clamp-1">
              {value ? value.split("/").pop() || "Foto Terpilih" : "Belum ada foto"}
            </span>
            <span className="font-mono text-[10px] text-[#9E9B94] block">
              Format: PNG, JPG, WebP, SVG
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs w-full sm:w-auto">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 sm:flex-initial px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-[#F2EFE9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-accent" />
            <span>{isUploading ? "Mengunggah..." : "Unggah Foto"}</span>
          </button>

          {/* Edit / Crop Button (Active when value exists) */}
          {value && (
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-accent/20 hover:bg-accent hover:text-white border border-accent/40 text-accent flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Edit & Crop Foto</span>
            </button>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Optional URL Input Dropdown */}
      {showUrlInput && (
        <div className="pt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /images/projects/name.jpg"
            className="w-full bg-[#0A0A0A] border border-white/20 px-3.5 py-2 text-xs text-[#F2EFE9] font-mono focus:outline-none focus:border-accent"
          />
        </div>
      )}

      {helperText && (
        <p className="text-[11px] font-mono text-[#9E9B94]/70">{helperText}</p>
      )}

      {/* FULL PHOTO EDITOR MODAL */}
      {editorOpen && (
        <PhotoEditorModal
          imageUrl={value}
          aspectPreset={aspectPreset}
          onClose={() => setEditorOpen(false)}
          onSave={(newUrl) => {
            onChange(newUrl);
            setEditorOpen(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * INTERACTIVE PHOTO EDITOR MODAL
 * With Crop Presets, Canvas Filters, Rotation, Flip, and WebP Export
 */
interface PhotoEditorModalProps {
  imageUrl: string;
  aspectPreset: "16:10" | "3:4" | "4:3" | "1:1" | "free";
  onClose: () => void;
  onSave: (editedUrl: string) => void;
}

function PhotoEditorModal({
  imageUrl,
  aspectPreset,
  onClose,
  onSave,
}: PhotoEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editor states
  const [aspectRatio, setAspectRatio] = useState<string>(aspectPreset);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1); // 0.8 to 2.0
  const [brightness, setBrightness] = useState<number>(100); // 50 to 150
  const [contrast, setContrast] = useState<number>(100); // 50 to 150
  const [grayscale, setGrayscale] = useState<number>(0); // 0 to 100
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [exportDimensions, setExportDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Load image
  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
      alert("Gagal memuat gambar ke editor canvas. Pastikan URL valid.");
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Render to canvas whenever controls change
  const renderCanvas = useCallback(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const naturalW = imageObj.naturalWidth || 800;
    const naturalH = imageObj.naturalHeight || 600;

    // Calculate crop dimensions based on aspect ratio
    let targetW = naturalW;
    let targetH = naturalH;

    if (aspectRatio === "16:10") {
      targetH = Math.min(naturalH, (naturalW * 10) / 16);
      targetW = (targetH * 16) / 10;
    } else if (aspectRatio === "16:9") {
      targetH = Math.min(naturalH, (naturalW * 9) / 16);
      targetW = (targetH * 16) / 9;
    } else if (aspectRatio === "3:4") {
      targetW = Math.min(naturalW, (naturalH * 3) / 4);
      targetH = (targetW * 4) / 3;
    } else if (aspectRatio === "4:3") {
      targetH = Math.min(naturalH, (naturalW * 3) / 4);
      targetW = (targetH * 4) / 3;
    } else if (aspectRatio === "1:1") {
      const minDim = Math.min(naturalW, naturalH);
      targetW = minDim;
      targetH = minDim;
    }

    // Set canvas dimensions
    const isSideways = rotation === 90 || rotation === 270;
    const canvasWidth = Math.round(isSideways ? targetH : targetW);
    const canvasHeight = Math.round(isSideways ? targetW : targetH);

    // Limit maximum export size to 1920px for optimal performance
    const maxSide = 1920;
    const scaleFactor = Math.min(1, maxSide / Math.max(canvasWidth, canvasHeight));
    canvas.width = Math.round(canvasWidth * scaleFactor);
    canvas.height = Math.round(canvasHeight * scaleFactor);

    setExportDimensions({ width: canvas.width, height: canvas.height });

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply color filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturation}%)`;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.scale(zoom, zoom);

    // Draw centered
    const drawW = Math.round(targetW * scaleFactor);
    const drawH = Math.round(targetH * scaleFactor);

    // Source crop centered
    const sx = Math.max(0, (naturalW - targetW) / 2);
    const sy = Math.max(0, (naturalH - targetH) / 2);

    ctx.drawImage(
      imageObj,
      sx,
      sy,
      targetW,
      targetH,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );

    ctx.restore();
  }, [
    imageObj,
    aspectRatio,
    rotation,
    flipH,
    flipV,
    zoom,
    brightness,
    contrast,
    grayscale,
    saturation,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Export edited canvas image and save via /api/upload
  const handleApply = async () => {
    if (!canvasRef.current) return;
    setSaving(true);

    try {
      // Export as high quality webp data url
      const dataUrl = canvasRef.current.toDataURL("image/webp", 0.92);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl,
          filename: `edited-photo`,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        onSave(resData.url);
      } else {
        alert(resData.error || "Gagal menyimpan foto hasil edit.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat menyimpan foto.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetFilters = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setSaturation(100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="border border-white/20 bg-[#141414] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[#F2EFE9] font-bold">STUDIO PHOTO EDITOR & CROPPER</span>
            <span className="text-white/30">•</span>
            <span className="text-accent">
              {exportDimensions.width} × {exportDimensions.height} px
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9E9B94] hover:text-white border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Canvas Preview + Controls Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Canvas Preview Area */}
          <div className="lg:col-span-8 p-6 flex flex-col items-center justify-center bg-[#0A0A0A] border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden min-h-[360px]">
            {loading ? (
              <div className="font-mono text-xs text-[#9E9B94] flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Memuat gambar ke canvas...</span>
              </div>
            ) : (
              <div className="max-w-full max-h-[60vh] flex items-center justify-center p-2 shadow-2xl border border-white/10 bg-[#121212]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[56vh] object-contain block"
                />
              </div>
            )}

            {/* Quick Dimension & Aspect Pill */}
            <div className="absolute bottom-4 left-6 font-mono text-[10px] text-[#9E9B94] bg-black/80 px-2.5 py-1 border border-white/10 backdrop-blur-sm">
              Preset Ratio: <span className="text-accent uppercase font-bold">{aspectRatio}</span>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-4 p-6 space-y-6 bg-[#141414] overflow-y-auto max-h-[70vh]">
            {/* 1. Aspect Ratio Presets */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-[#9E9B94] font-bold block">
                1. Rasio Aspek & Potong (Crop):
              </label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                {[
                  { label: "16:10 (Proyek)", val: "16:10" },
                  { label: "16:9 (Wide)", val: "16:9" },
                  { label: "3:4 (Poster)", val: "3:4" },
                  { label: "4:3 (Sertif)", val: "4:3" },
                  { label: "1:1 (Persegi)", val: "1:1" },
                  { label: "Bebas", val: "free" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAspectRatio(item.val)}
                    className={`py-1.5 px-2 border text-[11px] transition-colors cursor-pointer ${
                      aspectRatio === item.val
                        ? "bg-accent text-white border-accent font-bold"
                        : "bg-white/5 border-white/10 text-[#9E9B94] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Geometric Transformations */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <label className="font-mono text-xs uppercase text-[#9E9B94] font-bold block">
                2. Putar & Balik:
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-[#F2EFE9] flex items-center justify-center gap-1"
                  title="Putar 90° Kanan"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[10px]">+90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 text-[#F2EFE9] flex items-center justify-center gap-1"
                  title="Putar 90° Kiri"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px]">-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`p-2 border flex items-center justify-center gap-1 ${
                    flipH
                      ? "bg-accent/20 border-accent text-accent"
                      : "border-white/15 bg-white/5 text-[#F2EFE9]"
                  }`}
                  title="Balik Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`p-2 border flex items-center justify-center gap-1 ${
                    flipV
                      ? "bg-accent/20 border-accent text-accent"
                      : "border-white/15 bg-white/5 text-[#F2EFE9]"
                  }`}
                  title="Balik Vertikal"
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between font-mono text-[10px] text-[#9E9B94]">
                  <span>Zoom / Skala:</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#FF4D1C] cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Color Filters */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <label className="font-mono text-xs uppercase text-[#9E9B94] font-bold">
                  3. Filter & Pencahayaan:
                </label>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#9E9B94]">
                  <span>Kecerahan (Brightness):</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D1C] cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#9E9B94]">
                  <span>Kontras (Contrast):</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D1C] cursor-pointer"
                />
              </div>

              {/* Grayscale / B&W */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#9E9B94]">
                  <span>Swiss Monochrome (B&W):</span>
                  <span>{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D1C] cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#9E9B94]">
                  <span>Saturasi Warna:</span>
                  <span>{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D1C] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex justify-between items-center bg-[#181818] flex-shrink-0">
          <span className="font-mono text-xs text-[#9E9B94] hidden sm:inline">
            Foto akan diekspor dalam format WebP terkompresi berkualitas tinggi.
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-white/20 text-[#F2EFE9] font-mono text-xs uppercase hover:bg-white/5 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={saving || loading}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? "Menyimpan Foto..." : "Terapkan & Simpan Foto"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
