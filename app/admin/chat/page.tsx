import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChatListPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-login");

  const db = createAdminClient();

  const { data: convs } = await db
    .from("chat_conversations")
    .select("id, status, last_message_at, user_id, users(name, email)")
    .order("last_message_at", { ascending: false });

  // 각 conversation의 마지막 메시지와 미읽음 수 조회
  const rows = await Promise.all(
    (convs ?? []).map(async (conv) => {
      const [{ data: lastMsg }, { data: unread }] = await Promise.all([
        db
          .from("chat_messages")
          .select("content, sender_type")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        db
          .from("chat_messages")
          .select("id")
          .eq("conversation_id", conv.id)
          .eq("sender_type", "user")
          .is("read_at", null),
      ]);

      return {
        ...conv,
        lastMessage: lastMsg ?? null,
        unreadCount: unread?.length ?? 0,
      };
    })
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">채팅 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">
          사용자별 1:1 채팅 대화를 관리합니다.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <MessageCircle size={40} className="opacity-30" />
          <p className="text-sm">아직 채팅 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((conv) => {
            const user = conv.users as { name?: string; email?: string } | null;
            return (
              <Link
                key={conv.id}
                href={`/admin/chat/${conv.id}`}
                className="block rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">
                        {user?.name ?? "이름 없음"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email ?? ""}
                      </span>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-500 text-white text-[10px] px-1.5 py-0 h-5">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage
                        ? `${conv.lastMessage.sender_type === "admin" ? "[관리자] " : ""}${conv.lastMessage.content}`
                        : "메시지 없음"}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(conv.last_message_at).toLocaleString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
