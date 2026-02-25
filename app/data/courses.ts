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
  level: "입문" | "중급" | "고급";
  instructor: string;
  totalDuration: string;
  thumbnail: string;
  badge: "VOD" | "LIVE";
  price: string;
  free?: boolean;
  students: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "import-business-az",
    title: "수입 비즈니스 완전 정복 A to Z",
    description: "FOB부터 통관, 물류까지 수입 비즈니스의 모든 것을 처음부터 체계적으로 배웁니다. 수강생의 87%가 수료 후 3개월 내 첫 수입을 시작합니다.",
    category: "입문",
    level: "입문",
    instructor: "김태호",
    totalDuration: "8시간 30분",
    thumbnail: "from-blue-600 to-blue-400",
    badge: "VOD",
    price: "무료",
    free: true,
    students: "892명",
    lessons: [
      { id: "l1", title: "수입 비즈니스 개요와 기회", duration: "20:00", description: "수입 비즈니스의 개념과 국내 시장 기회를 알아봅니다." },
      { id: "l2", title: "수입 비즈니스 모델 선택", duration: "25:00", description: "다양한 수입 비즈니스 모델을 비교하고 내게 맞는 모델을 선택합니다." },
      { id: "l3", title: "아이템 선정 기준", duration: "30:00", description: "수익성 높은 제품을 선별하는 기준을 익힙니다." },
      { id: "l4", title: "공급업체 처음 찾기", duration: "35:00", description: "알리바바, 1688 등 주요 플랫폼에서 공급업체를 찾는 방법." },
      { id: "l5", title: "무역 기초 용어 정리", duration: "25:00", description: "FOB, CIF, HS코드 등 필수 무역 용어를 정리합니다." },
      { id: "l6", title: "첫 샘플 오더 실습", duration: "30:00", description: "샘플 요청부터 수령까지 전 과정을 실습합니다." },
      { id: "l7", title: "가격 계산법 완전 정복", duration: "35:00", description: "원가, 관세, 물류비를 포함한 판매가 책정 방법." },
      { id: "l8", title: "수입 통관 기초", duration: "30:00", description: "통관 프로세스의 기본 흐름을 이해합니다." },
      { id: "l9", title: "물류 기초 이해", duration: "25:00", description: "해상/항공 물류의 기초를 알아봅니다." },
      { id: "l10", title: "수입 로드맵 정리", duration: "25:00", description: "지금까지 배운 내용을 정리하고 다음 단계를 계획합니다." },
    ],
  },
  {
    id: "incoterms-master",
    title: "FOB·CIF 인코텀즈 실전 마스터",
    description: "무역 거래의 핵심인 인코텀즈 2020을 실전 사례 중심으로 완전히 이해합니다. 조건별 비용·리스크 분담을 명확히 파악해 협상력을 높이세요.",
    category: "무역 실무",
    level: "중급",
    instructor: "정우석",
    totalDuration: "매주 화·목 라이브",
    thumbnail: "from-violet-600 to-violet-400",
    badge: "LIVE",
    price: "₩198,000",
    students: "124명",
    lessons: [
      { id: "l1", title: "인코텀즈 2020 개요", duration: "50:00", description: "인코텀즈의 역사와 2020년 개정판 주요 변경사항." },
      { id: "l2", title: "EXW & FCA 이해", duration: "50:00", description: "공장 인도 조건의 차이점과 활용 상황." },
      { id: "l3", title: "FOB 완전 정복", duration: "50:00", description: "가장 많이 쓰이는 FOB 조건의 실전 활용법." },
      { id: "l4", title: "CFR & CIF 비교", duration: "50:00", description: "운임 포함 조건의 차이와 보험 적용 방법." },
      { id: "l5", title: "DAP & DDP 실전", duration: "50:00", description: "목적지 인도 조건으로 안전하게 거래하는 법." },
      { id: "l6", title: "인코텀즈 선택 전략", duration: "50:00", description: "상황별 최적 인코텀즈를 선택하는 전략." },
    ],
  },
  {
    id: "customs-practice",
    title: "통관·관세 완전 이해 실무 과정",
    description: "수입 통관 절차, 관세율 계산, HS코드 적용까지 통관 실무의 핵심을 현직 관세사가 직접 가르칩니다. FTA 활용으로 관세를 합법적으로 절감하세요.",
    category: "통관·관세",
    level: "중급",
    instructor: "이정민",
    totalDuration: "6시간 15분",
    thumbnail: "from-emerald-600 to-emerald-400",
    badge: "VOD",
    price: "₩149,000",
    students: "645명",
    lessons: [
      { id: "l1", title: "통관 프로세스 전체 흐름", duration: "30:00", description: "수입 신고부터 물품 수령까지의 전체 과정." },
      { id: "l2", title: "HS코드 찾는 방법", duration: "35:00", description: "내 제품의 HS코드를 정확히 분류하는 법." },
      { id: "l3", title: "관세율 계산 실습", duration: "40:00", description: "관세, 부가세, 개별소비세 계산 실습." },
      { id: "l4", title: "FTA 활용해 관세 줄이기", duration: "35:00", description: "한중, 한미, 한EU FTA 원산지 증명 활용." },
      { id: "l5", title: "수입 서류 완벽 가이드", duration: "30:00", description: "인보이스, 패킹리스트, B/L 등 필수 서류." },
      { id: "l6", title: "통관 문제 대처법", duration: "35:00", description: "검사 선택, 서류 오류, 지연 상황 대응." },
      { id: "l7", title: "관세사 활용 & 직접 통관", duration: "35:00", description: "관세사 의뢰 vs 직접 통관 비교." },
    ],
  },
  {
    id: "supplier-negotiation",
    title: "해외 공급업체 협상 전략 & 계약서",
    description: "해외 공급업체와의 가격 협상, MOQ 협의, 계약 체결까지 실전에서 바로 쓸 수 있는 협상 스크립트와 전략을 배웁니다.",
    category: "무역 실무",
    level: "고급",
    instructor: "박소연",
    totalDuration: "매주 토 라이브",
    thumbnail: "from-amber-500 to-amber-300",
    badge: "LIVE",
    price: "₩298,000",
    students: "78명",
    lessons: [
      { id: "l1", title: "협상 전 준비 전략", duration: "50:00", description: "BATNA 설정과 협상 포지션 준비." },
      { id: "l2", title: "첫 연락부터 협상 시작", duration: "50:00", description: "초기 접촉에서 좋은 인상을 주는 방법." },
      { id: "l3", title: "가격 협상 실전 스크립트", duration: "50:00", description: "실제 이메일, 채팅 스크립트로 가격 낮추기." },
      { id: "l4", title: "MOQ 낮추는 협상 기술", duration: "50:00", description: "최소 주문 수량을 줄이는 설득 방법." },
      { id: "l5", title: "계약서 핵심 조항 이해", duration: "50:00", description: "OEM 계약의 필수 조항과 주의사항." },
      { id: "l6", title: "분쟁 예방과 대처법", duration: "50:00", description: "계약 불이행 시 대응 방법과 예방 전략." },
    ],
  },
  {
    id: "trade-documents",
    title: "무역 서류 완벽 이해 (L/C, B/L, C/O)",
    description: "인보이스부터 L/C, B/L, 원산지증명서까지 무역 서류의 모든 것을 실무 사례로 이해합니다. 서류 실수로 인한 통관 지연과 결제 불이행을 예방하세요.",
    category: "무역 실무",
    level: "입문",
    instructor: "이정민",
    totalDuration: "4시간 50분",
    thumbnail: "from-rose-600 to-rose-400",
    badge: "VOD",
    price: "₩89,000",
    students: "1,204명",
    lessons: [
      { id: "l1", title: "무역 서류 체계 이해", duration: "30:00", description: "무역 서류의 종류와 전체 흐름을 개괄적으로 이해합니다." },
      { id: "l2", title: "상업 인보이스 작성법", duration: "30:00", description: "실무에서 바로 사용하는 인보이스 작성 실습." },
      { id: "l3", title: "패킹리스트 완전 이해", duration: "25:00", description: "패킹리스트 작성과 인보이스와의 관계." },
      { id: "l4", title: "B/L 종류와 활용", duration: "35:00", description: "선하증권의 종류와 물품 수령 방법." },
      { id: "l5", title: "L/C 개설부터 네고까지", duration: "40:00", description: "신용장의 전체 프로세스를 단계별로 설명." },
      { id: "l6", title: "원산지 증명서 (C/O)", duration: "30:00", description: "FTA 원산지 증명서 발급과 활용 방법." },
    ],
  },
  {
    id: "china-sea-sourcing",
    title: "중국·동남아 소싱 전략과 현장 실무",
    description: "중국 알리바바·1688 활용부터 광저우·이우 현장 방문, 베트남·동남아 소싱까지. 글로벌 소싱의 실전 노하우를 현지 10년 전문가가 전수합니다.",
    category: "물류·운송",
    level: "고급",
    instructor: "박소연",
    totalDuration: "10시간 20분",
    thumbnail: "from-indigo-600 to-indigo-400",
    badge: "VOD",
    price: "₩248,000",
    students: "437명",
    lessons: [
      { id: "l1", title: "중국 소싱 시장 이해", duration: "40:00", description: "중국 제조업 현황과 소싱 기회 분석." },
      { id: "l2", title: "알리바바 & 1688 완전 활용", duration: "45:00", description: "두 플랫폼의 차이와 효과적인 활용법." },
      { id: "l3", title: "광저우·이우 현장 실무", duration: "50:00", description: "주요 도매 시장 방문과 공급업체 발굴 전략." },
      { id: "l4", title: "베트남 소싱 가이드", duration: "45:00", description: "베트남 주요 산업 지역과 공장 발굴 방법." },
      { id: "l5", title: "동남아 소싱 루트 개발", duration: "40:00", description: "태국, 인도네시아, 방글라데시 소싱 비교 분석." },
      { id: "l6", title: "소싱 에이전트 활용법", duration: "35:00", description: "에이전트 선정부터 계약, 관리까지." },
      { id: "l7", title: "현지 공장 방문 전략", duration: "40:00", description: "공장 실사와 품질 체크 포인트." },
      { id: "l8", title: "샘플 관리와 품질 검수", duration: "40:00", description: "샘플 발주부터 최종 검수 기준 설정까지." },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
