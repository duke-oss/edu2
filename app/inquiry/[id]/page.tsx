"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Loader2, ArrowLeft, Tag, Calendar, User } from "lucide-react";
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
  const router = useRouter();

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
      if (!res.ok) { setError(data.error); return; }
      setDetail(data);
    } finally {
      setLoading(false);
    }
  }

  // 내용 확인 화면
  if (detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/inquiry"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={15} /> 목록으로
        </Link>

        <Card>
          <CardContent className="pt-6">
            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <Tag size={11} /> {detail.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <User size={11} />
                {detail.users?.name || detail.users?.email?.split("@")[0] || "익명"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={11} />
                {new Date(detail.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {/* 제목 */}
            <h1 className="text-xl font-bold mb-6 pb-6 border-b border-border">
              {detail.title}
            </h1>

            {/* 내용 */}
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {detail.content}
            </p>
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          className="mt-4 text-muted-foreground"
          onClick={() => router.push("/inquiry")}
        >
          ← 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 비밀번호 입력 화면
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Link
        href="/inquiry"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={15} /> 목록으로
      </Link>

      <Card>
        <CardHeader className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock size={24} className="text-primary" />
          </div>
          <CardTitle>비밀글입니다</CardTitle>
          <CardDescription>작성 시 설정한 비밀번호를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-3">
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
                placeholder="비밀번호 입력"
                required
                autoFocus
                className="text-center"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 size={15} className="animate-spin" />}
              확인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
