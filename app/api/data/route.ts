import { NextResponse } from "next/server";
import { getProfileData, saveProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  const data = await getProfileData();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const success = await saveProfileData(payload);
    if (!success) {
      return NextResponse.json({ error: "Gagal menyimpan data ke storage" }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Data berhasil disimpan!" });
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
  }
}
