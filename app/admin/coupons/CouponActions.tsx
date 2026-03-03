"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CouponActions({
  couponId,
  active,
}: {
  couponId: string;
  active: boolean;
}) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/admin/coupons/${couponId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm("쿠폰을 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/coupons/${couponId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={toggle}>
        {active ? "비활성화" : "활성화"}
      </Button>
      <Button size="sm" variant="destructive" onClick={remove}>
        삭제
      </Button>
    </div>
  );
}
