import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15, 15, 35, 0.92)",
              color: "#e8ebff",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              fontSize: "13px",
              borderRadius: "12px",
            },
            iconTheme: { primary: "#22d3ee", secondary: "#070713" },
          }}
        />
      </HashRouter>
    </AppProvider>
  );
}
