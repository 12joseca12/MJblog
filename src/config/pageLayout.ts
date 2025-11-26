import type { PageKey, BlockKey } from "@/types/types";

export const basePageLayoutConfig: Record<PageKey, BlockKey[]> = {
  home: ["hero", "featured"],
  posts: ["postsList"],
  travels: ["travelsList", "travelsSummary"],
};
