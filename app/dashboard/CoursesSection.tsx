import Link from "next/link";
import {
  Play,
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  Download,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RefundButton from "./RefundButton";
import IssueCertificateButton from "./IssueCertificateButton";
import { getCourseThumbnailRenderProps } from "@/lib/courseThumbnail";

type Enrollment = {
  id: string;
  enrolled_at: string;
  totalLessons: number;
  watchedLessons: number;
  canRefund: boolean;
  certificateId: string | null;
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
};

export default function CoursesSection({ enrollments }: { enrollments: Enrollment[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
        <p className="font-semibold">수강 중인 강의가 없습니다</p>
        <p className="text-sm mt-1 text-muted-foreground">강의를 결제하고 학습을 시작해보세요</p>
        <Button asChild className="mt-5" variant="outline">
          <Link href="/courses">강의 보러가기</Link>
        </Button>
      </div>
    );
  }

  const normalized = enrollments
    .map((e) => {
      const pct = e.totalLessons > 0 ? Math.round((e.watchedLessons / e.totalLessons) * 100) : 0;
      return { ...e, pct, isComplete: pct === 100 };
    })
    .filter((e) => e.courses);

  const completeCount = normalized.filter((e) => e.isComplete).length;
  const inProgressCount = normalized.length - completeCount;
  const avgProgress = normalized.length
    ? Math.round(normalized.reduce((sum, e) => sum + e.pct, 0) / normalized.length)
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">전체 수강 강의</p>
          <p className="text-2xl font-bold">{normalized.length}개</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">완료 강의</p>
          <p className="text-2xl font-bold text-green-600">{completeCount}개</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">평균 진도율</p>
          <p className="text-2xl font-bold text-primary">{avgProgress}%</p>
        </div>
      </div>

      {normalized.map(({ id, enrolled_at, courses: course, canRefund, certificateId, pct, isComplete, watchedLessons, totalLessons }) => {
        if (!course) return null;
        const thumb = getCourseThumbnailRenderProps(course.thumbnail, course.title);

        return (
          <Card key={id} className="overflow-hidden rounded-2xl border-border/80 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <Link href={`/courses/${course.id}`} className="flex flex-1 min-w-0 hover:bg-muted/20 transition-colors">
                  <div
                    className={`w-full lg:w-44 h-36 lg:h-auto relative shrink-0 ${thumb.className}`}
                    style={thumb.style}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge variant="secondary" className="text-[11px] bg-white/90 text-foreground">
                        {course.level}
                      </Badge>
                      <Badge className={`text-[11px] border-0 ${course.badge === "LIVE" ? "bg-red-500 text-white" : "bg-black/60 text-white"}`}>
                        {course.badge}
                      </Badge>
                    </div>
                    <div className="absolute right-3 bottom-3 text-white/90">
                      <Play size={18} />
                    </div>
                  </div>

                  <div className="flex-1 px-5 py-4 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-semibold text-base leading-snug line-clamp-2">{course.title}</p>
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-1 shrink-0">
                          <CheckCircle2 size={12} /> 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-1 shrink-0">
                          <TrendingUp size={12} /> 진행중
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap size={12} /> {course.instructor}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {course.total_duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} /> {new Date(enrolled_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {watchedLessons} / {totalLessons}강 완료
                        </span>
                        <span className={`font-semibold ${isComplete ? "text-green-600" : "text-primary"}`}>{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="w-full lg:w-56 border-t lg:border-t-0 lg:border-l border-border bg-muted/20 px-4 py-4 flex lg:flex-col gap-2 justify-end">
                  <Button asChild size="sm" className="gap-1.5 flex-1 lg:flex-none">
                    <Link href={`/courses/${course.id}/player`}>
                      <Play size={13} />
                      {isComplete ? "다시 보기" : "학습하기"}
                    </Link>
                  </Button>

                  {isComplete && certificateId && (
                    <Button asChild size="sm" variant="outline" className="gap-1.5 flex-1 lg:flex-none">
                      <Link href={`/certificate/${certificateId}`} target="_blank">
                        <Award size={13} /> 수강증 보기
                      </Link>
                    </Button>
                  )}

                  {isComplete && certificateId && (
                    <Button asChild size="sm" variant="outline" className="gap-1.5 flex-1 lg:flex-none">
                      <a href={`/api/certificate/${certificateId}/download`}>
                        <Download size={13} /> 다운로드
                      </a>
                    </Button>
                  )}

                  {isComplete && !certificateId && <IssueCertificateButton courseId={course.id} />}

                  {!isComplete && (
                    <Button asChild size="sm" variant="ghost" className="gap-1 text-muted-foreground hidden lg:inline-flex">
                      <Link href={`/courses/${course.id}`}>
                        강의 상세 <ArrowRight size={13} />
                      </Link>
                    </Button>
                  )}

                  {canRefund && !course.free && <RefundButton enrollmentId={id} />}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {inProgressCount > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          진행 중 강의 {inProgressCount}개. 학습하기 버튼으로 바로 이어서 수강할 수 있습니다.
        </p>
      )}
    </div>
  );
}
