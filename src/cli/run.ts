import type { McpProvider } from "../mcp/providers.js";
import { renderCodeSearch, renderFileExplanation, renderIssueSummary, renderPullRequestReview, renderPullRequestSummary, renderRepoExplanation, renderTestSuggestion } from "../formatters/render.js";
import { assertReadOnlyMode, evaluateSafety } from "../safety/guardrails.js";
import { explainFile } from "../services/fileService.js";
import { summarizeIssues } from "../services/issueService.js";
import { reviewPullRequest, summarizePullRequests } from "../services/prService.js";
import { explainRepository } from "../services/repoService.js";
import { searchCode } from "../services/searchService.js";
import { suggestTests } from "../services/testSuggestionService.js";
import { checkTerminalApproval } from "../terminal/terminalGate.js";
import type { ParsedCommand } from "../types/commands.js";

export async function runCommand(
  parsed: ParsedCommand,
  provider: McpProvider,
  rawInput: string,
  allowTerminalEnv: boolean
): Promise<string> {
  const safety = evaluateSafety(parsed.name, rawInput);
  assertReadOnlyMode(safety);

  switch (parsed.name) {
    case "explain-repo":
      return renderRepoExplanation(await explainRepository(parsed.options.repo!, provider));
    case "explain-file":
      return renderFileExplanation(
        await explainFile(parsed.options.repo!, parsed.options.path!, parsed.options.symbol, provider)
      );
    case "search-code":
      return renderCodeSearch(await searchCode(parsed.options.repo!, parsed.options.query!, provider));
    case "summarize-issues":
      return renderIssueSummary(await summarizeIssues(parsed.options.repo!, provider));
    case "summarize-prs":
      return renderPullRequestSummary(await summarizePullRequests(parsed.options.repo!, provider));
    case "review-pr":
      return renderPullRequestReview(await reviewPullRequest(parsed.options.repo!, parsed.options.pr!, provider));
    case "suggest-tests": {
      const approval = checkTerminalApproval(Boolean(parsed.options.allowTerminal), allowTerminalEnv);
      const rendered = renderTestSuggestion(await suggestTests(parsed.options.repo!, parsed.options.path!, provider));
      return approval.allowed ? rendered : `${rendered}\n\nTerminal\n${approval.reason}`;
    }
    default:
      throw new Error(`Unsupported command: ${(parsed as ParsedCommand).name}`);
  }
}
