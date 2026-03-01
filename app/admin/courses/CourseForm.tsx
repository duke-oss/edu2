"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  video_id: string;
}

interface CourseFormData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  total_duration: string;
  thumbnail: string;
  badge: string;
  price: string;
  free: boolean;
  students: string;
  lessons: Lesson[];
}

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  mode: "new" | "edit";
}

const thumbnailOptions = [
  { label: "Blue", value: "from-blue-600 to-blue-400" },
  { label: "Violet", value: "from-violet-600 to-violet-400" },
  { label: "Emerald", value: "from-emerald-600 to-emerald-400" },
  { label: "Amber", value: "from-amber-500 to-amber-300" },
  { label: "Rose", value: "from-rose-600 to-rose-400" },
  { label: "Indigo", value: "from-indigo-600 to-indigo-400" },
];

const defaultLesson = (): Lesson => ({
  id: `l${Date.now()}`,
  title: "",
  duration: "",
  description: "",
  video_id: "",
});

export default function CourseForm({ initialData, mode }: CourseFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CourseFormData>({
    id: initialData?.id ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "",
    level: initialData?.level ?? "입문",
    instructor: initialData?.instructor ?? "",
    total_duration: initialData?.total_duration ?? "",
    thumbnail: initialData?.thumbnail ?? "from-blue-600 to-blue-400",
    badge: initialData?.badge ?? "VOD",
    price: initialData?.price ?? "",
    free: initialData?.free ?? false,
    students: initialData?.students ?? "0명",
    lessons: initialData?.lessons ?? [],
  });

  function updateField<K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addLesson() {
    setForm((prev) => ({ ...prev, lessons: [...prev.lessons, defaultLesson()] }));
  }

  function removeLesson(index: number) {
    setForm((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  }

  function updateLesson(index: number, key: keyof Lesson, value: string) {
    setForm((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l, i) => (i === index ? { ...l, [key]: value } : l)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = mode === "new" ? "/api/admin/courses" : `/api/admin/courses/${form.id}`;
    const method = mode === "new" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/courses");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "저장에 실패했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Basic info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">기본 정보</h2>

          {mode === "new" && (
            <div>
              <Label htmlFor="id" className="mb-1.5 block">강의 ID (영문, 하이픈)</Label>
              <Input
                id="id"
                value={form.id}
                onChange={(e) => updateField("id", e.target.value)}
                placeholder="e.g. import-business-az"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="title" className="mb-1.5 block">제목</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5 block">설명</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="mb-1.5 block">카테고리</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="e.g. 무역 실무"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5 block">레벨</Label>
              <Select value={form.level} onValueChange={(v) => updateField("level", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="입문">입문</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor" className="mb-1.5 block">강사</Label>
              <Input
                id="instructor"
                value={form.instructor}
                onChange={(e) => updateField("instructor", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="total_duration" className="mb-1.5 block">총 시간</Label>
              <Input
                id="total_duration"
                value={form.total_duration}
                onChange={(e) => updateField("total_duration", e.target.value)}
                placeholder="e.g. 8시간 30분"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">썸네일 색상</Label>
              <Select value={form.thumbnail} onValueChange={(v) => updateField("thumbnail", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {thumbnailOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block w-4 h-4 rounded bg-gradient-to-br ${opt.value}`} />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">유형</Label>
              <Select value={form.badge} onValueChange={(v) => updateField("badge", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOD">VOD</SelectItem>
                  <SelectItem value="LIVE">LIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="mb-1.5 block">가격</Label>
              <Input
                id="price"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="e.g. ₩149,000 또는 무료"
                required
              />
            </div>
            <div>
              <Label htmlFor="students" className="mb-1.5 block">수강생 수</Label>
              <Input
                id="students"
                value={form.students}
                onChange={(e) => updateField("students", e.target.value)}
                placeholder="e.g. 892명"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="free"
              checked={form.free}
              onChange={(e) => updateField("free", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="free">무료 강의</Label>
          </div>
        </CardContent>
      </Card>

      {/* Lessons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              레슨 ({form.lessons.length}개)
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addLesson} className="gap-1.5">
              <Plus size={13} /> 레슨 추가
            </Button>
          </div>

          <div className="space-y-4">
            {form.lessons.map((lesson, index) => (
              <div key={lesson.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">레슨 {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-destructive hover:text-destructive"
                    onClick={() => removeLesson(index)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1 block text-xs">제목</Label>
                    <Input
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, "title", e.target.value)}
                      placeholder="레슨 제목"
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">시간</Label>
                    <Input
                      value={lesson.duration}
                      onChange={(e) => updateLesson(index, "duration", e.target.value)}
                      placeholder="e.g. 30:00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block text-xs">설명 (선택)</Label>
                  <Input
                    value={lesson.description}
                    onChange={(e) => updateLesson(index, "description", e.target.value)}
                    placeholder="레슨 설명"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Video ID (선택)</Label>
                  <Input
                    value={lesson.video_id}
                    onChange={(e) => updateLesson(index, "video_id", e.target.value)}
                    placeholder="YouTube Video ID"
                  />
                </div>
              </div>
            ))}

            {form.lessons.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                레슨을 추가하세요.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : mode === "new" ? "강의 생성" : "변경 저장"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
