import Link from "next/link";
import { Play, BookOpen, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Enrollment = {
  id: string;
  enrolled_at: string;
  totalLessons: number;
  watchedLessons: number;
  courses: {
    id: string;
    title: string;
    thumbnail: string;
    level: string;
    badge: string;
    instructor: string;
    total_duration: string;
  } | null;
};

export default function CoursesSection({ enrollments }: { enrollments: Enrollment[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">수강 중인 강의가 없습니다</p>
        <p className="text-sm mt-1">강의를 신청해 학습을 시작하세요</p>
        <Button asChild className="mt-5" variant="outline">
          <Link href="/courses">강의 보러가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">총 {enrollments.length}개 강의 수강 중</p>
      {enrollments.map(({ id, enrolled_at, courses: course, totalLessons, watchedLessons }) => {
        if (!course) return null;
        const pct = totalLessons > 0 ? Math.round((watchedLessons / totalLessons) * 100) : 0;
        const isComplete = pct === 100;

        return (
          <Card key={id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                {/* Thumbnail */}
                <div
                  className={`w-24 sm:w-32 bg-gradient-to-br ${course.thumbnail} flex items-center justify-center shrink-0`}
                >
                  <Play size={24} className="text-white/60" />
                </div>

                {/* Info */}
                <div className="flex-1 px-5 py-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                    <Badge
                      className={`text-xs border-0 ${
                        course.badge === "LIVE"
                          ? "bg-red-500 text-white"
                          : "bg-black/10 text-foreground"
                      }`}
                    >
                      {course.badge}
                    </Badge>
                    {isComplete && (
                      <Badge className="text-xs border-0 bg-green-500 text-white">
                        수강 완료
                      </Badge>
                    )}
                  </div>

                  <p className="font-semibold text-sm leading-snug mb-1 truncate">{course.title}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={11} /> {course.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {course.total_duration}
                    </span>
                  </div>

                  {/* 수강률 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {watchedLessons} / {totalLessons}강 완료
                      </span>
                      <span
                        className={`font-semibold ${
                          isComplete ? "text-green-600" : "text-primary"
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    수강 신청일 {new Date(enrolled_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center pr-4 shrink-0">
                  <Button asChild size="sm" className="gap-1.5">
                    <Link href={`/courses/${course.id}/player`}>
                      <Play size={13} />
                      {isComplete ? "다시 보기" : "학습하기"}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
