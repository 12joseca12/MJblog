"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "@/types";
import { getThemeStyles } from "@/styles";

type ThemeContextValue = {
  theme: Theme;
  styles: ReturnType<typeof getThemeStyles>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  themeOverrides: Record<string, any>;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeToDom(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeOverrides, setThemeOverrides] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch overrides on mount
  useEffect(() => {
    import("@/lib/firebaseHelper").then(async ({ getThemeSettings }) => {
      try {
        const settings = await getThemeSettings();
        if (settings) {
          setThemeOverrides(settings);
        }
      } catch (e) {
        console.error("Failed to load theme settings", e);
      } finally {
        setIsLoaded(true);
      }
    });
  }, []);

  // Detect initial theme
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyThemeToDom(stored);
        return;
      }
    } catch {
      // ignore
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Theme = prefersDark ? "dark" : "light";
    setThemeState(initial);
    applyThemeToDom(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyThemeToDom(t);
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Merge default styles with overrides
  // We need to merge deep. For simple color overrides structure:
  // overrides = { theme: { light: { background: { primary: "#fff" } } } }
  // styles.ts returns structured object.
  // We'll trust getThemeStyles returns standard, and we overlay overrides.

  const defaultStyles = getThemeStyles(theme);

  // Very basic merge helper for 2 levels deep (theme -> mode -> category -> color)
  // Actually getThemeStyles returns the FLATTENED colors for the CURRENT theme.
  // So we expect overrides to be shaped like: { light: { ... }, dark: { ... } }
  // And we extract the current mode overrides.

  const currentModeOverrides = themeOverrides[theme] || {};

  // Deep merge utility
  const mergeDeep = (target: any, source: any) => {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };

  const styles = mergeDeep(defaultStyles, currentModeOverrides);

  return (
    <ThemeContext.Provider value={{ theme, styles, setTheme, toggleTheme, themeOverrides }}>
      {children}
    </ThemeContext.Provider>
  );
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function useThemeStyles() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeStyles must be used within ThemeProvider");
  }
  return ctx;
}
