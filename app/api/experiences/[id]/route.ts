import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { ExperienceItem } from "@/data/profile";

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
    const updated = (await req.json()) as Partial<ExperienceItem>;
    const data = await getProfileData();

    const index = data.experiences.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Pengalaman tidak ditemukan." }, { status: 404 });
    }

    data.experiences[index] = {
      ...data.experiences[index],
      ...updated,
    };

    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Pengalaman berhasil diperbarui!",
      experience: data.experiences[index],
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui pengalaman." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getProfileData();
    const index = data.experiences.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Pengalaman tidak ditemukan." }, { status: 404 });
    }

    const removed = data.experiences.splice(index, 1);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Pengalaman berhasil dihapus!",
      experience: removed[0],
    });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus pengalaman." }, { status: 500 });
  }
}
