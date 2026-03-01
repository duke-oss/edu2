import { requireAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("inquiries")
    .select("id, title, category, content, created_at, users(name, email)")
    .eq("id", id)
    .single();

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

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
