import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일이 없습니다." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "지원하지 않는 이미지 형식입니다." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
  const uploadPath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(uploadPath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/courses/${fileName}` });
}
