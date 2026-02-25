"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Rocket, LogOut, User } from "lucide-react";

function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 bg-gray-100 rounded-full animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ""}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={16} />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
            {session.user.name ?? session.user.email}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <LogOut size={15} />
          <span>로그아웃</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
        로그인
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
      >
        시작하기
      </Link>
    </div>
  );
}

const NAV_ITEMS = [
  { label: "회사소개", href: "/about" },
  { label: "문의하기", href: "/inquiry" },
  { label: "강의", href: "/courses" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (/^\/courses\/.+\/player/.test(pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Rocket size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight">Sellernote</span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center">
            <NavAuth />
          </div>
        </div>
      </div>
    </nav>
  );
}
