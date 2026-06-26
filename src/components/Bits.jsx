export function Pill({ children, color = "violet" }) {
  const map = {
    violet: "bg-violet-500/10 text-violet-700 border-violet-400/25",
    blue:   "bg-blue-500/10 text-blue-700 border-blue-400/25",
    cyan:   "bg-cyan-500/10 text-cyan-700 border-cyan-400/25",
    green:  "bg-emerald-500/10 text-emerald-700 border-emerald-400/25",
    amber:  "bg-amber-500/10 text-amber-700 border-amber-400/25",
    rose:   "bg-rose-500/10 text-rose-700 border-rose-400/25",
    slate:  "bg-slate-100/60 text-slate-600 border-slate-300/40",
  };
  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full border px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase ${map[color] || map.slate}`}>
      {children}
    </span>
  );
}

export function MetricBar({ label, value, color = "violet" }) {
  const colors = {
    violet: "from-violet-500 to-indigo-500",
    blue:   "from-blue-500 to-cyan-400",
    cyan:   "from-cyan-400 to-teal-400",
    green:  "from-emerald-500 to-lime-400",
    amber:  "from-amber-500 to-orange-400",
    rose:   "from-rose-500 to-pink-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1.5 font-semibold">
        <span>{label}</span>
        <span className="text-slate-800 font-bold">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200/60 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color] || colors.violet} transition-all duration-700`}
          style={{ width: `${Math.max(3, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function Stat({ label, value, sub }) {
  return (
    <div className="liquid-glass rounded-2xl p-3 sm:p-4 lift-3d">
      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</div>
      <div className="mt-1 sm:mt-1.5 text-lg sm:text-xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export function Section({ eyebrow, title, subtitle, children, action }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="flex items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 flex-wrap">
        <div>
          {eyebrow && <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600 mb-1.5 sm:mb-2 font-bold">{eyebrow}</div>}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="skeleton h-5 w-1/2" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-6 w-12" />
      </div>
    </div>
  );
}
