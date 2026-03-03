import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { CheckCircle, Play, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function PaymentCompletePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const db = createAdminClient();

  // 수강 등록 확인
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) redirect(`/payment/${courseId}`);

  const { data: course } = await db
    .from("courses")
    .select("id, title, thumbnail, level, instructor, badge")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  // 결제 내역 가져오기
  const { data: payment } = await db
    .from("payments")
    .select("payment_method, price, paid_at")
    .eq("user_id", session.user.id)
    .eq("course_id", courseId)
    .order("paid_at", { ascending: false })
    .limit(1)
    .single();

  const methodLabels: Record<string, string> = {
    toss: "토스페이먼츠",
    naver: "네이버페이",
    kakao: "카카오페이",
    card: "신용/체크카드",
    free: "무료",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      {/* Success icon */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-green-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {payment?.payment_method === "free"
            ? "수강 신청이 완료되었습니다"
            : "결제가 완료되었습니다"}
        </h1>
        <p className="text-muted-foreground text-sm">지금 바로 학습을 시작해보세요</p>
      </div>

      {/* 강의 카드 */}
      <Card className="mb-4">
        <CardContent className="pt-5 pb-5">
          <div className="flex gap-4 items-center">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.thumbnail} shrink-0 flex items-center justify-center`}
            >
              <Play size={20} className="text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
              </div>
              <p className="font-semibold text-sm">{course.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결제 요약 */}
      {payment && (
        <Card className="mb-8">
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              결제 정보
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 수단</span>
                <span>{methodLabels[payment.payment_method] ?? payment.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="font-semibold">{payment.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 일시</span>
                <span>
                  {new Date(payment.paid_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1 gap-2" size="lg">
          <Link href={`/courses/${course.id}/player`}>
            <Play size={15} />
            학습 시작하기
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 gap-2" size="lg">
          <Link href="/dashboard?tab=courses">
            <LayoutDashboard size={15} />
            마이페이지
          </Link>
        </Button>
      </div>
    </div>
  );
}
