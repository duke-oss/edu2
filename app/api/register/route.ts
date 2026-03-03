import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail, sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check for existing user
  const { data: existing } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "이미 사용 중인 이메일입니다." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const userName = name ?? email.split("@")[0];
  const { error } = await db.from("users").insert({
    name: userName,
    email,
    password: hashedPassword,
    // email_verified remains null until user verifies
  });

  if (error) {
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  // Send verification email (fire-and-forget)
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await db.from("verification_tokens").delete().eq("identifier", `verify:${email}`);
  await db.from("verification_tokens").insert({ identifier: `verify:${email}`, token, expires });

  sendVerificationEmail(email, token).catch(console.error);
  sendWelcomeEmail(email, userName).catch(console.error);

  return NextResponse.json({ ok: true }, { status: 201 });
}
