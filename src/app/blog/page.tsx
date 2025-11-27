import { PageBlocksRenderer } from "@/features/PageBlockRenderer";

export default function BlogPage() {
  return (
    <main className="min-h-screen" style={{background: "purple"}}>
      <PageBlocksRenderer page="posts" />
    </main>
  );
}
