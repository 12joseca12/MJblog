import { PageBlocksRenderer } from "@/features/PageBlockRenderer";

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <PageBlocksRenderer page="posts" />
    </main>
  );
}
