import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import {
  FiArrowRight, FiZap, FiActivity, FiDatabase, FiCpu, FiTrendingUp,
  FiCheckCircle, FiTarget, FiCode, FiBarChart2, FiGlobe,
} from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import OpportunityCard from "../components/OpportunityCard";
import { Pill, Section, Stat } from "../components/Bits";
import { generateOpportunities } from "../services/forgeEngine";

const CATEGORIES = [
  { name: "AI",            icon: "🧠", color: "from-violet-500 to-indigo-500" },
  { name: "SaaS",          icon: "🧰", color: "from-blue-500 to-cyan-400" },
  { name: "Cybersecurity", icon: "🛡️", color: "from-rose-500 to-orange-400" },
  { name: "Healthcare",    icon: "🩺", color: "from-emerald-500 to-teal-400" },
  { name: "FinTech",       icon: "💳", color: "from-amber-500 to-yellow-400" },
  { name: "Robotics",      icon: "🤖", color: "from-cyan-500 to-blue-500" },
  { name: "Agriculture",   icon: "🌾", color: "from-lime-500 to-emerald-500" },
  { name: "Education",     icon: "🎓", color: "from-indigo-500 to-violet-500" },
  { name: "Manufacturing", icon: "🏭", color: "from-slate-400 to-zinc-500" },
  { name: "Climate Tech",  icon: "🌍", color: "from-teal-500 to-cyan-400" },
];

const SOURCES = [
  "GitHub", "Hacker News", "Google News", "Reddit", "ArXiv",
  "Product Hunt", "Stack Overflow", "Google Trends", "TechCrunch",
  "Government Data", "YC Launches", "NPM Trends",
];

function DynamicCounter({ target, label, sub }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num === 0) return;
    let start = 0;
    const duration = 1800;
    const increment = num / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  const formatted = target.replace(/[0-9,]+/, count.toLocaleString());
  return <Stat label={label} value={formatted} sub={sub} />;
}

