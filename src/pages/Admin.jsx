import { useState } from "react";
import { FiActivity, FiDatabase, FiCpu, FiZap, FiServer, FiShield, FiGlobe, FiLock, FiUser } from "react-icons/fi";
import { Pill, Stat } from "../components/Bits";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const SOURCES = [
  { name: "GitHub API", status: "live" },
  { name: "Hacker News (Algolia)", status: "live" },
  { name: "Google News RSS", status: "live" },
  { name: "Reddit JSON API", status: "live" },
  { name: "ArXiv Atom Feeds", status: "live" },
];

const LOGS = [
  { ts: "On query", level: "info", msg: "GitHub: searched repos + issues for query terms" },
  { ts: "On query", level: "info", msg: "HN Algolia: fetched stories matching query" },
  { ts: "On query", level: "info", msg: "Google News RSS: parsed feed items" },
  { ts: "On query", level: "info", msg: "Reddit: fetched posts from search.json endpoint" },
  { ts: "On query", level: "info", msg: "ArXiv: queried Atom API for recent papers" },
  { ts: "On query", level: "info", msg: "Pain points extracted and opportunities generated" },
];

export default function Admin() {
  const { adminAuth, adminLogin, adminLogout } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!adminAuth) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 mx-auto grid place-items-center shadow-lg shadow-violet-300/30 border border-white/60">
              <FiShield className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="liquid-glass rounded-3xl p-7">
            <h1 className="text-xl font-bold text-slate-900 text-center">Admin Access</h1>
            <p className="text-slate-500 text-center text-sm mt-1.5">Authorized personnel only.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (adminLogin(username, password)) { toast.success("Welcome, Admin"); } else { toast.error("Invalid credentials"); } }} className="mt-6 space-y-3">
              <label className="flex items-center gap-2.5 rounded-xl bg-white/50 border border-slate-200/60 px-3.5 py-2.5 focus-within:border-violet-400/50 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                <FiUser className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 bg-transparent outline-none text-slate-800 text-sm placeholder:text-slate-400/70 py-0.5 font-medium" />
              </label>
              <label className="flex items-center gap-2.5 rounded-xl bg-white/50 border border-slate-200/60 px-3.5 py-2.5 focus-within:border-violet-400/50 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                <FiLock className="h-4 w-4 text-slate-400" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-slate-800 text-sm placeholder:text-slate-400/70 py-0.5 font-medium" />
              </label>
              <button type="submit" className="btn-primary w-full justify-center text-sm"><FiLock className="h-4 w-4" /> Sign in</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-1 font-bold"><FiShield className="h-3.5 w-3.5" /> Admin</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Data pipeline dashboard</h1>
          <p className="text-slate-500 mt-1">Live web data sources, analysis engine, and system status.</p>
        </div>
        <button onClick={() => { adminLogout(); toast.success("Logged out"); }} className="btn-ghost text-sm text-rose-500 border-rose-200/50 hover:bg-rose-50/40">Sign out</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Stat label="Data sources" value={`${SOURCES.length}`} sub="live APIs" />
        <Stat label="Source types" value="5" sub="GitHub, HN, News, Reddit, ArXiv" />
        <Stat label="Analysis" value="Real-time" sub="pain point extraction" />
        <Stat label="Fallback" value="Template" sub="when offline" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Live data sources" icon={<FiDatabase />} right={<Pill color="green">{SOURCES.length}/{SOURCES.length} connected</Pill>}>
            <table className="w-full text-sm"><thead className="text-left text-[10px] uppercase tracking-[0.12em] text-slate-400 font-semibold"><tr><th className="py-2">Source</th><th>Status</th><th>Mode</th></tr></thead><tbody className="divide-y divide-slate-200/50">{SOURCES.map((s) => <tr key={s.name}><td className="py-2.5 text-slate-700 flex items-center gap-2"><FiGlobe className="h-3.5 w-3.5 text-emerald-500" />{s.name}</td><td><Pill color="green">live</Pill></td><td className="text-slate-400">On-demand fetch</td></tr>)}</tbody></table>
          </Panel>
          <Panel title="Analysis pipeline" icon={<FiCpu />}>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Industry classification — maps signals to 15 industries</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Pain point extraction — keyword + context analysis</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Trend momentum — 24h / 7d / 30d signal velocity</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Competitor gap analysis — known company mentions</li>
              <li className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Opportunity scoring — multi-factor weighted ranking</li>
            </ul>
          </Panel>
          <Panel title="Pipeline logs" icon={<FiActivity />}>
            <ul className="space-y-2 font-mono text-xs">{LOGS.map((l, i) => <li key={i} className="flex gap-3"><span className="text-slate-400">{l.ts}</span><Pill color="slate">{l.level}</Pill><span className="text-slate-600">{l.msg}</span></li>)}</ul>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="System" icon={<FiServer />}>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span className="text-slate-500">Architecture</span><span className="text-emerald-600 font-medium">Client-side fetch</span></li>
              <li className="flex justify-between"><span className="text-slate-500">CORS proxy</span><span className="text-emerald-600 font-medium">corsproxy.io</span></li>
              <li className="flex justify-between"><span className="text-slate-500">Fallback mode</span><span className="text-slate-700 font-medium">Template-based</span></li>
              <li className="flex justify-between"><span className="text-slate-500">Data freshness</span><span className="text-emerald-600 font-medium">Real-time</span></li>
              <li className="flex justify-between"><span className="text-slate-500">API keys required</span><span className="text-slate-700 font-medium">None</span></li>
            </ul>
          </Panel>
          <Panel title="How it works" icon={<FiZap />}>
            <ul className="text-sm text-slate-500 space-y-2.5">
              <li className="flex items-start gap-2.5"><FiGlobe className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Search triggers parallel API calls to 5 data sources.</li>
              <li className="flex items-start gap-2.5"><FiCpu className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" /> Results are classified, pain points extracted, trends scored.</li>
              <li className="flex items-start gap-2.5"><FiZap className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" /> Startup ideas are generated with real evidence links.</li>
              <li className="flex items-start gap-2.5"><FiActivity className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /> Offline fallback uses template-based generation.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon, right, children }) {
  return (<div className="glass rounded-2xl p-5"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 text-slate-800 font-bold text-sm"><span className="text-violet-500">{icon}</span>{title}</div>{right}</div>{children}</div>);
}
