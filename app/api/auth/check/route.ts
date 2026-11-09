import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  const authenticated = checkAdminAuth();
  return NextResponse.json({ authenticated });
}
