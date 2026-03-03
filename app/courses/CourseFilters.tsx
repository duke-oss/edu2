"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LEVELS = ["입문", "초급", "중급", "고급"];
const CATEGORIES = ["입문", "무역 실무", "통관/관세", "물류/배송", "소싱"];
const PRICES = [
  { label: "전체", value: "" },
  { label: "무료", value: "free" },
  { label: "유료", value: "paid" },
];

export default function CourseFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);

    startTransition(() => {
      const query = next.toString();
      router.push(query ? `/courses?${query}` : "/courses");
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("search", search.trim());
  }

  function clearAll() {
    setSearch("");
    startTransition(() => router.push("/courses"));
  }

  const hasFilters =
    !!params.get("search") ||
    !!params.get("level") ||
    !!params.get("category") ||
    !!params.get("price");

  const activeFilterCount = [
    params.get("level"),
    params.get("category"),
    params.get("price"),
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-3">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-1.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="강의명으로 검색하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button type="submit" variant="secondary" className="h-9 px-3">
          검색
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 gap-1.5" onClick={() => setIsFilterOpen(true)}>
          <SlidersHorizontal size={14} />
          필터
          {activeFilterCount > 0 && <span className="text-xs text-primary">({activeFilterCount})</span>}
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clearAll} className="gap-1.5 h-9 px-3">
            <X size={14} /> 초기화
          </Button>
        )}
      </form>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-1">
          {params.get("search") && <Badge variant="secondary">검색: {params.get("search")}</Badge>}
          {params.get("level") && <Badge variant="secondary">난이도: {params.get("level")}</Badge>}
          {params.get("category") && <Badge variant="secondary">카테고리: {params.get("category")}</Badge>}
          {params.get("price") && <Badge variant="secondary">가격: {params.get("price") === "free" ? "무료" : "유료"}</Badge>}
        </div>
      )}

      {isPending && <p className="text-xs text-muted-foreground animate-pulse">필터 적용 중...</p>}

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] p-4" role="dialog" aria-modal="true">
          <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-semibold">필터 설정</h2>
              <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => setIsFilterOpen(false)}>
                닫기
              </Button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <section className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">난이도</p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => {
                    const active = params.get("level") === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateParam("level", active ? "" : level)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-muted-foreground/60"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => {
                    const active = params.get("category") === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => updateParam("category", active ? "" : category)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-muted-foreground/60"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">가격</p>
                <div className="flex flex-wrap gap-2">
                  {PRICES.map((p) => {
                    const active = (params.get("price") ?? "") === p.value;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => updateParam("price", p.value)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-muted-foreground/60"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                적용하고 닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
