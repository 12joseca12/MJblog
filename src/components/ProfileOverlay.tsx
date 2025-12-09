"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { ArrowLeftIcon } from "@/icons";
import { getLiteral } from "@/literals";
import {
  loginWithEmail,
  signUpWithEmail,
} from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/firebaseHelper";
import type { User } from "firebase/auth";
import { UserArea } from "@/components/UserArea";

type ProfileOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
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

export function ProfileOverlay({
  isOpen,
  onClose,
  currentUser,
}: ProfileOverlayProps) {
  const { styles, theme } = useThemeStyles();
  const isDark = theme === "dark";

  const [mode, setMode] = useState<Mode>("intro");

  // estados login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // estados signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRepeat, setSignupRepeat] = useState("");
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const handleClose = () => {
    setMode("intro");
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupRepeat("");
    setAcceptPolicies(false);
    setLoginError(null);
    setSignupError(null);
    setIsLoginLoading(false);
    setIsSignupLoading(false);
    onClose();
  };

  // literales
  const introTitle = getLiteral("auth", "introTitle");
  const introSubtitle = getLiteral("auth", "introSubtitle");
  const loginTitle = getLiteral("auth", "loginTitle");
  const signupTitle = getLiteral("auth", "signupTitle");
  const emailLabel = getLiteral("auth", "emailLabel");
  const passwordLabel = getLiteral("auth", "passwordLabel");
  const repeatPasswordLabel = getLiteral("auth", "repeatPasswordLabel");
  const nameLabel = getLiteral("auth", "nameLabel");
  const acceptPoliciesLabel = getLiteral("auth", "acceptPoliciesLabel");
  const loginButtonText = getLiteral("auth", "loginButton");
  const signupButtonText = getLiteral("auth", "signupButton");
  const noAccountCta = getLiteral("auth", "noAccountCta");
  const haveAccountCta = getLiteral("auth", "haveAccountCta");

  const canSubmitSignup =
    signupName.trim().length > 0 &&
    signupEmail.trim().length > 0 &&
    signupPassword.trim().length >= 6 &&
    signupPassword === signupRepeat &&
    acceptPolicies;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || isLoginLoading) return;

    setLoginError(null);
    setIsLoginLoading(true);

    try {
      await loginWithEmail(loginEmail.trim(), loginPassword);
      handleClose();
    } catch (err) {
      setLoginError(getFirebaseAuthErrorMessage(err));
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitSignup || isSignupLoading) return;

    setSignupError(null);
    setIsSignupLoading(true);

    try {
      await signUpWithEmail(
        signupName.trim(),
        signupEmail.trim(),
        signupPassword
      );
      handleClose();
    } catch (err) {
      setSignupError(getFirebaseAuthErrorMessage(err));
    } finally {
      setIsSignupLoading(false);
    }
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
          {/* BACKGROUND */}
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
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                backgroundColor: isDark
                  ? "rgba(43, 52, 56, 0.05)"
                  : "rgba(234, 230, 223, 0.05)",
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

            {/* Si HAY usuario: mostrar UserArea y salir */}
            {currentUser ? (
              <UserArea onClose={handleClose} currentUser={currentUser} />
            ) : (
              <>
                {/* INTRO */}
                {mode === "intro" && (
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="mb-6 max-w-2xl text-center">
                      <h2
                        className="mb-3 text-2xl font-semibold sm:text-3xl"
                        style={{ color: styles.text.body }}
                      >
                        {introTitle}
                      </h2>
                      <p
                        className="text-sm leading-relaxed sm:text-base"
                        style={{ color: styles.text.muted }}
                      >
                        {introSubtitle}
                      </p>
                    </div>

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

                {/* LOGIN */}
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
                        {loginTitle}
                      </h2>

                      {loginError && (
                        <p className="mb-3 text-xs font-medium text-red-500">
                          {loginError}
                        </p>
                      )}

                      <form
                        className="space-y-4 text-left"
                        onSubmit={handleLoginSubmit}
                      >
                        <div>
                          <label
                            className="mb-1 block text-xs font-medium uppercase tracking-wide"
                            style={{ color: styles.text.muted }}
                          >
                            {emailLabel}
                          </label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
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
                            {passwordLabel}
                          </label>
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
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
                          disabled={
                            !loginEmail || !loginPassword || isLoginLoading
                          }
                          className={`mt-2 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all ${!loginEmail || !loginPassword || isLoginLoading
                            ? "opacity-80 cursor-not-allowed"
                            : "hover:translate-y-[1px] hover:shadow-lg"
                            }`}
                          style={{
                            backgroundColor: styles.brand.primary,
                            color: styles.text.inverse,
                          }}
                        >
                          {isLoginLoading ? "Entrando..." : loginButtonText}
                        </button>
                      </form>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginError(null);
                          setMode("signup");
                        }}
                        className="mt-4 w-full text-center text-xs font-medium underline"
                        style={{ color: styles.text.muted }}
                      >
                        {noAccountCta}
                      </button>
                    </div>
                  </div>
                )}

                {/* SIGNUP */}
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
                        {signupTitle}
                      </h2>

                      <div className="space-y-1 mb-2 text-red-500 text-xs font-medium">
                        {signupPassword.length > 0 &&
                          signupPassword.length < 6 && (
                            <p>La contraseña debe tener al menos 6 caracteres.</p>
                          )}

                        {signupRepeat.length > 0 &&
                          signupPassword !== signupRepeat && (
                            <p>Las contraseñas no coinciden.</p>
                          )}

                        {!acceptPolicies && (
                          <p>Debes aceptar las políticas para continuar.</p>
                        )}
                      </div>

                      {signupError && (
                        <p className="mb-3 text-xs font-medium text-red-500">
                          {signupError}
                        </p>
                      )}

                      <form
                        className="space-y-4 text-left"
                        onSubmit={handleSignupSubmit}
                      >
                        <div>
                          <label
                            className="mb-1 block text-xs font-medium uppercase tracking-wide"
                            style={{ color: styles.text.muted }}
                          >
                            {nameLabel}
                          </label>
                          <input
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
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
                            {emailLabel}
                          </label>
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
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
                            {passwordLabel}
                          </label>
                          <input
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
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
                            {repeatPasswordLabel}
                          </label>
                          <input
                            type="password"
                            value={signupRepeat}
                            onChange={(e) => setSignupRepeat(e.target.value)}
                            className="w-full rounded-2xl px-3 py-2 text-sm outline-none"
                            style={{
                              backgroundColor: styles.background.primary,
                              color: styles.text.body,
                              boxShadow:
                                "inset 2px 2px 6px rgba(43,52,56,0.18), inset -2px -2px 6px rgba(221,233,240,0.9)",
                            }}
                          />
                        </div>

                        <label className="mt-1 flex items-start gap-2 text-xs leading-relaxed">
                          <input
                            type="checkbox"
                            checked={acceptPolicies}
                            onChange={(e) =>
                              setAcceptPolicies(e.target.checked)
                            }
                            className="mt-0.5 h-4 w-4 cursor-pointer rounded border border-gray-400 accent-emerald-500"
                          />
                          <span style={{ color: styles.text.muted }}>
                            {acceptPoliciesLabel}
                          </span>
                        </label>

                        <motion.button
                          type="submit"
                          disabled={!canSubmitSignup || isSignupLoading}
                          animate={{
                            backgroundColor:
                              canSubmitSignup && !isSignupLoading
                                ? styles.brand.primary
                                : isDark
                                  ? "rgba(43,52,56,0.5)"
                                  : "rgba(234,230,223,0.5)",
                            scale:
                              canSubmitSignup && !isSignupLoading ? 1 : 0.98,
                            opacity:
                              canSubmitSignup && !isSignupLoading ? 1 : 0.75,
                          }}
                          transition={{ duration: 0.22 }}
                          className={`mt-3 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-md ${canSubmitSignup && !isSignupLoading
                            ? "hover:translate-y-[1px] hover:shadow-lg"
                            : "cursor-not-allowed"
                            }`}
                          style={{
                            color: styles.text.inverse,
                            border: `1px solid ${styles.brand.primary}`,
                          }}
                        >
                          {isSignupLoading
                            ? "Creando cuenta..."
                            : signupButtonText}
                        </motion.button>
                      </form>

                      <button
                        type="button"
                        onClick={() => {
                          setSignupError(null);
                          setMode("login");
                        }}
                        className="mt-4 w-full text-center text-xs font-medium underline"
                        style={{ color: styles.text.muted }}
                      >
                        {haveAccountCta}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
