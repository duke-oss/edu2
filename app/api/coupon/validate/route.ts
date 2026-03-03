import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code?.trim()) {
    return NextResponse.json({ error: "쿠폰 코드를 입력해주세요." }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: coupon } = await db
    .from("coupons")
    .select("id, code, discount_type, discount_value, max_uses, used_count, expires_at, active")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "유효하지 않은 쿠폰 코드입니다." }, { status: 404 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "만료된 쿠폰입니다." }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "사용 횟수가 초과된 쿠폰입니다." }, { status: 400 });
  }

  return NextResponse.json({
    id: coupon.id,
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
  });
}
