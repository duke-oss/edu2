import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { code, discount_type, discount_value, max_uses, expires_at } = body;

  if (!code || !discount_type || discount_value == null) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("coupons").insert({
    code: code.trim().toUpperCase(),
    discount_type,
    discount_value: Number(discount_value),
    max_uses: max_uses ? Number(max_uses) : null,
    expires_at: expires_at || null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "이미 존재하는 쿠폰 코드입니다." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
