import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { ExperienceItem } from "@/data/profile";

export async function POST(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newExp = (await req.json()) as ExperienceItem;
    if (!newExp.company || !newExp.role) {
      return NextResponse.json({ error: "Perusahaan dan Posisi wajib diisi." }, { status: 400 });
    }

    const data = await getProfileData();

    if (!newExp.id) {
      newExp.id = `exp-${Date.now()}`;
    }

    if (!newExp.index) {
      const nextNum = (data.experiences.length + 1).toString().padStart(2, "0");
      newExp.index = `${nextNum} // ${(data.experiences.length + 1).toString().padStart(2, "0")}`;
    }

    data.experiences.unshift(newExp);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Pengalaman berhasil ditambahkan!",
      experience: newExp,
    });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan pengalaman." }, { status: 500 });
  }
}
