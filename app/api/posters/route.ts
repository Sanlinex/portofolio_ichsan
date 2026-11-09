import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { PosterItem } from "@/data/profile";

export async function POST(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newPoster = (await req.json()) as PosterItem;
    if (!newPoster.title) {
      return NextResponse.json({ error: "Judul poster wajib diisi." }, { status: 400 });
    }

    const data = await getProfileData();

    if (!newPoster.id) {
      newPoster.id = `poster-${Date.now()}`;
    }

    if (!newPoster.index) {
      const nextNum = (data.posters.length + 1).toString().padStart(2, "0");
      newPoster.index = `${nextNum} // ${(data.posters.length + 1).toString().padStart(2, "0")}`;
    }

    data.posters.unshift(newPoster);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Karya poster berhasil ditambahkan!",
      poster: newPoster,
    });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan poster." }, { status: 500 });
  }
}
