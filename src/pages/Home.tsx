import { PageBlocksRenderer } from "@/features/PageBlockRenderer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <PageBlocksRenderer page="home" />
    </main>
  );
}