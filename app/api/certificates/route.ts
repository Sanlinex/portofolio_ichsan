import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { AchievementItem } from "@/data/profile";

export async function POST(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newAch = (await req.json()) as AchievementItem;
    if (!newAch.title || !newAch.rank) {
      return NextResponse.json({ error: "Judul dan Peringkat wajib diisi." }, { status: 400 });
    }

    const data = await getProfileData();

    if (!newAch.id) {
      newAch.id = `ach-${Date.now()}`;
    }

    data.achievements.unshift(newAch);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Sertifikat berhasil ditambahkan!",
      achievement: newAch,
    });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan sertifikat." }, { status: 500 });
  }
}
