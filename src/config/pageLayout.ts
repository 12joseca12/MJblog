import type { PageKey, BlockKey } from "@/types/types";

export const basePageLayoutConfig: Record<PageKey, BlockKey[]> = {
  home: ["hero", "featured", "spanServices"],
  blog: ["postsList"],
  itinerary: ["travelsList", "travelsSummary"],
  services: ["featured"],
};
