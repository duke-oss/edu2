"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paperclip, Trash2, Plus, Loader2, ExternalLink } from "lucide-react";

type Attachment = {
  id: string;
  name: string;
  file_url: string;
  lesson_id: string | null;
  file_size: number | null;
  created_at: string;
};

export default function AttachmentManager({
  courseId,
  initialAttachments,
}: {
  courseId: string;
  initialAttachments: Attachment[];
}) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, file_url: fileUrl }),
      });
      if (res.ok) {
        setName("");
        setFileUrl("");
        router.refresh();
        // Refetch attachments
        const updated = await fetch(`/api/admin/courses/${courseId}/attachments`).then((r) => r.json());
        setAttachments(updated);
      } else {
        const data = await res.json();
        setError(data.error ?? "오류가 발생했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("자료를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/courses/${courseId}/attachments/${id}`, { method: "DELETE" });
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Paperclip size={16} /> 강의 자료 관리
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing attachments */}
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 자료가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip size={14} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.name}</p>
                    <a
                      href={a.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      링크 <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-muted-foreground hover:text-destructive ml-3 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-border">
          <p className="text-sm font-medium flex items-center gap-1.5">
            <Plus size={14} /> 자료 추가
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="att-name">자료 이름</Label>
              <Input
                id="att-name"
                placeholder="강의 자료.pdf"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="att-url">파일 URL</Label>
              <Input
                id="att-url"
                placeholder="https://..."
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" size="sm" disabled={loading}>
            {loading && <Loader2 size={13} className="animate-spin" />}
            추가
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
