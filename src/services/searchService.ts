import type { McpProvider } from "../mcp/providers.js";
import type { CodeSearchResult } from "../types/results.js";

export async function searchCode(repo: string, query: string, provider: McpProvider): Promise<CodeSearchResult> {
  const matches = await provider.searchCode(repo, query);
  return {
    command: "search-code",
    summary:
      matches.length === 0
        ? `No matches for "${query}" were returned in ${repo}.`
        : `Found ${matches.length} match(es) for "${query}" in ${repo}.`,
    query,
    matches,
    sources: [`repo:${repo}`, `query:${query}`],
    warnings: [],
    nextSteps: ["Use explain-file on the most relevant result."]
  };
}
