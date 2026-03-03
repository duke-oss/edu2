import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

function parseKRW(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();

  const [
    usersResult,
    coursesResult,
    inquiriesResult,
    enrollmentsResult,
    paymentsResult,
    refundsResult,
    reviewsResult,
  ] = await Promise.all([
    db.from("users").select("id", { count: "exact", head: true }),
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }),
    db.from("enrollments").select("id", { count: "exact", head: true }),
    db.from("payments").select("price, paid_at").eq("status", "paid"),
    db.from("payments").select("price").eq("status", "refunded"),
    db.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  // Total revenue
  const totalRevenue = (paymentsResult.data ?? []).reduce(
    (sum, p) => sum + parseKRW(p.price),
    0
  );
  const totalRefund = (refundsResult.data ?? []).reduce(
    (sum, p) => sum + parseKRW(p.price),
    0
  );

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    const revenue = (paymentsResult.data ?? [])
      .filter((p) => {
        const pd = new Date(p.paid_at);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((sum, p) => sum + parseKRW(p.price), 0);
    monthlyRevenue.push({ month: label, revenue });
  }

  // This month new enrollments
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: thisMonthEnrollments } = await db
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .gte("enrolled_at", thisMonthStart);

  return NextResponse.json({
    users: usersResult.count ?? 0,
    courses: coursesResult.count ?? 0,
    inquiries: inquiriesResult.count ?? 0,
    enrollments: enrollmentsResult.count ?? 0,
    reviews: reviewsResult.count ?? 0,
    totalRevenue,
    totalRefund,
    monthlyRevenue,
    thisMonthEnrollments: thisMonthEnrollments ?? 0,
  });
}
