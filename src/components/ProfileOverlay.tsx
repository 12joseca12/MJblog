"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { ArrowLeftIcon } from "@/icons";

type ProfileOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const overlayVariants: Variants = {
  open: {
    clipPath: "circle(1000% at 50% 90%)",
    transition: {
      type: "spring",
      stiffness: 24,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: "circle(0px at 50% 90%)",
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 260,
      damping: 35,
    },
  },
};

type Mode = "intro" | "login" | "signup";

export function ProfileOverlay({ isOpen, onClose }: ProfileOverlayProps) {
  const { styles, theme } = useThemeStyles();
  const [mode, setMode] = useState<Mode>("intro");

  const handleClose = () => {
    setMode("intro");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
        >
          {/* BACKGROUND: WorldMap a pantalla completa */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <WorldMap
              dots={[
                {
                  start: { lat: 64.2008, lng: -149.4937 },
                  end: { lat: 34.0522, lng: -118.2437 },
                },
                {
                  start: { lat: 64.2008, lng: -149.4937 },
                  end: { lat: -15.7975, lng: -47.8919 },
                },
                {
                  start: { lat: -15.7975, lng: -47.8919 },
                  end: { lat: 38.7223, lng: -9.1393 },
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 },
                  end: { lat: 28.6139, lng: 77.209 },
                },
                {
                  start: { lat: 28.6139, lng: 77.209 },
                  end: { lat: 43.1332, lng: 131.9113 },
                },
                {
                  start: { lat: 28.6139, lng: 77.209 },
                  end: { lat: -1.2921, lng: 36.8219 },
                },
              ]}
            />

            {/* Capa de blur + tinte sobre el mapa */}
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(43, 52, 56, 0.05)" // fondo.primary dark con alpha
                    : "rgba(234, 230, 223, 0.05)", // fondo.primary light con alpha
              }}
            />
          </div>

          {/* Contenido principal */}
          <div className="flex h-full w-full flex-col px-4 py-4 sm:px-8 sm:py-8">
            {/* Línea superior con flecha */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-full p-2 shadow-sm transition-all hover:translate-y-[1px] hover:shadow-md"
                style={{
                  backgroundColor: styles.background.secondary,
                  color: styles.text.body,
                }}
              >
                <ArrowLeftIcon size={18} />
              </button>
            </div>

            {/* CONTENIDO SEGÚN MODO */}
            {mode === "intro" && (
              <div className="flex flex-1 flex-col items-center justify-center">
                {/* Título + subtítulo */}
                <div className="mb-6 max-w-2xl text-center">
                  <h2
                    className="mb-3 text-2xl font-semibold sm:text-3xl"
                    style={{ color: styles.text.body }}
                  >
                    Entra en tu espacio personal
                  </h2>
                  <p
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: styles.text.muted }}
                  >
                    Guarda tus post favoritos para coger ideas, seguir nuestras
                    historias y descubrir el mundo.
                  </p>
                </div>

                {/* Botones Login / Signup */}
                <div className="mt-2 w-full max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:translate-y-[1px] hover:shadow-lg"
                      style={{
                        backgroundColor: styles.brand.primary,
                        color: styles.text.inverse,
                      }}
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all hover:translate-y-[1px]"
                      style={{
                        backgroundColor: styles.background.secondary,
                        color: styles.text.body,
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex flex-1 flex-col items-center justify-center">
                <div
                  className="w-full max-w-md rounded-3xl px-6 py-6 shadow-lg"
                  style={{ backgroundColor: styles.background.secondary }}
                >
                  <h2
                    className="mb-4 text-xl font-semibold text-center sm:text-2xl"
                    style={{ color: styles.text.body }}
                  >
                    Inicia sesión
                  </h2>
                  <form className="space-y-4 text-left">
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium uppercase tracking-wide"
                        style={{ color: styles.text.muted }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: styles.background.primary,
                          color: styles.text.body,
                          boxShadow:
                            "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium uppercase tracking-wide"
                        style={{ color: styles.text.muted }}
                      >
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: styles.background.primary,
                          color: styles.text.body,
                          boxShadow:
                            "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:translate-y-[1px] hover:shadow-lg"
                      style={{
                        backgroundColor: styles.brand.primary,
                        color: styles.text.inverse,
                      }}
                    >
                      Entrar
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="mt-4 w-full text-center text-xs font-medium underline"
                    style={{ color: styles.text.muted }}
                  >
                    ¿No tienes cuenta? Crear una
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex flex-1 flex-col items-center justify-center">
                <div
                  className="w-full max-w-md rounded-3xl px-6 py-6 shadow-lg"
                  style={{ backgroundColor: styles.background.secondary }}
                >
                  <h2
                    className="mb-4 text-xl font-semibold text-center sm:text-2xl"
                    style={{ color: styles.text.body }}
                  >
                    Crea tu cuenta
                  </h2>
                  <form className="space-y-4 text-left">
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium uppercase tracking-wide"
                        style={{ color: styles.text.muted }}
                      >
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: styles.background.primary,
                          color: styles.text.body,
                          boxShadow:
                            "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium uppercase tracking-wide"
                        style={{ color: styles.text.muted }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: styles.background.primary,
                          color: styles.text.body,
                          boxShadow:
                            "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium uppercase tracking-wide"
                        style={{ color: styles.text.muted }}
                      >
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: styles.background.primary,
                          color: styles.text.body,
                          boxShadow:
                            "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:translate-y-[1px] hover:shadow-lg"
                      style={{
                        backgroundColor: styles.brand.primary,
                        color: styles.text.inverse,
                      }}
                    >
                      Crear cuenta
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="mt-4 w-full text-center text-xs font-medium underline"
                    style={{ color: styles.text.muted }}
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
