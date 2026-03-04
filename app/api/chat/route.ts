import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SessionUser = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

async function resolveChatUserId(
  db: ReturnType<typeof createAdminClient>,
  user: SessionUser
) {
  const sessionId = user.id?.trim();

  if (sessionId && UUID_RE.test(sessionId)) {
    const { data: byId } = await db
      .from("users")
      .select("id")
      .eq("id", sessionId)
      .maybeSingle();

    if (byId?.id) return byId.id;
  }

  const email = user.email?.trim();
  if (!email) return null;

  const { data: byEmail } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (byEmail?.id) return byEmail.id;

  const { data: created } = await db
    .from("users")
    .insert({
      email,
      name: user.name ?? null,
      image: user.image ?? null,
      email_verified: new Date().toISOString(),
    })
    .select("id")
    .single();

  return created?.id ?? null;
}

// GET /api/chat — 내 conversation + messages 조회
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const db = createAdminClient();
    const userId = await resolveChatUserId(db, session.user);

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요." },
        { status: 400 }
      );
    }

    const { data: convRows, error: convErr } = await db
      .from("chat_conversations")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (convErr) {
      console.error("[chat] conversation fetch failed:", convErr);
      return NextResponse.json({ error: "대화 조회 실패" }, { status: 500 });
    }

    const conv = convRows?.[0];

    if (!conv) {
      return NextResponse.json({ messages: [], unreadCount: 0 });
    }

    const { data: messages } = await db
      .from("chat_messages")
      .select("id, sender_type, content, created_at, read_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true });

    // 사용자가 읽지 않은 admin 메시지 수
    const unreadCount = (messages ?? []).filter(
      (m) => m.sender_type === "admin" && !m.read_at
    ).length;

    // 사용자가 열면 admin 메시지 read_at 업데이트
    const unreadIds = (messages ?? [])
      .filter((m) => m.sender_type === "admin" && !m.read_at)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await db
        .from("chat_messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", unreadIds);
    }

    return NextResponse.json({ messages: messages ?? [], unreadCount });
  } catch (error) {
    console.error("[chat] GET failed:", error);
    return NextResponse.json(
      { error: "채팅 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

// POST /api/chat — 메시지 전송
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
    }

    const db = createAdminClient();
    const userId = await resolveChatUserId(db, session.user);
    if (!userId) {
      return NextResponse.json(
        { error: "사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const { data: existingRows, error: existingErr } = await db
      .from("chat_conversations")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (existingErr) {
      console.error("[chat] conversation lookup failed:", existingErr);
      return NextResponse.json(
        { error: `대화 조회 실패: ${existingErr.message}` },
        { status: 500 }
      );
    }

    let conversationId = existingRows?.[0]?.id ?? null;

    if (!conversationId) {
      const { data: createdConv, error: createErr } = await db
        .from("chat_conversations")
        .insert({ user_id: userId, last_message_at: now })
        .select("id")
        .single();

      if (createErr || !createdConv?.id) {
        console.error("[chat] conversation create failed:", createErr);
        return NextResponse.json(
          { error: `대화 생성 실패: ${createErr?.message ?? "unknown error"}` },
          { status: 500 }
        );
      }

      conversationId = createdConv.id;
    } else {
      const { error: updateErr } = await db
        .from("chat_conversations")
        .update({ last_message_at: now })
        .eq("id", conversationId);

      if (updateErr) {
        console.error("[chat] conversation update failed:", updateErr);
      }
    }

    const { data: msg, error: msgErr } = await db
      .from("chat_messages")
      .insert({ conversation_id: conversationId, sender_type: "user", content: content.trim() })
      .select("id, sender_type, content, created_at, read_at")
      .single();

    if (msgErr) {
      console.error("[chat] message insert failed:", msgErr);
      return NextResponse.json(
        { error: `메시지 저장 실패: ${msgErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: msg }, { status: 201 });
  } catch (error) {
    console.error("[chat] POST failed:", error);
    return NextResponse.json(
      { error: "메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
