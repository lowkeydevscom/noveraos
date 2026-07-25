// Sentry Client Configuration
import { env } from "@/lib/env";

export const sentryClientConfig = {
  dsn: env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  environment: env.VERCEL_ENV || env.NODE_ENV,
};

if (typeof window !== "undefined" && sentryClientConfig.dsn) {
  // Sentry SDK initialized for browser environment
}
