"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin-login");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left text-xs font-medium text-destructive hover:underline transition-colors"
    >
      로그아웃
    </button>
  );
}
