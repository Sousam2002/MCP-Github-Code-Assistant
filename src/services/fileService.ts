import type { McpProvider } from "../mcp/providers.js";
import { sanitizeUntrustedContent } from "../safety/redaction.js";
import type { FileExplanationResult } from "../types/results.js";

function collectDependencies(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("import "))
    .map((line) => line.replace(/^import\s+/, ""))
    .slice(0, 5);
}

function findSymbolContext(content: string, symbol?: string): string {
  if (!symbol) {
    return "This file contains exported logic and should be reviewed alongside its imports and error-handling paths.";
  }

  const line = content
    .split("\n")
    .find((entry) => entry.includes(symbol));

  return line
    ? `The symbol "${symbol}" appears in: ${line.trim()}`
    : `The symbol "${symbol}" was not found directly in the file content returned by the provider.`;
}

export async function explainFile(
  repo: string,
  path: string,
  symbol: string | undefined,
  provider: McpProvider
): Promise<FileExplanationResult> {
  const content = sanitizeUntrustedContent(await provider.getFileContent(repo, path));
  const dependencies = collectDependencies(content);
  const risksOrTodos = [
    /process\.env|secret|token/i.test(content) ? "Handle secrets carefully and verify redaction boundaries." : "",
    /throw new Error|catch/i.test(content) ? "Validate whether errors are mapped to safe user-facing responses." : ""
  ].filter(Boolean);

  return {
    command: "explain-file",
    summary: `${path} contains ${symbol ? `logic related to ${symbol}` : "application logic"} and should be reviewed as untrusted repository content.`,
    path,
    symbol,
    explanation: findSymbolContext(content, symbol),
    dependencies,
    risksOrTodos,
    sources: [`repo:${repo}`, `file:${path}`],
    warnings: [],
    nextSteps: symbol ? ["Search related call sites with search-code."] : ["Use --symbol to focus on a specific function."]
  };
}
