"use client";

import Link from "next/link";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { getLiteral } from "@/literals";

export function SpanHomeServices() {
  const { styles } = useThemeStyles();

  const title = getLiteral("home", "spanServicesTitle");
  const subtitle = getLiteral("home", "spanServicesSubtitle");
  const cta = getLiteral("home", "spanServicesCta");

  return (
    <section className="w-full px-4 py-10">
      <div
        className="mx-auto max-w-5xl rounded-3xl px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12"
        style={{
          backgroundColor: styles.background.secondary,
        }}
      >
        <h2
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ color: styles.text.body }}
        >
          {title}
        </h2>

        <p
          className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: styles.text.muted }}
        >
          {subtitle}
        </p>

        <div className="flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-3 text-sm font-semibold sm:text-base
                       transition-all duration-150
                       shadow-[6px_6px_16px_rgba(0,0,0,0.18),_-6px_-6px_16px_rgba(255,255,255,0.7)]
                       hover:shadow-[3px_3px_10px_rgba(0,0,0,0.25),_-3px_-3px_10px_rgba(255,255,255,0.6)]
                       hover:translate-y-[1px]"
            style={{
              // Botón en Sage Forest (brand.primary), texto claro
              backgroundColor: styles.brand.primary,
              color: styles.text.inverse,
            }}
          >
            {cta}
          </Link>
        </div>
      </div>
      <div className="w-48 h-24"></div> {/* Eliminar en produccion */}
    </section>
  );
}
