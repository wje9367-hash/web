/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import regulationsData from './data/regulations.json';
import { exportRegulationsToExcel } from './utils/exportRegulationsToExcel';
import { 
  Microscope, 
  Stethoscope, 
  FlaskConical, 
  Leaf, 
  Utensils, 
  ChevronDown, 
  FolderHeart, 
  Search, 
  Bell, 
  Rss, 
  Calendar, 
  Globe, 
  BarChart3, 
  ArrowLeftRight, 
  Download,
  AlertCircle,
  ShieldCheck,
  FileText,
  XCircle,
  CheckCircle2,
  Info,
  X,
  Wheat,
  Drumstick,
  Carrot,
  Apple,
  Milk,
  CakeSlice,
  ExternalLink,
  ClipboardList,
  Calculator,
  Tag,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Icon className="size-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const NewsCard = ({ country, title, description, time, type, isNew = false }: { country: string, title: string, description: string, time: string, type: string, isNew?: boolean }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer group relative"
  >
    {isNew && (
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className="size-2 bg-red-500 rounded-full animate-pulse-red"></div>
        <span className="text-[9px] font-black text-red-500 tracking-tighter italic">LIVE</span>
      </div>
    )}
    <div className="flex items-start gap-4">
      <div className="size-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 flex-shrink-0">
        {country}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{description}</p>
        <p className="text-[10px] text-slate-400 mt-2">{time} • {type}</p>
      </div>
    </div>
  </motion.div>
);

const ReportSummaryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const handleGeneratePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>R&D Impact Report — Regu-Lens</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 48px; max-width: 760px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 28px; }
    .logo { font-size: 22px; font-weight: 900; color: #6366f1; letter-spacing: -0.5px; }
    .logo span { display: block; font-size: 10px; font-weight: 600; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
    .risk-score { text-align: right; }
    .risk-score p { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .risk-score .score { font-size: 28px; font-weight: 900; color: #f43f5e; }
    h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #94a3b8; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { padding: 16px; border-radius: 10px; }
    .card.risk { background: #fff1f2; border: 1px solid #fecdd3; }
    .card.gap { background: #fffbeb; border: 1px solid #fde68a; }
    .card-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .card.risk .card-label { color: #e11d48; }
    .card.gap .card-label { color: #d97706; }
    .card p { font-size: 13px; line-height: 1.6; }
    h2 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 10px; margin-top: 24px; }
    .recommendation { background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
    .rec-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 13px; line-height: 1.6; }
    .rec-item:last-child { margin-bottom: 0; }
    .check { color: #6366f1; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
    .timeline { display: flex; gap: 20px; flex-wrap: wrap; }
    .timeline-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .dot.green { background: #22c55e; }
    .dot.red { background: #f43f5e; }
    .dot.amber { background: #f59e0b; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
    @media print { body { padding: 32px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Regu-Lens <span>Global Regulation Hub</span></div>
    </div>
    <div class="risk-score">
      <p>Regulatory Risk Score</p>
      <div class="score">85/100</div>
    </div>
  </div>

  <h1>R&D Impact Report Summary</h1>
  <p class="subtitle">Generated by AI Regulatory Engine v4.2 &nbsp;·&nbsp; ${today}</p>

  <div class="grid">
    <div class="card risk">
      <div class="card-label">Key Risk Summary</div>
      <p>High divergence in Alulose limits for EU market. Potential export block without formulation adjustment.</p>
    </div>
    <div class="card gap">
      <div class="card-label">Ingredient Gap Analysis</div>
      <p>3/12 ingredients require re-validation for Japan (Walnut allergen update).</p>
    </div>
  </div>

  <h2>AI-Recommended Formulation Change</h2>
  <div class="recommendation">
    <div class="rec-item"><span class="check">✔</span><span>Substitute Alulose with <strong>Erythritol/Stevia blend</strong> for EU-bound batches.</span></div>
    <div class="rec-item"><span class="check">✔</span><span>Add <strong>Pine Nut</strong> icon to master label for South Korea compliance.</span></div>
  </div>

  <h2>Compliance Timeline Check</h2>
  <div class="timeline">
    <div class="timeline-item"><div class="dot green"></div> USA: Valid</div>
    <div class="timeline-item"><div class="dot red"></div> EU: Action Required (D-36)</div>
    <div class="timeline-item"><div class="dot amber"></div> JP: Transitioning</div>
  </div>

  <div class="footer">
    <span>Regu-Lens — Confidential R&D Document</span>
    <span>Generated on ${today}</span>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
    printWindow.document.close();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <FileText className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">R&D Impact Report Summary</h3>
              <p className="text-xs text-slate-500">Generated by AI Regulatory Engine v4.2</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Regulatory Risk Score</p>
              <p className="text-xl font-black text-rose-500">85/100</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X className="size-5" />
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30">
              <p className="text-[10px] font-bold text-rose-600 uppercase mb-2">Key Risk Summary</p>
              <p className="text-sm font-medium">High divergence in Alulose limits for EU market. Potential export block without formulation adjustment.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
              <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Ingredient Gap Analysis</p>
              <p className="text-sm font-medium">3/12 ingredients require re-validation for Japan (Walnut allergen update).</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI-Recommended Formulation Change</h4>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-primary mt-0.5" />
                <p className="text-sm">Substitute Alulose with <strong>Erythritol/Stevia blend</strong> for EU-bound batches.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-primary mt-0.5" />
                <p className="text-sm">Add <strong>Pine Nut</strong> icon to master label for South Korea compliance.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Timeline Check</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full"></div>
                <span>USA: Valid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-rose-500 rounded-full"></div>
                <span>EU: Action Required (D-30)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-amber-500 rounded-full"></div>
                <span>JP: Transitioning</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleGeneratePDF} className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Generate Final PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Generic Food Category Regulation Section
// ────────────────────────────────────────────────────────────────────────────
type RegRow = { country: string; flag: string; law: string; lawUrl?: string; requirement: string; originalRequirement?: string; advisory: string; urgency?: string; enforcementDate?: string; };
const CATEGORY_DATA: Record<string, { title: string; icon: any; rows: RegRow[] }> = {
  fsmp: {
    title: 'FSMP (Medical Food) — Global Regulations',
    icon: Stethoscope,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품위생법 / 특수의료용도식품 기준 (Amendment 2024-79)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '당뇨용: 탄수화물 50-60%, 단백질 15-20%, 지방 20-25%, 단순당 <10% kcal. 반드시 의사 지도 하 섭취 문구 의무 표시.', originalRequirement: 'Diabetic formula: Carbohydrate 50-60%, Protein 15-20%, Fat 20-25%, Simple sugars <10% kcal. Mandatory label statement: "Use under physician supervision."', advisory: '신제품은 MFDS 개별인정 또는 기준규격 신청 필요. 알루로스는 최대 10% 제한.', enforcementDate: '시행 중' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '건강기능식품에 관한 법률 (건강기능식품법)', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '기능성 원료 인정: 고시형(식약처 고시 목록) 또는 개별인정형(임상근거 제출). 일일섭취량·기능성 표시 문구 법정 허용 표현만 사용. 건강기능식품 GMP 인증 의무. 과잉섭취 주의문구 표시.', advisory: 'FSMP와 건강기능식품 혼동 주의 — 질환 치료 표방 불가. 기능성 원료 개별인정 12~18개월 소요. GMP 인증 시설 확인 필수.', enforcementDate: '시행 중' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품 등의 표시·광고에 관한 법률 — FSMP 표시', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '질환명 직접 표시 금지(당뇨병·신장병 등 표방 불가). "의사 처방 또는 지도 하에 섭취" 문구 의무. 영양성분표 9개 항목(열량·탄수화물·당류·지방·포화지방·트랜스지방·단백질·나트륨·콜레스테롤) 필수 표시.', advisory: '광고에서 치료·예방 효능 표방 시 식약처 행정처분 대상. 영양성분 표시값 허용 오차 범위(±20%) 확인 필수.', enforcementDate: '시행 중' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '수입식품안전관리특별법 — FSMP 수입 절차', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: 'FSMP 수입 시 사전신고 의무(통관 24시간 전). 최초 수입 시 서류검사·정밀검사 대상 지정. 수입업자 MFDS 등록 필수. 외국 제조업소 등록 의무. 부적합 이력 시 전수검사.', advisory: '최초 수입 정밀검사 추가비용·기간(5~10일) 고려. 제조업소 MFDS 등록 처리 3~6개월 소요.', enforcementDate: '시행 중' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 특수용도식품 영양소 기준값', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '영아용·유아용·환자용 특수용도식품별 영양소 기준값: 열량 1~2 kcal/mL, 단백질 에너지 비율 10~35%, 삼투압 ≤450 mOsm/kg(경장영양식). 조제분유: 비타민D·아이오딘·셀레늄 기준값 준수.', advisory: '경장영양식 삼투압 기준 초과 시 설사 부작용 표시 의무. 특수용도식품 영양소 기준 식약처 고시 주기적 업데이트 확인 필요.', enforcementDate: '시행 중' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR 101.9(j)(8) — Medical Food Definition', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.9', requirement: '고정된 다량영양소 비율 없음. 의사 평가를 통해 "특수한 영양 요건"을 충족해야 함. 반드시 의료 감독 하에 사용.', originalRequirement: 'No fixed macronutrient ratio; must meet "distinctive nutritional requirements" evaluated by physician. Only for use under medical supervision.', advisory: '수입 시 FSVP (21 CFR Part 1, Subpart L) 준수 필수. FSMA 204 이력추적 기록은 2028년부터 적용.', enforcementDate: '시행 중' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 1 Subpart L — FSVP (Foreign Supplier Verification Program)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-1/subpart-L', requirement: '수입 FSMP 공급업체 위해요소 분석 의무. 제조국 현지 검증 또는 제3자 감사. 시험성적서·공급업체 기록 3년 보관. 미국 수입업자(FSVP Importer) 지정 필수.', originalRequirement: 'Foreign supplier verification required: hazard analysis, supplier audit or testing. Records (certificates, audits) kept 3 years. US FSVP importer must be designated.', advisory: 'FSVP 미준수 시 입항 거부·경고서한. FDA 전자신고(Prior Notice) 수출 72시간 전 제출 의무. 수입업자 FSVP 프로그램 사전 점검 필요.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '2028.01.20', law: 'FSMA 204 (21 CFR Part 1.1300~) — FSMP 이력추적 기록 의무', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-1/subpart-S', requirement: '고위험 식품 52개 품목 대상 이력추적 강화. 핵심 데이터 요소(KDE) 기록·공유 의무. FDA 요청 시 24시간 내 제출 가능 기록 유지. FSMP 해당 품목 여부 사전 확인 필수.', originalRequirement: 'Enhanced traceability for 52 high-risk food categories; Key Data Elements (KDE) recording and sharing; records available within 24 hours of FDA request. Check if FSMP falls under covered categories.', advisory: '2028.01.20 시행 전 이력추적 시스템 구축 필요. 공급망 전 단계(농장→가공→수입) KDE 기록 체계 확보. 소규모 기업 1년 유예 여부 확인.', urgency: '긴급' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA Guidance for Industry — FSMP 라벨링 기준', lawUrl: 'https://www.fda.gov/food/guidance-documents-regulatory-information-topic/special-dietary-use', requirement: '"For Special Medical Purposes" 문구 포장 전면 표시 의무. 사용 대상 질환·영양 결핍 조건 명시. 성분 완전 공개(정량적 표시). 의료 감독 하 사용 문구 필수.', originalRequirement: '"For Special Medical Purposes" required on principal display panel. Target disease/nutritional deficiency condition stated. Complete ingredient disclosure. "Use only under medical supervision" required.', advisory: '라벨 문구 누락 시 규정 위반 → 수입 거부. Nutrition Facts Panel 21 CFR Part 101.9 기준 적용. 영유아용 FSMP는 21 CFR Part 107 별도 요건 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Regulation (EU) 2016/128 + Regulation (EC) 609/2013', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0128', requirement: '질환 카테고리별 성분 기준 적용. 첨가물은 Reg 1333/2008 Cat 13.2 적용. "특수 의료 목적용(For special medical purposes)" 표시 의무.', originalRequirement: 'Compositional standards by disease category. Additives governed by Reg 1333/2008 Cat 13.2. Mandatory "For special medical purposes" labelling.', advisory: 'EUR-Lex에서 2026.04.15 FSMP 규정 미확인. 감미료 함량은 Reg 1333/2008 Cat 13.2 개별 허용 기준 반드시 준수. EU 관보 최신 업데이트 확인 권장.', enforcementDate: '미확인' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Art. 9 + Annex II — FSMP 라벨링', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '14종 알레르겐 강조 표시 의무 (볼드·이탤릭·밑줄). 영양성분표 필수. 해당 질환·사용 연령 표기. "특수 의료 목적용 식품" 문구 의무.', originalRequirement: 'Mandatory emphasis (bold/italic/underline) for 14 allergens. Nutrition declaration required. Target disease and age group stated. "Food for special medical purposes" labelling mandatory.', advisory: '14종 알레르겐 표시 누락 시 EU 전역 리콜. 가공보조제(Processing Aid)도 알레르겐 표시 포함. Reg 2016/128 Art. 15 추가 표시 요건 별도 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1333/2008 Cat 13.2 — FSMP 첨가물 허용 목록', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333', requirement: 'Cat 13.2 허용 첨가물 목록 + 개별 최대 사용량 준수. 감미료(아세설팜K·수크랄로스 등)·유화제(E471)·안정제(E415) 허용 조건 확인. 목록 외 첨가물 사용 금지.', originalRequirement: 'Additives in Category 13.2 (FSMP) permitted list with individual maximum use levels. Sweeteners (acesulfame K, sucralose), emulsifiers (E471), stabilisers (E415) subject to specific conditions. Unlisted additives prohibited.', advisory: 'Cat 13.2 허용 목록 EU 관보 최신 개정 반드시 확인. 일부 감미료 특정 FSMP 유형에만 허용 — 세부 조건 검토. 기술적 기능 없는 첨가물 사용 금지.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 2016/128 Annex — FSMP 카테고리별 성분 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0128', requirement: '영유아 FSMP: 단백질 1.8~3.0 g/100 kcal, 비타민·미네랄 기준치 적용. 신장질환·당뇨·체중 조절 FSMP 별도 Annex 기준 적용. 일반 FSMP는 기준치 조정 허용 (질환 특성 반영).', originalRequirement: 'Paediatric FSMP: protein 1.8–3.0 g/100 kcal, vitamin and mineral reference values. Specific Annexes for renal disease, diabetes, body weight management. General FSMP may adjust nutrient levels to reflect disease-specific needs.', advisory: '카테고리별 성분 기준 EFSA 과학 의견서 기반 — 임의 변경 불가. 영유아용 FSMP EU 시판 전 관할 당국 통보(Notification) 의무. 신규 FSMP 성분 Novel Food 해당 여부 사전 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', law: '特別用途食品制度 — Consumer Affairs Agency (2024.04.01 이관 완료)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/', requirement: '병자용 특별용도식품 허가 필요. 2024.04.01 관할청 MHLW → 소비자청(CAA) 이관 완료. 신규 인허가 창구: caa.go.jp.', originalRequirement: '病者用特別用途食品の許可が必要。2024年4月1日に主務大臣がMHLWから消費者庁（CAA）へ移管済み。新規許可申請窓口はcaa.go.jpへ。', advisory: '이관 완료(2024.04.01) — 소비자청(CAA) 창구로 신규 허가 신청. 기능성표시식품(機能性表示食品)과 특별용도식품 관할 기관 혼동 주의.', enforcementDate: '시행 중' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '機能性表示食品届出制度 — CAA', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/', requirement: '허가제 아닌 届出(신고)제. 과학적 근거(SR 또는 임상시험) 제출 의무. 届出번호 표시 의무. CAA 届出 데이터베이스 공개. 届出 후 60일 판매 가능.', originalRequirement: '許可制ではなく届出制。科学的根拠（SRまたは臨床試験）の提出が必要。届出番号の表示が義務。CAA届出データベースで公開。届出後60日から販売可能。', advisory: '기능성표시식품과 특별용도식품(허가제)의 절차 혼동 주의. SR 작성 시 FSMP 관련 질환 특이성 증거 요구. 허위 기능 표시 시 행정처분.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 (2015) — 영양·알레르겐 의무 표시', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '열량·단백질·지방·탄수화물·식염 의무 표시(5대 영양소). 알레르겐 特定原材料 8종 의무(小麦·卵·乳·落花生·エビ·カニ·クルミ·ソバ). クルミ(호두) 2025.03부터 의무 전환. 준의무 20종 권장.', originalRequirement: '熱量・タンパク質・脂質・炭水化物・食塩相当量の義務表示（5大栄養素）。特定原材料8品目義務（小麦・卵・乳・落花生・エビ・カニ・くるみ・そば）。くるみは2025年3月より義務化。推奨20品目も表示推奨。', advisory: '5대 영양소 표시 누락 시 식품표시법 위반. 알레르겐 8종 중 クルミ(호두) 2025.03부터 의무 전환 완료. FSMP 제품 알레르겐 표시 특히 주의.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2025.04 시행, 전환기간 2028.03.31', law: '食品表示基準 개정 — カシューナッツ(캐슈넛) 特定原材料 9번째 의무화', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '캐슈넛(カシューナッツ)이 特定原材料(의무 알레르겐) 9번째 항목으로 추가 지정(2025.04 시행). 피스타치오(ピスタチオ)는 準特定原材料(권장) 목록에 추가. 전환기간: 2028.03.31까지. 그 이후에는 캐슈넛 함유 전 제품 의무 표시.', originalRequirement: 'カシューナッツが特定原材料（義務）の9品目目として指定（2025年4月施行）。ピスタチオは推奨28品目に追加。移行期間：2028年3月31日まで。以降、カシューナッツ含有全製品に義務表示。', advisory: '캐슈넛 함유 제품: 2025.04 이후 "カシューナッツ" 표시 의무화(전환기간 2028.03.31). 피스타치오 함유 제품: 권장 표시 대상(의무 아님). 의무·권장 혼동 주의 — 현재 전환기간 중 조기 대응 권장. 過去に캐슈넛 사용 제품의 DoC 및 라벨 업데이트 필수.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2025.03.28', law: '食品表示基準 일부 개정 — 영양표시 기준값 전면 갱신 (DRI 2025)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '일본인 식사섭취기준 2025년판(DRI 2025) 채택 — 영양성분 기준값 전면 갱신. 식이염(食塩相当量) 표시 추가 의무화. 식이섬유 "0" 표시 허용 기준 신설. 비타민B군(B1·B2·B6·B12·나이아신·엽산·판토텐산) 계산법 변경. 칼슘·마그네슘 기준값 일부 조정.', originalRequirement: '日本人の食事摂取基準2025年版（DRI 2025）採用。栄養素の基準値を全面改定。食塩相当量の追加義務表示。食物繊維の「0」表示許容基準を新設。ビタミンB群（B1・B2・B6・B12・ナイアシン・葉酸・パントテン酸）の算出方法変更。カルシウム・マグネシウム基準値の一部調整。', advisory: '기존 영양표시 기준값(2020년 DRI) 사용 제품 라벨 갱신 필요. 비타민B 계산법 변경 → 라벨 수치 재검증 필수. 식이섬유 "0" 표시 조건 신규 가이드라인 확인. 2025.03.28 이후 신규 제품은 개정 기준값 적용 의무.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '食品衛生法 — 수입신고 절차 (2026.04 CAA 이관)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '수입신고(輸入届出) → 検疫所 서류·현물 검사. 부적합 시 전량 폐기/반송. 2026.04.01 관할 CAA 이관 완료. 특별용도식품 수입 시 사전 허가 서류 검역소 제출 의무.', originalRequirement: '輸入届出→検疫所による書類・現物検査。不適合は全量廃棄または積み戻し。2026年4月1日より管轄がCAA移管完了。特別用途食品の輸入には事前許可書類を検疫所へ提出義務。', advisory: '수입신고 창구 MHLW → CAA 이관 완료(2026.04). 특별용도식품 수입 사전 허가서 취득 후 검역소 제출. 부적합 이력 제품 강화 검사 지정 가능.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '病者用特別用途食品 조성 기준 — CAA', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/', requirement: '당뇨병용: 탄수화물 에너지비 50~60%, 단백질 15~20%, 지방 20~30%. 신장병용: 단백질·칼륨·인 제한 명시. "医師の指導の下に使用すること" 문구 필수. 허가 신청 CAA 제출.', originalRequirement: '糖尿病用：炭水化物エネルギー比50~60%、タンパク質15~20%、脂質20~30%。腎臓病用：タンパク質・カリウム・リンの制限を明示。「医師の指導の下に使用すること」の文言が必須。許可申請はCAAへ提出。', advisory: '당뇨·신장 환자용 조성 기준 불충족 시 허가 거부. "의사 지도 하 섭취" 문구 누락 시 부적합. 허가 전 사전 상담(pre-consultation) CAA와 진행 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: '特殊營養食品管理辦法 — TFDA', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '임상 데이터 의무 제출. 수입 등록 필수. 당뇨·종양 환자용 제품은 강화된 임상 근거 요구.', originalRequirement: '須提交臨床數據。進口登記為必要條件。糖尿病及腫瘤患者用配方食品，須提供加強之臨床佐證。', advisory: '2025.09.15 개정 임상데이터 요건 시행 중. GABA 성분 포함 시 별도 사용 제한 기준(2025.02) 적용.', enforcementDate: '시행 중' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '健康食品管理法 — 건강기능식품 허가 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '13개 기능성 허가 항목(면역·조혈·소화·뼈·혈당·혈압 등). 허가 마크(健康食品) 의무 표시. 무허가 기능 표방 금지. 의약품 효능 표방 시 食品安全衛生管理法 위반.', originalRequirement: '13項功能性許可項目（免疫、造血、消化、骨骼、血糖、血壓等）。健康食品許可標誌強制標示。禁止聲稱未經許可之功效。宣稱藥品效能違反食品安全衛生管理法。', advisory: '건강기능식품 허가 소요 기간 약 18~24개월. 허가 없이 "건강식품" 표방 불가. FSMP와 건강식품 카테고리 혼동 주의 — 사전 분류 확인 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — FSMP 알레르겐 11종·영양성분 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '알레르겐 11종 의무 표시(小麥·蛋·奶·花生·堅果·芝麻·大豆·魚類·甲殼類·軟體動物·芒果). 영양성분표(열량·단백질·지방·탄수화물·나트륨) 의무. 사용 목적·섭취 대상 표시.', originalRequirement: '11種過敏原強制標示。營養標示（熱量、蛋白質、脂肪、碳水化合物、鈉）義務。使用目的及攝取對象說明必要。', advisory: '알레르겐 표시 누락 시 리콜 및 행정처분. FSMP 알레르겐 조성 특성상 특정 알레르겐 다수 포함 가능 — 전체 대조 필수. 의사·영양사 지도 하 섭취 권고 문구 표시 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品添加物使用範圍 — FSMP 허용 첨가물', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'FSMP용 허용 첨가물 목록 내 성분만 사용. 방부제·착색료 사용 제한 — 특별용도식품 특성 감안. 영양 강화제(비타민·미네랄) 기준 준수. GABA ≤250 mg/일(2025.02 사용 기준 강화).', originalRequirement: '特殊營養食品只可使用許可添加物清單內成分。防腐劑、著色劑受限制。營養強化劑（維生素、礦物質）基準須遵守。GABA≤250 mg/日（2025.02強化）。', advisory: 'GABA 함유 FSMP 2025.02 기준 재확인. 영양 강화제 TFDA 허용 목록 최신판 확인. 허용 외 첨가물 사용 시 FSSA 행정처분 및 전량 폐기.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: 'TFDA eTrack 수입신고 — 特殊營養食品', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'TFDA eTrack 시스템 수입신고 의무. 서류검사 + 제품 성분 분석 성적서 제출. 의약품 해당 여부 사전 분류 확인. 위험등급별 검사비율 적용. 번체 중국어 라벨 의무.', originalRequirement: '特殊營養食品透過TFDA eTrack系統申報進口。書類審查＋成分分析成績書提交。須先確認是否屬藥品分類。依風險等級進行查驗。繁體中文標示義務。', advisory: 'FSMP 수입 전 TFDA에 식품/의약품 사전 분류 문의 권장. eTrack 미등록 시 통관 거부. 임상 데이터 요건 2025.09 개정 내용 반영 필수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', law: 'GB 29922 / GB 25596 — 特殊医学用途配方食品', lawUrl: 'https://www.samr.gov.cn/', requirement: 'SAMR 사전 등록 필수. 원료는 GB 2760 허용 성분 목록 내에 있어야 함. "非肠外营养" 경고 문구 의무.', originalRequirement: '须向SAMR进行预先登记。原料须在GB 2760许可成分目录内。必须标注"非肠外营养"警示语。', advisory: '등록 과정 최소 12-18개월 소요. GB 2760에 없는 한국 허용 성분은 반드시 대체 성분 검토 필요.', enforcementDate: '시행 중' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'SAMR 특수의료용도식품 등록제 — 배합 사전 심사 (12~24개월)', lawUrl: 'https://www.samr.gov.cn/', requirement: 'SAMR 등록 절차: 연구 자료·임상 시험 자료·생산 공정 서류 전 항목 제출. 영아용 FSMP(GB 25596) 별도 등록. 등록 소요기간 최소 12개월, 복잡 제품 24개월 이상. 등록 전 임시 수입 판매 불가.', originalRequirement: 'SAMR注册流程：须提交研究资料、临床试验数据、生产工艺全部文件。婴儿特殊医学用途配方（GB 25596）须单独注册。注册时间至少12个月，复杂产品超过24个月。注册前不得临时进口销售。', advisory: 'FSMP 중국 시장 진입 전 SAMR 등록 일정을 최우선 착수 필요. 임상 자료 요건 방대 — 글로벌 등록 자료 중국어 번역 준비 필수. 등록 대행사(CRO) 활용 권장.', urgency: '주의' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2760-2024 — FSMP 허용 첨가물 기준', lawUrl: 'https://www.samr.gov.cn/', requirement: 'FSMP 사용 허용 첨가물 GB 2760-2024 목록 준수. 감미료: 아세설팜칼륨·수크랄로스 허용(당뇨용 FSMP). 유화제: 레시틴·모노글리세리드 허용. 한국 허용 감미료 중 GB 2760 미등재 성분 즉시 대체 필요.', originalRequirement: 'FSMP使用添加剂须符合GB 2760-2024目录。甜味剂：乙酰磺胺酸钾、三氯蔗糖允许（糖尿病FSMP）。乳化剂：卵磷脂、单甘酯允许。韩国许可甜味剂中GB 2760未收录成分须立即替换。', advisory: 'GB 2760-2024(2025.02.08 시행) 최신판 첨가물 목록 확인 필수. 한국 허용 스테비아·아스파탐 사용 시 GB 2760 허용 여부 사전 대조. 미등재 성분 발견 즉시 SAMR 문의 또는 대체 성분 검토.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 境外企业注册 — 수입 FSMP 해외 제조업체 등록', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 FSMP 해외 제조업체 GACC 境外生产企业注册 필수. SAMR 제품 등록과 GACC 시설 등록 이중 절차 적용. 위생증명서 매 선적 제출. 비등록 시설 수출 불가.', originalRequirement: '进口特殊医学用途配方食品的境外生产企业须进行GACC境外注册。SAMR产品注册与GACC设施注册须双重履行。每批次须提供卫生证明书。未注册设施不得出口。', advisory: 'SAMR 제품 등록 + GACC 시설 등록 이중 의무 — 절차 일정 통합 관리 필요. GACC 미등록 시 SAMR 등록 완료 후에도 수출 불가. 사전 등록 일정 최소 6개월 추가 확보 권장.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — FSMP 내 알레르겐 성분 중국어 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7718 — FSMP 라벨 알레르겐·경고문구 표시', lawUrl: 'https://www.samr.gov.cn/', requirement: '알레르겐 8종(小麦·蛋·奶·花生·大豆·坚果·鱼类·甲壳类) 중국어 표시. "非肠外营养，需在医生指导下使用" 경고 문구 의무. 영양성분표 중국어 전 항목 표기. 净含量·유통기한·수입업체 표기 의무.', originalRequirement: '过敏原8种（小麦·蛋·奶·花生·大豆·坚果·鱼类·甲壳类）须中文标注。警示语"非肠外营养，需在医生指导下使用"为强制要求。营养成分表须全项中文标注。净含量、保质期、进口商须标注。', advisory: '경고 문구 누락 시 SAMR 행정처분. 알레르겐 8종 전 항목 중국어 표기. FSMP 라벨 디자인 SAMR 등록 서류에 포함 — 등록 후 라벨 변경 시 변경 신고 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', law: 'Thông tư 43/2014/TT-BYT — 특수 영양 식품 규정 (VFA)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '특수 의료용 식품 수입 시 VFA 수입 허가(Import Permit) 필수. 성분 적합성 Self-Declaration 의무. 베트남어 라벨 표시 필수. 허용 첨가물 목록 Circular 24 적용.', originalRequirement: 'Thực phẩm dinh dưỡng y học cần giấy phép nhập khẩu VFA. Tự công bố sự phù hợp về thành phần. Nhãn tiếng Việt bắt buộc. Phụ gia thực phẩm theo Thông tư 24.', advisory: '2026.01 온라인 수입허가 시스템 전환. 색소·감미료 성분 Circular 24 허용 목록 사전 확인 필수. 아조계 색소 한도 강화 적용 중.', enforcementDate: '시행 중' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP (舊 Decree 15 대체) — FSMP 정부 심사 + MOH 수입허가', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: 'FSMP는 Decree 15 일반 자기선언 제외 — MOH VFA 수입허가(Giấy phép nhập khẩu) 필수. 성분 적합성 서류(QCVN 8-1·8-2 기준 성적서) 제출. 원산지 증명서(C/O). 허가 유효기간 확인 후 갱신.', originalRequirement: 'FSMP không thuộc phạm vi Tự công bố theo Decree 15 — cần Giấy phép nhập khẩu MOH/VFA. Tài liệu phù hợp thành phần (báo cáo QCVN 8-1·8-2). Giấy chứng nhận xuất xứ (C/O). Kiểm tra và gia hạn hiệu lực giấy phép.', advisory: 'VFA 수입허가 6~9개월 소요 — 조기 신청 필수. 허가 없이 통관 불가 — 자기선언 대체 불가. 2026.01 온라인 시스템 전환 전 사전 등록 권장.', urgency: '주의' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-1·8-2:2011/BYT + Decree 111/2021 — FSMP 라벨링', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '오염물질(QCVN 8-1 곰팡이독소·8-2 중금속) 적합성 성적서 필수. 알레르겐(밀·달걀·우유·견과·대두) 베트남어 의무 표시. 유통기한 DD/MM/YYYY. "의사 지도 하 사용" 문구 베트남어 표기. 영양성분표 베트남어.', originalRequirement: 'Báo cáo phù hợp về chất ô nhiễm (QCVN 8-1 độc tố nấm mốc·8-2 kim loại nặng) bắt buộc. Chất gây dị ứng tiếng Việt bắt buộc. Hạn sử dụng DD/MM/YYYY. Ghi chú "Sử dụng theo chỉ định của bác sĩ" bằng tiếng Việt. Bảng dinh dưỡng tiếng Việt.', advisory: '"의사 지도 하 사용" 베트남어 경고 문구 누락 시 위반. 오염물질 성적서 VFA 수입허가 신청 서류에 포함. 베트남어 라벨 미부착 시 통관 불가.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', law: 'Food Act B.E. 2522 — 특수 의료 목적 식품 (Thai FDA)', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx', requirement: '태국 FDA 사전 등록 및 수입 허가 필수. 성분 기준 Codex 기반 적용. Cyclamate 사용 전면 금지. 타이어 라벨(태국어) 표시 의무.', originalRequirement: 'ต้องลงทะเบียนกับ อย. ล่วงหน้าและขออนุญาตนำเข้า มาตรฐานส่วนผสมอิงตาม Codex ห้ามใช้ Cyclamate อย่างเด็ดขาด ฉลากภาษาไทยบังคับ', advisory: 'Cyclamate 함유 제품 수출 불가. Tartrazine 50mg/kg 한도(2025.07 강화) 확인. 2026.04 온라인 허가 갱신 시스템 사전 등록 권고.', enforcementDate: '시행 중' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', law: 'PP 69/1999 + BPOM Reg. HK.03.1.23.11.11.09909/2014 (PANGAN OLAHAN TERTENTU) + BPJPH Halal Certification (mandatory 2026.10)', lawUrl: 'https://www.pom.go.id/', requirement: 'BPOM ML 번호 등록 필수. 할랄 인증(BPJPH) 2026.10.17 전면 의무화. 기능성 원료는 Pangan Fungsional 카테고리 사전 허가 필요. 성분 SNI 및 BPOM 허가기준 준수.', originalRequirement: 'Nomor ML BPOM wajib didaftarkan. Sertifikasi Halal BPJPH wajib penuh mulai 17 Oktober 2026. Bahan fungsional memerlukan izin Pangan Fungsional terlebih dahulu. Komposisi harus memenuhi SNI dan standar izin BPOM.', advisory: '의약식품감독청(BPOM) ML 번호 등록 필수. 할랄 인증(BPJPH) 2024년 1단계(고위험 식품) 시행, 2단계(2026.10.17) 전면 의무화. GB 기준 아닌 자체 SNI 및 BPOM 허가기준 준수 필요', enforcementDate: '2026.10.17' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'SNI 01-7111 + BPOM 사전 허가 — FSMP 영유아 분유 기준', lawUrl: 'https://www.pom.go.id/', requirement: '영유아용 FSMP(조제분유·특수분유) SNI 01-7111 기준 준수. 단백질·지방·비타민·미네랄 기준값 충족. BPOM 사전 허가(별도 심사) 필수. ML 등록 외 추가 BPOM 심사 절차 적용.', originalRequirement: 'Infant and toddler FSMP (infant formula, special formula) must comply with SNI 01-7111 standards. Protein, fat, vitamin, and mineral values required. Mandatory BPOM pre-market approval (separate review). Additional BPOM assessment beyond ML registration.', advisory: '영유아 FSMP 심사 기간 일반 FSMP보다 길 수 있음 (12개월 이상 예상). SNI 01-7111 최신 버전 확인 필수. 단백질·지방 기준값 허용 오차 범위 BPOM 가이드라인 기준 준수.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 33/2012 — FSMP 허용 첨가물 (감미료·유화제)', lawUrl: 'https://www.pom.go.id/', requirement: 'FSMP 내 감미료·유화제 BPOM 허가 목록(Permenkes 33/2012) 준수. 아세설팜칼륨·수크랄로스 허용(당뇨용). 레시틴·모노글리세리드 유화제 허용. Cyclamate 전면 금지. 색소 사용 최소화.', originalRequirement: 'FSMP sweeteners and emulsifiers must comply with BPOM-approved list (Permenkes 33/2012). Acesulfame-K and sucralose permitted (diabetic use). Lecithin and monoglycerides permitted as emulsifiers. Cyclamate prohibited. Minimize colouring agent use.', advisory: 'Cyclamate 함유 FSMP 인도네시아 수출 불가. Permenkes 33/2012 목록 최신판 확인. 목록 외 첨가물 BPOM 사전 문의 후 사용 가능 여부 확인 필수.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'PP 69/1999 — FSMP 라벨링 (영양성분 14항목·알레르겐)', lawUrl: 'https://www.pom.go.id/', requirement: '영양성분표 14개 항목(열량·단백질·총지방·포화지방·트랜스지방·kolesterol·탄수화물·당류·serat·나트륨·비타민·미네랄 등) 인도네시아어 의무. 알레르겐(밀·달걀·우유·견과·생선·갑각류·대두) 인도네시아어 의무 표시. "Di bawah pengawasan dokter" 문구 의무.', originalRequirement: 'Nutritional panel with 14 items (energy, protein, total fat, saturated fat, trans fat, cholesterol, carbohydrate, sugars, fibre, sodium, vitamins, minerals etc.) in Indonesian mandatory. Allergens (wheat, egg, milk, nuts, fish, crustaceans, soy) in Indonesian required. "Under doctor supervision" (Di bawah pengawasan dokter) statement mandatory.', advisory: '14항목 영양성분 인도네시아어 표시 누락 시 BPOM 행정처분. 알레르겐 표시 인도네시아어 정확한 용어 사용. BPOM ML 등록 시 라벨 사전 심사 포함 — 등록 후 라벨 변경 시 ML 재신청 필요.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', law: 'RA 3720 (Food, Drug and Cosmetic Act) + FDA AO 2014-0030 (FSMP) + FDA AO 2020-0023 (Novel Food)', lawUrl: 'https://www.fda.gov.ph/', requirement: '필리핀 FDA LTO(License to Operate) 및 CPR(Certificate of Product Registration) 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요.', originalRequirement: 'FDA Philippines LTO (License to Operate) and CPR (Certificate of Product Registration) required. FSMP classified under prescription-based Medical Nutrition category with separate review process. Novel ingredients require Novel Food authorisation procedure under FDA AO 2020-0023.', advisory: '필리핀 FDA LTO(License to Operate) 및 CPR(Certificate of Product Registration) 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요', enforcementDate: '시행 중' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — FSMP CPR 등록 절차 (6~12개월)', lawUrl: 'https://www.fda.gov.ph/', requirement: 'FSMP CPR 등록 소요 6~12개월. 갱신 5년 주기. 신청 서류: 성분 명세·안전성 자료·라벨 초안·제조업체 GMP 증명서. 수입업체 LTO 동시 보유 필수.', originalRequirement: 'FSMP CPR registration takes 6–12 months. Renewal every 5 years. Required documents: composition specifications, safety data, draft label, manufacturer GMP certificate. Importer must hold valid LTO simultaneously.', advisory: 'CPR 등록 없이 수입·판매 불가. 등록 일정 출시 계획보다 12개월 앞서 착수 필요. LTO 만료 시 자동 CPR 효력 정지 — 갱신 일정 관리 필수.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DOH BFAD — FSMP 첨가물 (Codex GSFA + 독자 감미료 기준)', lawUrl: 'https://www.fda.gov.ph/', requirement: 'FSMP 첨가물 Codex GSFA 준용. 사카린·아스파탐 사용 기준 필리핀 독자 적용. 아세설팜칼륨·수크랄로스 허용. Cyclamate 전면 금지. 색소 FDA PH 허용 목록 준수.', originalRequirement: 'FSMP additives follow Codex GSFA. Saccharin and aspartame subject to Philippines-specific limits. Acesulfame-K and sucralose permitted. Cyclamate prohibited. Colours must comply with FDA PH permitted list.', advisory: 'Cyclamate 함유 FSMP 수출 불가. 사카린·아스파탐 사용 시 FDA PH 한도 사전 확인. 색소 허용 목록 FDA PH 최신 고시 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — FSMP 영양표시·알레르겐 8종', lawUrl: 'https://www.fda.gov.ph/', requirement: 'FSMP 영양성분 표시 의무: 에너지·단백질·탄수화물·지방·나트륨. 알레르겐 8종(밀·달걀·우유·땅콩·견과·대두·어류·갑각류) 표시. 영어 + 필리핀어(타갈로그어) 병기 권장.', originalRequirement: 'FSMP mandatory Nutrition Information: energy, protein, carbohydrate, fat, sodium. 8 allergens (wheat, egg, milk, peanuts, tree nuts, soy, fish, crustaceans) required. English plus Filipino (Tagalog) bilingual labelling recommended.', advisory: '알레르겐 표시 누락 시 FDA 행정처분. 타갈로그어 라벨 권장 — 필수는 아니나 시장 신뢰도 향상. 영양성분 허용 오차 ±20% 준수.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Food and Drugs Act + FDR B.24 (Foods for Special Dietary Use) + Safe Food for Canadians Regulations (SFCR 2019)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 필수. 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장.', originalRequirement: 'FSMP falls under "Foods for Special Dietary Use" category (FDR B.24). Import requires CFIA SFCR licence. Label must carry mandatory bilingual (English/French) declarations. Health Canada pre-market notification recommended.', advisory: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 + 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada Novel Food Regulations — FSMP 신규 성분 사전 승인', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '신규 기능성 성분(NHP 해당 시) NPN 번호 발급 필수. Novel Food 사전 고지 45일 검토. 미고지 신규 성분 함유 FSMP 판매 금지.', originalRequirement: 'Novel functional ingredients that qualify as NHP require NPN number. Novel Food pre-market notification subject to 45-day Health Canada review. FSMP containing unnotified novel ingredients may not be sold.', advisory: 'FSMP 신규 기능성 성분 Novel Food 해당 여부 Health Canada 사전 문의 필수. NHP 해당 시 NPN 발급 절차(180일~) 조기 착수. 미고지 판매 시 리콜 위험.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'FDR B.24.201–B.24.203 — FSMP 성분 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '비타민·미네랄 최소·최대 함량 기준 준수. 식이섬유·단백질 기원 표시 의무. 단백질 효율비(PER) 기준 충족.', originalRequirement: 'Vitamins and minerals must be within minimum and maximum content limits. Declaration of dietary fibre and protein source mandatory. Protein Efficiency Ratio (PER) standard must be met.', advisory: 'FDR B.24.201 성분 기준 초과 즉시 부적합. 단백질 기원(동물성·식물성) 명시 의무. PER 시험 성적서 구비 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 — FSMP 수입 허가 및 이력추적', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '식품 수입업체 SFCR 허가 필수. 1단계 앞·뒤 이력추적 기록 의무(2년 보관). 라벨에 영어·불어 이중 표기 의무.', originalRequirement: 'Food importers must hold SFCR licence. One-step-forward and one-step-back traceability records mandatory (2-year retention). Bilingual English/French labelling required.', advisory: 'SFCR 허가 갱신 일정 사전 확인. 이력추적 기록 미보관 시 위반. FSMP 라벨 영어·불어 이중 표기 누락 시 통관 거부.', enforcementDate: '시행 중' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Act 1983 / Food Regulations 1985 / MOH 특수의료용도식품 가이드라인', lawUrl: 'https://www.moh.gov.my/', requirement: 'MOH 사전 수입 허가 필수. 동물성 유래 원료 포함 시 JAKIM 할랄 인증(MS1500) 의무. MeSTI 제조 인증 병행 취득 필요. 말레이어·영어 이중 라벨 표시 의무.', originalRequirement: 'Permit import MOH diperlukan. Pensijilan Halal JAKIM (MS1500) wajib bagi bahan berisi asal haiwan. Pensijilan MeSTI disyorkan seiring. Pelabelan dwibahasa (Melayu/Inggeris) wajib.', advisory: 'FSMP 제품 내 동물성 유래 원료 사용 시 JAKIM 할랄 인증 필수. MeSTI 인증 병행 취득 권장. 아랍계 무슬림 소비자 비중 고려한 제품 설계.', enforcementDate: '시행 중' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'MAQIS 2026.06 강화 — FSMP 동물성 원료 검역 3종 서류', lawUrl: 'https://www.moh.gov.my/', requirement: 'FSMP 내 동물성 원료(유청단백·유청분말·카제인·유지방) 수입 시 수의사 확인서·JAKIM 할랄 인증서·원산지 증명서 3종 동시 제출 의무(2026.06 강화). 미제출 시 반송 처리.', originalRequirement: 'Importing animal-derived FSMP ingredients (whey protein, whey powder, casein, milk fat) from 2026.06 requires simultaneous submission of: veterinary health certificate, JAKIM halal certificate, certificate of origin. Non-submission results in rejection.', advisory: '2026.06 MAQIS 강화 시행 전 3종 서류 사전 준비 필수. JAKIM 할랄 인증서 유효기간 확인. 원산지 증명서 영어 번역본 첨부 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.16 — FSMP 영양표시 (말레이어)', lawUrl: 'https://www.moh.gov.my/', requirement: 'FSMP 영양성분 표시 의무: 에너지·단백질·지방·탄수화물·나트륨. 말레이어 표기 병행 의무. "Di bawah pengawasan doktor" (의사 지도 하 사용) 문구 말레이어 의무 표기.', originalRequirement: 'FSMP Nutrition Information mandatory: energy, protein, fat, carbohydrate, sodium. Malay-language labelling required alongside English. "Di bawah pengawasan doktor" (under doctor supervision) must appear in Malay.', advisory: '말레이어 영양표시 누락 시 통관 거부. "의사 지도 하 사용" 말레이어 문구 정확한 표기 필수. MeSTI 인증서 수입업체 비치.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'MeSTI 인증 / HACCP — FSMP 제조업체 위생 인증', lawUrl: 'https://www.moh.gov.my/', requirement: '수출 FSMP 제조업체 MeSTI(식품안전보증제도) 인증 병행 권장. HACCP 인증 서류 수입업체 비치 의무. MOH 요청 시 GMP 관련 서류 즉시 제출 가능해야 함.', originalRequirement: 'Exporting FSMP manufacturers recommended to hold MeSTI (Food Safety Assurance Scheme) certification alongside other approvals. Importer must have HACCP documents on file. Must be able to immediately provide GMP documents upon MOH request.', advisory: 'MeSTI 미보유 시 MOH 수입 허가 심사 지연 가능. HACCP 인증서 최신 유효본 유지. GMP 서류 체계화 후 수입업체 전달 필수.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Food Standards Code Standard 2.9.5 (FSMP) / Standard 1.1.1 Novel Food', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.9.5 성분 기준 준수 필수. 동물성 단백질(육류·난황·유청) 포함 제품은 Biosecurity Import Permit 의무 취득. 알룰로스 등 미허가 신규 성분 사용 시 Novel Food 사전 심사 필요.', originalRequirement: 'Must comply with Standard 2.9.5 compositional requirements. Products containing animal-derived proteins (meat, egg yolk, whey) must obtain mandatory DAFF Biosecurity Import Permit. Novel ingredients such as allulose require prior Novel Food assessment under Standard 1.1.1.', advisory: '⚠️ Biosecurity Risk: 육류·난황·유청 단백질 포함 FSMP 제품은 수입 허가(Biosecurity Import Permit) 필수. 알룰로스 미허가(Novel Food 검토 중). Health Star Rating 시뮬레이션 권장.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 2.9.5 — FSMP 성분 기준 (영아·아동용 별도)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '영아용 FSMP Standard 2.9.1 연계, 아동용 에너지밀도 상한 적용. 비타민·미네랄 함량 범위 준수 의무. 허용 목록 외 성분 사용 시 Novel Food 심사 필요.', originalRequirement: 'Infant FSMP linked to Standard 2.9.1. Energy density limit applies for child-specific FSMP. Vitamin and mineral content must be within specified ranges. Ingredients outside permitted list require Novel Food assessment.', advisory: '영아용 FSMP Standard 2.9.1과 2.9.5 동시 적용 여부 확인. 성분 함량 범위 준수 — 초과 시 Novel Food 심사. FSANZ 성분 허용 목록 최신 버전 확인 필수.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'DAFF Biosecurity Import Permit — FSMP 동물성 성분', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '육류·난황·유청 단백 포함 FSMP 수입 시 Biosecurity Import Permit 필수. 허가 처리 기간 3~6개월. BICON 시스템 사전 확인.', originalRequirement: 'FSMP products containing meat, egg yolk or whey protein require DAFF Biosecurity Import Permit. Processing time: 3–6 months. Import conditions must be verified in DAFF BICON.', advisory: '동물성 성분 포함 FSMP 수출 계획 시 최소 6개월 전 DAFF 허가 신청 착수. BICON 사전 조회 후 허가 필요 여부 확인. 허가 없이 수입 시 전량 반송.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.7 — FSMP 영양성분 표시 의무', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '영양소 기준치(%DI) 표시. Health Star Rating 적용 제외 가능. 사용 대상 질환·연령 라벨 명시 의무.', originalRequirement: 'Nutrient reference value (%DI) declaration required. Health Star Rating may be excluded for FSMP. Target medical condition and age group must be stated on label.', advisory: 'FSMP는 HSR 면제 가능 — 적용 시 오히려 소비자 혼란 우려. %DI 표시 의무 준수. 질환·연령 표시 누락 시 FSMP로 인정받지 못할 수 있음.', enforcementDate: '시행 중' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 9/2013 / UAE.S 2055 / Emirates Authority for Standardization (ESMA)', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 9/2013 및 UAE.S 2055 성분 기준 준수. ESMA 제품 등록 필수. 아랍어 라벨 전 항목(성분·영양·유효기한) 표기 의무. ECAS 또는 ESMA 승인 할랄 인증서 첨부 필수.', originalRequirement: 'Must comply with GSO 9/2013 and UAE.S 2055 compositional standards. ESMA product registration mandatory. Full Arabic labelling of all items (ingredients, nutrition facts, expiry date) obligatory. Halal certificate from ECAS or ESMA-approved body required.', advisory: '아랍어 라벨 전 항목 의무. ECAS/ESMA 승인 할랄 인증서 필수. GSO 영양 표시 2026 개정판 적용. 동물성 유래 성분 할랄 검증 우선.', enforcementDate: '시행 중' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 027/2012 — 특수 의료 목적 식품 기술규정 (EAC) / TR TS 021/2011 식품 안전', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증(유라시아 적합성 마크) 필수. TR TS 027/2012 성분 기준 준수. 국가 등록(СГР — 국가위생증명서) 필수. 러시아어 라벨 전면 의무. 첨가물은 TR TS 029/2012 허용 목록 준수. 수출국 허가 식품 성분 목록 EAEU 사전 대조 필수.', originalRequirement: 'EAC certification (Eurasian Conformity mark) required. Compositional standards per TR TS 027/2012. State sanitary registration (СГР) required. Full Russian-language labelling mandatory. Additives restricted to TR TS 029/2012 permitted list. All ingredient notifications must be cross-checked against EAEU approved list prior to export.', advisory: 'EAC 인증 없이 러시아·카자흐스탄·벨라루스·키르기스스탄·아르메니아 5개국 수출 불가. 등록 처리 기간 6~12개월 예상. 러시아어 라벨 오역 시 통관 거부 빈발. TR TS 029/2012 미등재 첨가물 즉시 대체 검토 필요.', urgency: 'EAEU 5국', enforcementDate: '시행 중' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food and Drugs (Composition and Labelling) Regulations — Cap 132W / CFS Guideline', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'Pre-market approval 불필요(홍콩 독자 정책). 영양성분 표시 의무(2010년 시행). 영어·번체 중국어(Traditional Chinese) 병기 표시 필수. 알레르겐 8종 의무 표시. 위생 성적서·원산지 증명 필요.', originalRequirement: 'No pre-market approval required (Hong Kong specific policy). Mandatory Nutrition Information panel (effective 2010). Bilingual (English and Traditional Chinese) labelling required. 8 allergens must be declared. Health certificate and certificate of origin required.', advisory: '중국 본토(SAMR GB 기준)와 홍콩(CFS/FEHD) 규제 완전히 별개 — 별도 라벨 설계 필수. 번체자(Traditional Chinese) 사용 의무 — 간체자(Simplified Chinese) 불인정. Codex 기준 준용으로 대부분 성분 허용.', enforcementDate: '시행 중' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Order (FSO) — 특정 원산지 FSMP 사전 신고', lawUrl: 'https://www.cfs.gov.hk/', requirement: '특정 원산지(중국 본토 등) 특수의료식품 제품 CFS 사전 신고 의무 가능. Cap 612 수입 기록 3개월 보관. 미신고 수입 시 Cap 612 위반 처벌. 수입업체 공급망 추적 기록 유지 의무.', originalRequirement: 'Certain FSMP products from specific origins (e.g. Mainland China) may require prior CFS notification under Food Safety Orders. Cap 612 import records must be retained for 3 months. Failure to notify results in Cap 612 penalties. Importers must maintain supply chain traceability records.', advisory: 'CFS Food Safety Order 대상 여부 수출 전 확인 필수. 수입 기록 전자 형태 보관 허용. CFS 불시 점검 시 즉시 제출 필요.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — FSMP 알레르겐 8종 번체자 의무 표시', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'FSMP 알레르겐 8종(밀·달걀·우유·땅콩·새우·게·호두·메밀 포함) 번체자(繁體字) 의무 표시. 영어·번체자 병기 필수. 간체자 단독 표기 불인정.', originalRequirement: 'FSMP must declare 8 allergens (wheat, egg, milk, peanuts, shrimp, crab, walnuts, buckwheat etc.) in Traditional Chinese (繁體字). Bilingual English and Traditional Chinese mandatory. Simplified Chinese alone not accepted.', advisory: '번체자 알레르겐 표기 정확히 기재 (예: 小麥·雞蛋·牛奶·花生). 간체자 단독 표기 적발 시 판매 금지. 스티커 부착도 허용 — 원라벨 간체자 시 번체자 스티커 부착.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132U — FSMP 첨가물 허용 목록 (Codex 기준 + 독자 확인)', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'FSMP 내 첨가물 Cap 132U 허용 목록 준수. Codex GSFA Cat 13.2 기준 준용하나 일부 감미료·보존료 독자 허용 목록 확인 필요. 미허가 첨가물 사용 즉시 회수 명령.', originalRequirement: 'FSMP additives must comply with Cap 132U permitted list. Generally follows Codex GSFA Cat 13.2, but certain sweeteners and preservatives have Hong Kong-specific permitted lists. Use of non-permitted additives triggers immediate recall order.', advisory: 'Cap 132U 목록 외 첨가물 사용 적발 시 전량 회수. CFS 첨가물 데이터베이스 수출 전 교차 확인 권장. 감미료·보존료 허용 여부 CFS 사전 문의 가능.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained EU Law — Commission Delegated Reg (UK) 2021 / FSA FSMP Guidance', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU Reg 2016/128 UK Retained 버전 적용 — "For special medical purposes" 표시 의무. UK Retained Food Additives Regulation 준수(EU 규정과 분리 진행 중). 영어 단독 표기 의무. MHRA 경계 제품(의약품 분류 가능성) 사전 확인 필수.', originalRequirement: 'UK retained version of EU Reg 2016/128 applies — "For special medical purposes" labelling mandatory. Must comply with UK Retained Food Additives Regulation (diverging from EU). English-only labelling required. MHRA borderline medicinal product classification must be verified in advance.', advisory: 'Brexit 이후 EU 규정과 점진적 분리 — EU 허가 신규 성분이라도 UK 별도 확인 필수. Northern Ireland 판매 시 EU NI Protocol 적용(별도). GB(잉글랜드·스코틀랜드·웨일스)와 NI 규정 분리 주의. 수출 전 FSA 최신 업데이트 확인.', urgency: 'Post-Brexit', enforcementDate: '시행 중' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Lebensmittel für besondere Verwendungszwecke (LMVBV) / LMG Art. 16', lawUrl: 'https://www.blv.admin.ch/', requirement: 'FSMP: LMVBV 식이요법식품 규정 준수. EU와 상호인정협정(MRA) 보유 — EU 허가 성분 대부분 인정. 독어·불어·이탈리아어 중 최소 1개 표기 의무. 유기농 원료 Bio Suisse 또는 CH-BIO 기준 인증 별도 필요.', originalRequirement: 'FSMP governed by LMVBV (Dietetic Foods Ordinance). Switzerland-EU Mutual Recognition Agreement (MRA) — EU-approved ingredients generally accepted. Labelling in at least one Swiss national language (German, French, Italian) mandatory. Organic ingredients require Bio Suisse or CH-BIO certification.', advisory: 'EU 회원국 아님 — EU 허가가 스위스 허가로 자동 연결 불가. MRA 활용하되 스위스 독자 허용 목록 교차 확인 필수. Swissmedic 경계 제품(의약품 해당 여부) 사전 분류 권고.', enforcementDate: '시행 중' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EU) 2016/128 + [Local] Loi Egalim 2018 / Décret n°2006-352', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Nutri-Score 표시 의무(프랑스 2017년 법제화 — EU 전체 의무화 이전 단독 시행). Loi Egalim 광고 제한(FSMP 포함 특수 식품 광고 규제 강화). 성분표시 폰트·위치 국내법 추가 기준 준수. 글리포세이트 잔류 프랑스 단독 강화 기준 적용.', originalRequirement: '[Strict Local Rule] Nutri-Score legally mandatory in France (2017 — enacted independently before any EU-wide requirement). Loi Egalim advertising restrictions apply to special-purpose foods. Stricter national rules on ingredient label font/placement. France applies stricter glyphosate residue enforcement versus EU baseline.', advisory: '[EU Deviation] EU 공통 기준 준수 + 프랑스 독자 법규 추가 확인 필수. Nutri-Score 산출 점수(A~E) 사전 시뮬레이션 및 라벨 반영 필수. 프랑스 수출 제품은 EU 인증 외 Loi Egalim 위반 여부 별도 검토.', enforcementDate: '시행 중' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[HU] Népegészségügyi termékadó (NETA 2011) / [FI] Soft Drink Tax Act / [DK] Sukkerafgiftsloven', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 고당류·고카페인·에너지드링크 건강세 부과(음료 8~40 HUF/L). 핀란드 가당음료세: €0.11/L(설탕 0.5~8g/100mL) / €0.22/L(8g/100mL 초과). 덴마크 설탕세 논의 지속. Nutri-Score 의무화: 프랑스(필수), 독일·벨기에·네덜란드(자율 권장).', originalRequirement: '[EU Divergence] Hungary NETA: public health tax on high-sugar, high-caffeine, energy drinks (8~40 HUF/L). Finland soft drink sugar tax: €0.11/L (0.5–8g/100mL) / €0.22/L (>8g/100mL). Denmark sugar tax under ongoing discussion. Nutri-Score: mandatory France, voluntary Germany/Belgium/Netherlands.', advisory: '헝가리·핀란드 수출 시 당류 함량에 따른 세율 부과 제품 선별 필수. EU 단일 규정 외 개별 국가 세금이 가격 경쟁력에 직접 영향. 저당·무가당 포뮬레이션으로 추가 세금 부담 회피 전략 권장.', enforcementDate: '시행 중' },
    ],
  },
  'plant-based': {
    title: 'Plant-based Foods — Global Regulations',
    icon: Leaf,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 두류 / 대두단백 가공식품 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '식물성 단백질 식품: 단백질 ≥ 25% 기준. 유전자변형 대두 사용 시 GMO 표시 의무 (2026.01 개정 적용). 혼합 단백질 제품 표시 기준 준수.', originalRequirement: 'Plant-based protein foods: Protein ≥ 25%. Mandatory GMO labeling for GM soy (2026.01 revision). Mixed protein products must comply with labeling standards.', advisory: 'GMO 표시 개정(2026.01) 적용 여부 즉시 검토. 비건/채식 마크는 민간 인증으로 법적 의무 아님.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '2026.01', law: '유전자변형식품 표시기준 (GMO 표시)', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '7종 GMO 의무 표시 대상: 대두·옥수수·면화·카놀라·사탕무·알팔파·감자. 비의도적 혼입 3% 초과 시 표시 의무. 2026.01 개정: GMO 성분 검출 시 가공품까지 표시 의무 확대. "유전자변형○○포함" 표시.', advisory: 'PCR 검사로 GMO 여부 확인 후 수출. 2026.01 개정으로 가공품 GMO 표시 범위 확대 — 즉시 재검토 필요.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품 등의 표시·광고에 관한 법률 — 식물성 단백질 표시', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '"비건(Vegan)" "채식주의(Vegetarian)" 표시는 법적 의무 기준 없음(민간 인증). 단백질 함량 표시 시 건량(dry weight) 또는 제품 중량 기준 명확히 표기. 대두단백 추출물 원재료명 식품공전 표준 명칭 사용 의무.', advisory: '비건 인증은 법적 강제 아님 — 한국채식협회 등 민간 인증만 존재. 단백질 함량 과장 광고 식약처 점검 증가 추세.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수입식품안전관리특별법 — 식물성 단백질 가공품', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '식물성 단백질 가공품(두부·대두단백·식물성 버거류) 수입 시 사전신고 의무. 최초 수입 품목 정밀검사 지정. GMO 성분 검사 성적서 구비 권장. 외국 제조업소 MFDS 등록 필요.', advisory: '식물성 가공식품 품목 분류에 따라 수입 요건 상이 — 식품유형 사전 확인 필수. GMO 검사 성적서 수출국 공인기관 발행본 구비.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품위생법 — 알레르겐 표시 기준 (22종)', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '22종 알레르겐 의무 표시: 난류·우유·메밀·땅콩·대두·밀·고등어·게·새우·돼지고기·복숭아·토마토·아황산류·호두·닭고기·쇠고기·오징어·조개류·굴·전복·홍합·잣. 교차오염(may contain) 권고 표시 병행.', advisory: '대두 포함 식물성 제품 알레르겐 표시 필수. 교차오염 위험성 라벨 표기 미비 시 소비자 분쟁 발생 사례 증가.', },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA Plant-Based Labeling Guidance / 21 CFR Part 131', lawUrl: 'https://www.fda.gov/food/food-labeling-nutrition/plant-based-labeling', requirement: '"우유(Milk)" / "육류(Meat)" 명칭 사용 제한 (표준 정의 제품에만 허용). 대체 단백질 제품은 별도 명칭 사용 권장. 대두(Soy)는 GRAS 인정.', originalRequirement: '"Milk" / "Meat" naming restricted (standard definition products only). Alternative protein products recommended to use distinct names. Soy recognized as GRAS.', advisory: 'Plant-based meat는 USDA FSIS가 아닌 FDA 관할. 단백질 소화율(PDCAAS) 및 영양 라벨 정확도 검토 필수.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '2024.01.01', law: '식품위생법 제7조 식품의 기준 및 규격 — 대체식품(식물성·배양육·정밀발효) 한시적 기준 고시 (식약처 고시 제2023-81호 / 2024 시행)', lawUrl: 'https://www.mfds.go.kr/', requirement: '[2024 신설] MFDS 대체식품 한시적 기준·규격 고시(식약처 고시 제2023-81호): ① 식물성 대체육 — 조직대두단백·완두단백·균류단백 원료 기준 신설 ② 세포배양 축산물(배양육) — 제조 공정 위생 기준 + 원료 세포 안전성 평가 요건 ③ 정밀발효 단백질 — 미생물 균주 안전성 + GMP 시설 요건 ④ "대체식품" 명칭 + 원료 유래 표시 의무. 소비자 오인 방지 — 축산물 명칭 단독 사용 금지.', advisory: '[한국 시장 선제 대응] 식물성 대체육·배양육 수출입 — MFDS 한시적 기준 적합성 사전 확인 필수(기준 외 제품 수입 불가). 배양육 상업 판매 한국 최초 MFDS 승인 절차 진행 중(2025 예상). "대체 단백질" "식물 기반" 표현 한국어 표시 기준 준수. 식약처 고시 개정 주기 빠름 — 수출 전 최신 고시 확인 필수.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 식물성 식품 예방 통제 (HARPC)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '알레르겐(대두·땅콩·트리너트) 교차오염 위해요소 분석 의무. 식품안전계획 문서화. 공급업체 검증 프로그램. 위생 관리 기준 준수. 시설 FDA 등록 의무.', originalRequirement: 'Hazard analysis for allergens (soy, peanut, tree nuts) cross-contact. Food Safety Plan documentation. Supplier verification program. Sanitation controls. Facility FDA registration required.', advisory: '식물성 단백질 제품 알레르겐 교차오염 주요 리콜 원인. 식품안전계획 현장 비치·갱신 의무. 소규모 기업 Qualified Facility 적용 여부 확인(연간 매출 $1M 미만).' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA NOP (7 CFR Part 205) — 유기농 식물성 식품 인증', lawUrl: 'https://www.ecfr.gov/current/title-7/subtitle-B/chapter-I/subchapter-M/part-205', requirement: '"USDA Organic" 표시: 유기농 원료 95% 이상. "Made with Organic" 표시: 70% 이상. 허용 외 농약·비료 사용 금지. USDA 인정 인증기관 연간 심사 의무.', originalRequirement: '"USDA Organic" label: ≥95% organic ingredients. "Made with Organic": ≥70%. Prohibited substances (non-approved pesticides, synthetic fertilisers) banned. Annual inspection by USDA-accredited certifier.', advisory: '"Organic" 무단 표시 시 USDA 벌금($11,000/건). 수입 유기농 제품 미국 인정 동등성 협정 국가 여부 확인. 한국-미국 유기농 동등성 협정 없음 — 별도 USDA 인증 필요.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA GRAS Notification — 신규 식물성 단백질 원료', lawUrl: 'https://www.fda.gov/food/generally-recognized-safe-gras/gras-notice-inventory', requirement: '신규 식물성 단백질(완두·렌틸·버섯·미세조류 등) 사용 전 GRAS 확인 필수. GRAS 미해당 시 식품첨가물 청원(FAP) 제출. GRAS 자가인정(SGID) 가능하나 FDA 통보 권장.', originalRequirement: 'Novel plant proteins (pea, lentil, mushroom, microalgae) must be confirmed GRAS before use. Non-GRAS requires Food Additive Petition (FAP). Self-determined GRAS (SGID) possible but FDA notification recommended.', advisory: 'GRAS 미확인 신규 원료 사용 시 시장 회수 위험. FDA GRAS 통보 검토 기간 평균 6~18개월. 마이크로조류(스피루리나·클로렐라) GRAS 인정 — 사용량 기준 별도 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Novel Food Regulation (EU) 2015/2283 / Reg 1169/2011', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R2283', requirement: '신규 식물성 단백질(레귀메이션, 미세조류 등)은 Novel Food 사전 허가 필요. EFSA 과학적 의견서 제출 필수.', originalRequirement: 'Novel plant proteins (e.g. legumins, microalgae) require prior authorisation under Novel Food Reg (EU) 2015/2283. EFSA scientific opinion required.', advisory: 'EFSA 심사 18-36개월 소요. 기존 허가된 대두·완두 단백질은 해당 없음. 성분 신규성 사전 확인 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Annex II — 식물성 대체육 알레르겐 14종 표시', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '대두·셀러리·겨자·루핀·아황산염 포함 14종 알레르겐 강조 표시 의무. 가공보조제(Processing Aid)도 최종 제품 잔류 시 표시. 비포장 제품(레스토랑·식품 진열대)도 적용.', originalRequirement: 'Soy, celery, mustard, lupin, sulphites and 10 others: mandatory emphasis in ingredient list. Processing aids retained in final product must be declared. Unpackaged food (catering, deli counters) also covered.', advisory: '루핀·셀러리·겨자는 한국 미의무 알레르겐 — EU 수출 시 별도 추가 표시 필수. 비포장 진열 제품도 서면 알레르겐 고지 의무. 라벨 미표시 시 EU 전역 즉각 회수 가능.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1881/2006 — 대두·두류 오염물질 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1881', requirement: '아플라톡신 B1 ≤2 μg/kg (가공 두류). OTA(오크라독신 A) ≤3 μg/kg (가공 식품). 카드뮴 ≤0.1 mg/kg. 납 ≤0.1 mg/kg. 정기 모니터링 의무.', originalRequirement: 'Aflatoxin B1 ≤2 μg/kg (processed legumes). OTA ≤3 μg/kg (processed food). Cadmium ≤0.1 mg/kg. Lead ≤0.1 mg/kg. Regular monitoring mandatory.', advisory: 'EU MRL·오염물질 기준이 한국보다 엄격한 경우 많음 — 수출 전 EU 기준 교차 확인 필수. 아플라톡신 초과 시 RASFF 등록 후 EU 전역 회수. 수출 전 EU 공인기관 성적서 확보.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '2022.01.01', law: 'Reg (EU) 2018/848 — 유기농 식물성 식품 인증', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R0848', requirement: '"EU Organic" 로고 사용: 유기농 원료 95% 이상 조건. EU 인정 제3자 인증기관 연간 심사. 합성 농약·GMO 사용 금지. 전환 기간(2년) 중 "전환 중" 표시만 가능.', originalRequirement: '"EU Organic" logo: ≥95% organic ingredients. Annual inspection by EU-recognised third-party certifier. Synthetic pesticides and GMOs prohibited. During 2-year conversion period, only "in conversion" labelling allowed.', advisory: '수입 유기농 식물성 제품 EU 동등성 협정 또는 EU 인증기관 인증 필수. 한국 친환경 인증은 EU 자동 인정 안 됨 — 별도 EU 인증기관 감사 필요. 2022.01.01 신규 규정 적용 중.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '大豆 / 植物性たんぱく 품질 기준 (CAA 이관 2026.04.01)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: 'JAS 표준 준수. 대두 알레르겐 표시 의무. 2026.04.01부로 관할청이 소비자청(CAA)으로 전환.', originalRequirement: 'JAS規格に準拠。大豆アレルゲン表示が義務。2026年4月1日より管轄が消費者庁（CAA）へ移管。', advisory: '대두 함유 제품의 알레르겐 표시 폰트·위치 규정 확인. CAA 이관 후 인허가 창구 업데이트.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品衛生法 — GMO 표시 기준 (대두·옥수수 등 7종)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: 'GMO 의무 표시 대상 7종: 대두·옥수수·감자·카놀라·면화·알팔파·사탕무. 비의도적 혼입 5% 이하 비표시 허용. "遺伝子組換え" 또는 "遺伝子組換え不分別" 표시.', originalRequirement: 'GMO義務表示対象7種：大豆・とうもろこし・じゃがいも・なたね・綿実・アルファルファ・甜菜。意図せざる混入5%以下は表示不要。「遺伝子組換え」または「遺伝子組換え不分別」と表示。', advisory: 'GMO 대두 함유 식물성 단백질 제품 "遺伝子組換え不分別" 표시 필요. 非GMO 강조 표시 시 IP 핸들링 증명서 구비 필수. 5% 초과 혼입 시 GMO 표시 의무.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 大豆 알레르겐 표시 (준의무 20종)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '大豆는 特定原材料에 준하는 품목(준의무 20종 중 1종). 두유·두부·낫토 유래 원재료명 표시 권장. 소비자 알레르겐 정보 제공 강화 지침 적용.', originalRequirement: '大豆は特定原材料に準ずる品目（推奨20品目のうちの1つ）。豆乳・豆腐・納豆由来原材料の表示を推奨。消費者向けアレルギー情報の提供強化指針が適用される。', advisory: '대두 알레르겐 의무는 아니나 준의무 권고 — 누락 시 소비자 분쟁 위험. 두유·두부 기반 제품 라벨에 "大豆" 명기 권장. 의무 8종과 혼동 주의.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '大豆イソフラボン 안전성 기준 — 食品安全委員会', lawUrl: 'https://www.fsc.go.jp/', requirement: '식품안전위원회: 이소플라본 보충제 상한 30 mg/일. 식품 형태 상한 70~75 mg/일 지침. 일일 상한 초과 표시 금지. 기능성표시식품 届出 시 이소플라본 함량 명기.', originalRequirement: '食品安全委員会：大豆イソフラボンの上限は補助食品30 mg/日、食品形態70~75 mg/日。上限超過の表示禁止。機能性表示食品の届出時はイソフラボン含量の明記が必要。', advisory: '이소플라본 고함유 식물성 제품 일일 상한 표시 의무 확인. 기능성 표시 시 CAA 届出 데이터베이스 등록 필수. 보충제 형태 시 30 mg/일 상한 엄격 적용.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: 'JAS 有機 인증 — 식물성 식품', lawUrl: 'https://www.maff.go.jp/j/jas/jas_kikaku/organic.html', requirement: '유기농(有機) 표시 시 JAS 유기 인증 필수. 합성농약·화학비료 3년 이상 미사용 토지 조건. 인증기관 심사 후 유기JAS 마크 사용. 수입 유기 식물성 식품 동등성 협정국 인증 인정.', originalRequirement: '有機表示にはJAS有機認証が必要。3年以上農薬・化学肥料を使用しない土地が条件。認証機関の審査合格後、有機JASマークの使用が許可される。輸入有機植物性食品は同等性協定国の認証を承認。', advisory: 'JAS 유기 없이 "有機" 표시 금지 — 처벌 대상. 미국·EU 유기 인증 동등성 협정으로 상호 인정. 인증 유효기간 1년 — 갱신 일정 관리 필요.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.11.26', law: '植物性蛋白食品 관련 기준 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 등록 및 성분표 제출 필수. 잔류농약 기준 2025.11.26 개정 적용. 표시사항 중국어 의무.', originalRequirement: '須進口登記並提交成分清單。農藥殘留基準適用2025.11.26修訂版。標示事項須以中文為之。', advisory: '개정 잔류농약 MRL 기준 충족 여부 즉시 검토. 식물성 원료 농약 잔류 검사 성적서 구비 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '基因改造食品標示辦法 — GMO 식물성 식품 (>3%)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'GMO 성분 함유율 >3% 의무 표시. 대두·옥수수·카놀라·면화·감자·알팔파·사탕무 7종 주요 대상. Non-GMO 표시 시 공인기관 IP 핸들링 검증 필요. 미승인 GMO 작물 수입 금지.', originalRequirement: 'GMO成分含有率>3%須強制標示。大豆、玉米、油菜、棉花、馬鈴薯、紫花苜蓿、甜菜7種為主要對象。非基改標示須IP管理驗證。未核准GMO作物禁止進口。', advisory: 'GMO 대두 함유 식물성 단백질 제품 "基因改造大豆" 표시 의무. Non-GMO IP 문서 공인기관 검증. 미승인 GMO 성분 수입 즉시 금지 및 폐기.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '農藥殘留容許量標準 — 대두·두류 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '글리포세이트(除草劑) 대두 ≤10 mg/kg. 클로르피리포스 ≤0.01 mg/kg. 목록 외 농약 0.01 mg/kg 일률기준. 두부·두유 가공품 원료 성분 농약 잔류 준수.', originalRequirement: '嘉磷塞（除草劑）大豆≤10 mg/kg。氯吡硫磷≤0.01 mg/kg。未列名農藥適用0.01 mg/kg一律標準。豆腐、豆漿等加工品原料農藥殘留須符合標準。', advisory: '클로르피리포스 EU 금지 농약 TFDA 기준도 0.01 mg/kg — 검사 성적서 필수. 글리포세이트 대두 기준 10 mg/kg 확인(Codex와 일치).' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品添加物使用範圍 — 두부·두류 가공 첨가물', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '두부 응고제: 황산칼슘(石膏, CaSO₄) 허용. 염화마그네슘(鹵水) 허용. 글루코노-δ-락톤(GDL) 허용. 두유 표백제 사용 금지. 허용 외 첨가물 사용 금지.', originalRequirement: '豆腐凝固劑：硫酸鈣（石膏，CaSO₄）許可。氯化鎂（鹵水）許可。葡萄糖酸內酯（GDL）許可。豆漿禁用漂白劑。禁用未許可添加物。', advisory: '두부 응고제 허용 3종 외 사용 금지. 두유 표백제(이산화황 등) 사용 적발 시 전량 폐기. 허용 첨가물 목록 TFDA 최신 고시 확인.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 식물성 식품 원산지·유기 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '大豆 알레르겐 의무 표시(11종 중 1종). 원산지(原產地) 의무 표시. 유기(有機) 표시 시 農業部 유기인증 필수. 두부·두유 제품 명칭 기준 준수.', originalRequirement: '大豆為11種強制標示過敏原之一。須強制標示原產地。有機標示須具備農業部有機認證。豆腐、豆漿等產品名稱基準須遵守。', advisory: '대두 알레르겐 표시 누락 시 TFDA 행정처분. 유기 대두 제품 農業部 인증 유효기간 확인. 제품명 기준(豆腐·豆漿 등) TFDA 고시 준수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2715 / GB 7718 — 大豆蛋白 식품 기준 (SAMR)', lawUrl: 'https://www.samr.gov.cn/', requirement: '식물성 단백질 식품 수입 시 GACC 등록 필수. 대두단백 제품은 GMO 표시 의무 (使用了转基因). 원료 GB 2760 첨가물 목록 준수. 중국어 라벨 필수.', originalRequirement: '进口植物蛋白食品须完成GACC注册。大豆蛋白产品须标注转基因信息。原料须符合GB 2760食品添加剂标准。须贴中文标签。', advisory: 'GMO 대두 성분 포함 시 중국어 표시 필수. 대두 단백 추출 공정 서류(생산시설 등록) GACC에 사전 제출. GB 2760 외 첨가물 즉시 대체 검토.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: '基因改造食品标识办法 (SAMR) — GMO 식물성 식품', lawUrl: 'https://www.samr.gov.cn/', requirement: 'GMO 대두·옥수수 성분 함유량 관계없이 전 제품 의무 표시. Non-GMO 강조 표시 시 공인기관 IP 인증 서류 제출. 두부·두유·두유음료 GMO 원료 사용 시도 표시 의무. EU(0.9%), 한국(3%)과 달리 역치 없음.', originalRequirement: 'GMO大豆、玉米成分无论含量多少，所有产品须强制标识。Non-GMO强调标示须提交认可机构IP认证文件。豆腐、豆浆、豆奶使用GMO原料同样须标识。无阈值，与EU（0.9%）和韩国（3%）不同。', advisory: 'GMO 역치 없는 기준 — 미량 GMO 원료라도 표시 필수. Non-GMO 표시를 원하면 IP 관리 공인기관 인증 사전 준비. 중국 수출 전용 제품 Non-GMO 원료 전환 검토.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2763-2021 — 農药残留 대두·두류 (식물성 식품)', lawUrl: 'https://www.samr.gov.cn/', requirement: '대두 글리포세이트 ≤20 mg/kg. 클로르피리포스 ≤0.05 mg/kg(대두). 카보푸란(carbofuran) ≤0.05 mg/kg(대두). 목록 외 농약 0.01 mg/kg 일률기준. 원료 대두 잔류농약 성적서 구비 권장.', originalRequirement: '大豆草甘膦≤20 mg/kg。毒死蜱≤0.05 mg/kg（大豆）。克百威（氨基甲酸酯）≤0.05 mg/kg（大豆）。目录外农药0.01 mg/kg。建议备存原料大豆农药残留报告。', advisory: '대두 글리포세이트 기준 EU(TW) 기준과 상이 — 원료 대두 공급국 MRL 사전 대조. 클로르피리포스 기준 강화 추세. 로트별 성적서 구비 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2760-2024 — 大豆制品 첨가물 기준 (두부·두유)', lawUrl: 'https://www.samr.gov.cn/', requirement: '두부 응고제: 황산칼슘(石膏)·염화마그네슘(鹵水)·GDL 허용. 두유 표백제 사용 금지. 식물성 단백질 음료 GB 2760 허용 첨가물 목록 준수. 보존료: 소르빈산 ≤1.0 g/kg(두류 가공품).', originalRequirement: '豆腐凝固剂：硫酸钙（石膏）、氯化镁（卤水）、GDL许可。豆浆禁用漂白剂。植物蛋白饮料须符合GB 2760允许添加剂。防腐剂：山梨酸≤1.0 g/kg（豆类加工品）。', advisory: '두부 응고제 허용 3종 외 사용 금지. 표백제 사용 적발 시 전량 폐기. GB 2760-2024 최신 버전(2025.02.08 시행) 적용 — 구버전 기준 사용 주의.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7718 标签 — 식물성 식품 원산지·유기인증 표시', lawUrl: 'https://www.samr.gov.cn/', requirement: '원산지(原产地) 의무 표시. 중국 유기인증(CNCA) 없이 "有机" 표시 금지 — 외국 유기인증 자동 인정 불가. 대두 알레르겐(大豆) 중국어 표시. 净含量·유통기한·수입업체 표기 의무.', originalRequirement: '原产地须强制标注。未获CNCA中国有机认证不得标注"有机"——外国有机认证不自动获认可。大豆过敏原须中文标注。净含量、保质期、进口商须标注。', advisory: '中国 유기인증(CNCA) 별도 취득 필요 — EU·미국 유기인증 자동 인정 불가. 유기 표시 위반 시 행정처분. 중국어 라벨 완비 후 GACC ePort 수입신고.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 식물성 식품 대두·견과류·글루텐 알레르겐 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 43/2014 / Nghị định 15/2018 — 식물성 식품 수입 규정', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '식물성 단백질 식품(두유·식물성 버거 등) 수입 시 VFA 수입 허가 필요. Self-Declaration 의무. 베트남어 성분표 필수. 허용 첨가물 Circular 24 적용.', originalRequirement: 'Thực phẩm protein thực vật nhập khẩu cần giấy phép VFA. Tự công bố bắt buộc. Nhãn thành phần tiếng Việt bắt buộc. Phụ gia theo Thông tư 24.', advisory: '두유·식물성 단백질 제품 Circular 24 색소·보존료 한도 확인. 수입 허가 갱신 2026.01부터 온라인 전환. 아조계 색소 사용 시 사전 확인 필수.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-2:2011/BYT — 식물성 식품 중금속 기준', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '대두 제품 카드뮴(Cd) ≤0.2 mg/kg. 납(Pb) ≤0.2 mg/kg. 수은(Hg) ≤0.05 mg/kg. 두부·두유 비소(As) ≤0.1 mg/kg. 성분 성적서 자기선언 서류에 첨부 권장.', originalRequirement: 'Sản phẩm đậu nành: Cd≤0.2 mg/kg. Pb≤0.2 mg/kg. Hg≤0.05 mg/kg. Đậu phụ/sữa đậu nành: As≤0.1 mg/kg. Nên kèm giấy chứng nhận thành phần theo tài liệu tự công bố.', advisory: 'QCVN 8-2 중금속 성적서 자기선언 첨부 시 통관 원활. 카드뮴 기준 초과 시 전량 폐기. 원료 대두 공급업체 중금속 모니터링 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 36/2018 — 잔류농약 + Decree 111/2021 GMO 표시 (식물성)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '대두·두류 잔류농약 Codex MRL 준용. 글리포세이트 ≤20 mg/kg(대두). GMO 식물성 제품 베트남어 GMO 표시 의무. Non-GMO 표시 시 공인기관 인증 근거 서류 필요.', originalRequirement: 'Đậu nành: MRL thuốc trừ sâu theo Codex. Glyphosate≤20 mg/kg (đậu nành). Sản phẩm GMO thực vật: ghi nhãn GMO tiếng Việt bắt buộc. Non-GMO cần tài liệu chứng nhận từ cơ quan được công nhận.', advisory: 'GMO 표시 의무 베트남어 이행. 글리포세이트 성적서 구비. Non-GMO IP 관리 문서 공인기관 인증 필요. Decree 111 라벨링 동시 준수 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — 식물성 식품 라벨링 베트남어 의무', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '두유·두부·식물성 단백질 제품 라벨 전 항목 베트남어 의무. 알레르겐(대두·글루텐) 베트남어 표시. 유통기한 DD/MM/YYYY. 영양성분표(단백질·지방·탄수화물·나트륨) 베트남어. 원산지 베트남어.', originalRequirement: 'Sữa đậu nành, đậu phụ, protein thực vật: toàn bộ nhãn bằng tiếng Việt bắt buộc. Chất gây dị ứng (đậu nành, gluten) bằng tiếng Việt. Hạn sử dụng DD/MM/YYYY. Bảng dinh dưỡng (protein, chất béo, carbohydrate, natri) tiếng Việt. Xuất xứ bằng tiếng Việt.', advisory: '알레르겐(대두) 베트남어 표시 누락 시 행정처분. 유통기한 형식 DD/MM/YYYY 철저 준수. 베트남어 라벨 미부착 시 통관 불가.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Food Act B.E. 2522 / TISI 2413 — 두유·식물성 단백질 식품', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx', requirement: '두유·식물성 단백질 제품 FDA 등록 의무. 성분 Codex 기준 적용. Cyclamate 금지. 타이어 라벨 표시 의무. 포장 중금속 기준 준수.', originalRequirement: 'ผลิตภัณฑ์โปรตีนจากพืชต้องขึ้นทะเบียนกับ อย. มาตรฐานส่วนผสมตาม Codex ห้าม Cyclamate ฉลากภาษาไทยบังคับ บรรจุภัณฑ์ต้องผ่านมาตรฐานโลหะหนัก', advisory: 'Cyclamate 감미료 함유 식물성 제품 수출 불가. Tartrazine 한도(50mg/kg) 준수. TISI 인증 여부 TISI 홈페이지에서 사전 확인 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPOM Reg. No. 22 Tahun 2019 (Pangan Olahan) + SNI 01-3148 (Plant-based) + BPJPH 할랄 의무화', lawUrl: 'https://www.pom.go.id/', requirement: '식물성 단백질 제품 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가. 2026.10 이후 할랄 인증 전면 의무화.', originalRequirement: 'Produk protein nabati wajib memiliki nomor ML BPOM. Pelabelan alergen kedelai dan gluten wajib. Label "halal" tidak boleh digunakan tanpa sertifikasi. Sertifikasi Halal BPJPH wajib penuh mulai Oktober 2026.', advisory: '식물성 단백질 제품도 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가 (2026.10 이후 전면 의무화)' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 대두·두류 오염물질 (중금속·아플라톡신)', lawUrl: 'https://www.pom.go.id/', requirement: '대두 카드뮴 ≤0.2 mg/kg, 납 ≤0.2 mg/kg. 아플라톡신 B1 ≤5 μg/kg, 총 아플라톡신 ≤15 μg/kg. 수입 전 BPOM 인정 검사기관 성적서 제출.', originalRequirement: 'Soybean: cadmium ≤ 0.2 mg/kg, lead ≤ 0.2 mg/kg. Aflatoxin B1 ≤ 5 μg/kg, total aflatoxins ≤ 15 μg/kg. BPOM-accredited laboratory test report required before import.', advisory: '아플라톡신 B1 기준(5 μg/kg) 국제 기준보다 엄격. 중금속·아플라톡신 성적서 별도 구비. 원료 대두 공급업체 정기 모니터링 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BPOM ML 수입 등록 절차 — 식물성 단백질 제품', lawUrl: 'https://www.pom.go.id/', requirement: 'BPOM ML 등록 소요 3~6개월, 갱신 5년 주기. 자국 내 공인 수입업체(IT/LTO 보유 업체)를 통해서만 수입 가능. 등록 전 수입·판매 절대 금지.', originalRequirement: 'BPOM ML registration takes 3–6 months, renewed every 5 years. Import only through licensed domestic importers (IT/LTO holders). Import and sale prohibited before registration.', advisory: 'ML 등록 없이 수입 시 적발 즉시 폐기 및 처벌. 현지 공인 수입업체 선정 후 ML 등록 진행 필수. 제품 라벨·성분 변경 시 ML 재등록 요구.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'PP 69/1999 + BPOM Reg. 22/2019 — 식물성 식품 라벨 (인도네시아어·GMO)', lawUrl: 'https://www.pom.go.id/', requirement: '성분명·원산지 인도네시아어 의무 표기. 대두·글루텐 알레르겐 인도네시아어 표시. GMO 성분 사용 시 "Mengandung GMO" 표시 의무. 영양성분표 인도네시아어 의무.', originalRequirement: 'Ingredient names and country of origin must be in Indonesian. Soy and gluten allergens in Indonesian required. GMO content must be declared as "Mengandung GMO". Nutritional information in Indonesian mandatory.', advisory: '인도네시아어 라벨 미부착 시 통관 불가. GMO 대두 원료 사용 시 표시 의무 이행. BPOM ML 등록 시 라벨 사전 심사 포함.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 + BPI Organics Certification + FDA AO 2020-0023 (Novel Food for PBF)', lawUrl: 'https://www.fda.gov.ph/', requirement: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수.', originalRequirement: 'Novel Food ingredients in plant-based products require prior FDA approval under AO 2020-0023. CPR registration and Import Permit issuance mandatory. "Plant-based" labelling permitted but nutritional labelling must comply with FDA Philippines standards.', advisory: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DA AO — 식물성 식품 잔류농약 MRL (Codex 준용)', lawUrl: 'https://www.fda.gov.ph/', requirement: '대두·두류 잔류농약 MRL Codex 기준 준용. 글리포세이트 대두 잔류 DA-BAI 공인 검사기관 성적서 요구. 클로르피리포스 ≤0.01 mg/kg 적용.', originalRequirement: 'Soybean pesticide residue MRLs follow Codex. Glyphosate residues in soya require DA-BAI accredited test report. Chlorpyrifos ≤ 0.01 mg/kg applies.', advisory: 'DA-BAI 공인 검사기관 성적서 지참 필수. 글리포세이트 대두 잔류 성적서 별도 준비 권장. Codex 미설정 농약은 ND(불검출) 기준 적용 가능 — 사전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA — 식물성 단백질 품질 기준 (PER/PDCAAS)', lawUrl: 'https://www.fda.gov.ph/', requirement: '식물성 단백질 제품 protein quality 기준(PER·PDCAAS) FDA 검토 필요. 단백질 함량 표시 시 실측값 기준. 영양성분 표시 FDA AO 기준(에너지·단백질·탄수화물·지방·나트륨 의무).', originalRequirement: 'Plant-based protein products subject to FDA protein quality review (PER/PDCAAS). Protein content must be based on actual measured values. Nutrition labelling per FDA AO: energy, protein, carbohydrate, fat, sodium mandatory.', advisory: '단백질 함량 과장 표시 FDA 점검 대상. PDCAAS 계산 근거 서류 구비 권장. 영양표시 영어 + 필리핀어 병기 권장.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2020-0023 — Novel Food 식물성 원료 사전 안전 평가', lawUrl: 'https://www.fda.gov.ph/', requirement: '신규 식물성 원료(배양육 유사 신소재·미세조류·신규 콩류 단백질) 사전 안전 평가 필수(FDA AO 2020-0023). 안전성 데이터·독성 시험 결과 제출. 기승인 원료 목록 사전 확인.', originalRequirement: 'Novel plant-based ingredients (cultured meat analogues, microalgae, new legume proteins) require mandatory pre-market safety assessment under FDA AO 2020-0023. Safety data and toxicology results must be submitted. Check pre-approved ingredient list first.', advisory: '신규 식물성 성분 FDA 사전 승인 없이 수입·판매 불가. 심사 소요 6~12개월 — 조기 신청 필수. 기존 허가 원료(대두·완두·쌀 단백) 해당 없음.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', enforcementDate: '2026.01.01', law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Part B + Health Canada 식물성 단백질 가이드라인', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수.', originalRequirement: '"Plant-based meat" labelling must comply with CFIA guidelines. FOPL (Front-of-Package Labelling) mandatory for high fat/sugar products from 2026.01.01. Bilingual (English/French) labelling required on all mandatory label elements.', advisory: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada Novel Food Regulations — 신규 식물성 단백질 사전 승인', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '완두·렌틸·버섯·미세조류 등 신규 식물성 단백질 Novel Food 사전 고지 필수. Health Canada 45일 이내 검토. 고지 없이 판매 시 위반.', originalRequirement: 'Novel Food pre-market notification required for new plant proteins (peas, lentils, mushrooms, microalgae etc.). Health Canada review within 45 days. Sale without notification is a violation.', advisory: '신규 식물성 단백 원료 Novel Food 해당 여부 Health Canada 사전 문의. 45일 검토 후 이의 없으면 판매 가능. 미고지 판매 시 리콜 위험.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA — "Plant-Based Meat" 표기 가이드라인 (2024)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '"Burger" 등 육류명 사용 시 "Plant-Based" 수식어 필수. 단백질 품질(PDCAAS) 표시 권장. 영어·불어 이중 표기 의무.', originalRequirement: 'Meat-reference terms (e.g. "Burger") require "Plant-Based" qualifier. Protein quality (PDCAAS) declaration recommended. Bilingual English/French labelling mandatory.', advisory: '"Plant-Based Burger" 표기 시 CFIA 가이드라인 준수. 영어·불어 이중 표기 필수. 단백질 함량·품질 성적서 구비 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'FDR Division 16 — 식물성 식품 허용 첨가물', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '메틸셀룰로스·카라기난·전분 허용 목록 준수. 탄산칼슘·비타민D2 영양강화 허용 기준 확인. Division 16 목록 외 첨가물 사용 금지.', originalRequirement: 'Methylcellulose, carrageenan and starch must be from FDR Division 16 permitted list. Calcium carbonate and vitamin D2 fortification permitted within specified limits. Additives outside the permitted list prohibited.', advisory: '식물성 대체육 첨가물 Division 16 목록 교차 확인. 메틸셀룰로스 허용량 초과 주의. 영양강화 성분 허용 한도 사전 확인 필수.', enforcementDate: '시행 중' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'MOH 수입 허가 및 Food Regulations 1985 성분 기준 준수. 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가 — 공정 대체 필수. 말레이어 표시 의무.', originalRequirement: 'Permit import MOH dan pematuhan Food Regulations 1985 diperlukan. Proses pengekstrakan alkohol menjadikan Pensijilan Halal JAKIM tidak boleh diperoleh — penggantian proses wajib. Pelabelan bahasa Melayu diwajibkan.', advisory: '식물성 제품이라도 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가. 공정 전환 필요. 두부·대두 단백 제품 수출 유망.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.13 — 대두·두류 오염물질 기준', lawUrl: 'https://www.moh.gov.my/', requirement: '대두 아플라톡신 총량 ≤15 μg/kg. 카드뮴(대두) ≤0.2 mg/kg. 납(대두) ≤0.2 mg/kg. 수입 전 공인 검사기관 성적서 제출 의무.', originalRequirement: 'Soybean: total aflatoxins ≤ 15 μg/kg. Cadmium ≤ 0.2 mg/kg. Lead ≤ 0.2 mg/kg. Accredited laboratory report required before import.', advisory: '아플라톡신 성적서 SIRIM·DOA 인정 기관 발행 권장. 중금속 성적서 별도 구비. MAQIS 무작위 샘플링 시 즉시 제출 필요.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Biosafety Act 2007 (BSA) — GMO 식물성 식품 표시', lawUrl: 'https://www.moh.gov.my/', requirement: 'GMO 대두·옥수수 성분 함유 시 "Mengandungi GMO" 말레이어 표시 의무. 검출 기반 적용(비율 기준 미설정). Non-GMO 표시 시 인증서 필요.', originalRequirement: 'Plant-based foods containing GMO soya or corn must label "Mengandungi GMO" in Malay. Detection-based (no threshold). Non-GMO claims require certification.', advisory: 'GMO 대두 함유 식물성 제품 BSA 2007 표시 의무 사전 확인. PCR 검사 성적서 지참 권장. Non-GMO 무허가 표시 시 BSA 위반.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.16 + MeSTI — 식물성 대체육 영양표시', lawUrl: 'https://www.moh.gov.my/', requirement: '식물성 대체육("meat alternative") 표기 기준 MOH 미확립 — 사전 문의 권장. 영양성분 표시(에너지·단백질·지방·탄수화물·나트륨) 의무. MeSTI 인증 권장.', originalRequirement: 'Labelling standard for "meat alternative" not yet established by MOH — prior consultation recommended. Mandatory nutrition information (energy, protein, fat, carbohydrate, sodium). MeSTI certification recommended.', advisory: '식물성 고기류 제품명 표기 MOH 사전 문의 필수. MeSTI 인증서 수입업체 비치 권장. 말레이어 성분명 누락 시 통관 거부.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'Food Standards Code Standard 1.3.1 / Standard 2.9.2 (Supplementary Foods)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 1.3.1 허용 첨가물·영양 성분 목록 준수 필수. 레귀메이션·미세조류 등 신규 식물성 단백질은 Novel Food 사전 허가 필요. 알룰로스 함유 제품 현재 미허가 상태.', originalRequirement: 'Must comply with Standard 1.3.1 permitted food additives and nutritive substances list. Novel plant proteins (e.g. legumins, microalgae) require prior Novel Food authorisation. Allulose-containing products currently not permitted for sale in Australia.', advisory: '식물성 대체단백·기능성 성분 Novel Food 해당 여부 사전 확인 필수. 알룰로스 함유 식물성 제품 호주 수출 시 현재 미허가 상태.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.3.1 — 식물성 식품 허용 첨가물·강화 성분', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '완두단백·대두단백 기반 제품 허용 첨가물 목록 준수. 철·칼슘·비타민B12 영양강화 허용 한도 준수. Standard 1.3.1 목록 외 사용 금지.', originalRequirement: 'Pea and soy protein-based products must comply with FSANZ Standard 1.3.1 permitted food additives. Iron, calcium and vitamin B12 fortification permitted within specified limits. Additives outside the permitted list are prohibited.', advisory: '영양강화 성분 허용 한도 FSANZ 목록 사전 확인. 목록 외 강화 성분 사용 시 Novel Food 또는 별도 허가 필요. 비타민B12 식물성 제품 영양강화 시 한도 준수.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.1.1 Novel Food — 신규 식물성 단백질 심사', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '미세조류(스피루리나 일부 제외)·곤충 단백 등 Novel Food 사전 신청 필수. 호주·뉴질랜드 공동 심사. 허가 전 판매 불가.', originalRequirement: 'Microalgae (except some spirulina) and insect proteins require Novel Food application. Joint Australia-New Zealand assessment. Sale prohibited prior to approval.', advisory: '신규 식물성 단백 원료 Novel Food 해당 여부 FSANZ 사전 확인 필수. 허가 기간 1~3년 소요 가능. 허가 전 출시 시 전량 회수·법적 제재.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'DAFF Biosecurity — 식물성 식품 원료 식물검역', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '두류·견과류 원료 DAFF 식물검역 증명서 필수. 일부 품목 검역 처리(열처리·훈증) 요구 가능. BICON 시스템 사전 확인.', originalRequirement: 'DAFF phytosanitary certificate mandatory for legume and nut raw materials. Some products may require quarantine treatment (heat or fumigation). Import conditions must be verified in DAFF BICON.', advisory: '두류·견과류 원료 BICON 조회 필수. 검역 처리 요건 미충족 시 전량 반송. 가공 식물성 식품도 원료 성분별 BICON 확인 권장.', enforcementDate: '시행 중' },
        {
          country: 'Australia (FSANZ)',
          flag: '🇦🇺',
          enforcementDate: '2026.02.25',
          law: 'Food Standards Code Standard 1.2.3 PEAL (Plain English Allergen Labelling)',
          lawUrl: 'https://www.foodstandards.gov.au/',
          requirement: '⚠️ [즉시 시행] 대두(Soy/Soybean) 알레르겐 개별 표기 의무. "Tree nuts" 일괄 표기 불허 → 아몬드·캐슈·호두·피스타치오 등 개별 명시. "Seafood" 불허 → Fish/Crustacean/Mollusc 개별 구분. Schedule 9 기준 개별 알레르겐 명칭 전환 의무.',
          advisory: '⚠️ 2026.02.25 이미 시행. "Tree nuts"·"Seafood" 일괄 표기 즉시 비적합. Schedule 9 기준 개별 알레르겐 명칭으로 전환 필수. 뉴질랜드 동일 적용.',
          urgency: '긴급',
        },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO 1694:2009 / UAE.S 2055 / GSO 2233:2012 (GMO 표시)', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 허용 첨가물 목록 준수. 식물성 단백질 제품 아랍어 전 성분 의무 표기. 동물성 유래 가공보조제 포함 시 ECAS/ESMA 승인 할랄 인증 필수. GMO 성분 함유 시 GSO 2233:2012 기준 아랍어 GMO 표시 의무.', advisory: '식물성 제품이라도 젤라틴·카르민 등 동물성 가공보조제 사용 시 할랄 인증 취득 필수. 에탄올 추출 성분 사용 불가(할랄 저해). GMO 원료 공급업체 성적서 사전 확보.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 021/2011 (식품안전) / TR TS 022/2011 (표시) / TR TS 029/2012 (첨가물)', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 029/2012 허용 목록 외 첨가물 사용 금지. GMO 성분 0.9% 초과 시 TR TS 022/2011 §4.5 러시아어 GMO 표시 의무. 러시아어 전 성분·영양성분 의무 표기.', advisory: 'EAEU 첨가물 허용 목록(TR TS 029/2012)이 EU와 다름 — 허용 여부 교차 확인 필수. E171(이산화티타늄) EAEU에서 허용(EU 2022 금지와 상이). GMO 이력서 공급망별 확보.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W', lawUrl: 'https://www.cfs.gov.hk/', requirement: '식물성 식품 Pre-market approval 불필요. 영양성분 표시 의무. 영어·번체 중국어 병기 필수. GMO 성분 함유 시 표시 의무("基因改造"). 대두 알레르겐 의무 표시.', originalRequirement: 'No pre-market approval for plant-based foods. Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese required. GMO ingredient must be declared ("基因改造"). Soy allergen mandatory declaration.', advisory: '홍콩은 중국 본토와 별개 규제 — 간체자 불인정, 번체자(Traditional Chinese) 필수. GMO 표시 기준 홍콩 독자 적용. 식물성 음료류 영양성분 표시 의무 항목 CFS 가이드라인 확인.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 식물성 대체육 영양표시 (단백질·나트륨·포화지방)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '식물성 고기류(plant-based meat) 단백질·나트륨·포화지방 영양성분 의무 표시. 소비자 오인 방지를 위한 제품명 표기 가이드라인 준수. 영어·번체자 병기 필수.', originalRequirement: 'Plant-based meat products must declare protein, sodium, and saturated fat as mandatory Nutrition Information. Product naming guidelines to prevent consumer confusion. Bilingual English/Traditional Chinese mandatory.', advisory: '식물성 고기류 단백질 함량 과장 표시 CFS 점검 대상. 나트륨 함량 높은 제품 경고 표시 권장. 제품명에 "meat" 사용 시 CFS 가이드라인 준수 필요.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — GMO 식물성 식품 표시 (자발적)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '홍콩: 식품 라벨 규정상 GMO 표시 법적 의무 없음(중국 본토와 달리). 자발적 GMO/Non-GMO 표시 시 사실 기반 기재 의무. 허위 GMO 표시 Cap 132W 위반.', originalRequirement: 'Hong Kong: No mandatory GMO labelling under food regulations (unlike Mainland China). Voluntary GMO/Non-GMO declarations must be factually accurate. False GMO labelling constitutes Cap 132W violation.', advisory: 'Non-GMO 강조 마케팅 시 근거 서류(IP 관리 기록) 보관 권장. 홍콩 GMO 표시는 자발적이나 허위 표시 규제는 엄격. 중국 본토 GMO 의무 규정과 혼동 주의.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 612 — 식물성 식품 수입 기록 보관 의무', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수입업체 공급망 추적 기록 3개월 보관 의무(Cap 612). 배달 기록·거래 명세서·원산지 증명서 포함. Cap 612 위반 시 벌금 및 영업정지.', originalRequirement: 'Importers must maintain food supply chain traceability records for 3 months (Cap 612). Includes delivery records, transaction statements, and certificates of origin. Cap 612 violations result in fines and business suspension.', advisory: '수입 기록 3개월 보관 의무 — 전자 기록도 허용. CFS 불시 점검 시 즉시 제출 필요. 공급업체 변경 시 기록 연속성 유지 필요.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Food Safety Act 1990 / UK Retained Regulation (EU) 2015/2283 (Novel Food)', lawUrl: 'https://www.food.gov.uk/', requirement: 'Novel 식물성 단백질(미세조류·레귀메이션 등): UK Novel Food 별도 승인 필요. "Milk" 명칭 사용 제한(UK retained ECJ 판례 적용). UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. GMO 표시 UK Retained GMO Regulation 준수.', originalRequirement: 'Novel plant proteins (e.g. microalgae, legumins): separate UK Novel Food authorisation required. "Milk" naming restriction applies (UK retained ECJ ruling). Must comply with UK Retained Food Additives Regulation. English-only labelling required. GMO labelling per UK Retained GMO Regulation.', advisory: 'EU Novel Food 허가가 Brexit 이후 UK에 자동 적용 안 됨 — UK 별도 신청 필수. 식물성 유제품 "milk" 명칭 사용 금지 규정 유효. UK FSA 신규 성분 허가 목록 정기 모니터링 권장.', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: '[UK Retained EU Law] UK Novel Food Regulation (Retained EU Law 2015/2283) + FSA Novel Food Authorisation + GB Organic Regulation (SI 2022/634)', lawUrl: 'https://www.food.gov.uk/', requirement: '[Post-Brexit Divergence] UK FSA 독자 Novel Food 승인 절차 — EU Novel Food 승인과 별개. 2021년 이후 EU에서 승인된 Novel Food는 영국 별도 재승인 없이는 GB 시장 판매 불가. 식물성 대체 단백질(공충단백·조류단백·정밀발효 유래 단백질) FSA 별도 승인 신청 필요. GB Organic Regulation — 유기농 식물성 식품 영국 승인 Certification Body(Soil Association·OF&G 등) 인증 의무(EU 유기인증 직접 불인정).', advisory: '[GB·NI 이중 기준] EU Novel Food 승인 품목 영국 동시 신청 필수 — 별도 데이터 패키지 제출. FSA 심사 최대 12인18개월. Northern Ireland는 EU 단일시장 규정 적용(EU 승인으로 NI 판매 가능·GB 불가) — 동일 제품 GB·NI 이중 라벨 전략 검토 필수. UK Precision Fermentation 식품 FSA 2024 가이드라인 확인 권장.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Lebensmittelgesetz (LMG) / Verordnung über neuartige Lebensmittel (VNL)', lawUrl: 'https://www.blv.admin.ch/', requirement: '신규 식물성 단백질: VNL(Novel Food Ordinance) 사전 허가 필요. EU Novel Food 허가 성분은 MRA로 일반적 인정. 독어·불어·이탈리아어 중 1개 이상 라벨 의무. 유기농 식물성 제품 Bio Suisse 인증 별도 필요.', originalRequirement: 'Novel plant proteins require prior authorisation under VNL. EU Novel Food-authorised ingredients generally accepted via MRA. Labelling in at least one Swiss national language mandatory. Organic plant-based products require Bio Suisse certification.', advisory: 'EU와 MRA 활용 가능하나 스위스 독자 VNL 목록 교차 확인 필수. 유기농 표시는 Bio Suisse 인증 없이 사용 불가 — EU 유기농 인증과 별개. 스위스 GMO 규제(임시 유예 연장 중) 최신 상황 확인.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'LMV SR 817.022.16 — Verordnung des EDI über Lebensmittel pflanzlicher Herkunft, Pilze und Speisesalz + Bio-Verordnung SR 910.18 + LGV SR 817.021.8 (GMO)', lawUrl: 'https://www.lebensmittelinformationen.ch/', requirement: '[CH-Specific Standard] LMV Kap. 26 — 식물성 식품(두류·견과류·씨았류·식물성 음료) 스위스 독자 성분 기준. "Soja-Drink"(두유) 명칭: CH에서 "Milch(우유)" 명칭 사용 금지(LMV §27). 식물성 대체 단백질 원료 — FSVO Novel Food 목록(LMV Anhang 1) 사전 확인. 유기 식물성 식품 — Bio-Verordnung SR 910.18 + CH 승인 기관(bio.inspecta·IMO) 인증. GMO 성분 0.9% 초과 시 GMO 표시 의무(LGV).', advisory: '[EU EEA 비가입 특이사항] EU Reg 2015/2283 Novel Food 승인 품목도 CH 별도 신청 필요. CH-EU FTA(1999) 농산물 부속서 하에 일부 EU 유기인증 상호 인정. 두류·식물성 음료 CH Leitssätze für pflanzliche Alternativprodukte 추가 검토 권장. 4개 공용어(독·프·이·로마슈) 표시 — 최소 3개 언어 의무.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EU) 2015/2283 + [Local] Loi Egalim 2018 / Nutri-Score Arrêté 2017', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] 식물성 음료(두유·귀리음료 등): "lait(우유)" 명칭 사용 금지(EU 공통 규정 + 프랑스 엄격 집행). Nutri-Score 표시 의무. 식물성 단백질 성분 출처 표시 프랑스 독자 강화 기준 적용. 광고 표현 Loi Egalim 규제 준수.', originalRequirement: '[Strict Local Rule] Plant-based beverages (soy, oat milk): use of "lait (milk)" prohibited (EU common rule + strict French enforcement). Nutri-Score labelling mandatory. Stricter French national requirements for plant protein source labelling. Advertising wording must comply with Loi Egalim restrictions.', advisory: '[EU Deviation] 식물성 음료 제품명에 유제품 연상 표현 전면 불허 — 프랑스 DGCCRF 적극 집행 중. Nutri-Score 점수 A 또는 B 달성 포뮬레이션 권장. 프랑스 독자 기준 EU 공통 기준 병행 준수 필수.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[HU] NETA 2011 / [FI] Soft Drink Tax Act / [SE] Livsmedelsverket 성분 권고', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 식물성 가당 음료·에너지드링크 건강세 적용. 핀란드 가당음료세: 식물성 음료 포함 적용 여부 확인(당류 함량 기준). 스웨덴 Livsmedelsverket: 영양 프로파일 권고 기준 강화. Nutri-Score 적용 국가별 의무·자율 상이.', originalRequirement: '[EU Divergence] Hungary NETA: health tax applicable to sweetened plant-based beverages and energy drinks. Finland soft drink tax: verify applicability to plant-based drinks (based on sugar content). Sweden Livsmedelsverket: stricter nutritional profiling recommendations. Nutri-Score mandatory/voluntary by country.', advisory: '식물성 음료 수출 시 헝가리·핀란드 당류 세금 부과 여부 사전 확인. 저당 설계로 추가 세부담 회피 가능. Nutri-Score 국가별 의무 상이 — 프랑스 수출 시 의무, 기타 북유럽은 자율 권장.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 1829/2003 (GMO) / Reg (EU) 1169/2011 FIC + [Local] LFGB §11 / BVL 식물성 단백질 명칭 가이드라인', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Local Rule] LFGB §11 — 소비자 오인 유발 명칭 금지. 독일어로 “Fleisch(육류)·Steak·Schnitzel” 등 육류 연상 명칭 — 식물성 대체육 사용 시 BVL 가이드라인 준수 필요. GMO 성분 0.9% 초과 시 독일어 GMO 표시 의무. Nutri-Score 자율 표시 — 독일 시장 체택률 높음(의무 아니나 경쟁력 요소).', advisory: '[독일 특이사항] 식물성 대체육 제품명 — “Veggie-Schnitzel” 등은 허용, 단순 “Schnitzel”은 LFGB §11 위반 소지. 독일 식품법위원회(DLG) Leitsätze 가이드라인 사전 검토 권장. Nutri-Score 미표시 시 독일 소매 체널(REWE·EDEKA) 낙품 어려움 증가.' },
    ],
  },
  grains: {
    title: 'Grains & Cereals — Global Regulations',
    icon: Wheat,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 제2. 식품의 기준 및 규격 — 곡류 / 전분류', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '수분 기준: 백미 15.5% 이하. 곰팡이독소(아플라톡신 B1 10 μg/kg↓, 총 15 μg/kg↓). 잔류농약: 식품공전 농약잔류허용기준 준수.', originalRequirement: 'Moisture: White rice ≤15.5%. Mycotoxins: Aflatoxin B1 ≤10 μg/kg, total ≤15 μg/kg. Pesticide residues: per Korean Food Code MRL table.', advisory: 'Aflatoxin 초과 사례 증가 추세. 원재료 입고 시 곰팡이독소 검사 성적서 수취 권장.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: 'PLS 제도 — 농약허용물질목록관리제도', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '등록 농약: 개별 MRL(최대잔류허용기준) 준수. 미등록 농약: 일률 기준 0.01 mg/kg 적용. 2019년 전면 시행. 수입 곡물 잔류농약 성적서 검사 항목 국내 등록 농약 전체 대상.', advisory: '한국 미등록 농약이 수출국에서 허용된 경우라도 0.01 mg/kg 적용 — 수출 전 반드시 확인. PLS 항목 리스트 식약처 홈페이지 주기적 업데이트.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 곰팡이독소 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '아플라톡신 B1 ≤10 μg/kg(총 ≤15 μg/kg). 데옥시니발레놀(DON) ≤1,000 μg/kg(밀·보리). 제아랄레논(ZEA) ≤200 μg/kg. 오크라톡신A(OTA) ≤5 μg/kg. 푸모니신(B1+B2) ≤2,000 μg/kg(옥수수).', advisory: '아플라톡신 초과 수입 곡물 적발 증가 — 원료 입고 시 성적서 필수. 아프리카·중남미 원산 곡물 특히 주의.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '유전자변형식품 표시기준 — 곡류', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '옥수수·대두 등 GMO 곡물 사용 시 표시 의무. 비의도적 혼입 3% 초과 시 "유전자변형○○포함" 표시. 정제 후 DNA·단백질 미잔존 시 표시 면제(예: 포도당·과당·전분).', advisory: '가공 후 GMO 성분 잔존 여부 PCR 검사로 확인. 면제 품목 해당 여부 식약처 GMO 표시 가이드라인 확인 필수.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수입식품안전관리특별법 — 곡류 수입 검사', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '수입 곡류 사전신고 의무. 지정 정밀검사(잔류농약·곰팡이독소·중금속·미생물). 통관 전 부적합 시 반송 또는 폐기. 외국 제조업소 MFDS 등록 필요.', advisory: '통관 지연 최소화 위해 수입신고 서류 사전 완비 필수. 잔류농약·곰팡이독소 성적서 수출국 공인기관 발행본 구비.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품이력추적관리법 — 수입 곡물 이력 등록', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '수입 곡물 2톤 이상 시 이력추적관리 등록 의무. 이력번호(LOT No.) 표시·관리. 유통·판매 단계별 기록 보관 의무(3년). 소비자 이력 조회 시스템 연계.', advisory: '이력추적 등록 미이행 시 과태료 부과. 수입 곡물 원산지·생산지 정보 서류 보관 체계화 필요.', },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 137 — Cereal Flours and Related Products', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-137', requirement: '강화밀가루 성분 기준(티아민·리보플라빈·나이아신·철분 필수 강화). 전곡물 표시 기준은 FDA 가이던스 준수. 잔류농약 MRL은 EPA 설정.', originalRequirement: 'Standards of identity for enriched flour (thiamine, riboflavin, niacin, iron mandatory enrichment). Whole grain label criteria per FDA guidance. Pesticide MRLs set by EPA.', advisory: '영양 강화(Enrichment) 기준 충족 여부 라벨 검토 필수. 전곡물(Whole grain) 표시 시 FDA 정의 기준 확인.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 곡류 예방 통제 (HARPC)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '아플라톡신·DON(데옥시니발레놀)·훈증제(메틸브로마이드·인화알루미늄) 위해요소 분석 의무. 식품안전계획 수립·문서화. 공급업체 검증(FSVP) 병행.', originalRequirement: 'Hazard analysis for aflatoxin, DON, fumigants (methyl bromide, aluminium phosphide) required. Food Safety Plan documentation. Foreign supplier verification (FSVP) also required.', advisory: '곡물 아플라톡신 FDA 권고 한도: 20 μg/kg(인체용). DON 기준: 밀 1 ppm(완제품). 수입 곡물 공급업체 FSVP 프로그램 구비 필수. 훈증 처리 성적서(MB·PH3) 수입 신고 시 제출.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'EPA 40 CFR Part 180 — 곡류 잔류농약 허용 기준', lawUrl: 'https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-180', requirement: '밀 글리포세이트 ≤30 ppm. 옥수수 아트라진 ≤0.02 ppm. EPA Tolerance 목록 품목별 최신 확인 필수. Tolerance 미설정 성분은 불검출 기준 적용.', originalRequirement: 'Wheat: glyphosate ≤30 ppm. Corn: atrazine ≤0.02 ppm. EPA Tolerance database must be checked per pesticide-commodity. No established tolerance = zero tolerance.', advisory: 'EPA pesticide tolerance 데이터베이스(pesticides.epa.gov) 수출 전 최신 버전 확인. Tolerance 취소·변경 빈번 — 정기 모니터링 필수. 검출 시 FDA Import Alert 등록 위험.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA GIPSA / AMS — 곡물 등급 기준', lawUrl: 'https://www.ams.usda.gov/grades-standards/grain', requirement: '밀·옥수수·대두 Grade No.1~5 기준(수분·불순물·피해립·용적중). 수입 시 USDA 인증 검사관(Licensed Inspector) 검사 권장. 등급 미표시 허용이나 오표시 시 위반.', originalRequirement: 'Grade standards No.1–5 for wheat, corn, soybeans (moisture, foreign matter, damaged kernels, test weight). USDA Licensed Inspector inspection recommended for imports. Mislabelling of grade is a violation.', advisory: '가공 곡류(밀가루·전분) 등급 기준은 별도 21 CFR Part 137 적용. 원곡 등급과 가공품 성분 기준 혼동 주의. 미국 수입업체와 등급 기준 사전 협의 권장.' },
      { country: 'USA (FDA / USDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA AMS/FGIS — Federal Grain Inspection Service (7 USC §1621) + 7 CFR Part 800~870 (곳류 등급 기준) + USDA NOP 7 CFR Part 205 (유기 곳물)', lawUrl: 'https://www.ams.usda.gov/', requirement: '[USDA Jurisdiction — Grain Grading·Inspection] FGIS(연방곳류검사서비스) — 미국산 수출 곳류 공식 등급 검사(Official Inspection) 의무. 소맦·옥수수·대두·보리 등 수출 시 FGIS 공식 등급증명서 발급 필수(7 CFR 800~870 수분·단백질·테스트 웨이트·이물 기준). USDA AMS 유기 곳물 — NOP(7 CFR Part 205) 유기 인증 + 인증기관(CCOF·OEFFA 등) 인증 제품만 "Organic" 표시 가능. 수입 가공 곳류: FDA 21 CFR Part 137(밀가루·옥수수가루 제품 표준) 동시 준수.', advisory: '한국 → 미국 곳류가공식품 수출: FDA FSMA/HARPC 의무 이행 + USDA NOP(유기 표시 시) 병행. USDA AMS "Organic" 표시 — 한국 인증기관 NOP 동등성 인정 여부 확인(NOSB 승인 필요). 미국 내 "Whole Grain" 표시 — WGWC(통곳물협의회) 기준(통곳물 8g/serving 이상). FGIS 곳류 등급증명서 — 한국 수입상이 미국산 곳류 구매 시 요구 서류(수출국 의무 아님).' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 396/2005 — Pesticide MRLs / Commission Reg (EC) 1881/2006 — Contaminants', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '곡류(밀·보리·귀리) 통합 MRL 적용. 곰팡이독소: 아플라톡신 B1 2 μg/kg, 밀 DON 1,250 μg/kg. 모니터링 의무.', originalRequirement: 'Harmonised MRLs for cereals (wheat, barley, oats). Mycotoxin limits: Aflatoxin B1 2 μg/kg, DON 1,250 μg/kg for wheat. Monitoring mandatory.', advisory: 'EU MRL이 한국 기준보다 엄격한 경우 많음. 수출 전 EU MRL 데이터베이스(EFSA Pesticides) 교차 확인 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 828/2014 — 글루텐 표시 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014R0828', requirement: '"Gluten-free" 표시: 글루텐 ≤20 mg/kg. "Very Low Gluten" 표시: ≤100 mg/kg (귀리 기반 제품 포함). 귀리 순수성(Purity Oats) 별도 관리 기준. 무글루텐 제품 교차오염 방지 의무.', originalRequirement: '"Gluten-free" label: ≤20 mg/kg gluten. "Very Low Gluten": ≤100 mg/kg (including oat-based). Purity oats subject to separate management. Cross-contamination prevention mandatory for GF products.', advisory: '"글루텐 무함유" 표시 시 전 공정 교차오염 관리 기록 필수. 귀리 포함 GF 제품 시리얼 교차 모니터링 강화. EU GF 제품 전용 생산라인 또는 검증된 청소 절차 요구.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1881/2006 Annex — 오크라독신 A (OTA) 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1881', requirement: '미가공 시리얼 곡류 OTA ≤5 μg/kg. 가공 시리얼 제품 ≤3 μg/kg. 건포도·건과류 포함 제품 별도 기준. 정기 모니터링 의무.', originalRequirement: 'Unprocessed cereal grains: OTA ≤5 μg/kg. Processed cereal products: ≤3 μg/kg. Dried fruit-containing products have separate limits. Regular monitoring required.', advisory: 'OTA 오염 주요 원인: 수확 후 부적절한 건조·보관. 수출 전 EU 공인기관 OTA 분석 성적서 확보 필수. 아플라톡신 B1(≤2 μg/kg)과 병행 검사 권장.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 2073/2005 — 곡류 가공식품 미생물 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R2073', requirement: '즉석섭취(RTE) 시리얼 살모넬라: n=5, c=0 (25g 모두 불검출). 비즉석섭취 시리얼 살모넬라: n=5, c=1 (5개 중 1개까지 허용). 기타 위생 지표균 자체 관리 의무.', originalRequirement: 'RTE cereal products: Salmonella n=5, c=0 (absent/25g all). Non-RTE cereal products: n=5, c=1. Hygiene indicators managed through self-monitoring.', advisory: '수출용 RTE 시리얼 살모넬라 불검출 확인 필수. 미생물 기준 초과 시 RASFF 등록·EU 전역 회수. 자체 모니터링 기록 EU 수입업체 요청 시 제공 의무.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '農薬残留規制 ポジティブリスト制度 (Positive List)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '목록 외 농약은 기본 0.01 ppm 적용. 소맥: Glyphosate 30 ppm. 현미: Cadmium 0.4 mg/kg. 2026.04.01 CAA 이관.', originalRequirement: 'Unregistered pesticides: uniform limit 0.01 ppm. Wheat: Glyphosate 30 ppm. Brown rice: Cadmium 0.4 mg/kg. Admin transferred to CAA from 2026.04.01.', advisory: 'Positive List 외 성분 검출 시 전량 수입금지. 잔류농약 검사 성적서 항목 목록 주기적 업데이트 필요.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '곰팡이독소 기준 — 食品衛生法 告示', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/index.html', requirement: '아플라톡신 ≤10 μg/kg(玄米·精米). DON(데옥시니발레놀) ≤1,100 μg/kg(소맥). ZEA(제아라레논) ≤200 μg/kg(소맥). 후모니신 ≤1,000 μg/kg(옥수수). 오크라톡신A ≤10 μg/kg(볶은 커피).', originalRequirement: 'アフラトキシン≤10 μg/kg（玄米・精米）。DON（デオキシニバレノール）≤1,100 μg/kg（小麦）。ZEA（ゼアラレノン）≤200 μg/kg（小麦）。フモニシン≤1,000 μg/kg（とうもろこし）。オクラトキシンA≤10 μg/kg（焙煎コーヒー）。', advisory: '소맥 DON 1,100 μg/kg — EU(1,250 μg/kg)보다 엄격. 현미 아플라톡신 10 μg/kg 수입 정밀검사 우선 대상. 옥수수 후모니신 성적서 필수.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '수입 곡물 검사 절차 — 検疫所 정밀검사', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '수입신고(輸入届出) → 検疫所 서류검사 → 지정기관 정밀검사(잔류농약·곰팡이독소). 부적합 전량 반송 또는 폐기. 강화검사 지정 품목·원산지 목록 매년 갱신. 2026.04 CAA 이관.', originalRequirement: '輸入届出→検疫所による書類検査→指定機関での精密検査（残留農薬・カビ毒）。不適合は全量積み戻しまたは廃棄。強化検査指定品目・原産地は毎年更新。', advisory: '강화검사 지정 곡물 원산지 목록 CAA/MHLW 연간 계획 확인 필수. 소맥·현미 아플라톡신 초과 시 전량 반송. 공인 검사기관 성적서 통관 전 제출.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 곡물 원산지 표시 (2017 순차 확대)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '가공품 중 최대 원재료 원산지 표시 의무(2017~ 순차 확대). 小麦·米 원산지 표시 강화. 수입 원료 사용 가공품 "輸入" 또는 원산지국명 표시.', originalRequirement: '加工品の主要原料の原産地表示義務（2017年以降順次拡大）。小麦・米の原産地表示を強化。輸入原料使用加工品は「輸入」または原産地国名を表示。', advisory: '가공 곡물 제품 최대 원재료 원산지 미표시 시 법 위반. 小麦 원산지 표시 소비자 관심 높음 — 허위 표시 적발 강화. 수입 쌀 원산지 국가명 명확히 표시.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '放射性物質 기준 — 곡물 (食品衛生法)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/housyasen/index.html', requirement: '일반식품 방사성물질 ≤100 Bq/kg(Cs-134+137 합계). 영유아식품 ≤50 Bq/kg. 수입 곡물 생산지 증명서 요구. 국내산 쌀 전수 검사 체계 유지.', originalRequirement: '一般食品の放射性物質基準≤100 Bq/kg（Cs-134+137合計）。乳幼児用食品≤50 Bq/kg。輸入穀物は産地証明書が必要。', advisory: '동유럽 원산 곡물 생산지 증명서 요구 가능. 방사성물질 초과 시 전량 수입 금지. 영유아 이유식용 곡물 50 Bq/kg 이하 기준 엄격 적용.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: 'JAS 有機 인증 — 유기 곡물 표시', lawUrl: 'https://www.maff.go.jp/j/jas/jas_kikaku/organic.html', requirement: '유기 곡물 표시 시 JAS 유기 인증 필수. 합성농약·화학비료 3년 이상 미사용 토지 조건. 인증기관 심사 후 유기JAS 마크 사용 허가. 수입 유기 곡물 동등성 협정국 인증 인정.', originalRequirement: '有機穀物の表示にはJAS有機認証が必要。合成農薬・化学肥料を3年以上使用しない土地が条件。認証機関による審査後、有機JASマークの使用が許可される。輸入有機穀物は同等性協定国の認証を承認。', advisory: 'JAS 유기 인증 없이 "유기" 표시 금지. 수입 유기 곡물 동등성 협정국(미국·EU·캐나다 등) 인증서로 대체 가능. 인증 갱신 주기(1년) 확인 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.11.26', law: 'TFDA 殘留農藥 기준 (2025.11.26 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '곡류 잔류농약 기준 전면 개정 시행(2025.11.26). 수입 곡류 검사 강화. 성분표 및 원산지 표시 의무.', originalRequirement: 'Pesticide MRL standards for cereals comprehensively revised (effective 2025.11.26). Strengthened import inspection. Mandatory ingredient list and origin labelling.', advisory: '개정 MRL로 일부 항목 기준 강화. 기존 검사 성적서 재검토 및 최신 기준값 적용 확인 필수.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品中污染物質及毒素衛生標準 — 곰팡이독소 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '아플라톡신 B1+B2+G1+G2 ≤10 μg/kg(곡류·옥수수·땅콩). DON ≤1,750 μg/kg(소맥 및 제품). ZEA ≤200 μg/kg. 오크라톡신A ≤3 μg/kg(곡류). 훈증처리제 기준 준수.', originalRequirement: '黃麴毒素B1+B2+G1+G2≤10 μg/kg（穀類、玉米、花生）。嘔吐毒素DON≤1,750 μg/kg（小麥及其製品）。玉米烯酮ZEA≤200 μg/kg。赭麴毒素A≤3 μg/kg（穀類）。', advisory: '아플라톡신 초과 시 전량 폐기. DON·ZEA 소맥류 정기 모니터링. 수입 곡물 곰팡이독소 검사 성적서 통관 전 제출 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品添加物使用範圍及限量 — 곡류 가공 첨가물', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '프로피온산(방부제) ≤2.5 g/kg(빵·곡류 가공품). 아황산염(漂白劑) 사용 기준 품목 한정. 허용 외 첨가물 사용 금지. 건조 곡물 방사선 조사 처리 표시 의무.', originalRequirement: '丙酸（防腐劑）≤2.5 g/kg（麵包、穀類加工品）。亞硫酸鹽（漂白劑）限用品目。未許可添加物禁用。穀物輻照處理須標示。', advisory: '아황산염 사용 금지 품목(일부 곡류) 사전 확인. 방사선 조사 곡물 "輻照處理" 표시 의무. 허용 첨가물 목록 최신화 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 곡류 원산지·GMO 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '원산지(原產地) 의무 표시. GMO 곡물(대두·옥수수·카놀라 등) >3% 함유 시 GMO 표시 의무. Non-GMO 강조 표시 시 IP 핸들링 검증 필요.', originalRequirement: '須強制標示原產地。GMO穀物（大豆、玉米、油菜等）含有率>3%須標示基因改造。非基改強調標示須IP管理驗證。', advisory: 'GMO 곡물 표시 오류 시 TFDA 행정처분. Non-GMO IP 문서 공인기관 검증. 원산지 표시 미이행 시 과태료.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品中污染物質 — 방사성물질 기준 (곡류)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 곡류 방사성물질: Cs-134+137 ≤100 Bq/kg(일반식품). 영유아식품 ≤50 Bq/kg. 일본산 수입 식품 생산지 증명서 요구. 요오드-131 ≤100 Bq/kg.', originalRequirement: '進口穀類放射性物質：Cs-134+137≤100 Bq/kg（一般食品）。嬰幼兒食品≤50 Bq/kg。日本産進口食品需提供產地證明書。碘-131≤100 Bq/kg。', advisory: '일본산 곡류 방사능 검사 성적서 + 생산지 증명서 필수. 영유아 이유식용 곡물 50 Bq/kg 기준 엄격 적용. 기준 초과 시 수입 즉시 거부.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Food Act B.E. 2522 / MOPH — 곡류 위생기준·아플라톡신', lawUrl: 'https://food.fda.moph.go.th/', requirement: '아플라톡신 총량 ≤20 ppb(일반 기준). 태국 자체 수출품 ≤4 ppb(품질 강화). 곡류 위생기준 위반 시 폐기 명령. 수입 곡물 MOPH 기준 적합 성적서 요구.', originalRequirement: 'อะฟลาทอกซินรวม≤20 ppb（มาตรฐานทั่วไป）ธัญพืชส่งออก≤4 ppb（มาตรฐานคุณภาพ）ฝ่าฝืนมาตรฐานสุขาภิบาลธัญพืชมีคำสั่งทำลาย ต้องมีผลการทดสอบความสอดคล้องกับมาตรฐาน MOPH', advisory: '아플라톡신 검사 성적서 공인기관 발급본 제출. 수출 곡물 4 ppb 자체 품질 기준 충족 권장. MOPH 기준 미충족 시 전량 폐기.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH — 잔류농약 기준 (Codex 준용, 곡류)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '곡류 잔류농약 Codex MRL 기준 준용. MOPH 고시 개별 기준 우선 적용. Chlorpyrifos ≤0.01 mg/kg. 목록 외 농약 Codex MRL 또는 0.01 mg/kg 일률.', originalRequirement: 'ธัญพืชใช้ค่า MRL ตาม Codex มาตรฐาน MOPH ประกาศเฉพาะใช้ก่อน คลอร์ไพริฟอส≤0.01 mg/kg สารที่ไม่ได้ระบุใช้ Codex MRL หรือ 0.01 mg/kg', advisory: 'Codex MRL 기준 정기 업데이트 확인. MOPH 특별 고시 농약 우선순위 적용. 잔류농약 검사 성적서 품목별 기준 대조 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH Notification No. 393 — GMO 곡물 표시 (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: 'GMO 성분 함유율 >5% 태국어 표시 의무. GMO 옥수수·쌀·카놀라·대두 주요 대상. Non-GMO 강조 표시 시 검증 필요. 미승인 GMO 작물 수입 금지.', originalRequirement: 'อาหารที่มี GMO>5% ต้องระบุเป็นภาษาไทย ข้าวโพด ข้าว คาโนล่า ถั่วเหลือง GMO เป็นกลุ่มหลัก Non-GMO ต้องผ่านการตรวจสอบ ห้ามนำเข้า GMO ที่ไม่ได้รับอนุญาต', advisory: 'GMO 표시 기준 TW(>3%)보다 완화된 >5%. Non-GMO IP 문서 공인기관 검증. 미승인 GMO 곡물 수입 시 전량 폐기.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Thai FDA eSubmission — 수입 곡물·가공 곡류 신고', lawUrl: 'https://food.fda.moph.go.th/', requirement: '가공 곡류 제품 Thai FDA eSubmission 라벨 사전 심사. 수입신고 의무. 아플라톡신·잔류농약 샘플 검사. 위험등급별 검사비율 적용. 태국어 라벨 의무.', originalRequirement: 'ผลิตภัณฑ์ธัญพืชแปรรูปต้องผ่าน eSubmission ของ อย. แจ้งนำเข้าบังคับ ตรวจอะฟลาทอกซินและยาฆ่าแมลงตามตัวอย่าง ฉลากภาษาไทยบังคับ', advisory: 'eSubmission 라벨 심사 미완료 시 통관 불가. 아플라톡신 위험 국가산 100% 검사 대상 가능. 태국어 스티커 라벨 사전 제작 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2761-2017 — 食品中真菌毒素限量 (곡류)', lawUrl: 'https://www.samr.gov.cn/', requirement: '아플라톡신 B1 ≤5 μg/kg(곡물·두류). DON(데옥시니발레놀) ≤1,000 μg/kg(밀·밀가루). ZEA(제아랄레논) ≤60 μg/kg(밀·밀가루). 푸모니신(B1+B2) ≤5,000 μg/kg(옥수수). 오크라톡신 A ≤5 μg/kg(곡류).', originalRequirement: '黄曲霉毒素B1≤5μg/kg（谷物·豆类）。脱氧雪腐镰刀菌烯醇≤1,000μg/kg（小麦、小麦粉）。玉米赤霉烯酮≤60μg/kg（小麦、小麦粉）。伏马毒素B1+B2≤5,000μg/kg（玉米）。赭曲霉毒素A≤5μg/kg（谷物）。', advisory: '곰팡이독소 다항목 기준 병행 적용 — 밀 DON 1,000 μg/kg, ZEA 60 μg/kg 동시 확인. 공인기관 성적서 로트별 구비 권장. 아플라톡신 기준 EU(2 μg/kg)보다 완화이나 필수 준수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2762-2025 — 食品中污染物限量 (곡류 중금속, 2026.09.02 의무)', lawUrl: 'https://www.samr.gov.cn/', requirement: '쌀 카드뮴(Cd) ≤0.2 mg/kg. 납(Pb) ≤0.2 mg/kg(곡류). 수은(Hg) ≤0.02 mg/kg. 총 비소(As) ≤0.5 mg/kg(곡류). 무기 비소(inorganic As) ≤0.2 mg/kg(쌀류). 방사성물질 세슘-137 ≤100 Bq/kg.', originalRequirement: '大米镉（Cd）≤0.2 mg/kg。铅（Pb）≤0.2 mg/kg（谷物）。汞（Hg）≤0.02 mg/kg。总砷（As）≤0.5 mg/kg（谷物）。无机砷≤0.2 mg/kg（米类）。放射性铯-137≤100 Bq/kg。', advisory: '쌀 무기비소 0.2 mg/kg 기준 엄격 — 산지 토양 비소 모니터링 필수. 방사성물질 원산지별 성적서 요구 가능(일본 등). 중금속 성적서 수출 전 GB 2762 기준 대조.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2763-2021 — 食品中农药最大残留限量 (곡류)', lawUrl: 'https://www.samr.gov.cn/', requirement: '쌀 농약 MRL GB 2763 적용. 클로르피리포스 ≤0.1 mg/kg(쌀). 피리메타닐 ≤0.05 mg/kg(밀). 글리포세이트 ≤1 mg/kg(밀). 목록 외 농약 0.01 mg/kg 일률기준 적용.', originalRequirement: '大米农药MRL适用GB 2763。毒死蜱≤0.1 mg/kg（大米）。嘧霉胺≤0.05 mg/kg（小麦）。草甘膦≤1 mg/kg（小麦）。目录外农药0.01 mg/kg一律基准。', advisory: 'GB 2763 기준 EU와 일부 차이. 수출 원료 농약 사용 이력 확인 후 GB 2763 대조 필수. 글리포세이트 1 mg/kg 기준(밀) 준수 여부 성적서 확인.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: '基因改造食品标识办法 — GMO 곡물 (옥수수·대두·면화)', lawUrl: 'https://www.samr.gov.cn/', requirement: 'GMO 옥수수·대두·면화씨(棉籽)·카놀라·쌀 함량 관계없이 전 성분 GMO 표시 의무. 수입 원료에 GMO 성분 포함 시 가공 제품도 표시 의무. Non-GMO IP 관리 문서 공인기관 검증 필요.', originalRequirement: 'GMO玉米、大豆、棉籽、油菜、水稻，无论含量多少，均须强制标识。进口原料含GMO成分时，加工产品也须标识。Non-GMO IP管理文件须经认可机构验证。', advisory: 'GMO 함량 역치 없음 — 미량이라도 GMO 원료 사용 시 표시 의무. Non-GMO 표시를 원할 경우 IP 인증 문서 구비. EU(0.9%) · 한국(3%)과 달리 역치 없음 주의.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 进口商备案 + ePort — 수입 곡물·가공 곡류', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 곡물 취급 기업 GACC 备案 등록 의무. ePort 시스템 수입 신고. 식물검역 증명서 필수. 선적 전 GACC 샘플 검사 가능. 적재항 위생증명서·곰팡이독소 성적서 함께 제출.', originalRequirement: '进口粮食经营企业须向GACC备案。须通过ePort系统申报进口。植物检疫证书必须提供。出口前GACC可能抽样检查。须同时提交装载港卫生证明和霉菌毒素检验报告。', advisory: 'GACC 미등록 업체 곡물 수입 불가. 선적 전 GACC 샘플 검사 대비 충분한 통관 일정 확보. 곰팡이독소 성적서 미첨부 시 검역 강화 적용.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 곡류·글루텐 함유 성분 알레르겐 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-1:2011/BYT — 곡류 곰팡이독소 기준', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '아플라톡신 B1 ≤5 ppb(μg/kg). 총 아플라톡신(B1+B2+G1+G2) ≤10 ppb. DON ≤1,000 μg/kg(밀류). ZEA ≤60 μg/kg(옥수수·밀). 오크라톡신 A ≤5 μg/kg. 로트별 공인기관 성적서 필수.', originalRequirement: 'Aflatoxin B1≤5ppb. Tổng aflatoxin≤10ppb. DON≤1,000μg/kg (lúa mì). ZEA≤60μg/kg (ngô, lúa mì). Ochratoxin A≤5μg/kg. Giấy chứng nhận phòng thí nghiệm được công nhận theo từng lô.', advisory: '곰팡이독소 다항목 동시 확인 필수. 공인기관(ILAC/APLAC 인정) 성적서 자기선언 첨부. 아플라톡신 위험 원산지 원료 로트별 검사 강화.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 36/2018/TT-BNNPTNT — 잔류농약 MRL (곡류)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '곡류 잔류농약 Codex MRL 준용. 클로르피리포스 ≤0.1 mg/kg(쌀). 글리포세이트 ≤1 mg/kg(밀). 목록 외 농약 Codex MRL 또는 0.01 mg/kg 일률. MOPH 특별 기준 우선 적용.', originalRequirement: 'Ngũ cốc tuân thủ MRL Codex. Chlorpyrifos≤0.1 mg/kg (gạo). Glyphosate≤1 mg/kg (lúa mì). Thuốc không có trong danh sách: Codex MRL hoặc 0.01 mg/kg. Tiêu chuẩn MOPH đặc biệt ưu tiên áp dụng.', advisory: 'Codex MRL 준용 — 수출 원료 농약 사용 이력 Codex 기준 대조 필수. 글리포세이트 검사 성적서 구비 권장. Circular 36 최신 버전 확인.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP (舊 Decree 15 대체) — 가공 곡류 정부 심사 수입신고', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '가공 곡류(밀가루·시리얼·면류 등) Decree 15 자기선언(Tự công bố) 의무. 성분 적합성 서류(곰팡이독소·잔류농약 성적서) 첨부. 원산지 증명서(C/O). 신선 곡물은 DOA 식물검역 적용.', originalRequirement: 'Ngũ cốc chế biến (bột mì, ngũ cốc, mì) bắt buộc Tự công bố theo Decree 15. Kèm tài liệu chứng minh phù hợp (báo cáo độc tố nấm mốc và thuốc trừ sâu). Giấy chứng nhận xuất xứ (C/O). Ngũ cốc tươi áp dụng kiểm dịch DOA.', advisory: '신선 곡물(원곡)과 가공 곡류 통관 절차 구분 필수. 자기선언 서류 불완전 시 통관 지연. 곰팡이독소 성적서 QCVN 8-1 기준 대조 확인.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — GMO 곡물 표시·베트남어 라벨', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: 'GMO 곡류 가공품 베트남어 GMO 표시. 원산지 베트남어 표기. 유통기한 DD/MM/YYYY. 영양성분표(탄수화물·단백질·지방) 베트남어 의무. Non-GMO 표시 시 증명서 필요.', originalRequirement: 'Nhãn GMO tiếng Việt bắt buộc đối với ngũ cốc biến đổi gen chế biến. Xuất xứ bằng tiếng Việt. Hạn sử dụng DD/MM/YYYY. Bảng dinh dưỡng (carbohydrate, protein, chất béo) bằng tiếng Việt bắt buộc. Non-GMO cần chứng nhận.', advisory: 'GMO 표시 의무 이행 후 자기선언 서류 동시 제출. Non-GMO 표시 무허가 사용 금지. 베트남어 라벨 미부착 시 통관 불가.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Badan Karantina Pertanian (BKP) — 수입 곡물 식물검역', lawUrl: 'https://www.pom.go.id/', requirement: '수입 곡물 식물검역 증명서(Phytosanitary Certificate) 의무. BKP 허가 입항지(Belawan·Tanjung Perak·Tanjung Priok 등) 경유 의무. 미허가 해충 발견 시 즉각 반송 또는 소각.', originalRequirement: 'Imported grains require Phytosanitary Certificate. Must enter via BKP-approved ports (Belawan, Tanjung Perak, Tanjung Priok). Discovery of prohibited pests results in immediate rejection or destruction.', advisory: '수입 곡물 BKP 검역 사전 승인 절차 확인 필수. 해충·병해 처리 이력(훈증 등) 서류 지참 권장. 원산지별 허가 금지 식물 목록 Kementan 사전 확인.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 곡류 곰팡이독소·오염물질', lawUrl: 'https://www.pom.go.id/', requirement: '아플라톡신 B1 ≤5 μg/kg, 총 아플라톡신 ≤15 μg/kg. DON(데옥시니발레놀) ≤1,000 μg/kg(밀). ZEA(제아랄레논) ≤200 μg/kg(옥수수). 수입 시 공인검사기관 성적서 제출.', originalRequirement: 'Aflatoxin B1 ≤ 5 μg/kg, total aflatoxins ≤ 15 μg/kg. DON ≤ 1,000 μg/kg (wheat). ZEA ≤ 200 μg/kg (corn). Accredited laboratory test report required for import.', advisory: '아플라톡신 B1 기준이 국제 기준보다 엄격(5 μg/kg). 아프리카·중남미 원산 곡물 특히 주의. 성적서 BPOM 인정 기관 발행 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BPOM ML 등록 + SNI — 가공 곡류 (시리얼·면류)', lawUrl: 'https://www.pom.go.id/', requirement: '가공 곡류(시리얼·라면 원료·밀가루 가공품) BPOM ML 등록 필수. 원료 곡물 SNI 규격 적합성 확인. ML 등록 소요 3~6개월. 보존료 Permenkes 33/2012 허용 목록 준수.', originalRequirement: 'Processed grains (cereals, instant noodles, processed flour) require BPOM ML registration. Raw grains must meet SNI standards. ML registration takes 3–6 months. Preservatives must follow Permenkes 33/2012 permitted list.', advisory: 'ML 등록 전 수입 불가. 원료 곡물 SNI 규격 사전 대조 필수. 가공 형태 변경(밀가루→면류) 시 ML 재등록 요구될 수 있음.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 의무화 + PP 69/1999 — 가공 곡류 라벨', lawUrl: 'https://www.pom.go.id/', requirement: '2026.10.17 이후 모든 수입 가공 곡류 할랄 인증 의무(BPJPH 승인 기관 발행). 성분명·원산지 인도네시아어 표기. 영양성분표(탄수화물·단백질·나트륨) 인도네시아어 의무.', originalRequirement: 'From 2026.10.17, all imported processed grains require halal certification (BPJPH-approved body). Indonesian-language ingredient names and country of origin required. Nutritional information (carbohydrate, protein, sodium) in Indonesian mandatory.', advisory: '할랄 인증 사전 취득 필수 — BPJPH 승인 기관 목록 확인. 인도네시아어 라벨 미부착 시 통관 불가. GMO 곡물 함유 시 "Mengandung GMO" 인도네시아어 표시 권장.', urgency: '긴급' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BPI (Bureau of Plant Industry) — 곡물 식물검역 SPS Import Permit', lawUrl: 'https://www.fda.gov.ph/', requirement: '수입 곡물·곡류 BPI SPS Import Permit 필수. 훈증 처리(MB·PH3) 성적서 요구. 허용 병해충 목록 사전 확인. BPI 승인 없이 통관 불가.', originalRequirement: 'Imported grains require BPI SPS Import Permit. Fumigation records (MB or PH3) required. Approved pest list must be checked in advance. Customs clearance impossible without BPI approval.', advisory: 'BPI SPS Import Permit 신청 선적 전 충분히 여유 있게. 훈증 처리 성적서 BPI 요구 양식으로 발행. 원산지별 금지 병해충 목록 BPI 홈페이지 사전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DA — 곡류 잔류농약 MRL (Codex 준용)', lawUrl: 'https://www.fda.gov.ph/', requirement: '잔류농약 MRL Codex 기준 준용. 밀 글리포세이트 ≤30 mg/kg, 옥수수 ≤1 mg/kg. DA-BAI 공인 검사기관 성적서 제출.', originalRequirement: 'Pesticide MRLs follow Codex standards. Wheat glyphosate ≤ 30 mg/kg, corn ≤ 1 mg/kg. Test report from DA-BAI accredited laboratory required.', advisory: 'DA 공인 검사기관 성적서 지참 필수. 글리포세이트 잔류 곡물 MRL 사전 확인. 검사기관 Codex 미설정 농약은 ND(불검출) 기준 적용 가능 — 사전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO — 곡류 아플라톡신 기준', lawUrl: 'https://www.fda.gov.ph/', requirement: '아플라톡신 B1 ≤20 μg/kg(곡류 일반). FDA AO 기준 수입 전 외부 시험성적서 필수. BFAD 인정 기관 성적서 우선 인정.', originalRequirement: 'Aflatoxin B1 ≤ 20 μg/kg for cereals in general. FDA AO requires external laboratory test report before import. Reports from BFAD-accredited institutions preferred.', advisory: '아플라톡신 성적서 BFAD 인정 기관 발행 권장. 수입 곡물 FDA 무작위 검사 시 초과 적발 시 반송 처리. 성적서 유효기간 확인 후 제출.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA CPR 등록 + 영양표시 — 가공 곡류 (시리얼·오트밀)', lawUrl: 'https://www.fda.gov.ph/', requirement: '가공 곡류(시리얼·오트밀·밀가루 가공품) FDA CPR 등록 필수(소요 6~12개월). 수입업체 LTO 병행. 영양표시 FDA AO 기준(에너지·탄수화물·식이섬유·단백질·나트륨 의무).', originalRequirement: 'Processed grains (cereals, oatmeal, processed flour) require FDA CPR registration (6–12 months). Importer LTO required. Nutrition labelling per FDA AO: energy, carbohydrate, dietary fibre, protein, sodium mandatory.', advisory: 'CPR 등록 없이 수입·판매 불가. 등록 소요 시간 고려해 조기 신청 필수. 영양표시 영어 + 필리핀어(타갈로그어) 병기 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Act 1983 / Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). 곰팡이독소: 아플라톡신 총량 15 μg/kg 이하. MAQIS 식물검역(Phytosanitary) 증명서 필수. 말레이어 라벨 표시 의무.', originalRequirement: 'Pesticide MRLs per Food Regulations 1985 (Codex-based). Mycotoxins: total aflatoxins ≤ 15 μg/kg. MAQIS phytosanitary certificate mandatory. Malay-language labelling required. Irradiation-treated products require disclosure.', advisory: '곡류 수입 시 MAQIS 식물검역 사전 확인 필수. 가공 곡류에 동물성 처리제 사용 시 JAKIM 할랄 인증 필요. MeSTI 인증 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.13 — 곡류 곰팡이독소·중금속', lawUrl: 'https://www.moh.gov.my/', requirement: '아플라톡신 총량 ≤15 μg/kg. 카드뮴(곡류) ≤0.1 mg/kg. 납(곡류) ≤0.2 mg/kg. 수입 전 공인 검사기관 성적서 제출 의무.', originalRequirement: 'Total aflatoxins ≤ 15 μg/kg. Cadmium in cereals ≤ 0.1 mg/kg. Lead in cereals ≤ 0.2 mg/kg. Accredited laboratory report required before import.', advisory: '아플라톡신 성적서 SIRIM·DOA 인정 기관 발행 권장. 카드뮴·납 성적서 별도 구비. MAQIS 무작위 샘플링 빈번 — 사전 성적서 구비 필수.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Biosafety Act 2007 (BSA) — GMO 곡물 표시 의무', lawUrl: 'https://www.moh.gov.my/', requirement: 'GMO 옥수수·대두 성분 함유 시 "Mengandungi GMO" 말레이어 표시 의무. 검출 기반 적용(비율 기준 미설정). Non-GMO 표시 시 인증서 필요.', originalRequirement: 'Grains containing GMO maize or soya must label "Mengandungi GMO" in Malay. Detection-based (no threshold). Non-GMO claims require supporting certification.', advisory: 'GMO 곡물 수출 시 BSA 2007 표시 의무 사전 확인. PCR 검사 성적서 지참 권장. Non-GMO 무허가 표시 시 BSA 위반 처벌.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.16 + MeSTI — 가공 곡류 영양표시', lawUrl: 'https://www.moh.gov.my/', requirement: '가공 곡류(시리얼·밀가루·면류) 영양성분 표시 의무(에너지·단백질·지방·탄수화물·나트륨). 말레이어 성분명 병기 의무. MeSTI 인증 권장.', originalRequirement: 'Processed grains (cereals, flour, noodles): mandatory nutrition information (energy, protein, fat, carbohydrate, sodium). Malay ingredient names required. MeSTI certification recommended.', advisory: '말레이어 성분명 누락 시 통관 거부. MeSTI 인증서 수입업체 비치 권장. MOH 가이드라인 기준 1회 제공량 영양성분 표기 가능.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 — 곡류 수입 허가 및 이력추적', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '수입 곡류·가공 곡류 SFCR 허가 필수. 1단계 앞·뒤 이력추적 기록 2년 보관 의무. 수입업체 SFCR 라이선스 유지.', originalRequirement: 'SFCR import licence mandatory for imported grains and processed grains. One-step-forward and one-step-back traceability records must be retained for 2 years. Importers must maintain SFCR licence.', advisory: 'SFCR 허가 없는 수입업체와 거래 시 법적 책임. 이력추적 기록 2년 보관 의무 — 미보관 시 위반. 허가 갱신 일정 사전 확인 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'PMRA (Health Canada) — 곡류 잔류농약 MRL', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '밀 글리포세이트 ≤30 ppm, 옥수수 아트라진 ≤0.02 ppm. PMRA MRL 데이터베이스 최신 버전 확인 필수. 미설정 농약 ≤0.1 ppm 기본 기준.', originalRequirement: 'Wheat glyphosate ≤ 30 ppm, corn atrazine ≤ 0.02 ppm. PMRA MRL database must be verified for latest version. Default tolerance ≤ 0.1 ppm for pesticides without specific MRL.', advisory: 'PMRA MRL 최신 목록 수출 전 교차 확인 필수. 미설정 농약 기본 0.1 ppm — 일부 항목 한국보다 엄격. 글리포세이트 성적서 지참 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada — 곡류 곰팡이독소 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '아플라톡신 B1 ≤15 μg/kg, OTA ≤5 μg/kg(가공 시리얼). DON ≤2,000 μg/kg(밀·보리). 공인기관 시험성적서 필수.', originalRequirement: 'Aflatoxin B1 ≤ 15 μg/kg, OTA ≤ 5 μg/kg in processed cereals. DON ≤ 2,000 μg/kg in wheat and barley. Test report from accredited laboratory mandatory.', advisory: 'DON 기준 밀·보리 엄격 관리. OTA 가공 시리얼 5 μg/kg 기준 준수. 공인기관 발행 성적서 미비 시 수입 거부.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA 영양표시 기준 + FOPL — 가공 곡류 (2026.01.01)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '영어·불어 이중 영양성분 표시 의무. 2026.01.01부터 고나트륨·고포화지방 FOPL 경고 라벨 의무화(시리얼·과자류 해당 가능).', originalRequirement: 'Bilingual English/French Nutrition Facts table mandatory. FOPL high-sodium and high-saturated fat warning labels mandatory from 2026.01.01 (cereals and snacks likely subject).', advisory: 'FOPL 도입 전 시리얼 나트륨·포화지방 함량 점검. 캐나다 전용 FOPL 라벨 사전 디자인 준비 권장. 영어·불어 이중 표기 라벨 제작 필수.', enforcementDate: '2026.01.01' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'Food Standards Code Standard 2.1.1 (Cereals) / DAFF Biosecurity', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '아플라톡신 B1 ≤ 15 μg/kg, 총 아플라톡신 ≤ 15 μg/kg. DON(데옥시니발레놀) ≤ 2,000 μg/kg. FSANZ 잔류농약 MRL 준수. DAFF 식물검역 입항 신고 의무.', originalRequirement: 'Aflatoxin B1 ≤ 15 μg/kg, total aflatoxins ≤ 15 μg/kg. DON (deoxynivalenol) ≤ 2,000 μg/kg. Must comply with FSANZ MRL List for pesticide residues. DAFF phytosanitary entry reporting mandatory.', advisory: '일부 곡물 원산지에 따라 DAFF 바이오보안 강화 검역 적용. 곤충·해충 오염 리스크 제품은 열처리 처리 요구될 수 있음. Health Star Rating 가공 곡물 적용 검토.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.4.1 — 곡류 오염물질 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'OTA ≤5 μg/kg(가공 시리얼). 총 아플라톡신 ≤15 μg/kg. 납 ≤0.2 mg/kg(곡류). FSANZ 오염물질 목록 정기 업데이트 확인.', originalRequirement: 'OTA ≤ 5 μg/kg in processed cereals. Total aflatoxins ≤ 15 μg/kg. Lead in cereals ≤ 0.2 mg/kg. FSANZ contaminants list must be checked for regular updates.', advisory: 'OTA·아플라톡신 공인기관 성적서 필수. FSANZ 오염물질 기준 Codex와 상이한 항목 사전 확인. 납 기준 초과 즉시 수입 거부.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.7 + HSR — 가공 곡류 영양표시', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '영양성분 표시 의무(에너지·단백질·지방·탄수화물·나트륨). Health Star Rating 자율 표시 권장(가공 시리얼 주요 적용 대상).', originalRequirement: 'Mandatory Nutrition Information Panel: energy, protein, fat, carbohydrate, sodium. Health Star Rating voluntary but widely recommended for processed cereals.', advisory: 'HSR 표시 시리얼 제품 시장 경쟁력 향상. 고나트륨 시리얼 HSR 점수 불리 — 나트륨 저감화 권장. 영양성분 1회 제공량·100g당 이중 표기 가능.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.3 — 글루텐 표시 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '"Gluten-free" 표기 시 gluten 불검출(≤3 mg/kg). 귀리 포함 시 별도 기준 적용. 밀·호밀·보리·귀리 함유 의무 표시.', originalRequirement: '"Gluten-free" claim requires gluten not detected (≤ 3 mg/kg). Oat-containing products subject to separate criteria. Mandatory declaration of wheat, rye, barley and oats.', advisory: '"Gluten-free" 표기 검출 한도 ≤3 mg/kg — EU ≤20 mg/kg보다 엄격. 귀리 포함 제품 별도 시험 권장. 글루텐 함유 곡물 전종 의무 표시.', enforcementDate: '시행 중' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO 14:1993 (곡류·시리얼 기준) / UAE.S 2055 / ESMA', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 14 기준 아플라톡신 총량 ≤ 10 μg/kg. 잔류농약 Codex MRL 준용. ESMA 가공 곡류 제품 등록 필수. 아랍어 성분·원산지 라벨 전 항목 표기 의무.', originalRequirement: 'GSO 14 standard: total aflatoxins ≤ 10 μg/kg. Codex-based pesticide MRLs apply. ESMA registration mandatory for processed grain products. Full Arabic labelling of ingredients and origin obligatory.', advisory: '원산지 증명서 + 식물검역 증명서 동시 제출 필수. 아플라톡신 기준 EU보다 엄격(10 μg/kg). 아랍어 라벨 미비 시 통관 거부 사례 다수.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 015/2011 — 곡류 안전 기술규정 / TR TS 021/2011 / TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 015/2011 곡류 안전 기술규정 준수. 아플라톡신 B1 ≤ 2 μg/kg, 총 아플라톡신 ≤ 4 μg/kg(EU와 동일 수준). DON(데옥시니발레놀) ≤ 1,000 μg/kg (밀). 잔류농약: EAEU 통합 MRL 목록 적용. 러시아어 라벨 의무.', originalRequirement: 'EAC certification required. Must comply with TR TS 015/2011 Grain Safety Technical Regulation. Aflatoxin B1 ≤ 2 μg/kg, total aflatoxins ≤ 4 μg/kg (aligned with EU). DON ≤ 1,000 μg/kg for wheat. Pesticide residues: EAEU unified MRL list applies. Russian-language labelling mandatory.', advisory: 'EAEU 곡류 기준 일부 항목이 Codex보다 엄격. 밀·보리 곰팡이독소 검사 성적서 러시아어 번역 첨부 권고. TR TS 015 적용 대상 품목 범위 확인 후 적합 성적서 구비.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Ordinance Cap 612 / CFS 잔류농약 가이드라인', lawUrl: 'https://www.cfs.gov.hk/', requirement: '곡류·가공 시리얼: Pre-market approval 불필요. 잔류농약 기준은 Codex MRL 준용. 아플라톡신: Codex 기준 적용. 영어·번체 중국어 병기 라벨 의무. 수입 시 식품 안전 기준 준수 사업자 책임.', originalRequirement: 'Cereals and processed grains: no pre-market approval required. Pesticide MRLs follow Codex standards. Aflatoxin: Codex limits apply. Bilingual English/Traditional Chinese labelling mandatory. Food safety compliance is the importer\'s responsibility.', advisory: '홍콩 규제는 Codex 기반으로 비교적 유연. 단, 영어·번체자 이중 표기 누락 시 판매 금지 조치. 곡류 가공 제품 내 첨가물은 Cap 132W Regulations 허용 목록 준수.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132CM — 곡류 잔류농약 MRL (독자 목록 일부 포함)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '잔류농약 Cap 132CM 준용(Codex 기반, 일부 HK 독자 MRL). 클로르피리포스 ≤0.01 mg/kg. 미설정 농약 0.01 mg/kg 기본 적용. 수입 시 MRL 위반 즉시 판매 금지.', originalRequirement: 'Pesticide residues governed by Cap 132CM (Codex-based, some HK-specific limits). Chlorpyrifos ≤ 0.01 mg/kg. Default 0.01 mg/kg for unspecified pesticides. MRL violations result in immediate removal orders.', advisory: 'CFS 잔류농약 데이터베이스 수출 전 교차 확인 필수. 클로르피리포스 성적서 지참 권장. CFS 무작위 시장 감시 빈번 — 선적 전 성적서 구비.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 612 — 곡류 수입 기록 보관 의무', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수입업체 공급망 추적 기록 3개월 보관(Cap 612). 원산지 증명서·위생 증명서 보관. 가공 곡류 식품첨가물 Cap 132U 허용 목록 준수.', originalRequirement: 'Importers must maintain food traceability records for 3 months (Cap 612). Certificate of origin and health certificate must be retained. Processed grain food additives must be from Cap 132U permitted list.', advisory: '기록 미보관 시 Cap 612 위반 처벌. Cap 132U 목록 외 첨가물 사용 적발 시 전량 회수. 가공 곡류 첨가물 성분 목록 Cap 132U 사전 대조 권장.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 가공 곡류 라벨 (알레르겐·영양표시·번체자)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '가공 곡류(시리얼·밀가루·면류) 영양성분 표시 의무(탄수화물·단백질·지방·나트륨). 알레르겐(밀·귀리 글루텐·보리) 번체자 의무 표시. 영어·번체자 병기 필수.', originalRequirement: 'Processed grains (cereals, flour, noodles): mandatory Nutrition Information (carbohydrates, protein, fat, sodium). Gluten allergens (wheat, oats, barley) mandatory in Traditional Chinese. Bilingual English/Traditional Chinese mandatory.', advisory: '글루텐 알레르겐 번체자 표기 "小麥·燕麥·大麥" 정확히 기재. 간체자 단독 표기 불인정 — 번체자 별도 라벨 또는 스티커 부착 필수. 시리얼 영양성분 1회 제공량 기준 표기 가능.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 396/2005 — MRLs / UK Contaminants Regulation', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK 잔류농약 MRL: UK Retained EU Reg 396/2005 기준 적용(Brexit 이후 독자 업데이트 가능). 아플라톡신 B1 ≤ 2 μg/kg, DON ≤ 1,250 μg/kg(밀). Glyphosate MRL 유지 여부 UK FSA 최신 목록 확인 필수. 영어 단독 표기.', originalRequirement: 'UK pesticide MRLs governed by UK Retained EU Reg 396/2005 (may diverge from EU post-Brexit). Aflatoxin B1 ≤ 2 μg/kg, DON ≤ 1,250 μg/kg for wheat. Glyphosate MRL status must be verified against latest UK FSA database. English-only labelling.', advisory: 'Brexit 이후 EU MRL과 UK MRL 목록이 분리 운영 — EU MRL 충족 후 UK 별도 확인 필수. Glyphosate 등 민감 농약의 UK MRL 변경 사항 FSA 데이터베이스 정기 모니터링 권장.', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: '[UK Post-Brexit] GB MRL Register (UK SI 2019/168) + UK Retained Reg (EC) 396/2005 + UK FSA Mycotoxin Guidance + APHA Cereal Import Controls', lawUrl: 'https://www.food.gov.uk/', requirement: '[Post-Brexit MRL Divergence] GB MRL Register — Brexit 이후 영국 독자 쟁류농약 최대잔류허용기준 관리(2023년부터 EU 개정과 별도 조정). 소맦·대맦 데옵시니발레놀(DON): UK FSA 기준 1,250μg/kg(가공용 원료곳물). Glyphosate 곳룰 MRL — UK 독자 검토 중(EU 2023 갱신본과 상이 가능). 수입 곳류 GB MRL Register 기준 미준수 시 APHA(동식물보건청) 통관 거부.', advisory: 'GB MRL Register 최신본 HSE(보건안전청) 홈페이지 분기별 정기 확인 필수. EU MRL과 UK MRL 동시 비교 확인 권장(수출 경로별 상이). Northern Ireland는 EU MRL 적용 — NI 경유 GB 재수출 시 이중 기준 충족 확인. UK 2024 BTOM(무역 경계 운영 모델) 2단계 — 곳류 고위험 화물 물리적 검사 강화.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ) / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: '잔류농약 MRL: VPRÜ 스위스 독자 목록 적용(EU MRL과 대부분 동일하나 일부 상이). 아플라톡신: EU 기준 동일 적용. 유기농 곡물 Bio Suisse 기준 준수. 국내 언어 최소 1개 이상 라벨 표기 의무.', originalRequirement: 'Pesticide MRLs: Swiss VPRÜ list applies (largely aligned with EU MRL but some differences). Aflatoxin: EU-equivalent standards apply. Organic grains require Bio Suisse compliance. Labelling in at least one Swiss national language mandatory.', advisory: '스위스 VPRÜ와 EU MRL 목록 대부분 일치하나 일부 항목 차이 존재 — 수출 전 스위스 VPRÜ 별도 교차 확인 권장. 유기농 곡물 Bio Suisse 인증 없이 "Bio" 표기 불가.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'SR 817.022.109 — Verordnung des EDI über Getreide, Hülsenfrüchte, Stärken und ihre Erzeugnisse + LMV Anhang 2 (Pestizidstände) + LZV SR 817.023.021 (쳊가물)', lawUrl: 'https://www.lebensmittelinformationen.ch/', requirement: '[CH-Specific Standard] SR 817.022.109 — 곳류·두류·전분 가공식품 스위스 성분·품질 기준. Mycotoxin — CH DON 기준: EU와 동등 수준(1,250μg/kg 가공용 원료곳물). Pesticide residue: LMV Anhang 2 — 스위스 독자 MRL 목록(EU와 상이한 경우 존재: Chlorpyrifos 완전 금지). 수입 곳류 LZV 승인 쳊가물 목록 준수. 전 성분 독일어·프랑스어·이탈리아어 표시 의무(4개 공용어 중 3개 이상).', advisory: 'CH MRL이 EU보다 엄격한 품목: Chlorpyrifos(0.01mg/kg 일률기준) — 수출 전 CH MRL 목록 별도 확인 필수. 스위스 시장 소규모이나 고부가 프리미엄 채널 진입 시 CH-specific 성적서 필요. CH FSVO 연간 곳물 모니터링 보고서(Jahresbericht) 참조 권장. 수입 가공 곳류 통관 시 Swissmedic 성분 적합성 사전 확인.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 396/2005 + [Local] Lebensmittel- und Futtermittelgesetzbuch (LFGB)', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Local Rule] BfR(연방위해평가원) 곡류 내 글리포세이트 잔류 강화 모니터링 — EU 기준 대비 독일 자체 검사 빈도 높음. LFGB §5 건강 위해 식품 규정 적용. 통밀·유기농 제품 독일 DLG 품질 인증 자율 적용(시장 기대).', originalRequirement: '[Strict Local Rule] BfR (Federal Institute for Risk Assessment) conducts enhanced monitoring of glyphosate residues in grains above EU baseline. LFGB §5 food safety provision applies. Whole grain/organic grain products: DLG quality certification voluntary but market-expected.', advisory: '[EU Deviation] 독일 수출 시 BfR 권고 성분 목록 및 강화 모니터링 대상 농약 확인 권장. 글리포세이트 잔류 제품 독일 시장 소비자 민감도 높음 — 저농약 또는 유기농 원료 우선 검토. LFGB 위반 시 즉시 판매 금지 조치.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[HU] NETA 2011 / [FI] Soft Drink Tax (곡물가공 음료 포함) / [DK] Sukkerafgiftsloven', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 곡물 기반 가당 음료(귀리·쌀음료 등) 핀란드 가당음료세 부과 대상 가능. 헝가리 NETA: 가당 시리얼바·곡류 스낵류 포함 검토. Nutri-Score 의무(프랑스) 또는 자율 권장(독일·벨기에). 덴마크: 설탕세 부과 품목 리스트 확인 필요.', originalRequirement: '[EU Divergence] Grain-based sweetened beverages (oat/rice drinks) may be subject to Finland soft drink sugar tax. Hungary NETA: sweetened cereal bars and grain snacks potentially included. Nutri-Score mandatory (France) or voluntary (Germany, Belgium). Denmark: verify applicable taxed product categories.', advisory: '귀리·쌀 음료 북유럽 수출 시 당류 함량에 따른 세율 부과 여부 각 국가별 최신 기준 확인 필수. 저당 귀리음료 시장 성장 추세 — 저당 포뮬레이션으로 세금 부담 없이 경쟁력 확보 가능.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '食品添加物公定書 改正 (内閣府令 2025.03.28) — 영양강화 첌가물 표시 면제 폐지 / 62종 표기명 개정', lawUrl: 'https://www.caa.go.jp/', requirement: '[2025.03.28 공포] ① 영양강화 목적 첌가물(비타민류·미네랄류·DHA·EPA 포함) 표시 면제 → 전 성분 표시 의무화. ② 첌가물 62종 표기명 개정 + 29종 신설 — 냉동 곡물가공품(냉동볶음밥·냉동떡·냉동만두) 2026.04.01 즉시 적용. 일반 첌가물 5년 유예.', advisory: '냉동 곡물가공품 2026.04.01 즉시 적용 대상 — 라벨 개정 선제 착수 필수. 영양강화 첌가물 미표시 시 食品表示法 위반. 62종 개정 표기명 목록 CAA 고시 원문 확인 후 성분표 전수 재검토.' },
        {
          country: 'France (DGCCRF) [🚨 EU Divergence]',
          flag: '🇫🇷',
          enforcementDate: '2026.01.07',
          law: 'France Emergency Pesticide Import Ban — EU 금지 농약 5종 Zero Tolerance (2026.01.07)',
          lawUrl: 'https://www.economie.gouv.fr/dgccrf',
          requirement: '🚨 [즉시 시행] EU 사용 금지 농약 5종 — ① 카르벤다짐(Carbendazim) ② 베노밀(Benomyl) ③ 글루포시네이트(Glufosinate) ④ 티오파네이트메틸(Thiophanate-methyl) ⑤ 만코제브(Mancozeb) 잔류 "검출" 자체 수입 전면 금지(Zero Tolerance). 영향 품목: 과일·채소·곡류·두류·감자 등.',
          advisory: '⚠️ 미검출(ND) 공인기관 성적서 없이 프랑스 통관 불가. 해당 농약 사용 원료 공급망 전환 검토. EU 금지 농약 전체 목록 DGCCRF 최신본 확인.',
          urgency: '긴급',
        },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EU) 609/2013 (FSMP 카테고리 기준) + [Local] LFGB §11 / BfR 안전성 자문', lawUrl: 'https://www.bvl.bund.de/', requirement: '[EU+Local] EU Reg 609/2013 독일 구현 — 구 DiätV(식이요법 제품 규정) 완전 대체. BfR(연방위해평가원) FSMP 성분 안전성 자문 의견서 BVL 제출 의무. 독일어 전 성분·영양성분·사용 목적 표시 필수(LMIV 기준). 특수 의료 목적 식품 "bilanzierte Diäten" — BVL 판매 허가 절차 별도 적용.', advisory: 'BfR 안전성 자문 의견 취득 후 BVL 시판 신고. 독일 특수 의료 목적 식품 시장: 병원·약국·온라인 유통 체널별 규제 수준 상이. FSMP 광고 — Heilmittelwerbegesetz(HWG) 위반 금지(치료 효능 표방 불가).' },
    ],
  },
  'meat-fish': {
    title: 'Meat, Fish, Eggs & Legumes — Global Regulations',
    icon: Drumstick,
    rows: [
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '축산물 위생관리법 / 수산물 품질관리법 / 식품위생법', lawUrl: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%B6%95%EC%82%B0%EB%AC%BC%EC%9C%84%EC%83%9D%EA%B4%80%EB%A6%AC%EB%B2%95', requirement: 'HACCP 의무 적용(도축·가공). 식육: 냉장 0-10°C, 냉동 -18°C 이하. 수산물: 히스타민 200 mg/kg↓. 알류: 살모넬라 불검출.', originalRequirement: 'HACCP mandatory (slaughter/processing). Meat: refrigerated 0-10°C, frozen ≤-18°C. Seafood: histamine ≤200 mg/kg. Eggs: Salmonella not detected.', advisory: '수출 시 상대국 위생증명서(Health Certificate) 발급 필요. MAFRA 수산물 이력제 등록 의무 확인.' },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 식육류 기준 및 규격', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '냉장 식육: 세균수 ≤10^6 CFU/g, 대장균군 불검출(식육 가공품). 냉동 식육: -18°C 이하 보관. 잔류물질: 항생제(클로람페니콜 불검출·페니실린 ≤0.05 mg/kg). 성장촉진제(클렌부테롤) 불검출. 아질산나트륨 사용 기준 준수.', advisory: '항생제 잔류 기준 강화 추세. 수입 축산물 잔류물질 검사 성적서(수출국 공인기관 발행) 구비 필수.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 수산물 기준 및 규격', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '수산물 중금속: 수은 ≤0.5 mg/kg(심해성 어류 ≤1.0), 납 ≤0.5 mg/kg, 카드뮴 ≤0.1 mg/kg. 패류독소: 마비성 ≤0.8 mg/kg, 설사성 ≤0.16 mg/kg. 히스타민 ≤200 mg/kg(고등어·참치류).', advisory: '고등어·참치류 히스타민 기준 초과 사례 다수. 수산물 생산국·양식환경에 따라 중금속 수준 상이 — 성적서 구비 필수.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: 'HACCP 의무화 — 축산·수산 가공업', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '의무 적용 업종: 도축장·육가공업·유가공업·알가공업·수산물 가공업(냉동 포함). HACCP 계획 수립·이행·기록 의무. 정기 현장조사(연 1~2회). CCP(중요관리점) 설정 및 모니터링 의무.', advisory: 'HACCP 미적용 업체 제품 수입 시 한국 내 유통 제한. 수출국 HACCP 상응 인증(EU·USDA HACCP 등) 확인 필요.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수산물 이력추적관리제도 (수산물 유통법)', lawUrl: 'https://www.law.go.kr/', requirement: '수입 수산물 이력 의무 등록: 원산지·생산자·유통경로 기록. 이력번호 라벨 표시. 위반 시 3년 이하 징역 또는 3천만원 이하 벌금. 소비자 이력 조회 QR코드 표시 권장.', advisory: '수입 수산물 이력 미등록 시 통관 후 유통 단계 적발 가능. 원산지 허위 표시 형사처벌 대상.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수입식품안전관리특별법 — 수산물·축산물', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '수입 수산물·축산물 사전신고 의무. 외국 제조업소(가공공장) MFDS 사전 등록 필수. 부적합 수입 이력 시 전수검사 지정. 잔류물질 검사 협약 체결국 간소화 혜택.', advisory: '외국 제조업소 미등록 시 통관 불가. 수산물 가공공장 MFDS 등록 처리 3~6개월 소요.', },
      { country: 'USA (FDA / FSIS)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FMIA / PPIA / EPIA — USDA FSIS / 21 CFR Part 123 (Seafood HACCP)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-123', requirement: '모든 도축에 대한 전·사후 검사 의무. 수산물: HACCP 21 CFR 123 적용. 달걀: 액란 살균 의무(EPIA). 즉석섭취식품(RTE) 내 리스테리아 불검출.', originalRequirement: 'Mandatory ante/post-mortem inspection for all slaughter. Seafood: HACCP 21 CFR 123. Eggs: EPIA — pasteurisation required for liquid egg products. Listeria zero-tolerance in RTE.', advisory: 'FSIS 관할(육류·가금류)과 FDA 관할(수산물·알가공품) 구분 필수. FSMA 204 이력추적(traceability) 적용 대상에 수산물 포함(2028).', urgency: 'FSIS+FDA' },
      { country: 'USA (FDA / FSIS)', flag: '🇺🇸', enforcementDate: '시행 중', law: '9 CFR Part 417 — USDA FSIS HACCP 규정', lawUrl: 'https://www.ecfr.gov/current/title-9/chapter-III/subchapter-E/part-417', requirement: '모든 도축·육류 가공 시설 HACCP 7원칙 의무 적용. 살모넬라 기준(Performance Standards) 충족 확인. 일일 위생 검사 기록(SSOP). 신규 공정 시 HACCP 재검토.', originalRequirement: 'All slaughter/meat processing facilities: mandatory HACCP 7 principles. Salmonella performance standards compliance. Daily Sanitation SOPs (SSOP). New processes require HACCP reassessment.', advisory: '미국 수출 육류 FSIS 승인 시설에서 생산 필수. 수출국 FSIS 동등성 인정 여부 확인 (한국 HACCP 기준 FSIS 동등성 협의 필요). USDA 마크 사용 조건 사전 협의.' },
      { country: 'USA (FDA / FSIS)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'COOL (Country of Origin Labeling) — 수산물·닭고기', lawUrl: 'https://www.ams.usda.gov/rules-regulations/cool', requirement: '수산물(야생·양식 구분) 및 닭고기 원산지 표시 의무. 소·돼지는 2015년 WTO 분쟁 후 폐지. 판매 시점(POS) 표시. "Farm-raised" / "Wild-caught" 구분 필수.', originalRequirement: 'COOL required for seafood (wild/farmed distinction) and chicken. Beef and pork exempted after 2015 WTO ruling. Point-of-sale display. "Farm-raised" / "Wild-caught" distinction mandatory.', advisory: '수산물 원산지 오표시 시 USDA 위반·벌금. "Wild-caught" 주장 시 어획 수역 및 선박 등록 서류 준비. 라벨에 복수 원산지 표시 허용(혼합 제품 처리 기준 확인).' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '2028.01.20', law: 'FSMA 204 — 수산물 이력추적 기록 (2028)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-1/subpart-S', requirement: '참치·연어·새우·게 등 고위험 수산물 KDE(핵심 데이터 요소) 기록 의무. 어획→가공→수입→유통 전 단계 추적. FDA 요청 시 24시간 내 기록 제출.', originalRequirement: 'High-risk seafood (tuna, salmon, shrimp, crab) Key Data Elements (KDE) recording mandatory at each supply chain step. Records traceable from harvest to retail; FDA access within 24 hours.', advisory: '2028.01.20 적용 전 이력추적 시스템 구축 시작 권장. 수산물 가공업체·수입업체 모두 KDE 기록 의무. 전자 기록 시스템(ERP 연동) 사전 구축 필요.', urgency: '긴급' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Regulation (EC) 853/2004 — Animal Product Hygiene / Reg 178/2002', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853', requirement: 'EU 승인 도축장 목록 필수. 콜드체인 문서화 의무. 히스타민: 일반 100 mg/kg, 효소 성숙 어류 200 mg/kg. 제품 유형별 살모넬라 기준 적용.', originalRequirement: 'Approved slaughterhouse list required for export. Cold chain documentation. Histamine: 100 mg/kg (general), 200 mg/kg (enzyme-matured fish). Salmonella criteria by product type.', advisory: 'EU 승인 도축장·가공시설 리스트 확인 필수. Brexit 후 영국 수출은 별도 UKCA/DEFRA 기준 적용.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 2073/2005 — 육류·수산물 미생물 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R2073', requirement: '리스테리아(L. monocytogenes): RTE ≤100 CFU/g(유통 중), 불검출/25g(출하 시). 살모넬라: 가금류 불검출(n=5, c=0). 수산물: 히스타민 n=9, c=2, 기준 100 mg/kg.', originalRequirement: 'Listeria monocytogenes: RTE ≤100 CFU/g during shelf life, absent/25g at production. Salmonella: poultry absent (n=5, c=0). Seafood histamine: n=9, c=2, limit 100 mg/kg.', advisory: 'RTE 육류 리스테리아 환경 모니터링 강화 필수. 살모넬라 기준 가금류 종류별 별도 Annex 확인. 히스타민 초과 시 즉각 회수·RASFF 신고.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Art. 26 — 육류·수산물 원산지 표시', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '신선·냉장·냉동 소·돼지·양·가금류 원산지 표시 의무. 어류: 어획 수역(FAO 구역) 또는 양식 국가 표시. "EU" 원산지 표시 조건 별도 확인. 다국가 혼합 시 전체 국가 표시.', originalRequirement: 'Origin mandatory for fresh, chilled, frozen beef, pork, sheep/goat, poultry. Fish: fishing area (FAO zone) or aquaculture country. "EU" origin rules apply. Multiple origins must all be stated.', advisory: '원산지 오표시 시 EU 회원국 식품 당국 현장 점검 대상. 가공육·혼합 제품은 Art. 26 적용 제외(별도 Reg 1337/2013 확인). 식육 가공 시 공급망 원산지 추적 기록 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1881/2006 — 수산물 오염물질 (중금속·다이옥신)', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1881', requirement: '수은 ≤0.5 mg/kg(일반 어류), 참치·황새치·상어 ≤1.0 mg/kg. 카드뮴 ≤0.05 mg/kg(근육). 다이옥신+DL-PCB ≤3.5 pg WHO-TEQ/g 지방. 납 ≤0.3 mg/kg.', originalRequirement: 'Mercury ≤0.5 mg/kg (general fish), ≤1.0 mg/kg (tuna, swordfish, shark). Cadmium ≤0.05 mg/kg (muscle). Dioxins+DL-PCBs ≤3.5 pg WHO-TEQ/g fat. Lead ≤0.3 mg/kg.', advisory: '참치·황새치·상어류 수은 기준 완화(1.0) — 단, 임산부 섭취 주의 문구 권고. 다이옥신·PCB 기준 초과 시 RASFF 즉각 등록. EU 공인기관 중금속 성적서 수출 전 확보 필수.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '食品衛生法 食肉·魚介類 / 乳肉水産基準 (2026.04.01 CAA 이관)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '식육 위생감시원 검사 의무. 소고기: BSE 검사 적용. 어패류: 히스타민 200 mg/kg 이하. 2026.04 CAA 이관 후 인허가 창구 변경.', originalRequirement: '食肉衛生監視員による検査が義務。牛肉：BSE検査適用。魚介類：ヒスタミン200 mg/kg以下。2026年4月消費者庁移管後、許認可窓口変更。', advisory: 'CAA 이관 전후 수출 서류상의 관할기관명 변경 확인. 수산물 이력추적 시스템 CAA 요건 준수.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品衛生法 — 식육 위생기준 (냉장·냉동·미생물)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/index.html', requirement: '냉장 식육 10°C 이하, 냉동 -15°C 이하 보관. 식육가공품 세균수 ≤10^5 CFU/g. 腸管出血性大腸菌(O157·O111 등) 불검출. 牛肝臓(소 간) 生食 판매 금지(2012~).', originalRequirement: '冷蔵食肉10°C以下、冷凍-15°C以下保管。食肉加工品の細菌数≤10^5 CFU/g。腸管出血性大腸菌（O157・O111等）不検出。牛肝臓の生食提供禁止（2012年~）。', advisory: '소 간 생식 제공 금지(일본 독자 규정) — 한국 육회 문화와 상이. 냉동 보관 -15°C 이하 콜드체인 문서 필수. 세균수 검사 공인기관 성적서 구비.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '動物用医薬品 잔류기준 — ポジティブリスト (2026.04 CAA 이관)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu02/index.html', requirement: '항생물질·항균제 개별 MRL 적용. 목록 외 물질 0.01 mg/kg 일률기준. 클로람페니콜(Chloramphenicol) 불검출. 2026.04.01 CAA 이관 후 관리 강화.', originalRequirement: '抗生物質・抗菌剤ごとのMRL適用。リスト外物質は0.01 mg/kgの一律基準。クロラムフェニコール不検出。2026年4月1日より消費者庁へ移管後、管理強化。', advisory: '클로람페니콜 불검출 기준 — 성적서 반드시 구비. 목록 외 물질 0.01 mg/kg 일률기준 초과 시 전량 수입 금지. CAA 이관 후 잔류기준 업데이트 모니터링.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '수산물 오염물질 기준 — 食品衛生法 告示', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/index.html', requirement: '수은(메틸수은) ≤0.3 mg/kg(일반 어류), 심해성 어류 ≤0.4 mg/kg. 카드뮴 ≤0.1 mg/kg. 패류독소(마비성) ≤4 MU/g. 히스타민 ≤200 mg/kg. PCB 어류 ≤0.5 mg/kg.', originalRequirement: '水銀（メチル水銀）≤0.3 mg/kg（一般魚類）、深海性魚類≤0.4 mg/kg。カドミウム≤0.1 mg/kg。麻痺性貝毒≤4 MU/g。ヒスタミン≤200 mg/kg。PCB魚類≤0.5 mg/kg。', advisory: '참치·상어 등 심해어류 수은 기준 별도 적용. 패류 수확 해역 조류독소 모니터링 필수. 히스타민 생성 어류(고등어·참치·정어리) 냉장 관리 철저.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: 'BSE/TSE 수입 제한 — 牛肉 위험물질 관리', lawUrl: 'https://www.maff.go.jp/j/syouan/douei/bse/', requirement: '牛肉 수입국 OIE BSE 위험 등급 확인 필수. SRM(특정위험물질: 뇌·척수·소장 원위부 등) 제거 증명서 요구. 뼈 포함 소고기 수입 조건 엄격. 30개월령 초과 소 뇌·척수 수입 금지.', originalRequirement: '牛肉輸入は輸出国のOIE BSEリスク分類確認が必須。SRM（特定危険部位：脳・脊髄・小腸遠位部等）除去証明書が必要。骨付き牛肉の輸入条件は厳格。30ヶ月齢超の脳・脊髄は輸入禁止。', advisory: 'OIE BSE 위험 등급에 따라 수입 가능 부위 상이. SRM 제거 증명서 누락 시 즉시 반송. 30개월령 초과 소 뇌·척수 포함 제품 수출 금지.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '鳥インフルエンザ 수입 제한 — 가금육·달걀', lawUrl: 'https://www.maff.go.jp/j/syouan/douei/tori/', requirement: '조류독감(HPAI) 발생국·지역 가금육 수입 일시 정지. MHLW/CAA 수입 금지 고시 수시 확인 요. 청정화 선언 전까지 수입 금지 유지. 달걀 및 가금 부산물 포함.', originalRequirement: '高病原性鳥インフルエンザ（HPAI）発生国・地域の家禽肉は輸入一時停止。清浄化宣言まで輸入禁止が継続。卵・家禽副産物も含む。', advisory: 'HPAI 발생 시 해당 국가·지역 가금육 수입 즉시 중단 — 재고 확인 필수. 발생 현황 MAFF/OIE 모니터링 의무화. 수출 계약 시 불가항력 조항 포함 권고.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 수산물 원산지·양식·해동 표시', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '생선(刺身·切り身 포함) 원산지 의무 표시. 해동(解凍) 표시 의무(냉동 후 해동 판매 시). 양식(養殖) 표시 의무. 수입 수산물 원산지 국가명 명기.', originalRequirement: '鮮魚（刺身・切り身含む）の原産地表示が義務。解凍表示が義務（冷凍後解凍販売時）。養殖表示が義務。輸入水産物は原産地の国名を明記。', advisory: '해동 생선 "解凍" 표시 누락 시 법 위반. 양식 수산물 "養殖" 미표시 시 적발 대상. 원산지 허위 표시 형사처벌 대상(식품표시법 위반).' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.11.26', law: 'TFDA 畜禽産品 / 水産物 殘留農藥 基準 (2025.11.26 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '축산물 및 수산물 잔류농약 기준 2025.11.26 전면 개정. 수입 축산물 검역 증명서 의무. 중국어 라벨 표시 필수.', originalRequirement: 'Pesticide MRL standards for livestock and seafood comprehensively revised effective 2025.11.26. Quarantine certificate mandatory for imported livestock. Chinese labelling required.', advisory: '개정 MRL 기준 충족 검사 성적서 구비. 항생제 잔류(예: 테트라사이클린류) 기준 강화 항목 우선 확인.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品安全衛生管理法 / 食肉衛生管理規則 — 식육 위생기준', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '냉장 식육 7°C 이하, 냉동 -18°C 이하 보관. 도축검사 합격 驗訖印 표시 필수. 식육 세균수 ≤5×10^5 CFU/g. 대장균군 ≤10^2 CFU/g. 屠宰衛生검사 미합격 식육 판매 금지.', originalRequirement: '冷藏肉品≤7°C、冷凍≤-18°C保存。屠宰檢查合格「驗訖印」標示為必要條件。肉品細菌數≤5×10^5 CFU/g。大腸桿菌群≤10^2 CFU/g。未合格屠宰衛生檢查之肉品不得販售。', advisory: '냉장 온도 초과 시 전량 폐기. 驗訖印 없는 식육 수입 불가. 세균수 기준 초과 시 통관 거부 및 반송.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '動物用藥殘留標準 — 畜禽産品 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '클로람페니콜 불검출. 테트라사이클린류 ≤0.1 mg/kg. β-작용제(클렌부테롤·살부타몰 등) 불검출. 성장호르몬 사용 전면 금지. 목록 외 물질 0.01 mg/kg 일률기준.', originalRequirement: '氯黴素不得檢出。四環黴素類≤0.1 mg/kg。乙型受體促進劑（克侖特羅、沙丁胺醇等）不得檢出。生長激素全面禁用。未列名物質適用0.01 mg/kg一律標準。', advisory: 'β-작용제 불검출 기준 TFDA 집중 단속. 수입 소고기·돼지고기 β-작용제 검사 성적서 필수. 목록 외 동물용의약품 사용 이력 서류 준비.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品中污染物質及毒素衛生標準 — 수산물 오염물질', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수은(메틸수은) 일반어류 ≤0.5 mg/kg, 심해성 어류 ≤1.0 mg/kg. 카드뮴 ≤0.05 mg/kg(어류 근육). 패류독소(마비성) ≤0.8 mg/kg(STX 당량). 히스타민 ≤200 mg/kg.', originalRequirement: '甲基汞：一般魚類≤0.5 mg/kg、深海魚類≤1.0 mg/kg。鎘（魚類肌肉）≤0.05 mg/kg。麻痺性貝毒≤0.8 mg/kg（STX當量）。組胺≤200 mg/kg。', advisory: '참치류 수은 1.0 mg/kg 기준 적용. 패류독소 계절별 강화 모니터링. 히스타민 다랑어·고등어류 200 mg/kg 기준 준수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '輸入肉品 수입 규정 — TFDA eTrack / BSE 제한', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'TFDA eTrack 수입신고. 수출국 위생증명서 필수. BSE 위험국(OIE 고위험) 소고기 수입 제한. 조류독감 발생국·지역 가금류 수입 금지. SRM(특정위험물질) 제거 증명서 요구.', originalRequirement: '透過TFDA eTrack申報進口。需提交出口國衛生證明書。BSE高風險國（OIE認定）牛肉限制進口。禽流感發生地區禽肉禁止進口。特定風險物質去除證明書為必要條件。', advisory: 'BSE 위험국 목록 OIE 연간 업데이트 확인. 조류독감 발생 시 해당 국가 가금류 즉시 수입 금지. SRM 제거 증명서 미비 시 반송.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 수산물 원산지·養殖·解凍 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수산물 원산지(原產地) 의무 표시(국가명·해역명). 해동(解凍) 판매 시 "解凍" 표시 의무. 양식(養殖) 수산물 "養殖" 표시 의무. 육류 가공품 원산지 표시(최대 사용 원료).', originalRequirement: '水產品須強制標示原產地（國家名・海域名）。解凍後販售須標示「解凍」。養殖水產品須標示「養殖」。肉類加工品須標示最大使用原料原產地。', advisory: '원산지 허위 표시 FSSA 형사처벌. 해동 미표시 시 행정처분. 양식 표시 소비자 요구 증가 — 정확한 표시 권장.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH Notification No. 355 — 식육·수산물 위생기준', lawUrl: 'https://food.fda.moph.go.th/', requirement: '냉장 육류 4°C 이하, 냉동 -18°C 이하. 살모넬라 불검출(25g). 리스테리아 불검출(RTE). 도축장 GMP 의무. 가금류 도축 위생기준 준수.', originalRequirement: 'เนื้อสัตว์แช่เย็น≤4°C แช่แข็ง≤-18°C ซัลโมเนลลาห้ามตรวจพบ（25g）ลิสทีเรียห้ามตรวจพบ（RTE）โรงฆ่าสัตว์ต้องปฏิบัติตาม GMP มาตรฐานสุขอนามัยสัตว์ปีก', advisory: '냉장 온도 초과 시 통관 거부. 살모넬라 불검출 검사 성적서 필수. GMP 미적용 도축시설 생산 육류 수입 금지 대상.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'National Livestock Act — 동물용의약품 잔류기준 (DLD)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '클로람페니콜 불검출. 옥시테트라사이클린 ≤0.1 mg/kg. β-작용제(살부타몰·클렌부테롤) 불검출. DLD 검사 의무. 성장촉진제 사용 금지.', originalRequirement: 'คลอแรมฟีนิคอลห้ามตรวจพบ ออกซีเตตราไซคลีน≤0.1 mg/kg สารเบต้าอะโกนิสต์ห้ามตรวจพบ ตรวจสอบโดย DLD ห้ามใช้สารส่งเสริมการเจริญเติบโต', advisory: 'β-작용제 불검출 DLD 집중 단속. 클로람페니콜 불검출 검사 성적서 필수. 성장촉진제 사용 이력 서류 준비.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Fisheries Act — 수산물 중금속·IUU 트레이서빌리티', lawUrl: 'https://food.fda.moph.go.th/', requirement: '수은 ≤0.5 mg/kg(일반어류). 카드뮴 ≤0.2 mg/kg. 히스타민 ≤200 mg/kg(고등어·참치류). IUU 어업 방지 트레이서빌리티 문서 의무(EU·미국 수출 시).', originalRequirement: 'ปรอท≤0.5 mg/kg（ปลาทั่วไป）แคดเมียม≤0.2 mg/kg ฮีสตามีน≤200 mg/kg（ปลาทูน่า ปลาทู）เอกสาร IUU traceability บังคับสำหรับส่งออก EU, USA', advisory: 'IUU 트레이서빌리티 문서 EU·미국 수출 필수. 히스타민 200 mg/kg 기준 다랑어·고등어 냉장 관리 철저. 수은 기준 초과 심해어류 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'DLD/Thai FDA — 수입 육류 허가·조류독감 수입 금지', lawUrl: 'https://food.fda.moph.go.th/', requirement: 'DLD 수입허가 + Thai FDA 라벨 심사. 조류독감(HPAI) 발생국·지역 가금류 수입 즉시 금지 고시. 위생증명서 필수. OIE BSE 위험국 소고기 수입 조건 확인.', originalRequirement: 'ต้องได้รับอนุญาตจาก DLD + ตรวจฉลาก อย. ห้ามนำเข้าสัตว์ปีกจากพื้นที่ที่มีการระบาด HPAI ต้องมีใบรับรองสุขอนามัย ตรวจสอบเงื่อนไขนำเข้าเนื้อวัวจากประเทศ BSE ของ OIE', advisory: 'HPAI 발생국 가금류 수입 금지 고시 수시 확인(DLD 홈페이지). BSE 위험국 소고기 SRM 제거 증명서 요구. 수입 허가 갱신 주기 DLD 확인.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2707-2016 / GB 19303 — 鲜(冻)畜禽产品 위생기준', lawUrl: 'https://www.samr.gov.cn/', requirement: '냉장 육류 ≤4°C. 냉동 ≤-18°C. 出厂检验(출하 검사) 합격증 의무. 소고기 pH 5.3~6.2. 가금류 도살 후 즉시 냉각(4°C 이하). 육안 검사 합격 표시(験訖印) 필요.', originalRequirement: '冷藏肉≤4°C。冷冻肉≤-18°C。须出具出厂检验合格证。牛肉pH 5.3~6.2。禽肉屠宰后须立即冷却至4°C以下。需贴验讫印标志。', advisory: '냉장 온도 위반 시 통관 불허. 냉동 콜드체인 온도 기록지 전 구간 보관 필수. 出厂检验 합격증 없이 수출 불가.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 31650-2019 — 食品中兽药最大残留限量 (육류·수산물)', lawUrl: 'https://www.samr.gov.cn/', requirement: '클로람페니콜 불검출(육류·수산물). β-작용제(클렌부테롤) 불검출. 테트라사이클린 ≤0.1 mg/kg. 말라카이트그린 불검출(수산물). 목록 외 물질 0.01 mg/kg 일률기준.', originalRequirement: '氯霉素不得检出（肉类·水产品）。β-激动剂（克仑特罗）不得检出。四环素≤0.1 mg/kg。孔雀石绿不得检出（水产品）。目录外物质0.01 mg/kg一律基准。', advisory: '클로람페니콜·말라카이트그린 불검출 기준 매우 엄격 — 공인기관 성적서 필수. β-작용제 검출 시 전량 폐기. 수산물 항생물질 잔류 로트별 검사 필수.', urgency: '주의' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2762-2025 — 水产品 重金属 기준 (2026.09.02 의무)', lawUrl: 'https://www.samr.gov.cn/', requirement: '어류 수은(Hg) ≤0.5 mg/kg. 甲基汞(메틸수은) ≤1.0 mg/kg(포식성 어류: 황새치·상어·다랑어). 카드뮴(Cd) ≤0.1 mg/kg(어류). 납(Pb) ≤0.5 mg/kg. 비소(As) ≤0.1 mg/kg.', originalRequirement: '鱼类汞（Hg）≤0.5 mg/kg。甲基汞≤1.0 mg/kg（肉食性鱼类：旗鱼·鲨鱼·金枪鱼）。镉（Cd）≤0.1 mg/kg（鱼类）。铅（Pb）≤0.5 mg/kg。砷（As）≤0.1 mg/kg。', advisory: '포식성 어류 메틸수은 기준 1.0 mg/kg 확인. 어종별 중금속 성적서 구비 권장. 중금속 기준 초과 시 전량 반송.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 境外企业注册 — 수입 육류·수산물 해외 제조업체 등록', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 육류·수산물 해외 가공시설 GACC 境外生产企业注册 필수(2022 GACC 공고 248호 강화). 등록 후 매 선적 GACC 위생증명서 첨부. 비등록 시설 수출 즉시 금지. 屠宰场(도축장)도 별도 등록 필요.', originalRequirement: '进口肉类·水产品境外加工设施须向GACC注册（2022年GACC248号公告）。注册后每批须附GACC卫生证明书。未注册设施不得对华出口。屠宰场须单独注册。', advisory: 'GACC 미등록 도축·가공시설 중국 수출 불가. 2022년 이후 신규 등록 요건 강화 — 기존 등록 시설도 요건 재확인 필요. 위생증명서 형식 GACC 양식 확인.', urgency: '주의' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7718 标签 — 育류·수산물 원산지·양식·해동 표시', lawUrl: 'https://www.samr.gov.cn/', requirement: '원산지 표시 의무(육류·수산물). 해동(解冻) 제품 반드시 "解冻" 표시. 양식(养殖)/자연산(野生) 구분 표시 의무(수산물). 선도 유지 방법 표시. 보관 조건(냉장/냉동) 표시.', originalRequirement: '肉类·水产品须标注原产地。解冻产品须标明"解冻"字样。水产品须区分养殖/野生。须标注保鲜方式。须标注储存条件（冷藏/冷冻）。', advisory: '해동 이력 미표시 적발 시 위반. 양식/자연산 혼동 표시 행정처분 대상. 원산지 표시 누락 통관 거부.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 육류·수산물 내 어류·갑각류·달걀 알레르겐 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 38/2018/TT-BNNPTNT — 동물검역·수입허가 (육류)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: 'MARD 수입허가(Giấy phép nhập khẩu) 필수(모든 육류·가금류). 조류독감(HPAI) 발생국·지역 가금육 수입 즉시 금지. 원산지 위생증명서 필수. OIE BSE 위험국 소고기 SRM 제거 증명.', originalRequirement: 'Giấy phép nhập khẩu MARD bắt buộc (tất cả thịt, gia cầm). Cấm nhập khẩu gia cầm từ vùng có HPAI. Giấy chứng nhận sức khỏe từ nước xuất xứ bắt buộc. Thịt bò từ nước có nguy cơ BSE cần chứng minh đã loại bỏ SRM.', advisory: 'HPAI 발생국 가금육 수입 금지 MARD 수시 고시 확인. BSE 위험국 소고기 SRM 제거 증명서 준비. 수입허가 갱신 주기 MARD 확인.', urgency: '주의' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-2:2011/BYT — 수산물 중금속·Circular 32/2019 검사체계', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '어류 수은 ≤0.5 mg/kg. 카드뮴 ≤0.1 mg/kg. 히스타민 ≤200 mg/kg(다랑어·고등어). Circular 32/2019 동물성 식품 검사체계 적용. IUU 어업 트레이서빌리티 문서 요구(EU·미국 수출 시 연계).', originalRequirement: 'Cá: Hg≤0.5 mg/kg, Cd≤0.1 mg/kg. Histamine≤200 mg/kg（cá ngừ, cá thu）. Áp dụng hệ thống kiểm tra thực phẩm có nguồn gốc động vật theo Thông tư 32/2019. Tài liệu IUU traceability yêu cầu.', advisory: '히스타민 200 mg/kg 냉장 관리 철저. IUU 어업 트레이서빌리티 문서 구비. QCVN 8-2 중금속 성적서 자기선언 첨부 권장.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP + MARD (舊 Decree 15 대체) — 가공 육류·수산물 수입 절차', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '신선 육류·수산물: MARD 수입허가. 가공 육류·수산물(통조림·훈제 등): VFA 자기선언(Tự công bố) 의무. Circular 24 허용 첨가물 사용. β-작용제·클로람페니콜 불검출.', originalRequirement: 'Thịt tươi sống và thủy sản: giấy phép MARD. Thịt chế biến (đồ hộp, hun khói): Tự công bố VFA. Chất phụ gia theo Thông tư 24. β-agonist và chloramphenicol không được phát hiện.', advisory: '신선 육류와 가공 육류 통관 절차 상이 — 제품 형태 사전 구분 필수. 클로람페니콜 불검출 성적서 필수. 가공품 자기선언 Circular 24 첨가물 적합성 동시 증명.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — 육류·수산물 라벨링 (베트남어)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '육류·수산물 가공품 베트남어 라벨 의무. 원산지 베트남어 표기. 유통기한 DD/MM/YYYY. 보관 조건(냉장·냉동) 베트남어. 해동 제품 "Đã rã đông" 표시. 알레르겐(생선·갑각류) 베트남어 표시.', originalRequirement: 'Thịt và thủy sản chế biến: nhãn tiếng Việt bắt buộc. Ghi xuất xứ bằng tiếng Việt. Hạn sử dụng DD/MM/YYYY. Điều kiện bảo quản (lạnh/đông lạnh) bằng tiếng Việt. Sản phẩm rã đông ghi "Đã rã đông". Chất gây dị ứng (cá, giáp xác) bằng tiếng Việt.', advisory: '해동 표시 "Đã rã đông" 미기재 시 위반. 알레르겐 베트남어 표시 누락 행정처분. 냉동 제품 보관 조건 미표시 통관 지연.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BKP 동물검역 — 수입 육류·수산물 수의사 확인서', lawUrl: 'https://www.pom.go.id/', requirement: '수입 육류·가금류: BKP(Badan Karantina Pertanian) 동물검역 + 원산지 수의사 확인서 필수. 조류독감(HPAI) 발생국 가금육 수입 즉시 금지. 수산물: 위생증명서 + BKP 수입허가.', originalRequirement: 'Imported meat and poultry: BKP animal quarantine and origin veterinary health certificate mandatory. Poultry imports from HPAI-affected countries immediately prohibited. Seafood: health certificate and BKP import permit required.', advisory: 'HPAI 발생국 목록 Kementan 수시 고시 확인. BKP 수입허가 소요 1~2주 — 선적 전 취득 필수. 수산물 위생증명서 한국 공인기관 발행본으로 준비.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 도축 인증 의무 — 수입 육류·가공육', lawUrl: 'https://www.pom.go.id/', requirement: '2026.10.17 이후 모든 수입 육류·가공육 BPJPH 승인 기관 발행 할랄 인증서 필수. 할랄 도축 방식 증명. 돼지고기·돼지 유래 성분 전면 수입 금지. BPOM ML 등록(가공육) 병행.', originalRequirement: 'From 17 October 2026, all imported meat and processed meat must carry halal certification issued by a BPJPH-approved body. Halal slaughter method must be certified. Pork and pork-derived ingredients completely prohibited. BPOM ML registration (processed meat) required concurrently.', advisory: 'BPJPH 승인 해외 할랄 인증기관 목록 사전 확인(MUI 이외 기관도 가능). 소·양·닭 할랄 도축 증명서 영문 + 인도네시아어 번역본 준비. 가공육 BPOM ML 등록 3~6개월 별도 소요.', urgency: '주의' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 수산물 중금속·히스타민', lawUrl: 'https://www.pom.go.id/', requirement: '수은(Hg) ≤0.5 mg/kg(일반 어류), 메틸수은 ≤1.0 mg/kg(포식성 어류). 카드뮴(Cd) ≤0.1 mg/kg(어류), 연체류 ≤1.0 mg/kg. 히스타민 ≤100 mg/kg(적색육 어류). 클로람페니콜 불검출.', originalRequirement: 'Mercury (Hg) ≤ 0.5 mg/kg (general fish), methylmercury ≤ 1.0 mg/kg (predatory fish). Cadmium (Cd) ≤ 0.1 mg/kg (fish), ≤ 1.0 mg/kg (molluscs). Histamine ≤ 100 mg/kg (red-flesh fish). Chloramphenicol not detected.', advisory: '히스타민 기준 100 mg/kg — 일부 국가(200 mg/kg)보다 엄격. 냉장 관리 철저 필요. 클로람페니콜 불검출 성적서 필수. 수산물 로트별 중금속 성적서 준비 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BPOM ML 등록 — 수입 가공 육류·수산물 (통조림·훈제)', lawUrl: 'https://www.pom.go.id/', requirement: '가공 육류·수산물(통조림·훈제·소시지 등) BPOM ML 등록 필수. 신선 육류·수산물 ML 불필요(검역 서류만). 라벨 인도네시아어 성분명·원산지·보관 조건·유통기한 의무 표기. 2026.10 이후 할랄 마크 표시 의무.', originalRequirement: 'Processed meat and seafood (canned, smoked, sausage, etc.) require BPOM ML registration. Fresh meat and seafood exempt from ML (quarantine documents only). Labels must include Indonesian ingredient names, origin, storage conditions, and expiry date. Halal mark display mandatory from October 2026.', advisory: 'ML 등록 소요 3~6개월 — 출시 일정 여유 확보. 통조림 제품 살균 조건(F0값) 성적서 수입 시 제출 가능. 2026.10 이후 할랄 마크 없는 가공육 판매 금지.', urgency: '주의' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BAI 동물검역 — 수입 육류·가금류 수입허가', lawUrl: 'https://www.fda.gov.ph/', requirement: '수입 육류·가금류 BAI(Bureau of Animal Industry) 수입허가(Import Clearance) 필수. 원산지 수의사 확인서 필수. 구제역(FMD) 발생국 소·돼지 수입 금지. 조류독감 발생국 가금육 수입 금지.', originalRequirement: 'BAI Import Clearance mandatory for all imported meat and poultry. Veterinary health certificate from origin country required. Cattle and swine from FMD-affected countries prohibited. Poultry from HPAI-affected countries prohibited.', advisory: 'BAI 수입허가 소요 2~4주 — 선적 전 취득 필수. FMD·HPAI 발생국 목록 BAI 최신 고시 확인. 한국산 소·돼지 BAI 허가 상태 수출 전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BFAR 수산물 수입허가 + IUU 트레이서빌리티', lawUrl: 'https://www.fda.gov.ph/', requirement: 'BFAR(Bureau of Fisheries) 수입허가 + 원산지 위생증명서 필수. IUU 어업 트레이서빌리티 요구. 히스타민 ≤200 mg/kg. 수은(Hg) ≤0.5 mg/kg.', originalRequirement: 'BFAR import permit and origin health certificate mandatory for seafood. IUU fishing traceability documentation required. Histamine ≤ 200 mg/kg. Mercury (Hg) ≤ 0.5 mg/kg.', advisory: 'BFAR 수입허가 소요 1~3주 — 선적 전 취득 권장. IUU 트레이서빌리티 문서 구비 — 어선 등록 증명서·어획 증명서 포함. 수산물 클로람페니콜 불검출 성적서 별도 준비.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA CPR + LTO — 가공 육류·수산물 등록', lawUrl: 'https://www.fda.gov.ph/', requirement: '가공 육류·수산물(통조림·소시지·훈제 등) FDA CPR 등록 + LTO 필수. 신선 육류·수산물 CPR 불필요. 영양성분 표시 FDA AO 기준. 알레르겐(생선·갑각류·연체류) 의무 표시.', originalRequirement: 'Processed meat and seafood (canned, sausage, smoked, etc.) require FDA CPR registration and LTO. Fresh meat/seafood exempt from CPR. Nutrition labelling per FDA AO standards. Fish, crustacean, mollusc allergen declaration mandatory.', advisory: 'CPR 등록 6~12개월 소요. 신선 vs 가공 제품 규제 체계 상이 — 제품 분류 사전 확인. 수입업체 LTO 유효기간 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO — 육류·수산물 라벨 (영어+필리핀어)', lawUrl: 'https://www.fda.gov.ph/', requirement: '영어 라벨 필수(필리핀어 권장). 보관 조건(냉장·냉동 온도) 표시 의무. 해동 이력 표시. 원산지 표시. 알레르겐 8종 의무 표시. 수입업체 이름·주소·CPR 번호.', originalRequirement: 'English labelling mandatory (Filipino recommended). Storage conditions (refrigeration/freezing temperature) required. Thawing history disclosure. Origin statement. 8 allergens mandatory declaration. Importer name, address, CPR number on label.', advisory: 'CPR 번호 미기재 반품 빈번. 냉동 제품 보관 온도(-18°C) 표시 누락 시 FDA 행정처분. 알레르겐 필리핀어 병기 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'Food Act 1983 / MAQIS 동물검역법 / JAKIM Halal Standard MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'MAQIS 동물성 식품 검역 서류 3종 동시 제출(2026.06~): 원산지 증명서·수의사 확인서·할랄 인증서. JAKIM 할랄 인증 필수(도축 방식 포함). 수산물: 위생증명서 + 잔류농약 성적서.', originalRequirement: 'MAQIS requires concurrent submission of three documents from June 2026: certificate of origin, veterinary health certificate, and JAKIM halal certificate. JAKIM halal certification mandatory including slaughter method verification. Seafood: health certificate and pesticide residue test report required.', advisory: '돼지고기·돼지 유래 성분 전면 수입 금지. 소·양·가금류 할랄 도축 인증 필수. 2026.06부터 서류 미준수 시 반송 처리. 수산물은 히스타민 200 mg/kg 이하 확인.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'MAQIS 강화 — 수산물 히스타민·항생제 성적서', lawUrl: 'https://www.moh.gov.my/', requirement: '수산물 히스타민 ≤200 mg/kg. 클로람페니콜 불검출. 나이트로푸란 불검출. 수입 시 MAQIS 검사 성적서 제시. 냉장 수산물 콜드체인 온도 이력 증명.', originalRequirement: 'Seafood histamine ≤ 200 mg/kg. Chloramphenicol not detected. Nitrofurans not detected. Test report to be presented to MAQIS upon inspection. Cold chain temperature history required for chilled seafood.', advisory: '항생제 성적서 미제출 시 수산물 MAQIS 즉각 보류 조치. 히스타민 냉장 관리 철저(4°C 이하). 로트별 성적서 준비 필수 — 일괄 성적서 허용 여부 사전 확인.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 — 육류·수산물 라벨 (말레이어·해동 표시)', lawUrl: 'https://www.moh.gov.my/', requirement: '냉동 해동 이력 표시("Telah Dicairkan") 의무. 말레이어 성분명·원산지·보관 조건 표기. JAKIM 할랄 마크(JAKIM 승인 로고만) 정확한 위치 표기.', originalRequirement: 'Thawing history disclosure ("Telah Dicairkan") mandatory. Malay-language ingredient names, origin, and storage conditions required. JAKIM halal mark (JAKIM-approved logo only) must be placed in correct position.', advisory: '해동 표시 미기재 시 위반. JAKIM 미승인 할랄 로고 사용 시 형사처벌 가능. 말레이어 라벨 현지 전문가 검수 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'JAKIM 할랄 — 수산물 가공 첨가물 + 알레르겐 표시', lawUrl: 'https://www.moh.gov.my/', requirement: '수산물 가공품 액젓·어류 소스 포함 시 JAKIM 할랄 인증 필수(발효·가공 공정 포함). 알레르겐(생선·갑각류·연체류) 영어·말레이어 의무 표시. 갑각류 히스타민 관리 기준 준수.', originalRequirement: 'Processed seafood containing fish sauce and similar fermented products require JAKIM halal certification covering fermentation and processing. Fish, crustacean, mollusc allergens mandatory in English and Malay. Crustacean histamine control standards must be met.', advisory: '김치류·젓갈류 수출 시 어류 소스·새우젓 JAKIM 할랄 여부 확인 필수. 알레르겐 말레이어 표기 누락 시 판매 금지. 수산물 알레르겐 "Ikan(생선)·Udang(새우)" 말레이어 정확 표기.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 / Meat Inspection Act — 육류 수입 허가', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '수입 육류·가금류 CFIA 인정 시설 생산 필수. 동등성 협정(Equivalency Agreement) 체결국 우선. SFCR 수입 허가 필수.', originalRequirement: 'Imported meat and poultry must be produced in CFIA-recognised establishments. Countries with equivalency agreements receive priority. SFCR import licence mandatory.', advisory: '한국-캐나다 육류 동등성 협정 체결 여부 CFIA 사전 확인. 미체결 시 CFIA 인정 시설 리스트 확인 후 수출. SFCR 허가 신청 조기 준비.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA FIS 2019 — 수산물 HACCP 의무', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '수산물 가공업체 FIS(Fish Inspection System) 등록 의무. HACCP 계획 문서화. 히스타민 ≤200 mg/kg(참치·고등어류). 수입 시 SFCR 허가 필수.', originalRequirement: 'Fish processing establishments must be registered in CFIA Fish Inspection System (FIS). HACCP plan documentation mandatory. Histamine ≤ 200 mg/kg for tuna and mackerel. SFCR import licence required.', advisory: 'FIS 미등록 시설 생산 수산물 수입 불가. 히스타민 관리 냉장 체인 유지 필수. HACCP 문서 CFIA 요청 시 즉시 제출 가능하도록 보관.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada / CFIA — 육류·수산물 오염물질 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '수은(어류) ≤0.5 mg/kg(일반), ≤1.0 mg/kg(황새치·상어·참치). 납(어류) ≤0.3 mg/kg. CFIA MRL 목록 최신 확인 필수.', originalRequirement: 'Mercury in fish: ≤ 0.5 mg/kg (general), ≤ 1.0 mg/kg (swordfish, shark, tuna). Lead in fish: ≤ 0.3 mg/kg. Must verify against latest CFIA MRL list.', advisory: '황새치·상어·참치 수은 기준 1.0 mg/kg 준수. 공인기관 중금속 성적서 지참 권장. CFIA MRL 목록 정기 업데이트 확인 필수.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA — 육류·수산물 원산지 표시 (COOL)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '신선·냉장 육류·수산물 원산지 표시 의무. "Product of Canada" 기준(최종 실질 변형). 영어·불어 이중 표기 의무.', originalRequirement: 'Country of origin labelling mandatory for fresh and refrigerated meat and seafood. "Product of Canada" standard based on last substantial transformation. Bilingual English/French required.', advisory: '"Product of Canada" 표기 시 캐나다 내 최종 실질 변형 기준 충족 필요. 원산지 혼동 표기 시 CFIA 위반 처벌. 영어·불어 이중 원산지 표기 필수.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'Biosecurity Act 2015 (DAFF) / FSANZ Standard 2.2 (Meat, Fish, Eggs)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '⚠️ 모든 육류·가금류·달걀 관련 가공품: DAFF 바이오보안 수입 허가(Biosecurity Import Permit) 필수. 히스타민: 수산물 200 mg/kg 이하. 리스테리아: RTE 제품 25g 불검출. 살모넬라: 달걀가공품 불검출.', originalRequirement: 'All processed products containing meat, poultry or egg derivatives require DAFF Biosecurity Import Permit. Histamine: ≤ 200 mg/kg for seafood. Listeria: not detected/25g in RTE products. Salmonella: not detected in egg-derived products.', advisory: '육류·달걀 성분 포함 가공식품은 수입 전 DAFF 허가 취득 필수(처리 기간 3~6개월). 수산물 HACCP 문서화 의무. 호주산 육류가 아닌 수입 육류는 별도 검역 강화 대상.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 2.2.1 — 육류 성분 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '분쇄육 지방 ≤30%. 소시지류 육류 최소 함량 기준 적용. 닭고기·칠면조 구분 표시 의무. 분쇄육 혼합 종류 표시 의무.', originalRequirement: 'Minced meat: fat ≤ 30%. Minimum meat content applies to sausages. Chicken and turkey must be declared separately. Species composition must be declared in minced meat blends.', advisory: '분쇄육 지방 30% 초과 즉시 부적합. 소시지 육류 함량 FSANZ 기준 사전 확인. 육류 종류 혼합 시 비율 표시 의무.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.6.1 — 육류·수산물 미생물 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '살모넬라: 즉석섭취 가금류 불검출. 리스테리아: RTE 제품 ≤100 CFU/g(유통 중). 히스타민: 수산물 ≤200 mg/kg. E. coli: 분쇄육 기준 적용.', originalRequirement: 'Salmonella: not detected in RTE poultry. Listeria: ≤ 100 CFU/g in RTE during distribution. Histamine: ≤ 200 mg/kg in fish products. E. coli: minced meat criteria apply.', advisory: 'RTE 가금류 살모넬라 불검출 기준 엄격. 냉장 유통 RTE 리스테리아 정기 모니터링 필요. 고등어·참치류 히스타민 관리 냉장 체인 유지 필수.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'DAFF Biosecurity — 수산물 수입 위험분석 (BICON)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '어종별 수입 승인 경로(Approved Import Conditions) DAFF BICON 시스템 사전 확인 필수. 일부 어종 검역 처리(냉동 처리) 요구. 미승인 경로 수입 불가.', originalRequirement: 'Approved import conditions for each fish species must be verified in DAFF BICON system. Some species require treatment (e.g. freezing). Import via unapproved pathways prohibited.', advisory: '어종별 BICON 조회 필수 — 미조회 시 입항 거부. 일부 어종 지정 온도·기간 냉동 처리 의무. 가공 수산물도 BICON 확인 대상.', enforcementDate: '시행 중' },
        {
          country: 'Australia (FSANZ)',
          flag: '🇦🇺',
          enforcementDate: '2026.02.25',
          law: 'Food Standards Code Standard 1.2.3 PEAL (Plain English Allergen Labelling)',
          lawUrl: 'https://www.foodstandards.gov.au/',
          requirement: '⚠️ [즉시 시행] 어류(Fish)·갑각류(Crustacean)·연체동물(Mollusc) 개별 표기 의무. "Tree nuts" 일괄 표기 불허 → 아몬드·캐슈·호두·피스타치오 등 개별 명시. "Seafood" 불허 → Fish/Crustacean/Mollusc 개별 구분. Schedule 9 기준 개별 알레르겐 명칭 전환 의무.',
          advisory: '⚠️ 2026.02.25 이미 시행. "Tree nuts"·"Seafood" 일괄 표기 즉시 비적합. Schedule 9 기준 개별 알레르겐 명칭으로 전환 필수. 뉴질랜드 동일 적용.',
          urgency: '긴급',
        },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', urgency: '긴급', law: 'UAE.S 5000-1:2014 (할랄 요건) / GSO 1703:2005 (육류 라벨) / ESMA 등록', lawUrl: 'https://www.moiat.gov.ae/', requirement: '모든 육류·가금류 ECAS/ESMA 승인 할랄 인증서 필수. 수산물 생산국 수의관 발행 위생증명서 + UAE MoIAT 수입 허가 필요. 아랍어 원산지·성분·유통기한·보관방법 표기 의무. 냉장(-18°C 이하) 냉동 육류 콜드체인 서류 제출.', advisory: '⚠️ 할랄 인증 없는 육류·가금류 UAE 수입 전면 금지. ECAS 승인 도축장·가공공장 목록 사전 확인 필수. 수산물도 이슬람 율법상 허용 어종(Halal seafood) 여부 현지 수입업체 확인 권장.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', urgency: '긴급', law: 'TR TS 034/2013 (육류·육제품) / TR TS 040/2016 (수산물) / EAEU 수의 증명 규정', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'TR TS 034/2013 EAC 인증 + 수의 위생증명서(Form 4 또는 5) 의무. 수산물 TR TS 040/2016 + EAC. Rosselkhoznadzor 승인 외국 시설만 수출 가능. 러시아어 라벨 의무.', advisory: '⚠️ Rosselkhoznadzor 미등록 시설 수출 불가 — 등록 현황 사전 조회 필수. 수의 증명서 오기재 시 전량 반송. TR TS 040 수산물 오염물질 기준 EAEU 독자 적용.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Ordinance Cap 612 / Public Health (Animals and Birds) Ordinance Cap 139', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수입 육류: 원산지별 허가 국가·지역 리스트 확인 필수(FEHD 승인 국가만). 수산물: Cap 132W 위생 기준 적용, 히스타민 200 mg/kg 이하. 영어·번체자 병기 라벨 의무. Pre-market approval 불필요.', originalRequirement: 'Imported meat: must verify approved countries/territories list (only FEHD-approved origins permitted). Seafood: hygiene standards per Cap 132W, histamine ≤ 200 mg/kg. Bilingual English/Traditional Chinese labelling mandatory. No pre-market approval required.', advisory: '홍콩 수입 허가 육류 원산지 목록 FEHD 최신 버전 확인 필수(국가별 금지 조치 빈번). 수산물은 비교적 유연하나 위생 증명서 필수. 번체자 표기 누락 시 판매 금지.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 139 — 육류 수입 원산지 허가 목록 (FEHD 갱신)', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'FEHD 승인 원산지 목록 정기 갱신 — 구제역·조류독감·돼지독감 발생 시 즉각 금지. 한국산 육류 FEHD 승인 목록 수출 전 CFS 홈페이지 확인 필수. 냉장·냉동 육류 콜드체인 온도 이력 증명.', originalRequirement: 'FEHD approved country/territory list for meat imports updated regularly — immediate suspension upon FMD, HPAI or swine influenza outbreaks. Korean meat products must verify FEHD approval list on CFS website before export. Cold chain temperature history required for chilled and frozen meat.', advisory: '질병 발생 시 즉각 수입 정지 — 선적 전 최신 FEHD 목록 확인 필수. 냉장 육류 4°C 이하 유지 이탈 이력 시 통관 거부. 가금육 조류독감 발생 주의 모니터링.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 612 — 수산물 히스타민·중금속 + AFCD 어장 인증', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수산물 히스타민 ≤200 mg/kg. 비소(As) ≤1 mg/kg(갑각류). 수은(Hg) ≤0.5 mg/kg(일반 어류), 포식성 어류 ≤1.0 mg/kg. AFCD 인증 어장 제품 우대. 위생 증명서 필수.', originalRequirement: 'Seafood histamine ≤ 200 mg/kg. Arsenic (As) ≤ 1 mg/kg (crustaceans). Mercury (Hg) ≤ 0.5 mg/kg (general fish), ≤ 1.0 mg/kg (predatory fish). AFCD-certified aquaculture products preferred. Health certificate mandatory.', advisory: '포식성 어류(참치·황새치·상어) 수은 ≤1.0 mg/kg 기준 적용 — 임산부 대상 별도 CFS 권고. 히스타민 냉장 관리 철저. 위생 증명서 없이 통관 시 전량 폐기 명령.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 육류·수산물 가공품 라벨 (번체자·해동 표시)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '냉장·냉동 온도 표시 의무. 해동 제품 "已解凍"(Already Thawed) 번체자 표시. 양식/자연산 구분 권장. 영어·번체자 병기. 알레르겐(생선·갑각류·연체류) 번체자 의무 표시.', originalRequirement: 'Refrigeration/freezing temperature on label mandatory. Thawed products must display "已解凍" (Already Thawed) in Traditional Chinese. Farmed/wild-caught distinction recommended. Bilingual English/Traditional Chinese. Fish, crustacean, mollusc allergens mandatory in Traditional Chinese.', advisory: '해동 후 재냉동 표시 위반 빈발 — 냉동 이력 관리 철저. 알레르겐 번체자 표기 누락 시 시장 감시 적발 후 판매 금지. 양식/자연산 표시 소비자 신뢰도 향상에 기여.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 853/2004 / Animal Feed (England) Regulations / DEFRA', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU 853/2004 UK Retained 버전 적용. EU 승인 도축장과 UK 승인 도축장 목록 분리(Brexit 이후). DEFRA 동물성 식품 수입 허가 필요. 히스타민: 수산물 100~200 mg/kg(EU와 동일). 영어 단독 표기 의무.', originalRequirement: 'UK retained version of EU Reg 853/2004 applies. EU and UK approved slaughterhouse lists now separate (post-Brexit). DEFRA import authorisation required for animal products. Histamine: 100–200 mg/kg for seafood (aligned with EU). English-only labelling mandatory.', advisory: 'EU 승인 도축시설이라도 UK 별도 승인 목록 등재 여부 확인 필수. DEFRA 동물성 식품 수입 사전 통지(IPAFFS 시스템) 필수. Northern Ireland는 EU SPS 규정 적용(별도 주의).', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '2021.01.01', law: '[Post-Brexit Mandatory] UK Import Health Certificates (IHC) — IPAFFS(Import of Products, Animals, Food and Feed System) + APHA Border Control Post (BCP) + UK Retained Reg (EC) 853/2004', lawUrl: 'https://www.food.gov.uk/', requirement: '[CRITICAL Post-Brexit] 2021.01.01부터 모든 수입 육류·수산물 영국 Import Health Certificate (IHC) 의무화(EU산 포함). 수출국 공식수의관 서명 IHC — IPAFFS 시스템 사전 신고. UK BCP(국경통제소) 경유 의무. EU TRACES.NT와 별개 UK IPAFFS 계정 필요. 할람·코셔 인증육 추가 서류 요구. 수산물 어획증명서 — MMO(해양관리기구) 등록 선박 한정.', advisory: '[2024.01.31 강화] EU산 SPS 물품 BCP 전면 검사 시행. 한국산 육류·수산물 → 수출국 공식 발행 IHC 양식 + IPAFFS 사전 신고(최소 24시간~48시간 전). DEFRA BTOM 최신 동향 수시 확인. 2024년부터 중위험군 육류 서류 검사 + 저위험군 선별 검사 강화. UK 수입 수산물 — MMO IUU(불법어업) 어획증명서 반드시 구비.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Lebensmittelgesetz (LMG) / Verordnung über Lebensmittel tierischer Herkunft (VLtH)', lawUrl: 'https://www.blv.admin.ch/', requirement: '동물성 식품: VLtH 준수. EU 승인 도축시설 스위스 MRA를 통해 일반적 인정. 히스타민: EU 기준 동일 적용(100~200 mg/kg). 국내 언어 최소 1개 이상 라벨 의무. 수의사 위생 증명서 필수.', originalRequirement: 'Animal-origin foods governed by VLtH. EU-approved slaughter facilities generally accepted under Switzerland-EU MRA. Histamine: EU-equivalent (100–200 mg/kg). Labelling in at least one Swiss national language mandatory. Veterinary health certificate required.', advisory: 'EU 승인 시설은 스위스 MRA로 대부분 인정. 단, 일부 품목은 스위스 FSVO 별도 승인 필요 — 수출 전 확인. 스위스 도착 수의사 검역 절차 사전 안내 권장.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'SR 817.022.108 — Verordnung des EDI über Lebensmittel tierischer Herkunft + EU-CH 수의협정(1999 Bilateral Agreement Annex 11) + HKVO SR 817.190', lawUrl: 'https://www.lebensmittelinformationen.ch/', requirement: '[CH-Specific + EU-CH Agreement] SR 817.022.108 — 축산물 원료 기준·위생 규정. EU-CH 수의협정(1999) Annex 11 — EU 위생 기준 동등 인정(EU 승인 도축장 CH 별도 승인 불필요, 단 BLV 등록 갱신 필수). 수입 육류: CH-BLV(식품안전수의국) 검역 허가 + 원산지 공식 위생증명서. 수산물: 스위스 내륙국 특성상 냉장 수산물 운송 온도 체인 집중 점검. 할람·코셔 육류 — CH 연방법 상 도축 규정(BTA) 준수.', advisory: '[한국산 특이사항] 한국산 육류 → CH 수입 허가 목록(Zulassung) 사전 확인 필수. CH Cold Chain — BLV 온도 기록 장치 검사 집중(수산물 운송 시 품온 기록 3년 보관). EU-CH 협정 비가입 한국: EU 위생증명서 한국발행 불가 → 한국 MAFRA 발행 위생증명서 + CH BLV 별도 수입 허가 취득 경로 확인. 내륙 수산물 통관 — 프랑스/독일 경유 운송 품온 기록 의무.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 853/2004 + [Local] LFGB / Tierische Lebensmittel-Hygieneverordnung (Tier-LMHV)', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Local Rule] 독일 Tier-LMHV: EU 규정 대비 도축·가공 위생 기준 추가 국내법 적용. BfR 특정 수산물(참치·고등어) 히스타민 강화 모니터링. 소·돼지 원산지 표시 독일 내 추가 표기 기대(자율 기준 강화). 비가열 육제품 리스테리아 관리 기준 엄격 적용.', originalRequirement: '[Strict Local Rule] German Tier-LMHV applies additional national hygiene requirements beyond EU Reg 853/2004. BfR enhanced histamine monitoring for certain seafood (tuna, mackerel). Origin labelling for beef/pork: additional voluntary standards widely expected in German market. Stricter Listeria controls for non-heat-treated meat products.', advisory: '[EU Deviation] 독일 수출 육류·수산물 BfR 강화 모니터링 품목 확인 권장. 히스타민 관리 강화 — 참치·고등어 제품 내부 기준 100 mg/kg 이하 권장. 독일 소비자 원산지 요구 높음 — 원산지 증명 서류 완비 필수.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[NO] Mattilsynet Guidelines / [SE] Livsmedelsverket Fish & Meat / [DK] Fødevarestyrelsen', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 노르웨이·스웨덴: 수산물 항생제 잔류 기준 EU보다 엄격 모니터링. 북유럽 전반: 육류 원산지 표시 소비자 요구 높음(자율적 추가 표기 일반화). 덴마크·스웨덴: 미세플라스틱 어류 오염 관리 자체 가이드라인. 헝가리 NETA: 어류 가공 제품(훈제·조림) 일부 해당 여부 확인.', originalRequirement: '[EU Divergence] Norway/Sweden: stricter national monitoring of antibiotic residues in seafood compared to EU baseline. Nordic countries: higher consumer expectations for meat origin labelling (voluntary additional declaration common). Denmark/Sweden: national microplastic fish contamination management guidelines. Hungary NETA: verify applicability to processed fish products (smoked, canned).', advisory: '북유럽 수산물 시장 진출 시 항생제 잔류 기준 강화 모니터링 대상 여부 확인. 소비자 원산지 투명성 요구 높음 — QR코드 기반 원산지·생산 이력 정보 제공 검토 권장.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 853/2004 + [Local] Loi Egalim 2 (2021) — 집단급식 원산지 의무 / Décret 2022-65 (수산물 원산지)', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Nutri-Score 육류 가공품(소시지·햄·테린류) 의무 표시(2017). Loi Egalim 2(2021) Art. 9: 집단급식(병원·학교·기업 구내식당) 육류·수산물 최소 50% 품질인증·국내산 의무(EGAlim 인증 조건 충족 필요). 수산물 어업방식(어획/양식) + FAO 어획해역 코드 의무 표시. Décret 2022-65: 어류·갑각류·연체류 원산지 표시 프랑스 강화 집행.', advisory: '[EU Deviation] Loi Egalim 2 집단급식 의무 비율 — 수입 육류·수산물 급식 채널 진입 장벽 높음. 소매·프리미엄 식품 서비스 채널 전략 전환 검토 필요. 수산물 FAO 어획해역 코드(예: FAO 61 — 북서태평양) 라벨 표기 필수. Nutri-Score D·E 가공육류 프랑스 시장 경쟁력 저하 우려.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '2026.01.07', urgency: '긴급', law: 'France Emergency Pesticide Import Ban — EU 금지 농약 5종 Zero Tolerance (2026.01.07)', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '🚨 [즉시 시행] EU 사용 금지 농약 5종 — ① 카르벤다짐(Carbendazim) ② 베노밀(Benomyl) ③ 글루포시네이트(Glufosinate) ④ 티오파네이트메틸(Thiophanate-methyl) ⑤ 만코제브(Mancozeb) 잔류 "검출" 자체 수입 전면 금지(Zero Tolerance). 어분·어분 원료 포함 육류·수산물 가공품 적용.', advisory: '⚠️ 미검출(ND) 공인기관 성적서 없이 프랑스 통관 불가. 어분·생선기름·원료 사료 공급망 농약 이력 교차 확인. grains·vegetables·fruits 동일 기준 적용(meat-fish도 동일).' },
    ],
  },
  vegetables: {
    title: 'Vegetables — Global Regulations',
    icon: Carrot,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 채소류 기준 / 농약잔류허용기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '채소류 잔류농약: 허용기준 미등록 농약은 0.01 mg/kg 일률 기준 적용. 미생물: 대장균군 불검출 (신선편의식품). 방사선 조사 표시 의무.', originalRequirement: 'Vegetables pesticide MRL: unregistered pesticides 0.01 mg/kg uniform limit. Microbial: coliforms not detected (fresh-cut). Irradiation disclosure required.', advisory: '수입 채소 원산지 및 농약 검사 성적서 기본 구비. 신선편의식품 HACCP 인증 권장.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: 'PLS 제도 — 채소류 잔류농약', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '채소류 미등록 농약 0.01 mg/kg 일률 기준. 등록 농약 개별 MRL 적용. 잎채소류(시금치·상추 등) 농약 잔류 집중 관리 대상. 성장조정제·토양살균제 별도 MRL 확인 필요.', advisory: '잎채소 농약 잔류 초과 적발 빈도 높음. 생산자·수출업자 PLS 기준 준수 성적서 반드시 구비.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '농수산물의 원산지 표시에 관한 법률 — 채소류', lawUrl: 'https://www.law.go.kr/', requirement: '채소류 원산지 의무 표시: 수입 채소 원산지(국가명) 라벨 표시. 음식점 원산지 표시 의무(배추김치·콩 등). 원산지 허위 표시 시 7년 이하 징역 또는 1억원 이하 벌금.', advisory: '원산지 표시 위반 단속 강화 추세. 국내산·수입산 혼합 사용 시 혼합 비율 표시 필요.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '신선편의식품 HACCP 의무 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '세척·절단·포장 채소류(신선편의식품) HACCP 의무 적용. 미생물 기준: 대장균군 불검출(g당), 리스테리아 모노사이토제네스 불검출. 보관 온도 10°C 이하. 최소 가공 처리 기록 의무.', advisory: '신선편의 채소 HACCP 미인증 업체 제품 대형마트·급식업체 납품 제한. 냉장 유통 체계 전 과정 관리 중요.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품이력추적관리법 — 신선편의식품', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '신선편의식품(세척·절단 채소류) 이력추적관리 의무 등록. 이력번호 포장재 표시. 생산·유통·판매 단계별 기록 보관(1년). 소비자 이력 조회 시스템 연계.', advisory: '이력추적 등록 미이행 시 과태료(최대 500만원). 유통기한 단기 채소류 이력 관리 시스템 사전 구축 필요.', },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 112 — Produce Safety Rule (FSMA)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112', requirement: '농업용수 수질 기준. 생물학적 토양 개량제 규정. 작업자 건강·위생 기준. 새싹류: 추가 미생물 검사. 적용 대상 농산물 목록 확인 필수.', originalRequirement: 'Agricultural water quality standards. Biological soil amendment rules. Worker health and hygiene. Sprouts: additional microbial testing. Covered produce list applies.', advisory: 'FSMA Produce Safety Rule 적용 규모·품목 확인. 미국 직수출 시 FSVP(Foreign Supplier Verification) 필수.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '2022.02.28', law: 'EPA 40 CFR Part 180 — 채소류 잔류농약 허용 기준', lawUrl: 'https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-180', requirement: '클로르피리포스 대부분 채소류 허용량 취소(EPA 2022년). EPA Tolerance 목록 품목별 최신 확인 필수. Tolerance 미설정 성분은 불검출 기준. 신선채소 FSVP 공급업체 검증 병행.', originalRequirement: 'Chlorpyrifos tolerances revoked for most vegetables (EPA 2022). EPA tolerance database must be checked per pesticide-commodity. No established tolerance = zero tolerance. Fresh produce FSVP supplier verification required.', advisory: '클로르피리포스 사용 채소 미국 수출 즉시 중단 필요. EPA tolerance 취소·변경 빈번 — 수출 전 최신 목록 교차 확인. 농약 성적서 수출국 공인기관 발행본 구비.', urgency: '긴급' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA Import Alert — 채소류 자동 억류', lawUrl: 'https://www.accessdata.fda.gov/cms_ia/importalert_list.html', requirement: 'Import Alert 99-33(아플라톡신 초과), IA 28-04(클로람페니콜·불법항생제), IA 24-23(살모넬라 오염 이력). 해당 국가·품목 발령 시 입항 즉시 자동 억류. 해제 전 반복 적합 성적서 제출 의무.', originalRequirement: 'Import Alerts: IA 99-33 (aflatoxin excess), IA 28-04 (chloramphenicol/illegal antibiotics), IA 24-23 (Salmonella contamination history). Automatic detention upon arrival. Repeated negative results required for delisting.', advisory: 'FDA Import Alert 발령 여부 수출 전 필수 확인(accessdata.fda.gov). 억류 해제 위해 반복 적합 성적서 + FDA 현장 점검 필요. Import Alert 등록 시 수출 전면 중단 조치.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 가공 채소 예방 통제', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '냉동·통조림 채소 Clostridium botulinum 위해요소 분석 필수. 저산성 통조림(LACF): 21 CFR Part 113 별도 규정 적용 (살균 공정 FDA 신고). pH ≤4.6 또는 Aw ≤0.85 시 LACF 면제.', originalRequirement: 'Frozen and canned vegetables: C. botulinum hazard analysis required. Low-Acid Canned Foods (LACF): 21 CFR Part 113 applies (sterilisation process must be registered with FDA). pH ≤4.6 or Aw ≤0.85 exempt from LACF.', advisory: 'LACF 살균 공정 FDA 신고(21 CFR Part 108) 미이행 시 수입 금지. 냉동 채소 살모넬라 예방 통제 기록 필수. 가공 채소 기업 FDA 시설 등록 필수(21 CFR Part 1.230).' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Regulation (EC) 396/2005 — MRLs / Reg 2073/2005 — Microbiological Criteria', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '통합 MRL 1,100종 이상. 클로르피리포스(Chlorpyrifos) 사용 금지. 미생물 기준: 즉석섭취 엽채류 살모넬라 25g 중 불검출.', originalRequirement: 'Harmonised MRLs (more than 1,100 substances). Chlorpyrifos banned. Microbiological criteria: Salmonella absence/25g for ready-to-eat leafy vegetables.', advisory: 'EU MRL 데이터베이스 정기 모니터링 필수. Chlorpyrifos 등 EU 금지 농약 사용 여부 원산지 단계 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1881/2006 — 채소류 니트레이트 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1881', requirement: '시금치(생): 3,500 mg/kg(여름) / 4,000 mg/kg(겨울). 상추(실내 재배·겨울): 5,000 mg/kg. 루꼴라 7,000 mg/kg. 가공 베이비푸드(시금치·당근 퓨레) ≤200 mg/kg.', originalRequirement: 'Spinach (fresh): 3,500 mg/kg (summer) / 4,000 mg/kg (winter). Lettuce (greenhouse, winter): 5,000 mg/kg. Rocket: 7,000 mg/kg. Processed baby food (spinach/carrot purée): ≤200 mg/kg.', advisory: '니트레이트 기준 계절·재배 방식별 상이 — 수확 시기 및 재배 환경 성적서 첨부 권장. 베이비푸드 기준 훨씬 엄격 — 별도 분석 성적서 확보 필수. EU 공인기관 성적서만 인정.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Annex II — 채소류 알레르겐 표시', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '셀러리·겨자·루핀·아황산염(≥10 mg/kg SO₂ 기준) 포함 14종 중 채소 관련 알레르겐 강조 표시 의무. 채소 기반 소스·믹스 제품 모두 적용. 가공보조제 잔류 시 표시.', originalRequirement: 'Celery, mustard, lupin, sulphites (≥10 mg/kg SO₂) among 14 allergens: mandatory emphasis in ingredient list for vegetable-based products and sauces. Processing aids retained in final product included.', advisory: '셀러리·겨자는 한국 미의무 알레르겐 — EU 수출용 라벨 별도 재작성 필수. 아황산염 ≥10 mg/kg 시 "SO₂" 또는 "sulphites" 표시 의무. 비포장 채소 가공품도 알레르겐 고지 적용.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 2073/2005 — 즉석섭취 채소 미생물 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R2073', requirement: '살모넬라: 즉석섭취 엽채류 n=5, c=0 (25g 불검출). E. coli: ≤100 CFU/g (n=5, c=2, m=100, M=1000). 리스테리아: ≤100 CFU/g. 제조·포장 환경 정기 모니터링.', originalRequirement: 'Salmonella: RTE leafy vegetables n=5, c=0 (absent/25g). E. coli: ≤100 CFU/g (n=5, c=2). Listeria: ≤100 CFU/g. Regular environmental monitoring of production/packaging areas.', advisory: '샐러드 믹스·세척 채소 살모넬라·E. coli 초과 시 RASFF 즉각 등록. 신선 절단 채소 유통기한 내 미생물 기준 유지 의무. 포장라인 리스테리아 환경 샘플링 기록 유지 필수.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '農薬残留ポジティブリスト制度 / 食品衛生法', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '목록 외 농약: 0.01 ppm 일률 기준. 2026.04.01 CAA 이관. 수입 검사 강화 품목 지정 주기적 변경.', originalRequirement: 'Unregistered pesticides: 0.01 ppm uniform standard. Admin transferred to CAA from 2026.04.01. Strengthened inspection target items updated periodically.', advisory: '최신 강화 검사 품목(요주의리스트) 확인 후 수출 전략 조정. 0.01 ppm 기준 초과 시 전량 수입 금지.', urgency: 'D-22 CAA' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '植物検疫法 — 수입 채소 검역', lawUrl: 'https://www.maff.go.jp/pps/', requirement: '지정 병해충 비발생 증명서(植物検疫証明書) 필수. 수입 전 소독 처리 의무(일부 품목). 위반 시 전량 폐기. 수입 금지 병해충 목록 수시 변경 — 최신 버전 확인 필수.', originalRequirement: '指定病害虫の非発生証明書（植物検疫証明書）が必要。一部品目は輸入前の消毒処理が義務。違反時は全量廃棄。輸入禁止病害虫リストは随時更新。', advisory: '수입 채소 검역증명서 植物防疫所 양식 확인 후 수출국 발행. 금지 병해충 발견 시 처리 비용 수출자 부담. 수입 허가 품목 목록 MAFF 사전 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 채소 원산지 표시', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '신선 채소 원산지 의무 표시(국가·지역명). 가공 채소 최대 원료 원산지 표시(2017 순차 확대). 유기농(有機) 표시 시 JAS 유기 인증 필수.', originalRequirement: '生鮮野菜の原産地表示は義務（国・地域名）。加工野菜は主要原料の原産地表示（2017年以降順次拡大）。有機表示にはJAS有機認証が必要。', advisory: '신선 채소 원산지 미표시 시 법 위반. 가공 채소 최대 사용 원료 원산지 반드시 표시. 유기채소 JAS 인증 없이 "유기" 표시 불가.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '微生物 기준 — カット野菜 (食品衛生法)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/index.html', requirement: '신선편의채소(カット野菜): 대장균군 ≤100/g, 리스테리아 불검출, 노로바이러스 불검출. HACCP 적용 의무(2021~). 세척수 수질 기준 준수.', originalRequirement: 'カット野菜（生鮮カット）：大腸菌群≤100/g、リステリア不検出、ノロウイルス不検出。HACCP適用義務（2021年~）。洗浄水の水質基準遵守。', advisory: 'HACCP 미적용 신선편의채소 제조시설 수입 금지 대상. 노로바이러스 검사 계절별 강화 — 동절기 우선 모니터링. 세척 공정 문서화 필수.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品衛生法 — 채소 피막제·첨가물 기준', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuhin/syokuten/index.html', requirement: '피막제(왁스) 허용 품목 한정(감귤류·사과 등). 방부제·발색제 사용 금지 채소류 목록 확인 필수. 수입 채소 포스트하베스트 처리제 허용 여부 사전 확인.', originalRequirement: 'ワックス（被膜剤）は許可品目のみ使用可能（柑橘類・りんご等）。防腐剤・発色剤使用禁止の野菜リストを確認。輸入野菜のポストハーベスト処理剤の許可状況を事前確認。', advisory: '피막제 미허가 채소에 왁스 처리 시 수입 금지. 발색제(아질산염) 신선 채소 사용 금지. 수입 채소 포스트하베스트 농약 표시 의무 확인.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.11.26', law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '채소류 잔류농약 기준 전면 개정(2025.11.26 발효). 수입 검사 강화. 원산지 표시 및 중국어 라벨 의무.', originalRequirement: 'Pesticide MRL standards for vegetables comprehensively revised (effective 2025.11.26). Strengthened import inspection. Mandatory origin and Chinese labelling.', advisory: '2025.11 개정 MRL 기준값 항목별 비교표 작성 후 원료 사전 검토 필수.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '植物防疫檢疫法 — 수입 채소 검역 (BAPHIQ)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 채소 식물검역증명서(Phytosanitary Certificate) 필수. 지정 병해충 비발생 증명 또는 소독 처리 증명 요구. 위반 시 전량 소독 또는 폐기. 防疫局(BAPHIQ) 검역.', originalRequirement: '進口蔬菜須持有植物檢疫證明書。須證明未發生指定病蟲害或已進行消毒處理。違規時全量消毒或銷毀。由防疫局（BAPHIQ）執行檢疫。', advisory: '식물검역 증명서 누락 시 통관 불가. 검역 소독 처리 비용 수출자 부담. 수입 가능 채소 품목·조건 BAPHIQ 사전 문의 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品中污染物質及毒素衛生標準 — 채소 중금속', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '카드뮴 ≤0.1 mg/kg(엽채류·근채류). 납 ≤0.1 mg/kg. 비소 ≤0.5 mg/kg(채소류). 방사성물질 Cs-134+137 ≤100 Bq/kg.', originalRequirement: '鎘≤0.1 mg/kg（葉菜類、根菜類）。鉛≤0.1 mg/kg。砷≤0.5 mg/kg（蔬菜類）。放射性物質Cs-134+137≤100 Bq/kg。', advisory: '중금속 기준 초과 원산국 수입 시 중금속 검사 성적서 필수. 방사능 기준 초과 국가 산 채소 생산지 증명서 요구.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '微生物 기준 — 신선편의채소 (TFDA 고시)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '신선편의채소(CUT 야채): 대장균군 ≤100 CFU/g, 살모넬라 불검출(25g), 리스테리아 모노사이토제네스 불검출(25g). HACCP 적용 제조시설 의무.', originalRequirement: '生鮮截切蔬菜：大腸桿菌群≤100 CFU/g。沙門氏菌不得檢出（25g）。單核球增多性李斯特菌不得檢出（25g）。加工廠須實施HACCP。', advisory: 'HACCP 미적용 시설 생산 신선편의채소 수입 금지. 미생물 검사 성적서 정기 제출. 세척·살균 공정 문서화 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 채소 원산지·有機 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '신선 채소 원산지(原產地) 의무 표시(국가명). 有機 표시 시 農業部 유기인증(CAS 또는 동등 인증) 필수. 유기 농법 3년 이상 비농약 토지 조건.', originalRequirement: '生鮮蔬菜須強制標示原產地（國家名）。標示有機須具備農業部有機認證（CAS或同等認證）。有機農法土地須3年以上未施農藥。', advisory: '원산지 미표시 또는 허위 표시 시 FSSA 처벌. 유기 인증 없는 "유기" 표시 금지. 수입 유기 채소 동등성 인정 국가 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Plant Quarantine Act — 수입 채소 DOA 식물검역', lawUrl: 'https://food.fda.moph.go.th/', requirement: '수입 채소 DOA(농업부) 식물검역 증명서 필수. 지정 병해충 발견 시 훈증 소독 또는 전량 폐기. 수입 가능 채소 품목·처리 조건 DOA 사전 확인.', originalRequirement: 'ผักนำเข้าต้องมีใบรับรองสุขอนามัยพืชจาก DOA พบศัตรูพืชต้องรมควันหรือทำลายทั้งหมด ตรวจสอบรายชื่อผักที่อนุญาตและเงื่อนไขการนำเข้ากับ DOA ล่วงหน้า', advisory: '식물검역 증명서 누락 시 통관 거부. 훈증 처리 비용 수출자 부담. 고위험 병해충 보유 국가산 강화 검역 대상.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH — 잔류농약 기준 (Codex 준용, 채소류)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '신선 채소 Codex MRL 기준 적용. MOPH 고시 특정 농약 기준 우선 적용. Chlorpyrifos ≤0.01 mg/kg. 목록 외 농약 Codex MRL 또는 0.01 mg/kg 일률 적용.', originalRequirement: 'ผักสดใช้ค่า MRL ตาม Codex มาตรฐาน MOPH ประกาศเฉพาะใช้ก่อน คลอร์ไพริฟอส≤0.01 mg/kg สารที่ไม่ได้ระบุใช้ Codex MRL หรือ 0.01 mg/kg', advisory: 'Codex MRL 미설정 농약 0.01 mg/kg 자동 적용. 잔류농약 검사 성적서 Codex 기준 대조. MOPH 특별 고시 농약 우선순위 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH — 신선 채소 미생물 기준 (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: 'RTE(즉석섭취) 채소: 대장균군 ≤100 CFU/g, 살모넬라 불검출, 리스테리아 불검출. HACCP 적용 제조시설 권장.', originalRequirement: 'ผักพร้อมรับประทาน: โคลิฟอร์ม≤100 CFU/g, ซัลโมเนลลาห้ามตรวจพบ, ลิสทีเรียห้ามตรวจพบ แนะนำให้ใช้ระบบ HACCP ในโรงงานผลิต', advisory: '미생물 기준 초과 시 통관 거부 및 전량 폐기. RTE 채소 세척·소독 공정 문서화 권장. HACCP 미적용 시설 강화 검사 대상.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Thai FDA + DOA 이중 검역 — 수입 채소 통관', lawUrl: 'https://food.fda.moph.go.th/', requirement: '신선 채소: DOA 식물검역 + Thai FDA 수입신고 이중 검역. 가공 채소: Thai FDA eSubmission 라벨 심사. 태국어 라벨 의무. 위험 국가산 강화 모니터링 대상.', originalRequirement: 'ผักสดนำเข้า: ผ่านการตรวจพืชโดย DOA + แจ้งนำเข้า อย. ผักแปรรูป: ผ่าน eSubmission ของ อย. ฉลากภาษาไทยบังคับ ประเทศเสี่ยงสูงตรวจเข้มงวด', advisory: 'DOA + Thai FDA 이중 검역 통관 시간 여유 확보. 위험 국가산 100% 검사 대상 확인. 가공 채소 eSubmission 라벨 심사 사전 진행.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC/MARA 植物检疫 — 수입 신선 채소 검역', lawUrl: 'https://www.samr.gov.cn/', requirement: '중국 수입 채소 GACC·MARA(农业农村部) SPS 협정 기반 식물검역 증명서 필수. 검역 허가 대상 채소 목록 사전 확인. 흙 부착 채소 반입 금지. 수출 포장 목재 포장재 IPPC 마크 의무.', originalRequirement: '进口蔬菜须持GACC/MARA批准的植物检疫证书。须事先确认检疫许可蔬菜清单。禁止携带泥土的蔬菜入境。出口木质包装须附IPPC标志。', advisory: '한국 수출 가능 채소 품목 GACC 사전 확인 필수. 검역 미허가 품목 수출 즉시 중단. 흙 제거 철저히 해야 통관 원활. 수입 증가 품목 집중 검사 대상 지정 가능.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2763-2021 — 食品中农药最大残留限量 (채소류)', lawUrl: 'https://www.samr.gov.cn/', requirement: '채소류 농약 MRL 10,000+항목. 클로르피리포스 ≤0.01 mg/kg. 사이퍼메트린 ≤0.5 mg/kg(십자화과 채소). 에피메트코나졸 ≤0.2 mg/kg. 목록 외 농약 0.01 mg/kg 일률기준. EU보다 일부 기준 엄격.', originalRequirement: '蔬菜类农药MRL超过10,000项。毒死蜱≤0.01 mg/kg。氯氰菊酯≤0.5 mg/kg（十字花科蔬菜）。戊唑醇≤0.2 mg/kg。目录外农药适用0.01 mg/kg一律基准。部分指标比EU严格。', advisory: 'GB 2763 기준 EU와 일부 차이 — 로트별 성적서 사전 GB 2763 대조 필수. Chlorpyrifos 0.01 mg/kg 기준 엄격 적용. 잔류농약 초과 시 전량 반송 또는 폐기.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2762-2025 — 食品中污染物限量 (채소 중금속, 2026.09.02 의무)', lawUrl: 'https://www.samr.gov.cn/', requirement: '엽채류 카드뮴(Cd) ≤0.1 mg/kg. 납(Pb) ≤0.3 mg/kg. 수은(Hg) ≤0.01 mg/kg. 비소(As) ≤0.5 mg/kg. 근채류(순무·당근 등) 카드뮴 ≤0.1 mg/kg. 중금속 성적서 구비 권장.', originalRequirement: '叶菜类镉（Cd）≤0.1 mg/kg。铅（Pb）≤0.3 mg/kg。汞（Hg）≤0.01 mg/kg。砷（As）≤0.5 mg/kg。根茎类（萝卜、胡萝卜等）镉≤0.1 mg/kg。建议备存重金属检验报告。', advisory: '채소 재배지 토양 중금속 오염 모니터링 필요. 카드뮴 기준 초과 시 수입 불허. 수출 성적서에 중금속 항목 포함 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 进口商备案 — 수입 신선 채소 취급 기업 등록', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 신선 채소 취급 기업 GACC 备案(등록) 의무. 중국 현지 수입업체도 등록 필요. ePort 시스템 수입 신고. 통관 시 검역증명서·원산지증명서·위생증명서 세트로 제출.', originalRequirement: '进口鲜蔬经营企业须向GACC备案登记。中国本地进口商也须注册。须通过ePort系统申报进口。通关时须提交检疫证书、原产地证明及卫生证明书套件。', advisory: 'GACC 미등록 업체 수입 불가. ePort 수입 신고 중국 현지 파트너(수입업체) 통해 진행. 원산지 증명서 C/O 발행 기관 GACC 인정 여부 사전 확인.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7718 — 蔬菜制品 표시 (원산지·유기인증)', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 채소 가공품 중국어(简体) 라벨: 원산지·品名·净含量·유통기한·수입업체 표기 의무. 유기농 채소 中国有机产品认证(CNCA) 필요 — 외국 유기인증 중국 자동 인정 불가. 수입 유기인증 제품 CNCA 동등성 검토.', originalRequirement: '进口蔬菜制品简体中文标签：原产地、品名、净含量、保质期、进口商须全部标注。有机蔬菜须经CNCA中国有机产品认证——外国有机认证不自动获认可。进口有机产品须进行CNCA等效性审核。', advisory: '중국 유기농 인증(CNCA) 별도 취득 또는 동등성 인정 절차 필요 — EU·미국 유기인증 자동 인정 불가. 유기 표시 무허가 사용 시 처벌. 중국어 간체자 라벨 미부착 시 통관 거부.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 채소 가공품 내 알레르겐 성분 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 17/2021/TT-BNNPTNT — 식물검역 (신선 채소)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '수입 신선 채소 MARD DOA 식물검역 증명서 필수. 금지 병해충 목록 해당 품목 수입 불가. 검역처리(훈증·소독) 요구 가능. 원산지 증명서(C/O) 필수.', originalRequirement: 'Rau quả tươi nhập khẩu cần Giấy chứng nhận kiểm dịch thực vật từ DOA thuộc MARD. Cấm nhập khẩu nếu có dịch hại trong danh sách kiểm dịch. DOA có thể yêu cầu xử lý kiểm dịch (fumigation/khử trùng). Giấy chứng nhận xuất xứ (C/O) bắt buộc.', advisory: '병해충 금지 목록 DOA 최신 확인 필수. 검역처리 요건 원산지별 상이 — 사전 DOA 협의 권장. 흙 부착 채소 반입 금지.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 36/2018/TT-BNNPTNT — 잔류농약 MRL (채소)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '수입 채소 Codex MRL 준용. 클로르피리포스 ≤0.01 mg/kg. MOPH 특별 고시 기준 우선 적용. 목록 외 농약 Codex MRL 또는 0.01 mg/kg 일률.', originalRequirement: 'Rau nhập khẩu tuân thủ MRL Codex. Chlorpyrifos≤0.01 mg/kg. Ưu tiên tiêu chuẩn thông báo đặc biệt của MOPH. Không có trong danh sách: MRL Codex hoặc 0.01 mg/kg.', advisory: 'Codex MRL 준용으로 잔류농약 검사 성적서 Codex 기준 대조. Chlorpyrifos 강화 기준 적용. 잔류농약 초과 시 전량 반송.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-2:2011/BYT — 채소 중금속 기준', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '엽채류 카드뮴(Cd) ≤0.1 mg/kg. 납(Pb) ≤0.3 mg/kg. 수은(Hg) ≤0.01 mg/kg. 비소(As) ≤1.0 mg/kg. 로트별 성적서 자기선언 첨부 권장.', originalRequirement: 'Rau lá: Cd≤0.1 mg/kg. Pb≤0.3 mg/kg. Hg≤0.01 mg/kg. As≤1.0 mg/kg. Nên kèm giấy chứng nhận kim loại nặng theo từng lô hàng.', advisory: '중금속 성적서 자기선언 첨부 시 통관 원활. QCVN 8-2 기준 초과 시 전량 폐기. 재배지 토양 오염 여부 사전 모니터링 권장.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — 채소 라벨링·원산지 표시', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '가공 채소(냉동·통조림·건조) 베트남어 라벨 의무. 원산지 표시 베트남어. 유통기한 DD/MM/YYYY. 유기농 표시 ACFS·IFOAM 인증 근거. 자기선언(Tự công bố) 서류 동시 제출.', originalRequirement: 'Rau chế biến (đông lạnh, đóng hộp, sấy khô) bắt buộc nhãn tiếng Việt. Xuất xứ bằng tiếng Việt. Hạn sử dụng DD/MM/YYYY. Nhãn hữu cơ dựa trên chứng nhận ACFS/IFOAM. Kèm hồ sơ Tự công bố.', advisory: '신선 채소 라벨 의무 없으나 가공 채소 전 항목 베트남어 표기 필수. 유기 표시 무허가 사용 금지 — 인증 근거 서류 구비 필요.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BKP 식물검역 — 수입 신선 채소 (허가 항구 지정)', lawUrl: 'https://www.pom.go.id/', requirement: '수입 신선 채소 BKP 식물검역 증명서(Phytosanitary Certificate) 필수. 지정 수입 항구(Belawan·Tanjung Perak·Soekarno-Hatta 등) 경유 의무. 흙 부착 채소 반입 금지. 병해충 발견 시 즉각 폐기·반송.', originalRequirement: 'BKP phytosanitary certificate mandatory for imported fresh vegetables. Must enter through designated ports (Belawan, Tanjung Perak, Soekarno-Hatta, etc.). Vegetables with attached soil prohibited. Immediate destruction or return if quarantine pests detected.', advisory: '지정 항구 외 통관 불가 — 물류 경로 사전 확인 필수. 신규 채소 품목 수출 시 한-인도네시아 검역 협의 소요 1~2년. 냉장 채소 콜드체인 증명서 동시 제출 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 채소 잔류농약·중금속', lawUrl: 'https://www.pom.go.id/', requirement: '잔류농약 Codex MRL 준용. 클로르피리포스·DDT 일부 독자 추가 제한 기준 적용. 엽채류 카드뮴 ≤0.1 mg/kg, 납 ≤0.3 mg/kg. 수입 전 공인검사기관 성적서 제출 요구 가능.', originalRequirement: 'Pesticide residues follow Codex MRL. Chlorpyrifos and DDT subject to additional independent restrictions. Leafy vegetables: cadmium ≤ 0.1 mg/kg, lead ≤ 0.3 mg/kg. Accredited laboratory test report may be required upon importation.', advisory: '잔류농약 성적서 BPOM 인정 기관 발행 권장. 클로르피리포스 잔류 채소 수출 시 성적서 필수 지참. 중금속 성적서 분리 준비 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BPOM ML — 가공 채소 제품 등록 (냉동·통조림·절임)', lawUrl: 'https://www.pom.go.id/', requirement: '가공 채소(냉동·통조림·건조·절임류) BPOM ML 등록 필수. 신선 채소 ML 불필요. 냉동 채소 SNI 기준 및 온도 이력 증명. 보존료 Permenkes 33/2012 허용 목록 준수.', originalRequirement: 'Processed vegetables (frozen, canned, dried, pickled) require BPOM ML registration. Fresh vegetables exempt from ML registration. Frozen vegetables must meet SNI standards and provide temperature history documentation. Preservatives must comply with Permenkes 33/2012 list.', advisory: 'ML 등록 소요 3~6개월 — 가공 채소 수출 일정 충분 여유 확보. 제품 형태 변경(신선→냉동 등) 시 ML 재등록 필요. 절임류(김치류 포함) BPOM ML 대상 — 사전 분류 확인.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 + PP 69 — 가공 채소 라벨 (인도네시아어 의무)', lawUrl: 'https://www.pom.go.id/', requirement: '가공 채소(절임류·건조채소·통조림) 2026.10.17 이후 할랄 인증 의무. 동물성 첨가제(어류 소스 등) 포함 시 BPJPH 승인 할랄 증명. 라벨 인도네시아어 성분명·원산지 의무 표기.', originalRequirement: 'Processed vegetables (pickled, dried, canned) require BPJPH halal certification from October 2026. Products containing animal-derived additives (fish sauce, etc.) require BPJPH-approved halal proof. Labels must carry Indonesian-language ingredient names and origin.', advisory: '김치류 어류 소스·새우젓 등 동물성 원료 포함 시 2026.10 이후 BPJPH 인증 필수. 식물성 원료만 사용 시 인증 취득 용이. 인도네시아어 성분명 번역 오류 통관 거부 사례 있음.', urgency: '주의' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BPI SPS Import Permit — 수입 신선·냉동 채소 식물검역', lawUrl: 'https://www.fda.gov.ph/', requirement: '수입 신선·냉동 채소 BPI(Bureau of Plant Industry) SPS 수입허가 필수. 허용 병해충 목록 사전 확인. 훈증 처리 성적서(MB·PH3) 요구. 신선 채소 콜드체인 증명서 필요.', originalRequirement: 'BPI SPS Import Permit mandatory for all imported fresh and frozen vegetables. Approved quarantine pest list must be verified in advance. Fumigation certificate (MB or PH3) required. Cold chain certificate required for fresh vegetables.', advisory: '품목별 수입 가능 원산지 BPI 사전 확인 필수. 신규 채소 품목 수입 심사 3~6개월. 훈증 처리 미이행 채소 반송 처리 빈번.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DA 잔류농약 MRL — 신선 채소', lawUrl: 'https://www.fda.gov.ph/', requirement: '잔류농약 Codex MRL 준용. DA(농업부) 공인 시험기관 성적서 요구. 클로르피리포스 ≤0.01 mg/kg(Codex 강화 기준). 미설정 농약 0.01 mg/kg 기본 적용.', originalRequirement: 'Codex MRL applies. DA-accredited laboratory test reports required. Chlorpyrifos ≤ 0.01 mg/kg (Codex strengthened). Default 0.01 mg/kg for unspecified pesticides.', advisory: 'DA 공인 성적서만 유효 — 한국 공인기관 상호인정 여부 사전 확인 권장. 클로르피리포스 성적서 미첨부 시 통관 지연. MRL 초과 즉각 반송.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA CPR + 영양표시 — 가공 채소 (냉동·통조림)', lawUrl: 'https://www.fda.gov.ph/', requirement: '가공 채소(냉동·통조림·건조) FDA CPR 등록 + LTO 필수. 신선 채소 CPR 불필요. 영양성분 표시 FDA AO 기준. 성분명·원산지 영어 라벨 필수.', originalRequirement: 'Processed vegetables (frozen, canned, dried) require FDA CPR and LTO. Fresh vegetables exempt from CPR. Nutrition labelling per FDA AO standards. English-language ingredient names and origin on label required.', advisory: 'CPR 등록 6~12개월 소요 — 출시 일정 여유 확보. 신선 채소와 가공 채소 규제 체계 상이 — 제품 형태별 확인 필수. 수입업체 LTO 유효기간 만료 여부 계약 전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — 알레르겐·라벨 (영어+필리핀어)', lawUrl: 'https://www.fda.gov.ph/', requirement: '가공 채소 알레르겐(셀러리·머스타드 포함 시) 의무 표시. 영어 라벨 필수(필리핀어 권장). 수입업체 이름·주소·CPR 번호 라벨 기재. 유통기한 표시 의무.', originalRequirement: 'Allergen declaration mandatory for processed vegetables (including celery and mustard if present). English labelling required (Filipino recommended). Importer name, address, CPR number on label. Best-before date mandatory.', advisory: 'CPR 번호 라벨 미기재 반품 빈번. 셀러리·머스타드 포함 제품 알레르겐 표시 누락 시 FDA 행정처분. 필리핀어 병기 소비자 신뢰 향상에 도움.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). MAQIS 식물검역(Phytosanitary) 증명서 의무. 신선 가공 채소: 미생물 기준(대장균군 불검출) 준수. 말레이어 라벨 표시 필수.', originalRequirement: 'Pesticide MRLs per Food Regulations 1985 (Codex-based). MAQIS phytosanitary certificate mandatory. Fresh-cut vegetables must meet microbial criteria (coliforms not detected). Malay-language labelling required.', advisory: 'MAQIS 수입 검역 사전 확인 필수. Chlorpyrifos 등 EU 금지 농약 잔류 시 수입 거부 가능. 냉장 신선 채소 콜드체인 문서 준비 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'MAQIS 식물검역 강화 (2026.06) + DoA 수입허가', lawUrl: 'https://www.moh.gov.my/', requirement: '신선 채소 Phytosanitary Certificate + DoA(농업부) 수입허가 병행. 특정 고위험 품목(엽채류·뿌리채소) DoA 사전 협의. 냉장 채소 콜드체인 온도 이력 증명.', originalRequirement: 'Fresh vegetables require both MAQIS Phytosanitary Certificate and DoA (Department of Agriculture) import permit. High-risk items (leafy and root vegetables) require advance DoA consultation. Refrigerated vegetables require cold chain temperature history documentation.', advisory: '2026.06 이후 서류 미완비 시 반송 — 수입업체와 사전 서류 체크리스트 점검 필수. DoA 수입허가 소요 2~4주. 냉장 채소 항공 수출 시 온도 이탈 이력 있으면 통관 거부 가능.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.13 — 엽채류 중금속·오염물질', lawUrl: 'https://www.moh.gov.my/', requirement: '엽채류 카드뮴(Cd) ≤0.1 mg/kg. 납(Pb) ≤0.3 mg/kg. 아플라톡신(채소 가공품) ≤15 μg/kg. 수입 전 제3자 공인기관 성적서 제출.', originalRequirement: 'Leafy vegetables: cadmium (Cd) ≤ 0.1 mg/kg. Lead (Pb) ≤ 0.3 mg/kg. Aflatoxin (processed vegetables) ≤ 15 μg/kg. Third-party accredited laboratory test report required before import.', advisory: '카드뮴·납 성적서 미제출 시 MAQIS 통관 지연. 로트별 성적서 준비 필수. 재배지 토양 중금속 오염 여부 사전 모니터링 권장.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'JAKIM 할랄 + Food Regulations 1985 — 가공 채소 라벨', lawUrl: 'https://www.moh.gov.my/', requirement: '가공 채소(피클·건조채소·통조림) 동물성 첨가제 사용 시 JAKIM 할랄 인증 필수. 말레이어 성분명 표기 의무. 방사선 조사 표시("Telah Disinari") 필요.', originalRequirement: 'Processed vegetables (pickles, dried vegetables, canned) with animal-derived additives require JAKIM halal certification. Malay-language ingredient names mandatory. Irradiation treatment disclosure ("Telah Disinari") required.', advisory: '김치류·절임류 어류 소스·새우젓 함유 시 JAKIM 할랄 인증 없이 수출 불가. 식물성 원료만 사용 시 인증 용이. 말레이어 라벨 성분명 오역 시 판매 금지 조치.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 + 식물검역 — 채소류 수입 허가', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '수입 신선 채소 CFIA 식물검역 증명서 필수. CFIA Pest List 준수. 일부 품목 Import Permit 사전 취득 의무.', originalRequirement: 'CFIA phytosanitary certificate mandatory for imported fresh vegetables. Must comply with CFIA Pest List. Some products require advance Import Permit.', advisory: 'CFIA 수입 허가 필수 채소 목록 사전 확인. 식물검역 증명서 미비 시 입항 즉시 거부. 일부 채소 훈증 처리(MB·PH3) 성적서 요구.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'PMRA — 채소류 잔류농약 MRL (Pest Control Products Act)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '클로르피리포스 대부분 채소 허용량 취소(2021년 단계적 폐지). PMRA MRL 데이터베이스 최신 확인 필수. 미설정 농약 ≤0.1 ppm 기본 기준 적용.', originalRequirement: 'Chlorpyrifos tolerances revoked for most vegetables (phased out from 2021). PMRA MRL database must be checked regularly. Default tolerance of ≤ 0.1 ppm for pesticides without specific MRL.', advisory: '클로르피리포스 잔류 채소 캐나다 수출 주의. PMRA 최신 MRL 목록 사전 교차 확인 필수. 미설정 농약 기본 0.1 ppm 엄격 준수.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada — 가공 채소 오염물질 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '납 ≤0.1 mg/kg(채소류). 카드뮴 ≤0.1 mg/kg. 아질산염(시금치 등) 별도 기준 확인. 공인 검사기관 성적서 제출 권장.', originalRequirement: 'Lead ≤ 0.1 mg/kg in vegetables. Cadmium ≤ 0.1 mg/kg. Nitrite limits for spinach and similar require separate verification. Test report from accredited laboratory recommended.', advisory: '납·카드뮴 성적서 공인기관 발행 권장. 아질산염 기준 Health Canada 가이드라인 최신 확인. 성적서 보관 2년 이상 유지.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA 영양표시 + 알레르겐 — 가공 채소류 (FOPL 2026)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '셀러리·겨자·아황산염(≥10 ppm SO₂) 알레르겐 의무 표시. 영어·불어 이중 표기 필수. 2026.01.01부터 FOPL 고나트륨 경고 라벨 해당 제품 적용.', originalRequirement: 'Mandatory allergen declaration: celery, mustard and sulphites (≥ 10 ppm SO₂). Bilingual English/French required. FOPL high-sodium warning label applies to relevant products from 2026.01.01.', advisory: '가공 채소 알레르겐 표시 누락 시 리콜 위험. 아황산염 10 ppm 기준 주의. FOPL 도입에 맞춰 나트륨 함량 조정 또는 경고 라벨 사전 준비.', enforcementDate: '2026.01.01' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'FSANZ Standard 1.4.1 (Contaminants) / DAFF Biosecurity (Plant Quarantine)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'FSANZ 잔류농약 MRL 준수(FSANZ MRL List). 미생물: 신선 엽채류 살모넬라 25g 불검출. DAFF 식물검역 입항 신고 필수. 일부 채소 수입 시 검역 처리(Heat Treatment 등) 요구될 수 있음.', originalRequirement: 'Must comply with FSANZ MRL List for pesticide residues. Microbial criteria: Salmonella not detected/25g in fresh-cut leafy vegetables. DAFF phytosanitary entry inspection mandatory. Some imported vegetables may require quarantine treatment (heat/cold) upon arrival.', advisory: '호주는 식물검역 매우 엄격 — 흙 묻은 채소 반입 금지. 가공 채소류는 FSANZ 식품첨가물 허용 목록 준수. 알룰로스 함유 가공 채소 제품 Novel Food 심사 대상 가능.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.4.2 — 채소류 잔류농약 MRL', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'FSANZ MRL List 준수(Codex 기반 + 호주 독자 기준). 클로르피리포스 ≤0.01 mg/kg(엽채류). 미설정 농약 ≤0.01 mg/kg 기본 적용.', originalRequirement: 'Must comply with FSANZ MRL List (Codex-based with Australian-specific limits). Chlorpyrifos ≤ 0.01 mg/kg in leafy vegetables. Default limit of ≤ 0.01 mg/kg applies to pesticides without specific MRL.', advisory: 'FSANZ MRL은 Codex보다 엄격한 항목 다수. 클로르피리포스 잔류 엽채류 수출 시 성적서 필수. 미설정 농약 기본 0.01 mg/kg — 상당히 엄격.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.3 — 알레르겐 표시 (채소 기반 가공품)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '셀러리·루핀·아황산염(≥10 mg/kg SO₂) 의무 표시. 호주·뉴질랜드 공동 적용. 루핀(Lupin) 호주 독자 알레르겐(EU와 공통).', originalRequirement: 'Mandatory declaration of celery, lupin and sulphites (≥ 10 mg/kg SO₂) in vegetable-based processed products. Applied jointly in Australia and New Zealand. Lupin is an Australia-specific allergen (also required in EU).', advisory: '루핀 성분 확인 후 라벨 표시. 아황산염 10 mg/kg SO₂ 이상 함유 시 "Contains Sulphites" 표기 필수. 호주·뉴질랜드 공동 기준이므로 양국 수출 시 동일 라벨 사용 가능.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ — 즉석섭취 신선 채소 미생물 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '살모넬라 25g 불검출. E. coli ≤100 CFU/g. 엽채류 세척 처리 기준 FSANZ 가이드라인 준수. DAFF 무작위 검사 대비 성적서 구비.', originalRequirement: 'Salmonella: not detected/25g. E. coli: ≤ 100 CFU/g. Washing procedures for leafy vegetables must comply with FSANZ guidelines. Microbial test reports required for DAFF random checks.', advisory: '즉석섭취 채소 살모넬라 불검출 기준 엄격. E. coli 성적서 선적 전 구비 권장. DAFF 무작위 검사 시 성적서 미비 시 판매 금지.', enforcementDate: '시행 중' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO CAC/MRL (잔류농약) / UAE MoCC 식물검역 / ESMA 등록 (가공 채소류)', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 기준 잔류농약 MRL 준수. 수출국 검역 당국 발행 식물위생증명서 의무. 아랍어 원산지·유통기한 표기. ESMA 등록(가공 채소류). 토마토·고추 등 일부 품목 수입 금지 목록 사전 확인.', advisory: 'UAE 식물검역(MoCC) 수입 허가 품목 목록 사전 조회 필수. 일부 신선 채소 계절별 수입 금지 품목 존재. 가공 채소류 ESMA 등록 후 통관.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 021/2011 / EAEU 잔류농약 MRL / Rosselkhoznadzor 식물위생 검역', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'Rosselkhoznadzor 식물위생증명서(IPPC 기준) 의무. EAEU 잔류농약 MRL 기준 준수(EU·Codex와 일부 상이). 가공 채소류 EAC 인증 + 국가위생증명서(СГР). 러시아어 라벨 의무.', advisory: 'EAEU MRL 기준이 EU·Codex와 다름 — 수출 전 EAEU 독자 기준 교차 확인 필수. Rosselkhoznadzor 검역 강화 품목(허브류 등) 별도 확인. 국가위생증명서 취득 6~12개월 소요.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Ordinance Cap 612 / Pesticide Residues in Food Regulation Cap 132CM', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'Cap 132CM 잔류농약 기준 적용(Codex 기반, 일부 독자 기준). 신선 채소 수입 허가 불필요 — 단, 잔류농약 위반 시 즉시 판매 금지. 영어·번체 중국어 병기 라벨. 신선 채소 콜드체인 유지 권장.', originalRequirement: 'Pesticide residues governed by Cap 132CM (Codex-based, some HK-specific limits). No import permit for fresh vegetables — but immediate removal orders for MRL violations. Bilingual English/Traditional Chinese labelling. Cold chain maintenance recommended for fresh produce.', advisory: '홍콩 Cap 132CM MRL이 Codex와 일부 다를 수 있음 — 수출 전 CFS 데이터베이스 교차 확인 권장. 번체자 표기 누락 시 현지 마트 수입 거부 빈번. 신선 채소 항공 수출 시 콜드체인 문서 완비.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132CM — 홍콩 독자 MRL (채소 잔류농약)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '홍콩 CFS 독자 MRL 목록 일부 항목 Codex와 상이. 미설정 농약은 Codex MRL 또는 0.01 mg/kg 기본 적용. 클로르피리포스 ≤0.01 mg/kg(Codex 2020 강화). 잔류농약 위반 즉시 판매 금지 및 리콜.', originalRequirement: 'Hong Kong CFS has some independent MRL values differing from Codex. Unspecified pesticides: Codex MRL or 0.01 mg/kg default. Chlorpyrifos ≤ 0.01 mg/kg (Codex 2020 strengthened). MRL violation results in immediate removal order and recall.', advisory: 'CFS 잔류농약 데이터베이스 수출 전 교차 확인 필수. 클로르피리포스 사용 채소 수출 시 성적서 필수. 무작위 CFS 시장 감시 빈번 — 선적 전 성적서 준비 강력 권장.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Order — 중국 원산지 신선 채소 공급업체 등록', lawUrl: 'https://www.cfs.gov.hk/', requirement: '중국 본토 원산지 신선 채소: CFS 등록 공급업체 통해서만 수입 가능. Cap 612 수입 기록 3개월 보관 의무(공급망 추적). 기타 원산지 신선 채소 수입 허가 불필요.', originalRequirement: 'Fresh vegetables from Chinese Mainland must be sourced through CFS-registered suppliers only. Cap 612 requires importers to maintain traceability records for 3 months. Fresh vegetables from other origins do not require import permits.', advisory: '중국산 채소 수입 시 CFS 등록 공급업체 여부 반드시 확인. 미등록 업체 경유 시 Cap 612 위반 처벌. 기록 미보관 적발 시 영업정지 가능.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 가공 채소 라벨·유기인증 표기', lawUrl: 'https://www.cfs.gov.hk/', requirement: '가공 채소(냉동·절임·건조): 영어·번체자 라벨 의무. 영양성분 표시 필수. 유기인증 "有機" 표기 시 홍콩 인정기관(HKORC·CERES 등) 인증 근거 요구. 성분명 번체자 정확 표기.', originalRequirement: 'Processed vegetables (frozen, pickled, dried): bilingual English/Traditional Chinese labelling mandatory. Nutrition information required. "有機" (organic) claim requires certification from HK-recognised certification body (HKORC, CERES, etc.). Ingredient names in accurate Traditional Chinese characters.', advisory: '간체자만 있는 중국 내수용 가공 채소 포장 그대로 홍콩 수출 불가 — 번체자 스티커 최소 부착. 유기인증 홍콩 인정기관 인증서 보유 여부 수출 전 확인.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 396/2005 / Contaminants in Food (England) Regulations', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained MRL 목록 준수(EU와 점진적 분리). 클로르피리포스 EU 동일 기준 금지. 신선 채소 DEFRA 식물검역(Phytosanitary) 입항 신고 의무. 영어 단독 표기 의무.', originalRequirement: 'Must comply with UK Retained MRL list (gradual divergence from EU). Chlorpyrifos: banned at same level as EU. Fresh vegetables require DEFRA phytosanitary entry notification. English-only labelling mandatory.', advisory: 'UK MRL 목록 EU와 분리 운영 중 — FSA Pesticide Residues Database 정기 확인 필수. DEFRA Phytosanitary import check (IPAFFS) 사전 등록 필수. 브렉시트 이후 일부 채소 품목 별도 수입 경로(Approved Pathways) 확인 필요.', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: '[UK Post-Brexit] GB MRL Register + UK Retained Reg (EC) 396/2005 + UK Plant Health Order (SI 2020/1527) + APHA Phytosanitary Import Requirements', lawUrl: 'https://www.food.gov.uk/', requirement: '[Post-Brexit SPS] 영국 수입 채소 Phytosanitary Certificate — APHA 식물위생 검역 의무. GB MRL Register 채소류 쟁류농약 기준 — EU MRL과 점진적 차이 확대 중(Organophosphate계 독자 재검토). 유기 채소 GB Organic Regulation — 영국 승인 Certification Body 인증 의무(EU 유기인증 미인정). 수입 채소 APHA BCP 식물검역 검사 — 위반 시 반송 또는 폐기.', advisory: 'APHA Plant Health Conditions — 영국 수입 채소 품목별 검역 조건 정기 확인. 2024 BTOM 2단계 — 고위험 채소류 물리적 검사 강화. EU 유기인증 영국 시장 직접 사용 불가 — 영국 승인 기관(Soil Association·OF&G) 별도 인증 권장. Chlorothalonil 완전 금지(UK 2019) — 한국산 채소류 MRL 확인 필수.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ)', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VPRÜ 잔류농약 기준 적용(EU MRL과 대부분 동일). 신선 채소 식물검역 증명서 필수(스위스 식물검역법). 유기농 채소 Bio Suisse 또는 CH-BIO 인증. 국내 언어 최소 1개 표기 의무(가공 채소).', originalRequirement: 'Pesticide MRLs per VPRÜ (largely aligned with EU). Fresh vegetables require phytosanitary certificate (Swiss Phytosanitary Law). Organic vegetables require Bio Suisse or CH-BIO certification. Labelling in at least one Swiss national language mandatory for processed vegetables.', advisory: '스위스 VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 FSVO 데이터베이스 교차 확인. 유기농 채소 "BIO" 표기 Bio Suisse 인증 없이 사용 불가. 스위스 식물검역 절차 EU와 별개 적용.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'LMV SR 817.021.23 — Verordnung des EDI über Pestizidstände in Lebensmitteln (Pestizidverordnung) + SR 916.161 Pflanzenschutzmittelverordnung + SR 916.20 Pflanzengesundheitsverordnung', lawUrl: 'https://www.lebensmittelinformationen.ch/', requirement: '[Stricter than EU] CH 독자 쟁류농약 MRL — EU보다 엄격한 기준 다수: Chlorpyrifos 전면 금지(0.01mg/kg 일률기준 적용), Dimethoate 채소류 기준 EU 대비 엄격. 수입 채소 FSVO 식물위생 검역(SR 916.20). 유기 채소 Bio-Verordnung SR 910.18 + FiBL·bio.suisse 인증. CH FSVO 연간 채소 모니터링 200여 품목 집중 검사.', advisory: 'CH MRL 데이터베이스 AGROSCOPE 최신본 정기 확인. Chlorpyrifos 완전 금지 — 한국 사과·채소류 쟁류 여부 주의. EU MRL 통과 제품도 CH 독자 MRL 위반 가능 — CH 전용 검사 성적서 추가 확보 권장. CH-EU FTA 농산물 검역: CH 국경 식물검역 별도 시행(EU 검역 통과만으로 CH 입국 보장 불가).' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Plan Ecophyto: 프랑스 독자 농약 사용 감축 목표(2030년 50% 감축). Loi Egalim Art. 44: 특정 농약(EU 허용이나 프랑스 규제 강화) 수입 채소 잔류 기준 강화 적용. Nutri-Score 채소 가공 제품 의무 표시. 글리포세이트 잔류 강화 집행.', originalRequirement: '[Strict Local Rule] Plan Ecophyto: France-specific pesticide reduction target (50% reduction by 2030). Loi Egalim Art. 44: stricter residue standards for certain pesticides permitted in EU but restricted in France. Nutri-Score mandatory on processed vegetable products. Enhanced enforcement of glyphosate residue limits.', advisory: '[EU Deviation] 프랑스 수출 채소류 잔류농약 EU 기준 충족 후 Plan Ecophyto 특별 감시 품목 추가 확인 권장. Loi Egalim 잔류 기준 강화 품목 리스트 DGCCRF 최신 버전 확인 필수.' },
        {
          country: 'France (DGCCRF) [🚨 EU Divergence]',
          flag: '🇫🇷',
          enforcementDate: '2026.01.07',
          law: 'France Emergency Pesticide Import Ban — EU 금지 농약 5종 Zero Tolerance (2026.01.07)',
          lawUrl: 'https://www.economie.gouv.fr/dgccrf',
          requirement: '🚨 [즉시 시행] EU 사용 금지 농약 5종 — ① 카르벤다짐(Carbendazim) ② 베노밀(Benomyl) ③ 글루포시네이트(Glufosinate) ④ 티오파네이트메틸(Thiophanate-methyl) ⑤ 만코제브(Mancozeb) 잔류 "검출" 자체 수입 전면 금지(Zero Tolerance). 영향 품목: 과일·채소·곡류·두류·감자 등.',
          advisory: '⚠️ 미검출(ND) 공인기관 성적서 없이 프랑스 통관 불가. 해당 농약 사용 원료 공급망 전환 검토. EU 금지 농약 전체 목록 DGCCRF 최신본 확인.',
          urgency: '긴급',
        },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[SE/DK/NO] National Organic Standards / [HU] NETA 2011 (가공 채소 포함)', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 스웨덴·노르웨이: 유기농 채소 인증 기준 EU 기준 대비 추가 요건(농약 잔류 불검출 목표). 헝가리 NETA: 가당 채소 가공 음료·주스 세금 부과 대상 가능. 핀란드 가당음료세: 채소·과채 혼합 주스 포함 여부 확인. Nutri-Score 자율 적용 국가에서 채소 가공품 점수 표시 권장.', originalRequirement: '[EU Divergence] Sweden/Norway: additional organic requirements beyond EU standards (near-zero pesticide residue target). Hungary NETA: sweetened vegetable-based beverages/juices potentially taxable. Finland sugar tax: verify applicability to vegetable-fruit blend juices. Nutri-Score voluntarily recommended for processed vegetable products in applicable countries.', advisory: '북유럽 유기농 채소 시장 진출 시 국가별 유기농 인증 추가 요건 사전 확인. 채소 혼합 주스 핀란드·헝가리 세금 적용 여부 확인. Nutri-Score 점수 표시 시 마케팅 경쟁력 강화 가능.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 396/2005 MRL + [Local] LFGB / Pflanzenschutzgesetz (PflSchG) / BVL 잔류농약 연간 모니터링', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Enforcement] BVL 연간 잔류농약 모니터링 계획 — EU 국가 중 샘플링 빈도 최고 수준. Reg (EC) 396/2005 MRL 초과 시 즉시 BVL RASFF(신속경보시스템) 신고 + 통관 거부. Pflanzenschutzgesetz — 독일 내 미승인 농약 사용 원료 수입 금지. 유기 채소 EU 유기농 Reg (EU) 2018/848 + BVL 유기 인증 감시.', advisory: 'BVL 연간 잔류농약 모니터링 보고서(“Nationale Berichterstattung”) 발간 — 한국산 채소류 검출 이력 사전 확인 필수. RASFF 신고 이력 있는 품목 독일 집중 검사 대상. EU MRL과 동일하나 BVL 집행 강도 EU 평균 상회.' },
    ],
  },
  fruits: {
    title: 'Fruits — Global Regulations',
    icon: Apple,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 과일류 기준 / 농약잔류허용기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '과실류 잔류농약: 미등록 농약 0.01 mg/kg 일률 기준. 중금속: 납 0.1 mg/kg, 카드뮴 0.05 mg/kg (복숭아 등). 방사선 조사 금지 품목 포함.', originalRequirement: 'Fruits pesticide MRL: unregistered pesticides 0.01 mg/kg uniform limit. Heavy metals: lead 0.1 mg/kg, cadmium 0.05 mg/kg (peaches). Some items prohibited from irradiation.', advisory: '수입 과일 잔류농약 검사 성적서 필수 구비. 복숭아류 중금속 기준 초과 사례 주의.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수입식품안전관리특별법 — 수입 과일', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '수입 과일 사전신고 의무(통관 24시간 전). 지정 정밀검사 대상: 잔류농약·중금속·미생물. 신고 미이행 시 반송 또는 폐기 처분. 외국 제조업소(과일 가공품) MFDS 등록 필요.', advisory: '수입 과일 부적합 적발 시 수출업체 전수검사 지정. 잔류농약 성적서 수출국 공인기관 발행본 사전 준비 필수.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: 'PLS 제도 — 과실류 잔류농약', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '과실류 미등록 농약 0.01 mg/kg 일률 기준. 등록 농약 개별 MRL 적용. 복숭아·사과·포도·감귤 집중 관리 품목. 훈증 처리 시 훈증제(메틸브로마이드) 잔류 기준 준수.', advisory: '수입 과일 잔류농약 초과 부적합 사례 다수. 원산지별 농약 사용 패턴 파악 후 검사 항목 결정 권장.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '방사선조사식품 기준 및 규격', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '허용 품목 및 선량: 감자·양파·밤 0.15 kGy 이하(발아억제). 건조 향신료 7 kGy 이하. 방사선 조사 사실 라벨 의무 표시("방사선 조사식품"). 비허용 품목에 방사선 조사 금지.', advisory: '방사선 조사 표시 미이행 시 적발·폐기 처분. 수출국에서 조사 처리된 과일 한국 허용 품목·선량 범위 내 여부 사전 확인.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '농수산물의 원산지 표시에 관한 법률 — 과일', lawUrl: 'https://www.law.go.kr/', requirement: '수입 과일 원산지(국가명) 표시 의무. 혼합 과일 제품 원산지별 비율 표시. 원산지 허위 표시 시 7년 이하 징역 또는 1억원 이하 벌금. 가공 과일(과즙·건과류 포함) 원재료 원산지 표시.', advisory: '원산지 둔갑 판매 단속 연중 강화. 가공 과일 제품 원재료 원산지 서류 보관 의무화.', },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 112 — Produce Safety / EPA Pesticide Tolerances', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112', requirement: 'FSMA Produce Safety Rule 대부분 과일 적용. 농업용수·토양 개량제·작업자 위생 기준 준수. EPA가 농약별·품목별 MRL(허용한계) 설정.', originalRequirement: 'FSMA Produce Safety Rule covers most fruits. Agricultural water, soil amendments, worker hygiene standards. EPA sets MRLs (tolerances) by pesticide-commodity combination.', advisory: 'FDA Import Alert 확인 후 수출. 표면처리제(왁스 등) 사용 시 표시 의무 및 성분 허가 여부 확인.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA AMS — 과일 등급 규격 (Grade Standards)', lawUrl: 'https://www.ams.usda.gov/grades-standards/fruit', requirement: '사과·배·감귤·포도·복숭아 Grade Fancy/Extra Fancy/No.1/No.2/Utility 기준 (크기·색택·결점·성숙도). 수입 과일 라벨에 등급 표시 권장. USDA 인증 검사관 검사 선택적.', originalRequirement: 'Grade standards for apples, pears, citrus, grapes, peaches (size, colour, defects, maturity). Grade labelling on imported fruit recommended. USDA Licensed Inspector inspection optional.', advisory: 'USDA 등급 표시 자율이나 오표시 시 위반. 수입 감귤류 왁스 코팅 표시(Coated with Food-Grade Resin) 별도 의무. 방사선 조사 과일 "Treated with radiation" 표시 FDA 의무.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA Import Alert — 수입 과일 자동 억류', lawUrl: 'https://www.accessdata.fda.gov/cms_ia/importalert_list.html', requirement: 'IA 99-33(곰팡이독소 초과), IA 28-04(클로람페니콜·항생제 잔류), 특정 국가 살모넬라 오염 이력 발령. 자동 억류 후 FDA 시험 통과 시만 통관 허용. 반복 적합 기록 제출 후 해제.', originalRequirement: 'Import Alerts: IA 99-33 (mycotoxin excess), IA 28-04 (chloramphenicol/antibiotic residues), country-specific Salmonella history. Automatic detention; release only after passing FDA testing. Repeated compliance records needed for delisting.', advisory: 'Import Alert 발령 국가·품목 수출 전 FDA 데이터베이스 확인 필수. 억류 해제까지 수출 전면 중단. EU·미국 동시 발령 가능 — 다중 시장 수출 시 통합 리스크 관리 필요.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 가공 과일 예방 통제', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '사과주스·잼·건과류 파튤린(Patulin) 위해요소 분석 필수. FDA 파튤린 권고 기준: 사과주스 ≤50 μg/kg. 건과류 수분 활성도(Aw) 관리. HACCP 기반 식품안전계획 의무.', originalRequirement: 'Apple juice, jam, dried fruits: Patulin hazard analysis required. FDA Patulin guidance: apple juice ≤50 μg/kg. Dried fruit Aw management. HACCP-based Food Safety Plan mandatory.', advisory: '파튤린 기준 초과 사과주스 미국 수출 즉시 금지. 건과류 수분·Aw 기록 공급업체 검증 시 활용. 가공 과일 FDA 시설 등록(21 CFR Part 1.230) 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Regulation (EC) 396/2005 — Pesticide MRLs / Reg 1333/2008 (Post-harvest treatments)', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '엄격한 MRL 적용. 클로르피리포스·메틸 금지. 포스트하베스트 살균제(예: 감귤 Thiabendazole) 별도 규제. 유기농 동등성 확인 필요.', originalRequirement: 'Strict MRLs; Chlorpyrifos, Chlorpyrifos-methyl banned. Post-harvest fungicide use (e.g., Thiabendazole on citrus) regulated separately. Organic equivalence checks.', advisory: 'EU 금지 농약 잔류 검출 시 수입 전량 폐기. 포스트하베스트 처리 성분 Annex I 해당 여부 확인 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1881/2006 — 과일류 곰팡이독소 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1881', requirement: '파튤린(Patulin): 사과주스 ≤50 μg/kg, 영아용 사과 제품 ≤10 μg/kg. OTA: 건포도 ≤10 μg/kg. 아플라톡신 B1: 건과류 ≤2 μg/kg. 건살구 SO₂ 잔류 기준 별도.', originalRequirement: 'Patulin: apple juice ≤50 μg/kg, infant apple products ≤10 μg/kg. OTA: dried grapes ≤10 μg/kg. Aflatoxin B1: dried fruits ≤2 μg/kg. Dried apricots: separate SO₂ limits.', advisory: '영아용 사과제품 파튤린 기준 훨씬 엄격(10 μg/kg) — 영아용 라벨 제품 별도 분석 필수. 건과류 OTA·아플라톡신 동시 검사 권장. EU 공인기관 성적서만 인정.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Art. 26 — 신선 과일 원산지 표시', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '대부분 신선 과일 EU 마케팅 기준(Reg 543/2011)에 의거 원산지 표시 필수. 포장 외부에 원산국 명칭 또는 ISO 코드 표시. 혼합 원산지 제품 "Origin: various" 허용(특정 조건).', originalRequirement: 'Most fresh fruit: country of origin required per EU marketing standards (Reg 543/2011). Country name or ISO code on outer packaging. "Origin: various" permitted for mixed origins under specific conditions.', advisory: '원산지 오표시 시 EU 회원국 세관·시장 감시 당국 적발 대상. 감귤류·딸기·키위 등 특정 품목 마케팅 기준 추가 요건(크기·색택) 병행 확인. 라벨 원산지-실제 원산지 불일치 즉각 회수 사유.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 543/2011 — 과일·채소 마케팅 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R0543', requirement: '사과·배·딸기·키위·레몬·오렌지·복숭아·포도 등 특정 품목 Class Extra/I/II 분류. 크기·최소 당도(Brix)·색택·결점 기준 적용. Class III 일부 허용(국내 판매 한정). 포장 외부 표시 의무.', originalRequirement: 'Specific products (apples, pears, strawberries, kiwi, lemons, oranges, peaches, grapes): Class Extra/I/II by size, minimum Brix, colour, defects. Class III limited to domestic sale. Outer packaging labelling mandatory.', advisory: 'Class 미표시 또는 기준 미달 Class 표시 EU 세관 적발 위험. 수출 전 EU 수입업체와 요구 Class 사전 협의. 감귤류 최소 Brix 기준 품종별 상이 — 품종별 확인 필수.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '農薬残留ポジティブリスト / 果実基準 (2026.04.01 CAA 이관)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '0.01 ppm 일률 기준 적용. 수입 감귤류: Thiabendazole 사용 시 표시 의무. 중국산 과일 검역 강화 지속.', originalRequirement: 'Uniform 0.01 ppm limit applies. Imported citrus: mandatory labelling if Thiabendazole applied. Strengthened quarantine on Chinese-origin fruits continues.', advisory: '소비자청 이관 후 수입 금지·제한 과일 리스트 최신 버전 확인. 검역 대상 병해충 기준도 함께 체크.', urgency: 'D-22 CAA' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '植物検疫法 — 수입 과일 검역', lawUrl: 'https://www.maff.go.jp/pps/', requirement: '수입 과일 植物検疫証明書 필수. 금지 병해충 발견 시 전량 폐기. 바나나·파인애플 등 열대과일 소독 조건 명시. 고위험 원산지 강화 검역 적용.', originalRequirement: '輸入果実は植物検疫証明書が必要。禁止病害虫発見時は全量廃棄。バナナ・パイナップル等の熱帯果実は消毒条件を明示。高リスク原産地は強化検疫を適用。', advisory: '수입 가능 과일 목록·검역 조건 植物防疫所 사전 확인 필수. 병해충 발견 시 전량 폐기 — 처리 비용 수출자 부담. 검역증명서 영문·일문 병기 권장.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '放射性物質 기준 — 수입 과일', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/housyasen/index.html', requirement: '수입 과일 방사성물질 기준: 일반식품 ≤100 Bq/kg(Cs-134+137 합계). 영유아식품 ≤50 Bq/kg. 수입 시 생산지 증명서 요구 가능.', originalRequirement: '輸入果実の放射性物質基準：一般食品≤100 Bq/kg（Cs-134+137合計）。乳幼児用食品≤50 Bq/kg。輸入時に産地証明書の提出を求める場合あり。', advisory: '방사성물질 기준 초과 시 전량 수입 금지. 동유럽·특정 아시아 원산지 생산지 증명서 사전 확인. 영유아용 가공 과일 제품은 50 Bq/kg 이하 기준 적용.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 과일 원산지·포스트하베스트', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '수입 과일 원산지 표시 의무. 포스트하베스트 농약(Thiabendazole 등) 사용 시 "防ばい剤使用" 표시 의무. 유기농 표시 시 JAS 유기 인증 필수. 당도 표시 임의.', originalRequirement: '輸入果実の原産地表示は義務。ポストハーベスト農薬（チアベンダゾール等）使用時は「防ばい剤使用」表示が義務。有機表示にはJAS有機認証が必要。', advisory: '포스트하베스트 농약 표시 누락 시 법 위반. TBZ(Thiabendazole) 사용 감귤 "防ばい剤使用" 표시 반드시 확인. 유기과일 JAS 인증 없이 "유기" 표시 불가.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '輸入食品 모니터링 — 과일류 강화 검사', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '농약다잔류 위험국산 과일 우선 정밀검사 지정. 수입신고(輸入届出) → 検疫所 → 지정검사기관 정밀검사. 강화 검사 대상 목록 매년 업데이트. 2026.04 CAA 이관 후 검사 기준 통합.', originalRequirement: '農薬多残留リスクの高い原産国の果実を優先的に精密検査に指定。輸入届出→検疫所→指定検査機関の精密検査。強化検査対象リストは毎年更新。', advisory: '강화 검사 대상 과일·원산지 CAA 모니터링 계획 연간 확인 필수. 부적합 시 해당 원산지 전체 강화 검사 확대 가능. 수출 전 잔류농약 목표 분석(Target Screening) 권장.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.11.26', law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '과일류 잔류농약 기준 2025.11.26 개정 발효. 수입 검사 강화. 중국어 원산지·성분 표시 의무.', originalRequirement: 'Pesticide MRL standards for fruits revised (effective 2025.11.26). Strengthened import inspection. Mandatory Chinese origin and ingredient labelling.', advisory: '개정 후 기준값 변경 항목(특히 熱帶水果) 우선 확인. 기존 검사 성적서 재검토 필요.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '植物防疫檢疫法 — 수입 과일 검역 (TFDA/BAPHIQ)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 과일 식물검역증명서(Phytosanitary Certificate) 필수. 금지 해충(地中海實蠅·東方果實蠅 등) 발견 시 훈증 처리 또는 전량 폐기. 바나나·망고·파파야 등 열대과일 소독 조건 명시.', originalRequirement: '進口水果須持有植物檢疫證明書。發現禁止害蟲（地中海果實蠅、東方果實蠅等）時須燻蒸或全量銷毀。香蕉、芒果、木瓜等熱帶水果需明確記載消毒條件。', advisory: '금지 해충 발견 시 통관 즉시 중단 — 훈증 비용 수출자 부담. 과일별 허용 수입 경로(Approved pathway) 사전 확인 필수. 검역 증명서 영문·한자 병기 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品中污染物質及毒素衛生標準 — 과일 방사성물질', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 과일 방사성물질: Cs-134+137 ≤100 Bq/kg. 피막제(WAX) 허용 첨가물 목록 확인 필수. 이산화황 처리 건과일 SO₂ 잔류기준 준수.', originalRequirement: '進口水果放射性物質：Cs-134+137≤100 Bq/kg。被膜劑（WAX）須符合許可清單。乾果SO₂殘留基準須遵守。', advisory: '방사능 기준 초과 원산국 수출 시 생산지 증명서 요구. 건과류 이산화황 잔류 검사 성적서 구비. WAX 처리 과일 허용 첨가물 목록 TFDA 확인.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '基因改造食品標示辦法 — GMO 과일 (>3% 의무)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'GMO 성분 함유율 >3% 의무 표시. GMO 파파야 주요 대상. Non-GMO 표시 시 공인기관 IP 핸들링 검증 필요. 목록 외 GMO 작물 수입 금지.', originalRequirement: 'GMO成分含有率>3%須強制標示。基改木瓜為主要對象。非基改標示須經公認機構IP管理驗證。未列名之基改作物禁止進口。', advisory: 'GMO 파파야 함유 과일 제품 표시 의무 확인. Non-GMO 강조 표시 시 IP 문서 구비. 수입 GMO 작물 목록(식품안전관리법) 사전 확인.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 수입 과일 원산지·유기 표시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 과일 원산지(原產地) 의무 표시(국가명). 유기(有機) 표시 시 農業部 유기인증 필수. 당도(糖度) 표시 임의(JAS 유사 품질 표시기준 참조). 포장 단위별 중국어 라벨 의무.', originalRequirement: '進口水果須強制標示原產地（國家名）。標示有機時須具備農業部有機認證。糖度標示為任意。每包裝單位須有繁體中文標示。', advisory: '원산지 허위 표시 형사처벌 대상. 유기 과일 農業部 인증 유효기간 확인. 유기 인증 없는 "천연" 등 유사 표현 금지.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Plant Quarantine Act — 수입 과일 DOA 식물검역', lawUrl: 'https://food.fda.moph.go.th/', requirement: '수입 과일 DOA(농업부) 식물검역 증명서 필수. 금지 병해충 발견 시 훈증 처리(methyl bromide·phosphine) 또는 전량 폐기. 특정 과일 수입 금지 목록 DOA 사전 확인.', originalRequirement: 'ผลไม้นำเข้าต้องมีใบรับรองสุขอนามัยพืชจากกรมวิชาการเกษตร（DOA）พบศัตรูพืชต้องรมควันหรือทำลาย ตรวจสอบรายชื่อผลไม้ต้องห้ามนำเข้ากับ DOA ล่วงหน้า', advisory: '금지 해충 발견 시 훈증 비용 수출자 부담. 특정 과일 수입 가능 경로(pathway) DOA 사전 확인 필수. 검역 증명서 태국 DOA 요구 형식 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH — 잔류농약 기준 (Codex 준용, 과일류)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '수입 과일 Codex MRL 기준 준용. MOPH 고시 특정 농약 기준 우선 적용. Chlorpyrifos ≤0.01 mg/kg. 목록 외 농약 Codex MRL 또는 0.01 mg/kg 일률.', originalRequirement: 'ผลไม้นำเข้าใช้ค่า MRL ตาม Codex มาตรฐาน MOPH ประกาศเฉพาะจะใช้ก่อน คลอร์ไพริฟอส≤0.01 mg/kg สารกำจัดศัตรูพืชที่ไม่ได้ระบุใช้ Codex MRL หรือ 0.01 mg/kg', advisory: 'Chlorpyrifos EU 금지 농약 태국도 강화 기준. Codex MRL 미설정 농약 0.01 mg/kg 적용. 잔류농약 검사 성적서 Codex 기준 대조 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Thai FDA eSubmission — 가공 과일 라벨 심사', lawUrl: 'https://food.fda.moph.go.th/', requirement: '건과일·캔·과즙·과일 가공품 Thai FDA eSubmission 라벨 사전 심사 의무. 수입신고 의무. 태국어 라벨 필수. 영양성분표 태국어 표기.', originalRequirement: 'ผลไม้แปรรูป（อบแห้ง กระป๋อง น้ำผลไม้）ต้องผ่าน eSubmission ของ อย. ต้องแจ้งนำเข้า ฉลากภาษาไทยบังคับ ข้อมูลโภชนาการเป็นภาษาไทย', advisory: '신선 과일은 eSubmission 불필요하나 가공 과일은 필수. 과일 음료·주스 별도 카테고리 분류 확인. 수입 허가 갱신 주기 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'GAP / ACFS 유기인증 — 태국 수출 과일', lawUrl: 'https://food.fda.moph.go.th/', requirement: '태국 수출 농산물 DOA GAP 인증 권고. 유기 과일 ACFS(농업협동조합부) 유기인증. EU·미국 수출 시 유기 동등성 확인. 유기 표시 무허가 사용 금지.', originalRequirement: 'ผลไม้ส่งออกควรได้รับการรับรอง GAP จาก DOA ผลไม้ออแกนิคต้องได้รับการรับรองจาก ACFS ตรวจสอบการยอมรับความเท่าเทียมกันสำหรับการส่งออกไปยัง EU และสหรัฐฯ', advisory: 'GAP 인증 수출 경쟁력 강화. ACFS 유기인증 EU·미국 동등성 여부 수출 전 확인. 유기 표시 무허가 사용 적발 시 처벌.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC/MARA 植物检疫 — 수입 신선 과일 검역 허가', lawUrl: 'https://www.samr.gov.cn/', requirement: '중국 수입 과일은 GACC·MARA(农业农村部) SPS 협정 체결 국가에서만 허가. 한국 ↔ 중국 허가 과일 목록 GACC 사전 확인 필수. 식물검역 증명서 매 선적마다 제출. 금지 병해충 발생 시 즉시 수입 정지.', originalRequirement: '进口鲜果须在与中国签署SPS协议的国家中选择。须提前确认GACC批准的韩国出口水果清单。每批次须附植物检疫证书。发现检疫性有害生物时立即暂停进口。', advisory: '한국 수출 가능 과일 목록(GACC 승인) 사전 확인 필수 — 미승인 품목 수출 절대 불가. 병해충 발생국 지정 시 즉시 중단. 수출 전 MARA 식물검역 협정 현황 최신 확인 필수.', urgency: '주의' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2763-2021 — 食品中农药最大残留限量 (과일류)', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 과일 GB 2763-2021 농약 MRL 준수(10,000+항목). 클로르피리포스 ≤0.01 mg/kg. 포스트하베스트 처리제(Thiabendazole ≤0.05 mg/kg, Imazalil ≤2 mg/kg). 목록 외 농약 0.01 mg/kg 일률기준.', originalRequirement: '进口水果须符合GB 2763-2021农药最大残留限量（10,000+项目）。毒死蜱≤0.01 mg/kg。采后处理剂：噻菌灵≤0.05 mg/kg、抑霉唑≤2 mg/kg。目录外农药适用0.01 mg/kg一律基准。', advisory: 'GB 2763 기준 EU와 일부 상이 — 수출 전 로트별 잔류농약 검사 성적서 GB 2763 기준 대조 필수. 포스트하베스트 처리제 허용 목록·한도 사전 확인.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2762-2022 — 食品中污染物限量 (과일 중금속)', lawUrl: 'https://www.samr.gov.cn/', requirement: '카드뮴(Cd) ≤0.05 mg/kg(과일). 납(Pb) ≤0.1 mg/kg(과일). 수은(Hg) ≤0.01 mg/kg. 총 비소(As) ≤0.5 mg/kg. 방사성물질: 세슘-137 ≤100 Bq/kg.', originalRequirement: '镉（Cd）≤0.05 mg/kg（水果）。铅（Pb）≤0.1 mg/kg。汞（Hg）≤0.01 mg/kg。总砷（As）≤0.5 mg/kg。放射性物质：铯-137≤100 Bq/kg。', advisory: '중금속 성적서 매 선적 시 구비 권장. 방사성물질 기준 원산지별 요구 — 일부 원산국 추가 증명서 요구. 카드뮴 기준 초과 시 전량 반송.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: '基因改造食品标识办法 — GMO 과일 (파파야 등)', lawUrl: 'https://www.samr.gov.cn/', requirement: 'GMO 파파야 등 GM 과일 전 성분 의무 표시. 함량 기준 없이 GMO 원료 사용 시 표시 의무(EU·TW와 달리 역치 없음). 가공 과일(잼·주스) GMO 원료 사용 시도 표시 의무.', originalRequirement: 'GMO木瓜等转基因水果须强制标识。与EU（0.9%）和TW（3%）不同，中国无最低含量阈值——只要使用转基因原料即须标识。加工水果（果酱·果汁）使用转基因原料同样须标识。', advisory: 'GMO 표시 중국이 가장 엄격 — 역치 없음. Non-GMO 인증 확보 또는 GMO 표시 의무 이행 선택. Non-GMO 표시 시 별도 증명서 필요.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 进口许可 + GB 7718 — 수입 과일 통관·표시', lawUrl: 'https://www.samr.gov.cn/', requirement: '원산지 증명서(C/O) 필수. 중국어(简体) 라벨: 품명·원산지·净含量·유통기한·수입업체 이름 전 항목 표기. 신선 과일 유통기한 미표시 허용(가공 과일은 의무). 수출 포장 검역 허가증 첨부.', originalRequirement: '须提供原产地证书（C/O）。简体中文标签：品名、原产地、净含量、保质期、进口商名称须全部标注。新鲜水果免标保质期（加工水果须标注）。须附出口包装检疫许可证。', advisory: '중국어 간체자 라벨 미부착 시 통관 거부. 원산지 증명서 C/O 발행 기관 GACC 인정 여부 확인. 수출 포장 목재 포장재 IPPC 마크 필수(木质包装).' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 과일 가공품 내 알레르겐 성분 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 17/2021/TT-BNNPTNT — 식물검역 (신선 과일)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '수입 신선 과일 MARD(농업농촌개발부) DOA 식물검역 증명서 필수. 베트남 미등록 병해충 발생국 수입 금지. 수입 허가 시 DOA 검역처리(소독·살충) 요구 가능. 원산지 증명서 필수.', originalRequirement: 'Quả tươi nhập khẩu cần Giấy chứng nhận kiểm dịch thực vật của DOA thuộc MARD. Cấm nhập khẩu từ các nước có sâu bệnh chưa đăng ký tại Việt Nam. DOA có thể yêu cầu xử lý kiểm dịch (khử trùng, diệt côn trùng). Giấy chứng nhận xuất xứ bắt buộc.', advisory: '신선 과일 수입 가능 국가·품목 목록 DOA 사전 확인 필수. 병해충 발생 시 즉시 수입 정지. 검역처리 요건 원산지별 상이 — 사전 협의 권장.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 36/2018/TT-BNNPTNT — 잔류농약 MRL (과일)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '수입 과일 잔류농약 Codex MRL 준용. 클로르피리포스 ≤0.01 mg/kg(Codex 2020 기준 강화). Thiabendazole ≤0.05 mg/kg(포스트하베스트). 목록 외 농약 Codex MRL 또는 0.01 mg/kg.', originalRequirement: 'Quả nhập khẩu tuân thủ MRL thuốc trừ sâu Codex. Chlorpyrifos≤0.01 mg/kg (theo Codex 2020 tăng cường). Thiabendazole≤0.05 mg/kg (sau thu hoạch). Thuốc trừ sâu không có trong danh sách: Codex MRL hoặc 0.01 mg/kg.', advisory: 'Codex MRL 2020 강화 기준 적용. 잔류농약 검사 성적서 수출 전 구비. Chlorpyrifos 0.01 mg/kg 기준 엄격 — 검사 필수.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-2:2011/BYT — 과일 중금속 기준', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '카드뮴(Cd) ≤0.05 mg/kg(과일). 납(Pb) ≤0.1 mg/kg. 수은(Hg) ≤0.01 mg/kg. 주석(Sn) ≤200 mg/kg(캔 과일). 중금속 검사 성적서 권장.', originalRequirement: 'Cd≤0.05 mg/kg（trái cây）. Pb≤0.1 mg/kg. Hg≤0.01 mg/kg. Sn≤200 mg/kg（trái cây đóng hộp）. Nên có giấy chứng nhận kim loại nặng.', advisory: '캔 과일 주석(Sn) 기준 확인. 중금속 성적서 자기선언 첨부 시 통관 원활. QCVN 8-2 기준 초과 시 전량 폐기.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP + Decree 111/2021 (舊 Decree 15 대체) — 자기선언·라벨링 (과일)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '가공 과일(잼·통조림·건과일) 자기선언(Tự công bố) 의무. 신선 과일은 자기선언 제외 — DOA 검역만 적용. 베트남어 라벨: 원산지·유통기한(DD/MM/YYYY)·수입업체 표기 의무. 영양성분표 베트남어.', originalRequirement: 'Quả chế biến (mứt, đồ hộp, quả sấy khô) bắt buộc Tự công bố. Quả tươi không cần Tự công bố — chỉ áp dụng kiểm dịch DOA. Nhãn tiếng Việt: nguồn gốc xuất xứ, hạn sử dụng (DD/MM/YYYY), nhà nhập khẩu. Nhãn dinh dưỡng tiếng Việt.', advisory: '신선 과일과 가공 과일 통관 절차 상이 — 제품 형태 사전 구분 필수. 가공 과일 Circular 24 첨가물 적합성 자기선언 동시 제출.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Badan Karantina Pertanian (BKP) — 수입 신선 과일 식물검역', lawUrl: 'https://www.pom.go.id/', requirement: '수입 신선 과일 BKP 식물검역 증명서(Phytosanitary Certificate) 필수. 수입 금지 과일 목록 Kementan(농업부) 사전 확인 필수. 특정 과일(사과·배·포도 등) 수입 가능 국가 협의 필요. 검역 처리(훈증·냉처리) 요구될 수 있음.', originalRequirement: 'BKP phytosanitary certificate mandatory for imported fresh fruits. Prohibited import list (Kementan Ministry of Agriculture) must be verified in advance. Certain fruits (apples, pears, grapes, etc.) require bilateral quarantine negotiation. Quarantine treatment (fumigation, cold treatment) may be required.', advisory: '수입 금지 과일 목록 Kementan 정기 업데이트 확인 필수. 신규 과일 수출 시 한-인도네시아 검역 협의(2~3년 소요) 사전 진행. 열대 과일(바나나·파인애플 등) 상대적으로 통관 용이.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 신선 과일 잔류농약·포스트하베스트', lawUrl: 'https://www.pom.go.id/', requirement: '잔류농약 Codex MRL 준용. 포스트하베스트 처리제(티아벤다졸·이마잘릴) 허용 기준 BPOM 사전 확인. 클로르피리포스 ≤0.01 mg/kg. 수입 시 잔류농약 성적서 제출 가능성 있음.', originalRequirement: 'Pesticide residues follow Codex MRL. Post-harvest fungicides (thiabendazole, imazalil) permitted limits require advance BPOM confirmation. Chlorpyrifos ≤ 0.01 mg/kg. Pesticide residue test report may be required upon importation.', advisory: '포스트하베스트 처리제 사용 감귤류 BPOM 허용 기준 사전 확인 필수. 잔류농약 성적서 공인검사기관 발행본 지참 권장. 클로르피리포스 기준 강화 추세 모니터링.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'BPOM ML — 가공 과일 제품 등록 (주스·잼·건과류)', lawUrl: 'https://www.pom.go.id/', requirement: '가공 과일(주스·잼·건과류·과일 통조림) BPOM ML 등록 필수. 라벨 인도네시아어 성분명·원산지·유통기한 의무 표기. 보존료 Permenkes 33/2012 허용 목록 준수.', originalRequirement: 'Processed fruits (juices, jams, dried fruits, canned fruits) require BPOM ML registration. Labels must include Indonesian-language ingredient names, origin, and expiry date. Preservatives must comply with Permenkes 33/2012 permitted list.', advisory: '신선 과일 ML 불필요하나 가공품은 반드시 ML 등록 후 수출. 인도네시아어 라벨 번역 오류 시 반품. 소규모 건과류 제품도 ML 등록 대상 — 사전 분류 확인.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 + PP 69 — 가공 과일 제품', lawUrl: 'https://www.pom.go.id/', requirement: '가공 과일(젤리·잼 등 젤라틴 함유) 2026.10.17 이후 할랄 인증 의무. 동물성 젤라틴·색소 사용 시 BPJPH 승인 할랄 증명 필수. 신선 과일은 할랄 의무 적용 제외.', originalRequirement: 'Processed fruits containing gelatine (jelly, jam) require BPJPH halal certification from October 2026. Animal-derived gelatine and colours require BPJPH-approved halal proof. Fresh fruits excluded from halal certification requirement.', advisory: '젤라틴 함유 젤리·잼 2026.10 전면 의무화 전 BPJPH 인증 확보 필수. 식물성 젤라틴(한천·카라기난) 대체 시 할랄 인증 용이. 신선 과일 수출은 할랄 불필요 — 가공 형태별 의무 여부 사전 확인.', urgency: '주의' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BPI SPS Import Permit — 수입 신선 과일 식물검역', lawUrl: 'https://www.fda.gov.ph/', requirement: '수입 신선 과일 BPI(Bureau of Plant Industry) SPS 수입허가 필수. 과일파리(Fruit Fly) 등 해충 검역 증명서 필요. 훈증 처리(MB·PH3) 성적서 요구. 미허가 원산지 수입 불가.', originalRequirement: 'BPI SPS Import Permit mandatory for all imported fresh fruits. Quarantine certificate for fruit fly and other pests required. Fumigation certificate (MB or PH3) required. Import from non-permitted origins not allowed.', advisory: '과일별 수입 가능 원산지 BPI 사전 확인 필수. 신규 수입 신청 심사 기간 3~6개월. 한국산 과일(배·사과) BPI 허가 상태 및 검역 처리 조건 수출 전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DA 잔류농약 MRL + 성적서 — 신선·건과류', lawUrl: 'https://www.fda.gov.ph/', requirement: '잔류농약 Codex MRL 준용. DA(농업부) 공인 시험기관 성적서 요구. 망고·바나나 등 열대 과일 글리포세이트 기준 확인. 미설정 농약은 0.01 mg/kg 기본 적용.', originalRequirement: 'Codex MRL applies for pesticide residues. Test reports from DA-accredited laboratories required. Glyphosate limits for tropical fruits (mango, banana) to be confirmed. Default 0.01 mg/kg for unspecified pesticides.', advisory: 'DA 공인 검사기관 성적서만 허용 — 한국 공인기관 성적서 필리핀 상호인정 여부 사전 확인. 열대 과일 클로르피리포스 잔류 주의 — 기준 강화 추세. 수입 전 최신 MRL 목록 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA CPR — 가공 과일(주스·잼·건과류) 등록', lawUrl: 'https://www.fda.gov.ph/', requirement: '가공 과일(주스·잼·통조림·건과류) FDA CPR 등록 + LTO 필수. 보존료 DOH BFAD 허용 목록 준수. 영양성분 표시 FDA AO 기준.', originalRequirement: 'Processed fruits (juices, jams, canned, dried fruits) require FDA CPR and LTO. Preservatives must be from DOH BFAD permitted list. Nutrition labelling per FDA AO standards required.', advisory: 'CPR 등록 소요 6~12개월 — 출시 일정 여유 확보. 신선 과일은 CPR 불필요하나 가공 형태로 전환 시 즉시 CPR 대상. 수입업체 LTO 보유 여부 계약 전 확인.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: '필리핀 소비세 — 가당 과일주스·음료 (TRAIN법)', lawUrl: 'https://www.fda.gov.ph/', requirement: '가당 과일주스·과일 음료 ₱6/L(천연감미료 외) 가당음료세 적용. 무가당 100% 과일주스: 세금 면제. HS코드 분류에 따라 관세율 상이. 수입 원가 산정 전 HS코드 사전 확인 필수.', originalRequirement: '100% fruit juice without added sugar: tax exempt. Sweetened fruit juices and drinks: ₱6/litre (non-natural sweeteners) sugar-sweetened beverage tax applies. Import duty varies by HS code. HS code classification must be confirmed before calculating import costs.', advisory: '100% 천연 과일주스 세금 면제 — 원료 혼합 비율 증명서 구비 권장. 가당 과일 음료 ₱6/L 세금 + 관세 이중 부담 — 원가 경쟁력 사전 분석 필수. 무가당 제품 라인 개발로 경쟁력 확보 고려.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Codex 준용. MAQIS 식물검역 증명서 필수. 수입 가공 과일·건과류: Food Regulations 1985 보존료·첨가물 기준 준수. 말레이어 라벨 의무. 방사선 조사 처리 제품 표시 필요.', originalRequirement: 'Codex-based pesticide MRLs apply. MAQIS phytosanitary certificate mandatory. Processed fruits and dried fruits: preservative/additive standards per Food Regulations 1985. Malay-language labelling required. Irradiation-treated products require disclosure.', advisory: '열대 과일 수출 유망 품목이나 MAQIS 검역 기준 엄격. 건과류·과일 가공품에 동물성 성분 사용 시 JAKIM 할랄 인증 병행 필요. 포스트하베스트 처리제 허용 여부 사전 확인.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'MAQIS 식물검역 강화 (2026.06) — 신선 과일', lawUrl: 'https://www.moh.gov.my/', requirement: '수입 신선 과일 Phytosanitary Certificate + DoA(말레이시아 농업부) 수입허가 병행. 방사선 조사 과일 표시("Telah Disinari") 의무. 특정 품목(열대 과일 병해충 위험) DoA 사전 협의.', originalRequirement: 'MAQIS phytosanitary certificate and DoA (Department of Agriculture Malaysia) import permit required concurrently. Irradiation-treated fruits must be labelled ("Telah Disinari"). High-risk tropical fruit pests require advance DoA consultation.', advisory: '2026.06 MAQIS 강화 이후 서류 1종 누락 시 즉각 반송. 방사선 조사 과일 라벨 미표시 시 관세청 적발 후 전량 폐기. DoA 수입허가 소요 2~4주 — 사전 신청 필수.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 — 건과류 보존료 SO₂ 기준', lawUrl: 'https://www.moh.gov.my/', requirement: '건과류 SO₂ 잔류 기준: 건살구 ≤2,000 mg/kg, 건자두 ≤1,000 mg/kg. 안식향산 ≤500 mg/kg(과일주스). 동물성 성분 함유 가공 과일 JAKIM 할랄 인증 필요.', originalRequirement: 'Dried fruit SO₂ residue limits: dried apricots ≤ 2,000 mg/kg, dried prunes ≤ 1,000 mg/kg. Benzoic acid ≤ 500 mg/kg (fruit juices). Processed fruits containing animal-derived ingredients require JAKIM halal certification.', advisory: 'SO₂ 기준 초과 건과류 말레이시아 통관 거부 — 사전 성적서 확인 필수. 젤라틴 함유 과일 젤리 JAKIM 할랄 인증 없이 수출 불가. 말레이어 라벨 보존료 명칭 표기 의무.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.16 — 가공 과일 라벨 + JAKIM 할랄', lawUrl: 'https://www.moh.gov.my/', requirement: '가공 과일 영양성분 표시(에너지·당류·비타민C) 의무. 말레이어 성분명 표기. JAKIM 할랄 마크 인증 제품만 "HALAL" 표기 가능. 말레이어 유통기한 DD/MM/YYYY 형식.', originalRequirement: 'Mandatory nutrition labelling for processed fruits (energy, sugars, vitamin C). Malay-language ingredient names required. Only JAKIM-certified products may display "HALAL" mark. Expiry date in DD/MM/YYYY format in Malay.', advisory: '당류 표시 의무 — 설탕 첨가 과일 제품 말레이시아 소비자 당류 민감도 높음. 할랄 마크 미인증 제품 "HALAL" 표기 시 형사처벌 가능. 말레이어 라벨 현지 전문가 검수 권장.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 + 식물검역 — 신선 과일 수입 허가', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: 'CFIA Import Permit 필수 품목(감귤류·핵과류 등) 사전 확인 의무. 식물검역 증명서 원산국 정부 발급. 검역 해충 목록(CFIA Pest List) 준수.', originalRequirement: 'Pre-verification of CFIA Import Permit requirements for regulated fruits (citrus, stone fruits etc.) is mandatory. Phytosanitary certificate issued by national authority of country of origin required. Must comply with CFIA Pest List.', advisory: 'CFIA 수입 허가 필수 품목 목록 사전 확인. 식물검역 증명서 미비 시 입항 거부. 검역 해충 발견 시 전량 폐기 또는 반송.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'PMRA — 과일류 잔류농약 MRL (Pest Control Products Act)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '사과 디페노코나졸 ≤5 ppm, 포도 아세타미프리드 ≤0.7 ppm. PMRA MRL 데이터베이스 정기 확인 필수. 미설정 농약 ≤0.1 ppm 기본 기준 적용.', originalRequirement: 'Apple difenoconazole ≤ 5 ppm, grape acetamiprid ≤ 0.7 ppm. PMRA MRL database must be checked regularly. Default tolerance of ≤ 0.1 ppm applies to pesticides with no specific MRL set.', advisory: 'PMRA MRL 미설정 농약은 기본 0.1 ppm 적용 — EU·한국보다 엄격할 수 있음. 캐나다 수출 전 PMRA 데이터베이스 교차 확인 필수.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada / CFIA — 가공 과일 곰팡이독소 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '사과주스 파튤린(Patulin) ≤50 μg/kg. 건과류 OTA ≤10 μg/kg. 공인기관 성적서 필수.', originalRequirement: 'Patulin in apple juice ≤ 50 μg/kg. OTA in dried fruits ≤ 10 μg/kg. Test report from accredited laboratory mandatory.', advisory: '사과주스·사과 퓌레 파튤린 기준 엄격 준수. 건과류 OTA 초과 즉시 수입 거부. 가공 전 원료 과일 품질 관리로 파튤린 예방.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA 원산지 표시 + FOPL — 신선·가공 과일', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '신선 과일 원산지 표시 의무. 영어·불어 이중 표기 필수. 가공 과일(잼·주스) FOPL 고당류 경고 라벨 2026.01.01부터 의무화.', originalRequirement: 'Country of origin labelling mandatory for fresh fruits. Bilingual English/French required. Processed fruits (jams, juices) subject to FOPL high-sugar warning label from 2026.01.01.', advisory: '가공 과일 제품 FOPL 도입 전 당류 함량 점검. 원산지 표시 누락 시 통관 거부. 영어·불어 이중 원산지 표기 필수.', enforcementDate: '2026.01.01' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'FSANZ Standard 1.4.1 / DAFF Biosecurity (Plant Quarantine)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'FSANZ 잔류농약 MRL 목록 준수. 포스트하베스트 처리제(Thiabendazole 등) 허용 목록 확인 필수. DAFF 식물검역 입항 신고 의무. 일부 신선 과일 검역 처리(증열·냉처리) 요구.', originalRequirement: 'Must comply with FSANZ MRL List for pesticide residues. Post-harvest fungicides (e.g. Thiabendazole) must be on FSANZ approved list. DAFF phytosanitary entry inspection mandatory. Certain fresh fruits require approved import pathway or treatment upon arrival.', advisory: '호주는 신선 과일 검역 세계 최고 수준 엄격. 수입 가능 과일 목록(Approved Pathways) DAFF 사전 확인 필수. 가공 과일 제품은 FSANZ 식품첨가물 목록 내 성분만 사용 가능.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'DAFF Biosecurity — 신선 과일 수입 승인 경로 (BICON)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'DAFF BICON 시스템에서 과일별 수입 승인 경로 사전 확인 필수. 체리·망고·감귤·딸기 등 품목별 승인 경로 상이. 미승인 경로 수입 불가.', originalRequirement: 'Import conditions for each fruit must be verified in DAFF BICON system before export. Approved import conditions vary by species (cherries, mangoes, citrus, strawberries etc.). Importation via non-approved pathways prohibited.', advisory: '호주 신선 과일 검역 세계 최고 수준 엄격. BICON 사전 조회 필수 — 미조회 시 입항 거부. 일부 품목 검역 처리(증열·냉처리·방사선) 요구.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.4.1 — 과일류 오염물질 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '파튤린: 사과주스 ≤50 μg/kg, 영아용 ≤10 μg/kg. OTA: 건포도 ≤10 μg/kg. 납(과일) ≤0.1 mg/kg. 공인기관 성적서 구비.', originalRequirement: 'Patulin: apple juice ≤ 50 μg/kg, infant products ≤ 10 μg/kg. OTA: raisins ≤ 10 μg/kg. Lead in fruits ≤ 0.1 mg/kg. Test report from accredited laboratory required.', advisory: '건과류 OTA 기준 수출 전 공인 성적서 필수. 사과주스 파튤린 기준 영아용은 더 엄격 — 별도 성적서 구비. FSANZ 오염물질 목록 정기 확인.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.1 + 1.2.7 — 가공 과일 라벨링', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '혼합 과일음료 과일 함량 % 표시 의무. 영양성분표 필수. 첨가당 구분 표시 권장. Health Star Rating 적용 가능(음료류 점수 영향 큼).', originalRequirement: 'Mixed fruit beverages must display fruit content percentage. Nutrition Information Panel mandatory. Distinguishing added sugars recommended. Health Star Rating applicable (significantly affects beverage scores).', advisory: '과일 함량 표시 없으면 주요 성분 표시 의무 위반. HSR 점수 음료류에 불리할 수 있음 — 사전 계산 권장. 첨가당 분리 표시로 소비자 신뢰도 제고.', enforcementDate: '시행 중' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO 잔류농약 MRL / UAE MoCC 식물검역 / ESMA 등록 (가공 과일)', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 기준 잔류농약 MRL 준수. 신선 과일 Phytosanitary Certificate 의무. 에탄올 기반 보존제 사용 할랄 저해 — 대체 보존제 사용 권장. 건과류·가공과일 ESMA 등록 의무. 아랍어 라벨 전 항목.', advisory: '포도·딸기 등 특정 신선 과일 검역 강화 대상 여부 MoCC 사전 확인. 에탄올 보존제 사용 제품 UAE 수출 제한 가능성. 건과일 아랍어 유통기한·보관방법 표기 누락 시 통관 거부.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 021/2011 / Rosselkhoznadzor 식물위생 / EAEU 곰팡이독소 기준', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'Rosselkhoznadzor 식물검역 증명서 의무. 건과류·견과류 곰팡이독소(아플라톡신·오크라톡신) EAEU 기준 성적서 구비. EAC 인증 + 국가위생증명서(СГР) 필수(가공품). 러시아어 라벨 의무.', advisory: '건과류 곰팡이독소 EAEU 기준이 EU보다 엄격한 경우 있음 — 별도 성적서 구비. Rosselkhoznadzor 검역 시 샘플링 검사 빈번. 신선 과일 계절·원산지별 수입 금지 현황 수출 전 확인.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Ordinance Cap 612 / Cap 132CM 잔류농약 기준', lawUrl: 'https://www.cfs.gov.hk/', requirement: '신선 과일: 수입 허가 불필요, 잔류농약 기준 Cap 132CM(Codex 기반) 준수. 가공 과일 제품(주스·잼): 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 방부제 Cap 132U Regulations 허용 목록 준수.', originalRequirement: 'Fresh fruits: no import permit required; pesticide residues governed by Cap 132CM (Codex-based). Processed fruit products (juices, jams): mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling. Preservatives must be from Cap 132U Regulations permitted list.', advisory: '홍콩 CFS MRL이 Codex와 일부 다를 수 있음 — 수출 전 최신 목록 확인. 방부제 사용 시 Cap 132U Regulations 허용 목록 준수 필수. 가공 과일 제품 번체자 라벨 누락 시 판매 거부.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132CM — 포스트하베스트 처리제 MRL (신선 과일)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '포스트하베스트 처리제(이마잘릴·티아벤다졸 등) 홍콩 Cap 132CM MRL 사전 확인 필수. Codex와 일부 기준 상이. 미설정 성분은 0.01 mg/kg 또는 CFS 문의. 수입 시 MRL 초과 제품 즉시 판매 금지.', originalRequirement: 'Post-harvest treatment agents (imazalil, thiabendazole, etc.) must comply with Hong Kong Cap 132CM MRL — verify before export as some limits differ from Codex. Unspecified substances: 0.01 mg/kg default or consult CFS. MRL-exceeding imports face immediate removal orders.', advisory: '포스트하베스트 처리제 사용 시 CFS 최신 MRL 데이터베이스 교차 확인 필수. 검사 성적서 없이 통관 후 적발 시 전량 회수. 한국 수출 감귤류 이마잘릴 성적서 지참 강력 권장.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132U — 가공 과일 보존료 (방부제 목록)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '가공 과일(잼·주스·건과류): SO₂ 잔류 기준 독자 적용(건과일 ≤2,000 mg/kg). 허용 보존료 Cap 132U 목록 준수. 안식향산 ≤500 mg/kg(과일주스). 소르빈산 허용 기준 확인 필수.', originalRequirement: 'Processed fruits (jams, juices, dried fruits): SO₂ residue limits independently set (dried fruits ≤ 2,000 mg/kg). Permitted preservatives from Cap 132U list only. Benzoic acid ≤ 500 mg/kg (fruit juices). Sorbic acid permitted amounts must be confirmed.', advisory: 'SO₂ 기준 Cap 132U와 Codex 상이 — 건과일 수출 전 홍콩 독자 기준 확인 필수. 가공 과일 방부제 성분 성적서 통관 시 지참 권장. 번체자 라벨 누락 시 판매 거부.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food Safety Order — 중국 원산지 신선 과일 + Cap 612 기록 의무', lawUrl: 'https://www.cfs.gov.hk/', requirement: '일부 중국산 신선 과일 CFS 등록 공급업체 경유 의무. 수입업체 공급망 추적 기록 3개월 보관(Cap 612). 원산지 증명서 + 위생 증명서 수입 시 보관.', originalRequirement: 'Certain fresh fruits of Chinese Mainland origin must be sourced through CFS-registered suppliers. Importers must maintain food traceability records for 3 months (Cap 612). Certificate of origin and health certificate must be retained upon importation.', advisory: '중국산 신선 과일 공급업체 CFS 등록 여부 수입 전 확인 필수. 기록 미보관 시 Cap 612 위반 처벌. 기타 원산지 신선 과일은 수입 허가 불필요하나 Cap 132CM MRL 준수 의무.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 396/2005 / UK Food Safety Act 1990', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained MRL 준수. 신선 과일 DEFRA 식물검역 입항 신고(IPAFFS) 의무. 가공 과일 제품: UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. 포스트하베스트 처리제 UK 별도 승인 목록 확인 필수.', originalRequirement: 'Must comply with UK Retained MRL list. Fresh fruits require DEFRA phytosanitary entry notification (IPAFFS). Processed fruit products: UK Retained Food Additives Regulation. English-only labelling. Post-harvest treatment agents must be on UK-specific approved list.', advisory: 'Brexit 이후 EU 승인 포스트하베스트 처리제가 UK에서 불허될 수 있음 — FSA 최신 목록 확인 필수. IPAFFS 사전 등록 없이 입항 불가. Northern Ireland 수출 시 EU 식물검역 규정 적용(별도).', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'VPRÜ (잔류농약) / Verordnung über pflanzliche Lebensmittel / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VPRÜ 잔류농약 기준(EU MRL과 대부분 동일). 가공 과일 제품: LMG 식품 안전법 준수. 유기농 과일 Bio Suisse 인증. 국내 언어 최소 1개 라벨 의무. 신선 과일 식물검역 증명서 필요.', originalRequirement: 'Pesticide MRLs per VPRÜ (largely aligned with EU MRL). Processed fruit products: must comply with Swiss LMG. Organic fruits: Bio Suisse certification required. Labelling in at least one Swiss national language mandatory. Fresh fruits require phytosanitary certificate.', advisory: '스위스 유기농 과일 시장 규모 크고 Bio Suisse 인증이 사실상 시장 진입 요건. VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 확인. 포스트하베스트 처리제 스위스 허용 목록 EU와 상이할 수 있음.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Plan Ecophyto 2030 농약 감축 목표로 수입 과일 잔류농약 강화 집행. Loi Egalim: EU에서 금지된 농약 사용 국가 원산지 수입 과일 제한 추진(상호주의 원칙). 과일 가공품(주스·잼) Nutri-Score 의무 표시. 글리포세이트 잔류 강화 모니터링.', originalRequirement: '[Strict Local Rule] Plan Ecophyto 2030 pesticide reduction driving stricter enforcement on imported fruit residues. Loi Egalim: ongoing push to restrict fruit imports from countries using EU-banned pesticides (reciprocity principle). Processed fruit products (juices, jams): Nutri-Score labelling mandatory. Enhanced glyphosate monitoring.', advisory: '[EU Deviation] Loi Egalim 상호주의 조항이 확대 시행될 경우 EU 금지 농약 사용 국가 원산지 과일 프랑스 수출 제한 가능 — 원산지 농약 사용 기록 준비 권장. 과일 주스 Nutri-Score 점수 사전 확인.' },
        {
          country: 'France (DGCCRF) [🚨 EU Divergence]',
          flag: '🇫🇷',
          enforcementDate: '2026.01.07',
          law: 'France Emergency Pesticide Import Ban — EU 금지 농약 5종 Zero Tolerance (2026.01.07)',
          lawUrl: 'https://www.economie.gouv.fr/dgccrf',
          requirement: '🚨 [즉시 시행] EU 사용 금지 농약 5종 — ① 카르벤다짐(Carbendazim) ② 베노밀(Benomyl) ③ 글루포시네이트(Glufosinate) ④ 티오파네이트메틸(Thiophanate-methyl) ⑤ 만코제브(Mancozeb) 잔류 "검출" 자체 수입 전면 금지(Zero Tolerance). 영향 품목: 과일·채소·곡류·두류·감자 등.',
          advisory: '⚠️ 미검출(ND) 공인기관 성적서 없이 프랑스 통관 불가. 해당 농약 사용 원료 공급망 전환 검토. EU 금지 농약 전체 목록 DGCCRF 최신본 확인.',
          urgency: '긴급',
        },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[FI] Soft Drink Tax (과일 주스 포함) / [HU] NETA 2011 / [DK] Sugar Tax Discussion', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 핀란드 가당음료세: 가당 과일 주스·넥타르 포함 적용(당류 0.5g/100mL 초과 시). 헝가리 NETA: 가당 과일 음료·과일 에너지드링크 세금 부과. 덴마크: 설탕세 재도입 논의 중(과일 주스 포함). Nutri-Score 자율 권장 국가(독일·벨기에): 과일 제품 점수 표시 시장 경쟁력 강화.', originalRequirement: '[EU Divergence] Finland soft drink tax: applies to sweetened fruit juices and nectars (>0.5g/100mL sugar). Hungary NETA: sweetened fruit drinks and energy drinks taxed. Denmark: sugar tax reintroduction under discussion (including fruit juices). Nutri-Score recommended for fruit products in voluntary countries (Germany, Belgium).', advisory: '가당 과일 음료 핀란드·헝가리 수출 시 세율 부과 규모 사전 계산 필수. 100% 과일 주스(무가당) 세금 면제 여부 핀란드 법령 확인. 저당 과일 음료 설계로 추가 세부담 회피 권장.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 396/2005 + [Local] LFGB / Pflanzenschutzgesetz / BVL RASFF 집행', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Enforcement] BVL 과일류 잔류농약·중금속 집중 모니터링. 수입 과일 Post-harvest 처리제(방부제·왜스 코팅) — LFGB §11 독일어 표시 의무 + EU MRL 준수 의무. 열대 과일(망고·파파야·바나나) BVL 강화 검사 빈도 높음. 건과일 아플라톡신 — Reg (EC) 1881/2006 EU 기준 독일 BVL 집행.', advisory: 'BVL 연간 과일 모니터링 보고서 사전 참조 권장. 망고·아보카도 등 열대 과일 Post-harvest 처리제 성적서(MRL 준수 입증) 구비 필수. 건과일 아플라톡신 독일 통관 검사 빈도 높음 — 로트별 성적서 준비 권장.' },
    ],
  },
  dairy: {
    title: 'Dairy & Milk Products — Global Regulations',
    icon: Milk,
    rows: [
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '축산물 위생관리법 / 유가공품 기준 및 규격', lawUrl: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%B6%95%EC%82%B0%EB%AC%BC%EC%9C%84%EC%83%9D%EA%B4%80%EB%A6%AC%EB%B2%95', requirement: '원유: 체세포수 ≤ 400,000/mL, 세균수 ≤ 100,000/mL. 살균 의무 (저온살균 63°C 30분 또는 동등 이상). 항생제 잔류 불검출. 무항생제 인증 표시 기준 별도 적용.', originalRequirement: 'Raw milk: SCC ≤ 400,000/mL, bacteria ≤ 100,000/mL. Pasteurisation mandatory (≥63°C/30 min or equivalent). Antibiotic residues not detected. Antibiotic-free certification label rules apply separately.', advisory: '분유·조제유류는 식약처-MAFRA 이중 관할. 수출 시 수입국 유가공품 허가 상태 사전 확인 필수.' },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 우유류 기준 및 규격', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '살균우유: HTST(72°C/15초 이상) 또는 UHT(135°C/2초 이상) 의무. 유지방 ≥3.0%, 무지유고형분 ≥8.0%(시유 기준). 세균수 ≤50,000 CFU/mL(살균 후), 대장균군 불검출. 항생물질 잔류 불검출.', advisory: '살균 기준 미달 시 전량 폐기 처분. 항생물질 잔류 검사 자체 QC 시스템 구축 필수.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 멸균우유 및 가공유 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '멸균우유: 세균 불검출. UHT(135°C/2초 이상) 처리 후 무균 충전 의무. 멸균 표시 의무. 개봉 후 냉장 보관·기간 표시 의무. 가공유(초코우유·딸기우유 등): 합성착색료 사용 기준 준수.', advisory: '멸균우유 수출 시 수입국 UHT 처리 온도·시간 기준 상이 여부 확인. 가공유 합성착색료 MFDS 식품첨가물 공전 목록 확인.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '조제분유 및 영아용 조제식 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '조제분유: 비타민D 300~1,000 IU/100kcal, 아이오딘 10~50 μg/100kcal. DHA 선택적 첨가 허용(총 지방산의 0.2~0.5%). 멜라민·아플라톡신M1(≤0.025 μg/kg) 기준 준수. GMO 원료 0.9% 초과 시 표시.', advisory: '조제분유 멜라민 기준 강화 지속. 아이오딘 함량 부족 사례 주기적 점검 필요. 수입 분유 외국 제조업소 MFDS 등록 필수.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: 'HACCP 의무화 — 유제품 제조업', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '유가공업 HACCP 의무 적용. HACCP 계획: CCP(중요관리점) 설정·모니터링·기록. 냉장 유통 체계(콜드체인) 전 과정 관리. 정기 HACCP 현장 조사(식약처·지자체 연 1회 이상).', advisory: 'HACCP 미인증 유가공 시설 제품 대형마트·급식 납품 제한. 수입 유제품 수출국 HACCP 상응 인증 서류 구비 필수.', },
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품 등의 표시·광고에 관한 법률 — 유제품 표시', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '소비기한 표시 의무(2023.01 유통기한→소비기한 전환). 냉장 보관 조건(0~10°C) 표시 의무. 유지방·단백질·당류 영양성분표 표시. "무지방" "저지방" 강조 표시 기준 준수.', advisory: '2023.01부터 소비기한(Safety date) 표시 전환. 기존 유통기한 표시 재고 처리 주의. "고단백" 표시 기준값 충족 여부 확인.', },
      { country: 'USA (FDA / USDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 131 — Milk & Cream / PMO (Grade A Pasteurized Milk Ordinance)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-131', requirement: 'Grade A 기준: 체세포수 ≤ 750,000/mL. 살균 의무. 치즈·버터·요거트 성분 기준 (21 CFR Parts 131-135). 영양성분표 내 첨가당 표시 의무.', originalRequirement: 'Grade A standards: SCC ≤ 750,000/mL. Pasteurisation mandatory. Standards of identity for cheese, butter, yogurt (21 CFR Parts 131-135). Added sugars declaration on Nutrition Facts.', advisory: 'PMO 최신 버전(2023 edition) 준수 여부 확인. 유사 유제품(lactose-free, plant-based) 명칭 사용 시 별도 FDA 기준 적용.' },
      { country: 'USA (FDA / USDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA AMS Dairy Programs — 낙농제품 등급 인증', lawUrl: 'https://www.ams.usda.gov/grades-standards/dairy', requirement: 'Grade AA 버터: 풍미·조직감·색택 기준 (AMS Circular ADA). Grade A 치즈·분유: 위생 기준 + USDA Shield 인증. 수입 유제품 동등 기준 USDA 증명 서류 필요.', originalRequirement: 'Grade AA butter: flavour, body, colour standards (AMS Circular ADA). Grade A cheese and dry milk: sanitary standards + USDA Shield. Imported dairy products require equivalent standard documentation.', advisory: 'USDA Shield 없이 등급 표시 금지. 수입 치즈 USDA 등급 동등성 증명 어려움 — 수입업체와 사전 협의 필수. 유기농 유제품은 USDA NOP 인증 별도 요구.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA Draft Guidance (2023) — 식물성 우유 대체품 라벨', lawUrl: 'https://www.fda.gov/food/guidance-documents-regulatory-information-topic/food-labeling', requirement: '"오트 음료(Oat Beverage)" 등 서술적 명칭 사용 권장. "Milk" 명칭: 동물 원산 우유에만 허용. 영양 비교 표시("Lower in calcium than dairy milk") 자발적 권장. 알레르겐 표시 21 CFR 101.4 기준.', originalRequirement: 'Descriptive names like "Oat Beverage" recommended. "Milk" term: reserved for animal-origin milk. Voluntary nutrient comparison statement encouraged. Allergen labelling per 21 CFR 101.4.', advisory: '2023 Draft Guidance 최종 규칙 아직 미확정 — 확정 시 즉각 라벨 개정 필요. "Plant-based milk" 표현 현재 묵인되나 향후 변경 가능. 대두음료는 대두 알레르겐 표시 필수.', urgency: 'DRAFT' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 유제품 예방 통제', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '연질치즈·훈제 어류 등 고위험 제품 리스테리아 환경 모니터링 의무. 환경 샘플링 계획 문서화. 양성 검출 시 시정 조치 기록. 살균 공정 CCPs 검증.', originalRequirement: 'Environmental monitoring for Listeria mandatory for high-risk products (soft cheeses, smoked fish). Environmental sampling plan documented. Corrective action records for positive findings. Pasteurisation process CCPs verified.', advisory: '리스테리아 환경 모니터링 빈도·위치 FDA 기준 준수. 양성 결과 즉각 시정 조치·기록·FDA 보고(필요 시). 연질치즈 제조 시설 연간 FDA 점검 대상.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 853/2004 Annex III Section IX / Reg 1169/2011 — Labelling', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853', requirement: '열처리 표시 의무. 치즈·버터·크림 성분 기준. "우유(Milk)" 명칭은 동물 원산에만 허용 (ECJ 판례). 원유 원산지 표시 라벨 의무.', originalRequirement: 'Heat-treatment marking mandatory. Compositional standards for cheese, butter, cream. "Milk" designation restricted to animal origin (ECJ ruling). Country of origin of milk required on label.', advisory: '원유 원산지 표시 의무(Reg 1169/2011 Art. 26) 준수 필수. 식물성 유제품 대체품은 "milk" 명칭 사용 불가.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1333/2008 — 유제품 허용 첨가물', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333', requirement: '아이스크림: E407(카라기난)·E471(모노글리세리드) 등 허용. 가공치즈: E452(폴리인산염) 허용. 요거트: E1422(아세틸화 이전분) 일부 허용. 카테고리별 최대 사용량 준수.', originalRequirement: 'Ice cream: E407 (carrageenan), E471 (mono/diglycerides) permitted. Processed cheese: E452 (polyphosphates) allowed. Yoghurt: E1422 (acetylated distarch adipate) some categories. Category-specific maximum use levels.', advisory: 'EU 유제품 첨가물 허용 목록 Annex II 카테고리별 상이 — 제품 유형 정확한 분류 필수. E171(이산화티타늄) 치즈 코팅 사용 금지(EU 전면 금지). 최신 개정 목록 EUR-Lex 정기 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '2020.04.01', law: 'Reg 1169/2011 Art. 26 — 우유 원산지 표시 의무', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '소비자 최종 판매용 우유·유제품 원산국 표시 의무 (2020.04.01~ 시행). 포장 전면 또는 주요 표시면에 "원산지: ○○" 표시. 혼합 원산지 시 전체 표시 또는 "EU/비EU" 구분.', originalRequirement: 'Country of origin mandatory for milk and dairy products for consumer sale (effective 2020-04-01). "Origin: [country]" on principal field of vision. Mixed origins: all countries listed or "EU/non-EU" distinction.', advisory: '원산지 표시 미이행 시 EU 회원국 식품 당국 행정 처분. 가공유제품(치즈·버터·요거트)도 원유 원산지 표시 적용. 수출 라벨 EU 언어 표시 + 원산지 병기 필요.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 2073/2005 — 유제품 미생물 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R2073', requirement: '리스테리아: 연질치즈 ≤100 CFU/g(유통 중). 살모넬라: 분유·영아용 제품 불검출(n=5, c=0). E. coli: 치즈·원유 기반 제품 카테고리별 기준. 응고효소 양성 황색포도상구균 기준 별도.', originalRequirement: 'Listeria: soft cheese ≤100 CFU/g during shelf life. Salmonella: dried infant formula absent (n=5, c=0). E. coli: category-specific limits for cheese. Coagulase-positive staphylococci separate criteria.', advisory: '연질치즈 리스테리아 유통기한 내 기준 초과 시 즉각 회수·RASFF. 분유·영아식품 살모넬라 기준 가장 엄격 — 제조 전 과정 위생 검증 필수. EU 수출 유제품 제조시설 EFSA 인정 여부 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '乳及び乳製品の成分規格等に関する省令 (CAA 이관 2026.04.01)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '우유 성분 기준: 유지방 3.0% 이상, 무지유고형분 8.0% 이상. 살균 의무. 알레르겐(우유) 의무 표시. 2026.04.01 소비자청으로 관할 이관.', originalRequirement: '牛乳成分規格：乳脂肪3.0%以上、無脂乳固形分8.0%以上。殺菌が義務。アレルゲン（乳）の表示が義務。2026年4月1日より消費者庁へ管轄移管。', advisory: 'CAA 이관 후 유제품 관련 허가·신고 창구 변경. 기능성표시식품 중 유제품 기반 제품도 CAA 심사 대상.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '乳等省令 — 成分規格 (牛乳·加工乳)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/milk/index.html', requirement: '牛乳 성분 기준: 유지방 ≥3.0%, 무지유고형분 ≥8.0%, 산도 ≤0.18%(젖산 환산). 살균 HTST 72°C/15초 이상 또는 동등 이상 처리 의무. 세균수 살균 후 ≤50,000 CFU/mL.', originalRequirement: '牛乳成分規格：乳脂肪分3.0%以上、無脂乳固形分8.0%以上、酸度0.18%以下（乳酸換算）。殺菌はHTST72°C/15秒以上または同等以上。殺菌後細菌数≤50,000 CFU/mL。', advisory: '수입 우유 동등 처리 증명 서류 필요. 유지방 분리 제품(탈지유·저지방유) 별도 성분 기준 적용. 乳等省令 최신 개정판 CAA 이관 후 창구 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '動物用医薬品 잔류기준 — 원유·유제품', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu02/index.html', requirement: '항생물질·합성항균제 원유 불검출 의무. 테트라사이클린 ≤0.1 mg/kg, 스트렙토마이신 ≤0.2 mg/kg, 암피실린 ≤0.004 mg/kg. 목록 외 물질 0.01 mg/kg 일률기준.', originalRequirement: '抗生物質・合成抗菌剤の原乳中不検出が義務。テトラサイクリン≤0.1 mg/kg、ストレプトマイシン≤0.2 mg/kg、アンピシリン≤0.004 mg/kg。リスト外物質は0.01 mg/kgの一律基準適用。', advisory: '항생제 잔류 초과 시 전량 폐기 조치. 수출국 축산물 항생제 사용 내역 서류 구비 권장. 목록 외 물질 0.01 mg/kg 일률기준 초과 시 수입 거부.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '育児用調製粉乳 기준 — 食品衛生法 告示', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: 'クロノバクター(Cronobacter spp.) 불검출(25g). 살모넬라 불검출(25g). 비타민D 1~2.5 μg/100kcal 의무. DHA 첨가 시 ARA 동시 첨가 권고. 아플라톡신M1 ≤0.025 μg/kg.', originalRequirement: 'クロノバクター（Cronobacter spp.）不検出（25g中）。サルモネラ不検出（25g中）。ビタミンD 1~2.5 μg/100kcal義務。DHA添加時はARA同時添加推奨。アフラトキシンM1≤0.025 μg/kg。', advisory: '조제분유 미생물 기준 매우 엄격 — 제조시설 GMP 인증 필수. 비타민D 함량 검사 성적서 구비 의무. DHA 첨가 제품 ARA 병용 여부 라벨 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — 乳製品 표시 기준', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '消費期限/賞味期限 구분 표시(우유 소비기한, 치즈·버터 상미기한). 알레르겐(乳) 의무 표시 8종 포함. 要冷蔵(0~10°C) 보관 조건 표시 의무. 제조자·판매자 정보 표시.', originalRequirement: '消費期限と賞味期限の区別表示（牛乳は消費期限、チーズ・バターは賞味期限）。アレルゲン（乳）義務表示（8品目に含む）。要冷蔵（0~10°C）保管条件表示が義務。', advisory: '소비기한·상미기한 혼동 주의 — 우유는 소비기한(안전 기한), 치즈·버터는 상미기한(품질 기한). 알레르겐 표시 누락 시 리콜 대상.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '輸入乳製品 수입 규정 — 検疫所 검사', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '원산국 위생증명서(health certificate) 필수. 牛乳·クリーム 일부 수입국 제한. 통관 시 성분 검사(유지방·단백질·세균수·항생물질). 부적합 시 전량 폐기·반송. 2026.04 CAA 이관.', originalRequirement: '原産国の衛生証明書（health certificate）が必要。牛乳・クリームは輸入元国の制限あり。通関時に成分検査（乳脂肪・タンパク質・細菌数・抗生物質）を実施。不適合は全量廃棄または積み戻し。', advisory: '수입 유제품 위생증명서 발행 기관·형식 사전 확인. 항생물질 잔류 검사는 반드시 공인기관 성적서 제출. CAA 이관 후 수입 신고 창구 업데이트 확인.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.06.24', law: '乳品類衛生標準 / 乳品名稱及標示規定 (2025.06 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '우유 제품명 및 표시 규정 2025.06.24 개정. 유지방 함량별 제품 명칭 기준 변경. 수입 유제품 검역 성적서 의무.', originalRequirement: '乳品名稱及標示規定於2025.06.24修訂。依乳脂肪含量分類之產品名稱基準變更。進口乳製品須附檢疫證明。', advisory: '2025.06 개정 제품명 기준 재검토 필수. "鮮乳" 등 명칭 사용 요건 변경 사항 확인.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '乳品類衛生標準 성분 기준 — 全脂牛乳', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '全脂牛乳: 유지방 ≥3.0%, 무지유고형분 ≥8.0%. 저지방 ≥1.0%. 살균 HTST 72°C/15s 이상. 세균수 ≤50,000 CFU/mL(살균 후). 대장균군 ≤10/mL.', originalRequirement: '全脂鮮乳：乳脂肪≥3.0%、無脂乳固形物≥8.0%。低脂≥1.0%。巴斯德殺菌72°C/15s以上。滅菌後細菌數≤50,000 CFU/mL。大腸桿菌群≤10/mL。', advisory: '성분 기준 미달 시 통관 거부. 세균수 검사 성적서 필수. 2025.06 개정 제품명 기준(全脂·低脂·脫脂) 라벨 적합성 재검토.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '動物用藥殘留標準 — 원유·유제품 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '테트라사이클린 ≤0.1 mg/kg. 스트렙토마이신 ≤0.2 mg/kg. 클로람페니콜 불검출. β-작용제 불검출. 원유 항생물질 전수 검사 의무.', originalRequirement: '四環黴素≤0.1 mg/kg。鏈黴素≤0.2 mg/kg。氯黴素不得檢出。β-促效劑不得檢出。原乳須全數檢驗抗生素殘留。', advisory: '클로람페니콜·β-작용제 불검출 기준 매우 엄격. 항생물질 초과 시 전량 반송. 공인기관 잔류 검사 성적서 구비 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '嬰兒配方食品 규격 — TFDA 고시', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'Cronobacter spp. 불검출(100g). 살모넬라 불검출(25g). 비타민D 1~2.5 μg/100kcal. DHA 첨가 시 ARA 동시 첨가 권고. 아플라톡신M1 ≤0.025 μg/kg.', originalRequirement: 'Cronobacter spp.不得檢出（100g中）。沙門氏菌不得檢出（25g中）。維生素D 1~2.5 μg/100kcal。添加DHA建議同時添加ARA。黃麴毒素M1≤0.025 μg/kg。', advisory: '영아용 분유 미생물 기준 초엄격. 제조시설 GMP 인증 필수. DHA 첨가 제품 ARA 병용 라벨 확인. 아플라톡신M1 정기 모니터링 권장.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '輸入乳製品 수입 규정 — TFDA eTrack', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'TFDA eTrack 수입신고 의무. 원산국 위생증명서 필수. 성분 규격 적합 성적서 제출. 방사능 검사 증명서(일부 원산국). 번체 중국어 라벨 의무.', originalRequirement: '須透過TFDA eTrack系統申報進口。原產國衛生證明書為必要文件。須提交成分規格合格成績書。部分原產國需放射能檢驗證明。繁體中文標示義務。', advisory: '수입 유제품 위생증명서 발행 기관·형식 사전 확인. 방사능 검사 요구 원산국(일본 등) 증명서 사전 취득. eTrack 미신고 시 통관 거부.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH Notification No. 265 — 유제품 위생기준 (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '전지우유: 유지방 ≥3.2%, 무지유고형분 ≥8.25%. 저지방 우유: 유지방 0.5~1.8%. 살균 HTST 72°C/15s 이상. UHT 허용. 세균수 ≤50,000 CFU/mL(살균 후).', originalRequirement: 'นมโคสด（Full fat）: ไขมันนม≥3.2%, ของแข็งนมไม่รวมไขมัน≥8.25%. นมไขมันต่ำ: 0.5~1.8%. พาสเจอร์ไรซ์ 72°C/15 วินาที UHT ได้รับอนุญาต จำนวนแบคทีเรีย≤50,000 CFU/mL', advisory: '성분 기준 미달 시 통관 거부. UHT 제품 무균 포장 증명 필요. 세균수 검사 성적서 MOPH 기준 적합 여부 확인.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'National Livestock Act — 원유 항생물질 (DLD)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '테트라사이클린 ≤0.1 mg/kg. 클로람페니콜 불검출. β-작용제(살부타몰·클렌부테롤) 불검출. 원유 항생물질 DLD 전수 검사 의무.', originalRequirement: 'ยาเตตราไซคลีน≤0.1 mg/kg คลอแรมฟีนิคอลห้ามตรวจพบ สารเบต้าอะโกนิสต์（ซัลบูทามอล, เคลนบูเทอรอล）ห้ามตรวจพบ ต้องผ่านการตรวจสอบยาปฏิชีวนะในน้ำนมดิบโดย DLD', advisory: '클로람페니콜 불검출 기준 매우 엄격. 항생물질 잔류 시 전량 폐기 조치. 공인기관 잔류 검사 성적서 구비 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH — 영아용 조제분유 허가 및 WHO Code (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '영아용 조제분유 Thai FDA 허가 필수. Cronobacter·살모넬라 불검출. 라벨 사전 심사 의무. 분유 마케팅 규제(WHO International Code 준수) — 무료 샘플 배포 금지.', originalRequirement: 'นมผงสำหรับทารกต้องได้รับอนุญาตจาก อย. ห้ามตรวจพบ Cronobacter และ Salmonella ฉลากต้องผ่านการตรวจสอบล่วงหน้า ห้ามแจกตัวอย่างฟรีตาม WHO International Code', advisory: 'WHO Code 위반 시 태국 법적 처벌 대상. 분유 광고·판촉 활동 엄격 제한. 허가 절차 약 6~12개월 소요 — 사전 준비 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'Thai FDA eSubmission — 수입 유제품 라벨 심사', lawUrl: 'https://food.fda.moph.go.th/', requirement: 'Thai FDA eSubmission 시스템 라벨 사전 심사 의무(가공 유제품). DLD 위생증명서 필수. 태국어 표시 의무 — 스티커 라벨 부착 허용. 영양성분표 태국어 의무.', originalRequirement: 'ผลิตภัณฑ์นมนำเข้าต้องผ่านการตรวจฉลากในระบบ eSubmission ของ อย. ต้องมีใบรับรองสุขอนามัยจาก DLD ฉลากภาษาไทยบังคับ（สติกเกอร์ได้）ต้องแสดงข้อมูลโภชนาการเป็นภาษาไทย', advisory: 'eSubmission 라벨 심사 미완료 시 통관 불가. DLD 위생증명서 태국 대사관 공증 요구 가능. 태국어 스티커 라벨 원본 완전 가림 금지.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 19301-2010 — 生乳 성분 기준 / GB 19645 — 巴氏杀菌乳', lawUrl: 'https://www.samr.gov.cn/', requirement: '生乳 단백질 ≥2.8 g/100g, 지방 ≥3.1 g/100g(EU·KR 기준보다 낮음). 전지우유(全脂牛乳): 유지방 ≥3.1 g/100g. 세균수 원유 ≤200만 CFU/mL. 살균유 소비기한 내 세균수 ≤5만 CFU/mL. 살모넬라 불검출.', originalRequirement: '生乳蛋白质≥2.8 g/100g，脂肪≥3.1 g/100g。全脂巴氏杀菌乳脂肪≥3.1 g/100g。原料生乳菌落总数≤200万 CFU/mL。巴氏杀菌乳在保质期内菌落总数≤5万 CFU/mL。沙门氏菌不得检出。', advisory: '단백질 기준 2.8 g/100g — EU(2.9%)·KR(2.9%)보다 낮으나 확인 필수. 원유 세균수 기준 초과 시 전량 폐기. 수입 유제품은 원산지 위생증명서 필수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 31650-2019 — 食品中兽药最大残留限量 (유제품)', lawUrl: 'https://www.samr.gov.cn/', requirement: '테트라사이클린 ≤0.1 mg/kg. 클로람페니콜 불검출. β-작용제(클렌부테롤·살부타몰) 불검출. 스트렙토마이신 ≤0.2 mg/kg. 목록 외 물질 0.01 mg/kg 일률기준.', originalRequirement: '四环素≤0.1 mg/kg。氯霉素不得检出。β-激动剂（克仑特罗·沙丁胺醇）不得检出。链霉素≤0.2 mg/kg。目录外物质适用0.01 mg/kg一律基准。', advisory: '클로람페니콜·β-작용제 불검출 기준 매우 엄격. 항생물질 초과 시 전량 폐기·수입 금지. 공인기관 잔류 검사 성적서 필수 — 로트별 구비 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: '婴幼儿配方乳粉 SAMR 등록제 — 배합 사전 등록', lawUrl: 'https://www.samr.gov.cn/', requirement: '영아용 조제분유 SAMR 배합(配方) 사전 등록 필수. 브랜드당 최대 3개 시리즈, 시리즈당 3개 배합으로 제한(중복 배합 금지). Cronobacter 불검출(100g). 살모넬라 불검출(25g). 아플라톡신 M1 ≤0.5 μg/kg.', originalRequirement: '婴幼儿配方乳粉须向SAMR进行配方注册，每个企业每个系列不超过3个配方，系列间不得重复。克罗诺杆菌不得检出（100g）。沙门氏菌不得检出（25g）。黄曲霉毒素M1≤0.5 μg/kg。', advisory: '영아분유 배합 등록 절차 12~24개월 소요. 중국 시장 신규 진입 전 등록 일정 조기 착수 필수. 3개 배합 초과 출시 불가 — 제품 라인업 사전 설계 필요.', urgency: '주의' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 境外企业注册 — 수입 유제품 해외 제조업체 등록', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 유제품(우유·치즈·버터·분유 등) 해외 제조업체 GACC(海关总署) 境外生产企业注册 필수. 등록 유효기간 5년(정기 갱신). 위생증명서 매 선적마다 제출. 非등록 업체 수출 즉시 금지.', originalRequirement: '进口乳制品境外生产企业须向GACC进行注册。有效期5年（需定期续期）。每批次须附卫生证明书。未注册企业禁止向中国出口。', advisory: 'GACC 미등록 유가공 시설 중국 수출 불가. 등록 절차 6~12개월 소요 — 신규 시설 사전 등록 필수. 위생증명서 발행 기관 GACC 인정 여부 사전 확인.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2761-2017 — 食品中真菌毒素限量 (유제품)', lawUrl: 'https://www.samr.gov.cn/', requirement: '아플라톡신 M1 ≤0.5 μg/kg(원유·살균유·UHT·분유). EU 기준(0.05 μg/kg)보다 10배 완화. 오크라톡신 A: 유제품 기준 별도 설정 없음. 원유 공급국 곰팡이독소 모니터링 성적서 구비 권장.', originalRequirement: '黄曲霉毒素M1≤0.5μg/kg（原乳·巴氏杀菌乳·UHT·奶粉）。欧盟标准（0.05μg/kg）宽松10倍。赭曲霉毒素A：乳制品无单独标准。建议备存原料奶供应国霉菌毒素监控报告。', advisory: '아플라톡신 M1 EU 0.05 μg/kg보다 중국 0.5 μg/kg 기준 완화 — EU 수출 병행 시 원유 관리 EU 기준 적용 필요. 분기별 모니터링 성적서 구비 권장.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 유제품 내 우유·달걀 알레르겐 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 10/2021/TT-BYT — 유제품 위생기준 (VFA)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '시유: 유지방 ≥3.2 g/100g, 단백질 ≥2.8 g/100g. 살균 HTST 72°C/15s 이상. 세균수 ≤50,000 CFU/mL(살균 후). 살모넬라·리스테리아 불검출. 자기선언(Tự công bố) 의무.', originalRequirement: 'Sữa tươi: chất béo≥3.2 g/100g, protein≥2.8 g/100g. Thanh trùng HTST 72°C/15s. Tổng số vi khuẩn≤50,000 CFU/mL sau thanh trùng. Không phát hiện Salmonella và Listeria. Bắt buộc Tự công bố.', advisory: '성분 기준 미달 시 통관 거부. 살균 방법 증명서(HTST 조건) 구비 필요. Circular 10 성분 기준과 QCVN 미생물 기준 동시 충족 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'QCVN 8-1·8-2:2011/BYT — 곰팡이독소·중금속 (유제품)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '아플라톡신 M1 ≤0.5 μg/kg. 납(Pb) ≤0.02 mg/kg. 카드뮴(Cd) ≤0.1 mg/kg. 수은(Hg) ≤0.01 mg/kg. 분유 아플라톡신 M1 ≤0.5 μg/kg. 로트별 공인기관 성적서 권장.', originalRequirement: 'Aflatoxin M1≤0.5μg/kg. Pb≤0.02 mg/kg. Cd≤0.1 mg/kg. Hg≤0.01 mg/kg. Sữa bột Aflatoxin M1≤0.5μg/kg. Nên có giấy chứng nhận phòng thí nghiệm được công nhận theo lô.', advisory: '납 기준 0.02 mg/kg — 포장재 유래 오염 모니터링 필요. QCVN 8-2 중금속 항목 사전 성적서 확보 후 자기선언 제출 권장.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP (舊 Decree 15 대체) — 영아용 분유 수입허가 + MOH 사전 승인', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '영아용 조제분유는 Decree 15 일반 자기선언 대상 제외 — MOH 수입허가(Giấy phép nhập khẩu) 필수. Cronobacter 불검출(100g). 살모넬라 불검출(25g). 아플라톡신 M1 ≤0.5 μg/kg. 베트남어 라벨 의무.', originalRequirement: 'Sữa công thức cho trẻ sơ sinh không thuộc diện tự công bố theo Decree 15 — cần Giấy phép nhập khẩu MOH. Không phát hiện Cronobacter (100g). Không phát hiện Salmonella (25g). Aflatoxin M1≤0.5μg/kg. Nhãn tiếng Việt bắt buộc.', advisory: '영아분유 MOH 허가 절차 6~9개월 소요. 시장 진입 전 조기 신청 필수. 허가 없이 통관 불가 — 자기선언으로 대체 불가.', urgency: '주의' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — 유제품 라벨링 (베트남어 의무)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '유제품 라벨 전 항목 베트남어 표기 의무. 영양성분표(열량·지방·단백질·탄수화물·나트륨) 베트남어. 알레르겐(유제품·유청단백) 표시. 유통기한 DD/MM/YYYY 형식. 수입업체 이름·주소 베트남어.', originalRequirement: 'Toàn bộ nhãn sản phẩm sữa bằng tiếng Việt bắt buộc. Bảng thông tin dinh dưỡng (năng lượng, chất béo, protein, carbohydrate, natri) bằng tiếng Việt. Khai báo chất gây dị ứng (sữa, protein sữa). Hạn dùng DD/MM/YYYY. Tên/địa chỉ nhà nhập khẩu bằng tiếng Việt.', advisory: '베트남어 라벨 미부착 시 통관 불가. 유통기한 형식 오류 반품 사례 있음 — DD/MM/YYYY 형식 철저 준수. 스티커 라벨 원본 전체 가림 금지.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'SNI 01-3141 + BPOM 파스퇴르 의무 — 수입 유제품', lawUrl: 'https://www.pom.go.id/', requirement: '수입 유제품 반드시 파스퇴르 또는 UHT 처리. 원유: 체세포수 ≤400,000/mL, 세균수 ≤1,000,000/mL. BPOM ML 등록 필수. 냉장 유통 온도 이력 증명 서류 필요.', originalRequirement: 'Imported dairy products must undergo pasteurisation or UHT treatment. Raw milk: somatic cell count ≤ 400,000/mL, total bacterial count ≤ 1,000,000/mL. BPOM ML registration mandatory. Cold chain temperature history documentation required.', advisory: '생(Raw)유 형태 수입 금지. 파스퇴르 처리 증명서(공인 검사기관 발행) 수입 시 제출 필수. ML 등록 소요 3~6개월 — 출시 일정 여유 확보.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 의무 — 유제품 (동물성 원료 전 성분)', lawUrl: 'https://www.pom.go.id/', requirement: '2026.10.17 이후 모든 수입 유제품 BPJPH 승인 할랄 인증 의무. 레닛·유청 등 동물성 유래 원료 전 성분 할랄 증명 필요. 돼지 유래 성분 전면 금지.', originalRequirement: 'From 17 October 2026, all imported dairy products require BPJPH-approved halal certification. All animal-derived ingredients including rennet and whey must be halal-certified. Pork-derived ingredients completely prohibited.', advisory: '치즈류 동물성 레닛 사용 시 BPJPH 승인 할랄 도축 증명 필수. BPJPH 인증 취득 6~12개월 소요 — 즉시 신청 권장. 식물성 레닛(미생물성·유전자재조합) 대체 시 인증 용이.', urgency: '주의' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes 34/2012 — 멜라민·항생제 오염물질 (유제품)', lawUrl: 'https://www.pom.go.id/', requirement: '멜라민 불검출(검출한계 이하). 클로람페니콜 불검출. 아플라톡신 M1 ≤0.5 μg/kg. 테트라사이클린 ≤0.1 mg/kg. 수입 전 로트별 공인 검사기관 성적서 제출.', originalRequirement: 'Melamine not detected (below detection limit). Chloramphenicol not detected. Aflatoxin M1 ≤ 0.5 μg/kg. Tetracycline ≤ 0.1 mg/kg. Accredited laboratory test report per lot required before import.', advisory: '2008년 멜라민 분유 사건 이후 인도네시아 유제품 검역 강화 — 무작위 샘플링 빈번. 로트별 제3자 성적서 사전 확보 필수. 클로람페니콜 불검출 기준 EU보다 엄격.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPOM ML 등록 + PP 69/1999 — 유제품 라벨 (영유아 분유 별도)', lawUrl: 'https://www.pom.go.id/', requirement: '수입 유제품 BPOM ML 등록 필수(갱신 5년). 영유아용 분유: 별도 BPOM 사전 허가 + SNI 01-7111 기준(단백질·지방·비타민 함량). 라벨 인도네시아어 성분명·원산지 의무. 2026.10 이후 할랄 마크 표시 의무.', originalRequirement: 'BPOM ML registration mandatory (5-year renewal). Infant formula: separate BPOM pre-approval and SNI 01-7111 standards (protein, fat, vitamin content). Indonesian-language ingredient names and origin on label mandatory. Halal mark display mandatory from October 2026.', advisory: '영유아 분유 BPOM 허가 절차 12~18개월 소요 — 조기 신청 필수. 성분 변경 시 재등록. 2026.10 이후 할랄 마크 없는 유제품 판매 금지 — 사전 BPJPH 인증 완료 필요.', urgency: '주의' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — 유제품 CPR 등록 + BAI 동물검역', lawUrl: 'https://www.fda.gov.ph/', requirement: '수입 유제품 FDA CPR 등록 필수(소요 6~12개월). BAI(Bureau of Animal Industry) 수입허가 병행. 영유아 분유: 별도 FDA 심사 및 광고 규정 적용. LTO 보유 수입업체 통해서만 수입 가능.', originalRequirement: 'FDA CPR registration mandatory for imported dairy (6~12 months). BAI import permit required concurrently. Infant formula: separate FDA review and advertising regulations. Import only through LTO-holding importers.', advisory: 'CPR 등록 기간 고려한 수출 일정 계획 필수. 영유아 분유는 광고·표시 기준 FDA 별도 규정 적용 — 사전 검토 권장. BAI 수입허가 발급 지연 사례 있음 — 조기 신청.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'BAI 동물검역 — 파스퇴르 증명서 + 구제역 발생국 제한', lawUrl: 'https://www.fda.gov.ph/', requirement: '원산지 수의사 확인서 + 파스퇴르 처리 증명서 필수. 구제역(FMD) 발생국 원유 수입 금지. 조류독감 발생국 유가금류 유래 성분 수입 금지. BFAR 수산물 유래 성분 별도 규정.', originalRequirement: 'Veterinary health certificate from origin country and pasteurisation certificate mandatory. Import of raw milk from FMD-affected countries prohibited. Import of poultry-derived dairy ingredients from avian influenza-affected countries prohibited. BFAR separate regulation for fisheries-derived ingredients.', advisory: '구제역 발생국 목록 BAI 최신 발표 확인 필수. 한국산 유제품 BAI 허가 상태 수출 전 확인. 파스퇴르 증명서 영문 공인 번역본 준비.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA — 멜라민·항생제 기준 준용', lawUrl: 'https://www.fda.gov.ph/', requirement: '멜라민 불검출 기준 적용(Codex/국제 기준 준용). 클로람페니콜 불검출. 테트라사이클린 ≤0.1 mg/kg. 성분 성적서 FDA PH 제출. 수입 시 무작위 샘플링 검사 대상.', originalRequirement: 'Melamine zero-tolerance applied (Codex/international standards). Chloramphenicol not detected. Tetracycline ≤ 0.1 mg/kg. Ingredient test report submission to FDA PH. Subject to random sampling upon importation.', advisory: '멜라민·항생제 성적서 없이 통관 후 적발 시 전량 회수. FDA PH 무작위 검사 강화 추세 — 로트별 사전 성적서 확보 권장.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — 유제품 영양표시·알레르겐 (영어+필리핀어)', lawUrl: 'https://www.fda.gov.ph/', requirement: '영양성분(칼슘·단백질·지방·나트륨) 의무 표시. 우유 알레르겐 의무 표시. 영어 라벨 필수(필리핀어 권장). 수입업체 이름·주소·CPR 번호 라벨 기재. 유통기한 표시 의무.', originalRequirement: 'Mandatory nutrition labelling (calcium, protein, fat, sodium). Milk allergen mandatory declaration. English labelling required (Filipino recommended). Importer name, address, CPR number on label. Best-before date mandatory.', advisory: 'CPR 번호 라벨 미기재 시 반품 빈번. 영유아 분유 광고 제한(WHO 모유대체품 마케팅 국제 기준 준수). 유통기한 형식 FDA PH 기준 준수.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500 / MAQIS 동물검역', lawUrl: 'https://www.moh.gov.my/', requirement: 'JAKIM 할랄 인증 필수(우유·유청 등 동물성 유래 전 성분). MAQIS 동물성 식품 검역 서류 3종(원산지 증명서·수의사 확인서·할랄 인증서). 살균 의무 및 MeSTI/HACCP 인증. 말레이어 라벨 표시 필수.', originalRequirement: 'JAKIM Halal Certification mandatory for all dairy products (including all animal-derived ingredients). MAQIS requires concurrent submission of three documents. Pasteurisation mandatory with MeSTI/HACCP certification. Malay-language labelling required.', advisory: '모든 유제품 JAKIM 할랄 인증 필수. 치즈류 동물성 레닛 사용 시 할랄 원산지 증명 필요. 수입 유제품 MAQIS 검역 2026.06 강화 시행 사전 준비.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '2026.06.01', law: 'MAQIS 동물검역 강화 — 유제품 검역 서류 3종 동시 제출', lawUrl: 'https://www.moh.gov.my/', requirement: '2026.06부터 원산지 증명서·수의사 확인서·JAKIM 할랄 인증서 3종 동시 제출 의무. 1종이라도 미제출 시 즉각 반송 처리. 레닛·유청 등 성분별 할랄 원산지 증명 요구.', originalRequirement: 'From June 2026, simultaneous submission of all 3 documents mandatory: certificate of origin, veterinary health certificate, and JAKIM halal certificate. Failure to submit any one results in immediate rejection. Halal origin documentation required for individual ingredients such as rennet and whey.', advisory: '2026.06 이전 수출 계획 건도 서류 3종 사전 준비 필수. MAQIS 반송 후 재수출 비용·시간 막대 — 서류 완비 후 선적 원칙. 레닛 동물성 원산지 증명 현지 협력사 통해 사전 확보.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.13 — 멜라민·항생제 (유제품)', lawUrl: 'https://www.moh.gov.my/', requirement: '멜라민 불검출(LoD 기준). 클로람페니콜 불검출. 수입 전 제3자 공인기관 성적서 제출. 테트라사이클린 ≤0.1 mg/kg. 아플라톡신 M1 ≤0.5 μg/kg.', originalRequirement: 'Melamine not detected (LoD basis). Chloramphenicol not detected. Third-party accredited laboratory test report required before import. Tetracycline ≤ 0.1 mg/kg. Aflatoxin M1 ≤ 0.5 μg/kg.', advisory: '성적서 없이 통관 시도 후 적발되면 전량 반송 + 수입업체 등록 제재 가능. 로트별 제3자 성적서 사전 확보 필수. MAQIS 무작위 샘플링 빈번.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 Sch.16 — 유제품 영양표시 + MeSTI 인증', lawUrl: 'https://www.moh.gov.my/', requirement: '영양성분(칼슘·단백질·지방·나트륨) 표시 의무. 말레이어 성분명 표기 필수. MeSTI 인증 서류 수입업체 비치. HACCP 인증 선호. 유통기한 DD/MM/YYYY 형식.', originalRequirement: 'Mandatory nutrition labelling (calcium, protein, fat, sodium). Malay-language ingredient names required. MeSTI certification documents must be held by importer. HACCP certification preferred. Best-before date in DD/MM/YYYY format.', advisory: 'MeSTI 인증 없는 제조업체 제품 대형마트 입고 거부 사례 증가. 말레이어 성분명 번역 오류 시 판매 금지 — 현지 전문가 검수 필수. 유통기한 형식 불일치 시 반품.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA SFCR 2019 / Health Canada — 유제품 수입 허가', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '낙농 제품(치즈·버터·분유) 수입 시 CFIA SFCR 허가 필수. 동등성 협정 비체결국은 캐나다 기준 동등 증명 서류 제출. 영어·불어 이중 라벨 의무.', originalRequirement: 'Dairy products (cheese, butter, milk powder) require CFIA SFCR import licence. Countries without equivalency agreement must provide documentation proving equivalence to Canadian standards. Bilingual English/French labelling required.', advisory: '한국-캐나다 동등성 협정 체결 여부 CFIA 사전 확인 필수. 미체결 시 각 배치별 동등성 증명 서류 동반. SFCR 허가 신청 조기 준비 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'FDR Division 8 (Dairy Products) — 유제품 성분 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '버터 지방 함량 ≥80%. 체다 치즈 수분 ≤39%. 가공 치즈(Processed Cheese) 별도 규격 적용. 유지방 대체 성분 사용 불가(제품명 변경 필요).', originalRequirement: 'Butter: fat ≥ 80%. Cheddar cheese: moisture ≤ 39%. Processed cheese subject to separate compositional standards. Dairy fat substitutes not permitted (product must be renamed).', advisory: 'FDR Division 8 기준 미달 시 제품명 변경 필수(예: "Butter-style spread"). 치즈 수분·지방 성적서 구비 권장. 유지방 대체 제품은 별도 명칭 사용.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada — 유제품 항생제 잔류 기준', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '페니실린 ≤0.005 IU/mL, 테트라사이클린 ≤0.1 mg/kg. CFIA 무작위 모니터링 대상. 공인기관 항생제 검사 성적서 권장.', originalRequirement: 'Penicillin ≤ 0.005 IU/mL. Tetracycline ≤ 0.1 mg/kg. Subject to CFIA random monitoring. Antibiotic residue test report from accredited laboratory recommended.', advisory: '항생제 잔류 기준 초과 즉시 수입 거부 및 폐기. CFIA 인정 검사기관 성적서 지참 권장. 다중 항생제 스크리닝 성적서 구비 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA FOPL — 유제품 전면 영양 표시 (2026.01.01)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '고포화지방·고나트륨 유제품 경고 라벨 의무화(2026.01.01). 영어·불어 이중 영양성분 표시. 생유(Raw Milk) 치즈 판매 연령 제한 준수.', originalRequirement: 'FOPL warning labels mandatory for high saturated fat and high sodium dairy products from 2026.01.01. Bilingual nutrition facts required. Age restriction for raw milk cheese sales must be observed.', advisory: 'FOPL 도입 전 유제품 포화지방·나트륨 함량 점검 필수. 캐나다 전용 라벨 사전 제작 권장. 생유 치즈 판매 연령 제한(일부 주 60세 이상 금지) 확인.', enforcementDate: '2026.01.01' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'FSANZ Standard 2.5.1–2.5.7 (Dairy Products) / DAFF Biosecurity', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.5.1 우유 성분 기준: 살균 의무. 치즈: Standard 2.5.4 성분 기준 준수. ⚠️ 유청 단백 분말·분유류: DAFF 바이오보안 수입 허가 대상 여부 확인 필수. 항생제 잔류 기준: 페니실린 0.003 mg/kg.', originalRequirement: 'Standard 2.5.1 milk compositional requirements: pasteurisation mandatory. Cheese: Standard 2.5.4 compositional standards apply. Whey protein powder: DAFF biosecurity import permit requirement must be verified. Antibiotic residues: penicillin ≤ 0.003 mg/kg.', advisory: '생유(Raw Milk) 치즈 일부 수입 제한. 유청 단백 분말은 DAFF 바이오보안 허가 필요할 수 있음 — 처리 방식·원산지에 따라 상이. Health Star Rating 유제품 점수 사전 확인 권장.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 2.5.1 — 우유 성분 기준 (지방·고형분)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '전지유 지방 ≥3.2%, 무지유 고형분(SNF) ≥8.2%. 살균(파스퇴라이즈) 의무. UHT 처리 제품 별도 표시 기준 적용.', originalRequirement: 'Full-cream milk: fat ≥ 3.2%, SNF ≥ 8.2%. Pasteurisation mandatory. UHT-treated products subject to separate labelling requirements.', advisory: '생유(Raw Milk) 치즈 일부 수입 제한. 파스퇴라이즈 처리 증명서 동반 필수. UHT 제품 "Ultra Heat Treated" 라벨 표기 의무.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.6.1 — 유제품 미생물 기준', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '살모넬라: 분유·영아용 25g 불검출. 리스테리아: 연질치즈 유통 중 ≤100 CFU/g. 리스테리아 환경 모니터링 HACCP 계획에 포함 의무.', originalRequirement: 'Salmonella: not detected/25g in infant formula and milk powder. Listeria: ≤ 100 CFU/g in soft cheese during distribution. Listeria environmental monitoring must be included in HACCP plan.', advisory: '연질치즈 리스테리아 유통 중 기준 엄격 관리. 환경 모니터링 기록 보관 의무. 검출 즉시 제품 회수 및 FSANZ 보고.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'DAFF Biosecurity — 유청 단백 분말·분유 수입 허가 확인', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '유청 단백 분말(WPC/WPI)·분유 일부 DAFF Biosecurity Import Permit 필요 여부 BICON 시스템 확인 의무. 원료·가공 방식에 따라 허가 여부 상이. 처리 기간 3~6개월.', originalRequirement: 'Whey protein concentrate/isolate and milk powder: DAFF Biosecurity Import Permit requirement must be verified in BICON system. Permit requirement varies by ingredient and processing method. Processing time: 3–6 months.', advisory: '유청·분유 BICON 사전 확인 필수 — 허가 없이 수입 시 전량 반송. 처리 방식(UHT·멸균) 따라 허가 면제 가능. 수출 전 6개월 이상 여유 확보 권장.', enforcementDate: '시행 중' },
        {
          country: 'Australia (FSANZ)',
          flag: '🇦🇺',
          enforcementDate: '2026.02.25',
          law: 'Food Standards Code Standard 1.2.3 PEAL (Plain English Allergen Labelling)',
          lawUrl: 'https://www.foodstandards.gov.au/',
          requirement: '⚠️ [즉시 시행] 유제품 내 우유 알레르겐 개별 표기 의무. "Tree nuts" 일괄 표기 불허 → 아몬드·캐슈·호두·피스타치오 등 개별 명시. "Seafood" 불허 → Fish/Crustacean/Mollusc 개별 구분. Schedule 9 기준 개별 알레르겐 명칭 전환 의무.',
          advisory: '⚠️ 2026.02.25 이미 시행. "Tree nuts"·"Seafood" 일괄 표기 즉시 비적합. Schedule 9 기준 개별 알레르겐 명칭으로 전환 필수. 뉴질랜드 동일 적용.',
          urgency: '긴급',
        },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO 147/148/149/150 (유제품 기준) / UAE.S 2055 / ESMA 등록', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 유제품 기준 성분·위생 준수. 동물성 레닛(rennet) 사용 치즈 할랄 인증 필수. ESMA 제품 등록. 아랍어 라벨 전 항목. GSO 영양 표시 2026 개정판 — 1회 제공량 기준 영양성분 아랍어 병기. 냉장 유통 콜드체인 서류.', advisory: '치즈류 동물성 레닛 사용 여부 할랄 증명서에 명시 필수. 영아용 분유 GSO 2168 별도 기준 적용. 프로바이오틱스 함유 제품 UAE 효능 광고 기준 확인.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 033/2013 — 우유·유제품 기술규정 / TR TS 021/2011', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'TR TS 033/2013 EAC 인증 필수 — 우유·크림·치즈·버터·발효유·아이스크림 포함. 유단백·지방 함량 EAEU 기준 준수. 국가위생증명서(СГР) 취득. 러시아어 라벨 전면 의무. 생산국 수의 증명서.', advisory: 'TR TS 033/2013 성분 기준이 EU와 상이 — 수입 분유·치즈 성분 기준 사전 교차 확인 필수. 아이스크림·유음료 카테고리별 TR TS 033 세부 기준 별도 확인. 등록 처리 기간 6~12개월 예상.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Milk Regulation', lawUrl: 'https://www.cfs.gov.hk/', requirement: '우유 수입 시 원산지별 검역 허가(Cap 132AH 준수). 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 살균 처리 표시 의무. 항생제 잔류 Codex 기준 적용.', originalRequirement: 'Milk import subject to origin-based quarantine approval (Cap 132AH). Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling required. Pasteurisation treatment disclosure mandatory. Antibiotic residues: Codex MRLs apply.', advisory: '홍콩 우유 수입 허가 원산지 목록(Cap 132AH) 확인 필수 — 미승인 원산지 수입 불가. 번체자 라벨 의무. 홍콩은 중국 본토와 유제품 검역 기준 별개 운영.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132AH — 우유 원산지별 수입 허가', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수입 우유·액상 유제품 원산지 FEHD 승인 목록 확인 필수. 미승인 원산지에서 수입 즉시 금지. 승인 원산지 변경 시 FEHD 재확인 필요. 원산지 증명서 + 위생 증명서 동시 제출.', originalRequirement: 'Imported milk and liquid dairy products must originate from FEHD-approved sources. Import from non-approved origins immediately prohibited. Changes to approved origins require FEHD reconfirmation. Certificate of origin and health certificate must be submitted simultaneously.', advisory: 'FEHD 승인 원산지 목록 정기 업데이트 확인 필수 — 국가별 구제역·우유 안전사고 발생 시 즉각 금지 조치 가능. 한국산 유제품 승인 상태 수출 전 CFS 홈페이지 확인 권장.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 612 — 멜라민·항생제 수입 검사', lawUrl: 'https://www.cfs.gov.hk/', requirement: '멜라민 불검출 기준 엄격 적용(2008년 사건 이후 강화). 클로람페니콜 불검출. 항생제 잔류 Codex MRL 적용. Cap 612 위반 시 즉각 회수 명령 + 수입업체 처벌.', originalRequirement: 'Melamine zero-tolerance strictly enforced (strengthened after 2008 incident). Chloramphenicol not detected. Antibiotic residues apply Codex MRL. Cap 612 violations result in immediate recall orders and importer penalties.', advisory: '유제품 로트별 멜라민·클로람페니콜 성적서 사전 확보 권장. CFS 무작위 검사 빈번 — 성적서 없이 통관 후 적발 시 전량 회수 및 판매 금지.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 유제품 라벨 (파스퇴르·영양표시·번체자)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '파스퇴르·UHT 처리 방법 라벨 표시 의무. 유지방·단백질 함량 표시. 영어·번체자 병기 필수. 유기 유제품 "有機" 표기 시 홍콩 인정기관(HKORC 등) 인증 필요.', originalRequirement: 'Pasteurisation/UHT treatment method must be disclosed on label. Fat and protein content required. Bilingual English/Traditional Chinese mandatory. Organic dairy "有機" claim requires certification from Hong Kong-recognised organic certification body (e.g. HKORC).', advisory: '간체자 단독 라벨 사용 불가. 유기인증 표기 시 홍콩 인정기관 인증서 보유 필수. 유지방 표시 단위(g/100mL) 홍콩 Cap 132W 준수 확인.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 853/2004 / UK Dairy Hygiene Regulations / DEFRA', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU Reg 853/2004 UK Retained 버전 적용. 원유 체세포수 ≤ 400,000/mL(UK 자체 기준). 살균 의무. 치즈: UK 성분 기준 적용(EU와 유사하나 분리 운영). DEFRA 동물성 식품 수입 허가(IPAFFS) 필수. 영어 단독 표기.', originalRequirement: 'UK retained version of EU Reg 853/2004 applies. Raw milk SCC ≤ 400,000/mL (UK own standard). Pasteurisation mandatory. Cheese: UK compositional standards (similar to EU, but separately administered). DEFRA import authorisation (IPAFFS) for animal-origin products mandatory. English-only labelling.', advisory: 'Brexit 이후 EU 승인 유가공 시설도 UK DEFRA 별도 승인 목록 확인 필수. Raw Milk 치즈 UK 수입 규정 EU와 분리 적용. Northern Ireland 판매 시 EU SPS 규정 별도 적용.', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '2025.10.01', law: 'HFSS Advertising Restrictions — 유제품 온라인 광고 금지 (2025.10 시행) / FSA NPM', lawUrl: 'https://www.food.gov.uk/', requirement: '[Brexit Divergence] HFSS 영양 프로파일링 모델(NPM) 기준 — 지방·포화지방·당류·나트륨 고함량 유제품(가당 요구르트·아이스크림·초콜릿 음료·가당 연유 등) 온라인 광고 금지(2025.10.01 시행). 음료류·즉석섭취 유제품 NPM 점수 계산 후 HFSS 해당 여부 확인 필수.', advisory: 'UK 가당 요구르트·초콜릿 음료·아이스크림 온라인 마케팅 캠페인 즉시 법무 검토. EU 유제품 광고 대비 UK 별도 HFSS 규제 적용 — 동일 제품 EU·UK 마케팅 전략 분리 필요. 저당·저지방 포뮬레이션 전환 시 NPM 재계산으로 HFSS 면제 가능.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Verordnung über Lebensmittel tierischer Herkunft (VLtH) / Milchverordnung / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VLtH 동물성 식품 규정 + Milchverordnung 우유 성분 기준 준수. EU MRA: EU 승인 유가공 시설 일반적 인정. 살균 의무. 국내 언어 최소 1개 표기. 유기농 유제품 Bio Suisse 인증 필요. 수의사 위생증명서 필수.', originalRequirement: 'VLtH animal-origin food regulation + Milchverordnung milk compositional standards. Switzerland-EU MRA: EU-approved dairy facilities generally accepted. Pasteurisation mandatory. Labelling in at least one Swiss national language. Organic dairy: Bio Suisse certification required. Veterinary health certificate mandatory.', advisory: '스위스 Milchverordnung 성분 기준 EU와 유사하나 독자 운영 — MRA 활용하되 항목별 확인 필수. Bio Suisse 유기농 유제품 인증 스위스 시장에서 프리미엄 강점. 수의사 증명서 스위스 FSVO 양식 요구 여부 사전 확인.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '2026.07.20', law: 'RS 817.023.21 — 비스페놀(BPA 포함) 식품 접촉 자재 금지 / EU Reg (EU) 2023/2468 동기화', lawUrl: 'https://www.blv.admin.ch/', requirement: 'RS 817.023.21 개정 (2026.01 발효, 2026.07.20 시장 출하 비적합품 마감) — BPA 포함 비스페놀류 식품 접촉 자재(FCM) 금지. 유제품 관련: 에폭시 코팅 분유 캔·연유 캔·폴리카보네이트 계량도구 포함. EU BPA 금지(2026.07.20)와 동시 적용. Bisphenol M·P는 이번 범위 외.', advisory: '유제품 포장재(분유 캔·연유 캔·요구르트 용기 뚜껑) BPA 함유 여부 즉시 점검. 2026.07.20 이후 비적합 포장재 스위스 출하 불가. 대체재(rPET·PP·유리) 전환 시 FSVO + EU FCM DoC(적합성 선언서) 동시 준비. EU·스위스 동시 수출 시 단일 FCM DoC 활용 가능.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 853/2004 + [Local] Code rural et de la pêche maritime / Nutri-Score Arrêté', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Nutri-Score 유제품 의무 표시(2017). AOP/IGP(원산지 보호 표시): 특정 프랑스 치즈(카망베르·브리 등) 명칭 보호 — 동일 명칭 수출 제한. 우유 원산지 표시 Reg 1169/2011 Art.26 + 프랑스 추가 국내법 강화 집행. 유제품 광고 Loi Egalim 제한 준수.', originalRequirement: '[Strict Local Rule] Nutri-Score mandatory on dairy products (2017). AOP/IGP (Protected Designation of Origin): specific French cheese names (Camembert, Brie, etc.) protected — export using identical names restricted. Milk origin labelling: EU Reg 1169/2011 Art.26 + stricter French national enforcement. Dairy advertising subject to Loi Egalim restrictions.', advisory: '[EU Deviation] 프랑스 AOP/IGP 치즈 명칭 사용 제한 — 수출 제품명 사전 법적 검토 필수. Nutri-Score 유제품 점수(지방·포화지방 영향) 사전 시뮬레이션. 우유 원산지 표시 프랑스 강화 집행 대응 라벨 준비.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 853/2004 + [Local] Décret n°2013-1010 relatif aux fromages / Loi Montagne (L. 85-30) / INAO AOP·IGP 보호 명칭 체계', lawUrl: 'https://www.economie.gouv.fr/dgccrf/', requirement: '[Local Standard] Décret n°2013-1010 — 프랑스산 치즈 성분·명칭 기준. AOP(원산지 명칭 보호) 46종: 카맙베르·브리·로크포르·콩테 등 — 특정 지역·전통 제조방법 의무. Loi Montagne(산악지역법) — 알프스·피레네·마시프상트랄 산악 지역 우유 원산지 표시 의무. 생유(Lait Cru) 치즈 — EU 853/2004 허용 + 프랑스 전통 AOP 생유 치즈 별도 보호. Nutri-Score 유제품 자율 표시 — 프랑스 시장 채택률 85%.', advisory: '[프랑스 특이사항] 수입 치즈 AOP 명칭 유사 사용 — INAO(국립원산지명칭관리원) 위반 소지. "Camembert" 단독 표기 시 AOP 요건 미충족 가능 — 생산지 병기 필수. Nutri-Score 미표시 시 Carrefour·Leclerc·Auchan 낙품 사실상 곤란. 프랑스 수입 치즈 DGCCRF 집중 점검 대상 — 분기별 샘플링 결과 공개. 프랑스 유기 유제품: AB(농업바이오) 마크 + EU Bio 인증 병행.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[FI] Soft Drink Tax (가당 유제품 음료) / [HU] NETA 2011 / [SE] Livsmedelsverket 영양 권고', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 핀란드 가당음료세: 가당 유제품 음료(가당 요거트 드링크·가당 밀크음료) 세금 부과 여부 확인(당류 함량 기준). 헝가리 NETA: 가당 유제품 음료·에너지 유제품 포함 검토. 스웨덴 Livsmedelsverket: 포화지방 저감 권고(유제품 적용). Nutri-Score 국가별 의무·자율 상이.', originalRequirement: '[EU Divergence] Finland soft drink tax: verify applicability to sweetened dairy beverages (sweetened yogurt drinks, flavoured milk) based on sugar content. Hungary NETA: sweetened dairy drinks potentially included. Sweden Livsmedelsverket: saturated fat reduction recommendations (applicable to dairy). Nutri-Score mandatory/voluntary varies by country.', advisory: '가당 유제품 음료(초코우유·가당 요거트 드링크) 핀란드·헝가리 세율 부과 여부 사전 확인. 포화지방 높은 유제품 Nutri-Score 점수 낮아질 수 있음 — 저지방 제품 라인 병행 검토. 북유럽 소비자 저당·저지방 유제품 선호도 높음.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 853/2004 + [Local] Milchverordnung (MilchV) / Käseverordnung (KäseV) / Tier-LMHV', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Local Standard] Milchverordnung(MilchV) — 원유·살균유·초고온살균유(UHT) 성분 기준. Käseverordnung(KäseV) — 독일산 치즈 명칭 보호 + 수입 치즈 품질 기준. Tier-LMHV — 냉장 유제품 위생 기준. 생유(Raw Milk) 치즈 별도 위생 기준 — EU 853/2004 + 독일 추가 요건. BVL 수입 유제품 검사 우선 집행 대상.', advisory: '독일 수입 연성 치즈·생유 치즈 Käseverordnung 명칭 충돌 여부 확인 필수. UHT 유제품 독일 MilchV 성분 기준 — EU 기준과 소폭 상이(지방 함량 기준 재확인). 독일 유제품 시장: DM·REWE 등 소매 체인 자체 인증 기준(BIO·Naturland) 별도 요구 가능.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇸🇪🇳🇴🇩🇰', enforcementDate: '시행 중', law: '[SE] Livsmedelsverket Nyckelnålet / [NO] Mattilsynet Nøkkelhullet / [DK] Fødevarestyrelsen Nøglehullet — 유제품 영양 품질 기준', lawUrl: 'https://www.livsmedelsverket.se/', requirement: '[Nordic Market Requirement] Keyhole 마크 — SE/NO/DK/IS 4개국 공통 영양 품질 기호. 유제품 기준: 저지방·저당·저나트륨 동시 충족 시 표시 가능. 가당 요구르트·초콜릿 음료·가당 연유 → 기준 미충족. 저지방 자연 치즈·무가당 발효유 → 취득 유리.', advisory: '스칸디나비아 주요 소매(ICA·Coop·Rema 1000·Lidl Nordic) Keyhole 표시 제품 진열 우선 정책. 요구르트 기준 ≤0.5% 지방. 단순 법적 요건 아닌 실질적 시장 접근성(Market Access) 조건으로 작용.' },
    ],
  },
  bakery: {
    title: 'Bakery & Confectionery — Global Regulations',
    icon: CakeSlice,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품공전 과자류 / 빵류 / 만두류 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '트랜스지방: 4g/100g↓ (전용 기준). 보존료: 프로피온산, 소르빈산 등 사용 기준 준수. 알레르겐 22종 의무 표시. 식품첨가물 공전 기준 성분표 검토 필수.', originalRequirement: 'Trans fat: ≤4g/100g. Preservatives: propionic acid, sorbic acid limits per Food Code. 22 allergens mandatory labelling. Additive list compliance required.', advisory: '알레르겐 교차오염 표시(may contain) 권장. 트랜스지방 0g 표시 기준(0.2g/100g↓) 확인.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품표시광고법 — 알레르겐 22종 의무 표시', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '22종 알레르겐 의무 표시: 난류·우유·메밀·땅콩·대두·밀·고등어·게·새우·돼지고기·복숭아·토마토·아황산류·호두·닭고기·쇠고기·오징어·조개류(굴·전복·홍합·조개)·잣. 표시 글자 크기 6포인트 이상. 교차오염 주의 문구("이 제품은 ○○을 사용한 제품과 같은 제조시설에서 제조함") 권고.', advisory: '알레르겐 표시 미비 시 행정처분·리콜 대상. 베이커리 교차오염 관리 미흡 시 소비자 피해 발생. 신규 원료 도입 시 알레르겐 해당 여부 즉시 재검토.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '식품첨가물 공전 — 보존료·착색료 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '프로피온산(빵류) ≤2.5 g/kg, 소르빈산(과자류) ≤1.0 g/kg. 이산화황 ≤30 mg/kg(일부 과자). 타르색소: 황색4호·황색5호·적색40호 사용 허용(일부 품목 제한). 적색2호(아마란스) 사용 금지.', advisory: '적색2호(아마란스) 사용 금지 — 수입 제품 적발 사례 있음. 타르색소 허용 한도 식품유형별 상이. 색소 수입 성적서 구비 및 라벨 표시 일치 여부 확인.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '영양표시 기준 — 트랜스지방·포화지방·당류', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '트랜스지방 0g 표시: 1회 제공량당 0.2g 미만. 포화지방·당류·나트륨 의무 표시. 고열량·저영양 식품 어린이 기호식품 광고 제한(어린이 식생활 안전관리 특별법). 1회 제공량 기준 명시 의무.', advisory: '트랜스지방 0g 표시 기준 초과 시 허위 표시 적발. 어린이 기호식품 인터넷·TV 광고 규제 준수. 당류 과다 제품 고열량·저영양 지정 여부 사전 확인.', },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '시행 중', law: '수입식품안전관리특별법 — 베이커리·과자류', lawUrl: 'https://www.foodsafetykorea.go.kr/', requirement: '수입 과자·빵류 사전신고 의무. 최초 수입 시 정밀검사 지정 가능(잔류농약·보존료·타르색소·중금속·미생물). 외국 제조업소 MFDS 등록 필수. 부적합 이력 시 전수검사.', advisory: '과자류 타르색소 부적합 주요 적발 원인. 수입 과자류 첨가물 성적서 수출국 공인기관 발행본 구비 필수. 제조시설 MFDS 등록 처리기간 사전 확보.', },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: '21 CFR Part 136-137 — Bakery Products / Trans Fat Rule', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-136', requirement: 'PHO(부분수소화유) 사용 금지. 빵·롤 성분 규격 기준. 첨가당 표시 의무. 전면 영양 표시(FoPL) 규칙 제안 중(2025).', originalRequirement: 'PHO (Partially Hydrogenated Oils) banned. Standards of identity for bread, rolls. Added sugars declaration mandatory. Front-of-Package Nutrition Labeling rule proposed (2025).', advisory: 'PHO 성분 포함 제품 미국 수출 불가. FoPL 제안 규칙 모니터링 및 라벨 개정 사전 준비 권장.', urgency: 'PROPOSED' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '2025.01.01', law: '식품 등의 표시·광고에 관한 법률 제5조 + 식품 등의 표시기준 (식약처 고시 제2024-47호) — 알레르겐 22종 → 의무 표시 강화', lawUrl: 'https://www.mfds.go.kr/', requirement: '[2025 강화] 식품표시광고법 알레르겐 표시 강화(식약처 고시 제2024-47호): ① 의무 표시 알레르겐 22종 — 새우·게·오징어·굴 개별 구분 표시 의무화(기존 "갑각류" 묶음 표시 → 세분화) ② 제과·베이커리류 알레르겐 함유 원료 한글 표시 + 굵은 글씨 강조 의무 ③ 알레르겐 교차접촉(Cross-Contact) 주의문구 권고 → 실질적 의무 격상 추세 ④ 온라인 판매 제과류 — 전자상거래법 + 표시기준 알레르겐 동시 표시.', advisory: '새우·게 분리 표시: 기존 "갑각류(새우 포함)" → "새우" "게" 각각 표기 의무 — 2025.01.01 시행 이전 출고분 라벨 전수 점검 필요. 수입 제과류 한국 수출 시 MFDS 기준 22종 알레르겐 한글 표시 별도 부착 또는 재포장 필요. 교차접촉 경고: "이 제품은 ○○을 사용한 시설에서 제조" 문구 권장 표준화. 알레르겐 위반 시 전량 회수·폐기 + 영업정지 제처분 대상.' },
      { country: 'South Korea (MFDS)', flag: '🇰🇷', enforcementDate: '2025.04.21', law: '식품 등의 표시·광고에 관한 법률 시행규칙 개정 — e-라벨링 QR 이관 허용 (식약처 고시 2025.04.21)', lawUrl: 'https://www.mfds.go.kr/', requirement: '[2025.04.21 고시] 비필수 정보(제조방법·제품 특성·이벤트 정보 등) QR 코드 이관 허용. 알레르겐·영양성분·유통기한·원재료명은 실물 포장재 의무 유지. QR 이관 정보: 상세 성분 설명·사용법·교차오염 경고(추가 정보) 등 이전 가능. 수입 식품 포함 동일 적용.', advisory: '알레르겐·영양성분·유통기한은 실물 표시 유지 필수 — QR 대체 불가. QR 이관 허용 정보 범위 식약처 고시 세부 지침 확인 후 적용. 수출용 제품 QR 링크 한국어 페이지 별도 구축 또는 다국어 지원 권장. QR 인식 불가 소비자(노인·장애인) 접근성 고려 실물 핵심 정보 유지.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSMA 21 CFR Part 117 — 베이커리 예방 통제 (HARPC)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-117', requirement: '알레르겐(밀·달걀·우유·견과류·참깨) 교차오염 관리계획 의무. 식품안전계획(Food Safety Plan) 문서화. 공급업체 검증. 환경 모니터링. FDA 시설 등록 의무.', originalRequirement: 'Allergen (wheat, eggs, milk, tree nuts, sesame) cross-contact control plans mandatory. Food Safety Plan documentation. Supplier verification. Environmental monitoring. FDA facility registration required.', advisory: '알레르겐 교차오염 관리 미흡 시 FDA 경고서한·자발적 리콜. 식품안전계획 현장 비치 및 3년마다 재검토 의무. FSMA 시설 등록 갱신(짝수연도 10월) 미이행 시 수입 거부 가능.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FDA FoPL Proposed Rule (2022) — 전면 영양 표시', lawUrl: 'https://www.fda.gov/food/food-labeling-nutrition/front-package-nutrition-labeling', requirement: '"High In" 포화지방·나트륨·당류 전면 표시 제안. DV 20% 초과 시 표시 의무(예정). 1회 제공량 기준. 베이커리·과자류 주요 적용 대상. 2025~2026 최종화 예상.', originalRequirement: '"High In" front-of-package label for saturated fat, sodium, added sugars if exceeding 20% DV (proposed). Per serving basis. Bakery and snack products are primary targets. Final rule expected 2025–2026.', advisory: 'FoPL 최종 규칙 발효 전 선제적 라벨 개정 계획 수립 권장. 포화지방·나트륨·당류 함량 재산정 후 "High In" 해당 여부 확인. 기존 Nutrition Facts Panel과 병행 표시 예정.', urgency: 'PROPOSED' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '2027.01.15', law: 'FDA 21 CFR §74.303 취소 — FD&C Red No. 3 (에리트로신) 전국 금지', lawUrl: 'https://www.fda.gov/food/color-additives-information-consumers/color-additives-history', requirement: 'FDA가 Delaney Clause(발암성) 적용, FD&C Red No. 3(에리트로신, 적색3호) 식품 및 구강 의약품 사용 허가 취소. 식품 준수 기한: 2027.01.15, 의약품: 2028.01.18. 체리·딸기 음료·가공육·간식류 및 마라스키노 체리(Maraschino Cherries)에 주요 사용. 대체 원료: Red 40(Allura Red), 비트 추출물, 파프리카 올레오레진, 카민(코치닐).', originalRequirement: 'FDA revoked authorization for FD&C Red No. 3 (Erythrosine, E127) in food and ingested drugs under the Delaney Clause (cancer-causing in animal studies). Compliance deadline: food manufacturers by January 15, 2027; drug manufacturers by January 18, 2028. Primary uses: Maraschino cherries, cherry-flavored products, processed snacks. Alternatives: Red 40, beet extract, paprika oleoresin, carmine.', advisory: '⚠️ 미국 전 시장(50개 주) 2027.01.15부터 Red No. 3 함유 식품 판매 불가. CA AB 418과 별개의 연방 금지 — 미국 수출 식품 성분표 즉시 재검토. 기존 캘리포니아 기준(2027.01.01)보다 2주 늦은 연방 기한이지만 사실상 동일 적용. 국제 수출용 제품(EU E127, 한국 적색2호) 성분 관리 이원화 주의.' },
      { country: 'USA (FDA / HHS)', flag: '🇺🇸', enforcementDate: '2026년 말 (업계 자발)', law: 'FDA 합성색소 6종 단계적 폐지 계획 (2025.04.22 발표)', lawUrl: 'https://www.fda.gov/food/color-additives-information-consumers/tracking-food-industry-pledges-remove-petroleum-based-food-dyes', requirement: 'HHS/FDA(2025.04.22) — 석유 기반 합성색소 6종 업계 자발 퇴출 목표 발표: FD&C Red No. 40, Yellow No. 5, Yellow No. 6, Blue No. 1, Blue No. 2, Green No. 3. 의무 법령 아닌 업계 협약 형태. FDA Orange B 및 Citrus Red No. 2 취소 절차도 진행 중. FDA는 자연 유래 대체 색소 사용을 공식 권장.', originalRequirement: 'HHS and FDA announced (April 22, 2025) plans to phase out six petroleum-based certified food dyes from the U.S. food supply by end of 2026 through voluntary industry agreements: FD&C Red No. 40, Yellow No. 5, Yellow No. 6, Blue No. 1, Blue No. 2, and Green No. 3. Not a mandatory regulation — voluntary industry phase-out. FDA separately pursuing formal revocation of Orange B and Citrus Red No. 2.', advisory: '업계 자발 폐지이나 대형 유통(Walmart·Target·Kroger 등) 적용 시 사실상 의무화. 대체 색소: 비트 주스, 강황(커큐민), 엽록소(클로로필린), 스피루리나, 베타카로틴, 아나토. 유통업체 바이어 요청에 따른 성분 교체 계획 수립 권장. FDA 공식 Tracking Page(위 URL)에서 기업별 약정 현황 확인 가능.' },
      { country: 'USA (USDA FSIS)', flag: '🇺🇸', enforcementDate: '2026.01.01', law: 'USDA FSIS "Product of USA" 라벨링 최종 규칙 (FSIS-GD-2025-0006)', lawUrl: 'https://www.fsis.usda.gov/policy/fsis-directives/2025-guidance', requirement: '육류·가금류·계란 제품 "Product of USA" 자발적 표시 기준 강화(2026.01.01). 출생→사육→도축→가공 전 과정 미국 내 완료 조건. 단순 통관·재포장만 거친 수입육 "Product of USA" 표시 금지. 다성분 제품: 비FSIS 관할 성분도 미국산 여부 명시 의무.', originalRequirement: 'USDA FSIS tightened "Product of USA" labeling standard (effective 2026.01.01) for voluntary use on meat, poultry and egg products. Standard: born, raised, slaughtered, and processed entirely in the United States. Imported meat simply re-packaged in the U.S. may not carry unqualified "Product of USA" claim. Multi-ingredient products: non-FSIS components also subject to origin requirements.', advisory: '한국 육류 가공품 미국 경유 포장 후 "Product of USA" 표기 불가. 수입 육류 기반 제품 라벨 검토 필수. 순수 미국산 원료만 사용 시 자발적 표시 기준 충족 가능 — 공급망 원산지 문서화 필수.' },
      { country: 'USA (FDA)', flag: '🇺🇸', enforcementDate: '2023.01.01', law: 'FALCPA + FASTER Act — 알레르겐 9종 의무 표시', lawUrl: 'https://www.fda.gov/food/food-allergies/food-allergen-labeling-and-consumer-protection-act-2004-falcpa', requirement: '밀·달걀·우유·땅콩·트리너트·대두·생선·갑각류·참깨(Sesame) 9종 의무 표시. 2023.01.01부터 참깨 추가(FASTER Act 2021). 교차접촉 주의문구 자율 권고.', originalRequirement: 'Mandatory labelling of 9 allergens: wheat, eggs, milk, peanuts, tree nuts, soy, fish, crustacean shellfish, sesame (added 2023-01-01 per FASTER Act 2021). Advisory "may contain" statements voluntary.', advisory: '참깨(Sesame) 추가 미표시 제품 FDA 경고·리콜 대상. 기존 라벨 전수 재검토 필수. "May contain sesame" 자율 표시 권장. 참깨 함유 원료(tahini·halvah·hummus) 성분표 확인.', urgency: '긴급' },
      { country: 'USA (FDA / FSIS)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'FSIS 9 CFR Part 319 (육류 함유 제품 표준) + 21 CFR Part 136·137 (빵·곳류 가공 표준) — 육류 함유 제과·베이커리 이중 관할', lawUrl: 'https://www.fsis.usda.gov/', requirement: '[Dual Authority FSIS/FDA] 육류·가금류 함유 베이커리 제품(≥2% 조리 육류 또는 ≥3% 생육류) — FSIS 관할. 미트파이·핵포켓·육류 함유 피자·샌드위치·만두류 → 9 CFR Part 319 라벨링 + FSIS 시설 검사 의무. 육류 미함유 베이커리 → FDA 21 CFR Part 136(빵 제품 표준) 관할. FSIS USDA 검사 마크(Est. 번호) 육류 함유 포장 의무 표시. 수입 육류 함유 베이커리 → FSIS 해외시설 동등성 인증(Equivalence Listing) 필수.', advisory: '한국 육류 함유 베이커리(불고기빵·육류 만두류) 미국 수출 — FSIS 관할 확인 선행. FSIS Equivalence 미인증 한국 시설 제품 → 수입 거부. 9 CFR 319 라벨: 제품명·육류%·성분·영양성분 모두 FSIS 기준 적용. 동일 생산시설에서 육류 함유/미함유 병행 생산 시 FDA·FSIS 이중 등록 필요. FSMA 302(의도적 오염 방지) FSIS 시설도 적용.' },
      { country: 'USA (FDA / USDA)', flag: '🇺🇸', enforcementDate: '시행 중', law: 'USDA AMS NOP (7 CFR Part 205) — 유기 베이커리 + USDA Whole Grain Stamp (WGWC) + FDA 21 CFR Part 136 (빵 표준) + 21 CFR 136.110 (Enriched Bread)', lawUrl: 'https://www.ams.usda.gov/', requirement: '[USDA Organic + Whole Grain] USDA NOP "Organic" 베이커리 — 원료 95% 이상 유기농 + USDA 인증기관(가공시설 포함) 인증. "100% Organic"·"Organic"(95%)·"Made with Organic..."(70%) 라벨 기준 상이. USDA Whole Grain Stamp — 통곳물 8g 이상/serving 시 "Whole Grain" 스탬프 자율 표시(WGWC 회원). FDA 21 CFR 136.110 "Enriched Bread" — 티아민·리보플라빈·나이아신·엽산·철분 강화 의무(강화빵 명칭 사용 시).', advisory: 'USDA Organic 베이커리 수출: 한국 인증기관 USDA NOP 동등성 인정 여부 사전 확인(NOSB 승인 필요). WGWC Whole Grain Stamp 라이선스 사용료 발생 — 사전 회원 가입 필요. 미국 대형 유통(Whole Foods·Trader Joe\'s) USDA Organic 마크 실질 요구. "Enriched" 명칭 미충족 강화 기준 사용 시 21 CFR 136 위반 — FDA 경고장 대상. Sourdough 별도 표준 없으나 성분·라벨 21 CFR 136 준수 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 1333/2008 Annex II Cat 07 — Bakery Additives', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333', requirement: 'Cat 07 첨가물: BHA(E320) 최대 200 mg/kg, BHT(E321) 최대 100 mg/kg. 이산화티타늄(E171) 금지. 산업용 트랜스지방 최대 2g/100g 지방 기준.', originalRequirement: 'Category 07 additives: BHA (E320) max 200 mg/kg, BHT (E321) max 100 mg/kg. TiO2 (E171) banned. Trans fat regulation: max 2g/100g fat from industrial trans fats.', advisory: 'E171 사용 즉시 중단. 트랜스지방 기준 엄격 적용 중. Annex II Cat 07 최신 개정 목록(2025년 11월 지침) 교차 확인 필수.', urgency: 'Nov 2025' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg 1169/2011 Annex II — 베이커리 알레르겐 14종 의무 표시', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169', requirement: '글루텐(밀·호밀·보리·귀리)·달걀·우유·견과류·땅콩·참깨·대두·루핀·연체류·어류·갑각류·셀러리·겨자·아황산염 14종 강조 표시. 가공보조제도 표시. 비포장 제품 포함.', originalRequirement: 'Gluten (wheat, rye, barley, oats), eggs, milk, tree nuts (8 types), peanuts, sesame, soy, lupin, molluscs, fish, crustaceans, celery, mustard, sulphites: mandatory emphasis. Processing aids and unpackaged products included.', advisory: '루핀·연체류·셀러리·겨자는 한국에 없는 EU 전용 의무 알레르겐. 비포장 빵집 제품도 알레르겐 서면 고지 의무. 교차접촉 경고 문구 EU에서 자율이나 권장.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '2018.04.11', law: 'Reg (EU) 2017/2158 — 아크릴아마이드 저감 기준', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R2158', requirement: '비스킷·크래커·토스트·진저브레드·시리얼 바 아크릴아마이드 벤치마크 수준 설정. 제조 공정 개선 의무 (온도·시간·원료 최적화). 벤치마크 초과 시 시정 조치 기록 필수.', originalRequirement: 'Benchmark levels for acrylamide set for biscuits, crackers, toast, gingerbread, cereal bars. Mandatory mitigation measures (temperature/time reduction, ingredient optimisation). Corrective action documentation required when benchmarks exceeded.', advisory: '아크릴아마이드 주요 저감 방법: 조리 온도 저하·아스파라긴 저함량 원료 선택. EU 수출 베이커리 아크릴아마이드 모니터링 계획 수립 권장. 분석 성적서 EU 수입업체 요청 시 보관.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', enforcementDate: '시행 중', law: 'Reg (EC) 1332/2008 — 식품 효소 승인 목록 (베이커리)', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1332', requirement: '아밀라제·리파제·크실라나제·포스포리파제 등 베이커리 효소 EU 허가 목록 준수. 미허가 효소 사용 금지. 가공보조제로 사용 시 최종 제품 라벨 처리 기준 별도 확인.', originalRequirement: 'Bakery enzymes (amylase, lipase, xylanase, phospholipase) must appear on EU approved list. Unlisted enzymes prohibited. When used as processing aids, separate labelling rules apply depending on final residue levels.', advisory: 'EU 효소 허가 목록 아직 완전 확정 전(Community List 진행 중) — 현행 국가별 허가 목록 EU 수입업체 사전 확인. 가공보조제 효소 잔류 없으면 라벨 표시 불필요. 효소 원료 GMO 여부 별도 확인 권장.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '菓子類食品規格 / 食品添加物公定書 (2026.04.01 CAA 이관)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '보존료·산화방지제 등 첨가물 기준 준수. 알레르겐 8종 의무 + 20종 권장 표시. 2026.04.01 소비자청 이관.', originalRequirement: '保存料・酸化防止剤等の添加物基準に準拠。アレルゲン8品目義務表示＋20品目推奨表示。2026年4月1日より消費者庁へ移管。', advisory: '제과류 알레르겐 표시 폰트·위치 기준 재확인. CAA 이관 후 신제품 신고 절차 업데이트.', urgency: 'D-22' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2025.03.01', law: '食品表示法 — アレルゲン28種 (クルミ義務化 2025.03)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '特定原材料 8種 義務表示: 小麦·卵·乳·落花生·エビ·カニ·クルミ·ソバ. クルミ(호두) 2025.03.01 義務化 전환. 準義務 20種 推奨表示.', originalRequirement: '特定原材料8品目義務表示：小麦・卵・乳・落花生・エビ・カニ・くるみ・そば。くるみは2025年3月1日より義務化へ移行。準義務20品目推奨。', advisory: '2025.03부터 クルミ(호두) 의무 알레르겐 표시. 호두 함유 베이커리 라벨 즉시 재검토 필수. 준의무 20종도 권고 표시 병행.', urgency: '주의' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品添加物公定書 — 保存料·着色料 기준', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuhin/syokuten/index.html', requirement: '프로피온산(パン류) ≤2.5 g/kg. 소르빈산칼륨(菓子류) ≤1.0 g/kg. 타르색소: 지정 품목 외 사용 금지. 이산화황 사용 금지 품목(パン類) 주의.', originalRequirement: 'プロピオン酸（パン類）≤2.5 g/kg。ソルビン酸カリウム（菓子類）≤1.0 g/kg。タール色素は指定品目以外への使用禁止。パン類への亜硫酸塩使用不可。', advisory: '식품첨가물 공정서 최신 개정판 확인 필수. 타르색소 허용 목록·품목별 한도 교차 확인. 수입 베이커리 성적서에 첨가물 전 항목 기재 의무.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '시행 중', law: '食品表示法 — トランス脂肪酸·飽和脂肪 표시', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/', requirement: '트랜스지방산 함량 임의 표시(의무 아님). 포화지방산 의무 표시(100g당 g수). 마가린·쇼트닝 포함 제품 포화지방 표시 강화 권고. WHO 권고 트랜스지방 섭취 1% 미만 기준 참고.', originalRequirement: 'トランス脂肪酸含有量の表示は任意（義務なし）。飽和脂肪酸の表示は義務（100g当たりg数）。マーガリン・ショートニング含有製品は飽和脂肪表示強化推奨。', advisory: '트랜스지방 의무 아니나 소비자 요구 강화 — 자율 표시 권장. 포화지방 100g당 g수 표시 정확성 검토. 글로벌 수출 시 EU·미국 트랜스지방 기준도 동시 확인.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '輸入食品 수입신고 — 菓子·パン類', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '수입신고(輸入届出) → 検疫所 서류·현물 검사. 잔류농약·식품첨가물 동시 검사 대상. 마가린·쇼트닝 포함 유지류 별도 규격 확인. 부적합 시 전량 폐기·반송.', originalRequirement: '輸入届出→検疫所による書類・現物検査。残留農薬・食品添加物の同時検査対象。マーガリン・ショートニング含有油脂類は別途規格確認。不適合の場合は全量廃棄または積み戻し。', advisory: '수입 베이커리류 첨가물·잔류농약 성적서 구비 필수. 마가린·쇼트닝 원재료 규격서 사전 제출 권장. 부적합 이력 시 강화 검사 지정 — 수출 이력 관리 중요.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2025.02.13', law: '食品添加物使用範圍及限量 / GABA 제한 기준 (2025.02 시행)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'GABA(γ-아미노뷰티르산) 함유 제과류: 2025.02.13 사용 제한 및 의무 표시 시행. 보존료·감미료 사용 한도 준수. 중국어 표시 의무.', originalRequirement: 'Bakery products containing GABA (γ-aminobutyric acid): use restrictions and mandatory labelling effective 2025.02.13. Preservative/sweetener usage limits apply. Chinese labelling mandatory.', advisory: 'GABA 함유 제과 제품 전면 검토. 표시사항 TFDA 기준 재검토. 신규 첨가물 허가 목록 최신화 필요.', urgency: 'Updated' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品標示基準 — 알레르겐 11종 의무 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '특정 알레르겐 11종 의무 표시: 小麥(밀)·蛋(달걀)·奶(우유)·花生(땅콩)·堅果(견과류)·芝麻(참깨)·大豆(대두)·魚類·甲殼類(갑각류)·軟體動物·芒果(망고). 함유 표시 방법: 원재료명 또는 별도 "含有OOO" 표기.', originalRequirement: '11種特定過敏原強制標示：小麥、蛋、奶、花生、堅果、芝麻、大豆、魚類、甲殼類、軟體動物及芒果。標示方式：原料名稱中標示或另行標明「含有OOO」。', advisory: '알레르겐 11종 누락 시 TFDA 행정처분 대상. 단순 성분 기재만으로 불충분 — "含有" 별도 표기 권장. 수출 라벨 검토 시 11종 전체 대조 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: '食品添加物使用範圍及限量 — 保存料·着色料 기준', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '프로피온산(보존료) ≤2.5 g/kg(빵류). 소르빈산칼륨 ≤1.0 g/kg(과자류). 타르색소: TFDA 지정 품목 외 사용 금지. 이산화황(SO₂) 빵류 사용 금지.', originalRequirement: '丙酸（保存劑）≤2.5 g/kg（麵包類）。山梨酸鉀≤1.0 g/kg（糕餅類）。焦油色素：指定以外禁用。亞硫酸鹽：麵包類禁用。', advisory: '보존료 한도 초과 시 FSSA 위반. 타르색소 허용 목록 TFDA 최신 고시 확인. 수입 베이커리 성적서 첨가물 전 항목 기재 필수.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '2018.07.01', law: '食品標示基準 — 트랜스지방산 의무 표시 (2018 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '트랜스지방산 의무 표시(포장 식품). 포화지방 의무 표시. 부분경화유(PHO) 함유 시 표시 강화. 1회 제공량당 0.3g 미만 시 "0g"으로 표시 가능.', originalRequirement: '反式脂肪酸強制標示（包裝食品）。飽和脂肪強制標示。含部分氫化油強化標示。每份≤0.3g可標示為0g。', advisory: '2018.07 개정 트랜스지방 표시 의무 시행. 부분경화유 사용 원료 확인 후 표시 방법 결정. EU·미국보다 기준 완화이나 소비자 인식 강화 추세.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', enforcementDate: '시행 중', law: 'TFDA eTrack 수입신고 — 菓子·麵包類', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 베이커리·과자류 TFDA eTrack 시스템 수입신고 의무. 서류검사 + 자체 검사성적서 제출. 위험등급(A/B/C)별 검사비율 상이 — C등급 100% 검사. 번체 중국어 라벨 의무.', originalRequirement: '菓子・麵包類輸入須透過TFDA eTrack系統申報。書類審查＋自主檢驗成績書提交。風險等級（A/B/C）不同，C等級100%查驗。須貼繁體中文標示。', advisory: 'eTrack 수입신고 미이행 시 통관 거부. C등급 100% 검사 — 검사 기간 대비 재고 확보 필요. 번체 중국어 스티커 라벨 사전 제작 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7099 / GB 2760-2024 — 糕点·饼干 식품 첨가물 기준 (SAMR, 2025.02.08 시행)', lawUrl: 'https://www.samr.gov.cn/', requirement: 'Sunset Yellow(일몰황, 황색4호) 최대 100mg/kg(GB 2760-2024 기준, 시행 중). 사카린·사이클라민산나트륨 사용 허용(한도 내). 이산화티타늄(E171) 사용 가능(EU와 상이). 알레르겐 중국어 표시 의무.', originalRequirement: '日落黄（柠檬黄）最大允许量100mg/kg（GB 2760-2024，2025年2月8日起施行）。糖精钠·环磺酸钠在限量内可用。二氧化钛（E171）可使用（与EU不同）。过敏原需中文标注。', advisory: '한국 허용 색소가 GB 2760에 없을 수 있음(예: 적색2호 금지). Sunset Yellow 100mg/kg 기준(GB 2760-2024, 2025.02.08 시행 중) 적용. GACC 등록 없이 수출 불가.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 7718-2011 — 预包装食品标签 알레르겐·트랜스지방 표시', lawUrl: 'https://www.samr.gov.cn/', requirement: '알레르겐 8종 의무 표시: 小麦(밀)·蛋(달걀)·奶(우유)·花生(땅콩)·大豆(대두)·坚果(견과류)·鱼类(어류)·甲壳类(갑각류). 반식스지방(反式脂肪酸) ≥0.3 g/100g 시 의무 표시. 0.3 g/100g 미만은 "0"으로 표시 가능.', originalRequirement: '过敏原8种必须标注：小麦、蛋、奶、花生、大豆、坚果、鱼类、甲壳类。反式脂肪酸≥0.3 g/100g须强制标示，低于0.3 g可标"0"。', advisory: '한국과 알레르겐 표시 대상 종류 상이 — 8종 전 항목 중국어로 성분명 내 표기 필수. 트랜스지방 수치 성적서 확보 후 라벨 표기 결정 권장.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2761-2017 — 食品中真菌毒素限量 (베이커리류)', lawUrl: 'https://www.samr.gov.cn/', requirement: '아플라톡신 B1 ≤5 μg/kg(곡물 기반 제과). 데옥시니발레놀(DON) ≤1,000 μg/kg(밀 가루·밀 기반 과자). 제아랄레논(ZEA) ≤60 μg/kg(밀 가루). 원료 밀가루 공급업체 성적서 확보 필수.', originalRequirement: '黄曲霉毒素B1≤5μg/kg（谷物基糕饼）。脱氧雪腐镰刀菌烯醇（DON）≤1,000μg/kg（小麦粉·小麦糕饼）。玉米赤霉烯酮（ZEA）≤60μg/kg（小麦粉）。须提供面粉供应商检验报告。', advisory: '밀 원료 공급국이 DON 오염 위험 지역(유럽 일부 등)인 경우 로트별 성적서 필수. 제아랄레논 ZEA 60 μg/kg 기준 초과 시 中 통관 거부.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GACC 进口商备案 + ePort — 수입 베이커리·과자류', lawUrl: 'https://www.samr.gov.cn/', requirement: '수입 가공식품(베이커리 포함) 해외 제조업체 GACC(海关总署) 境外企业注册 필수. 중국 수입업체 ePort 시스템 수입신고 의무. 위험등급별 검사 — 제과류 일반 서류검사. 통관 시 중국어 라벨 부착 완료 상태 제출.', originalRequirement: '进口加工食品（含糕饼）境外生产企业须向GACC注册。中国进口商须通过ePort系统申报进口。按风险等级进行检验。通关时须贴附完整中文标签。', advisory: 'GACC 미등록 업체 수출 불가. 중국어 라벨 인쇄본(스티커 포함) 통관 전 준비 필수. ePort 시스템 수입업체가 신고하므로 중국 현지 파트너 사전 협의 필수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', enforcementDate: '시행 중', law: 'GB 2762-2025 — 食品中污染物限量 알루미늄 (베이커리, 2026.09.02 의무)', lawUrl: 'https://www.samr.gov.cn/', requirement: '팽창제 유래 알루미늄(铝) ≤100 mg/kg(건중량 기준, 밀가루 기반 과자·팽창 베이커리). 알루미늄 함유 팽창제(황산알루미늄칼륨 등) 과량 사용 시 기준 초과 위험. 팽창제 성분 및 사용량 원료 공급업체 확인 필수.', originalRequirement: '膨松剂铝残留≤100 mg/kg（干重，小麦粉糕饼·膨化焙烤食品）。含铝膨松剂（如硫酸铝钾）过量使用易超标。需确认膨松剂成分及用量。', advisory: '알루미늄 기준 초과 시 수입 불허 및 반품. 팽창제(베이킹파우더) 알루미늄 free 제품으로 전환 시 기준 준수 용이. 원료 성분서에 팽창제 알루미늄 함량 명기 요청.' },
        {
          country: 'China (SAMR)',
          flag: '🇨🇳',
          enforcementDate: '2027.03.16',
          law: 'GB 7718-2025 — 알레르겐 8종 표시 의무 신설 (2027.03.16)',
          lawUrl: 'https://www.samr.gov.cn/',
          requirement: '중국 최초 알레르겐 의무 표시 — 베이커리 글루텐·달걀·우유·견과류·대두 알레르겐 표시. 8종(글루텐 함유 곡류·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 중국어 표시 의무. 수입 식품 Chapter 8 신규 적용.',
          advisory: '2027.03.16 시행. 1년 여 선제 준비 권장. 중국어 라벨 알레르겐 항목 신설 + Chapter 8 수입 특별 요건 동시 검토.',
        },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 24/2019/TT-BYT — 식품첨가물 허용기준 (VFA)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '아조계 색소(타르트라진, 선셋옐로우, 퀴놀린옐로우) 한도 강화 적용. Potassium Bromate 사용 전면 금지. 보존료(소르빈산·프로피온산) 한도 Circular 24 준수. 베트남어 라벨 필수.', originalRequirement: 'Tăng cường kiểm soát phẩm màu azo (Tartrazine, Sunset Yellow, Quinoline Yellow). Cấm hoàn toàn Potassium Bromate. Chất bảo quản theo Thông tư 24. Nhãn tiếng Việt bắt buộc.', advisory: 'Potassium Bromate 포함 제품 수출 즉시 중단. 아조계 색소 Circular 24 최신 한도 확인 필수. 수입 허가 갱신 2026.01 온라인 전환 사전 준비 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 111/2021/ND-CP — 라벨링 알레르겐·성분 표시 (베이커리)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '알레르겐(밀·달걀·우유·견과류·대두·참깨·생선·갑각류) 베트남어 의무 표시. 제조사·수입업체 이름·주소 베트남어 기재. 유통기한 DD/MM/YYYY 형식. 정량 표시(net weight) 베트남어 표기.', originalRequirement: 'Ghi nhãn chất gây dị ứng (lúa mì, trứng, sữa, hạt cây, đậu tương, vừng, cá, giáp xác) bằng tiếng Việt bắt buộc. Tên/địa chỉ nhà sản xuất và nhà nhập khẩu bằng tiếng Việt. Hạn sử dụng: DD/MM/YYYY. Khối lượng tịnh bằng tiếng Việt.', advisory: '베트남어 라벨 미부착 시 통관 불가. 알레르겐 8종 전 항목 베트남어로 표기 필수. 유통기한 형식 오류 반품 사례 있음 — DD/MM/YYYY 형식 철저 준수.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Thông tư 36/2018/TT-BNNPTNT — 잔류농약 원료 적합성 (베이커리)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '베이커리 주원료(밀가루·견과류·건과일) 잔류농약 Codex MRL 준용. 글리포세이트: 밀 Codex MRL ≤30 mg/kg(베트남 준용). 견과류 농약 성적서 원산지 공급업체 확보 권장.', originalRequirement: 'Nguyên liệu bánh (bột mì, hạt, trái cây sấy) tuân thủ MRL thuốc trừ sâu theo Codex. Glyphosate: MRL lúa mì theo Codex ≤30 mg/kg. Nên có giấy chứng nhận thuốc trừ sâu từ nhà cung cấp hạt.', advisory: 'Codex MRL 기준 초과 원료 사용 시 제품 전체 반품. 견과류 수입 원산지 잔류농약 MRL Thông tư 36 최신 목록과 대조 필수.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', enforcementDate: '시행 중', law: 'Decree 46/2026/ND-CP (舊 Decree 15 대체) — 정부 심사 수입 베이커리', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '일반 가공 베이커리 수입 시 자기선언서(Bản tự công bố) 제출 의무. 첨가물 성분 Circular 24 적합성 입증 서류 첨부. 원산지 증명서(C/O) 제출. MOH 사전 등록 불필요 — 수입업체가 자기선언 책임.', originalRequirement: 'Khi nhập khẩu bánh thông thường cần nộp Bản tự công bố. Kèm tài liệu chứng minh phụ gia theo Thông tư 24. Giấy chứng nhận xuất xứ (C/O). Không cần đăng ký MOH trước — nhà nhập khẩu chịu trách nhiệm tự công bố.', advisory: '자기선언 허위 제출 시 Decree 115/2018 행정처분(최대 5억 동 벌금). Circular 24 미허용 성분 포함 시 자기선언 불가 — 성분 사전 검토 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '2025.12.12', law: 'MOPH Notification No. 468 (2025.12.12 발효) — 과자·빵류 식품첨가물 (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: 'Cyclamate 사용 전면 금지(식품 내 허용 불가). 타르트라진(Tartrazine, E102) 최대 50mg/kg(No. 468 강화). 보존료·착색료 허용 목록 MOPH Notification No. 468 준수. 태국어 라벨 의무.', originalRequirement: 'ห้าม Cyclamate ในอาหารทุกประเภท Tartrazine สูงสุด 50 mg/kg วัตถุเจือปนตาม ประกาศ ฉบับที่ 468 (มีผลบังคับ 12 ธ.ค. 2568) ฉลากภาษาไทยบังคับ', advisory: 'Cyclamate·Potassium Bromate 함유 제품 태국 수출 금지. Tartrazine 50mg/kg 기준(MOPH No. 468, 2025.12.12) 적용. 2026.04 수입 허가 갱신 온라인 시스템 등록 사전 준비.', urgency: '주의' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH Notification No. 418 (2023) — 식품첨가물 기준 (베이커리)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '소르빈산 ≤1,000 mg/kg(빵·과자류). 프로피온산 ≤2,000 mg/kg(빵류). 타르색소 제한 목록 준수. 이산화황 ≤30 mg/kg(곡류 가공품). Potassium Bromate 전면 금지.', originalRequirement: 'กรดซอร์บิก≤1,000 mg/kg（ขนมปัง、ขนม）กรดโพรพิโอนิก≤2,000 mg/kg（ขนมปัง）สีผสมอาหารตามรายการที่กำหนด ซัลเฟอร์ไดออกไซด์≤30 mg/kg โพแทสเซียมโบรเมตห้ามใช้', advisory: 'MOPH No. 418(2023) 최신 허용 목록 확인 필수. Potassium Bromate 사용 즉시 금지. 타르색소 허용 목록 외 사용 적발 시 제품 폐기.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '시행 중', law: 'MOPH Notification No. 367 — 라벨링·알레르겐 (Thai FDA)', lawUrl: 'https://food.fda.moph.go.th/', requirement: '태국어 의무 표시. 알레르겐(밀·달걀·우유·땅콩·견과류·참깨·생선·갑각류·대두) 태국어 표시 의무. 영양성분표 의무. 제조자·수입자 태국어 정보 기재.', originalRequirement: 'ฉลากภาษาไทยบังคับ สารก่อภูมิแพ้（สาลี ไข่ นม ถั่วลิสง ถั่วเปลือกแข็ง งา ปลา กุ้งปู ถั่วเหลือง）ต้องระบุเป็นภาษาไทย ข้อมูลโภชนาการบังคับ', advisory: '태국어 라벨 미부착 시 통관 불가. 알레르겐 태국어 표시 누락 시 행정처분. 스티커 라벨 부착 허용 — 원본 라벨 완전 가림 불가.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', enforcementDate: '2019.01.10', law: 'MOPH Notification No. 388 — 부분경화유(PHO) 전면 금지', lawUrl: 'https://food.fda.moph.go.th/', requirement: '부분경화유(Partially Hydrogenated Oil, PHO) 식품 내 전면 사용 금지(2019.01.10 발효). 트랜스지방 의무 표시. 위반 시 형사처벌(최대 2년 징역 또는 벌금).', originalRequirement: 'น้ำมันที่ผ่านกระบวนการเติมไฮโดรเจนบางส่วน（PHO）ห้ามใช้ในอาหารทุกประเภท（มีผลบังคับ 10 ม.ค. 2562）บังคับแสดงกรดไขมันทรานส์ ฝ่าฝืนมีโทษจำคุกสูงสุด 2 ปีหรือปรับ', advisory: 'PHO 포함 마가린·쇼트닝 사용 제품 태국 수출 절대 금지. 쇼트닝 원료 공급처 PHO 여부 확인 필수. 트랜스지방 표시 의무 준수.', urgency: '주의' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPOM Reg. No. 22 Tahun 2019 + SNI 01-3840 (Bakery) + BPJPH 할랄 의무화', lawUrl: 'https://www.pom.go.id/', requirement: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능.', originalRequirement: 'Registrasi BPOM ML wajib untuk produk bakeri dan konfeksionari. Gelatin/shortening asal babi tidak diperbolehkan (persyaratan halal). Potassium Bromate dilarang. Hanya pewarna yang disetujui BPOM yang boleh digunakan.', advisory: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '시행 중', law: 'Permenkes No. 33/2012 — 베이커리 첨가물 허용기준', lawUrl: 'https://www.pom.go.id/', requirement: 'Potassium Bromate 금지. 아조디카본아미드(ADA) 금지. 허용 팽창제: 탄산수소나트륨·인산알루미늄나트륨 등 BPOM 승인 목록 내. 타르트라진(E102) 허용 기준량 이내 사용. 소르빈산 ≤1,000 mg/kg(과자류). 금지 성분 포함 시 통관 반송.', originalRequirement: 'Potassium Bromate and ADA (azodicarbonamide) banned. Permitted leavening agents limited to BPOM approved list (sodium bicarbonate, sodium aluminium phosphate, etc.). Tartrazine (E102) within permitted limits. Sorbic acid ≤ 1,000 mg/kg (confectionery). Products with banned additives rejected at customs.', advisory: 'ADA 사용 금지로 대체 팽창제 처방 개발 필수. 색소는 BPOM 허가 목록 내 성분만 — 연간 업데이트 확인 필요. Permenkes 33/2012 이후 개정 여부 BPOM 공식 채널 확인 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPOM ML 등록 절차 + 공인 수입업체(IT) 통한 통관', lawUrl: 'https://www.pom.go.id/', requirement: '수입 베이커리류 BPOM ML 등록 필수 — 소요 3~6개월, 갱신 5년 주기. 인도네시아 공인 수입업체(Importir Terdaftar, IT) 또는 LTO 보유 업체를 통해서만 통관 가능. 성분 변경 시 재등록 의무.', originalRequirement: 'BPOM ML registration mandatory for imported bakery products — 3~6 months processing time; 5-year renewal. Import only permitted through registered importers (Importir Terdaftar, IT) or LTO-holding entities. Any formulation change requires re-registration.', advisory: 'ML 등록 기간 최소 3~6개월 — 출시 일정에 여유 확보 필수. IT 파트너 선정 전 BPOM 공식 사이트에서 자격 확인. 소폭 성분 변경도 재등록 의무 — 위반 시 통관 거부.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', enforcementDate: '2026.10.17', law: 'BPJPH 할랄 전면 의무화 + 돼지 유래 성분 금지 (베이커리)', lawUrl: 'https://www.pom.go.id/', requirement: '2026.10.17 이후 수입 베이커리류 BPJPH 승인 할랄 인증 의무. 라드·돼지 유래 젤라틴·돼지 유래 유화제 전면 금지. 바닐린·색소·팽창제·쇼트닝 모두 BPJPH 승인 할랄 원산지 증명 필요.', originalRequirement: 'From 17 October 2026, imported bakery products must carry BPJPH-approved halal certification. Lard, pork-derived gelatine, and pork-derived emulsifiers completely prohibited. Vanillin, colours, leavening agents, and shortening all require BPJPH-approved halal origin documentation.', advisory: '2026.10.17 전면 의무화 이전 BPJPH 인증 취득 최소 6~12개월 소요 — 즉시 신청 권장. 해외 할랄 인증기관 BPJPH 승인 여부 사전 확인 필수(MUI 이외 기관 가능). 쇼트닝·마가린 돼지 유래 성분 완전 배제 및 서류화.', urgency: '주의' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 + BFAD 식품첨가물 기준 + Codex Stan 118 준용', lawUrl: 'https://www.fda.gov.ph/', requirement: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요.', originalRequirement: 'CPR registration and LTO mandatory for bakery products. Azo dyes such as Tartrazine (E102) require allergen declaration on label. Imported bakery products must be accompanied by phytosanitary certificate and certificate of origin.', advisory: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'DOH BFAD — 베이커리 첨가물 금지 성분 목록', lawUrl: 'https://www.fda.gov.ph/', requirement: 'ADA(아조디카본아미드) 금지. 브롬산 칼륨(Potassium Bromate) 금지. 허용 색소 Codex GSFA 준용 + FDA PH 독자 목록 준수. 소르빈산·안식향산 Codex 기준 적용. 성분 성적서 FDA PH 제출 필요.', originalRequirement: 'ADA (azodicarbonamide) banned. Potassium Bromate banned. Permitted colours follow Codex GSFA and FDA Philippines own list. Sorbic acid and benzoic acid follow Codex limits. Ingredient test certificates required by FDA PH.', advisory: 'ADA 금지로 대체 팽창제(고속 효모·SAPP 등) 처방 개발 필수. FDA PH 최신 허용 목록 확인 후 성분 확정. 수입 시 성분 성적서 영문 공인본 지참 권장.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: '필리핀 TRAIN법 — 가당 제과류 소비세', lawUrl: 'https://www.fda.gov.ph/', requirement: '가당음료(과일맛 시럽·초콜릿 음료) ₱6~12/L 가당음료세 적용. 가당 초콜릿·캔디: HS코드 분류에 따라 관세+TRAIN 소비세 이중 적용 가능. 수입 원가 산정 전 HS코드 관세사 확인 필수.', originalRequirement: 'Sweetened beverages (fruit-flavoured syrups, chocolate drinks) subject to ₱6~12/litre sugar-sweetened beverage tax. Sweetened chocolates and candies: import duty and TRAIN excise tax may both apply depending on HS code. HS code classification must be confirmed with a customs broker before calculating import costs.', advisory: 'HS코드 1704·1806 등 제과 분류별 세율 상이. 초콜릿 가당 음료는 가당음료세+관세 동시 적용 가능 — 사전 관세사 자문 필수. 저당·무가당 제품 라인이 세금 부담 최소화에 유리.' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', enforcementDate: '시행 중', law: 'FDA AO 2014-0030 — 영양표시·알레르겐 (영어+필리핀어 라벨)', lawUrl: 'https://www.fda.gov.ph/', requirement: '영어 라벨 필수(필리핀어 병기 권장). 알레르겐 8종(밀·달걀·우유·땅콩·견과류·대두·참깨·갑각류) 의무 표시. 영양성분(에너지·단백질·탄수화물·지방·나트륨) FDA 기준 표시. 수입업체 이름·주소·CPR 번호 라벨 기재.', originalRequirement: 'English labelling mandatory (Filipino labelling recommended). 8 allergens (wheat, eggs, milk, peanuts, tree nuts, soy, sesame, crustaceans) mandatory declaration. Nutritional information (energy, protein, carbohydrates, fat, sodium) per FDA AO standards. Importer name, address, and CPR number on label.', advisory: 'CPR 번호 라벨 기재 누락 시 반품 처리 빈번. 알레르겐 필리핀어 병기 시 현지 소비자 수용도 향상. 영양성분 단위(kcal·g) FDA PH 기준 준수 필수.' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', enforcementDate: '2026.01.01', law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Division 16 (Food Additives) + Health Canada Permitted Food Additives', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수.', originalRequirement: 'Potassium Bromate prohibited (banned in Canada since 1994). Azodicarbonamide (ADA) permitted up to 45 ppm. FOPL (Front-of-Package Labelling) mandatory for high-sugar bakery products from 2026.01.01. Bilingual (English/French) labelling required.', advisory: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Health Canada — 베이커리 허용 첨가물 목록 (FDR Division 16)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '프로피온산칼슘(방부제) 허용. 아조다이카본아마이드(ADA) ≤45 ppm(빵류). Potassium Bromate 전면 금지(1994년~). FDR Division 16 허용 목록 준수 의무.', originalRequirement: 'Calcium propionate permitted as preservative. Azodicarbonamide (ADA) ≤ 45 ppm in bread. Potassium Bromate prohibited since 1994. All additives must be on FDR Division 16 permitted list.', advisory: 'ADA 사용 시 45 ppm 한도 준수. Potassium Bromate 금지 성분 사전 확인 필수. Division 16 목록 외 첨가물 사용 시 수입 허가 불가.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA — 알레르겐 9종 의무 표시 (FDR B.01.010.1)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '밀·달걀·우유·땅콩·트리너트·참깨·생선·갑각류·대두 9종 의무 표시. "May Contain" 교차오염 자율 표시. 영어·불어 이중 표기 의무.', originalRequirement: 'Mandatory declaration of 9 priority allergens: wheat, eggs, milk, peanuts, tree nuts, sesame, fish, crustaceans and soy. "May Contain" cross-contact advisory voluntary. Bilingual English/French required.', advisory: '참깨 2021년 알레르겐 추가 확인. 영어·불어 동일 내용 이중 표기 필수 — 단일 언어 표기 위반. 교차오염 경고 권장.', enforcementDate: '시행 중' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'CFIA FOPL — 베이커리 전면 영양 표시 (2026.01.01 의무화)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '고당류·고포화지방·고나트륨 베이커리 제품 경고 라벨 의무화(2026.01.01). 쿠키·케이크·크래커류 해당 가능성 높음. 영어·불어 이중 영양성분 표시 필수.', originalRequirement: 'Front-of-Package Labelling (FOPL) mandatory for high-sugar, high-saturated fat and high-sodium bakery products from 2026.01.01. Cookies, cakes and crackers are likely subject. Bilingual nutrition facts required.', advisory: 'FOPL 도입 전 당류·나트륨 저감 또는 경고 라벨 사전 디자인 준비 권장. 캐나다 독자 FOPL 규정으로 별도 라벨 제작 필수.', enforcementDate: '2026.01.01' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 / JAKIM Halal MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'Food Regulations 1985 허용 첨가물 목록 준수. 라드(돼지기름)·돼지 유래 젤라틴 사용 금지 — JAKIM 인증 식물성 쇼트닝으로 대체 필수. MeSTI 인증 권장. 말레이어 표시 의무.', originalRequirement: 'Pematuhan senarai bahan tambah yang dibenarkan dalam Food Regulations 1985 diperlukan. Lemak babi (lard) dan gelatin berasi babi dilarang sepenuhnya — shortening sayur-sayuran bertauliah JAKIM wajib digunakan sebagai pengganti. Pensijilan MeSTI disyorkan. Pelabelan bahasa Melayu diwajibkan.', advisory: '제과류 내 라드(돼지기름)·젤라틴(돼지 유래) 사용 전면 금지. JAKIM 인증 식물성 쇼트닝으로 대체 필수. 타르트라진 등 아조계 색소 허용 목록 확인.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 — 베이커리 첨가물 허용 한도', lawUrl: 'https://www.moh.gov.my/', requirement: '브롬산 칼륨(Potassium Bromate) 금지. 타르트라진(E102) ≤100 mg/kg, 선셋옐로우(E110) ≤100 mg/kg. ADA(아조디카본아미드) 허용(45 mg/kg). 소르빈산 ≤1,000 mg/kg(과자류). 비허용 첨가물 적발 시 즉시 반송.', originalRequirement: 'Potassium Bromate prohibited. Tartrazine (E102) ≤ 100 mg/kg, Sunset Yellow (E110) ≤ 100 mg/kg. ADA permitted up to 45 mg/kg. Sorbic acid ≤ 1,000 mg/kg (confectionery). Non-permitted additives result in immediate rejection.', advisory: 'Food Regulations 1985 최신 허용 목록 교차 확인 필수. 타르트라진·선셋옐로우 과용 시 반송 — 색소 함량 성적서 지참 권장. EU 기준과 일부 허용량 상이함에 주의.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'Food Regulations 1985 — 알레르겐 표시 (영어·말레이어 의무)', lawUrl: 'https://www.moh.gov.my/', requirement: '알레르겐 의무 표시: 밀(글루텐)·달걀·우유·견과류·대두·참깨·생선·갑각류. 영어·말레이어 이중 표기 의무. 알레르겐 볼드(굵게) 또는 색상 강조 권장. 말레이어 성분명 오역 시 판매 금지.', originalRequirement: 'Mandatory allergen declaration: wheat (gluten), eggs, milk, tree nuts, soy, sesame, fish, crustaceans. Bilingual English and Malay labelling mandatory. Bold or coloured highlighting of allergens recommended. Incorrect Malay ingredient translations result in sales prohibition.', advisory: '말레이어 성분명 번역 현지 전문가 검수 필수. "Mengandungi" 알레르겐 표기 방식 Food Regulations 준수. 제과류 견과류 종류별 명칭(badam·kacang walnut 등) 말레이어로 정확히 기재.' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', enforcementDate: '시행 중', law: 'MeSTI 인증 + JAKIM 할랄 원료 증빙 (베이커리 쇼트닝·유화제)', lawUrl: 'https://www.moh.gov.my/', requirement: '수출 제조업체 MeSTI 인증 서류 수입업체 비치 의무. 쇼트닝·마가린·유화제 JAKIM 할랄 인증 원산지 증명서 제출. 동물성 젤라틴 사용 시 JAKIM 승인 도축 시설 증명 필수.', originalRequirement: 'Importer must hold MeSTI certification documents for the exporting manufacturer. Halal certification origin documentation required for bakery shortening, margarine, and emulsifiers via JAKIM. Use of animal-derived gelatine requires JAKIM-approved slaughter facility certificate.', advisory: 'MeSTI 인증 없는 제조업체 제품 말레이시아 대형마트 입고 거부 사례 증가. 쇼트닝·마가린 원료 JAKIM 할랄 원산지 증명 사전 확보 후 수출 진행. 젤라틴 대신 카라기난·한천 사용 시 말레이시아 수출 용이.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', enforcementDate: '시행 중', law: 'Food Standards Code Standard 2.9.1 / Biosecurity Act 2015', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.9.1 제과 성분 기준 준수. Potassium Bromate 사용 금지. 난황·우유 성분 포함 제품은 Biosecurity Import Permit 취득 여부 사전 확인 필수.', originalRequirement: 'Must comply with Food Standards Code Standard 2.9.1 compositional requirements for bakery products. Potassium Bromate prohibited. Products containing egg yolk or dairy ingredients must confirm DAFF Biosecurity Import Permit requirement prior to export.', advisory: '난황·우유 성분 포함 제과류 바이오보안 수입 허가 대상 여부 확인 필수. Potassium Bromate 금지. Health Star Rating 표시 시 제과류 경쟁력 강화 효과 기대.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.3.1 — 베이커리 허용 첨가물', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '아조다이카본아마이드(ADA) 사용 금지(호주 불허). Potassium Bromate 금지. 프로피온산칼슘 허용(빵류). FSANZ Standard 1.3.1 허용 목록 외 첨가물 사용 금지.', originalRequirement: 'Azodicarbonamide (ADA) prohibited in Australia. Potassium Bromate prohibited. Calcium propionate permitted in bread. Only additives on FSANZ Standard 1.3.1 permitted list may be used.', advisory: 'ADA·Potassium Bromate 금지 성분 사전 제거 필수. 허용 방부제 프로피온산칼슘으로 대체 검토. 첨가물 목록 FSANZ 사이트 최신 확인.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.3 — 알레르겐 표시 (베이커리 10종)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '밀(글루텐)·달걀·우유·땅콩·트리너트·참깨·대두·어류·갑각류·루핀 10종 의무 표시. 교차오염 "May Be Present" 자율 표시 권장.', originalRequirement: 'Mandatory declaration of 10 allergens: wheat (gluten), eggs, milk, peanuts, tree nuts, sesame, soy, fish, crustaceans and lupin. Voluntary "May Be Present" advisory for cross-contact.', advisory: '루핀(Lupin) 알레르겐은 호주 고유 규정(EU와 공통). 교차오염 경고 자율이나 실무적으로 필수. 영어 단독 표기 의무.', enforcementDate: '시행 중' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.2.7 + HSR — 베이커리 영양성분 표시', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '영양성분표(에너지·단백질·지방·탄수화물·당류·나트륨) 의무 표시. Health Star Rating 자율(고당류·고지방 베이커리 불리). 1회 제공량 기준 표기.', originalRequirement: 'Mandatory Nutrition Information Panel: energy, protein, fat, carbohydrate, sugars, sodium. Health Star Rating voluntary but strategically significant (bakery products typically score low). Per-serving basis permitted.', advisory: 'HSR 1.5성 미만 시 시장 경쟁력 불이익. 고당류 베이커리 선제 HSR 계산기 적용 권장. 나트륨·포화지방 저감화로 HSR 개선 가능.', enforcementDate: '시행 중' },
        {
          country: 'Australia (FSANZ)',
          flag: '🇦🇺',
          enforcementDate: '2026.02.25',
          law: 'Food Standards Code Standard 1.2.3 PEAL (Plain English Allergen Labelling)',
          lawUrl: 'https://www.foodstandards.gov.au/',
          requirement: '⚠️ [즉시 시행] 베이커리 제품 밀(Wheat)·달걀·견과류·우유 알레르겐 개별 표기 의무. "Tree nuts" 일괄 표기 불허 → 아몬드·캐슈·호두·피스타치오 등 개별 명시. "Seafood" 불허 → Fish/Crustacean/Mollusc 개별 구분. Schedule 9 기준 개별 알레르겐 명칭 전환 의무.',
          advisory: '⚠️ 2026.02.25 이미 시행. "Tree nuts"·"Seafood" 일괄 표기 즉시 비적합. Schedule 9 기준 개별 알레르겐 명칭으로 전환 필수. 뉴질랜드 동일 적용.',
          urgency: '긴급',
        },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', enforcementDate: '시행 중', law: 'GSO 첨가물 기준 / GSO 영양 표시 2026 개정판 / ESMA 등록', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 허용 첨가물 목록 준수(발색제·보존료·유화제). 아랍어 성분명·알레르겐·유통기한·영양성분 전 항목 표기. ESMA 등록 의무. 동물성 유래 쇼트닝·라드 사용 시 할랄 인증 필수. Potassium Bromate 금지.', advisory: '마가린·쇼트닝 원료 동물성 여부 할랄 증명서 첨부. Potassium Bromate 사용 불가(GCC 금지). 설탕세(Excise Tax) 부과 고당류 제과류 UAE 수출 시 가격 경쟁력 영향 분석 필요.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', enforcementDate: '시행 중', law: 'TR TS 021/2011 / TR TS 029/2012 (첨가물) / TR TS 022/2011 (표시)', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 + 국가위생증명서(СГР) 필수. TR TS 029/2012 허용 첨가물 목록 준수. Potassium Bromate 금지. E171(이산화티타늄) 허용(EU 2022 금지와 상이). 러시아어 성분·영양성분·유통기한 전 항목 표기.', advisory: 'EAEU 첨가물 기준이 EU와 상이 — E-넘버 허용 여부 TR TS 029/2012로 재확인 필수. Potassium Bromate 사용 제품 수출 불가. 빵류 국가표준(ГОСТ) 준수 여부 표기 관행 있음.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Cap 132U Additives', lawUrl: 'https://www.cfs.gov.hk/', requirement: '제과·베이커리: Pre-market approval 불필요. 첨가물은 Cap 132U 허용 목록 준수. 영양성분 표시 의무. 영어·번체 중국어 병기 라벨 필수. Potassium Bromate 금지. E171(이산화티타늄): 중국 본토와 달리 홍콩에서 사용 가능(Codex 기준).', originalRequirement: 'Bakery/confectionery: no pre-market approval required. Additives must be from Cap 132U permitted list. Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling required. Potassium Bromate banned. E171 (titanium dioxide): permitted in Hong Kong unlike mainland China (Codex standard applies).', advisory: '홍콩은 Codex 기반 대부분 성분 허용. 단, Cap 132U 목록 외 첨가물 사용 시 위반. 번체자 병기 필수 — 간체자만 표기 시 판매 불가. E171 홍콩 허용이나 EU 수출 병행 시 성분 관리 분리 필요.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132U — 식품첨가물 (베이커리)', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'ADA(아조디카본아미드)·브롬산 칼륨(Potassium Bromate) 금지. E171(이산화티타늄) 홍콩 내 허용(EU와 달리, Codex 기준 적용). 허용 색소·보존료·유화제 Cap 132U 목록 준수. 허용 목록 외 첨가물 사용 시 판매 금지 처분.', originalRequirement: 'ADA (azodicarbonamide) and Potassium Bromate prohibited. E171 (titanium dioxide) permitted in Hong Kong (unlike EU ban, Codex standard applied). Permitted colours, preservatives, and emulsifiers must be from Cap 132U list. Use of non-listed additives results in removal order.', advisory: 'EU 수출과 홍콩 수출을 병행하는 경우 E171 포함 여부로 배합 분리 관리 필요. Cap 132U 목록은 수시 업데이트 — 수출 전 CFS 최신 버전 확인 권장.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 트랜스지방 영양표시 (베이커리)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '트랜스지방산(TFA) ≥0.3 g/100g인 경우 영양성분표에 트랜스지방 항목 추가 의무. 에너지·단백질·탄수화물·지방·포화지방·나트륨 의무 표시. 제과류 1회 제공량 기준 영양정보 표기.', originalRequirement: 'Trans fatty acids (TFA) ≥0.3 g/100g requires mandatory addition of trans fat entry in Nutrition Information panel. Mandatory items: energy, protein, carbohydrates, fat, saturated fat, sodium. Nutrition information per serving size for confectionery products.', advisory: '부분수소화유(PHO) 성분 사용 시 TFA 0.3 g/100g 초과 가능 — 사전 TFA 함량 분석 권장. 홍콩 소비자 저트랜스지방 제품 선호도 높음.' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', enforcementDate: '시행 중', law: 'Cap 132W — 알레르겐·번체자 라벨 (베이커리)', lawUrl: 'https://www.cfs.gov.hk/', requirement: '밀(글루텐)·달걀·우유·땅콩·견과류·참깨·대두·생선·갑각류 등 알레르겐 번체자(繁體字) 의무 표시. 영어·번체자 병기 필수 — 간체자 단독 표기 불인정. 성분명 모두 영어+번체자 대조 표기.', originalRequirement: 'Allergens including wheat/gluten, eggs, milk, peanuts, tree nuts, sesame, soy, fish, and crustaceans must be declared in Traditional Chinese characters. Bilingual English/Traditional Chinese labelling mandatory — Simplified Chinese alone not accepted. All ingredient names must appear in both English and Traditional Chinese.', advisory: '중국 본토(간체자) 라벨 그대로 사용 시 홍콩 통관 거부 — 번체자 별도 라벨 제작 필수. 간체자+번체자 병기 표기는 허용. 알레르겐 누락 시 즉각 판매 금지 조치.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '시행 중', law: 'UK Retained Regulation (EC) 1333/2008 Annex II Cat 07 / UK Food Safety Act', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained Food Additives Reg(EU Reg 1333/2008 기반) 준수. E171(이산화티타늄): UK 독자 판단 — 현재 EU 금지 기준 미반영 여부 FSA 최신 확인 필수. Potassium Bromate 금지. PHO(부분수소화유) 금지. 트랜스지방 EU 동일 기준. 영어 단독 표기.', originalRequirement: 'Must comply with UK Retained Food Additives Regulation (based on EU Reg 1333/2008). E171 (titanium dioxide): UK making independent determination — verify current FSA status (EU ban may not be automatically mirrored). Potassium Bromate banned. PHO (Partially Hydrogenated Oils) banned. Trans fat standards same as EU. English-only labelling.', advisory: 'Brexit 이후 EU 첨가물 금지 결정이 UK에 자동 적용 안 됨 — E171 등 논란 성분 UK FSA 최신 상태 확인 필수. UK FOPL(Front-of-Package Labelling) 도입 검토 중 — 동향 모니터링 권장. NI 판매 시 EU 첨가물 규정 적용(별도).', urgency: 'Post-Brexit' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '2025.10.01', law: 'HFSS Advertising Restrictions — 고지방·고당·고염 제품 온라인 광고 금지 (2025.10 시행)', lawUrl: 'https://www.food.gov.uk/', requirement: '[Brexit Divergence] HFSS 식품 온라인·유료 광고 전면 금지(2025.10.01 시행). 영국 FSA 영양 프로파일링 모델(NPM) 기준 해당 제과류·비스킷·초콜릿·아이스크림·즉석식품 온라인 광고 금지. TV 오전 5시~오후 9시(watershed) HFSS 광고 금지. 광고 금지 대상 미설탕·무가당 제품 NPM 재계산 후 예외 인정 가능.', advisory: '영국 온라인(SNS·유튜브·디스플레이) 마케팅 채널 HFSS 해당 여부 FSA NPM 계산 후 확인 필수. HFSS 해당 시 영국 디지털 광고 전략 전면 재검토 필요. EU(EU 독자 광고 규제 없음) vs UK 마케팅 채널 분리 운영 권장.', urgency: 'Post-Brexit' },
      { country: 'UK (FSA/ASA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '2026.01.05', law: 'HFSS 광고 규제 — 법적 효력 발생 (2026.01.05 Statutory Enforcement)', lawUrl: 'https://www.food.gov.uk/business-guidance/restricting-promotions-of-products-high-in-fat-sugar-and-salt', requirement: '[법적 강제 단계] 250인 이상 기업 HFSS 광고 규제 법적 효력 2026.01.05 발생. 온라인 유료 광고 전면 금지: SNS·검색·디스플레이·인플루언서 유료 협찬 포함. TV: 오전 5:30~오후 9:00 watershed 방영 금지. NPM(영양 프로파일링 모델) 4점 이상 = HFSS 해당. 비스킷·초콜릿·아이스크림·스낵·탄산음료·가당 시리얼 주요 해당. 250인 미만 소규모 기업 및 학교 급식·병원·항공기 내 판매는 적용 제외.', originalRequirement: 'Statutory enforcement of HFSS (High Fat, Sugar or Salt) advertising restrictions from January 5, 2026 for businesses with 250+ employees. Online paid-for advertising including social media, search, display and paid influencer promotion fully banned. TV: banned between 5:30am–9:00pm. NPM score 4+ = HFSS. Exemptions: businesses <250 employees, school catering, hospital food, in-flight food.', advisory: '한국 식품 UK 수출 시 영국 내 마케팅 대행사·유통업체 광고 계약에 HFSS 조항 포함 여부 확인 필수. NPM 계산 도구(FSA 제공)로 제품별 점수 사전 산출 권장. HFSS 해당 제품은 인플루언서·SNS 유료 광고 계약 시 UK 적용 예외 명시 필요. 저당·저지방 대안 제품 개발 시 NPM 면제 인정 가능.' },
      { country: 'UK (FSA/DEFRA) [Post-Brexit]', flag: '🇬🇧', enforcementDate: '2025.07.01', law: '"Not for EU" 라벨 의무화 — Brexit 최종 포장 분리 단계', lawUrl: 'https://www.food.gov.uk/business-guidance/packaging-and-labelling', requirement: 'Brexit 최종 단계 — GB(영국 본토) 시장 판매 식품 포장과 EU 시장 판매 식품 포장 완전 분리 의무화. 신선식품(계란·생선·과일·채소·육류): 2025.07.01. 복합 가공 식품: 2025.10.01. UK 전용 포장에 "Not for EU" 또는 "GB Only" 표시 권장(EU 판매 포장과 명확히 구별). NI(북아일랜드) 판매 제품은 EU 규정 적용 → "Not for EU" 불필요.', originalRequirement: 'Final Brexit labelling stage: GB (Great Britain) market and EU market packaging must be fully separated. Fresh foods (eggs, fish, fruit, vegetables, meat): from 2025.07.01. Composite processed foods: from 2025.10.01. "Not for EU" or "GB Only" marking recommended on UK-only packaging to clearly distinguish from EU-bound packaging. Northern Ireland sales: EU rules apply — "Not for EU" not required.', advisory: '영국 GB 시장과 EU 시장 동시 수출 시 포장재 이원화 필수 — 단일 포장 병용 불가. 스티커 부착으로 임시 대응 가능하나 영구적 포장 분리 권장. NI 수출 시 EU SPS/라벨링 기준 적용 확인(Windsor Framework). 단일 제품 영국·EU 동시 납품 시 공급망 분리 및 SKU 이원화 필요.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '시행 중', law: 'Verordnung über Zusatzstoffe in Lebensmitteln (ZuV) / Verordnung über Backwaren / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'ZuV 식품 첨가물 규정 준수(EU Reg 1333/2008과 대부분 일치하나 독자 운영). E171(이산화티타늄): 스위스 독자 검토 중 — 현재 상태 FSVO 확인 필수. Potassium Bromate 금지. 유기농 베이커리 Bio Suisse 기준. 국내 언어 최소 1개 라벨 의무.', originalRequirement: 'Must comply with ZuV Food Additives Ordinance (largely aligned with EU Reg 1333/2008 but independently administered). E171 (titanium dioxide): under Swiss independent review — verify current FSVO status. Potassium Bromate banned. Organic bakery: Bio Suisse standards. Labelling in at least one Swiss national language mandatory.', advisory: '스위스 ZuV와 EU 첨가물 목록 대부분 일치하나 일부 항목 독자 결정 — 수출 전 FSVO 최신 목록 교차 확인. E171 스위스 현황 EU 금지와 다를 수 있음. 유기농 베이커리 Bio Suisse 인증이 스위스 시장 필수 요건.' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', enforcementDate: '2026.07.20', law: 'RS 817.023.21 — 비스페놀(BPA 포함) 식품 접촉 자재 금지 / EU Reg (EU) 2023/2468 동기화', lawUrl: 'https://www.blv.admin.ch/', requirement: 'RS 817.023.21 개정 (2026.07.20 시장 출하 마감) — BPA 포함 비스페놀류 FCM 금지. 베이커리 관련: 폴리카보네이트 초콜릿 몰드·에폭시 코팅 베이킹 트레이·BPA 함유 포장재 포함. 유기농 베이커리 Bio Suisse 포장재 기준과 병행 준수 필요.', advisory: '초콜릿 성형 몰드(폴리카보네이트) BPA 함유 여부 제조사 확인 필수. 에폭시 코팅 금속 베이킹 트레이 대체재(스테인리스·실리콘) 검토. 2026.07.20 이후 비적합 도구·포장재 신제품 사용 불가. FCM DoC 미보유 시 스위스 통관 지연.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 1333/2008 + [Local] Arrêté du 8 fév 2021 (E171 금지) / Nutri-Score', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] E171(이산화티타늄): 프랑스 2021.01.01부터 단독 금지(EU 전체 금지 2022.02보다 선행). Nutri-Score 의무(제과류 포함). Loi Egalim: 고당류 제과 광고 제한. 글리포세이트 잔류 밀가루 강화 모니터링. PHO 금지(EU 공통). 트랜스지방 ≤ 2g/100g 지방(EU 공통).', originalRequirement: '[Strict Local Rule] E171 (titanium dioxide): France independently banned from 2021.01.01 (preceding EU-wide ban of 2022.02). Nutri-Score mandatory for bakery products. Loi Egalim: advertising restrictions on high-sugar confectionery. Enhanced monitoring of glyphosate in flour. PHO banned (EU-wide). Trans fat ≤ 2g/100g fat (EU-wide).', advisory: '[EU Deviation] 🚨 E171 사용 제품 프랑스 수출 절대 금지 — EU 금지(2022.02) 이전 프랑스 이미 금지(2021.01) 시행. 프랑스 수출 베이커리 E171 대체 성분(스타치·탄산칼슘 등) 즉시 적용 확인. Nutri-Score 제과 점수 D 이하 시 프랑스 시장 경쟁력 불이익.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', enforcementDate: '1993.09.22', law: '[Local] Décret n°93-1074 du 13 septembre 1993 (Pain de Tradition Française) + [EU Base] Reg (EC) 1333/2008 + Arrêté du 13 septembre 1993', lawUrl: 'https://www.economie.gouv.fr/dgccrf/', requirement: '[Strict Local Rule] Décret 93-1074 — "Pain de Tradition Française" 법적 조성 기준: ① 밀가루·물·소금·천연 이스트/발효종만 허용 ② 냉동 공정 금지 ③ 개량제(로, 유화제제, 산화제 등 Améliorants) 사용 금지. 일반 빵 — Reg (EC) 1333/2008 허용 쳊가물 사용 가능. E171(이산화티타늄) 프랑스 2020.01 단독 금지(EU 전체 2022 금지보다 2년 선행). Nutri-Score 빵·베이커리 자율 의무화 — 프랑스 시장 채택률 높음.', advisory: '"Pain de Tradition Française" 명칭 사용 시 Décret 93-1074 완전 준수 필수 — 냉동 전처리 제품 적용 불가. 한국 수출 베이커리 프랑스 현지 OEM 제조 시 반드시 Décret 확인. Nutri-Score 미표시 시 프랑스 제과 유통망 진입 어려움. DGCCRF 제과·베이커리 집중 단속 — 쳊가물 표시 + 원산지 병행 점검. Artisan(장인) 명칭 사용 요건 — 프랑스 장인법 별도 규정 준수 필요.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', enforcementDate: '시행 중', law: '[HU] NETA 2011 (제과·스낵) / [FI] Soft Drink Tax / [DK] Sugar Tax / [NO] Avgift sukker', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 고당류 과자·사탕·초콜릿바 건강세 부과(상품별 차등세율). 핀란드 가당음료세: 음료성 제과(가당 시럽·초콜릿 음료) 포함 여부 확인. 노르웨이 설탕세(Avgift sukker): 설탕 kg당 세금 부과 — 초콜릿·제과류 직접 영향. 덴마크: 지방세 폐지(2012), 설탕세 논의 재개.', originalRequirement: '[EU Divergence] Hungary NETA: high-sugar confectionery, candy, chocolate bars subject to health tax (differentiated rates). Finland soft drink tax: verify inclusion of confectionery beverages (sweetened syrups, chocolate drinks). Norway sugar tax (Avgift sukker): per-kg sugar tax directly impacts chocolate/confectionery. Denmark: fat tax abolished (2012), sugar tax discussion restarted.', advisory: '노르웨이 설탕세가 제과류 원가에 직접 영향 — 수출 가격 경쟁력 분석 필수. 헝가리 NETA 제과 세율표 최신 버전 확인 및 제품별 세금 부담 계산. 저당·무가당 제과 라인 개발로 북유럽·헝가리 세금 부담 최소화 전략 권장.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', enforcementDate: '시행 중', law: '[EU Base] Reg (EC) 1333/2008 + [Local] ZZulV (Zusatzstoff-Zulassungsverordnung) / LFGB / Leitsätze für Brot', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Local Standard] ZZulV — EU 1333/2008 독일 구현 법령. 독일 식품법위원회(DLG) Leitsätze für Brot und Kleingebäck — 빵·소형 베이커리 표준 조성 가이드라인(법적 구속력 없으나 BVL 판단 기준 활용). Nutri-Score 자율 표시 2020 도입 — 독일 소매 체택률 높음. 알레르겐 14종 LMIV 의무 표시.', advisory: '독일 소매(Aldi·Lidl·REWE·Edeka) 낙품 시 Nutri-Score 표시 실질적 요구 증가. Leitsätze 기준 외 성분(아조디카본아미드 등) BVL 위반 소지. 독일 유기 베이커리 EU Bio + Naturland/Demeter 인증 체계 적용.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇸🇪🇳🇴🇩🇰', enforcementDate: '시행 중', law: '[SE] Livsmedelsverket Nyckelnålet / [NO/DK] Nøkkelhullet/Nøglehullet — 빵·시리얼·제과류 영양 기준', lawUrl: 'https://www.livsmedelsverket.se/', requirement: '[Nordic Market Requirement] 빵·시리얼·크래커류 Keyhole 기준 — 통곡물 비율(≥25%)·지방(≤7%)·나트륨(≤600mg/100g)·당류(≤5g/100g) 동시 충족 시 표시 가능. 초콜릿·비스킷·케이크류 → 기준 미충족. 통밀빵·호밀빵·저당 크래커 → 취득 유리.', advisory: '[FI] Sydänmerkki(핀란드 심장 마크) 별도 기준 — 핀란드 시장 추가 인증 검토. 스칸디나비아 통밀/호밀빵 수출 시 Keyhole 인증 경쟁력 핵심. 취득 절차: Livsmedelsverket/Mattilsynet 신청 + 성분 분석 성적서 제출. 인증 유효기간 3~4년.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', enforcementDate: '2026.04.01', law: '食品添加物公定書 改正 (内閣府令 2025.03.28) — 62종 표기명 개정 / アレルゲン28種 완전 의무화', lawUrl: 'https://www.caa.go.jp/', requirement: '[2025.03.28 공포] ① 제과·빵류 영양강화 첌가물(비타민 E·D·B군·칼쉼 강화제) 전 성분 의무 표시. ② 62종 표기명 개정 — 보존료·유화제·발색제 표기명 교체 의무. ③ 胡桃(くるみ, 호두) 알레르겐 2025.03 의무 포함 기 시행. 냉동 제과·빵류 2026.04.01 즉시 적용.', advisory: '제과·빵류 성분표 전수 감사 — 62종 개정 표기명 교체 + 영양강화 첌가물 추가 표시. 호두 알레르겐 2025.03 이미 시행(미표시 시 즉시 위반). 냉동 베이커리 2026.04.01 이전 라벨 개정 완료 권장.' },
      { country: 'Singapore (SFA)', flag: '🇸🇬', enforcementDate: '2026.01.30', law: 'Singapore SFA — Gluten-Free Claims Standard 개정 (2026.01.30 시행)', lawUrl: 'https://www.sfa.gov.sg/', requirement: '[2026.01.30 시행] 글루텐 프리 표시 기준 강화 — Codex 기준 채택: 글루텐 함량 ≤20 ppm. 라벨 "Gluten-Free" 표시 시 ≤20 ppm 분석 성적서 첨부 의무. 대상: 포장 식품(베이커리·스낵·파스타·가공식품 포함). 온라인 판매 플랫폼 — 2026.06.30까지 유예(온라인 표시 기준 별도 고시 예정).', originalRequirement: 'Revised gluten-free claims standard effective 30 January 2026 — adopts Codex standard: gluten content ≤20 ppm. Analytical test certificate (≤20 ppm) mandatory when labelling product as "Gluten-Free". Applies to all pre-packaged food (bakery, snacks, pasta, processed foods). Online retail platforms: grace period until 30 June 2026 pending separate e-commerce labelling guidance.', advisory: '싱가포르 "Gluten-Free" 표시 제품 성적서(≤20 ppm) 반드시 구비. 기존 임의 기준 사용 제품 성적서 재발급 및 기준 적합 여부 재확인. 온라인 수출 채널(Shopee·Lazada SG) 2026.06.30 유예 기간 내 표시 기준 업데이트 계획 수립 권장.' },
    ],
  },
};

const FoodCategorySection = ({ tabKey, searchQuery }: { tabKey: string; searchQuery: string }) => {
  const data = CATEGORY_DATA[tabKey];
  if (!data) return null;
  const { title, icon: Icon, rows } = data;
  const filtered = (searchQuery
    ? rows.filter(r =>
        r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.law.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requirement.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rows
  ).slice().sort((a, b) => {
    const getTs = (d?: string): number => {
      if (!d || d === '시행 중') return Infinity;
      if (d.includes('예정') || d.includes('~')) return Infinity - 1;
      const m = d.match(/(\d{4})[.\-](\d{2})[.\-](\d{2})/);
      if (m) {
        const dt = new Date(`${m[1]}-${m[2]}-${m[3]}`);
        return dt > new Date() ? dt.getTime() : Infinity;
      }
      const ym = d.match(/(\d{4})[.\-](\d{2})/);
      if (ym) {
        const dt = new Date(`${ym[1]}-${ym[2]}-01`);
        return dt > new Date() ? dt.getTime() : Infinity;
      }
      return Infinity;
    };
    return getTs(a.enforcementDate) - getTs(b.enforcementDate);
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Icon className="size-7 text-primary" />
          {title}
        </h2>
        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
          {filtered.length} countries / authorities
        </span>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500 w-36">Country / Authority</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500 w-52">Applicable Law / Standard</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 w-24 whitespace-nowrap">시행일</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">Key Requirements</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-primary w-64">R&D Advisory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-bold leading-snug">{r.flag} {r.country}</p>
                    {(() => {
                      const dday = getDDay(r.enforcementDate);
                      const showUrgency = r.urgency && !r.urgency.match(/^D-\d/);
                      return (
                        <>
                          {dday && <span className="mt-1 inline-block px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded italic">{dday}</span>}
                          {showUrgency && <span className="mt-1 inline-block px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded italic">{r.urgency}</span>}
                        </>
                      );
                    })()}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs font-semibold text-primary/80 leading-snug flex-1">{r.law}</span>
                    {r.lawUrl && (
                      <a href={r.lawUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 flex-shrink-0 mt-0.5 transition-colors">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className={`px-5 py-4 text-xs whitespace-nowrap ${getDateStyle(r.enforcementDate)}`}>
                  {r.enforcementDate ? getDateDisplay(r.enforcementDate) : '—'}
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.requirement}</p>
                  {r.originalRequirement && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">{r.originalRequirement}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {r.advisory}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Notified Functional Ingredients — Multi-Country ──────────────────────────
type NotifiedRow = { name: string; nameLocal: string; function: string; functionLocal?: string; limit: string; lawRef: string; lawUrl: string; };
type NotifiedCountry = { code: string; flag: string; label: string; systemName: string; systemDesc: string; rows: NotifiedRow[]; };

const NOTIFIED_COUNTRIES: NotifiedCountry[] = [
  {
    code: 'KR', flag: '🇰🇷', label: 'South Korea (MFDS)',
    systemName: '고시형 원료 (Notified Functional Ingredients)',
    systemDesc: '식약처가 기능성·안전성을 사전 검토하여 고시한 원료. 별도 개별인정 없이 기준·규격 충족 시 사용 가능.',
    rows: [
      { name: 'Glucosamine', nameLocal: '글루코사민', function: '관절 및 연골 건강에 도움', limit: '1,500 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Probiotics (Lactobacillus spp.)', nameLocal: '유산균(프로바이오틱스)', function: '장내 유익균 증식 및 유해균 억제, 배변 활동 원활', limit: '1억~100억 CFU/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Omega-3 (EPA+DHA)', nameLocal: '오메가-3 지방산', function: '혈중 중성지방 개선, 혈행 개선에 도움', limit: 'EPA+DHA 0.5~2 g/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Red Yeast Rice Extract', nameLocal: '홍국 추출물', function: '혈중 콜레스테롤 개선에 도움', limit: '모나콜린K 4~8 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Coenzyme Q10', nameLocal: '코엔자임 Q10', function: '항산화에 도움', limit: '90~100 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Lutein', nameLocal: '루테인', function: '눈 건강(황반색소 밀도 유지)에 도움', limit: '10~20 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Milk Thistle Extract (Silymarin)', nameLocal: '밀크씨슬 추출물', function: '간 건강에 도움', limit: '실리마린 130 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: '비타민 C', function: '항산화, 피부 건강, 철 흡수율 증가에 도움', limit: '100~1,000 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp' },
    ],
  },
  {
    code: 'US', flag: '🇺🇸', label: 'USA (FDA)',
    systemName: 'GRAS Notification / Structure-Function Claims (DSHEA)',
    systemDesc: 'FDA GRAS(Generally Recognized as Safe) 통지 절차를 통해 안전성이 인정된 원료. Dietary Supplement Health and Education Act(DSHEA) 하에 구조·기능 표시 가능.',
    rows: [
      { name: 'Omega-3 Fatty Acids (EPA/DHA)', nameLocal: 'Omega-3 Fatty Acids', function: '혈중 중성지방 감소 지원, 심혈관 건강 유지에 도움', functionLocal: 'Qualified health claim: May reduce the risk of coronary heart disease (21 CFR 101.83)', limit: '≤3 g/day (EPA+DHA combined)', lawRef: '21 CFR 101.83 / FDA GRAS GRN 000041', lawUrl: 'https://www.fda.gov/food/dietary-supplements/dietary-supplement-ingredient-directory' },
      { name: 'Plant Sterols / Stanols', nameLocal: 'Plant Sterols / Stanols', function: '혈중 LDL 콜레스테롤 저하에 도움', functionLocal: 'Authorized health claim: Reduces the risk of coronary heart disease (21 CFR 101.83)', limit: '≥0.8 g/serving (sterols); ≥1.7 g/serving (stanols)', lawRef: '21 CFR 101.83 — Authorized Health Claim', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.83' },
      { name: 'Calcium + Vitamin D', nameLocal: 'Calcium + Vitamin D', function: '골다공증 위험 감소 지원', functionLocal: 'Authorized health claim: May reduce the risk of osteoporosis (21 CFR 101.72)', limit: 'Ca: 1,000–1,200 mg/day; Vit D: 600–800 IU/day', lawRef: '21 CFR 101.72 — Authorized Health Claim', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.72' },
      { name: 'Soluble Dietary Fiber (Psyllium/Oat)', nameLocal: 'Soluble Fiber', function: '혈중 콜레스테롤 감소 지원, 심장 질환 위험 감소', functionLocal: 'Authorized health claim: Diets low in saturated fat and cholesterol that include soluble fiber may reduce the risk of heart disease', limit: '≥0.75 g psyllium/serving; ≥0.75 g oat β-glucan/serving', lawRef: '21 CFR 101.77 / 101.81 — Authorized Health Claim', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.81' },
      { name: 'Folic Acid (Folate)', nameLocal: 'Folic Acid / Folate', function: '임신 중 신경관 결손 위험 감소 지원', functionLocal: "Authorized health claim: Adequate folate in healthful diets may reduce a woman's risk of having a child with a brain or spinal cord defect", limit: '≥0.4 mg/day; ≤1 mg/day supplemental', lawRef: '21 CFR 101.79 — Authorized Health Claim', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.79' },
      { name: 'Probiotics (Lactobacillus / Bifidobacterium)', nameLocal: 'Probiotics', function: '소화 건강, 장내 균형 유지 지원 (구조·기능 표시)', functionLocal: 'Structure/function claim under DSHEA (21 USC 343(r)(6)): "Helps maintain digestive health"', limit: '균주별·제품별 상이 (통상 1억~100억 CFU)', lawRef: 'DSHEA (21 USC 321(ff)) / 21 CFR Part 101.93', lawUrl: 'https://www.fda.gov/food/dietary-supplements/dietary-supplement-labeling-guide' },
      { name: 'Lutein / Zeaxanthin', nameLocal: 'Lutein / Zeaxanthin', function: '눈 건강(황반 색소 밀도 유지) 지원 (구조·기능 표시)', functionLocal: 'Structure/function claim: "Supports eye health and macular pigment density"', limit: 'Lutein 10–20 mg/day; Zeaxanthin 2 mg/day', lawRef: 'FDA GRAS Notice GRN 000140 / DSHEA', lawUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras' },
      { name: 'Glucosamine Sulfate', nameLocal: 'Glucosamine', function: '관절 연골 건강 지원 (구조·기능 표시)', functionLocal: 'Structure/function claim: "Helps maintain healthy joint cartilage"', limit: '1,500 mg/day', lawRef: 'DSHEA (21 USC 321(ff)) — Structure/Function', lawUrl: 'https://www.fda.gov/food/dietary-supplements/dietary-supplement-labeling-guide' },
    ],
  },
  {
    code: 'EU', flag: '🇪🇺', label: 'EU (EFSA / EC)',
    systemName: 'Authorized Health Claims (Reg (EC) No 1924/2006 — Article 13 & 14)',
    systemDesc: 'EFSA가 과학적 근거를 검토하여 EC가 허가한 건강 강조 표시 원료 목록. 허가된 문구 외 표시 불가. Annex에 등재된 경우에만 사용 가능.',
    rows: [
      { name: 'Calcium', nameLocal: 'Calcium (Ca)', function: '칼슘은 정상적인 근육 기능 및 뼈 유지에 기여 (Art. 13 목록)', functionLocal: 'Calcium contributes to normal muscle function and maintenance of normal bones', limit: '120 mg/일 (최소 의미 있는 양)', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Vitamin D', nameLocal: 'Vitamin D (Cholecalciferol)', function: '비타민 D는 정상적인 면역 기능 유지 및 골 건강에 기여', functionLocal: 'Vitamin D contributes to normal immune system function and maintenance of normal bones', limit: '5 μg/일 (15% NRV 이상)', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Plant Sterols / Stanols', nameLocal: 'Plant Sterols / Plant Stanols', function: '식물성 스테롤은 혈중 LDL 콜레스테롤 농도를 정상으로 유지하는 데 도움', functionLocal: 'Plant sterols contribute to the maintenance of normal blood cholesterol levels (Art. 14 — Disease Risk Reduction)', limit: '0.8 g/일 이상 섭취 시 효과 발현', lawRef: 'EU Reg 432/2012 Art. 14 — Disease Risk Reduction Claim', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Docosahexaenoic Acid (DHA)', nameLocal: 'DHA (오메가-3)', function: 'DHA는 정상적인 뇌 기능 및 시력 유지에 기여', functionLocal: 'DHA contributes to maintenance of normal brain function and normal vision', limit: '250 mg/일', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Folic Acid (Folate / Vitamin B9)', nameLocal: 'Folic Acid', function: '엽산은 임신 중 태아 신경관 발달에 기여 (Art. 14 질환 위험 감소 표시)', functionLocal: 'Folate contributes to maternal tissue growth during pregnancy (Art. 14 — Disease Risk Reduction Claim)', limit: '400 μg/일 (15% NRV 이상)', lawRef: 'EU Reg 432/2012 Art. 14 — Disease Risk Reduction Claim', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Iron', nameLocal: 'Iron (Fe)', function: '철분은 정상적인 에너지 대사 및 산소 운반에 기여', functionLocal: 'Iron contributes to normal energy-yielding metabolism and normal transport of oxygen in the body', limit: '2.1 mg/일 (15% NRV 이상)', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Beta-glucan (Oat / Barley)', nameLocal: 'Beta-glucan', function: '귀리·보리 베타글루칸은 식사 후 혈당 상승 억제 및 혈중 콜레스테롤 유지에 기여', functionLocal: 'Oat/barley beta-glucan contributes to the maintenance of normal blood cholesterol levels and reduces post-prandial glycaemic response', limit: '3 g/일 (콜레스테롤); 4 g/1 끼니 분량 (혈당)', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
      { name: 'Zinc', nameLocal: 'Zinc (Zn)', function: '아연은 정상적인 DNA 합성 및 면역 기능 유지에 기여', functionLocal: 'Zinc contributes to normal DNA synthesis and normal function of the immune system', limit: '1.5 mg/일 (15% NRV 이상)', lawRef: 'EU Reg 432/2012 — Authorized Health Claims List', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432' },
    ],
  },
  {
    code: 'JP', flag: '🇯🇵', label: 'Japan (CAA)',
    systemName: '機能性表示食品 届出制度 (Functional Claims Food — Notification System)',
    systemDesc: '소비자청(CAA)에 届出(통지)한 후 일정 기간 내 이의 없으면 표시 가능. 사전 허가 불필요. 과학적 근거 필요(SR 또는 RCT). 특보식품(FOSHU)과 구별됨.',
    rows: [
      { name: 'EPA / DHA (Fish Oil)', nameLocal: 'EPA・DHA（魚油）', function: '혈중 중성지방을 낮추는 데 도움; 혈압 조절 지원', functionLocal: '血中の中性脂肪を低下させる。血圧が高めの方の血圧を下げる。', limit: 'EPA+DHA 합계 1.6~3 g/일 (届出 기준)', lawRef: '機能性表示食品届出 (CAA) — 食品表示法 第4条', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Lutein', nameLocal: 'ルテイン', function: '눈 황반 색소 밀도 유지, 눈 피로 완화에 도움', functionLocal: '目の黄斑色素密度を維持する。目のピント調節機能を助ける。', limit: '6~20 mg/일', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'GABA (γ-Aminobutyric Acid)', nameLocal: 'GABA（γ-アミノ酪酸）', function: '혈압이 높은 분의 혈압을 낮추는 데 도움', functionLocal: '血圧が高めの方の血圧を下げる。', limit: '10~100 mg/일', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Soy Isoflavones', nameLocal: '大豆イソフラボン', function: '여성 골 건강 및 폐경 이후 뼈 밀도 유지 지원', functionLocal: '骨の健康を維持する（閉経後女性向け）。更年期症状を和らげる。', limit: '이소플라본 아글리콘으로 25~30 mg/일', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Inulin / Fructo-oligosaccharide', nameLocal: 'イヌリン / フラクトオリゴ糖', function: '장내 비피더스균 증식, 배변 활동 촉진에 도움', functionLocal: '腸内のビフィズス菌を増やし、腸内環境を改善する。おなかの調子を整える。', limit: '3~5 g/일 (FOS 기준)', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Glucosamine', nameLocal: 'グルコサミン', function: '무릎 관절의 불편함(뻣뻣함·통증) 완화에 도움', functionLocal: '膝関節の不快感（曲げ伸ばし時の違和感）を和らげる。', limit: '1,500 mg/일', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Lactoferrin', nameLocal: 'ラクトフェリン', function: '내장 지방 감소, 장내 환경 개선에 도움', functionLocal: '内臓脂肪を減少させる。腸内のビフィズス菌などの善玉菌を増やす。', limit: '100~600 mg/일 (락토페린 기준)', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
      { name: 'Quercetin', nameLocal: 'ケルセチン', function: '혈관 건강(혈압 조절) 지원, 항산화 활성', functionLocal: '血圧が高めの方の血圧を下げる。抗酸化作用により体の酸化ストレスを軽減する。', limit: '50~100 mg/일 (배당체 기준)', lawRef: '機能性表示食品届出 (CAA)', lawUrl: 'https://www.caa.go.kr/policies/policy/food_labeling/foods_with_function_claims/' },
    ],
  },
  {
    code: 'TW', flag: '🇹🇼', label: 'Taiwan (TFDA)',
    systemName: '健康食品許可 (Health Food Authorization — TFDA)',
    systemDesc: 'TFDA가 심사·허가한 기능성 식품(健康食品) 원료 목록. 허가된 건강 강조 표시만 사용 가능. 등록번호 취득 필수.',
    rows: [
      { name: 'Calcium + Vitamin D', nameLocal: '鈣 + 維生素D', function: '골다공증 위험 감소, 뼈 건강 유지에 도움', functionLocal: '有助於降低骨質疏鬆症發生的風險（需特定條件）。有助於維持骨骼及牙齒的健康。', limit: 'Ca 250~600 mg + Vit D 5~10 μg/일 (1회 섭취 기준)', lawRef: 'TFDA 健康食品許可 — 骨質保健 功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Plant Sterols / Stanols', nameLocal: '植物固醇 / 植物硬脂醇', function: '혈중 콜레스테롤 조절에 도움', functionLocal: '有助於維持血中正常膽固醇濃度。', limit: '0.8~3 g/일', lawRef: 'TFDA 健康食品許可 — 調節血脂功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Probiotics (Lactobacillus spp.)', nameLocal: '乳酸菌（益生菌）', function: '위장 건강 유지, 장내 유익균 증식에 도움', functionLocal: '有助於維持腸道健康。有助於增加腸道有益菌、降低不利菌群。', limit: '1억~100억 CFU/일 이상 (균주별 상이)', lawRef: 'TFDA 健康食品許可 — 胃腸道功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Soy Isoflavones', nameLocal: '大豆異黃酮', function: '여성 골 건강, 폐경 증상 완화 지원', functionLocal: '有助於維持更年期婦女骨骼健康。有助於減緩更年期不適。', limit: '40~80 mg/일 (이소플라본 기준)', lawRef: 'TFDA 健康食品許可 — 骨質保健 功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Omega-3 (EPA+DHA)', nameLocal: '魚油（EPA+DHA）', function: '혈중 중성지방 조절에 도움', functionLocal: '有助於維持血中正常三酸甘油酯濃度。', limit: 'EPA+DHA 0.6~2 g/일', lawRef: 'TFDA 健康食品許可 — 調節血脂功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Fructo-oligosaccharide (FOS)', nameLocal: '果寡糖 (FOS)', function: '장내 비피더스균 증식, 장 건강 유지에 도움', functionLocal: '有助於增加腸內雙歧桿菌（比菲德氏菌），改善腸道環境。', limit: '3~8 g/일', lawRef: 'TFDA 健康食品許可 — 胃腸道功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Glucosamine', nameLocal: '葡萄糖胺', function: '관절 건강 유지에 도움 (허가 심사 기준 충족 필요)', functionLocal: '有助於維持關節健康。', limit: '1,500 mg/일', lawRef: 'TFDA 健康食品許可 — 骨關節保健 功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
      { name: 'Red Yeast Rice (Monacolin K)', nameLocal: '紅麴（Monacolin K）', function: '혈중 콜레스테롤 조절에 도움 (Monacolin K 함량 기준 충족 시)', functionLocal: '有助於維持血中正常膽固醇濃度（以特定紅麴原料申請）。', limit: '모나콜린K 2.5~10 mg/일 (제품·허가 유형별 상이)', lawRef: 'TFDA 健康食品許可 — 調節血脂功效', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16' },
    ],
  },
  {
    code: 'CN', flag: '🇨🇳', label: 'China (SAMR/CFSA)',
    systemName: '保健食品 注册与备案制度 (Health Food Registration & Filing — SAMR)',
    systemDesc: 'SAMR(국가시장감독관리총국)이 심사·등록한 보건식품(保健食品) 원료만 기능성 표시 가능. 등록번호(国食健字G / 国食健字Z) 취득 필수. CFSA(식품안전리스크평가센터)가 안전성 평가 담당.',
    rows: [
      { name: 'Omega-3 Fatty Acids (Fish Oil)', nameLocal: '鱼油（EPA+DHA）', function: '혈중 중성지방 조절, 심혈관 건강 유지에 도움', functionLocal: '有助于降低血液中甘油三酯水平，维护心血管健康。', limit: 'EPA+DHA 0.6~2 g/일 (보건식품 기준)', lawRef: 'GB 16740 保健食品通则 / SAMR 등록 원료 목록', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Probiotics (Lactobacillus / Bifidobacterium)', nameLocal: '益生菌（乳酸菌 / 双歧杆菌）', function: '장내 유익균 증식, 소화 및 면역 건강 유지에 도움', functionLocal: '有助于促进肠道有益菌增殖，改善肠道微生物平衡，维护消化道健康。', limit: '균주·제품별 상이 (통상 10억~100억 CFU/일)', lawRef: 'CFSA 益生菌许可菌株名单 / 保健食品备案 원료', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Glucosamine Sulfate', nameLocal: '硫酸氨基葡萄糖', function: '관절 건강 유지, 연골 보호에 도움', functionLocal: '有助于维持关节软骨健康，缓解关节不适感。', limit: '1,500 mg/일', lawRef: 'SAMR 保健食品原料目录 / GB 16740', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Coenzyme Q10', nameLocal: '辅酶Q10', function: '항산화 효과, 세포 에너지 대사 지원에 도움', functionLocal: '具有抗氧化功能，有助于维持细胞能量代谢，保护细胞免受氧化损伤。', limit: '30~60 mg/일 (보건식품 신고 기준)', lawRef: 'SAMR 保健食品原料目录 — 辅酶Q10', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Lutein', nameLocal: '叶黄素', function: '눈 황반색소 밀도 유지, 시력 건강 보호에 도움', functionLocal: '有助于维持视网膜黄斑区色素密度，保护眼部健康。', limit: '최대 20 mg/일 (보건식품 기준)', lawRef: 'SAMR 保健食品原料目录 — 叶黄素', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Soy Isoflavones', nameLocal: '大豆异黄酮', function: '여성 골 건강, 에스트로겐 유사 효과로 폐경 증상 완화 지원', functionLocal: '有助于补充植物性雌激素，改善围绝经期妇女的骨骼健康及更年期不适症状。', limit: '30~60 mg/일 (이소플라본 기준)', lawRef: 'SAMR 保健食品原料目录 — 大豆异黄酮', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: '维生素C', function: '항산화, 면역력 유지, 콜라겐 합성 지원에 도움', functionLocal: '具有抗氧化功能，有助于维持免疫力，促进胶原蛋白合成，保护细胞免受氧化应激。', limit: '60~1,000 mg/일 (GB 14880 영양강화제 기준)', lawRef: 'GB 14880 食品营养强化剂使用标准 / SAMR', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
      { name: 'Red Yeast Rice (Monacolin K)', nameLocal: '红曲（Monacolin K）', function: '혈중 콜레스테롤 조절에 도움 (Monacolin K 기준 충족 시)', functionLocal: '有助于调节血液中的胆固醇水平（需符合Monacolin K含量标准）。', limit: 'Monacolin K 4~10 mg/일', lawRef: 'SAMR 保健食品原料目录 — 红曲', lawUrl: 'https://www.samr.gov.cn/spyj/tzgg/' },
    ],
  },
  {
    code: 'VN', flag: '🇻🇳', label: 'Vietnam (VFA)',
    systemName: 'Thực phẩm bảo vệ sức khỏe — 자기신고(Tự công bố) 제도',
    systemDesc: '베트남 기능성 식품(Thực phẩm bảo vệ sức khỏe)은 Nghị định 15/2018에 따라 사업자 자기신고(Tự công bố) 방식으로 운영. 고위험 제품·신규 원료는 VFA 사전 등록 필요. 허용 첨가물 및 기능 표시는 Circular 43/2014 기준 적용.',
    rows: [
      { name: 'Omega-3 Fatty Acids (Fish Oil)', nameLocal: 'Omega-3 (EPA+DHA)', function: '심혈관 건강 유지, 혈중 중성지방 조절에 도움', functionLocal: 'Hỗ trợ sức khỏe tim mạch, giúp duy trì mức triglyceride trong máu ở ngưỡng bình thường.', limit: 'EPA+DHA 0.5~2 g/일', lawRef: 'Thông tư 43/2014/TT-BYT — Thực phẩm bổ sung', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Probiotics (Lactobacillus spp.)', nameLocal: 'Probiotic (Vi khuẩn có lợi)', function: '장내 유익균 증식, 소화 건강 유지에 도움', functionLocal: 'Hỗ trợ tăng cường vi khuẩn có lợi trong đường ruột, cải thiện hệ tiêu hóa.', limit: '균주별 상이 (통상 1억~100억 CFU/일)', lawRef: 'Thông tư 43/2014 / Nghị định 15/2018 — Tự công bố', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: 'Vitamin C', function: '항산화, 면역력 강화, 피부 건강 유지에 도움', functionLocal: 'Hỗ trợ tăng cường miễn dịch, chống oxy hóa, duy trì sức khỏe da.', limit: '60~1,000 mg/일', lawRef: 'Thông tư 43/2014 — Thực phẩm bổ sung vitamin', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Calcium + Vitamin D', nameLocal: 'Canxi + Vitamin D3', function: '뼈·치아 건강 유지, 골다공증 예방 지원', functionLocal: 'Hỗ trợ duy trì sức khỏe xương và răng, giảm nguy cơ loãng xương.', limit: 'Ca 500~1,200 mg + Vit D 5~10 μg/일', lawRef: 'Thông tư 43/2014 / QĐ 46/2007 — Nhu cầu dinh dưỡng', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Collagen (Hydrolyzed)', nameLocal: 'Collagen thủy phân', function: '피부 탄력 유지, 관절·연골 건강 지원에 도움', functionLocal: 'Hỗ trợ duy trì độ đàn hồi của da, bảo vệ sức khỏe khớp và sụn.', limit: '1,000~5,000 mg/일 (제품별 상이)', lawRef: 'Thông tư 43/2014 — Thực phẩm bảo vệ sức khỏe', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Curcumin (Turmeric Extract)', nameLocal: 'Curcumin (Nghệ vàng)', function: '항산화, 소화 건강 지원, 항염 효과에 도움', functionLocal: 'Hỗ trợ chống oxy hóa, cải thiện tiêu hóa và có tác dụng kháng viêm tự nhiên.', limit: '200~500 mg/일 (curcumin 기준)', lawRef: 'Thông tư 43/2014 — Thực phẩm bảo vệ sức khỏe', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Glucosamine', nameLocal: 'Glucosamine sulfate', function: '관절 연골 건강 유지, 관절 불편감 완화 지원', functionLocal: 'Hỗ trợ duy trì sức khỏe sụn khớp, giảm cảm giác khó chịu ở khớp.', limit: '1,500 mg/일', lawRef: 'Thông tư 43/2014 / Nghị định 15/2018 — Tự công bố', lawUrl: 'https://vfa.gov.vn/en/news.html' },
      { name: 'Zinc (Zinc Gluconate)', nameLocal: 'Kẽm (Kẽm gluconate)', function: '면역 기능 유지, 성장 발달 지원, 항산화에 도움', functionLocal: 'Hỗ trợ tăng cường hệ miễn dịch, hỗ trợ tăng trưởng và phát triển, chống oxy hóa.', limit: '8~15 mg/일', lawRef: 'Thông tư 43/2014 — Thực phẩm bổ sung khoáng chất', lawUrl: 'https://vfa.gov.vn/en/news.html' },
    ],
  },
  {
    code: 'TH', flag: '🇹🇭', label: 'Thailand (Thai FDA)',
    systemName: 'ผลิตภัณฑ์เสริมอาหาร — 식이보충제 등록 제도 (Thai FDA Notification 293)',
    systemDesc: '태국 FDA(อย.) 등록·허가된 식이보충제(ผลิตภัณฑ์เสริมอาหาร). Notification No. 293 허용 원료 목록 내 성분만 사용·표시 가능. 등록번호(อย.) 취득 필수. Cyclamate 전면 금지, Tartrazine 50mg/kg 한도(2025.07) 적용.',
    rows: [
      { name: 'Omega-3 Fatty Acids (Fish Oil)', nameLocal: 'โอเมก้า-3 (EPA+DHA)', function: '심혈관 건강 유지, 혈중 중성지방 조절에 도움', functionLocal: 'ช่วยรักษาสุขภาพหัวใจและหลอดเลือด รักษาระดับไตรกลีเซอไรด์ในเลือดให้อยู่ในระดับปกติ', limit: 'EPA+DHA 0.5~2 g/일', lawRef: 'Notification of MoPH No. 293 — Dietary Supplement (Thai FDA)', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Probiotics (Lactobacillus spp.)', nameLocal: 'โพรไบโอติก (แลคโตบาซิลลัส)', function: '장내 유익균 증식, 소화 건강 유지에 도움', functionLocal: 'ช่วยเพิ่มจำนวนแบคทีเรียที่เป็นประโยชน์ในลำไส้ ปรับสมดุลระบบทางเดินอาหาร', limit: '균주별 상이 (통상 1억~100억 CFU/일)', lawRef: 'Notification No. 293 / MoPH Food Act B.E. 2522', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Glucosamine Sulfate', nameLocal: 'กลูโคซามีนซัลเฟต', function: '관절 연골 건강 유지, 관절 불편감 완화 지원', functionLocal: 'ช่วยบำรุงกระดูกอ่อนในข้อต่อ ลดความรู้สึกไม่สบายในข้อต่อ', limit: '1,500 mg/일', lawRef: 'Notification No. 293 — Dietary Supplement Permitted Ingredients', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: 'วิตามินซี (กรดแอสคอร์บิก)', function: '항산화, 면역력 강화, 피부 건강 유지에 도움', functionLocal: 'ช่วยต้านอนุมูลอิสระ เสริมสร้างภูมิคุ้มกัน และบำรุงผิวพรรณ', limit: '60~1,000 mg/일', lawRef: 'Notification No. 293 — Vitamins & Minerals', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Collagen (Hydrolyzed)', nameLocal: 'คอลลาเจนไฮโดรไลเซท', function: '피부 탄력 유지, 관절·연골 건강 지원에 도움', functionLocal: 'ช่วยรักษาความยืดหยุ่นของผิวหนัง บำรุงกระดูกอ่อน และข้อต่อ', limit: '1,000~5,000 mg/일', lawRef: 'Notification No. 293 — Dietary Supplement Permitted Ingredients', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Coenzyme Q10', nameLocal: 'โคเอนไซม์ Q10', function: '항산화, 세포 에너지 대사 지원에 도움', functionLocal: 'มีคุณสมบัติต้านอนุมูลอิสระ ช่วยสนับสนุนการเผาผลาญพลังงานในระดับเซลล์', limit: '30~100 mg/일', lawRef: 'Notification No. 293 — Dietary Supplement Permitted Ingredients', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Lutein', nameLocal: 'ลูทีน', function: '눈 황반색소 밀도 유지, 시력 건강 보호에 도움', functionLocal: 'ช่วยรักษาความหนาแน่นของเม็ดสีที่จอตา บำรุงสุขภาพดวงตา', limit: '6~20 mg/일', lawRef: 'Notification No. 293 — Dietary Supplement Permitted Ingredients', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
      { name: 'Curcumin (Turmeric Extract)', nameLocal: 'เคอร์คูมิน (ขมิ้นชัน)', function: '항산화, 소화 건강 지원, 항염 효과에 도움', functionLocal: 'มีฤทธิ์ต้านอนุมูลอิสระ ช่วยบำรุงระบบย่อยอาหาร และมีสมบัติต้านการอักเสบ', limit: '200~500 mg/일 (curcumin 기준)', lawRef: 'Notification No. 293 — Dietary Supplement Permitted Ingredients', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx' },
    ],
  },
  {
    code: 'ID',
    flag: '🇮🇩',
    label: 'Indonesia (BPOM)',
    systemName: 'Pangan Fungsional — BPOM 기능성 식품 등록 제도 (BPOM Reg. No. 1 Tahun 2018)',
    systemDesc: 'BPOM(Badan Pengawas Obat dan Makanan, 의약식품감독청)이 허가한 기능성 식품(Pangan Fungsional) 원료만 건강 기능 표시 가능. 모든 원료는 ML 등록 시 성분 명세 포함 필요.',
    rows: [
      { name: 'Omega-3 (DHA/EPA)', nameLocal: 'Omega-3 (DHA/EPA)', function: '심혈관 건강 유지 · 혈중 중성지방 감소 · 뇌 기능 및 시력 지원 (DHA)', functionLocal: 'Membantu menjaga kesehatan kardiovaskular; membantu menurunkan kadar trigliserida darah; mendukung fungsi otak dan penglihatan (DHA)', limit: 'DHA 200mg/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Probiotics (Lactobacillus / Bifidobacterium)', nameLocal: 'Probiotics', function: '장내 유익균 균형 유지 · 소화기 건강 증진 · 면역 기능 지원 (BPOM 승인 균주 한정)', functionLocal: 'Membantu menjaga keseimbangan mikrobiota usus; meningkatkan kesehatan pencernaan; mendukung fungsi imun (strain yang disetujui BPOM)', limit: '10⁸ CFU/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Glucosamine', nameLocal: 'Glucosamine', function: '관절 연골 건강 유지 · 관절 기동성 지원 · 관절 불편감 완화', functionLocal: 'Membantu menjaga kesehatan tulang rawan sendi; mendukung mobilitas sendi; meringankan ketidaknyamanan pada sendi', limit: '1,500mg/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Coenzyme Q10', nameLocal: 'CoQ10', function: '세포 에너지 생성 보조 (미토콘드리아 ATP 합성) · 항산화 작용 · 심혈관 기능 지원', functionLocal: 'Mendukung produksi energi seluler (sintesis ATP mitokondria); memberikan perlindungan antioksidan; mendukung fungsi kardiovaskular', limit: '100~300mg/일', lawRef: 'BPOM ML 등록 기준', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Lutein', nameLocal: 'Lutein', function: '황반 색소 밀도 유지 · 블루라이트·자외선으로부터 망막 보호 · 시력 건강 지원', functionLocal: 'Membantu menjaga kepadatan pigmen makula; melindungi retina dari sinar biru dan UV; mendukung kesehatan penglihatan', limit: '6~20mg/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Soy Isoflavones', nameLocal: 'Soy Isoflavones', regulated: true, function: '폐경기 안면홍조·발한 등 갱년기 증상 완화 · 골밀도 유지 지원 (피토에스트로겐 기전)', functionLocal: 'Membantu meringankan gejala menopause (hot flash, keringat malam); mendukung kepadatan tulang melalui mekanisme fitoestrogen', limit: '40~80mg/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: 'Vitamin C', function: '항산화 작용 · 콜라겐 합성 보조 · 면역 기능 강화 · 철 흡수 촉진', functionLocal: 'Antioksidan; membantu sintesis kolagen untuk kulit, tulang rawan dan tulang; memperkuat sistem imun; meningkatkan penyerapan zat besi non-heme', limit: '1,000mg/일', lawRef: 'BPOM 식품 강화 기준', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Red Yeast Rice (Monacolin K)', nameLocal: 'Red Yeast Rice', regulated: true, function: 'LDL 콜레스테롤 감소 지원 · 심혈관 건강 지원 (Monacolin K — HMG-CoA 환원효소 억제 기전)', functionLocal: 'Membantu menurunkan kadar kolesterol LDL; mendukung kesehatan kardiovaskular (Monacolin K — mekanisme inhibisi HMG-CoA reduktase)', limit: '미정', lawRef: 'BPOM 검토 중', lawUrl: 'https://www.pom.go.id/' },
      { name: 'Red Yeast Rice — BPOM 규제 현황', nameLocal: 'Red Yeast Rice (Monacolin K) — Regulatory Status', function: '⚠️ BPOM 검토 중 — Monacolin K 제한 (의약품 성분 Lovastatin 유사)', functionLocal: '⚠️ Under BPOM review — Monacolin K content subject to restriction due to similarity with pharmaceutical ingredient Lovastatin; regulatory tightening anticipated', category: 'regulatory', limit: '미정', lawRef: 'BPOM 검토 중', lawUrl: 'https://www.pom.go.id/', notes: '인도네시아 BPOM은 Monacolin K를 Lovastatin(처방약)과 동일 성분으로 간주하여 규제 강화 검토 중. 제품 출시 전 BPOM 최신 허가 현황 반드시 확인.' } as any,
      { name: 'Soy Isoflavones — 경고 표시 의무', nameLocal: 'Soy Isoflavones — Warning Label', function: '⚠️ Estrogen 유사 효과 — 경고 문구 표시 권장 (BPOM 가이드라인)', functionLocal: '⚠️ Oestrogen-like effect — warning statement strongly recommended per BPOM guidelines; consult physician if pregnant, breastfeeding or with hormone-sensitive conditions', category: 'regulatory', limit: '40~80mg/일', lawRef: 'BPOM Pangan Fungsional Reg. No. 1/2018', lawUrl: 'https://www.pom.go.id/', notes: '대두 이소플라본의 피토에스트로겐 작용으로 호르몬 민감 질환(유방암, 자궁내막증 등) 보유자 복용 주의. BPOM 고시에 따른 경고 문구 라벨 기재 필요.' } as any,
    ],
  },
  {
    code: 'CA',
    flag: '🇨🇦',
    label: 'Canada (CFIA / Health Canada)',
    systemName: 'Natural Health Products (NHP) — NPN 번호 제도 (Natural Health Products Regulations 2004)',
    systemDesc: 'Health Canada가 발급하는 NPN(Natural Product Number) 번호 없이는 기능성·건강 강조 표시 불가. NHP 허가는 180일~2년 소요. 기능성 성분은 Health Canada Monograph 또는 사전 검토 필요.',
    rows: [
      { name: 'Omega-3 (DHA/EPA)', nameLocal: 'Omega-3 (DHA/EPA)', function: '심혈관 건강 유지 · 뇌 기능 및 인지력 지원 (DHA·EPA)', functionLocal: 'Helps maintain cardiovascular health; supports brain function and cognitive performance (DHA & EPA) — HC Monograph M131', limit: 'DHA 250mg/일, EPA 250mg/일', lawRef: 'Health Canada NHP Monograph M131', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Probiotics (Lactobacillus / Bifidobacterium)', nameLocal: 'Probiotics', function: '장내 유익균 증식 · 소화기 건강 유지 및 장 균형 개선', functionLocal: 'Promotes growth of beneficial gut bacteria; maintains healthy intestinal flora and digestive balance — HC 2018 Probiotic Guidance', limit: '10⁹ CFU/일', lawRef: 'Health Canada NHP Regulations 2004', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Glucosamine', nameLocal: 'Glucosamine', function: '관절 연골 건강 유지 · 관절 기동성 및 기능 지원', functionLocal: 'Helps maintain joint cartilage health; supports joint mobility and function — HC Monograph M149', limit: '1,500mg/일', lawRef: 'Health Canada NHP Monograph M149', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Coenzyme Q10', nameLocal: 'CoQ10', function: '세포 에너지 생성 보조 (미토콘드리아 ATP 합성) · 항산화 작용', functionLocal: 'Supports cellular energy production (mitochondrial ATP synthesis); antioxidant protection — HC Monograph M16', limit: '100~300mg/일', lawRef: 'Health Canada NHP Monograph M16', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Lutein', nameLocal: 'Lutein', function: '황반 색소 밀도 유지 · 블루라이트·자외선으로부터 망막 보호', functionLocal: 'Helps maintain macular pigment density; protects retinal cells from blue light and UV radiation — HC NHP Regulations', limit: '6~20mg/일', lawRef: 'Health Canada NHP Regulations 2004', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Soy Isoflavones', nameLocal: 'Soy Isoflavones', function: '폐경기 안면홍조·발한 등 갱년기 증상 빈도 및 중증도 감소', functionLocal: 'Helps reduce frequency and severity of menopausal vasomotor symptoms (hot flashes, night sweats) — HC Monograph M42', limit: '40~80mg/일', lawRef: 'Health Canada NHP Monograph M42', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: 'Vitamin C', function: '항산화 작용 · 콜라겐 합성 보조 · 면역 기능 강화 · 철 흡수 촉진', functionLocal: 'Antioxidant; helps in collagen formation for skin, cartilage and bones; supports immune function; enhances non-heme iron absorption', limit: '1,000mg/일', lawRef: 'FDR Division 14 / Health Canada NHP', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
      { name: 'Melatonin', nameLocal: 'Melatonin', function: '수면 유도 · 일주기 리듬 조절 · 시차 증후군(Jet Lag) 완화 — 한국 미허용 대비 주요 차이', functionLocal: 'Helps to fall asleep faster; resets the body\'s sleep-wake cycle; prevents and reduces effects of jet lag — HC Monograph M170', limit: '0.5~5mg/일', lawRef: 'Health Canada NHP Monograph M170', lawUrl: 'https://www.canada.ca/en/health-canada.html' },
    ],
  },
  { code: 'MY', flag: '🇲🇾', label: 'Malaysia (MOH/JAKIM)', systemName: 'JAKIM 할랄 인증 원료 등록 제도 (Halal Certification — MS1500:2019)', systemDesc: 'JAKIM(말레이시아 이슬람 개발부)이 인증한 원료·공정만 할랄 표시 가능. ✅ MRA 상호인정 협정국(2026 최신): 인도네시아(BPJPH), 브루나이(MUIB), 싱가포르(MUIS), UAE·사우디·쿠웨이트·바레인·오만·카타르(GCC 전체). JAKIM 인증 1회 취득으로 MRA 협정국 시장 동시 진출 전략 가능. 동물성·알코올 유래 성분 전면 불허.', rows: [
    { name: 'JAKIM MRA 상호인정 현황', nameLocal: 'JAKIM Halal MRA Status (2026)', function: 'MRA 체결국: 인도네시아(BPJPH), 브루나이(MUIB), 싱가포르(MUIS), GCC 6개국(UAE·사우디·쿠웨이트·바레인·오만·카타르)', functionLocal: 'JAKIM Halal Mutual Recognition Agreements (MRA) as of 2026: Indonesia (BPJPH), Brunei (MUIB), Singapore (MUIS), and GCC 6 countries (UAE, Saudi Arabia, Kuwait, Bahrain, Oman, Qatar). A single JAKIM certification enables simultaneous market access across 8 MRA partner countries; Indonesia BPJPH mutual recognition exempts the need for separate local certification.', category: 'regulatory', limit: '2026 최신 협정 기준', lawRef: 'JAKIM Halal Standard MS1500:2019 / MRA Agreements', lawUrl: 'https://www.jakim.gov.my/', notes: 'JAKIM 인증 1회로 MRA 협정 8개국 시장 진출 가능. 인도네시아 BPJPH 상호인정으로 현지 인증 별도 취득 면제.' } as any,
    { name: 'Allulose', nameLocal: 'Allulose', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: 'Food Regulations 1985 감미료 목록 확인 후 사용', lawRef: 'Food Regulations 1985 / JAKIM MS1500', lawUrl: 'https://www.moh.gov.my/', notes: 'Food Regulations 1985 허용 감미료 목록 내 등재 여부 사전 확인 필수. 알룰로스 원료 생산 공정 할랄 인증서(CoA + JAKIM) 동시 제출 권장. 알코올 발효 공정 사용 시 JAKIM 인증 취득 불가.' } as any,
    { name: 'Allulose — 말레이시아 허가 현황', nameLocal: 'Allulose — Malaysia Regulatory Status', function: '⚠️ 조건부 허용 — 할랄 공정 증명 필요 (Food Regulations 1985 감미료 목록 사전 확인 필수)', functionLocal: '⚠️ Conditionally permitted — Halal process certification (CoA + JAKIM) required; confirm listing on Food Regulations 1985 permitted sweetener schedule before use; prohibited if alcohol fermentation process is used', category: 'regulatory', limit: 'Food Regulations 1985 기준', lawRef: 'Food Regulations 1985 / JAKIM MS1500', lawUrl: 'https://www.moh.gov.my/', notes: '할랄 감미료 목록 미등재 시 사용 불가. JAKIM 인증 공정 사용 원료만 허용.' } as any,
    { name: 'Halal-certified Gelatin', nameLocal: 'Halal-certified Gelatin', function: '식품 겔화·안정화·유화 기능 · 식감 개선 (식물성·어류 유래 할랄 인증 원료 한정)', functionLocal: 'Gelling, stabilizing and emulsifying agent; texture improvement (plant or fish-derived halal-certified only; pork-derived gelatin prohibited)', limit: '기준 없음 (할랄 인증된 원료만)', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: 'Pork-derived 젤라틴 전면 금지. Fish/Bovine(할랄 도축) 대체 사용.' } as any,
    { name: 'Omega-3 (Fish Oil)', nameLocal: 'Omega-3 (Fish Oil)', function: '심혈관 건강 유지 · 혈중 중성지방 감소 지원 (JAKIM 인증 어류 유래 한정)', functionLocal: 'Supports cardiovascular health; helps reduce blood triglycerides (JAKIM-certified marine source only; halal processing verification required)', limit: '기준 없음', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: '할랄 인증 어류 가공 공정 확인 필요.' } as any,
    { name: 'Probiotics', nameLocal: 'Probiotics', function: '장내 유익균 균형 유지 · 소화기 건강 증진 (할랄 배양 배지 사용 균주 한정)', functionLocal: 'Maintains healthy gut microbiome balance; promotes digestive health (halal-certified culture medium required; porcine-derived broth prohibited)', limit: '기준 없음', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: '배양 배지 내 돼지유래 성분 불허. 식물성 배지 사용 균주 권장.' } as any,
    { name: 'Lecithin (Soy)', nameLocal: 'Lecithin (Soy)', function: '유화제 · 세포막 구성 성분(포스파티딜콜린) · 지질 대사 지원', functionLocal: 'Emulsifier; phosphatidylcholine supports cell membrane structure and lipid metabolism (soy lecithin permitted; egg lecithin requires halal verification)', limit: '기준 없음', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: '대두 레시틴 허용. 달걀 레시틴은 할랄 도축 확인 필요.' } as any,
    { name: 'Vitamin D3', nameLocal: 'Vitamin D3', function: '칼슘·인 흡수 보조 · 골격 건강 유지 · 면역 기능 지원 (할랄 인증 원료 출처 확인 필수)', functionLocal: 'Supports calcium and phosphorus absorption; maintains skeletal health and immune function (halal-certified source mandatory; lanolin-derived D3 requires verification)', limit: '기준 없음', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: '양모(Lanolin) 유래 D3 할랄 인증 원료 여부 확인 필수.' } as any,
    { name: 'Stevia Extract', nameLocal: 'Stevia Extract', function: '칼로리 제로 천연 감미료 · 혈당 영향 없는 당류 대체 기능', functionLocal: 'Zero-calorie natural sweetener; replaces sugar without affecting blood glucose (confirm no alcohol extraction process used)', limit: 'Food Regulations 1985 기준', lawRef: 'Food Regulations 1985 / JAKIM MS1500', lawUrl: 'https://www.moh.gov.my/', notes: '알룰로스 대신 Stevia 우선 권장. 단, 공정 중 알코올 추출 여부 반드시 확인.' } as any,
    { name: 'Glucosamine', nameLocal: 'Glucosamine', function: '관절 연골 유지 · 관절 통증 완화 지원 (갑각류·발효 유래 할랄 인증 원료)', functionLocal: 'Supports joint cartilage maintenance and joint comfort (crustacean- or fermentation-derived halal-certified only; porcine-derived prohibited)', limit: '기준 없음', lawRef: 'JAKIM Halal Standard MS1500:2019', lawUrl: 'https://www.jakim.gov.my/', notes: '돼지유래 Glucosamine 불허. 새우·게 등 갑각류 또는 발효 유래 권장.' } as any,
  ] },
  { code: 'AU', flag: '🇦🇺', label: 'Australia (FSANZ)', systemName: 'FSANZ 허가 성분 목록 — Novel Food & Nutritive Substance (Standard 1.1.1 / 1.3.2)', systemDesc: 'FSANZ(호주·뉴질랜드 식품기준청)는 식품성분을 ① 일반 허가, ② Novel Food(신규심사 필요), ③ 금지 3단계로 분류. ⚠️ 바이오보안(Biosecurity) 고위험 성분 — DAFF 수입 허가 필수 목록(2026): 육류·가금류 유래 성분, 난황 분말(Egg Yolk Powder), 유청 단백 분말 일부, 골분(Bone Meal), 동물성 혈장(Plasma). 허가 전 Novel Food 성분 함유 제품은 수출 불가.', rows: [
    { name: 'Allulose (D-Psicose)', nameLocal: 'Allulose (D-Psicose)', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: '현재 판매 불가 — 수출 시 통관 거부', lawRef: 'FSANZ Standard 1.1.1 Novel Food', lawUrl: 'https://www.foodstandards.gov.au/', notes: 'FSANZ 허가 신청 접수 개시(2026). 2026년 말 허가 여부 최종 결정 예정. 허가 전 알룰로스 함유 제품 호주 수출 절대 불가. 허가 결정 모니터링 후 라벨 사전 준비 권장.' } as any,
    { name: 'Allulose — 호주 허가 현황', nameLocal: 'Allulose — Australia Regulatory Status', function: '🚫 Novel Food — 미허가 (FSANZ 2026 검토 중, 허가 전 수출 불가)', functionLocal: '🚫 Novel Food — not permitted for sale in Australia/New Zealand; FSANZ Novel Food application commenced 2026; final decision expected late 2026; export of allulose-containing products to AU is absolutely prohibited until approved', category: 'regulatory', limit: '판매 불가 (허가 전)', lawRef: 'FSANZ Standard 1.1.1 Novel Food', lawUrl: 'https://www.foodstandards.gov.au/', notes: 'FSANZ 허가 결정 후 라벨 준비 사전 진행 권장. 미허가 기간 Stevia·에리스리톨 대체 감미료 전략 검토.' } as any,
    { name: '⚠️ Egg Yolk Powder (바이오보안)', nameLocal: 'Egg Yolk Powder', function: '바이오보안 수입 허가 필수 (DAFF)', functionLocal: '⚠️ High-risk animal-derived ingredient on DAFF mandatory Biosecurity Import Permit list — Biosecurity Import Permit must be obtained before importation; permit processing time 3–6 months; FSMP and protein-fortified product manufacturers must pre-screen all ingredients against DAFF high-risk list.', category: 'regulatory', limit: 'DAFF Biosecurity Import Permit 취득 후만 사용 가능', lawRef: 'DAFF Biosecurity Act 2015 / FSANZ', lawUrl: 'https://www.agriculture.gov.au/', notes: 'DAFF 고위험 동물성 성분 목록 등재. 수입 허가 처리 기간 3~6개월. FSMP·단백질 강화 제품 성분 사전 점검 필수.' } as any,
    { name: '⚠️ Whey Protein (바이오보안)', nameLocal: 'Whey Protein', function: '조건부 허용 (⚠️ 일부 바이오보안 허가 필요)', functionLocal: '⚠️ Conditionally permitted — heat-treated or dried whey protein may be partially exempt from Biosecurity Import Permit requirements; however raw material form and processing conditions must be confirmed with DAFF prior to import; some forms still require a permit under DAFF Biosecurity Act 2015.', category: 'regulatory', limit: '제품 형태·처리 방식에 따라 허가 여부 상이', lawRef: 'DAFF Biosecurity Act 2015 / FSANZ', lawUrl: 'https://www.foodstandards.gov.au/', notes: '가공 처리된 유청 단백(열처리·건조)은 일부 면제. 원료 상태·처리 조건 DAFF 사전 확인 필수.' } as any,
    { name: '⚠️ Meat-derived Ingredients (바이오보안)', nameLocal: 'Meat-derived / Bone Meal', function: '바이오보안 수입 허가 필수 (DAFF)', functionLocal: '⚠️ DAFF Biosecurity Import Permit mandatory for all meat/poultry-derived ingredients (including collagen) and bone meal — importation without a valid DAFF permit is prohibited; FSMP and protein product manufacturers must conduct a full ingredient biosecurity review before export to Australia.', category: 'regulatory', limit: 'DAFF 허가 없이 수입 불가', lawRef: 'DAFF Biosecurity Act 2015', lawUrl: 'https://www.agriculture.gov.au/', notes: '육류·가금류 유래 성분(콜라겐 포함), 골분 전품목 DAFF 바이오보안 허가 필수. FSMP·단백질 제품 원료 성분 전면 점검 필요.' } as any,
    { name: 'Omega-3 (EPA/DHA)', nameLocal: 'Omega-3 (EPA/DHA)', function: '심혈관 건강 유지 · 혈중 중성지방 조절 · 뇌 기능 지원 (EPA·DHA)', functionLocal: 'Supports cardiovascular health; helps regulate blood triglycerides; supports brain function (DHA/EPA) — FSANZ Standard 2.9.2', limit: '160mg DHA/서빙 이하 (일반식품)', lawRef: 'FSANZ Standard 2.9.2', lawUrl: 'https://www.foodstandards.gov.au/', notes: '바이오보안 허가 불요. 해조류 유래 Omega-3 권장.' } as any,
    { name: 'Probiotics', nameLocal: 'Probiotics', function: '장내 유익균 군집 유지 · 소화기 건강 증진 (건강 클레임은 FSANZ 허가 항목에 한함)', functionLocal: 'Maintains healthy gut flora; promotes digestive health (health claims restricted to FSANZ-permitted claims only) — FSANZ Standard 2.9.2', limit: 'CFU 기준 없음 (건강 클레임 제한)', lawRef: 'FSANZ Standard 2.9.2', lawUrl: 'https://www.foodstandards.gov.au/', notes: '건강 강조 표시는 FSANZ 허가 클레임만 가능.' } as any,
    { name: 'Glucosamine', nameLocal: 'Glucosamine', function: '관절 연골 건강 유지 · 관절 기능 지원 (관절 건강 클레임 허용)', functionLocal: 'Supports joint cartilage health and joint function (joint health claims permitted) — FSANZ Standard 2.9.2', limit: '1500mg/일 이하', lawRef: 'FSANZ Standard 2.9.2', lawUrl: 'https://www.foodstandards.gov.au/', notes: '관절 건강 클레임 허용 기준 있음.' } as any,
    { name: 'Stevia Extract', nameLocal: 'Stevia Extract', function: '칼로리 제로 천연 감미료 · 당류 대체 · 혈당 지수에 영향 없는 감미 제공 (2008년 FSANZ 허가)', functionLocal: 'Zero-calorie natural sweetener; provides sweetness without glycaemic impact (FSANZ-approved high-purity steviol glycosides since 2008) — FSANZ Standard 1.3.1', limit: '식품별 기준 적용', lawRef: 'FSANZ Standard 1.3.1', lawUrl: 'https://www.foodstandards.gov.au/', notes: '고순도 스테비올 배당체 허용. 알룰로스 미허가 기간 Stevia 대체 감미료 전략 권장.' } as any,
    { name: 'Vitamin C', nameLocal: 'Vitamin C', function: '항산화 작용 · 콜라겐 합성 보조 · 면역 기능 지원 · 철 흡수 증진', functionLocal: 'Antioxidant; supports collagen formation for skin, cartilage and bones; immune support; enhances non-heme iron absorption — FSANZ Standard 1.3.2', limit: '일반식품 기준 적용', lawRef: 'FSANZ Standard 1.3.2', lawUrl: 'https://www.foodstandards.gov.au/', notes: '영양 강화 목적 사용 허용.' } as any,
  ] },
  { code: 'AE', flag: '🇦🇪', label: 'UAE (MoIAT/ESMA)',
    systemName: 'GSO 식품 기준 / ESMA 성분 등록 (GSO 1694:2009 / UAE.S 2055 / GSO 영양 표시 2026)',
    systemDesc: 'UAE MoIAT·ESMA 관할. 식품 성분은 GCC 공통 기준(GSO) 허용 목록 적용. 동물성 유래 성분은 ECAS·ESMA 승인 할랄 인증 필수. ⚠️ 알룰로스 GSO 허용 감미료 목록 미등재 — 개별 성분 허가 신청 필요. 💰 설탕세(Excise Tax): 가당 음료 50%, 에너지드링크 100% 부과. 📋 GSO 영양 표시 2026 개정판: 1회 제공량 기준 영양성분 표시 형식 통일, 아랍어 전 항목 병기 의무.',
    rows: [
    { name: 'Allulose', nameLocal: 'Allulose', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: '현재 판매 미허가 — 통관 거부 위험', lawRef: 'GSO 1694:2009 / UAE.S 2055', lawUrl: 'https://www.moiat.gov.ae/', notes: 'GSO 허용 감미료 목록에 미등재. ESMA 개별 성분 허가 신청 필요. 승인 전 알룰로스 함유 제품 통관 불가. 한국(허용), 미국(GRAS), 호주(검토 중)와 달리 UAE는 별도 허가 절차 필요.' } as any,
    { name: 'Allulose — UAE 허가 현황', nameLocal: 'Allulose — UAE Regulatory Status', function: '🚫 GSO 미등재 — ESMA 개별 성분 허가 신청 필요 (승인 전 통관 불가)', functionLocal: '🚫 Not listed in GSO permitted sweetener schedule (GSO 1694:2009) — individual product authorisation required from ESMA; products containing allulose cannot clear UAE customs until approved; different from Korea (permitted), USA (GRAS) and other markets', category: 'regulatory', limit: '판매 불가 (허가 전)', lawRef: 'GSO 1694:2009 / UAE.S 2055', lawUrl: 'https://www.moiat.gov.ae/', notes: '설탕세(Excise Tax) 대상 아님. Stevia·에리스리톨 GSO 허용 대체 감미료 전략 권장.' } as any,
    { name: 'GSO 영양 표시 2026 개정', nameLocal: 'GSO Nutrition Labeling 2026', function: '2026.09.01부터 개정판 전면 의무 적용', functionLocal: 'Mandatory from 1 September 2026: revised GSO Nutrition Labelling standard unifies nutrition label format and units across all GCC countries; all items including energy (kJ/kcal), protein, total fat, carbohydrates and sodium must be declared in Arabic; full export label review and redesign required for UAE- and GCC-destined products.', category: 'regulatory', limit: '1회 제공량 기준 / 아랍어 전 항목 병기', lawRef: 'GSO Nutrition Labeling 2026 / UAE.S 2055', lawUrl: 'https://www.moiat.gov.ae/', notes: '2026 개정: 영양성분 표시 형식·단위 GCC 전체 통일. 에너지(kJ/kcal), 단백질·지방·탄수화물·나트륨 아랍어 병기 의무. 수출 라벨 전면 재검토 필요.' } as any,
    { name: 'Sugar Tax 적용 성분 (설탕세)', nameLocal: 'Excise Tax on Sweetened Products', function: '가당 음료 50% / 에너지드링크 100% 과세 (FTA 2017)', functionLocal: 'UAE Federal Tax Authority (FTA) Excise Tax 2017: sweetened beverages taxed at 50% and energy drinks at 100% of the retail price; expansion to sweetened confectionery products is under discussion with a decision expected in H2 2026; low-sugar, sugar-free and Stevia-substitute product strategies are strongly recommended to mitigate price competitiveness impact.', category: 'regulatory', limit: '제품 당류 함량·유형에 따라 세율 적용', lawRef: 'UAE FTA Excise Tax 2017 / GSO', lawUrl: 'https://www.moiat.gov.ae/', notes: '고당류 음료 수출 시 가격 경쟁력 영향 분석 필수. 가당 제과류까지 확대 논의 중(2026 하반기 결정 예정). 저당·무가당·Stevia 대체 제품군 전환 검토 권장.' } as any,
    { name: 'Stevia Extract', nameLocal: 'Stevia Extract', function: '칼로리 제로 천연 감미료 · 혈당 영향 없는 당류 대체 기능 (GSO 허용 감미료 목록 등재)', functionLocal: 'Zero-calorie natural sweetener; provides sweetness without glycaemic impact (listed on GSO permitted sweetener list)', limit: 'GSO 기준 적용', lawRef: 'GSO 1694:2009', lawUrl: 'https://www.moiat.gov.ae/', notes: '설탕세 회피 및 알룰로스 대체 목적 Stevia 활용 권장. Monk Fruit Extract도 검토 가능.' } as any,
    { name: 'Halal-certified Gelatin', nameLocal: 'Halal-certified Gelatin', function: '식품 겔화·안정화·유화 기능 · 식감 개선 (할랄 인증 어류·Bovine 유래 한정, ECAS 승인 필수)', functionLocal: 'Gelling, stabilizing and emulsifying agent; improves food texture (halal-certified fish or bovine-derived only, ECAS approval mandatory)', limit: '기준 없음', lawRef: 'GSO Halal Standard / ECAS', lawUrl: 'https://www.moiat.gov.ae/', notes: 'Pork-derived 젤라틴 전면 금지. Bovine(할랄 도축 인증) 또는 어류 유래 대체 사용. ECAS 승인 할랄 인증서 필수.' } as any,
    { name: 'Omega-3 (Fish Oil)', nameLocal: 'Omega-3 (Fish Oil)', function: '심혈관 건강 유지 · 혈중 중성지방 감소 · 항염 작용 (ECAS·ESMA 승인 할랄 인증 어류 유래 한정)', functionLocal: 'Supports cardiovascular health; helps reduce blood triglycerides; anti-inflammatory (ECAS/ESMA halal-certified marine source mandatory)', limit: 'GSO 기준 적용', lawRef: 'GSO 1694:2009 / ECAS Halal', lawUrl: 'https://www.moiat.gov.ae/', notes: '어류 유래 Omega-3: ECAS·ESMA 승인 할랄 인증서 필수. 어류 어획·가공 공정 할랄 검증 필요.' } as any,
    { name: 'Probiotics', nameLocal: 'Probiotics', function: '장내 유익균 균형 유지 · 소화기 건강 증진 (할랄 인증 배양 배지 사용 균주 한정)', functionLocal: 'Maintains healthy gut microbiome balance; promotes digestive health (halal-certified culture medium required)', limit: 'GSO 기준 적용', lawRef: 'GSO 1694:2009', lawUrl: 'https://www.moiat.gov.ae/', notes: '배양 배지·성장 인자 할랄 확인 필수. 동물성 유래 배지(돼지 유래 펩톤 등) 불허.' } as any,
    { name: 'Vitamin D3', nameLocal: 'Vitamin D3', function: '칼슘·인 흡수 보조 · 골격 건강 유지 · 면역 기능 지원 (식물성 D3 또는 ECAS 승인 할랄 인증 원료 한정)', functionLocal: 'Supports calcium and phosphorus absorption; maintains bone health and immune function (plant-derived D3 or ECAS halal-certified source preferred)', limit: 'GSO 기준 적용', lawRef: 'GSO 1694:2009 / ECAS Halal', lawUrl: 'https://www.moiat.gov.ae/', notes: 'Lanolin(양모) 유래 D3 할랄 도축 증명 필요. 식물성 D3(이끼류 유래) 우선 권장.' } as any,
  ] },
  {
    code: 'RU', flag: '🇷🇺', label: 'Russia/EAEU (EAC)',
    systemName: 'EAC 인증 + 국가 위생등록(СГР) 제도 (TR TS 021/029/2011-2012)',
    systemDesc: 'EAEU(유라시아경제연합 — 러시아·카자흐스탄·벨라루스·키르기스스탄·아르메니아)의 EAC 인증 없이 5개국 수출 불가. 식품 첨가물은 TR TS 029/2012 허용 목록 내 성분만 사용 가능. ⚠️ 러시아 특유 금지: Potassium Bromate 금지. 🟡 EU와 차이: E171(이산화티타늄) EAEU에서 사용 가능(EU 2022 금지와 상이). 성분명·라벨 러시아어 전면 의무.',
    rows: [
      { name: 'E171 (Titanium Dioxide)', nameLocal: 'Диоксид титана (E171)', regulated: true, function: '식품 백색화·불투명화 기능 (백색 착색제/안료) — 제과·껌·소스·의약품 코팅 등 식품 외관 개선', functionLocal: 'Food whitening and opacifying function (white colourant/pigment) — improves visual appearance in confectionery, chewing gum, sauces and food coatings', limit: 'TR TS 029 한도 내 허용', lawRef: 'TR TS 029/2012 — 식품 첨가물 기술규정', lawUrl: 'https://www.eurasiancommission.org/', notes: 'EU·영국·프랑스에서는 금지된 E171이 EAEU에서는 TR TS 029 한도 내 허용. EU/EAEU 동시 수출 제품은 성분 별도 관리 필수.' } as any,
      { name: 'E171 — EAEU vs EU 규제 비교', nameLocal: 'E171 (Titanium Dioxide) — Regulatory Divergence', function: '🟡 EAEU 허용 vs EU·영국 금지(2022.02) — 이중 수출 제품 성분 분리 관리 필수', functionLocal: '🟡 Permitted in EAEU under TR TS 029/2012 — contrasts with EU ban (Commission Regulation (EU) 2022/63 effective Feb 2022) and UK/France prohibition; dual-market manufacturers must maintain separate formulations', category: 'regulatory', limit: 'TR TS 029 한도 적용', lawRef: 'TR TS 029/2012 vs EU Reg. 2022/63', lawUrl: 'https://www.eurasiancommission.org/', notes: 'EU·EAEU 동시 수출 시 E171 함유 여부에 따른 별도 포뮬레이션 유지 필수. 스위스·홍콩은 별도 확인 필요.' } as any,
      { name: 'Potassium Bromate', nameLocal: 'Бромат калия', regulated: true, function: '제빵 밀가루 처리제 — 반죽 글루텐 강화 및 발효 지원 기능 (EAEU·EU·영국·캐나다 전면 금지 성분)', functionLocal: 'Flour treatment agent for bread-making — strengthens gluten network and supports fermentation; however completely prohibited in EAEU, EU, UK and Canada due to carcinogenicity concerns', limit: '사용 불가', lawRef: 'TR TS 029/2012 금지 성분 목록', lawUrl: 'https://www.eurasiancommission.org/', notes: 'Potassium Bromate EAEU 전면 금지. EU·영국·캐나다와 동일 입장.' } as any,
      { name: 'Potassium Bromate — EAEU 금지', nameLocal: 'Potassium Bromate — Banned Substance', function: '🚫 EAEU 전면 금지 — 빵류·제과류 사용 절대 불허 (발암 가능성 근거)', functionLocal: '🚫 Completely prohibited in EAEU — absolute ban on use in bread and bakery products under TR TS 029/2012 banned substances list; consistent with EU, UK, Canada and most international markets due to potential carcinogenicity', category: 'regulatory', limit: '사용 불가', lawRef: 'TR TS 029/2012 금지 성분 목록', lawUrl: 'https://www.eurasiancommission.org/', notes: '대체 성분: 아스코르브산(Vitamin C), 아조다이카본아미드(국가별 규정 확인 필요) 사용 권장.' } as any,
      { name: 'Allulose', nameLocal: 'Аллюлоза', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: 'TR TS 029 목록 미등재', lawRef: 'TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', notes: '알룰로스 EAEU 허용 성분 목록 미등재. 개별 기술규정 개정 또는 특별 허가 절차 필요. 한국 수출 전 EAEU 대응 성분 확인 필수.' } as any,
      { name: 'Allulose — EAEU 허가 현황', nameLocal: 'Алюлоза — Regulatory Status (EAEU)', function: '⚠️ EAEU 미등재 — 개별 기술규정 개정 또는 특별 허가 절차 필요 (현재 사용 불가)', functionLocal: '⚠️ Not registered on EAEU permitted sweetener list (TR TS 029/2012) — individual regulatory amendment or special authorisation required; currently cannot be used in EAEU-market products', category: 'regulatory', limit: '현재 사용 불가', lawRef: 'TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', notes: 'EAEU 미등재 감미료 대체제: 스테비아(TR TS 029 허용) 우선 활용 권장. 알룰로스 EAEU 등재 모니터링 필요.' } as any,
      { name: 'Cyclamate (Sodium Cyclamate)', nameLocal: 'Цикламат натрия', function: '저칼로리 합성 감미료 · 당류 대체 감미 기능 (EU·캐나다 금지 대비 EAEU 허용)', functionLocal: 'Low-calorie synthetic sweetener; sugar-replacement sweetening function (permitted within TR TS 029 category limits; prohibited in EU, Canada, Thailand — separate management for dual-market products)', limit: '식품 카테고리별 한도 적용', lawRef: 'TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', notes: 'EU·캐나다·태국에서 금지된 Cyclamate가 EAEU에서는 한도 내 허용. 동시 수출 제품 성분 분리 관리 필수.' } as any,
      { name: 'Omega-3 (EPA/DHA)', nameLocal: 'Омега-3 (ЭПК/ДГК)', function: '심혈관 건강 유지 · 혈중 중성지방 감소 · 뇌 기능 지원 (СГР 등록 후 기능 표시 가능)', functionLocal: 'Supports cardiovascular health; helps reduce blood triglycerides; supports brain function (functional label claims permitted only after государственная санитарно-эпидемиологическая регистрация — СГР)', limit: '국가 위생등록 기준 적용', lawRef: 'TR TS 021/2011 + СГР 국가 등록', lawUrl: 'https://www.eurasiancommission.org/', notes: '기능성 원료로서 СГР 등록 시 기능 표시 가능. 어류 유래 오메가-3 러시아어 원료 서류 준비 필요.' } as any,
      { name: 'Probiotics', nameLocal: 'Пробиотики', function: '장내 유익균 균형 유지 · 소화기 건강 증진 (EAEU 허가 균주 목록 내 성분 한정)', functionLocal: 'Maintains healthy gut microbiome balance; promotes digestive health (EAEU-permitted strain list only; strain name must be stated in Russian; health claims require СГР registration)', limit: '제품 유형별 상이', lawRef: 'TR TS 021/2011', lawUrl: 'https://www.eurasiancommission.org/', notes: 'EAEU 허가 균주 목록 확인 필요. 건강 강조 표시는 СГР 등록 후 가능. 러시아어 균주명 정확 기재 필수.' } as any,
      { name: 'Stevia Extract', nameLocal: 'Экстракт стевии', function: '칼로리 제로 천연 감미료 · 설탕 대체 감미 기능 (TR TS 029 허용 감미료 목록 등재)', functionLocal: 'Zero-calorie natural sweetener; replaces sugar without glycaemic impact (high-purity steviol glycosides on TR TS 029 permitted sweeteners list)', limit: 'TR TS 029 한도', lawRef: 'TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', notes: '고순도 스테비올 배당체 EAEU 허용. 알룰로스 대체 감미료 전략에 활용 가능.' } as any,
      { name: 'Vitamin C', nameLocal: 'Аскорбиновая кислота', function: '항산화 작용 · 콜라겐 합성 보조 · 면역 기능 강화 · 철 흡수 증진 (СГР 등록 시 기능 표시 가능)', functionLocal: 'Antioxidant; supports collagen synthesis; immune function; enhances iron absorption (nutritional fortification permitted under TR TS 021; functional claims require государственная регистрация)', limit: 'TR TS 021 기준 적용', lawRef: 'TR TS 021/2011', lawUrl: 'https://www.eurasiancommission.org/', notes: '영양 강화 목적 허용. 기능 표시 시 СГР 등록 필요.' } as any,
    ],
  },
  {
    code: 'HK', flag: '🇭🇰', label: 'Hong Kong (CFS/FEHD)',
    systemName: '홍콩 CFS 식품 안전 제도 — 사후 관리 방식 (Food Safety Ordinance Cap 612)',
    systemDesc: '홍콩은 Pre-market approval 없이 사업자 자율 책임 원칙(사후 관리). 단, 영어·번체 중국어(Traditional Chinese) 병기 표시 의무 엄격 적용. 중국 본토(SAMR GB 기준)와 완전 별개 규제 — 간체자 미인정. Codex 기준 준용으로 대부분 성분 허용. ⚠️ 번체자 라벨 누락 시 판매 금지 조치 즉시 발동.',
    rows: [
      { name: 'Traditional Chinese Labelling', nameLocal: '繁體中文標籤義務 (번체자 표기)', function: '🚨 의무 — 영어 + 번체자 병기 필수', functionLocal: '🚨 Mandatory — Traditional Chinese (繁體中文) and English bilingual labelling required on all food products sold in Hong Kong; Simplified Chinese (簡體字) alone is NOT accepted; mainland China labels cannot be reused for the HK market; non-compliance results in immediate prohibition of sale.', category: 'regulatory', limit: '위반 시 즉시 판매 금지', lawRef: 'Cap 132W — Food and Drugs (Composition and Labelling) Reg', lawUrl: 'https://www.cfs.gov.hk/', notes: '간체자(簡體字) 단독 표기 불인정. 반드시 繁體中文(번체자) + English 병기. 중국 본토 라벨 유용 불가.' } as any,
      { name: 'Nutrition Information Panel', nameLocal: '營養資料標籤 (영양성분 표시)', function: '의무 (2010년 시행)', functionLocal: 'Mandatory since 2010 — 7+1 Nutrition Information Panel required: energy, protein, carbohydrates, sugars, total fat, saturated fat, trans fat (7 core nutrients) plus sodium; all values must be declared per serving and per 100g or 100mL; failure to comply results in product recall action by CFS.', category: 'regulatory', limit: '에너지·단백질·탄수화물·당류·지방·포화지방·트랜스지방·나트륨 8항목', lawRef: 'Cap 132W Food and Drugs Regulation', lawUrl: 'https://www.cfs.gov.hk/', notes: '7+1 영양성분 의무 표시. 1회 제공량 기준 표시. 기준 미준수 시 회수 조치.' } as any,
      { name: 'Allulose', nameLocal: '阿洛酮糖', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: 'Codex 기준 적용', lawRef: 'Cap 132W / Codex 기준 준용', lawUrl: 'https://www.cfs.gov.hk/', notes: '홍콩은 Codex 기준 준용 — 알룰로스 Codex 등재 여부 확인 후 사용. 한국·미국 허용이라도 홍콩 CFS 별도 기준 확인 필요.' } as any,
      { name: 'Allulose — 홍콩 허가 현황', nameLocal: '阿洛酮糖 — Hong Kong Regulatory Status', function: '⚠️ 조건부 허용 (Codex 기준 준용) — Codex 등재 여부 사전 확인 필수, CFS 사전 문의 권장', functionLocal: '⚠️ Conditionally permitted under Codex-referencing approach (Cap 132W) — pre-market approval not required if Codex-listed; however Codex listing status for allulose must be confirmed before use; consult HK Centre for Food Safety if uncertain', category: 'regulatory', limit: 'CFS 확인 필요', lawRef: 'Cap 132W / Codex 기준 준용', lawUrl: 'https://www.cfs.gov.hk/', notes: '한국·미국 허용이라도 홍콩 CFS 별도 기준 확인 필수. 사전 승인은 불필요하나 사후 관리 리스크 있음.' } as any,
      { name: 'E171 (Titanium Dioxide)', nameLocal: '二氧化鈦 (E171)', function: '식품 백색화·차광 기능 — 홍콩 Codex 기준 허용 (EU·영국 금지 대비 주의)', functionLocal: 'Food whitening and opacifying function — permitted under HK Codex-referenced standard (Cap 132U); separate ingredient management required for products also exported to EU/UK', limit: 'Codex 한도', lawRef: 'Cap 132U — Food Additives Regulation', lawUrl: 'https://www.cfs.gov.hk/', notes: 'EU·영국에서 금지된 E171이 홍콩에서는 Codex 기준으로 허용. EU 병행 수출 시 성분 분리 관리 필수.' } as any,
      { name: 'Omega-3 (EPA/DHA)', nameLocal: '奥米加-3 (EPA/DHA)', function: '심혈관 건강 유지 · 혈중 중성지방 조절 · 뇌 기능 지원 (사전 허가 불필요, 영양강화 사용 허용)', functionLocal: 'Supports cardiovascular health; helps regulate blood triglycerides; supports brain function (pre-market approval not required under HK Food Safety Ordinance Cap 612)', limit: '영양성분 표시 기준 적용', lawRef: 'Cap 132W', lawUrl: 'https://www.cfs.gov.hk/', notes: '홍콩 Pre-market approval 불필요. 영양강화 목적 사용 허용. 건강 강조 표시 기준 확인 필요.' } as any,
      { name: 'Probiotics', nameLocal: '益生菌', function: '장내 유익균 균형 유지 · 소화기 건강 증진 (사전 등록 불필요, 건강 클레임은 CFS 가이드라인 준수)', functionLocal: 'Maintains healthy gut flora; promotes digestive health (no pre-registration required; health claims subject to CFS Food and Drugs Regulation Cap 132W guidelines)', limit: '건강 클레임 기준 확인', lawRef: 'Cap 612 / Cap 132W', lawUrl: 'https://www.cfs.gov.hk/', notes: '홍콩 Probiotics 사전 등록 불필요. 단, 건강 강조 표시 허용 기준 CFS 가이드라인 확인 필수.' } as any,
      { name: 'GMO Labelling', nameLocal: '基因改造標示 (GMO 표시)', function: '의무 (5% 이상 GMO 함유 시)', functionLocal: 'Mandatory GMO labelling when the genetically modified content of any ingredient exceeds 5% — "Genetically Modified (基因改造)" declaration required on product label; the 5% threshold applies per individual ingredient; this requirement is separate from and independent of mainland China GMO labelling regulations.', category: 'regulatory', limit: 'GMO 5% 임계값', lawRef: 'Cap 132W GMO Labelling Regulation', lawUrl: 'https://www.cfs.gov.hk/', notes: 'GMO 성분 5% 초과 시 "基因改造" 표시 의무. 중국 본토 GMO 기준과 별개 적용.' } as any,
    ],
  },
  {
    code: 'GB', flag: '🇬🇧', label: 'UK (FSA) [Post-Brexit]',
    systemName: 'UK Retained EU Law 기반 식품 규제 (Post-Brexit 독자 분리 진행 중)',
    systemDesc: 'Brexit(2020.01.31) 이후 EU 규정을 UK Retained EU Law로 일시 전환. 이후 점진적 독자 분리 진행. ⚠️ 주요 차이점: Northern Ireland는 EU NI Protocol로 EU 규정 적용(GB와 분리). E171 등 EU 금지 성분의 UK 적용 여부 별도 확인 필요. DEFRA IPAFFS 입항 사전 신고 의무. 영어 단독 표기 의무.',
    rows: [
      { name: 'E171 (Titanium Dioxide)', nameLocal: 'Titanium Dioxide (E171)', regulated: true, function: '식품 백색화·불투명화 기능 (백색 착색제/안료) — 제과·껌·소스 등 식품 외관 개선', functionLocal: 'Food whitening and opacifying function (white colourant/pigment) — improves visual appearance in confectionery, chewing gum, sauces and other food products', limit: 'FSA 최신 상태 확인 필수', lawRef: 'UK Retained Food Additives Reg / FSA Review', lawUrl: 'https://www.food.gov.uk/', notes: 'EU가 2022.02에 E171을 금지했으나 UK는 별도 검토 중. UK FSA 최신 결정 확인 필수 — EU 금지가 UK에 자동 적용되지 않을 수 있음. NI 판매 시 EU 금지 적용.' } as any,
      { name: 'E171 — UK 독자 검토 현황', nameLocal: 'E171 (Titanium Dioxide) — UK FSA Review Status', function: '⚠️ UK 독자 검토 중 — EU 금지(2022.02) GB 자동 적용 불확실, 북아일랜드(NI)는 EU 금지 적용', functionLocal: '⚠️ Under independent UK FSA review — EU ban (Commission Regulation EU 2022/63, effective Feb 2022) does not automatically apply to Great Britain under UK retained law; Northern Ireland follows EU ban under NI Protocol; await FSA decision before formulation changes', category: 'regulatory', limit: 'FSA 최신 결정 확인 필수', lawRef: 'UK Retained Food Additives Reg / FSA Review', lawUrl: 'https://www.food.gov.uk/', notes: 'GB와 NI 판매 제품 포뮬레이션 분리 필요 가능성 있음. FSA 결정 모니터링 필수.' } as any,
      { name: 'Allulose', nameLocal: 'Allulose (D-Psicose)', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: 'UK Novel Food 심사 진행 중', lawRef: 'UK Retained Regulation (EU) 2015/2283 Novel Food', lawUrl: 'https://www.food.gov.uk/', notes: 'Brexit 이후 EU Novel Food 허가가 UK에 자동 적용 안 됨. 알룰로스 UK Novel Food 별도 신청 필요. FSA 승인 전 UK 수출 불가.' } as any,
      { name: 'Allulose — UK 허가 현황', nameLocal: 'Allulose — UK Novel Food Status', function: '⚠️ UK Retained Novel Food — EU 허가 UK 자동 적용 불가, 별도 FSA 신청 필수 (승인 전 수출 불가)', functionLocal: '⚠️ Classified as UK Retained Novel Food (UK Retained Regulation EU 2015/2283) — EU Novel Food approval does not automatically apply post-Brexit; separate UK Novel Food application to FSA mandatory; products containing allulose cannot be sold in GB until FSA approval granted', category: 'regulatory', limit: '판매 불가 (FSA 승인 전)', lawRef: 'UK Retained Regulation (EU) 2015/2283 Novel Food', lawUrl: 'https://www.food.gov.uk/', notes: 'EU Novel Food 신청과 병행 또는 별도로 UK FSA 신청 진행 권장. 승인 시 NI(EU) 규정과 별도 적용.' } as any,
      { name: 'Red Yeast Rice (Monacolin K)', nameLocal: 'Red Yeast Rice', regulated: true, function: 'LDL 콜레스테롤 감소 지원 · 심혈관 건강 지원 (Monacolin K — HMG-CoA 환원효소 억제 기전)', functionLocal: 'Supports reduction of LDL-cholesterol levels; supports cardiovascular health (Monacolin K — HMG-CoA reductase inhibition mechanism; functionally equivalent to lovastatin)', limit: 'UK MHRA 사전 분류 확인 필수', lawRef: 'UK MHRA Borderline Products / Food Safety Act 1990', lawUrl: 'https://www.food.gov.uk/', notes: 'Monacolin K 함량에 따라 UK MHRA가 의약품으로 분류할 수 있음. 사전 MHRA 분류 확인 없이 UK 판매 시 리스크.' } as any,
      { name: 'Red Yeast Rice — UK 규제 현황', nameLocal: 'Red Yeast Rice — UK MHRA Borderline Status', function: '⚠️ MHRA 경계 제품 — Monacolin K 함량에 따라 처방전 의약품(POM) 분류 가능성', functionLocal: '⚠️ MHRA Borderline Product — UK Medicines and Healthcare products Regulatory Agency (MHRA) may classify as Prescription Only Medicine (POM) depending on Monacolin K content; pre-classification review by MHRA mandatory before any UK market entry', category: 'regulatory', limit: 'MHRA 사전 분류 확인 필수', lawRef: 'UK MHRA Borderline Products / Food Safety Act 1990', lawUrl: 'https://www.food.gov.uk/', notes: 'MHRA 사전 분류 없이 판매 시 허가 없는 의약품으로 간주될 수 있음. EU EFSA 경고(2018) 이후 유럽 전반 강화 추세.' } as any,
      { name: 'Omega-3 (EPA/DHA)', nameLocal: 'Omega-3 (EPA/DHA)', function: '심혈관 건강 유지 · 혈중 중성지방 조절 · 뇌 기능 지원 (UK Retained Health Claims Register 등재 기준)', functionLocal: 'Supports cardiovascular health; helps maintain normal blood triglyceride levels; supports brain function — UK Retained Health Claims Register (derived from Reg. EU 432/2012)', limit: 'UK Retained 기준 적용', lawRef: 'UK Retained Reg (EU) 432/2012', lawUrl: 'https://www.food.gov.uk/', notes: 'UK Retained 건강 클레임 목록 내 Omega-3 기능 표시 허용. 건강 클레임은 UK Retained 허가 목록 기준.' } as any,
      { name: 'Probiotics', nameLocal: 'Probiotics', function: '장내 유익균 균형 유지 · 소화기 건강 증진 (UK Retained Health Claims Register 등재 클레임만 표시 허용)', functionLocal: 'Maintains healthy gut flora; promotes digestive health (only UK Retained Health Claims Register-listed claims permitted; register maintained separately from EU post-Brexit)', limit: '건강 클레임 UK Retained 목록', lawRef: 'UK Retained Reg (EC) 1924/2006', lawUrl: 'https://www.food.gov.uk/', notes: 'UK Retained Health Claims Register에 등재된 클레임만 사용 가능. EU와 목록 분리 운영 중.' } as any,
      { name: 'FOPL (Front-of-Pack Labelling)', nameLocal: 'Front-of-Pack Nutrition Labelling', function: '🆕 UK 독자 검토 중', functionLocal: '🆕 UK Front-of-Pack Labelling (FOPL) is under independent review by UK FSA and DHSC (2024–2026) — if mandated, products classified as high in sugar, saturated fat or salt will require warning labels on the front of pack; this is a separate scheme from EU and Canadian FOPL systems; manufacturers should monitor FSA announcements and prepare reformulation strategies for high-HFSS products.', category: 'regulatory', limit: 'UK 정책 확정 대기', lawRef: 'UK FSA / DHSC — FOPL Review 2024', lawUrl: 'https://www.food.gov.uk/', notes: 'UK FSA FOPL 도입 검토 중(2024~2026). 의무화 시 고당·고지방·고염 제품 경고 표시 필수. 캐나다 FOPL과 별개 기준.' } as any,
      { name: 'Melatonin', nameLocal: 'Melatonin', regulated: true, function: '수면 유도 촉진 · 일주기 리듬(생체시계) 조절 · 시차 증후군(Jet Lag) 완화 (UK에서는 식품으로 판매 불가)', functionLocal: 'Promotes sleep onset; regulates circadian rhythm (body clock); reduces effects of jet lag — note: cannot be sold as food or supplement in the UK (Prescription Only Medicine)', limit: '식품으로 판매 불가', lawRef: 'UK MHRA — Prescription Only Medicine', lawUrl: 'https://www.food.gov.uk/', notes: '캐나다(NPN 허용), 미국(보충제 허용)과 달리 UK에서 멜라토닌은 처방전 의약품. 식품·보충제로 UK 판매 불가.' } as any,
      { name: 'Melatonin — UK 규제 현황', nameLocal: 'Melatonin — UK POM Classification', function: '🚫 UK 처방전 의약품(POM) 분류 — 식품·보충제로 판매 절대 불가 (캐나다·미국 허용 대비 주요 차이)', functionLocal: '🚫 Classified as Prescription Only Medicine (POM) by UK MHRA — cannot be legally sold as a food product or dietary supplement in the UK; contrasts with Canada (NHP/NPN permitted) and USA (OTC dietary supplement); violators subject to enforcement action', category: 'regulatory', limit: '식품 판매 불가', lawRef: 'UK MHRA — Prescription Only Medicine', lawUrl: 'https://www.food.gov.uk/', notes: '해외 수출 제품과 UK 판매 제품 포뮬레이션 분리 필수. UK 온라인 판매도 규제 대상.' } as any,
    ],
  },
  {
    code: 'CH', flag: '🇨🇭', label: 'Switzerland (FSVO/FSAS)',
    systemName: 'Bio Suisse 유기농 인증 + ZuV 첨가물 + MRA EU 상호인정 제도 (LMG 기반)',
    systemDesc: '스위스는 EU 회원국이 아니지만 EU와 식품 분야 MRA(상호인정협정) 체결 — EU 허가 성분 대부분 인정. ⚠️ 독자 운영: ZuV 첨가물 목록, VPRÜ 잔류농약 기준, Milchverordnung 유제품 기준. 🌱 유기농: Bio Suisse 인증이 스위스 시장 사실상 필수 — EU 유기농 인증(EU Organic)과 별개. 라벨: 독어·불어·이탈리아어 중 최소 1개 필수.',
    rows: [
      { name: 'E171 (Titanium Dioxide)', nameLocal: 'Titandioxid (E171)', regulated: true, function: '식품 백색화·불투명화 기능 (백색 착색제/안료) — 제과·껌·소스 등 식품 외관 개선', functionLocal: 'Food whitening and opacifying function (white colourant/pigment) — improves visual appearance in confectionery, chewing gum, sauces and other food products', limit: 'FSVO 최신 결정 확인 필수', lawRef: 'ZuV — Verordnung über Zusatzstoffe', lawUrl: 'https://www.blv.admin.ch/', notes: 'EU 금지(2022.02) 이후 스위스 FSVO 독자 검토 중. MRA로 EU 금지가 자동 적용되지 않을 수 있음 — FSVO 최신 결정 확인 필수.' } as any,
      { name: 'E171 — 스위스 FSVO 검토 현황', nameLocal: 'E171 (Titandioxid) — Swiss FSVO Review Status', function: '⚠️ 스위스 독자 검토 중 — EU 금지(2022.02) MRA 자동 적용 불확실, FSVO 최신 결정 확인 필수', functionLocal: '⚠️ Under independent Swiss FSVO review — EU ban (Commission Regulation EU 2022/63) does not automatically apply in Switzerland via EU-Swiss MRA; verify current FSVO decision before including E171 in CH-destined products', category: 'regulatory', limit: 'FSVO 결정 확인 필수', lawRef: 'ZuV — Verordnung über Zusatzstoffe', lawUrl: 'https://www.blv.admin.ch/', notes: 'FSVO 최신 고시 확인 전 E171 함유 CH 수출 제품 제조 중단 검토. EU 병행 수출 시 MRA 자동 적용 불가 — 스위스 전용 확인 필수.' } as any,
      { name: 'Allulose', nameLocal: 'Allulose', regulated: true, function: '극저칼로리 감미료 (약 0.4 kcal/g, 설탕 대비 70% 감미도) · 혈당·인슐린 반응 최소화 · 식후 혈당 스파이크 억제 · 당류 대체 기능', functionLocal: 'Ultra-low calorie sweetener (~0.4 kcal/g, ~70% sweetness of sucrose); minimal glycaemic and insulinaemic response; helps suppress postprandial blood glucose spikes; sugar replacement function', limit: 'VNL Novel Food Ordinance 검토', lawRef: 'Verordnung über neuartige Lebensmittel (VNL)', lawUrl: 'https://www.blv.admin.ch/', notes: 'EU Novel Food 허가 취득 시 MRA를 통해 스위스 인정 가능. 단, MRA 자동 적용 여부 FSVO 사전 확인 필수.' } as any,
      { name: 'Allulose — 스위스 허가 현황', nameLocal: 'Allulose — Swiss Novel Food Status', function: '⚠️ 스위스 Novel Food (VNL) — EU MRA 자동 적용 불확실, FSVO 사전 확인 필수', functionLocal: '⚠️ Classified as Novel Food under Swiss Verordnung über neuartige Lebensmittel (VNL) — EU Novel Food approval may be recognised via EU-Swiss MRA, but automatic application is not guaranteed; prior confirmation from FSVO (Bundesamt für Lebensmittelsicherheit) required', category: 'regulatory', limit: 'FSVO 확인 후 사용 가능', lawRef: 'Verordnung über neuartige Lebensmittel (VNL)', lawUrl: 'https://www.blv.admin.ch/', notes: 'EU Novel Food 허가와 병행하여 FSVO MRA 인정 여부 확인. 불확실 시 알룰로스 대체 감미료(스테비아, 에리스리톨) 우선 적용 권장.' } as any,
      { name: 'Bio Suisse 유기농 인증', nameLocal: 'Bio Suisse Zertifizierung', function: '🌱 스위스 시장 유기농 표기 사실상 필수 인증', functionLocal: '🌱 Bio Suisse certification is the de facto mandatory organic label in the Swiss market — EU Organic certification alone does NOT permit use of the "Bio" label in Switzerland; a separate Bio Suisse Richtlinien (guidelines) certification must be obtained independently; manufacturers targeting Swiss organic product positioning must apply to Bio Suisse directly.', category: 'regulatory', limit: 'Bio Suisse 기준 준수', lawRef: 'Bio Suisse Richtlinien / LMG Art. 12', lawUrl: 'https://www.bio-suisse.ch/', notes: 'EU 유기농 인증(EU Organic)과 별개 — EU 유기농 인증만으로 스위스에서 "Bio" 표기 불가. Bio Suisse 별도 취득 필요.' } as any,
      { name: 'Omega-3 (EPA/DHA)', nameLocal: 'Omega-3 (EPA/DHA)', function: '심혈관 건강 유지 · 혈중 중성지방 조절 · 뇌 기능 지원 (EU MRA 기반 인정, 건강 클레임 EU Health Claims Register 준수)', functionLocal: 'Supports cardiovascular health; helps maintain normal blood triglyceride levels; supports brain function (accepted via EU-Swiss MRA; health claims based on EU Health Claims Register)', limit: '영양강화 기준 적용', lawRef: 'ZuV / LMG + EU MRA', lawUrl: 'https://www.blv.admin.ch/', notes: 'EU 허가 기준 MRA로 일반적 인정. 건강 클레임은 EU Health Claims Register 기반 스위스 인정 목록 확인.' } as any,
      { name: 'Melatonin', nameLocal: 'Melatonin', regulated: true, function: '수면 유도 촉진 · 일주기 리듬(생체시계) 조절 · 시차 증후군(Jet Lag) 완화', functionLocal: 'Promotes sleep onset; regulates circadian rhythm (body clock); reduces effects of jet lag', limit: '식품 분류 가능 여부 확인', lawRef: 'LMG / Swissmedic — Borderline Product', lawUrl: 'https://www.blv.admin.ch/', notes: '저용량 멜라토닌 식품 분류 가능 여부 Swissmedic 사전 확인 필요. 영국과 달리 일부 저용량 허용 가능성 있음.' } as any,
      { name: 'Melatonin — 스위스 규제 현황', nameLocal: 'Melatonin — Swiss Swissmedic Borderline Status', function: '⚠️ Swissmedic 경계 제품 검토 — 저용량 식품 분류 가능성 있으나 사전 확인 필수 (UK POM과 달리 일부 허용 가능)', functionLocal: '⚠️ Swiss Swissmedic borderline product review — low-dose melatonin may potentially be classified as food under Swiss LMG, but prior classification confirmation from Swissmedic (Schweizerisches Heilmittelinstitut) is mandatory; unlike UK (POM classification), Switzerland may permit some low-dose formulations', category: 'regulatory', limit: 'Swissmedic 사전 확인', lawRef: 'LMG / Swissmedic — Borderline Product', lawUrl: 'https://www.blv.admin.ch/', notes: 'Swissmedic 분류 확인 전 판매 금지. 저용량(0.5mg 이하) 허용 가능성 있으나 공식 확인 필수.' } as any,
      { name: 'Stevia Extract', nameLocal: 'Stevia-Extrakt', function: '칼로리 제로 천연 감미료 · 혈당 영향 없는 당류 대체 기능 (EU MRA를 통해 스위스 인정, Bio Suisse 인증 원료 권장)', functionLocal: 'Zero-calorie natural sweetener; replaces sugar without glycaemic impact (high-purity steviol glycosides accepted via EU MRA; Bio Suisse certified stevia recommended for organic products)', limit: 'ZuV 기준', lawRef: 'ZuV + EU MRA', lawUrl: 'https://www.blv.admin.ch/', notes: 'EU 허가 스테비올 배당체 기준 스위스 MRA로 인정. 유기농 스테비아는 Bio Suisse 인증 원료 사용 권장.' } as any,
      { name: 'National Language Labelling', nameLocal: 'Landessprachen-Kennzeichnung', function: '🚨 의무 — 독어/불어/이탈리아어 중 최소 1개', functionLocal: '🚨 Mandatory — at least one Swiss national language (German/Deutsch, French/Français, or Italian/Italiano) is required on all food labels sold in Switzerland; English-only labelling is not accepted; including all four national languages (adding Romansh) is advantageous for nationwide distribution and avoids region-specific reprinting.', category: 'regulatory', limit: '위반 시 판매 금지', lawRef: 'LMG / Verordnung über die Kennzeichnung von Lebensmitteln (LKV)', lawUrl: 'https://www.blv.admin.ch/', notes: '영어 단독 표기 불인정. 독어(Deutsch)·불어(Français)·이탈리아어(Italiano) 중 1개 이상 의무. 4개 지역 동시 표기 시 유리.' } as any,
    ],
  },
];

// ── EU Packaging & Sustainability Regulations ──────────────────────────────
const EU_PACKAGING_REGS = {
  ppwr: {
    title: 'PPWR — Packaging and Packaging Waste Regulation',
    regulation: '(EU) 2025/40',
    enforcedDate: '2025.02.11',
    applicationDate: '2026.08.11',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040',
    keyMilestones: [
      { date: '2026.07.20', desc: '🚨 BPA(비스페놀A) 식품접촉자재 사용 전면 금지 시행 — Reg. (EU) 2023/2468', urgency: 'critical' },
      { date: '2026.08.11', desc: '전면 적용 — PPWR 발효 18개월 후 의무 시행', urgency: 'high' },
      { date: '2026.09.17', desc: '플라스틱 FCM 개정: NIAS(비의도첨가물질) 리스크 분석 및 TTC 독성평가 의무화', urgency: 'high' },
      { date: '2027.02.12', desc: 'HORECA(호텔·식당·카페): 소비자 개인용기 지참 시스템 구비 의무화', urgency: 'medium' },
      { date: '2028.08.01', desc: 'EU 공통 재활용·재사용 라벨 및 QR코드 표시 전면 의무화', urgency: 'medium' },
      { date: '2030.01', desc: '포장재 재활용 가능성 등급 A·B만 허용 (C·D 퇴출)', urgency: 'medium' },
      { date: '2030.01', desc: '플라스틱 재활용 원료(Recycled Content) 최소 비율 의무화', urgency: 'medium' },
      { date: '2030.01', desc: '재사용(Reuse) 목표 달성 의무 — 부문별 적용', urgency: 'medium' },
    ],
    recyclabilityGrades: [
      { grade: 'A', color: '#16a34a', desc: '재활용 용이 — 96% 이상 수거·분리·재처리 가능', status: '2030년부터 필수' },
      { grade: 'B', color: '#2563eb', desc: '재활용 가능 — 표준 조건 하 재처리 가능', status: '2030년부터 허용' },
      { grade: 'C', color: '#f59e0b', desc: '재활용 제한적 — 2030년 이후 단계적 퇴출 대상', status: '단계적 퇴출' },
      { grade: 'D', color: '#dc2626', desc: '재활용 불가 — 2030년 이후 EU 시장 진입 금지', status: '금지' },
    ],
    recycledContentTargets: [
      { material: '플라스틱 음료 페트병 (≥1L)', target2030: '25%', target2040: '50%', note: '별도 수집 흐름 대상' },
      { material: '기타 플라스틱 식품 포장', target2030: '10%', target2040: '25%', note: '일반 포장류' },
      { material: '유리 포장', target2030: '—', target2040: '—', note: '별도 목표 없음' },
      { material: '금속 포장 (알루미늄 캔 등)', target2030: '—', target2040: '—', note: '별도 목표 없음' },
    ],
    labelingRequirements: [
      { req: 'QR코드 / 디지털 여권 부착', detail: 'Digital Product Passport — 포장 소재·재활용 정보 포함' },
      { req: '재활용 분리배출 표시 의무', detail: '소비자 대상 분리배출 지침 인쇄 또는 QR 연계' },
      { req: '보증금 반환 대상 포장(DRS) 표시', detail: '회원국 DRS 운영 시 필수 마킹' },
      { req: '재활용 원료 함량 표시', detail: 'Recycled Content % 표기 의무 (2030년~)' },
      { req: '불필요 포장 최소화 기준 준수 증빙', detail: '과대포장·이중포장 금지 — 부피 비율 기준 초과 시 유통 불가' },
    ],
  },
  pfas: {
    title: 'PFAS — 식품 접촉 종이·판지 규제',
    regulation: '(EU) 2025/40 Art. 5',
    enforcedDate: '2026.08.11',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040',
    summary: '식품 접촉 종이·판지(paper & paperboard) 내 PFAS(과불화합물) 총합 25 ng/g 이하 제한. PPWR (EU) 2025/40 Art. 5에 의거. 코팅지·방수지·기름방지지 전면 적용.',
    restrictedSubstances: [
      { name: 'PFAS 총합 (퍼플루오로알킬·폴리플루오로알킬 물질)', limit: '≤ 25 ng/g', scope: '식품 접촉 종이·판지 전체', status: '시행 중' },
      { name: 'PFOA / PFOS (장쇄 PFAS)', limit: 'ND (불검출)', scope: '모든 식품 접촉재', status: '시행 중' },
    ],
    exportAlert: '한국산 식품 수출 시 종이·판지 포장재 PFAS 시험성적서(25 ng/g 이하) 첨부 권고. 코팅지·방수지·기름방지지 생산 공정 원료 재검토 필수.',
    frameworkReg: '(EC) 1935/2004 — 식품 접촉재 프레임워크 (FCM Framework)',
  },
  bpa: {
    title: 'BPA FCM — 비스페놀A 식품접촉자재 전면 금지',
    regulation: '(EU) 2023/2468',
    enforcedDate: '2026.07.20',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2468',
    summary: '플라스틱 식품 접촉재 규정(EU No 10/2011) 개정으로 BPA(비스페놀A) 이행 한도를 0.05 mg/kg → 0.05 μg/kg(1,000배 강화)으로 낮춰 사실상 전면 금지. 플라스틱 포장재·캔 라이닝·라커·에폭시 코팅 등 모든 식품 접촉재에 적용. 2026.07.20부터 BPA 함유 재질로 만든 FCM의 EU 시장 출시 불가.',
    restrictedSubstances: [
      { name: 'BPA (Bisphenol A, 비스페놀A)', limit: 'SML ≤ 0.05 μg/kg food (사실상 불검출)', scope: '플라스틱 FCM (EU 10/2011 Annex I)', status: '2026.07.20 시행' },
      { name: 'BPS / BPF (대체 비스페놀류)', limit: '별도 평가 진행 중', scope: '모든 FCM', status: '규제 예고 단계' },
      { name: 'BPA — 캔·금속 코팅·라커', limit: '후속 규정 대기 (2025/40 위임규정)', scope: '금속 FCM', status: '입법 예고' },
      { name: '수정보완 (EU) 2026/250 — 전환기간 명확화', limit: '일회용 FCM: 2026.07.20 / 반복사용(과일·채소): 2028.01.20 / 전문 생산용: 2029.01.20', scope: '(EU) 2024/3190 BPA 규정 정정', status: '2026.02.23 발효' },
    ],
    exportAlert: '폴리카보네이트 용기·캔 내부 에폭시 코팅·PVC 가스켓 등 BPA 함유 소재 전면 재검토 필수. 대체재: rPET·PP·유리·스테인리스. 한국 수출업체는 FCM DoC(적합성 선언서)에 BPA 불사용 명시 및 이행시험(migration test) 성적서 필수 첨부. (EU) 2026/250 수정으로 전환기간 확정: 일회용 FCM ≤2026.07.20, 반복사용 FCM(과일·채소 포장) ≤2028.01.20.',
    frameworkReg: '(EU) No 10/2011 — 플라스틱 식품 접촉재 및 용품 규정',
  },
  sup: {
    title: 'SUP — 일회용 플라스틱 지침',
    regulation: '(EU) 2019/904',
    enforcedDate: '2021.07.03',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0904',
    bannedItems: [
      { item: '플라스틱 면봉·귀이개', note: '대나무·종이 대체 가능' },
      { item: '플라스틱 포크·나이프·스푼·젓가락·빨대', note: '목재·종이·CPLA 대체 가능' },
      { item: '플라스틱 풍선 스틱·음료 교반봉', note: '대체재 없음 → 제품 재설계' },
      { item: '발포 폴리스티렌(EPS) 식품 용기 및 컵', note: 'PP·PLA·종이 용기로 대체' },
      { item: '생분해 주장 일회용 용기 (SUP 정의 해당 시)', note: '단순 생분해 인증만으로 SUP 규제 면제 불가' },
    ],
    labelingRequired: [
      '음료컵 (플라스틱 함유) — 플라스틱 소재 표시 의무',
      '음료 용기 (플라스틱 라벨 부착) — 분리배출 방법 표시',
      '습식 물티슈 — "플라스틱 함유" 표시',
    ],
    exportAlert: '식품용 일회용 플라스틱 수저·젓가락 세트, 발포PS 도시락·컵 EU 납품 전면 불가. 포장 소재 변경 및 SUP 규정 적합성 확인 필수.',
  },
  plastic_fcm_2025: {
    title: 'Plastic FCM — 플라스틱 식품접촉재 전면 개정',
    regulation: '(EU) 2025/351',
    enforcedDate: '2025.03.16',
    applicationDate: '2026.09.16',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0351',
    summary: 'EU 플라스틱 식품접촉재 규정(EU No 10/2011) 전면 개정 — NIAS(비의도적 첨가물질) 위해평가 의무화 및 다회사용 플라스틱 용기 라벨링 요건 신설. 2026.09.16부터 의무 적용.',
    frameworkReg: '(EU) No 10/2011 — 플라스틱 식품 접촉재 및 용품 규정',
    restrictedSubstances: [
      { name: 'NIAS (비의도적 첨가물질)', limit: '위해평가 완료 후 사용', scope: '플라스틱 FCM 전체', status: '2026.09.16 의무' },
      { name: '다회사용 플라스틱 라벨링', limit: '재질·세척방법·반복횟수 표시 의무 (Art. 14a)', scope: '반복사용 플라스틱 용기', status: '2026.09.16 의무' },
      { name: 'OML (총 이행량)', limit: '10 mg/dm² 유지', scope: 'EU 10/2011 Annex I 전체', status: '기존 유지' },
    ],
    exportAlert: '플라스틱 식품 포장재 수출 시 NIAS 위해평가서 구비 필수(2026.09.16~). 다회사용 플라스틱 용기·컨테이너는 Art. 14a 라벨링(재질·세척지침·반복사용 횟수) 부착 의무. EU 수출업체는 DoC(적합성 선언서) 업데이트 필요.',
  },
  fcm_substances_2026: {
    title: 'FCM 허용물질 개정 — 플라스틱 Positive List 갱신',
    regulation: '(EU) 2026/245',
    enforcedDate: '2026.02.23',
    applicationDate: '2026.02.23',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202600245',
    summary: 'EU 10/2011 플라스틱 FCM 허용물질 Positive List 개정 — 신규 6종 물질 허용, 영유아 식품 접촉 제품에 신규 허용 물질 적용 전면 금지.',
    frameworkReg: '(EU) No 10/2011 — 플라스틱 식품 접촉재 및 용품 규정',
    restrictedSubstances: [
      { name: '신규 허용 6종 물질', limit: '각 SML·용도 조건 준수', scope: '플라스틱 FCM Annex I 갱신', status: '2026.02.23 즉시 적용' },
      { name: '영유아 접촉 제품', limit: '신규 허용 6종 적용 금지', scope: '영유아 식품접촉 용기·기구', status: '명시 금지' },
    ],
    exportAlert: '신규 허용 6종 물질 사용 시 DoC(적합성 선언서) 업데이트 필수. 영유아용 플라스틱 포장재에는 신규 허용 물질 사용 불가. EU 10/2011 Positive List 최신 버전(2026.02.23 이후) 기준 적합성 확인 필요.',
  },
  efsa_food_additive: {
    title: 'EFSA 식품첨가물 가이드라인 개정 — 신청 데이터 요건 강화',
    regulation: '(EC) 1333/2008 개정 가이던스',
    enforcedDate: '2026.07.20',
    applicationDate: '2026.07.20',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333',
    summary: '2026.07.20부터 EU 신규 식품첨가물 신청 시 개정된 데이터 요건 의무 적용 — 물질 특성(characterisation), 제조공정, 노출평가, 독성시험, 환경안전성 자료 보강 필요. Reg. (EC) 1333/2008 기반 EFSA 가이던스 개정.',
    restrictedSubstances: [
      { name: '물질 특성 자료 (Characterisation)', limit: '순도·불순물 프로파일 전체 제출', scope: '신규 첨가물 신청 전체', status: '2026.07.20 의무' },
      { name: '노출평가 (Exposure Assessment)', limit: 'FAIM 모델 기반 전 연령군 산출', scope: '신규 첨가물 신청 전체', status: '2026.07.20 의무' },
      { name: '독성시험 자료', limit: 'OECD 최신 테스트 가이드라인 기준', scope: '신규 첨가물 신청 전체', status: '2026.07.20 의무' },
    ],
    exportAlert: '한국 식품첨가물 제조사가 EU 신규 승인 신청을 준비 중이라면 2026.07.20 이후 접수분부터 개정 데이터 패키지(특성·노출·독성·환경안전) 준비 필수. 기존 승인 물질 재평가에는 소급 적용되지 않음.',
    frameworkReg: '(EC) 1333/2008 — 식품첨가물 규정',
  },
  third_country_import_2026: {
    title: '제3국 식품 수입통제 강화 — 위험기반 국경통제 목록 개정',
    regulation: '(EU) 2026/1206',
    enforcedDate: '2026.06.30',
    applicationDate: '2026.06.30',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1206',
    summary: '(EU) 2019/1793 Annex I·II 갱신 — 곰팡이독소·살충제 잔류·미생물 오염 위험 기반 제3국 수입식품 국경통제 대상 품목 목록 전면 교체. 2026.06.10 공보, 2026.06.30 발효.',
    restrictedSubstances: [
      { name: 'Annex I — 강화 공식 통제 대상', limit: '입항 시 서류·신원·물리적 검사 비율 상향', scope: '대상국 지정 품목 (곰팡이독소·잔류농약·미생물)', status: '2026.06.30 시행' },
      { name: 'Annex II — 긴급 조치 대상', limit: '수입 전 시험성적서 사전 제출 의무', scope: '특정 국가·품목 한정', status: '2026.06.30 시행' },
    ],
    exportAlert: '한국산 식품이 Annex I·II 목록에 포함될 경우 입항 시 검사 비율·서류 요건이 상향됨. 매 개정 시 최신 Annex 목록에서 한국 지정 품목 포함 여부 확인 필수.',
    frameworkReg: '(EU) 2019/1793 — 위험기반 수입식품 강화 공식통제 규정',
  },
  efsa_dioxins: {
    title: 'EFSA 다이옥신·PCB 식이노출 과학적 의견서 (⚠️ 규정 아님)',
    regulation: 'EFSA Scientific Opinion',
    enforcedDate: '2026.06.17',
    url: 'https://www.efsa.europa.eu',
    summary: '식이를 통한 다이옥신·다이옥신유사 PCB 노출이 유럽인 건강에 여전히 우려 수준이라는 EFSA 과학적 의견서 채택(2026.06.17). 아직 법적 구속력 있는 규정은 아니며, 향후 EU 오염물질 최대기준치(MRL) 재검토의 입력 자료로 활용될 예정.',
    restrictedSubstances: [
      { name: '다이옥신 · 다이옥신유사 PCB', limit: '현행 (EU) 2023/915 기준 유지 (재검토 예정)', scope: '식이 전반 (생선·유지방·육류 등)', status: '⚠️ 의견서 단계 — 규정 아님' },
    ],
    exportAlert: '현재 즉시 시행되는 법적 의무는 없음. 다만 향후 (EU) 2023/915 오염물질 최대기준치 개정 시 다이옥신·PCB 기준이 강화될 가능성이 있어 모니터링 권장.',
    frameworkReg: '(EU) 2023/915 — 식품 내 오염물질 최대기준치 규정',
  },
  novel_food_2026: {
    title: 'Novel Food 신규 승인 — 이눌린-프로피오네이트 에스터',
    regulation: '(EU) 2026/1219',
    enforcedDate: '2026.06.09',
    applicationDate: '2026.06.09',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1219',
    summary: 'Commission Implementing Regulation (EU) 2026/1219 — (EU) 2017/2470 개정, 이눌린-프로피오네이트 에스터(Inulin-Propionate Ester)를 시리얼바·과일스무디용 신규 Novel Food로 승인. Imperial College Hammersmith Campus에 5년간 단독 시판권(data protection) 부여.',
    restrictedSubstances: [
      { name: '이눌린-프로피오네이트 에스터', limit: '승인 용도·사용량 범위 내', scope: '시리얼바, 과일스무디', status: '2026.06.09 승인' },
      { name: '데이터 독점권 (Data Protection)', limit: '신청자 외 사용 불가 — 5년', scope: '승인 신청 기업 한정', status: '2031년까지 독점' },
    ],
    exportAlert: '해당 물질을 시리얼바·스무디 등에 사용하려는 제3자는 2031년까지 별도 독자 데이터로 재신청하거나 Imperial College 라이선스가 필요. 무단 사용 시 Novel Food 무허가 판매로 EU 시장 진입 불가.',
    frameworkReg: '(EU) 2017/2470 — Novel Food 승인 목록 규정',
  },
  documents: [
    // ── PPWR (EU) 2025/40 ──
    { group: 'PPWR', groupColor: 'blue', doc: '포장재 재활용 등급 적합성 평가서', docEn: 'Recyclability Assessment Report', basis: 'Art. 6, 22', by: '제조사/수입업자', required: '의무', timing: 'DA 발효 후', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    { group: 'PPWR', groupColor: 'blue', doc: '디지털 포장 여권 (DPP) 등록', docEn: 'Digital Product Passport Registration', basis: 'Art. 12', by: '제조사', required: '의무', timing: '2026.08~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    { group: 'PPWR', groupColor: 'blue', doc: '재활용 원료 함량 선언서', docEn: 'Recycled Content Declaration', basis: 'Art. 7', by: '제조사/공급업자', required: '의무', timing: '2030.01~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    { group: 'PPWR', groupColor: 'blue', doc: 'EPR 등록 확인서', docEn: 'Extended Producer Responsibility Registration', basis: 'Art. 45~', by: '생산자/수입자', required: '의무', timing: '2026.08~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    { group: 'PPWR', groupColor: 'blue', doc: '포장 최소화 준수 선언서', docEn: 'Packaging Minimisation Compliance Statement', basis: 'Art. 9', by: '제조사', required: '의무', timing: '2026.08~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    // ── PFAS FCM ──
    { group: 'PFAS FCM', groupColor: 'rose', doc: '식품 접촉재 적합성 선언서 (DoC)', docEn: 'Declaration of Compliance', basis: '1935/2004 Art. 16', by: '제조사 (전 공급망)', required: '의무', timing: '상시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R1935' },
    { group: 'PFAS FCM', groupColor: 'rose', doc: 'PFAS 분석 시험성적서', docEn: 'PFAS Analytical Test Report', basis: '(EU) 2025/40 Art. 5', by: '공인 검사기관', required: '의무', timing: '상시 (≤25 ng/g)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040' },
    { group: 'PFAS FCM', groupColor: 'rose', doc: '기술 문서 (Technical Dossier)', docEn: 'Technical Dossier', basis: '1935/2004 Art. 16(3)', by: '제조사', required: '의무', timing: '상시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R1935' },
    { group: 'PFAS FCM', groupColor: 'rose', doc: '추적성 기록 (Traceability Records)', docEn: 'Traceability Records', basis: '1935/2004 Art. 17', by: '전체 공급망', required: '의무', timing: '상시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R1935' },
    // ── BPA FCM (EU) 2023/2468 ──
    { group: 'BPA FCM', groupColor: 'purple', doc: 'BPA 이행시험 성적서', docEn: 'BPA Migration Test Report', basis: '(EU) 2023/2468 + 10/2011', by: '공인 검사기관 (EN 13130-13)', required: '의무', timing: '2026.07.20 이전', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2468' },
    { group: 'BPA FCM', groupColor: 'purple', doc: 'BPA 불사용 적합성 선언서 (DoC)', docEn: 'BPA-Free Declaration of Compliance', basis: '1935/2004 Art. 16 + 10/2011', by: '제조사 (전 공급망)', required: '의무', timing: '2026.07.20~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R1935' },
    { group: 'BPA FCM', groupColor: 'purple', doc: '대체 소재 적합성 확인서', docEn: 'Alternative Material Compliance Confirmation', basis: '10/2011 Annex I', by: '제조사/공급업자', required: '권장', timing: '소재 전환 시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R0010' },
    // ── SUP (EU) 2019/904 ──
    { group: 'SUP', groupColor: 'amber', doc: '소재 선언서', docEn: 'Material Declaration', basis: 'Art. 5', by: '제조사', required: '의무', timing: '상시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0904' },
    { group: 'SUP', groupColor: 'amber', doc: '라벨링 준수 증빙', docEn: 'Labeling Compliance Evidence', basis: 'Art. 7', by: '제조사/수입자', required: '해당 시', timing: '의무 표시 품목만', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0904' },
    { group: 'SUP', groupColor: 'amber', doc: 'EPR 등록 확인서 (SUP)', docEn: 'SUP EPR Registration', basis: 'Art. 8', by: '생산자/수입자', required: '의무', timing: '상시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0904' },
    // ── Plastic FCM (EU) 2025/351 ──
    { group: 'Plastic FCM 2025', groupColor: 'emerald', doc: 'NIAS 위해평가서', docEn: 'Non-Intentionally Added Substances (NIAS) Risk Assessment', basis: 'Art. 3, (EU) 2025/351', by: '제조사/공급업자', required: '의무', timing: '2026.09.16~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0351' },
    { group: 'Plastic FCM 2025', groupColor: 'emerald', doc: '다회사용 플라스틱 라벨링 확인서', docEn: 'Repeated Use Plastic Labelling Compliance (Art. 14a)', basis: 'Art. 14a, (EU) 2025/351', by: '제조사', required: '의무', timing: '2026.09.16~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0351' },
    // ── FCM Substances (EU) 2026/245 ──
    { group: 'FCM 2026/245', groupColor: 'teal', doc: '신규 허용물질 적합성 선언서', docEn: 'New Authorised Substance Declaration of Compliance', basis: '(EU) 2026/245 Annex I', by: '제조사 (전 공급망)', required: '의무', timing: '2026.02.23~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202600245' },
    { group: 'FCM 2026/245', groupColor: 'teal', doc: '영유아 접촉 금지 확인서', docEn: 'Infant/Young Child Food Contact Prohibition Confirmation', basis: '(EU) 2026/245 Art. 명시', by: '제조사', required: '해당 시', timing: '영유아용 FCM 출시 시', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202600245' },
    // ── EFSA 식품첨가물 가이드라인 개정 ──
    { group: 'EFSA 첨가물', groupColor: 'indigo', doc: '물질 특성 자료 (Characterisation Dossier)', docEn: 'Substance Characterisation Dossier', basis: '(EC) 1333/2008 개정 가이던스', by: '신청기업', required: '의무', timing: '2026.07.20~ 신규 신청', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333' },
    { group: 'EFSA 첨가물', groupColor: 'indigo', doc: '노출평가 보고서', docEn: 'Exposure Assessment Report', basis: '(EC) 1333/2008 개정 가이던스', by: '신청기업', required: '의무', timing: '2026.07.20~ 신규 신청', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333' },
    // ── 제3국 수입통제 강화 (EU) 2026/1206 ──
    { group: '수입통제', groupColor: 'orange', doc: '국경통제 사전 시험성적서', docEn: 'Pre-Border Control Test Report', basis: '(EU) 2026/1206 Annex I·II', by: '수출자/수입자', required: '의무', timing: '2026.06.30~', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1206' },
    // ── EFSA 다이옥신·PCB 과학적 의견서 (권장, 규정 아님) ──
    { group: 'EFSA 의견서', groupColor: 'slate', doc: '다이옥신·PCB 자율 모니터링 자료 (권장)', docEn: 'Voluntary Dioxin/PCB Monitoring Data', basis: 'EFSA Scientific Opinion (2026.06.17)', by: '제조사 (권장)', required: '권장', timing: '상시 모니터링 권장', url: 'https://www.efsa.europa.eu' },
    // ── Novel Food (EU) 2026/1219 ──
    { group: 'Novel Food', groupColor: 'lime', doc: 'Novel Food 사용 라이선스/독점권 확인서', docEn: 'Novel Food License / Data Protection Confirmation', basis: '(EU) 2026/1219, (EU) 2017/2470', by: '사용 희망 기업', required: '의무', timing: '2031년까지 (데이터독점 기간)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1219' },
  ],
};

// ── US State-Specific Regulations ─────────────────────────────────────────
const US_STATE_REGS: Record<string, {
  name: string; flag: string; strictLevel: string; dotColor: string;
  prop65?: Array<{ chemical: string; cas: string; route: string; threshold: string; listed: string; warningType: string; relevance: string; relevanceEn: string }>;
  ab418?: Array<{ ingredient: string; cas: string; banDate: string; fdaStatus: string; replacement: string; notes: string; notesEn: string }>;
  ab2316?: Array<{ dye: string; cas: string; color: string; banDate: string; fdaStatus: string; replacement: string; notes: string; notesEn: string }>;
  sodiumRule?: { threshold: string; scope: string; law: string; penalty: string; note: string; noteEn?: string };
  labelingRules: Array<{ rule: string; detail: string; detailEn?: string; date?: string }>;
  strictIngredients: Array<{ ingredient: string; limit: string; law: string; limitEn?: string; enforcementDate?: string }>;
  fsmpMedicaid: string;
}> = {
  CA: {
    name: 'California', flag: '🏴󠁵󠁳󠁣󠁡󠁿', strictLevel: 'Strictest', dotColor: '#7c3aed',
    prop65: [
      { chemical: 'Arsenic (inorganic)', cas: '7440-38-2', route: '경구', threshold: 'NSRL(cancer): 10 μg/day', listed: '1987.02.27', warningType: 'Cancer', relevance: '쌀·쌀 단백질 보충제·해산물·음용수. 쌀 기반 FSMP 특히 주의.', relevanceEn: 'Listed 02/27/1987. NSRL: 10 μg/day. Inorganic arsenic naturally present in soil and water, concentrated in rice and rice-based products. Special concern for rice protein concentrate, seaweed, drinking water-based FSMP formulations.' },
      { chemical: 'Cadmium & Compounds', cas: '7440-43-9', route: '경구', threshold: 'NSRL(cancer): 4.1 μg/day', listed: '1987.10.01', warningType: 'Cancer + Reproductive', relevance: '해바라기씨·코코아·카카오닙·일부 해조류 원료 함유 가능성.', relevanceEn: 'Listed 10/01/1987 (cancer); 01/01/1988 (reproductive). NSRL: 4.1 μg/day. Cadmium naturally accumulates in sunflower seeds, cocoa, cacao nibs, certain seaweeds, and shellfish grown in cadmium-contaminated water or soil.' },
      { chemical: 'Lead', cas: '7439-92-1', route: '경구', threshold: 'MADL: 0.5 μg/day', listed: '1987.10.01', warningType: 'Reproductive', relevance: '식품 포장재·납 유약 도자기·일부 허브 보충제·칼슘 원료 (굴 껍데기 등).', relevanceEn: 'Listed 10/01/1987 (reproductive). MADL: 0.5 μg/day. Found in: lead-glazed ceramics, some calcium supplements (oyster shell, bone meal, dolomite), certain herbal supplements, and food packaging materials with lead-based inks or coatings.' },
      { chemical: 'Acrylamide', cas: '79-06-1', route: '경구 · 흡입', threshold: 'NSRL(cancer): 0.2 μg/day', listed: '1990', warningType: 'Cancer + Reproductive', relevance: '고온 조리(굽기·튀기기) — 감자칩·커피·시리얼·제과류에서 열분해 생성.', relevanceEn: 'Listed 01/01/1990 (cancer); 02/25/2011 (reproductive). Formed via Maillard reaction between asparagine and reducing sugars at temperatures >120°C. High-risk foods: potato chips, french fries, coffee, breakfast cereals, baked goods. NSRL: 0.2 μg/day; MADL: 140 μg/day.' },
      { chemical: 'Furan', cas: '110-00-9', route: '경구', threshold: 'NSRL: 1 μg/day', listed: '2008', warningType: 'Cancer', relevance: '가열 처리 통조림·커피·이유식에서 열분해 부산물로 생성.', relevanceEn: 'Listed 01/01/2008. NSRL: 1 μg/day. Furan is a thermal degradation byproduct formed when foods are heat-processed in sealed containers. Highest levels found in: canned/jarred food, coffee (brewed and roasted), baby food (jars). Dissipates rapidly when containers are opened.' },
      { chemical: 'Titanium Dioxide (TiO₂)', cas: '13463-67-7', route: '흡입 경로', threshold: '흡입 NSRL: 0.1 μg/day', listed: '2022.10.25', warningType: 'Cancer', relevance: '식품 첨가물 E171 — 분말 공정 중 흡입 노출 경로. 식품 내 경구 노출은 별도 평가 중.', relevanceEn: 'Listed 10/25/2022. Airborne, unbound particles of respirable size. Inhalation route only — NSRL 0.1 μg/day. Oral route in food use under separate OEHHA evaluation. Relevant to E171 (food-grade TiO₂) powder handling during manufacturing.' },
    ],
    ab418: [
      { ingredient: 'Red Dye No. 3 (FD&C Red 3 / Erythrosine)', cas: '16423-68-0', banDate: '2027-01-01', fdaStatus: '🔴 FDA 전국 금지 (2025.01)', replacement: '비트 추출물, 파프리카 올레오레진, 카민(코치닐)', notes: 'FDA도 2025년 1월 전국 금지 선행. CA AB 418은 주 독자 집행 근거 확보 — 미국 내 모든 판매 불가.', notesEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale in commerce any food product in this state that contains erythrosine (FD&C Red No. 3)." — Note: FDA separately revoked authorization under the Delaney Clause (Jan 15, 2025), creating a nationwide ban that supersedes the CA-only deadline.' },
      { ingredient: 'Brominated Vegetable Oil (BVO)', cas: '8016-94-2', banDate: '2027-01-01', fdaStatus: '🔴 FDA 전국 금지 (2024.07)', replacement: 'SAIB(수크로스 아세테이트 이소부티레이트), 목재 로진 글리세롤 에스터', notes: 'FDA도 2024년 7월 전국 금지. 과일향 음료 혼탁제 용도 — 이미 대체 원료 전환 완료 필요.', notesEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains brominated vegetable oil." — Note: FDA revoked GRAS status for BVO effective August 2, 2024 (21 CFR §172.105 removed), creating a nationwide prohibition on all BVO in food.' },
      { ingredient: 'Potassium Bromate', cas: '7758-01-2', banDate: '2027-01-01', fdaStatus: '⚠️ FDA 미금지 (GRAS 유지)', replacement: '아스코르빈산(비타민 C), 효소 처리(Amylase/Protease)', notes: '⚠️ FDA는 여전히 GRAS — 그러나 CA 수출 시 사용 금지. EU·UK·CN·VN·TH도 금지 → 글로벌 표준 대비 필요.', notesEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains potassium bromate." — Note: At the federal level, FDA continues to permit potassium bromate as a flour-maturing agent under 21 CFR §137.105. CA prohibition is state-specific. Also banned in EU, UK, China, Vietnam, Thailand.' },
      { ingredient: 'Propyl Paraben', cas: '94-13-3', banDate: '2027-01-01', fdaStatus: '⚠️ FDA 미금지 (GRAS 유지)', replacement: '로즈마리 추출물(카르노신산), 혼합 토코페롤', notes: '내분비계 교란 우려 — 제과·음료 방부제 용도. EU 식품 이미 제한 적용 중.', notesEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains propylparaben." — Endocrine disruption concerns based on National Toxicology Program (NTP) study findings. EU Regulation (EC) No 1333/2008 already restricts propyl paraben in food products.' },
    ],
    ab2316: [
      { dye: 'Red 40 (Allura Red / FD&C Red 40)', cas: '25956-17-6', color: '#dc2626', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용 (전국 사용 가능)', replacement: '비트 주스 농축물, 파프리카 올레오레진, 카민(코치닐)', notes: '캘리포니아 공공학교 급식·판매 식품에서 금지. ADHD·과잉행동과의 연관성 연구 근거 (CA EPA 검토). 가정 반입 식품 및 펀드레이저 식품은 적용 제외.', notesEn: 'AB 2316 (2024), CA Ed. Code §49431.9: "…prohibits the sale or provision of any food product that contains FD&C Red No. 40 (Allura Red) to pupils during the school day on public school grounds, beginning January 1, 2028." Rationale: California EPA review of studies linking synthetic dyes to hyperactivity and ADHD in children. FDA-approved at federal level under 21 CFR §74.340.' },
      { dye: 'Yellow 5 (Tartrazine / FD&C Yellow 5)', cas: '1934-21-0', color: '#ca8a04', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용 (아스피린 과민 주의 표시)', replacement: '강황(커큐민), 치자 황색소, 베타카로틴', notes: '아스피린 민감자 알레르기 반응 위험 — FDA 별도 표시 기존 요구. 과자·음료·아이스크림·소스류에 광범위 사용.', notesEn: 'AB 2316 (2024): Prohibits FD&C Yellow No. 5 (Tartrazine) in school food. FDA requires declaration on label due to aspirin sensitivity reactions (21 CFR §74.705). EU Reg. (EC) No 1333/2008 requires warning: "may have an adverse effect on activity and attention in children" for Yellow 5 in food.' },
      { dye: 'Yellow 6 (Sunset Yellow / FD&C Yellow 6)', cas: '2783-94-0', color: '#ea580c', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용', replacement: '파프리카 올레오레진, 베타카로틴, 아나토(Annatto)', notes: '어린이 과잉행동 유발 가능성 — EU에서는 "어린이 활동 및 집중력에 영향 줄 수 있음" 경고 문구 의무. 탄산음료·마카로니·젤리에 사용.', notesEn: 'AB 2316 (2024): Prohibits FD&C Yellow No. 6 (Sunset Yellow FCF) in school food. Approved under 21 CFR §74.706 (FDA). EU Reg. (EC) No 1333/2008 mandates hyperactivity warning label (E110). UK retains EU-derived labeling requirement post-Brexit.' },
      { dye: 'Blue 1 (Brilliant Blue / FD&C Blue 1)', cas: '3844-45-9', color: '#2563eb', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용', replacement: '스피루리나 추출물(Spirulina extract), 인디고 식물 색소', notes: '아이스크림·음료·캔디·케이크류에 광범위 사용. 단백질 정량 분석(Bradford assay) 시약으로도 사용 — 고농도 정맥주사 독성 보고 있으나 식품 용량에서 근거 제한적.', notesEn: 'AB 2316 (2024): Prohibits FD&C Blue No. 1 (Brilliant Blue FCF) in school food. FDA-permitted under 21 CFR §74.101. CA EPA review included Blue 1 based on aggregate concern for children\'s neurodevelopment. Widely used in beverages, candy, ice cream, and baked goods.' },
      { dye: 'Blue 2 (Indigo Carmine / FD&C Blue 2)', cas: '860-22-0', color: '#4338ca', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용', replacement: '스피루리나 추출물, 자주색 고구마 색소', notes: '블루베리 제품류·캔디·시리얼에 사용. 일부 연구에서 혈압 상승 가능성 보고 — 어린이 민감성 고려하여 CA 포함.', notesEn: 'AB 2316 (2024): Prohibits FD&C Blue No. 2 (Indigo Carmine) in school food. FDA-permitted under 21 CFR §74.102. Some animal studies suggest potential blood pressure effects at high doses. Included in AB 2316 based on precautionary approach for children\'s health.' },
      { dye: 'Green 3 (Fast Green / FD&C Green 3)', cas: '2353-45-9', color: '#16a34a', banDate: '2027-12-31', fdaStatus: '🟡 FDA 허용', replacement: '엽록소(Chlorophyllin), 스피루리나, 말차 추출물', notes: '6가지 금지 색소 중 사용 빈도 가장 낮음. 완두콩·아스파라거스 통조림·과자류에 사용. EU에서는 이미 사용 허가 거의 없음.', notesEn: 'AB 2316 (2024): Prohibits FD&C Green No. 3 (Fast Green FCF) in school food. FDA-permitted under 21 CFR §74.203. Least commonly used of the six prohibited dyes. EU does not authorize Fast Green FCF as a food color (not listed in Annex I of Directive 94/36/EC). Lowest usage frequency among the six banned dyes.' },
    ],
    labelingRules: [
      { date: '2027.01.01', rule: 'AB 418 — 4종 성분 판매 금지 (2027.01.01)', detail: 'Red Dye 3 · BVO · Potassium Bromate · Propyl Paraben 함유 식품 CA 내 판매 금지. 위반 시 1차 $5,000 / 반복 $10,000 민사 과징금.', detailEn: 'CA Health & Safety Code §109935 (AB 418, enacted Oct 7 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale in commerce any food product in this state that contains any of the following: (1) brominated vegetable oil, (2) potassium bromate, (3) propylparaben, (4) Red Dye No. 3." Civil penalty: $5,000 for first violation; $10,000 for each subsequent violation.' },
      { date: '2027.12.31', rule: 'AB 2316 — 6종 인공색소 학교 식품 금지 (2027.12.31)', detail: 'Red 40 · Yellow 5 · Yellow 6 · Blue 1 · Blue 2 · Green 3 — 공립학교 급식·판매 식품 전면 금지. 가정 반입 및 펀드레이저 제품 제외.', detailEn: 'CA Ed. Code §49431.9 (AB 2316, enacted Sep 28 2024): "Commencing January 1, 2028, the governing board of a school district … shall not sell or provide any food product that contains any of the following synthetic food dyes: FD&C Red No. 40, FD&C Yellow No. 5, FD&C Yellow No. 6, FD&C Blue No. 1, FD&C Blue No. 2, FD&C Green No. 3 to a pupil during the school day on school grounds." Exemptions: food brought from home, fundraiser food sold off campus.' },
      { date: '2023.01.01', rule: 'CA AB 1200 — PFAS 식물성·퇴비화가능 포장재 금지 (시행 중) ※ SB 682 전면 금지 2025.10 거부권', detail: 'AB 1200(2023.01.01 시행): 식물성·퇴비화가능 식품 포장재의 의도적 PFAS 첨가 금지. 더 광범위한 전면 금지를 시도한 SB 682는 2025.10.13 Newsom 주지사 거부권 행사. 전체 식품 포장 PFAS 금지 입법은 계속 추진 중.', detailEn: 'CA AB 1200 (eff. Jan 1 2023): Prohibits intentionally added PFAS in plant-based/compostable food packaging. SB 682 (broader ban on all food packaging PFAS by 2028) was vetoed by Governor Newsom on Oct 13, 2025. Broader PFAS food packaging legislation is ongoing.' },
      { date: '1987~', rule: 'CA Bottle Bill (CRV)', detail: '음료 용기 보증금 표시 의무 — 24 fl oz 미만: $0.05 / 이상: $0.10. 라벨에 "CA CRV" 또는 "CA Redemption Value" 표시 필수.', detailEn: 'CA Public Resources Code §14560 et seq. (Beverage Container Recycling and Litter Reduction Act): Containers sold in CA must display "CA CRV" or "California Redemption Value." CRV deposit: $0.05 for containers < 24 fl oz; $0.10 for containers ≥ 24 fl oz. Beverages covered: carbonated soft drinks, beer/malt, wine coolers, distilled spirits, fruit drinks ≥10% juice, water, sports/energy drinks.' },
      { date: '1988~', rule: 'Prop 65 경고 문구 의무', detail: '주 표시면 또는 QR code 연결 페이지 허용 (2018 Safe Harbor Warning 형식). OEHHA 공인 문구 외 임의 변경 불가.', detailEn: 'CA Health & Safety Code §25249.6: "No person in the course of doing business shall knowingly and intentionally expose any individual to a chemical known to the state to cause cancer or reproductive toxicity without first giving clear and reasonable warning." — 2018 Safe Harbor Short-Form Warning: "⚠ WARNING: This product can expose you to [chemical name], which is known to the State of California to cause [cancer / birth defects or other reproductive harm]. For more information go to www.P65Warnings.ca.gov." (27 CCR §25603)' },
    ],
    strictIngredients: [
      { enforcementDate: '2027.01.01', ingredient: 'Red Dye No. 3 (FD&C Red 3)', limit: 'CA 내 판매·제조 금지', law: 'CA AB 418 / Health & Safety Code §109935', limitEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale in commerce any food product in this state that contains erythrosine (FD&C Red No. 3)."' },
      { enforcementDate: '2027.01.01', ingredient: 'Potassium Bromate', limit: '판매 금지 (FDA는 GRAS 유지 중)', law: 'CA AB 418 / Health & Safety Code §109935', limitEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains potassium bromate." At the federal level, FDA continues to permit potassium bromate under 21 CFR §137.105.' },
      { enforcementDate: '2027.01.01', ingredient: 'Brominated Vegetable Oil (BVO)', limit: '금지 (FDA도 2024.07 전국 금지)', law: 'CA AB 418 / Health & Safety Code §109935', limitEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains brominated vegetable oil." FDA separately revoked GRAS status effective August 2, 2024 (21 CFR §172.105 removed).' },
      { enforcementDate: '2027.01.01', ingredient: 'Propyl Paraben', limit: '금지 (내분비계 교란)', law: 'CA AB 418 / Health & Safety Code §109935', limitEn: 'CA Health & Safety Code §109935 (AB 418, 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale any food product that contains propylparaben."' },
      { enforcementDate: '2027.12.31', ingredient: 'Red 40 / Yellow 5 / Yellow 6 / Blue 1 / Blue 2 / Green 3', limit: '학교 급식·판매 식품에서 금지', law: 'CA AB 2316 / California Food Safety Act (Schools)', limitEn: 'CA Ed. Code §49431.9 (AB 2316, 2024): "Commencing January 1, 2028, the governing board of a school district … shall not sell or provide any food product that contains any of the following synthetic food dyes: FD&C Red No. 40, FD&C Yellow No. 5, FD&C Yellow No. 6, FD&C Blue No. 1, FD&C Blue No. 2, FD&C Green No. 3 to a pupil during the school day on school grounds." Exemptions: food brought from home, fundraiser food sold off campus.' },
      { enforcementDate: '2022.10.25', ingredient: 'Titanium Dioxide (E171)', limit: 'Prop 65 경고 의무 (흡입 NSRL 0.1 μg/day 기준)', law: 'CA Prop 65 — OEHHA (2022.10.25 등재)', limitEn: 'Listed 10/25/2022. Airborne, unbound particles of respirable size. Inhalation route only — NSRL 0.1 μg/day. Oral route in food use under separate OEHHA evaluation. Relevant to E171 (food-grade TiO₂) powder handling during manufacturing.' },
    ],
    fsmpMedicaid: 'California Medi-Cal: FSMP(경장·비경장 영양제) 급여 시 CA Health & Safety Code §14132.96 적용. Prop 65 화학물질(Pb·As·Cd 등) 함유 제품은 Medi-Cal 급여 제외 검토 대상. AB 418 금지 성분 포함 제품은 2027년부터 CA 내 처방 및 판매 불가.',
  },
  NY: {
    name: 'New York', flag: '🗽', strictLevel: 'High', dotColor: '#dc2626',
    sodiumRule: {
      threshold: '≥ 2,300 mg / 1회 메뉴 아이템',
      scope: '전국 15개소 이상 체인 레스토랑 — 인쇄·전자 메뉴판 및 가격표 전체',
      law: 'NYC Health Code § 81.49 (2015.12.01 시행)',
      penalty: '위반 1건당 $200',
      note: '2025.10.04 NYC 보건부, 첨가당 ≥50g 메뉴에 당류 경고 아이콘(검은 삼각형 내 흰 숟가락) 의무화 시행 — NYC Health Code Ch.39 (Sweet Truth Act). 2026.01부터 미준수 시 위반 건당 $200 벌금 부과. 나트륨 아이콘은 소금통 심볼(🧂) 사용 의무 유지.',
      noteEn: 'NYC Health Code §81.49 (eff. Dec 1 2015): "Any covered establishment that offers for sale a menu item that contains 2,300 milligrams or more of sodium shall post a sodium warning symbol on menus and menu boards in a manner clearly associated with that menu item." Symbol must be an image of a salt shaker. Covered establishments: chain restaurants with ≥15 locations nationally. Penalty: $200 per violation. (Upheld by NYS Court of Appeals, 2016.)'
    },
    labelingRules: [
      { date: '2025.10.04', rule: '첨가당 경고 아이콘 — NYC Health Code Ch.39 (Sweet Truth Act)', detail: 'NYC 보건부, 1회 섭취량 기준 첨가당 ≥50g(일일 권고량 100%) 메뉴 항목에 당류 경고 아이콘(검은 삼각형 내 흰 숟가락 심볼) 표시 의무화. 체인 레스토랑(전국 15개소 이상) 대상. 2025.10.04 교육 기간 시작 → 2026.01부터 위반 시 $200/건 벌금.', detailEn: 'NYC Health Code Ch.39 (Sweet Truth Act, eff. Oct 4 2025): Chain restaurants (≥15 U.S. locations) must display a warning symbol (white spoon inside a black triangle) next to any menu item with ≥50g added sugars per serving. Educational/compliance outreach period: Oct 4, 2025 – Jan 2026. Fines ($200 per violation) began January 2026. Scope includes pre-packaged items sold at chain restaurants with a Nutrition Facts label.' },
      { date: '2008.07.01', rule: 'NYC Trans Fat 규제 (2006~)', detail: 'NYC 음식점 조리유 트랜스지방 0 g 기준 적용. 패키지 식품은 연방 FDA 21 CFR 101.9 기준.', detailEn: 'NYC Health Code §81.08 (eff. Jul 1 2008): "No food service establishment shall store, use, or serve any food that contains artificial trans fat, except for food that is served in a manufacturer\'s original sealed package." Artificial trans fat defined as any partially hydrogenated vegetable shortening or oil with ≥0.5g trans fat per serving. This NYC regulation predated the FDA nationwide ban (2018).' },
      { date: '2015.12.01', rule: 'NYC Health Code §81.49 — 나트륨 경고 아이콘 (2015.12~)', detail: '체인 레스토랑(전국 15곳+) 메뉴에서 나트륨 ≥2,300mg인 항목마다 소금통 경고 아이콘 표시 의무. "이 아이템은 하루 나트륨 권고량(2,300mg)을 초과합니다" 문구 병기. 위반 시 $200/건.', detailEn: 'NYC Health Code §81.49: Chain restaurants (≥15 U.S. locations) must display a salt-shaker warning symbol (🧂) next to any menu item with ≥2,300 mg sodium, accompanied by the statement: "This item contains high levels of sodium. Individuals who are at risk for hypertension, high blood pressure, or other cardiovascular diseases should consider limiting their sodium intake." Civil penalty: $200 per violation.' },
      { date: '시행 중', rule: 'NY Ag & Markets Law §201-a', detail: '원산지 강화 표시 — 중국산 꿀, 수입 해산물 등 원산지 라벨링 요건 연방 기준보다 엄격.', detailEn: 'NY Agriculture & Markets Law §201-a: Requires country-of-origin labeling for honey, seafood, and fresh produce sold at retail. Stricter enforcement than federal COOL (Country of Origin Labeling) under USDA 7 CFR §65. Chinese-origin honey must be explicitly labeled; blended honey must list all countries of origin in descending order of predominance.' },
      { date: '시행 중', rule: 'Caffeine 경고 (에너지 드링크)', detail: '카페인 농도 0.02% 초과 음료 → 경고 문구 의무 표시 (NY Mental Hygiene Law §19.13).', detailEn: 'NY Mental Hygiene Law §19.13: Beverages with caffeine content exceeding 0.02% by weight must bear the warning: "WARNING: This beverage contains caffeine and is not recommended for children, pregnant or nursing women, or persons sensitive to caffeine." Applies to energy drinks and highly caffeinated beverages sold in New York State.' },
    ],
    strictIngredients: [
      { enforcementDate: '2025.10.04', ingredient: '첨가당(Added Sugars) — 레스토랑 메뉴', limit: '1회 ≥50g → 당류 경고 아이콘 (2026.01~ 벌금 $200/건)', law: 'NYC Health Code Ch.39 (Sweet Truth Act)', limitEn: 'NYC Health Code Ch.39 (Sweet Truth Act, eff. Oct 4 2025): Chain restaurants (≥15 U.S. locations) must display a warning symbol (white spoon inside a black triangle) next to any menu item with ≥50g added sugars per serving. Educational/compliance outreach period: Oct 4, 2025 – Jan 2026. Fines ($200 per violation) began January 2026.' },
      { enforcementDate: '2015.12.01', ingredient: '나트륨(Sodium) — 레스토랑 메뉴 항목', limit: '1회 제공량 ≥2,300mg → 경고 아이콘 의무 표시 (패키지 식품은 해당 없음)', law: 'NYC Health Code §81.49', limitEn: 'NYC Health Code §81.49 (eff. Dec 1 2015): "Any covered establishment that offers for sale a menu item that contains 2,300 milligrams or more of sodium shall post a sodium warning symbol on menus and menu boards in a manner clearly associated with that menu item." Covered establishments: chain restaurants with ≥15 locations nationally. Penalty: $200 per violation.' },
      { enforcementDate: '시행 중', ingredient: 'Added Caffeine (에너지 드링크류)', limit: '농도 >0.02% → 경고 라벨 의무', law: 'NY Mental Hygiene Law §19.13', limitEn: 'NY Mental Hygiene Law §19.13: Beverages with caffeine content exceeding 0.02% by weight must bear the warning: "WARNING: This beverage contains caffeine and is not recommended for children, pregnant or nursing women, or persons sensitive to caffeine." Applies to energy drinks and highly caffeinated beverages sold in New York State.' },
      { enforcementDate: '시행 중', ingredient: '중국산 꿀', limit: '원산지 표시 누락 시 NY 내 판매 금지', law: 'NY Agriculture & Markets Law §201-a', limitEn: 'NY Agriculture & Markets Law §201-a: Requires country-of-origin labeling for honey, seafood, and fresh produce sold at retail. Stricter enforcement than federal COOL under USDA 7 CFR §65. Chinese-origin honey must be explicitly labeled; blended honey must list all countries of origin in descending order of predominance.' },
    ],
    fsmpMedicaid: 'NY Medicaid (eMedNY): 경장 영양제 급여 기준 18 NYCRR §540 준용. 연방 FDA 21 CFR 107 기준 동일 적용. 주 독자 성분 추가 제한 없음. 처방 시 의사 서면 처방 + 의학적 필요성 서류 요구.',
  },
  MA: {
    name: 'Massachusetts', flag: '🦞', strictLevel: 'Moderate', dotColor: '#059669',
    labelingRules: [
      { date: '2023.01~', rule: 'MA Act to Advance Health Equity — 나트륨·설탕 정책 (2023~)', detail: '병원·학교·주 시설 내 식품 구매 시 나트륨·설탕 기준 초과 제품 제한 가이드라인 적용. 민간 식품에는 아직 강제력 없음 — 2025년 이후 입법 동향 모니터링 필요.', detailEn: 'MA Act to Advance Health Equity (2022 MA Acts Ch. 177): Directs state agencies, hospitals receiving state funds, and public schools to adopt nutrition standards limiting sodium and added sugars in purchased foods. Standards align with Dietary Guidelines for Americans 2020-2025. No mandatory limits on commercial packaged food as of 2025; legislative expansion under ongoing review.' },
      { date: '시행 중', rule: 'MA 105 CMR 520 — 패키지 식품 의무 표시', detail: '영양성분표(서빙 사이즈·열량·지방·콜레스테롤·나트륨·탄수화물·식이섬유·당류·단백질) + 알레르기 원료 8종 (우유·달걀·땅콩·견과류·생선·조개류·대두·밀) 필수 표시. 유통기한 90일 미만 제품 "Sell-By" 또는 "Best-If-Used-By" 날짜 의무.', detailEn: '105 CMR 520.000 (MA Food Labeling Regulations): Packaged food sold in MA must include Nutrition Facts panel (serving size, calories, total fat, saturated fat, trans fat, cholesterol, sodium, total carbohydrate, dietary fiber, sugars, protein) and declare all 8 major allergens. Products with shelf life <90 days must carry "Sell-By" or "Best-If-Used-By" date. Enforced by MA Dept. of Public Health.' },
      { date: '시행 중', rule: 'MA 학교 식품 영양 기준 (603 CMR 29.00)', detail: '공립학교 급식에서 포화지방·나트륨·당류 상한선 적용 (USDA Smart Snacks 연방 기준 준용 + MA 독자 가이드). 인공색소 관련 규제는 현재 없음.', detailEn: '603 CMR 29.00 (MA School Nutrition Standards): Public school meal programs must meet USDA National School Lunch Program (7 CFR Part 210) and USDA Smart Snacks standards (7 CFR §210.11), plus MA-specific guidance limiting saturated fat to <10% kcal, sodium per USDA sodium targets, and added sugars. No MA-specific prohibition on artificial food dyes as of 2025.' },
      { date: '시행 중', rule: 'MA 원산지 표시 (MA Ag Dept.)', detail: '해산물·농산물 원산지 강화 표시 — 새우·연어 등 수입 해산물 국가 표시 의무 (연방 COOL 기준 준용 + MA 독자 집행).', detailEn: 'MA Department of Agricultural Resources enforcement of federal COOL (Country of Origin Labeling, 7 CFR §65): Seafood (shrimp, salmon, crab, etc.) and fresh produce sold at retail must disclose country of origin. MA actively enforces mislabeling of imported seafood (e.g., farmed Asian shrimp sold as "domestic"). Violations subject to MA Ag & Markets Law §95A enforcement.' },
    ],
    strictIngredients: [
      { enforcementDate: '2023.01~', ingredient: '나트륨·설탕 (주 시설·학교 급식)', limit: '주 시설·학교 내 식품 구매 시 나트륨·설탕 기준 제한 (민간 패키지 식품 강제 기준 없음)', law: 'MA Act to Advance Health Equity / 603 CMR 29.00', limitEn: 'MA Act to Advance Health Equity (2022 MA Acts Ch. 177): Directs state agencies, hospitals receiving state funds, and public schools to adopt nutrition standards limiting sodium and added sugars in purchased foods. Standards align with Dietary Guidelines for Americans 2020-2025. No mandatory limits on commercial packaged food as of 2025.' },
    ],
    fsmpMedicaid: 'MA MassHealth (Medicaid): 경장 영양 급여 기준 130 CMR 436.000 준용. 연방 FDA 21 CFR 107 기준 적용. 독자 추가 성분 제한 없음. 처방 의사 NPI 인증 + 의학적 필요성 문서화 요구.',
  },
  WA: {
    name: 'Washington', flag: '🌲', strictLevel: 'Moderate', dotColor: '#2563eb',
    labelingRules: [
      { date: '2022.01.01', rule: 'Federal NBFDS (GMO 표시)', detail: 'WA I-522 주민발의 2013년 부결 → 연방 USDA NBFDS (7 CFR 66) 기준 준수. 생명공학(BE) 성분 공시 의무.', detailEn: 'USDA National Bioengineered Food Disclosure Standard (NBFDS), 7 CFR Part 66 (eff. Jan 1 2022): Food manufacturers must disclose bioengineered (BE) food ingredients using text ("Contains a bioengineered food ingredient"), a USDA-approved BE symbol, an electronic/digital link (QR code), or a text message option. WA State I-522 (2013) would have required state-level GMO labeling, but was defeated; federal NBFDS preempts state GMO labeling laws.' },
      { date: '시행 중', rule: 'WA RCW 69.22', detail: '식품 첨가물 기준 연방 FDA 준용. 독자 금지 성분 없음.', detailEn: 'RCW 69.22 (WA Food Safety and Security Act): Washington State adopts federal FDA food additive standards by reference. No WA-specific prohibited ingredients beyond federal GRAS/approved additive lists (21 CFR Parts 170-180). Enforcement by WA Dept. of Agriculture (WSDA) Food Safety Program.' },
      { date: '시행 중', rule: 'WA Healthy Incentives Program', detail: '저소득층 신선식품 구매 지원 프로그램 — FSMP 급여 적용 여부는 WA HCA 별도 확인 필요.', detailEn: 'WA Healthy Incentives Program (HIP): SNAP-eligible households receive bonus funds when purchasing fruits and vegetables at participating retailers. Administered by WA State Department of Social and Health Services (DSHS). FSMP and medical nutrition products are not covered under HIP; FSMP coverage falls under WA Apple Health (Medicaid) WAC 182-551-2100.' },
    ],
    strictIngredients: [
      { enforcementDate: '2022.01.01', ingredient: 'Bioengineered (BE/GMO) 성분', limit: 'NBFDS 기준 공시 의무 (연방 — WA 준용)', law: 'USDA AMS 7 CFR Part 66', limitEn: 'USDA National Bioengineered Food Disclosure Standard (NBFDS), 7 CFR Part 66 (eff. Jan 1 2022): Food manufacturers must disclose bioengineered (BE) food ingredients using text, a USDA-approved BE symbol, or an electronic/digital link (QR code). WA State I-522 (2013) would have required state-level GMO labeling but was defeated; federal NBFDS preempts state GMO labeling laws.' },
    ],
    fsmpMedicaid: 'WA Apple Health (Medicaid): 경장 영양 급여 기준 WAC 182-551-2100. FDA 21 CFR 107 기준 준용. 주 추가 성분 제한 없음.',
  },
  TX: {
    name: 'Texas', flag: '⭐', strictLevel: 'Standard', dotColor: '#b45309',
    labelingRules: [
      { date: '시행 중', rule: 'TX Health & Safety Code §431', detail: '연방 FDA 기준 준용. 주 독자 성분 금지 없음. 연방 FDCA §301 위반 시 TX 독자 집행 가능.', detailEn: 'TX Health & Safety Code Ch. 431 (Texas Food, Drug, and Cosmetic Act): Texas adopts federal FDCA and FDA regulations by reference. The state has no independent prohibited food ingredient list beyond federal standards. TX DSHS may independently enforce violations of federal FDCA §301 (21 U.S.C. §331) on food sold in Texas. No TX-specific additive bans as of 2025.' },
      { date: '시행 중', rule: 'TX Raw Milk Labeling', detail: '비가열 생유(Raw Milk) 판매 시 "WARNING: RAW MILK PRODUCTS MAY CONTAIN..." 경고 문구 필수.', detailEn: 'TX Health & Safety Code §435.041: Raw milk sold directly from the farm (permit required from TX DSHS) must be labeled: "WARNING: This product has not been pasteurized and may contain harmful bacteria. Pregnant women, children, the elderly, and persons with lowered resistance to disease have the highest risk of harm from use of this product." Must appear on label in 12-point bold type.' },
    ],
    strictIngredients: [],
    fsmpMedicaid: 'TX Medicaid (HHSC): 경장 영양제는 TX HHSC 청구 정책 준용. FDA 21 CFR 107 기준 동일 적용. 주 독자 성분 제한 없음.',
  },
  FL: {
    name: 'Florida', flag: '🌴', strictLevel: 'Standard', dotColor: '#0891b2',
    labelingRules: [
      { date: '시행 중', rule: 'FL Statute §500.11', detail: '연방 FDA 기준 준용. 독자 성분 금지 없음.', detailEn: 'FL Statute §500.11 (Florida Food Safety Act): "The following acts and the causing thereof within this state are prohibited: ... the introduction or delivery for introduction into commerce of any food that is adulterated or misbranded." Florida adopts federal FDA food standards under FDCA (21 U.S.C. §301 et seq.) by reference. No FL-independent prohibited ingredient list; enforcement by FL Dept. of Agriculture and Consumer Services (FDACS).' },
      { date: '시행 중', rule: 'FL Exotic Meat Labeling', detail: '악어·순록 등 이국 식육 판매 시 별도 종류 표시 의무 (FL Dept. of Agriculture 기준).', detailEn: 'FL Statute §500.444: Exotic or non-traditional meat products (alligator, ostrich, emu, reindeer, bison, etc.) sold in Florida must be labeled with the common or usual name of the species. Labels must not be misleading about the nature of the animal. FL FDACS enforces species identification requirements under Florida Food Safety Act. USDA FSIS inspection required for interstate commerce of exotic meats.' },
    ],
    strictIngredients: [],
    fsmpMedicaid: 'FL Medicaid (AHCA): 경장 영양제는 AHCA 정책 준용. 연방 FDA 기준 적용. 주 추가 성분 제한 없음.',
  },
};

const getDateStyle = (date?: string): string => {
  if (!date || date === '시행 중') return 'text-slate-300 dark:text-slate-700';
  if (date.includes('예정') || date.includes('논의') || date.includes('쯤') || date.includes('~')) return 'font-bold text-amber-500 dark:text-amber-400';
  const match = date.match(/(\d{4})[.\-](\d{2})[.\-](\d{2})/);
  if (match) {
    const d = new Date(`${match[1]}-${match[2]}-${match[3]}`);
    return d > new Date() ? 'font-bold text-violet-600 dark:text-violet-400' : 'text-slate-300 dark:text-slate-700';
  }
  // year-only or year+month (e.g. "2022", "2025.07") — treat as past
  const yearMatch = date.match(/^(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    return year <= new Date().getFullYear() ? 'text-slate-300 dark:text-slate-700' : 'font-bold text-violet-600 dark:text-violet-400';
  }
  return 'text-slate-300 dark:text-slate-700';
};

const getDDay = (date?: string): string | null => {
  if (!date) return null;
  const match = date.match(/(\d{4})[.\-](\d{2})[.\-](\d{2})/);
  if (!match) return null;
  const target = new Date(`${match[1]}-${match[2]}-${match[3]}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'D-0';
  return `D-${diff}`;
};

const getDateDisplay = (date?: string): string => {
  if (!date) return '—';
  if (date === '시행 중') return '시행 중';
  if (date.includes('예정') || date.includes('논의') || date.includes('쯤') || date.includes('~')) return date;
  const match = date.match(/(\d{4})[.\-](\d{2})[.\-](\d{2})/);
  if (match) {
    const d = new Date(`${match[1]}-${match[2]}-${match[3]}`);
    return d > new Date() ? `시행일: ${date}` : '시행 중';
  }
  // year-only or year+month
  const yearMatch = date.match(/^(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    return year <= new Date().getFullYear() ? '시행 중' : `시행일: ${date}`;
  }
  return date;
};

const NotifiedSection = ({ searchQuery }: { searchQuery: string }) => {
  const [activeCountry, setActiveCountry] = useState('KR');
  const country = NOTIFIED_COUNTRIES.find(c => c.code === activeCountry)!;
  const isUS = activeCountry === 'US';
  const allFiltered = searchQuery
    ? country.rows.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nameLocal.includes(searchQuery) ||
        r.function.includes(searchQuery)
      )
    : country.rows;
  const filtered = allFiltered.filter(r => !(r as any).category);
  const regulatoryRows = allFiltered.filter(r => (r as any).category === 'regulatory');
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <CheckCircle2 className="size-7 text-primary" />
        Notified Functional Ingredients — Global
      </h2>

      {/* Country tabs */}
      <div className="flex gap-2 flex-wrap">
        {NOTIFIED_COUNTRIES.map(c => (
          <button
            key={c.code}
            onClick={() => setActiveCountry(c.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeCountry === c.code
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.code}</span>
          </button>
        ))}
      </div>

      {/* US R&D Advisory Banner — pinned when US selected */}
      {isUS && (
        <div className="relative overflow-hidden rounded-xl border border-violet-300 dark:border-violet-800 bg-gradient-to-r from-violet-600 to-indigo-700 px-5 py-4 shadow-lg">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 size-7 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="size-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-white/70 uppercase tracking-widest mb-1">📌 R&D Advisory — USA Export Strategy</p>
              <p className="text-sm font-bold text-white leading-relaxed">
                미국 전역 수출용 제품이라면 <span className="bg-white/20 px-1.5 py-0.5 rounded font-black">가장 기준이 높은 캘리포니아 법을 기준으로 배합을 설계</span>할 것.
              </p>
              <p className="text-[11px] text-white/75 mt-1.5 leading-relaxed">
                CA Prop 65 · AB 418(2027 시행) · PFAS 포장 규제(AB 1200 시행 중; 전면 금지 추진 중)가 연방 FDA 기준을 초과. CA 기준 충족 제품은 50개 주 전역 판매 가능 — 역방향 불가.
                FSMP의 경우 Medi-Cal(CA Medicaid) 급여 기준도 가장 엄격하므로 사전 성분 스크리닝 필수.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System description */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl px-5 py-4 space-y-1">
        <p className="text-sm font-bold text-primary">{country.label} — {country.systemName}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{country.systemDesc}</p>
      </div>


      {/* Table — Federal Standard */}
      {(
      <><div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500 w-44">원료명 / Ingredient</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">기능성 내용 (한국어 / 현지어)</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500 w-36">일일 섭취 기준</th>
              <th className="px-5 py-4 text-xs font-bold uppercase text-primary w-52">근거 법령</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {r.nameLocal}{(r as any).regulated && <span className="text-rose-500 font-bold ml-0.5">*</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.function}</p>
                  {r.functionLocal && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">📋 원문</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1.5">{r.functionLocal}</p>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-relaxed">{r.limit}</td>
                <td className="px-5 py-4">
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs font-semibold text-primary/80 leading-snug flex-1">{r.lawRef}</span>
                    <a href={r.lawUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 flex-shrink-0 mt-0.5 transition-colors">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.some(r => (r as any).regulated) && (
        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">* 해당 국가에 규제 유의 사항이 있는 성분입니다 — 하단 규제 유의 사항 섹션을 확인하세요.</p>
      )}

      {/* Regulatory Compliance Notes */}
      {regulatoryRows.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" />
            규제 유의 사항 — Regulatory Compliance Notes
          </h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/40 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30">
                  <th className="px-5 py-3 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 w-44">규제 항목</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-amber-600 dark:text-amber-400">내용</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 w-36">기준 / 한도</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 w-52">근거 법령</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {regulatoryRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.nameLocal}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.function}</p>
                      {(r as any).notes && (
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{(r as any).notes}</p>
                      )}
                      {r.functionLocal && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">📋 원문</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 rounded px-1.5 py-1">{r.functionLocal}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-amber-600 dark:text-amber-400 leading-relaxed">{r.limit}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-1.5">
                        <span className="text-xs font-semibold text-primary/80 leading-snug flex-1">{r.lawRef}</span>
                        <a href={r.lawUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 flex-shrink-0 mt-0.5 transition-colors">
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
};

const IngredientsSection = ({ searchQuery }: { searchQuery: string }) => {
  const ingredients = [
    {
      name: 'Alulose',
      kr: 'Approved (Limit 10%)',  krUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      us: 'GRAS (Notice No. 498)', usUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras',
      eu: 'Novel Food (Under Review)', euUrl: 'https://food.ec.europa.eu/safety/novel-food/novel-food-catalogue_en',
      cn: 'Not Listed (GB 2760 미등재)', cnUrl: 'https://www.samr.gov.cn/',
      vn: '규정 미비 (수출 위험)', vnUrl: 'https://vfa.gov.vn/en/news.html',
      th: '규정 미비 (수출 위험)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Not Permitted (BPOM 미승인)', idUrl: 'https://www.pom.go.id/',
      ph: 'Not Listed (FDA PH 미승인)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (Health Canada 2021)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: '허용 (할랄 공정 확인)', myUrl: 'https://www.moh.gov.my/',
      au: 'Novel Food — 미허가', auUrl: 'https://www.foodstandards.gov.au/',
      ae: '허용 (GSO 기준)', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: 'CN: GB 2760 미등재로 중국 수출 불가. EU: 심사 보류 중. VN·TH: 현지 규정 부재로 사전 확인 필수. ID·PH: 미승인. CA: 허용. AU: Novel Food 미허가(2026년 말 결정 예정). 수출 제형 대체 감미료(수크랄로스 등) 검토 권장.',
      isLatest: true,
      alerts: { eu: 'Regulatory Barrier', us: 'Supply Risk', cn: 'Not Permitted', au: 'Not Permitted' }
    },
    {
      name: 'Lutein',
      kr: 'Functional Ingredient',  krUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      us: 'GRAS',                   usUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras',
      eu: 'Approved (Health Claim)', euUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432',
      cn: 'Approved (CFSA 보건식품)', cnUrl: 'https://www.samr.gov.cn/spyj/tzgg/',
      vn: 'Permitted (Circular 43)', vnUrl: 'https://vfa.gov.vn/en/news.html',
      th: 'Permitted (Notification 293)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Permitted (ML 등록 조건)', idUrl: 'https://www.pom.go.id/',
      ph: 'Permitted (CPR 등록 조건)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (NPN 발급)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: '허용', myUrl: 'https://www.moh.gov.my/',
      au: '허용', auUrl: 'https://www.foodstandards.gov.au/',
      ae: '허용', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: '전 시장 허용 원료. EU 수출 시 건강 강조 표시 허용 용량(10~20mg/일) 준수. CN CFSA 보건식품 등록 시 20mg/일 한도 적용.',
      isLatest: true
    },
    {
      name: 'BCAA',
      kr: 'Approved',  krUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      us: 'GRAS',      usUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras',
      eu: 'Approved',  euUrl: 'https://food.ec.europa.eu/safety/novel-food/novel-food-catalogue_en',
      cn: 'Approved (GB 14880 영양강화)', cnUrl: 'https://www.samr.gov.cn/',
      vn: 'Permitted (Circular 43)', vnUrl: 'https://vfa.gov.vn/en/news.html',
      th: 'Permitted (Notification 293)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Permitted (ML 등록 조건)', idUrl: 'https://www.pom.go.id/',
      ph: 'Permitted (CPR 등록 조건)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (NPN 발급)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: '허용', myUrl: 'https://www.moh.gov.my/',
      au: '허용', auUrl: 'https://www.foodstandards.gov.au/',
      ae: '허용', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: '전 시장 허용 원료. 표준 아미노산 프로필 충족 여부 및 영양 라벨 정확도 검토 필수. CN GB 14880 영양강화제 기준 한도 확인.',
      isLatest: false
    },
    {
      name: 'Probiotics',
      kr: 'Functional',  krUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      us: 'GRAS/NDI',    usUrl: 'https://www.fda.gov/food/dietary-supplements/new-dietary-ingredients-notifications-and-related-history',
      eu: 'QPS List',    euUrl: 'https://www.efsa.europa.eu/en/topics/topic/qualified-presumption-safety-qps',
      cn: 'Approved (CFSA 허용 균주 목록)', cnUrl: 'https://www.samr.gov.cn/spyj/tzgg/',
      vn: 'Permitted (Circular 43)', vnUrl: 'https://vfa.gov.vn/en/news.html',
      th: 'Permitted (Notification 293)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Permitted (균주 목록 BPOM 승인)', idUrl: 'https://www.pom.go.id/',
      ph: 'Permitted (CPR 등록 조건)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (NPN 발급)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: '허용 (배지 할랄 확인)', myUrl: 'https://www.moh.gov.my/',
      au: '허용', auUrl: 'https://www.foodstandards.gov.au/',
      ae: '허용', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: 'CN: CFSA 허용 균주 목록 외 균주 사용 불가 — 목록 사전 확인 필수. EU QPS 인정 균주별 안전성 문서화 필요. VN·TH: 균주 적합성 Self-Declaration 시 검토 자료 구비. MY: 배양 배지 내 돼지유래 성분 확인 필수.',
      isLatest: false
    },
    {
      name: 'HMB',
      kr: 'Indiv. Recognized', krUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp',
      us: 'GRAS',              usUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras',
      eu: 'Novel Food',        euUrl: 'https://food.ec.europa.eu/safety/novel-food/novel-food-catalogue_en',
      cn: 'Not Listed (미등록)', cnUrl: 'https://www.samr.gov.cn/',
      vn: 'Not Regulated',     vnUrl: 'https://vfa.gov.vn/en/news.html',
      th: 'Not Regulated',     thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Under Review (BPOM 미분류)', idUrl: 'https://www.pom.go.id/',
      ph: 'Under Review (FDA PH 검토 중)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Under Review (Health Canada 검토 중)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: 'Under Review (사전 확인 필요)', myUrl: 'https://www.moh.gov.my/',
      au: 'Under Review (Novel Food 해당 여부 확인)', auUrl: 'https://www.foodstandards.gov.au/',
      ae: 'Under Review (사전 확인 필요)', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: 'CN·VN·TH: 규제 근거 부재로 수출 전 현지 당국 사전 문의 필수. EU Novel Food 허가 심사 중. KR 개별인정 취득 시 엄격한 순도 기준 충족 필요.',
      isLatest: false
    },
    {
      name: '돼지 유래 젤라틴 (Porcine Gelatin)',
      kr: '허용 (식약처 — 표시 의무)', krUrl: 'https://www.mfds.go.kr/',
      us: 'Permitted (FDA GRAS)', usUrl: 'https://www.fda.gov/',
      eu: 'Permitted (EC 853/2004)', euUrl: 'https://food.ec.europa.eu/',
      cn: 'Permitted (GB 허용)', cnUrl: 'https://www.samr.gov.cn/',
      vn: 'Permitted (표시 의무)', vnUrl: 'https://vfa.gov.vn/',
      th: 'Permitted (표시 의무)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Not Permitted (할랄 미인증 시 수출 불가)', idUrl: 'https://www.pom.go.id/',
      ph: 'Permitted (표시 의무 — 무슬림 인구 다수 지역 주의)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (표시 의무)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: 'Not Permitted (JAKIM 할랄 미인증 시 수출 불가)', myUrl: 'https://www.moh.gov.my/',
      au: 'Permitted (표시 의무)', auUrl: 'https://www.foodstandards.gov.au/',
      ae: 'Not Permitted (할랄 미인증 시 통관 거부)', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: '인도네시아·말레이시아·UAE 수출 시 할랄 인증 필수. 돼지 유래 젤라틴 대체재(생선 젤라틴, 식물성 카라기난) 사용 권장. 무슬림 다수 국가 수출 전 원료 전환 검토 필요',
      isLatest: true,
    },
    {
      name: '에탄올 (추출 용매 / Ethanol)',
      kr: '허용 (식약처 — 잔류 허용 기준 있음)', krUrl: 'https://www.mfds.go.kr/',
      us: 'Permitted (FDA GRAS — 잔류 기준)', usUrl: 'https://www.fda.gov/',
      eu: 'Permitted (EC — 잔류 기준)', euUrl: 'https://food.ec.europa.eu/',
      cn: 'Permitted (GB 허용)', cnUrl: 'https://www.samr.gov.cn/',
      vn: 'Permitted (표시 의무)', vnUrl: 'https://vfa.gov.vn/',
      th: 'Permitted (표시 의무)', thUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      id: 'Not Permitted (할랄 인증 시 추출 용매 에탄올 사용 불가)', idUrl: 'https://www.pom.go.id/',
      ph: 'Permitted (잔류 기준 준수)', phUrl: 'https://www.fda.gov.ph/',
      ca: 'Permitted (FDR 잔류 기준)', caUrl: 'https://www.canada.ca/en/health-canada.html',
      my: 'Not Permitted (JAKIM 할랄 인증 시 에탄올 추출 불가)', myUrl: 'https://www.moh.gov.my/',
      au: 'Permitted (잔류 기준)', auUrl: 'https://www.foodstandards.gov.au/',
      ae: 'Not Permitted (할랄 인증 제품 에탄올 추출 불가)', aeUrl: 'https://www.moiat.gov.ae/',
      advisory: '인도네시아·말레이시아·UAE 할랄 인증 제품에서 에탄올 추출 용매 사용 불가. 비에탄올 추출 공정 (CO₂, 물 추출) 전환 필요. 잔류량 기준은 국가별 상이하므로 CoA 확보 권장',
      isLatest: true,
    },
  ];

  const filtered = ingredients.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.advisory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatusCell = ({ value, url, alert }: { value: string; url: string; alert?: string }) => (
    <div className="flex items-center gap-1.5">
      <span className={`flex items-center gap-1 text-xs leading-snug ${
        value.includes('Not Listed') || value.includes('Not Permitted') || value.includes('수출 위험') || value.includes('Not Regulated')
          ? 'text-rose-500 font-medium'
          : value.includes('Under Review') || value.includes('Novel Food')
            ? 'text-amber-500 font-medium'
            : 'text-slate-700 dark:text-slate-300'
      }`}>
        {value}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 transition-colors flex-shrink-0"><ExternalLink className="size-3" /></a>
      </span>
      {alert && (
        <div className="group relative">
          {alert.includes('Not') || alert.includes('Barrier') ? (
            <XCircle className="size-3.5 text-rose-500 cursor-help" />
          ) : (
            <AlertCircle className="size-3.5 text-amber-500 cursor-help" />
          )}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            {alert}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FlaskConical className="size-7 text-primary" />
          Individually Recognized Ingredients (Global)
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse" style={{ minWidth: '2000px' }}>
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500 w-28">Ingredient</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇰🇷 Korea</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇺🇸 USA</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇪🇺 EU</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇨🇳 China</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇻🇳 Vietnam</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇹🇭 Thailand</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇮🇩 Indonesia</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇵🇭 Philippines</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-slate-500">🇨🇦 Canada</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">🇲🇾 Malaysia</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">🇦🇺 Australia</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">🇦🇪 UAE</th>
              <th className="px-4 py-4 text-xs font-bold uppercase text-primary">R&D Advisory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(i => (
              <tr key={i.name} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${i.isLatest ? 'animate-pulse-row' : ''}`}>
                <td className="px-4 py-4 font-bold text-sm">
                  <div className="flex flex-col gap-1">
                    {i.name}
                    {i.isLatest && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter w-fit">Latest</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4"><StatusCell value={i.kr} url={i.krUrl} /></td>
                <td className="px-4 py-4"><StatusCell value={i.us} url={i.usUrl} alert={i.alerts?.us} /></td>
                <td className="px-4 py-4"><StatusCell value={i.eu} url={i.euUrl} alert={i.alerts?.eu} /></td>
                <td className="px-4 py-4"><StatusCell value={i.cn} url={i.cnUrl} alert={i.alerts?.cn} /></td>
                <td className="px-4 py-4"><StatusCell value={i.vn} url={i.vnUrl} /></td>
                <td className="px-4 py-4"><StatusCell value={i.th} url={i.thUrl} /></td>
                <td className="px-4 py-4">{(i as any).id ? <StatusCell value={(i as any).id} url={(i as any).idUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">{(i as any).ph ? <StatusCell value={(i as any).ph} url={(i as any).phUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">{(i as any).ca ? <StatusCell value={(i as any).ca} url={(i as any).caUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">{(i as any).my ? <StatusCell value={(i as any).my} url={(i as any).myUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">{(i as any).au ? <StatusCell value={(i as any).au} url={(i as any).auUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">{(i as any).ae ? <StatusCell value={(i as any).ae} url={(i as any).aeUrl} /> : <span className="text-xs text-slate-400">—</span>}</td>
                <td className="px-4 py-4">
                  <div className="p-2 rounded bg-primary/5 border border-primary/10 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {i.advisory}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComplianceSection = ({ searchQuery }: { searchQuery: string }) => {
  const [selectedMarket, setSelectedMarket] = useState('USA (FDA)');
  const [selectedUSState, setSelectedUSState] = useState('CA');
  const stateData = US_STATE_REGS[selectedUSState];

  const complianceData = [
    {
      market: 'USA (FDA)',
      product: 'Diabetic FSMP',
      banned: '특정 합성 색소 (캘리포니아 적색3호), 비GRAS 감미료\nCertain synthetic colors (Red 3 in CA), Non-GRAS sweeteners',
      certificates: 'FSVP (해외 공급업체 검증 프로그램), FSMA 204 이력 추적 기록\nFSVP (Foreign Supplier Verification), FSMA 204 Traceability Record',
      standard: '21 CFR 101.9 / FSMA 204',
      standardUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.9',
      risk: 'High (Traceability)',
      isLatest: true
    },
    {
      market: 'EU (EFSA)',
      product: 'Diabetic FSMP',
      banned: '이산화티타늄 (E171), BPA 함유 식품접촉재 (2026.07.20~), Cat 13.2 고농도 합성 감미료\nTitanium Dioxide (E171), BPA in FCM (banned from 2026.07.20), High synthetic sweetener levels in Cat 13.2',
      certificates: '자유판매증명서, 위생증명서, 신규식품 승인서\nCertificate of Free Sale, Health Certificate, Novel Food Auth',
      standard: 'Regulation 609/2013 / 1169/2011',
      standardUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32013R0609',
      risk: 'Medium (Labeling)',
      isLatest: true
    },
    {
      market: 'Taiwan (TFDA)',
      product: 'FSMP',
      banned: 'GB 표준 승인 목록 미등재 성분\nIngredients not on GB standard approved list',
      certificates: 'SAMR 등록, 공장 감사 보고서\nSAMR Registration, Factory Audit Report',
      standard: 'GB 29922 / GB 25596',
      standardUrl: 'https://www.samr.gov.cn/',
      risk: 'Critical (Registration)',
      isLatest: false
    },
    {
      market: 'Japan (MHLW)',
      product: 'Special Use Food',
      banned: '호두 (미표기 알레르겐), 특정 식품 첨가물\nWalnut (as undeclared allergen), specific additives',
      certificates: '원산지 증명서, JAS 적합성 확인\nCertificate of Origin, JAS Compliance',
      standard: 'Food Sanitation Act / CAA Labeling',
      standardUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/',
      risk: 'Low (Allergen Update)',
      isLatest: false
    },
    {
      market: 'China (SAMR)',
      product: '가공식품·제과·음료',
      banned: 'GB 2760 미등재 첨가물, 적색2호, Cyclamate 초과, Sunset Yellow >100mg/kg',
      certificates: 'GACC 해외생산업체 등록, 위생증명서(Health Certificate), 성분적합성 검사 성적서',
      standard: 'GB 2760 / GB 7718 / GACC 2021',
      standardUrl: 'https://www.samr.gov.cn/',
      risk: 'Critical (Registration + Additive)',
      isLatest: true
    },
    {
      market: 'Vietnam (VFA)',
      product: '가공식품·제과·음료',
      banned: 'Potassium Bromate, 아조계 색소 초과, Circular 24 미등재 첨가물',
      certificates: 'VFA 수입 허가(Import Permit), Self-Declaration 적합성 증명, 베트남어 라벨 사전 승인',
      standard: 'Thông tư 24/2019 / Nghị định 15/2018',
      standardUrl: 'https://vfa.gov.vn/en/news.html',
      risk: 'High (Permit + Color)',
      isLatest: true
    },
    {
      market: 'Thailand (Thai FDA)',
      product: '가공식품·제과·음료',
      banned: 'Cyclamate (전면 금지), Tartrazine >50mg/kg, Potassium Bromate',
      certificates: 'Thai FDA 수입 허가·제품 등록, 태국어 라벨 승인, 원산지 증명서(C/O)',
      standard: 'Food Act B.E. 2522 / MOPH Notification No. 468 (2025.12.12)',
      standardUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx',
      risk: 'High (Sweetener + Color)',
      isLatest: true
    },
    { market: 'Indonesia (BPOM)', product: '가공식품·건강기능식품·제과', banned: '비허가 식품 첨가물 (BPOM 목록 외), Potassium Bromate, 돼지유래 원료 (할랄 미인증 시), 비승인 색소·보존료', certificates: 'BPOM ML 번호 등록, 할랄 인증서(BPJPH — 2026.10.17 의무화), 위생증명서, 원산지증명서(CoO)', standard: 'BPOM Reg. No. 22/2019 / SNI / BPJPH 2021', standardUrl: 'https://www.pom.go.id/', risk: 'Critical (Halal Mandatory + ML)', isLatest: true },
    { market: 'Philippines (FDA PH)', product: '가공식품·FSMP·음료·영양제', banned: '비등록 식품 첨가물, 비승인 신규 성분 (Novel Food), 미표기 알레르겐', certificates: 'CPR (Certificate of Product Registration), LTO (License to Operate), 수입허가서(Import Permit)', standard: 'RA 3720 / FDA AO 2014-0030 / FDA AO 2020-0023', standardUrl: 'https://www.fda.gov.ph/', risk: 'High (CPR + LTO)', isLatest: true },
    { market: 'Canada (CFIA)', product: '가공식품·기능성식품·건강제품', banned: 'Potassium Bromate, Azodicarbonamide 초과(45ppm), 미승인 Novel Food 성분', certificates: 'SFCR 수입허가, CFIA 라벨 승인, Health Canada 천연보건제품 사이트 라이선스(NPN), NHP 제품 허가', standard: 'FDR + SFCR 2019 / FDR B.24 / Health Canada NHP', standardUrl: 'https://www.canada.ca/en/health-canada.html', risk: 'High (FOPL + NHP)', isLatest: true },
    { market: 'Malaysia (MOH/JAKIM)', product: '가공식품·건강기능식품', banned: 'JAKIM 미인증 할랄 표시, Pork/Alcohol 함유 성분, 미승인 색소·보존료', certificates: 'JAKIM 할랄 인증서, MeSTI 또는 HACCP 인증, MAQIS 동물성 성분 검역서류 3종', standard: 'Food Act 1983 / Food Regulations 1985 / JAKIM Halal Standard MS1500', standardUrl: 'https://www.maqis.gov.my/', risk: 'High (Halal + MeSTI)', isLatest: true },
    { market: 'Australia (FSANZ)', product: '가공식품·FSMP·기능성식품', banned: '미허가 Novel Food 성분(알룰로스 현재 미허가), 미승인 식품첨가물, 바이오보안 고위험 성분(육류·난황·유청) 무허가 수입', certificates: '바이오보안 수입 허가(Biosecurity Import Permit), FSANZ 성분 적합성 확인, Health Star Rating 시뮬레이션 권장', standard: 'Food Standards Code / Biosecurity Act 2015', standardUrl: 'https://www.foodstandards.gov.au/', risk: 'High (Biosecurity + Novel Food)', isLatest: true },
    { market: 'UAE (MoIAT)', product: '가공식품·음료·제과', banned: '아랍어 미표기 라벨, 미할랄 인증 육류 유래 성분, 설탕세 적용 고당류 음료(50~100% 부과)', certificates: 'ESMA 제품 등록, GSO 적합성 인증, 아랍어 라벨 부착, 할랄 인증서(ECAS/ESMA 승인 기관)', standard: 'GSO 9/2013 / UAE.S 2055 / FTA Excise Tax', standardUrl: 'https://www.moiat.gov.ae/', risk: 'High (Arabic Label + Halal + Sugar Tax)', isLatest: true },
    { market: 'Russia/EAEU (EAC)', product: '가공식품·유제품·제과·육류가공품', banned: 'EAC 미인증 제품, Potassium Bromate, TR TS 029/2012 미등재 첨가물, 러시아어 미표기 라벨', certificates: 'EAC 인증(Евразийский знак соответствия), 국가 위생등록(СГР), 수의사 위생증명서, 식물검역증명서', standard: 'TR TS 021/2011 / TR TS 022/2011 / TR TS 029/2012', standardUrl: 'https://www.eurasiancommission.org/', risk: 'Critical (EAC Registration + Language)', isLatest: true },
    { market: 'Hong Kong (CFS/FEHD)', product: '가공식품·건강기능식품·음료', banned: '간체자(Simplified Chinese) 단독 표기, Cap 132U 미등재 첨가물, Potassium Bromate', certificates: '수입 허가 불필요, 영어·번체자 이중 라벨, 위생성적서(원산지 따라 상이)', standard: 'Food Safety Ordinance Cap 612 / Cap 132W / Cap 132U', standardUrl: 'https://www.cfs.gov.hk/', risk: 'Medium (Bilingual Label)', isLatest: true },
    { market: 'UK (FSA) [Post-Brexit]', product: '가공식품·FSMP·기능성식품', banned: '영어 미표기 라벨, UK Retained Additives 미등재 성분, Potassium Bromate, PHO', certificates: 'DEFRA IPAFFS 입항 사전신고, UK Retained 적합성 확인, FSA 첨가물 승인 성적서', standard: 'UK Retained EU Law / UK Food Safety Act 1990', standardUrl: 'https://www.food.gov.uk/', risk: 'High (Post-Brexit Divergence)', isLatest: true },
    { market: 'Switzerland (FSVO)', product: '가공식품·유기농식품·FSMP', banned: '국내 언어 미표기 라벨, ZuV 미등재 첨가물, Bio Suisse 미인증 유기농 표기', certificates: 'EU MRA 활용 가능, FSVO 적합성 확인, 수의사 위생증명서(동물성 식품), Bio Suisse 인증(유기농)', standard: 'LMG / ZuV / VLtH / VPRÜ', standardUrl: 'https://www.blv.admin.ch/', risk: 'Medium (National Language + MRA Verify)', isLatest: true },
    { market: 'France [EU Deviation 🚨]', product: 'EU 공통 + 프랑스 독자 규제 식품', banned: '🚨 E171(이산화티타늄) — EU 금지(2022.02) 이전 프랑스 단독 금지(2021.01). Nutri-Score 미표기. Loi Egalim 광고 기준 위반', certificates: 'EU 적합성 인증 + 프랑스 DGCCRF 추가 기준 준수 확인, Nutri-Score 산출 결과서', standard: '[EU] Reg 1333/2008 + [Local] Arrêté 2021 / Nutri-Score / Loi Egalim', standardUrl: 'https://www.economie.gouv.fr/dgccrf', risk: 'High (Strict Local Rule — E171 + Nutri-Score)', isLatest: true },
    { market: 'Nordic/Hungary [EU Deviation 🚨]', product: 'EU 공통 + 개별국 세금 적용 식품', banned: '🚨 고당류 제품에 국가별 추가 세금(헝가리 NETA, 핀란드 가당음료세, 노르웨이 설탕세). 해당 세금 미신고 판매', certificates: 'EU 적합성 인증 + 각국 세금 신고(수입업자 책임), 당류 함량 분석 성적서', standard: '[HU] NETA 2011 / [FI] Soft Drink Tax Act / [NO] Avgift sukker', standardUrl: 'https://www.stm.fi/', risk: 'High (Sugar/Fat Tax Burden)', isLatest: true },
  ];

  const tabs = [
    { id: 'USA (FDA)',            code: 'US', flag: '🇺🇸' },
    { id: 'EU (EFSA)',            code: 'EU', flag: '🇪🇺' },
    { id: 'Japan (MHLW)',         code: 'JP', flag: '🇯🇵' },
    { id: 'Taiwan (TFDA)',        code: 'TW', flag: '🇹🇼' },
    { id: 'China (SAMR)',         code: 'CN', flag: '🇨🇳' },
    { id: 'Vietnam (VFA)',        code: 'VN', flag: '🇻🇳' },
    { id: 'Thailand (Thai FDA)',  code: 'TH', flag: '🇹🇭' },
    { id: 'Indonesia (BPOM)',     code: 'ID', flag: '🇮🇩' },
    { id: 'Philippines (FDA PH)', code: 'PH', flag: '🇵🇭' },
    { id: 'Canada (CFIA)',        code: 'CA', flag: '🇨🇦' },
    { id: 'Malaysia (MOH/JAKIM)', code: 'MY', flag: '🇲🇾' },
    { id: 'Australia (FSANZ)',    code: 'AU', flag: '🇦🇺' },
    { id: 'UAE (MoIAT)',          code: 'AE', flag: '🇦🇪' },
    { id: 'Russia/EAEU (EAC)',    code: 'RU', flag: '🇷🇺' },
    { id: 'Hong Kong (CFS/FEHD)', code: 'HK', flag: '🇭🇰' },
    { id: 'UK (FSA) [Post-Brexit]', code: 'GB', flag: '🇬🇧' },
    { id: 'Switzerland (FSVO)',   code: 'CH', flag: '🇨🇭' },
  ];

  const filtered = complianceData.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      d.market.toLowerCase().includes(q) || d.product.toLowerCase().includes(q) ||
      d.banned.toLowerCase().includes(q) || d.certificates.toLowerCase().includes(q) || d.standard.toLowerCase().includes(q);
    const isEuDeviation = selectedMarket === 'EU (EFSA)' &&
      (d.market === 'France [EU Deviation 🚨]' || d.market === 'Nordic/Hungary [EU Deviation 🚨]');
    return matchSearch && (d.market === selectedMarket || isEuDeviation);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ShieldCheck className="size-7 text-primary" />
          Export & Import Compliance Matrix (Risk Matrix)
        </h2>
      </div>

      {/* Country tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => {
          const d = complianceData.find(c => c.market === t.id);
          const isActive = selectedMarket === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedMarket(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span className="text-sm leading-none">{t.flag}</span>
              <span>{t.code}</span>
              {d?.isLatest && !isActive && (
                <span className="size-1.5 rounded-full bg-primary inline-block" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Market / Region</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Banned Substances</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Required Certificates</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Reference Standard</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length > 0 ? filtered.map((d, idx) => (
              <tr key={idx} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${d.isLatest ? 'animate-pulse-row' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{d.market}</span>
                    {d.isLatest && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter">Latest Update</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{d.product}</p>
                </td>
                <td className="px-6 py-4 text-xs text-rose-500 font-medium max-w-xs">
                  {d.banned.includes('\n') ? (
                    <>
                      <span>{d.banned.split('\n')[0]}</span>
                      <span className="block text-[10px] text-rose-400/60 mt-0.5">{d.banned.split('\n')[1]}</span>
                    </>
                  ) : d.banned}
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs">
                  {d.certificates.includes('\n') ? (
                    <>
                      <span>{d.certificates.split('\n')[0]}</span>
                      <span className="block text-[10px] text-slate-400/70 mt-0.5">{d.certificates.split('\n')[1]}</span>
                    </>
                  ) : d.certificates}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-500">{d.standard}</span>
                    {d.standardUrl && (
                      <a href={d.standardUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/60 transition-colors flex-shrink-0">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    d.risk.includes('Critical')
                      ? 'bg-rose-100 text-rose-600'
                      : d.risk.includes('High')
                        ? 'bg-orange-100 text-orange-600'
                        : d.risk.includes('Medium')
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-teal-100 text-teal-600'
                  }`}>
                    {d.risk}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── EU 포장·지속가능성 규제 ─────────────────────────── */}
      {selectedMarket === 'EU (EFSA)' && (
        <div className="space-y-5 mt-2">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span>🇪🇺</span> EU 포장 및 지속가능성 규제
            <span className="text-xs font-normal text-slate-400 ml-2">PPWR · PFAS FCM · SUP</span>
          </h3>

          {/* ── EU 규제 적용 국가 범위 */}
          {(() => {
            const euMembers = [
              { flag: '🇦🇹', name: '오스트리아' }, { flag: '🇧🇪', name: '벨기에' },
              { flag: '🇧🇬', name: '불가리아' },   { flag: '🇭🇷', name: '크로아티아' },
              { flag: '🇨🇾', name: '키프로스' },   { flag: '🇨🇿', name: '체코' },
              { flag: '🇩🇰', name: '덴마크' },     { flag: '🇪🇪', name: '에스토니아' },
              { flag: '🇫🇮', name: '핀란드' },     { flag: '🇫🇷', name: '프랑스' },
              { flag: '🇩🇪', name: '독일' },       { flag: '🇬🇷', name: '그리스' },
              { flag: '🇭🇺', name: '헝가리' },     { flag: '🇮🇪', name: '아일랜드' },
              { flag: '🇮🇹', name: '이탈리아' },   { flag: '🇱🇻', name: '라트비아' },
              { flag: '🇱🇹', name: '리투아니아' }, { flag: '🇱🇺', name: '룩셈부르크' },
              { flag: '🇲🇹', name: '몰타' },       { flag: '🇳🇱', name: '네덜란드' },
              { flag: '🇵🇱', name: '폴란드' },     { flag: '🇵🇹', name: '포르투갈' },
              { flag: '🇷🇴', name: '루마니아' },   { flag: '🇸🇰', name: '슬로바키아' },
              { flag: '🇸🇮', name: '슬로베니아' }, { flag: '🇪🇸', name: '스페인' },
              { flag: '🇸🇪', name: '스웨덴' },
            ];
            const eeaExtra = [
              { flag: '🇳🇴', name: '노르웨이' }, { flag: '🇮🇸', name: '아이슬란드' }, { flag: '🇱🇮', name: '리히텐슈타인' },
            ];
            const exceptions = [
              { flag: '🇬🇧', name: '영국', note: 'Brexit — UK 자체 법률 (FSA) 적용, EU 규정 미적용', color: 'text-rose-600' },
              { flag: '🇨🇭', name: '스위스', note: 'EU 비회원 — 양자협정(MRA) 부분 적용, 독자 LMG/ZuV 병존', color: 'text-amber-600' },
            ];
            const deviations = [
              { flag: '🇫🇷', name: '프랑스', note: 'E171 단독 금지(2021.01) · Nutri-Score 의무', color: 'text-orange-600' },
              { flag: '🇭🇺', name: '헝가리', note: 'NETA 건강세 추가 부과', color: 'text-orange-600' },
              { flag: '🇫🇮', name: '핀란드', note: '가당음료세 추가 부과', color: 'text-orange-600' },
            ];
            return (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">🌍 EU 규제 적용 국가 범위</span>
                  <span className="text-[10px] text-slate-400">(PPWR · PFAS FCM · SUP 공통 적용)</span>
                </div>

                {/* EU 27 회원국 */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    EU 27개 회원국 — 전면 적용
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {euMembers.map(c => (
                      <span key={c.name} title={c.name}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                        <span>{c.flag}</span><span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* EEA 3개국 */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    EEA 3개국 — 식품·포장 규제 대부분 준용
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {eeaExtra.map(c => (
                      <span key={c.name} title={c.name}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                        <span>{c.flag}</span><span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 예외·비적용 */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    적용 예외 — 별도 규정 적용
                  </p>
                  <div className="space-y-1.5">
                    {exceptions.map(e => (
                      <div key={e.name} className="flex items-start gap-2 text-xs">
                        <span className="shrink-0">{e.flag}</span>
                        <span className={`font-semibold shrink-0 ${e.color}`}>{e.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{e.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 국가별 추가 규제 */}
                <div>
                  <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide mb-2">
                    ⚠️ EU 회원국이지만 추가 독자 규제 존재
                  </p>
                  <div className="space-y-1.5">
                    {deviations.map(d => (
                      <div key={d.name} className="flex items-start gap-2 text-xs">
                        <span className="shrink-0">{d.flag}</span>
                        <span className={`font-semibold shrink-0 ${d.color}`}>{d.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{d.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── PPWR 개요 카드 */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-blue-800 dark:text-blue-300 text-base">{EU_PACKAGING_REGS.ppwr.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.ppwr.regulation} &nbsp;·&nbsp; 발효: {EU_PACKAGING_REGS.ppwr.enforcedDate} &nbsp;·&nbsp; 전면 적용: <span className="font-semibold text-amber-600 dark:text-amber-400">{EU_PACKAGING_REGS.ppwr.applicationDate}</span>
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.ppwr.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 underline underline-offset-2 shrink-0">
                EUR-Lex 원문 →
              </a>
            </div>

            {/* 주요 일정 */}
            <div className="mt-3 flex flex-wrap gap-2">
              {EU_PACKAGING_REGS.ppwr.keyMilestones.map((m, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  m.urgency === 'high'
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                }`}>
                  <span className="font-bold">{m.date}</span>
                  <span>{m.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 재활용 등급 테이블 */}
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">📦 포장재 재활용 등급 (Recyclability Grade)</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 w-16">등급</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">설명</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 w-32">2030년 이후</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.ppwr.recyclabilityGrades.map((g, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2">
                        <span className="inline-block w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center"
                          style={{ backgroundColor: g.color }}>{g.grade}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{g.desc}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          g.grade === 'A' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                          g.grade === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                          g.grade === 'C' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        }`}>{g.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 재활용 원료 함량 목표 */}
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">♻️ 플라스틱 포장 재활용 원료(Recycled Content) 목표</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">포장 소재</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300">2030년 목표</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300">2040년 목표</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.ppwr.recycledContentTargets.map((t, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{t.material}</td>
                      <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">{t.target2030}</td>
                      <td className="px-3 py-2 text-center font-bold text-green-600 dark:text-green-400">{t.target2040}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 라벨링 요건 */}
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">🏷️ 포장 라벨링 요건</p>
            <ul className="space-y-1.5">
              {EU_PACKAGING_REGS.ppwr.labelingRequirements.map((l, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="shrink-0 text-blue-500 mt-0.5">•</span>
                  <span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{l.req}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {l.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── PFAS in FCM 카드 */}
          <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-rose-800 dark:text-rose-300">{EU_PACKAGING_REGS.pfas.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.pfas.regulation} &nbsp;·&nbsp; 시행: {EU_PACKAGING_REGS.pfas.enforcedDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.pfas.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.pfas.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-rose-600 dark:text-rose-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.pfas.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-rose-200 dark:border-rose-800">
              <table className="w-full text-xs">
                <thead className="bg-rose-100 dark:bg-rose-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-rose-700 dark:text-rose-300">물질명</th>
                    <th className="px-3 py-2 text-center font-semibold text-rose-700 dark:text-rose-300">허용 한도</th>
                    <th className="px-3 py-2 text-left font-semibold text-rose-700 dark:text-rose-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-rose-700 dark:text-rose-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.pfas.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-rose-100 dark:border-rose-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-rose-700 dark:text-rose-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/20 text-xs text-rose-800 dark:text-rose-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.pfas.exportAlert}
            </div>
          </div>

          {/* ── BPA FCM 카드 */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-purple-800 dark:text-purple-300">{EU_PACKAGING_REGS.bpa.title}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 uppercase tracking-tight">🚨 2026.07.20 시행</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.bpa.regulation} &nbsp;·&nbsp; 시행: {EU_PACKAGING_REGS.bpa.enforcedDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.bpa.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.bpa.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-purple-600 dark:text-purple-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.bpa.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-purple-200 dark:border-purple-800">
              <table className="w-full text-xs">
                <thead className="bg-purple-100 dark:bg-purple-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-purple-700 dark:text-purple-300">물질명</th>
                    <th className="px-3 py-2 text-center font-semibold text-purple-700 dark:text-purple-300">허용 한도</th>
                    <th className="px-3 py-2 text-left font-semibold text-purple-700 dark:text-purple-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-purple-700 dark:text-purple-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.bpa.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-purple-100 dark:border-purple-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-purple-700 dark:text-purple-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-xs text-purple-800 dark:text-purple-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.bpa.exportAlert}
            </div>
          </div>

          {/* ── SUP 일회용 플라스틱 카드 */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300">{EU_PACKAGING_REGS.sup.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Directive {EU_PACKAGING_REGS.sup.regulation} &nbsp;·&nbsp; 시행: {EU_PACKAGING_REGS.sup.enforcedDate}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.sup.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-amber-600 dark:text-amber-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">🚫 금지 품목</p>
            <ul className="space-y-1 mb-3">
              {EU_PACKAGING_REGS.sup.bannedItems.map((b, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="shrink-0 text-red-500 mt-0.5">✕</span>
                  <span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{b.item}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {b.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">🏷️ 표시 의무 품목</p>
            <ul className="space-y-1 mb-3">
              {EU_PACKAGING_REGS.sup.labelingRequired.map((l, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="shrink-0 text-amber-500 mt-0.5">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.sup.exportAlert}
            </div>
          </div>

          {/* ── Plastic FCM 2025/351 카드 */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">{EU_PACKAGING_REGS.plastic_fcm_2025.title}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 uppercase tracking-tight">⏰ 2026.09.16 의무 적용</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.plastic_fcm_2025.regulation} &nbsp;·&nbsp; 발효: {EU_PACKAGING_REGS.plastic_fcm_2025.enforcedDate}
                  &nbsp;·&nbsp; 의무 적용: <span className="font-semibold text-amber-600 dark:text-amber-400">{EU_PACKAGING_REGS.plastic_fcm_2025.applicationDate}</span>
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.plastic_fcm_2025.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.plastic_fcm_2025.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-emerald-600 dark:text-emerald-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.plastic_fcm_2025.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-emerald-200 dark:border-emerald-800">
              <table className="w-full text-xs">
                <thead className="bg-emerald-100 dark:bg-emerald-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-emerald-700 dark:text-emerald-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-emerald-700 dark:text-emerald-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-emerald-700 dark:text-emerald-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-emerald-700 dark:text-emerald-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.plastic_fcm_2025.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-emerald-100 dark:border-emerald-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-xs text-emerald-800 dark:text-emerald-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.plastic_fcm_2025.exportAlert}
            </div>
          </div>

          {/* ── FCM Substances 2026/245 카드 */}
          <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-teal-800 dark:text-teal-300">{EU_PACKAGING_REGS.fcm_substances_2026.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.fcm_substances_2026.regulation} &nbsp;·&nbsp; 발효·적용: {EU_PACKAGING_REGS.fcm_substances_2026.enforcedDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.fcm_substances_2026.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.fcm_substances_2026.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-teal-600 dark:text-teal-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.fcm_substances_2026.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-teal-200 dark:border-teal-800">
              <table className="w-full text-xs">
                <thead className="bg-teal-100 dark:bg-teal-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-teal-700 dark:text-teal-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-teal-700 dark:text-teal-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-teal-700 dark:text-teal-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-teal-700 dark:text-teal-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.fcm_substances_2026.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-teal-100 dark:border-teal-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-teal-700 dark:text-teal-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-teal-100 dark:bg-teal-900/20 text-xs text-teal-800 dark:text-teal-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.fcm_substances_2026.exportAlert}
            </div>
          </div>

          {/* ── EFSA 식품첨가물 가이드라인 개정 카드 */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-indigo-800 dark:text-indigo-300">{EU_PACKAGING_REGS.efsa_food_additive.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {EU_PACKAGING_REGS.efsa_food_additive.regulation} &nbsp;·&nbsp; 적용: {EU_PACKAGING_REGS.efsa_food_additive.applicationDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.efsa_food_additive.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.efsa_food_additive.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.efsa_food_additive.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-indigo-200 dark:border-indigo-800">
              <table className="w-full text-xs">
                <thead className="bg-indigo-100 dark:bg-indigo-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-indigo-700 dark:text-indigo-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-indigo-700 dark:text-indigo-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.efsa_food_additive.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-indigo-100 dark:border-indigo-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-indigo-700 dark:text-indigo-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-xs text-indigo-800 dark:text-indigo-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.efsa_food_additive.exportAlert}
            </div>
          </div>

          {/* ── 제3국 수입통제 강화 (EU) 2026/1206 카드 */}
          <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-orange-800 dark:text-orange-300">{EU_PACKAGING_REGS.third_country_import_2026.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.third_country_import_2026.regulation} &nbsp;·&nbsp; 발효: {EU_PACKAGING_REGS.third_country_import_2026.enforcedDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.third_country_import_2026.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.third_country_import_2026.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-orange-600 dark:text-orange-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.third_country_import_2026.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-orange-200 dark:border-orange-800">
              <table className="w-full text-xs">
                <thead className="bg-orange-100 dark:bg-orange-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-orange-700 dark:text-orange-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-orange-700 dark:text-orange-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-orange-700 dark:text-orange-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-orange-700 dark:text-orange-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.third_country_import_2026.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-orange-100 dark:border-orange-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-orange-700 dark:text-orange-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-xs text-orange-800 dark:text-orange-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.third_country_import_2026.exportAlert}
            </div>
          </div>

          {/* ── EFSA 다이옥신·PCB 과학적 의견서 카드 (규정 아님, 참고용) */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-700 dark:text-slate-300">{EU_PACKAGING_REGS.efsa_dioxins.title}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 uppercase tracking-tight">참고용 · 비구속</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {EU_PACKAGING_REGS.efsa_dioxins.regulation} &nbsp;·&nbsp; 채택: {EU_PACKAGING_REGS.efsa_dioxins.enforcedDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.efsa_dioxins.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.efsa_dioxins.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-slate-600 dark:text-slate-400 underline underline-offset-2 shrink-0">EFSA 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.efsa_dioxins.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-200 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.efsa_dioxins.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-700/50">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700/40 text-xs text-slate-700 dark:text-slate-300">
              ℹ️ <span className="font-semibold">참고:</span> {EU_PACKAGING_REGS.efsa_dioxins.exportAlert}
            </div>
          </div>

          {/* ── Novel Food (EU) 2026/1219 카드 */}
          <div className="rounded-xl border border-lime-200 dark:border-lime-800 bg-lime-50 dark:bg-lime-950/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-lime-800 dark:text-lime-300">{EU_PACKAGING_REGS.novel_food_2026.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regulation {EU_PACKAGING_REGS.novel_food_2026.regulation} &nbsp;·&nbsp; 승인: {EU_PACKAGING_REGS.novel_food_2026.applicationDate}
                  &nbsp;·&nbsp; Framework: {EU_PACKAGING_REGS.novel_food_2026.frameworkReg}
                </p>
              </div>
              <a href={EU_PACKAGING_REGS.novel_food_2026.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-lime-600 dark:text-lime-400 underline underline-offset-2 shrink-0">EUR-Lex 원문 →</a>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{EU_PACKAGING_REGS.novel_food_2026.summary}</p>
            <div className="overflow-x-auto rounded-lg border border-lime-200 dark:border-lime-800">
              <table className="w-full text-xs">
                <thead className="bg-lime-100 dark:bg-lime-900/30">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-lime-700 dark:text-lime-300">항목</th>
                    <th className="px-3 py-2 text-center font-semibold text-lime-700 dark:text-lime-300">기준</th>
                    <th className="px-3 py-2 text-left font-semibold text-lime-700 dark:text-lime-300">적용 범위</th>
                    <th className="px-3 py-2 text-center font-semibold text-lime-700 dark:text-lime-300">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.novel_food_2026.restrictedSubstances.map((s, i) => (
                    <tr key={i} className="border-t border-lime-100 dark:border-lime-900/20">
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-lime-700 dark:text-lime-300">{s.limit}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.scope}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300 text-xs font-medium">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-lime-100 dark:bg-lime-900/20 text-xs text-lime-800 dark:text-lime-300">
              ⚠️ <span className="font-semibold">수출 주의:</span> {EU_PACKAGING_REGS.novel_food_2026.exportAlert}
            </div>
          </div>

          {/* ── 제출 서류 통합 테이블 ────────────────────────── */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                📋 규정별 제출 서류 일람 (총 {EU_PACKAGING_REGS.documents.length}건)
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block"></span>PPWR</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block"></span>PFAS FCM</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block"></span>BPA FCM</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>SUP</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>Plastic FCM 2025</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block"></span>FCM 2026/245</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block"></span>EFSA 첨가물</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block"></span>수입통제</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block"></span>EFSA 의견서</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-lime-400 inline-block"></span>Novel Food</span>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 w-8">규정</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">문서명</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">법적 근거</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">준비 주체</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300 w-16">필수</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell">적용 시점</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300 w-14">원문</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_PACKAGING_REGS.documents.map((d, i) => {
                    const groupBg =
                      d.groupColor === 'blue'    ? 'bg-blue-50 dark:bg-blue-950/20' :
                      d.groupColor === 'rose'    ? 'bg-rose-50 dark:bg-rose-950/20' :
                      d.groupColor === 'purple'  ? 'bg-purple-50 dark:bg-purple-950/20' :
                      d.groupColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
                      d.groupColor === 'teal'    ? 'bg-teal-50 dark:bg-teal-950/20' :
                      d.groupColor === 'indigo'  ? 'bg-indigo-50 dark:bg-indigo-950/20' :
                      d.groupColor === 'orange'  ? 'bg-orange-50 dark:bg-orange-950/20' :
                      d.groupColor === 'slate'   ? 'bg-slate-100 dark:bg-slate-800/40' :
                      d.groupColor === 'lime'    ? 'bg-lime-50 dark:bg-lime-950/20' :
                      'bg-amber-50 dark:bg-amber-950/20';
                    const badgeColor =
                      d.groupColor === 'blue'    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                      d.groupColor === 'rose'    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                      d.groupColor === 'purple'  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                      d.groupColor === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      d.groupColor === 'teal'    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' :
                      d.groupColor === 'indigo'  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                      d.groupColor === 'orange'  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                      d.groupColor === 'slate'   ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                      d.groupColor === 'lime'    ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
                    return (
                      <tr key={i} className={`border-t border-slate-100 dark:border-slate-800 ${groupBg}`}>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${badgeColor}`}>{d.group}</span>
                        </td>
                        <td className="px-3 py-2">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{d.doc}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px]">{d.docEn}</p>
                        </td>
                        <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{d.basis}</td>
                        <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden md:table-cell">{d.by}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            d.required === '의무'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>{d.required}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{d.timing}</td>
                        <td className="px-3 py-2 text-center">
                          <a href={d.url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2">
                            →
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              * 위임규정(DA): PPWR Art. 6·7·9·12 세부 기준은 Commission Delegated Regulation으로 별도 발표 예정. &nbsp;
              * FCM DoC 작성 지침: <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R1935" target="_blank" rel="noopener noreferrer" className="underline text-blue-500 dark:text-blue-400">(EC) 1935/2004 Art. 16</a>
            </p>
          </div>
        </div>
      )}

      {/* ── 미국 주별 규제 ─────────────────────────────────── */}
      {selectedMarket === 'USA (FDA)' && (
        <div className="space-y-5 mt-2">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <AlertCircle className="size-5 text-violet-500" />
            미국 주별(State) 규제
          </h3>
          {/* State selector */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(US_STATE_REGS).map(stateKey => {
              const s = US_STATE_REGS[stateKey];
              const isSel = selectedUSState === stateKey;
              return (
                <button
                  key={stateKey}
                  onClick={() => setSelectedUSState(stateKey)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${isSel ? 'text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105'}`}
                  style={isSel ? { backgroundColor: s.dotColor, borderColor: s.dotColor } : {}}
                >
                  {s.flag} {s.name}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSel ? 'bg-white/20 text-white' : s.strictLevel === 'Strictest' ? 'bg-rose-100 text-rose-700' : s.strictLevel === 'High' ? 'bg-orange-100 text-orange-700' : s.strictLevel === 'Moderate' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{s.strictLevel}</span>
                </button>
              );
            })}
          </div>

          {/* State content */}
          <div className="space-y-5">
            {/* Header */}
            <div className="rounded-xl border-2 px-5 py-4 flex items-center gap-4" style={{ borderColor: stateData.dotColor + '60', backgroundColor: stateData.dotColor + '10' }}>
              <div className="text-3xl">{stateData.flag}</div>
              <div className="flex-1">
                <p className="text-base font-black" style={{ color: stateData.dotColor }}>{stateData.name}</p>
                <p className={`text-xs font-bold mt-0.5 ${stateData.strictLevel === 'Strictest' ? 'text-rose-600' : stateData.strictLevel === 'High' ? 'text-orange-600' : stateData.strictLevel === 'Moderate' ? 'text-blue-600' : 'text-slate-500'}`}>규제 강도: {stateData.strictLevel}</p>
              </div>
              {stateData.strictLevel === 'Strictest' && (
                <div className="flex items-center gap-1.5 bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full">
                  <AlertCircle className="size-3.5" />
                  설계 기준 주로 권장
                </div>
              )}
            </div>

            {/* CA: Prop 65 */}
            {selectedUSState === 'CA' && stateData.prop65 && (
              <div>
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-500" />
                  Proposition 65 — 식품 관련 주요 화학물질 경고 목록
                </h4>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-rose-50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/30">
                        <th className="px-4 py-3 font-bold uppercase text-rose-600 dark:text-rose-400 w-44">화학물질 / CAS No.</th>
                        <th className="px-4 py-3 font-bold uppercase text-rose-600 dark:text-rose-400">경고 유형 · 식품 관련성</th>
                        <th className="px-4 py-3 font-bold uppercase text-rose-600 dark:text-rose-400 w-36">NSRL / MADL</th>
                        <th className="px-4 py-3 font-bold uppercase text-rose-600 dark:text-rose-400 w-24">등재일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-50 dark:divide-slate-800">
                      {stateData.prop65.map((item, i) => (
                        <tr key={i} className="hover:bg-rose-50/50 dark:hover:bg-rose-900/5 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800 dark:text-slate-100">{item.chemical}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">CAS {item.cas} · {item.route}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 ${item.warningType.includes('Cancer') ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-orange-100 text-orange-700'}`}>{item.warningType}</span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.relevance}</p>
                            {item.relevanceEn && (
                              <div className="mt-1.5 pt-1.5 border-t border-rose-100 dark:border-slate-800">
                                <p className="text-[9px] font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest mb-0.5">📋 원문 (OEHHA)</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-rose-50/60 dark:bg-rose-900/10 rounded px-1.5 py-1">{item.relevanceEn}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">{item.threshold}</td>
                          <td className="px-4 py-3 text-slate-400">{item.listed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Prop 65 Warning Design Guide */}
                <div className="mt-3 rounded-xl border-2 border-rose-400 bg-white dark:bg-slate-900 p-4">
                  <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-2">⚠️ Prop 65 Safe Harbor Warning — 2018 OEHHA 공인 문구 디자인 가이드</p>
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
                    <p className="text-xs font-black text-rose-700 dark:text-rose-300 mb-1">⚠️ WARNING</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "This product can expose you to chemicals including [화학물질명], which is known to the State of California to cause [cancer / birth defects or other reproductive harm]. For more information go to <span className="font-bold not-italic text-rose-600">www.P65Warnings.ca.gov/food</span>"
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">표시 요건: 6pt 이상(권장 12pt+), 경고 삼각형(⚠️) 포함, 제품 주 표시면 또는 QR code 연결 허용. 온라인 판매 시 상품 페이지에도 표시 필수.</p>
                </div>
              </div>
            )}

            {/* CA: AB 418 */}
            {selectedUSState === 'CA' && stateData.ab418 && (
              <div>
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertCircle className="size-4 text-violet-500" />
                  AB 418 (California Food Safety Act) — 2027.01.01 금지 성분
                </h4>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-violet-200 dark:border-violet-900/40 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30">
                        <th className="px-4 py-3 font-bold uppercase text-violet-600 dark:text-violet-400 w-48">금지 성분 (CAS)</th>
                        <th className="px-4 py-3 font-bold uppercase text-violet-600 dark:text-violet-400 w-24 whitespace-nowrap">금지일</th>
                        <th className="px-4 py-3 font-bold uppercase text-violet-600 dark:text-violet-400">대체 원료 (R&D 권장)</th>
                        <th className="px-4 py-3 font-bold uppercase text-violet-600 dark:text-violet-400 w-32">FDA 전국 현황</th>
                        <th className="px-4 py-3 font-bold uppercase text-violet-600 dark:text-violet-400">금지 내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-violet-50 dark:divide-slate-800">
                      {stateData.ab418.map((item, i) => (
                        <tr key={i} className="hover:bg-violet-50/50 dark:hover:bg-violet-900/5 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{item.ingredient}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">CAS {item.cas}</p>
                          </td>
                          <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap">{item.banDate}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">{item.replacement}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.fdaStatus.startsWith('🔴') ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{item.fdaStatus}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[10px] text-slate-500 leading-relaxed">{item.notes}</p>
                            {item.notesEn && (
                              <div className="mt-1.5 pt-1.5 border-t border-violet-100 dark:border-slate-800">
                                <p className="text-[9px] font-bold text-violet-300 dark:text-violet-700 uppercase tracking-widest mb-0.5">📋 원문 (AB 418)</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-violet-50/60 dark:bg-violet-900/10 rounded px-1.5 py-1">{item.notesEn}</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CA: AB 2316 — School Color Dye Ban */}
            {selectedUSState === 'CA' && stateData.ab2316 && (
              <div>
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertCircle className="size-4 text-orange-500" />
                  AB 2316 (California School Food Safety Act) — 2027.12.31 학교 식품 인공색소 금지
                </h4>
                <div className="mb-2 rounded-lg bg-orange-50 dark:bg-orange-900/15 border border-orange-200 dark:border-orange-800/40 px-4 py-2.5">
                  <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-relaxed">
                    📌 적용 범위: 캘리포니아 공립학교 급식·캠퍼스 내 판매 식품 — 학생 가정 반입·펀드레이저 식품 제외. 근거: CA EPA 연구에서 합성 색소와 소아 ADHD·과잉행동 연관성 확인.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-orange-200 dark:border-orange-900/40 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-orange-50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/30">
                        <th className="px-4 py-3 font-bold uppercase text-orange-600 dark:text-orange-400 w-48">인공색소 (CAS)</th>
                        <th className="px-4 py-3 font-bold uppercase text-orange-600 dark:text-orange-400 w-24 whitespace-nowrap">금지 기준일</th>
                        <th className="px-4 py-3 font-bold uppercase text-orange-600 dark:text-orange-400">천연 대체 원료 (R&D 권장)</th>
                        <th className="px-4 py-3 font-bold uppercase text-orange-600 dark:text-orange-400 w-32">FDA 전국 현황</th>
                        <th className="px-4 py-3 font-bold uppercase text-orange-600 dark:text-orange-400">금지 내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 dark:divide-slate-800">
                      {stateData.ab2316.map((item, i) => (
                        <tr key={i} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 size-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{item.dye}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">CAS {item.cas}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">{item.banDate}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">{item.replacement}</td>
                          <td className="px-4 py-3">
                            <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{item.fdaStatus}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[10px] text-slate-500 leading-relaxed">{item.notes}</p>
                            {item.notesEn && (
                              <div className="mt-1.5 pt-1.5 border-t border-orange-100 dark:border-slate-800">
                                <p className="text-[9px] font-bold text-orange-300 dark:text-orange-700 uppercase tracking-widest mb-0.5">📋 원문 (AB 2316)</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-orange-50/60 dark:bg-orange-900/10 rounded px-1.5 py-1">{item.notesEn}</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* All states: Labeling Rules */}
            <div>
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                라벨링 · 표시 규정
              </h4>
              <div className="space-y-2">
                {stateData.labelingRules.map((rule, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 flex gap-3">
                    <div className="flex-shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-black text-primary">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{rule.rule.replace(/\s*\([^)]*\d{4}[^)]*\)\s*$/, '')}</p>
                        {rule.date && <span className={`text-[10px] whitespace-nowrap ${getDateStyle(rule.date)}`}>{getDateDisplay(rule.date)}</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{rule.detail}</p>
                      {rule.detailEn && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">📋 원문 (Official Text)</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 rounded px-1.5 py-1">{rule.detailEn}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State-specific strict ingredients */}
            {stateData.strictIngredients.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-500" />
                  주별 독자 성분 제한
                </h4>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/40 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30">
                        <th className="px-4 py-3 font-bold uppercase text-amber-600 dark:text-amber-400 w-48">성분</th>
                        <th className="px-4 py-3 font-bold uppercase text-amber-600 dark:text-amber-400 w-28 whitespace-nowrap">시행일</th>
                        <th className="px-4 py-3 font-bold uppercase text-amber-600 dark:text-amber-400">제한 기준</th>
                        <th className="px-4 py-3 font-bold uppercase text-amber-600 dark:text-amber-400 w-52">근거 법령</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50 dark:divide-slate-800">
                      {stateData.strictIngredients.map((item, i) => (
                        <tr key={i} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/5 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{item.ingredient}</td>
                          <td className={`px-4 py-3 text-xs whitespace-nowrap ${getDateStyle(item.enforcementDate)}`}>{getDateDisplay(item.enforcementDate)}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.limit}
                            {item.limitEn && (
                              <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">📋 원문 (Official Text)</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 rounded px-1.5 py-1">{item.limitEn}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-primary/80 font-semibold">{item.law}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* NY/MA: Sodium Rule highlight card */}
            {stateData.sodiumRule && (
              <div className="rounded-xl border-2 border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 px-5 py-4 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  🧂 나트륨 경고 표시 의무 규정 — {stateData.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 px-3 py-2">
                    <p className="text-[10px] font-black text-red-400 uppercase mb-0.5">기준 임계값</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{stateData.sodiumRule.threshold}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 px-3 py-2">
                    <p className="text-[10px] font-black text-red-400 uppercase mb-0.5">적용 범위</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{stateData.sodiumRule.scope}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 px-3 py-2">
                    <p className="text-[10px] font-black text-red-400 uppercase mb-0.5">근거 법령</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{stateData.sodiumRule.law}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 px-3 py-2">
                    <p className="text-[10px] font-black text-red-400 uppercase mb-0.5">위반 시 과징금</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{stateData.sodiumRule.penalty}</p>
                  </div>
                </div>
                <p className="text-[11px] text-red-600 dark:text-red-400 leading-relaxed">{stateData.sodiumRule.note}</p>
                {stateData.sodiumRule.noteEn && (
                  <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-900/30">
                    <p className="text-[9px] font-bold text-red-300 dark:text-red-700 uppercase tracking-widest mb-0.5">📋 원문 (Official Text)</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic bg-red-50/60 dark:bg-red-900/10 rounded px-2 py-1">{stateData.sodiumRule.noteEn}</p>
                  </div>
                )}
              </div>
            )}

            {/* FSMP Medicaid */}
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                FSMP — Medicaid 급여 성분 기준 ({stateData.name})
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{stateData.fsmpMedicaid}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MethodologySection = () => (
  <div className="space-y-6 max-w-4xl">
    <h2 className="text-2xl font-bold flex items-center gap-3">
      <FileText className="size-7 text-primary" />
      AI-Driven Data Verification Methodology
    </h2>
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold">NotebookLM Integration</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Regu-Lens utilizes Google's <strong>NotebookLM</strong> to process and verify complex regulatory documents from MFDS, FDA, and EFSA. Our AI engine cross-references raw legal texts with historical data to ensure 99.9% accuracy in our advisory columns.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-primary uppercase mb-1">Step 1</p>
          <p className="text-sm font-bold">Source Ingestion</p>
          <p className="text-[10px] text-slate-500 mt-1">Direct PDF/URL scraping from official gov portals.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-primary uppercase mb-1">Step 2</p>
          <p className="text-sm font-bold">Contextual Analysis</p>
          <p className="text-[10px] text-slate-500 mt-1">NotebookLM identifies specific ingredient limits and deadlines.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-primary uppercase mb-1">Step 3</p>
          <p className="text-sm font-bold">R&D Advisory</p>
          <p className="text-[10px] text-slate-500 mt-1">AI generates actionable insights for formulation teams.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [isGeneralFoodOpen, setIsGeneralFoodOpen] = useState(true);
  const [isFunctionalFoodOpen, setIsFunctionalFoodOpen] = useState(true);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Europe (EFSA)');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedMapCountry, setSelectedMapCountry] = useState<string | null>(null);
  const [hoveredMapCountry, setHoveredMapCountry] = useState<string | null>(null);
  const [timelinePage, setTimelinePage] = useState(0);

  const comparisonData = [
    {
      category: "영양소 비율 (탄수화물/당류)",
      subCategory: "당뇨용 FSMP 다량영양소",
      korea: "탄수화물 50-60%, 단백질 15-20%, 지방 20-25%. 단순당은 총 열량의 10% 미만이어야 함.",
      other: "고정 비율 없음. 의사 평가를 통해 '특수한 영양 요건(distinctive nutritional requirements)'을 충족해야 함 (21 CFR 101.9).",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "저GI 유지를 위해 서방형 탄수화물(Isomaltulose) 활용 제형 개발 검토. MFDS 비율 기준 동시 충족.",
      country: "USA (FDA)"
    },
    {
      category: "식품 첨가물 (감미료)",
      subCategory: "Reg 1333/2008 Cat 13.2",
      korea: "식품첨가물 공전 허용 목록 기준. Sucralose·Acesulfame K 허용.",
      other: "Cat 13.2에서 합성감미료의 mg/kg 허용 기준이 한국(Quantum Satis) 대비 엄격 적용.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "EU Cat 13.2 개별 기준(예: Acesulfame K 최대 450mg/kg)과 감미료 사용량 교차 확인 필수.",
      country: "Europe (EFSA)"
    },
    {
      category: "신규 식품 성분 허가",
      subCategory: "혁신 원료",
      korea: "알루로스 최대 10% 허용. 신규 성분은 MFDS 개별인정 취득 필요.",
      other: "Novel Food Regulation (EU) 2015/2283 적용. EFSA 과학적 의견서 제출 포함 장기 허가 절차 필요.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "EU 시장 내 신규 원료 출시 전 EFSA 사전 상담(Pre-submission) 권장.",
      country: "Europe (EFSA)"
    },
    {
      category: "포장재 규제 (플라스틱·포장재)",
      subCategory: "재활용 등급 제도 — PPWR vs 자원재활용법",
      korea: "자원재활용법 포장재 재질·구조 개선 기준 — 재활용 최우수/우수/보통/어려움 4단계 등급. '어려움' 등급 포장재 출고 제한·부담금 부과(환경부).",
      other: "PPWR (EU) 2025/40 Art.6 — 재활용 등급 A(최우수)~D(재활용 불가) 4단계. 위임규정(DA) 발효 후 D등급 시장 출시 단계적 금지. A·B 등급 의무 비율 로드맵 적용.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "PPWR 위임규정(DA) 확정 후 EU 등급 기준 재확인 필수. 한국 '최우수·우수' ≈ EU A/B 등급 대응 가능성 높으나 세부 기준 상이. DA 발효 직후 EU 수출 포장재 등급 평가 즉시 착수 권고.",
      country: "Europe (EFSA)"
    },
    {
      category: "포장재 규제 (플라스틱·포장재)",
      subCategory: "디지털 포장 여권 (DPP) — PPWR Art. 12",
      korea: "자원재활용법·제품 생태설계 제도에 디지털 여권(DPP) 개념 미도입. 환경부 포장재 DB 운영 중이나 공급망 공개 의무 없음.",
      other: "PPWR Art.12 — 2026.08.11부터 EU 유통 포장재 전 품목 DPP 의무 등록. QR 코드 포함 재질·성분·재활용 방법 공개. 미등록 시 EU 시장 출시 불가.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "⚠️ EU 수출 포장재 2026.08까지 DPP 등록 완료 필수. DPP 플랫폼 파트너 조기 선정 및 QR 코드 체계 설계 착수 권고.",
      country: "Europe (EFSA)"
    },
    {
      category: "포장재 규제 (플라스틱·포장재)",
      subCategory: "재활용 원료 함량 의무 — PPWR Art. 7",
      korea: "자원재활용법 EPR 재활용 의무율 달성 의무 있으나, 포장재에 재활용 원료(recycled content) 사용 의무 비율 규정 없음(권고 수준).",
      other: "PPWR Art.7 — PET 포장재 30%(2030)→50%(2040), 기타 플라스틱 포장재 10%(2030)→25%(2040) 재활용 원료 의무 사용. 식품 접촉 포장재 특례 병행 적용.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "한국에 없는 의무 — EU 수출 포장재 원료 조달 전략 전면 재검토 필요. 2030 의무화 대비 공급업체 rPET·재활용 원료 인증 소재 조기 확보 권고.",
      country: "Europe (EFSA)"
    },
    {
      category: "포장재 규제 (PFAS·식품 접촉재)",
      subCategory: "PFAS — 식품 접촉 종이·판지 포장재",
      korea: "식품위생법 기구·용기·포장 기준 — PFAS 총합 기준 없음. PFOS 0.008 mg/kg, PFOA 0.025 mg/kg 개별 기준만 적용. 종이·판지 PFAS 총합 규제 미정비.",
      other: "(EU) 2023/2206 — 식품 접촉 종이·판지 PFAS 총합 ≤25 ng/g 의무. PFOA·PFOS 불검출(ND) 의무. EN 17621 분석법 기준 시험성적서 필수.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "EU 수출 식품 접촉 종이·판지 포장재 PFAS 총합 25ng/g 이하 검증 필수. 한국 기준보다 현저히 엄격한 총합 규제 — 수출 포장재 원료 전환 및 EN 17621 시험 의뢰 즉시 착수 권고.",
      country: "Europe (EFSA)"
    },
    {
      category: "포장재 규제 (일회용 플라스틱 SUP)",
      subCategory: "SUP 금지 품목 vs 한국 일회용품 규제",
      korea: "자원재활용법 제41조 — 매장 내 일회용컵·빨대·비닐 무상 제공 금지(음식점·카페). 발포PS(스티로폼) 컵 단계적 폐지 계획 중. 전면 제조·유통 금지는 미시행.",
      other: "SUP (EU) 2019/904 — 발포PS 컵·뚜껑·음식 용기, 플라스틱 수저·포크·나이프·젓가락, 면봉, 빨대 2021.07.03부터 제조·수입·유통 전면 금지. 한국보다 금지 범위 광범위, 이미 전면 시행.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "EU 수출 식품 포장에 발포PS(EPS) 용기·뚜껑·수저류 사용 불가. 종이·PLA·사탕수수 기반 대체 포장재 전환 필수. 한국 '매장 내 사용 금지'와 달리 EU는 제조·수입 단계부터 전면 금지.",
      country: "Europe (EFSA)"
    },
    {
      category: "표시 사항 (알레르겐)",
      subCategory: "특정 원재료",
      korea: "잣·메밀·복숭아 포함 22종 의무 표시.",
      other: "의무 알레르겐 8종(2025년 호두 추가) + 권장 20종.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "일본 수출용 알레르겐 표시에 '호두(Walnut)' 추가. 표시 폰트·위치 기준 준수 여부 확인.",
      country: "Japan (MHLW)"
    },
    {
      category: "건강 강조 표시",
      subCategory: "기능성 표시",
      korea: "건강기능식품 표시는 MFDS 승인 필요. 허가된 표현만 사용 가능.",
      other: "기능성표시식품(FoSHU) 제도 적용. 소비자청(CAA) 승인 신청 필요.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "FoSHU 기준으로 일본용 건강 강조 표시 서류 별도 준비. 승인 소요 기간 6~12개월 고려.",
      country: "Japan (MHLW)"
    },
    {
      category: "의무 경고 표시",
      subCategory: "안전 문구",
      korea: "'환자 전용' 및 '의사 지도 하 사용' 문구 의무 표시.",
      other: "'非肠外营养(정맥 주사용 불가)' 경고 문구 필수 표시. 수입 전 SAMR 등록 의무.",
      gap: "기준 일치",
      gapColor: "teal",
      advice: "수출 전 SAMR 등록 완료. 경고 문구가 GB 기준에 적합한지 확인 필수.",
      country: "Taiwan (TFDA)"
    },
    {
      category: "원료 허가 목록",
      subCategory: "허용 첨가물",
      korea: "MFDS 식품첨가물 공전 기준. 전반적으로 광범위한 허용 목록.",
      other: "GB 2760 식품첨가물 기준이 허용 성분을 엄격히 제한. 한국 허용 성분 다수가 미등재.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "중국 수출 제형 개발 전 모든 원료를 GB 2760과 교차 확인. 성분 대체가 필요할 수 있음.",
      country: "Taiwan (TFDA)"
    },
    {
      category: "영양 표시 형식",
      subCategory: "라벨 표시 요건",
      korea: "MFDS 기준 영양성분표 적용. kJ·kcal 병기 의무.",
      other: "FDA Nutrition Facts 라벨(21 CFR 101.9) 기준. 첨가당(Added Sugars)·비타민D 의무 표시.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "미국 수출용 라벨에 첨가당 표시 및 최신 Daily Values 기준 적용하여 별도 라벨 설계.",
      country: "USA (FDA)"
    },
    {
      category: "식품 첨가물 (색소·감미료)",
      subCategory: "GB 2760 허용 목록",
      korea: "MFDS 식품첨가물 공전 기준 적용. 타르트라진·선셋옐로우 허용(용도·한도 내). 아스파탐·수크랄로스 허용.",
      other: "GB 2760 허용 목록에 없는 성분 사용 전면 금지. 일몰황 100mg/kg 한도(GB 2760-2024, 시행 중). 사이클라민산나트륨 한도 내 허용.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "수출 제형 내 모든 첨가물을 GB 2760 최신 목록과 교차 확인 필수. 한국 허용 성분 중 중국 미등재 성분(적색2호 등) 즉시 대체 검토.",
      country: "China (SAMR)"
    },
    {
      category: "수입 허가 및 등록 절차",
      subCategory: "GACC 해외생산업체 등록",
      korea: "수출 식품에 대해 MFDS 수출위생증명서 발급 가능.",
      other: "GACC(해관총서) 해외식품생산업체 등록 의무(2021 개정). 등록 없이 중국 수출 불가. 등록 12-18개월 소요.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "중국 수출 전 GACC 등록 완료 여부 즉시 확인. 미등록 업체는 중국 파트너사(수입자)를 통한 대리 신청 가능 여부 검토.",
      country: "China (SAMR)"
    },
    {
      category: "라벨링 요건",
      subCategory: "중국어 표시 의무",
      korea: "한국어 라벨 기본. 수출 시 수입국 언어 표시 별도 부착 허용.",
      other: "모든 수입 식품에 중국어 라벨 필수. GB 7718 기준: 제품명·성분·보관방법·생산일·유통기한·원산지 등 중국어 필수 기재.",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "중국어 라벨 번역 정확성 검증 필수(특히 기능 표시·경고 문구). 수입업체에 라벨 부착 전 SAMR 사전 확인 요청 권고.",
      country: "China (SAMR)"
    },
    {
      category: "식품 첨가물 (색소·보존료)",
      subCategory: "Circular 24 허용 목록",
      korea: "MFDS 첨가물 공전 기준. 아조계 색소 허용(한도 내). Potassium Bromate 사용 금지.",
      other: "Circular 24 미등재 첨가물 전면 금지. Potassium Bromate 전면 금지. 타르트라진·선셋옐로우 한도 강화. 아조계 색소 한도 엄격 적용.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "수출 제형 내 색소·보존료 전체를 Circular 24 최신 기준과 비교 검토. Potassium Bromate 미사용 원료 공급망 확인. 아조계 색소 대체 성분(안나토, 파프리카 추출물) 검토 권장.",
      country: "Vietnam (VFA)"
    },
    {
      category: "수입 허가 절차",
      subCategory: "VFA 수입 허가(Import Permit)",
      korea: "MFDS 수출위생증명서 발급. 수입국 요건에 맞춰 서류 제출.",
      other: "VFA 수입 허가 사전 취득 의무. 2026.01부터 온라인 신청 전환. Self-Declaration 적합성 증명 의무화.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "2026.01 VFA 온라인 신청 시스템 등록 사전 완료 필수. Self-Declaration용 성분 적합성 검토 자료(첨가물 규격서, 검사 성적서) 미리 준비.",
      country: "Vietnam (VFA)"
    },
    {
      category: "라벨링 요건",
      subCategory: "베트남어 표시 의무",
      korea: "한국어 라벨 기본. 수출 시 베트남어 라벨 별도 부착.",
      other: "베트남어 라벨 의무(Nghị định 43/2017). 제품명·성분·제조일·유통기한·원산지·수입업체 정보 필수 기재.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "⚠️ Decree 46/2026 전환(2026.04.16 재시행). 자기선언→정부 심사 방식 변경. 고위험 품목·신규 수입업체 검사 강화. 통관 7영업일 이상 예상. 베트남어 라벨 번역 및 현지 수입업체와 라벨 형식 사전 협의 필수. 유통기한 표기 형식(DD/MM/YYYY) 준수.",
      country: "Vietnam (VFA)"
    },
    {
      category: "금지 성분 (감미료)",
      subCategory: "Cyclamate 전면 금지",
      korea: "사이클라민산나트륨(Cyclamate) 식품 내 사용 허용(한도 내).",
      other: "Cyclamate 태국 식품 내 전면 사용 금지. 허용 감미료: 수크랄로스·아스파탐·아세설팜K·스테비아(한도 내).",
      gap: "주요 차이",
      gapColor: "rose",
      advice: "Cyclamate 함유 제품 태국 수출 즉시 중단. 국내 제형에서 Cyclamate 사용 여부 재확인. 스테비아·수크랄로스로 대체 검토 권장.",
      country: "Thailand (Thai FDA)"
    },
    {
      category: "식품 첨가물 (색소)",
      subCategory: "타르트라진 Tartrazine 한도 강화",
      korea: "타르트라진(황색5호, E102) 허용(음료·제과류 한도 내).",
      other: "타르트라진 최대 50mg/kg으로 강화(MOPH Notification No. 468, 2025.12.12 시행). 아조계 색소 전반적 한도 강화.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "타르트라진 사용량이 50mg/kg 초과하는 제품 즉시 성분 조정. 대체 천연 색소(강황·치자황색소) 적용 여부 검토. 2025.07 이후 기존 재고 수출 가능 여부 확인 필수.",
      country: "Thailand (Thai FDA)"
    },
    {
      category: "수입 허가 절차",
      subCategory: "Thai FDA 제품 등록",
      korea: "MFDS 수출위생증명서 발급. 제품별 현지 법령 준수 자체 확인.",
      other: "태국 FDA 수입 허가 및 제품 등록 의무. 2026.04부터 온라인 통합 시스템 갱신. 2년 주기 허가 갱신.",
      gap: "중간 차이",
      gapColor: "amber",
      advice: "2026.04 통합 온라인 포털 출시 전 현지 수입업체와 협력하여 사전 등록 완료. 허가 갱신 일정 관리 체계 수립 필요.",
      country: "Thailand (Thai FDA)"
    },
    // Indonesia rows
    { country: 'Indonesia (BPOM)', category: '식품 안전', subCategory: '식품 첨가물 (감미료)', korea: '스테비아·수크랄로스·아세설팜K 허용 (Cyclamate 불허)', other: '감미료 BPOM 허가 목록 내 성분만 허용. Cyclamate 허용 (INS 952). Saccharin은 특정 카테고리만 허용', gap: '중간 차이', gapColor: 'amber', advice: 'BPOM Permenkes 33/2012 감미료 목록 확인 필수. 한국 허용이라도 BPOM 미승인 감미료 수출 불가', halal: '감미료 원료의 돼지 유래 여부 BPJPH 인증 시 확인 필요' },
    { country: 'Indonesia (BPOM)', category: '표시 기준', subCategory: '표시 사항 (할랄 표기)', korea: '할랄 표시는 임의 (민간 인증 기관)', other: '2026.10.17부터 가공식품 전 품목 BPJPH 할랄 인증 의무화. 미인증 제품은 수입·판매 불가', gap: '주요 차이', gapColor: 'rose', advice: '수출 전 BPJPH 할랄 인증 취득 또는 할랄 인증 파트너사 통해 OEM 필요. MUI 인증도 인정', halal: 'BPJPH 필수 — 미인증 제품 통관 불가 (2026.10.17~)' },
    { country: 'Indonesia (BPOM)', category: '제품 허가', subCategory: '원료 허가 목록', korea: '식약처 기능성 원료 개별 인정 또는 고시 원료', other: 'BPOM ML 번호 등록 필수. 신규 기능성 원료는 BPOM 사전 허가 필요 (Pangan Fungsional)', gap: '중간 차이', gapColor: 'amber', advice: 'ML 번호 없이는 통관 불가. 등록 기간 6~12개월 예상. 현지 수입업자 통해 대리 등록 가능', halal: '원료의 할랄 적합성 서류 (CoA + 할랄 인증) BPOM 제출 필요' },
    // Philippines rows
    { country: 'Philippines (FDA PH)', category: '식품 안전', subCategory: '식품 첨가물 (색소)', korea: 'Azo 색소 허용 (Tartrazine 등), 표시 의무', other: 'Tartrazine·Sunset Yellow·Allura Red 허용 (Codex 준용). 단, FDA AO 기준 초과 시 불허', gap: '기준 일치', gapColor: 'teal', advice: 'Codex 기준 준용으로 한국 대비 허용 기준 유사. 단, 라벨에 색소명 및 기능 표시 의무' },
    { country: 'Philippines (FDA PH)', category: '제품 허가', subCategory: '원료 허가 목록', korea: '식약처 기능성 원료 개별 인정 또는 고시 원료', other: 'CPR 등록 시 모든 원료 명세 제출 필요. Novel Food 원료는 FDA AO 2020-0023 사전 허가', gap: '중간 차이', gapColor: 'amber', advice: 'CPR 등록 6~12개월 소요. 현지 LTO 보유 수입업자 통해 등록 권장' },
    { country: 'Philippines (FDA PH)', category: '표시 기준', subCategory: '영양 표시 형식', korea: 'MFDS 영양성분 표시 기준 (1일 섭취기준 기반)', other: 'FDA Recommended Daily Allowance (RDA) 기반 표시. 영어 의무. 포장 전면 영양 정보 강화 검토 중', gap: '중간 차이', gapColor: 'amber', advice: '한국 영양 표시와 RDA 수치 상이. 수출 라벨 별도 제작 필요. 과자·음료류 당류·나트륨 강조 표시 권장' },
    // Canada rows
    { country: 'Canada (CFIA)', category: '식품 안전', subCategory: '식품 첨가물 (감미료)', korea: '스테비아·수크랄로스·아세설팜K 허용 (Cyclamate 불허)', other: 'Cyclamate 불허 (1969년 금지). Stevia(Steviol Glycosides) 2012년 허용. Sucralose·Acesulfame-K 허용', gap: '기준 일치', gapColor: 'teal', advice: 'Cyclamate 미사용 제품은 한국-캐나다 기준 유사. 수크랄로스 사용량 FDR 기준 확인 필요' },
    { country: 'Canada (CFIA)', category: '표시 기준', subCategory: '영양 표시 형식', korea: 'MFDS 영양성분 표시 기준', other: '2026.01.01부터 FOPL(Front-of-Pack Labelling) 의무화 — 고당류·고나트륨·고포화지방 경고 마그네틱 라벨', gap: '주요 차이', gapColor: 'rose', advice: 'FOPL 도입으로 고당류 제품 수출 시 경고 라벨 부착 필수. 영어·불어 이중 표기 의무. 별도 캐나다 라벨 제작 필요' },
    { country: 'Canada (CFIA)', category: '제품 허가', subCategory: '신규 식품 성분 허가', korea: '식약처 개별 인정 절차 (60~90일)', other: 'Health Canada Novel Food 사전 고지(45일 검토). NHP(천연 보건제품)는 NPN 번호 발급 필수 (180일~)', gap: '중간 차이', gapColor: 'amber', advice: 'NHP 제품(비타민·허브 등)은 NPN 없이 판매 불가. Novel Food 45일 고지 + 문서 준비 권장' },
    { country: 'Malaysia (MOH/JAKIM)', category: '식품 안전 기준', subCategory: '할랄 인증 (Halal)', korea: 'MFDS 할랄 표시 자율', other: 'JAKIM 할랄 인증 의무 (MS1500)', gap: '주요 차이', gapColor: 'rose', advice: 'JAKIM 인증 취득 시 MRA 협정 8개국(인도네시아·브루나이·싱가포르·GCC 6개국) 시장 동시 진출 가능. 돼지·알코올 유래 성분 전면 대체 필요.', halal: '의무 (JAKIM 인증)' },
    { country: 'Malaysia (MOH/JAKIM)', category: '식품 안전 기준', subCategory: 'JAKIM MRA 상호인정 전략', korea: '수출국별 개별 인증 취득', other: 'JAKIM 1회 인증 → MRA 협정국 동시 인정 (인도네시아 BPJPH, 브루나이 MUIB, 싱가포르 MUIS, GCC 6개국)', gap: '전략적 활용', gapColor: 'teal', advice: 'JAKIM 인증 취득 후 MRA 협정국 서류 활용으로 별도 인증 비용·기간 절감. 인도네시아 BPJPH 상호인정 특히 유효 — 2026.10 의무화 대응에 활용 가능.', halal: 'JAKIM → MRA 협정 8개국 통용' },
    { country: 'Malaysia (MOH/JAKIM)', category: '신규 성분 허가', subCategory: '알룰로스 (Allulose) 현황', korea: '알룰로스 허용 (최대 10% 제한, MFDS 고시)', other: '⚠️ 조건부 허용 — Food Regulations 1985 감미료 목록 등재 확인 + JAKIM 할랄 공정 증명 필요', gap: '중간 차이', gapColor: 'amber', advice: '알룰로스 원료 생산 공정이 알코올 발효 방식인 경우 JAKIM 할랄 인증 취득 불가. 비알코올 공정 원료 소싱 또는 Stevia·Monk Fruit로 대체 검토.', halal: '할랄 공정 증명 필수 (알코올 추출 공정 불허)' },
    { country: 'Malaysia (MOH/JAKIM)', category: '표시 기준', subCategory: 'MeSTI 인증', korea: 'HACCP 의무', other: 'MeSTI 또는 HACCP 의무', gap: '중간 차이', gapColor: 'amber', advice: '한국 HACCP 인증서 현지 인정 여부 사전 확인. MeSTI 별도 취득 권장.', halal: 'N/A' },
    { country: 'Malaysia (MOH/JAKIM)', category: '식품 첨가물', subCategory: '식품 첨가물 (색소·감미료)', korea: 'MFDS 허용 목록 기준', other: 'Food Regulations 1985 허용 목록 적용', gap: '중간 차이', gapColor: 'amber', advice: '말레이시아 허용 색소·감미료 목록 사전 확인. 타르트라진 등 아조계 색소 한도 별도 적용.', halal: 'N/A' },
    { country: 'Australia (FSANZ)', category: '식품 안전 기준', subCategory: '바이오보안 수입 허가', korea: '축산물 검역 의무', other: '바이오보안 수입 허가(DAFF) 의무 — 육류·난황·유청 포함 제품', gap: '주요 차이', gapColor: 'rose', advice: '⚠️ Biosecurity Risk: 단백질 강화·FSMP 제품 내 육류·난황 성분 포함 시 수입 허가 사전 취득 필수. 처리 기간 3~6개월.', halal: 'N/A' },
    { country: 'Australia (FSANZ)', category: '신규 성분 허가', subCategory: '신규 식품 성분 허가', korea: '식품위생법 제7조 허가', other: 'FSANZ Novel Food 심사 (Standard 1.1.1)', gap: '주요 차이', gapColor: 'rose', advice: '알룰로스 현재 미허가(Novel Food 검토 중). 허가 전 함유 제품 수출 불가. 2026년 말 결정 예정.', halal: 'N/A' },
    { country: 'Australia (FSANZ)', category: '표시 기준', subCategory: '영양 표시 형식', korea: '영양성분 표시 의무(식품표시법)', other: 'Health Star Rating 자율 권장 + FSANZ 의무 영양 표시', gap: '중간 차이', gapColor: 'amber', advice: '호주 수출 시 Health Star Rating 시뮬레이션 권장. 1.5성 미만 시 시장 경쟁력 불이익 우려. 사전 HSR 계산기 활용.', halal: 'N/A' },
    { country: 'UAE (MoIAT)', category: '표시 기준', subCategory: '아랍어 의무 표기', korea: '한국어 의무', other: '아랍어 의무 표기 (ESMA)', gap: '주요 차이', gapColor: 'rose', advice: '성분명·알레르겐·영양성분·유통기한 전 항목 아랍어 병기 의무. 전문 번역 업체 활용 필수.', halal: 'N/A' },
    { country: 'UAE (MoIAT)', category: '표시 기준', subCategory: 'GSO 영양 표시 2026 개정', korea: 'MFDS 영양성분 표시 기준 (1일 영양성분 기준치 기반)', other: 'GSO 영양 표시 2026 개정판 — 1회 제공량 기준 표시 형식 통일, GCC 전체 동일 기준 적용', gap: '주요 차이', gapColor: 'rose', advice: '2026.09.01 GSO 개정판 전면 적용. 한국 라벨과 단위·형식 상이 — 1회 제공량 기준 영양 표시로 별도 UAE 전용 라벨 제작 필요. 에너지 단위 kJ/kcal 병기 의무.', halal: 'N/A' },
    { country: 'UAE (MoIAT)', category: '신규 성분 허가', subCategory: '알룰로스 (Allulose) 현황', korea: '알룰로스 허용 (최대 10%, MFDS 고시)', other: '🚫 GSO 허용 감미료 목록 미등재 — 개별 성분 허가 신청 필요', gap: '주요 차이', gapColor: 'rose', advice: '알룰로스 포함 제품 UAE 수출 불가(GSO 미등재). ESMA 개별 성분 허가 신청 시 장기 소요 예상. 단기 전략으로 GSO 허용 Stevia·Monk Fruit 대체 권장. 설탕세 영향 고려 저당 제품 설계 필수.', halal: 'N/A' },
    { country: 'UAE (MoIAT)', category: '식품 안전 기준', subCategory: '할랄 인증 (Halal)', korea: '할랄 표시 자율', other: '할랄 인증 사실상 필수 (ECAS/ESMA 승인 기관)', gap: '주요 차이', gapColor: 'rose', advice: '동물성 유래 성분 포함 제품은 ECAS·ESMA 승인 할랄 인증 기관 인증서 필수. 미인증 제품 통관 거부 사례 빈발.', halal: '의무 (ECAS/ESMA)' },
    { country: 'UAE (MoIAT)', category: '세금·부담금', subCategory: '설탕세 (Sugar Tax)', korea: '해당 없음', other: '가당 음료 50%, 에너지드링크 100% 과세 (FTA 2017). 가당 제과류까지 확대 논의 중', gap: '주요 차이', gapColor: 'rose', advice: '고당류 음료·에너지드링크 수출 시 가격 경쟁력 영향 분석 필수. 제과류 설탕세 확대(2026 하반기 결정 예정) 모니터링 필요. 저당·무가당 제품군 전환 검토 권장.', halal: 'N/A' },
    // Russia/EAEU rows
    { country: 'Russia/EAEU (EAC)', category: '인증·등록 절차', subCategory: 'EAC 인증 + СГР 등록', korea: 'MFDS 수출위생증명서 발급', other: 'EAC 인증(유라시아 적합성 마크) + 국가 위생등록(СГР) 필수 — 미인증 시 러시아·카자흐스탄·벨라루스 등 5개국 수출 전면 불가', gap: '주요 차이', gapColor: 'rose', advice: 'EAC 인증 취득 1회로 EAEU 5개국(러시아·카자흐스탄·벨라루스·키르기스스탄·아르메니아) 동시 수출 가능. 등록 기간 6~12개월 예상 — 조기 착수 필수.' },
    { country: 'Russia/EAEU (EAC)', category: '식품 첨가물', subCategory: 'E171 vs EU 차이', korea: 'E171 사용 가능 (한도 내)', other: '⚠️ EAEU에서 E171(이산화티타늄) 사용 가능 — EU 2022.02 금지, 프랑스 2021.01 금지와 상이한 EAEU 규정', gap: '중간 차이', gapColor: 'amber', advice: 'EU·EAEU 이중 수출 제품은 E171 성분 유무에 따라 별도 제형 관리 필수. EAEU 전용 라인은 E171 허용, EU·영국·프랑스 전용 라인은 대체 성분 사용.' },
    { country: 'Russia/EAEU (EAC)', category: '표시 기준', subCategory: '러시아어 라벨 + EAC 마크 의무 규격', korea: '한국어 라벨 기본 / KC 마크 위치 자율', other: '러시아어 전면 표기 의무(TR TS 022/2011). 성분명·기능·보관방법·제조일·유통기한 러시아어 필수. 번역 오류 시 통관 거부', gap: '주요 차이', gapColor: 'rose', advice: '러시아어 라벨 번역 전문 업체 활용 필수. 성분명 러시아어 정식 명칭 확인(IUPAC 기반). 현지 수입업자와 라벨 사전 검토 프로세스 수립 권장.' },
    { country: 'Russia/EAEU (EAC)', category: '의무 경고 표시', subCategory: '🚨 EAC 마크 부착 위치 · 폰트 크기 규제', korea: 'KC 마크 부착 위치·크기 자율 (소비자보호법 기준)', other: '[Mandatory Warning] TR TS 005/2011(포장·라벨) 및 EAEU 기술규정: ① EAC 마크(Знак обращения) 높이 최소 5mm 이상 ② 주요 표시면(principal display panel) 또는 정보 패널에 단독 배치 ③ 주변 다른 마크·텍스트와 명확히 분리 ④ 흑백 대비 선명 인쇄 의무 ⑤ 마크 훼손·축소 시 통관 거부 처리 가능. 부착 위치는 소비자가 쉽게 볼 수 있는 면 우선', gap: '주요 차이', gapColor: 'rose', advice: '⚠️ Mandatory Warning: EAC 마크는 단순 스티커 부착 불가 — 포장재에 직접 인쇄 또는 영구 부착 방식 요구. 높이 5mm 미만 마크 사용 시 통관 거부 사례 다수. 한국 KC 마크 기준과 달리 EAEU EAC 마크는 크기·위치·폰트까지 TR TS 규정으로 명확히 규제됨. 수출 전 EAC 마크 규격 준수 여부 패키지 디자인 단계에서 반드시 확인.' },
    // Hong Kong rows
    { country: 'Hong Kong (CFS/FEHD)', category: '표시 기준', subCategory: '영어+번체자 병기 의무', korea: '한국어 표기 의무', other: '영어 + 번체 중국어(Traditional Chinese) 병기 표시 의무. 간체자(Simplified Chinese) 단독 표기 불인정 — 판매 금지 조치', gap: '주요 차이', gapColor: 'rose', advice: '중국 본토용 간체자 라벨 홍콩 유용 절대 불가. 홍콩 전용 번체자 라벨 별도 제작. 번체자 번역 품질 검수(臺灣·홍콩 현지 번역사 활용 권장).' },
    { country: 'Hong Kong (CFS/FEHD)', category: '인증·등록 절차', subCategory: '사전 등록 불필요', korea: 'MFDS 수출위생증명서 발급', other: 'Pre-market approval 불필요 — 단, 사후 위반 시 즉각 판매 금지·회수 조치. Codex 기준 준용으로 대부분 성분 허용', gap: '기준 일치', gapColor: 'teal', advice: '사전 등록 불필요로 시장 진입 상대적 용이. 단, Cap 132W 라벨 기준 위반 시 FEHD 즉각 조치. 수출 전 CFS 라벨 체크리스트 자체 검토 권장.' },
    // UK Post-Brexit rows
    { country: 'UK (FSA) [Post-Brexit]', category: '식품 첨가물', subCategory: 'E171 UK 독자 판단', korea: 'E171 사용 가능 (한도 내)', other: '⚠️ EU 금지(2022.02) 자동 적용 불확실 — UK FSA 독자 검토 중. Northern Ireland 판매 시 EU 금지 적용', gap: '주요 차이', gapColor: 'rose', advice: 'UK FSA E171 최신 결정 상시 모니터링 필수. EU·UK 동시 수출 시 E171 무함유 제형으로 통일 권장(리스크 최소화). NI 판매 시 EU 기준 적용 확인.' },
    { country: 'UK (FSA) [Post-Brexit]', category: '인증·등록 절차', subCategory: 'DEFRA IPAFFS 입항 신고', korea: 'MFDS 수출위생증명서 발급', other: 'DEFRA IPAFFS(Import of Products, Animals, Food and Feed System) 사전 신고 의무. 동물성 식품 포함 제품 수입 허가 사전 취득 필요', gap: '주요 차이', gapColor: 'rose', advice: 'IPAFFS 사전 등록 없이 UK 입항 불가. 동물성 성분 포함 제품 DEFRA 수입 허가 처리 기간 고려. 현지 수입업자(UK Responsible Person) 지정 필수.' },
    { country: 'UK (FSA) [Post-Brexit]', category: '신규 성분 허가', subCategory: 'UK Novel Food 독자 심사 (FSA)', korea: '식품위생법 제7조 허가 — MFDS/EFSA 승인 참조', other: 'Brexit 이후 EU EFSA Novel Food 승인이 UK에 자동 적용 안 됨. 영국 FSA(식품기준청)가 독립적으로 Novel Food 심사·승인. UK FSA 심사 기간 18~36개월', gap: '주요 차이', gapColor: 'rose', advice: '⚠️ R&D Action: 영국은 이제 EU EFSA가 아닌 영국 FSA(Food Standards Agency)가 별도로 Novel Food 승인. EU 허가 = UK 허가 아님. EU Novel Food 허가와 UK FSA 신청을 동시에 또는 순차 진행하는 이중 트랙 전략 필수. 알룰로스·미세조류·NMN 등 신규 성분 UK 수출 전 FSA Novel Food 심사 상태 별도 확인 요망.' },
    // Switzerland rows
    { country: 'Switzerland (FSVO)', category: '인증·등록 절차', subCategory: 'EU MRA 활용 전략', korea: 'MFDS 수출위생증명서 발급', other: 'EU와 MRA(상호인정협정) 체결 — EU 허가 성분 대부분 인정. 단, 스위스 독자 ZuV·VNL 목록 교차 확인 필요', gap: '기준 일치', gapColor: 'teal', advice: 'EU 허가 취득 후 MRA를 통해 스위스 진입 효율적. 단, MRA 자동 적용 여부 FSVO 사전 확인 필수. 독어·불어·이탈리아어 중 1개 라벨 추가 제작 필요.' },
    { country: 'Switzerland (FSVO)', category: '유기농 인증', subCategory: 'Bio Suisse 인증 의무', korea: '국립농산물품질관리원 유기농 인증', other: '유기농 표시 시 Bio Suisse 또는 CH-BIO 인증 필수 — EU 유기농 인증만으로 스위스 "Bio" 표기 불가', gap: '주요 차이', gapColor: 'amber', advice: 'EU 유기농 인증(EU Organic)과 별개 — Bio Suisse 별도 취득 필요. 유기농 시장 프리미엄 높음. 인증 취득 후 스위스 유기농 프리미엄 시장 진입 검토 권장.' },
    { country: 'Switzerland (FSVO)', category: '표시 기준', subCategory: '🚨 "천연(Natural)" 표기 — EU보다 엄격한 스위스 기준', korea: '"천연" 표기 자율 (식품 공전 정의 기준)', other: '[Strict Local Rule] 스위스 LMG + FSVO 가이드라인: "Natürlich / Naturel / Naturale(천연)" 표기는 EU 기준보다 현저히 엄격. ① 인공 향료·색소·방부제 전 무함유 ② 최소 가공(min. processing) 원칙 ③ 합성 첨가물 완전 배제 ④ GMO 성분 불허 — 4가지 조건 동시 충족 시만 "천연" 표기 허용. EU Reg 1169/2011은 "천연 향료" 정의가 비교적 넓으나 스위스는 FSVO 자체 기준으로 더 좁게 해석', gap: '주요 차이', gapColor: 'rose', advice: '⚠️ Labeling Advisory: 스위스는 유럽에서 "천연(Natural)" 표기 기준이 가장 까다로운 국가. EU에서 "천연 향료"로 허용된 성분이 스위스에서는 "천연" 표기 불가 판정 가능. 스위스 수출 제품에 "natürlich / naturel / natural" 문구 사용 전 FSVO 기준 법적 검토 필수. EU 승인 = 스위스 자동 허용 아님 — 독자 확인 절차 반드시 거칠 것.' },
    // EU Divergence — France rows
    { country: 'France [EU Deviation 🚨]', category: '식품 첨가물', subCategory: '🚨 E171 프랑스 단독 금지', korea: 'E171 사용 가능 (한도 내)', other: '[Strict Local Rule] 프랑스 2021.01.01 E171 단독 금지 — EU 전체 금지(2022.02)보다 1년 먼저 시행. 위반 시 즉각 회수·제재', gap: '주요 차이', gapColor: 'rose', advice: '🚨 프랑스 수출 제품 E171 포함 여부 즉시 점검 필수. EU 일반 허가 성분이라도 프랑스 단독 금지 성분 존재. 대체 성분(스타치·탄산칼슘·CaCO3) 전환 확인.' },
    { country: 'France [EU Deviation 🚨]', category: '표시 기준', subCategory: 'Nutri-Score 의무', korea: '영양성분 표시 의무(MFDS 기준)', other: '[Strict Local Rule] Nutri-Score(A~E 등급) 표시 의무 — EU 전체 의무화 이전 프랑스 2017년 단독 법제화', gap: '주요 차이', gapColor: 'rose', advice: 'Nutri-Score 점수 사전 시뮬레이션(온라인 계산기 활용). D·E 등급 제품 프랑스 시장 경쟁력 불이익 — 포뮬레이션 개선 또는 마케팅 전략 수정 필요.' },
    { country: 'France [EU Deviation 🚨]', category: '광고·마케팅 규제', subCategory: 'Loi Egalim 광고 제한', korea: '식품광고 자율 규제', other: '[Strict Local Rule] Loi Egalim(2018): 식품 광고 특히 어린이 대상 고당류·고지방 제품 광고 규제 강화. FSMP·특수식품 광고 추가 제한', gap: '중간 차이', gapColor: 'amber', advice: '프랑스 마케팅 자료 Loi Egalim 준수 여부 법적 검토 필수. 어린이 대상 제품 광고 특히 주의. 현지 법률 자문 업체 활용 권장.' },
    // EU Divergence — Nordic/Hungary rows
    { country: 'Nordic/Hungary [EU Deviation 🚨]', category: '세금·부담금', subCategory: '헝가리 NETA 건강세', korea: '해당 없음', other: '[EU Divergence] 헝가리 NETA(2011): 가당 음료·에너지드링크·제과류 건강세 부과. 음료 8~40 HUF/L, 가당 제과류 별도 세율', gap: '주요 차이', gapColor: 'rose', advice: '헝가리 수출 제품 NETA 세율표 기준 제품별 세금 부담 계산 필수. 수입업체가 세금 납부 — 계약 시 가격 협상에 세금 부담 반영. 저당 설계로 NETA 부과 기준 미달 제품군 전환 권장.' },
    { country: 'Nordic/Hungary [EU Deviation 🚨]', category: '세금·부담금', subCategory: '핀란드 가당음료세', korea: '해당 없음', other: '[EU Divergence] 핀란드 가당음료세: €0.11/L(0.5~8g/100mL) / €0.22/L(>8g/100mL). 가당 과일 주스·식물성 음료·유제품 음료 포함 가능', gap: '주요 차이', gapColor: 'rose', advice: '핀란드 수출 가당 음료류 당류 함량 기준 세율 부과 예상 수익성 분석 필수. 100% 과일 주스(무가당) 세금 면제 여부 확인. 저당(≤0.5g/100mL) 포뮬레이션으로 세금 완전 회피 가능.' },
    { country: 'Nordic/Hungary [EU Deviation 🚨]', category: '표시 기준', subCategory: 'Nutri-Score 국가별 차이', korea: '영양성분 표시 의무(MFDS 기준)', other: '[EU Divergence] Nutri-Score 의무: 프랑스·벨기에 의무 / 독일·스페인·네덜란드·스위스 자율 권장. EU 전체 의무화 여부 2026~2027 결정 예정', gap: '중간 차이', gapColor: 'amber', advice: 'EU 전체 의무화 이전이라도 프랑스·벨기에 수출 시 Nutri-Score 의무 표시. 독일·네덜란드는 자율이지만 표시 시 경쟁력 강점. 단일 EU 라벨에 Nutri-Score 포함 설계 권장.' },
    // ─── Part B: 2025~2026 신규 규제 행 ───────────────────────────────
    {
      country: 'Australia (FSANZ)',
      category: '표시 기준',
      subCategory: '🚨 PEAL 알레르겐 표시 (2026.02.25 시행)',
      korea: '알레르겐 8종 의무 표시 (식품 표시법)',
      other: '[즉시 시행] Food Standards Code Standard 1.2.3 개정 — Plain English Allergen Labelling(PEAL). "Tree nuts" 표기 불허 → 아몬드·캐슈·호두 등 개별 명시. "Seafood" 불허 → Fish/Crustacean/Mollusc 개별 구분. 밀(Wheat)과 글루텐(Gluten) 이중 병기 의무.',
      gap: '주요 차이',
      gapColor: 'rose',
      advice: '⚠️ 2026.02.25 이미 시행. 기존 "Tree nuts"·"Seafood" 일괄 표기 라벨 전량 비적합. Schedule 9 기준으로 알레르겐 표기 전면 감사 후 라벨 즉시 교체 필요. 뉴질랜드 동일 적용.',
      halal: 'N/A',
    },
    {
      country: 'Australia (FSANZ)',
      category: '표시 기준',
      subCategory: '알코올 음료 에너지(kJ) 표시 의무 (P1059)',
      korea: '알코올 음료 영양성분 표시 자율',
      other: 'FSANZ Standard 1.2.8 개정 — 2025.07.25 호주 식품장관 승인. 와인·맥주·증류주 등 알코올 음료에 킬로줄(kJ) 에너지 함량 표시 의무화.',
      gap: '주요 차이',
      gapColor: 'amber',
      advice: '주류 수출 시 kJ 에너지 라벨 추가 필요. 기존 주류 라벨 대규모 교체 대상. 시행일 확정 후 즉시 라벨 설계 착수 권장.',
      halal: 'N/A',
    },
    {
      country: 'China (SAMR)',
      category: '표시 기준',
      subCategory: 'GB 7718-2025 — 알레르겐 의무 표시 신설 (2027.03.16)',
      korea: '알레르겐 8종 의무 표시 (식품 표시법)',
      other: 'GB 7718-2025 (2025.03.27 발표, 2027.03.16 시행) — 중국 최초 알레르겐 의무 표시 규정. 8종(글루텐·갑각류·어류·달걀·땅콩·대두·우유·견과류) 원재료 목록 내 의무 표시. 수입 식품 전용 Chapter 8 신설.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '2027.03.16 시행까지 1년 여 남음. 중국어 라벨 알레르겐 항목 사전 추가 설계 권장. Chapter 8 수입 식품 전용 표시 요건 별도 검토 필수.',
      halal: 'N/A',
    },
    {
      country: 'China (SAMR)',
      category: '표시 기준',
      subCategory: 'GB 28050-2025 — 영양성분 표시 기준 전면 개정 (2027.03.16)',
      korea: 'MFDS 영양성분 표시 기준',
      other: 'GB 28050-2025 (2025.03.27 발표, 2027.03.16 시행) — GB 7718-2025와 동시 적용. 영양성분 표시 기준 전면 개정: 에너지·단백질·지방·탄수화물·나트륨 표시 형식·단위 업데이트.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '2027.03.16 시행. GB 7718-2025 라벨 개정 작업 시 동시 반영 권장. 중국 전용 영양성분표 재설계 필요.',
      halal: 'N/A',
    },
    {
      country: 'Vietnam (VFA)',
      category: '인증·등록 절차',
      subCategory: '🚨 Decree 46/2026 — 위험 기반 수입 검사 (2026.04.16 재시행)',
      korea: 'MFDS 수출위생증명서 + 자기선언',
      other: '[즉시 대응] Decree 46/2026/ND-CP (2026.01.26 발효) — Decree 15/2018 완전 대체. 자기선언→정부 심사 방식 전환. 수입업체 이력·품목 위험도 기반 검사 강도 결정. 고위험 품목·신규 수입업체 물리검사·샘플링·성적서 제출. 소요 7영업일+. 시행 초기 700+ 선적 물량 체선 발생 이력.',
      gap: '주요 차이',
      gapColor: 'rose',
      advice: '⚠️ 2026.04.16 재시행. 기존 Decree 15 자기선언 절차 더 이상 불가. 고위험 카테고리(신선 농산물·가공식품 일부) 현지 수입업체 리스크 등급 사전 확인 필수. 검사 기간 충분 확보로 납기 계획 조정.',
      halal: 'N/A',
    },
    {
      country: 'Thailand (Thai FDA)',
      category: '식품 첨가물',
      subCategory: 'MOPH Notification No. 468 — 식품 첨가물 기준 전면 개정 (2025.12.12)',
      korea: 'MFDS 식품 첨가물 기준·규격',
      other: 'MOPH Notification No. 468 (2025.12.12 시행) — 구 Notification 444 완전 대체. 일부 첨가물 허용 목록 삭제·사용 기준 개정. 신제품은 즉시 적용. 기존 판매 제품 2년 유예(~2027.12).',
      gap: '주요 차이',
      gapColor: 'amber',
      advice: '삭제된 첨가물 포함 제품은 2027.12 이전 재제조 필요. 신규 수출 제품은 Notification 468 기준 즉시 적용. 태국 현지 파트너에게 허용 목록 최신본 요청.',
      halal: 'N/A',
    },
    {
      country: 'Thailand (Thai FDA)',
      category: '표시 기준',
      subCategory: 'MOPH Notification No. 450 — 유통기한·라벨 기준 (2026.07.19 의무)',
      korea: '소비기한 표시 의무 (식품 표시법)',
      other: 'MOPH Notification No. 450 B.E.2567 (시행 2024.07.19, 완전 준수 기한 2026.07.19) — "소비기한(Best Before)" 정의 Codex 기준으로 통일. 포장 식품 라벨링 요건 업데이트.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '2026.07.19까지 기존 라벨 미전환 시 통관 거부. 유통기한 표기 방식 Codex 기준 확인 후 라벨 수정 착수. 납기 여유 권장.',
      halal: 'N/A',
    },
    {
      country: 'South Korea (MFDS)',
      category: '표시 기준',
      subCategory: '영양성분 표시 의무 대상 확대 — 259개 카테고리 (2026.01.01)',
      korea: '대상 220개 → 259개 카테고리로 확대',
      other: 'MFDS 식품 등의 표시기준 개정 (2026.01.01 대형업체 의무 적용, 소규모 2028.01.01). 신규 의무 대상: 아이스크림류·시럽류·동물성 유지·카레·칠리파우더·버터류·가공유류·유청류·조리용 곤충 식품·간편조리세트(밀키트) 등 39개 카테고리 추가.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '매출 120억 원 이상 업체는 2026.01.01부터 의무. 밀키트·아이스크림 등 신규 대상 카테고리 수출 시 한국 전용 영양성분 표시 즉시 추가 필요.',
      halal: 'N/A',
    },
    {
      country: 'South Korea (MFDS)',
      category: '표시 기준',
      subCategory: '고카페인 경고 표시 — 고형 식품 확대 (2026.01.01)',
      korea: '음료류 고카페인(≥150 mg/L) 경고 표시 의무',
      other: 'MFDS 개정 (2026.01.01) — 과라나 함유 고형 식품(≥0.15 mg/g 카페인) 고카페인 경고 표시 의무 확대. "고카페인 함유 — 어린이·임산부·카페인 민감자 섭취 주의" 표시 의무.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '에너지바·기능성 스낵·보충제류 과라나 함유 제품 경고 표시 누락 시 위반. 한국 수출 고형 제품 카페인·과라나 함량 확인 후 라벨 수정.',
      halal: 'N/A',
    },
    {
      country: 'South Korea (MFDS)',
      category: '표시 기준',
      subCategory: '일반 식품 건강기능 표시 제한 강화 (2026.01.01)',
      korea: 'MFDS 기능성 표시 식품 — 고시형·개별 인정형 구분',
      other: 'MFDS 개정 (2026.01.01) — 일반 식품의 의약적 효능 표방 금지 강화. 건강기능식품 아닌 제품에 "치료·예방·완화" 표현 금지. 건강 관련 표시 과학적 근거 요구.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '한국 수출 제품 광고·라벨 건강 문구 즉시 점검. "도움을 줄 수 있음" 등 기능성 표현은 건강기능식품 인정 제품만 허용. 무인정 제품 사용 시 시정명령·행정처분.',
      halal: 'N/A',
    },
    {
      country: 'Russia/EAEU (EAC)',
      category: '식품 안전',
      subCategory: '동물성 식품 수의약물 잔류 최대 허용 기준 (2026.01.10 의무)',
      korea: '식약처 동물용 의약품 잔류 허용 기준',
      other: 'EEC 이사회 Decision No. 70 (2023.06.23) — TR TS 021/2011(식품안전), 유제품·육류·어류·가금류 등 기술규정 개정. 동물성 식품 내 수의약물 잔류 최대 허용 기준(MPL) 신설. 원재료 공급업체 수의약 사용 이력 서류 제출 의무. 전환 기간 종료: 2026.01.10.',
      gap: '주요 차이',
      gapColor: 'rose',
      advice: '2026.01.10 이미 시행. EAEU 수출 육류·유제품·수산물 MPL 기준 성적서 구비 필수. 원료 공급망 수의약물 이력 추적 서류 확보. MPL 초과 시 EAEU 시장 판매 금지.',
      halal: 'N/A',
    },
    {
      country: 'Switzerland (FSVO)',
      category: '포장·용기',
      subCategory: 'BPA·비스페놀 식품 접촉 자재 금지 (2026.01)',
      korea: '식품 포장재 BPA 한국 기준 적용',
      other: 'RS 817.023.21 개정 (2026.01 시행) — 식품 접촉 자재 내 비스페놀(BPA 포함) 사용 금지. 폴리카보네이트 초콜릿 몰드·에폭시 코팅 캔 포함. 시장 출하 비적합품 마감: 2026.07.20. 단, Bisphenol M·P는 이번 금지 범위 외.',
      gap: '주요 차이',
      gapColor: 'amber',
      advice: '스위스 수출 제품 폴리카보네이트·에폭시 코팅 포장재 사용 여부 즉시 확인. 2026.07.20 이후 비적합 포장 재고 출하 불가. EU BPA 금지(2026.07.20)와 동시 적용.',
      halal: 'N/A',
    },
    {
      country: 'France [EU Deviation 🚨]',
      category: '식품 안전',
      subCategory: '🚨 EU 금지 농약 5종 잔류 검출 제품 수입 즉시 금지 (2026.01.07)',
      korea: 'MFDS 잔류농약 MRL 기준 적용',
      other: '[Mandatory Warning] 프랑스 긴급 법령 (2026.01.07 시행) — EU 사용 금지 농약 5종 ① 카르벤다짐(Carbendazim) ② 베노밀(Benomyl) ③ 글루포시네이트(Glufosinate) ④ 티오파네이트메틸(Thiophanate-methyl) ⑤ 만코제브(Mancozeb) 검출 시 수입 전면 금지. 기준은 "MRL 초과"가 아닌 "검출" 자체 (사실상 Zero Tolerance). 영향 품목: 망고·아보카도·포도·감귤·사과·딸기·곡류·대두·감자 등.',
      gap: '주요 차이',
      gapColor: 'rose',
      advice: '⚠️ 이미 시행. 한국산 과일·채소·곡류 프랑스 수출 시 5종 농약 잔류 여부 사전 검사 필수. 미검출(ND) 확인 없이는 통관 불가. EU 전체 금지 농약 사용 금지 + 프랑스용 별도 성적서 구비.',
      halal: 'N/A',
    },
    {
      country: 'Hong Kong (CFS/FEHD)',
      category: '인증·등록 절차',
      subCategory: '원료 육류·가금류 수입 — 제조시설 CFS 등록 의무 (2025.02.14)',
      korea: 'MFDS 수출위생증명서 발급',
      other: 'CFS 신규 프로토콜 (2025.02.14 시행) — 시스템 기반 인정 → 시설별 등록 방식 전환. 신선·냉장·냉동 원료 육류·가금류 수출 시설은 CFS에 개별 등록 필수. 조리·가공품(햄·소시지·통조림 등)은 해당 없음.',
      gap: '주요 차이',
      gapColor: 'rose',
      advice: '원료 육류·가금류 생산 시설 CFS 미등록 시 홍콩 수출 전면 불가. 등록 신청 및 처리 기간 사전 여유 확보 필수. 가공품 제외 여부 제품별 확인.',
      halal: 'N/A',
    },
    {
      country: 'Hong Kong (CFS/FEHD)',
      category: '식품 안전',
      subCategory: '납·카드뮴·메틸수은 최대 기준 개정 (2025.09.05)',
      korea: 'MFDS 식품 중 오염물질 기준·규격',
      other: 'Food Adulteration (Metallic Contamination) Amendment Regulation 2025 (2025.09.05 시행, 18개월 유예). Codex 최신 기준 반영 — 납·카드뮴·메틸수은 최대 기준 업데이트. 어류·생선볼·피시케이크 메틸수은 신규 기준 추가.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '유예 기간 ~2027.03까지. 수산물·어류 가공품 메틸수은 성적서 구비 권장. 기준 초과 시 리콜·판매 금지. 공인기관 성적서 갱신 필요.',
      halal: 'N/A',
    },
    {
      country: 'Taiwan (TFDA)',
      category: '인증·등록 절차',
      subCategory: '건강식품 위생 기준 전면 개정 (2026.02.04 시행)',
      korea: '건강기능식품 기준·규격 (MFDS)',
      other: 'TFDA 건강식품 위생 기준 개정 (2026.02.04 즉시 시행) — 1999년 기준을 27년 만에 전면 대체. 건강식품(Health Food) 검사·성분·안전성 기준 완전 업데이트. 등록 건강식품 모두 신기준 적용.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '대만 건강식품 등록 제품 신기준 적합성 재검토 필수. 신규 등록 신청 시 신기준 서류 제출 의무. 기존 제품 등록 갱신 시 적합성 서류 업데이트.',
      halal: 'N/A',
    },
    {
      country: 'Taiwan (TFDA)',
      category: '식품 안전',
      subCategory: '초콜릿·코코아 파우더 카드뮴 최대 기준 (2026.01.01)',
      korea: '식품 중 오염물질 기준·규격 (MFDS)',
      other: 'TFDA 고시 (2024.11.28 발표, 2026.01.01 시행) — 초콜릿·코코아 파우더 카드뮴(Cd) 최대 기준 신설. EU·Codex 기준 참고 설정.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '초콜릿·코코아 분말 대만 수출 시 카드뮴 성적서 구비 필수. 원료 코코아 산지별 카드뮴 모니터링 권장. 기준 초과 시 통관 거부.',
      halal: 'N/A',
    },
    {
      country: 'Taiwan (TFDA)',
      category: '표시 기준',
      subCategory: '"신선(鮮)" 표기 — 인증 마크 필수 (2026.07.01)',
      korea: '신선 우유 표시 기준 (MFDS)',
      other: 'TFDA 고시 (2026.07.01 시행) — 액상 우유 포장에 "신선(鮮)" 한자 표기 시 공식 인증 마크 또는 인증 기관 확인 필수. 미인증 제품 "鮮" 표기 금지.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '대만 수출 신선 우유 제품 "鮮" 표기 검토. 2026.07.01 이전 인증 취득 또는 표기 삭제 필요.',
      halal: 'N/A',
    },
    {
      country: 'Malaysia (MOH/JAKIM)',
      category: '인증·등록 절차',
      subCategory: '국경관리보호청 AKPS 신설 — 수입 검사 창구 통합 (2025)',
      korea: 'MFDS 수출위생증명서 발급',
      other: 'AKPS(Agensi Kawalan Sempadan dan Perlindungan) 2025년 설립 — MAQIS·보건부 국경 검사 업무 통합. KLIA·조호르·페낭 등 22개 주요 항구·공항 먼저 시행(114개 중). 수입 서류 제출 창구 및 검사 담당 기관 변경.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '말레이시아 수출 시 기존 MAQIS 연락처·서류 제출 창구가 AKPS로 전환됨. 현지 수입업체에 담당 창구 변경 여부 확인. 주요 항구 먼저 적용, 전국 확대 시기 모니터링 필요.',
      halal: 'N/A',
    },
    {
      country: 'Japan (CAA)',
      category: '표시 기준',
      subCategory: '식품 표시 기준 개정 — 첨가물 62종 표기명·영양강화 면제 폐지 (2025.03.28)',
      korea: 'MFDS 식품 첨가물 표시 기준',
      other: 'CAO 내각부령 (2025.03.28 공포) — ① 영양강화 목적 첨가물 라벨 표시 면제 폐지(전면 표시 의무화) ② 기존 첨가물 62종 표기명 개정 + 29종 표기명 신설 ③ 2025 일본인 식사 섭취 기준 기반 영양소 기준치 업데이트. 가공 냉동식품: 2026.04.01, 개정 검사법: 2026.06.01, 일반 첨가물·표시 항목: 5년 유예.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '영양강화 첨가물(비타민류·미네랄류) 전 성분 라벨 표시 필수. 기존 첨가물 표기명 62종 개정명으로 전환. 냉동식품 수출은 2026.04.01 적용 주의.',
      halal: 'N/A',
    },
    {
      country: 'Philippines (FDA PH)',
      category: '표시 기준',
      subCategory: '건강기능 식품 치료·예방 효능 광고 금지 강화 (2025.11)',
      korea: 'MFDS 건강기능식품 기능성 표시·광고 기준',
      other: 'FDA Advisory No. 2025-1552 (2025.11.25) — 식품·건강보조식품의 질병 치료·예방·완화 효능 표방 광고 금지 재강조. 위반 시 행정처분 및 제품 리콜.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '필리핀 수출 기능성 식품·보충제 광고·라벨 치료 효능 문구 즉시 점검. "치료한다" "예방한다" 등 표현 모두 금지. 현지 마케팅 자료 법무 검토 권장.',
      halal: 'N/A',
    },
    {
      country: 'UK (FSA) [Post-Brexit]',
      category: '표시 기준',
      subCategory: 'PAL(사전주의 알레르겐 표시) 기준 표준화 추진 (2025.12)',
      korea: 'MFDS 알레르겐 교차오염 표시 자율',
      other: 'FSA 이사회 결정 (2025.12) — "may contain" 문구를 Codex ED05 임계값(알레르겐 민감자 5% 영향 수준) 기준으로 표준화 추진. 현재 자율 사용 중인 사전주의 표시를 의미 있는 위험 기반으로 전환. Codex 채택 예상 2026.07 CAC 총회.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '현재 규제 아닌 정책 추진 단계. Codex·UK FSA 결정 모니터링 필요. 영국 수출 제품 HACCP 알레르겐 교차오염 관리 수준 점검 선제 권장.',
      halal: 'N/A',
    },
    {
      country: 'USA (FDA / USDA)',
      category: '표시 기준',
      subCategory: 'FDA 전면 영양 표시(FOP) 제안 규칙 — 의무화 추진 중 (2025.01)',
      korea: 'MFDS 영양성분 표시 기준',
      other: 'FDA 제안 규칙 (2025.01 공개) — 대부분 포장 식품에 포화지방·나트륨·첨가당 "낮음/중간/높음" 전면 영양 기호 의무화 추진. 최종 규정 2026~2027 예상, 준수 의무화 ~2028.01.01.',
      gap: '중간 차이',
      gapColor: 'amber',
      advice: '현재 제안 단계. 최종 규정 확정 시 미국 수출 전 제품 포화지방·나트륨·첨가당 함량 점검 선제 권장. 고함량 제품 포뮬레이션 개선 또는 라벨 설계 사전 준비.',
      halal: 'N/A',
    },

  ];

  const filteredComparison = comparisonData.filter(row => {
    const matchesCountry = row.country === selectedCountry;
    const matchesSearch = searchQuery === '' || (
      row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.advice.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCountry && matchesSearch;
  });

  // ── 데이터는 web/src/data/regulations.json에서 관리됩니다.
  // ── GitHub Actions가 매일 자동으로 업데이트합니다. (.github/workflows/regulation-monitor.yml)
  const newsItems = regulationsData.newsItems as Array<{ countryCode: string; country: string; title: string; description: string; time: string; type: string; isNew: boolean }>;
  const timelineEvents = regulationsData.timelineEvents as Array<{ date: string; title: string; desc: string; countryCode: string; urgency?: string }>;

  // ArcGIS equirectangular: left=(lon+180)/360*100, top=(90-lat)/180*100
  const mapCountries = [
    { id: 'KR', name: 'South Korea',      top: '30%', left: '85%', alert: 'MFDS FSMP Criteria Update', dotColor: '#6366f1', bw: 32, bh: 22 },
    { id: 'US', name: 'United States',    top: '28%', left: '23%', alert: 'FDA FoPL Rule Proposed', dotColor: '#ef4444', bw: 90, bh: 52 },
    { id: 'EU', name: 'EU',               top: '22%', left: '54%', alert: 'FSMP 규정 업데이트 예정 — 날짜 미확인 (EUR-Lex 확인 필요)', dotColor: '#94a3b8', bw: 72, bh: 44 },
    { id: 'JP', name: 'Japan',            top: '30%', left: '88%', alert: 'CAA 이관 완료 (2024.04.01) — 특별용도식품 창구: 소비자청', dotColor: '#6366f1', bw: 18, bh: 34 },
    { id: 'CN', name: 'China',            top: '31%', left: '79%', alert: 'GACC Import Registration Revised', dotColor: '#ef4444', bw: 60, bh: 42 },
    { id: 'TW', name: 'Taiwan',           top: '37%', left: '84%', alert: 'Pesticide MRL + GABA Updated', dotColor: '#eab308', bw: 14, bh: 16 },
    { id: 'VN', name: 'Vietnam',          top: '41%', left: '79%', alert: 'Azo Color Limits Tightened + Potassium Bromate Banned', dotColor: '#ef4444', bw: 18, bh: 26 },
    { id: 'TH', name: 'Thailand',         top: '43%', left: '78%', alert: 'Cyclamate Banned + Tartrazine 50mg/kg (MOPH No. 468, 2025.12.12)', dotColor: '#ef4444', bw: 26, bh: 22 },
    { id: 'ID', name: 'Indonesia',        top: '53%', left: '83%', alert: 'BPJPH 할랄 인증 의무화 2단계 (2026.10.17) — BPOM ML 등록 필수', dotColor: '#ef4444', bw: 20, bh: 28 },
    { id: 'PH', name: 'Philippines',      top: '43%', left: '84%', alert: 'FDA CPR 등록 필수 + RAO(RiskAssessment) Pilot 2026.12 시행', dotColor: '#f59e0b', bw: 18, bh: 22 },
    { id: 'CA', name: 'Canada',           top: '17%', left: '24%', alert: 'FOPL 전면 영양 표시 의무화 2026.01 시행 + SFCR 수입허가', dotColor: '#f59e0b', bw: 32, bh: 26 },
    { id: 'MY', name: 'Malaysia',         top: '48%', left: '80%', alert: 'JAKIM Halal MRA Updated + MeSTI Certification Expanded', dotColor: '#f59e0b', bw: 22, bh: 18 },
    { id: 'AU', name: 'Australia',        top: '65%', left: '87%', alert: 'Biosecurity Import Permit Required (Meat/Egg Derivatives) + Allulose Under Review', dotColor: '#ef4444', bw: 50, bh: 36 },
    { id: 'AE', name: 'UAE',              top: '37%', left: '65%', alert: 'GSO Nutrition Labeling 2026 + Sugar Tax Expansion Pending', dotColor: '#f59e0b', bw: 14, bh: 10 },
    { id: 'RU', name: 'Russia / EAEU',   top: '16%', left: '76%', alert: 'EAC 인증 + TR TS 021/029 — E171 EAEU 허용 (EU 금지와 상이) + Potassium Bromate 허용', dotColor: '#ef4444', bw: 80, bh: 28 },
    { id: 'HK', name: 'Hong Kong',       top: '38%', left: '82%', alert: '번체자 라벨 의무 + Pre-market 승인 불필요 · 사후관리 체계 + Codex 기준 준용', dotColor: '#eab308', bw: 10, bh: 8 },
    { id: 'GB', name: 'UK (FSA)',         top: '20%', left: '49%', alert: 'E171 UK 독자 검토 중 + Allulose Novel Food 별도 신청 필요 + Melatonin POM 지정', dotColor: '#ef4444', bw: 20, bh: 18 },
    { id: 'CH', name: 'Switzerland',      top: '24%', left: '52%', alert: 'Bio Suisse 유기농 별도 인증 필수 + FSVO 독자 E171 검토 + Allulose Novel Food 신청 필요', dotColor: '#eab308', bw: 12, bh: 10 },
  ];

  const filteredNews = selectedMapCountry
    ? newsItems.filter(n => n.countryCode === selectedMapCountry)
    : newsItems;
  const displayedNews = selectedMapCountry
    ? filteredNews
    : showAllNews ? filteredNews : filteredNews.slice(0, 3);

  const today = '2026.03.10';
  const windowStart = '2026.01.10'; // 2개월 전
  const windowEnd   = '2027.03.10'; // 12개월 후
  const _tlNow = new Date(); _tlNow.setHours(0, 0, 0, 0);
  const _tlMs = (dateStr: string) => {
    const [y, m, d] = dateStr.split('.').map(Number);
    return new Date(y, m - 1, d).getTime();
  };
  const filteredTimeline = [...(selectedMapCountry
    ? timelineEvents.filter(e => e.countryCode === selectedMapCountry)
    : timelineEvents)]
    .filter(e => e.date >= windowStart && e.date <= windowEnd);
  const mostUrgentTimeline = filteredTimeline.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0] || filteredTimeline[0];

  // ── Timeline pagination: 가까운 미래 우선, 과거는 끝으로 (same-date groups kept together) ─
  const TIMELINE_PER_PAGE = 4;
  const _tlTodayMs = _tlNow.getTime();
  const _futureItems = filteredTimeline
    .filter(e => _tlMs(e.date) >= _tlTodayMs)
    .sort((a, b) => a.date.localeCompare(b.date));
  const _pastItems = filteredTimeline
    .filter(e => _tlMs(e.date) < _tlTodayMs)
    .sort((a, b) => a.date.localeCompare(b.date));
  const _sortedTimeline = [..._futureItems, ..._pastItems];

  const _dateGroups: (typeof filteredTimeline)[] = [];
  _sortedTimeline.forEach(e => {
    if (_dateGroups.length > 0 && _dateGroups[_dateGroups.length - 1][0].date === e.date) {
      _dateGroups[_dateGroups.length - 1].push(e);
    } else {
      _dateGroups.push([e]);
    }
  });

  const timelinePages: (typeof filteredTimeline)[] = [];
  let _cur: typeof filteredTimeline = [];
  _dateGroups.forEach(group => {
    if (_cur.length > 0 && _cur.length + group.length > TIMELINE_PER_PAGE) {
      timelinePages.push(_cur); _cur = [];
    }
    _cur.push(...group);
  });
  if (_cur.length > 0) timelinePages.push(_cur);

  const safePage = Math.min(timelinePage, Math.max(0, timelinePages.length - 1));
  const currentTimelineItems = timelinePages[safePage] ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <button onClick={() => setActiveTab('dashboard')} className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors w-full text-left">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Microscope className="size-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-primary">Regu-Lens</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Global Regulation Hub</p>
          </div>
        </button>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* ── Categories ──────────────────────────────── */}
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Categories</p>

          {/* FSMP */}
          <SidebarItem icon={Stethoscope} label="FSMP (Medical Food)" active={activeTab === 'fsmp'} onClick={() => setActiveTab('fsmp')} />
          <div className="pl-8">
            <SidebarItem icon={ClipboardList} label="영양조성 가이드" active={activeTab === 'fsmp-guide'} onClick={() => setActiveTab('fsmp-guide')} />
          </div>

          {/* Functional Food (accordion) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsFunctionalFoodOpen(!isFunctionalFoodOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${['ingredients','notified'].includes(activeTab) ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="size-5" />
                <span className="text-sm font-medium">Functional Food</span>
              </div>
              <ChevronDown className={`size-4 transition-transform ${isFunctionalFoodOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFunctionalFoodOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-11 space-y-1"
              >
                {[
                  { tab: 'ingredients', icon: Microscope, label: 'Individually Recognized' },
                  { tab: 'notified',    icon: CheckCircle2, label: 'Notified' },
                ].map(({ tab, icon: Icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Plant-based Food */}
          <SidebarItem icon={Leaf} label="Plant-based Food" active={activeTab === 'plant-based'} onClick={() => setActiveTab('plant-based')} />

          {/* General Food (accordion) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsGeneralFoodOpen(!isGeneralFoodOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${['grains','meat-fish','vegetables','fruits','dairy','bakery'].includes(activeTab) ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Utensils className="size-5" />
                <span className="text-sm font-medium">General Food</span>
              </div>
              <ChevronDown className={`size-4 transition-transform ${isGeneralFoodOpen ? 'rotate-180' : ''}`} />
            </button>
            {isGeneralFoodOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-11 space-y-1"
              >
                {[
                  { tab: 'grains',     icon: Wheat,      label: 'Grains & Cereals' },
                  { tab: 'meat-fish',  icon: Drumstick,  label: 'Meat, Fish, Eggs & Legumes' },
                  { tab: 'vegetables', icon: Carrot,     label: 'Vegetables' },
                  { tab: 'fruits',     icon: Apple,      label: 'Fruits' },
                  { tab: 'dairy',      icon: Milk,       label: 'Dairy & Milk Products' },
                  { tab: 'bakery',     icon: CakeSlice,  label: 'Bakery & Confectionery' },
                ].map(({ tab, icon: Icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Compliance ──────────────────────────────── */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Compliance</p>
            <SidebarItem icon={ShieldCheck} label="Export & Import Compliance" active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} />
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Personal</p>
            <button
              onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${activeTab === 'methodology' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <FolderHeart className="size-5" />
                <span className="text-sm font-medium">My Portfolio</span>
              </div>
              <ChevronDown className={`size-4 transition-transform ${isPortfolioOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isPortfolioOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-11 space-y-1 mt-1"
              >
                <button 
                  onClick={() => setActiveTab('methodology')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'methodology' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <FileText className="size-4" />
                  <span className="text-sm">Methodology</span>
                </button>
              </motion.div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-primary/5 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Database Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="size-2 bg-green-500 rounded-full animate-breathing"></div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Updates Enabled</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-10">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm outline-none" 
                placeholder="Search ingredients, e.g., Alulose, BCAA"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <button
              onClick={() => exportRegulationsToExcel(CATEGORY_DATA, US_STATE_REGS, { countryFilter: 'South Korea' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="한국(MFDS) 데이터만 샘플로 내려받기 — 포맷 확인용"
            >
              <Download className="size-3.5" />
              KR 샘플
            </button>
            <button
              onClick={() => exportRegulationsToExcel(CATEGORY_DATA, US_STATE_REGS)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/40 hover:bg-primary/10 rounded-lg transition-colors"
              title="전체 국가·식품 유형별 규제 데이터를 Excel로 내려받기"
            >
              <Download className="size-3.5" />
              Excel
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell className="size-5" />
              {newsItems.some(n => n.isNew) && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
              )}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Researcher Jieun Won</p>
                <p className="text-[10px] text-slate-500">Regulatory Lead</p>
              </div>
              <div className="size-10 rounded-full bg-slate-200 overflow-hidden border-2 border-primary/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2VnHM7d4aEEzgni-PCUIGRNQZ7Tz8TNFmhiWPIgwKaib3AIs2tAvxQZXYbKqqX63nUk4lQwEWr0b86bjBxUQEhABmSQIbdgJWVjPrjS8uy6jHYToXrn5GPy6N8T_Vv0G4VZSC_-jqfb5R9g-W8d-K1qCNmSY89xVHqGP-wsAbuiYJs6tietrzZy2sTOWSQRnEUdxIvEkBEnP_MUH0SGndrXGp9QL4cYP_JmivnENymQ8WFUHHl3O1AiKfP3pTKn0nQVFIeCnwVON3" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Top Section: News & Map */}
              <div className="grid grid-cols-12 gap-8">
                {/* Global News Feed */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Rss className="size-5 text-primary" />
                      Global News Feed
                      {selectedMapCountry && (
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selectedMapCountry}</span>
                      )}
                    </h2>
                    <button
                      onClick={() => selectedMapCountry ? setSelectedMapCountry(null) : setShowAllNews(!showAllNews)}
                      className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
                    >
                      {selectedMapCountry ? 'View All' : showAllNews ? 'Show Less' : 'View All'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displayedNews.length > 0 ? displayedNews.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <NewsCard country={item.country} title={item.title} description={item.description} time={item.time} type={item.type} isNew={item.isNew} />
                      </React.Fragment>
                    )) : (
                      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-5 flex flex-col items-center justify-center gap-2 text-center">
                        <Globe className="size-7 text-slate-300 dark:text-slate-600" />
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {selectedMapCountry ? `${mapCountries.find(c => c.id === selectedMapCountry)?.name ?? selectedMapCountry} — 최신 소식 없음` : '최신 소식 없음'}
                        </p>
                        <p className="text-[10px] text-slate-300 dark:text-slate-600 leading-relaxed max-w-[200px]">
                          현재 등록된 규제 업데이트 뉴스가 없습니다.<br />규제 정보는 상단 Notified 탭에서 확인하세요.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compliance Timeline */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Calendar className="size-5 text-primary" />
                      Compliance Timeline
                      {selectedMapCountry && (
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selectedMapCountry}</span>
                      )}
                    </h2>
                    <button
                      onClick={() => setSelectedMapCountry(null)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                      <Globe className="size-3" />
                      View All
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 flex flex-col gap-4">
                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-6 space-y-8 flex-1">
                      {currentTimelineItems.length > 0 ? currentTimelineItems.map((event, idx) => {
                        const [ey, em, ed] = event.date.split('.').map(Number);
                        const target = new Date(ey, em - 1, ed);
                        const now = new Date(); now.setHours(0, 0, 0, 0);
                        const diff = Math.round((target.getTime() - now.getTime()) / 86_400_000);
                        const isPast = diff < 0;
                        const isSpecial = event.urgency === 'PROPOSED' || event.urgency === 'Extended';
                        const isMostUrgentDate = mostUrgentTimeline && event.date === mostUrgentTimeline.date;
                        const badgeLabel = isSpecial
                          ? event.urgency!
                          : diff < 0 ? `D+${Math.abs(diff)}`
                          : diff === 0 ? 'D-Day'
                          : `D-${diff}`;
                        const badgeClass = isSpecial
                          ? 'bg-rose-500 text-white'
                          : diff < 0 ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-400'
                          : diff === 0 ? 'bg-blue-900 text-white'
                          : diff <= 7   ? 'bg-blue-800 text-white'
                          : diff <= 21  ? 'bg-blue-700 text-white'
                          : diff <= 60  ? 'bg-blue-500 text-white'
                          : diff <= 120 ? 'bg-blue-400 text-white'
                          : diff <= 240 ? 'bg-blue-300 text-slate-700'
                          : 'bg-blue-200 text-blue-700';
                        return (
                          <div key={idx} className={`relative ${isPast ? 'opacity-45' : ''}`}>
                            <div className={`absolute -left-[31px] top-1 size-4 rounded-full border-4 border-white dark:border-slate-900 ${isMostUrgentDate ? 'bg-primary' : isPast ? 'bg-slate-200' : 'bg-slate-300'}`}>
                              {isMostUrgentDate && (
                                <div className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border border-white animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className={`text-[10px] font-bold ${isMostUrgentDate ? 'text-primary' : isPast ? 'text-slate-400' : 'text-slate-400'}`}>{event.date}</p>
                              <span className={`px-1.5 py-0.5 text-[9px] font-black rounded italic ${badgeClass}`}>{badgeLabel}</span>
                            </div>
                            <p className={`text-xs font-bold mt-1 ${isPast ? 'text-slate-400' : ''}`}>{event.title}</p>
                            <p className={`text-[10px] ${isPast ? 'text-slate-400' : 'text-slate-500'}`}>{event.desc}</p>
                          </div>
                        );
                      }) : (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                          <Calendar className="size-8 opacity-30" />
                          <p className="text-xs">No events for {selectedMapCountry}</p>
                        </div>
                      )}
                    </div>
                    {/* Pagination */}
                    {timelinePages.length > 1 && (
                      <div className="flex items-center justify-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {timelinePages.map((_, pi) => (
                          <button
                            key={pi}
                            onClick={() => setTimelinePage(pi)}
                            className={`size-6 rounded text-[10px] font-bold transition-colors ${
                              safePage === pi
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary/20 hover:text-primary'
                            }`}
                          >
                            {pi + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Globe className="size-5 text-primary" />
                      Regulation Heatmap
                    </h2>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <div className="size-2 rounded-full bg-red-500"></div> Strict
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <div className="size-2 rounded-full bg-yellow-500"></div> Moderate
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <div className="size-2 rounded-full bg-green-500"></div> Flexible
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 aspect-[2/1] w-full relative group">
                    {/* 이미지만 rounded+overflow-hidden, 마커 툴팁은 넘쳐도 잘리지 않음 */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img
                        src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/export?bbox=-180,-90,180,90&bboxSR=4326&size=1400,700&imageSR=4326&format=png&transparent=false&f=image"
                        alt="World Map Heatmap"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent opacity-40" />
                    </div>
                    {mapCountries.map((country) => (
                      <div
                        key={country.id}
                        className="absolute cursor-pointer"
                        style={{ top: country.top, left: country.left, transform: 'translate(-50%, -50%)', zIndex: hoveredMapCountry === country.id ? 40 : 10 }}
                        onClick={() => { setSelectedMapCountry(selectedMapCountry === country.id ? null : country.id); setTimelinePage(0); }}
                        onMouseEnter={() => setHoveredMapCountry(country.id)}
                        onMouseLeave={() => setHoveredMapCountry(null)}
                      >
                        {/* Boundary highlight on hover or select */}
                        {(hoveredMapCountry === country.id || selectedMapCountry === country.id) && (
                          <div
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              width: `${country.bw}px`,
                              height: `${country.bh}px`,
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              border: `2px solid ${country.dotColor}`,
                              opacity: selectedMapCountry === country.id ? 1 : 0.65,
                              boxShadow: selectedMapCountry === country.id ? `0 0 14px ${country.dotColor}55` : 'none',
                              animation: selectedMapCountry === country.id ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                            }}
                          />
                        )}
                        {/* Ping ring */}
                        <div
                          className="absolute size-4 rounded-full animate-ping opacity-60"
                          style={{ backgroundColor: country.dotColor, top: '-2px', left: '-2px' }}
                        />
                        {/* Center dot */}
                        <div
                          className="relative size-3 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: country.dotColor, opacity: selectedMapCountry && selectedMapCountry !== country.id ? 0.4 : 1 }}
                        />
                      </div>
                    ))}
                    {selectedMapCountry && (
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-primary/20 shadow text-[10px]">
                        <span className="font-bold text-primary">{mapCountries.find(c => c.id === selectedMapCountry)?.name} selected</span>
                        <button onClick={() => setSelectedMapCountry(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1">
                          <X className="size-3" />
                        </button>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 z-20">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        <BarChart3 className="size-4" />
                        Download R&D Impact Report (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Comparison Table */}
              {(() => {
                const regionData = [
                  { id: 'oceania', label: 'Oceania', countries: [
                    { label: 'Australia (FSANZ)',                 iso: 'au' },
                  ]},
                  { id: 'asia', label: 'Asia-Pacific', countries: [
                    { label: 'China (SAMR)',                      iso: 'cn' },
                    { label: 'Hong Kong (CFS/FEHD)',              iso: 'hk' },
                    { label: 'Indonesia (BPOM)',                  iso: 'id' },
                    { label: 'Japan (MHLW)',                      iso: 'jp' },
                    { label: 'Malaysia (MOH/JAKIM)',              iso: 'my' },
                    { label: 'Philippines (FDA PH)',              iso: 'ph' },
                    { label: 'Taiwan (TFDA)',                     iso: 'tw' },
                    { label: 'Thailand (Thai FDA)',               iso: 'th' },
                    { label: 'Vietnam (VFA)',                     iso: 'vn' },
                  ]},
                  { id: 'europe', label: 'Europe', countries: [
                    { label: 'Europe (EFSA)',                     iso: 'eu' },
                    { label: 'France [EU Deviation 🚨]',         iso: 'fr' },
                    { label: 'Nordic/Hungary [EU Deviation 🚨]', iso: 'fi' },
                    { label: 'Russia/EAEU (EAC)',                 iso: 'ru' },
                    { label: 'Switzerland (FSVO)',                iso: 'ch' },
                    { label: 'UK (FSA) [Post-Brexit]',           iso: 'gb' },
                  ]},
                  { id: 'americas', label: 'Americas', countries: [
                    { label: 'Canada (CFIA)', iso: 'ca' },
                    { label: 'USA (FDA)',      iso: 'us' },
                  ]},
                  { id: 'mideast', label: 'Middle East', countries: [
                    { label: 'UAE (MoIAT)', iso: 'ae' },
                  ]},
                ];
                const allCountries = regionData.flatMap(r => r.countries);
                const selectedIso = allCountries.find(c => c.label === selectedCountry)?.iso ?? 'un';

                return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ArrowLeftRight className="size-5 text-primary" />
                      Regulation Standard Comparison: Korea vs. Other Country
                    </h2>
                    <div className="flex items-center gap-3">
                      {/* Cascade Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <img src={`https://flagcdn.com/w20/${selectedIso}.png`} alt="" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                          <span className="max-w-40 truncate">{selectedCountry}</span>
                          <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCountryDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCountryDropdownOpen(false)} />
                            <div
                              className="absolute right-0 top-full mt-1.5 z-20 flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
                              onMouseLeave={() => setHoveredRegion(null)}
                            >
                              {/* Left: Region list — always visible */}
                              <div className="w-44 py-1">
                                {regionData.map(region => (
                                  <button
                                    key={region.id}
                                    onMouseEnter={() => setHoveredRegion(region.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors ${
                                      hoveredRegion === region.id
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <Globe className="size-3 shrink-0 opacity-50" />
                                      {region.label}
                                    </span>
                                    <ChevronDown className={`size-3 -rotate-90 transition-opacity ${hoveredRegion === region.id ? 'opacity-100' : 'opacity-30'}`} />
                                  </button>
                                ))}
                              </div>
                              {/* Right: Country flyout — only on hover */}
                              {hoveredRegion && (
                                <div className="w-64 border-l border-slate-100 dark:border-slate-800 py-1 max-h-72 overflow-y-auto">
                                  {(regionData.find(r => r.id === hoveredRegion)?.countries ?? []).map(({ label, iso }) => (
                                    <button
                                      key={label}
                                      onClick={() => { setSelectedCountry(label); setIsCountryDropdownOpen(false); setHoveredRegion(null); }}
                                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                                        selectedCountry === label
                                          ? 'bg-primary/10 text-primary font-bold'
                                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      <img src={`https://flagcdn.com/w20/${iso}.png`} alt="" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                                      <span className="leading-tight whitespace-nowrap">{label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Download className="size-4" />
                        Export PDF
                      </button>
                    </div>
                  </div>

                  {/* Table — full width */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Regulation Category</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">South Korea (MFDS)</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Other Country</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status Gap</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">R&D Action (AI)</th>
                        {(selectedCountry === 'Indonesia (BPOM)' || selectedCountry === 'Malaysia (MOH/JAKIM)' || selectedCountry === 'UAE (MoIAT)') && (
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">🕌 Halal Status</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedCountry === 'Australia (FSANZ)' && (
                        <tr><td colSpan={5} className="px-6 pt-4 pb-0">
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2">
                            <span className="text-amber-600 font-bold text-sm mt-0.5">⚠️</span>
                            <div>
                              <p className="text-sm font-bold text-amber-700">Biosecurity Risk Alert</p>
                              <p className="text-xs text-amber-600">육류·난황·유청 단백 포함 제품은 DAFF 바이오보안 수입 허가(Biosecurity Import Permit) 필수. 처리 기간 3~6개월. FSANZ Novel Food 미허가 성분(알룰로스 등) 함유 제품 수출 불가.</p>
                            </div>
                          </div>
                        </td></tr>
                      )}
                      {selectedCountry === 'Malaysia (MOH/JAKIM)' && (
                        <tr><td colSpan={6} className="px-6 pt-4 pb-0">
                          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start gap-2">
                            <span className="text-emerald-600 font-bold text-sm mt-0.5">🕌</span>
                            <div>
                              <p className="text-sm font-bold text-emerald-700">Halal Certification Required</p>
                              <p className="text-xs text-emerald-600">JAKIM 할랄 인증 의무. 인도네시아 BPJPH·GCC MRA 상호인정 활용 가능. 돼지·알코올 유래 성분 전면 대체 필요. MeSTI 인증 병행 취득 권장.</p>
                            </div>
                          </div>
                        </td></tr>
                      )}
                      {selectedCountry === 'UAE (MoIAT)' && (
                        <tr><td colSpan={6} className="px-6 pt-4 pb-0">
                          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-lg flex items-start gap-2">
                            <span className="text-rose-600 font-bold text-sm mt-0.5">💰</span>
                            <div>
                              <p className="text-sm font-bold text-rose-700">Sugar Tax &amp; Arabic Label Alert</p>
                              <p className="text-xs text-rose-600">가당 음료 50%, 에너지드링크 100% 설탕세 부과. 아랍어 라벨 전 항목 의무. ESMA 제품 등록 및 ECAS 할랄 인증 필요.</p>
                            </div>
                          </div>
                        </td></tr>
                      )}
                      {filteredComparison.map((row, idx) => (
                        <ComparisonRow
                          key={idx}
                          category={row.category}
                          subCategory={row.subCategory}
                          korea={row.korea}
                          france={row.other}
                          gap={row.gap}
                          gapColor={row.gapColor}
                          advice={row.advice}
                          showHalal={selectedCountry === 'Indonesia (BPOM)' || selectedCountry === 'Malaysia (MOH/JAKIM)' || selectedCountry === 'UAE (MoIAT)'}
                          halal={(row as any).halal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                  </div>
                </div>
                );
              })()}
            </>
          )}

          {activeTab === 'ingredients' && <IngredientsSection searchQuery={searchQuery} />}
          {activeTab === 'notified' && <NotifiedSection searchQuery={searchQuery} />}
          {activeTab === 'compliance' && <ComplianceSection searchQuery={searchQuery} />}
          {activeTab === 'methodology' && <MethodologySection />}
          {activeTab === 'fsmp' && <FoodCategorySection tabKey="fsmp" searchQuery={searchQuery} />}
          {activeTab === 'fsmp-guide' && <FSMPNutritionGuideSection />}
          {activeTab === 'plant-based' && <FoodCategorySection tabKey="plant-based" searchQuery={searchQuery} />}
          {activeTab === 'grains' && <FoodCategorySection tabKey="grains" searchQuery={searchQuery} />}
          {activeTab === 'meat-fish' && <FoodCategorySection tabKey="meat-fish" searchQuery={searchQuery} />}
          {activeTab === 'vegetables' && <FoodCategorySection tabKey="vegetables" searchQuery={searchQuery} />}
          {activeTab === 'fruits' && <FoodCategorySection tabKey="fruits" searchQuery={searchQuery} />}
          {activeTab === 'dairy' && <FoodCategorySection tabKey="dairy" searchQuery={searchQuery} />}
          {activeTab === 'bakery' && <FoodCategorySection tabKey="bakery" searchQuery={searchQuery} />}
        </div>
      </main>

      <ReportSummaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const FSMPNutritionGuideSection = () => {
  type DiseaseKey = 'diabetes' | 'renal' | 'cancer' | 'hepatic';
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activePhase, setActivePhase] = useState('d-design');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>('diabetes');

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  type NutrientRange = { min: number; max: number; display: string };
  type Nutrient = { name: string; unit: string; mfds: NutrientRange; ref: NutrientRange; scale: number; diff: string; diffType: string };
  type CheckItem = { id: string; text: string; priority: string };
  type Phase = { id: string; label: string; icon: React.ElementType; items: CheckItem[] };
  type Highlight = { label: string; value: string; note: string };
  type DiseaseConfig = { label: string; icon: string; title: string; source: string; refLabel: string; note: string; highlights: Highlight[]; nutrients: Nutrient[]; phases: Phase[] };

  const diseaseConfigs: Record<DiseaseKey, DiseaseConfig> = {
    diabetes: {
      label: '당뇨병', icon: '💉',
      title: 'FSMP 영양조성 가이드 — 당뇨병용',
      source: 'MFDS 고시 2024-79호 / Codex CXS 180-1991 (amended 2019)',
      refLabel: 'Codex (CXS 180)',
      note: '수치는 당뇨병용 FSMP 기준이며, 실제 제품 설계 시 최신 고시 원문을 반드시 확인하십시오.',
      highlights: [],
      nutrients: [
        { name: '탄수화물', unit: '% 에너지',   mfds: { min: 45, max: 60,  display: '45~60%'  }, ref: { min: 40,  max: 65,  display: '40~65%'  }, scale: 100, diff: 'MFDS 상한 5%p 더 엄격',      diffType: 'stricter'       },
        { name: '단백질',   unit: '% 에너지',   mfds: { min: 15, max: 20,  display: '15~20%'  }, ref: { min: 12,  max: 20,  display: '12~20%'  }, scale: 100, diff: 'MFDS 하한 3%p 더 높음',      diffType: 'stricter'       },
        { name: '지방',     unit: '% 에너지',   mfds: { min: 20, max: 35,  display: '20~35%'  }, ref: { min: 25,  max: 35,  display: '25~35%'  }, scale: 100, diff: '상한 동일, 하한 차이 존재',  diffType: 'different'      },
        { name: '식이섬유', unit: 'g/100kcal',  mfds: { min: 1,  max: 5,   display: '≥1.0g'   }, ref: { min: 1.5, max: 5,   display: '≥1.5g'   }, scale: 5,   diff: 'Codex 하한 0.5g 더 높음',   diffType: 'codex-stricter' },
        { name: '단순당',   unit: '% 탄수화물', mfds: { min: 0,  max: 10,  display: '≤10%'    }, ref: { min: 0,   max: 10,  display: '≤10%'    }, scale: 20,  diff: '동일 기준',                  diffType: 'same'           },
        { name: '나트륨',   unit: 'mg/100kcal', mfds: { min: 0,  max: 250, display: '≤250mg'  }, ref: { min: 0,   max: 300, display: '≤300mg'  }, scale: 400, diff: 'MFDS가 50mg 더 엄격',        diffType: 'stricter'       },
      ],
      phases: [
        { id: 'd-design', label: '영양소 설계', icon: Calculator, items: [
          { id: 'd-d1', text: '탄수화물 45~60% kcal 범위 내 설계 확인', priority: 'critical' },
          { id: 'd-d2', text: '단백질 15~20% kcal 범위 내 설계 확인', priority: 'critical' },
          { id: 'd-d3', text: '지방 20~35% kcal 범위 내 설계 확인', priority: 'critical' },
          { id: 'd-d4', text: '단순당 ≤10% (탄수화물 대비) 확인', priority: 'critical' },
          { id: 'd-d5', text: '식이섬유 ≥1.0g/100kcal 확인', priority: 'high' },
          { id: 'd-d6', text: '나트륨 ≤250mg/100kcal 확인', priority: 'high' },
          { id: 'd-d7', text: '열량밀도 1.0~2.0kcal/mL 범위 검토', priority: 'medium' },
        ]},
        { id: 'd-raw', label: '원료 선정', icon: Wheat, items: [
          { id: 'd-r1', text: '저GI 탄수화물 원료 선택 (이소말툴로스, 팔라티노스, 완두콩전분 등)', priority: 'critical' },
          { id: 'd-r2', text: '식이섬유 원료 확인 (귀리 β-글루칸, 이눌린, 아카시아검)', priority: 'high' },
          { id: 'd-r3', text: '단백질 원료 MFDS 허가 현황 확인 (유청, 대두, 완두)', priority: 'critical' },
          { id: 'd-r4', text: '지방 원료 포화지방산 비율 검토 (올리브유·카놀라유 권장)', priority: 'high' },
          { id: 'd-r5', text: '감미료 사용 시 MFDS 허가 성분 여부 확인 (알룰로스, 스테비아)', priority: 'medium' },
          { id: 'd-r6', text: '원료 원산지 및 GMO 여부 확인', priority: 'medium' },
        ]},
        { id: 'd-functional', label: '기능성 성분', icon: FlaskConical, items: [
          { id: 'd-f1', text: '크롬(Cr): 1일 35μg 이하 Adequate Intake 기준 준수', priority: 'high' },
          { id: 'd-f2', text: '마그네슘: 1일 상한 350mg 초과 주의', priority: 'high' },
          { id: 'd-f3', text: '아연: 1일 35mg 이하 상한 준수', priority: 'medium' },
          { id: 'd-f4', text: '오메가-3 (EPA+DHA): 기능성 표시 근거 자료 준비', priority: 'medium' },
          { id: 'd-f5', text: '프로바이오틱스 함유 시 MFDS 개별인정 여부 확인', priority: 'medium' },
          { id: 'd-f6', text: '식물성 추출물 함유 시 이상반응 사례 검토', priority: 'low' },
        ]},
        { id: 'd-label', label: '표시 기준', icon: Tag, items: [
          { id: 'd-l1', text: '"당뇨병 환자를 위한 식품" 표시 근거 자료 구비 (MFDS 고시 별표)', priority: 'critical' },
          { id: 'd-l2', text: '영양성분 표시: 1회제공량 및 100mL/100g 기준 병기 필수', priority: 'critical' },
          { id: 'd-l3', text: '주의문구: "의사·영양사 지도 하에 사용" 필수 표시', priority: 'critical' },
          { id: 'd-l4', text: '원재료 함량 순서 표시 (함량 순 표기)', priority: 'high' },
          { id: 'd-l5', text: '알레르기 유발 원료 표시 여부 검토 (우유, 대두 등)', priority: 'high' },
          { id: 'd-l6', text: '용기·포장 최소 표시 면적 기준 확인', priority: 'medium' },
        ]},
        { id: 'd-test', label: '규격 시험', icon: Microscope, items: [
          { id: 'd-t1', text: 'GI 지수 시험 (공인 기관, in vivo 방법 우선)', priority: 'high' },
          { id: 'd-t2', text: '영양성분 함량 분석 시험 성적서 확보 (공인 검사기관)', priority: 'critical' },
          { id: 'd-t3', text: '미생물 기준 충족 확인 (세균수, 대장균군, 살모넬라)', priority: 'critical' },
          { id: 'd-t4', text: '중금속 기준 (납 ≤0.5mg/kg, 카드뮴 ≤0.1mg/kg)', priority: 'high' },
          { id: 'd-t5', text: '유통기한 설정 시험 계획 수립', priority: 'medium' },
          { id: 'd-t6', text: '산패도·점도·pH 안정성 시험', priority: 'medium' },
        ]},
      ],
    },
    renal: {
      label: '신장질환', icon: '🫘',
      title: 'FSMP 영양조성 가이드 — 신장질환용',
      source: 'MFDS 고시 2024-79호 / KDIGO CKD 가이드라인 2020',
      refLabel: '국제 가이드라인 (KDIGO 2020)',
      note: '투석 전 CKD 기준. 혈액투석·복막투석 환자는 단백질 기준 별도 상향 적용. MFDS 원문 수치 반드시 확인.',
      highlights: [
        { label: '열량밀도', value: '≥ 1.0 kcal/mL', note: '소량 고열량 설계 — 수분 제한 환자 대응' },
        { label: '투석 후 단백질', value: '1.0~1.2 g/kg/day', note: '혈액투석·복막투석 환자 별도 상향 적용' },
      ],
      nutrients: [
        { name: '단백질',   unit: '% 에너지',   mfds: { min: 0, max: 15,  display: '≤15%'   }, ref: { min: 0, max: 15,  display: '≤15%'   }, scale: 50,  diff: '동일 기준 (저단백)', diffType: 'same' },
        { name: '나트륨',   unit: 'mg/100kcal', mfds: { min: 0, max: 200, display: '≤200mg' }, ref: { min: 0, max: 200, display: '≤200mg' }, scale: 400, diff: '동일 기준',        diffType: 'same' },
        { name: '칼륨(K)', unit: 'mg/100kcal', mfds: { min: 0, max: 200, display: '≤200mg' }, ref: { min: 0, max: 200, display: '≤200mg' }, scale: 400, diff: '동일 기준',        diffType: 'same' },
        { name: '인(P)',    unit: 'mg/100kcal', mfds: { min: 0, max: 80,  display: '≤80mg'  }, ref: { min: 0, max: 80,  display: '≤80mg'  }, scale: 150, diff: '동일 기준',        diffType: 'same' },
      ],
      phases: [
        { id: 'r-design', label: '영양소 설계', icon: Calculator, items: [
          { id: 'r-d1', text: '단백질 ≤15% kcal (0.6~0.8g/kg/day) 범위 내 설계 확인', priority: 'critical' },
          { id: 'r-d2', text: '칼륨(K) ≤200mg/100kcal 확인', priority: 'critical' },
          { id: 'r-d3', text: '인(P) ≤80mg/100kcal 확인', priority: 'critical' },
          { id: 'r-d4', text: '나트륨 ≤200mg/100kcal 확인', priority: 'critical' },
          { id: 'r-d5', text: '열량밀도 ≥1.0 kcal/mL 확인 (소량 고열량 설계)', priority: 'high' },
          { id: 'r-d6', text: '탄수화물·지방 비율로 충분한 열량 보상 설계', priority: 'high' },
        ]},
        { id: 'r-raw', label: '원료 선정', icon: Wheat, items: [
          { id: 'r-r1', text: '저칼륨 탄수화물 원료 선택 (감자전분·쌀가루 — 인산 첨가물 제외)', priority: 'critical' },
          { id: 'r-r2', text: '저인 단백질 원료 선택 (유청단백 유의 — 인 함량 확인)', priority: 'critical' },
          { id: 'r-r3', text: '인산염 첨가물(STPP, SHMP 등) 사용 회피', priority: 'critical' },
          { id: 'r-r4', text: '저나트륨 원료 선택 (소금·나트륨 강화 성분 최소화)', priority: 'high' },
          { id: 'r-r5', text: '칼슘 보강 (인 제한 시 칼슘·인 균형 유지)', priority: 'high' },
          { id: 'r-r6', text: '고열량 지방 원료 확인 (MCT 오일, 올리브유)', priority: 'medium' },
        ]},
        { id: 'r-functional', label: '기능성 성분', icon: FlaskConical, items: [
          { id: 'r-f1', text: '수용성 비타민(B1, B6, B12, C) 보강 — 투석 손실 보충', priority: 'high' },
          { id: 'r-f2', text: '비타민 D 보강 — 신장 활성화 장애로 결핍 위험', priority: 'high' },
          { id: 'r-f3', text: '마그네슘: 신장 배설 장애 → 과잉 위험 — 상한 확인', priority: 'high' },
          { id: 'r-f4', text: '철분(Fe): 신성빈혈 고려 — 과잉 주의', priority: 'medium' },
          { id: 'r-f5', text: '비타민 K: 혈액응고 모니터링 (와파린 병용 환자)', priority: 'medium' },
        ]},
        { id: 'r-label', label: '표시 기준', icon: Tag, items: [
          { id: 'r-l1', text: '"신장질환 환자용" 표시 근거 자료 구비 (MFDS 고시)', priority: 'critical' },
          { id: 'r-l2', text: '인(P)·칼륨(K)·나트륨 함량 표시 필수', priority: 'critical' },
          { id: 'r-l3', text: '단백질 함량 1회제공량 및 100kcal 기준 병기', priority: 'critical' },
          { id: 'r-l4', text: '주의문구: "의사·영양사 지도 하에 사용" 필수 표시', priority: 'critical' },
          { id: 'r-l5', text: '투석 단계별 사용 방법 안내 문구 검토', priority: 'high' },
        ]},
        { id: 'r-test', label: '규격 시험', icon: Microscope, items: [
          { id: 'r-t1', text: '무기질(K, P, Na, Ca) 전량 분석 시험 성적서 확보', priority: 'critical' },
          { id: 'r-t2', text: '단백질 함량 정밀 분석 (Kjeldahl 또는 Dumas 방법)', priority: 'critical' },
          { id: 'r-t3', text: '미생물 기준 충족 확인 (세균수, 대장균군, 살모넬라)', priority: 'critical' },
          { id: 'r-t4', text: '중금속 기준 확인 (납 ≤0.5mg/kg)', priority: 'high' },
          { id: 'r-t5', text: '열량밀도 측정 (봄브칼로리미터 또는 계산)', priority: 'medium' },
        ]},
      ],
    },
    cancer: {
      label: '암환자', icon: '🎗️',
      title: 'FSMP 영양조성 가이드 — 암환자용',
      source: 'MFDS 고시 2024-79호 (표준제조기준) / ESPEN 암 영양 가이드라인 2021',
      refLabel: '국제 가이드라인 (ESPEN 2021)',
      note: '수치는 MFDS 표준제조기준 및 ESPEN 임상 가이드라인 기반. EPA 정량 기준 등 세부 수치는 MFDS 원문 확인 필요.',
      highlights: [
        { label: '열량밀도', value: '≥ 1.0 kcal/mL', note: '고열량 설계 필수 — 암 악액질(cachexia) 대응' },
        { label: 'EPA (오메가-3)', value: '함유 의무', note: '항염증·근육 유지 목적 — 정량 기준 MFDS 원문 확인' },
      ],
      nutrients: [
        { name: '단백질',   unit: '% 에너지', mfds: { min: 18, max: 35, display: '≥18%'   }, ref: { min: 20, max: 40, display: '≥20%'   }, scale: 100, diff: 'ESPEN이 더 높은 하한 권장', diffType: 'codex-stricter' },
        { name: '지방',     unit: '% 에너지', mfds: { min: 15, max: 35, display: '15~35%' }, ref: { min: 30, max: 50, display: '30~50%' }, scale: 100, diff: 'ESPEN 고지방 허용',         diffType: 'different'      },
        { name: '포화지방', unit: '% 에너지', mfds: { min: 0,  max: 7,  display: '≤7%'    }, ref: { min: 0,  max: 10, display: '≤10%'   }, scale: 20,  diff: 'MFDS가 더 엄격',           diffType: 'stricter'       },
        { name: '나트륨',   unit: 'mg/100kcal', mfds: { min: 0, max: 300, display: '≤300mg' }, ref: { min: 0, max: 300, display: '≤300mg' }, scale: 400, diff: '동일 기준', diffType: 'same' },
      ],
      phases: [
        { id: 'c-design', label: '영양소 설계', icon: Calculator, items: [
          { id: 'c-d1', text: '단백질 ≥18% kcal 확인 (ESPEN 권장 ≥20% 병행 검토)', priority: 'critical' },
          { id: 'c-d2', text: '열량밀도 ≥1.0 kcal/mL 확인 (고열량 설계)', priority: 'critical' },
          { id: 'c-d3', text: '지방 15~35% kcal 범위 설계 (EPA 함유 지방 포함)', priority: 'critical' },
          { id: 'c-d4', text: '포화지방 ≤7% kcal 확인', priority: 'high' },
          { id: 'c-d5', text: '나트륨 ≤300mg/100kcal 확인', priority: 'high' },
          { id: 'c-d6', text: 'EPA 함유량 설계 (항염증·근육유지 목적)', priority: 'high' },
        ]},
        { id: 'c-raw', label: '원료 선정', icon: Wheat, items: [
          { id: 'c-r1', text: '고품질 단백질 원료 (유청단백·카세인·대두단백 — 필수아미노산 완전)', priority: 'critical' },
          { id: 'c-r2', text: 'EPA 원료 선택 (어유 농축물, rTG형 어유 — EPA/DHA 비율 확인)', priority: 'critical' },
          { id: 'c-r3', text: 'MCT 오일 함유 (빠른 에너지 공급, 지방 소화 부담 감소)', priority: 'high' },
          { id: 'c-r4', text: '항산화 비타민 원료 (C, E — 과도 항산화제가 화학요법 방해 가능, 주의)', priority: 'high' },
          { id: 'c-r5', text: '아르기닌·글루타민 원료 검토 (면역 영양 — 임상 근거 기반)', priority: 'medium' },
        ]},
        { id: 'c-functional', label: '기능성 성분', icon: FlaskConical, items: [
          { id: 'c-f1', text: 'EPA+DHA 항응고 작용 주의 — 수술 전 중단 고려', priority: 'high' },
          { id: 'c-f2', text: '셀레늄(Se): 항산화·면역 — 400μg/day 상한 준수', priority: 'high' },
          { id: 'c-f3', text: '아연(Zn): 면역 기능 — 35mg/day 상한 준수', priority: 'medium' },
          { id: 'c-f4', text: '비타민 D: 암 환자 결핍 흔함 — 10~20μg/일 보충 검토', priority: 'medium' },
          { id: 'c-f5', text: '프로바이오틱스: 항암 치료 중 장 보호 — 면역저하 환자 주의', priority: 'low' },
        ]},
        { id: 'c-label', label: '표시 기준', icon: Tag, items: [
          { id: 'c-l1', text: '"암환자용" 표시 근거 자료 구비 (MFDS 고시 별표)', priority: 'critical' },
          { id: 'c-l2', text: 'EPA 함량 표시 (g/100mL 또는 1일 제공량 기준)', priority: 'critical' },
          { id: 'c-l3', text: '열량밀도 및 단백질 함량 강조 표시', priority: 'high' },
          { id: 'c-l4', text: '주의문구: "의사·영양사 지도 하에 사용" 필수 표시', priority: 'critical' },
          { id: 'c-l5', text: '알레르기 유발 원료 표시 (어류 — EPA 원료 관련)', priority: 'high' },
        ]},
        { id: 'c-test', label: '규격 시험', icon: Microscope, items: [
          { id: 'c-t1', text: '지방산 프로파일 분석 (EPA·DHA 정량 — GC/MS)', priority: 'critical' },
          { id: 'c-t2', text: '단백질 함량 정밀 분석 시험 성적서', priority: 'critical' },
          { id: 'c-t3', text: '열량밀도 측정 (봄브칼로리미터)', priority: 'high' },
          { id: 'c-t4', text: '미생물 기준 확인 (세균수, 대장균군, 살모넬라)', priority: 'critical' },
          { id: 'c-t5', text: '어유 원료 중금속(Hg, Pb, As) 특별 확인', priority: 'high' },
        ]},
      ],
    },
    hepatic: {
      label: '간질환', icon: '🟤',
      title: 'FSMP 영양조성 가이드 — 간질환용',
      source: 'MFDS 고시 제2023-13호 / ESPEN 간질환 영양 가이드라인 2018',
      refLabel: '국제 가이드라인 (ESPEN 2018)',
      note: '간경변 비복수 기준. 간성뇌증·복수 동반 시 별도 단백질 제한 적용. MFDS 고시 원문 수치 반드시 확인.',
      highlights: [
        { label: 'MCT 지방', value: '함유 권장', note: '중간사슬중성지방 — 담즙 없이 흡수 → 지방 흡수 보조' },
        { label: '야간 간식', value: '권장', note: '야간 단식 최소화 → 근육 분해 방지 (ESPEN 권고)' },
      ],
      nutrients: [
        { name: '단백질',  unit: '% 에너지',     mfds: { min: 17, max: 21, display: '17~21%' }, ref: { min: 17, max: 21, display: '17~21%' }, scale: 50,  diff: '동일 기준 (1.2~1.5g/kg/day)', diffType: 'same' },
        { name: 'BCAA',   unit: '% of 총 단백질', mfds: { min: 35, max: 60, display: '≥35%'   }, ref: { min: 35, max: 60, display: '≥35%'   }, scale: 100, diff: '동일 기준 (간성뇌증 예방)',    diffType: 'same' },
        { name: '나트륨', unit: 'mg/100kcal',     mfds: { min: 0,  max: 200, display: '≤200mg' }, ref: { min: 0, max: 200, display: '≤200mg' }, scale: 400, diff: '동일 기준',                   diffType: 'same' },
      ],
      phases: [
        { id: 'h-design', label: '영양소 설계', icon: Calculator, items: [
          { id: 'h-d1', text: '단백질 17~21% kcal (1.2~1.5g/kg/day) 범위 내 설계', priority: 'critical' },
          { id: 'h-d2', text: 'BCAA(류신·이소류신·발린) ≥35% of 총 단백질 확인', priority: 'critical' },
          { id: 'h-d3', text: '나트륨 ≤200mg/100kcal 확인 (복수 예방)', priority: 'critical' },
          { id: 'h-d4', text: 'MCT 지방 포함 설계 (전체 지방의 20~50%)', priority: 'high' },
          { id: 'h-d5', text: '열량밀도 1.0~1.5 kcal/mL 범위 검토', priority: 'medium' },
        ]},
        { id: 'h-raw', label: '원료 선정', icon: Wheat, items: [
          { id: 'h-r1', text: 'BCAA 강화 단백질 원료 (발린·류신·이소류신 함량 높은 원료)', priority: 'critical' },
          { id: 'h-r2', text: 'MCT 오일 원료 선택 (C8·C10 함량 확인)', priority: 'critical' },
          { id: 'h-r3', text: '아미노산 프로파일 확인 (Fischer 비율: BCAA/AAA ≥3)', priority: 'high' },
          { id: 'h-r4', text: '저나트륨 원료 선택 (복수 관련 나트륨 제한)', priority: 'high' },
          { id: 'h-r5', text: '수용성 식이섬유 원료 검토 (장내 암모니아 생성 억제)', priority: 'medium' },
        ]},
        { id: 'h-functional', label: '기능성 성분', icon: FlaskConical, items: [
          { id: 'h-f1', text: '아연(Zn): 간경변 환자 결핍 흔함 — 25mg/day 이하 보충 검토', priority: 'high' },
          { id: 'h-f2', text: '비타민 K: 항응고 모니터링 필요 (PT 연장 환자)', priority: 'high' },
          { id: 'h-f3', text: '비타민 D: 간 25-OH 전환 장애 → 결핍 위험 확인', priority: 'high' },
          { id: 'h-f4', text: '마그네슘: 이뇨제 병용 시 결핍 위험 — 보충 검토', priority: 'medium' },
          { id: 'h-f5', text: '유산균(프로바이오틱스): 장-간 축(gut-liver axis) 개선 목적 검토', priority: 'low' },
        ]},
        { id: 'h-label', label: '표시 기준', icon: Tag, items: [
          { id: 'h-l1', text: '"간경변환자용" 표시 근거 자료 구비 (MFDS 고시 제2023-13호)', priority: 'critical' },
          { id: 'h-l2', text: 'BCAA 함량 표시 (mg/100kcal 또는 g/100mL)', priority: 'critical' },
          { id: 'h-l3', text: '나트륨 함량 표시 및 복수 동반 환자 주의 문구', priority: 'high' },
          { id: 'h-l4', text: '주의문구: "의사·영양사 지도 하에 사용" 필수 표시', priority: 'critical' },
          { id: 'h-l5', text: 'MCT 지방 함량 표시 검토 (지방산 조성 표기)', priority: 'medium' },
        ]},
        { id: 'h-test', label: '규격 시험', icon: Microscope, items: [
          { id: 'h-t1', text: '아미노산 프로파일 분석 (BCAA 비율 — HPLC)', priority: 'critical' },
          { id: 'h-t2', text: '지방산 조성 분석 (MCT C8:C10 비율 확인)', priority: 'critical' },
          { id: 'h-t3', text: '무기질(Na, Zn) 함량 분석', priority: 'high' },
          { id: 'h-t4', text: '미생물 기준 확인 (세균수, 대장균군, 살모넬라)', priority: 'critical' },
          { id: 'h-t5', text: '중금속 기준 (납 ≤0.5mg/kg)', priority: 'high' },
        ]},
      ],
    },
  };

  const config = diseaseConfigs[selectedDisease];
  const phases = config.phases;
  const nutrients = config.nutrients;
  const allItems = phases.flatMap(p => p.items);
  const checkedCount = allItems.filter(i => checkedItems[i.id]).length;
  const totalCount = allItems.length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);
  const currentPhase = phases.find(p => p.id === activePhase) ?? phases[0];

  const priorityConfig: Record<string, { label: string; color: string }> = {
    critical: { label: '필수', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    high:     { label: '중요', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    medium:   { label: '권장', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    low:      { label: '참고', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  const diseaseTabColors: Record<DiseaseKey, string> = {
    diabetes: 'border-primary text-primary bg-primary/10',
    renal:    'border-blue-500 text-blue-700 bg-blue-50',
    cancer:   'border-rose-500 text-rose-700 bg-rose-50',
    hepatic:  'border-amber-500 text-amber-700 bg-amber-50',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="size-6 text-primary" />
          <h2 className="text-2xl font-bold">{config.title}</h2>
        </div>
        <p className="text-sm text-slate-500 ml-9">
          한국 MFDS 특수의료용도식품 기준 vs. {config.refLabel} · R&D 배합 설계 참조용
        </p>
      </div>

      {/* Disease Tab Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(diseaseConfigs) as DiseaseKey[]).map(id => {
          const dc = diseaseConfigs[id];
          const isActive = selectedDisease === id;
          return (
            <button
              key={id}
              onClick={() => { setSelectedDisease(id); setActivePhase(diseaseConfigs[id].phases[0].id); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all ${
                isActive ? diseaseTabColors[id] + ' font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{dc.icon}</span>
              <span>{dc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Highlight Cards */}
      {config.highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">!</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{h.label}: <span className="text-primary">{h.value}</span></p>
                <p className="text-[10px] text-slate-500 mt-0.5">{h.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nutrient Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            영양소 기준 비교 — 한국(MFDS) vs. {config.refLabel}
          </h3>
          <div className="flex items-center gap-5 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded bg-primary/70"></span>한국 MFDS</span>
            <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded bg-emerald-500/70"></span>{config.refLabel.split(' ')[0]}</span>
          </div>
        </div>

        <div className="space-y-6">
          {nutrients.map((n) => {
            const mfdsLeft  = (n.mfds.min / n.scale) * 100;
            const mfdsWidth = ((n.mfds.max - n.mfds.min) / n.scale) * 100;
            const refLeft   = (n.ref.min  / n.scale) * 100;
            const refWidth  = ((n.ref.max  - n.ref.min)  / n.scale) * 100;
            const diffColor =
              n.diffType === 'same'           ? 'text-slate-400' :
              n.diffType === 'stricter'       ? 'text-primary'   :
              n.diffType === 'codex-stricter' ? 'text-emerald-600' : 'text-amber-600';
            return (
              <div key={n.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold w-24">{n.name}</span>
                    <span className="text-[10px] text-slate-400">({n.unit})</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${diffColor}`}>{n.diff}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-10 text-right shrink-0">MFDS</span>
                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                      <div
                        className="absolute top-0 h-full bg-primary/70 rounded-full flex items-center justify-center"
                        style={{ left: `${mfdsLeft}%`, width: `${Math.max(mfdsWidth, 4)}%` }}
                      >
                        <span className="text-[9px] font-bold text-white px-1 whitespace-nowrap">{n.mfds.display}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-10 text-right shrink-0 truncate">{config.refLabel.split(' ')[0]}</span>
                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                      <div
                        className="absolute top-0 h-full bg-emerald-500/70 rounded-full flex items-center justify-center"
                        style={{ left: `${refLeft}%`, width: `${Math.max(refWidth, 4)}%` }}
                      >
                        <span className="text-[9px] font-bold text-white px-1 whitespace-nowrap">{n.ref.display}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-[10px] text-slate-500 flex items-start gap-1.5">
            <MapPin className="size-3 shrink-0 mt-px opacity-60" />
            <span>출처: {config.source}. {config.note}</span>
          </p>
        </div>
      </div>

      {/* Formulation Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Checklist Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              배합 설계 체크리스트 — {config.label}용
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary">{checkedCount}/{totalCount} 완료</span>
              <button
                onClick={() => setCheckedItems({})}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline"
              >초기화</button>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {progressPct}% 완료 · {totalCount - checkedCount}개 항목 미완료
          </p>
        </div>

        {/* Phase Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {phases.map(phase => {
            const pc = phase.items.filter(i => checkedItems[i.id]).length;
            const pt = phase.items.length;
            const isActive = currentPhase.id === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <phase.icon className="size-3.5 shrink-0" />
                <span>{phase.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${pc === pt ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  {pc}/{pt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Checklist Items */}
        <div className="p-6 space-y-2">
          {currentPhase.items.map(item => {
            const checked = !!checkedItems[item.id];
            const pConf = priorityConfig[item.priority];
            return (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                  checked
                    ? 'bg-primary/5 border-primary/20'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 size-4 accent-primary cursor-pointer shrink-0"
                />
                <div className="flex-1 flex items-start justify-between gap-3">
                  <p className={`text-sm leading-relaxed ${checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.text}
                  </p>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-bold ${pConf.color}`}>
                    {pConf.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              ⚠️ 이 체크리스트는 R&D 배합 설계 참고용이며 법적 효력이 없습니다.
              제품 출시 전 반드시 MFDS 최신 고시 및 담당 RA 부서의 최종 검토를 거쳐야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow = ({ category, subCategory, korea, france, gap, gapColor, advice, halal, showHalal }: any) => {
  const colorClasses: any = {
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200'
  };

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-bold">{category}</p>
        <p className="text-[10px] text-slate-500">{subCategory}</p>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{korea}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{france}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded border text-[10px] font-bold whitespace-nowrap ${colorClasses[gapColor]}`}>
          {gap}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="p-3 rounded bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="size-3 text-primary" />
            <p className="text-[10px] font-bold text-primary italic underline">R&D Advisory:</p>
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">{advice}</p>
        </div>
      </td>
      {showHalal && (
        <td className="px-6 py-4 align-top">
          <span className={`text-xs leading-snug ${halal ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
            {halal || '—'}
          </span>
        </td>
      )}
    </tr>
  );
};
