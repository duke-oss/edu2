import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Tag } from "lucide-react";
import CouponActions from "./CouponActions";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const { data: coupons } = await db
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">쿠폰 관리</h1>
          <p className="text-muted-foreground text-sm">할인 쿠폰을 생성하고 관리합니다</p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new" className="gap-1.5">
            <Plus size={15} /> 쿠폰 생성
          </Link>
        </Button>
      </div>

      {(!coupons || coupons.length === 0) ? (
        <div className="text-center py-20 text-muted-foreground">
          <Tag size={40} className="mx-auto mb-4 opacity-30" />
          <p>등록된 쿠폰이 없습니다</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">코드</th>
                  <th className="px-4 py-3 text-left font-semibold">할인</th>
                  <th className="px-4 py-3 text-left font-semibold">사용</th>
                  <th className="px-4 py-3 text-left font-semibold">만료일</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                  <th className="px-4 py-3 text-left font-semibold">액션</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold">{coupon.code}</td>
                    <td className="px-4 py-3">
                      {coupon.discount_type === "percent"
                        ? `${coupon.discount_value}%`
                        : `₩${coupon.discount_value.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.used_count}
                      {coupon.max_uses != null ? ` / ${coupon.max_uses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString("ko-KR")
                        : "무제한"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={coupon.active ? "default" : "secondary"}>
                        {coupon.active ? "활성" : "비활성"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <CouponActions couponId={coupon.id} active={coupon.active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
