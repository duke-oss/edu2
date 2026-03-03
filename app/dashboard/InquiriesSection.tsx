import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Inquiry = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

export default function InquiriesSection({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">작성한 문의가 없습니다</p>
        <Button asChild className="mt-5" variant="outline">
          <Link href="/inquiry/new">문의 작성하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">총 {inquiries.length}건</p>
      <div className="border border-border rounded-xl overflow-hidden">
        {inquiries.map((item, i) => (
          <Link
            key={item.id}
            href={`/inquiry/${item.id}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <span className="flex-1 text-sm font-medium truncate">{item.title}</span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {item.category}
            </Badge>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(item.created_at).toLocaleDateString("ko-KR")}
            </span>
            <ChevronRight size={14} className="text-muted-foreground/50 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
