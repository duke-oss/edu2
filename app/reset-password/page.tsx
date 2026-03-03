"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <p className="text-center text-muted-foreground">
        유효하지 않은 링크입니다.{" "}
        <Link href="/forgot-password" className="text-primary hover:underline">
          다시 요청하기
        </Link>
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 2000);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {done ? (
        <div className="text-center py-4 space-y-3">
          <CheckCircle size={40} className="mx-auto text-green-500" />
          <p className="font-medium">비밀번호가 변경되었습니다</p>
          <p className="text-sm text-muted-foreground">로그인 페이지로 이동합니다...</p>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="password">새 비밀번호</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">비밀번호 확인</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                type="password"
                placeholder="비밀번호 재입력"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 size={15} className="animate-spin" />}
            비밀번호 변경
          </Button>
        </>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">새 비밀번호 설정</CardTitle>
          <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
