import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminCourseActions from "./AdminCourseActions";

export default async function AdminCoursesPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const { data } = await db
    .from("courses")
    .select("id, title, category, level, badge, instructor, price, students, created_at")
    .order("created_at", { ascending: false });

  const courses = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">강의 관리</h1>
          <p className="text-muted-foreground text-sm">총 {courses.length}개</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/courses/new" className="gap-1.5">
            <Plus size={14} /> 강의 추가
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">제목</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">카테고리</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">레벨</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">유형</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">가격</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">수강생</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">작업</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, i) => (
              <tr key={course.id} className={i !== 0 ? "border-t border-border" : ""}>
                <td className="px-4 py-3">
                  <p className="font-medium max-w-xs truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{course.category}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">{course.level}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={course.badge === "LIVE" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {course.badge}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{course.price}</td>
                <td className="px-4 py-3 text-muted-foreground">{course.students}</td>
                <td className="px-4 py-3 text-right">
                  <AdminCourseActions courseId={course.id} />
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  강의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
