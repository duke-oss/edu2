import Link from "next/link";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { Lock, PenLine, ChevronRight } from "lucide-react";

// 모듈 레벨로 올려 웜 컨테이너에서 재사용
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
  const [session] = await Promise.all([
    auth(),
  ]);

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
          <h1 className="text-2xl font-bold text-gray-900">문의하기</h1>
          <p className="text-sm text-gray-500 mt-1">비밀번호로 보호된 비밀글입니다</p>
        </div>
        {session && (
          <Link
            href="/inquiry/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <PenLine size={15} />
            문의 작성
          </Link>
        )}
      </div>

      {/* List */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>제목</span>
          <span className="w-24 text-center">카테고리</span>
          <span className="w-20 text-center">작성자</span>
          <span className="w-24 text-center">날짜</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            아직 문의가 없습니다
          </div>
        ) : (
          items.map((item, i) => (
            <Link
              key={item.id}
              href={`/inquiry/${item.id}`}
              className={`w-full grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors ${
                i !== 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900 truncate">
                <Lock size={13} className="text-gray-400 shrink-0" />
                {item.title}
                <ChevronRight size={14} className="text-gray-300 shrink-0 ml-auto" />
              </span>
              <span className="w-24 text-center text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-1 self-center">
                {item.category}
              </span>
              <span className="w-20 text-center text-xs text-gray-500 self-center">
                {maskName(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item.users as any)?.name ?? null,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item.users as any)?.email ?? null
                )}
              </span>
              <span className="w-24 text-center text-xs text-gray-400 self-center">
                {new Date(item.created_at).toLocaleDateString("ko-KR")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
