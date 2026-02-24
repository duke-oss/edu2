"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, CheckCircle, Loader2, ChevronDown } from "lucide-react";

const CATEGORIES = [
  "배송/물류 문의",
  "결제/환불 문의",
  "서비스 이용 문의",
  "기술 문제",
  "기타",
];

export default function InquiryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    password: "",
    category: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">문의가 접수되었습니다</h2>
        <p className="text-gray-500 text-sm">빠른 시일 내에 답변 드리겠습니다. 잠시 후 메인으로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">문의하기</h1>
        <p className="text-gray-500 text-sm flex items-center gap-1.5">
          <Lock size={13} />
          비밀글로 작성됩니다. 설정한 비밀번호로만 내용을 확인할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="문의 제목을 입력하세요"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            문의 카테고리 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">카테고리를 선택하세요</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 문의 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            문의 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="문의 내용을 자세히 입력해주세요"
            required
            rows={7}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">나중에 문의 내용을 확인할 때 사용할 비밀번호를 설정하세요</p>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호 설정 (4자 이상)"
              required
              minLength={4}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors mt-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          문의 접수하기
        </button>
      </form>
    </div>
  );
}
