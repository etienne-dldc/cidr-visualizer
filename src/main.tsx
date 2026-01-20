import { init } from "@plausible-analytics/tracker";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App.tsx";
import { AppStateProvider } from "./components/AppStateProvider.tsx";
import "./index.css";

init({ domain: "cidr.etienne.tech" });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>,
);
