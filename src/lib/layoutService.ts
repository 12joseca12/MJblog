import { basePageLayoutConfig } from "@/config/pageLayout";
import layoutStateJson from "@/config/pageLayoutState.json";
import type { PageKey, BlockKey } from "@/types/types";

// Tipo del JSON de estado (booleans)
type LayoutState = {
  [P in PageKey]?: Partial<Record<BlockKey, boolean>>;
};

const layoutState = layoutStateJson as LayoutState;

export function getBlocksForPage(page: PageKey): BlockKey[] {
  const baseBlocks = basePageLayoutConfig[page];
  const pageState = layoutState[page];

  return baseBlocks.filter((block) => {
    const isEnabled = pageState?.[block];
    return isEnabled !== false;
  });
}
