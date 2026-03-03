"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, Loader2, ChevronDown, ArrowLeft, ShieldCheck, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CATEGORIES = [
  "배송/물류 문의",
  "결제/환불 문의",
  "서비스 이용 문의",
  "기술 문의",
  "기타",
];

export default function InquiryNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", password: "", category: "", content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      setSuccess(true);
      redirectTimerRef.current = setTimeout(() => router.push("/inquiry"), 1600);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {success && (
        <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-green-200 bg-white shadow-lg p-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">문의가 접수되었습니다.</p>
              <p className="text-xs text-muted-foreground mt-0.5">잠시 후 목록으로 자동 이동합니다.</p>
              <div className="mt-2">
                <Button size="sm" variant="outline" onClick={() => router.push("/inquiry")}>
                  지금 이동
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-7">
        <Link
          href="/inquiry"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={15} /> 목록으로
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">Support Ticket</p>
          <h1 className="text-3xl font-black tracking-tight">문의 작성</h1>
          <p className="text-sm text-muted-foreground mt-2">
            문제 상황을 구체적으로 작성해주시면 더 빠르고 정확하게 도와드릴 수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <MessageSquareText size={18} /> 문의 내용 입력
            </CardTitle>
            <CardDescription>필수 항목을 입력하고 제출해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="title">
                  제목 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="문의 제목을 입력하세요"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">
                    카테고리 <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full h-10 appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition-all"
                    >
                      <option value="">카테고리를 선택하세요</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">
                    비밀번호 <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="4자 이상 입력"
                      required
                      minLength={4}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content">
                  문의 내용 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="오류 메시지, 발생 시점, 재현 방법 등을 함께 작성해주세요"
                  required
                  rows={8}
                  className="resize-y min-h-[180px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => router.push("/inquiry")}>
                  취소
                </Button>
                <Button type="submit" disabled={loading || success} className="min-w-[140px] gap-1.5">
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {success ? "접수 완료" : "문의 접수하기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ShieldCheck size={18} /> 작성 가이드
            </CardTitle>
            <CardDescription>처리 시간을 줄이기 위한 권장 사항입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. 문제 상황과 시점을 구체적으로 작성해주세요.</p>
            <p>2. 결제/환불 문의는 주문 정보(시간, 금액)를 포함해주세요.</p>
            <p>3. 비밀번호는 상세 조회 시 필요하니 꼭 기억해주세요.</p>
            <p>4. 개인정보(카드번호/주민번호)는 입력하지 마세요.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
