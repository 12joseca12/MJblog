"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import {
  logoutUser,
  deleteCurrentUser,
  subscribeToUserChat,
  sendUserChatMessage,
  markSystemMessagesAsRead,
} from "@/lib/firebase";
import type { UserAreaProps, ConfirmType, RTChatMessage } from "@/types";
import { literals } from "@/literals";
import { UserActions } from "./userAreaComponents/UserActions";
import { ChatInterface } from "./userAreaComponents/ChatInterface";

export function UserArea({ onClose, currentUser, defaultChatOpen = false }: UserAreaProps) {
  const { styles, theme } = useThemeStyles();
  const isDark = theme === "dark";

  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(defaultChatOpen);
  const [messages, setMessages] = useState<RTChatMessage[]>([]);

  const terracotta = "#D98F68";

  // Subscribe to chat logic
  useEffect(() => {
    // We subscribe even if chat is not open? Original code: if (!isChatOpen) return;
    // But if we want unread counts or similar we might need it. 
    // The original code only subscribed when chat is open.
    if (!isChatOpen) return;

    const unsub = subscribeToUserChat(currentUser.uid, (msgs) => {
      setMessages(msgs);
    });

    markSystemMessagesAsRead(currentUser.uid).catch(console.error);

    return () => unsub();
  }, [isChatOpen, currentUser.uid]);

  const handleConfirm = async () => {
    if (!confirmType) return;
    setIsProcessing(true);
    try {
      if (confirmType === "logout") {
        await logoutUser();
      } else {
        await deleteCurrentUser();
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setConfirmType(null);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      await sendUserChatMessage(
        currentUser.uid,
        text,
        currentUser.email,
        currentUser.displayName
      );
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-6xl space-y-4">
        <h1
          className="text-xl sm:text-2xl font-semibold"
          style={{ color: styles.text.body }}
        >
          {literals.userArea.title}
        </h1>

        <UserActions
          onSetConfirmType={setConfirmType}
          onOpenChat={() => setIsChatOpen(true)}
        />
      </div>

      <AnimatePresence>
        {confirmType && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl p-5 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: styles.background.primary }}
            >
              <h3
                className="mb-2 text-base font-semibold"
                style={{ color: styles.text.body }}
              >
                {confirmType === "logout"
                  ? literals.userArea.modalLogoutTitle
                  : literals.userArea.modalDeleteTitle}
              </h3>
              <p
                className="mb-4 text-xs sm:text-sm"
                style={{ color: styles.text.muted }}
              >
                {confirmType === "logout"
                  ? literals.userArea.modalLogoutText
                  : literals.userArea.modalDeleteText}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setConfirmType(null)}
                  className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(221,233,240,0.06)"
                      : "rgba(234,230,223,0.9)",
                    color: styles.text.body,
                  }}
                >
                  {literals.userArea.cancelBtn}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirm}
                  className="rounded-full px-4 py-2 text-xs sm:text-sm font-semibold"
                  style={{
                    backgroundColor:
                      confirmType === "delete"
                        ? terracotta
                        : styles.brand.primary,
                    color: styles.text.inverse,
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing
                    ? literals.userArea.processingBtn
                    : literals.userArea.confirmBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isDark={isDark}
      />
    </div>
  );
}
