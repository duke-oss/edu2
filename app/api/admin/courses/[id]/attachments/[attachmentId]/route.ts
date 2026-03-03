import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { attachmentId } = await params;
  const db = createAdminClient();

  const { error } = await db
    .from("course_attachments")
    .delete()
    .eq("id", attachmentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
