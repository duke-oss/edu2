import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    redirect("/verify-email?status=invalid");
  }

  const db = createAdminClient();

  const { data: record } = await db
    .from("verification_tokens")
    .select("identifier, expires")
    .eq("token", token)
    .maybeSingle();

  if (!record || !record.identifier.startsWith("verify:")) {
    redirect("/verify-email?status=invalid");
  }

  if (new Date(record.expires) < new Date()) {
    redirect("/verify-email?status=expired");
  }

  const email = record.identifier.replace("verify:", "");

  await db
    .from("users")
    .update({ email_verified: new Date().toISOString() })
    .eq("email", email);

  await db.from("verification_tokens").delete().eq("token", token);

  redirect("/verify-email?status=success");
}
