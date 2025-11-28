"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { literals, getLiteral } from "@/literals";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { ArrowRightIcon } from "@/icons";

const heroImages = literals.home.heroImages as string[];

export function HeroBlock() {
  const { styles, theme } = useThemeStyles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentImage = heroImages[currentIndex];

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 400);

      return () => clearTimeout(timeout);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const title = getLiteral("home", "heroTitle");
  const subtitle = getLiteral("home", "heroSubtitle");
  const primaryCta = getLiteral("home", "heroPrimaryCta");
  const exploreCta = getLiteral("home", "heroSecondaryExplore");
  const stepsCta = getLiteral("home", "heroSecondarySteps");

  const gradientBase = styles.background.primary;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center blur-xl lg:blur-3xl opacity-80 transition-[background-image] duration-700"
        style={{
          backgroundImage: `url(${currentImage})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/20 dark:bg-black/40" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          backgroundImage: `linear-gradient(to top, ${gradientBase}, transparent)`,
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-4 gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 justify-center">
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left gap-6">
          <div className="space-y-3 max-w-xl">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight"
              style={{ color: 'white' }}
            >
              {title}
            </h1>

            <p
              className="text-sm sm:text-base lg:text-lg leading-relaxed"
              style={{ color: 'white' }}
            >
              {subtitle}
            </p>
          </div>

          <div className="w-full max-w-md">
            <Link
              href="/services"
              className="flex w-full items-center justify-between gap-2 rounded-2xl px-5 py-3 text-sm sm:text-base font-semibold shadow-md transition-transform duration-150 hover:translate-y-[1px] hover:shadow-lg"
              style={{
                backgroundColor: styles.brand.primary,
                color: styles.text.inverse,
              }}
            >
              <span>{primaryCta}</span>
              <span aria-hidden="true" className="text-lg">
                ✈️
              </span>
            </Link>
          </div>

          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/blog"
                className="flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors"
                style={{
                  backgroundColor: styles.background.secondary,
                  color: styles.text.body,
                  border: `1px solid ${styles.brand.primaryDark}`,
                }}
              >
                <span className="line-clamp-2">{exploreCta}</span>
                <ArrowRightIcon size={16} />
              </Link>

              <Link
                href="/itinerary"
                className="flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(0,0,0,0.35)"
                      : "rgba(255,255,255,0.7)",
                  color: styles.text.body,
                  border: `1px solid ${styles.brand.primary}`,
                }}
              >
                <span className="line-clamp-2">{stepsCta}</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div
            className="relative aspect-[16/10] w-full max-w-md sm:max-w-lg lg:max-w-xl overflow-hidden rounded-2xl border shadow-lg"
            style={{
              borderColor:
                theme === "dark"
                  ? "rgba(234, 230, 223, 0.15)" 
                  : "rgba(43, 52, 56, 0.12)", 
            }}
          >
            <Image
              src={currentImage}
              alt="Paisaje de nuestros viajes"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className={[
                "object-cover transition-all duration-800",
                isTransitioning
                  ? "blur-md scale-[1.03] opacity-70"
                  : "blur-0 scale-100 opacity-100",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
