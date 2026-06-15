import type {
  CodeSearchMatch,
  IssueSummary,
  PullRequestFileChange,
  PullRequestSummary,
  RepositoryMetadata
} from "./domain.js";

export interface AssistantCommandResult {
  command: string;
  summary: string;
  sources: string[];
  warnings: string[];
  nextSteps: string[];
}

export interface RepoExplanationResult extends AssistantCommandResult {
  metadata?: RepositoryMetadata;
  importantFiles: string[];
  keyDependencies: string[];
  risksOrTodos: string[];
}

export interface FileExplanationResult extends AssistantCommandResult {
  path: string;
  symbol?: string;
  explanation: string;
  dependencies: string[];
  risksOrTodos: string[];
}

export interface CodeSearchResult extends AssistantCommandResult {
  query: string;
  matches: CodeSearchMatch[];
}

export interface IssueSummaryResult extends AssistantCommandResult {
  issues: IssueSummary[];
}

export interface PullRequestSummaryResult extends AssistantCommandResult {
  pullRequests: PullRequestSummary[];
}

export interface PullRequestReviewResult extends AssistantCommandResult {
  prNumber: number;
  changedFiles: PullRequestFileChange[];
  possibleBugs: string[];
  securityConcerns: string[];
  performanceConcerns: string[];
  missingTests: string[];
  recommendedReviewCommentDraft: string;
  safeFixPlan: string[];
}

export interface TestSuggestionResult extends AssistantCommandResult {
  path: string;
  suggestedTests: string[];
}
