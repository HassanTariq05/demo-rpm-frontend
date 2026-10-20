"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { type StatusFilter } from "./data";

type DashboardState = {
  query: string;
  setQuery: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  clearFilters: () => void;
};

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const value = useMemo<DashboardState>(
    () => ({
      query,
      setQuery,
      statusFilter,
      setStatusFilter,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar: () => setSidebarOpen((open) => !open),
      clearFilters: () => {
        setQuery("");
        setStatusFilter("all");
      },
    }),
    [query, sidebarOpen, statusFilter],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
}
