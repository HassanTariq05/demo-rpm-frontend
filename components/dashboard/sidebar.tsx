"use client";

import { Disclosure, ScrollShadow } from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import clsx from "clsx";

import { useDashboard } from "./dashboard-context";
import { dashboardNav } from "./data";
import { navIcons } from "./icons";
import { RpmLogo } from "./rpm-logo";

function NavLink({
  active,
  href,
  icon,
  label,
}: {
  active: boolean;
  href: string;
  icon: ReactNode;
  label: string;
}) {
  const { setSidebarOpen } = useDashboard();

  return (
    <NextLink
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent/15 font-medium text-accent"
          : "text-foreground/80 hover:bg-default",
      )}
      href={href}
      onClick={() => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
      }}
    >
      <span className="text-current">{icon}</span>
      {label}
    </NextLink>
  );
}

function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 px-3 pb-6">
      <Disclosure defaultExpanded>
        <Disclosure.Heading>
          <Disclosure.Trigger className="flex w-full items-center justify-between px-3 py-1 text-xs font-medium text-muted">
            Pages
            <Disclosure.Indicator />
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="flex flex-col gap-0.5 p-0">
            {dashboardNav.map((item) => {
              const Icon = navIcons[item.icon];

              return (
                <NavLink
                  key={item.key}
                  active={pathname === item.href}
                  href={item.href}
                  icon={<Icon size={18} />}
                  label={item.label}
                />
              );
            })}
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}

export function Sidebar() {
  const { setSidebarOpen, sidebarOpen } = useDashboard();

  return (
    <>
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <aside
        className={clsx(
          "z-40 flex h-full w-64 shrink-0 flex-col border-r border-separator bg-surface",
          "fixed inset-y-0 left-0 transition-transform lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden",
        )}
      >
        <NextLink
          className="flex items-center gap-2.5 px-5 py-5 text-foreground"
          href="/"
        >
          <RpmLogo />
          <span className="text-sm font-semibold tracking-tight">RPM</span>
        </NextLink>
        <ScrollShadow className="min-h-0 flex-1" hideScrollBar>
          <SidebarNav />
        </ScrollShadow>
      </aside>
    </>
  );
}
