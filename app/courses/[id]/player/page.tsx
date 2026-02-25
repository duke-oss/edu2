import { notFound } from "next/navigation";
import { getCourse } from "@/app/data/courses";
import CoursePlayer from "../CoursePlayer";

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  return <CoursePlayer course={course} />;
}
