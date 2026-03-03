import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyStatus({ status }: { status: string | null }) {
  if (status === "success") {
    return (
      <div className="text-center space-y-3">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <p className="font-semibold text-lg">이메일 인증 완료!</p>
        <p className="text-sm text-muted-foreground">이제 로그인하여 학습을 시작할 수 있습니다.</p>
        <Button asChild className="mt-2">
          <Link href="/login">로그인하기</Link>
        </Button>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center space-y-3">
        <Clock size={48} className="mx-auto text-amber-500" />
        <p className="font-semibold text-lg">링크가 만료되었습니다</p>
        <p className="text-sm text-muted-foreground">인증 링크가 만료되었습니다. 다시 가입하거나 문의해주세요.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/register">다시 가입하기</Link>
        </Button>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="text-center space-y-3">
        <XCircle size={48} className="mx-auto text-destructive" />
        <p className="font-semibold text-lg">유효하지 않은 링크</p>
        <p className="text-sm text-muted-foreground">인증 링크가 올바르지 않습니다.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    );
  }

  // No status yet — tell them to check email
  return (
    <div className="text-center space-y-3">
      <CheckCircle size={48} className="mx-auto text-primary opacity-60" />
      <p className="font-semibold text-lg">이메일을 확인해주세요</p>
      <p className="text-sm text-muted-foreground">
        가입하신 이메일로 인증 링크를 보내드렸습니다.<br />
        링크를 클릭하여 인증을 완료해주세요.
      </p>
    </div>
  );
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">이메일 인증</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <VerifyStatus status={status ?? null} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
