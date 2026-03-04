import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const db = createAdminClient();
  const { data } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data ?? null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-8 gap-1 text-muted-foreground -ml-2" asChild>
        <Link href="/blog">
          <ArrowLeft size={14} /> 블로그 목록
        </Link>
      </Button>

      {/* Meta */}
      <div className="mb-6">
        <Badge variant="secondary" className="mb-3">{post.category}</Badge>
        <h1 className="text-2xl font-black leading-snug mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-muted-foreground text-base leading-relaxed mb-4">{post.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
          <span className="flex items-center gap-1.5">
            <User size={13} /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {new Date(post.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {post.read_time}
          </span>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
        {post.content.split("\n").map((line: string, i: number) =>
          line.trim() === "" ? (
            <br key={i} />
          ) : (
            <p key={i}>{line}</p>
          )
        )}
      </article>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href="/blog">
            <ArrowLeft size={14} /> 다른 글 보기
          </Link>
        </Button>
      </div>
    </div>
  );
}
