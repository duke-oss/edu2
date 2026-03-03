import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase";
import { sendRefundConfirmEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { enrollmentId } = body;

  if (!enrollmentId) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const db = createAdminClient();

  // 1. 수강 정보 조회 (본인 확인)
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id, user_id, course_id, enrolled_at")
    .eq("id", enrollmentId)
    .eq("user_id", userId)
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "수강 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  // 2. 7일 이내 환불 가능 여부 확인
  const enrolledAt = new Date(enrollment.enrolled_at);
  const diffMs = Date.now() - enrolledAt.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 7) {
    return NextResponse.json(
      { error: "환불 가능 기간(결제일로부터 7일)이 지났습니다." },
      { status: 400 }
    );
  }

  // 3. 시청한 레슨 없는지 확인
  const { data: progress } = await db
    .from("lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", enrollment.course_id)
    .limit(1);

  if (progress && progress.length > 0) {
    return NextResponse.json(
      { error: "강의를 1강 이상 시청한 경우 환불이 불가합니다." },
      { status: 400 }
    );
  }

  // 4. 결제 내역 환불 처리 (무료 강의는 payments 업데이트 스킵)
  await db
    .from("payments")
    .update({ status: "refunded", refunded_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("course_id", enrollment.course_id)
    .eq("status", "paid");

  // 5. 수강 취소
  const { error: deleteError } = await db
    .from("enrollments")
    .delete()
    .eq("id", enrollmentId);

  if (deleteError) {
    return NextResponse.json({ error: "환불 처리 중 오류가 발생했습니다." }, { status: 500 });
  }

  // Send refund confirmation email (fire-and-forget)
  const { data: courseInfo } = await db
    .from("courses")
    .select("title")
    .eq("id", enrollment.course_id)
    .single();
  const { data: userInfo } = await db
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();
  if (userInfo?.email && courseInfo?.title) {
    sendRefundConfirmEmail(userInfo.email, courseInfo.title).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
