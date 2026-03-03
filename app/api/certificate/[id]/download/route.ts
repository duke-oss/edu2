import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = createAdminClient();

  const { data, error } = await db
    .from("certificates")
    .select("id, issued_at, users(name, email), courses(title, instructor, level, total_duration)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const user = data.users as { name?: string; email?: string } | null;
  const course = data.courses as {
    title?: string;
    instructor?: string;
    level?: string;
    total_duration?: string;
  } | null;

  const issuedDate = new Date(data.issued_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Certificate ${id}</title>
  <style>
    body { font-family: Georgia, serif; background: #f6f7f9; margin: 0; padding: 24px; }
    .wrap { max-width: 900px; margin: 0 auto; background: #fff; border: 8px double #d8b45f; padding: 40px; border-radius: 12px; }
    .center { text-align: center; }
    .muted { color: #666; }
    .title { font-size: 38px; font-weight: 700; margin: 12px 0 4px; }
    .name { font-size: 28px; font-weight: 700; margin: 14px 0 6px; }
    .course-box { margin: 18px 0; border: 1px solid #ead8a2; background: #fffaf0; border-radius: 8px; padding: 16px; }
    .small { font-size: 13px; }
    .foot { margin-top: 28px; display: flex; justify-content: space-between; }
    .id { margin-top: 26px; font-size: 12px; color: #8a8a8a; text-align: center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="center muted small">Sellernote Education Platform</div>
    <div class="center title">수강증</div>
    <div class="center muted">Certificate of Completion</div>

    <div class="center muted" style="margin-top:18px;">본 수강증은</div>
    <div class="center name">${user?.name ?? "수강생"}</div>
    <div class="center muted small">${user?.email ?? ""}</div>
    <div class="center muted" style="margin-top:10px;">님이</div>

    <div class="course-box">
      <div class="small muted">과정명</div>
      <div style="font-size:22px; font-weight:700; margin-top:6px;">${course?.title ?? ""}</div>
      <div class="small muted" style="margin-top:10px;">
        강사: ${course?.instructor ?? "-"} | 난이도: ${course?.level ?? "-"} | 총 ${course?.total_duration ?? "-"}
      </div>
    </div>

    <div class="center muted">과정을 성공적으로 수료하였음을 증명합니다.</div>

    <div class="foot">
      <div>
        <div class="small muted">발급일</div>
        <div>${issuedDate}</div>
      </div>
      <div style="text-align:right;">
        <div class="small muted">Sellernote Education</div>
        <div style="font-size:24px; color:#a67700; font-family:cursive;">Sellernote</div>
      </div>
    </div>

    <div class="id">수강증 번호: ${id}</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="certificate-${id}.html"`,
      "Cache-Control": "no-store",
    },
  });
}

