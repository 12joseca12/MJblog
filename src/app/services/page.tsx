import { PageBlocksRenderer } from "@/features/PageBlockRenderer";

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ background: "orange" }}>
      <PageBlocksRenderer page="travels" />
    </main>
  );
}
