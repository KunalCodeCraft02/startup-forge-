import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiX, FiHeart, FiArrowRight, FiShare2, FiRotateCcw,
  FiTrendingUp, FiDollarSign, FiClock, FiTarget, FiZap, FiCalendar,
} from "react-icons/fi";
import { Pill, MetricBar } from "./Bits";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function SwipeDeck({ items, onEmpty }) {
  const [stack, setStack] = useState(items);
  const [history, setHistory] = useState([]);

  useEffect(() => { setStack(items); setHistory([]); }, [items]);

  const top = stack[0];
  const next = stack[1];
  const after = stack[2];

  const advance = (action) => {
    if (!top) return;
    setHistory((h) => [{ idea: top, action }, ...h].slice(0, 30));
    setStack((s) => s.slice(1));
  };

  const undo = () => {
    if (!history.length) return;
    const [last, ...rest] = history;
    setHistory(rest);
    setStack((s) => [last.idea, ...s]);
  };

  useEffect(() => { if (!stack.length && onEmpty) onEmpty(); }, [stack.length, onEmpty]);

  if (!top) {
    return (
      <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-slate-900">Reviewed every opportunity</h3>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">Refine your search or generate a fresh batch.</p>
        <button onClick={undo} disabled={!history.length} className="btn-ghost mt-6 disabled:opacity-30">
          <FiRotateCcw className="h-4 w-4" /> Undo last
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative h-[520px] sm:h-[640px]" style={{ perspective: "1200px" }}>
        {after && (
          <div className="absolute inset-0 origin-bottom" style={{ transform: "scale(.90) translateY(32px) translateZ(-40px)" }}>
            <CardShell><div className="absolute inset-0 bg-white/30 rounded-3xl" /></CardShell>
          </div>
        )}
        {next && (
          <div className="absolute inset-0 origin-bottom" style={{ transform: "scale(.95) translateY(16px) translateZ(-20px)" }}>
            <CardShell><CardPreview idea={next} /></CardShell>
          </div>
        )}
        <AnimatePresence initial={false}>
          <SwipeCard
            key={top.id}
            idea={top}
            onSwipe={(dir) => {
              if (dir === "right") toast.success("Saved");
              else toast("Skipped", { icon: "↩︎" });
              advance(dir);
            }}
          />
        </AnimatePresence>
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button onClick={() => advance("left")} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full glass-strong flex items-center justify-center text-rose-400 hover:text-rose-500 hover:border-rose-300/50 transition-all duration-200 hover:scale-105 shadow-md active:scale-95" title="Skip">
          <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button onClick={undo} disabled={!history.length} className="h-10 w-10 sm:h-11 sm:w-11 rounded-full glass-strong flex items-center justify-center text-slate-400 disabled:opacity-20 transition-all hover:scale-105 shadow-sm active:scale-95" title="Undo">
          <FiRotateCcw className="h-4 w-4" />
        </button>
        <Link to={`/idea/${top.id}`} state={{ idea: top }} className="h-10 w-10 sm:h-11 sm:w-11 rounded-full glass-strong flex items-center justify-center text-violet-500 hover:text-violet-600 transition-all hover:scale-105 shadow-sm active:scale-95" title="View details">
          <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
        <button onClick={() => { navigator.clipboard?.writeText(`${top.name} — ${top.tagline}`); toast.success("Copied"); }} className="h-10 w-10 sm:h-11 sm:w-11 rounded-full glass-strong flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all hover:scale-105 shadow-sm active:scale-95" title="Share">
          <FiShare2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button onClick={() => advance("right")} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full glass-strong flex items-center justify-center text-emerald-400 hover:text-emerald-500 hover:border-emerald-300/50 transition-all duration-200 hover:scale-105 shadow-md active:scale-95" title="Save">
          <FiHeart className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <div className="mt-3 sm:mt-4 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
        {stack.length} remaining · Swipe right to save, left to skip
      </div>
    </div>
  );
}

function CardShell({ children }) {
  return <div className="absolute inset-0 rounded-3xl glass-strong overflow-hidden shadow-lg">{children}</div>;
}

function CardPreview({ idea }) {
  return (
    <div className="p-6 opacity-60">
      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">{idea.industry}</div>
      <div className="text-lg font-bold text-slate-800">{idea.name}</div>
    </div>
  );
}

function SwipeCard({ idea, onSwipe }) {
  const { saveIdea } = useApp();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-20, 0, 20]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const likeOp = useTransform(x, [0, 70, 180], [0, 0.5, 1]);
  const nopeOp = useTransform(x, [0, -70, -180], [0, 0.5, 1]);

  const handleDragEnd = (_, info) => {
    const off = info.offset.x;
    const vel = info.velocity.x;
    if (off > 140 || vel > 600) { saveIdea(idea); onSwipe("right"); }
    else if (off < -140 || vel < -600) onSwipe("left");
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl liquid-glass overflow-hidden cursor-grab active:cursor-grabbing shadow-xl"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.88, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.82, opacity: 0, y: -30, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-violet-400/15 via-blue-300/10 to-cyan-300/15 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-48 grid-bg opacity-30 pointer-events-none" />

      <motion.div style={{ opacity: likeOp }} className="absolute top-6 left-6 z-10 rotate-[-8deg] rounded-xl border-2 border-emerald-400 px-3 py-1 text-emerald-600 font-bold tracking-widest text-sm bg-white/50">
        SAVE
      </motion.div>
      <motion.div style={{ opacity: nopeOp }} className="absolute top-6 right-6 z-10 rotate-[8deg] rounded-xl border-2 border-rose-400 px-3 py-1 text-rose-500 font-bold tracking-widest text-sm bg-white/50">
        SKIP
      </motion.div>

      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center gap-2">
          <Pill color="violet">{idea.industry}</Pill>
          <Pill color="cyan"><FiZap className="h-3 w-3" /> {idea.evidence.length} signals</Pill>
          <Pill color="slate"><FiCalendar className="h-3 w-3" /> {new Date(idea.generatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Pill>
        </div>

        <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{idea.name}</h3>

        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
          <Block label="Problem">{idea.problem}</Block>
          <Block label="Solution">{idea.solution}</Block>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <MetricBar label="Opportunity"  value={idea.opportunityScore} color="violet" />
          <MetricBar label="AI Confidence" value={idea.aiConfidence}    color="cyan" />
          <MetricBar label="Competition"   value={idea.competitionPct}  color="rose" />
          <MetricBar label="Difficulty"    value={idea.difficultyPct}   color="amber" />
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
          <Mini icon={<FiTarget />} label="Market" value={idea.marketSize.sam} />
          <Mini icon={<FiDollarSign />} label="ARR" value={idea.estAnnualRevenue} />
          <Mini icon={<FiTrendingUp />} label="Growth" value={`${idea.growthRate}% YoY`} />
          <Mini icon={<FiClock />}    label="Build" value={`${idea.timelineWeeks} weeks`} />
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-1.5">
          {idea.tags.slice(0, 6).map((t) => <Pill key={t} color="blue">{t}</Pill>)}
        </div>

        <Link to={`/idea/${idea.id}`} state={{ idea }} className="btn-primary mt-4 sm:mt-5 w-full justify-center text-xs sm:text-sm py-2.5 sm:py-3">
          Open full report <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function Block({ label, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</div>
      <p className="text-sm text-slate-700 mt-1 leading-relaxed">{children}</p>
    </div>
  );
}

function Mini({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/50 border border-slate-200/50 px-2.5 py-2.5 flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="ml-auto text-slate-800 font-bold truncate">{value}</span>
    </div>
  );
}
