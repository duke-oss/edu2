"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Rocket, LogOut, User } from "lucide-react";

function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 skeleton rounded-full" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="avatar online" title={session.user.name ?? session.user.email ?? ""}>
          {session.user.image ? (
            <div className="w-8 rounded-full">
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={32}
                height={32}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
          {session.user.name ?? session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-ghost btn-sm gap-1 text-base-content/60"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="btn btn-ghost btn-sm">
        로그인
      </Link>
      <Link href="/register" className="btn btn-primary btn-sm rounded-full px-5">
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
    <div className="navbar sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200 px-4 lg:px-8">
      {/* Start: Logo */}
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
            <Rocket size={17} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight">Sellernote</span>
        </Link>
      </div>

      {/* Center: Nav links */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-medium rounded-lg ${
                  pathname === item.href
                    ? "text-primary bg-primary/8"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* End: Auth */}
      <div className="navbar-end">
        <NavAuth />
      </div>
    </div>
  );
}
