import { requireAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import BlogPostForm from "../BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const db = createAdminClient();
  const { data: post } = await db.from("blog_posts").select("*").eq("id", id).single();
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">글 수정</h1>
        <p className="text-muted-foreground text-sm">블로그 글을 수정합니다</p>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
