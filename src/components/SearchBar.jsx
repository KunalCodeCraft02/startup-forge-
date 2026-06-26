import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const PLACEHOLDERS = [
  "AI agents for healthcare clinics",
  "Cybersecurity for SMBs",
  "Vertical SaaS for manufacturing",
  "Climate tech for buildings",
  "FinTech for freelancers in emerging markets",
  "Creator economy tools",
  "Agricultural robotics",
  "Education for adult learners",
];

export default function SearchBar({ large = false, defaultValue = "" }) {
  const [q, setQ] = useState(defaultValue);
  const [ph, setPh] = useState(PLACEHOLDERS[0]);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPh(PLACEHOLDERS[i]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    const query = (q || ph).trim();
    if (!query) return;
    navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={submit} className={`relative ${large ? "max-w-3xl" : "max-w-xl"} w-full mx-auto group`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/40 via-blue-400/30 to-cyan-400/40 rounded-2xl blur-lg opacity-30 group-focus-within:opacity-60 transition-opacity duration-500" />
      <div className="relative flex items-center gap-2 liquid-glass rounded-2xl p-1.5 sm:p-2 pl-3 sm:pl-5">
        <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 shrink-0" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search for ${ph}…`}
          className={`flex-1 min-w-0 bg-transparent outline-none placeholder:text-slate-400/70 text-slate-800 font-medium ${large ? "py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg" : "py-2 text-sm"}`}
          aria-label="Search startup opportunities"
        />
        <button type="submit" className="btn-primary text-xs sm:text-sm shrink-0 px-3 sm:px-4">
          <span className="hidden sm:inline">Discover</span>
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
