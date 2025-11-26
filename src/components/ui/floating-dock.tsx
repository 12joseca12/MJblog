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
mobileClassName?: string; 
};

export function FloatingDock({
  items,
  className,
}: FloatingDockProps) {
  return (
    <nav
      className={cn(
        "inline-flex items-end gap-3 rounded-full bg-neutral-900/5 px-3 py-2 shadow-lg backdrop-blur-md dark:bg-neutral-50/5",
        "max-w-full",
        className
      )}
    >
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group flex flex-col items-center justify-end"
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl",
              "bg-neutral-100/80 text-neutral-800 shadow-sm transition-all duration-200",
              "group-hover:h-11 group-hover:w-11 group-hover:rounded-3xl",
              "dark:bg-neutral-800/80 dark:text-neutral-100"
            )}
          >
            <div className="h-5 w-5">{item.icon}</div>
          </div>
          <span
            className={cn(
              "mt-1 text-[0.7rem] font-medium text-neutral-500",
              "opacity-0 transition-all duration-200 group-hover:opacity-100",
              "dark:text-neutral-300"
            )}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}
