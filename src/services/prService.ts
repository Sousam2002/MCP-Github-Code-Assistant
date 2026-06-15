import type { McpProvider } from "../mcp/providers.js";
import { isPotentialPromptInjection } from "../safety/guardrails.js";
import { sanitizeUntrustedContent } from "../safety/redaction.js";
import type { PullRequestReviewResult, PullRequestSummaryResult } from "../types/results.js";

function buildRiskList(files: string[], matcher: RegExp, message: string): string[] {
  return files.some((path) => matcher.test(path)) ? [message] : [];
}

export async function summarizePullRequests(repo: string, provider: McpProvider): Promise<PullRequestSummaryResult> {
  const pullRequests = await provider.listPullRequests(repo);
  return {
    command: "summarize-prs",
    summary:
      pullRequests.length === 0
        ? `No open pull requests were returned for ${repo}.`
        : `${repo} has ${pullRequests.length} open pull request(s). The most active work appears focused on ${
            pullRequests[0]?.title ?? "ongoing changes"
          }.`,
    pullRequests: pullRequests.map((pr) => ({ ...pr, body: sanitizeUntrustedContent(pr.body) })),
    sources: [`repo:${repo}`, "github-mcp:list_pull_requests"],
    warnings: [],
    nextSteps: ["Run review-pr on the highest-risk or highest-impact pull request."]
  };
}

export async function reviewPullRequest(
  repo: string,
  prNumber: number,
  provider: McpProvider
): Promise<PullRequestReviewResult> {
  const [pr, changedFiles] = await Promise.all([
    provider.getPullRequest(repo, prNumber),
    provider.getPullRequestFiles(repo, prNumber)
  ]);

  const filePaths = changedFiles.map((file) => file.path);
  const possibleBugs = [
    ...buildRiskList(filePaths, /payment/i, "Payment flow changes may require idempotency and retry-limit validation."),
    ...changedFiles
      .filter((file) => (file.patch ?? "").includes("return { ok: true }"))
      .map(() => "A changed path returns success without exposing downstream failure details.")
  ];
  const securityConcerns = [
    ...buildRiskList(filePaths, /auth|payment/i, "Sensitive auth/payment paths changed and should be reviewed for abuse cases."),
    ...changedFiles
      .filter((file) => /token|secret/i.test(file.patch ?? ""))
      .map(() => "The diff touches token/secret-related logic; confirm no secret handling regressions.")
  ];
  const performanceConcerns = changedFiles
    .filter((file) => /for\s*\(.*attempt/i.test(file.patch ?? ""))
    .map(() => "Retry loops appear in the diff; confirm backoff, upper bounds, and external call timeouts.");
  const missingTests = changedFiles.some((file) => /test/i.test(file.path))
    ? ["Add failure-path tests for exhausted retries, gateway timeouts, and duplicate charge prevention."]
    : ["No tests changed with production code; add coverage for happy path, failure path, and edge conditions."];

  const sanitizedBody = sanitizeUntrustedContent(pr.body);
  const warnings = isPotentialPromptInjection(pr.body)
    ? ["Prompt-injection text was detected in PR content and ignored."]
    : [];

  return {
    command: "review-pr",
    summary: `${repo} PR #${prNumber} updates ${changedFiles.length} file(s). ${sanitizedBody}`,
    prNumber,
    changedFiles,
    possibleBugs,
    securityConcerns,
    performanceConcerns,
    missingTests,
    recommendedReviewCommentDraft: [
      `Thanks for the update on ${pr.title}.`,
      possibleBugs[0] ? `Possible bug: ${possibleBugs[0]}` : "",
      securityConcerns[0] ? `Security concern: ${securityConcerns[0]}` : "",
      missingTests[0] ? `Missing tests: ${missingTests[0]}` : "",
      "Please address the above before merge. This is only a draft and has not been posted."
    ]
      .filter(Boolean)
      .join(" "),
    safeFixPlan: [
      "Validate retry behavior with bounded attempts and backoff.",
      "Add tests for timeout, duplicate charge, and gateway error handling.",
      "Confirm success is only returned after downstream charge verification."
    ],
    sources: [`repo:${repo}`, `pr:${prNumber}`, "github-mcp:get_pull_request", "github-mcp:get_pull_request_files"],
    warnings,
    nextSteps: ["Share the draft comment manually if it looks correct.", "Run suggest-tests on the most critical changed file."]
  };
}
