import Link from "next/link";

export const metadata = {
  title: "이용약관 | Sellernote Education",
  description: "셀러노트 교육 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-2">법적 문서</p>
          <h1 className="text-3xl font-black">이용약관</h1>
          <p className="text-muted-foreground mt-2 text-sm">최종 수정일: 2026년 1월 1일</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 셀러노트(이하 "회사")가 제공하는 온라인 교육 서비스(이하 "서비스")의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제2조 (정의)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>"서비스"란 회사가 제공하는 수입무역 온라인 강의, 학습 자료, 수료증 발급 등 일체의 교육 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.</li>
              <li>"콘텐츠"란 회사가 서비스 내에서 제공하는 동영상 강의, 첨부 자료, 텍스트, 이미지 등 모든 디지털 자료를 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제3조 (약관의 효력 및 변경)</h2>
            <p>
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
              회사는 필요한 경우 관련 법령을 위반하지 않는 범위 내에서 본 약관을 변경할 수 있으며,
              변경된 약관은 서비스 내 공지사항을 통해 7일 전에 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제4조 (회원가입 및 계정)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>이용자는 회사가 정한 가입 양식에 따라 정보를 기입한 후 본 약관에 동의함으로써 회원가입을 신청합니다.</li>
              <li>회원은 등록한 이메일 및 비밀번호를 안전하게 관리할 책임이 있으며, 제3자에게 이용하게 해서는 안 됩니다.</li>
              <li>타인의 정보를 도용하거나 허위 정보를 등록한 경우 서비스 이용이 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제5조 (서비스 이용 및 콘텐츠 저작권)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>모든 콘텐츠에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
              <li>이용자는 서비스에서 제공하는 콘텐츠를 개인 학습 목적으로만 이용할 수 있습니다.</li>
              <li>콘텐츠의 무단 복제, 배포, 방송, 공연, 전시 또는 2차적 저작물 작성 행위를 금지합니다.</li>
              <li>수강권은 구매한 본인만 이용 가능하며, 타인에게 양도하거나 공유할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제6조 (결제 및 환불)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>유료 강의는 결제 완료 후 즉시 수강이 가능합니다.</li>
              <li>결제 후 7일 이내, 수강한 강의가 없는 경우 전액 환불이 가능합니다.</li>
              <li>수강을 시작한 경우(1강 이상 완료) 환불이 제한될 수 있으며, 관련 법령(전자상거래 등에서의 소비자 보호에 관한 법률)에 따릅니다.</li>
              <li>환불 요청은 서비스 내 1:1 문의 또는 이메일(api@seller-note.com)을 통해 접수하실 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제7조 (서비스 제공의 제한 및 중단)</h2>
            <p>
              회사는 컴퓨터 등 정보통신설비의 보수·점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는
              서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 사전에 서비스 내 공지를 통해 이용자에게 통지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제8조 (면책조항)</h2>
            <p>
              회사는 강의 콘텐츠의 정확성 및 완전성을 보장하지 않으며, 이용자가 강의 내용을 토대로 한 사업 결정에 대해
              발생하는 손해에 대해 법령이 허용하는 한도 내에서 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제9조 (준거법 및 관할)</h2>
            <p>
              본 약관은 대한민국 법령에 의해 해석되며, 서비스 이용과 관련한 분쟁이 발생한 경우 회사 소재지를
              관할하는 법원을 합의 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">제10조 (문의)</h2>
            <p>
              이용약관에 관한 문의는 아래 연락처로 해주시기 바랍니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>이메일: api@seller-note.com</li>
              <li>서비스 내 1:1 문의하기</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground flex gap-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors">개인정보처리방침</Link>
          <Link href="/" className="hover:text-foreground transition-colors">홈으로</Link>
        </div>
      </div>
    </div>
  );
}
