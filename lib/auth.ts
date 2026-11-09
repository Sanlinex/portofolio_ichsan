import { cookies } from "next/headers";
import crypto from "crypto";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "rafli2026";
const SECRET_KEY =
  process.env.ADMIN_SECRET ||
  crypto.createHash("sha256").update(DEFAULT_PASSWORD + "mri-editorial-salt").digest("hex");

export const COOKIE_NAME = "rafli_admin_session";

/**
 * Validates the admin password.
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password === DEFAULT_PASSWORD;
}

/**
 * Creates a signed HMAC session token.
 */
export function createSessionToken(): string {
  const payload = {
    role: "admin",
    createdAt: Date.now(),
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  return `${data}.${signature}`;
}

/**
 * Verifies the validity and signature of a session token.
 */
export function verifySessionToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  try {
    const [data, signature] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
    if (signature !== expectedSig) return false;

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    // 30 days session validity
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.createdAt > maxAge) {
      return false;
    }
    return decoded.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Checks if the current request has a valid admin session cookie.
 */
export function checkAdminAuth(): boolean {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie?.value) return false;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return false;
  }
}
