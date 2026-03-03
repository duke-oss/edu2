import Link from "next/link";
import { Play, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  courseId: string;
  enrolled: boolean;
  loggedIn: boolean;
};

export default function EnrollButton({ courseId, enrolled, loggedIn }: Props) {
  if (enrolled) {
    return (
      <Button asChild className="w-full mb-5">
        <Link href={`/courses/${courseId}/player`} className="gap-2">
          <Play size={15} /> 학습하기
        </Link>
      </Button>
    );
  }

  if (!loggedIn) {
    return (
      <Button asChild variant="outline" className="w-full mb-5">
        <Link href={`/login?callbackUrl=/courses/${courseId}`}>
          로그인하여 수강 신청
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="w-full mb-5">
      <Link href={`/payment/${courseId}`} className="gap-2">
        <ShoppingCart size={15} />
        수강 신청하기
      </Link>
    </Button>
  );
}
