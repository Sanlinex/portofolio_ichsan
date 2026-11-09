import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";
import type { PosterItem } from "@/data/profile";

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
    const updated = (await req.json()) as Partial<PosterItem>;
    const data = await getProfileData();

    const index = data.posters.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Poster tidak ditemukan." }, { status: 404 });
    }

    data.posters[index] = {
      ...data.posters[index],
      ...updated,
    };

    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Poster berhasil diperbarui!",
      poster: data.posters[index],
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui poster." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getProfileData();
    const index = data.posters.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Poster tidak ditemukan." }, { status: 404 });
    }

    const removed = data.posters.splice(index, 1);
    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Poster berhasil dihapus!",
      poster: removed[0],
    });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus poster." }, { status: 500 });
  }
}
