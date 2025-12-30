/** -------------------------------------------
 *  PAGE KEYS (rutas de la app)
 ------------------------------------------- */
export type PageKey = "home" | "blog" | "itinerary" | "services" | "admin";

/** -------------------------------------------
 *  BLOCK KEYS (bloques disponibles)
 ------------------------------------------- */
export type BlockKey =
  | "hero"
  | "featured"
  | "postsList"
  | "travelsList"
  | "travelsSummary"
  | "spanServices";

/** -------------------------------------------
 *  MODELOS DE DATOS (siempre aquí)
 ------------------------------------------- */

export interface PostModel {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  date: string; // ISO string
  tags: string[];
  authors: string[];
  content: string;
}

export interface TravelModel {
  id: string;
  title: string;
  country: string;
  date: string;
  coverImage: string;
  timeline: Array<{
    day: number;
    title: string;
    description: string;
  }>;
}

/** -------------------------------------------
 * ESTILOS Y TEMAS
 ------------------------------------------- */

export type Theme = "light" | "dark";

export type ThemeColors = {
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    body: string;
    muted: string;
    inverse: string;
  };
  brand: {
    primary: string;
    primaryDark: string;
  };
};

export type StylesJson = {
  theme: Record<Theme, ThemeColors>;
  radius: {
    radius0: string;
    radius8: string;
    radius16: string;
    radius100: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

/** -------------------------------------------
 *  LITERALES
 ------------------------------------------- */

export type LiteralsJson = {
  app: {
    title: string;
    subtitle: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryExplore: string;
    heroSecondarySteps: string;
    featuredSectionTitle: string;
    heroImages: string[];
    spanServicesTitle: string;
    spanServicesSubtitle: string;
    spanServicesCta: string;
  };
  posts: {
    pageTitle: string;
    emptyMessage: string;
  };
  travels: {
    pageTitle: string;
    emptyMessage: string;
  };
  common: {
    loading: string;
    error: string;
    back: string;
    readMore: string;
  };
  auth: {
    introTitle: string;
    introSubtitle: string;
    loginTitle: string;
    signupTitle: string;
    emailLabel: string;
    passwordLabel: string;
    repeatPasswordLabel: string;
    nameLabel: string;
    acceptPoliciesLabel: string;
    loginButton: string;
    signupButton: string;
    noAccountCta: string;
    haveAccountCta: string;
  };
  userArea: {
    title: string;
    actionsTitle: string;
    logoutBtn: string;
    deleteAccountBtn: string;
    supportTitle: string;
    contactBtn: string;
    chatCtaTitle: string;
    chatCtaText: string;
    chatCtaBtn: string;
    travelCtaTitle: string;
    travelCtaText: string;
    travelCtaBtn: string;
    modalLogoutTitle: string;
    modalLogoutText: string;
    modalDeleteTitle: string;
    modalDeleteText: string;
    cancelBtn: string;
    confirmBtn: string;
    processingBtn: string;
    chatHeader: string;
    chatSubHeader: string;
    chatPlaceholder: string;
    sendBtn: string;
    travelWidget: {
      title: string;
      scheduleCall: string;
      hirePlan: string;
      justAsking: string;
      speakToAgent: string;
    };
  };
  firebaseErrors: {
    emailAlreadyInUse: string;
    invalidEmail: string;
    userNotFound: string;
    wrongPassword: string;
    weakPassword: string;
    default: string;
  };
};

export type RTChatMessage = {
  id: string;
  text: string;
  from: "user" | "system";
  createdAt: number | null;
  read?: boolean;
};

export type ConfirmType = "logout" | "delete" | null;

import type { User } from "firebase/auth";
export type { User };

export type UserAreaProps = {
  onClose: () => void;
  currentUser: User;
  defaultChatOpen?: boolean;
};
