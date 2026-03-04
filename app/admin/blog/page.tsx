import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import BlogPostActions from "./BlogPostActions";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const db = createAdminClient();
  const { data: posts } = await db
    .from("blog_posts")
    .select("id, title, slug, category, published, author, read_time, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">블로그 관리</h1>
          <p className="text-muted-foreground text-sm">블로그 글을 작성하고 관리합니다</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new" className="gap-1.5">
            <Plus size={15} /> 새 글 작성
          </Link>
        </Button>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText size={40} className="mx-auto mb-4 opacity-30" />
          <p>등록된 블로그 글이 없습니다</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">제목</th>
                  <th className="px-4 py-3 text-left font-semibold">카테고리</th>
                  <th className="px-4 py-3 text-left font-semibold">슬러그</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                  <th className="px-4 py-3 text-left font-semibold">작성일</th>
                  <th className="px-4 py-3 text-left font-semibold">액션</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <span className="line-clamp-1">{post.title}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{post.slug}</td>
                    <td className="px-4 py-3">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "발행됨" : "임시저장"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <BlogPostActions postId={post.id} published={post.published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
