import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { User, PlayCircle, MessageSquare, LockKeyhole } from "lucide-react";
import ProfileSection from "./ProfileSection";
import CoursesSection from "./CoursesSection";
import InquiriesSection from "./InquiriesSection";
import PasswordSection from "./PasswordSection";

export const dynamic = "force-dynamic";
const NOW_MS = Date.now();

type EnrollmentRow = {
  id: string;
  enrolled_at: string;
  courses: {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    badge: string;
    instructor: string;
    total_duration: string;
    free: boolean;
  } | null;
  totalLessons: number;
  watchedLessons: number;
  canRefund: boolean;
  certificateId: string | null;
};

type InquiryRow = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

const TABS = [
  { id: "profile", label: "프로필", icon: User },
  { id: "courses", label: "내 강의", icon: PlayCircle },
  { id: "inquiries", label: "내 문의", icon: MessageSquare },
  { id: "password", label: "비밀번호 변경", icon: LockKeyhole },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const { tab = "profile" } = await searchParams;
  const db = createAdminClient();
  const userId = session.user.id;

  const { data: user } = await db
    .from("users")
    .select("id, name, email, image, created_at, password")
    .eq("id", userId)
    .single();

  const hasPassword = !!user?.password;
  const visibleTabs = TABS.filter((t) => t.id !== "password" || hasPassword);
  const activeTab = visibleTabs.find((t) => t.id === tab)?.id ?? "profile";

  let enrollments: EnrollmentRow[] = [];
  let inquiries: InquiryRow[] = [];

  if (activeTab === "courses") {
    const { data } = await db
      .from("enrollments")
      .select("id, enrolled_at, courses(id, title, thumbnail, level, badge, instructor, total_duration, free)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });

    const raw = (data ?? []) as unknown as EnrollmentRow[];

    if (raw.length > 0) {
      const courseIds = raw.map((e) => e.courses?.id).filter(Boolean) as string[];

      const { data: lessonCounts } = await db
        .from("lessons")
        .select("course_id")
        .in("course_id", courseIds);

      const [{ data: watchedCounts }, { data: certs }] = await Promise.all([
        db.from("lesson_progress").select("course_id").eq("user_id", userId).in("course_id", courseIds),
        db.from("certificates").select("id, course_id").eq("user_id", userId).in("course_id", courseIds),
      ]);

      const totalMap: Record<string, number> = {};
      const watchedMap: Record<string, number> = {};
      const certMap: Record<string, string> = {};

      for (const l of lessonCounts ?? []) totalMap[l.course_id] = (totalMap[l.course_id] ?? 0) + 1;
      for (const p of watchedCounts ?? []) watchedMap[p.course_id] = (watchedMap[p.course_id] ?? 0) + 1;
      for (const c of certs ?? []) certMap[c.course_id] = c.id;

      enrollments = raw.map((e) => {
        const watched = watchedMap[e.courses?.id ?? ""] ?? 0;
        const diffDays = (NOW_MS - new Date(e.enrolled_at).getTime()) / (1000 * 60 * 60 * 24);
        return {
          ...e,
          totalLessons: totalMap[e.courses?.id ?? ""] ?? 0,
          watchedLessons: watched,
          canRefund: watched === 0 && diffDays <= 7,
          certificateId: certMap[e.courses?.id ?? ""] ?? null,
        };
      });
    }
  }

  if (activeTab === "inquiries") {
    const { data } = await db
      .from("inquiries")
      .select("id, title, category, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    inquiries = (data ?? []) as InquiryRow[];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">마이페이지</h1>
        <p className="text-sm text-muted-foreground mt-1">프로필, 수강 현황, 문의 내역, 계정 보안을 한곳에서 관리하세요.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-2 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <Link
                key={t.id}
                href={`/dashboard?tab=${t.id}`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      {activeTab === "profile" && (
        <ProfileSection
          user={{
            id: user?.id ?? "",
            name: user?.name ?? null,
            email: user?.email ?? "",
            image: user?.image ?? null,
            createdAt: user?.created_at ?? "",
            hasPassword,
          }}
        />
      )}
      {activeTab === "courses" && <CoursesSection enrollments={enrollments} />}
      {activeTab === "inquiries" && <InquiriesSection inquiries={inquiries} />}
      {activeTab === "password" && hasPassword && <PasswordSection />}
    </div>
  );
}
