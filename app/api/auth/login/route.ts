import { NextResponse } from "next/server";
import { verifyAdminPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Password atau PIN tidak valid. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Autentikasi berhasil. Selamat datang di Studio Matrix Admin.",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memproses login." },
      { status: 500 }
    );
  }
}
