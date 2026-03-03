"use client";

import Link from "next/link";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificateActions({ id }: { id: string }) {
  return (
    <div className="mb-6 print:hidden flex items-center gap-2">
      <Button asChild variant="outline" className="gap-2">
        <Link href={`/api/certificate/${id}/download`}>
          <Download size={16} />
          수강증 다운로드
        </Link>
      </Button>
      <Button onClick={() => window.print()} variant="outline" className="gap-2">
        <Printer size={16} />
        수강증 인쇄
      </Button>
    </div>
  );
}

