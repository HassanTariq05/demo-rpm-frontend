"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

function ThemeFavicon() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;

    const href = resolvedTheme === "dark" ? "/rpm-mark-dark.svg" : "/rpm-mark-light.svg";
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.type = "image/svg+xml";
    link.href = href;
  }, [resolvedTheme]);

  return null;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <ThemeFavicon />
      {children}
    </NextThemesProvider>
  );
}
