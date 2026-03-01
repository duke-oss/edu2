import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { LayoutDashboard, Users, BookOpen, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/courses", label: "강의 관리", icon: BookOpen },
  { href: "/admin/inquiries", label: "문의 관리", icon: MessageSquare },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-background border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Admin</p>
          <p className="text-sm font-semibold mt-0.5 truncate">{session.user?.email}</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
