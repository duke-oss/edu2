"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Lock, Loader2, ArrowLeft, Tag, CalendarDays, User, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InquiryDetail {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
  users: { name: string | null; email: string | null } | null;
}

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<InquiryDetail | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/inquiry/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      setDetail(data);
    } finally {
      setLoading(false);
    }
  }

  if (detail) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-5">
        <Link
          href="/inquiry"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} /> 목록으로
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <Tag size={11} /> {detail.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <User size={11} /> {detail.users?.name || detail.users?.email?.split("@")[0] || "익명"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays size={11} /> {new Date(detail.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight mb-5 pb-5 border-b border-border">{detail.title}</h1>

            <div className="rounded-xl border border-border bg-muted/20 px-5 py-4">
              <p className="text-sm leading-7 whitespace-pre-wrap text-foreground/90">{detail.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/inquiry"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft size={15} /> 목록으로
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Lock size={18} /> 비밀글 확인
            </CardTitle>
            <CardDescription>문의 작성 시 설정한 비밀번호를 입력하면 내용을 확인할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="max-w-md space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" disabled={loading} className="min-w-[120px] gap-1.5">
                {loading && <Loader2 size={15} className="animate-spin" />}
                확인
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <ShieldCheck size={16} /> 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-muted-foreground">
            <p className="inline-flex items-start gap-2">
              <FileText size={14} className="mt-0.5" />
              비밀번호를 잊은 경우 동일 문의를 새로 작성해 주세요.
            </p>
            <p>입력한 비밀번호는 문의 조회용으로만 사용됩니다.</p>
            <p>문의 내역은 마이페이지 &gt; 내 문의에서도 확인할 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
