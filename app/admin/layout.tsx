import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";
import { LayoutDashboard, Users, BookOpen, MessageSquare, Tag, FileText, MessagesSquare } from "lucide-react";
import AdminLogout from "./AdminLogout";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/courses", label: "강의 관리", icon: BookOpen },
  { href: "/admin/blog", label: "블로그 관리", icon: FileText },
  { href: "/admin/inquiries", label: "문의 관리", icon: MessageSquare },
  { href: "/admin/chat", label: "채팅 관리", icon: MessagesSquare },
  { href: "/admin/coupons", label: "쿠폰 관리", icon: Tag },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-login");
  const db = createAdminClient();

  const { count: unreadChatCount } = await db
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_type", "user")
    .is("read_at", null);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-background border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Admin</p>
          <p className="text-sm font-semibold mt-0.5 truncate">{admin.email}</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {href === "/admin/chat" && (unreadChatCount ?? 0) > 0 && (
                <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unreadChatCount! > 99 ? "99+" : unreadChatCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border space-y-2">
          <Link href="/" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← 사이트로 돌아가기
          </Link>
          <AdminLogout />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
