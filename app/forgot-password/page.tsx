"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ChevronLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">비밀번호 찾기</CardTitle>
          <CardDescription>가입한 이메일로 재설정 링크를 보내드립니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle size={40} className="mx-auto text-green-500" />
              <p className="font-medium">이메일을 확인해주세요</p>
              <p className="text-sm text-muted-foreground">
                입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.<br />
                링크는 1시간 동안 유효합니다.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/login">로그인으로 돌아가기</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="가입한 이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 size={15} className="animate-spin" />}
                재설정 링크 보내기
              </Button>

              <p className="text-center text-sm">
                <Link href="/login" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <ChevronLeft size={14} /> 로그인으로 돌아가기
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
