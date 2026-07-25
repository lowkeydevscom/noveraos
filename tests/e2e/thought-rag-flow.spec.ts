// Added by Antigravity
import { test, expect } from "@playwright/test";

test.describe("Thought Dump & RAG Chat Flow", () => {
  test("captures a thought, persists it, and receives a cited AI response", async ({ page }) => {
    // 1. Navigate to Thought Dump view
    await page.goto("/thought-dump");
    await expect(page).toHaveTitle(/NoveraOS/i);

    // 2. Input and save a new thought
    const thoughtInput = page.locator("#thought-input");
    await thoughtInput.fill("Project Phoenix launch date is set for Q4 with vector search integration.");
    
    const saveButton = page.getByRole("button", { name: /Save Thought/i });
    await saveButton.click();

    // 3. Verify autosave indicator / confirmation
    await expect(page.locator("text=Saved Thought")).toBeVisible({ timeout: 5000 }).catch(() => {
      // Fallback check for thought card presence in feed
      return expect(page.locator("text=Project Phoenix launch date")).toBeVisible();
    });

    // 4. Navigate to AI Workspace Chat
    await page.goto("/workspace");
    const chatInput = page.locator("#chat-input");
    await expect(chatInput).toBeVisible();

    // 5. Query the RAG memory system
    await chatInput.fill("When is the launch date for Project Phoenix?");
    await page.getByRole("button", { name: /Send query/i }).click();

    // 6. Verify response containing cited thought chip
    await expect(page.locator("button:has-text('Thought #')")).toBeVisible({ timeout: 10000 });
  });
});
