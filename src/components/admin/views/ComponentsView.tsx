import { useState, useEffect } from "react";
import { PagePreview } from "../visualization/PagePreview";
import { getBlocksForPage } from "@/lib/layoutService";
import { getPageLayout, savePageLayout } from "@/lib/firebaseHelper";
import { BLOCK_REGISTRY } from "@/features/PageBlockRenderer";
import type { PageKey, BlockKey } from "@/types/types";
import { IconPlus, IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const PAGES: PageKey[] = ["home", "blog", "itinerary", "services", "admin"];

export const ComponentsView = () => {
    const [selectedPage, setSelectedPage] = useState<PageKey>("home");
    const [activeBlocks, setActiveBlocks] = useState<BlockKey[]>([]);
    const [availableBlocks, setAvailableBlocks] = useState<BlockKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadLayout = async () => {
            setIsLoading(true);
            try {
                // 1. Get persisted layout or default
                const persisted = await getPageLayout(selectedPage);
                const currentBlocks = persisted
                    ? (persisted as BlockKey[])
                    : getBlocksForPage(selectedPage);

                setActiveBlocks(currentBlocks);

                // 2. Determine available (unused) blocks
                const allPossibleBlocks = Object.keys(BLOCK_REGISTRY) as BlockKey[];
                const unused = allPossibleBlocks.filter(b => !currentBlocks.includes(b));
                setAvailableBlocks(unused);

            } catch (error) {
                console.error("Failed to load layout", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadLayout();
    }, [selectedPage]);

    const handleReorder = (newOrder: BlockKey[]) => {
        setActiveBlocks(newOrder);
        // Auto-save logic could go here, or manual save
    };

    const handleRemove = (key: string) => {
        setActiveBlocks(prev => prev.filter(b => b !== key));
        setAvailableBlocks(prev => [...prev, key as BlockKey]);
    };

    const handleAdd = (key: BlockKey) => {
        setAvailableBlocks(prev => prev.filter(b => b !== key));
        setActiveBlocks(prev => [...prev, key]);
    };

    const handleSave = async () => {
        try {
            await savePageLayout(selectedPage, activeBlocks);
            alert("Layout saved successfully!");
        } catch (error) {
            console.error("Error saving layout:", error);
            alert("Failed to save layout.");
        }
    };

    return (
        <div className="flex h-full w-full flex-col">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="flex gap-2">
                    {PAGES.map(page => (
                        <button
                            key={page}
                            onClick={() => setSelectedPage(page)}
                            className={cn(
                                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                selectedPage === page
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                            )}
                        >
                            {page.charAt(0).toUpperCase() + page.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSave}
                    className="rounded-lg bg-green-500 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
                >
                    Save Layout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Preview Area */}
                <PagePreview
                    page={selectedPage}
                    activeBlocks={activeBlocks}
                    onReorder={handleReorder}
                    onRemove={handleRemove}
                />

                {/* Component Sidebar */}
                <div className="w-80 border-l bg-white p-6 dark:bg-neutral-900 dark:border-neutral-800">
                    <h3 className="mb-4 text-lg font-bold dark:text-white">Available Components</h3>
                    <div className="flex flex-col gap-3">
                        {availableBlocks.map(blockKey => (
                            <div
                                key={blockKey}
                                className="group flex items-center justify-between rounded-lg border p-3 hover:border-black dark:border-neutral-700 dark:hover:border-neutral-500 bg-neutral-50 dark:bg-black"
                            >
                                <span className="font-medium text-sm dark:text-white">{blockKey}</span>
                                <button
                                    onClick={() => handleAdd(blockKey)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-black hover:text-white dark:bg-neutral-800 dark:text-neutral-400"
                                >
                                    <IconPlus size={16} />
                                </button>
                            </div>
                        ))}
                        {availableBlocks.length === 0 && (
                            <p className="text-sm text-neutral-400 text-center py-4">All components used</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
