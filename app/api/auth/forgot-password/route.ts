import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();

  // Check user exists (don't reveal whether email exists)
  const { data: user } = await db
    .from("users")
    .select("id")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (user) {
    try {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Delete old tokens for this email
      await db
        .from("verification_tokens")
        .delete()
        .eq("identifier", `reset:${normalizedEmail}`);

      // Insert new token
      await db.from("verification_tokens").insert({
        identifier: `reset:${normalizedEmail}`,
        token,
        expires,
      });

      await sendPasswordResetEmail(normalizedEmail, token);
    } catch (error) {
      console.error("[forgot-password] failed to issue reset email:", error);
    }
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ ok: true });
}
