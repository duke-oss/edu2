"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, ArrowLeft, Tag, Calendar, User } from "lucide-react";
import Link from "next/link";

interface InquiryDetail {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
  users: { name: string | null; email: string | null } | null;
}

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<InquiryDetail | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiry/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDetail(data);
    } finally {
      setLoading(false);
    }
  }

  /* 내용 확인 화면 */
  if (detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/inquiry" className="btn btn-ghost btn-sm gap-1.5 pl-0 mb-6">
          <ArrowLeft size={15} /> 목록으로
        </Link>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body gap-5">
            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary gap-1">
                <Tag size={10} /> {detail.category}
              </span>
              <span className="badge badge-ghost gap-1 text-base-content/50">
                <User size={10} />
                {detail.users?.name || detail.users?.email?.split("@")[0] || "익명"}
              </span>
              <span className="badge badge-ghost gap-1 text-base-content/50">
                <Calendar size={10} />
                {new Date(detail.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {/* 제목 */}
            <h1 className="text-xl font-bold pb-5 border-b border-base-200">
              {detail.title}
            </h1>

            {/* 내용 */}
            <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap text-sm">
              {detail.content}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/inquiry")}
          className="btn btn-ghost btn-sm mt-4 gap-1.5 pl-0"
        >
          <ArrowLeft size={14} /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  /* 비밀번호 입력 화면 */
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Link href="/inquiry" className="btn btn-ghost btn-sm gap-1.5 pl-0 mb-8">
        <ArrowLeft size={15} /> 목록으로
      </Link>

      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">비밀글입니다</h2>
            <p className="text-sm text-base-content/50 mt-1">작성 시 설정한 비밀번호를 입력하세요</p>
          </div>

          <form onSubmit={handleVerify} className="w-full flex flex-col gap-3">
            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm py-2">
                {error}
              </div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              autoFocus
              className="input input-bordered w-full text-center"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              확인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
