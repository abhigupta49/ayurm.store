"use client";

import { useState } from "react";

export default function ReviewForm({ slug }: { slug: string }) {
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
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setName("");
        setComment("");
        setRating(5);
      }
    } catch {
      setError("Could not submit review. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="font-semibold text-green-700">Thank you for your review! 🙏</p>
        <p className="mt-1 text-sm text-green-600">Your review has been submitted successfully.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm text-forest-600 underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cream-200 bg-white p-5">
      <p className="font-semibold text-forest-800">Write a Review</p>

      {/* Star picker */}
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary px-6 py-2 text-sm disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
