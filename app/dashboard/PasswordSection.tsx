"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function setField(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.next !== form.confirm) {
      setMsg({ type: "err", text: "새 비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "비밀번호 변경에 실패했습니다." });
      } else {
        setMsg({ type: "ok", text: "비밀번호가 성공적으로 변경되었습니다." });
        setForm({ current: "", next: "", confirm: "" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <ShieldCheck size={18} /> 보안 안내
          </CardTitle>
          <CardDescription>계정 보호를 위해 정기적인 비밀번호 변경을 권장합니다.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• 8자 이상으로 설정하세요.</p>
          <p>• 영문, 숫자, 특수문자를 함께 사용하세요.</p>
          <p>• 다른 사이트와 동일한 비밀번호는 피하세요.</p>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <KeyRound size={18} /> 비밀번호 변경
          </CardTitle>
          <CardDescription>현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
              <Label htmlFor="current-password">현재 비밀번호</Label>
              <Input
                id="current-password"
                type="password"
                value={form.current}
                onChange={setField("current")}
                placeholder="현재 비밀번호"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="next-password">새 비밀번호</Label>
              <Input
                id="next-password"
                type="password"
                value={form.next}
                onChange={setField("next")}
                placeholder="8자 이상"
                className="mt-1.5"
                required
                minLength={8}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <Input
                id="confirm-password"
                type="password"
                value={form.confirm}
                onChange={setField("confirm")}
                placeholder="비밀번호 다시 입력"
                className="mt-1.5"
                required
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-destructive"}`}>
                {msg.text}
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
