import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { literals } from "@/literals";
import type { RTChatMessage, User } from "@/types";
import { TravelHelpWidget } from "./TravelHelpWidget";

const TRAVEL_WIDGET_MARKER = "[[TRAVEL_HELP_WIDGET]]";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  messages: RTChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isDark: boolean;
}

export function ChatInterface({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isDark,
}: ChatInterfaceProps) {
  const { styles } = useThemeStyles();
  const [chatInput, setChatInput] = useState("");

  // Scroll logic
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [chatInput]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    if (scrollHeight <= clientHeight) {
      setScrollProgress(100);
    } else {
      const totalScroll = scrollHeight - clientHeight;
      const progress = (scrollTop / totalScroll) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    // Optimistic clear
    setChatInput("");

    // Reset height manually
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[24rem] md:w-[26rem]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div
            className="flex h-full flex-col relative"
            style={{ backgroundColor: styles.background.primary }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: styles.text.body }}
                >
                  {literals.userArea.chatHeader}
                </h3>
                <p
                  className="text-[11px]"
                  style={{ color: styles.text.muted }}
                >
                  {literals.userArea.chatSubHeader}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: isDark
                    ? "rgba(221,233,240,0.06)"
                    : "rgba(234,230,223,0.9)",
                  color: styles.text.body,
                }}
              >
                ✕
              </button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-y-auto px-4 py-4 text-sm no-scrollbar space-y-2 pb-4"
                style={{ scrollBehavior: "smooth" }}
              >
                {messages.map((m) => {
                  const hasTravelWidget =
                    m.from === "system" &&
                    m.text?.includes(TRAVEL_WIDGET_MARKER);

                  const cleanText = hasTravelWidget
                    ? m.text.replace(TRAVEL_WIDGET_MARKER, "").trim()
                    : m.text;

                  return (
                    <div key={m.id} className="space-y-1">
                      {/* Burbuja normal, si hay texto */}
                      {cleanText && (
                        <div
                          className={`flex ${m.from === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                        >
                          <div
                            className="max-w-[80%] rounded-2xl px-3 py-2 text-xs sm:text-sm whitespace-pre-wrap"
                            style={{
                              backgroundColor:
                                m.from === "user"
                                  ? styles.brand.primary
                                  : isDark
                                    ? "rgba(221,233,240,0.06)"
                                    : "rgba(234,230,223,0.95)",
                              color:
                                m.from === "user"
                                  ? styles.text.inverse
                                  : styles.text.body,
                            }}
                          >
                            {cleanText}
                          </div>
                        </div>
                      )}

                      {/* Widget de ayuda de viajes, centrado */}
                      {hasTravelWidget && <TravelHelpWidget />}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Custom Plane Scrollbar */}
              {messages.length > 5 && (
                <div className="absolute right-1 top-4 bottom-4 w-1 bg-transparent pointer-events-none">
                  <div
                    className="absolute right-0 w-4 h-4 flex items-center justify-center transition-all duration-100 ease-out"
                    style={{
                      top: `${scrollProgress}%`,
                      transform: "translateY(-50%) rotate(-225deg)",
                    }}
                  >
                    ✈️
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t px-3 py-3 flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={literals.userArea.chatPlaceholder}
                rows={1}
                className="flex-1 rounded-2xl px-3 py-2.5 text-xs sm:text-sm outline-none resize-none max-h-[120px] overflow-y-auto custom-scrollbar"
                style={{
                  backgroundColor: styles.background.secondary,
                  color: styles.text.body,
                }}
              />
              <button
                type="submit"
                className="h-[38px] w-[38px] flex items-center justify-center rounded-full shadow-sm transition-all hover:translate-y-[1px] hover:shadow-md shrink-0"
                style={{
                  backgroundColor: styles.brand.primary,
                  color: styles.text.inverse,
                }}
              >
                <span className="text-xl leading-none mb-1">➤</span>
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
