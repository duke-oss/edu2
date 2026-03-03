"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
    hasPassword: boolean;
  };
};

export default function ProfileSection({ user }: Props) {
  const { update } = useSession();
  const [name, setName] = useState(user.name ?? "");
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.error });
      } else {
        await update({ name });
        setMsg({ type: "ok", text: "이름이 변경되었습니다" });
        setDirty(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            <Avatar className="w-16 h-16 shrink-0">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.image ? <User size={28} /> : initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-lg font-bold">{user.name ?? "이름 없음"}</span>
                <Badge variant="secondary" className="text-xs">
                  {user.hasPassword ? "이메일 가입" : "소셜 로그인"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                가입일 {new Date(user.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit name */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">이름 변경</h3>
          <div className="space-y-3 max-w-sm">
            <div>
              <Label>이메일</Label>
              <Input
                value={user.email}
                disabled
                className="mt-1.5 bg-muted/50"
              />
            </div>
            <div>
              <Label htmlFor="name-field">이름</Label>
              <Input
                id="name-field"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setDirty(true);
                  setMsg(null);
                }}
                placeholder="이름을 입력하세요"
                className="mt-1.5"
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
            <Button
              onClick={handleSave}
              disabled={!dirty || loading || !name.trim()}
              size="sm"
            >
              {loading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
