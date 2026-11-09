import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { ProjectItem } from "@/data/profile";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: RouteParams) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = (await req.json()) as Partial<ProjectItem>;
    const data = await getProfileData();

    const index = data.projects.findIndex((p) => p.id === params.id || p.slug === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
    }

    data.projects[index] = {
      ...data.projects[index],
      ...updated,
    };

    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Project berhasil diperbarui!",
      project: data.projects[index],
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui project." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getProfileData();
    const index = data.projects.findIndex((p) => p.id === params.id || p.slug === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
    }

    const removed = data.projects.splice(index, 1);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Project berhasil dihapus!",
      project: removed[0],
    });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus project." }, { status: 500 });
  }
}
