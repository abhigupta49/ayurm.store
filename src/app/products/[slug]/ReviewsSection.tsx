"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="rounded-xl border border-cream-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-forest-800">{r.name}</p>
        <p className="text-xs text-ink/40">
          {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <p className="mt-0.5 text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
      <p className="mt-2 text-sm text-ink/70">{r.comment}</p>
    </div>
  );
}

export default function ReviewsSection({ slug, initialReviews }: { slug: string; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    // Optimistic review — add immediately before API responds
    const optimistic: Review = {
      id: `temp-${Date.now()}`,
      slug,
      name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Rollback optimistic review on failure
        setReviews((prev) => prev.filter((r) => r.id !== optimistic.id));
        setError(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        // Replace optimistic entry with real one from server
        setReviews((prev) => prev.map((r) => r.id === optimistic.id ? data.review : r));
        setStatus("success");
        setName("");
        setComment("");
        setRating(5);
      }
    } catch {
      setReviews((prev) => prev.filter((r) => r.id !== optimistic.id));
      setError("Could not submit review. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="border-t border-cream-200 py-6">
      <h2 className="text-xl text-forest-800">
        Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {/* Reviews list */}
      <div className="mt-4 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((r) => <ReviewCard key={r.id} r={r} />)
        ) : (
          <p className="text-sm text-ink/50">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {/* Review form */}
      <div className="mt-6">
        {status === "success" ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <p className="font-semibold text-green-700">Thank you for your review! 🙏</p>
            <p className="mt-1 text-sm text-green-600">Your review has been submitted successfully.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-3 text-sm text-forest-600 underline">
              Write another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cream-200 bg-white p-5">
            <p className="font-semibold text-forest-800">Write a Review</p>

            <div>
              <label className="text-xs font-medium text-ink/60">Your Rating *</label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl leading-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <span className={(hover || rating) >= star ? "text-amber-400" : "text-ink/20"}>★</span>
                  </button>
                ))}
                <span className="ml-2 self-center text-sm text-ink/50">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink/60">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Priya S."
                className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink/60">Your Review *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                placeholder="Share your experience with this product..."
                className="mt-1 w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={status === "loading"} className="btn-primary px-6 py-2 text-sm disabled:opacity-60">
              {status === "loading" ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
