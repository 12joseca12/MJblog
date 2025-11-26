import { PageBlocksRenderer } from "@/features/PageBlockRenderer"

export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-4">
      <PageBlocksRenderer page="home" />
    </main>
  );
}
