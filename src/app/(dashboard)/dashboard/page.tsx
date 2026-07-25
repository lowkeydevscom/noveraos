import React from "react";
import { getThoughtsAction } from "@/lib/actions/thought-actions";
import { ThoughtDumpView } from "@/components/thought-dump/thought-dump-view";
import { SearchModal } from "@/components/shared/search-modal";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getThoughtsAction();
  const initialThoughts = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <ThoughtDumpView initialThoughts={initialThoughts} />
      <SearchModal />
    </main>
  );
}
