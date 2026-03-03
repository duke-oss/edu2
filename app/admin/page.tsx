import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import { Users, BookOpen, MessageSquare, TrendingUp, GraduationCap, Star, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "./RevenueChart";

function parseKRW(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    usersResult,
    coursesResult,
    inquiriesResult,
    enrollmentsResult,
    paymentsResult,
    refundsResult,
    reviewsResult,
    thisMonthEnrollResult,
  ] = await Promise.all([
    db.from("users").select("id", { count: "exact", head: true }),
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }),
    db.from("enrollments").select("id", { count: "exact", head: true }),
    db.from("payments").select("price, paid_at").eq("status", "paid"),
    db.from("payments").select("price").eq("status", "refunded"),
    db.from("reviews").select("id", { count: "exact", head: true }),
    db.from("enrollments").select("id", { count: "exact", head: true }).gte("enrolled_at", thisMonthStart),
  ]);

  const totalRevenue = (paymentsResult.data ?? []).reduce((s, p) => s + parseKRW(p.price), 0);
  const totalRefund = (refundsResult.data ?? []).reduce((s, p) => s + parseKRW(p.price), 0);

  // Monthly revenue (last 6 months)
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    const revenue = (paymentsResult.data ?? [])
      .filter((p) => {
        const pd = new Date(p.paid_at);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((sum, p) => sum + parseKRW(p.price), 0);
    return { month: label, revenue };
  });

  const stats = [
    { label: "전체 사용자", value: usersResult.count ?? 0, icon: Users, href: "/admin/users" },
    { label: "전체 강의", value: coursesResult.count ?? 0, icon: BookOpen, href: "/admin/courses" },
    { label: "전체 문의", value: inquiriesResult.count ?? 0, icon: MessageSquare, href: "/admin/inquiries" },
    { label: "전체 수강", value: enrollmentsResult.count ?? 0, icon: GraduationCap },
    { label: "전체 후기", value: reviewsResult.count ?? 0, icon: Star },
    { label: "이번 달 신규 수강", value: thisMonthEnrollResult.count ?? 0, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">대시보드</h1>
      <p className="text-muted-foreground text-sm mb-8">Sellernote 교육 플랫폼 현황</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card className="col-span-1">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground font-medium">총 매출</p>
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">₩{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground font-medium">총 환불</p>
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <ArrowDownLeft size={16} className="text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">₩{totalRefund.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground font-medium">순 매출</p>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">
              ₩{(totalRevenue - totalRefund).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">월별 매출 (최근 6개월)</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={monthlyRevenue} />
        </CardContent>
      </Card>
    </div>
  );
}
