import { FiFilter, FiX } from "react-icons/fi";

export const INDUSTRIES = [
  "AI", "SaaS", "Cybersecurity", "Healthcare", "FinTech", "Robotics",
  "Agriculture", "Education", "Manufacturing", "Climate Tech",
  "Creator Economy", "DevTools", "LegalTech", "Logistics", "Biotech",
];
export const TAGS = [
  "B2B", "B2C", "SaaS", "AI", "Marketplace", "Mobile",
  "Open Source", "Deep Tech", "Solo Founder", "Subscription",
  "Freemium", "Government Supported",
];
export const SORTS = [
  { key: "trending",   label: "Trending" },
  { key: "newest",     label: "Newest" },
  { key: "growth",     label: "Fastest Growing" },
  { key: "revenue",    label: "Highest Revenue" },
  { key: "lowComp",    label: "Lowest Competition" },
  { key: "confidence", label: "Highest AI Confidence" },
];

export const DEFAULT_FILTERS = {
  industry: "All",
  sort: "trending",
  minScore: 0,
  minGrowth: 0,
  maxDifficulty: 100,
  tag: "All",
};

export function applyFilters(items, f) {
  let list = items.filter((i) =>
    (f.industry === "All" || i.industry === f.industry) &&
    i.opportunityScore >= f.minScore &&
    i.growthRate >= f.minGrowth &&
    i.difficultyPct <= f.maxDifficulty &&
    (f.tag === "All" || i.tags.includes(f.tag))
  );
  switch (f.sort) {
    case "newest":     list = [...list].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)); break;
    case "growth":     list = [...list].sort((a, b) => b.growthRate - a.growthRate); break;
    case "revenue":    list = [...list].sort((a, b) => b.annualRevenueUSD - a.annualRevenueUSD); break;
    case "lowComp":    list = [...list].sort((a, b) => a.competitionPct - b.competitionPct); break;
    case "confidence": list = [...list].sort((a, b) => b.aiConfidence - a.aiConfidence); break;
    default:           list = [...list].sort((a, b) => b.opportunityScore - a.opportunityScore);
  }
  return list;
}

export default function Filters({ value, onChange, total, count }) {
  const update = (patch) => onChange({ ...value, ...patch });
  const reset = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
          <FiFilter className="h-4 w-4" />
          <span>Filters</span>
          <span className="text-slate-400 text-xs font-normal">· {count} / {total}</span>
        </div>
        <button onClick={reset} className="text-xs text-slate-400 hover:text-violet-600 inline-flex items-center gap-1 transition-colors">
          <FiX className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Select label="Industry" value={value.industry} onChange={(v) => update({ industry: v })}
                options={["All", ...INDUSTRIES]} />
        <Select label="Sort by"  value={value.sort} onChange={(v) => update({ sort: v })}
                options={SORTS.map(s => s.key)} format={(k) => SORTS.find(s => s.key === k)?.label || k} />
        <Select label="Tag"      value={value.tag} onChange={(v) => update({ tag: v })}
                options={["All", ...TAGS]} />

        <Range label={`Min score: ${value.minScore}`} value={value.minScore}
               min={0} max={95} step={5} onChange={(v) => update({ minScore: v })} />
        <Range label={`Min growth: ${value.minGrowth}%`} value={value.minGrowth}
               min={0} max={70} step={5} onChange={(v) => update({ minGrowth: v })} />
        <Range label={`Max difficulty: ${value.maxDifficulty}%`} value={value.maxDifficulty}
               min={20} max={100} step={5} onChange={(v) => update({ maxDifficulty: v })} />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, format = (x) => x }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</span>
      <div className="relative mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-white/50 border border-slate-200/60 text-slate-700 text-sm px-3 py-2.5 pr-8 focus:outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-100 transition-all"
        >
          {options.map((o) => <option key={o} value={o} className="bg-white">{format(o)}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
      </div>
    </label>
  );
}

function Range({ label, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-violet-500"
      />
    </label>
  );
}
