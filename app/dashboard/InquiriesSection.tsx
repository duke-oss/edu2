import Link from "next/link";
import { MessageSquare, ChevronRight, PenLine, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Inquiry = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

export default function InquiriesSection({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
        <p className="font-semibold">작성한 문의가 없습니다</p>
        <p className="text-sm mt-1 text-muted-foreground">궁금한 내용을 남겨주시면 빠르게 답변드릴게요.</p>
        <Button asChild className="mt-5" variant="outline">
          <Link href="/inquiry/new">문의 작성하기</Link>
        </Button>
      </div>
    );
  }

  const thisMonth = new Date().getMonth();
  const monthlyCount = inquiries.filter((i) => new Date(i.created_at).getMonth() === thisMonth).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-1">전체 문의</p>
            <p className="text-2xl font-bold">{inquiries.length}건</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-1">이번 달 작성</p>
            <p className="text-2xl font-bold">{monthlyCount}건</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
          <p className="text-sm font-semibold inline-flex items-center gap-2">
            <FileText size={14} /> 문의 내역
          </p>
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link href="/inquiry/new" className="gap-1.5">
              <PenLine size={13} /> 새 문의
            </Link>
          </Button>
        </div>

        {inquiries.map((item, i) => (
          <Link
            key={item.id}
            href={`/inquiry/${item.id}`}
            className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-4 hover:bg-muted/20 transition-colors ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <span className="text-sm font-medium truncate">{item.title}</span>
            <Badge variant="secondary" className="text-xs justify-self-center">
              {item.category}
            </Badge>
            <span className="text-xs text-muted-foreground justify-self-end">
              {new Date(item.created_at).toLocaleDateString("ko-KR")}
            </span>
            <ChevronRight size={14} className="text-muted-foreground/60 justify-self-end" />
          </Link>
        ))}
      </div>
    </div>
  );
}
