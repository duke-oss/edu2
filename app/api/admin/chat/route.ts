import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

// GET /api/admin/chat — 모든 conversation 목록
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();

  const { data: convs, error } = await db
    .from("chat_conversations")
    .select("id, status, last_message_at, created_at, user_id, users(name, email)")
    .order("last_message_at", { ascending: false });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  // 각 conversation의 마지막 메시지와 미읽음(user→admin 기준) 수 조회
  const results = await Promise.all(
    (convs ?? []).map(async (conv) => {
      const [{ data: lastMsg }, { data: unreadMsgs }] = await Promise.all([
        db
          .from("chat_messages")
          .select("content, sender_type, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        db
          .from("chat_messages")
          .select("id", { count: "exact" })
          .eq("conversation_id", conv.id)
          .eq("sender_type", "user")
          .is("read_at", null),
      ]);

      return {
        ...conv,
        lastMessage: lastMsg ?? null,
        unreadCount: unreadMsgs?.length ?? 0,
      };
    })
  );

  return NextResponse.json(results);
}
