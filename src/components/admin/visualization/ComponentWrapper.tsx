import { motion, Reorder } from "framer-motion";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ComponentWrapperProps {
    blockKey: string;
    onRemove: (key: string) => void;
    children: React.ReactNode;
}

export const ComponentWrapper = ({ blockKey, onRemove, children }: ComponentWrapperProps) => {
    return (
        <Reorder.Item
            value={blockKey}
            id={blockKey}
            className="relative mb-4 rounded-lg border-2 border-blue-500/50 bg-white dark:bg-neutral-900 group"
        >
            <div className="absolute -left-3 -top-3 z-20 flex gap-2">
                <button
                    onClick={() => onRemove(blockKey)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                >
                    <IconX size={14} />
                </button>
            </div>

            <div className="absolute right-2 top-2 z-20 cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600">
                <IconGripVertical size={20} />
            </div>

            <div className="pointer-events-none p-4 opacity-50 grayscale transition-all group-hover:opacity-80 group-hover:grayscale-0">
                <div className="absolute inset-0 z-10" /> {/* Overlay to prevent interactions with previewed component */}
                {children}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-2">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold uppercase text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {blockKey}
                </span>
            </div>
        </Reorder.Item>
    );
};
