/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Icon className="size-5" />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const NewsCard = ({ country, title, description, time, type }: { country: string, title: string, description: string, time: string, type: string }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer group"
  >
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

export default function App() {
  const [isGeneralFoodOpen, setIsGeneralFoodOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Microscope className="size-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-primary">Regu-Lens</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Global Regulation Hub</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Categories</p>
          <SidebarItem icon={Stethoscope} label="FSMP (Medical Food)" />
          <SidebarItem icon={FlaskConical} label="Functional Food" />
          <SidebarItem icon={Leaf} label="Plant-based" />

          <div className="space-y-1 mt-1">
            <button 
              onClick={() => setIsGeneralFoodOpen(!isGeneralFoodOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
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
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-lg leading-none">🍜</span>
                  <span className="text-sm">Noodles</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-lg leading-none">🥬</span>
                  <span className="text-sm">Fresh Food</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-lg leading-none">🍪</span>
                  <span className="text-sm">Confectionery</span>
                </a>
              </motion.div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Personal</p>
            <SidebarItem icon={FolderHeart} label="My Portfolio" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-primary/5 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Database Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="size-2 bg-green-500 rounded-full"></div>
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
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm outline-none" 
                placeholder="Search ingredients, e.g., Alulose, BCAA"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Researcher Sarah Chen</p>
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
          {/* Top Section: News & Map */}
          <div className="grid grid-cols-12 gap-8">
            {/* Global News Feed */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Rss className="size-5 text-primary" />
                  Global News Feed
                </h2>
                <button className="text-xs font-bold text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                <NewsCard 
                  country="KR" 
                  title="New Alulose standards released by MFDS" 
                  description="Update on concentration limits and labeling requirements for functional beverages." 
                  time="2 hours ago" 
                  type="Regulatory Alert" 
                />
                <NewsCard 
                  country="FR" 
                  title="Novel food updates: Plant protein isolates" 
                  description="ANSES provides new safety assessment framework for pea-derived proteins." 
                  time="5 hours ago" 
                  type="Safety Report" 
                />
                <NewsCard 
                  country="US" 
                  title="FDA labeling draft for medicinal foods" 
                  description="Proposed changes to front-of-package nutritional disclosures for FSMP." 
                  time="1 day ago" 
                  type="Policy Draft" 
                />
              </div>
            </div>

            {/* Compliance Timeline */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  Compliance Timeline
                </h2>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-6 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 size-4 rounded-full border-4 border-white dark:border-slate-900 bg-primary">
                      <div className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border border-white animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-primary">2026.04.15</p>
                      <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded italic">D-30</span>
                    </div>
                    <p className="text-xs font-bold mt-1">EU FSMP Labeling Change</p>
                    <p className="text-[10px] text-slate-500">Mandatory front-of-pack update</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 size-4 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300"></div>
                    <p className="text-[10px] font-bold text-slate-400">2025.11.20</p>
                    <p className="text-xs font-bold mt-1">MFDS Additive Review</p>
                    <p className="text-[10px] text-slate-500">Alulose concentration update</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 size-4 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300"></div>
                    <p className="text-[10px] font-bold text-slate-400">2025.09.01</p>
                    <p className="text-xs font-bold mt-1">FDA FSMA 204 Deadline</p>
                    <p className="text-[10px] text-slate-500">Enhanced traceability compliance</p>
                  </div>
                </div>
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
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-[420px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1HBlQ8hA65QO1W9HIZ0leccab_BPCjVHLpg3t5fvhWbhDG0tnUPmFuCU8ts8jP3zzOOMhR-lWLosYKokdJlRlPFw9hLQjiEF1ISgPkoAijg_iDhJGpI06TZS4YU5bsY2BzZAYG7Xq9UEXwFTpy0CrGxtgvc42qvvVTf81Xj7FMoGF7bkVkKoxmfE2c3ofjxwEK__d6Y0wE3x_dfwIERqK9E3AGbsTBapnssoK84oJWfI4GmHIt0FU1KJ_beQ1EBHEN1sPVvKU0i7o" 
                    alt="World Map Heatmap" 
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent opacity-40"></div>
                </div>
                
                {/* Map Overlays */}
                <div className="absolute top-1/2 left-[78%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-14 left-0 bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-primary/20 whitespace-nowrap"
                    >
                      <p className="text-[10px] font-bold text-primary">South Korea</p>
                      <p className="text-[9px] text-slate-500">Active Alert: Alulose</p>
                    </motion.div>
                    <div className="size-4 bg-primary rounded-full animate-ping opacity-75"></div>
                    <div className="size-3 bg-primary rounded-full absolute top-0.5 left-0.5 border-2 border-white"></div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4">
                  <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg">
                    <BarChart3 className="size-4" />
                    Download R&D Impact Report (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Comparison Table */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ArrowLeftRight className="size-5 text-primary" />
                Regulation Standard Comparison: Korea vs France
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-500">Select Country to Compare:</label>
                  <select className="text-xs font-bold border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 py-1.5 pl-3 pr-8 focus:ring-primary/50 outline-none">
                    <option>France (ANSES/EFSA)</option>
                    <option>USA (FDA)</option>
                    <option>China (SAMR)</option>
                    <option>Japan (MHLW)</option>
                  </select>
                </div>
                <button className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Download className="size-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Regulation Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">South Korea (MFDS)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">France (ANSES/EFSA)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status Gap</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">R&D Action (AI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <ComparisonRow 
                    category="FSMP Classification" 
                    subCategory="Medical Purpose Foods"
                    korea="Requires specific pre-market registration and clinical verification for disease-claims."
                    france="Notification procedure required; aligns with EU 2016/128 guidelines."
                    gap="Moderate Divergence"
                    gapColor="amber"
                    advice="Adjust formulation for EU-compliant protein sources to skip pre-market audit."
                  />
                  <ComparisonRow 
                    category="Sugar Substitutes (Alulose)" 
                    subCategory="Additive Limits"
                    korea="Approved for use with daily intake monitoring recommendations."
                    france="Novel Food status pending full EFSA approval for beverage inclusion."
                    gap="Major Divergence"
                    gapColor="rose"
                    advice="Reduce Alulose content to <5% for EU export or substitute with Erythritol."
                  />
                  <ComparisonRow 
                    category="Health Claims" 
                    subCategory="Functional Statements"
                    korea="Strict 'Type 1' and 'Type 2' functional claims permitted with audit."
                    france="Only EFSA-authorized claims under Article 13/14 allowed."
                    gap="Aligned"
                    gapColor="teal"
                    advice="Standardize labeling to EFSA Article 13.1 wording for global alignment."
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const ComparisonRow = ({ category, subCategory, korea, france, gap, gapColor, advice }: any) => {
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
    </tr>
  );
};
