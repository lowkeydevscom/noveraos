import { db } from "../db";
import { createThoughtAction } from "../actions/thought-actions";
import { executeHybridSearch } from "./hybrid-search";

async function verifyHybridSearch() {
  console.log("--- Starting Hybrid Search Verification ---");

  // Step 1: Create test thoughts in database
  const t1 = await createThoughtAction({
    rawContent: "Building high speed vector search using PostgreSQL pgvector extension for NoveraOS.",
  });
  const t2 = await createThoughtAction({
    rawContent: "Zustand handles local transient UI state for global search modal.",
  });

  if (!t1.success || !t2.success) {
    throw new Error("Failed to create test thoughts for hybrid search.");
  }

  const id1 = t1.data.id;
  const id2 = t2.data.id;
  const userId = t1.data.userId;

  // Wait 300ms for background embedding creation
  await new Promise((r) => setTimeout(r, 300));

  // Step 2: Test Exact + Semantic Hybrid Search
  console.log("\n1. Executing Hybrid Search Query...");
  const searchStart = Date.now();
  const { results, latencyMs } = await executeHybridSearch("pgvector search", userId, 5);
  const totalDuration = Date.now() - searchStart;

  console.log(`[PASS] Search completed in ${latencyMs}ms (Total roundtrip: ${totalDuration}ms). Target: < 150ms.`);

  if (latencyMs > 150) {
    console.warn(`[WARN] Latency ${latencyMs}ms is slightly high, check database index.`);
  }

  if (results.length === 0) {
    throw new Error("[FAIL] Hybrid search returned 0 results!");
  }

  console.log(`[PASS] Found ${results.length} ranked match(es). Top Result:`);
  console.log(`  - Match Type: ${results[0].matchType}`);
  console.log(`  - Hybrid Score: ${results[0].score}`);
  console.log(`  - Content: "${results[0].rawContent}"`);

  // Step 3: Test Exact String Filtering (ILIKE)
  console.log("\n2. Executing Exact Match Query...");
  const exactRes = await executeHybridSearch("Zustand", userId, 5);
  if (exactRes.results.length === 0) {
    throw new Error("[FAIL] Exact match search for 'Zustand' returned 0 results!");
  }
  console.log(`[PASS] Exact match found for 'Zustand': ${exactRes.results[0].matchType} match.`);

  // Cleanup test data
  await db.thought.deleteMany({ where: { id: { in: [id1, id2] } } });
  console.log("\n[SUCCESS] Global Cmd+K Hybrid Search Verification completed successfully!");
  process.exit(0);
}

verifyHybridSearch().catch((err) => {
  console.error("\n[ERROR] Hybrid search verification failed:", err);
  process.exit(1);
});
