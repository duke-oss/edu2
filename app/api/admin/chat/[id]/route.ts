import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

// GET /api/admin/chat/[id] — 특정 conversation messages 조회 + user 메시지 read_at 업데이트
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();

  const { data: messages, error } = await db
    .from("chat_messages")
    .select("id, sender_type, content, created_at, read_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  // user 메시지 read_at 업데이트 (관리자가 읽음 처리)
  const unreadUserIds = (messages ?? [])
    .filter((m) => m.sender_type === "user" && !m.read_at)
    .map((m) => m.id);

  if (unreadUserIds.length > 0) {
    await db
      .from("chat_messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadUserIds);
  }

  return NextResponse.json(messages ?? []);
}

// POST /api/admin/chat/[id] — 관리자 답변 전송
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();
  const now = new Date().toISOString();

  const { data: msg, error } = await db
    .from("chat_messages")
    .insert({ conversation_id: id, sender_type: "admin", content: content.trim() })
    .select("id, sender_type, content, created_at, read_at")
    .single();

  if (error) return NextResponse.json({ error: "저장 실패" }, { status: 500 });

  // conversation last_message_at 업데이트
  await db
    .from("chat_conversations")
    .update({ last_message_at: now })
    .eq("id", id);

  return NextResponse.json({ message: msg }, { status: 201 });
}
