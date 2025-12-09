import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  deleteUser,
  type UserCredential,
  type User,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
  serverTimestamp,
  push,
} from "firebase/database";
import type { RTChatMessage } from "@/types";
import { literals } from "@/literals";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }

  return cred;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// getFirebaseAuthErrorMessage moved to @/lib/firebaseHelper


export async function logoutUser() {
  await signOut(auth);
}

export async function deleteCurrentUser() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }
  await deleteUser(user);
}

export function subscribeToAuth(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, cb);
}

/**
 * Enviar mensaje de usuario:
 * 1) Lo guarda en RTDB
 * 2) Actualiza metadatos del chat
 * 3) Llama al webhook de n8n
 */
export async function sendUserChatMessage(
  userId: string,
  text: string,
  userEmail?: string | null,
  userName?: string | null
) {
  const trimmed = text.trim();
  if (!trimmed) return;

  // 1) Guardar el mensaje del usuario en RTDB
  const messagesRef = ref(rtdb, `chats/${userId}/messages`);
  await push(messagesRef, {
    text: trimmed,
    from: "user",
    messageType: "text",
    createdAt: Date.now(), // número para ordenarlo bien
    read: true,
  });

  // 2) Actualizar metadata del chat
  const chatMetaRef = ref(rtdb, `chats/${userId}`);
  await update(chatMetaRef, {
    lastUserActivityAt: serverTimestamp(),
    pendingBotReply: true,
  });

  // 3) Enviar al webhook de n8n (para que la IA responda y guarde respuesta)
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "NEXT_PUBLIC_N8N_WEBHOOK_URL is not set; skipping webhook request."
    );
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        text: trimmed,
        email: userEmail || "",
        name: userName || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending message to webhook:", error);
    throw error;
  }
}

/**
 * Escuchar mensajes del chat en tiempo real
 */
export function subscribeToUserChat(
  userId: string,
  cb: (messages: RTChatMessage[]) => void
): () => void {
  const messagesRef = ref(rtdb, `chats/${userId}/messages`);
  const q = query(messagesRef, orderByChild("createdAt"));

  const unsubscribe = onValue(q, (snapshot) => {
    const msgs: RTChatMessage[] = [];

    snapshot.forEach((child) => {
      const data = child.val() as any;
      msgs.push({
        id: child.key ?? "",
        text: data.text ?? "",
        from: (data.from ?? "system") as "user" | "system",
        createdAt:
          typeof data.createdAt === "number" ? data.createdAt : null,
        read: data.read ?? false,
      });
    });

    // Ordenar por timestamp
    msgs.sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return aTime - bTime;
    });

    cb(msgs);
  });

  return unsubscribe;
}

/**
 * Contar mensajes no leídos del sistema
 */
export function subscribeToUnreadSystemMessages(
  userId: string,
  cb: (count: number) => void
): () => void {
  const messagesRef = ref(rtdb, `chats/${userId}/messages`);
  const q = query(messagesRef, orderByChild("from"), equalTo("system"));

  const unsubscribe = onValue(q, (snapshot) => {
    let count = 0;
    snapshot.forEach((child) => {
      const data = child.val() as any;
      if (!data.read) count += 1;
    });
    cb(count);
  });

  return unsubscribe;
}

/**
 * Marcar mensajes del sistema como leídos
 */
export async function markSystemMessagesAsRead(userId: string) {
  const messagesRef = ref(rtdb, `chats/${userId}/messages`);
  const q = query(messagesRef, orderByChild("from"), equalTo("system"));

  onValue(
    q,
    (snapshot) => {
      const updates: Record<string, any> = {};

      snapshot.forEach((child) => {
        const data = child.val() as any;
        if (!data.read) {
          updates[`chats/${userId}/messages/${child.key}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        update(ref(rtdb), updates).catch((err) => {
          console.error("Error al marcar mensajes como leídos", err);
        });
      }
    },
    {
      onlyOnce: true,
    }
  );
}
