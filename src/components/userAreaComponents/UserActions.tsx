import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { literals } from "@/literals";
import type { ConfirmType } from "@/types";

interface UserActionsProps {
  onSetConfirmType: (type: ConfirmType) => void;
  onOpenChat: () => void;
}

export function UserActions({ onSetConfirmType, onOpenChat }: UserActionsProps) {
  const { styles, theme } = useThemeStyles();
  const isDark = theme === "dark";
  const terracotta = "#D98F68";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* 1. Actions Card */}
      <div
        className="rounded-3xl p-5 sm:p-6 shadow-sm"
        style={{
          backgroundColor: styles.background.secondary,
          border: `1px solid ${isDark ? "rgba(221,233,240,0.18)" : "rgba(43,52,56,0.08)"
            }`,
        }}
      >
        <h2
          className="mb-4 text-base sm:text-lg font-semibold"
          style={{ color: styles.text.body }}
        >
          {literals.userArea.actionsTitle}
        </h2>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onSetConfirmType("logout")}
            className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium shadow-sm transition-all hover:translate-y-[1px] hover:shadow-md"
            style={{
              backgroundColor: isDark
                ? "rgba(221,233,240,0.06)"
                : "rgba(234,230,223,0.9)",
              color: styles.text.body,
            }}
          >
            {literals.userArea.logoutBtn}
          </button>

          <button
            type="button"
            onClick={() => onSetConfirmType("delete")}
            className="text-xs sm:text-sm font-semibold"
            style={{ color: terracotta }}
          >
            {literals.userArea.deleteAccountBtn}
          </button>
        </div>

        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: styles.text.body }}
        >
          {literals.userArea.supportTitle}
        </h3>

        <button
          type="button"
          onClick={onOpenChat}
          className="w-full rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium shadow-inner"
          style={{
            backgroundColor: isDark
              ? "rgba(221,233,240,0.06)"
              : "rgba(234,230,223,0.95)",
            color: styles.text.body,
          }}
        >
          {literals.userArea.contactBtn}
        </button>
      </div>

      {/* 2. Chat CTA Card */}
      <div
        className="rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col items-center justify-between text-center gap-4"
        style={{
          backgroundColor: isDark
            ? "rgba(43,52,56,0.9)"
            : "rgba(221,233,240,0.9)",
          border: `1px solid ${isDark ? "rgba(221,233,240,0.2)" : "rgba(43,52,56,0.1)"
            }`,
        }}
      >
        <div className="space-y-2">
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: styles.text.body }}
          >
            {literals.userArea.chatCtaTitle}
          </h2>
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: styles.text.muted }}
          >
            {literals.userArea.chatCtaText}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenChat}
          className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:translate-y-[1px] hover:shadow-lg"
          style={{
            backgroundColor: styles.brand.primary,
            color: styles.text.inverse,
          }}
        >
          {literals.userArea.chatCtaBtn}
        </button>
      </div>

      {/* 3. Travel CTA Card */}
      <div
        className="rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4"
        style={{
          backgroundColor: isDark
            ? "rgba(67,112,86,0.16)"
            : "rgba(221,233,240,0.95)",
          border: `1px solid ${isDark ? "rgba(221,233,240,0.2)" : "rgba(43,52,56,0.08)"
            }`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: styles.brand.primary }}
          >
            <span className="text-base" style={{ color: styles.text.inverse }}>
              ✈️
            </span>
          </div>
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: styles.text.body }}
          >
            {literals.userArea.travelCtaTitle}
          </h2>
        </div>

        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: styles.text.muted }}
        >
          {literals.userArea.travelCtaText}
        </p>

        <button
          type="button"
          // This button currently does nothing in the original code, 
          // but we keep the structure. Maybe open chat too?
          // onClick={onOpenChat} 
          className="mt-1 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:translate-y-[1px] hover:shadow-lg"
          style={{
            backgroundColor: styles.brand.primary,
            color: styles.text.inverse,
          }}
        >
          {literals.userArea.travelCtaBtn}
        </button>
      </div>
    </div>
  );
}
