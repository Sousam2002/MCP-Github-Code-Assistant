import type {
  AssistantCommandResult,
  CodeSearchResult,
  FileExplanationResult,
  IssueSummaryResult,
  PullRequestReviewResult,
  PullRequestSummaryResult,
  RepoExplanationResult,
  TestSuggestionResult
} from "../types/results.js";

function renderList(title: string, values: string[]): string {
  if (values.length === 0) {
    return `${title}\n- None`;
  }

  return `${title}\n${values.map((value) => `- ${value}`).join("\n")}`;
}

function renderMeta(result: AssistantCommandResult): string {
  return [
    renderList("Sources", result.sources),
    renderList("Warnings", result.warnings),
    renderList("Next Steps", result.nextSteps)
  ].join("\n\n");
}

export function renderRepoExplanation(result: RepoExplanationResult): string {
  return [
    `Summary\n${result.summary}`,
    renderList("Important Files", result.importantFiles),
    renderList("Key Dependencies", result.keyDependencies),
    renderList("Risks or TODOs", result.risksOrTodos),
    renderMeta(result)
  ].join("\n\n");
}

export function renderFileExplanation(result: FileExplanationResult): string {
  return [
    `Summary\n${result.summary}`,
    `Explanation\n${result.explanation}`,
    renderList("Dependencies", result.dependencies),
    renderList("Risks or TODOs", result.risksOrTodos),
    renderMeta(result)
  ].join("\n\n");
}

export function renderCodeSearch(result: CodeSearchResult): string {
  const matches = result.matches.length
    ? result.matches.map((match) => `- ${match.path}:${match.line} ${match.excerpt}`).join("\n")
    : "- None";

  return [`Summary\n${result.summary}`, `Matches\n${matches}`, renderMeta(result)].join("\n\n");
}

export function renderIssueSummary(result: IssueSummaryResult): string {
  const issues = result.issues.length
    ? result.issues.map((issue) => `- #${issue.number} ${issue.title} [${issue.labels.join(", ")}]`).join("\n")
    : "- None";
  return [`Summary\n${result.summary}`, `Open Issues\n${issues}`, renderMeta(result)].join("\n\n");
}

export function renderPullRequestSummary(result: PullRequestSummaryResult): string {
  const prs = result.pullRequests.length
    ? result.pullRequests.map((pr) => `- #${pr.number} ${pr.title} (${pr.changedFiles} files)`).join("\n")
    : "- None";
  return [`Summary\n${result.summary}`, `Open Pull Requests\n${prs}`, renderMeta(result)].join("\n\n");
}

export function renderPullRequestReview(result: PullRequestReviewResult): string {
  const changedFiles = result.changedFiles.length
    ? result.changedFiles.map((file) => `- ${file.path} (${file.status}, +${file.additions}/-${file.deletions})`).join("\n")
    : "- None";

  return [
    `Summary\n${result.summary}`,
    `Changed Files\n${changedFiles}`,
    renderList("Possible Bugs", result.possibleBugs),
    renderList("Security Concerns", result.securityConcerns),
    renderList("Performance Concerns", result.performanceConcerns),
    renderList("Missing Tests", result.missingTests),
    `Recommended Review Comment Draft\n${result.recommendedReviewCommentDraft}`,
    renderList("Safe Fix Plan", result.safeFixPlan),
    renderMeta(result)
  ].join("\n\n");
}

export function renderTestSuggestion(result: TestSuggestionResult): string {
  return [
    `Summary\n${result.summary}`,
    renderList("Suggested Tests", result.suggestedTests),
    renderMeta(result)
  ].join("\n\n");
}
