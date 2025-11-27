import { PageBlocksRenderer } from "@/features/PageBlockRenderer";

export default function ItineraryPage() {
  return (
    <main className="min-h-screen" style={{ background: "green" }}>
      <PageBlocksRenderer page="travels" />
    </main>
  );
}
