import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, Clock, ArrowRight, Sparkles, CalendarDays, User } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = ["전체", "무역 동향", "무역 서류", "통관·관세", "소싱 전략", "법규·규정", "실전 사례"];

function toneByCategory(category: string) {
  if (category.includes("통관")) return "from-cyan-600/70 via-sky-500/40 to-transparent";
  if (category.includes("서류")) return "from-violet-600/70 via-indigo-500/40 to-transparent";
  if (category.includes("소싱")) return "from-orange-600/70 via-rose-500/40 to-transparent";
  if (category.includes("법규")) return "from-emerald-600/70 via-teal-500/40 to-transparent";
  if (category.includes("사례")) return "from-blue-700/70 via-blue-500/40 to-transparent";
  return "from-slate-700/70 via-slate-500/40 to-transparent";
}

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
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_10%_0%,rgba(14,116,144,0.16),transparent),radial-gradient(40%_70%_at_90%_10%,rgba(30,64,175,0.18),transparent),linear-gradient(180deg,rgba(2,6,23,0.02),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
          <p className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            <Sparkles size={13} /> Trade Insights
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            실무에 바로 쓰는
            <br />
            수입·무역 인사이트
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            현업에서 부딪히는 의사결정을 더 빠르게 할 수 있도록, 데이터와 사례 중심으로 정리한 아티클을 제공합니다.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={cat === "전체" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}>
              <Badge
                variant={activeCategory === cat ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1 text-sm hover:opacity-85 transition-opacity"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">아직 게시된 글이 없습니다</p>
            <p className="text-sm mt-1">곧 새로운 무역 인사이트를 업로드할 예정입니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block">
                <Card className="relative overflow-hidden rounded-3xl border-border/80 p-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${toneByCategory(featured.category)}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/10 group-hover:from-black/35 group-hover:via-black/20 transition-colors" />
                  <div className="relative px-6 sm:px-8 py-8 sm:py-10 text-white">
                    <Badge className="mb-4 bg-white/90 text-slate-900 border-0 hover:bg-white">{featured.category}</Badge>
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3 max-w-3xl">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/80">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={13} /> {featured.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} /> {new Date(featured.created_at).toLocaleDateString("ko-KR")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} /> {featured.read_time}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                        읽어보기 <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <Card className="relative overflow-hidden p-5 h-full flex flex-col rounded-2xl border-border/80 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${toneByCategory(post.category)}`} />
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      </div>
                      <h3 className="font-bold text-base leading-snug flex-1 mb-4 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
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
          </div>
        )}
      </div>

      {posts.length >= 20 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/blog?page=2" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            더 보기 <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
