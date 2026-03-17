import * as XLSX from 'xlsx';

type RegRow = {
  country: string;
  flag?: string;
  law: string;
  lawUrl?: string;
  requirement: string;
  advisory: string;
  urgency?: string;
  enforcementDate?: string;
};

type CategoryEntry = {
  title: string;
  rows: RegRow[];
};

type LabelingRule = {
  rule: string;
  detail: string;
  date?: string;
};

type StrictIngredient = {
  ingredient: string;
  limit: string;
  law: string;
  enforcementDate?: string;
};

type StateReg = {
  name: string;
  flag?: string;
  labelingRules: LabelingRule[];
  strictIngredients: StrictIngredient[];
};

const trunc = (s: string | undefined, n: number): string =>
  s ? (s.length > n ? s.slice(0, n - 1) + '…' : s) : '';

const CATEGORY_KO: Record<string, string> = {
  'fsmp':        'FSMP(특수의료용)',
  'plant-based': '식물성 식품',
  'grains':      '곡류·시리얼',
  'meat-fish':   '육류·어류·난류',
  'vegetables':  '채소류',
  'fruits':      '과일류',
  'dairy':       '유제품',
  'bakery':      '베이커리·과자',
};

// Sheet name max length for Excel is 31 chars
const SHEET_NAMES: Record<string, string> = {
  'fsmp':        'FSMP',
  'plant-based': '식물성 식품',
  'grains':      '곡류·시리얼',
  'meat-fish':   '육류·어류·난류',
  'vegetables':  '채소류',
  'fruits':      '과일류',
  'dairy':       '유제품',
  'bakery':      '베이커리·과자',
};

const COL_WIDTHS_CATEGORY = [
  { wch: 28 },  // 국가/지역
  { wch: 44 },  // 법규명
  { wch: 62 },  // 주요 요건
  { wch: 14 },  // 시행일
  { wch: 52 },  // 핵심 주의사항
  { wch: 12 },  // 긴급 여부
  { wch: 52 },  // 법규 링크
];

export function exportRegulationsToExcel(
  categoryData: Record<string, CategoryEntry>,
  usStateRegs: Record<string, StateReg>
): void {
  const wb = XLSX.utils.book_new();
  const today = new Date().toISOString().slice(0, 10);

  // ── Sheet 1: 전체 요약 ──────────────────────────────────────────
  const summaryHeader = ['식품 카테고리', '국가/지역', '법규명 (요약)', '시행일', '긴급 여부', '핵심 주의사항 (요약)'];
  const summaryRows: string[][] = [summaryHeader];

  for (const [key, cat] of Object.entries(categoryData)) {
    const label = CATEGORY_KO[key] ?? key;
    for (const row of cat.rows) {
      summaryRows.push([
        label,
        `${row.flag ?? ''} ${row.country}`.trim(),
        trunc(row.law, 80),
        row.enforcementDate ?? '',
        row.urgency ?? '',
        trunc(row.advisory, 120),
      ]);
    }
  }

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
  summaryWs['!cols'] = [
    { wch: 20 }, { wch: 28 }, { wch: 44 }, { wch: 14 }, { wch: 12 }, { wch: 52 },
  ];
  XLSX.utils.book_append_sheet(wb, summaryWs, '전체 요약');

  // ── Sheets 2~9: 카테고리별 ──────────────────────────────────────
  const catHeader = ['국가/지역', '법규명', '주요 요건 (요약)', '시행일', '핵심 주의사항 (요약)', '긴급 여부', '법규 링크'];

  for (const [key, cat] of Object.entries(categoryData)) {
    const sheetName = SHEET_NAMES[key] ?? key.slice(0, 28);
    const dataRows = cat.rows.map(row => [
      `${row.flag ?? ''} ${row.country}`.trim(),
      trunc(row.law, 80),
      trunc(row.requirement, 200),
      row.enforcementDate ?? '',
      trunc(row.advisory, 120),
      row.urgency ?? '',
      row.lawUrl ?? '',
    ]);

    const ws = XLSX.utils.aoa_to_sheet([catHeader, ...dataRows]);
    ws['!cols'] = COL_WIDTHS_CATEGORY;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // ── Sheet 10: 미국 주별 ─────────────────────────────────────────
  const usHeader = ['주(State)', '규제 유형', '규정명 / 성분', '내용 요약', '시행일 / 기준', '관련 법'];
  const usRows: string[][] = [usHeader];

  for (const [stateCode, state] of Object.entries(usStateRegs)) {
    const stateName = `${state.flag ?? ''} ${state.name} (${stateCode})`.trim();

    for (const rule of state.labelingRules) {
      usRows.push([
        stateName,
        '라벨링 규칙',
        trunc(rule.rule, 60),
        trunc(rule.detail, 200),
        rule.date ?? '',
        '',
      ]);
    }

    for (const ing of state.strictIngredients) {
      usRows.push([
        stateName,
        '금지·제한 성분',
        trunc(ing.ingredient, 60),
        trunc(ing.limit, 100),
        ing.enforcementDate ?? '',
        trunc(ing.law, 60),
      ]);
    }
  }

  const usWs = XLSX.utils.aoa_to_sheet(usRows);
  usWs['!cols'] = [
    { wch: 22 }, { wch: 16 }, { wch: 42 }, { wch: 62 }, { wch: 16 }, { wch: 42 },
  ];
  XLSX.utils.book_append_sheet(wb, usWs, '미국 주별');

  // ── 다운로드 ────────────────────────────────────────────────────
  XLSX.writeFile(wb, `food-regulations-${today}.xlsx`);
}
