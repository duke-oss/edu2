"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, CheckCircle, ChevronLeft, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCourseThumbnailRenderProps } from "@/lib/courseThumbnail";

type Course = {
  id: string;
  title: string;
  thumbnail: string;
  level: string;
  badge: string;
  instructor: string;
  total_duration: string;
  price: string;
  free: boolean;
};

type User = {
  name: string | null;
  email: string;
};

type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "amount";
  discount_value: number;
};

const PAYMENT_METHODS = [
  { id: "toss", label: "토스페이먼츠", bg: "#0064FF", fg: "#ffffff", logo: "T" },
  { id: "naver", label: "네이버페이", bg: "#03C75A", fg: "#ffffff", logo: "N" },
  { id: "kakao", label: "카카오페이", bg: "#FFE200", fg: "#3A1D00", logo: "K" },
  { id: "card", label: "신용/체크카드", bg: "#374151", fg: "#ffffff", logo: "💳" },
];

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString()}`;
}

export default function PaymentClient({
  course,
  user,
}: {
  course: Course;
  user: User;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const originalPrice = parsePrice(course.price);
  const discountedPrice = coupon
    ? coupon.discount_type === "percent"
      ? Math.max(0, Math.round(originalPrice * (1 - coupon.discount_value / 100)))
      : Math.max(0, originalPrice - coupon.discount_value)
    : originalPrice;

  const finalPrice = course.free ? 0 : discountedPrice;
  const canPay = course.free || !!method;
  const thumb = getCourseThumbnailRenderProps(course.thumbnail, course.title);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      if (res.ok) {
        const data = await res.json();
        setCoupon(data);
      } else {
        const data = await res.json();
        setCouponError(data.error ?? "유효하지 않은 쿠폰입니다.");
      }
    } catch {
      setCouponError("쿠폰 확인 중 오류가 발생했습니다.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handlePay() {
    if (!canPay) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          paymentMethod: method ?? "free",
          couponCode: coupon?.code ?? null,
        }),
      });
      if (res.ok) {
        router.push(`/payment/${course.id}/complete`);
      } else {
        const data = await res.json();
        setError(data.error ?? "결제 중 오류가 발생했습니다");
      }
    } catch {
      setError("결제 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={15} />
        강의 상세로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-6">결제하기</h1>

      <div className="space-y-4">
        {/* 강의 정보 */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              강의 정보
            </p>
            <div className="flex gap-4 items-center">
              <div
                className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center ${thumb.className}`}
                style={thumb.style}
              >
                <Play size={20} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                  <Badge
                    className={`text-xs border-0 ${
                      course.badge === "LIVE" ? "bg-red-500 text-white" : "bg-black/10 text-foreground"
                    }`}
                  >
                    {course.badge}
                  </Badge>
                </div>
                <p className="font-semibold text-sm leading-snug">{course.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {course.instructor} · {course.total_duration}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 구매자 정보 */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              구매자 정보
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">이름</span>
                <span className="font-medium">{user.name ?? "미설정"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">이메일</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 수단 */}
        {!course.free && (
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                결제 수단
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const selected = method === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setMethod(pm.id)}
                      className={`relative flex flex-col items-center justify-center gap-1.5 h-20 rounded-xl border-2 transition-all ${
                        selected
                          ? "border-transparent shadow-md"
                          : "border-border hover:border-muted-foreground/40 bg-background"
                      }`}
                      style={selected ? { backgroundColor: pm.bg, color: pm.fg } : {}}
                    >
                      {selected && (
                        <CheckCircle size={13} className="absolute top-2 right-2 opacity-80" />
                      )}
                      <span className="text-lg leading-none">{pm.logo}</span>
                      <span className="text-xs font-semibold leading-tight text-center px-2">
                        {pm.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 쿠폰 */}
        {!course.free && (
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                할인 쿠폰
              </p>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{coupon.code}</span>
                    <span className="text-xs text-green-600">
                      {coupon.discount_type === "percent"
                        ? `${coupon.discount_value}% 할인`
                        : `₩${coupon.discount_value.toLocaleString()} 할인`}
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="쿠폰 코드 입력"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    className="uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    적용
                  </Button>
                </div>
              )}
              {couponError && <p className="text-xs text-destructive mt-2">{couponError}</p>}
            </CardContent>
          </Card>
        )}

        {/* 결제 금액 */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              결제 금액
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">강의 금액</span>
              <span>{course.price}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-green-600">쿠폰 할인</span>
                <span className="text-green-600">
                  -{coupon.discount_type === "percent"
                    ? `${coupon.discount_value}%`
                    : formatPrice(coupon.discount_value)}
                </span>
              </div>
            )}
            <Separator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="font-bold">최종 결제금액</span>
              <span className="text-xl font-black text-primary">
                {course.free ? "무료" : formatPrice(finalPrice)}
              </span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* 결제 버튼 */}
        <Button
          onClick={handlePay}
          disabled={loading || !canPay}
          className="w-full h-12 text-base font-bold"
          size="lg"
        >
          {loading
            ? "처리 중..."
            : course.free
            ? "무료 수강 신청"
            : !method
            ? "결제 수단을 선택해주세요"
            : `${formatPrice(finalPrice)} 결제하기`}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          결제는 테스트 환경으로 실제 금액이 청구되지 않습니다
        </p>
      </div>
    </div>
  );
}
