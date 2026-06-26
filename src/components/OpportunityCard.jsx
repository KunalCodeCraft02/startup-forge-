import { Link } from "react-router-dom";
import { Pill, MetricBar } from "./Bits";
import { FiBookmark, FiTrendingUp, FiZap, FiClock, FiDollarSign, FiCalendar, FiGlobe } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function OpportunityCard({ idea, compact = false }) {
  const { saveIdea, unsaveIdea, isSaved } = useApp();
  const saved = isSaved(idea.id);

  const toggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (saved) { unsaveIdea(idea.id); toast.success("Removed from saved"); }
    else       { saveIdea(idea);     toast.success("Saved to dashboard"); }
  };

  const isRealData = idea._dataSource === "real";
  const signalCount = idea._signalCount || idea.evidence.length;

  return (
    <Link to={`/idea/${idea.id}`} state={{ idea }} className="block group">
      <article className="card-3d h-full">
        <div className="card-3d-inner p-4 sm:p-5 h-full flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Pill color="violet">{idea.industry}</Pill>
                {isRealData && <Pill color="green"><FiGlobe className="h-3 w-3" /> Live</Pill>}
                <Pill color="slate">
                  <FiCalendar className="h-3 w-3" />
                  {new Date(idea.generatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </Pill>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors duration-300">{idea.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">{idea.problem}</p>
            </div>
            <button onClick={toggle}
                    className={`shrink-0 rounded-xl p-2.5 border transition-all duration-200 ${saved ? "bg-violet-100/60 border-violet-300/40 text-violet-600 shadow-sm" : "border-slate-200/60 text-slate-400 hover:text-violet-600 hover:bg-violet-50/40"}`}
                    aria-label={saved ? "Unsave" : "Save"}>
              <FiBookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          {!compact && (
            <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">{idea.solution}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricBar label="Opportunity"  value={idea.opportunityScore} color="violet" />
            <MetricBar label="AI Confidence" value={idea.aiConfidence}    color="cyan" />
            <MetricBar label="Competition"   value={idea.competitionPct}  color="rose" />
            <MetricBar label="Difficulty"    value={idea.difficultyPct}   color="amber" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
            <Mini icon={<FiTrendingUp className="h-3.5 w-3.5" />} label="Growth" value={`${idea.growthRate}%`} />
            <Mini icon={<FiDollarSign className="h-3.5 w-3.5" />} label="ARR"    value={idea.estAnnualRevenue} />
            <Mini icon={<FiClock className="h-3.5 w-3.5" />}      label="Build"  value={`${idea.timelineWeeks}w`} />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {idea.tags.slice(0, 4).map((t) => (
              <Pill key={t} color="blue">{t}</Pill>
            ))}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/50">
            <span className="inline-flex items-center gap-1.5 font-medium">
              {isRealData
                ? <><FiZap className="h-3 w-3 text-emerald-500" /> {signalCount} live signals</>
                : <><FiZap className="h-3 w-3" /> {signalCount} signals</>
              }
            </span>
            <span className="text-violet-500 group-hover:text-violet-700 transition-colors font-semibold">View details →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Mini({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-100/50 border border-slate-200/50 px-2.5 py-2 flex items-center gap-1.5">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="ml-auto text-slate-800 font-bold">{value}</span>
    </div>
  );
}
