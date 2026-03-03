import { NextRequest, NextResponse } from "next/server";
import { makeAdminToken, ADMIN_COOKIE } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";

  if (
    !email ||
    !password ||
    email !== adminEmail ||
    password !== adminPassword
  ) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = makeAdminToken(email);
  const res = NextResponse.json({ ok: true });

  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
