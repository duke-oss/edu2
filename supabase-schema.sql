-- Run this SQL in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id            uuid not null default uuid_generate_v4(),
  name          text,
  email         text unique,
  email_verified timestamptz,
  image         text,
  password      text,        -- bcrypt hashed, NULL for OAuth-only users
  created_at    timestamptz  not null default now(),
  primary key (id)
);

-- OAuth accounts table (linked to users)
create table if not exists accounts (
  id                   uuid not null default uuid_generate_v4(),
  user_id              uuid not null references users(id) on delete cascade,
  type                 text not null,
  provider             text not null,
  provider_account_id  text not null,
  refresh_token        text,
  access_token         text,
  expires_at           bigint,
  token_type           text,
  scope                text,
  id_token             text,
  session_state        text,
  primary key (id),
  unique (provider, provider_account_id)
);

-- Sessions table (used by database strategy; with JWT strategy this stays empty)
create table if not exists sessions (
  id            uuid not null default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  session_token text not null unique,
  expires       timestamptz not null,
  primary key (id)
);

-- Email verification tokens
create table if not exists verification_tokens (
  identifier text not null,
  token      text not null unique,
  expires    timestamptz not null,
  primary key (token)
);

-- Inquiries table
create table if not exists inquiries (
  id            uuid not null default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  title         text not null,
  category      text not null,
  content       text not null,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  primary key (id)
);

