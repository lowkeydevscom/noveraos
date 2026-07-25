// Sentry Edge Configuration
import { env } from "@/lib/env";

export const sentryEdgeConfig = {
  dsn: env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  environment: env.VERCEL_ENV || env.NODE_ENV,
};
