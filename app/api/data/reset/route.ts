import { NextResponse } from "next/server";
import { resetProfileData } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth";

export async function POST() {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await resetProfileData();
    if (!success) {
      return NextResponse.json({ error: "Gagal mereset data" }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Data berhasil direset ke default bawaan." });
  } catch {
    return NextResponse.json({ error: "Gagal memproses reset" }, { status: 500 });
  }
}
