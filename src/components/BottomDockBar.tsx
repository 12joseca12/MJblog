"use client";

import React from "react";
import { FloatingDock } from "./ui/floating-dock";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import {
  HomeIcon,
  BlogIcon,
  ItineraryIcon,
  ServicesIcon,
  UserRoundIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
  ArrowRightIcon,
} from "@/icons";

export function BottomDockBar() {
  const { theme, setTheme } = useThemeStyles();
  const isDark = theme === "dark";

  const dockItems = [
    {
      title: "Home",
      icon: (
        <HomeIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/",
    },
    {
      title: "Blog",
      icon: (
        <BlogIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/Blog",
    },
    {
      title: "Itinerarios",
      icon: (
        <ItineraryIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/Itinerary",
    },
    {
      title: "Servicios",
      icon: (
        <ServicesIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/Services",
    },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40"
      style={{
        backgroundColor: isDark ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 pb-4 pt-2">

        {/* Scroll Progress PEGADO ARRIBA DEL VIEW */}
        <div className="mb-2">
          <ScrollProgress />
        </div>

        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-3 py-2">

          {/* IZQUIERDA */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <button
              type="button"
              className="rounded-full bg-black/5 p-1 dark:bg-white/10"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <UserRoundIcon size={16} className="opacity-70" />
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Separador */}
            <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700" />

            {/* Toggle tema */}
            <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="peer absolute inset-0 h-full"
              />
              <span className="pointer-events-none flex items-center justify-center">
                <MoonIcon size={16} />
              </span>
              <span className="pointer-events-none flex items-center justify-center">
                <SunIcon size={16} />
              </span>
            </div>
          </div>

          {/* CENTRO DOCK */}
          <div className="flex flex-1 justify-center">
            <FloatingDock items={dockItems} />
          </div>

          {/* SEARCH */}
          <form className="relative hidden min-w-[9rem] max-w-[14rem] md:block">
            <Input
              className="h-9 w-full ps-8 pe-8 text-sm"
              placeholder="Buscar..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2">
              <SearchIcon size={14} />
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 end-0 flex w-8 items-center justify-center"
            >
              <ArrowRightIcon size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
