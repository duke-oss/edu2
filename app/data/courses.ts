export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId?: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "입문" | "초급" | "중급" | "고급";
  instructor: string;
  totalDuration: string;
  thumbnail: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "import-sourcing-basics",
    title: "수입 소싱 완전 정복: 입문편",
    description:
      "수입 소싱의 기초부터 시작해 나만의 제품을 찾고 공급업체를 확보하는 방법을 배웁니다. 처음 시작하는 분들을 위한 체계적인 커리큘럼.",
    category: "소싱 기초",
    level: "입문",
    instructor: "김소싱",
    totalDuration: "4시간 30분",
    thumbnail: "from-blue-500 to-blue-700",
    lessons: [
      {
        id: "l1",
        title: "수입 소싱이란 무엇인가",
        duration: "25:00",
        description: "수입 소싱의 개념과 비즈니스 기회에 대해 알아봅니다.",
      },
      {
        id: "l2",
        title: "수입 비즈니스 모델 이해하기",
        duration: "30:00",
        description: "다양한 수입 비즈니스 모델을 비교하고 내게 맞는 모델을 선택합니다.",
      },
      {
        id: "l3",
        title: "시장 조사 방법론",
        duration: "35:00",
        description: "트렌드 분석과 수요 예측으로 팔리는 제품을 찾습니다.",
      },
      {
        id: "l4",
        title: "아이템 선정 기준",
        duration: "40:00",
        description: "수익성 높은 제품을 선별하는 기준을 익힙니다.",
      },
      {
        id: "l5",
        title: "공급업체 처음 찾기",
        duration: "35:00",
        description: "알리바바, 1688 등 주요 플랫폼에서 공급업체를 찾는 방법.",
      },
      {
        id: "l6",
        title: "첫 샘플 주문하기",
        duration: "30:00",
        description: "샘플 요청부터 수령까지 전 과정을 실습합니다.",
      },
      {
        id: "l7",
        title: "기본 가격 계산법",
        duration: "25:00",
        description: "원가, 관세, 물류비를 포함한 판매가 책정 방법.",
      },
      {
        id: "l8",
        title: "수입 소싱 로드맵 정리",
        duration: "20:00",
        description: "지금까지 배운 내용을 정리하고 다음 단계를 계획합니다.",
      },
    ],
  },
  {
    id: "alibaba-masterclass",
    title: "알리바바 마스터클래스",
    description:
      "알리바바를 완벽하게 활용해 경쟁력 있는 공급업체를 발굴하고 안전하게 거래하는 전략을 마스터합니다.",
    category: "플랫폼 활용",
    level: "초급",
    instructor: "이무역",
    totalDuration: "5시간 00분",
    thumbnail: "from-orange-400 to-orange-600",
    lessons: [
      {
        id: "l1",
        title: "알리바바 플랫폼 완전 이해",
        duration: "30:00",
        description: "알리바바 vs 1688 vs 알리익스프레스 차이점 및 활용법.",
      },
      {
        id: "l2",
        title: "검색 최적화 테크닉",
        duration: "35:00",
        description: "영어 키워드로 원하는 제품을 정확히 찾는 방법.",
      },
      {
        id: "l3",
        title: "공급업체 신뢰도 평가",
        duration: "40:00",
        description: "골든 서플라이어, 검증 뱃지, 리뷰 분석 방법.",
      },
      {
        id: "l4",
        title: "RFQ 보내는 법",
        duration: "25:00",
        description: "효과적인 견적 요청서 작성으로 좋은 조건 받기.",
      },
      {
        id: "l5",
        title: "Trade Assurance 활용",
        duration: "30:00",
        description: "알리바바 결제 보호 서비스로 안전하게 거래하기.",
      },
      {
        id: "l6",
        title: "공장 감사(Audit) 이해",
        duration: "35:00",
        description: "공장 실사를 통한 공급업체 검증 방법.",
      },
      {
        id: "l7",
        title: "가격 비교와 협상",
        duration: "40:00",
        description: "여러 공급업체 비교 및 가격 협상 전략.",
      },
      {
        id: "l8",
        title: "주문 후 관리",
        duration: "35:00",
        description: "발주부터 납기 관리까지 사후 관리 방법.",
      },
    ],
  },
  {
    id: "negotiation-strategy",
    title: "공급업체 협상 전략",
    description:
      "해외 공급업체와의 가격 협상, 조건 협의, 계약 체결까지 실전에서 바로 쓸 수 있는 협상 전략을 배웁니다.",
    category: "협상 & 계약",
    level: "중급",
    instructor: "박협상",
    totalDuration: "3시간 45분",
    thumbnail: "from-green-500 to-emerald-700",
    lessons: [
      {
        id: "l1",
        title: "협상 전 준비 전략",
        duration: "30:00",
        description: "BATNA 설정과 협상 포지션 준비.",
      },
      {
        id: "l2",
        title: "첫 연락부터 협상까지",
        duration: "35:00",
        description: "초기 접촉에서 좋은 인상을 주는 방법.",
      },
      {
        id: "l3",
        title: "가격 협상 실전 스크립트",
        duration: "40:00",
        description: "실제 이메일, 채팅 스크립트로 가격 낮추기.",
      },
      {
        id: "l4",
        title: "MOQ 낮추는 협상 기술",
        duration: "35:00",
        description: "최소 주문 수량을 줄이는 설득 방법.",
      },
      {
        id: "l5",
        title: "결제 조건 협상",
        duration: "30:00",
        description: "T/T, L/C, 에스크로 조건별 협상 전략.",
      },
      {
        id: "l6",
        title: "계약서 핵심 조항 이해",
        duration: "35:00",
        description: "OEM 계약의 필수 조항과 주의사항.",
      },
    ],
  },
  {
    id: "customs-and-tariff",
    title: "수입 통관 & 관세 실무",
    description:
      "수입 통관 절차, 관세율 계산, HS코드 적용까지 통관 실무의 핵심을 배웁니다.",
    category: "통관 & 관세",
    level: "중급",
    instructor: "최통관",
    totalDuration: "4시간 00분",
    thumbnail: "from-purple-500 to-purple-700",
    lessons: [
      {
        id: "l1",
        title: "통관 프로세스 전체 흐름",
        duration: "30:00",
        description: "수입 신고부터 물품 수령까지의 전체 과정.",
      },
      {
        id: "l2",
        title: "HS코드 찾는 방법",
        duration: "35:00",
        description: "내 제품의 HS코드를 정확히 분류하는 법.",
      },
      {
        id: "l3",
        title: "관세율 계산 실습",
        duration: "40:00",
        description: "관세, 부가세, 개별소비세 계산 실습.",
      },
      {
        id: "l4",
        title: "FTA 활용해 관세 줄이기",
        duration: "35:00",
        description: "한중, 한미, 한EU FTA 원산지 증명 활용.",
      },
      {
        id: "l5",
        title: "수입 서류 완벽 가이드",
        duration: "30:00",
        description: "인보이스, 패킹리스트, B/L 등 필수 서류.",
      },
      {
        id: "l6",
        title: "통관 문제 대처법",
        duration: "35:00",
        description: "검사 선택, 서류 오류, 지연 상황 대응.",
      },
      {
        id: "l7",
        title: "관세사 활용 & 직접 통관",
        duration: "35:00",
        description: "관세사 의뢰 vs 직접 통관 비교.",
      },
    ],
  },
  {
    id: "global-sourcing-advanced",
    title: "글로벌 소싱 심화 전략",
    description:
      "중국을 넘어 베트남, 인도, 동남아 등 다양한 소싱 루트를 개발하고 리스크를 분산하는 고급 전략.",
    category: "글로벌 소싱",
    level: "고급",
    instructor: "정글로벌",
    totalDuration: "6시간 00분",
    thumbnail: "from-cyan-500 to-teal-700",
    lessons: [
      {
        id: "l1",
        title: "중국 외 소싱 루트 개발",
        duration: "40:00",
        description: "베트남, 인도, 방글라데시 소싱 비교 분석.",
      },
      {
        id: "l2",
        title: "베트남 소싱 실전 가이드",
        duration: "45:00",
        description: "베트남 주요 산업 지역과 공장 발굴 방법.",
      },
      {
        id: "l3",
        title: "인도 소싱의 기회와 리스크",
        duration: "40:00",
        description: "인도 텍스타일, 소비재 소싱 실전 사례.",
      },
      {
        id: "l4",
        title: "소싱 리스크 분산 전략",
        duration: "35:00",
        description: "멀티 소싱으로 공급망 리스크를 줄이는 방법.",
      },
      {
        id: "l5",
        title: "현지 방문 & 전시회 활용",
        duration: "45:00",
        description: "캔톤 페어, 인터텍스타일 등 전시회 활용법.",
      },
      {
        id: "l6",
        title: "소싱 에이전트 활용",
        duration: "35:00",
        description: "에이전트 선정부터 계약, 관리까지.",
      },
      {
        id: "l7",
        title: "브랜드 OEM/ODM 전략",
        duration: "40:00",
        description: "나만의 브랜드 제품 제작 전략.",
      },
      {
        id: "l8",
        title: "수입 비즈니스 스케일업",
        duration: "40:00",
        description: "소싱 자동화와 팀 빌딩으로 성장하기.",
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
