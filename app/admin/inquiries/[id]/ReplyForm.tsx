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
  const [info, setInfo] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setContent("");
        if (data?.emailSent === false) {
          if (data.reason === "notification_disabled") {
            setInfo("답변은 등록되었고, 사용자가 이메일 알림을 꺼두어 메일은 발송되지 않았습니다.");
          } else if (data.reason === "no_user_email") {
            setInfo("답변은 등록되었지만 사용자 이메일 정보가 없어 메일은 발송되지 않았습니다.");
          } else if (data.reason === "email_send_failed") {
            setInfo("답변은 등록되었지만 메일 발송에 실패했습니다. RESEND 설정을 확인해주세요.");
          } else {
            setInfo("답변은 등록되었지만 메일은 발송되지 않았습니다.");
          }
        }
        router.refresh();
      } else {
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
      {info && <p className="text-sm text-amber-600">{info}</p>}
      <Button type="submit" disabled={loading} className="gap-2">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        답변 등록
      </Button>
    </form>
  );
}
