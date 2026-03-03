"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function setField(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      setMsg({ type: "err", text: "새 비밀번호가 일치하지 않습니다" });
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
        setMsg({ type: "err", text: data.error });
      } else {
        setMsg({ type: "ok", text: "비밀번호가 변경되었습니다" });
        setForm({ current: "", next: "", confirm: "" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">비밀번호 변경</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="current-pw">현재 비밀번호</Label>
            <Input
              id="current-pw"
              type="password"
              value={form.current}
              onChange={setField("current")}
              placeholder="현재 비밀번호"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="new-pw">새 비밀번호</Label>
            <Input
              id="new-pw"
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
            <Label htmlFor="confirm-pw">새 비밀번호 확인</Label>
            <Input
              id="confirm-pw"
              type="password"
              value={form.confirm}
              onChange={setField("confirm")}
              placeholder="비밀번호 재입력"
              className="mt-1.5"
              required
            />
          </div>
          {msg && (
            <p
              className={`text-sm ${
                msg.type === "ok" ? "text-green-600" : "text-destructive"
              }`}
            >
              {msg.text}
            </p>
          )}
          <Button type="submit" disabled={loading} size="sm">
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
