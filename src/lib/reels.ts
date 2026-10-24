import { promises as fs } from "fs";
import path from "path";
import { ensureSeeded } from "./seed";

export type Reel = {
  id: string;
  url: string;       // original URL pasted by admin
  embedUrl: string;  // iframe-ready embed URL
  platform: "instagram" | "youtube" | "facebook" | "unknown";
  caption?: string;
};

const REELS_FILE = path.join(process.cwd(), "data", "reels.json");

async function readReels(): Promise<Reel[]> {
  await ensureSeeded();
  try {
    const raw = await fs.readFile(REELS_FILE, "utf8");
    return JSON.parse(raw) as Reel[];
  } catch {
    return [];
  }
}

async function writeReels(reels: Reel[]): Promise<void> {
  await fs.writeFile(REELS_FILE, JSON.stringify(reels, null, 2), "utf8");
}

export function parseReelUrl(url: string): { embedUrl: string; platform: Reel["platform"] } {
  // Instagram reel: https://www.instagram.com/reel/CODE/
  const igMatch = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  if (igMatch) {
    return {
      platform: "instagram",
      embedUrl: `https://www.instagram.com/reel/${igMatch[1]}/embed/`,
    };
  }

  // YouTube Shorts: https://youtube.com/shorts/CODE or https://youtu.be/CODE
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
  if (ytShortsMatch) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytShortsMatch[1]}`,
    };
  }
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]+)/);
  if (ytMatch) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // Facebook reel: https://www.facebook.com/reel/CODE
  const fbMatch = url.match(/facebook\.com\/(?:reel|watch)\/?\??v?=?([0-9]+)/);
  if (fbMatch) {
    return {
      platform: "facebook",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    };
  }

  return { platform: "unknown", embedUrl: url };
}

export async function getAllReels(): Promise<Reel[]> {
  return readReels();
}

export async function addReel(url: string, caption?: string): Promise<Reel> {
  const reels = await readReels();
  const { embedUrl, platform } = parseReelUrl(url.trim());
  const reel: Reel = {
    id: Date.now().toString(),
    url: url.trim(),
    embedUrl,
    platform,
    caption: caption?.trim() || "",
  };
  reels.push(reel);
  await writeReels(reels);
  return reel;
}

export async function deleteReel(id: string): Promise<void> {
  const reels = await readReels();
  await writeReels(reels.filter((r) => r.id !== id));
}

export async function reorderReels(ids: string[]): Promise<void> {
  const reels = await readReels();
  const map = new Map(reels.map((r) => [r.id, r]));
  const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Reel[];
  await writeReels(reordered);
}
