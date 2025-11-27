"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

type FloatingDockProps = {
  items: DockItem[];
  className?: string;
};

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <nav
      className={cn(
        // altura fija y deja salir el contenido por arriba
        "flex h-16 items-center justify-center gap-5 rounded-2xl bg-neutral-900/5 px-5 shadow-lg backdrop-blur-md",
        "dark:bg-neutral-50/5 min-w-[260px] overflow-visible",
        className
      )}
    >
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "group flex flex-col items-center justify-center gap-1",
            "transition-all duration-200"
          )}
        >
          {/* ICONO: crece y se eleva, sin cambiar layout del dock */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl",
              "bg-neutral-100/80 text-neutral-800 shadow-sm",
              "dark:bg-neutral-800/80 dark:text-neutral-100",
              "transition-transform duration-200 origin-bottom",
              // crece bastante y sube un poco
              "group-hover:scale-125 group-hover:-translate-y-1"
            )}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {item.icon}
            </div>
          </div>

          {/* TEXTO: siempre visible, crece y sube ligeramente */}
          <span
            className={cn(
              "text-[0.7rem] font-medium text-neutral-500 dark:text-neutral-300",
              "leading-none",
              "transition-transform duration-200",
              "group-hover:scale-115 group-hover:-translate-y-0.5",
              "group-hover:text-neutral-900 dark:group-hover:text-white"
            )}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}