-- Courses table
create table if not exists courses (
  id              text primary key,
  title           text not null,
  description     text not null,
  category        text not null,
  level           text not null check (level in ('입문', '중급', '고급')),
  instructor      text not null,
  total_duration  text not null,
  thumbnail       text not null,
  badge           text not null check (badge in ('VOD', 'LIVE')),
  price           text not null,
  free            boolean default false,
  students        text not null default '0명',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Lessons table
create table if not exists lessons (
  id          text not null,
  course_id   text not null references courses(id) on delete cascade,
  title       text not null,
  duration    text not null,
  video_id    text,
  description text,
  sort_order  int not null default 0,
  primary key (id, course_id)
);

-- Migration: seed courses from hardcoded data
insert into courses (id, title, description, category, level, instructor, total_duration, thumbnail, badge, price, free, students) values
(
  'import-business-az',
  '수입 비즈니스 완전 정복 A to Z',
  'FOB부터 통관, 물류까지 수입 비즈니스의 모든 것을 처음부터 체계적으로 배웁니다. 수강생의 87%가 수료 후 3개월 내 첫 수입을 시작합니다.',
  '입문', '입문', '김태호', '8시간 30분', 'from-blue-600 to-blue-400', 'VOD', '무료', true, '892명'
),
(
  'incoterms-master',
  'FOB·CIF 인코텀즈 실전 마스터',
  '무역 거래의 핵심인 인코텀즈 2020을 실전 사례 중심으로 완전히 이해합니다. 조건별 비용·리스크 분담을 명확히 파악해 협상력을 높이세요.',
  '무역 실무', '중급', '정우석', '매주 화·목 라이브', 'from-violet-600 to-violet-400', 'LIVE', '₩198,000', false, '124명'
),
(
  'customs-practice',
  '통관·관세 완전 이해 실무 과정',
  '수입 통관 절차, 관세율 계산, HS코드 적용까지 통관 실무의 핵심을 현직 관세사가 직접 가르칩니다. FTA 활용으로 관세를 합법적으로 절감하세요.',
  '통관·관세', '중급', '이정민', '6시간 15분', 'from-emerald-600 to-emerald-400', 'VOD', '₩149,000', false, '645명'
),
(
  'supplier-negotiation',
  '해외 공급업체 협상 전략 & 계약서',
  '해외 공급업체와의 가격 협상, MOQ 협의, 계약 체결까지 실전에서 바로 쓸 수 있는 협상 스크립트와 전략을 배웁니다.',
  '무역 실무', '고급', '박소연', '매주 토 라이브', 'from-amber-500 to-amber-300', 'LIVE', '₩298,000', false, '78명'
),
(
  'trade-documents',
  '무역 서류 완벽 이해 (L/C, B/L, C/O)',
  '인보이스부터 L/C, B/L, 원산지증명서까지 무역 서류의 모든 것을 실무 사례로 이해합니다. 서류 실수로 인한 통관 지연과 결제 불이행을 예방하세요.',
  '무역 실무', '입문', '이정민', '4시간 50분', 'from-rose-600 to-rose-400', 'VOD', '₩89,000', false, '1,204명'
),
(
  'china-sea-sourcing',
  '중국·동남아 소싱 전략과 현장 실무',
  '중국 알리바바·1688 활용부터 광저우·이우 현장 방문, 베트남·동남아 소싱까지. 글로벌 소싱의 실전 노하우를 현지 10년 전문가가 전수합니다.',
  '물류·운송', '고급', '박소연', '10시간 20분', 'from-indigo-600 to-indigo-400', 'VOD', '₩248,000', false, '437명'
)
on conflict (id) do nothing;

-- Migration: seed lessons
insert into lessons (id, course_id, title, duration, description, sort_order) values
('l1','import-business-az','수입 비즈니스 개요와 기회','20:00','수입 비즈니스의 개념과 국내 시장 기회를 알아봅니다.',1),
('l2','import-business-az','수입 비즈니스 모델 선택','25:00','다양한 수입 비즈니스 모델을 비교하고 내게 맞는 모델을 선택합니다.',2),
('l3','import-business-az','아이템 선정 기준','30:00','수익성 높은 제품을 선별하는 기준을 익힙니다.',3),
('l4','import-business-az','공급업체 처음 찾기','35:00','알리바바, 1688 등 주요 플랫폼에서 공급업체를 찾는 방법.',4),
('l5','import-business-az','무역 기초 용어 정리','25:00','FOB, CIF, HS코드 등 필수 무역 용어를 정리합니다.',5),
('l6','import-business-az','첫 샘플 오더 실습','30:00','샘플 요청부터 수령까지 전 과정을 실습합니다.',6),
('l7','import-business-az','가격 계산법 완전 정복','35:00','원가, 관세, 물류비를 포함한 판매가 책정 방법.',7),
('l8','import-business-az','수입 통관 기초','30:00','통관 프로세스의 기본 흐름을 이해합니다.',8),
('l9','import-business-az','물류 기초 이해','25:00','해상/항공 물류의 기초를 알아봅니다.',9),
('l10','import-business-az','수입 로드맵 정리','25:00','지금까지 배운 내용을 정리하고 다음 단계를 계획합니다.',10),
('l1','incoterms-master','인코텀즈 2020 개요','50:00','인코텀즈의 역사와 2020년 개정판 주요 변경사항.',1),
('l2','incoterms-master','EXW & FCA 이해','50:00','공장 인도 조건의 차이점과 활용 상황.',2),
('l3','incoterms-master','FOB 완전 정복','50:00','가장 많이 쓰이는 FOB 조건의 실전 활용법.',3),
('l4','incoterms-master','CFR & CIF 비교','50:00','운임 포함 조건의 차이와 보험 적용 방법.',4),
('l5','incoterms-master','DAP & DDP 실전','50:00','목적지 인도 조건으로 안전하게 거래하는 법.',5),
('l6','incoterms-master','인코텀즈 선택 전략','50:00','상황별 최적 인코텀즈를 선택하는 전략.',6),
('l1','customs-practice','통관 프로세스 전체 흐름','30:00','수입 신고부터 물품 수령까지의 전체 과정.',1),
('l2','customs-practice','HS코드 찾는 방법','35:00','내 제품의 HS코드를 정확히 분류하는 법.',2),
('l3','customs-practice','관세율 계산 실습','40:00','관세, 부가세, 개별소비세 계산 실습.',3),
('l4','customs-practice','FTA 활용해 관세 줄이기','35:00','한중, 한미, 한EU FTA 원산지 증명 활용.',4),
('l5','customs-practice','수입 서류 완벽 가이드','30:00','인보이스, 패킹리스트, B/L 등 필수 서류.',5),
('l6','customs-practice','통관 문제 대처법','35:00','검사 선택, 서류 오류, 지연 상황 대응.',6),
('l7','customs-practice','관세사 활용 & 직접 통관','35:00','관세사 의뢰 vs 직접 통관 비교.',7),
('l1','supplier-negotiation','협상 전 준비 전략','50:00','BATNA 설정과 협상 포지션 준비.',1),
('l2','supplier-negotiation','첫 연락부터 협상 시작','50:00','초기 접촉에서 좋은 인상을 주는 방법.',2),
('l3','supplier-negotiation','가격 협상 실전 스크립트','50:00','실제 이메일, 채팅 스크립트로 가격 낮추기.',3),
('l4','supplier-negotiation','MOQ 낮추는 협상 기술','50:00','최소 주문 수량을 줄이는 설득 방법.',4),
('l5','supplier-negotiation','계약서 핵심 조항 이해','50:00','OEM 계약의 필수 조항과 주의사항.',5),
('l6','supplier-negotiation','분쟁 예방과 대처법','50:00','계약 불이행 시 대응 방법과 예방 전략.',6),
('l1','trade-documents','무역 서류 체계 이해','30:00','무역 서류의 종류와 전체 흐름을 개괄적으로 이해합니다.',1),
('l2','trade-documents','상업 인보이스 작성법','30:00','실무에서 바로 사용하는 인보이스 작성 실습.',2),
('l3','trade-documents','패킹리스트 완전 이해','25:00','패킹리스트 작성과 인보이스와의 관계.',3),
('l4','trade-documents','B/L 종류와 활용','35:00','선하증권의 종류와 물품 수령 방법.',4),
('l5','trade-documents','L/C 개설부터 네고까지','40:00','신용장의 전체 프로세스를 단계별로 설명.',5),
('l6','trade-documents','원산지 증명서 (C/O)','30:00','FTA 원산지 증명서 발급과 활용 방법.',6),
('l1','china-sea-sourcing','중국 소싱 시장 이해','40:00','중국 제조업 현황과 소싱 기회 분석.',1),
('l2','china-sea-sourcing','알리바바 & 1688 완전 활용','45:00','두 플랫폼의 차이와 효과적인 활용법.',2),
('l3','china-sea-sourcing','광저우·이우 현장 실무','50:00','주요 도매 시장 방문과 공급업체 발굴 전략.',3),
('l4','china-sea-sourcing','베트남 소싱 가이드','45:00','베트남 주요 산업 지역과 공장 발굴 방법.',4),
('l5','china-sea-sourcing','동남아 소싱 루트 개발','40:00','태국, 인도네시아, 방글라데시 소싱 비교 분석.',5),
('l6','china-sea-sourcing','소싱 에이전트 활용법','35:00','에이전트 선정부터 계약, 관리까지.',6),
('l7','china-sea-sourcing','현지 공장 방문 전략','40:00','공장 실사와 품질 체크 포인트.',7),
('l8','china-sea-sourcing','샘플 관리와 품질 검수','40:00','샘플 발주부터 최종 검수 기준 설정까지.',8)
on conflict do nothing;
