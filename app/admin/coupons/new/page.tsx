"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      code: form.get("code"),
      discount_type: form.get("discount_type"),
      discount_value: form.get("discount_value"),
      max_uses: form.get("max_uses") || null,
      expires_at: form.get("expires_at") || null,
    };
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push("/admin/coupons");
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
    <div>
      <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2">
        <Link href="/admin/coupons">
          <ChevronLeft size={14} /> 목록으로
        </Link>
      </Button>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>쿠폰 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">쿠폰 코드</Label>
              <Input id="code" name="code" placeholder="SUMMER2025" required />
              <p className="text-xs text-muted-foreground">영문/숫자, 자동으로 대문자 변환됩니다</p>
            </div>

            <div className="space-y-1.5">
              <Label>할인 유형</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="discount_type" value="percent" defaultChecked />
                  퍼센트 (%)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="discount_type" value="amount" />
                  정액 (₩)
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="discount_value">할인 값</Label>
              <Input
                id="discount_value"
                name="discount_value"
                type="number"
                min={1}
                placeholder="10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_uses">최대 사용 횟수 (선택)</Label>
              <Input
                id="max_uses"
                name="max_uses"
                type="number"
                min={1}
                placeholder="비워두면 무제한"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expires_at">만료일 (선택)</Label>
              <Input id="expires_at" name="expires_at" type="datetime-local" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 size={14} className="animate-spin" />}
              쿠폰 생성
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
