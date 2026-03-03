"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

export default function ReplyForm({ inquiryId }: { inquiryId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setContent("");
        router.refresh();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="답변 내용을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        답변 등록
      </Button>
    </form>
  );
}
