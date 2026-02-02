import { motion } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";
import { literals } from "@/literals";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/app/theme/ThemeProvider";

interface CreateCardProps {
    onClick: () => void;
    className?: string;
}

export const CreateCard = ({ onClick, className }: CreateCardProps) => {
    const { styles, theme } = useThemeStyles();
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "relative flex h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border transition-colors",
                className
            )}
            style={{
                backgroundColor: isDark
                    ? "rgba(43, 52, 56, 0.5)" // Dark mode blueish/base transparent
                    : "rgba(217, 143, 104, 0.1)", // Light mode brand tint transparent
                borderColor: styles.brand.primary,
            }}
        >
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                    backgroundColor: styles.brand.primary,
                    color: styles.text.inverse,
                }}
            >
                <IconPlus size={32} />
            </div>
            <h3
                className="mt-4 text-xl font-bold"
                style={{ color: styles.brand.primary }}
            >
                {literals.blogCreation.cardTitle}
            </h3>
        </motion.div>
    );
};
