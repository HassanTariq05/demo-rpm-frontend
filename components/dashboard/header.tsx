"use client";

import {
  Avatar,
  Breadcrumbs,
  Button,
  Dropdown,
  InputGroup,
  Kbd,
  Popover,
  TextField,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";

import { useDashboard } from "./dashboard-context";
import { activity, dashboardHref, dashboardNav } from "./data";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  FileIcon,
  GridIcon,
  HomeIcon,
  PlusIcon,
} from "./icons";

const activityIcons = {
  calendar: CalendarIcon,
  check: CheckIcon,
  file: FileIcon,
  plus: PlusIcon,
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const section = [
    { href: "/devices", label: "Devices", prefix: "/devices" },
    { href: "/readings", label: "Readings", prefix: "/readings" },
    { href: "/patients", label: "Patients", prefix: "/patients" },
  ].find((item) => pathname.startsWith(item.prefix)) ?? {
    href: "/",
    label: "Overview",
  };
  const { query, setQuery, toggleSidebar } = useDashboard();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("dashboard-search")?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="z-20 flex h-16 shrink-0 items-center gap-3 border-b border-separator bg-surface px-3 sm:px-4">
      <Button
        aria-label="Toggle sidebar"
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={toggleSidebar}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
          width="18"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </Button>

      <Breadcrumbs className="hidden min-w-0 lg:flex">
        <Breadcrumbs.Item href="/">
          <HomeIcon size={16} />
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="/">Pages</Breadcrumbs.Item>
        <Breadcrumbs.Item href={section.href}>{section.label}</Breadcrumbs.Item>
      </Breadcrumbs>

      <TextField
        aria-label="Search"
        className="mx-auto w-full max-w-md"
        value={query}
        onChange={setQuery}
      >
        <InputGroup>
          <InputGroup.Prefix>
            <SearchIcon className="pointer-events-none text-base text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input id="dashboard-search" placeholder="Search..." />
          <InputGroup.Suffix>
            {query ? (
              <Button
                aria-label="Clear search"
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => setQuery("")}
              >
                <CloseIcon size={14} />
              </Button>
            ) : (
              <Kbd className="hidden sm:inline-flex">
                <Kbd.Content>Ctrl</Kbd.Content>
                <Kbd.Content>K</Kbd.Content>
              </Kbd>
            )}
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>

      <div className="flex items-center gap-2">
        {/* <Dropdown>
          <Dropdown.Trigger
            aria-label="Open apps"
            className="button button--ghost button--sm button--icon-only"
          >
            <GridIcon size={18} />
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom end">
            <Dropdown.Menu
              aria-label="Dashboards"
              onAction={(key) => router.push(dashboardHref(String(key)))}
            >
              {dashboardNav.map((item) => (
                <Dropdown.Item key={item.key} id={item.key} textValue={item.label}>
                  {item.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown> */}

        <ThemeSwitch />

        <Popover>
          <Popover.Trigger
            aria-label="Notifications"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-default"
          >
            <BellIcon size={18} />
          </Popover.Trigger>
          <Popover.Content placement="bottom end">
            <Popover.Dialog className="w-80 p-3">
              <Popover.Heading className="px-1 pb-2 text-sm font-semibold">
                Recent activity
              </Popover.Heading>
              <ul className="flex flex-col">
                {activity.map((item) => {
                  const Icon = activityIcons[item.icon];

                  return (
                    <li key={item.title}>
                      <button
                        className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-default"
                        type="button"
                        onClick={() => setQuery(item.detail)}
                      >
                        <Icon className="mt-0.5 text-accent" size={16} />
                        <span>
                          <span className="block text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="block text-xs text-muted">
                            {item.detail} · {item.time}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>

        <Dropdown>
          <Dropdown.Trigger
            aria-label="Account menu"
            className="button button--ghost button--sm gap-2 px-2"
          >
            <Avatar size="sm">
              <Avatar.Fallback>D</Avatar.Fallback>
            </Avatar>
            {/* <span className="hidden text-sm font-medium sm:inline">Demo</span> */}
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom end">
            <Dropdown.Menu
              aria-label="Account"
              onAction={(key) => router.push(String(key))}
            >
              <Dropdown.Item id="/" textValue="Logout">
                Logout
              </Dropdown.Item>
              
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
