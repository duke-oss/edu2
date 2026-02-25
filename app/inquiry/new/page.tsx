"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "배송/물류 문의",
  "결제/환불 문의",
  "서비스 이용 문의",
  "기술 문제",
  "기타",
];

export default function InquiryNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", password: "", category: "", content: "" });
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
      if (!res.ok) { setError(data.error ?? "오류가 발생했습니다."); return; }
      setSuccess(true);
      setTimeout(() => router.push("/inquiry"), 2000);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-bold mb-2">문의가 접수되었습니다</h2>
        <p className="text-base-content/50 text-sm">잠시 후 목록으로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/inquiry" className="btn btn-ghost btn-sm gap-1.5 pl-0 mb-3">
          <ArrowLeft size={15} /> 목록으로
        </Link>
        <h1 className="text-2xl font-bold mb-1">문의 작성</h1>
        <p className="text-sm text-base-content/50 flex items-center gap-1.5">
          <Lock size={13} /> 비밀번호로 보호되는 비밀글입니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {error}
          </div>
        )}

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            제목 <span className="text-error">*</span>
          </legend>
          <input
            type="text" name="title" value={form.title} onChange={handleChange}
            placeholder="문의 제목을 입력하세요" required
            className="input input-bordered w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            카테고리 <span className="text-error">*</span>
          </legend>
          <select
            name="category" value={form.category} onChange={handleChange} required
            className="select select-bordered w-full"
          >
            <option value="">카테고리를 선택하세요</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            문의 내용 <span className="text-error">*</span>
          </legend>
          <textarea
            name="content" value={form.content} onChange={handleChange}
            placeholder="문의 내용을 자세히 입력해주세요" required rows={7}
            className="textarea textarea-bordered w-full resize-none"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            비밀번호 <span className="text-error">*</span>
          </legend>
          <p className="text-xs text-base-content/40 mb-2 -mt-1">내용 확인 시 사용할 비밀번호를 설정하세요</p>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <Lock size={14} className="text-base-content/30 shrink-0" />
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="비밀번호 설정 (4자 이상)" required minLength={4}
              className="grow"
            />
          </label>
        </fieldset>

        <button
          type="submit" disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading && <span className="loading loading-spinner loading-sm" />}
          문의 접수하기
        </button>
      </form>
    </div>
  );
}
