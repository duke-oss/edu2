import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";
import { sendInquiryReplyEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "답변 내용을 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();

  // Get inquiry info for email
  const { data: inquiry } = await db
    .from("inquiries")
    .select("title, users(email)")
    .eq("id", id)
    .single();

  const { error } = await db.from("inquiry_replies").insert({
    inquiry_id: id,
    content: content.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email notification (fire-and-forget)
  if (inquiry) {
    const userEmail = (inquiry.users as { email?: string } | null)?.email;
    if (userEmail) {
      sendInquiryReplyEmail(userEmail, inquiry.title, content.trim()).catch(console.error);
    }
  }

  return NextResponse.json({ ok: true });
}
