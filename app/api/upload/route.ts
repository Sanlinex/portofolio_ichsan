import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdminAuth } from "@/lib/auth";

export async function POST(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. JSON Base64 Upload (e.g. from Canvas Editor)
    if (contentType.includes("application/json")) {
      const { dataUrl, filename: rawName } = await req.json();
      if (!dataUrl || !dataUrl.startsWith("data:image/")) {
        return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });
      }

      // Extract mime type and base64 buffer
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: "Malformed base64 image data" }, { status: 400 });
      }

      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const safeName = (rawName || `edited-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .slice(0, 30);
      const filename = `${safeName}-${Date.now()}.${ext}`;

      // Try writing to public/uploads
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({
          success: true,
          url: `/uploads/${filename}`,
          filename,
        });
      } catch {
        // Fallback for read-only serverless: return dataUrl directly so it persists
        return NextResponse.json({
          success: true,
          url: dataUrl,
          filename,
        });
      }
    }

    // 2. Multipart Form Upload (Direct file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get extension
    const originalExt = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 30);
    const filename = `${baseName}-${Date.now()}${originalExt}`;

    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
      });
    } catch {
      // In serverless without write access, convert to data URL so it never fails
      const mimeType = file.type || "image/png";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename,
      });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal memproses unggahan foto" }, { status: 500 });
  }
}
