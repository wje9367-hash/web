/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import regulationsData from './data/regulations.json';
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
type RegRow = { country: string; flag: string; law: string; lawUrl?: string; requirement: string; originalRequirement?: string; advisory: string; urgency?: string; };
const CATEGORY_DATA: Record<string, { title: string; icon: any; rows: RegRow[] }> = {
  fsmp: {
    title: 'FSMP (Medical Food) — Global Regulations',
    icon: Stethoscope,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품위생법 / 특수의료용도식품 기준 (Amendment 2024-79)', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '당뇨용: 탄수화물 50-60%, 단백질 15-20%, 지방 20-25%, 단순당 <10% kcal. 반드시 의사 지도 하 섭취 문구 의무 표시.', originalRequirement: 'Diabetic formula: Carbohydrate 50-60%, Protein 15-20%, Fat 20-25%, Simple sugars <10% kcal. Mandatory label statement: "Use under physician supervision."', advisory: '신제품은 MFDS 개별인정 또는 기준규격 신청 필요. 알루로스는 최대 10% 제한.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR 101.9(j)(8) — Medical Food Definition', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.9', requirement: '고정된 다량영양소 비율 없음. 의사 평가를 통해 "특수한 영양 요건"을 충족해야 함. 반드시 의료 감독 하에 사용.', originalRequirement: 'No fixed macronutrient ratio; must meet "distinctive nutritional requirements" evaluated by physician. Only for use under medical supervision.', advisory: '수입 시 FSVP (21 CFR Part 1, Subpart L) 준수 필수. FSMA 204 이력추적 기록은 2028년부터 적용.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Regulation (EU) 2016/128 + Regulation (EC) 609/2013', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0128', requirement: '질환 카테고리별 성분 기준 적용. 첨가물은 Reg 1333/2008 Cat 13.2 적용. "특수 의료 목적용(For special medical purposes)" 표시 의무.', originalRequirement: 'Compositional standards by disease category. Additives governed by Reg 1333/2008 Cat 13.2. Mandatory "For special medical purposes" labelling.', advisory: '2026년 4월 15일(D-36)부터 FSMP 전면 영양 표시(front-of-pack) 업데이트 의무화. 감미료 함량은 Cat 13.2 개별 허용 기준 반드시 준수.', urgency: 'D-36' },
      { country: 'Japan (CAA)', flag: '🇯🇵', law: '特別用途食品制度 — Consumer Affairs Agency (as of 2026.04.01)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/', requirement: '병자용 특별용도식품 허가 필요. 2026.04.01부터 관할청이 MHLW → 소비자청(CAA)으로 이관. 신규 인허가 창구 변경 필수.', originalRequirement: '病者用特別用途食品の許可が必要。2026年4月1日より主務大臣がMHLWから消費者庁（CAA）へ移管。新規許可申請窓口の変更が必須。', advisory: 'CAA 이관 후 허가 갱신 절차 및 연락처 즉시 업데이트. 기능성표시식품과 특별용도식품 관할 기관 혼동 주의.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: '特殊營養食品管理辦法 — TFDA', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '임상 데이터 의무 제출. 수입 등록 필수. 당뇨·종양 환자용 제품은 강화된 임상 근거 요구.', originalRequirement: '須提交臨床數據。進口登記為必要條件。糖尿病及腫瘤患者用配方食品，須提供加強之臨床佐證。', advisory: '2025.09.15 개정 임상데이터 요건 시행 중. GABA 성분 포함 시 별도 사용 제한 기준(2025.02) 적용.' },
      { country: 'China (SAMR)', flag: '🇨🇳', law: 'GB 29922 / GB 25596 — 特殊医学用途配方食品', lawUrl: 'https://www.samr.gov.cn/', requirement: 'SAMR 사전 등록 필수. 원료는 GB 2760 허용 성분 목록 내에 있어야 함. "非肠外营养" 경고 문구 의무.', originalRequirement: '须向SAMR进行预先登记。原料须在GB 2760许可成分目录内。必须标注"非肠外营养"警示语。', advisory: '등록 과정 최소 12-18개월 소요. GB 2760에 없는 한국 허용 성분은 반드시 대체 성분 검토 필요.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', law: 'Thông tư 43/2014/TT-BYT — 특수 영양 식품 규정 (VFA)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '특수 의료용 식품 수입 시 VFA 수입 허가(Import Permit) 필수. 성분 적합성 Self-Declaration 의무. 베트남어 라벨 표시 필수. 허용 첨가물 목록 Circular 24 적용.', originalRequirement: 'Thực phẩm dinh dưỡng y học cần giấy phép nhập khẩu VFA. Tự công bố sự phù hợp về thành phần. Nhãn tiếng Việt bắt buộc. Phụ gia thực phẩm theo Thông tư 24.', advisory: '2026.01 온라인 수입허가 시스템 전환. 색소·감미료 성분 Circular 24 허용 목록 사전 확인 필수. 아조계 색소 한도 강화 적용 중.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', law: 'Food Act B.E. 2522 — 특수 의료 목적 식품 (Thai FDA)', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx', requirement: '태국 FDA 사전 등록 및 수입 허가 필수. 성분 기준 Codex 기반 적용. Cyclamate 사용 전면 금지. 타이어 라벨(태국어) 표시 의무.', originalRequirement: 'ต้องลงทะเบียนกับ อย. ล่วงหน้าและขออนุญาตนำเข้า มาตรฐานส่วนผสมอิงตาม Codex ห้ามใช้ Cyclamate อย่างเด็ดขาด ฉลากภาษาไทยบังคับ', advisory: 'Cyclamate 함유 제품 수출 불가. Tartrazine 50mg/kg 한도(2025.07 강화) 확인. 2026.04 온라인 허가 갱신 시스템 사전 등록 권고.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', law: 'PP 69/1999 + BPOM Reg. HK.03.1.23.11.11.09909/2014 (PANGAN OLAHAN TERTENTU) + BPJPH Halal Certification (mandatory 2026.10)', lawUrl: 'https://www.pom.go.id/', requirement: 'BPOM ML 번호 등록 필수. 할랄 인증(BPJPH) 2026.10.17 전면 의무화. 기능성 원료는 Pangan Fungsional 카테고리 사전 허가 필요. 성분 SNI 및 BPOM 허가기준 준수.', originalRequirement: 'Nomor ML BPOM wajib didaftarkan. Sertifikasi Halal BPJPH wajib penuh mulai 17 Oktober 2026. Bahan fungsional memerlukan izin Pangan Fungsional terlebih dahulu. Komposisi harus memenuhi SNI dan standar izin BPOM.', advisory: '의약식품감독청(BPOM) ML 번호 등록 필수. 할랄 인증(BPJPH) 2024년 1단계(고위험 식품) 시행, 2단계(2026.10.17) 전면 의무화. GB 기준 아닌 자체 SNI 및 BPOM 허가기준 준수 필요' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', law: 'RA 3720 (Food, Drug and Cosmetic Act) + FDA AO 2014-0030 (FSMP) + FDA AO 2020-0023 (Novel Food)', lawUrl: 'https://www.fda.gov.ph/', requirement: '필리핀 FDA LTO(License to Operate) 및 CPR(Certificate of Product Registration) 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요.', originalRequirement: 'FDA Philippines LTO (License to Operate) and CPR (Certificate of Product Registration) required. FSMP classified under prescription-based Medical Nutrition category with separate review process. Novel ingredients require Novel Food authorisation procedure under FDA AO 2020-0023.', advisory: '필리핀 FDA LTO(License to Operate) 및 CPR(Certificate of Product Registration) 필수. FSMP는 처방 기반 Medical Nutrition 카테고리로 별도 심사. 신규 성분은 Novel Food 허가 절차 필요' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Food and Drugs Act + FDR B.24 (Foods for Special Dietary Use) + Safe Food for Canadians Regulations (SFCR 2019)', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 필수. 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장.', originalRequirement: 'FSMP falls under "Foods for Special Dietary Use" category (FDR B.24). Import requires CFIA SFCR licence. Label must carry mandatory bilingual (English/French) declarations. Health Canada pre-market notification recommended.', advisory: 'FSMP는 "Foods for Special Dietary Use" 카테고리. 수입 시 CFIA SFCR 허가 + 라벨에 영어·불어 이중 표기 의무. Health Canada Pre-market 통지 권장' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Act 1983 / Food Regulations 1985 / MOH 특수의료용도식품 가이드라인', lawUrl: 'https://www.moh.gov.my/', requirement: 'MOH 사전 수입 허가 필수. 동물성 유래 원료 포함 시 JAKIM 할랄 인증(MS1500) 의무. MeSTI 제조 인증 병행 취득 필요. 말레이어·영어 이중 라벨 표시 의무.', originalRequirement: 'Permit import MOH diperlukan. Pensijilan Halal JAKIM (MS1500) wajib bagi bahan berisi asal haiwan. Pensijilan MeSTI disyorkan seiring. Pelabelan dwibahasa (Melayu/Inggeris) wajib.', advisory: 'FSMP 제품 내 동물성 유래 원료 사용 시 JAKIM 할랄 인증 필수. MeSTI 인증 병행 취득 권장. 아랍계 무슬림 소비자 비중 고려한 제품 설계.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Food Standards Code Standard 2.9.5 (FSMP) / Standard 1.1.1 Novel Food', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.9.5 성분 기준 준수 필수. 동물성 단백질(육류·난황·유청) 포함 제품은 Biosecurity Import Permit 의무 취득. 알룰로스 등 미허가 신규 성분 사용 시 Novel Food 사전 심사 필요.', originalRequirement: 'Must comply with Standard 2.9.5 compositional requirements. Products containing animal-derived proteins (meat, egg yolk, whey) must obtain mandatory DAFF Biosecurity Import Permit. Novel ingredients such as allulose require prior Novel Food assessment under Standard 1.1.1.', advisory: '⚠️ Biosecurity Risk: 육류·난황·유청 단백질 포함 FSMP 제품은 수입 허가(Biosecurity Import Permit) 필수. 알룰로스 미허가(Novel Food 검토 중). Health Star Rating 시뮬레이션 권장.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 9/2013 / UAE.S 2055 / Emirates Authority for Standardization (ESMA)', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 9/2013 및 UAE.S 2055 성분 기준 준수. ESMA 제품 등록 필수. 아랍어 라벨 전 항목(성분·영양·유효기한) 표기 의무. ECAS 또는 ESMA 승인 할랄 인증서 첨부 필수.', originalRequirement: 'Must comply with GSO 9/2013 and UAE.S 2055 compositional standards. ESMA product registration mandatory. Full Arabic labelling of all items (ingredients, nutrition facts, expiry date) obligatory. Halal certificate from ECAS or ESMA-approved body required.', advisory: '아랍어 라벨 전 항목 의무. ECAS/ESMA 승인 할랄 인증서 필수. GSO 영양 표시 2026 개정판 적용. 동물성 유래 성분 할랄 검증 우선.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 027/2012 — 특수 의료 목적 식품 기술규정 (EAC) / TR TS 021/2011 식품 안전', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증(유라시아 적합성 마크) 필수. TR TS 027/2012 성분 기준 준수. 국가 등록(СГР — 국가위생증명서) 필수. 러시아어 라벨 전면 의무. 첨가물은 TR TS 029/2012 허용 목록 준수. 수출국 허가 식품 성분 목록 EAEU 사전 대조 필수.', originalRequirement: 'EAC certification (Eurasian Conformity mark) required. Compositional standards per TR TS 027/2012. State sanitary registration (СГР) required. Full Russian-language labelling mandatory. Additives restricted to TR TS 029/2012 permitted list. All ingredient notifications must be cross-checked against EAEU approved list prior to export.', advisory: 'EAC 인증 없이 러시아·카자흐스탄·벨라루스·키르기스스탄·아르메니아 5개국 수출 불가. 등록 처리 기간 6~12개월 예상. 러시아어 라벨 오역 시 통관 거부 빈발. TR TS 029/2012 미등재 첨가물 즉시 대체 검토 필요.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food and Drugs (Composition and Labelling) Regulations — Cap 132W / CFS Guideline', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'Pre-market approval 불필요(홍콩 독자 정책). 영양성분 표시 의무(2010년 시행). 영어·번체 중국어(Traditional Chinese) 병기 표시 필수. 알레르겐 8종 의무 표시. 위생 성적서·원산지 증명 필요.', originalRequirement: 'No pre-market approval required (Hong Kong specific policy). Mandatory Nutrition Information panel (effective 2010). Bilingual (English and Traditional Chinese) labelling required. 8 allergens must be declared. Health certificate and certificate of origin required.', advisory: '중국 본토(SAMR GB 기준)와 홍콩(CFS/FEHD) 규제 완전히 별개 — 별도 라벨 설계 필수. 번체자(Traditional Chinese) 사용 의무 — 간체자(Simplified Chinese) 불인정. Codex 기준 준용으로 대부분 성분 허용.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained EU Law — Commission Delegated Reg (UK) 2021 / FSA FSMP Guidance', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU Reg 2016/128 UK Retained 버전 적용 — "For special medical purposes" 표시 의무. UK Retained Food Additives Regulation 준수(EU 규정과 분리 진행 중). 영어 단독 표기 의무. MHRA 경계 제품(의약품 분류 가능성) 사전 확인 필수.', originalRequirement: 'UK retained version of EU Reg 2016/128 applies — "For special medical purposes" labelling mandatory. Must comply with UK Retained Food Additives Regulation (diverging from EU). English-only labelling required. MHRA borderline medicinal product classification must be verified in advance.', advisory: 'Brexit 이후 EU 규정과 점진적 분리 — EU 허가 신규 성분이라도 UK 별도 확인 필수. Northern Ireland 판매 시 EU NI Protocol 적용(별도). GB(잉글랜드·스코틀랜드·웨일스)와 NI 규정 분리 주의. 수출 전 FSA 최신 업데이트 확인.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Lebensmittel für besondere Verwendungszwecke (LMVBV) / LMG Art. 16', lawUrl: 'https://www.blv.admin.ch/', requirement: 'FSMP: LMVBV 식이요법식품 규정 준수. EU와 상호인정협정(MRA) 보유 — EU 허가 성분 대부분 인정. 독어·불어·이탈리아어 중 최소 1개 표기 의무. 유기농 원료 Bio Suisse 또는 CH-BIO 기준 인증 별도 필요.', originalRequirement: 'FSMP governed by LMVBV (Dietetic Foods Ordinance). Switzerland-EU Mutual Recognition Agreement (MRA) — EU-approved ingredients generally accepted. Labelling in at least one Swiss national language (German, French, Italian) mandatory. Organic ingredients require Bio Suisse or CH-BIO certification.', advisory: 'EU 회원국 아님 — EU 허가가 스위스 허가로 자동 연결 불가. MRA 활용하되 스위스 독자 허용 목록 교차 확인 필수. Swissmedic 경계 제품(의약품 해당 여부) 사전 분류 권고.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EU) 2016/128 + [Local] Loi Egalim 2018 / Décret n°2006-352', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Nutri-Score 표시 의무(프랑스 2017년 법제화 — EU 전체 의무화 이전 단독 시행). Loi Egalim 광고 제한(FSMP 포함 특수 식품 광고 규제 강화). 성분표시 폰트·위치 국내법 추가 기준 준수. 글리포세이트 잔류 프랑스 단독 강화 기준 적용.', originalRequirement: '[Strict Local Rule] Nutri-Score legally mandatory in France (2017 — enacted independently before any EU-wide requirement). Loi Egalim advertising restrictions apply to special-purpose foods. Stricter national rules on ingredient label font/placement. France applies stricter glyphosate residue enforcement versus EU baseline.', advisory: '[EU Deviation] EU 공통 기준 준수 + 프랑스 독자 법규 추가 확인 필수. Nutri-Score 산출 점수(A~E) 사전 시뮬레이션 및 라벨 반영 필수. 프랑스 수출 제품은 EU 인증 외 Loi Egalim 위반 여부 별도 검토.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[HU] Népegészségügyi termékadó (NETA 2011) / [FI] Soft Drink Tax Act / [DK] Sukkerafgiftsloven', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 고당류·고카페인·에너지드링크 건강세 부과(음료 8~40 HUF/L). 핀란드 가당음료세: €0.11/L(설탕 0.5~8g/100mL) / €0.22/L(8g/100mL 초과). 덴마크 설탕세 논의 지속. Nutri-Score 의무화: 프랑스(필수), 독일·벨기에·네덜란드(자율 권장).', originalRequirement: '[EU Divergence] Hungary NETA: public health tax on high-sugar, high-caffeine, energy drinks (8~40 HUF/L). Finland soft drink sugar tax: €0.11/L (0.5–8g/100mL) / €0.22/L (>8g/100mL). Denmark sugar tax under ongoing discussion. Nutri-Score: mandatory France, voluntary Germany/Belgium/Netherlands.', advisory: '헝가리·핀란드 수출 시 당류 함량에 따른 세율 부과 제품 선별 필수. EU 단일 규정 외 개별 국가 세금이 가격 경쟁력에 직접 영향. 저당·무가당 포뮬레이션으로 추가 세금 부담 회피 전략 권장.' },
    ],
  },
  'plant-based': {
    title: 'Plant-based Foods — Global Regulations',
    icon: Leaf,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 두류 / 대두단백 가공식품 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '식물성 단백질 식품: 단백질 ≥ 25% 기준. 유전자변형 대두 사용 시 GMO 표시 의무 (2026.01 개정 적용). 혼합 단백질 제품 표시 기준 준수.', originalRequirement: 'Plant-based protein foods: Protein ≥ 25%. Mandatory GMO labeling for GM soy (2026.01 revision). Mixed protein products must comply with labeling standards.', advisory: 'GMO 표시 개정(2026.01) 적용 여부 즉시 검토. 비건/채식 마크는 민간 인증으로 법적 의무 아님.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: 'FDA Plant-Based Labeling Guidance / 21 CFR Part 131', lawUrl: 'https://www.fda.gov/food/food-labeling-nutrition/plant-based-labeling', requirement: '"우유(Milk)" / "육류(Meat)" 명칭 사용 제한 (표준 정의 제품에만 허용). 대체 단백질 제품은 별도 명칭 사용 권장. 대두(Soy)는 GRAS 인정.', originalRequirement: '"Milk" / "Meat" naming restricted (standard definition products only). Alternative protein products recommended to use distinct names. Soy recognized as GRAS.', advisory: 'Plant-based meat는 USDA FSIS가 아닌 FDA 관할. 단백질 소화율(PDCAAS) 및 영양 라벨 정확도 검토 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Novel Food Regulation (EU) 2015/2283 / Reg 1169/2011', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R2283', requirement: '신규 식물성 단백질(레귀메이션, 미세조류 등)은 Novel Food 사전 허가 필요. EFSA 과학적 의견서 제출 필수.', originalRequirement: 'Novel plant proteins (e.g. legumins, microalgae) require prior authorisation under Novel Food Reg (EU) 2015/2283. EFSA scientific opinion required.', advisory: 'EFSA 심사 18-36개월 소요. 기존 허가된 대두·완두 단백질은 해당 없음. 성분 신규성 사전 확인 필수.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', law: '大豆 / 植物性たんぱく 품질 기준 (CAA 이관 2026.04.01)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: 'JAS 표준 준수. 대두 알레르겐 표시 의무. 2026.04.01부로 관할청이 소비자청(CAA)으로 전환.', originalRequirement: 'JAS規格に準拠。大豆アレルゲン表示が義務。2026年4月1日より管轄が消費者庁（CAA）へ移管。', advisory: '대두 함유 제품의 알레르겐 표시 폰트·위치 규정 확인. CAA 이관 후 인허가 창구 업데이트.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: '植物性蛋白食品 관련 기준 (TFDA)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '수입 등록 및 성분표 제출 필수. 잔류농약 기준 2025.11.26 개정 적용. 표시사항 중국어 의무.', originalRequirement: '須進口登記並提交成分清單。農藥殘留基準適用2025.11.26修訂版。標示事項須以中文為之。', advisory: '개정 잔류농약 MRL 기준 충족 여부 즉시 검토. 식물성 원료 농약 잔류 검사 성적서 구비 필수.' },
      { country: 'China (SAMR)', flag: '🇨🇳', law: 'GB 2715 / GB 7718 — 大豆蛋白 식품 기준 (SAMR)', lawUrl: 'https://www.samr.gov.cn/', requirement: '식물성 단백질 식품 수입 시 GACC 등록 필수. 대두단백 제품은 GMO 표시 의무 (使用了转基因). 원료 GB 2760 첨가물 목록 준수. 중국어 라벨 필수.', originalRequirement: '进口植物蛋白食品须完成GACC注册。大豆蛋白产品须标注转基因信息。原料须符合GB 2760食品添加剂标准。须贴中文标签。', advisory: 'GMO 대두 성분 포함 시 중국어 표시 필수. 대두 단백 추출 공정 서류(생산시설 등록) GACC에 사전 제출. GB 2760 외 첨가물 즉시 대체 검토.' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', law: 'Thông tư 43/2014 / Nghị định 15/2018 — 식물성 식품 수입 규정', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '식물성 단백질 식품(두유·식물성 버거 등) 수입 시 VFA 수입 허가 필요. Self-Declaration 의무. 베트남어 성분표 필수. 허용 첨가물 Circular 24 적용.', originalRequirement: 'Thực phẩm protein thực vật nhập khẩu cần giấy phép VFA. Tự công bố bắt buộc. Nhãn thành phần tiếng Việt bắt buộc. Phụ gia theo Thông tư 24.', advisory: '두유·식물성 단백질 제품 Circular 24 색소·보존료 한도 확인. 수입 허가 갱신 2026.01부터 온라인 전환. 아조계 색소 사용 시 사전 확인 필수.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', law: 'Food Act B.E. 2522 / TISI 2413 — 두유·식물성 단백질 식품', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx', requirement: '두유·식물성 단백질 제품 FDA 등록 의무. 성분 Codex 기준 적용. Cyclamate 금지. 타이어 라벨 표시 의무. 포장 중금속 기준 준수.', originalRequirement: 'ผลิตภัณฑ์โปรตีนจากพืชต้องขึ้นทะเบียนกับ อย. มาตรฐานส่วนผสมตาม Codex ห้าม Cyclamate ฉลากภาษาไทยบังคับ บรรจุภัณฑ์ต้องผ่านมาตรฐานโลหะหนัก', advisory: 'Cyclamate 감미료 함유 식물성 제품 수출 불가. Tartrazine 한도(50mg/kg) 준수. TISI 인증 여부 TISI 홈페이지에서 사전 확인 권장.' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', law: 'BPOM Reg. No. 22 Tahun 2019 (Pangan Olahan) + SNI 01-3148 (Plant-based) + BPJPH 할랄 의무화', lawUrl: 'https://www.pom.go.id/', requirement: '식물성 단백질 제품 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가. 2026.10 이후 할랄 인증 전면 의무화.', originalRequirement: 'Produk protein nabati wajib memiliki nomor ML BPOM. Pelabelan alergen kedelai dan gluten wajib. Label "halal" tidak boleh digunakan tanpa sertifikasi. Sertifikasi Halal BPJPH wajib penuh mulai Oktober 2026.', advisory: '식물성 단백질 제품도 BPOM ML 등록 필수. 대두·글루텐 알레르겐 표시 의무. 할랄 인증 없이는 "halal" 표기 불가 (2026.10 이후 전면 의무화)' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', law: 'FDA AO 2014-0030 + BPI Organics Certification + FDA AO 2020-0023 (Novel Food for PBF)', lawUrl: 'https://www.fda.gov.ph/', requirement: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수.', originalRequirement: 'Novel Food ingredients in plant-based products require prior FDA approval under AO 2020-0023. CPR registration and Import Permit issuance mandatory. "Plant-based" labelling permitted but nutritional labelling must comply with FDA Philippines standards.', advisory: '식물성 식품 Novel Food 성분 사전승인 필요. CPR 등록 + 수입 허가서(Import Permit) 발급. "Plant-based" 표기 허용되나 영양 성분 라벨 FDA 기준 준수' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Part B + Health Canada 식물성 단백질 가이드라인', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수.', originalRequirement: '"Plant-based meat" labelling must comply with CFIA guidelines. FOPL (Front-of-Package Labelling) mandatory for high fat/sugar products from 2026.01.01. Bilingual (English/French) labelling required on all mandatory label elements.', advisory: '"Plant-based meat" 표기 CFIA 가이드라인 준수 필수. 2025년 이후 FOPL(전면 영양 정보 표시) 도입으로 고지방/당류 경고 라벨 부착 의무화 예정. 영어·불어 이중 표기 필수' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'MOH 수입 허가 및 Food Regulations 1985 성분 기준 준수. 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가 — 공정 대체 필수. 말레이어 표시 의무.', originalRequirement: 'Permit import MOH dan pematuhan Food Regulations 1985 diperlukan. Proses pengekstrakan alkohol menjadikan Pensijilan Halal JAKIM tidak boleh diperoleh — penggantian proses wajib. Pelabelan bahasa Melayu diwajibkan.', advisory: '식물성 제품이라도 알코올 추출 공정 사용 시 JAKIM 할랄 인증 취득 불가. 공정 전환 필요. 두부·대두 단백 제품 수출 유망.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Food Standards Code Standard 1.3.1 / Standard 2.9.2 (Supplementary Foods)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 1.3.1 허용 첨가물·영양 성분 목록 준수 필수. 레귀메이션·미세조류 등 신규 식물성 단백질은 Novel Food 사전 허가 필요. 알룰로스 함유 제품 현재 미허가 상태.', originalRequirement: 'Must comply with Standard 1.3.1 permitted food additives and nutritive substances list. Novel plant proteins (e.g. legumins, microalgae) require prior Novel Food authorisation. Allulose-containing products currently not permitted for sale in Australia.', advisory: '식물성 대체단백·기능성 성분 Novel Food 해당 여부 사전 확인 필수. 알룰로스 함유 식물성 제품 호주 수출 시 현재 미허가 상태.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 1694:2009 / UAE.S 2055 Plant-based Food Standards', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 1694:2009 식물성 식품 기준 준수. ESMA 제품 등록 필수. 아랍어 성분·영양 라벨 전 항목 의무 표기. 가당 식물성 음료 설탕세(Excise Tax) 적용 대상 — 저당 설계 권장.', originalRequirement: 'Must comply with GSO 1694:2009 plant-based food standards. ESMA product registration mandatory. Full Arabic labelling of ingredients and nutrition obligatory. Sweetened plant-based beverages subject to Excise Tax — low-sugar formulation recommended.', advisory: '식물성 제품도 아랍어 라벨 의무 및 ESMA 등록 필요. 가당 식물성 음료는 설탕세 적용 대상. Stevia·Monk Fruit 대체 감미료 활용 권장.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 021/2011 식품 안전 / TR TS 022/2011 식품 표시 / TR TS 029/2012 첨가물', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 021 식품 안전 기술규정 준수. 대두·대두 단백 제품: 국가 등록(СГР) 필요. GMO 함유 시 러시아어 표시 의무("Содержит ГМО"). 첨가물 TR TS 029 허용 목록 준수.', originalRequirement: 'EAC certification required. Must comply with TR TS 021/2011 Food Safety Technical Regulation. Soy/soy protein products require СГР state registration. GMO content must be declared in Russian ("Содержит ГМО"). Additives restricted to TR TS 029/2012 permitted list.', advisory: '대두 단백 제품 EAEU 수출 시 GMO 여부 반드시 확인 및 표시. TR TS 029 미등재 첨가물(특히 감미료·유화제) 즉시 대체 필요. 식물성 고기류 TR TS 별도 분류 기준 적용 여부 확인.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W', lawUrl: 'https://www.cfs.gov.hk/', requirement: '식물성 식품 Pre-market approval 불필요. 영양성분 표시 의무. 영어·번체 중국어 병기 필수. GMO 성분 함유 시 표시 의무("基因改造"). 대두 알레르겐 의무 표시.', originalRequirement: 'No pre-market approval for plant-based foods. Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese required. GMO ingredient must be declared ("基因改造"). Soy allergen mandatory declaration.', advisory: '홍콩은 중국 본토와 별개 규제 — 간체자 불인정, 번체자(Traditional Chinese) 필수. GMO 표시 기준 홍콩 독자 적용. 식물성 음료류 영양성분 표시 의무 항목 CFS 가이드라인 확인.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Food Safety Act 1990 / UK Retained Regulation (EU) 2015/2283 (Novel Food)', lawUrl: 'https://www.food.gov.uk/', requirement: 'Novel 식물성 단백질(미세조류·레귀메이션 등): UK Novel Food 별도 승인 필요. "Milk" 명칭 사용 제한(UK retained ECJ 판례 적용). UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. GMO 표시 UK Retained GMO Regulation 준수.', originalRequirement: 'Novel plant proteins (e.g. microalgae, legumins): separate UK Novel Food authorisation required. "Milk" naming restriction applies (UK retained ECJ ruling). Must comply with UK Retained Food Additives Regulation. English-only labelling required. GMO labelling per UK Retained GMO Regulation.', advisory: 'EU Novel Food 허가가 Brexit 이후 UK에 자동 적용 안 됨 — UK 별도 신청 필수. 식물성 유제품 "milk" 명칭 사용 금지 규정 유효. UK FSA 신규 성분 허가 목록 정기 모니터링 권장.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Lebensmittelgesetz (LMG) / Verordnung über neuartige Lebensmittel (VNL)', lawUrl: 'https://www.blv.admin.ch/', requirement: '신규 식물성 단백질: VNL(Novel Food Ordinance) 사전 허가 필요. EU Novel Food 허가 성분은 MRA로 일반적 인정. 독어·불어·이탈리아어 중 1개 이상 라벨 의무. 유기농 식물성 제품 Bio Suisse 인증 별도 필요.', originalRequirement: 'Novel plant proteins require prior authorisation under VNL. EU Novel Food-authorised ingredients generally accepted via MRA. Labelling in at least one Swiss national language mandatory. Organic plant-based products require Bio Suisse certification.', advisory: 'EU와 MRA 활용 가능하나 스위스 독자 VNL 목록 교차 확인 필수. 유기농 표시는 Bio Suisse 인증 없이 사용 불가 — EU 유기농 인증과 별개. 스위스 GMO 규제(임시 유예 연장 중) 최신 상황 확인.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EU) 2015/2283 + [Local] Loi Egalim 2018 / Nutri-Score Arrêté 2017', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] 식물성 음료(두유·귀리음료 등): "lait(우유)" 명칭 사용 금지(EU 공통 규정 + 프랑스 엄격 집행). Nutri-Score 표시 의무. 식물성 단백질 성분 출처 표시 프랑스 독자 강화 기준 적용. 광고 표현 Loi Egalim 규제 준수.', originalRequirement: '[Strict Local Rule] Plant-based beverages (soy, oat milk): use of "lait (milk)" prohibited (EU common rule + strict French enforcement). Nutri-Score labelling mandatory. Stricter French national requirements for plant protein source labelling. Advertising wording must comply with Loi Egalim restrictions.', advisory: '[EU Deviation] 식물성 음료 제품명에 유제품 연상 표현 전면 불허 — 프랑스 DGCCRF 적극 집행 중. Nutri-Score 점수 A 또는 B 달성 포뮬레이션 권장. 프랑스 독자 기준 EU 공통 기준 병행 준수 필수.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[HU] NETA 2011 / [FI] Soft Drink Tax Act / [SE] Livsmedelsverket 성분 권고', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 식물성 가당 음료·에너지드링크 건강세 적용. 핀란드 가당음료세: 식물성 음료 포함 적용 여부 확인(당류 함량 기준). 스웨덴 Livsmedelsverket: 영양 프로파일 권고 기준 강화. Nutri-Score 적용 국가별 의무·자율 상이.', originalRequirement: '[EU Divergence] Hungary NETA: health tax applicable to sweetened plant-based beverages and energy drinks. Finland soft drink tax: verify applicability to plant-based drinks (based on sugar content). Sweden Livsmedelsverket: stricter nutritional profiling recommendations. Nutri-Score mandatory/voluntary by country.', advisory: '식물성 음료 수출 시 헝가리·핀란드 당류 세금 부과 여부 사전 확인. 저당 설계로 추가 세부담 회피 가능. Nutri-Score 국가별 의무 상이 — 프랑스 수출 시 의무, 기타 북유럽은 자율 권장.' },
    ],
  },
  grains: {
    title: 'Grains & Cereals — Global Regulations',
    icon: Wheat,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 제2. 식품의 기준 및 규격 — 곡류 / 전분류', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '수분 기준: 백미 15.5% 이하. 곰팡이독소(아플라톡신 B1 10 μg/kg↓, 총 15 μg/kg↓). 잔류농약: 식품공전 농약잔류허용기준 준수.', originalRequirement: 'Moisture: White rice ≤15.5%. Mycotoxins: Aflatoxin B1 ≤10 μg/kg, total ≤15 μg/kg. Pesticide residues: per Korean Food Code MRL table.', advisory: 'Aflatoxin 초과 사례 증가 추세. 원재료 입고 시 곰팡이독소 검사 성적서 수취 권장.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR Part 137 — Cereal Flours and Related Products', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-137', requirement: '강화밀가루 성분 기준(티아민·리보플라빈·나이아신·철분 필수 강화). 전곡물 표시 기준은 FDA 가이던스 준수. 잔류농약 MRL은 EPA 설정.', originalRequirement: 'Standards of identity for enriched flour (thiamine, riboflavin, niacin, iron mandatory enrichment). Whole grain label criteria per FDA guidance. Pesticide MRLs set by EPA.', advisory: '영양 강화(Enrichment) 기준 충족 여부 라벨 검토 필수. 전곡물(Whole grain) 표시 시 FDA 정의 기준 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Reg (EC) 396/2005 — Pesticide MRLs / Commission Reg (EC) 1881/2006 — Contaminants', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '곡류(밀·보리·귀리) 통합 MRL 적용. 곰팡이독소: 아플라톡신 B1 2 μg/kg, 밀 DON 1,250 μg/kg. 모니터링 의무.', originalRequirement: 'Harmonised MRLs for cereals (wheat, barley, oats). Mycotoxin limits: Aflatoxin B1 2 μg/kg, DON 1,250 μg/kg for wheat. Monitoring mandatory.', advisory: 'EU MRL이 한국 기준보다 엄격한 경우 많음. 수출 전 EU MRL 데이터베이스(EFSA Pesticides) 교차 확인 필수.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', law: '農薬残留規制 ポジティブリスト制度 (Positive List)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '목록 외 농약은 기본 0.01 ppm 적용. 소맥: Glyphosate 30 ppm. 현미: Cadmium 0.4 mg/kg. 2026.04.01 CAA 이관.', originalRequirement: 'Unregistered pesticides: uniform limit 0.01 ppm. Wheat: Glyphosate 30 ppm. Brown rice: Cadmium 0.4 mg/kg. Admin transferred to CAA from 2026.04.01.', advisory: 'Positive List 외 성분 검출 시 전량 수입금지. 잔류농약 검사 성적서 항목 목록 주기적 업데이트 필요.' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: 'TFDA 殘留農藥 기준 (2025.11.26 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '곡류 잔류농약 기준 전면 개정 시행(2025.11.26). 수입 곡류 검사 강화. 성분표 및 원산지 표시 의무.', originalRequirement: 'Pesticide MRL standards for cereals comprehensively revised (effective 2025.11.26). Strengthened import inspection. Mandatory ingredient list and origin labelling.', advisory: '개정 MRL로 일부 항목 기준 강화. 기존 검사 성적서 재검토 및 최신 기준값 적용 확인 필수.', urgency: 'Updated' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Act 1983 / Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). 곰팡이독소: 아플라톡신 총량 15 μg/kg 이하. MAQIS 식물검역(Phytosanitary) 증명서 필수. 말레이어 라벨 표시 의무.', originalRequirement: 'Pesticide MRLs per Food Regulations 1985 (Codex-based). Mycotoxins: total aflatoxins ≤ 15 μg/kg. MAQIS phytosanitary certificate mandatory. Malay-language labelling required. Irradiation-treated products require disclosure.', advisory: '곡류 수입 시 MAQIS 식물검역 사전 확인 필수. 가공 곡류에 동물성 처리제 사용 시 JAKIM 할랄 인증 필요. MeSTI 인증 권장.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Food Standards Code Standard 2.1.1 (Cereals) / DAFF Biosecurity', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '아플라톡신 B1 ≤ 15 μg/kg, 총 아플라톡신 ≤ 15 μg/kg. DON(데옥시니발레놀) ≤ 2,000 μg/kg. FSANZ 잔류농약 MRL 준수. DAFF 식물검역 입항 신고 의무.', originalRequirement: 'Aflatoxin B1 ≤ 15 μg/kg, total aflatoxins ≤ 15 μg/kg. DON (deoxynivalenol) ≤ 2,000 μg/kg. Must comply with FSANZ MRL List for pesticide residues. DAFF phytosanitary entry reporting mandatory.', advisory: '일부 곡물 원산지에 따라 DAFF 바이오보안 강화 검역 적용. 곤충·해충 오염 리스크 제품은 열처리 처리 요구될 수 있음. Health Star Rating 가공 곡물 적용 검토.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 14:1993 (곡류·시리얼 기준) / UAE.S 2055 / ESMA', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 14 기준 아플라톡신 총량 ≤ 10 μg/kg. 잔류농약 Codex MRL 준용. ESMA 가공 곡류 제품 등록 필수. 아랍어 성분·원산지 라벨 전 항목 표기 의무.', originalRequirement: 'GSO 14 standard: total aflatoxins ≤ 10 μg/kg. Codex-based pesticide MRLs apply. ESMA registration mandatory for processed grain products. Full Arabic labelling of ingredients and origin obligatory.', advisory: '원산지 증명서 + 식물검역 증명서 동시 제출 필수. 아플라톡신 기준 EU보다 엄격(10 μg/kg). 아랍어 라벨 미비 시 통관 거부 사례 다수.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 015/2011 — 곡류 안전 기술규정 / TR TS 021/2011 / TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 015/2011 곡류 안전 기술규정 준수. 아플라톡신 B1 ≤ 2 μg/kg, 총 아플라톡신 ≤ 4 μg/kg(EU와 동일 수준). DON(데옥시니발레놀) ≤ 1,000 μg/kg (밀). 잔류농약: EAEU 통합 MRL 목록 적용. 러시아어 라벨 의무.', originalRequirement: 'EAC certification required. Must comply with TR TS 015/2011 Grain Safety Technical Regulation. Aflatoxin B1 ≤ 2 μg/kg, total aflatoxins ≤ 4 μg/kg (aligned with EU). DON ≤ 1,000 μg/kg for wheat. Pesticide residues: EAEU unified MRL list applies. Russian-language labelling mandatory.', advisory: 'EAEU 곡류 기준 일부 항목이 Codex보다 엄격. 밀·보리 곰팡이독소 검사 성적서 러시아어 번역 첨부 권고. TR TS 015 적용 대상 품목 범위 확인 후 적합 성적서 구비.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food Safety Ordinance Cap 612 / CFS 잔류농약 가이드라인', lawUrl: 'https://www.cfs.gov.hk/', requirement: '곡류·가공 시리얼: Pre-market approval 불필요. 잔류농약 기준은 Codex MRL 준용. 아플라톡신: Codex 기준 적용. 영어·번체 중국어 병기 라벨 의무. 수입 시 식품 안전 기준 준수 사업자 책임.', originalRequirement: 'Cereals and processed grains: no pre-market approval required. Pesticide MRLs follow Codex standards. Aflatoxin: Codex limits apply. Bilingual English/Traditional Chinese labelling mandatory. Food safety compliance is the importer\'s responsibility.', advisory: '홍콩 규제는 Codex 기반으로 비교적 유연. 단, 영어·번체자 이중 표기 누락 시 판매 금지 조치. 곡류 가공 제품 내 첨가물은 Cap 132W Regulations 허용 목록 준수.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 396/2005 — MRLs / UK Contaminants Regulation', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK 잔류농약 MRL: UK Retained EU Reg 396/2005 기준 적용(Brexit 이후 독자 업데이트 가능). 아플라톡신 B1 ≤ 2 μg/kg, DON ≤ 1,250 μg/kg(밀). Glyphosate MRL 유지 여부 UK FSA 최신 목록 확인 필수. 영어 단독 표기.', originalRequirement: 'UK pesticide MRLs governed by UK Retained EU Reg 396/2005 (may diverge from EU post-Brexit). Aflatoxin B1 ≤ 2 μg/kg, DON ≤ 1,250 μg/kg for wheat. Glyphosate MRL status must be verified against latest UK FSA database. English-only labelling.', advisory: 'Brexit 이후 EU MRL과 UK MRL 목록이 분리 운영 — EU MRL 충족 후 UK 별도 확인 필수. Glyphosate 등 민감 농약의 UK MRL 변경 사항 FSA 데이터베이스 정기 모니터링 권장.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ) / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: '잔류농약 MRL: VPRÜ 스위스 독자 목록 적용(EU MRL과 대부분 동일하나 일부 상이). 아플라톡신: EU 기준 동일 적용. 유기농 곡물 Bio Suisse 기준 준수. 국내 언어 최소 1개 이상 라벨 표기 의무.', originalRequirement: 'Pesticide MRLs: Swiss VPRÜ list applies (largely aligned with EU MRL but some differences). Aflatoxin: EU-equivalent standards apply. Organic grains require Bio Suisse compliance. Labelling in at least one Swiss national language mandatory.', advisory: '스위스 VPRÜ와 EU MRL 목록 대부분 일치하나 일부 항목 차이 존재 — 수출 전 스위스 VPRÜ 별도 교차 확인 권장. 유기농 곡물 Bio Suisse 인증 없이 "Bio" 표기 불가.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', law: '[EU Base] Reg (EC) 396/2005 + [Local] Lebensmittel- und Futtermittelgesetzbuch (LFGB)', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Local Rule] BfR(연방위해평가원) 곡류 내 글리포세이트 잔류 강화 모니터링 — EU 기준 대비 독일 자체 검사 빈도 높음. LFGB §5 건강 위해 식품 규정 적용. 통밀·유기농 제품 독일 DLG 품질 인증 자율 적용(시장 기대).', originalRequirement: '[Strict Local Rule] BfR (Federal Institute for Risk Assessment) conducts enhanced monitoring of glyphosate residues in grains above EU baseline. LFGB §5 food safety provision applies. Whole grain/organic grain products: DLG quality certification voluntary but market-expected.', advisory: '[EU Deviation] 독일 수출 시 BfR 권고 성분 목록 및 강화 모니터링 대상 농약 확인 권장. 글리포세이트 잔류 제품 독일 시장 소비자 민감도 높음 — 저농약 또는 유기농 원료 우선 검토. LFGB 위반 시 즉시 판매 금지 조치.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[HU] NETA 2011 / [FI] Soft Drink Tax (곡물가공 음료 포함) / [DK] Sukkerafgiftsloven', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 곡물 기반 가당 음료(귀리·쌀음료 등) 핀란드 가당음료세 부과 대상 가능. 헝가리 NETA: 가당 시리얼바·곡류 스낵류 포함 검토. Nutri-Score 의무(프랑스) 또는 자율 권장(독일·벨기에). 덴마크: 설탕세 부과 품목 리스트 확인 필요.', originalRequirement: '[EU Divergence] Grain-based sweetened beverages (oat/rice drinks) may be subject to Finland soft drink sugar tax. Hungary NETA: sweetened cereal bars and grain snacks potentially included. Nutri-Score mandatory (France) or voluntary (Germany, Belgium). Denmark: verify applicable taxed product categories.', advisory: '귀리·쌀 음료 북유럽 수출 시 당류 함량에 따른 세율 부과 여부 각 국가별 최신 기준 확인 필수. 저당 귀리음료 시장 성장 추세 — 저당 포뮬레이션으로 세금 부담 없이 경쟁력 확보 가능.' },
    ],
  },
  'meat-fish': {
    title: 'Meat, Fish, Eggs & Legumes — Global Regulations',
    icon: Drumstick,
    rows: [
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', law: '축산물 위생관리법 / 수산물 품질관리법 / 식품위생법', lawUrl: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%B6%95%EC%82%B0%EB%AC%BC%EC%9C%84%EC%83%9D%EA%B4%80%EB%A6%AC%EB%B2%95', requirement: 'HACCP 의무 적용(도축·가공). 식육: 냉장 0-10°C, 냉동 -18°C 이하. 수산물: 히스타민 200 mg/kg↓. 알류: 살모넬라 불검출.', originalRequirement: 'HACCP mandatory (slaughter/processing). Meat: refrigerated 0-10°C, frozen ≤-18°C. Seafood: histamine ≤200 mg/kg. Eggs: Salmonella not detected.', advisory: '수출 시 상대국 위생증명서(Health Certificate) 발급 필요. MAFRA 수산물 이력제 등록 의무 확인.' },
      { country: 'USA (FDA / FSIS)', flag: '🇺🇸', law: 'FMIA / PPIA / EPIA — USDA FSIS / 21 CFR Part 123 (Seafood HACCP)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-123', requirement: '모든 도축에 대한 전·사후 검사 의무. 수산물: HACCP 21 CFR 123 적용. 달걀: 액란 살균 의무(EPIA). 즉석섭취식품(RTE) 내 리스테리아 불검출.', originalRequirement: 'Mandatory ante/post-mortem inspection for all slaughter. Seafood: HACCP 21 CFR 123. Eggs: EPIA — pasteurisation required for liquid egg products. Listeria zero-tolerance in RTE.', advisory: 'FSIS 관할(육류·가금류)과 FDA 관할(수산물·알가공품) 구분 필수. FSMA 204 이력추적(traceability) 적용 대상에 수산물 포함(2028).', urgency: 'FSIS+FDA' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Regulation (EC) 853/2004 — Animal Product Hygiene / Reg 178/2002', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853', requirement: 'EU 승인 도축장 목록 필수. 콜드체인 문서화 의무. 히스타민: 일반 100 mg/kg, 효소 성숙 어류 200 mg/kg. 제품 유형별 살모넬라 기준 적용.', originalRequirement: 'Approved slaughterhouse list required for export. Cold chain documentation. Histamine: 100 mg/kg (general), 200 mg/kg (enzyme-matured fish). Salmonella criteria by product type.', advisory: 'EU 승인 도축장·가공시설 리스트 확인 필수. Brexit 후 영국 수출은 별도 UKCA/DEFRA 기준 적용.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', law: '食品衛生法 食肉·魚介類 / 乳肉水産基準 (2026.04.01 CAA 이관)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '식육 위생감시원 검사 의무. 소고기: BSE 검사 적용. 어패류: 히스타민 200 mg/kg 이하. 2026.04 CAA 이관 후 인허가 창구 변경.', originalRequirement: '食肉衛生監視員による検査が義務。牛肉：BSE検査適用。魚介類：ヒスタミン200 mg/kg以下。2026年4月消費者庁移管後、許認可窓口変更。', advisory: 'CAA 이관 전후 수출 서류상의 관할기관명 변경 확인. 수산물 이력추적 시스템 CAA 요건 준수.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: 'TFDA 畜禽産品 / 水産物 殘留農藥 基準 (2025.11.26 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '축산물 및 수산물 잔류농약 기준 2025.11.26 전면 개정. 수입 축산물 검역 증명서 의무. 중국어 라벨 표시 필수.', originalRequirement: 'Pesticide MRL standards for livestock and seafood comprehensively revised effective 2025.11.26. Quarantine certificate mandatory for imported livestock. Chinese labelling required.', advisory: '개정 MRL 기준 충족 검사 성적서 구비. 항생제 잔류(예: 테트라사이클린류) 기준 강화 항목 우선 확인.', urgency: 'Updated' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Act 1983 / MAQIS 동물검역법 / JAKIM Halal Standard MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'MAQIS 동물성 식품 검역 서류 3종 동시 제출(2026.06~): 원산지 증명서·수의사 확인서·할랄 인증서. JAKIM 할랄 인증 필수(도축 방식 포함). 수산물: 위생증명서 + 잔류농약 성적서.', originalRequirement: 'MAQIS requires concurrent submission of three documents from June 2026: certificate of origin, veterinary health certificate, and JAKIM halal certificate. JAKIM halal certification mandatory including slaughter method verification. Seafood: health certificate and pesticide residue test report required.', advisory: '돼지고기·돼지 유래 성분 전면 수입 금지. 소·양·가금류 할랄 도축 인증 필수. 2026.06부터 서류 미준수 시 반송 처리. 수산물은 히스타민 200 mg/kg 이하 확인.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Biosecurity Act 2015 (DAFF) / FSANZ Standard 2.2 (Meat, Fish, Eggs)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: '⚠️ 모든 육류·가금류·달걀 관련 가공품: DAFF 바이오보안 수입 허가(Biosecurity Import Permit) 필수. 히스타민: 수산물 200 mg/kg 이하. 리스테리아: RTE 제품 25g 불검출. 살모넬라: 달걀가공품 불검출.', originalRequirement: 'All processed products containing meat, poultry or egg derivatives require DAFF Biosecurity Import Permit. Histamine: ≤ 200 mg/kg for seafood. Listeria: not detected/25g in RTE products. Salmonella: not detected in egg-derived products.', advisory: '육류·달걀 성분 포함 가공식품은 수입 전 DAFF 허가 취득 필수(처리 기간 3~6개월). 수산물 HACCP 문서화 의무. 호주산 육류가 아닌 수입 육류는 별도 검역 강화 대상.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 993:2015 (할랄 도축 기준) / UAE.S 2055 / ESMA / ECAS', lawUrl: 'https://www.moiat.gov.ae/', requirement: '모든 육류·가금류 제품: ECAS 또는 ESMA 승인 기관 할랄 도축 인증서 필수. 수산물: GSO 기준 히스타민 200 mg/kg 이하. ESMA 제품 등록 + 아랍어 라벨 전 항목 의무 표기.', originalRequirement: 'All meat and poultry products must carry halal slaughter certificate from ECAS or ESMA-approved body. Seafood: histamine ≤ 200 mg/kg per GSO standards. ESMA product registration and full Arabic labelling of all items obligatory.', advisory: '할랄 도축 미인증 육류제품 통관 전면 금지. 어류·갑각류도 ECAS 할랄 인증 권장(무슬림 소비자 선호). 냉동 제품 콜드체인 온도 기록지 제출 필요.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 034/2013 — 육류 제품 안전 기술규정 / TR TS 040/2016 — 어류·수산물', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 034 육류 제품·TR TS 040 수산물 기술규정 준수. 수의사 위생증명서(Ветеринарное свидетельство) 필수. 히스타민: 200 mg/kg 이하(수산물). 러시아 특유 금지 성분: 크롬피클 등 일부 방부제 미허용. 러시아어 라벨 전면 의무.', originalRequirement: 'EAC certification required. Must comply with TR TS 034/2013 (Meat Products) and TR TS 040/2016 (Fish/Seafood). Veterinary sanitary certificate (Ветеринарное свидетельство) mandatory. Histamine ≤ 200 mg/kg (seafood). Certain preservatives banned in Russia (e.g. chromium-based pickling agents). Full Russian-language labelling mandatory.', advisory: 'EAEU 수출용 육류제품 Rosselkhoznadzor(러시아 식물·동물검역청) 사전 등록 필수. 도축 시설 EAEU 승인 목록 등재 여부 확인. 수산물 TR TS 040 최신 개정 사항 모니터링 권장.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food Safety Ordinance Cap 612 / Public Health (Animals and Birds) Ordinance Cap 139', lawUrl: 'https://www.cfs.gov.hk/', requirement: '수입 육류: 원산지별 허가 국가·지역 리스트 확인 필수(FEHD 승인 국가만). 수산물: Cap 132W 위생 기준 적용, 히스타민 200 mg/kg 이하. 영어·번체자 병기 라벨 의무. Pre-market approval 불필요.', originalRequirement: 'Imported meat: must verify approved countries/territories list (only FEHD-approved origins permitted). Seafood: hygiene standards per Cap 132W, histamine ≤ 200 mg/kg. Bilingual English/Traditional Chinese labelling mandatory. No pre-market approval required.', advisory: '홍콩 수입 허가 육류 원산지 목록 FEHD 최신 버전 확인 필수(국가별 금지 조치 빈번). 수산물은 비교적 유연하나 위생 증명서 필수. 번체자 표기 누락 시 판매 금지.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 853/2004 / Animal Feed (England) Regulations / DEFRA', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU 853/2004 UK Retained 버전 적용. EU 승인 도축장과 UK 승인 도축장 목록 분리(Brexit 이후). DEFRA 동물성 식품 수입 허가 필요. 히스타민: 수산물 100~200 mg/kg(EU와 동일). 영어 단독 표기 의무.', originalRequirement: 'UK retained version of EU Reg 853/2004 applies. EU and UK approved slaughterhouse lists now separate (post-Brexit). DEFRA import authorisation required for animal products. Histamine: 100–200 mg/kg for seafood (aligned with EU). English-only labelling mandatory.', advisory: 'EU 승인 도축시설이라도 UK 별도 승인 목록 등재 여부 확인 필수. DEFRA 동물성 식품 수입 사전 통지(IPAFFS 시스템) 필수. Northern Ireland는 EU SPS 규정 적용(별도 주의).', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Lebensmittelgesetz (LMG) / Verordnung über Lebensmittel tierischer Herkunft (VLtH)', lawUrl: 'https://www.blv.admin.ch/', requirement: '동물성 식품: VLtH 준수. EU 승인 도축시설 스위스 MRA를 통해 일반적 인정. 히스타민: EU 기준 동일 적용(100~200 mg/kg). 국내 언어 최소 1개 이상 라벨 의무. 수의사 위생 증명서 필수.', originalRequirement: 'Animal-origin foods governed by VLtH. EU-approved slaughter facilities generally accepted under Switzerland-EU MRA. Histamine: EU-equivalent (100–200 mg/kg). Labelling in at least one Swiss national language mandatory. Veterinary health certificate required.', advisory: 'EU 승인 시설은 스위스 MRA로 대부분 인정. 단, 일부 품목은 스위스 FSVO 별도 승인 필요 — 수출 전 확인. 스위스 도착 수의사 검역 절차 사전 안내 권장.' },
      { country: 'Germany (BVL) [🚨 EU Divergence]', flag: '🇩🇪', law: '[EU Base] Reg (EC) 853/2004 + [Local] LFGB / Tierische Lebensmittel-Hygieneverordnung (Tier-LMHV)', lawUrl: 'https://www.bvl.bund.de/', requirement: '[Strict Local Rule] 독일 Tier-LMHV: EU 규정 대비 도축·가공 위생 기준 추가 국내법 적용. BfR 특정 수산물(참치·고등어) 히스타민 강화 모니터링. 소·돼지 원산지 표시 독일 내 추가 표기 기대(자율 기준 강화). 비가열 육제품 리스테리아 관리 기준 엄격 적용.', originalRequirement: '[Strict Local Rule] German Tier-LMHV applies additional national hygiene requirements beyond EU Reg 853/2004. BfR enhanced histamine monitoring for certain seafood (tuna, mackerel). Origin labelling for beef/pork: additional voluntary standards widely expected in German market. Stricter Listeria controls for non-heat-treated meat products.', advisory: '[EU Deviation] 독일 수출 육류·수산물 BfR 강화 모니터링 품목 확인 권장. 히스타민 관리 강화 — 참치·고등어 제품 내부 기준 100 mg/kg 이하 권장. 독일 소비자 원산지 요구 높음 — 원산지 증명 서류 완비 필수.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[NO] Mattilsynet Guidelines / [SE] Livsmedelsverket Fish & Meat / [DK] Fødevarestyrelsen', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 노르웨이·스웨덴: 수산물 항생제 잔류 기준 EU보다 엄격 모니터링. 북유럽 전반: 육류 원산지 표시 소비자 요구 높음(자율적 추가 표기 일반화). 덴마크·스웨덴: 미세플라스틱 어류 오염 관리 자체 가이드라인. 헝가리 NETA: 어류 가공 제품(훈제·조림) 일부 해당 여부 확인.', originalRequirement: '[EU Divergence] Norway/Sweden: stricter national monitoring of antibiotic residues in seafood compared to EU baseline. Nordic countries: higher consumer expectations for meat origin labelling (voluntary additional declaration common). Denmark/Sweden: national microplastic fish contamination management guidelines. Hungary NETA: verify applicability to processed fish products (smoked, canned).', advisory: '북유럽 수산물 시장 진출 시 항생제 잔류 기준 강화 모니터링 대상 여부 확인. 소비자 원산지 투명성 요구 높음 — QR코드 기반 원산지·생산 이력 정보 제공 검토 권장.' },
    ],
  },
  vegetables: {
    title: 'Vegetables — Global Regulations',
    icon: Carrot,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 채소류 기준 / 농약잔류허용기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '채소류 잔류농약: 허용기준 미등록 농약은 0.01 mg/kg 일률 기준 적용. 미생물: 대장균군 불검출 (신선편의식품). 방사선 조사 표시 의무.', originalRequirement: 'Vegetables pesticide MRL: unregistered pesticides 0.01 mg/kg uniform limit. Microbial: coliforms not detected (fresh-cut). Irradiation disclosure required.', advisory: '수입 채소 원산지 및 농약 검사 성적서 기본 구비. 신선편의식품 HACCP 인증 권장.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR Part 112 — Produce Safety Rule (FSMA)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112', requirement: '농업용수 수질 기준. 생물학적 토양 개량제 규정. 작업자 건강·위생 기준. 새싹류: 추가 미생물 검사. 적용 대상 농산물 목록 확인 필수.', originalRequirement: 'Agricultural water quality standards. Biological soil amendment rules. Worker health and hygiene. Sprouts: additional microbial testing. Covered produce list applies.', advisory: 'FSMA Produce Safety Rule 적용 규모·품목 확인. 미국 직수출 시 FSVP(Foreign Supplier Verification) 필수.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Regulation (EC) 396/2005 — MRLs / Reg 2073/2005 — Microbiological Criteria', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '통합 MRL 1,100종 이상. 클로르피리포스(Chlorpyrifos) 사용 금지. 미생물 기준: 즉석섭취 엽채류 살모넬라 25g 중 불검출.', originalRequirement: 'Harmonised MRLs (more than 1,100 substances). Chlorpyrifos banned. Microbiological criteria: Salmonella absence/25g for ready-to-eat leafy vegetables.', advisory: 'EU MRL 데이터베이스 정기 모니터링 필수. Chlorpyrifos 등 EU 금지 농약 사용 여부 원산지 단계 확인.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', law: '農薬残留ポジティブリスト制度 / 食品衛生法', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '목록 외 농약: 0.01 ppm 일률 기준. 2026.04.01 CAA 이관. 수입 검사 강화 품목 지정 주기적 변경.', originalRequirement: 'Unregistered pesticides: 0.01 ppm uniform standard. Admin transferred to CAA from 2026.04.01. Strengthened inspection target items updated periodically.', advisory: '최신 강화 검사 품목(요주의리스트) 확인 후 수출 전략 조정. 0.01 ppm 기준 초과 시 전량 수입 금지.', urgency: 'D-22 CAA' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '채소류 잔류농약 기준 전면 개정(2025.11.26 발효). 수입 검사 강화. 원산지 표시 및 중국어 라벨 의무.', originalRequirement: 'Pesticide MRL standards for vegetables comprehensively revised (effective 2025.11.26). Strengthened import inspection. Mandatory origin and Chinese labelling.', advisory: '2025.11 개정 MRL 기준값 항목별 비교표 작성 후 원료 사전 검토 필수.', urgency: 'Updated' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Food Regulations 1985 기준(Codex 준용). MAQIS 식물검역(Phytosanitary) 증명서 의무. 신선 가공 채소: 미생물 기준(대장균군 불검출) 준수. 말레이어 라벨 표시 필수.', originalRequirement: 'Pesticide MRLs per Food Regulations 1985 (Codex-based). MAQIS phytosanitary certificate mandatory. Fresh-cut vegetables must meet microbial criteria (coliforms not detected). Malay-language labelling required.', advisory: 'MAQIS 수입 검역 사전 확인 필수. Chlorpyrifos 등 EU 금지 농약 잔류 시 수입 거부 가능. 냉장 신선 채소 콜드체인 문서 준비 권장.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.4.1 (Contaminants) / DAFF Biosecurity (Plant Quarantine)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'FSANZ 잔류농약 MRL 준수(FSANZ MRL List). 미생물: 신선 엽채류 살모넬라 25g 불검출. DAFF 식물검역 입항 신고 필수. 일부 채소 수입 시 검역 처리(Heat Treatment 등) 요구될 수 있음.', originalRequirement: 'Must comply with FSANZ MRL List for pesticide residues. Microbial criteria: Salmonella not detected/25g in fresh-cut leafy vegetables. DAFF phytosanitary entry inspection mandatory. Some imported vegetables may require quarantine treatment (heat/cold) upon arrival.', advisory: '호주는 식물검역 매우 엄격 — 흙 묻은 채소 반입 금지. 가공 채소류는 FSANZ 식품첨가물 허용 목록 준수. 알룰로스 함유 가공 채소 제품 Novel Food 심사 대상 가능.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 9/2013 / Codex MRL 준용 / ESMA 식물검역', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'Codex 기준 잔류농약 MRL 준용. 식물검역 증명서(Phytosanitary Certificate) 필수. ESMA 가공 채소 제품 등록. 아랍어 성분·원산지 표기 의무.', originalRequirement: 'Codex-based pesticide MRLs apply. Phytosanitary certificate mandatory for fresh vegetables. ESMA registration required for processed vegetable products. Full Arabic labelling of ingredients and origin obligatory.', advisory: '신선 채소 수입 시 원산지별 검역 리스크 확인. 가공 채소류 아랍어 라벨 전 항목 기재 필수. 무농약·유기농 채소 수출 시 GSO 유기농 인증 기준 별도 확인.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 021/2011 / TR TS 014/2011 — 농산물 안전 / EAEU 잔류농약 MRL 통합 목록', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수(가공 채소). EAEU 통합 MRL 목록 준수(개별 국가 기준 상이 시 EAEU 기준 우선). 클로르피리포스 EAEU 허용 기준(EU 금지와 상이) — 잔류 수준 확인 필요. 신선 채소 식물검역 증명서 필수. 러시아어 라벨 의무(가공 채소).', originalRequirement: 'EAC certification required for processed vegetables. EAEU unified MRL list applies (EAEU baseline takes precedence if individual country standards differ). Chlorpyrifos: EAEU limits differ from EU ban — residue level verification needed. Fresh vegetables require phytosanitary certificate. Russian-language labelling mandatory for processed vegetables.', advisory: '클로르피리포스 EAEU에서는 EU와 달리 허용 기준 존재 — 동일 원료라도 EU 수출용과 EAEU 수출용 잔류 농약 기준이 상이함. 러시아 Rosselkhoznadzor 식물검역 통과 전 사전 확인 권장.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food Safety Ordinance Cap 612 / Pesticide Residues in Food Regulation Cap 132CM', lawUrl: 'https://www.cfs.gov.hk/', requirement: 'Cap 132CM 잔류농약 기준 적용(Codex 기반, 일부 독자 기준). 신선 채소 수입 허가 불필요 — 단, 잔류농약 위반 시 즉시 판매 금지. 영어·번체 중국어 병기 라벨. 신선 채소 콜드체인 유지 권장.', originalRequirement: 'Pesticide residues governed by Cap 132CM (Codex-based, some HK-specific limits). No import permit for fresh vegetables — but immediate removal orders for MRL violations. Bilingual English/Traditional Chinese labelling. Cold chain maintenance recommended for fresh produce.', advisory: '홍콩 Cap 132CM MRL이 Codex와 일부 다를 수 있음 — 수출 전 CFS 데이터베이스 교차 확인 권장. 번체자 표기 누락 시 현지 마트 수입 거부 빈번. 신선 채소 항공 수출 시 콜드체인 문서 완비.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 396/2005 / Contaminants in Food (England) Regulations', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained MRL 목록 준수(EU와 점진적 분리). 클로르피리포스 EU 동일 기준 금지. 신선 채소 DEFRA 식물검역(Phytosanitary) 입항 신고 의무. 영어 단독 표기 의무.', originalRequirement: 'Must comply with UK Retained MRL list (gradual divergence from EU). Chlorpyrifos: banned at same level as EU. Fresh vegetables require DEFRA phytosanitary entry notification. English-only labelling mandatory.', advisory: 'UK MRL 목록 EU와 분리 운영 중 — FSA Pesticide Residues Database 정기 확인 필수. DEFRA Phytosanitary import check (IPAFFS) 사전 등록 필수. 브렉시트 이후 일부 채소 품목 별도 수입 경로(Approved Pathways) 확인 필요.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Pestizidrückstände in Lebensmitteln (VPRÜ)', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VPRÜ 잔류농약 기준 적용(EU MRL과 대부분 동일). 신선 채소 식물검역 증명서 필수(스위스 식물검역법). 유기농 채소 Bio Suisse 또는 CH-BIO 인증. 국내 언어 최소 1개 표기 의무(가공 채소).', originalRequirement: 'Pesticide MRLs per VPRÜ (largely aligned with EU). Fresh vegetables require phytosanitary certificate (Swiss Phytosanitary Law). Organic vegetables require Bio Suisse or CH-BIO certification. Labelling in at least one Swiss national language mandatory for processed vegetables.', advisory: '스위스 VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 FSVO 데이터베이스 교차 확인. 유기농 채소 "BIO" 표기 Bio Suisse 인증 없이 사용 불가. 스위스 식물검역 절차 EU와 별개 적용.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Plan Ecophyto: 프랑스 독자 농약 사용 감축 목표(2030년 50% 감축). Loi Egalim Art. 44: 특정 농약(EU 허용이나 프랑스 규제 강화) 수입 채소 잔류 기준 강화 적용. Nutri-Score 채소 가공 제품 의무 표시. 글리포세이트 잔류 강화 집행.', originalRequirement: '[Strict Local Rule] Plan Ecophyto: France-specific pesticide reduction target (50% reduction by 2030). Loi Egalim Art. 44: stricter residue standards for certain pesticides permitted in EU but restricted in France. Nutri-Score mandatory on processed vegetable products. Enhanced enforcement of glyphosate residue limits.', advisory: '[EU Deviation] 프랑스 수출 채소류 잔류농약 EU 기준 충족 후 Plan Ecophyto 특별 감시 품목 추가 확인 권장. Loi Egalim 잔류 기준 강화 품목 리스트 DGCCRF 최신 버전 확인 필수.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[SE/DK/NO] National Organic Standards / [HU] NETA 2011 (가공 채소 포함)', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 스웨덴·노르웨이: 유기농 채소 인증 기준 EU 기준 대비 추가 요건(농약 잔류 불검출 목표). 헝가리 NETA: 가당 채소 가공 음료·주스 세금 부과 대상 가능. 핀란드 가당음료세: 채소·과채 혼합 주스 포함 여부 확인. Nutri-Score 자율 적용 국가에서 채소 가공품 점수 표시 권장.', originalRequirement: '[EU Divergence] Sweden/Norway: additional organic requirements beyond EU standards (near-zero pesticide residue target). Hungary NETA: sweetened vegetable-based beverages/juices potentially taxable. Finland sugar tax: verify applicability to vegetable-fruit blend juices. Nutri-Score voluntarily recommended for processed vegetable products in applicable countries.', advisory: '북유럽 유기농 채소 시장 진출 시 국가별 유기농 인증 추가 요건 사전 확인. 채소 혼합 주스 핀란드·헝가리 세금 적용 여부 확인. Nutri-Score 점수 표시 시 마케팅 경쟁력 강화 가능.' },
    ],
  },
  fruits: {
    title: 'Fruits — Global Regulations',
    icon: Apple,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 과일류 기준 / 농약잔류허용기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '과실류 잔류농약: 미등록 농약 0.01 mg/kg 일률 기준. 중금속: 납 0.1 mg/kg, 카드뮴 0.05 mg/kg (복숭아 등). 방사선 조사 금지 품목 포함.', originalRequirement: 'Fruits pesticide MRL: unregistered pesticides 0.01 mg/kg uniform limit. Heavy metals: lead 0.1 mg/kg, cadmium 0.05 mg/kg (peaches). Some items prohibited from irradiation.', advisory: '수입 과일 잔류농약 검사 성적서 필수 구비. 복숭아류 중금속 기준 초과 사례 주의.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR Part 112 — Produce Safety / EPA Pesticide Tolerances', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-112', requirement: 'FSMA Produce Safety Rule 대부분 과일 적용. 농업용수·토양 개량제·작업자 위생 기준 준수. EPA가 농약별·품목별 MRL(허용한계) 설정.', originalRequirement: 'FSMA Produce Safety Rule covers most fruits. Agricultural water, soil amendments, worker hygiene standards. EPA sets MRLs (tolerances) by pesticide-commodity combination.', advisory: 'FDA Import Alert 확인 후 수출. 표면처리제(왁스 등) 사용 시 표시 의무 및 성분 허가 여부 확인.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Regulation (EC) 396/2005 — Pesticide MRLs / Reg 1333/2008 (Post-harvest treatments)', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32005R0396', requirement: '엄격한 MRL 적용. 클로르피리포스·메틸 금지. 포스트하베스트 살균제(예: 감귤 Thiabendazole) 별도 규제. 유기농 동등성 확인 필요.', originalRequirement: 'Strict MRLs; Chlorpyrifos, Chlorpyrifos-methyl banned. Post-harvest fungicide use (e.g., Thiabendazole on citrus) regulated separately. Organic equivalence checks.', advisory: 'EU 금지 농약 잔류 검출 시 수입 전량 폐기. 포스트하베스트 처리 성분 Annex I 해당 여부 확인 필수.' },
      { country: 'Japan (CAA/MHLW)', flag: '🇯🇵', law: '農薬残留ポジティブリスト / 果実基準 (2026.04.01 CAA 이관)', lawUrl: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryuu/index.html', requirement: '0.01 ppm 일률 기준 적용. 수입 감귤류: Thiabendazole 사용 시 표시 의무. 중국산 과일 검역 강화 지속.', originalRequirement: 'Uniform 0.01 ppm limit applies. Imported citrus: mandatory labelling if Thiabendazole applied. Strengthened quarantine on Chinese-origin fruits continues.', advisory: '소비자청 이관 후 수입 금지·제한 과일 리스트 최신 버전 확인. 검역 대상 병해충 기준도 함께 체크.', urgency: 'D-22 CAA' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: 'TFDA 殘留農藥 基準 (2025.11.26 전면 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '과일류 잔류농약 기준 2025.11.26 개정 발효. 수입 검사 강화. 중국어 원산지·성분 표시 의무.', originalRequirement: 'Pesticide MRL standards for fruits revised (effective 2025.11.26). Strengthened import inspection. Mandatory Chinese origin and ingredient labelling.', advisory: '개정 후 기준값 변경 항목(특히 熱帶水果) 우선 확인. 기존 검사 성적서 재검토 필요.', urgency: 'Updated' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Regulations 1985 / MAQIS 식물검역법', lawUrl: 'https://www.moh.gov.my/', requirement: '잔류농약 MRL: Codex 준용. MAQIS 식물검역 증명서 필수. 수입 가공 과일·건과류: Food Regulations 1985 보존료·첨가물 기준 준수. 말레이어 라벨 의무. 방사선 조사 처리 제품 표시 필요.', originalRequirement: 'Codex-based pesticide MRLs apply. MAQIS phytosanitary certificate mandatory. Processed fruits and dried fruits: preservative/additive standards per Food Regulations 1985. Malay-language labelling required. Irradiation-treated products require disclosure.', advisory: '열대 과일 수출 유망 품목이나 MAQIS 검역 기준 엄격. 건과류·과일 가공품에 동물성 성분 사용 시 JAKIM 할랄 인증 병행 필요. 포스트하베스트 처리제 허용 여부 사전 확인.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 1.4.1 / DAFF Biosecurity (Plant Quarantine)', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'FSANZ 잔류농약 MRL 목록 준수. 포스트하베스트 처리제(Thiabendazole 등) 허용 목록 확인 필수. DAFF 식물검역 입항 신고 의무. 일부 신선 과일 검역 처리(증열·냉처리) 요구.', originalRequirement: 'Must comply with FSANZ MRL List for pesticide residues. Post-harvest fungicides (e.g. Thiabendazole) must be on FSANZ approved list. DAFF phytosanitary entry inspection mandatory. Certain fresh fruits require approved import pathway or treatment upon arrival.', advisory: '호주는 신선 과일 검역 세계 최고 수준 엄격. 수입 가능 과일 목록(Approved Pathways) DAFF 사전 확인 필수. 가공 과일 제품은 FSANZ 식품첨가물 목록 내 성분만 사용 가능.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 9/2013 / Codex MRL 준용 / FTA 설탕세', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'Codex 잔류농약 MRL 준용. 식물검역 증명서 필수. 가공 과일 제품(잼·주스 등) ESMA 등록. 아랍어 라벨 전 항목 표기 의무. 가당 주스류 설탕세(50%) 적용 대상 확인.', originalRequirement: 'Codex pesticide MRLs apply. Phytosanitary certificate mandatory. Processed fruit products (jams, juices) require ESMA registration. Full Arabic labelling obligatory. Sweetened fruit juices subject to Excise Tax (50%) — confirm applicable scope.', advisory: '과일 주스·가당 과일 음료 설탕세 적용 대상 — 저당 설계 또는 Stevia 대체 검토 필요. 신선 과일 수입은 식물검역 증명서 필수. 아랍어 라벨 미비 시 통관 지연 빈발.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 021/2011 / EAEU 잔류농약 통합 MRL 목록 / TR TS 029/2012', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수(가공 과일). EAEU 통합 MRL 적용. 잼·주스 등 가공 과일 제품: TR TS 021 식품 안전 기준 + 러시아 독자 성분 금지 목록 교차 확인. 방부제 TR TS 029 허용 목록 준수. 러시아어 라벨 의무(제조일·유통기한 포함).', originalRequirement: 'EAC certification required (processed fruits). EAEU unified MRL list applies. Processed fruit products (jams, juices): TR TS 021 food safety + Russian-specific banned ingredient list cross-check required. Preservatives must be from TR TS 029/2012 permitted list. Russian-language labelling including manufacture date and expiry mandatory.', advisory: 'EAEU 가공 과일 제품 내 방부제·색소 TR TS 029 허용 목록 확인 필수 — 일부 EU 허용 색소가 EAEU 미등재. 신선 과일 수출 시 Rosselkhoznadzor 식물검역 사전 확인. 주스류 러시아어 성분명 정확한 번역 필수.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food Safety Ordinance Cap 612 / Cap 132CM 잔류농약 기준', lawUrl: 'https://www.cfs.gov.hk/', requirement: '신선 과일: 수입 허가 불필요, 잔류농약 기준 Cap 132CM(Codex 기반) 준수. 가공 과일 제품(주스·잼): 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 방부제 Cap 132U Regulations 허용 목록 준수.', originalRequirement: 'Fresh fruits: no import permit required; pesticide residues governed by Cap 132CM (Codex-based). Processed fruit products (juices, jams): mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling. Preservatives must be from Cap 132U Regulations permitted list.', advisory: '홍콩 CFS MRL이 Codex와 일부 다를 수 있음 — 수출 전 최신 목록 확인. 방부제 사용 시 Cap 132U Regulations 허용 목록 준수 필수. 가공 과일 제품 번체자 라벨 누락 시 판매 거부.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 396/2005 / UK Food Safety Act 1990', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained MRL 준수. 신선 과일 DEFRA 식물검역 입항 신고(IPAFFS) 의무. 가공 과일 제품: UK Retained Food Additives Reg 준수. 영어 단독 표기 의무. 포스트하베스트 처리제 UK 별도 승인 목록 확인 필수.', originalRequirement: 'Must comply with UK Retained MRL list. Fresh fruits require DEFRA phytosanitary entry notification (IPAFFS). Processed fruit products: UK Retained Food Additives Regulation. English-only labelling. Post-harvest treatment agents must be on UK-specific approved list.', advisory: 'Brexit 이후 EU 승인 포스트하베스트 처리제가 UK에서 불허될 수 있음 — FSA 최신 목록 확인 필수. IPAFFS 사전 등록 없이 입항 불가. Northern Ireland 수출 시 EU 식물검역 규정 적용(별도).', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'VPRÜ (잔류농약) / Verordnung über pflanzliche Lebensmittel / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VPRÜ 잔류농약 기준(EU MRL과 대부분 동일). 가공 과일 제품: LMG 식품 안전법 준수. 유기농 과일 Bio Suisse 인증. 국내 언어 최소 1개 라벨 의무. 신선 과일 식물검역 증명서 필요.', originalRequirement: 'Pesticide MRLs per VPRÜ (largely aligned with EU MRL). Processed fruit products: must comply with Swiss LMG. Organic fruits: Bio Suisse certification required. Labelling in at least one Swiss national language mandatory. Fresh fruits require phytosanitary certificate.', advisory: '스위스 유기농 과일 시장 규모 크고 Bio Suisse 인증이 사실상 시장 진입 요건. VPRÜ와 EU MRL 일부 차이 존재 — 수출 전 확인. 포스트하베스트 처리제 스위스 허용 목록 EU와 상이할 수 있음.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EC) 396/2005 + [Local] Plan Ecophyto / Loi Egalim Art. 44', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Plan Ecophyto 2030 농약 감축 목표로 수입 과일 잔류농약 강화 집행. Loi Egalim: EU에서 금지된 농약 사용 국가 원산지 수입 과일 제한 추진(상호주의 원칙). 과일 가공품(주스·잼) Nutri-Score 의무 표시. 글리포세이트 잔류 강화 모니터링.', originalRequirement: '[Strict Local Rule] Plan Ecophyto 2030 pesticide reduction driving stricter enforcement on imported fruit residues. Loi Egalim: ongoing push to restrict fruit imports from countries using EU-banned pesticides (reciprocity principle). Processed fruit products (juices, jams): Nutri-Score labelling mandatory. Enhanced glyphosate monitoring.', advisory: '[EU Deviation] Loi Egalim 상호주의 조항이 확대 시행될 경우 EU 금지 농약 사용 국가 원산지 과일 프랑스 수출 제한 가능 — 원산지 농약 사용 기록 준비 권장. 과일 주스 Nutri-Score 점수 사전 확인.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[FI] Soft Drink Tax (과일 주스 포함) / [HU] NETA 2011 / [DK] Sugar Tax Discussion', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 핀란드 가당음료세: 가당 과일 주스·넥타르 포함 적용(당류 0.5g/100mL 초과 시). 헝가리 NETA: 가당 과일 음료·과일 에너지드링크 세금 부과. 덴마크: 설탕세 재도입 논의 중(과일 주스 포함). Nutri-Score 자율 권장 국가(독일·벨기에): 과일 제품 점수 표시 시장 경쟁력 강화.', originalRequirement: '[EU Divergence] Finland soft drink tax: applies to sweetened fruit juices and nectars (>0.5g/100mL sugar). Hungary NETA: sweetened fruit drinks and energy drinks taxed. Denmark: sugar tax reintroduction under discussion (including fruit juices). Nutri-Score recommended for fruit products in voluntary countries (Germany, Belgium).', advisory: '가당 과일 음료 핀란드·헝가리 수출 시 세율 부과 규모 사전 계산 필수. 100% 과일 주스(무가당) 세금 면제 여부 핀란드 법령 확인. 저당 과일 음료 설계로 추가 세부담 회피 권장.' },
    ],
  },
  dairy: {
    title: 'Dairy & Milk Products — Global Regulations',
    icon: Milk,
    rows: [
      { country: 'South Korea (MFDS / MAFRA)', flag: '🇰🇷', law: '축산물 위생관리법 / 유가공품 기준 및 규격', lawUrl: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%B6%95%EC%82%B0%EB%AC%BC%EC%9C%84%EC%83%9D%EA%B4%80%EB%A6%AC%EB%B2%95', requirement: '원유: 체세포수 ≤ 400,000/mL, 세균수 ≤ 100,000/mL. 살균 의무 (저온살균 63°C 30분 또는 동등 이상). 항생제 잔류 불검출. 무항생제 인증 표시 기준 별도 적용.', originalRequirement: 'Raw milk: SCC ≤ 400,000/mL, bacteria ≤ 100,000/mL. Pasteurisation mandatory (≥63°C/30 min or equivalent). Antibiotic residues not detected. Antibiotic-free certification label rules apply separately.', advisory: '분유·조제유류는 식약처-MAFRA 이중 관할. 수출 시 수입국 유가공품 허가 상태 사전 확인 필수.' },
      { country: 'USA (FDA / USDA)', flag: '🇺🇸', law: '21 CFR Part 131 — Milk & Cream / PMO (Grade A Pasteurized Milk Ordinance)', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-131', requirement: 'Grade A 기준: 체세포수 ≤ 750,000/mL. 살균 의무. 치즈·버터·요거트 성분 기준 (21 CFR Parts 131-135). 영양성분표 내 첨가당 표시 의무.', originalRequirement: 'Grade A standards: SCC ≤ 750,000/mL. Pasteurisation mandatory. Standards of identity for cheese, butter, yogurt (21 CFR Parts 131-135). Added sugars declaration on Nutrition Facts.', advisory: 'PMO 최신 버전(2023 edition) 준수 여부 확인. 유사 유제품(lactose-free, plant-based) 명칭 사용 시 별도 FDA 기준 적용.' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Reg (EC) 853/2004 Annex III Section IX / Reg 1169/2011 — Labelling', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0853', requirement: '열처리 표시 의무. 치즈·버터·크림 성분 기준. "우유(Milk)" 명칭은 동물 원산에만 허용 (ECJ 판례). 원유 원산지 표시 라벨 의무.', originalRequirement: 'Heat-treatment marking mandatory. Compositional standards for cheese, butter, cream. "Milk" designation restricted to animal origin (ECJ ruling). Country of origin of milk required on label.', advisory: '원유 원산지 표시 의무(Reg 1169/2011 Art. 26) 준수 필수. 식물성 유제품 대체품은 "milk" 명칭 사용 불가.' },
      { country: 'Japan (CAA)', flag: '🇯🇵', law: '乳及び乳製品の成分規格等に関する省令 (CAA 이관 2026.04.01)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '우유 성분 기준: 유지방 3.0% 이상, 무지유고형분 8.0% 이상. 살균 의무. 알레르겐(우유) 의무 표시. 2026.04.01 소비자청으로 관할 이관.', originalRequirement: '牛乳成分規格：乳脂肪3.0%以上、無脂乳固形分8.0%以上。殺菌が義務。アレルゲン（乳）の表示が義務。2026年4月1日より消費者庁へ管轄移管。', advisory: 'CAA 이관 후 유제품 관련 허가·신고 창구 변경. 기능성표시식품 중 유제품 기반 제품도 CAA 심사 대상.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: '乳品類衛生標準 / 乳品名稱及標示規定 (2025.06 개정)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: '우유 제품명 및 표시 규정 2025.06.24 개정. 유지방 함량별 제품 명칭 기준 변경. 수입 유제품 검역 성적서 의무.', originalRequirement: '乳品名稱及標示規定於2025.06.24修訂。依乳脂肪含量分類之產品名稱基準變更。進口乳製品須附檢疫證明。', advisory: '2025.06 개정 제품명 기준 재검토 필수. "鮮乳" 등 명칭 사용 요건 변경 사항 확인.', urgency: 'Updated' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Regulations 1985 / JAKIM Halal Standard MS1500 / MAQIS 동물검역', lawUrl: 'https://www.moh.gov.my/', requirement: 'JAKIM 할랄 인증 필수(우유·유청 등 동물성 유래 전 성분). MAQIS 동물성 식품 검역 서류 3종(원산지 증명서·수의사 확인서·할랄 인증서). 살균 의무 및 MeSTI/HACCP 인증. 말레이어 라벨 표시 필수.', originalRequirement: 'JAKIM Halal Certification mandatory for all dairy products (including all animal-derived ingredients). MAQIS requires concurrent submission of three documents. Pasteurisation mandatory with MeSTI/HACCP certification. Malay-language labelling required.', advisory: '모든 유제품 JAKIM 할랄 인증 필수. 치즈류 동물성 레닛 사용 시 할랄 원산지 증명 필요. 수입 유제품 MAQIS 검역 2026.06 강화 시행 사전 준비.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'FSANZ Standard 2.5.1–2.5.7 (Dairy Products) / DAFF Biosecurity', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.5.1 우유 성분 기준: 살균 의무. 치즈: Standard 2.5.4 성분 기준 준수. ⚠️ 유청 단백 분말·분유류: DAFF 바이오보안 수입 허가 대상 여부 확인 필수. 항생제 잔류 기준: 페니실린 0.003 mg/kg.', originalRequirement: 'Standard 2.5.1 milk compositional requirements: pasteurisation mandatory. Cheese: Standard 2.5.4 compositional standards apply. Whey protein powder: DAFF biosecurity import permit requirement must be verified. Antibiotic residues: penicillin ≤ 0.003 mg/kg.', advisory: '생유(Raw Milk) 치즈 일부 수입 제한. 유청 단백 분말은 DAFF 바이오보안 허가 필요할 수 있음 — 처리 방식·원산지에 따라 상이. Health Star Rating 유제품 점수 사전 확인 권장.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 223:1993 (유제품 기준) / ECAS Halal / ESMA / UAE.S 2055', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'ECAS 또는 ESMA 승인 기관 할랄 인증 필수. GSO 223 유제품 성분 기준 준수. 살균 의무. ESMA 제품 등록. 아랍어 라벨 전 항목(유지방·단백질·알레르겐 포함) 표기 의무.', originalRequirement: 'Halal certification from ECAS or ESMA-approved body mandatory. Must comply with GSO 223:1993 dairy compositional standards. Pasteurisation mandatory. ESMA product registration required. Full Arabic labelling (fat content, protein, allergens included) obligatory.', advisory: '모든 유제품 할랄 인증 사실상 필수 — 레닛·유화제 등 동물성 첨가물 출처 검증 필요. 치즈류 수입 시 아랍어 전용 라벨 별도 제작 필수. GSO 2026 영양 표시 개정 대응 라벨 업데이트 필요.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 033/2013 — 우유·유제품 안전 기술규정 / TR TS 022/2011 표시', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 033/2013 우유·유제품 안전 기술규정 준수. 국가 위생등록(СГР) 필요. 살균 의무. 수의사 위생증명서 필수. 러시아어 라벨 전면 의무(유지방·단백질·제조일·유통기한 포함). 동물성 레닛 사용 치즈: 추가 성분 서류.', originalRequirement: 'EAC certification required. Must comply with TR TS 033/2013 Milk and Dairy Safety Technical Regulation. State sanitary registration (СГР) required. Pasteurisation mandatory. Veterinary health certificate required. Full Russian-language labelling (fat content, protein, manufacture date, expiry) mandatory. Animal rennet cheese: additional ingredient documentation required.', advisory: 'EAEU 유제품 수출 시 Rosselkhoznadzor 승인 도축·유가공 시설 목록 등재 여부 사전 확인. TR TS 033 성분 기준(유지방·단백질 함량) 한국 기준과 상이할 수 있음. 치즈 레닛 성분 출처 서류 러시아어로 준비 필요.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Milk Regulation', lawUrl: 'https://www.cfs.gov.hk/', requirement: '우유 수입 시 원산지별 검역 허가(Cap 132AH 준수). 영양성분 표시 의무. 영어·번체 중국어 병기 라벨. 살균 처리 표시 의무. 항생제 잔류 Codex 기준 적용.', originalRequirement: 'Milk import subject to origin-based quarantine approval (Cap 132AH). Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling required. Pasteurisation treatment disclosure mandatory. Antibiotic residues: Codex MRLs apply.', advisory: '홍콩 우유 수입 허가 원산지 목록(Cap 132AH) 확인 필수 — 미승인 원산지 수입 불가. 번체자 라벨 의무. 홍콩은 중국 본토와 유제품 검역 기준 별개 운영.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 853/2004 / UK Dairy Hygiene Regulations / DEFRA', lawUrl: 'https://www.food.gov.uk/', requirement: 'EU Reg 853/2004 UK Retained 버전 적용. 원유 체세포수 ≤ 400,000/mL(UK 자체 기준). 살균 의무. 치즈: UK 성분 기준 적용(EU와 유사하나 분리 운영). DEFRA 동물성 식품 수입 허가(IPAFFS) 필수. 영어 단독 표기.', originalRequirement: 'UK retained version of EU Reg 853/2004 applies. Raw milk SCC ≤ 400,000/mL (UK own standard). Pasteurisation mandatory. Cheese: UK compositional standards (similar to EU, but separately administered). DEFRA import authorisation (IPAFFS) for animal-origin products mandatory. English-only labelling.', advisory: 'Brexit 이후 EU 승인 유가공 시설도 UK DEFRA 별도 승인 목록 확인 필수. Raw Milk 치즈 UK 수입 규정 EU와 분리 적용. Northern Ireland 판매 시 EU SPS 규정 별도 적용.', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Lebensmittel tierischer Herkunft (VLtH) / Milchverordnung / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'VLtH 동물성 식품 규정 + Milchverordnung 우유 성분 기준 준수. EU MRA: EU 승인 유가공 시설 일반적 인정. 살균 의무. 국내 언어 최소 1개 표기. 유기농 유제품 Bio Suisse 인증 필요. 수의사 위생증명서 필수.', originalRequirement: 'VLtH animal-origin food regulation + Milchverordnung milk compositional standards. Switzerland-EU MRA: EU-approved dairy facilities generally accepted. Pasteurisation mandatory. Labelling in at least one Swiss national language. Organic dairy: Bio Suisse certification required. Veterinary health certificate mandatory.', advisory: '스위스 Milchverordnung 성분 기준 EU와 유사하나 독자 운영 — MRA 활용하되 항목별 확인 필수. Bio Suisse 유기농 유제품 인증 스위스 시장에서 프리미엄 강점. 수의사 증명서 스위스 FSVO 양식 요구 여부 사전 확인.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EC) 853/2004 + [Local] Code rural et de la pêche maritime / Nutri-Score Arrêté', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] Nutri-Score 유제품 의무 표시(2017). AOP/IGP(원산지 보호 표시): 특정 프랑스 치즈(카망베르·브리 등) 명칭 보호 — 동일 명칭 수출 제한. 우유 원산지 표시 Reg 1169/2011 Art.26 + 프랑스 추가 국내법 강화 집행. 유제품 광고 Loi Egalim 제한 준수.', originalRequirement: '[Strict Local Rule] Nutri-Score mandatory on dairy products (2017). AOP/IGP (Protected Designation of Origin): specific French cheese names (Camembert, Brie, etc.) protected — export using identical names restricted. Milk origin labelling: EU Reg 1169/2011 Art.26 + stricter French national enforcement. Dairy advertising subject to Loi Egalim restrictions.', advisory: '[EU Deviation] 프랑스 AOP/IGP 치즈 명칭 사용 제한 — 수출 제품명 사전 법적 검토 필수. Nutri-Score 유제품 점수(지방·포화지방 영향) 사전 시뮬레이션. 우유 원산지 표시 프랑스 강화 집행 대응 라벨 준비.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[FI] Soft Drink Tax (가당 유제품 음료) / [HU] NETA 2011 / [SE] Livsmedelsverket 영양 권고', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 핀란드 가당음료세: 가당 유제품 음료(가당 요거트 드링크·가당 밀크음료) 세금 부과 여부 확인(당류 함량 기준). 헝가리 NETA: 가당 유제품 음료·에너지 유제품 포함 검토. 스웨덴 Livsmedelsverket: 포화지방 저감 권고(유제품 적용). Nutri-Score 국가별 의무·자율 상이.', originalRequirement: '[EU Divergence] Finland soft drink tax: verify applicability to sweetened dairy beverages (sweetened yogurt drinks, flavoured milk) based on sugar content. Hungary NETA: sweetened dairy drinks potentially included. Sweden Livsmedelsverket: saturated fat reduction recommendations (applicable to dairy). Nutri-Score mandatory/voluntary varies by country.', advisory: '가당 유제품 음료(초코우유·가당 요거트 드링크) 핀란드·헝가리 세율 부과 여부 사전 확인. 포화지방 높은 유제품 Nutri-Score 점수 낮아질 수 있음 — 저지방 제품 라인 병행 검토. 북유럽 소비자 저당·저지방 유제품 선호도 높음.' },
    ],
  },
  bakery: {
    title: 'Bakery & Confectionery — Global Regulations',
    icon: CakeSlice,
    rows: [
      { country: 'South Korea (MFDS)', flag: '🇰🇷', law: '식품공전 과자류 / 빵류 / 만두류 기준', lawUrl: 'https://www.foodsafetykorea.go.kr/foodcode/01_01.jsp', requirement: '트랜스지방: 4g/100g↓ (전용 기준). 보존료: 프로피온산, 소르빈산 등 사용 기준 준수. 알레르겐 22종 의무 표시. 식품첨가물 공전 기준 성분표 검토 필수.', originalRequirement: 'Trans fat: ≤4g/100g. Preservatives: propionic acid, sorbic acid limits per Food Code. 22 allergens mandatory labelling. Additive list compliance required.', advisory: '알레르겐 교차오염 표시(may contain) 권장. 트랜스지방 0g 표시 기준(0.2g/100g↓) 확인.' },
      { country: 'USA (FDA)', flag: '🇺🇸', law: '21 CFR Part 136-137 — Bakery Products / Trans Fat Rule', lawUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-136', requirement: 'PHO(부분수소화유) 사용 금지. 빵·롤 성분 규격 기준. 첨가당 표시 의무. 전면 영양 표시(FoPL) 규칙 제안 중(2025).', originalRequirement: 'PHO (Partially Hydrogenated Oils) banned. Standards of identity for bread, rolls. Added sugars declaration mandatory. Front-of-Package Nutrition Labeling rule proposed (2025).', advisory: 'PHO 성분 포함 제품 미국 수출 불가. FoPL 제안 규칙 모니터링 및 라벨 개정 사전 준비 권장.', urgency: 'PROPOSED' },
      { country: 'EU (EFSA)', flag: '🇪🇺', law: 'Reg (EC) 1333/2008 Annex II Cat 07 — Bakery Additives', lawUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32008R1333', requirement: 'Cat 07 첨가물: BHA(E320) 최대 200 mg/kg, BHT(E321) 최대 100 mg/kg. 이산화티타늄(E171) 금지. 산업용 트랜스지방 최대 2g/100g 지방 기준.', originalRequirement: 'Category 07 additives: BHA (E320) max 200 mg/kg, BHT (E321) max 100 mg/kg. TiO2 (E171) banned. Trans fat regulation: max 2g/100g fat from industrial trans fats.', advisory: 'E171 사용 즉시 중단. 트랜스지방 기준 엄격 적용 중. Annex II Cat 07 최신 개정 목록(2025년 11월 지침) 교차 확인 필수.', urgency: 'Nov 2025' },
      { country: 'Japan (CAA)', flag: '🇯🇵', law: '菓子類食品規格 / 食品添加物公定書 (2026.04.01 CAA 이관)', lawUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/', requirement: '보존료·산화방지제 등 첨가물 기준 준수. 알레르겐 8종 의무 + 20종 권장 표시. 2026.04.01 소비자청 이관.', originalRequirement: '保存料・酸化防止剤等の添加物基準に準拠。アレルゲン8品目義務表示＋20品目推奨表示。2026年4月1日より消費者庁へ移管。', advisory: '제과류 알레르겐 표시 폰트·위치 기준 재확인. CAA 이관 후 신제품 신고 절차 업데이트.', urgency: 'D-22' },
      { country: 'Taiwan (TFDA)', flag: '🇹🇼', law: '食品添加物使用範圍及限量 / GABA 제한 기준 (2025.02 시행)', lawUrl: 'https://www.fda.gov.tw/ENG/law.aspx?cid=16', requirement: 'GABA(γ-아미노뷰티르산) 함유 제과류: 2025.02.13 사용 제한 및 의무 표시 시행. 보존료·감미료 사용 한도 준수. 중국어 표시 의무.', originalRequirement: 'Bakery products containing GABA (γ-aminobutyric acid): use restrictions and mandatory labelling effective 2025.02.13. Preservative/sweetener usage limits apply. Chinese labelling mandatory.', advisory: 'GABA 함유 제과 제품 전면 검토. 표시사항 TFDA 기준 재검토. 신규 첨가물 허가 목록 최신화 필요.', urgency: 'Updated' },
      { country: 'China (SAMR)', flag: '🇨🇳', law: 'GB 7099 / GB 2760 — 糕点·饼干 식품 첨가물 기준 (SAMR)', lawUrl: 'https://www.samr.gov.cn/', requirement: 'Sunset Yellow(일몰황, 황색4호) 최대 100mg/kg(2026.01 강화). 사카린·사이클라민산나트륨 사용 허용(한도 내). 이산화티타늄(E171) 사용 가능(EU와 상이). 알레르겐 중국어 표시 의무.', originalRequirement: '日落黄（柠檬黄）最大允许量100mg/kg（2026年1月实施）。糖精钠·环磺酸钠在限量内可用。二氧化钛（E171）可使用（与EU不同）。过敏原需中文标注。', advisory: '한국 허용 색소가 GB 2760에 없을 수 있음(예: 적색2호 금지). Sunset Yellow 100mg/kg 신기준(2026.01) 즉시 적용. GACC 등록 없이 수출 불가.', urgency: '2026.01' },
      { country: 'Vietnam (VFA)', flag: '🇻🇳', law: 'Thông tư 24/2019/TT-BYT — 식품첨가물 허용기준 (VFA)', lawUrl: 'https://vfa.gov.vn/en/news.html', requirement: '아조계 색소(타르트라진, 선셋옐로우, 퀴놀린옐로우) 한도 강화 적용. Potassium Bromate 사용 전면 금지. 보존료(소르빈산·프로피온산) 한도 Circular 24 준수. 베트남어 라벨 필수.', originalRequirement: 'Tăng cường kiểm soát phẩm màu azo (Tartrazine, Sunset Yellow, Quinoline Yellow). Cấm hoàn toàn Potassium Bromate. Chất bảo quản theo Thông tư 24. Nhãn tiếng Việt bắt buộc.', advisory: 'Potassium Bromate 포함 제품 수출 즉시 중단. 아조계 색소 Circular 24 최신 한도 확인 필수. 수입 허가 갱신 2026.01 온라인 전환 사전 준비 필요.' },
      { country: 'Thailand (Thai FDA)', flag: '🇹🇭', law: 'Notification of MoPH No. 281 / 383 — 과자·빵류 식품첨가물 (Thai FDA)', lawUrl: 'https://www.fda.moph.go.th/sites/food/SitePages/NewsUpdate.aspx', requirement: 'Cyclamate 사용 전면 금지(식품 내 허용 불가). 타르트라진(Tartrazine, E102) 최대 50mg/kg(2025.07 강화). 보존료·착색료 허용 목록 Notification 281/383 준수. 태국어 라벨 의무.', originalRequirement: 'ห้าม Cyclamate ในอาหารทุกประเภท Tartrazine สูงสุด 50 mg/kg (เข้มข้นขึ้นตั้งแต่ ก.ค.2568) วัตถุเจือปนตาม ประกาศ 281/383 ฉลากภาษาไทยบังคับ', advisory: 'Cyclamate·Potassium Bromate 함유 제품 태국 수출 금지. Tartrazine 50mg/kg 신기준(2025.07) 즉시 적용. 2026.04 수입 허가 갱신 온라인 시스템 등록 사전 준비.', urgency: '주의' },
      { country: 'Indonesia (BPOM)', flag: '🇮🇩', law: 'BPOM Reg. No. 22 Tahun 2019 + SNI 01-3840 (Bakery) + BPJPH 할랄 의무화', lawUrl: 'https://www.pom.go.id/', requirement: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능.', originalRequirement: 'Registrasi BPOM ML wajib untuk produk bakeri dan konfeksionari. Gelatin/shortening asal babi tidak diperbolehkan (persyaratan halal). Potassium Bromate dilarang. Hanya pewarna yang disetujui BPOM yang boleh digunakan.', advisory: '제과·제빵류 BPOM ML 등록 필수. 돼지 유래 젤라틴/쇼트닝 사용 불가 (할랄 인증 조건). Potassium Bromate 사용 금지. 색소는 BPOM 허가 목록 내 성분만 사용 가능' },
      { country: 'Philippines (FDA PH)', flag: '🇵🇭', law: 'FDA AO 2014-0030 + BFAD 식품첨가물 기준 + Codex Stan 118 준용', lawUrl: 'https://www.fda.gov.ph/', requirement: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요.', originalRequirement: 'CPR registration and LTO mandatory for bakery products. Azo dyes such as Tartrazine (E102) require allergen declaration on label. Imported bakery products must be accompanied by phytosanitary certificate and certificate of origin.', advisory: '제과류 CPR 등록 및 LTO 필수. Tartrazine(E102) 등 Azo 계열 색소 사용 시 알레르겐 표기 의무. 수입 베이커리류는 phytosanitary 증명서 + 원산지 증명 필요' },
      { country: 'Canada (CFIA)', flag: '🇨🇦', law: 'Safe Food for Canadians Regulations (SFCR 2019) + FDR Division 16 (Food Additives) + Health Canada Permitted Food Additives', lawUrl: 'https://www.canada.ca/en/health-canada.html', requirement: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수.', originalRequirement: 'Potassium Bromate prohibited (banned in Canada since 1994). Azodicarbonamide (ADA) permitted up to 45 ppm. FOPL (Front-of-Package Labelling) mandatory for high-sugar bakery products from 2026.01.01. Bilingual (English/French) labelling required.', advisory: 'Potassium Bromate 사용 금지 (캐나다 1994년 금지). Azodicarbonamide(ADA) 제한적 허용(45 ppm). 2026.01.01부터 FOPL 고당류 경고 라벨 의무화. 영어·불어 이중 표기 필수' },
      { country: 'Malaysia (MOH/JAKIM)', flag: '🇲🇾', law: 'Food Regulations 1985 / JAKIM Halal MS1500', lawUrl: 'https://www.moh.gov.my/', requirement: 'Food Regulations 1985 허용 첨가물 목록 준수. 라드(돼지기름)·돼지 유래 젤라틴 사용 금지 — JAKIM 인증 식물성 쇼트닝으로 대체 필수. MeSTI 인증 권장. 말레이어 표시 의무.', originalRequirement: 'Pematuhan senarai bahan tambah yang dibenarkan dalam Food Regulations 1985 diperlukan. Lemak babi (lard) dan gelatin berasi babi dilarang sepenuhnya — shortening sayur-sayuran bertauliah JAKIM wajib digunakan sebagai pengganti. Pensijilan MeSTI disyorkan. Pelabelan bahasa Melayu diwajibkan.', advisory: '제과류 내 라드(돼지기름)·젤라틴(돼지 유래) 사용 전면 금지. JAKIM 인증 식물성 쇼트닝으로 대체 필수. 타르트라진 등 아조계 색소 허용 목록 확인.' },
      { country: 'Australia (FSANZ)', flag: '🇦🇺', law: 'Food Standards Code Standard 2.9.1 / Biosecurity Act 2015', lawUrl: 'https://www.foodstandards.gov.au/', requirement: 'Standard 2.9.1 제과 성분 기준 준수. Potassium Bromate 사용 금지. 난황·우유 성분 포함 제품은 Biosecurity Import Permit 취득 여부 사전 확인 필수.', originalRequirement: 'Must comply with Food Standards Code Standard 2.9.1 compositional requirements for bakery products. Potassium Bromate prohibited. Products containing egg yolk or dairy ingredients must confirm DAFF Biosecurity Import Permit requirement prior to export.', advisory: '난황·우유 성분 포함 제과류 바이오보안 수입 허가 대상 여부 확인 필수. Potassium Bromate 금지. Health Star Rating 표시 시 제과류 경쟁력 강화 효과 기대.' },
      { country: 'UAE (MoIAT)', flag: '🇦🇪', law: 'GSO 201:1994 / ESMA Halal Food Standard / FTA Excise Tax', lawUrl: 'https://www.moiat.gov.ae/', requirement: 'GSO 201:1994 제과 기준 준수. ESMA 제품 등록 및 아랍어 라벨 전 항목 표기 의무. 동물성 유화제(E471 등) 할랄 인증 필수. 고당류 제품 설탕세(Excise Tax) 적용 대상 확인 필요.', originalRequirement: 'Must comply with GSO 201:1994 confectionery standards. ESMA product registration and full Arabic labelling obligatory. Animal-derived emulsifiers (e.g. E471) require halal certification. High-sugar products must confirm Excise Tax applicability.', advisory: '제과류 고당류 제품 설탕세 확대 적용 논의 중. 저당 제품군 전환 검토. 동물성 유화제(E471 등) 출처 할랄 인증 필수. 아랍어 성분 라벨 전 항목 표기.' },
      { country: 'Russia/EAEU (EAC)', flag: '🇷🇺', law: 'TR TS 021/2011 / TR TS 029/2012 첨가물 / TR TS 022/2011 표시 기술규정', lawUrl: 'https://www.eurasiancommission.org/', requirement: 'EAC 인증 필수. TR TS 021 식품 안전 + TR TS 029 첨가물 기준 준수. 러시아 특유 금지 성분: Potassium Bromate 금지, E171(이산화티타늄) EAEU에서 사용 가능(EU와 상이). Tartrazine·Sunset Yellow: TR TS 029 한도 내 허용. 러시아어 라벨 전면 의무(성분명 러시아어).', originalRequirement: 'EAC certification required. Must comply with TR TS 021 Food Safety + TR TS 029 Additives Technical Regulation. Russia-specific: Potassium Bromate banned; E171 (titanium dioxide) permitted in EAEU (different from EU ban). Tartrazine and Sunset Yellow permitted within TR TS 029 limits. Full Russian-language labelling including all ingredient names in Russian mandatory.', advisory: '⚠️ EAEU에서 E171(이산화티타늄) 사용 가능 — EU·영국·프랑스 수출 시에는 금지, EAEU 수출 시에는 허용. 이중 수출용 제품은 성분 별도 관리 필요. TR TS 029 한도 내 색소·보존료 사용 여부 확인. 성분명 러시아어 번역 정확성 검수 필수.', urgency: 'EAEU 5국' },
      { country: 'Hong Kong (CFS/FEHD)', flag: '🇭🇰', law: 'Food and Drugs (Composition and Labelling) Regulations Cap 132W / Cap 132U Additives', lawUrl: 'https://www.cfs.gov.hk/', requirement: '제과·베이커리: Pre-market approval 불필요. 첨가물은 Cap 132U 허용 목록 준수. 영양성분 표시 의무. 영어·번체 중국어 병기 라벨 필수. Potassium Bromate 금지. E171(이산화티타늄): 중국 본토와 달리 홍콩에서 사용 가능(Codex 기준).', originalRequirement: 'Bakery/confectionery: no pre-market approval required. Additives must be from Cap 132U permitted list. Mandatory Nutrition Information labelling. Bilingual English/Traditional Chinese labelling required. Potassium Bromate banned. E171 (titanium dioxide): permitted in Hong Kong unlike mainland China (Codex standard applies).', advisory: '홍콩은 Codex 기반 대부분 성분 허용. 단, Cap 132U 목록 외 첨가물 사용 시 위반. 번체자 병기 필수 — 간체자만 표기 시 판매 불가. E171 홍콩 허용이나 EU 수출 병행 시 성분 관리 분리 필요.' },
      { country: 'UK (FSA) [Post-Brexit]', flag: '🇬🇧', law: 'UK Retained Regulation (EC) 1333/2008 Annex II Cat 07 / UK Food Safety Act', lawUrl: 'https://www.food.gov.uk/', requirement: 'UK Retained Food Additives Reg(EU Reg 1333/2008 기반) 준수. E171(이산화티타늄): UK 독자 판단 — 현재 EU 금지 기준 미반영 여부 FSA 최신 확인 필수. Potassium Bromate 금지. PHO(부분수소화유) 금지. 트랜스지방 EU 동일 기준. 영어 단독 표기.', originalRequirement: 'Must comply with UK Retained Food Additives Regulation (based on EU Reg 1333/2008). E171 (titanium dioxide): UK making independent determination — verify current FSA status (EU ban may not be automatically mirrored). Potassium Bromate banned. PHO (Partially Hydrogenated Oils) banned. Trans fat standards same as EU. English-only labelling.', advisory: 'Brexit 이후 EU 첨가물 금지 결정이 UK에 자동 적용 안 됨 — E171 등 논란 성분 UK FSA 최신 상태 확인 필수. UK FOPL(Front-of-Package Labelling) 도입 검토 중 — 동향 모니터링 권장. NI 판매 시 EU 첨가물 규정 적용(별도).', urgency: 'Post-Brexit' },
      { country: 'Switzerland (FSVO/FSAS)', flag: '🇨🇭', law: 'Verordnung über Zusatzstoffe in Lebensmitteln (ZuV) / Verordnung über Backwaren / LMG', lawUrl: 'https://www.blv.admin.ch/', requirement: 'ZuV 식품 첨가물 규정 준수(EU Reg 1333/2008과 대부분 일치하나 독자 운영). E171(이산화티타늄): 스위스 독자 검토 중 — 현재 상태 FSVO 확인 필수. Potassium Bromate 금지. 유기농 베이커리 Bio Suisse 기준. 국내 언어 최소 1개 라벨 의무.', originalRequirement: 'Must comply with ZuV Food Additives Ordinance (largely aligned with EU Reg 1333/2008 but independently administered). E171 (titanium dioxide): under Swiss independent review — verify current FSVO status. Potassium Bromate banned. Organic bakery: Bio Suisse standards. Labelling in at least one Swiss national language mandatory.', advisory: '스위스 ZuV와 EU 첨가물 목록 대부분 일치하나 일부 항목 독자 결정 — 수출 전 FSVO 최신 목록 교차 확인. E171 스위스 현황 EU 금지와 다를 수 있음. 유기농 베이커리 Bio Suisse 인증이 스위스 시장 필수 요건.' },
      { country: 'France (DGCCRF) [🚨 EU Divergence]', flag: '🇫🇷', law: '[EU Base] Reg (EC) 1333/2008 + [Local] Arrêté du 8 fév 2021 (E171 금지) / Nutri-Score', lawUrl: 'https://www.economie.gouv.fr/dgccrf', requirement: '[Strict Local Rule] E171(이산화티타늄): 프랑스 2021.01.01부터 단독 금지(EU 전체 금지 2022.02보다 선행). Nutri-Score 의무(제과류 포함). Loi Egalim: 고당류 제과 광고 제한. 글리포세이트 잔류 밀가루 강화 모니터링. PHO 금지(EU 공통). 트랜스지방 ≤ 2g/100g 지방(EU 공통).', originalRequirement: '[Strict Local Rule] E171 (titanium dioxide): France independently banned from 2021.01.01 (preceding EU-wide ban of 2022.02). Nutri-Score mandatory for bakery products. Loi Egalim: advertising restrictions on high-sugar confectionery. Enhanced monitoring of glyphosate in flour. PHO banned (EU-wide). Trans fat ≤ 2g/100g fat (EU-wide).', advisory: '[EU Deviation] 🚨 E171 사용 제품 프랑스 수출 절대 금지 — EU 금지(2022.02) 이전 프랑스 이미 금지(2021.01) 시행. 프랑스 수출 베이커리 E171 대체 성분(스타치·탄산칼슘 등) 즉시 적용 확인. Nutri-Score 제과 점수 D 이하 시 프랑스 시장 경쟁력 불이익.' },
      { country: 'Nordic/Hungary [🚨 EU Divergence — Tax]', flag: '🇫🇮', law: '[HU] NETA 2011 (제과·스낵) / [FI] Soft Drink Tax / [DK] Sugar Tax / [NO] Avgift sukker', lawUrl: 'https://www.stm.fi/', requirement: '[EU Divergence] 헝가리 NETA: 고당류 과자·사탕·초콜릿바 건강세 부과(상품별 차등세율). 핀란드 가당음료세: 음료성 제과(가당 시럽·초콜릿 음료) 포함 여부 확인. 노르웨이 설탕세(Avgift sukker): 설탕 kg당 세금 부과 — 초콜릿·제과류 직접 영향. 덴마크: 지방세 폐지(2012), 설탕세 논의 재개.', originalRequirement: '[EU Divergence] Hungary NETA: high-sugar confectionery, candy, chocolate bars subject to health tax (differentiated rates). Finland soft drink tax: verify inclusion of confectionery beverages (sweetened syrups, chocolate drinks). Norway sugar tax (Avgift sukker): per-kg sugar tax directly impacts chocolate/confectionery. Denmark: fat tax abolished (2012), sugar tax discussion restarted.', advisory: '노르웨이 설탕세가 제과류 원가에 직접 영향 — 수출 가격 경쟁력 분석 필수. 헝가리 NETA 제과 세율표 최신 버전 확인 및 제품별 세금 부담 계산. 저당·무가당 제과 라인 개발로 북유럽·헝가리 세금 부담 최소화 전략 권장.' },
    ],
  },
};

const FoodCategorySection = ({ tabKey, searchQuery }: { tabKey: string; searchQuery: string }) => {
  const data = CATEGORY_DATA[tabKey];
  if (!data) return null;
  const { title, icon: Icon, rows } = data;
  const filtered = searchQuery
    ? rows.filter(r =>
        r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.law.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requirement.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rows;
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
                    {r.urgency && (
                      <span className="mt-1 inline-block px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded italic">{r.urgency}</span>
                    )}
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
      { name: 'Glucosamine', nameLocal: '글루코사민', function: '관절 및 연골 건강에 도움', limit: '1,500 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Probiotics (Lactobacillus spp.)', nameLocal: '유산균(프로바이오틱스)', function: '장내 유익균 증식 및 유해균 억제, 배변 활동 원활', limit: '1억~100억 CFU/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Omega-3 (EPA+DHA)', nameLocal: '오메가-3 지방산', function: '혈중 중성지방 개선, 혈행 개선에 도움', limit: 'EPA+DHA 0.5~2 g/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Red Yeast Rice Extract', nameLocal: '홍국 추출물', function: '혈중 콜레스테롤 개선에 도움', limit: '모나콜린K 4~8 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Coenzyme Q10', nameLocal: '코엔자임 Q10', function: '항산화에 도움', limit: '90~100 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Lutein', nameLocal: '루테인', function: '눈 건강(황반색소 밀도 유지)에 도움', limit: '10~20 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Milk Thistle Extract (Silymarin)', nameLocal: '밀크씨슬 추출물', function: '간 건강에 도움', limit: '실리마린 130 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
      { name: 'Vitamin C (Ascorbic Acid)', nameLocal: '비타민 C', function: '항산화, 피부 건강, 철 흡수율 증가에 도움', limit: '100~1,000 mg/일', lawRef: '건강기능식품 기준 및 규격 고시 (MFDS)', lawUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do' },
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
      { name: 'Probiotics (Lactobacillus / Bifidobacterium)', nameLocal: '益生菌（乳酸菌 / 双歧杆菌）', function: '장내 유익균 증식, 소화 및 면역 건강 유지에 도움', functionLocal: '有助于促进肠道有益菌增殖，改善肠道微生物平衡，维护消化道健康。', limit: '균주·제품별 상이 (통상 10억~100억 CFU/일)', lawRef: 'CFSA 益生菌许可菌株名单 / 保健食品备案 원료', lawUrl: 'https://www.cfsa.net.cn/Article/News.aspx' },
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
      { chemical: 'Titanium Dioxide (TiO₂)', cas: '13463-67-7', route: '흡입 경로', threshold: '흡입 NSRL: 0.1 μg/day', listed: '2022.10.25', warningType: 'Cancer', relevance: '식품 첨가물 E171 — 분말 공정 중 흡입 노출 경로. 식품 내 경구 노출은 별도 평가 중.', relevanceEn: 'Listed 10/25/2022. Airborne, unbound particles of respirable size. Inhalation route only — NSRL 0.1 μg/day. Oral route in food use under separate OEHHA evaluation. Relevant to E171 (food-grade TiO₂) powder handling during manufacturing.' },
      { chemical: 'Acrylamide', cas: '79-06-1', route: '경구 · 흡입', threshold: 'NSRL(cancer): 0.2 μg/day', listed: '1990', warningType: 'Cancer + Reproductive', relevance: '고온 조리(굽기·튀기기) — 감자칩·커피·시리얼·제과류에서 열분해 생성.', relevanceEn: 'Listed 01/01/1990 (cancer); 02/25/2011 (reproductive). Formed via Maillard reaction between asparagine and reducing sugars at temperatures >120°C. High-risk foods: potato chips, french fries, coffee, breakfast cereals, baked goods. NSRL: 0.2 μg/day; MADL: 140 μg/day.' },
      { chemical: 'Lead', cas: '7439-92-1', route: '경구', threshold: 'MADL: 0.5 μg/day', listed: '1987', warningType: 'Reproductive', relevance: '식품 포장재·납 유약 도자기·일부 허브 보충제·칼슘 원료 (굴 껍데기 등).', relevanceEn: 'Listed 10/01/1987 (reproductive). MADL: 0.5 μg/day. Found in: lead-glazed ceramics, some calcium supplements (oyster shell, bone meal, dolomite), certain herbal supplements, and food packaging materials with lead-based inks or coatings.' },
      { chemical: 'Arsenic (inorganic)', cas: '7440-38-2', route: '경구', threshold: 'NSRL(cancer): 10 μg/day', listed: '1987', warningType: 'Cancer', relevance: '쌀·쌀 단백질 보충제·해산물·음용수. 쌀 기반 FSMP 특히 주의.', relevanceEn: 'Listed 02/27/1987. NSRL: 10 μg/day. Inorganic arsenic naturally present in soil and water, concentrated in rice and rice-based products. Special concern for rice protein concentrate, seaweed, drinking water-based FSMP formulations.' },
      { chemical: 'Cadmium & Compounds', cas: '7440-43-9', route: '경구', threshold: 'NSRL(cancer): 4.1 μg/day', listed: '1987', warningType: 'Cancer + Reproductive', relevance: '해바라기씨·코코아·카카오닙·일부 해조류 원료 함유 가능성.', relevanceEn: 'Listed 10/01/1987 (cancer); 01/01/1988 (reproductive). NSRL: 4.1 μg/day. Cadmium naturally accumulates in sunflower seeds, cocoa, cacao nibs, certain seaweeds, and shellfish grown in cadmium-contaminated water or soil.' },
      { chemical: 'Furan', cas: '110-00-9', route: '경구', threshold: 'NSRL: 1 μg/day', listed: '2008', warningType: 'Cancer', relevance: '가열 처리 통조림·커피·이유식에서 열분해 부산물로 생성.', relevanceEn: 'Listed 01/01/2008. NSRL: 1 μg/day. Furan is a thermal degradation byproduct formed when foods are heat-processed in sealed containers. Highest levels found in: canned/jarred food, coffee (brewed and roasted), baby food (jars). Dissipates rapidly when containers are opened.' },
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
      { date: '1987~', rule: 'CA Bottle Bill (CRV)', detail: '음료 용기 보증금 표시 의무 — 24 fl oz 미만: $0.05 / 이상: $0.10. 라벨에 "CA CRV" 또는 "CA Redemption Value" 표시 필수.', detailEn: 'CA Public Resources Code §14560 et seq. (Beverage Container Recycling and Litter Reduction Act): Containers sold in CA must display "CA CRV" or "California Redemption Value." CRV deposit: $0.05 for containers < 24 fl oz; $0.10 for containers ≥ 24 fl oz. Beverages covered: carbonated soft drinks, beer/malt, wine coolers, distilled spirits, fruit drinks ≥10% juice, water, sports/energy drinks.' },
      { date: '1988~', rule: 'Prop 65 경고 문구 의무', detail: '주 표시면 또는 QR code 연결 페이지 허용 (2018 Safe Harbor Warning 형식). OEHHA 공인 문구 외 임의 변경 불가.', detailEn: 'CA Health & Safety Code §25249.6: "No person in the course of doing business shall knowingly and intentionally expose any individual to a chemical known to the state to cause cancer or reproductive toxicity without first giving clear and reasonable warning." — 2018 Safe Harbor Short-Form Warning: "⚠ WARNING: This product can expose you to [chemical name], which is known to the State of California to cause [cancer / birth defects or other reproductive harm]. For more information go to www.P65Warnings.ca.gov." (27 CCR §25603)' },
      { date: '2027.01.01', rule: 'AB 418 — 4종 성분 판매 금지 (2027.01.01)', detail: 'Red Dye 3 · BVO · Potassium Bromate · Propyl Paraben 함유 식품 CA 내 판매 금지. 위반 시 1차 $5,000 / 반복 $10,000 민사 과징금.', detailEn: 'CA Health & Safety Code §109935 (AB 418, enacted Oct 7 2023): "On and after January 1, 2027, a person shall not manufacture for sale, sell, deliver, hold, or offer for sale in commerce any food product in this state that contains any of the following: (1) brominated vegetable oil, (2) potassium bromate, (3) propylparaben, (4) Red Dye No. 3." Civil penalty: $5,000 for first violation; $10,000 for each subsequent violation.' },
      { date: '2027.12.31', rule: 'AB 2316 — 6종 인공색소 학교 식품 금지 (2027.12.31)', detail: 'Red 40 · Yellow 5 · Yellow 6 · Blue 1 · Blue 2 · Green 3 — 공립학교 급식·판매 식품 전면 금지. 가정 반입 및 펀드레이저 제품 제외.', detailEn: 'CA Ed. Code §49431.9 (AB 2316, enacted Sep 28 2024): "Commencing January 1, 2028, the governing board of a school district … shall not sell or provide any food product that contains any of the following synthetic food dyes: FD&C Red No. 40, FD&C Yellow No. 5, FD&C Yellow No. 6, FD&C Blue No. 1, FD&C Blue No. 2, FD&C Green No. 3 to a pupil during the school day on school grounds." Exemptions: food brought from home, fundraiser food sold off campus.' },
      { date: '2028.01.01', rule: 'CA SB 1249 — PFAS 포장재 규제 (예정 2028)', detail: '식품 포장재 PFAS(과불화화합물) 사용 금지 — 그리스/기름 방지 코팅재·방수 포장지 대체 필요.', detailEn: 'CA Health & Safety Code §109000 et seq. (SB 1249 / CA Safer Food Packaging Act): "On and after January 1, 2028, a manufacturer shall not sell, offer for sale, or distribute for sale in this state any food packaging that contains perfluoroalkyl or polyfluoroalkyl substances (PFAS) that have been intentionally added." Applies to all food packaging including paper, paperboard, and other materials.' },
    ],
    strictIngredients: [
      { enforcementDate: '2022.10.25', ingredient: 'Titanium Dioxide (E171)', limit: 'Prop 65 경고 의무 (흡입 NSRL 0.1 μg/day 기준)', law: 'CA Prop 65 — OEHHA (2022.10.25 등재)' },
      { enforcementDate: '2027.01.01', ingredient: 'Red Dye No. 3 (FD&C Red 3)', limit: '2027.01.01부터 CA 내 판매·제조 금지', law: 'CA AB 418 / Health & Safety Code §109935' },
      { enforcementDate: '2027.01.01', ingredient: 'Potassium Bromate', limit: '2027.01.01부터 판매 금지 (FDA는 GRAS 유지 중)', law: 'CA AB 418 / Health & Safety Code §109935' },
      { enforcementDate: '2027.01.01', ingredient: 'Brominated Vegetable Oil (BVO)', limit: '2027.01.01부터 금지 (FDA도 2024.07 전국 금지)', law: 'CA AB 418 / Health & Safety Code §109935' },
      { enforcementDate: '2027.01.01', ingredient: 'Propyl Paraben', limit: '2027.01.01부터 금지 (내분비계 교란)', law: 'CA AB 418 / Health & Safety Code §109935' },
      { enforcementDate: '2027.12.31', ingredient: 'Red 40 / Yellow 5 / Yellow 6 / Blue 1 / Blue 2 / Green 3', limit: '학교 급식·판매 식품에서 2027.12.31부터 금지', law: 'CA AB 2316 / California Food Safety Act (Schools)' },
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
      note: '2024년 NYC 보건부, 하루 첨가당 권고량(50g) 이상 메뉴에 당류 경고 아이콘 추가 확장 제안(심의 중). 아이콘은 공식 소금통 심볼(🧂) 사용 의무 — 임의 대체 불가.',
      noteEn: 'NYC Health Code §81.49 (eff. Dec 1 2015): "Any covered establishment that offers for sale a menu item that contains 2,300 milligrams or more of sodium shall post a sodium warning symbol on menus and menu boards in a manner clearly associated with that menu item." Symbol must be an image of a salt shaker. Covered establishments: chain restaurants with ≥15 locations nationally. Penalty: $200 per violation. (Upheld by NYS Court of Appeals, 2016.)'
    },
    labelingRules: [
      { date: '2008.07.01', rule: 'NYC Trans Fat 규제 (2006~)', detail: 'NYC 음식점 조리유 트랜스지방 0 g 기준 적용. 패키지 식품은 연방 FDA 21 CFR 101.9 기준.', detailEn: 'NYC Health Code §81.08 (eff. Jul 1 2008): "No food service establishment shall store, use, or serve any food that contains artificial trans fat, except for food that is served in a manufacturer\'s original sealed package." Artificial trans fat defined as any partially hydrogenated vegetable shortening or oil with ≥0.5g trans fat per serving. This NYC regulation predated the FDA nationwide ban (2018).' },
      { date: '2015.12.01', rule: 'NYC Health Code §81.49 — 나트륨 경고 아이콘 (2015.12~)', detail: '체인 레스토랑(전국 15곳+) 메뉴에서 나트륨 ≥2,300mg인 항목마다 소금통 경고 아이콘 표시 의무. "이 아이템은 하루 나트륨 권고량(2,300mg)을 초과합니다" 문구 병기. 위반 시 $200/건.', detailEn: 'NYC Health Code §81.49: Chain restaurants (≥15 U.S. locations) must display a salt-shaker warning symbol (🧂) next to any menu item with ≥2,300 mg sodium, accompanied by the statement: "This item contains high levels of sodium. Individuals who are at risk for hypertension, high blood pressure, or other cardiovascular diseases should consider limiting their sodium intake." Civil penalty: $200 per violation.' },
      { date: '2025~2026 시행 예정', rule: '첨가당 경고 아이콘 (2024 심의 중)', detail: 'NYC 보건부가 1회 섭취량 기준 첨가당 ≥50g(일일 권고량 100%) 메뉴 항목에 당류 경고 아이콘 표시 의무화 규칙 제안. 2025~2026년 시행 예정.', detailEn: 'NYC DOHMH Proposed Rule (2024): Chain restaurants would be required to display a warning symbol next to menu items containing ≥50g added sugars per serving (equivalent to 100% of the Daily Value). The rule is modeled on the sodium warning and is under public comment and regulatory review as of 2024–2025.' },
      { date: '시행 중', rule: 'NY Ag & Markets Law §201-a', detail: '원산지 강화 표시 — 중국산 꿀, 수입 해산물 등 원산지 라벨링 요건 연방 기준보다 엄격.', detailEn: 'NY Agriculture & Markets Law §201-a: Requires country-of-origin labeling for honey, seafood, and fresh produce sold at retail. Stricter enforcement than federal COOL (Country of Origin Labeling) under USDA 7 CFR §65. Chinese-origin honey must be explicitly labeled; blended honey must list all countries of origin in descending order of predominance.' },
      { date: '시행 중', rule: 'Caffeine 경고 (에너지 드링크)', detail: '카페인 농도 0.02% 초과 음료 → 경고 문구 의무 표시 (NY Mental Hygiene Law §19.13).', detailEn: 'NY Mental Hygiene Law §19.13: Beverages with caffeine content exceeding 0.02% by weight must bear the warning: "WARNING: This beverage contains caffeine and is not recommended for children, pregnant or nursing women, or persons sensitive to caffeine." Applies to energy drinks and highly caffeinated beverages sold in New York State.' },
    ],
    strictIngredients: [
      { enforcementDate: '2015.12.01', ingredient: '나트륨(Sodium) — 레스토랑 메뉴 항목', limit: '1회 제공량 ≥2,300mg → 경고 아이콘 의무 표시 (패키지 식품은 해당 없음)', law: 'NYC Health Code §81.49' },
      { enforcementDate: '2025~2026 시행 예정', ingredient: '첨가당(Added Sugars) — 레스토랑 메뉴 (제안)', limit: '1회 ≥50g → 당류 경고 아이콘 (2025~2026 시행 예정)', law: 'NYC 보건부 제안 규칙 (심의 중)' },
      { enforcementDate: '시행 중', ingredient: 'Added Caffeine (에너지 드링크류)', limit: '농도 >0.02% → 경고 라벨 의무', law: 'NY Mental Hygiene Law §19.13' },
      { enforcementDate: '시행 중', ingredient: '중국산 꿀', limit: '원산지 표시 누락 시 NY 내 판매 금지', law: 'NY Agriculture & Markets Law §201-a' },
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
      { enforcementDate: '2023.01~', ingredient: '나트륨·설탕 (주 시설·학교 급식)', limit: '주 시설·학교 내 식품 구매 시 나트륨·설탕 기준 제한 (민간 패키지 식품 강제 기준 없음)', law: 'MA Act to Advance Health Equity / 603 CMR 29.00' },
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
      { enforcementDate: '2022.01.01', ingredient: 'Bioengineered (BE/GMO) 성분', limit: 'NBFDS 기준 공시 의무 (연방 — WA 준용)', law: 'USDA AMS 7 CFR Part 66' },
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
  if (!date || date === '시행 중') return 'text-slate-400 dark:text-slate-600';
  if (date.includes('예정') || date.includes('논의') || date.includes('쯤')) return 'font-bold text-amber-500 dark:text-amber-400';
  const match = date.match(/(\d{4})[.\-](\d{2})[.\-](\d{2})/);
  if (match) {
    const d = new Date(`${match[1]}-${match[2]}-${match[3]}`);
    return d > new Date() ? 'font-bold text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-600';
  }
  return 'text-slate-400 dark:text-slate-600';
};

const NotifiedSection = ({ searchQuery }: { searchQuery: string }) => {
  const [activeCountry, setActiveCountry] = useState('KR');
  const [usTab, setUsTab] = useState<'federal' | 'states'>('federal');
  const [selectedUSState, setSelectedUSState] = useState('CA');
  const country = NOTIFIED_COUNTRIES.find(c => c.code === activeCountry)!;
  const isUS = activeCountry === 'US';
  const stateData = US_STATE_REGS[selectedUSState];
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
                CA Prop 65 · AB 418(2027 시행) · PFAS 포장 규제(2028 예정)가 연방 FDA 기준을 초과. CA 기준 충족 제품은 50개 주 전역 판매 가능 — 역방향 불가.
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

      {/* US Tab Switcher: Federal Standard / Strict States */}
      {isUS && (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setUsTab('federal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              usTab === 'federal'
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
            }`}
          >
            <CheckCircle2 className="size-4" />
            Federal Standard
          </button>
          <button
            onClick={() => setUsTab('states')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              usTab === 'states'
                ? 'bg-violet-600 text-white border-violet-600 shadow'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-400'
            }`}
          >
            <AlertCircle className="size-4" />
            Strict States
            <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black">CA Priority</span>
          </button>
        </div>
      )}

      {/* Table — Federal Standard (all countries) or Federal tab when US */}
      {(!isUS || usTab === 'federal') && (
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
                    {r.nameLocal}{(r as any).regulated && <span className="text-amber-500 font-bold ml-0.5">*</span>}
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
                      {r.functionLocal && (
                        <p className="text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 leading-relaxed italic">{r.functionLocal}</p>
                      )}
                      {(r as any).notes && (
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{(r as any).notes}</p>
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

      {/* ── Strict States Panel ─────────────────────────────────── */}
      {isUS && usTab === 'states' && (
        <div className="space-y-5">
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
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{rule.rule}</p>
                        {rule.date && <span className={`text-[10px] whitespace-nowrap ${getDateStyle(rule.date)}`}>({rule.date})</span>}
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
                          <td className={`px-4 py-3 text-xs whitespace-nowrap ${getDateStyle(item.enforcementDate)}`}>{item.enforcementDate ?? '—'}</td>
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

const IngredientsSection = ({ searchQuery }: { searchQuery: string }) => {
  const ingredients = [
    {
      name: 'Alulose',
      kr: 'Approved (Limit 10%)',  krUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do',
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
      kr: 'Functional Ingredient',  krUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do',
      us: 'GRAS',                   usUrl: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras',
      eu: 'Approved (Health Claim)', euUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32012R0432',
      cn: 'Approved (CFSA 보건식품)', cnUrl: 'https://www.cfsa.net.cn/Article/News.aspx',
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
      kr: 'Approved',  krUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do',
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
      kr: 'Functional',  krUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do',
      us: 'GRAS/NDI',    usUrl: 'https://www.fda.gov/food/dietary-supplements/new-dietary-ingredients-notifications-and-related-history',
      eu: 'QPS List',    euUrl: 'https://www.efsa.europa.eu/en/topics/topic/qualified-presumption-safety-qps',
      cn: 'Approved (CFSA 허용 균주 목록)', cnUrl: 'https://www.cfsa.net.cn/Article/News.aspx',
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
      kr: 'Indiv. Recognized', krUrl: 'https://www.foodsafetykorea.go.kr/portal/healthyfoodlife/functionalIngredient.do',
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

  const complianceData = [
    {
      market: 'USA (FDA)',
      product: 'Diabetic FSMP',
      banned: 'Certain synthetic colors (Red 3 in CA), Non-GRAS sweeteners',
      certificates: 'FSVP (Foreign Supplier Verification), FSMA 204 Traceability Record',
      standard: '21 CFR 101.9 / FSMA 204',
      standardUrl: 'https://www.ecfr.gov/current/title-21/chapter-I/part-101/section-101.9',
      risk: 'High (Traceability)',
      isLatest: true
    },
    {
      market: 'EU (EFSA)',
      product: 'Diabetic FSMP',
      banned: 'Titanium Dioxide (E171), High synthetic sweetener levels in Cat 13.2',
      certificates: 'Certificate of Free Sale, Health Certificate, Novel Food Auth',
      standard: 'Regulation 609/2013 / 1169/2011',
      standardUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32013R0609',
      risk: 'Medium (Labeling)',
      isLatest: true
    },
    {
      market: 'Taiwan (TFDA)',
      product: 'FSMP',
      banned: 'Ingredients not on GB standard approved list',
      certificates: 'SAMR Registration, Factory Audit Report',
      standard: 'GB 29922 / GB 25596',
      standardUrl: 'https://www.samr.gov.cn/',
      risk: 'Critical (Registration)',
      isLatest: false
    },
    {
      market: 'Japan (MHLW)',
      product: 'Special Use Food',
      banned: 'Walnut (as undeclared allergen), specific additives',
      certificates: 'Certificate of Origin, JAS Compliance',
      standard: 'Food Sanitation Act / CAA Labeling',
      standardUrl: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_special_dietary_uses/',
      risk: 'Low (Allergen Update)',
      isLatest: false
    },
    {
      market: 'China (SAMR)',
      product: '가공식품·제과·음료',
      banned: 'GB 2760 미등재 첨가물, 적색2호, Cyclamate 초과, Sunset Yellow >100mg/kg (2026.01~)',
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
      standard: 'Food Act B.E. 2522 / MoPH Notification 281/383',
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
    { id: 'France [EU Deviation 🚨]', code: 'FR', flag: '🇫🇷' },
    { id: 'Nordic/Hungary [EU Deviation 🚨]', code: 'EU+', flag: '🇫🇮' },
  ];

  const filtered = complianceData.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      d.market.toLowerCase().includes(q) || d.product.toLowerCase().includes(q) ||
      d.banned.toLowerCase().includes(q) || d.certificates.toLowerCase().includes(q) || d.standard.toLowerCase().includes(q);
    return matchSearch && d.market === selectedMarket;
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
                    <span className="font-bold text-sm">{d.market}</span>
                    {d.isLatest && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter">Latest Update</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{d.product}</p>
                </td>
                <td className="px-6 py-4 text-sm text-rose-500 font-medium max-w-xs">{d.banned}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">{d.certificates}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono text-slate-500">{d.standard}</span>
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
      other: "GB 2760 허용 목록에 없는 성분 사용 전면 금지. 일몰황 100mg/kg 한도(2026.01). 사이클라민산나트륨 한도 내 허용.",
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
      advice: "베트남어 라벨 번역 및 현지 수입업체와 라벨 형식 사전 협의 필수. 유통기한 표기 형식(DD/MM/YYYY) 준수.",
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
      other: "타르트라진 최대 50mg/kg으로 강화(2025.07 시행). 아조계 색소 전반적 한도 강화. MoPH Notification 383 기준 적용.",
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
    { id: 'EU', name: 'EU',               top: '22%', left: '54%', alert: 'FSMP Labeling Change: D-36', dotColor: '#eab308', bw: 72, bh: 44 },
    { id: 'JP', name: 'Japan',            top: '30%', left: '88%', alert: 'CAA Transfer: D-22 CRITICAL', dotColor: '#ef4444', bw: 18, bh: 34 },
    { id: 'CN', name: 'China',            top: '31%', left: '79%', alert: 'GACC Import Registration Revised', dotColor: '#ef4444', bw: 60, bh: 42 },
    { id: 'TW', name: 'Taiwan',           top: '37%', left: '84%', alert: 'Pesticide MRL + GABA Updated', dotColor: '#eab308', bw: 14, bh: 16 },
    { id: 'VN', name: 'Vietnam',          top: '41%', left: '79%', alert: 'Azo Color Limits Tightened + Potassium Bromate Banned', dotColor: '#ef4444', bw: 18, bh: 26 },
    { id: 'TH', name: 'Thailand',         top: '43%', left: '78%', alert: 'Cyclamate Banned + Tartrazine 50mg/kg (2025.07)', dotColor: '#ef4444', bw: 26, bh: 22 },
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

  // ── Timeline pagination (date descending, same-date groups kept together) ─
  const TIMELINE_PER_PAGE = 4;
  const _sortedTimeline = [...filteredTimeline].sort((a, b) => a.date.localeCompare(b.date));

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
                        {/* Tooltip */}
                        {hoveredMapCountry === country.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 shadow-xl rounded-lg p-2.5 border border-slate-200 dark:border-slate-700 z-30"
                          style={{ width: 'max-content', maxWidth: '220px' }}
                          >
                            <p className="text-[10px] font-bold text-primary">{country.name}</p>
                            <p className="text-[9px] text-slate-500 whitespace-normal leading-relaxed">{country.alert}</p>
                            <p className="text-[9px] font-bold mt-0.5" style={{ color: country.dotColor }}>
                              {selectedMapCountry === country.id ? 'Click to deselect' : 'Click to filter ↓'}
                            </p>
                          </motion.div>
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
                  { id: 'asia', label: 'Asia-Pacific', countries: [
                    { label: 'Australia (FSANZ)',                 iso: 'au' },
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
                                <div className="w-56 border-l border-slate-100 dark:border-slate-800 py-1 max-h-72 overflow-y-auto">
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
                                      <span className="leading-tight">{label}</span>
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
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activePhase, setActivePhase] = useState('design');

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const nutrients = [
    { name: '탄수화물', unit: '% 에너지',     mfds: { min: 45, max: 60, display: '45~60%' }, codex: { min: 40, max: 65, display: '40~65%' }, scale: 100, diff: 'MFDS 상한 5%p 더 엄격',       diffType: 'stricter' },
    { name: '단백질',   unit: '% 에너지',     mfds: { min: 15, max: 20, display: '15~20%' }, codex: { min: 12, max: 20, display: '12~20%' }, scale: 100, diff: 'MFDS 하한 3%p 더 높음',       diffType: 'stricter' },
    { name: '지방',     unit: '% 에너지',     mfds: { min: 20, max: 35, display: '20~35%' }, codex: { min: 25, max: 35, display: '25~35%' }, scale: 100, diff: '상한 동일, 하한 차이 존재',   diffType: 'different' },
    { name: '식이섬유', unit: 'g/100kcal',    mfds: { min: 1.0, max: 5,  display: '≥1.0g'  }, codex: { min: 1.5, max: 5,  display: '≥1.5g'  }, scale: 5,   diff: 'Codex 하한 0.5g 더 높음',    diffType: 'codex-stricter' },
    { name: '단순당',   unit: '% 탄수화물',   mfds: { min: 0,   max: 10, display: '≤10%'   }, codex: { min: 0,   max: 10, display: '≤10%'   }, scale: 20,  diff: '동일 기준',                   diffType: 'same' },
    { name: '나트륨',   unit: 'mg/100kcal',   mfds: { min: 0,   max: 250,display: '≤250mg' }, codex: { min: 0,   max: 300,display: '≤300mg' }, scale: 400, diff: 'MFDS가 50mg 더 엄격',         diffType: 'stricter' },
  ];

  const phases = [
    {
      id: 'design', label: '영양소 설계', icon: Calculator,
      items: [
        { id: 'd1', text: '탄수화물 45~60% kcal 범위 내 설계 확인', priority: 'critical' },
        { id: 'd2', text: '단백질 15~20% kcal 범위 내 설계 확인', priority: 'critical' },
        { id: 'd3', text: '지방 20~35% kcal 범위 내 설계 확인', priority: 'critical' },
        { id: 'd4', text: '단순당 ≤10% (탄수화물 대비) 확인', priority: 'critical' },
        { id: 'd5', text: '식이섬유 ≥1.0g/100kcal 확인', priority: 'high' },
        { id: 'd6', text: '나트륨 ≤250mg/100kcal 확인', priority: 'high' },
        { id: 'd7', text: '열량밀도 1.0~2.0kcal/mL 범위 검토', priority: 'medium' },
      ]
    },
    {
      id: 'raw', label: '원료 선정', icon: Wheat,
      items: [
        { id: 'r1', text: '저GI 탄수화물 원료 선택 (이소말툴로스, 팔라티노스, 완두콩전분 등)', priority: 'critical' },
        { id: 'r2', text: '식이섬유 원료 확인 (귀리 β-글루칸, 이눌린, 아카시아검)', priority: 'high' },
        { id: 'r3', text: '단백질 원료 MFDS 허가 현황 확인 (유청, 대두, 완두)', priority: 'critical' },
        { id: 'r4', text: '지방 원료 포화지방산 비율 검토 (올리브유·카놀라유 권장)', priority: 'high' },
        { id: 'r5', text: '감미료 사용 시 MFDS 허가 성분 여부 확인 (알룰로스, 스테비아)', priority: 'medium' },
        { id: 'r6', text: '원료 원산지 및 GMO 여부 확인', priority: 'medium' },
      ]
    },
    {
      id: 'functional', label: '기능성 성분', icon: FlaskConical,
      items: [
        { id: 'f1', text: '크롬(Cr): 1일 35μg 이하 Adequate Intake 기준 준수', priority: 'high' },
        { id: 'f2', text: '마그네슘: 1일 상한 350mg 초과 주의', priority: 'high' },
        { id: 'f3', text: '아연: 1일 35mg 이하 상한 준수', priority: 'medium' },
        { id: 'f4', text: '오메가-3 (EPA+DHA): 기능성 표시 근거 자료 준비', priority: 'medium' },
        { id: 'f5', text: '프로바이오틱스 함유 시 MFDS 개별인정 여부 확인', priority: 'medium' },
        { id: 'f6', text: '식물성 추출물 함유 시 이상반응 사례 검토', priority: 'low' },
      ]
    },
    {
      id: 'label', label: '표시 기준', icon: Tag,
      items: [
        { id: 'l1', text: '"당뇨병 환자를 위한 식품" 표시 근거 자료 구비 (MFDS 고시 별표)', priority: 'critical' },
        { id: 'l2', text: '영양성분 표시: 1회제공량 및 100mL/100g 기준 병기 필수', priority: 'critical' },
        { id: 'l3', text: '주의문구: "의사·영양사 지도 하에 사용" 필수 표시', priority: 'critical' },
        { id: 'l4', text: '원재료 함량 순서 표시 (함량 순 표기)', priority: 'high' },
        { id: 'l5', text: '알레르기 유발 원료 표시 여부 검토 (우유, 대두 등)', priority: 'high' },
        { id: 'l6', text: '용기·포장 최소 표시 면적 기준 확인', priority: 'medium' },
      ]
    },
    {
      id: 'test', label: '규격 시험', icon: Microscope,
      items: [
        { id: 't1', text: 'GI 지수 시험 (공인 기관, in vivo 방법 우선)', priority: 'high' },
        { id: 't2', text: '영양성분 함량 분석 시험 성적서 확보 (공인 검사기관)', priority: 'critical' },
        { id: 't3', text: '미생물 기준 충족 확인 (세균수, 대장균군, 살모넬라)', priority: 'critical' },
        { id: 't4', text: '중금속 기준 (납 ≤0.5mg/kg, 카드뮴 ≤0.1mg/kg)', priority: 'high' },
        { id: 't5', text: '유통기한 설정 시험 계획 수립', priority: 'medium' },
        { id: 't6', text: '산패도·점도·pH 안정성 시험', priority: 'medium' },
      ]
    },
  ];

  const allItems = phases.flatMap(p => p.items);
  const checkedCount = allItems.filter(i => checkedItems[i.id]).length;
  const totalCount = allItems.length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);
  const currentPhase = phases.find(p => p.id === activePhase)!;

  const priorityConfig: Record<string, { label: string; color: string }> = {
    critical: { label: '필수', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    high:     { label: '중요', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    medium:   { label: '권장', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    low:      { label: '참고', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="size-6 text-primary" />
          <h2 className="text-2xl font-bold">FSMP 영양조성 가이드 — 당뇨병용</h2>
        </div>
        <p className="text-sm text-slate-500 ml-9">
          한국 MFDS 특수의료용도식품 기준 vs. Codex STAN 180-1991 · R&D 배합 설계 참조용
        </p>
      </div>

      {/* Nutrient Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            영양소 기준 비교 — 한국(MFDS) vs. Codex
          </h3>
          <div className="flex items-center gap-5 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded bg-primary/70"></span>한국 MFDS</span>
            <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded bg-emerald-500/70"></span>Codex (CXS 180)</span>
          </div>
        </div>

        <div className="space-y-6">
          {nutrients.map((n) => {
            const mfdsLeft  = (n.mfds.min / n.scale) * 100;
            const mfdsWidth = ((n.mfds.max - n.mfds.min) / n.scale) * 100;
            const codexLeft  = (n.codex.min / n.scale) * 100;
            const codexWidth = ((n.codex.max - n.codex.min) / n.scale) * 100;
            const diffColor =
              n.diffType === 'same'          ? 'text-slate-400' :
              n.diffType === 'stricter'      ? 'text-primary' :
              n.diffType === 'codex-stricter'? 'text-emerald-600' : 'text-amber-600';
            return (
              <div key={n.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold w-20">{n.name}</span>
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
                    <span className="text-[10px] text-slate-500 w-10 text-right shrink-0">Codex</span>
                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                      <div
                        className="absolute top-0 h-full bg-emerald-500/70 rounded-full flex items-center justify-center"
                        style={{ left: `${codexLeft}%`, width: `${Math.max(codexWidth, 4)}%` }}
                      >
                        <span className="text-[9px] font-bold text-white px-1 whitespace-nowrap">{n.codex.display}</span>
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
            <span>출처: 식품의약품안전처 고시 「특수의료용도식품의 기준 및 규격」 (2024-79호) / Codex Alimentarius CXS 180-1991 (amended 2019).
            수치는 당뇨병용 FSMP 기준이며, 실제 제품 설계 시 최신 고시 원문을 반드시 확인하십시오.</span>
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
              배합 설계 체크리스트
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
            const isActive = activePhase === phase.id;
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
