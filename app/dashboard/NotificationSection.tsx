"use client";

import { useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  initialNotifyInquiryReplyEmail: boolean;
};

export default function NotificationSection({
  initialNotifyInquiryReplyEmail,
}: Props) {
  const [notifyInquiryReplyEmail, setNotifyInquiryReplyEmail] = useState(
    initialNotifyInquiryReplyEmail
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch("/api/profile/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifyInquiryReplyEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "알림 설정 저장에 실패했습니다." });
        return;
      }

      setMsg({ type: "ok", text: "알림 설정이 저장되었습니다." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <Bell size={18} /> 알림 설정
        </CardTitle>
        <CardDescription>이메일로 받을 알림을 선택할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="notify-inquiry-reply" className="text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
                <Mail size={14} />
                문의 답변 이메일 알림
              </Label>
              <p className="text-xs text-muted-foreground mt-1.5">
                관리자가 문의에 답변하면 이메일로 알려드립니다.
              </p>
            </div>
            <Switch
              id="notify-inquiry-reply"
              checked={notifyInquiryReplyEmail}
              onCheckedChange={(checked) => {
                setNotifyInquiryReplyEmail(checked);
                setMsg(null);
              }}
            />
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-destructive"}`}>
            {msg.text}
          </p>
        )}

        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "설정 저장"}
        </Button>
      </CardContent>
    </Card>
  );
}
