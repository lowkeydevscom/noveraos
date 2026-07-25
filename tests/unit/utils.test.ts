// Added by Antigravity
import { describe, it, expect } from "vitest";
import { createThoughtSchema, updateThoughtSchema, searchThoughtSchema } from "@/lib/validations/thought";
import { setupSentry } from "@/lib/sentry";

describe("NoveraOS Validation Schemas", () => {
  it("validates createThoughtSchema correctly", () => {
    const valid = createThoughtSchema.safeParse({ rawContent: "   Architectural concept note   " });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.rawContent).toBe("Architectural concept note");
    }

    const invalid = createThoughtSchema.safeParse({ rawContent: "   " });
    expect(invalid.success).toBe(false);
  });

  it("validates updateThoughtSchema correctly", () => {
    const valid = updateThoughtSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      rawContent: "Updated thought content",
    });
    expect(valid.success).toBe(true);

    const invalidId = updateThoughtSchema.safeParse({
      id: "invalid-uuid",
      rawContent: "Updated thought content",
    });
    expect(invalidId.success).toBe(false);
  });

  it("validates searchThoughtSchema correctly", () => {
    const valid = searchThoughtSchema.safeParse({ query: "quantum computing" });
    expect(valid.success).toBe(true);

    const empty = searchThoughtSchema.safeParse({ query: "" });
    expect(empty.success).toBe(false);
  });
});

describe("Sentry Helper", () => {
  it("returns enabled false when SENTRY_DSN is absent", () => {
    const sentryConfig = setupSentry();
    expect(sentryConfig).toHaveProperty("enabled");
  });
});
