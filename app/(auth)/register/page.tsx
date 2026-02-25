"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Rocket } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "회원가입 중 오류가 발생했습니다.");
        return;
      }

      await signIn("credentials", { email, password, callbackUrl: "/" });
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-md w-full max-w-md">
      <div className="card-body gap-5">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content mx-auto mb-4">
            <Rocket size={22} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-base-content/60 text-sm mt-1">셀러노트와 함께 글로벌 무역을 시작하세요</p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="btn btn-outline w-full gap-3"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google로 시작하기
        </button>

        <div className="divider text-xs text-base-content/40">또는 이메일로 가입</div>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm py-2">
              {error}
            </div>
          )}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">이름 (선택)</legend>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">이메일</legend>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">비밀번호</legend>
            <input
              type="password"
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input input-bordered w-full"
            />
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading && <span className="loading loading-spinner loading-sm" />}
            회원가입
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="link link-primary font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
