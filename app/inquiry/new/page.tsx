"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, Loader2, ChevronDown, ArrowLeft } from "lucide-react";
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
  "기술 문제",
  "기타",
];

export default function InquiryNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", password: "", category: "", content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
      if (!res.ok) { setError(data.error ?? "오류가 발생했습니다."); return; }
      setSuccess(true);
      setTimeout(() => router.push("/inquiry"), 2000);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">문의가 접수되었습니다</h2>
        <p className="text-muted-foreground text-sm">잠시 후 목록으로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/inquiry" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={15} /> 목록으로
        </Link>
        <h1 className="text-2xl font-bold mb-1">문의 작성</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Lock size={13} /> 비밀번호로 보호되는 비밀글입니다
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
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
                  className="w-full h-9 appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition-all"
                >
                  <option value="">카테고리를 선택하세요</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                placeholder="문의 내용을 자세히 입력해주세요"
                required
                rows={7}
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                비밀번호 <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">내용 확인 시 사용할 비밀번호를 설정하세요</p>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호 설정 (4자 이상)"
                  required
                  minLength={4}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 size={15} className="animate-spin" />}
              문의 접수하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
