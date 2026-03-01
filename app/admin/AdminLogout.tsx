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
      className="text-xs text-muted-foreground hover:text-destructive transition-colors text-left"
    >
      로그아웃
    </button>
  );
}
