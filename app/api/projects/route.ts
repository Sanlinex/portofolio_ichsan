import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { ProjectItem } from "@/data/profile";

export async function POST(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newProject = (await req.json()) as ProjectItem;
    if (!newProject.title || !newProject.slug) {
      return NextResponse.json({ error: "Title dan Slug wajib diisi." }, { status: 400 });
    }

    const data = await getProfileData();

    // Auto-generate ID if missing
    if (!newProject.id) {
      newProject.id = `proj-${Date.now()}`;
    }

    // Auto-index
    if (!newProject.index) {
      const nextNum = (data.projects.length + 1).toString().padStart(2, "0");
      newProject.index = `${nextNum} // ${(data.projects.length + 1).toString().padStart(2, "0")}`;
    }

    // Check slug uniqueness
    const existingIndex = data.projects.findIndex((p) => p.slug === newProject.slug);
    if (existingIndex !== -1) {
      return NextResponse.json(
        { error: "Slug sudah digunakan oleh project lain. Harap ganti slug." },
        { status: 400 }
      );
    }

    data.projects.unshift(newProject);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Project berhasil ditambahkan!",
      project: newProject,
    });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan project." }, { status: 500 });
  }
}
