import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export default async function AdminInquiriesPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const { data } = await db
    .from("inquiries")
    .select("id, title, category, created_at, users(name, email)")
    .order("created_at", { ascending: false });

  const inquiries = data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">문의 관리</h1>
      <p className="text-muted-foreground text-sm mb-6">총 {inquiries.length}건</p>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">제목</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">카테고리</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">작성자</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">작성일</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, i) => {
              const user = inquiry.users as { name?: string; email?: string } | null;
              return (
                <tr key={inquiry.id} className={i !== 0 ? "border-t border-border" : ""}>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{inquiry.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{inquiry.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user?.name ?? "—"}
                    <span className="text-xs ml-1">({user?.email ?? ""})</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="inline-flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                    >
                      상세보기 <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
