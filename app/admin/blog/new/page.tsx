import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import BlogPostForm from "../BlogPostForm";

export default async function NewBlogPostPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">새 글 작성</h1>
        <p className="text-muted-foreground text-sm">블로그 글을 작성합니다</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
