export type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

export class Logger {
  constructor(private readonly minLevel: LogLevel = "info") {}

  log(level: LogLevel, message: string, context: Record<string, unknown> = {}): void {
    if (levelOrder[level] < levelOrder[this.minLevel]) {
      return;
    }

    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context
    };

    console.error(JSON.stringify(payload));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log("error", message, context);
  }
}
