"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Rocket, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 bg-muted rounded-full animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              <User size={14} />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground max-w-[100px] truncate">
            {session.user.name ?? session.user.email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="gap-1 text-muted-foreground"
        >
          <LogOut size={15} />
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">로그인</Link>
      </Button>
      <Button size="sm" className="rounded-full px-5" asChild>
        <Link href="/register">시작하기</Link>
      </Button>
    </div>
  );
}

const NAV_ITEMS = [
  { label: "회사소개", href: "/about" },
  { label: "오프라인 강의", href: "/offline" },
  { label: "온라인 강의", href: "/courses" },
  { label: "문의하기", href: "/inquiry" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (/^\/courses\/.+\/player/.test(pathname)) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/admin-login")) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Rocket size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight">Sellernote</span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className={pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
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
