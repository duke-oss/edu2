import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, paymentMethod } = body ?? {};

  if (!courseId || !paymentMethod) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: course } = await db
    .from("courses")
    .select("id, price")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "강의를 찾을 수 없습니다" }, { status: 404 });
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
