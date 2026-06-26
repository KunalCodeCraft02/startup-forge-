import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiLayers, FiGrid, FiRefreshCw, FiZap, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import SwipeDeck from "../components/SwipeDeck";
import OpportunityCard from "../components/OpportunityCard";
import Filters, { DEFAULT_FILTERS, applyFilters } from "../components/Filters";
import { SkeletonCard } from "../components/Bits";
import { generateOpportunitiesFromWeb, generateOpportunities } from "../services/forgeEngine";
import { useApp } from "../context/AppContext";

const STAGES = [
  { text: "Searching GitHub repositories & issues…" },
  { text: "Fetching Hacker News discussions…" },
  { text: "Scanning Google News articles…" },
  { text: "Searching Reddit for pain points…" },
  { text: "Checking latest research papers…" },
  { text: "Clustering pain signals & generating opportunities…" },
];

export default function Explore() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const { addHistory } = useApp();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [stageText, setStageText] = useState("");
  const [batch, setBatch] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [view, setView] = useState("deck");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [dataSource, setDataSource] = useState("initializing");

  const loadIdeas = useCallback(async (query, batchNum) => {
    if (!query) { setIdeas([]); setMetadata(null); return; }
    addHistory(query);
    setLoading(true); setStage(0); setDataSource("fetching"); setMetadata(null);
    let stageIdx = 0;
    const stageId = setInterval(() => { stageIdx = Math.min(stageIdx + 1, STAGES.length - 1); setStage(stageIdx); setStageText(STAGES[stageIdx].text); }, 1500);
    setStageText(STAGES[0].text);
    try {
      const result = await generateOpportunitiesFromWeb(query, 24, (msg) => setStageText(msg), `b${batchNum}`);
      setDataSource(result.metadata?.signals > 0 ? "live" : "fallback");
      setIdeas(result.ideas); setMetadata(result.metadata);
    } catch {
      setDataSource("fallback");
      setIdeas(generateOpportunities(query, 24, `b${batchNum}`));
    }
    setLoading(false); clearInterval(stageId);
  }, [addHistory]);

  useEffect(() => {
    if (!q) { setIdeas([]); setMetadata(null); return; }
    loadIdeas(q, batch);
  }, [q, batch, loadIdeas]);

  const filtered = useMemo(() => applyFilters(ideas, filters), [ideas, filters]);
  const totalSignals = useMemo(() => ideas.reduce((a, b) => a + (b._signalCount || b.evidence.length), 0), [ideas]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-2 font-bold">Search</div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          {q ? <>Opportunities for <span className="gradient-text">"{q}"</span></> : "What opportunity should we forge?"}
        </h1>
        <p className="text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed text-sm">
          {dataSource === "live" ? "Analyzed real data from GitHub, Hacker News, Google News, Reddit, and research papers."
            : dataSource === "fallback" ? "Offline mode — using template-based generation. Connect to the internet for real analysis."
            : "Fetches real-time data from multiple sources, analyzes pain points, and generates opportunities."}
        </p>
        <div className="mt-7"><SearchBar defaultValue={q} large /></div>
      </div>

      {!q ? <EmptyState /> : loading ? <LoadingState stage={stage} stageText={stageText} /> : (
        <>
          {metadata && <DataSourceBanner metadata={metadata} dataSource={dataSource} />}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-slate-200/60 bg-white/50">
              <ToggleBtn active={view === "deck"} onClick={() => setView("deck")} icon={<FiLayers className="h-4 w-4" />} label="Swipe" />
              <ToggleBtn active={view === "grid"} onClick={() => setView("grid")} icon={<FiGrid className="h-4 w-4" />} label="Grid" />
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              <FiZap className="inline h-3 w-3" /> {filtered.length} opportunities · {totalSignals} signals
            </div>
            <button onClick={() => setBatch((b) => b + 1)} className="btn-ghost text-sm">
              <FiRefreshCw className="h-4 w-4" /> Re-generate
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <aside className="lg:sticky lg:top-20 h-fit">
              <Filters value={filters} onChange={setFilters} total={ideas.length} count={filtered.length} />
              <TipsBox dataSource={dataSource} />
            </aside>
            <div>
              <AnimatePresence mode="wait">
                {view === "deck" ? (
                  <motion.div key="deck" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <SwipeDeck items={filtered} onEmpty={() => {}} />
                  </motion.div>
                ) : (
                  <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((idea) => <OpportunityCard key={idea.id} idea={idea} />)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DataSourceBanner({ metadata, dataSource }) {
  if (dataSource !== "live" || !metadata) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="liquid-glass rounded-2xl p-5 mb-6 flex items-start gap-4">
      <div className="h-9 w-9 rounded-xl bg-emerald-100/80 border border-emerald-200/50 grid place-items-center shrink-0">
        <FiCheckCircle className="h-4.5 w-4.5 text-emerald-600" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-800">Live data analysis complete</div>
        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
          Analyzed {metadata.signals} real signals across {Object.keys(metadata.trends?.typeDistribution || {}).length} source types.
          {metadata.painPoints > 0 && ` Found ${metadata.painPoints} pain points.`}
          {metadata.competitorMentions?.length > 0 && ` Top competitors: ${metadata.competitorMentions.slice(0, 3).map((c) => c.name).join(", ")}.`}
          {" "}Momentum: <span className={
            metadata.trends?.momentum === "hot" ? "text-rose-600 font-bold" :
            metadata.trends?.momentum === "rising" ? "text-amber-600 font-bold" : "text-slate-600"
          }>{metadata.trends?.momentum || "active"}</span>.
        </div>
      </div>
    </motion.div>
  );
}

function ToggleBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${active ? "bg-violet-100/60 text-violet-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
      {icon} {label}
    </button>
  );
}

function LoadingState({ stage, stageText }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <div className="glass rounded-2xl p-5">
        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">Live data pipeline</div>
        <ul className="mt-4 space-y-2.5">
          {STAGES.map((s, i) => (
            <li key={i} className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i < stage ? "text-slate-700" : i === stage ? "text-violet-600" : "text-slate-300"}`}>
              <span className={`h-2 w-2 rounded-full transition-all duration-300 ${i < stage ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : i === stage ? "bg-violet-400 animate-pulse shadow-sm shadow-violet-400/50" : "bg-slate-200"}`} />
              {s.text}
            </li>
          ))}
        </ul>
        {stageText && (
          <div className="mt-4 text-xs text-violet-500 border-t border-slate-200/50 pt-3 font-medium">
            <FiZap className="inline h-3 w-3" /> {stageText}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

function EmptyState() {
  const examples = ["AI for legal contracts", "Cybersecurity for SMBs", "Climate tech for buildings", "Vertical SaaS for dentists", "FinTech for freelancers", "AI agents for healthcare"];
  return (
    <div className="text-center py-14">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">Try a topic, industry or audience — get evidence-backed opportunities from real web data.</p>
      <div className="mt-2 text-xs text-slate-400">Powered by GitHub, Hacker News, Google News, Reddit, and ArXiv</div>
      <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
        {examples.map((e) => (
          <a key={e} href={`?q=${encodeURIComponent(e)}`} className="rounded-full border border-slate-200/60 bg-white/50 px-4 py-2 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50/40 transition-all duration-200 font-medium">
            {e}
          </a>
        ))}
      </div>
    </div>
  );
}

function TipsBox({ dataSource }) {
  return (
    <div className="glass rounded-2xl p-4 mt-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2.5 font-semibold">Data sources</div>
      <ul className="text-sm text-slate-500 space-y-2">
        {dataSource === "live" ? (
          <>
            <li className="flex items-center gap-2"><FiCheckCircle className="h-3 w-3 text-emerald-500" /> Live GitHub repos & issues</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="h-3 w-3 text-emerald-500" /> Live Hacker News stories</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="h-3 w-3 text-emerald-500" /> Live Google News articles</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="h-3 w-3 text-emerald-500" /> Live Reddit discussions</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="h-3 w-3 text-emerald-500" /> ArXiv research papers</li>
          </>
        ) : (
          <>
            <li className="flex items-center gap-2"><FiAlertCircle className="h-3 w-3 text-amber-500" /> Offline — template-based</li>
            <li className="text-xs text-slate-400 mt-1">Connect to the internet for real data</li>
          </>
        )}
      </ul>
      <div className="mt-3 border-t border-slate-200/50 pt-2.5">
        <div className="text-[10px] text-slate-400">
          · Swipe right to save, left to skip.
          · Click "Re-generate" for fresh data.
        </div>
      </div>
    </div>
  );
}
