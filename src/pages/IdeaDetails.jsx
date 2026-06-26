import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft, FiBookmark, FiShare2, FiPrinter, FiFileText, FiCode, FiZap,
  FiTrendingUp, FiDollarSign, FiUsers, FiTarget, FiShield, FiCalendar, FiCheckCircle,
  FiAward, FiGlobe, FiLayers, FiServer, FiDatabase, FiCpu, FiActivity, FiExternalLink,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Pill, MetricBar, Stat } from "../components/Bits";
import EvidenceList from "../components/Evidence";
import { useApp } from "../context/AppContext";
import { generateOpportunities, generateBusinessPlan, generateMVPSpec } from "../services/forgeEngine";

export default function IdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { saved, saveIdea, unsaveIdea, isSaved, savePlan, plans, saveMVP, mvps } = useApp();

  const idea = useMemo(() => {
    if (location.state?.idea && location.state.idea.id === id) return location.state.idea;
    const fromSaved = saved.find((x) => x.id === id);
    if (fromSaved) return fromSaved;
    const cats = ["AI", "SaaS", "Cybersecurity", "Healthcare", "FinTech"];
    for (const c of cats) {
      const items = generateOpportunities(c, 28);
      const f = items.find((x) => x.id === id);
      if (f) return f;
    }
    return null;
  }, [id, location.state, saved]);

  const [tab, setTab] = useState("overview");
  const [planLoading, setPlanLoading] = useState(false);
  const [mvpLoading, setMvpLoading] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);

  if (!idea) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold text-slate-900 mt-3">Opportunity not found.</h1>
        <p className="text-slate-500 mt-2">It might have been re-generated. Try searching again.</p>
        <button onClick={() => navigate("/explore")} className="btn-primary mt-5 text-sm">Back to explore</button>
      </div>
    );
  }

  const saved$ = isSaved(idea.id);
  const plan = plans[idea.id]?.plan;
  const mvp = mvps[idea.id]?.mvp;

  const generatePlan = () => { setPlanLoading(true); setTimeout(() => { savePlan(idea.id, generateBusinessPlan(idea)); setPlanLoading(false); setTab("plan"); toast.success("Business plan generated"); }, 900); };
  const generateMvp = () => { setMvpLoading(true); setTimeout(() => { saveMVP(idea.id, generateMVPSpec(idea)); setMvpLoading(false); setTab("mvp"); toast.success("MVP spec generated"); }, 900); };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print mb-5">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm"><FiArrowLeft className="h-4 w-4" /> Back</button>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { saved$ ? unsaveIdea(idea.id) : saveIdea(idea); toast.success(saved$ ? "Removed" : "Saved"); }}
            className={`btn-ghost text-xs sm:text-sm ${saved$ ? "bg-violet-100/60 border-violet-300/40 text-violet-600" : ""}`}>
            <FiBookmark className="h-4 w-4" fill={saved$ ? "currentColor" : "none"} /> {saved$ ? "Saved" : "Save"}
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className="btn-ghost text-xs sm:text-sm"><FiShare2 className="h-4 w-4" /> Share</button>
          <button onClick={() => window.print()} className="btn-ghost text-xs sm:text-sm"><FiPrinter className="h-4 w-4" /> PDF</button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-3xl p-5 sm:p-7 lg:p-9 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-br from-violet-200/30 via-blue-200/20 to-cyan-200/25 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-36 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-violet-200/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Pill color="violet">{idea.industry}</Pill>
            {idea._dataSource === "real" && <Pill color="green"><FiGlobe className="h-3 w-3" /> Real-time data</Pill>}
            {idea.tags.slice(0, 5).map((t) => <Pill key={t} color="blue">{t}</Pill>)}
            <Pill color="slate"><FiCalendar className="h-3 w-3" /> {new Date(idea.generatedAt).toLocaleDateString()}</Pill>
            {idea._signalCount > 0 && <Pill color="cyan"><FiZap className="h-3 w-3" /> {idea._signalCount} signals</Pill>}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">{idea.name}</h1>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">{idea.tagline}</p>
          <div className="mt-5 sm:mt-7 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <Stat label="Opportunity score" value={`${idea.opportunityScore}/100`} sub={idea.aiRecommendation.split(".")[0]} />
            <Stat label="AI confidence" value={`${idea.aiConfidence}%`} sub="Across all signals" />
            <Stat label="Market (SAM)" value={idea.marketSize.sam} sub={`TAM ${idea.marketSize.tam}`} />
            <Stat label="Est. ARR" value={idea.estAnnualRevenue} sub={`MRR ${idea.estMonthlyRevenue}`} />
          </div>
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <MetricBar label="Opportunity" value={idea.opportunityScore} color="violet" />
            <MetricBar label="AI Confidence" value={idea.aiConfidence} color="cyan" />
            <MetricBar label="Competition" value={idea.competitionPct} color="rose" />
            <MetricBar label="Difficulty" value={idea.difficultyPct} color="amber" />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2 no-print">
            <button onClick={generatePlan} disabled={planLoading} className="btn-primary text-xs sm:text-sm"><FiFileText className="h-4 w-4" />{planLoading ? "Generating…" : plan ? "Re-generate Business Plan" : "Generate Business Plan"}</button>
            <button onClick={generateMvp} disabled={mvpLoading} className="btn-ghost text-xs sm:text-sm"><FiCode className="h-4 w-4" />{mvpLoading ? "Generating…" : mvp ? "Re-generate MVP Spec" : "Generate MVP Spec"}</button>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 sticky top-16 z-20 no-print">
        <div className="glass rounded-2xl p-1.5 inline-flex gap-1 overflow-x-auto no-scrollbar max-w-full">
          {[["overview","Overview"],["market","Market"],["competition","Competition"],["tech","Tech & MVP"],["gtm","GTM & Funding"],["govt","Govt Schemes"],["risks","Risks & SWOT"],["evidence","Evidence"],["plan","Business Plan"],["mvp","MVP Spec"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${tab === k ? "bg-violet-100/60 text-violet-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-5">
          {tab === "overview" && <OverviewTab idea={idea} />}
          {tab === "market" && <MarketTab idea={idea} />}
          {tab === "competition" && <CompetitionTab idea={idea} />}
          {tab === "tech" && <TechTab idea={idea} />}
          {tab === "gtm" && <GTMTab idea={idea} />}
          {tab === "govt" && <GovernmentSchemesTab idea={idea} />}
          {tab === "risks" && <RisksTab idea={idea} />}
          {tab === "evidence" && <EvidenceTab idea={idea} />}
          {tab === "plan" && <BusinessPlanTab idea={idea} plan={plan} onGenerate={generatePlan} loading={planLoading} />}
          {tab === "mvp" && <MVPTab idea={idea} mvp={mvp} onGenerate={generateMvp} loading={mvpLoading} />}
        </div>
        <aside className="space-y-4">
          <AsideCard title="AI Recommendation" icon={<FiZap />}><p className="text-sm text-slate-600 leading-relaxed">{idea.aiRecommendation}</p><p className="text-xs text-slate-400 mt-2 leading-relaxed">{idea.founderAdvice}</p></AsideCard>
          <AsideCard title="Why now" icon={<FiActivity />}><p className="text-sm text-slate-600 leading-relaxed">{idea.whyNow}</p></AsideCard>
          <AsideCard title="Govt Schemes" icon={<FiShield />}>
            {idea.governmentSchemes && idea.governmentSchemes.length > 0 ? (
              <><ul className="space-y-2">{idea.governmentSchemes.slice(0, 3).map((s, i) => <li key={i} className="text-xs text-slate-600"><span className="font-semibold">{s.name}</span><span className="text-slate-400"> — {s.amount}</span></li>)}</ul>
              <button onClick={() => setTab("govt")} className="text-xs text-violet-500 hover:text-violet-700 mt-3 font-semibold">See all {idea.governmentSchemes.length} schemes →</button></>
            ) : (
              <p className="text-xs text-slate-400">No specific schemes for this category.</p>
            )}
          </AsideCard>
          <AsideCard title="Top evidence" icon={<FiFileText />}><EvidenceList items={idea.evidence.slice(0, 4)} /><button onClick={() => setTab("evidence")} className="text-xs text-violet-500 hover:text-violet-700 mt-3 font-semibold">See all {idea.evidence.length} signals →</button></AsideCard>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (<div className="glass rounded-2xl p-5"><div className="flex items-center gap-2.5 text-slate-800 mb-3"><span className="text-violet-500">{icon}</span><h3 className="font-bold text-sm">{title}</h3></div>{children}</div>);
}
function AsideCard({ title, icon, children }) {
  return (<div className="glass rounded-2xl p-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2.5"><span className="text-violet-500">{icon}</span>{title}</div>{children}</div>);
}
function LabelText({ label, children }) {
  return (<div><div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</div><div className="text-sm text-slate-700 mt-1 leading-relaxed">{children}</div></div>);
}
function KV({ k, v }) {
  return (<div className="rounded-xl bg-violet-50/40 border border-violet-200/30 px-3 py-2.5"><div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{k}</div><div className="text-sm text-slate-800 mt-0.5 font-medium">{v}</div></div>);
}

function OverviewTab({ idea }) {
  return (<><Card title="Overview" icon={<FiTarget />}><p className="text-sm text-slate-600 leading-relaxed">{idea.overview}</p></Card><Card title="Problem & Solution" icon={<FiZap />}><div className="grid sm:grid-cols-2 gap-4"><LabelText label="Problem">{idea.problem}</LabelText><LabelText label="Solution">{idea.solution}</LabelText></div></Card><Card title="Target Customers" icon={<FiUsers />}><LabelText label="Primary persona">{idea.targetCustomers}</LabelText><div className="mt-3 grid sm:grid-cols-2 gap-3"><div><div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1.5 font-semibold">Pains</div><ul className="space-y-1.5">{idea.persona.pains.map((p, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-rose-400 mt-1">●</span>{p}</li>)}</ul></div><div><div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1.5 font-semibold">Gains</div><ul className="space-y-1.5">{idea.persona.gains.map((p, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-emerald-400 mt-1">●</span>{p}</li>)}</ul></div></div></Card><Card title="Unique Selling Proposition" icon={<FiAward />}><p className="text-sm text-slate-600 leading-relaxed">{idea.usp}</p></Card></>);
}
function MarketTab({ idea }) {
  return (<><Card title="Market Size" icon={<FiTrendingUp />}><div className="grid grid-cols-3 gap-3"><Stat label="TAM" value={idea.marketSize.tam} sub="Total Addressable" /><Stat label="SAM" value={idea.marketSize.sam} sub="Serviceable" /><Stat label="SOM" value={idea.marketSize.som} sub="Obtainable (3yr)" /></div><p className="text-sm text-slate-500 mt-4 leading-relaxed">{idea.trendAnalysis}</p></Card><Card title="Revenue Model" icon={<FiDollarSign />}><LabelText label="Model">{idea.revenueModel}</LabelText><div className="mt-3 grid grid-cols-3 gap-3"><Stat label="Starter" value={`$${idea.pricing.starter}/mo`} /><Stat label="Growth" value={`$${idea.pricing.growth}/mo`} /><Stat label="Enterprise" value={idea.pricing.enterprise} /></div><div className="mt-4 grid grid-cols-2 gap-3"><Stat label="Monthly revenue" value={idea.estMonthlyRevenue} /><Stat label="Annual revenue" value={idea.estAnnualRevenue} /></div></Card><Card title="Growth potential" icon={<FiActivity />}><div className="grid grid-cols-2 gap-3"><Stat label="Growth rate" value={`${idea.growthRate}% YoY`} /><Stat label="Build time" value={`${idea.timelineWeeks} weeks`} sub={idea.estCost + " est. cost"} /></div></Card></>);
}
function CompetitionTab({ idea }) {
  return (<><Card title="Competition landscape" icon={<FiUsers />}><div className="grid grid-cols-2 gap-3"><Stat label="Competition" value={`${idea.competitionLabel} (${idea.competitionPct}%)`} /><Stat label="Difficulty" value={`${idea.difficultyLabel} (${idea.difficultyPct}%)`} /></div></Card><Card title="Top competitors" icon={<FiShield />}><ul className="space-y-3">{idea.competitors.map((c, i) => (<li key={i} className="glass rounded-xl p-4"><div className="flex items-center justify-between"><div className="font-bold text-slate-800">{c.name}</div><Pill color="amber">Funding {c.funding}</Pill></div><div className="text-sm text-slate-500 mt-1.5">Weakness: {c.weakness}</div></li>))}</ul></Card><Card title="USP" icon={<FiAward />}><p className="text-sm text-slate-600 leading-relaxed">{idea.usp}</p></Card></>);
}
function TechTab({ idea }) {
  const s = idea.stack;
  return (<><Card title="Tech stack" icon={<FiLayers />}><div className="grid sm:grid-cols-2 gap-3"><KV k="Frontend" v={s.frontend} /><KV k="Backend" v={s.backend} /><KV k="Database" v={s.database} /><KV k="AI" v={s.ai} /><KV k="Infra" v={s.infra} /><KV k="Queue" v={s.queue} /></div></Card><Card title="Architecture" icon={<FiServer />}><ul className="space-y-2">{idea.architecture.map((a, i) => <li key={i} className="text-sm text-slate-600 flex gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{a}</li>)}</ul></Card><Card title="Database" icon={<FiDatabase />}><pre className="text-xs text-violet-700 bg-violet-50/50 border border-violet-200/30 rounded-xl p-4 overflow-x-auto leading-relaxed">{idea.database.join("\n")}</pre></Card><Card title="APIs" icon={<FiCpu />}><ul className="space-y-2">{idea.apis.map((a, i) => <li key={i} className="text-sm text-slate-600 font-mono">{a}</li>)}</ul></Card><Card title="Timeline" icon={<FiCalendar />}><ul className="space-y-2.5">{idea.timeline.map((t, i) => <li key={i} className="flex gap-3 items-start"><Pill color="violet">{t.phase}</Pill><span className="text-sm text-slate-600">{t.work}</span></li>)}</ul></Card><Card title="Team & investment" icon={<FiUsers />}><div className="grid grid-cols-3 gap-3"><Stat label="Team size" value={idea.teamSize} /><Stat label="Est. cost" value={idea.estCost} /><Stat label="Investment" value={idea.investmentRequired} /></div><div className="mt-3 flex flex-wrap gap-1.5">{idea.requiredSkills.map((sk) => <Pill key={sk} color="blue">{sk}</Pill>)}</div></Card></>);
}
function GTMTab({ idea }) {
  return (<><Card title="Acquisition channels" icon={<FiTarget />}><ul className="space-y-2">{idea.acquisitionChannels.map((c, i) => <li key={i} className="text-sm text-slate-600 flex gap-2.5"><span className="text-violet-400 mt-1">▸</span>{c}</li>)}</ul></Card><Card title="Marketing" icon={<FiTrendingUp />}><p className="text-sm text-slate-600 leading-relaxed">{idea.marketingStrategy}</p></Card><Card title="SEO" icon={<FiGlobe />}><p className="text-sm text-slate-600 leading-relaxed">{idea.seoStrategy}</p></Card><Card title="Sales" icon={<FiUsers />}><p className="text-sm text-slate-600 leading-relaxed">{idea.salesStrategy}</p></Card><Card title="Launch" icon={<FiZap />}><p className="text-sm text-slate-600 leading-relaxed">{idea.launchStrategy}</p></Card><Card title="Funding" icon={<FiAward />}><ul className="space-y-2">{idea.fundingPossibilities.map((f, i) => <li key={i} className="text-sm text-slate-600">· {f}</li>)}</ul></Card><Card title="Government Schemes" icon={<FiShield />}><p className="text-sm text-slate-500 mb-2">View the dedicated <strong>Govt Schemes</strong> tab for detailed government funding opportunities with links and application steps.</p><div className="flex flex-wrap gap-1.5">{idea.governmentSchemes?.slice(0, 3).map((s, i) => <Pill key={i} color="emerald">{s.name}</Pill>)}</div></Card></>);
}
function RisksTab({ idea }) {
  const colors = { strengths: "green", weaknesses: "rose", opportunities: "violet", threats: "amber" };
  return (<><Card title="Risks" icon={<FiShield />}><ul className="space-y-2">{idea.risks.map((r, i) => <li key={i} className="text-sm text-slate-600 flex gap-2.5"><span className="text-rose-400 mt-1">⚠</span>{r}</li>)}</ul></Card><Card title="SWOT" icon={<FiActivity />}><div className="grid sm:grid-cols-2 gap-3">{Object.entries(idea.swot).map(([k, list]) => (<div key={k} className="rounded-xl bg-violet-50/40 border border-violet-200/30 p-3.5"><div className="mb-2"><Pill color={colors[k]}>{k.toUpperCase()}</Pill></div><ul className="space-y-1.5">{list.map((x, i) => <li key={i} className="text-sm text-slate-600">· {x}</li>)}</ul></div>))}</div></Card><Card title="Future opportunities" icon={<FiTrendingUp />}><ul className="space-y-2">{idea.futureOpps.map((r, i) => <li key={i} className="text-sm text-slate-600">· {r}</li>)}</ul></Card></>);
}
function EvidenceTab({ idea }) {
  const isReal = idea._dataSource === "real";
  return (<><Card title="Pain point analysis" icon={<FiZap />}><p className="text-sm text-slate-600 leading-relaxed">{idea.painPointAnalysis}</p>{isReal && idea._painPointCount > 0 && <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium"><FiCheckCircle className="h-3.5 w-3.5" />Based on {idea._painPointCount} real pain signals</div>}</Card><Card title="Trend analysis" icon={<FiTrendingUp />}><p className="text-sm text-slate-600 leading-relaxed">{idea.trendAnalysis}</p>{isReal && <div className="mt-3 flex items-center gap-2 text-xs text-violet-600 font-medium"><FiGlobe className="h-3.5 w-3.5" />Data from live web APIs — {idea._signalCount || idea.evidence.length} signals</div>}</Card><Card title={`Evidence (${idea.evidence.length} signals)`} icon={<FiFileText />}><EvidenceList items={idea.evidence} /></Card></>);
}
function BusinessPlanTab({ idea, plan, onGenerate, loading }) {
  if (!plan) return (<Card title="Business plan" icon={<FiFileText />}><p className="text-sm text-slate-500 leading-relaxed">Generate a complete, investor-ready business plan.</p><button onClick={onGenerate} disabled={loading} className="btn-primary mt-4 text-sm">{loading ? "Generating…" : "Generate Business Plan"}</button></Card>);
  return (<><Card title="Executive Summary" icon={<FiFileText />}><p className="text-sm text-slate-600 leading-relaxed">{plan.executiveSummary}</p></Card><Card title="Vision & Mission" icon={<FiTarget />}><LabelText label="Vision">{plan.vision}</LabelText><div className="h-3" /><LabelText label="Mission">{plan.mission}</LabelText></Card><Card title="Market" icon={<FiTrendingUp />}><div className="grid grid-cols-3 gap-3"><Stat label="TAM" value={plan.marketResearch.tam} /><Stat label="SAM" value={plan.marketResearch.sam} /><Stat label="SOM" value={plan.marketResearch.som} /></div></Card><Card title="Financials" icon={<FiDollarSign />}><div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><Stat label="MRR" value={plan.financials.monthly} /><Stat label="ARR" value={plan.financials.yearly} /><Stat label="Margin" value={plan.financials.grossMargin} /><Stat label="Break-even" value={`Month ${plan.financials.breakEvenMonth}`} /></div></Card><Card title="Milestones" icon={<FiCalendar />}><ul className="space-y-1.5">{plan.milestones.map((s, i) => <li key={i} className="text-sm text-slate-600">· {s}</li>)}</ul></Card><div className="no-print"><button onClick={() => window.print()} className="btn-primary text-sm"><FiPrinter className="h-4 w-4" /> Export as PDF</button></div></>);
}
function MVPTab({ idea, mvp, onGenerate, loading }) {
  if (!mvp) return (<Card title="MVP Spec" icon={<FiCode />}><p className="text-sm text-slate-500 leading-relaxed">Generate a developer-ready MVP spec.</p><button onClick={onGenerate} disabled={loading} className="btn-primary mt-4 text-sm">{loading ? "Generating…" : "Generate MVP Spec"}</button></Card>);
  return (<><Card title="Core features" icon={<FiZap />}><ul className="space-y-2">{mvp.coreFeatures.map((f, i) => <li key={i} className="text-sm text-slate-600 flex gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{f}</li>)}</ul></Card><Card title="Feature priority" icon={<FiTarget />}><ul className="space-y-2.5">{mvp.featurePriority.map((f, i) => <li key={i} className="flex items-start gap-3"><Pill color={f.priority === "P0" ? "rose" : f.priority === "P1" ? "amber" : "slate"}>{f.priority}</Pill><div><div className="text-sm text-slate-800 font-bold">{f.feature}</div><div className="text-xs text-slate-400 mt-0.5">{f.reason}</div></div></li>)}</ul></Card><Card title="Stack" icon={<FiLayers />}><div className="grid sm:grid-cols-2 gap-2">{Object.entries(mvp.recommendedStack).map(([k, v]) => <KV key={k} k={k} v={v} />)}</div></Card><Card title="Roadmap" icon={<FiCalendar />}><ul className="space-y-2">{mvp.roadmap.map((s, i) => <li key={i} className="text-sm text-slate-600">· {s}</li>)}</ul></Card></>);
}

function GovernmentSchemesTab({ idea }) {
  const schemes = idea.governmentSchemes || [];
  if (schemes.length === 0) {
    return (
      <Card title="Government Schemes & Funding" icon={<FiShield />}>
        <p className="text-sm text-slate-500 leading-relaxed">No specific government schemes available for this idea. Check back later or explore other opportunities.</p>
      </Card>
    );
  }

  const countries = [...new Set(schemes.map(s => s.country))];

  return (
    <>
      <Card title="Government Schemes & Funding Opportunities" icon={<FiShield />}>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          These government-backed schemes and funds are relevant to the <strong>{idea.industry}</strong> industry. 
          Apply early — most have annual deadlines and competitive selection processes.
        </p>
        <div className="space-y-3">
          {schemes.map((scheme, i) => (
            <div key={i} className="glass rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-800">{scheme.name}</h4>
                    <Pill color="blue">{scheme.country}</Pill>
                    <Pill color="emerald">{scheme.amount}</Pill>
                  </div>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{scheme.desc}</p>
                </div>
                {scheme.url && (
                  <a href={scheme.url} target="_blank" rel="noopener noreferrer"
                     className="shrink-0 rounded-lg border border-slate-200/60 p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50/40 transition-all">
                    <FiExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="How to Apply" icon={<FiTarget />}>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li className="flex items-start gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><strong>Step 1:</strong> Register on the respective government portal (Startup India, SBIR, etc.)</li>
          <li className="flex items-start gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><strong>Step 2:</strong> Prepare your business plan, pitch deck, and financial projections</li>
          <li className="flex items-start gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><strong>Step 3:</strong> Submit application before the deadline (most have quarterly cycles)</li>
          <li className="flex items-start gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><strong>Step 4:</strong> Attend interviews/presentations if shortlisted</li>
          <li className="flex items-start gap-2.5"><FiCheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><strong>Step 5:</strong> Use funds for R&D, hiring, and market validation per guidelines</li>
        </ul>
      </Card>
      <Card title="Tips for Government Grants" icon={<FiZap />}>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>· Focus on solving a real problem backed by your evidence data</li>
          <li>· Highlight job creation potential and economic impact</li>
          <li>· Show clear IP ownership and innovation novelty</li>
          <li>· Demonstrate scalability and market traction</li>
          <li>· Many schemes require DPIIT recognition — get it early via Startup India</li>
        </ul>
      </Card>
    </>
  );
}