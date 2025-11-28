import layoutStateJson from "@/config/pageLayoutState.json";
import type { PageKey, BlockKey } from "@/types/types";


type LayoutState = {
  [P in PageKey]?: Partial<Record<BlockKey, boolean>>;
};

const layoutState = layoutStateJson as LayoutState;

export function getBlocksForPage(page: PageKey): BlockKey[] {
  const pageConfig = layoutState[page];

  if (!pageConfig) {
    return [];
  }

  return (Object.entries(pageConfig) as [BlockKey, boolean][])
    .filter(([, enabled]) => enabled !== false)
    .map(([block]) => block);
}
