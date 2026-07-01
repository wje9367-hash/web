import * as XLSX from 'xlsx';
import summariesJson from '../data/summaries.json';

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

type SummaryEntry = {
  lawSummary: string;
  consolidatedSummary: string;
  exportAlert: string;
  enforcementDate: string;
  reviewedBy: string;
  reviewNote: string;
};

type SummariesData = {
  version: string;
  entries: Record<string, Record<string, SummaryEntry>>;
};

const summaries = summariesJson as SummariesData;

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

const COL_WIDTHS_COUNTRY = [
  { wch: 18 },   // 식품 카테고리
  { wch: 42 },   // 법규명
  { wch: 100 },  // 요건 원문
  { wch: 60 },   // 수출 주의사항
];

export function exportRegulationsToExcel(
  categoryData: Record<string, CategoryEntry>,
  usStateRegs: Record<string, StateReg>,
  options?: { countryFilter?: string }
): void {
  const wb = XLSX.utils.book_new();
  const today = new Date().toISOString().slice(0, 10);
  const filter = options?.countryFilter;

  const matchRow = (row: RegRow): boolean =>
    !filter || row.country.toLowerCase().includes(filter.toLowerCase());

  // ── 국가별로 카테고리 행 묶기 ────────────────────────────────
  const countryMap = new Map<string, { flag: string; categories: Array<{ key: string; row: RegRow }> }>();

  for (const [catKey, cat] of Object.entries(categoryData)) {
    for (const row of cat.rows.filter(matchRow)) {
      if (!countryMap.has(row.country)) {
        countryMap.set(row.country, { flag: row.flag ?? '', categories: [] });
      }
      countryMap.get(row.country)!.categories.push({ key: catKey, row });
    }
  }

  // ── 국가별 시트 생성 ─────────────────────────────────────────
  const countryHeader = ['식품 카테고리', '법규명', '요건 원문', '수출 주의사항'];

  for (const [countryName, { flag, categories }] of countryMap) {
    const countrySummaries = summaries.entries[countryName] ?? {};

    // 카테고리별로 그룹핑 (순서 유지)
    const grouped = new Map<string, Array<{ key: string; row: RegRow }>>();
    for (const item of categories) {
      if (!grouped.has(item.key)) grouped.set(item.key, []);
      grouped.get(item.key)!.push(item);
    }

    const allRows: string[][] = [];
    let firstGroup = true;
    for (const items of grouped.values()) {
      if (!firstGroup) allRows.push(['', '', '', '']); // 카테고리 구분 빈 행
      firstGroup = false;
      for (const { key, row } of items) {
        const summary = countrySummaries[key];
        const categoryLabel = CATEGORY_KO[key] ?? key;
        if (summary && !summary.consolidatedSummary.startsWith('[생성 실패]')) {
          allRows.push([categoryLabel, summary.lawSummary, row.requirement, summary.exportAlert]);
        } else {
          allRows.push([categoryLabel, trunc(row.law, 80), row.requirement, trunc(row.advisory, 120)]);
        }
      }
    }
    const ws = XLSX.utils.aoa_to_sheet([countryHeader, ...allRows]);
    ws['!cols'] = COL_WIDTHS_COUNTRY;

    // 시트명: flag + 국가명 (Excel 최대 31자, 특수문자 제거)
    const rawName = `${flag} ${countryName}`.replace(/[:\\/?*[\]]/g, '').trim();
    const sheetName = rawName.length > 31 ? rawName.slice(0, 30) + '…' : rawName;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // ── 미국 주별 시트 (필터 없을 때만) ─────────────────────────
  if (!filter) {
    const usHeader = ['주(State)', '규제 유형', '규정명 / 성분', '내용 요약', '시행일 / 기준', '관련 법'];
    const usRows: string[][] = [usHeader];

    for (const [stateCode, state] of Object.entries(usStateRegs)) {
      const stateName = `${state.flag ?? ''} ${state.name} (${stateCode})`.trim();

      for (const rule of state.labelingRules) {
        usRows.push([
          stateName, '라벨링 규칙',
          trunc(rule.rule, 60), trunc(rule.detail, 200),
          rule.date ?? '', '',
        ]);
      }
      for (const ing of state.strictIngredients) {
        usRows.push([
          stateName, '금지·제한 성분',
          trunc(ing.ingredient, 60), trunc(ing.limit, 100),
          ing.enforcementDate ?? '', trunc(ing.law, 60),
        ]);
      }
    }

    const usWs = XLSX.utils.aoa_to_sheet(usRows);
    usWs['!cols'] = [
      { wch: 22 }, { wch: 16 }, { wch: 42 }, { wch: 62 }, { wch: 16 }, { wch: 42 },
    ];
    XLSX.utils.book_append_sheet(wb, usWs, '미국 주별');
  }

  // ── 다운로드 ─────────────────────────────────────────────────
  const filename = filter
    ? `food-regs-${filter.replace(/\s+/g, '-')}-${today}.xlsx`
    : `food-regulations-${today}.xlsx`;
  XLSX.writeFile(wb, filename);
}
