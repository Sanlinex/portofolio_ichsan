import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { AchievementItem } from "@/data/profile";

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
    const updated = (await req.json()) as Partial<AchievementItem>;
    const data = await getProfileData();

    const index = data.achievements.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Sertifikat tidak ditemukan." }, { status: 404 });
    }

    data.achievements[index] = {
      ...data.achievements[index],
      ...updated,
    };

    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Sertifikat berhasil diperbarui!",
      achievement: data.achievements[index],
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui sertifikat." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getProfileData();
    const index = data.achievements.findIndex((a) => a.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Sertifikat tidak ditemukan." }, { status: 404 });
    }

    const removed = data.achievements.splice(index, 1);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Sertifikat berhasil dihapus!",
      achievement: removed[0],
    });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus sertifikat." }, { status: 500 });
  }
}
