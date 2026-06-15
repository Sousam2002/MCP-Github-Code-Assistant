export type CommandName =
  | "explain-repo"
  | "explain-file"
  | "search-code"
  | "summarize-issues"
  | "summarize-prs"
  | "review-pr"
  | "suggest-tests";

export interface CommandOptions {
  repo?: string;
  path?: string;
  query?: string;
  pr?: number;
  symbol?: string;
  allowTerminal?: boolean;
}

export interface ParsedCommand {
  name: CommandName;
  options: CommandOptions;
}
