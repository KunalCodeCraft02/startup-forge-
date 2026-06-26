import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/40 bg-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-slate-500 max-w-sm leading-relaxed">
            Evidence-backed startup discovery, powered by real-world signals from GitHub, Hacker News, Google News, Reddit, and ArXiv.
          </p>
          <div className="mt-5 flex gap-2">
            <a className="btn-ghost p-2.5 rounded-xl" href="#"><FiGithub className="h-4 w-4" /></a>
            <a className="btn-ghost p-2.5 rounded-xl" href="#"><FiTwitter className="h-4 w-4" /></a>
            <a className="btn-ghost p-2.5 rounded-xl" href="#"><FiLinkedin className="h-4 w-4" /></a>
          </div>
        </div>
        <FooterCol title="Product" items={[
          { label: "Explore", to: "/explore" },
          { label: "Daily Feed", to: "/feed" },
          { label: "Pricing", to: "/pricing" },
          { label: "Dashboard", to: "/dashboard" },
        ]}/>
        <FooterCol title="Company" items={[
          { label: "About", to: "/" },
          { label: "Blog", to: "/" },
          { label: "Careers", to: "/" },
          { label: "Contact", to: "/" },
        ]}/>
        <FooterCol title="Resources" items={[
          { label: "Docs", to: "/" },
          { label: "API", to: "/" },
          { label: "Status", to: "/" },
          { label: "Changelog", to: "/" },
        ]}/>
      </div>
      <div className="border-t border-white/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} StartupForge AI · Built with evidence, not vibes.</p>
          <p className="text-xs text-slate-400">Privacy · Terms · Security</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4 font-bold">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-slate-500 hover:text-violet-600 transition-colors duration-200">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
