
import { getBlocksForPage } from "@/lib/layoutService";
import type { BlockKey, PageKey } from "@/types/types";

import { HeroBlock } from "@/components/HeroBlock";
import { FeaturedBlock } from "@/components/FeaturedBlock";
import { PostsListBlock } from "@/components/PostsListBlock";
import { TravelsListBlock } from "@/components/TravelListBlock";
import { TravelsSummaryBlock } from "@/components/TravelSummaryBlock";
import { SpanHomeServices } from "@/components/SpanHomeServices";

const BLOCK_REGISTRY: Record<BlockKey, React.ComponentType<any>> = {
  hero: HeroBlock,
  featured: FeaturedBlock,
  postsList: PostsListBlock,
  travelsList: TravelsListBlock,
  travelsSummary: TravelsSummaryBlock,
  spanServices: SpanHomeServices
};

export function PageBlocksRenderer({ page }: { page: PageKey }) {
  const blocks = getBlocksForPage(page);

  return (
    <>
      {blocks.map((blockKey) => {
        const Block = BLOCK_REGISTRY[blockKey];
        return <Block key={blockKey} />;
      })} 
    </>
  );
}