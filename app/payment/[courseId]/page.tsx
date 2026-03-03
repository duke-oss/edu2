import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import PaymentClient from "./PaymentClient";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/payment/${courseId}`);
  }

  const db = createAdminClient();

  const { data: course, error } = await db
    .from("courses")
    .select("id, title, thumbnail, level, badge, instructor, total_duration, price, free")
    .eq("id", courseId)
    .single();

  if (error || !course) notFound();

  // 이미 수강 중이면 대시보드로
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("course_id", courseId)
    .single();

  if (enrollment) redirect("/dashboard?tab=courses");

  const { data: user } = await db
    .from("users")
    .select("name, email")
    .eq("id", session.user.id)
    .single();

  return (
    <PaymentClient
      course={course}
      user={{
        name: user?.name ?? null,
        email: user?.email ?? session.user.email ?? "",
      }}
    />
  );
}
