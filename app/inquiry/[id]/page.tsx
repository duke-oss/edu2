"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, AlertCircle, Loader2, ArrowLeft, Tag, Calendar, User } from "lucide-react";
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

  // 내용 확인 화면
  if (detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/inquiry"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft size={15} /> 목록으로
        </Link>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              <Tag size={11} /> {detail.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <User size={11} />
              {detail.users?.name || detail.users?.email?.split("@")[0] || "익명"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {new Date(detail.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-xl font-bold text-gray-900 mb-6 pb-6 border-b border-gray-100">
            {detail.title}
          </h1>

          {/* 내용 */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
            {detail.content}
          </p>
        </div>

        <button
          onClick={() => router.push("/inquiry")}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 비밀번호 입력 화면
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Link
        href="/inquiry"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8"
      >
        <ArrowLeft size={15} /> 목록으로
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">비밀글입니다</h2>
        <p className="text-sm text-gray-500 mb-6">작성 시 설정한 비밀번호를 입력하세요</p>

        <form onSubmit={handleVerify} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-left">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
            autoFocus
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            확인
          </button>
        </form>
      </div>
    </div>
  );
}
