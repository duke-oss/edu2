"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Eye, EyeOff } from "lucide-react";

const CATEGORIES = [
  "무역 동향",
  "무역 서류",
  "통관·관세",
  "소싱 전략",
  "법규·규정",
  "실전 사례",
];

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  author: string;
  read_time: string;
  thumbnail: string | null;
};

export default function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "무역 동향",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    published: post?.published ?? false,
    author: post?.author ?? "관리자",
    read_time: post?.read_time ?? "5분",
    thumbnail: post?.thumbnail ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      ...(isEdit ? {} : { slug: slugify(value) }),
    }));
  }

  async function handleSubmit(publish: boolean) {
    setLoading(true);
    setError("");

    const payload = { ...form, published: publish };
    const url = isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">제목 *</label>
          <input
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="블로그 글 제목을 입력하세요"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            슬러그 * <span className="text-xs text-muted-foreground font-normal">(URL 경로: /blog/슬러그)</span>
          </label>
          <input
            className="w-full border border-border rounded-md px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="my-blog-post"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>

        {/* Category & Read Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">카테고리</label>
            <select
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">읽기 시간</label>
            <input
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="5분"
              value={form.read_time}
              onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
            />
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">작성자</label>
          <input
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="관리자"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            요약 <span className="text-xs text-muted-foreground font-normal">(목록에 표시되는 짧은 설명)</span>
          </label>
          <textarea
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={2}
            placeholder="글의 핵심 내용을 1-2문장으로 요약해주세요"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            본문 * <span className="text-xs text-muted-foreground font-normal">(줄바꿈으로 단락 구분)</span>
          </label>
          <textarea
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y font-mono leading-relaxed"
            rows={20}
            placeholder="블로그 본문을 입력하세요..."
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="gap-1.5"
          >
            <Eye size={14} />
            {isEdit ? "저장 및 발행" : "발행하기"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="gap-1.5"
          >
            <EyeOff size={14} />
            임시저장
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
          >
            취소
          </Button>
          {isEdit && form.published && (
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground text-xs" asChild>
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <Save size={12} className="mr-1" /> 미리보기
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
