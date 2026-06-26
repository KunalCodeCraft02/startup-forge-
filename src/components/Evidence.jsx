import { FiExternalLink, FiFileText, FiGithub, FiTrendingUp, FiAward, FiGlobe, FiCpu, FiMessageCircle, FiShoppingBag, FiHelpCircle, FiBox } from "react-icons/fi";
import { Pill } from "./Bits";

const ICONS = {
  github: FiGithub,
  hn: FiMessageCircle,
  ph: FiShoppingBag,
  paper: FiFileText,
  patent: FiAward,
  so: FiHelpCircle,
  trends: FiTrendingUp,
  gov: FiGlobe,
  yc: FiBox,
  blog: FiCpu,
  news: FiCpu,
  reddit: FiMessageCircle,
  github_issue: FiGithub,
};

export default function EvidenceList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((e, i) => {
        const Icon = ICONS[e.icon] || FiCpu;
        return (
          <li key={i} className="glass rounded-xl p-3.5 flex items-start gap-3 hover:bg-white/60 transition-all duration-200 group/evidence">
            <span className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-violet-50/80 border border-violet-200/40 grid place-items-center text-violet-500 group-hover/evidence:text-violet-600 transition-colors">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Pill color="slate">{e.type}</Pill>
                <span>·</span>
                <span>{new Date(e.date).toLocaleDateString()}</span>
                <span>·</span>
                <span>{Math.round(e.relevance * 100)}% relevance</span>
              </div>
              <a href={e.url} target="_blank" rel="noreferrer"
                 className="block mt-1.5 text-sm text-slate-700 hover:text-violet-600 line-clamp-2 transition-colors duration-200 font-medium">
                {e.title}
              </a>
              <div className="mt-0.5 text-[10px] text-slate-400">{e.source}</div>
            </div>
            <a href={e.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-violet-500 p-1.5 transition-colors">
              <FiExternalLink className="h-3.5 w-3.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
