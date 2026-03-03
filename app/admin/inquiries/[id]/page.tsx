import { requireAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReplyForm from "./ReplyForm";

export const dynamic = "force-dynamic";

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const db = createAdminClient();

  const [{ data, error }, { data: replies }] = await Promise.all([
    db
      .from("inquiries")
      .select("id, title, category, content, created_at, users(name, email)")
      .eq("id", id)
      .single(),
    db
      .from("inquiry_replies")
      .select("id, content, created_at")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (error || !data) notFound();

  const user = data.users as { name?: string; email?: string } | null;

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
          <Link href="/admin/inquiries">
            <ChevronLeft size={14} /> 목록으로
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-1">{data.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">{data.category}</Badge>
          <span>{user?.name ?? "—"} ({user?.email ?? ""})</span>
          <span>{new Date(data.created_at).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.content}</p>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare size={18} />
          답변 {(replies ?? []).length > 0 ? `(${replies!.length})` : ""}
        </h2>
        {(replies ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 답변이 없습니다.</p>
        ) : (
          (replies ?? []).map((reply) => (
            <Card key={reply.id} className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary">관리자 답변</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Separator className="mb-6" />

      {/* Reply Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">답변 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyForm inquiryId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
