// Copies seed files from data-seed/ → data/ on first run (e.g. after Render disk mount).
// Called at the top of each lib read function via ensureSeeded().
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "data-seed");
const SEED_FILES = ["products.json", "reviews.json", "reels.json", "pages.json"];

let seeded = false;

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  seeded = true;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await Promise.all(
    SEED_FILES.map(async (file) => {
      const dest = path.join(DATA_DIR, file);
      try {
        await fs.access(dest);
      } catch {
        try {
          await fs.copyFile(path.join(SEED_DIR, file), dest);
        } catch {
          // seed file missing — skip
        }
      }
    })
  );
}
