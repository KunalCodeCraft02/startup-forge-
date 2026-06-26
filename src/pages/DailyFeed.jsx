import { useMemo, useState } from "react";
import { FiMail, FiZap, FiCheck, FiClock, FiTrendingUp, FiAward, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";
import { Pill, Stat } from "../components/Bits";
import { generateOpportunities } from "../services/forgeEngine";
import { useApp } from "../context/AppContext";

export default function DailyFeed() {
  const { subscribed, setSubscribed } = useApp();
  const [email, setEmail] = useState("");
  const ideas = useMemo(() => generateOpportunities("daily feed top opportunities", 10, "feed"), []);
  const trending = ["AI", "Cybersecurity", "FinTech", "Climate Tech", "Healthcare", "Robotics"];
  const fastest = ["Vertical SaaS", "AI Agents", "DePIN", "Privacy-first FinTech", "Energy software"];

  const subscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return toast.error("Please enter a valid email");
    setSubscribed(true);
    toast.success("Subscribed — your first edition arrives tomorrow at 7am.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-2 font-bold">Daily Opportunity Feed</div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">A startup brief, in your inbox at 7am.</h1>
        <p className="text-slate-500 mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">Top 10 startup ideas from real-time web data, trending industries, research papers, and AI insights — every morning.</p>
        <form onSubmit={subscribe} className="mt-6 sm:mt-8 mx-auto max-w-lg liquid-glass rounded-2xl p-1.5 sm:p-2 flex items-center gap-2">
          <FiMail className="h-5 w-5 text-slate-400 ml-1 sm:ml-2 shrink-0" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@yourstartup.com" className="flex-1 min-w-0 bg-transparent outline-none text-slate-800 placeholder:text-slate-400/70 py-2 text-sm font-medium" />
          <button type="submit" className="btn-primary text-xs sm:text-sm shrink-0 px-3 sm:px-4">{subscribed ? <><FiCheck className="h-4 w-4" /> Subscribed</> : "Subscribe"}</button>
        </form>
        <div className="text-xs text-slate-400 mt-2.5">No spam. One-click unsubscribe.</div>
      </div>
      <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        <div className="liquid-glass rounded-3xl p-5 sm:p-7 lg:p-9">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div><div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Preview · Tomorrow's edition</div><h2 className="text-2xl font-bold text-slate-900 mt-1">StartupForge AI · Daily Brief</h2></div>
            <Pill color="cyan"><FiClock className="h-3 w-3" /> 5 min read</Pill>
          </div>
          <Section2 title="Top 10 startup ideas"><ol className="space-y-2.5 list-decimal pl-5">{ideas.map((i) => <li key={i.id} className="text-sm text-slate-700"><span className="text-slate-900 font-bold">{i.name}</span> — {i.tagline} <span className="text-slate-400"> · score {i.opportunityScore}</span></li>)}</ol></Section2>
          <Section2 title="Trending industries"><div className="flex flex-wrap gap-1.5">{trending.map((t) => <Pill key={t} color="violet">{t}</Pill>)}</div></Section2>
          <Section2 title="Fastest growing markets"><ul className="grid sm:grid-cols-2 gap-2">{fastest.map((f) => <li key={f} className="text-sm text-slate-600 flex gap-2"><FiTrendingUp className="h-4 w-4 text-emerald-500 mt-0.5" />{f}</li>)}</ul></Section2>
        </div>
        <aside className="space-y-4 h-fit">
          <div className="glass rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-3 font-semibold">How it's built</div>
            <ul className="text-sm text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2.5"><FiGlobe className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Real-time API calls to GitHub, HN, Google News, Reddit, ArXiv.</li>
              <li className="flex items-start gap-2.5"><FiZap className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" /> AI clusters signals into pain themes and scores opportunities.</li>
              <li className="flex items-start gap-2.5"><FiAward className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" /> Personalized brief sent via email at 7am local time.</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-3 font-semibold">Data sources</div>
            <div className="flex flex-wrap gap-1.5">{["GitHub", "Hacker News", "Google News", "Reddit", "ArXiv"].map((s) => <Pill key={s} color="slate"><FiGlobe className="h-3 w-3" /> {s}</Pill>)}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section2({ title, children }) {
  return (<section className="mt-6"><h3 className="text-slate-900 font-bold mb-2.5">{title}</h3>{children}</section>);
}
