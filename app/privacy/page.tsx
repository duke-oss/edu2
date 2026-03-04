import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 | Sellernote Education",
  description: "셀러노트 교육 서비스 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-2">법적 문서</p>
          <h1 className="text-3xl font-black">개인정보처리방침</h1>
          <p className="text-muted-foreground mt-2 text-sm">최종 수정일: 2026년 1월 1일</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">1. 개인정보 수집 항목 및 수집 방법</h2>
            <p className="mb-3">회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground">수집 목적</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground">수집 항목</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground">보유 기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3">회원가입 및 관리</td>
                    <td className="px-4 py-3">이메일, 이름, 비밀번호(암호화)</td>
                    <td className="px-4 py-3">회원 탈퇴 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">결제 처리</td>
                    <td className="px-4 py-3">결제 수단 정보(PG사 위탁), 결제 금액, 결제 일시</td>
                    <td className="px-4 py-3">5년 (전자상거래법)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">강의 수강 관리</td>
                    <td className="px-4 py-3">수강 이력, 진도율, 수료증 정보</td>
                    <td className="px-4 py-3">회원 탈퇴 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">서비스 이용 문의</td>
                    <td className="px-4 py-3">이메일, 문의 내용</td>
                    <td className="px-4 py-3">3년</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">2. 개인정보의 처리 목적</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>회원 가입 및 관리, 본인 확인, 서비스 부정이용 방지</li>
              <li>유료 강의 결제 처리 및 환불 처리</li>
              <li>강의 수강 이력 관리 및 수료증 발급</li>
              <li>서비스 이용 관련 공지사항 및 학습 독려 이메일 발송</li>
              <li>고객 문의 및 불만 처리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">3. 개인정보의 제3자 제공</h2>
            <p className="mb-3">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">4. 개인정보 처리 위탁</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground">수탁업체</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-foreground">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3">토스페이먼츠(주)</td>
                    <td className="px-4 py-3">결제 처리</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Supabase Inc.</td>
                    <td className="px-4 py-3">데이터베이스 저장 및 관리</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Resend Inc.</td>
                    <td className="px-4 py-3">이메일 발송</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Vercel Inc.</td>
                    <td className="px-4 py-3">서버 호스팅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">5. 개인정보 보유 및 이용기간</h2>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 각각의 개인정보 처리 및 보유기간은
              위 표를 참조하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="mb-2">이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3">
              위 권리 행사는 서비스 내 회원정보 수정 페이지 또는 이메일(api@seller-note.com)을 통해 요청하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">7. 쿠키(Cookie) 사용</h2>
            <p>
              회사는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키를 사용합니다.
              쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보입니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">8. 개인정보 보호책임자</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>이메일: api@seller-note.com</li>
            </ul>
            <p className="mt-3">
              개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만 처리 및
              피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">9. 개인정보 침해 신고</h2>
            <p>개인정보 침해에 대한 신고 또는 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>개인정보 침해신고센터: privacy.kisa.or.kr / 118</li>
              <li>대검찰청 사이버수사과: www.spo.go.kr / 1301</li>
              <li>경찰청 사이버수사국: ecrm.cyber.go.kr / 182</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground flex gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">이용약관</Link>
          <Link href="/" className="hover:text-foreground transition-colors">홈으로</Link>
        </div>
      </div>
    </div>
  );
}
