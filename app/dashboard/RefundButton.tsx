"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RefundButton({ enrollmentId }: { enrollmentId: string }) {
  const [step, setStep] = useState<"idle" | "confirm" | "loading">("idle");
  const router = useRouter();

  async function handleRefund() {
    setStep("loading");
    const res = await fetch("/api/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "환불 처리 중 오류가 발생했습니다.");
      setStep("idle");
    }
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <p className="text-xs text-muted-foreground whitespace-nowrap">정말 환불하시겠습니까?</p>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="destructive"
            className="text-xs h-7 px-2.5"
            onClick={handleRefund}
          >
            확인
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2.5"
            onClick={() => setStep("idle")}
          >
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-xs text-muted-foreground h-7 px-2.5 hover:text-destructive hover:bg-destructive/10"
      onClick={() => setStep("confirm")}
      disabled={step === "loading"}
    >
      환불 신청
    </Button>
  );
}
