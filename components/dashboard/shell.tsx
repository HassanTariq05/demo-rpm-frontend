"use client";

import { Popover } from "@heroui/react";
import { useEffect, type ReactNode } from "react";

import { DashboardProvider, useDashboard } from "./dashboard-context";
import { Header } from "./header";
import { HeadsetIcon } from "./icons";
import { Sidebar } from "./sidebar";

function Certification({
  icon,
  label,
  title,
}: {
  icon: ReactNode;
  label: string;
  title: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-muted">
      {icon}
      <span className="text-left text-[10px] font-semibold leading-tight tracking-[0.14em]">
        {title}
        <span className="mt-0.5 block tracking-[0.18em]">{label}</span>
      </span>
    </span>
  );
}

function SocMark() {
  return (
    <svg aria-hidden="true" className="size-9 shrink-0" fill="none" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="18" cy="18" r="13.25" stroke="currentColor" strokeWidth="0.75" />
      <text
        fill="currentColor"
        fontSize="6.5"
        fontWeight="700"
        textAnchor="middle"
        x="18"
        y="16.2"
      >
        SOC
      </text>
      <text fill="currentColor" fontSize="8" fontWeight="700" textAnchor="middle" x="18" y="24.2">
        2
      </text>
    </svg>
  );
}

function HipaaMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-9 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      viewBox="0 0 36 36"
    >
      <path d="M8 15.5c2.2-1.2 4.2-.4 6 1.2 1.6 1.4 2.4 3.2 2.4 5.8" />
      <path d="M28 15.5c-2.2-1.2-4.2-.4-6 1.2-1.6 1.4-2.4 3.2-2.4 5.8" />
      <path d="M18 11.5v16" />
      <path d="M12.5 13.5h11" />
      <path d="M14.2 13.5c.2-2.4 1.6-4 3.8-4s3.6 1.6 3.8 4" />
      <path d="M10.5 17.2c1.5.2 2.6 1.2 3.2 2.6" />
      <path d="M25.5 17.2c-1.5.2-2.6 1.2-3.2 2.6" />
    </svg>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { setSidebarOpen } = useDashboard();

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6">
            {children}
          </div>
          <footer className="flex flex-col items-center justify-between gap-4 border-t border-separator px-6 py-5 text-sm text-muted sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
              <Certification icon={<SocMark />} label="CERTIFIED" title="SOC 2 TYPE II" />
              <Certification icon={<HipaaMark />} label="COMPLIANT" title="HIPAA" />
            </div>
            <p>RPM © 2026.</p>
          </footer>
        </div>
      </div>

      <Popover>
        <Popover.Trigger
          aria-label="Open support chat"
          className="fixed bottom-6 right-6 z-30 flex size-12 items-center justify-center rounded-full border border-separator bg-surface text-foreground shadow-lg"
        >
          <HeadsetIcon size={22} />
        </Popover.Trigger>
        <Popover.Content placement="top end">
          <Popover.Dialog className="w-72 p-4">
            <Popover.Heading className="text-sm font-semibold">
              Hospital desk
            </Popover.Heading>
            <p className="mt-1 text-sm text-muted">
              The care team is available for scheduling, admissions, and
              patient updates.
            </p>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <ShellFrame>{children}</ShellFrame>
    </DashboardProvider>
  );
}
