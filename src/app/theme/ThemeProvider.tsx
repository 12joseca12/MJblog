"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "@/types";
import { getThemeStyles } from "@/styles";

type ThemeContextValue = {
  theme: Theme;
  styles: ReturnType<typeof getThemeStyles>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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

  // detectar tema inicial (localStorage o prefers-color-scheme)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyThemeToDom(stored);
        return;
      }
    } catch {
      // ignoramos errores de localStorage
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
      // ignoramos
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const styles = getThemeStyles(theme);

  return (
    <ThemeContext.Provider value={{ theme, styles, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeStyles() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeStyles must be used within ThemeProvider");
  }
  return ctx;
}
