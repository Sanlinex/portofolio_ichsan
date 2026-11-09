import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { PROFILE_DATA, type ProfileData } from "@/data/profile";

// In-memory cache for ultra-fast response
let cachedData: ProfileData | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 3000; // 3 seconds in-memory TTL

// Target file path for local dynamic storage
const LOCAL_STORAGE_PATH = path.join(process.cwd(), "data", "profile-dynamic.json");
const TMP_STORAGE_PATH = path.join("/tmp", "profile-dynamic.json");

/**
 * Determine the writable file path (local data folder, or /tmp in serverless)
 */
function getStorageFilePath(): string {
  // If we can write to process.cwd()/data, prefer it
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(dataDir, ".write-test");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return LOCAL_STORAGE_PATH;
  } catch {
    return TMP_STORAGE_PATH;
  }
}

/**
 * Checks if Supabase credentials are configured
 */
function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );
}

/**
 * Fetch data from Supabase REST API
 */
async function fetchFromSupabase(): Promise<ProfileData | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/rest/v1/portfolio_data?id=eq.main&select=data`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const json = await response.json();
    if (Array.isArray(json) && json.length > 0 && json[0]?.data) {
      return json[0].data as ProfileData;
    }
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
  }
  return null;
}

/**
 * Save data to Supabase REST API
 */
async function saveToSupabase(data: ProfileData): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return false;

  try {
    const response = await fetch(`${url}/rest/v1/portfolio_data`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: "main",
        data,
        updated_at: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (err) {
    console.error("Error saving to Supabase:", err);
    return false;
  }
}

/**
 * Reads profile data from persistent storage (Supabase, local JSON, or default PROFILE_DATA)
 */
export async function getProfileData(): Promise<ProfileData> {
  const now = Date.now();
  if (cachedData && now - lastCacheTime < CACHE_TTL) {
    return cachedData;
  }

  // 1. Try Supabase if configured
  if (hasSupabaseConfig()) {
    const remoteData = await fetchFromSupabase();
    if (remoteData) {
      cachedData = remoteData;
      lastCacheTime = now;
      return remoteData;
    }
  }

  // 2. Try Local File Storage
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as ProfileData;
      cachedData = parsed;
      lastCacheTime = now;
      return parsed;
    }

    // Also check the local fallback path if currently using tmp
    if (filePath !== LOCAL_STORAGE_PATH && fs.existsSync(LOCAL_STORAGE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORAGE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as ProfileData;
      cachedData = parsed;
      lastCacheTime = now;
      return parsed;
    }
  } catch (err) {
    console.warn("Could not read local dynamic storage file, falling back to seed:", err);
  }

  // 3. Fallback to hardcoded PROFILE_DATA seed
  cachedData = PROFILE_DATA;
  lastCacheTime = now;
  return PROFILE_DATA;
}

/**
 * Saves profile data to persistent storage and triggers Next.js revalidation
 */
export async function saveProfileData(data: ProfileData): Promise<boolean> {
  cachedData = data;
  lastCacheTime = Date.now();

  let savedCloud = false;
  if (hasSupabaseConfig()) {
    savedCloud = await saveToSupabase(data);
  }

  let savedLocal = false;
  try {
    const filePath = getStorageFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    savedLocal = true;
  } catch (err) {
    console.error("Failed to write to local storage:", err);
  }

  // Revalidate public routes so users immediately see updates
  try {
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/certificate");
    revalidatePath("/poster");
  } catch {
    // Revalidation might fail if not called within a Server Action or Route Handler
  }

  return savedCloud || savedLocal;
}

/**
 * Resets profile data back to the default PROFILE_DATA
 */
export async function resetProfileData(): Promise<boolean> {
  return await saveProfileData(PROFILE_DATA);
}
