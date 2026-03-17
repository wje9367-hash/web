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
import * as dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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
      model: 'gemini-2.0-flash',
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
      process.stdout.write(`   ${categoryKo} ... `);
      const summary = await generateSummary(countryName, categoryKey, row);
      existing.entries[countryName][categoryKey] = summary;
      console.log(`✓ (${summary.reviewedBy})`);

      // API rate limit 방지 (500ms 간격)
      await new Promise(r => setTimeout(r, 500));
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
