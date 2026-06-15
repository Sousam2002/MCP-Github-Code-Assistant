import "dotenv/config";
import { parseArgs } from "./cli/parseArgs.js";
import { runCommand } from "./cli/run.js";
import { Logger, type LogLevel } from "./logging/logger.js";
import { LiveMcpProvider, MockMcpProvider, type McpProvider } from "./mcp/providers.js";

function parseCommandArgs(rawArgs: string): string[] {
  return rawArgs.split(" ").filter(Boolean);
}

function parseArgList(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback;
  }

  return value.split(" ").filter(Boolean);
}

function createProvider(logger: Logger): McpProvider {
  const providerMode = process.env.MCP_PROVIDER ?? "mock";
  if (providerMode === "live") {
    return new LiveMcpProvider(
      {
        command: process.env.GITHUB_MCP_COMMAND ?? "npx",
        args: parseArgList(process.env.GITHUB_MCP_ARGS, ["-y", "github-mcp-server"]),
        env: process.env.GITHUB_TOKEN ? { GITHUB_TOKEN: process.env.GITHUB_TOKEN } : undefined
      },
      {
        command: process.env.FILESYSTEM_MCP_COMMAND ?? "npx",
        args: parseArgList(process.env.FILESYSTEM_MCP_ARGS, ["-y", "@modelcontextprotocol/server-filesystem", "."])
      },
      logger
    );
  }

  return new MockMcpProvider();
}

async function main(): Promise<void> {
  const logger = new Logger((process.env.LOG_LEVEL as LogLevel | undefined) ?? "info");
  const rawArgs = process.argv.slice(2);
  const parsed = parseArgs(rawArgs);
  const provider = createProvider(logger);
  const allowTerminalEnv = process.env.ALLOW_TERMINAL === "1";

  logger.info("Running command", { command: parsed.name });
  const output = await runCommand(parsed, provider, rawArgs.join(" "), allowTerminalEnv);
  console.log(output);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(message);
  process.exitCode = 1;
});
