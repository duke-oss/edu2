"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function BlogPostActions({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    setDeleting(true);
    await fetch(`/api/admin/blog/${postId}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" size="sm" asChild className="h-7 px-2">
        <Link href={`/admin/blog/${postId}`}>
          <Pencil size={13} />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}
