"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminCourseActions({ courseId }: { courseId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("이 강의를 삭제하시겠습니까? 레슨도 함께 삭제됩니다.")) return;

    const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "삭제에 실패했습니다.");
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="sm" className="h-7 px-2">
        <Link href={`/admin/courses/${courseId}/edit`}>
          <Pencil size={13} />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-destructive hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}
