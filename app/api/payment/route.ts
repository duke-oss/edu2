import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { sendPaymentConfirmEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, paymentMethod, couponCode } = body ?? {};

  if (!courseId || !paymentMethod) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: course } = await db
    .from("courses")
    .select("id, title, price")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "강의를 찾을 수 없습니다" }, { status: 404 });
  }

  // 쿠폰 재검증
  if (couponCode) {
    const { data: coupon } = await db
      .from("coupons")
      .select("id, discount_type, discount_value, max_uses, used_count, expires_at, active")
      .eq("code", couponCode)
      .maybeSingle();

    if (
      coupon &&
      coupon.active &&
      (!coupon.expires_at || new Date(coupon.expires_at) >= new Date()) &&
      (coupon.max_uses === null || coupon.used_count < coupon.max_uses)
    ) {
      await db
        .from("coupons")
        .update({ used_count: coupon.used_count + 1 })
        .eq("id", coupon.id);
    }
  }

  // 결제 기록 저장 (더미)
  const { error: paymentError } = await db.from("payments").insert({
    user_id: session.user.id,
    course_id: courseId,
    payment_method: paymentMethod,
    price: course.price,
    status: "paid",
    paid_at: new Date().toISOString(),
  });

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  // 수강 등록
  const { error: enrollError } = await db
    .from("enrollments")
    .upsert(
      { user_id: session.user.id, course_id: courseId },
      { onConflict: "user_id,course_id" }
    );

  if (enrollError) {
    return NextResponse.json({ error: enrollError.message }, { status: 500 });
  }

  // Send confirmation email (fire-and-forget)
  const { data: user } = await db
    .from("users")
    .select("email")
    .eq("id", session.user.id)
    .single();
  if (user?.email) {
    sendPaymentConfirmEmail(user.email, course.title, course.price ?? "").catch(console.error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
