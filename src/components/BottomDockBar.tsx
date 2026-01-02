// src/components/BottomDockBar.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { ProfileOverlay } from "@/components/ProfileOverlay";
import { UserArea } from "./UserArea";
import { AuthForm } from "./AuthForm";
import { AnimatePresence, motion } from "framer-motion";

import { auth, subscribeToUnreadSystemMessages } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname } from "next/navigation";

export function BottomDockBar() {
  const pathname = usePathname();
  const { theme, setTheme, styles } = useThemeStyles();

  const isDark = theme === "dark";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Escuchar estado de auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Escuchar mensajes no leídos (solo si hay usuario)
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    const unsub = subscribeToUnreadSystemMessages(
      currentUser.uid,
      (count) => setUnreadCount(count)
    );

    return () => unsub();
  }, [currentUser]);

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

  // Inicial del usuario
  const userInitial = currentUser
    ? (currentUser.displayName?.[0] ??
      currentUser.email?.[0] ??
      "?"
    ).toUpperCase()
    : null;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Barra fija abajo */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 w-full"
        style={{
          backgroundColor: isDark
            ? "rgba(0,0,0,0.30)"
            : "rgba(255,255,255,0.25)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="w-full px-2 pb-1">
          <div className="mx-auto w-full">
            <div className="mb-2">
              <ScrollProgress />
            </div>

            <div
              className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border px-3 py-2"
              style={{
                borderColor: isDark
                  ? "rgba(234, 230, 223, 0.30)"
                  : "rgba(43, 52, 56, 0.30)",
              }}
            >
              {/* IZQUIERDA: avatar + switch */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="rounded-full bg-black/5 p-1 dark:bg-white/10"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="flex items-center justify-center text-sm font-semibold">
                        {userInitial ? (
                          userInitial
                        ) : (
                          <UserRoundIcon size={16} className="opacity-70" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] font-semibold leading-none text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
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

              {/* CENTRO: dock */}
              <div className="flex flex-1 justify-center">
                <FloatingDock items={dockItems} />
              </div>

              {/* DERECHA: Botón de Chat */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent p-0 transition hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: styles.text.body }}
              >
                <span className="text-xl">💬</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de perfil */}
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
      />

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[24rem] md:w-[26rem] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ backgroundColor: styles.background.primary }}
          >
            {/* Close button header */}
            <div className="flex justify-end p-2 absolute top-0 right-0 z-50">
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-full px-3 py-1 text-sm font-bold bg-black/5 hover:bg-black/10 transition"
              >
                ✕
              </button>
            </div>

            {currentUser ? (
              <div className="h-full">
                <UserArea
                  currentUser={currentUser}
                  onClose={() => setIsChatOpen(false)}
                  defaultChatOpen={true}
                />
              </div>
            ) : (
              <div className="h-full pt-10">
                <AuthForm onSuccess={() => { /* User arg in useEffect will handle state update */ }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
