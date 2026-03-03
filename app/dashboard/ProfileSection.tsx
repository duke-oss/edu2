"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, CalendarDays, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        setMsg({ type: "err", text: data.error ?? "프로필 저장에 실패했습니다." });
      } else {
        await update({ name });
        setMsg({ type: "ok", text: "프로필이 업데이트되었습니다." });
        setDirty(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <Card className="xl:col-span-1">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 shrink-0 ring-2 ring-primary/20">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.image ? <User size={26} /> : initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-lg font-bold truncate">{user.name ?? "이름 미설정"}</p>
                <Badge variant="secondary" className="text-[11px]">{user.hasPassword ? "이메일 계정" : "소셜 로그인"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={14} />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays size={14} />
              <span>가입일 {new Date(user.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BadgeCheck size={14} />
              <span>{user.hasPassword ? "비밀번호 로그인 사용중" : "비밀번호 로그인 미사용"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>기본 정보 수정</CardTitle>
          <CardDescription>이름 변경 시 내 강의와 후기, 문의 내역에 동일하게 반영됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-4">
            <div>
              <Label>이메일</Label>
              <Input value={user.email} disabled className="mt-1.5 bg-muted/50" />
            </div>

            <div>
              <Label htmlFor="profile-name">이름</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setDirty(true);
                  setMsg(null);
                }}
                placeholder="표시할 이름을 입력하세요"
                className="mt-1.5"
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-destructive"}`}>{msg.text}</p>
            )}

            <Button onClick={handleSave} disabled={!dirty || loading || !name.trim()}>
              {loading ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
