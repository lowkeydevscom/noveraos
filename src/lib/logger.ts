export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  event: string;
  userId?: string;
  thoughtId?: string;
  conversationId?: string;
  error?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

class Logger {
  private isProd = process.env.NODE_ENV === "production";

  private format(entry: Omit<LogEntry, "timestamp">): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      ...entry,
    });
  }

  info(event: string, details?: Record<string, unknown>, userId?: string): void {
    console.log(this.format({ level: "INFO", event, details, userId }));
  }

  warn(event: string, details?: Record<string, unknown>, userId?: string): void {
    console.warn(this.format({ level: "WARN", event, details, userId }));
  }

  error(event: string, error: unknown, details?: Record<string, unknown>, userId?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const mergedDetails = details ? { ...details, stack } : { stack };
    console.error(this.format({ level: "ERROR", event, error: errorMessage, details: mergedDetails, userId }));
  }

  debug(event: string, details?: Record<string, unknown>, userId?: string): void {
    if (!this.isProd) {
      console.debug(this.format({ level: "DEBUG", event, details, userId }));
    }
  }
}

export const logger = new Logger();