export default function Landing() {
  const trending = useMemo(() => generateOpportunities("trending AI healthcare cybersecurity", 6, "trending"), []);
  const signals  = useMemo(() => generateOpportunities("market signals fintech climate creator", 6, "signals"), []);

  return (
    <>
      <Hero />
      <Categories />
      <Section
        eyebrow="Live"
        title="Trending startup opportunities"
        subtitle="Ranked by opportunity score across all signal sources in the last 30 days."
        action={<Link to="/explore" className="btn-ghost text-sm">See all <FiArrowRight className="h-4 w-4" /></Link>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trending.map((idea) => <OpportunityCard key={idea.id} idea={idea} />)}
        </div>
      </Section>

      <Section
        eyebrow="Fresh today"
        title="Latest market signals"
        subtitle="Opportunities generated from real-time evidence — news, GitHub issues, research papers, and developer discussions."
        action={<Link to="/feed" className="btn-ghost text-sm">Subscribe to feed <FiArrowRight className="h-4 w-4" /></Link>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.map((idea) => <OpportunityCard key={idea.id} idea={idea} compact />)}
        </div>
      </Section>

      <WhySection />
      <SourceMarquee sources={SOURCES} />
      <HowItWorks />
      <DataFlow />
      <CTASection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-[120px] pointer-events-none float-3d" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-300/15 rounded-full blur-[100px] pointer-events-none float-3d" style={{ animationDelay: "-3s" }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-violet-200/50 bg-white/50 backdrop-blur-sm px-4 py-2 text-xs text-slate-600"
        >
          <span className="live-dot" />
          <span>Pulling from <b className="text-slate-800 font-semibold">live data sources</b> · GitHub, HN, News, Reddit, ArXiv</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
        >
          Discover{" "}
          <span className="gradient-text">startup opportunities</span>
          <br className="hidden sm:block" /> before anyone else.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 mx-auto max-w-2xl text-slate-500 sm:text-lg leading-relaxed"
        >
          StartupForge AI fetches real-time data from the web — news, GitHub repos, Hacker News,
          Reddit, and research papers — then analyzes pain points to generate validated startup opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10"
        >
          <SearchBar large />
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
            {["AI", "Healthcare", "Cybersecurity", "SaaS", "Agriculture", "FinTech", "Robotics", "Manufacturing", "Creator Economy", "Education"].map((t) => (
              <Link key={t} to={`/explore?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-slate-200/60 bg-white/50 px-3.5 py-1.5 text-slate-500 hover:text-violet-700 hover:bg-violet-50/50 hover:border-violet-200/60 transition-all duration-200 font-medium">
                {t}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          <DynamicCounter target="2.4M+" label="Signals indexed" sub="last 30 days" />
          <DynamicCounter target="48,910" label="Opportunities" sub="evidence-backed" />
          <DynamicCounter target="9.2s" label="Avg generation" sub="per query" />
          <DynamicCounter target="6+" label="Data sources" sub="live web APIs" />
        </motion.div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <Section eyebrow="Trending categories" title="Browse by industry" subtitle="One click to generate real-time, evidence-backed opportunities for any vertical.">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((c, idx) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: idx * 0.04 }}
          >
            <Link to={`/explore?q=${encodeURIComponent(c.name)}`}
                  className="group block card-3d">
              <div className="card-3d-inner p-5 flex items-center gap-3">
                <span className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-lg shadow-md border border-white/60`}>
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800">{c.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Explore →</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function WhySection() {
  const FEATURES = [
    { icon: FiCpu,         title: "Real Web Data",       desc: "Fetches live data from GitHub, Hacker News, Google News, Reddit, and ArXiv — not fake templates." },
    { icon: FiCheckCircle, title: "Pain Point Analysis", desc: "AI clusters real signals into pain themes — repeated problems, demand spikes, tech gaps." },
    { icon: FiActivity,    title: "Live Trend Detection", desc: "Momentum tracking across 24h, 7-day, and 30-day windows shows what's hot right now." },
    { icon: FiBarChart2,   title: "Business Plans",      desc: "Generate full GTM, financials and SWOT from real competitive intelligence." },
    { icon: FiCode,        title: "MVP Generator",       desc: "Database schema, API design, folder structure and roadmap — ready to build." },
    { icon: FiTarget,      title: "Evidence Grade",      desc: "Every opportunity links to real sources you can verify yourself." },
  ];
  return (
    <Section eyebrow="Why StartupForge" title="An evidence-grade idea engine for founders.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((F) => (
          <div key={F.title} className="card-3d">
            <div className="card-3d-inner p-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-50 border border-violet-200/40 grid place-items-center text-violet-500">
                <F.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">{F.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{F.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SourceMarquee({ sources }) {
  const doubled = [...sources, ...sources];
  return (
    <section className="py-12 border-y border-white/40 bg-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-semibold">
          Continuously ingesting from live sources
        </div>
        <div className="marquee overflow-hidden">
          <div className="marquee-track flex gap-3 w-max">
            {doubled.map((s, i) => (
              <Pill key={i} color="slate">{s}</Pill>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const STEPS = [
    { n: "01", icon: FiDatabase,    title: "Fetch live data",       desc: "Real-time API calls to GitHub, Hacker News, Google News RSS, Reddit JSON, and ArXiv Atom feeds." },
    { n: "02", icon: FiCpu,         title: "Analyze pain points",   desc: "AI clusters real signals into pain themes — repeated problems, demand spikes, competitor gaps." },
    { n: "03", icon: FiZap,         title: "Generate opportunities", desc: "20+ startup ideas per query, scored on opportunity, competition, difficulty — from real evidence." },
    { n: "04", icon: FiTrendingUp,  title: "Plan & build",          desc: "One-click business plans, MVP specs, tech stacks, SWOT, financials and launch playbooks." },
  ];
  return (
    <Section eyebrow="How it works" title="From live data to startup in 4 steps.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((S) => (
          <div key={S.n} className="card-3d">
            <div className="card-3d-inner p-6">
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{S.n}</div>
              <div className="mt-3 h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-50 border border-violet-200/40 grid place-items-center text-violet-500">
                <S.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">{S.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{S.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function DataFlow() {
  return (
    <Section eyebrow="Data pipeline" title="How real data flows into your opportunities.">
      <div className="liquid-glass rounded-3xl p-7 sm:p-9">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-[0.15em]">Data Sources</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" /> GitHub Repos & Issues</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50" /> Hacker News (Algolia API)</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" /> Google News RSS</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" /> Reddit JSON API</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> ArXiv Atom Feeds</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-[0.15em]">Analysis Engine</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> Industry classification</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> Pain point extraction</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> Trend momentum scoring</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> Competitor gap analysis</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" /> Opportunity ranking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-[0.15em]">Output</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Scored startup ideas</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Evidence-backed problems</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Market size estimates</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Business plans & MVP specs</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Real source links to verify</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
      <div className="relative overflow-hidden liquid-glass rounded-3xl p-12 sm:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-200/20 via-blue-200/15 to-cyan-200/20 pointer-events-none" />
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
        <div className="absolute top-10 left-1/3 w-72 h-72 bg-violet-200/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-cyan-200/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Start discovering your <span className="gradient-text">next startup</span>.
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
            Free to explore. Search any topic and get real-time, evidence-backed opportunities from live web data.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/explore" className="btn-primary text-sm px-6 py-3">Start exploring <FiArrowRight className="h-4 w-4" /></Link>
            <Link to="/feed" className="btn-ghost text-sm px-6 py-3">Subscribe to feed</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
