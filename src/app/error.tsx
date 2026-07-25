"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("CLIENT_ERROR_CAPTURED", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-xl bg-card p-8 border border-border shadow-sm">
        <h2 className="font-hanken text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="font-sans text-sm text-muted-foreground">
          An unhandled application error occurred. It has been logged to monitoring.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-DEFAULT bg-primary px-5 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-transform active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
