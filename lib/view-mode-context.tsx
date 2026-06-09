"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ViewMode = "desktop" | "mobile";

const ViewModeContext = createContext<{
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}>({ mode: "desktop", setMode: () => {} });

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("desktop");

  useEffect(() => {
    const saved = localStorage.getItem("viewMode") as ViewMode | null;
    if (saved === "mobile" || saved === "desktop") setModeState(saved);
  }, []);

  function setMode(m: ViewMode) {
    setModeState(m);
    localStorage.setItem("viewMode", m);
  }

  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export const useViewMode = () => useContext(ViewModeContext);
