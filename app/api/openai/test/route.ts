import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const prompt =
    typeof body?.prompt === "string" && body.prompt.trim().length > 0
      ? body.prompt.trim()
      : "한 줄로 API 연결 성공 메시지를 한국어로 작성해줘.";

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      ok: true,
      model: response.model,
      text: response.output_text,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OpenAI 호출 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
