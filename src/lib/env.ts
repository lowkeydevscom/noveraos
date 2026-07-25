import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().default("development_secret_placeholder_noveraos"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  ALLOWED_BETA_EMAILS: z.string().default("demo@noveraos.local,beta@noveraos.local"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("[INVALID_ENVIRONMENT_VARIABLES]", JSON.stringify(error.format(), null, 2));
  } else {
    console.error("[ENVIRONMENT_VALIDATION_ERROR]", error);
  }
  // Provide safe fallback defaults for non-blocking local evaluation & build-time page collection
  parsedEnv = {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/noveraos?schema=public",
    AUTH_SECRET: process.env.AUTH_SECRET || "development_secret_placeholder_noveraos",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ALLOWED_BETA_EMAILS: process.env.ALLOWED_BETA_EMAILS || "demo@noveraos.local,beta@noveraos.local",
    NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
    VERCEL_ENV: process.env.VERCEL_ENV as "production" | "preview" | "development" | undefined,
  };
}

export const env = parsedEnv;
