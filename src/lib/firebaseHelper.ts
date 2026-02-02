import { literals } from "@/literals";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import type { PostModel, ItineraryModel } from "@/types";

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code = (error as any)?.code as string | undefined;

  switch (code) {
    case "auth/email-already-in-use":
      return literals.firebaseErrors.emailAlreadyInUse;
    case "auth/invalid-email":
      return literals.firebaseErrors.invalidEmail;
    case "auth/user-not-found":
    case "auth/wrong-password":
      return literals.firebaseErrors.wrongPassword;
    case "auth/weak-password":
      return literals.firebaseErrors.weakPassword;
    default:
      return literals.firebaseErrors.default;
  }
}

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage (e.g., "blogs/my-post/image.png")
 * @returns The download URL of the uploaded file
 */
export async function uploadFileToStorage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Creates a new blog post in Firestore
 * @param post The post data (without ID)
 * @returns The ID of the created document
 */
export async function createBlogPost(post: Omit<PostModel, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "blogs"), {
    ...post,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetches all blog posts from Firestore
 * @returns An array of PostModel
 */
export async function getBlogPosts(): Promise<PostModel[]> {
  const querySnapshot = await getDocs(collection(db, "blogs"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Ensure date is a string if it comes as Timestamp, though our type says string (ISO)
      // If we saved it as ISO string in createBlogPost, it returns as string.
      // If we saved it as Timestamp, we might need conversion.
      // For now assume standard fields match.
    } as PostModel;
  });
}

/**
 * Deletes a blog post by ID
 * @param id The ID of the post to delete
 */
export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

/**
 * Updates an existing blog post
 * @param id The ID of the post to update
 * @param post Partial post data to update
 */
export async function updateBlogPost(id: string, post: Partial<PostModel>): Promise<void> {
  const docRef = doc(db, "blogs", id);
  await setDoc(docRef, post, { merge: true });
}

/**
 * Creates a new itinerary in Firestore
 * @param itinerary The itinerary data (without ID)
 * @returns The ID of the created document
 */
export async function createItinerary(itinerary: Omit<ItineraryModel, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "itineraries"), {
    ...itinerary,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetches all itineraries from Firestore
 * @returns An array of ItineraryModel
 */
export async function getItineraries(): Promise<ItineraryModel[]> {
  const querySnapshot = await getDocs(collection(db, "itineraries"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as ItineraryModel;
  });
}

/**
 * Deletes an itinerary by ID
 * @param id The ID of the itinerary to delete
 */
export async function deleteItinerary(id: string): Promise<void> {
  await deleteDoc(doc(db, "itineraries", id));
}

/**
 * Updates an existing itinerary
 * @param id The ID of the itinerary to update
 * @param itinerary Partial itinerary data to update
 */
export async function updateItinerary(id: string, itinerary: Partial<ItineraryModel>): Promise<void> {
  const docRef = doc(db, "itineraries", id);
  await setDoc(docRef, itinerary, { merge: true });
}

// --- Featured Items ---

const BLOGS_DESTACADOS = "blogsDestacados";
const ITINERARIOS_DESTACADOS = "itinerariosDestacados";

export async function getFeaturedBlogIds(): Promise<string[]> {
  const querySnapshot = await getDocs(collection(db, BLOGS_DESTACADOS));
  return querySnapshot.docs.map(doc => doc.id);
}

export async function toggleFeaturedBlog(id: string, isFeatured: boolean): Promise<void> {
  const docRef = doc(db, BLOGS_DESTACADOS, id);
  if (isFeatured) {
    // If currently featured, remove it
    await deleteDoc(docRef);
  } else {
    // If not featured, add it
    // We only persist the ID as document ID, but we can store true or timestamp
    await setDoc(docRef, { featuredAt: serverTimestamp() });
  }
}

export async function getFeaturedItineraryIds(): Promise<string[]> {
  const querySnapshot = await getDocs(collection(db, ITINERARIOS_DESTACADOS));
  return querySnapshot.docs.map(doc => doc.id);
}

export async function toggleFeaturedItinerary(id: string, isFeatured: boolean): Promise<void> {
  const docRef = doc(db, ITINERARIOS_DESTACADOS, id);
  if (isFeatured) {
    await deleteDoc(docRef);
  } else {
    await setDoc(docRef, { featuredAt: serverTimestamp() });
  }
}

// --- Layout Management ---

const LAYOUTS_COLLECTION = "layouts";

export async function getPageLayout(page: string): Promise<string[] | null> {
  const docRef = doc(db, LAYOUTS_COLLECTION, page);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().blocks as string[];
  }
  return null;
}

export async function savePageLayout(page: string, blocks: string[]): Promise<void> {
  const docRef = doc(db, LAYOUTS_COLLECTION, page);
  await setDoc(docRef, { blocks, updatedAt: serverTimestamp() });
}

// --- Theme Management ---

const THEME_COLLECTION = "theme";
const SETTINGS_DOC = "settings";

export async function getThemeSettings(): Promise<Record<string, any> | null> {
  const docRef = doc(db, THEME_COLLECTION, SETTINGS_DOC);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function saveThemeSettings(settings: Record<string, any>): Promise<void> {
  const docRef = doc(db, THEME_COLLECTION, SETTINGS_DOC);
  await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() });
}

