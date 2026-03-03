"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Review = {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  users: { name?: string } | null;
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={20}
            className={
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({
  courseId,
  initialReviews,
  canReview,
  myReviewId,
  userId,
  openFormOnLoad = false,
}: {
  courseId: string;
  initialReviews: Review[];
  canReview: boolean;
  myReviewId: string | null;
  userId: string | null;
  openFormOnLoad?: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (openFormOnLoad && canReview && !myReviewId) {
      setShowForm(true);
    }
  }, [openFormOnLoad, canReview, myReviewId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, content }),
      });

      if (res.ok) {
        const updated = await fetch(`/api/reviews?courseId=${courseId}`).then((r) => r.json());
        setReviews(updated);
        setContent("");
        setRating(5);
        setShowForm(false);
      } else {
        const data = await res.json();
        setError(data.error ?? "오류가 발생했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("후기를 삭제하시겠습니까?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="mt-10" id="reviews">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black">수강 후기</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(avgRating)} />
              <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviews.length}개 후기)</span>
            </div>
          )}
        </div>

        {canReview && !myReviewId && (
          <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
            후기 작성
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">평점</p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <Textarea
                placeholder="강의에 대한 솔직한 후기를 작성해주세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} size="sm">
                  {loading && <Loader2 size={13} className="animate-spin" />}
                  등록
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          아직 후기가 없습니다. 첫 번째 후기를 작성해보세요!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating value={review.rating} />
                    <span className="text-sm font-semibold">{review.users?.name ?? "익명"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{review.content}</p>
                </div>

                {userId && review.id === myReviewId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
