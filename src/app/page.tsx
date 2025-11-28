"use client";
import { PageBlocksRenderer } from "@/features/PageBlockRenderer";
import { useThemeStyles } from "@/app/theme/ThemeProvider";

export default function HomePage() {
  const { styles } = useThemeStyles();

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: styles.background.primary,
      }}
    >
      <PageBlocksRenderer page="home" />
    </main>
  );
}