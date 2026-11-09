import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";

export async function PUT(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { personal, education, skills, contact } = await req.json();
    const data = await getProfileData();

    if (personal) {
      data.personal = { ...data.personal, ...personal };
    }
    if (education) {
      data.education = { ...data.education, ...education };
    }
    if (skills) {
      data.skills = { ...data.skills, ...skills };
    }
    if (contact) {
      data.contact = { ...data.contact, ...contact };
    }

    await saveProfileData(data);

    return NextResponse.json({
      success: true,
      message: "Profil, bio, dan keahlian berhasil diperbarui!",
      data,
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui profil." }, { status: 500 });
  }
}
