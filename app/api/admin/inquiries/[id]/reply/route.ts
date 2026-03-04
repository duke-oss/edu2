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
    .select("title, users(email, notify_inquiry_reply_email)")
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
  if (!inquiry) {
    return NextResponse.json({ ok: true, emailSent: false, reason: "inquiry_not_found" });
  }

  const userRel = inquiry.users as
    | { email?: string; notify_inquiry_reply_email?: boolean | null }
    | Array<{ email?: string; notify_inquiry_reply_email?: boolean | null }>
    | null;

  const userInfo = Array.isArray(userRel) ? userRel[0] : userRel;
  const userEmail = userInfo?.email?.trim();
  const notifyEnabled = userInfo?.notify_inquiry_reply_email ?? true;

  if (!userEmail) {
    return NextResponse.json({ ok: true, emailSent: false, reason: "no_user_email" });
  }

  if (!notifyEnabled) {
    return NextResponse.json({ ok: true, emailSent: false, reason: "notification_disabled" });
  }

  try {
    await sendInquiryReplyEmail(userEmail, inquiry.title, content.trim());
    return NextResponse.json({ ok: true, emailSent: true });
  } catch (mailError) {
    console.error("[inquiry-reply] email send failed:", mailError);
    return NextResponse.json(
      {
        ok: true,
        emailSent: false,
        reason: "email_send_failed",
      },
      { status: 200 }
    );
  }
}
