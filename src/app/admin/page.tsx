"use client";
import { PageBlocksRenderer } from "@/features/PageBlockRenderer";
import { useThemeStyles } from "@/app/theme/ThemeProvider";

export default function AdminPage() {
    const { styles } = useThemeStyles();

    return (
        <main
            className="min-h-screen w-full"
            style={{
                backgroundColor: styles.background.primary,
            }}
        >
            <PageBlocksRenderer page="admin" />
        </main>
    );
}