"use client";

import { signOut } from "next-auth/react";

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin-login" })}
      className="w-full text-left text-xs font-medium text-destructive hover:underline transition-colors"
    >
      로그아웃
    </button>
  );
}
