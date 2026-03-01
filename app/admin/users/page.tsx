import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const { data } = await db
    .from("users")
    .select("id, name, email, created_at, image, password")
    .order("created_at", { ascending: false });

  const users = (data ?? []).map((u) => ({
    ...u,
    login_method: u.password ? "이메일" : "Google",
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">사용자 관리</h1>
      <p className="text-muted-foreground text-sm mb-6">총 {users.length}명</p>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">이름</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">이메일</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">가입 방법</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} className={i !== 0 ? "border-t border-border" : ""}>
                <td className="px-4 py-3 font-medium">{user.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.login_method === "Google" ? "default" : "secondary"} className="text-xs">
                    {user.login_method}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  가입한 사용자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
