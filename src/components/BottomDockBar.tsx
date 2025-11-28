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
      href: "/blog",
    },
    {
      title: "Itinerarios",
      icon: (
        <ItineraryIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/itinerary",
    },
    {
      title: "Servicios",
      icon: (
        <ServicesIcon className="h-full w-full text-neutral-700 dark:text-neutral-200" />
      ),
      href: "/services",
    },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 w-full"
      style={{
        backgroundColor: isDark ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.25)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="w-full px-2 pb-1">
        <div
          className="mx-auto w-full"
          style={{
            backgroundColor: "puple",
          }}
        >
          <div className="mb-2">
            <ScrollProgress />
          </div>

          <div
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border  px-3 py-2"
            style={{
              borderColor: isDark
                ? "rgba(234, 230, 223, 0.30)"
                : "rgba(43, 52, 56, 0.30)",
            }}
          >
            <div className="flex items-center gap-3">
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

              <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700 hide-on-mobile" />

              <div className="relative flex items-center hide-on-mobile">
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                  className="peer h-7 w-16 rounded-full bg-neutral-300 dark:bg-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-200"
                />
                <span className="pointer-events-none absolute left-1 flex h-4 w-4 items-center justify-center text-neutral-700 dark:text-neutral-300 transition-opacity duration-200 opacity-40 peer-data-[state=checked]:opacity-100">
                  <MoonIcon size={14} />
                </span>
                <span className="pointer-events-none absolute right-1 flex h-4 w-4 items-center justify-center text-neutral-700 dark:text-neutral-300 transition-opacity duration-200 opacity-100 peer-data-[state=checked]:opacity-40">
                  <SunIcon size={14} />
                </span>
              </div>
            </div>

            <div className="flex flex-1 justify-center">
              <FloatingDock items={dockItems} />
            </div>

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
    </div>
  );
}
