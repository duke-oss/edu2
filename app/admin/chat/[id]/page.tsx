import { requireAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, User } from "lucide-react";
import AdminChatReplyForm from "./AdminChatReplyForm";

export const dynamic = "force-dynamic";

export default async function AdminChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-login");

  const { id } = await params;
  const db = createAdminClient();

  const [{ data: conv }, { data: messages }] = await Promise.all([
    db
      .from("chat_conversations")
      .select("id, status, created_at, users(name, email)")
      .eq("id", id)
      .single(),
    db
      .from("chat_messages")
      .select("id, sender_type, content, created_at, read_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!conv) notFound();

  // user 메시지 읽음 처리
  const unreadUserIds = (messages ?? [])
    .filter((m) => m.sender_type === "user" && !m.read_at)
    .map((m) => m.id);
  if (unreadUserIds.length > 0) {
    await db
      .from("chat_messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadUserIds);
  }

  const user = conv.users as { name?: string; email?: string } | null;

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
          <Link href="/admin/chat">
            <ChevronLeft size={14} /> 목록으로
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name ?? "이름 없음"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>
      </div>

      {/* 메시지 버블 */}
      <div className="space-y-3 mb-6 min-h-[200px]">
        {(messages ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">메시지가 없습니다.</p>
        ) : (
          (messages ?? []).map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
                  msg.sender_type === "admin"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                <p className={`text-[10px] font-semibold mb-0.5 ${msg.sender_type === "admin" ? "opacity-60" : "opacity-50"}`}>
                  {msg.sender_type === "admin" ? "관리자" : (user?.name ?? "사용자")}
                </p>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.sender_type === "admin" ? "opacity-60 text-right" : "opacity-50"}`}>
                  {new Date(msg.created_at).toLocaleString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {msg.sender_type === "admin" && msg.read_at && (
                    <span className="ml-1">✓ 읽음</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Separator className="mb-6" />

      {/* 답변 폼 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">답변 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminChatReplyForm conversationId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
