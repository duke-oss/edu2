import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import ProfileSection from "./ProfileSection";
import CoursesSection from "./CoursesSection";
import InquiriesSection from "./InquiriesSection";
import PasswordSection from "./PasswordSection";

export const dynamic = "force-dynamic";

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
  } | null;
  totalLessons: number;
  watchedLessons: number;
};

type InquiryRow = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

const TABS = [
  { id: "profile", label: "프로필" },
  { id: "courses", label: "내 강의" },
  { id: "inquiries", label: "내 문의" },
  { id: "password", label: "비밀번호 변경" },
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
      .select("id, enrolled_at, courses(id, title, thumbnail, level, badge, instructor, total_duration)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });

    const raw = (data ?? []) as unknown as EnrollmentRow[];

    if (raw.length > 0) {
      const courseIds = raw.map((e) => e.courses?.id).filter(Boolean) as string[];

      // 강의별 전체 레슨 수
      const { data: lessonCounts } = await db
        .from("lessons")
        .select("course_id")
        .in("course_id", courseIds);

      // 유저가 시청한 레슨 수
      const { data: watchedCounts } = await db
        .from("lesson_progress")
        .select("course_id")
        .eq("user_id", userId)
        .in("course_id", courseIds);

      const totalMap: Record<string, number> = {};
      const watchedMap: Record<string, number> = {};
      for (const l of lessonCounts ?? []) {
        totalMap[l.course_id] = (totalMap[l.course_id] ?? 0) + 1;
      }
      for (const p of watchedCounts ?? []) {
        watchedMap[p.course_id] = (watchedMap[p.course_id] ?? 0) + 1;
      }

      enrollments = raw.map((e) => ({
        ...e,
        totalLessons: totalMap[e.courses?.id ?? ""] ?? 0,
        watchedLessons: watchedMap[e.courses?.id ?? ""] ?? 0,
      }));
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">마이페이지</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {user?.name ?? user?.email ?? ""}
      </p>

      {/* Tab Nav */}
      <div className="flex gap-0 border-b border-border mb-8">
        {visibleTabs.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard?tab=${t.id}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
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
