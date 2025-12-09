import { useState } from "react";
import { literals } from "@/literals";
import { useThemeStyles } from "@/app/theme/ThemeProvider";

export function TravelHelpWidget() {
  const [showAgentOptions, setShowAgentOptions] = useState(false);
  const widgetLiterals = literals.userArea.travelWidget;
  const { styles } = useThemeStyles();

  return (
    <div className="w-full flex justify-center mt-3 mb-1">
      <div
        className="w-full max-w-xs sm:max-w-sm rounded-2xl px-4 py-3 shadow-md text-center"
        style={{ backgroundColor: styles.background.primary }}
      >
        <p className="text-xs sm:text-sm font-semibold mb-3">
          {widgetLiterals.title}
        </p>

        <div className="flex flex-col gap-2">
          {/* 1) Agendar llamada */}
          <button
            type="button"
            className="w-full rounded-full px-3 py-2 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition"
          >
            {widgetLiterals.scheduleCall}
          </button>

          {/* 2) Contratar un plan */}
          <button
            type="button"
            className="w-full rounded-full px-3 py-2 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition"
            onClick={() => {
              window.location.href = "/servicios";
            }}
          >
            {widgetLiterals.hirePlan}
          </button>

          {/* 3) Solo estoy preguntando */}
          <button
            type="button"
            className="w-full rounded-full px-3 py-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition"
          >
            {widgetLiterals.justAsking}
          </button>

          {/* 4) Hablar con un agente */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="w-full rounded-full px-3 py-2 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition flex items-center justify-center gap-1"
              onClick={() => setShowAgentOptions((v) => !v)}
            >
              {widgetLiterals.speakToAgent}
              <span className="text-[10px]">
                {showAgentOptions ? "▲" : "▼"}
              </span>
            </button>

            {showAgentOptions && (
              <div className="mt-1 flex flex-col gap-1 text-[11px] sm:text-xs text-left">
                <button
                  type="button"
                  className="w-full rounded-full px-3 py-1 shadow-sm hover:shadow-md transition bg-white/80"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  className="w-full rounded-full px-3 py-1 shadow-sm hover:shadow-md transition bg-white/80"
                >
                  Microsoft Teams
                </button>
                <button
                  type="button"
                  className="w-full rounded-full px-3 py-1 shadow-sm hover:shadow-md transition bg-white/80"
                >
                  Google Meet
                </button>
                <button
                  type="button"
                  className="w-full rounded-full px-3 py-1 shadow-sm hover:shadow-md transition bg-white/80"
                >
                  Zoom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
