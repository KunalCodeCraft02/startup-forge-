import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

const PLANS = [
  { name: "Explorer", price: "$0", cadence: "forever", desc: "Discover evidence-backed opportunities and build a habit.", features: ["Unlimited search", "Tinder-style discovery", "Save up to 25 ideas", "Daily feed (public)", "1 generated business plan", "1 generated MVP spec"], cta: "Start free", to: "/explore", highlight: false },
  { name: "Founder", price: "$29", cadence: "/month", desc: "Everything a solo founder needs to go from idea to MVP.", features: ["Everything in Explorer", "Unlimited saved ideas", "Unlimited business plans", "Unlimited MVP specs", "Priority inference", "PDF exports + sharing", "Daily personalized feed"], cta: "Get started", to: "/explore", highlight: true },
  { name: "Studio", price: "$99", cadence: "/month", desc: "For studios, accelerators and teams hunting opportunities together.", features: ["Everything in Founder", "Team workspaces (up to 10)", "Slack + email digests", "Custom evidence sources", "API access (1k req/day)", "SSO + audit logs"], cta: "Contact us", to: "/explore", highlight: false },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-2 font-bold">Pricing</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Simple, founder-friendly pricing.</h1>
        <p className="text-slate-500 mt-3 max-w-xl mx-auto">Start free. Upgrade when you ship.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.name} className="card-3d">
            <div className={`card-3d-inner p-7 ${p.highlight ? "ring-2 ring-violet-300/50 shadow-xl shadow-violet-200/20" : ""}`}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"><span className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-[10px] px-4 py-1.5 font-bold uppercase tracking-wider shadow-lg shadow-violet-300/30">Most popular</span></div>}
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <div className="mt-3 flex items-end gap-1"><span className="text-4xl font-bold text-slate-900">{p.price}</span><span className="text-slate-400 text-sm mb-1">{p.cadence}</span></div>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.desc}</p>
              <Link to={p.to} className={`mt-6 w-full justify-center ${p.highlight ? "btn-primary" : "btn-ghost"} text-sm`}>{p.cta}</Link>
              <ul className="mt-6 space-y-2.5">{p.features.map((f) => <li key={f} className="text-sm text-slate-600 flex gap-2.5"><FiCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{f}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center text-slate-400 text-sm">Built with security in mind — Rate limiting · Input validation · Secrets via env.</div>
    </div>
  );
}
