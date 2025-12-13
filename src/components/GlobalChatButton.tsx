"use client";

import { useState, useEffect } from "react";
import { subscribeToAuth } from "@/lib/firebase";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import type { User } from "@/types";
import { UserArea } from "./UserArea";
import { AnimatePresence, motion } from "framer-motion";
import { literals } from "@/literals";


import { getFirebaseAuthErrorMessage } from "@/lib/firebaseHelper";
import { AuthForm } from "./AuthForm";



export function GlobalChatButton() {
  const { styles } = useThemeStyles();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition hover:scale-105"
        style={{ backgroundColor: styles.brand.primary }}
      >
        <span className="text-2xl">💬</span>
      </button>

      <AnimatePresence>
        {isOpen && (
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
                onClick={() => setIsOpen(false)}
                className="rounded-full px-3 py-1 text-sm font-bold bg-black/5 hover:bg-black/10 transition"
              >
                ✕
              </button>
            </div>

            {currentUser ? (
              <div className="h-full">
                <UserArea
                  currentUser={currentUser}
                  onClose={() => setIsOpen(false)}
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
