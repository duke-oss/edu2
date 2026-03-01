import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import { Users, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const [usersResult, coursesResult, inquiriesResult] = await Promise.all([
    db.from("users").select("id", { count: "exact", head: true }),
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "전체 사용자", value: usersResult.count ?? 0, icon: Users, href: "/admin/users" },
    { label: "전체 강의", value: coursesResult.count ?? 0, icon: BookOpen, href: "/admin/courses" },
    { label: "전체 문의", value: inquiriesResult.count ?? 0, icon: MessageSquare, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">대시보드</h1>
      <p className="text-muted-foreground text-sm mb-8">Sellernote 교육 플랫폼 현황</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
    </div>
  );
}
