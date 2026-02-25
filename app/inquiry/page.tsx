import Link from "next/link";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { Lock, PenLine } from "lucide-react";

const db = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function maskName(name: string | null, email: string | null) {
  const display = name || email?.split("@")[0] || "익명";
  if (display.length <= 1) return display + "*";
  return display[0] + "*".repeat(display.length - 1);
}

export const dynamic = "force-dynamic";

export default async function InquiryListPage() {
  const [session] = await Promise.all([auth()]);

  const { data: list } = await db
    .from("inquiries")
    .select("id, title, category, created_at, users(name, email)")
    .order("created_at", { ascending: false });

  const items = list ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">문의하기</h1>
          <p className="text-sm text-base-content/50 mt-1 flex items-center gap-1.5">
            <Lock size={12} /> 비밀번호로 보호된 비밀글입니다
          </p>
        </div>
        {session && (
          <Link href="/inquiry/new" className="btn btn-primary btn-sm gap-2">
            <PenLine size={14} />
            문의 작성
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-base-200 shadow-sm">
        <table className="table">
          <thead>
            <tr className="bg-base-200 text-base-content/60 text-xs uppercase tracking-wide">
              <th>제목</th>
              <th className="text-center w-28">카테고리</th>
              <th className="text-center w-20">작성자</th>
              <th className="text-center w-24">날짜</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-base-content/40 text-sm">
                  아직 문의가 없습니다
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover cursor-pointer">
                  <td>
                    <Link href={`/inquiry/${item.id}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                      <Lock size={12} className="text-base-content/30 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-primary badge-outline badge-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="text-center text-xs text-base-content/50">
                    {maskName(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (item.users as any)?.name ?? null,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (item.users as any)?.email ?? null
                    )}
                  </td>
                  <td className="text-center text-xs text-base-content/40">
                    {new Date(item.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
