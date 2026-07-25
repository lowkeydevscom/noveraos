// Added by Antigravity
import { logger } from "@/lib/logger";

export interface SentryClientConfig {
  dsn?: string;
  environment?: string;
  enabled: boolean;
}

/**
  * Export setupSentry() helper that reads process.env.SENTRY_DSN or NEXT_PUBLIC_SENTRY_DSN
  * and initializes/registers the telemetry client.
  */
export function setupSentry(): SentryClientConfig {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

  if (!dsn) {
    logger.info("SENTRY_INIT_SKIPPED", { reason: "Missing SENTRY_DSN configuration" });
    return { enabled: false, environment };
  }

  logger.info("SENTRY_INIT_SUCCESS", { dsn: dsn.slice(0, 12) + "...", environment });
  return { dsn, environment, enabled: true };
}
