import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = ["전체", "무역 동향", "무역 서류", "통관·관세", "소싱 전략", "법규·규정", "실전 사례"];

async function getPosts(category?: string) {
  const db = createAdminClient();
  let query = db
    .from("blog_posts")
    .select("id, title, slug, category, excerpt, author, read_time, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPosts(category);
  const activeCategory = category ?? "전체";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-primary text-sm font-semibold mb-1">블로그</p>
        <h1 className="text-3xl font-black tracking-tight mb-3">실무에 바로 쓰는 무역 지식</h1>
        <p className="text-muted-foreground">현직 전문가가 정리한 수입·무역·물류 실무 인사이트</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <Link key={cat} href={cat === "전체" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}>
            <Badge
              variant={activeCategory === cat ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1 text-sm hover:opacity-80 transition-opacity"
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Post Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">아직 게시된 글이 없습니다</p>
          <p className="text-sm mt-1">곧 새로운 무역 인사이트를 업로드할 예정입니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="p-5 h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                </div>
                <h2 className="font-bold text-sm leading-snug flex-1 mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.read_time}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination hint */}
      {posts.length >= 20 && (
        <div className="mt-10 text-center">
          <Link href="/blog?page=2" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            더 보기 <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
