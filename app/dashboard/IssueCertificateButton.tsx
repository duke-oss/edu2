"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IssueCertificateButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleIssue() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? "수강증 발급에 실패했습니다.");
        return;
      }

      const data = await res.json();
      if (data?.id) {
        window.location.href = `/certificate/${data.id}`;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="outline" className="gap-1.5" onClick={handleIssue} disabled={loading}>
      <Award size={13} />
      {loading ? "발급 중..." : "수강증 발급"}
    </Button>
  );
}

