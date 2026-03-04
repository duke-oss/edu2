import Link from "next/link";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { Lock, PenLine, ChevronRight, MessageSquareMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type InquiryRow = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  users: { name?: string | null; email?: string | null } | null;
};

function maskName(name: string | null | undefined, email: string | null | undefined) {
  const display = name || email?.split("@")[0] || "익명";
  if (display.length <= 1) return `${display}*`;
  return `${display[0]}${"*".repeat(display.length - 1)}`;
}

export const dynamic = "force-dynamic";

export default async function InquiryListPage() {
  const session = await auth();

  const { data: list } = await db
    .from("inquiries")
    .select("id, title, category, created_at, users(name, email)")
    .order("created_at", { ascending: false });

  const items = (list ?? []) as InquiryRow[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">Support Center</p>
            <h1 className="text-3xl font-black tracking-tight">문의하기</h1>
            <p className="text-sm text-muted-foreground mt-2">
              궁금한 내용을 남겨주시면 확인 후 빠르게 답변드리겠습니다.
            </p>
          </div>

          {session ? (
            <Button asChild className="gap-2">
              <Link href="/inquiry/new">
                <PenLine size={15} /> 문의 작성
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="gap-2">
              <Link href="/login?callbackUrl=/inquiry/new">
                <PenLine size={15} /> 로그인 후 문의 작성
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/35 text-xs font-semibold text-muted-foreground">
          <span>제목</span>
          <span className="w-24 text-center">카테고리</span>
          <span className="w-24 text-center">작성자</span>
          <span className="w-24 text-center">작성일</span>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquareMore size={34} className="mx-auto mb-3 text-muted-foreground/60" />
            <p className="font-medium">아직 문의가 없습니다</p>
            <p className="text-sm text-muted-foreground mt-1">첫 문의를 작성해보세요.</p>
          </div>
        ) : (
          items.map((item, i) => (
            <Link
              key={item.id}
              href={`/inquiry/${item.id}`}
              className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 hover:bg-muted/20 transition-colors ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium min-w-0">
                <Lock size={13} className="text-muted-foreground shrink-0" />
                <span className="truncate">{item.title}</span>
                <ChevronRight size={14} className="text-muted-foreground/50 shrink-0 ml-auto" />
              </span>

              <span className="w-24 flex justify-center items-center">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </span>

              <span className="w-24 text-center text-xs text-muted-foreground self-center">
                {maskName(item.users?.name ?? null, item.users?.email ?? null)}
              </span>

              <span className="w-24 text-center text-xs text-muted-foreground self-center">
                {new Date(item.created_at).toLocaleDateString("ko-KR")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
