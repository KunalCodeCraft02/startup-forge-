import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiFileText, FiCode, FiClock, FiMail, FiDownload, FiTrash2 } from "react-icons/fi";
import { Pill, Stat } from "../components/Bits";
import OpportunityCard from "../components/OpportunityCard";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const TABS = [
  { key: "saved",   label: "Saved Ideas",   icon: FiBookmark },
  { key: "plans",   label: "Business Plans", icon: FiFileText },
  { key: "mvps",    label: "Generated MVPs", icon: FiCode },
  { key: "history", label: "Search History", icon: FiClock },
  { key: "email",   label: "Email & Feed",   icon: FiMail },
];

export default function Dashboard() {
  const { saved, history, plans, mvps, subscribed, setSubscribed } = useApp();
  const [tab, setTab] = useState("saved");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-1 font-bold">Dashboard</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your workspace</h1>
        <p className="text-slate-500 mt-1.5">Evidence-backed startup ideas, saved and organized.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Stat label="Saved ideas" value={saved.length} />
        <Stat label="Business plans" value={Object.keys(plans).length} />
        <Stat label="MVP specs" value={Object.keys(mvps).length} />
        <Stat label="Searches" value={history.length} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:gap-6">
        <aside className="glass rounded-2xl p-1.5 sm:p-2 h-fit overflow-x-auto no-scrollbar">
          <div className="flex lg:flex-col gap-0.5">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-left font-medium whitespace-nowrap transition-all duration-200 ${tab === t.key ? "bg-violet-100/60 text-violet-700 shadow-sm" : "text-slate-400 hover:text-slate-700 hover:bg-white/40"}`}>
                <t.icon className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline lg:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="space-y-4">
          {tab === "saved" && (saved.length ? <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">{saved.map((idea) => <OpportunityCard key={idea.id} idea={idea} />)}</div> : <Empty title="No saved ideas yet" cta={<Link to="/explore" className="btn-primary text-sm">Explore opportunities</Link>} />)}
          {tab === "plans" && (Object.keys(plans).length ? <ul className="space-y-3">{Object.entries(plans).map(([id, { plan, ts }]) => { const idea = saved.find((x) => x.id === id); return (<li key={id} className="glass rounded-2xl p-5 flex items-center justify-between"><div><div className="text-xs text-slate-400">{new Date(ts).toLocaleString()}</div><div className="text-slate-900 font-bold mt-0.5">{idea?.name || "Business Plan"}</div><div className="text-xs text-slate-500 line-clamp-1 max-w-xl mt-0.5">{plan.executiveSummary}</div></div>{idea && <Link to={`/idea/${idea.id}`} state={{ idea }} className="btn-ghost text-sm">Open</Link>}</li>);})}</ul> : <Empty title="No business plans yet" cta={<Link to="/explore" className="btn-primary text-sm">Generate one</Link>} />)}
          {tab === "mvps" && (Object.keys(mvps).length ? <ul className="space-y-3">{Object.entries(mvps).map(([id, { mvp, ts }]) => { const idea = saved.find((x) => x.id === id); return (<li key={id} className="glass rounded-2xl p-5 flex items-center justify-between"><div><div className="text-xs text-slate-400">{new Date(ts).toLocaleString()}</div><div className="text-slate-900 font-bold mt-0.5">{idea?.name || "MVP Spec"}</div><div className="text-xs text-slate-500 mt-0.5">{mvp.coreFeatures.length} features · {mvp.apis.length} APIs</div></div>{idea && <Link to={`/idea/${idea.id}`} state={{ idea }} className="btn-ghost text-sm">Open</Link>}</li>);})}</ul> : <Empty title="No MVP specs yet" cta={<Link to="/explore" className="btn-primary text-sm">Generate one</Link>} />)}
          {tab === "history" && (history.length ? <ul className="glass rounded-2xl p-3 divide-y divide-slate-200/50">{history.map((q) => <li key={q} className="flex items-center justify-between py-2.5 px-2"><span className="text-slate-700 text-sm">{q}</span><Link to={`/explore?q=${encodeURIComponent(q)}`} className="text-xs text-violet-500 hover:text-violet-700 font-semibold">Re-run →</Link></li>)}</ul> : <Empty title="No searches yet" />)}
          {tab === "email" && (<div className="glass rounded-2xl p-5 sm:p-6 max-w-2xl"><h3 className="text-slate-900 font-bold">Daily Opportunity Feed</h3><p className="text-sm text-slate-500 mt-1.5 leading-relaxed">A daily email with top ideas, trending industries, and research papers.</p><div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-violet-50/40 border border-violet-200/30 p-3.5"><div><div className="text-sm text-slate-800 font-medium">Subscription status</div><div className="text-xs text-slate-400">{subscribed ? "Subscribed" : "Not subscribed"}</div></div><button onClick={() => { setSubscribed(!subscribed); toast.success(!subscribed ? "Subscribed" : "Unsubscribed"); }} className={`btn-ghost text-sm w-full sm:w-auto justify-center ${subscribed ? "bg-emerald-50/60 border-emerald-300/40 text-emerald-600" : ""}`}>{subscribed ? "Unsubscribe" : "Subscribe"}</button></div><button onClick={() => toast.success("Preview sent (mock)")} className="btn-primary text-sm mt-4 w-full sm:w-auto justify-center"><FiDownload className="h-4 w-4" /> Send me a preview</button></div>)}
        </div>
      </div>
    </div>
  );
}

function Empty({ title, cta }) {
  return (<div className="glass rounded-2xl p-12 text-center"><div className="text-5xl mb-3">🪐</div><h3 className="text-slate-900 font-bold mt-2">{title}</h3>{cta && <div className="mt-5">{cta}</div>}</div>);
}
