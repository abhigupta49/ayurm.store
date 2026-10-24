import { promises as fs } from "fs";
import path from "path";
import { ensureSeeded } from "./seed";

export type Review = {
  id: string;
  slug: string;
  name: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
};

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

async function readReviews(): Promise<Review[]> {
  await ensureSeeded();
  try {
    const raw = await fs.readFile(REVIEWS_FILE, "utf8");
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

export async function getReviewsBySlug(slug: string): Promise<Review[]> {
  const reviews = await readReviews();
  return reviews.filter((r) => r.slug === slug);
}

export async function getAllReviews(): Promise<Review[]> {
  return readReviews();
}

export async function addReview(input: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const reviews = await readReviews();
  const review: Review = {
    ...input,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(review);
  await writeReviews(reviews);
  return review;
}

export async function deleteReview(id: string): Promise<void> {
  const reviews = await readReviews();
  await writeReviews(reviews.filter((r) => r.id !== id));
}
