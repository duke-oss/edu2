"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function EducationFooter() {
  const pathname = usePathname();

  if (/^\/courses\/.+\/player/.test(pathname)) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/admin-login")) return null;

  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Rocket size={16} fill="currentColor" />
              </div>
              <span className="font-bold text-lg tracking-tight">Sellernote</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              수입무역 교육과 실무 도구를 연결해, 복잡한 무역 업무를 더 단순하게 만듭니다.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3">교육</p>
            <div className="space-y-2 text-sm">
              <Link href="/courses" className="block text-muted-foreground hover:text-foreground transition-colors">
                온라인 강의
              </Link>
              <Link href="/offline" className="block text-muted-foreground hover:text-foreground transition-colors">
                오프라인 강의
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3">회사</p>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                회사소개
              </Link>
              <Link href="/inquiry" className="block text-muted-foreground hover:text-foreground transition-colors">
                문의하기
              </Link>
              <a href="mailto:api@seller-note.com" className="block text-muted-foreground hover:text-foreground transition-colors">
                API 문의
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2026 Sellernote. All rights reserved.</p>
          <p>api@seller-note.com</p>
        </div>
      </div>
    </footer>
  );
}

