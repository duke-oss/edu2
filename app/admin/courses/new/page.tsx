import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import CourseForm from "../CourseForm";

export default async function NewCoursePage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">강의 추가</h1>
      <p className="text-muted-foreground text-sm mb-8">새 강의를 등록합니다.</p>
      <CourseForm mode="new" />
    </div>
  );
}
