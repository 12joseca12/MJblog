import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconStar, IconStarFilled } from "@tabler/icons-react";
import { literals } from "@/literals";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import type { ItineraryModel } from "@/types";
import Image from "next/image";

interface ItineraryCardProps {
    itinerary: ItineraryModel;
    onEdit: (itinerary: ItineraryModel) => void;
    onDelete: (id: string) => void;
    isFeatured?: boolean;
    onToggleFeatured?: (id: string) => void;
    className?: string;
}

export const ItineraryCard = ({ itinerary, onEdit, onDelete, isFeatured, onToggleFeatured, className }: ItineraryCardProps) => {
    const { styles, theme } = useThemeStyles();
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "group relative flex h-80 w-full flex-col overflow-hidden rounded-2xl border transition-all",
                className
            )}
            style={{
                borderColor: isDark ? styles.background.secondary : styles.background.primary,
            }}
        >
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
                {itinerary.banner ? (
                    <Image
                        src={itinerary.banner}
                        alt={itinerary.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                        <span className="text-4xl">🗺️</span>
                    </div>
                )}
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end p-4">
                <h3 className="mb-4 text-xl font-bold text-white shadow-black drop-shadow-md line-clamp-2">
                    {itinerary.title}
                </h3>
                <p className="mb-4 text-xs font-medium text-white/80">
                    {itinerary.steps?.length || 0} pasos
                </p>

                <div className="flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(itinerary);
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
                            style={{ backgroundColor: styles.background.secondary }}
                        >
                            <IconEdit size={16} />
                            {literals.blogCreation.buttons.edit}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(itinerary.id);
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        >
                            <IconTrash size={16} />
                            {literals.blogCreation.buttons.delete}
                        </button>
                    </div>

                    {onToggleFeatured && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFeatured(itinerary.id);
                            }}
                            className={cn(
                                "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors border",
                                isFeatured
                                    ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                                    : "bg-black/30 text-white border-white/50 hover:bg-black/50"
                            )}
                        >
                            {isFeatured ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                            {!isFeatured && literals.blogCreation.buttons.feature}
                        </button>
                    )}

                </div>
            </div>
        </motion.div>
    );
};
