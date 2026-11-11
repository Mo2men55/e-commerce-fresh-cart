"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "@/components/ui/toast";
import type { Review, ReviewInput, ReviewsResponse } from "@/app/types/review";

/* ------------------------------------------------------------------ */
/* API helpers (talk to our own Next route handlers)                   */
/* ------------------------------------------------------------------ */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = await res.json().catch(() => null);
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(payload?.message ?? "Something went wrong");
  return payload as T;
}

const fetchReviews = (productId: string) =>
  request<ReviewsResponse>(`/api/products/${productId}/reviews`);

const createReview = (productId: string, input: ReviewInput) =>
  request(`/api/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });

const updateReview = (reviewId: string, input: ReviewInput) =>
  request(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

const deleteReview = (reviewId: string) =>
  request(`/api/reviews/${reviewId}`, { method: "DELETE" });

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX_LENGTH = 500;

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="flex items-center" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${size} ${star <= Math.round(value) ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Your rating"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
            className="rounded transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <StarIcon
              className={`size-8 ${star <= shown ? "text-amber-400" : "text-slate-200"}`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-slate-600">
        {RATING_LABELS[shown] ?? ""}
      </span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
      {initials || "?"}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Review form (create + edit)                                         */
/* ------------------------------------------------------------------ */

function ReviewForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial?: ReviewInput;
  submitLabel: string;
  pending: boolean;
  onSubmit: (input: ReviewInput) => void;
  onCancel?: () => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [text, setText] = useState(initial?.review ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    if (text.trim().length < 3) return setError("Please write at least a few words.");
    setError("");
    onSubmit({ rating, review: text.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarPicker value={rating} onChange={setRating} />
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          rows={4}
          placeholder="What did you like or dislike? How did you use this product?"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-red-600">{error}</span>
          <span className="text-slate-400">
            {text.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

type SortKey = "newest" | "highest" | "lowest";
const PAGE_SIZE = 5;

export default function ProductReviews({ productId }: { productId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [sort, setSort] = useState<SortKey>("newest");
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [editingId, setEditingId] = useState<string | null>(null);

  const queryKey = ["reviews", productId];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchReviews(productId),
  });
  const reviews = useMemo(() => data?.data ?? [], [data]);

  // Stats are computed from the live list so they update right after a change.
  const stats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews) {
      counts[r.rating] = (counts[r.rating] ?? 0) + 1;
      sum += r.rating;
    }
    return {
      counts,
      total: reviews.length,
      average: reviews.length ? sum / reviews.length : 0,
    };
  }, [reviews]);

  const myReview = userId ? reviews.find((r) => r.user?._id === userId) : undefined;

  const shown = useMemo(() => {
    const list = filterStar ? reviews.filter((r) => r.rating === filterStar) : [...reviews];
    list.sort((a, b) =>
      sort === "highest"
        ? b.rating - a.rating
        : sort === "lowest"
          ? a.rating - b.rating
          : +new Date(b.createdAt) - +new Date(a.createdAt),
    );
    return list;
  }, [reviews, sort, filterStar]);

  function onMutationError(error: Error) {
    if (error.message === "UNAUTHORIZED") {
      toast.add({ type: "error", title: "Please log in", description: "You need to be logged in to review products." });
      router.push("/LogIn");
      return;
    }
    toast.add({ type: "error", title: "Something went wrong", description: error.message });
  }

  function onMutationSuccess(message: string) {
    toast.add({ type: "success", title: "Done", description: message });
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey });
    router.refresh(); // refresh the product's average rating in the header
  }

  const createMutation = useMutation({
    mutationFn: (input: ReviewInput) => createReview(productId, input),
    onSuccess: () => onMutationSuccess("Thanks! Your review has been posted."),
    onError: onMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReviewInput }) => updateReview(id, input),
    onSuccess: () => onMutationSuccess("Your review has been updated."),
    onError: onMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => onMutationSuccess("Your review has been deleted."),
    onError: onMutationError,
  });

  function handleDelete(review: Review) {
    if (window.confirm("Delete your review? This can't be undone.")) {
      deleteMutation.mutate(review._id);
    }
  }

  return (
    <section
      id="reviews"
      className="mx-auto mt-8 max-w-7xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="flex items-center gap-2">
        <ChatBubbleLeftRightIcon className="size-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* ---------- Summary + write ---------- */}
        <aside className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-5">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-900">
                {stats.average ? stats.average.toFixed(1) : "–"}
              </span>
              <div className="pb-1">
                <Stars value={stats.average} size="size-5" />
                <p className="mt-1 text-sm text-slate-500">
                  Based on {stats.total} review{stats.total === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star];
                const pct = stats.total ? (count / stats.total) * 100 : 0;
                const active = filterStar === star;
                return (
                  <li key={star}>
                    <button
                      type="button"
                      disabled={!count}
                      onClick={() => {
                        setFilterStar(active ? null : star);
                        setVisible(PAGE_SIZE);
                      }}
                      className={`flex w-full items-center gap-3 rounded px-1 py-0.5 text-sm disabled:cursor-default ${active ? "bg-emerald-50" : "hover:bg-white"}`}
                    >
                      <span className="flex w-8 items-center gap-0.5 text-slate-600">
                        {star}
                        <StarIcon className="size-3.5 text-amber-400" />
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <span
                          className="block h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-8 text-right text-slate-500">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            {status === "loading" ? (
              <div className="h-24 animate-pulse rounded bg-slate-100" />
            ) : !userId ? (
              <div className="text-center">
                <h3 className="font-semibold text-slate-900">Share your thoughts</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Log in to rate and review this product.
                </p>
                <Link
                  href="/LogIn"
                  className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Log in to review
                </Link>
              </div>
            ) : myReview ? (
              <div>
                <h3 className="font-semibold text-slate-900">You reviewed this product</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Stars value={myReview.rating} />
                  <span className="text-xs text-slate-500">{formatDate(myReview.updatedAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(myReview._id);
                    document.getElementById(`review-${myReview._id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
                >
                  <PencilSquareIcon className="size-4" /> Edit your review
                </button>
              </div>
            ) : (
              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Write a review</h3>
                <ReviewForm
                  key="create"
                  submitLabel="Submit review"
                  pending={createMutation.isPending}
                  onSubmit={(input) => createMutation.mutate(input)}
                />
              </div>
            )}
          </div>
        </aside>

        {/* ---------- Review list ---------- */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <p className="text-sm text-slate-600">
              {filterStar ? (
                <>
                  Showing {shown.length} {filterStar}-star review{shown.length === 1 ? "" : "s"}{" "}
                  <button type="button" onClick={() => setFilterStar(null)} className="ml-1 font-medium text-emerald-700 hover:underline">
                    Clear filter
                  </button>
                </>
              ) : (
                <>{stats.total} review{stats.total === 1 ? "" : "s"}</>
              )}
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-emerald-600"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <ul className="divide-y divide-slate-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex animate-pulse gap-4 py-5">
                  <span className="size-11 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-slate-100" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                  </div>
                </li>
              ))}
            </ul>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-600">
              Couldn&apos;t load reviews. Please refresh the page.
            </p>
          ) : shown.length === 0 ? (
            <div className="py-14 text-center">
              <ChatBubbleLeftRightIcon className="mx-auto size-12 text-slate-200" />
              <p className="mt-3 font-medium text-slate-700">No reviews yet</p>
              <p className="text-sm text-slate-500">Be the first to share what you think.</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-slate-100">
                {shown.slice(0, visible).map((review) => {
                  const isMine = review.user?._id === userId;
                  const isEditing = editingId === review._id;
                  const edited = review.updatedAt !== review.createdAt;

                  return (
                    <li key={review._id} id={`review-${review._id}`} className="flex gap-4 py-5">
                      <Avatar name={review.user?.name ?? "User"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-slate-900">
                            {review.user?.name ?? "Anonymous"}
                          </span>
                          {isMine && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              You
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {formatDate(review.createdAt)}
                            {edited && " · edited"}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="mt-3">
                            <ReviewForm
                              key={review._id}
                              initial={{ rating: review.rating, review: review.review }}
                              submitLabel="Save changes"
                              pending={updateMutation.isPending}
                              onSubmit={(input) => updateMutation.mutate({ id: review._id, input })}
                              onCancel={() => setEditingId(null)}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="mt-1">
                              <Stars value={review.rating} />
                            </div>
                            <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-700" dir="auto">
                              {review.review}
                            </p>
                            {isMine && (
                              <div className="mt-3 flex gap-4 text-sm">
                                <button
                                  type="button"
                                  onClick={() => setEditingId(review._id)}
                                  className="flex items-center gap-1 text-slate-600 hover:text-emerald-700"
                                >
                                  <PencilSquareIcon className="size-4" /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(review)}
                                  disabled={deleteMutation.isPending}
                                  className="flex items-center gap-1 text-slate-600 hover:text-red-600 disabled:opacity-60"
                                >
                                  <TrashIcon className="size-4" /> Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {visible < shown.length && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
                  >
                    Show more reviews ({shown.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
