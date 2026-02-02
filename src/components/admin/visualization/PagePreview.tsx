import { Reorder } from "framer-motion";
import { ComponentWrapper } from "./ComponentWrapper";
import { BLOCK_REGISTRY } from "@/features/PageBlockRenderer";
import type { BlockKey } from "@/types/types";

interface PagePreviewProps {
    page: string;
    activeBlocks: BlockKey[];
    onReorder: (newOrder: BlockKey[]) => void;
    onRemove: (key: string) => void;
}

export const PagePreview = ({ page, activeBlocks, onReorder, onRemove }: PagePreviewProps) => {
    return (
        <div className="flex-1 overflow-y-auto bg-neutral-100 p-8 dark:bg-black/50">
            <div className="mx-auto max-w-5xl rounded-xl bg-white shadow-xl dark:bg-black min-h-[80vh] p-8 border border-neutral-200 dark:border-neutral-800">
                <Reorder.Group axis="y" values={activeBlocks} onReorder={onReorder}>
                    {activeBlocks.map((blockKey) => {
                        const BlockComponent = BLOCK_REGISTRY[blockKey];
                        if (!BlockComponent) return null;

                        return (
                            <ComponentWrapper key={blockKey} blockKey={blockKey} onRemove={onRemove}>
                                <BlockComponent />
                            </ComponentWrapper>
                        );
                    })}
                </Reorder.Group>

                {activeBlocks.length === 0 && (
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 dark:border-neutral-700">
                        <p>Drag components here to build your page</p>
                    </div>
                )}
            </div>
        </div>
    );
};
