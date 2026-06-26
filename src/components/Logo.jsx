import { Link } from "react-router-dom";

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5">
      <div className="relative">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-400 to-cyan-400 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-400/25 border border-white/60">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
          </svg>
        </span>
      </div>
      <span className="flex flex-col leading-tight">
        <span className="text-[16px] font-bold tracking-tight text-slate-900">StartupForge<span className="gradient-text"> AI</span></span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-medium">Evidence-backed opportunities</span>
      </span>
    </Link>
  );
}
