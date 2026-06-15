import type { McpProvider } from "../mcp/providers.js";
import type { TestSuggestionResult } from "../types/results.js";

export async function suggestTests(
  repo: string,
  path: string,
  provider: McpProvider
): Promise<TestSuggestionResult> {
  const content = await provider.getFileContent(repo, path);
  const suggestedTests = [
    /amount|payment|charge/i.test(content)
      ? "Covers valid payment processing, timeout handling, duplicate requests, and zero/negative amount rejection."
      : "Covers the main success path and likely edge inputs.",
    /token|auth|jwt/i.test(content)
      ? "Adds invalid token, expired token, and missing secret configuration cases."
      : "Adds clear failure-path assertions.",
    "Verifies logging or error surfaces do not leak secrets."
  ];

  return {
    command: "suggest-tests",
    summary: `Suggested tests for ${path} focus on correctness, edge cases, and safe failure handling.`,
    path,
    suggestedTests,
    sources: [`repo:${repo}`, `file:${path}`],
    warnings: [],
    nextSteps: ["Add the highest-risk test cases first.", "Optionally run tests locally only after explicit approval."]
  };
}
