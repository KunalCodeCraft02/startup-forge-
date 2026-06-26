import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const KEY_SAVED = "sf_saved";
const KEY_HISTORY = "sf_history";
const KEY_SUBS = "sf_subs";
const KEY_PLANS = "sf_plans";
const KEY_MVPS = "sf_mvps";
const KEY_ADMIN = "sf_admin_auth";

const ADMIN_USER = "admin";
const ADMIN_PASS = "startupforge2026";

const AppContext = createContext(null);

function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function writeJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function AppProvider({ children }) {
  const [adminAuth, setAdminAuth] = useState(() => readJSON(KEY_ADMIN, false));
  const [saved, setSaved]         = useState(() => readJSON(KEY_SAVED, []));
  const [history, setHistory]     = useState(() => readJSON(KEY_HISTORY, []));
  const [subscribed, setSubscribed] = useState(() => readJSON(KEY_SUBS, false));
  const [plans, setPlans]         = useState(() => readJSON(KEY_PLANS, {}));
  const [mvps, setMvps]           = useState(() => readJSON(KEY_MVPS, {}));

  useEffect(() => writeJSON(KEY_ADMIN, adminAuth), [adminAuth]);
  useEffect(() => writeJSON(KEY_SAVED, saved), [saved]);
  useEffect(() => writeJSON(KEY_HISTORY, history), [history]);
  useEffect(() => writeJSON(KEY_SUBS, subscribed), [subscribed]);
  useEffect(() => writeJSON(KEY_PLANS, plans), [plans]);
  useEffect(() => writeJSON(KEY_MVPS, mvps), [mvps]);

  const adminLogin = useCallback((username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAdminAuth(true);
      return true;
    }
    return false;
  }, []);
  const adminLogout = useCallback(() => setAdminAuth(false), []);

  const saveIdea = useCallback((idea) => {
    setSaved((s) => (s.find((x) => x.id === idea.id) ? s : [idea, ...s].slice(0, 200)));
  }, []);
  const unsaveIdea = useCallback((id) => setSaved((s) => s.filter((x) => x.id !== id)), []);
  const isSaved = useCallback((id) => saved.some((x) => x.id === id), [saved]);

  const addHistory = useCallback((query) => {
    if (!query) return;
    setHistory((h) => [query, ...h.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, 30));
  }, []);

  const savePlan = useCallback((id, plan) => setPlans((p) => ({ ...p, [id]: { plan, ts: Date.now() } })), []);
  const saveMVP = useCallback((id, mvp) => setMvps((m) => ({ ...m, [id]: { mvp, ts: Date.now() } })), []);

  const value = useMemo(() => ({
    adminAuth, adminLogin, adminLogout,
    saved, saveIdea, unsaveIdea, isSaved,
    history, addHistory,
    subscribed, setSubscribed,
    plans, savePlan,
    mvps, saveMVP,
  }), [adminAuth, adminLogin, adminLogout, saved, saveIdea, unsaveIdea, isSaved, history, addHistory, subscribed, plans, savePlan, mvps, saveMVP]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
