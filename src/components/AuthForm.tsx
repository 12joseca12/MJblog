"use client";

import { useState } from "react";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { literals } from "@/literals";
import {
  loginWithEmail,
  signUpWithEmail,
} from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/firebaseHelper";

export function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const { styles, theme } = useThemeStyles();
  const isDark = theme === "dark";
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
      onSuccess();
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-xl font-semibold mb-1" style={{ color: styles.text.body }}>
        {isLogin ? literals.auth.loginTitle : literals.auth.signupTitle}
      </h2>
      <p className="text-xs mb-6" style={{ color: styles.text.muted }}>
        {literals.auth.introSubtitle}
      </p>

      <form onSubmit={handleSubmit} className="flex-col flex gap-3">
        {!isLogin && (
          <input
            type="text"
            placeholder={literals.auth.nameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm border"
            required
          />
        )}
        <input
          type="email"
          placeholder={literals.auth.emailLabel}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm border"
          required
        />
        <input
          type="password"
          placeholder={literals.auth.passwordLabel}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm border"
          required
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full py-2 text-sm font-semibold shadow-md"
          style={{
            backgroundColor: styles.brand.primary,
            color: styles.text.inverse,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? literals.common.loading : isLogin ? literals.auth.loginButton : literals.auth.signupButton}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-xs underline hover:opacity-80"
          style={{ color: styles.text.body }}
        >
          {isLogin ? literals.auth.noAccountCta : literals.auth.haveAccountCta}
        </button>
      </div>
    </div>
  );
}
