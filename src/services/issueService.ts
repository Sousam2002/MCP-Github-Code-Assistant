import type { McpProvider } from "../mcp/providers.js";
import { sanitizeUntrustedContent } from "../safety/redaction.js";
import type { IssueSummaryResult } from "../types/results.js";

export async function summarizeIssues(repo: string, provider: McpProvider): Promise<IssueSummaryResult> {
  const issues = await provider.listIssues(repo);
  const summary =
    issues.length === 0
      ? `No open issues were returned for ${repo}.`
      : `${repo} has ${issues.length} open issues. Common themes include ${Array.from(
          new Set(issues.flatMap((issue) => issue.labels))
        )
          .slice(0, 3)
          .join(", ")}.`;

  return {
    command: "summarize-issues",
    summary: sanitizeUntrustedContent(summary),
    issues: issues.map((issue) => ({ ...issue, body: sanitizeUntrustedContent(issue.body) })),
    sources: [`repo:${repo}`, "github-mcp:list_issues"],
    warnings: [],
    nextSteps: ["Investigate high-signal issues first, especially security and reliability labels."]
  };
}
