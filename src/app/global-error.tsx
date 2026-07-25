"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("GLOBAL_FATAL_ERROR", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6 text-[var(--color-on-background)] font-sans antialiased">
        <div className="max-w-md space-y-4 rounded-xl bg-card p-8 border border-border text-center shadow-md">
          <h2 className="font-hanken text-2xl font-bold text-foreground">Critical Application Error</h2>
          <p className="font-sans text-sm text-muted-foreground">
            A critical system error occurred. The technical team has been automatically notified.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-DEFAULT bg-primary px-6 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-transform active:scale-95"
          >
            Reload NoveraOS
          </button>
        </div>
      </body>
    </html>
  );
}
