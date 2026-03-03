import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import { GraduationCap, Award } from "lucide-react";
import CertificateActions from "./CertificateActions";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("certificates")
    .select("id, issued_at, users(name, email), courses(title, instructor, level, total_duration)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const user = data.users as { name?: string; email?: string } | null;
  const course = data.courses as {
    title?: string;
    instructor?: string;
    level?: string;
    total_duration?: string;
  } | null;

  const issuedDate = new Date(data.issued_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center py-12 px-4">
      <CertificateActions id={id} />

      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border-8 border-double border-primary/20 p-12 print:shadow-none print:border-8 print:max-w-full"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap size={32} className="text-primary" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            SELLERNOTE EDUCATION
          </p>
          <h1 className="text-3xl font-bold tracking-wide text-foreground">수강증</h1>
          <p className="text-sm text-muted-foreground mt-1">Certificate of Completion</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <Award size={20} className="text-primary/40" />
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="text-center space-y-4 mb-8">
          <p className="text-sm text-muted-foreground">본 수강증은</p>
          <p className="text-2xl font-bold text-foreground">{user?.name ?? "수강생"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-sm text-muted-foreground">님이</p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 my-4 text-left">
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">과정명</p>
            <p className="text-lg font-bold text-foreground">{course?.title}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>강사: {course?.instructor}</span>
              <span>•</span>
              <span>난이도: {course?.level}</span>
              <span>•</span>
              <span>총 {course?.total_duration}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">과정을 성공적으로 수료하였음을 증명합니다.</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <Award size={20} className="text-primary/40" />
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex items-end justify-between">
          <div className="text-sm text-muted-foreground">
            <p>발급일</p>
            <p className="font-semibold text-foreground">{issuedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Sellernote Education</p>
            <div className="text-xl font-bold text-primary" style={{ fontFamily: "cursive" }}>
              Sellernote
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">수강증 번호: {id}</p>
      </div>
    </div>
  );
}
