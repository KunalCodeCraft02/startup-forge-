import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Landing from "../pages/Landing";
import Explore from "../pages/Explore";
import IdeaDetails from "../pages/IdeaDetails";
import Dashboard from "../pages/Dashboard";
import DailyFeed from "../pages/DailyFeed";
import Pricing from "../pages/Pricing";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/idea/:id" element={<IdeaDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<DailyFeed />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
