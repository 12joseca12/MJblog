"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // TRACK: más ancho, más alto, con fondos claros/osc./activo
        "peer inline-flex h-7 w-16 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50",
        // fondos por estado (independientes del theme)
        "data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700",
        "data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-transform",
          "dark:data-[state=unchecked]:bg-foreground",
          "dark:data-[state=checked]:bg-primary-foreground",
          "data-[state=unchecked]:translate-x-[2px]",
          "data-[state=checked]:translate-x-[calc(210%)]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
