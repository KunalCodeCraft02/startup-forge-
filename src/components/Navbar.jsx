import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiBookmark, FiShield } from "react-icons/fi";
import Logo from "./Logo";
import { useApp } from "../context/AppContext";

const nav = [
  { to: "/explore", label: "Explore" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/feed", label: "Daily Feed" },
  { to: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { saved, adminAuth } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/50 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-violet-700 bg-violet-100/60 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/dashboard" className="btn-ghost text-sm" title="Saved ideas">
            <FiBookmark className="h-4 w-4" />
            {saved.length > 0 && <span className="text-xs font-bold">{saved.length}</span>}
          </Link>
          {adminAuth && (
            <Link to="/admin" className="btn-ghost text-sm border-violet-300/30 text-violet-600 hover:bg-violet-50/60" title="Admin">
              <FiShield className="h-4 w-4" />
            </Link>
          )}
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen((v) => !v)}>
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/40 bg-white/60 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={({ isActive }) => `rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "text-violet-700 bg-violet-50/60" : "text-slate-600"}`}>
                {n.label}
              </NavLink>
            ))}
            {adminAuth && (
              <NavLink to="/admin" onClick={() => setOpen(false)}
                className={({ isActive }) => `rounded-xl px-3 py-2.5 text-sm font-medium text-violet-600 ${isActive ? "bg-violet-50/60" : ""}`}>
                <FiShield className="inline h-4 w-4 mr-1.5" /> Admin
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
