/**
 * generate-summaries.ts
 * Gemini API를 사용해 국가×카테고리별 식품 규제 통합 요약을 생성하고
 * web/src/data/summaries.json에 저장합니다.
 *
 * 사용법:
 *   1. web/.env 파일에 GEMINI_API_KEY=your_key 설정
 *   2. cd web && npx tsx scripts/generate-summaries.ts
 *   3. --country "Japan" 등 플래그로 특정 국가만 실행 가능
 *
 * 예시:
 *   npx tsx scripts/generate-summaries.ts                         # 전체
 *   npx tsx scripts/generate-summaries.ts --country "South Korea" # 한국만
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
  console.error('❌ GEMINI_API_KEY가 .env에 설정되어 있지 않습니다.');
  console.error('   web/.env 파일을 생성하고 GEMINI_API_KEY=your_key 를 입력해 주세요.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ── 타입 정의 ────────────────────────────────────────────────────
type RawRow = {
  country: string;
  flag: string;
  law: string;
  lawUrl?: string;
  requirement: string;
  advisory: string;
  urgency?: string;
  enforcementDate?: string;
};

type CategoryData = {
  key: string;
  titleKo: string;
  row: RawRow;
};

type SummaryEntry = {
  lawSummary: string;
  consolidatedSummary: string;
  exportAlert: string;
  enforcementDate: string;
  reviewedBy: 'Gemini' | 'Claude' | 'Manual';
  reviewNote: string;
};

type SummariesJson = {
  version: string;
  entries: Record<string, Record<string, SummaryEntry>>;
};

// ── 원본 데이터 (App.tsx에서 추출) ──────────────────────────────
// 아래 데이터는 App.tsx CATEGORY_DATA에서 각 국가 행을 추출한 것입니다.
// 국가 추가 시 이 배열에 해당 국가의 각 카테고리 row를 추가하세요.
const CATEGORY_KEY_MAP: Record<string, string> = {
  'fsmp': 'FSMP(특수의료용)',
  'plant-based': '식물성 식품',
  'grains': '곡류·시리얼',
  'meat-fish': '육류·어류·난류',
  'vegetables': '채소류',
  'fruits': '과일류',
  'dairy': '유제품',
  'bakery': '베이커리·과자',
};

const RAW_DATA: Record<string, Record<string, RawRow>> = {
  'South Korea (MFDS)': {
    'fsmp': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품위생법 / 특수의료용도식품 기준 (Amendment 2024-79)',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '당뇨용: 탄수화물 50-60%, 단백질 15-20%, 지방 20-25%, 단순당 <10% kcal. 반드시 의사 지도 하 섭취 문구 의무 표시.',
      advisory: '신제품은 MFDS 개별인정 또는 기준규격 신청 필요. 알루로스는 최대 10% 제한.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품공전 두류 / 대두단백 가공식품 기준',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '식물성 단백질 식품: 단백질 ≥ 25% 기준. 유전자변형 대두 사용 시 GMO 표시 의무 (2026.01 개정 적용). 혼합 단백질 제품 표시 기준 준수.',
      advisory: 'GMO 표시 개정(2026.01) 적용 여부 즉시 검토. 비건/채식 마크는 민간 인증으로 법적 의무 아님.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품공전 제2. 식품의 기준 및 규격 — 곡류 / 전분류',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '수분 기준: 백미 15.5% 이하. 곰팡이독소(아플라톡신 B1 10 μg/kg↓, 총 15 μg/kg↓). 잔류농약: 식품공전 농약잔류허용기준 준수.',
      advisory: 'Aflatoxin 초과 사례 증가 추세. 원재료 입고 시 곰팡이독소 검사 성적서 수취 권장.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷',
      law: '축산물 위생관리법 / 수산물 품질관리법 / 식품위생법',
      lawUrl: 'https://www.law.go.kr',
      requirement: 'HACCP 의무 적용(도축·가공). 식육: 냉장 0-10°C, 냉동 -18°C 이하. 수산물: 히스타민 200 mg/kg↓. 알류: 살모넬라 불검출.',
      advisory: '수출 시 상대국 위생증명서(Health Certificate) 발급 필요. MAFRA 수산물 이력제 등록 의무 확인.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품공전 채소류 기준 / 농약잔류허용기준',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '채소류 잔류농약: 허용기준 미등록 농약은 0.01 mg/kg 일률 기준 적용. 미생물: 대장균군 불검출 (신선편의식품). 방사선 조사 표시 의무.',
      advisory: '수입 채소 원산지 및 농약 검사 성적서 기본 구비. 신선편의식품 HACCP 인증 권장.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품공전 과일류 기준 / 농약잔류허용기준',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '과실류 잔류농약: 미등록 농약 0.01 mg/kg 일률 기준. 중금속: 납 0.1 mg/kg, 카드뮴 0.05 mg/kg (복숭아 등). 방사선 조사 금지 품목 포함.',
      advisory: '수입 과일 잔류농약 검사 성적서 필수 구비. 복숭아류 중금속 기준 초과 사례 주의.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷',
      law: '축산물 위생관리법 / 유가공품 기준 및 규격',
      lawUrl: 'https://www.law.go.kr',
      requirement: '원유: 체세포수 ≤ 400,000/mL, 세균수 ≤ 100,000/mL. 살균 의무 (저온살균 63°C 30분 또는 동등 이상). 항생제 잔류 불검출. 무항생제 인증 표시 기준 별도 적용.',
      advisory: '분유·조제유류는 식약처-MAFRA 이중 관할. 수출 시 수입국 유가공품 허가 상태 사전 확인 필수.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'South Korea (MFDS)', flag: '🇰🇷',
      law: '식품공전 과자류 / 빵류 / 만두류 기준',
      lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      requirement: '트랜스지방: 4g/100g↓ (전용 기준). 보존료: 프로피온산, 소르빈산 등 사용 기준 준수. 알레르겐 22종 의무 표시. 식품첨가물 공전 기준 성분표 검토 필수.',
      advisory: '알레르겐 교차오염 표시(may contain) 권장. 트랜스지방 0g 표시 기준(0.2g/100g↓) 확인.',
      enforcementDate: '시행 중',
    },
  },
  // ── 추가 국가는 여기에 계속 추가 ──────────────────────────────
  'EU (EFSA)': {
    'fsmp': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Regulation (EU) 2016/128 + Regulation (EC) 609/2013',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0128',
      requirement: '질환 카테고리별 성분 기준 적용. 첨가물은 Reg 1333/2008 Cat 13.2 적용. "특수 의료 목적용(For special medical purposes)" 표시 의무.',
      advisory: 'EUR-Lex에서 2026.04.15 FSMP 규정 미확인. 감미료 함량은 Reg 1333/2008 Cat 13.2 개별 허용 기준 반드시 준수. EU 관보 최신 업데이트 확인 권장.',
      enforcementDate: '미확인',
    },
    'plant-based': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Novel Food Regulation (EU) 2015/2283 / Reg 1169/2011',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R2283',
      requirement: '신규 식물성 단백질(레귀메이션, 미세조류 등)은 Novel Food 사전 허가 필요. EFSA 과학적 의견서 제출 필수.',
      advisory: 'EFSA 심사 18-36개월 소요. 기존 허가된 대두·완두 단백질은 해당 없음. 성분 신규성 사전 확인 필수.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Reg (EC) 396/2005 — Pesticide MRLs / Commission Reg (EC) 1881/2006 — Contaminants',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396',
      requirement: '곡류(밀·보리·귀리) 통합 MRL 적용. 곰팡이독소: 아플라톡신 B1 2 μg/kg, 밀 DON 1,250 μg/kg. 모니터링 의무.',
      advisory: 'EU MRL이 한국 기준보다 엄격한 경우 많음. 수출 전 EU MRL 데이터베이스(EFSA Pesticides) 교차 확인 필수.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Regulation (EC) 853/2004 — Animal Product Hygiene / Reg 178/2002',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853',
      requirement: 'EU 승인 도축장 목록 필수. 콜드체인 문서화 의무. 히스타민: 일반 100 mg/kg, 효소 성숙 어류 200 mg/kg. 제품 유형별 살모넬라 기준 적용.',
      advisory: 'EU 승인 도축장·가공시설 리스트 확인 필수. Brexit 후 영국 수출은 별도 UKCA/DEFRA 기준 적용.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Regulation (EC) 396/2005 — MRLs / Reg 2073/2005 — Microbiological Criteria',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396',
      requirement: '통합 MRL 1,100종 이상. 클로르피리포스(Chlorpyrifos) 사용 금지. 미생물 기준: 즉석섭취 엽채류 살모넬라 25g 중 불검출.',
      advisory: 'EU MRL 데이터베이스 정기 모니터링 필수. Chlorpyrifos 등 EU 금지 농약 사용 여부 원산지 단계 확인.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Regulation (EC) 396/2005 — Pesticide MRLs / Reg 1333/2008 (Post-harvest treatments)',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396',
      requirement: '엄격한 MRL 적용. 클로르피리포스·메틸 금지. 포스트하베스트 살균제(예: 감귤 Thiabendazole) 별도 규제. 유기농 동등성 확인 필요.',
      advisory: 'EU 금지 농약 잔류 검출 시 수입 전량 폐기. 포스트하베스트 처리 성분 Annex I 해당 여부 확인 필수.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Reg (EC) 853/2004 Annex III Section IX / Reg 1169/2011 — Labelling',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853',
      requirement: '열처리 표시 의무. 치즈·버터·크림 성분 기준. "우유(Milk)" 명칭은 동물 원산에만 허용 (ECJ 판례). 원유 원산지 표시 라벨 의무.',
      advisory: '원유 원산지 표시 의무(Reg 1169/2011 Art. 26) 준수 필수. 식물성 유제품 대체품은 "milk" 명칭 사용 불가.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'EU (EFSA)', flag: '🇪🇺',
      law: 'Reg (EC) 1333/2008 Annex II Cat 07 — Bakery Additives',
      lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333',
      requirement: 'Cat 07 첨가물: BHA(E320) 최대 200 mg/kg, BHT(E321) 최대 100 mg/kg. 이산화티타늄(E171) 금지. 산업용 트랜스지방 최대 2g/100g 지방 기준.',
      advisory: 'E171 사용 즉시 중단. 트랜스지방 기준 엄격 적용 중. Annex II Cat 07 최신 개정 목록(2025년 11월 지침) 교차 확인 필수.',
      urgency: 'Nov 2025',
      enforcementDate: '시행 중',
    },
  },
  'France (DGCCRF)': {
    'fsmp': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EU) 2016/128 + [Local] Loi Egalim 2018 / Décret n°2006-352',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] Nutri-Score 표시 의무(프랑스 2017년 법제화 — EU 전체 의무화 이전 단독 시행). Loi Egalim 광고 제한(FSMP 포함 특수 식품 광고 규제 강화). 성분표시 폰트·위치 국내법 추가 기준 준수. 글리포세이트 잔류 프랑스 단독 강화 기준 적용.',
      advisory: '[EU Deviation] EU 공통 기준 준수 + 프랑스 독자 법규 추가 확인 필수. Nutri-Score 산출 점수(A~E) 사전 시뮬레이션 및 라벨 반영 필수. 프랑스 수출 제품은 EU 인증 외 Loi Egalim 위반 여부 별도 검토.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EU) 2015/2283 + [Local] Loi Egalim 2018 / Nutri-Score Arrêté 2017',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] 식물성 음료(두유·귀리음료 등): "lait(우유)" 명칭 사용 금지(EU 공통 규정 + 프랑스 엄격 집행). Nutri-Score 표시 의무. 식물성 단백질 성분 출처 표시 프랑스 독자 강화 기준 적용. 광고 표현 Loi Egalim 규제 준수.',
      advisory: '[EU Deviation] 식물성 음료 제품명에 유제품 연상 표현 전면 불허 — 프랑스 DGCCRF 적극 집행 중. Nutri-Score 점수 A 또는 B 달성 포뮬레이션 권장. 프랑스 독자 기준 EU 공통 기준 병행 준수 필수.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] Plan Ecophyto: 프랑스 독자 농약 사용 감축 목표(2030년 50% 감축). Loi Egalim Art. 44: 특정 농약(EU 허용이나 프랑스 규제 강화) 수입 곡류 잔류 기준 강화 적용. Nutri-Score 곡물 가공 제품 의무 표시. 글리포세이트 잔류 강화 집행.',
      advisory: '[EU Deviation] 프랑스 수출 곡류 잔류농약 EU 기준 충족 후 Plan Ecophyto 특별 감시 품목 추가 확인 권장. Loi Egalim 잔류 기준 강화 품목 리스트 DGCCRF 최신 버전 확인 필수.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 853/2004 + [Local] Code rural et de la pêche maritime',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] EU 853/2004 준수 + 프랑스 Code rural 추가 국내 위생 기준. 원산지 표시 강화 집행(소·돼지·가금류 원산지 라벨 의무). 히스타민·살모넬라 EU 기준 준수. Nutri-Score 육류 가공품 의무 표시.',
      advisory: '[EU Deviation] 프랑스 원산지 표시 규정 엄격 집행 — 원산지 증명 서류 완비 필수. Nutri-Score 육류 가공품 점수 사전 시뮬레이션. Loi Egalim 고나트륨·고지방 제품 광고 제한 준수.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] Plan Ecophyto: 프랑스 독자 농약 사용 감축 목표(2030년 50% 감축). Loi Egalim Art. 44: 특정 농약(EU 허용이나 프랑스 규제 강화) 수입 채소 잔류 기준 강화 적용. Nutri-Score 채소 가공 제품 의무 표시. 글리포세이트 잔류 강화 집행.',
      advisory: '[EU Deviation] 프랑스 수출 채소류 잔류농약 EU 기준 충족 후 Plan Ecophyto 특별 감시 품목 추가 확인 권장. Loi Egalim 잔류 기준 강화 품목 리스트 DGCCRF 최신 버전 확인 필수.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] Plan Ecophyto 2030 농약 감축 목표로 수입 과일 잔류농약 강화 집행. Loi Egalim: EU에서 금지된 농약 사용 국가 원산지 수입 과일 제한 추진(상호주의 원칙). 과일 가공품(주스·잼) Nutri-Score 의무 표시. 글리포세이트 잔류 강화 모니터링.',
      advisory: '[EU Deviation] Loi Egalim 상호주의 조항 확대 시행될 경우 EU 금지 농약 사용 국가 원산지 과일 프랑스 수출 제한 가능 — 원산지 농약 사용 기록 준비 권장. 과일 주스 Nutri-Score 점수 사전 확인.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 853/2004 + [Local] Code rural et de la pêche maritime / Nutri-Score Arrêté',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] Nutri-Score 유제품 의무 표시(2017). AOP/IGP(원산지 보호 표시): 특정 프랑스 치즈(카망베르·브리 등) 명칭 보호 — 동일 명칭 수출 제한. 우유 원산지 표시 Reg 1169/2011 Art.26 + 프랑스 추가 국내법 강화 집행. 유제품 광고 Loi Egalim 제한 준수.',
      advisory: '[EU Deviation] 프랑스 AOP/IGP 치즈 명칭 사용 제한 — 수출 제품명 사전 법적 검토 필수. Nutri-Score 유제품 점수(지방·포화지방 영향) 사전 시뮬레이션. 우유 원산지 표시 프랑스 강화 집행 대응 라벨 준비.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷',
      law: '[EU Base] Reg (EC) 1333/2008 + [Local] Arrêté du 8 fév 2021 (E171 금지) / Nutri-Score',
      lawUrl: 'https://www.economie.gouv.fr/dgccrf',
      requirement: '[Strict Local Rule] E171(이산화티타늄): 프랑스 2021.01.01부터 단독 금지(EU 전체 금지 2022.02보다 선행). Nutri-Score 의무(제과류 포함). Loi Egalim: 고당류 제과 광고 제한. 글리포세이트 잔류 밀가루 강화 모니터링. PHO 금지(EU 공통). 트랜스지방 ≤ 2g/100g 지방(EU 공통).',
      advisory: '[EU Deviation] E171 사용 제품 프랑스 수출 절대 금지 — EU 금지(2022.02) 이전 프랑스 이미 금지(2021.01) 시행. 프랑스 수출 베이커리 E171 대체 성분(스타치·탄산칼슘 등) 즉시 적용 확인. Nutri-Score 제과 점수 D 이하 시 프랑스 시장 경쟁력 불이익.',
      enforcementDate: '시행 중',
    },
  },
  'UK (FSA)': {
    'fsmp': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained EU Law — Commission Delegated Reg (UK) 2021 / FSA FSMP Guidance',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'EU Reg 2016/128 UK Retained 버전 적용 — "For special medical purposes" 표시 의무. UK Retained Food Additives Regulation 준수(EU 규정과 분리 진행 중). 영어 단독 표기 의무. MHRA 경계 제품(의약품 분류 가능성) 사전 확인 필수.',
      advisory: 'Brexit 이후 EU 규정과 점진적 분리 — EU 허가 신규 성분이라도 UK 별도 확인 필수. Northern Ireland 판매 시 EU NI Protocol 적용(별도). GB(잉글랜드·스코틀랜드·웨일스)와 NI 규정 분리 주의. 수출 전 FSA 최신 업데이트 확인.',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Food Safety Act 1990 / UK Retained Regulation (EU) 2015/2283 (Novel Food)',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'Novel 식물성 단백질(미세조류·레귀메이션 등): UK Novel Food 별도 승인 필요. "Milk" 명칭 사용 제한(UK retained ECJ 판례 적용). UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. GMO 표시 UK Retained GMO Regulation 준수.',
      advisory: 'EU Novel Food 허가가 Brexit 이후 UK에 자동 적용 안 됨 — UK 별도 신청 필수. 식물성 유제품 "milk" 명칭 사용 금지 규정 유효. UK FSA 신규 성분 허가 목록 정기 모니터링 권장.',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 396/2005 — MRLs / UK Contaminants Regulation',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'UK 잔류농약 MRL: UK Retained EU Reg 396/2005 기준 적용(Brexit 이후 독자 업데이트 가능). 아플라톡신 B1 ≤ 2 μg/kg, DON ≤ 1,250 μg/kg(밀). Glyphosate MRL 유지 여부 UK FSA 최신 목록 확인 필수. 영어 단독 표기.',
      advisory: 'Brexit 이후 EU MRL과 UK MRL 목록이 분리 운영 — EU MRL 충족 후 UK 별도 확인 필수. Glyphosate 등 민감 농약의 UK MRL 변경 사항 FSA 데이터베이스 정기 모니터링 권장.',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 853/2004 / Animal Feed (England) Regulations / DEFRA',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'EU 853/2004 UK Retained 버전 적용. EU 승인 도축장과 UK 승인 도축장 목록 분리(Brexit 이후). DEFRA 동물성 식품 수입 허가 필요. 히스타민: 수산물 100~200 mg/kg(EU와 동일). 영어 단독 표기 의무.',
      advisory: 'EU 승인 도축시설이라도 UK 별도 승인 목록 등재 여부 확인 필수. DEFRA 동물성 식품 수입 사전 통지(IPAFFS 시스템) 필수. Northern Ireland는 EU SPS 규정 적용(별도 주의).',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 396/2005 / Contaminants in Food (England) Regulations',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'UK Retained MRL 목록 준수(EU와 점진적 분리). 클로르피리포스 EU 동일 기준 금지. 신선 채소 DEFRA 식물검역(Phytosanitary) 입항 신고 의무. 영어 단독 표기 의무.',
      advisory: 'UK MRL 목록 EU와 분리 운영 중 — FSA Pesticide Residues Database 정기 확인 필수. DEFRA Phytosanitary import check (IPAFFS) 사전 등록 필수. 브렉시트 이후 일부 채소 품목 별도 수입 경로(Approved Pathways) 확인 필요.',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 396/2005 / UK Food Safety Act 1990',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'UK Retained MRL 준수. 신선 과일 DEFRA 식물검역 입항 신고(IPAFFS) 의무. 가공 과일 제품: UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. 포스트하베스트 처리제 UK 별도 승인 목록 확인 필수.',
      advisory: 'Brexit 이후 EU 승인 포스트하베스트 처리제가 UK에서 불허될 수 있음 — FSA 최신 목록 확인 필수. IPAFFS 사전 등록 없이 입항 불가. Northern Ireland 수출 시 EU 식물검역 규정 적용(별도).',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 853/2004 / UK Dairy Hygiene Regulations / DEFRA',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'EU Reg 853/2004 UK Retained 버전 적용. 원유 체세포수 ≤ 400,000/mL(UK 자체 기준). 살균 의무. 치즈: UK 성분 기준 적용(EU와 유사하나 분리 운영). DEFRA 동물성 식품 수입 허가(IPAFFS) 필수. 영어 단독 표기.',
      advisory: 'Brexit 이후 EU 승인 유가공 시설도 UK DEFRA 별도 승인 목록 확인 필수. Raw Milk 치즈 UK 수입 규정 EU와 분리 적용. Northern Ireland 판매 시 EU SPS 규정 별도 적용.',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧',
      law: 'UK Retained Regulation (EC) 1333/2008 Annex II Cat 07 / UK Food Safety Act',
      lawUrl: 'https://www.food.gov.uk/',
      requirement: 'UK Retained Food Additives Reg(EU Reg 1333/2008 기반) 준수. E171(이산화티타늄): UK 독자 판단 — 현재 EU 금지 기준 미반영 여부 FSA 최신 확인 필수. Potassium Bromate 금지. PHO(부분수소화유) 금지. 트랜스지방 EU 동일 기준. 영어 단독 표기.',
      advisory: 'Brexit 이후 EU 첨가물 금지 결정이 UK에 자동 적용 안 됨 — E171 등 논란 성분 UK FSA 최신 상태 확인 필수. UK FOPL(Front-of-Package Labelling) 도입 검토 중 — 동향 모니터링 권장. NI 판매 시 EU 첨가물 규정 적용(별도).',
      urgency: 'Post-Brexit',
      enforcementDate: '시행 중',
    },
  },
  'Germany': {
    'grains': {
      country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪',
      law: '[EU Base] Reg (EC) 396/2005 + [Local] Lebensmittel- und Futtermittelgesetzbuch (LFGB)',
      lawUrl: 'https://www.bvl.bund.de/',
      requirement: '[Strict Local Rule] BfR(연방위해평가원) 곡류 내 글리포세이트 잔류 강화 모니터링 — EU 기준 대비 독일 자체 검사 빈도 높음. LFGB §5 건강 위해 식품 규정 적용. 통밀·유기농 제품 독일 DLG 품질 인증 자율 적용(시장 기대).',
      advisory: '[EU Deviation] 독일 수출 시 BfR 권고 성분 목록 및 강화 모니터링 대상 농약 확인 권장. 글리포세이트 잔류 제품 독일 시장 소비자 민감도 높음 — 저농약 또는 유기농 원료 우선 검토. LFGB 위반 시 즉시 판매 금지 조치.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪',
      law: '[EU Base] Reg (EC) 853/2004 + [Local] LFGB / Tierische Lebensmittel-Hygieneverordnung (Tier-LMHV)',
      lawUrl: 'https://www.bvl.bund.de/',
      requirement: '[Strict Local Rule] 독일 Tier-LMHV: EU 규정 대비 도축·가공 위생 기준 추가 국내법 적용. BfR 특정 수산물(참치·고등어) 히스타민 강화 모니터링. 소·돼지 원산지 표시 독일 내 추가 표기 기대(자율 기준 강화). 비가열 육제품 리스테리아 관리 기준 엄격 적용.',
      advisory: '[EU Deviation] 독일 수출 육류·수산물 BfR 강화 모니터링 품목 확인 권장. 히스타민 관리 강화 — 참치·고등어 제품 내부 기준 100 mg/kg 이하 권장. 독일 소비자 원산지 요구 높음 — 원산지 증명 서류 완비 필수.',
      enforcementDate: '시행 중',
    },
  },
  'Switzerland (FSVO/FSAS)': {
    'fsmp': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Verordnung über Lebensmittel für besondere Verwendungszwecke (LMVBV) / LMG Art. 16',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: 'FSMP: LMVBV 식이요법식품 규정 준수. EU와 상호인정협정(MRA) 보유 — EU 허가 성분 대부분 인정. 독어·불어·이탈리아어 중 최소 1개 표기 의무. 유기농 원료 Bio Suisse 또는 CH-BIO 기준 인증 별도 필요.',
      advisory: 'EU 회원국 아님 — EU 허가가 스위스 허가로 자동 연결 불가. MRA 활용하되 스위스 독자 허용 목록 교차 확인 필수. Swissmedic 경계 제품(의약품 해당 여부) 사전 분류 권고.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Lebensmittelgesetz (LMG) / Verordnung über neuartige Lebensmittel (VNL)',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: '신규 식물성 단백질: VNL(Novel Food Ordinance) 사전 허가 필요. EU Novel Food 허가 성분은 MRA로 일반적 인정. 독어·불어·이탈리아어 중 1개 이상 라벨 의무. 유기농 식물성 제품 Bio Suisse 인증 별도 필요.',
      advisory: 'EU와 MRA 활용 가능하나 스위스 독자 VNL 목록 교차 확인 필수. 유기농 표시는 Bio Suisse 인증 없이 사용 불가 — EU 유기농 인증과 별개. 스위스 GMO 규제(임시 유예 연장 중) 최신 상황 확인.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ) / LMG',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: '잔류농약 MRL: VPRÜ 스위스 독자 목록 적용(EU MRL과 대부분 동일하나 일부 상이). 아플라톡신: EU 기준 동일 적용. 유기농 곡물 Bio Suisse 기준 준수. 국내 언어 최소 1개 이상 라벨 표기 의무.',
      advisory: '스위스 VPRÜ와 EU MRL 목록 대부분 일치하나 일부 항목 차이 존재 — 수출 전 스위스 VPRÜ 별도 교차 확인 권장. 유기농 곡물 Bio Suisse 인증 없이 "Bio" 표기 불가.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Lebensmittelgesetz (LMG) / Verordnung über Lebensmittel tierischer Herkunft (VLtH)',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: '동물성 식품: VLtH 준수. EU 승인 도축시설 스위스 MRA를 통해 일반적 인정. 히스타민: EU 기준 동일 적용(100~200 mg/kg). 국내 언어 최소 1개 이상 라벨 의무. 수의사 위생 증명서 필수.',
      advisory: 'EU 승인 시설은 스위스 MRA로 대부분 인정. 단, 일부 품목은 스위스 FSVO 별도 승인 필요 — 수출 전 확인. 스위스 도착 수의사 검역 절차 사전 안내 권장.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ)',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: 'VPRÜ 잔류농약 기준 적용(EU MRL과 대부분 동일). 신선 채소 식물검역 증명서 필수(스위스 식물검역법). 유기농 채소 Bio Suisse 또는 CH-BIO 인증. 국내 언어 최소 1개 표기 의무(가공 채소).',
      advisory: '스위스 VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 FSVO 데이터베이스 교차 확인. 유기농 채소 "BIO" 표기 Bio Suisse 인증 없이 사용 불가. 스위스 식물검역 절차 EU와 별개 적용.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'VPRÜ (잔류농약) / Verordnung über pflanzliche Lebensmittel / LMG',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: 'VPRÜ 잔류농약 기준(EU MRL과 대부분 동일). 가공 과일 제품: LMG 식품 안전법 준수. 유기농 과일 Bio Suisse 인증. 국내 언어 최소 1개 라벨 의무. 신선 과일 식물검역 증명서 필요.',
      advisory: '스위스 유기농 과일 시장 규모 크고 Bio Suisse 인증이 사실상 시장 진입 요건. VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 확인. 포스트하베스트 처리제 스위스 허용 목록 EU와 상이할 수 있음.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Verordnung über Lebensmittel tierischer Herkunft (VLtH) / Milchverordnung / LMG',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: 'VLtH 동물성 식품 규정 + Milchverordnung 우유 성분 기준 준수. EU MRA: EU 승인 유가공 시설 일반적 인정. 살균 의무. 국내 언어 최소 1개 표기. 유기농 유제품 Bio Suisse 인증 필요. 수의사 위생증명서 필수.',
      advisory: '스위스 Milchverordnung 성분 기준 EU와 유사하나 독자 운영 — MRA 활용하되 항목별 확인 필수. Bio Suisse 유기농 유제품 인증 스위스 시장에서 프리미엄 강점. 수의사 증명서 스위스 FSVO 양식 요구 여부 사전 확인.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭',
      law: 'Verordnung über Zusatzstoffe in Lebensmitteln (ZuV) / Verordnung über Backwaren / LMG',
      lawUrl: 'https://www.blv.admin.ch/',
      requirement: 'ZuV 식품 첨가물 규정 준수(EU Reg 1333/2008과 대부분 일치하나 독자 운영). E171(이산화티타늄): 스위스 독자 검토 중 — 현재 상태 FSVO 확인 필수. Potassium Bromate 금지. 유기농 베이커리 Bio Suisse 기준. 국내 언어 최소 1개 라벨 의무.',
      advisory: '스위스 ZuV와 EU 첨가물 목록 대부분 일치하나 일부 항목 독자 결정 — 수출 전 FSVO 최신 목록 교차 확인. E171 스위스 현황 EU 금지와 다를 수 있음. 유기농 베이커리 Bio Suisse 인증이 스위스 시장 필수 요건.',
      enforcementDate: '시행 중',
    },
  },
  'Nordic/Hungary': {
    'fsmp': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[HU] Népegészségügyi termékadó (NETA 2011) / [FI] Soft Drink Tax Act / [DK] Sukkerafgiftsloven',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 헝가리 NETA: 고당류·고카페인·에너지드링크 건강세 부과(음료 8~40 HUF/L). 핀란드 가당음료세: €0.11/L(설탕 0.5~8g/100mL) / €0.22/L(8g/100mL 초과). 덴마크 설탕세 논의 지속. Nutri-Score 의무화: 프랑스(필수), 독일·벨기에·네덜란드(자율 권장).',
      advisory: '헝가리·핀란드 수출 시 당류 함량에 따른 세율 부과 제품 선별 필수. EU 단일 규정 외 개별 국가 세금이 가격 경쟁력에 직접 영향. 저당·무가당 포뮬레이션으로 추가 세금 부담 회피 전략 권장.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[HU] NETA 2011 / [FI] Soft Drink Tax Act / [SE] Livsmedelsverket 성분 권고',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 헝가리 NETA: 식물성 가당 음료·에너지드링크 건강세 적용. 핀란드 가당음료세: 식물성 음료 포함 적용 여부 확인(당류 함량 기준). 스웨덴 Livsmedelsverket: 영양 프로파일 권고 기준 강화. Nutri-Score 적용 국가별 의무·자율 상이.',
      advisory: '식물성 음료 수출 시 헝가리·핀란드 당류 세금 부과 여부 사전 확인. 저당 설계로 추가 세부담 회피 가능. Nutri-Score 국가별 의무 상이 — 프랑스 수출 시 의무, 기타 북유럽은 자율 권장.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[HU] NETA 2011 / [FI] Soft Drink Tax (곡물가공 음료 포함) / [DK] Sukkerafgiftsloven',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 곡물 기반 가당 음료(귀리·쌀음료 등) 핀란드 가당음료세 부과 대상 가능. 헝가리 NETA: 가당 시리얼바·곡류 스낵류 포함 검토. Nutri-Score 의무(프랑스) 또는 자율 권장(독일·벨기에). 덴마크: 설탕세 부과 품목 리스트 확인 필요.',
      advisory: '귀리·쌀 음료 북유럽 수출 시 당류 함량에 따른 세율 부과 여부 각 국가별 최신 기준 확인 필수. 저당 귀리음료 시장 성장 추세 — 저당 포뮬레이션으로 세금 부담 없이 경쟁력 확보 가능.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[NO] Mattilsynet Guidelines / [SE] Livsmedelsverket Fish & Meat / [DK] Fødevarestyrelsen',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 노르웨이·스웨덴: 수산물 항생제 잔류 기준 EU보다 엄격 모니터링. 북유럽 전반: 육류 원산지 표시 소비자 요구 높음(자율적 추가 표기 일반화). 덴마크·스웨덴: 미세플라스틱 어류 오염 관리 자체 가이드라인. 헝가리 NETA: 어류 가공 제품(훈제·조림) 일부 해당 여부 확인.',
      advisory: '북유럽 수산물 시장 진출 시 항생제 잔류 기준 강화 모니터링 대상 여부 확인. 소비자 원산지 투명성 요구 높음 — QR코드 기반 원산지·생산 이력 정보 제공 검토 권장.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[SE/DK/NO] National Organic Standards / [HU] NETA 2011 (가공 채소 포함)',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 스웨덴·노르웨이: 유기농 채소 인증 기준 EU 기준 대비 추가 요건(농약 잔류 불검출 목표). 헝가리 NETA: 가당 채소 가공 음료·주스 세금 부과 대상 가능. 핀란드 가당음료세: 채소·과채 혼합 주스 포함 여부 확인. Nutri-Score 자율 적용 국가에서 채소 가공품 점수 표시 권장.',
      advisory: '북유럽 유기농 채소 시장 진출 시 국가별 유기농 인증 추가 요건 사전 확인. 채소 혼합 주스 핀란드·헝가리 세금 적용 여부 확인. Nutri-Score 점수 표시 시 마케팅 경쟁력 강화 가능.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[FI] Soft Drink Tax (과일 주스 포함) / [HU] NETA 2011 / [DK] Sugar Tax Discussion',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 핀란드 가당음료세: 가당 과일 주스·넥타르 포함 적용(당류 0.5g/100mL 초과 시). 헝가리 NETA: 가당 과일 음료·과일 에너지드링크 세금 부과. 덴마크: 설탕세 재도입 논의 중(과일 주스 포함). Nutri-Score 자율 권장 국가(독일·벨기에): 과일 제품 점수 표시 시장 경쟁력 강화.',
      advisory: '가당 과일 음료 핀란드·헝가리 수출 시 세율 부과 규모 사전 계산 필수. 100% 과일 주스(무가당) 세금 면제 여부 핀란드 법령 확인. 저당 과일 음료 설계로 추가 세부담 회피 권장.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[FI] Soft Drink Tax (가당 유제품 음료) / [HU] NETA 2011 / [SE] Livsmedelsverket 영양 권고',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 핀란드 가당음료세: 가당 유제품 음료(가당 요거트 드링크·가당 밀크음료) 세금 부과 여부 확인(당류 함량 기준). 헝가리 NETA: 가당 유제품 음료·에너지 유제품 포함 검토. 스웨덴 Livsmedelsverket: 포화지방 저감 권고(유제품 적용). Nutri-Score 국가별 의무·자율 상이.',
      advisory: '가당 유제품 음료(초코우유·가당 요거트 드링크) 핀란드·헝가리 세율 부과 여부 사전 확인. 포화지방 높은 유제품 Nutri-Score 점수 낮아질 수 있음 — 저지방 제품 라인 병행 검토. 북유럽 소비자 저당·저지방 유제품 선호도 높음.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮',
      law: '[HU] NETA 2011 (제과·스낵) / [FI] Soft Drink Tax / [DK] Sugar Tax / [NO] Avgift sukker',
      lawUrl: 'https://www.stm.fi/',
      requirement: '[EU Divergence] 헝가리 NETA: 고당류 과자·사탕·초콜릿바 건강세 부과(상품별 차등세율). 핀란드 가당음료세: 음료성 제과(가당 시럽·초콜릿 음료) 포함 여부 확인. 노르웨이 설탕세(Avgift sukker): 설탕 kg당 세금 부과 — 초콜릿·제과류 직접 영향. 덴마크: 지방세 폐지(2012), 설탕세 논의 재개.',
      advisory: '노르웨이 설탕세가 제과류 원가에 직접 영향 — 수출 가격 경쟁력 분석 필수. 헝가리 NETA 제과 세율표 최신 버전 확인 및 제품별 세금 부담 계산. 저당·무가당 제과 라인 개발로 북유럽·헝가리 세금 부담 최소화 전략 권장.',
      enforcementDate: '시행 중',
    },
  },
  'USA (FDA)': {
    'fsmp': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: '21 CFR 101.9(j)(8) — Medical Food Definition',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.9',
      requirement: '고정된 다량영양소 비율 없음. 의사 평가를 통해 "특수한 영양 요건"을 충족해야 함. 반드시 의료 감독 하에 사용.',
      advisory: '수입 시 FSVP (21 CFR Part 1, Subpart L) 준수 필수. FSMA 204 이력추적 기록은 2028년부터 적용.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: 'FDA Plant-Based Labeling Guidance / 21 CFR Part 131',
      lawUrl: 'https://www.fda.gov/food/food-labeling-nutrition/plant-based-labeling',
      requirement: '"우유(Milk)" / "육류(Meat)" 명칭 사용 제한 (표준 정의 제품에만 허용). 대체 단백질 제품은 별도 명칭 사용 권장. 대두(Soy)는 GRAS 인정.',
      advisory: 'Plant-based meat는 USDA FSIS가 아닌 FDA 관할. 단백질 소화율(PDCAAS) 및 영양 라벨 정확도 검토 필수.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: '21 CFR Part 137 — Cereal Flours and Related Products',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-137',
      requirement: '강화밀가루 성분 기준(티아민·리보플라빈·나이아신·철분 필수 강화). 전곡물 표시 기준은 FDA 가이던스 준수. 잔류농약 MRL은 EPA 설정.',
      advisory: '영양 강화(Enrichment) 기준 충족 여부 라벨 검토 필수. 전곡물(Whole grain) 표시 시 FDA 정의 기준 확인.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'USA (FDA / FSIS)', flag: '🇺🇸',
      law: 'FMIA / PPIA / EPIA — USDA FSIS / 21 CFR Part 123 (Seafood HACCP)',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-123',
      requirement: '모든 도축에 대한 전·사후 검사 의무. 수산물: HACCP 21 CFR 123 적용. 달걀: 액란 살균 의무(EPIA). 즉석섭취식품(RTE) 내 리스테리아 불검출.',
      advisory: 'FSIS 관할(육류·가금류)과 FDA 관할(수산물·알가공품) 구분 필수. FSMA 204 이력추적(traceability) 적용 대상에 수산물 포함(2028).',
      urgency: 'FSIS+FDA',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: '21 CFR Part 112 — Produce Safety Rule (FSMA)',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112',
      requirement: '농업용수 수질 기준. 생물학적 토양 개량제 규정. 작업자 건강·위생 기준. 새싹류: 추가 미생물 검사. 적용 대상 농산물 목록 확인 필수.',
      advisory: 'FSMA Produce Safety Rule 적용 규모·품목 확인. 미국 직수출 시 FSVP(Foreign Supplier Verification) 필수.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: '21 CFR Part 112 — Produce Safety / EPA Pesticide Tolerances',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112',
      requirement: 'FSMA Produce Safety Rule 대부분 과일 적용. 농업용수·토양 개량제·작업자 위생 기준 준수. EPA가 농약별·품목별 MRL(허용한계) 설정.',
      advisory: 'FDA Import Alert 확인 후 수출. 표면처리제(왁스 등) 사용 시 표시 의무 및 성분 허가 여부 확인.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'USA (FDA / USDA)', flag: '🇺🇸',
      law: '21 CFR Part 131 — Milk & Cream / PMO (Grade A Pasteurized Milk Ordinance)',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-131',
      requirement: 'Grade A 기준: 체세포수 ≤ 750,000/mL. 살균 의무. 치즈·버터·요거트 성분 기준 (21 CFR Parts 131-135). 영양성분표 내 첨가당 표시 의무.',
      advisory: 'PMO 최신 버전(2023 edition) 준수 여부 확인. 유사 유제품(lactose-free, plant-based) 명칭 사용 시 별도 FDA 기준 적용.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'USA (FDA)', flag: '🇺🇸',
      law: '21 CFR Part 136-137 — Bakery Products / Trans Fat Rule',
      lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-136',
      requirement: 'PHO(부분수소화유) 사용 금지. 빵·롤 성분 규격 기준. 첨가당 표시 의무. 전면 영양 표시(FoPL) 규칙 제안 중(2025).',
      advisory: 'PHO 성분 포함 제품 미국 수출 불가. FoPL 제안 규칙 모니터링 및 라벨 개정 사전 준비 권장.',
      urgency: 'PROPOSED',
      enforcementDate: '시행 중',
    },
  },
  'Japan (CAA)': {
    'fsmp': {
      country: 'Japan (CAA)', flag: '🇯🇵',
      law: '特別用途食品制度 — Consumer Affairs Agency (2024.04.01 이관 완료)',
      lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/',
      requirement: '병자용 특별용도식품 허가 필요. 2024.04.01 관할청 MHLW → 소비자청(CAA) 이관 완료. 신규 인허가 창구: caa.go.jp.',
      advisory: '이관 완료(2024.04.01) — 소비자청(CAA) 창구로 신규 허가 신청. 기능성표시식품(機能性表示食品)과 특별용도식품 관할 기관 혼동 주의.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Japan (CAA)', flag: '🇯🇵',
      law: '大豆 / 植物性たんぱく 품질 기준 (CAA 이관 2026.04.01)',
      lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/',
      requirement: 'JAS 표준 준수. 대두 알레르겐 표시 의무. 2026.04.01부로 관할청이 소비자청(CAA)으로 전환.',
      advisory: '대두 함유 제품의 알레르겐 표시 폰트·위치 규정 확인. CAA 이관 후 인허가 창구 업데이트.',
      urgency: 'D-22',
      enforcementDate: '2026.04.01',
    },
    'grains': {
      country: 'Japan (CAA/MHLW)', flag: '🇯🇵',
      law: '農薬残留規制 ポジティブリスト制度 (Positive List)',
      lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html',
      requirement: '목록 외 농약은 기본 0.01 ppm 적용. 소맥: Glyphosate 30 ppm. 현미: Cadmium 0.4 mg/kg. 2026.04.01 CAA 이관.',
      advisory: 'Positive List 외 성분 검출 시 전량 수입금지. 잔류농약 검사 성적서 항목 목록 주기적 업데이트 필요.',
      enforcementDate: '2026.04.01',
    },
    'meat-fish': {
      country: 'Japan (CAA/MHLW)', flag: '🇯🇵',
      law: '食品衛生法 食肉·魚介類 / 乳肉水産基準 (2026.04.01 CAA 이관)',
      lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/',
      requirement: '식육 위생감시원 검사 의무. 소고기: BSE 검사 적용. 어패류: 히스타민 200 mg/kg 이하. 2026.04 CAA 이관 후 인허가 창구 변경.',
      advisory: 'CAA 이관 전후 수출 서류상의 관할기관명 변경 확인. 수산물 이력추적 시스템 CAA 요건 준수.',
      urgency: 'D-22',
      enforcementDate: '2026.04.01',
    },
    'vegetables': {
      country: 'Japan (CAA/MHLW)', flag: '🇯🇵',
      law: '農薬残留ポジティブリスト制度 / 食品衛生法',
      lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html',
      requirement: '목록 외 농약: 0.01 ppm 일률 기준. 2026.04.01 CAA 이관. 수입 검사 강화 품목 지정 주기적 변경.',
      advisory: '최신 강화 검사 품목(요주의리스트) 확인 후 수출 전략 조정. 0.01 ppm 기준 초과 시 전량 수입 금지.',
      urgency: 'D-22 CAA',
      enforcementDate: '2026.04.01',
    },
    'fruits': {
      country: 'Japan (CAA/MHLW)', flag: '🇯🇵',
      law: '農薬残留ポジティブリスト / 果実基準 (2026.04.01 CAA 이관)',
      lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html',
      requirement: '0.01 ppm 일률 기준 적용. 수입 감귤류: Thiabendazole 사용 시 표시 의무. 중국산 과일 검역 강화 지속.',
      advisory: '소비자청 이관 후 수입 금지·제한 과일 리스트 최신 버전 확인. 검역 대상 병해충 기준도 함께 체크.',
      urgency: 'D-22 CAA',
      enforcementDate: '2026.04.01',
    },
    'dairy': {
      country: 'Japan (CAA)', flag: '🇯🇵',
      law: '乳及び乳製品の成分規格等に関する省令 (CAA 이관 2026.04.01)',
      lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/',
      requirement: '우유 성분 기준: 유지방 3.0% 이상, 무지유고형분 8.0% 이상. 살균 의무. 알레르겐(우유) 의무 표시. 2026.04.01 소비자청으로 관할 이관.',
      advisory: 'CAA 이관 후 유제품 관련 허가·신고 창구 변경. 기능성표시식품 중 유제품 기반 제품도 CAA 심사 대상.',
      urgency: 'D-22',
      enforcementDate: '2026.04.01',
    },
    'bakery': {
      country: 'Japan (CAA)', flag: '🇯🇵',
      law: '菓子類食品規格 / 食品添加物公定書 (2026.04.01 CAA 이관)',
      lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/',
      requirement: '보존료·산화방지제 등 첨가물 기준 준수. 알레르겐 8종 의무 + 20종 권장 표시. 2026.04.01 소비자청 이관.',
      advisory: '제과류 알레르겐 표시 폰트·위치 기준 재확인. CAA 이관 후 신제품 신고 절차 업데이트.',
      urgency: 'D-22',
      enforcementDate: '2026.04.01',
    },
  },
  'Thailand (Thai FDA)': {
    'fsmp': {
      country: 'Thailand (Thai FDA)', flag: '🇹🇭',
      law: 'Food Act B.E. 2522 — 특수 의료 목적 식품 (Thai FDA)',
      lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      requirement: '태국 FDA 사전 등록 및 수입 허가 필수. 성분 기준 Codex 기반 적용. Cyclamate 사용 전면 금지. 태국어 라벨(태국어) 표시 의무.',
      advisory: 'Cyclamate 함유 제품 수출 불가. Tartrazine 50mg/kg 한도(2025.07 강화) 확인. 2026.04 온라인 허가 갱신 시스템 사전 등록 권고.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Thailand (Thai FDA)', flag: '🇹🇭',
      law: 'Food Act B.E. 2522 / TISI 2413 — 두유·식물성 단백질 식품',
      lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      requirement: '두유·식물성 단백질 제품 FDA 등록 의무. 성분 Codex 기준 적용. Cyclamate 금지. 태국어 라벨 표시 의무. 포장 중금속 기준 준수.',
      advisory: 'Cyclamate 감미료 함유 식물성 제품 수출 불가. Tartrazine 한도(50mg/kg) 준수. TISI 인증 여부 TISI 홈페이지에서 사전 확인 권장.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Thailand (Thai FDA)', flag: '🇹🇭',
      law: 'MOPH Notification No. 468 (2025.12.12 발효) — 과자·빵류 식품첨가물 (Thai FDA)',
      lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      requirement: 'Cyclamate 사용 전면 금지(식품 내 허용 불가). 타르트라진(Tartrazine, E102) 최대 50mg/kg(No. 468 강화). 보존료·착색료 허용 목록 MOPH Notification No. 468 준수. 태국어 라벨 의무.',
      advisory: 'Cyclamate·Potassium Bromate 함유 제품 태국 수출 금지. Tartrazine 50mg/kg 기준(MOPH No. 468, 2025.12.12) 적용. 2026.04 수입 허가 갱신 온라인 시스템 등록 사전 준비.',
      urgency: '주의',
      enforcementDate: '2025.12.12',
    },
  },
  'Taiwan (TFDA)': {
    'fsmp': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: '特殊營養食品管理辦法 — TFDA',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '임상 데이터 의무 제출. 수입 등록 필수. 당뇨·종양 환자용 제품은 강화된 임상 근거 요구.',
      advisory: '2025.09.15 개정 임상데이터 요건 시행 중. GABA 성분 포함 시 별도 사용 제한 기준(2025.02) 적용.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: '植物性蛋白食品 관련 기준 (TFDA)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '수입 등록 및 성분표 제출 필수. 잔류농약 기준 2025.11.26 개정 적용. 표시사항 중국어 의무.',
      advisory: '개정 잔류농약 MRL 기준 충족 여부 즉시 검토. 식물성 원료 농약 잔류 검사 성적서 구비 필수.',
      enforcementDate: '2025.11.26',
    },
    'grains': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: 'TFDA 殘留農藥 기준 (2025.11.26 개정)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '곡류 잔류농약 기준 전면 개정 시행(2025.11.26). 수입 곡류 검사 강화. 성분표 및 원산지 표시 의무.',
      advisory: '개정 MRL로 일부 항목 기준 강화. 기존 검사 성적서 재검토 및 최신 기준값 적용 확인 필수.',
      urgency: 'Updated',
      enforcementDate: '2025.11.26',
    },
    'meat-fish': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: 'TFDA 畜禽産品 / 水産物 殘留農藥 基準 (2025.11.26 개정)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '축산물 및 수산물 잔류농약 기준 2025.11.26 전면 개정. 수입 축산물 검역 증명서 의무. 중국어 라벨 표시 필수.',
      advisory: '개정 MRL 기준 충족 검사 성적서 구비. 항생제 잔류(예: 테트라사이클린류) 기준 강화 항목 우선 확인.',
      urgency: 'Updated',
      enforcementDate: '2025.11.26',
    },
    'vegetables': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '채소류 잔류농약 기준 전면 개정(2025.11.26 발효). 수입 검사 강화. 원산지 표시 및 중국어 라벨 의무.',
      advisory: '2025.11 개정 MRL 기준값 항목별 비교표 작성 후 원료 사전 검토 필수.',
      urgency: 'Updated',
      enforcementDate: '2025.11.26',
    },
    'fruits': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '과일류 잔류농약 기준 2025.11.26 개정 발효. 수입 검사 강화. 중국어 원산지·성분 표시 의무.',
      advisory: '개정 후 기준값 변경 항목(특히 熱帶水果) 우선 확인. 기존 검사 성적서 재검토 필요.',
      urgency: 'Updated',
      enforcementDate: '2025.11.26',
    },
    'dairy': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: '乳品類衛生標準 / 乳品名稱及標示規定 (2025.06 개정)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: '우유 제품명 및 표시 규정 2025.06.24 개정. 유지방 함량별 제품 명칭 기준 변경. 수입 유제품 검역 성적서 의무.',
      advisory: '2025.06 개정 제품명 기준 재검토 필수. "鮮乳" 등 명칭 사용 요건 변경 사항 확인.',
      urgency: 'Updated',
      enforcementDate: '2025.06.24',
    },
    'bakery': {
      country: 'Taiwan (TFDA)', flag: '🇹🇼',
      law: '食品添加物使用範圍及限量 / GABA 제한 기준 (2025.02 시행)',
      lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16',
      requirement: 'GABA(γ-아미노뷰티르산) 함유 제과류: 2025.02.13 사용 제한 및 의무 표시 시행. 보존료·감미료 사용 한도 준수. 중국어 표시 의무.',
      advisory: 'GABA 함유 제과 제품 전면 검토. 표시사항 TFDA 기준 재검토. 신규 첨가물 허가 목록 최신화 필요.',
      urgency: 'Updated',
      enforcementDate: '2025.02.13',
    },
  },
  'Philippines (FDA PH)': {
    'fsmp': {
      country: 'Philippines (FDA PH)', flag: '🇵🇭',
      law: 'RA 3720 (Food, Drug and Cosmetic Act) + FDA AO 2014-0030 (FSMP) + FDA AO 2020-0023 (Novel Food)',
      lawUrl: 'https://www.fda.gov.ph/',
      requirement: '필리핀 FDA LTO(License to Operate) 및 CPR(Certificate of Product Registration) 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요.',
      advisory: '필리핀 FDA LTO 및 CPR 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Philippines (FDA PH)', flag: '🇵🇭',
      law: 'FDA AO 2014-0030 + BPI Organics Certification + FDA AO 2020-0023 (Novel Food for PBF)',
      lawUrl: 'https://www.fda.gov.ph/',
      requirement: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수.',
      advisory: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Philippines (FDA PH)', flag: '🇵🇭',
      law: 'FDA AO 2014-0030 + BFAD 식품첨가물 기준 + Codex Stan 118 준용',
      lawUrl: 'https://www.fda.gov.ph/',
      requirement: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요.',
      advisory: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요.',
      enforcementDate: '시행 중',
    },
  },
  'Hong Kong (CFS/FEHD)': {
    'fsmp': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food and Drugs (Composition and Labelling) Regulations — Cap 132W / CFS Guideline',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: 'Pre-market approval 불필요(홍콩 독자 정책). 영양성분 표시 의무(2010년 시행). 영어·번체 중국어(Traditional Chinese) 병기 표시 필수. 알레르겐 8종 의무 표시. 위생 성적서·원산지 증명 필요.',
      advisory: '중국 본토(SAMR GB 기준)와 홍콩(CFS/FEHD) 규제 완전히 별개 — 별도 라벨 설계 필수. 번체자(Traditional Chinese) 사용 의무 — 간체자(Simplified Chinese) 불인정. Codex 기준 준용으로 대부분 성분 허용.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '식물성 식품 Pre-market approval 불필요. 영양성분 표시 의무. 영어·번체 중국어 병기 필수. GMO 성분 함유 시 표시 의무("基因改造"). 대두 알레르겐 의무 표시.',
      advisory: '홍콩은 중국 본토와 별개 규제 — 간체자 불인정, 번체자(Traditional Chinese) 필수. GMO 표시 기준 홍콩 독자 적용. 식물성 음료류 영양성분 표시 의무 항목 CFS 가이드라인 확인.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food Safety Ordinance Cap 612 / CFS 잔류농약 가이드라인',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '곡류·가공 시리얼: Pre-market approval 불필요. 잔류농약 기준은 Codex MRL 준용. 아플라톡신: Codex 기준 적용. 영어·번체 중국어 병기 라벨 의무. 수입 시 식품 안전 기준 준수 사업자 책임.',
      advisory: '홍콩 규제는 Codex 기반으로 비교적 유연. 단, 영어·번체자 이중 표기 누락 시 판매 금지 조치. 곡류 가공 제품 내 첨가물은 Cap 132W Regulations 허용 목록 준수.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food Safety Ordinance Cap 612 / Public Health (Animals and Birds) Ordinance Cap 139',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '수입 육류: 원산지별 허가 국가·지역 리스트 확인 필수(FEHD 승인 국가만). 수산물: Cap 132W 위생 기준 적용, 히스타민 200 mg/kg 이하. 영어·번체자 병기 라벨 의무. Pre-market approval 불필요.',
      advisory: '홍콩 수입 허가 육류 원산지 목록 FEHD 최신 버전 확인 필수(국가별 금지 조치 빈번). 수산물은 비교적 유연하나 위생 증명서 필수. 번체자 표기 누락 시 판매 금지.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food Safety Ordinance Cap 612 / Pesticide Residues in Food Regulation Cap 132CM',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: 'Cap 132CM 잔류농약 기준 적용(Codex 기반, 일부 독자 기준). 신선 채소 수입 허가 불필요 — 단, 잔류농약 위반 시 즉시 판매 금지. 영어·번체 중국어 병기 라벨. 신선 채소 콜드체인 유지 권장.',
      advisory: '홍콩 Cap 132CM MRL이 Codex와 일부 다를 수 있음 — 수출 전 CFS 데이터베이스 교차 확인 권장. 번체자 표기 누락 시 현지 마트 수입 거부 빈번. 신선 채소 항공 수출 시 콜드체인 문서 완비.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food Safety Ordinance Cap 612 / Cap 132CM 잔류농약 기준',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '신선 과일: 수입 허가 불필요, 잔류농약 기준 Cap 132CM(Codex 기반) 준수. 가공 과일 제품(주스·잼): 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 방부제 Cap 132U Regulations 허용 목록 준수.',
      advisory: '홍콩 CFS MRL이 Codex와 일부 다를 수 있음 — 수출 전 최신 목록 확인. 방부제 사용 시 Cap 132U Regulations 허용 목록 준수 필수. 가공 과일 제품 번체자 라벨 누락 시 판매 거부.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Milk Regulation',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '우유 수입 시 원산지별 검역 허가(Cap 132AH 준수). 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 살균 처리 표시 의무. 항생제 잔류 Codex 기준 적용.',
      advisory: '홍콩 우유 수입 허가 원산지 목록(Cap 132AH) 확인 필수 — 미승인 원산지 수입 불가. 번체자 라벨 의무. 홍콩은 중국 본토와 유제품 검역 기준 별개 운영.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰',
      law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Cap 132U Additives',
      lawUrl: 'https://www.cfs.gov.hk/',
      requirement: '제과·베이커리: Pre-market approval 불필요. 첨가물은 Cap 132U 허용 목록 준수. 영양성분 표시 의무. 영어·번체 중국어 병기 라벨 필수. Potassium Bromate 금지. E171(이산화티타늄): 중국 본토와 달리 홍콩에서 사용 가능(Codex 기준).',
      advisory: '홍콩은 Codex 기반 대부분 성분 허용. 단, Cap 132U 목록 외 첨가물 사용 시 위반. 번체자 병기 필수 — 간체자만 표기 시 판매 불가. E171 홍콩 허용이나 EU 수출 병행 시 성분 관리 분리 필요.',
      enforcementDate: '시행 중',
    },
  },
  'Vietnam (VFA)': {
    'fsmp': {
      country: 'Vietnam (VFA)', flag: '🇻🇳',
      law: 'Thông tư 43/2014/TT-BYT — 특수 영양 식품 규정 (VFA)',
      lawUrl: 'https://vfa.gov.vn/en/news.html',
      requirement: '특수 의료용 식품 수입 시 VFA 수입 허가(Import Permit) 필수. 성분 적합성 Self-Declaration 의무. 베트남어 라벨 표시 필수. 허용 첨가물 목록 Circular 24 적용.',
      advisory: '2026.01 온라인 수입허가 시스템 전환. 색소·감미료 성분 Circular 24 허용 목록 사전 확인 필수. 아조계 색소 한도 강화 적용 중.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Vietnam (VFA)', flag: '🇻🇳',
      law: 'Thông tư 43/2014 / Nghị định 15/2018 — 식물성 식품 수입 규정',
      lawUrl: 'https://vfa.gov.vn/en/news.html',
      requirement: '식물성 단백질 식품(두유·식물성 버거 등) 수입 시 VFA 수입 허가 필요. Self-Declaration 의무. 베트남어 성분표 필수. 허용 첨가물 Circular 24 적용.',
      advisory: '두유·식물성 단백질 제품 Circular 24 색소·보존료 한도 확인. 수입 허가 갱신 2026.01부터 온라인 전환. 아조계 색소 사용 시 사전 확인 필수.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Vietnam (VFA)', flag: '🇻🇳',
      law: 'Thông tư 24/2019/TT-BYT — 식품첨가물 허용기준 (VFA)',
      lawUrl: 'https://vfa.gov.vn/en/news.html',
      requirement: '아조계 색소(타르트라진, 선셋옐로우, 퀴놀린옐로우) 한도 강화 적용. Potassium Bromate 사용 전면 금지. 보존료(소르빈산·프로피온산) 한도 Circular 24 준수. 베트남어 라벨 필수.',
      advisory: 'Potassium Bromate 포함 제품 수출 즉시 중단. 아조계 색소 Circular 24 최신 한도 확인 필수. 수입 허가 갱신 2026.01 온라인 전환 사전 준비 필요.',
      enforcementDate: '시행 중',
    },
  },
  'Malaysia (MOH/JAKIM)': {
    'fsmp': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Act 1983 / Food Regulations 1985 / MOH 특수의료용도식품 가이드라인',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: 'MOH 사전 수입 허가 필수. 동물성 유래 원료 포함 시 JAKIM 할랄 인증(MS1500) 의무. MeSTI 제조 인증 병행 취득 필요. 말레이어·영어 이중 라벨 표시 의무.',
      advisory: 'FSMP 제품 내 동물성 유래 원료 사용 시 JAKIM 할랄 인증 필수. MeSTI 인증 병행 취득 권장. 아랍계 무슬림 소비자 비중 고려한 제품 설계.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: 'MOH 수입 허가 및 Food Regulations 1985 성분 기준 준수. 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가 — 공정 대체 필수. 말레이어 표시 의무.',
      advisory: '식물성 제품이라도 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가. 공정 전환 필요. 두부·대두 단백 제품 수출 유망.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Act 1983 / Food Regulations 1985 / MAQIS 식물검역법',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). 곰팡이독소: 아플라톡신 총량 15 μg/kg 이하. MAQIS 식물검역(Phytosanitary) 증명서 필수. 말레이어 라벨 표시 의무.',
      advisory: '곡류 수입 시 MAQIS 식물검역 사전 확인 필수. 가공 곡류에 동물성 처리제 사용 시 JAKIM 할랄 인증 필요. MeSTI 인증 권장.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Act 1983 / MAQIS 동물검역법 / JAKIM Halal Standard MS1500',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: 'MAQIS 동물성 식품 검역 서류 3종 동시 제출(2026.06~): 원산지 증명서·수의사 확인서·할랄 인증서. JAKIM 할랄 인증 필수(도축 방식 포함). 수산물: 위생증명서 + 잔류농약 성적서.',
      advisory: '돼지고기·돼지 유래 성분 전면 수입 금지. 소·양·가금류 할랄 도축 인증 필수. 2026.06부터 서류 미준수 시 반송 처리. 수산물은 히스타민 200 mg/kg 이하 확인.',
      enforcementDate: '2026.06.01',
    },
    'vegetables': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Regulations 1985 / MAQIS 식물검역법',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). MAQIS 식물검역(Phytosanitary) 증명서 의무. 신선 가공 채소: 미생물 기준(대장균군 불검출) 준수. 말레이어 라벨 표시 필수.',
      advisory: 'MAQIS 수입 검역 사전 확인 필수. Chlorpyrifos 등 EU 금지 농약 잔류 시 수입 거부 가능. 냉장 신선 채소 콜드체인 문서 준비 권장.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Regulations 1985 / MAQIS 식물검역법',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: '잔류농약 MRL: Codex 준용. MAQIS 식물검역 증명서 필수. 수입 가공 과일·건과류: Food Regulations 1985 보존료·첨가물 기준 준수. 말레이어 라벨 의무. 방사선 조사 처리 제품 표시 필요.',
      advisory: '열대 과일 수출 유망 품목이나 MAQIS 검역 기준 엄격. 건과류·과일 가공품에 동물성 성분 사용 시 JAKIM 할랄 인증 병행 필요. 포스트하베스트 처리제 허용 여부 사전 확인.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500 / MAQIS 동물검역',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: 'JAKIM 할랄 인증 필수(우유·유청 등 동물성 유래 전 성분). MAQIS 동물성 식품 검역 서류 3종(원산지 증명서·수의사 확인서·할랄 인증서). 살균 의무 및 MeSTI/HACCP 인증. 말레이어 라벨 표시 필수.',
      advisory: '모든 유제품 JAKIM 할랄 인증 필수. 치즈류 동물성 레닛 사용 시 할랄 원산지 증명 필요. 수입 유제품 MAQIS 검역 2026.06 강화 시행 사전 준비.',
      enforcementDate: '2026.06.01',
    },
    'bakery': {
      country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾',
      law: 'Food Regulations 1985 / JAKIM Halal MS1500',
      lawUrl: 'https://www.moh.gov.my/',
      requirement: 'Food Regulations 1985 허용 첨가물 목록 준수. 라드(돼지기름)·돼지 유래 젤라틴 사용 금지 — JAKIM 인증 식물성 쇼트닝으로 대체 필수. MeSTI 인증 권장. 말레이어 표시 의무.',
      advisory: '제과류 내 라드(돼지기름)·젤라틴(돼지 유래) 사용 전면 금지. JAKIM 인증 식물성 쇼트닝으로 대체 필수. 타르트라진 등 아조계 색소 허용 목록 확인.',
      enforcementDate: '시행 중',
    },
  },
  'Indonesia (BPOM)': {
    'fsmp': {
      country: 'Indonesia (BPOM)', flag: '🇮🇩',
      law: 'PP 69/1999 + BPOM Reg. HK.03.1.23.11.11.09909/2014 (PANGAN OLAHAN TERTENTU) + BPJPH Halal Certification (mandatory 2026.10)',
      lawUrl: 'https://www.pom.go.id/',
      requirement: 'BPOM ML 번호 등록 필수. 할랄 인증(BPJPH) 2026.10.17 전면 의무화. 기능성 원료는 Pangan Fungsional 카테고리 사전 허가 필요. 성분 SNI 및 BPOM 허가기준 준수.',
      advisory: 'BPOM ML 번호 등록 필수. 할랄 인증(BPJPH) 2024년 1단계(고위험 식품) 시행, 2단계(2026.10.17) 전면 의무화. GB 기준 아닌 자체 SNI 및 BPOM 허가기준 준수 필요.',
      enforcementDate: '2026.10.17',
    },
    'plant-based': {
      country: 'Indonesia (BPOM)', flag: '🇮🇩',
      law: 'BPOM Reg. No. 22 Tahun 2019 (Pangan Olahan) + SNI 01-3148 (Plant-based) + BPJPH 할랄 의무화',
      lawUrl: 'https://www.pom.go.id/',
      requirement: '식물성 단백질 제품 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가. 2026.10 이후 할랄 인증 전면 의무화.',
      advisory: '식물성 단백질 제품도 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가 (2026.10 이후 전면 의무화).',
      enforcementDate: '2026.10.17',
    },
    'bakery': {
      country: 'Indonesia (BPOM)', flag: '🇮🇩',
      law: 'BPOM Reg. No. 22 Tahun 2019 + SNI 01-3840 (Bakery) + BPJPH 할랄 의무화',
      lawUrl: 'https://www.pom.go.id/',
      requirement: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능.',
      advisory: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능.',
      enforcementDate: '2026.10.17',
    },
  },
  'Australia (FSANZ)': {
    'fsmp': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'Food Standards Code Standard 2.9.5 (FSMP) / Standard 1.1.1 Novel Food',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'Standard 2.9.5 성분 기준 준수 필수. 동물성 단백질(육류·난황·유청) 포함 제품은 Biosecurity Import Permit 의무 취득. 알룰로스 등 미허가 신규 성분 사용 시 Novel Food 사전 심사 필요.',
      advisory: '⚠️ Biosecurity Risk: 육류·난황·유청 단백질 포함 FSMP 제품은 수입 허가(Biosecurity Import Permit) 필수. 알룰로스 미허가(Novel Food 검토 중). Health Star Rating 시뮬레이션 권장.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'Food Standards Code Standard 1.3.1 / Standard 2.9.2 (Supplementary Foods)',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'Standard 1.3.1 허용 첨가물·영양 성분 목록 준수 필수. 레귀메이션·미세조류 등 신규 식물성 단백질은 Novel Food 사전 허가 필요. 알룰로스 함유 제품 현재 미허가 상태.',
      advisory: '식물성 대체단백·기능성 성분 Novel Food 해당 여부 사전 확인 필수. 알룰로스 함유 식물성 제품 호주 수출 시 현재 미허가 상태.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'Food Standards Code Standard 2.1.1 (Cereals) / DAFF Biosecurity',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: '아플라톡신 B1 ≤ 15 μg/kg, 총 아플라톡신 ≤ 15 μg/kg. DON(데옥시니발레놀) ≤ 2,000 μg/kg. FSANZ 잔류농약 MRL 준수. DAFF 식물검역 입항 신고 의무.',
      advisory: '일부 곡물 원산지에 따라 DAFF 바이오보안 강화 검역 적용. 곤충·해충 오염 리스크 제품은 열처리 처리 요구될 수 있음. Health Star Rating 가공 곡물 적용 검토.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'Biosecurity Act 2015 (DAFF) / FSANZ Standard 2.2 (Meat, Fish, Eggs)',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: '⚠️ 모든 육류·가금류·달걀 관련 가공품: DAFF 바이오보안 수입 허가(Biosecurity Import Permit) 필수. 히스타민: 수산물 200 mg/kg 이하. 리스테리아: RTE 제품 25g 불검출. 살모넬라: 달걀가공품 불검출.',
      advisory: '육류·달걀 성분 포함 가공식품은 수입 전 DAFF 허가 취득 필수(처리 기간 3~6개월). 수산물 HACCP 문서화 의무. 호주산 육류가 아닌 수입 육류는 별도 검역 강화 대상.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'FSANZ Standard 1.4.1 (Contaminants) / DAFF Biosecurity (Plant Quarantine)',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'FSANZ 잔류농약 MRL 준수(FSANZ MRL List). 미생물: 신선 엽채류 살모넬라 25g 불검출. DAFF 식물검역 입항 신고 필수. 일부 채소 수입 시 검역 처리(Heat Treatment 등) 요구될 수 있음.',
      advisory: '호주는 식물검역 매우 엄격 — 흙 묻은 채소 반입 금지. 가공 채소류는 FSANZ 식품첨가물 허용 목록 준수. 알룰로스 함유 가공 채소 제품 Novel Food 심사 대상 가능.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'FSANZ Standard 1.4.1 / DAFF Biosecurity (Plant Quarantine)',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'FSANZ 잔류농약 MRL 목록 준수. 포스트하베스트 처리제(Thiabendazole 등) 허용 목록 확인 필수. DAFF 식물검역 입항 신고 의무. 일부 신선 과일 검역 처리(증열·냉처리) 요구.',
      advisory: '호주는 신선 과일 검역 세계 최고 수준 엄격. 수입 가능 과일 목록(Approved Pathways) DAFF 사전 확인 필수. 가공 과일 제품은 FSANZ 식품첨가물 목록 내 성분만 사용 가능.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'FSANZ Standard 2.5.1–2.5.7 (Dairy Products) / DAFF Biosecurity',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'Standard 2.5.1 우유 성분 기준: 살균 의무. 치즈: Standard 2.5.4 성분 기준 준수. ⚠️ 유청 단백 분말·분유류: DAFF 바이오보안 수입 허가 대상 여부 확인 필수. 항생제 잔류 기준: 페니실린 0.003 mg/kg.',
      advisory: '생유(Raw Milk) 치즈 일부 수입 제한. 유청 단백 분말은 DAFF 바이오보안 허가 필요할 수 있음 — 처리 방식·원산지에 따라 상이. Health Star Rating 유제품 점수 사전 확인 권장.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'Australia (FSANZ)', flag: '🇦🇺',
      law: 'Food Standards Code Standard 2.9.1 / Biosecurity Act 2015',
      lawUrl: 'https://www.foodstandards.gov.au/',
      requirement: 'Standard 2.9.1 제과 성분 기준 준수. Potassium Bromate 사용 금지. 난황·우유 성분 포함 제품은 Biosecurity Import Permit 취득 여부 사전 확인 필수.',
      advisory: '난황·우유 성분 포함 제과류 바이오보안 수입 허가 대상 여부 확인 필수. Potassium Bromate 금지. Health Star Rating 표시 시 제과류 경쟁력 강화 효과 기대.',
      enforcementDate: '시행 중',
    },
  },
  'Canada (CFIA)': {
    'fsmp': {
      country: 'Canada (CFIA)', flag: '🇨🇦',
      law: 'Food and Drugs Act + FDR B.24 (Foods for Special Dietary Use) + Safe Food for Canadians Regulations (SFCR 2019)',
      lawUrl: 'https://www.canada.ca/en/health-canada.html',
      requirement: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 필수. 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장.',
      advisory: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 + 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'Canada (CFIA)', flag: '🇨🇦',
      law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Part B + Health Canada 식물성 단백질 가이드라인',
      lawUrl: 'https://www.canada.ca/en/health-canada.html',
      requirement: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수.',
      advisory: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수.',
      enforcementDate: '2026.01.01',
    },
    'bakery': {
      country: 'Canada (CFIA)', flag: '🇨🇦',
      law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Division 16 (Food Additives) + Health Canada Permitted Food Additives',
      lawUrl: 'https://www.canada.ca/en/health-canada.html',
      requirement: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수.',
      advisory: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수.',
      enforcementDate: '2026.01.01',
    },
  },
  'UAE (MoIAT)': {
    'fsmp': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 9/2013 / UAE.S 2055 / Emirates Authority for Standardization (ESMA)',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'GSO 9/2013 및 UAE.S 2055 성분 기준 준수. ESMA 제품 등록 필수. 아랍어 라벨 전 항목(성분·영양·유효기한) 표기 의무. ECAS 또는 ESMA 승인 할랄 인증서 첨부 필수.',
      advisory: '아랍어 라벨 전 항목 의무. ECAS/ESMA 승인 할랄 인증서 필수. GSO 영양 표시 2026 개정판 적용. 동물성 유래 성분 할랄 검증 우선.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 1694:2009 / UAE.S 2055 Plant-based Food Standards',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'GSO 1694:2009 식물성 식품 기준 준수. ESMA 제품 등록 필수. 아랍어 성분·영양 라벨 전 항목 의무 표기. 가당 식물성 음료 설탕세(Excise Tax) 적용 대상 — 저당 설계 권장.',
      advisory: '식물성 제품도 아랍어 라벨 의무 및 ESMA 등록 필요. 가당 식물성 음료는 설탕세 적용 대상. Stevia·Monk Fruit 대체 감미료 활용 권장.',
      enforcementDate: '시행 중',
    },
    'grains': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 14:1993 (곡류·시리얼 기준) / UAE.S 2055 / ESMA',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'GSO 14 기준 아플라톡신 총량 ≤ 10 μg/kg. 잔류농약 Codex MRL 준용. ESMA 가공 곡류 제품 등록 필수. 아랍어 성분·원산지 라벨 전 항목 표기 의무.',
      advisory: '원산지 증명서 + 식물검역 증명서 동시 제출 필수. 아플라톡신 기준 EU보다 엄격(10 μg/kg). 아랍어 라벨 미비 시 통관 거부 사례 다수.',
      enforcementDate: '시행 중',
    },
    'meat-fish': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 993:2015 (할랄 도축 기준) / UAE.S 2055 / ESMA / ECAS',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: '모든 육류·가금류 제품: ECAS 또는 ESMA 승인 기관 할랄 도축 인증서 필수. 수산물: GSO 기준 히스타민 200 mg/kg 이하. ESMA 제품 등록 + 아랍어 라벨 전 항목 의무 표기.',
      advisory: '할랄 도축 미인증 육류제품 통관 전면 금지. 어류·갑각류도 ECAS 할랄 인증 권장(무슬림 소비자 선호). 냉동 제품 콜드체인 온도 기록지 제출 필요.',
      enforcementDate: '시행 중',
    },
    'vegetables': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 9/2013 / Codex MRL 준용 / ESMA 식물검역',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'Codex 기준 잔류농약 MRL 준용. 식물검역 증명서(Phytosanitary Certificate) 필수. ESMA 가공 채소 제품 등록. 아랍어 성분·원산지 표기 의무.',
      advisory: '신선 채소 수입 시 원산지별 검역 리스크 확인. 가공 채소류 아랍어 라벨 전 항목 기재 필수. 무농약·유기농 채소 수출 시 GSO 유기농 인증 기준 별도 확인.',
      enforcementDate: '시행 중',
    },
    'fruits': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 9/2013 / Codex MRL 준용 / FTA 설탕세',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'Codex 잔류농약 MRL 준용. 식물검역 증명서 필수. 가공 과일 제품(잼·주스 등) ESMA 등록. 아랍어 라벨 전 항목 표기 의무. 가당 주스류 설탕세(50%) 적용 대상 확인.',
      advisory: '과일 주스·가당 과일 음료 설탕세 적용 대상 — 저당 설계 또는 Stevia 대체 검토 필요. 신선 과일 수입은 식물검역 증명서 필수. 아랍어 라벨 미비 시 통관 지연 빈발.',
      enforcementDate: '시행 중',
    },
    'dairy': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 223:1993 (유제품 기준) / ECAS Halal / ESMA / UAE.S 2055',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'ECAS 또는 ESMA 승인 기관 할랄 인증 필수. GSO 223 유제품 성분 기준 준수. 살균 의무. ESMA 제품 등록. 아랍어 라벨 전 항목(유지방·단백질·알레르겐 포함) 표기 의무.',
      advisory: '모든 유제품 할랄 인증 사실상 필수 — 레닛·유화제 등 동물성 첨가물 출처 검증 필요. 치즈류 수입 시 아랍어 전용 라벨 별도 제작 필수. GSO 2026 영양 표시 개정 대응 라벨 업데이트 필요.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'UAE (MoIAT)', flag: '🇦🇪',
      law: 'GSO 201:1994 / ESMA Halal Food Standard / FTA Excise Tax',
      lawUrl: 'https://www.moiat.gov.ae/',
      requirement: 'GSO 201:1994 제과 기준 준수. ESMA 제품 등록 및 아랍어 라벨 전 항목 표기 의무. 동물성 유화제(E471 등) 할랄 인증 필수. 고당류 제품 설탕세(Excise Tax) 적용 대상 확인 필요.',
      advisory: '제과류 고당류 제품 설탕세 확대 적용 논의 중. 저당 제품군 전환 검토. 동물성 유화제(E471 등) 출처 할랄 인증 필수. 아랍어 성분 라벨 전 항목 표기.',
      enforcementDate: '시행 중',
    },
  },
  'China (SAMR)': {
    'fsmp': {
      country: 'China (SAMR)', flag: '🇨🇳',
      law: 'GB 29922 / GB 25596 — 特殊医学用途配方食品',
      lawUrl: 'https://www.samr.gov.cn/',
      requirement: 'SAMR 사전 등록 필수. 원료는 GB 2760 허용 성분 목록 내에 있어야 함. "非肠外营养" 경고 문구 의무.',
      advisory: '등록 과정 최소 12-18개월 소요. GB 2760에 없는 한국 허용 성분은 반드시 대체 성분 검토 필요.',
      enforcementDate: '시행 중',
    },
    'plant-based': {
      country: 'China (SAMR)', flag: '🇨🇳',
      law: 'GB 2715 / GB 7718 — 大豆蛋白 식품 기준 (SAMR)',
      lawUrl: 'https://www.samr.gov.cn/',
      requirement: '식물성 단백질 식품 수입 시 GACC 등록 필수. 대두단백 제품은 GMO 표시 의무 (使用了转基因). 원료 GB 2760 첨가물 목록 준수. 중국어 라벨 필수.',
      advisory: 'GMO 대두 성분 포함 시 중국어 표시 필수. 대두 단백 추출 공정 서류(생산시설 등록) GACC에 사전 제출. GB 2760 외 첨가물 즉시 대체 검토.',
      enforcementDate: '시행 중',
    },
    'bakery': {
      country: 'China (SAMR)', flag: '🇨🇳',
      law: 'GB 7099 / GB 2760-2024 — 糕点·饼干 식품 첨가물 기준 (SAMR, 2025.02.08 시행)',
      lawUrl: 'https://www.samr.gov.cn/',
      requirement: 'Sunset Yellow(일몰황, 황색4호) 최대 100mg/kg(GB 2760-2024 기준, 시행 중). 사카린·사이클라민산나트륨 사용 허용(한도 내). 이산화티타늄(E171) 사용 가능(EU와 상이). 알레르겐 중국어 표시 의무.',
      advisory: '한국 허용 색소가 GB 2760에 없을 수 있음(예: 적색2호 금지). Sunset Yellow 100mg/kg 기준(GB 2760-2024, 2025.02.08 시행 중) 적용. GACC 등록 없이 수출 불가.',
      enforcementDate: '시행 중',
    },
  },
};

// ── Gemini 프롬프트 ───────────────────────────────────────────────
function buildPrompt(countryName: string, categoryKo: string, row: RawRow): string {
  return `당신은 식품 규제 전문 컨설턴트입니다.
다음은 [${countryName}]의 [${categoryKo}] 관련 식품 규제 원본 데이터입니다.

법규명: ${row.law}
주요 요건: ${row.requirement}
주의사항: ${row.advisory}
시행일: ${row.enforcementDate ?? '시행 중'}

아래 기준으로 분석하고 JSON으로만 응답하세요 (설명 없이 JSON만):

1. lawSummary: 법규명을 40자 이내로 압축 (핵심 법규 이름만)
2. consolidatedSummary: 요건과 주의사항에서 중복·반복되는 내용을 제거하고, 하나로 연결해서 해석할 수 있는 규정은 통합하여 서술. 핵심 수치(한도값·비율·온도 등)는 반드시 포함. 150~300자 이내 (한국어)
3. exportAlert: 한국 기업이 해당 국가로 수출할 때 가장 주의해야 할 사항 1~2문장 (수치 포함)

출력 형식 (JSON만, 마크다운 코드블록 없이):
{"lawSummary":"...","consolidatedSummary":"...","exportAlert":"..."}`;
}

// ── Gemini 호출 ───────────────────────────────────────────────────
async function generateSummary(
  countryName: string,
  categoryKey: string,
  row: RawRow,
): Promise<SummaryEntry> {
  const categoryKo = CATEGORY_KEY_MAP[categoryKey] ?? categoryKey;
  const prompt = buildPrompt(countryName, categoryKo, row);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() ?? '';
    // JSON 파싱 (마크다운 코드블록 제거)
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      lawSummary: parsed.lawSummary ?? row.law.slice(0, 40),
      consolidatedSummary: parsed.consolidatedSummary ?? '',
      exportAlert: parsed.exportAlert ?? '',
      enforcementDate: row.enforcementDate ?? '시행 중',
      reviewedBy: 'Gemini',
      reviewNote: '',
    };
  } catch (err) {
    console.warn(`  ⚠️  Gemini 응답 파싱 실패 (${countryName} / ${categoryKey}):`, err);
    return {
      lawSummary: row.law.slice(0, 40),
      consolidatedSummary: `[생성 실패] ${row.requirement.slice(0, 100)}`,
      exportAlert: row.advisory.slice(0, 100),
      enforcementDate: row.enforcementDate ?? '시행 중',
      reviewedBy: 'Gemini',
      reviewNote: '자동 생성 실패 — 수동 검토 필요',
    };
  }
}

// ── 메인 ─────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const countryFlagIdx = args.indexOf('--country');
  const filterCountry = countryFlagIdx >= 0 ? args[countryFlagIdx + 1] : null;

  const summariesPath = path.resolve(__dirname, '../src/data/summaries.json');
  let existing: SummariesJson = { version: '', entries: {} };
  if (fs.existsSync(summariesPath)) {
    existing = JSON.parse(fs.readFileSync(summariesPath, 'utf-8'));
  }

  const today = new Date().toISOString().slice(0, 10);
  existing.version = today;

  const countries = filterCountry
    ? Object.keys(RAW_DATA).filter(c => c.toLowerCase().includes(filterCountry.toLowerCase()))
    : Object.keys(RAW_DATA);

  if (countries.length === 0) {
    console.error(`❌ '${filterCountry}' 에 해당하는 국가 데이터가 RAW_DATA에 없습니다.`);
    process.exit(1);
  }

  for (const countryName of countries) {
    console.log(`\n🌏 ${countryName} 처리 중...`);
    if (!existing.entries[countryName]) {
      existing.entries[countryName] = {};
    }

    const categoryRows = RAW_DATA[countryName];
    for (const [categoryKey, row] of Object.entries(categoryRows)) {
      const categoryKo = CATEGORY_KEY_MAP[categoryKey] ?? categoryKey;

      // 이미 좋은 요약이 존재하면 건너뜀 (Claude/Manual 작성 또는 [생성 실패] 아닌 Gemini 결과)
      const existingEntry = existing.entries[countryName][categoryKey];
      if (existingEntry && !existingEntry.consolidatedSummary.startsWith('[생성 실패]')) {
        console.log(`   ${categoryKo} ... ⏭  기존 요약 유지 (${existingEntry.reviewedBy})`);
        continue;
      }

      process.stdout.write(`   ${categoryKo} ... `);
      const summary = await generateSummary(countryName, categoryKey, row);
      existing.entries[countryName][categoryKey] = summary;
      console.log(`✓ (${summary.reviewedBy})`);

      // API rate limit 방지 (Free tier: 5 req/min → 13초 간격)
      await new Promise(r => setTimeout(r, 13000));
    }
  }

  fs.writeFileSync(summariesPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`\n✅ summaries.json 저장 완료: ${summariesPath}`);
  console.log(`   버전: ${today}, 국가 수: ${Object.keys(existing.entries).length}`);
}

main().catch(err => {
  console.error('❌ 오류:', err);
  process.exit(1);
});
