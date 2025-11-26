/** -------------------------------------------
 *  PAGE KEYS (rutas de la app)
 ------------------------------------------- */
export type PageKey = "home" | "posts" | "travels";

/** -------------------------------------------
 *  BLOCK KEYS (bloques disponibles)
 ------------------------------------------- */
export type BlockKey =
  | "hero"
  | "featured"
  | "postsList"
  | "travelsList"
  | "travelsSummary";

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
    featuredSectionTitle: string;
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
};