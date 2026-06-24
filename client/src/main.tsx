import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

// Routing base: "" normally, "/REDISENO-FEI-WEB-V2" when built for the GitHub Pages subpath.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router base={routerBase}>
        <App />
      </Router>
    </QueryClientProvider>
  </StrictMode>,
);
