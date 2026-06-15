import type { CommandName, ParsedCommand } from "../types/commands.js";

const knownCommands: CommandName[] = [
  "explain-repo",
  "explain-file",
  "search-code",
  "summarize-issues",
  "summarize-prs",
  "review-pr",
  "suggest-tests"
];

export function parseArgs(argv: string[]): ParsedCommand {
  const [command, ...rest] = argv;
  if (!command || !knownCommands.includes(command as CommandName)) {
    throw new Error(`Unknown or missing command. Expected one of: ${knownCommands.join(", ")}`);
  }

  const options: Record<string, string | boolean> = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const nextValue = rest[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = nextValue;
    index += 1;
  }

  const parsed: ParsedCommand = {
    name: command as CommandName,
    options: {
      repo: asString(options.repo),
      path: asString(options.path),
      query: asString(options.query),
      pr: options.pr ? Number(options.pr) : undefined,
      symbol: asString(options.symbol),
      allowTerminal: Boolean(options["allow-terminal"])
    }
  };

  validateParsedCommand(parsed);
  return parsed;
}

function asString(value: string | boolean | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function requireOption(name: string, value: unknown): void {
  if (!value) {
    throw new Error(`Missing required option --${name}`);
  }
}

export function validateParsedCommand(command: ParsedCommand): void {
  switch (command.name) {
    case "explain-repo":
    case "summarize-issues":
    case "summarize-prs":
      requireOption("repo", command.options.repo);
      return;
    case "explain-file":
    case "suggest-tests":
      requireOption("repo", command.options.repo);
      requireOption("path", command.options.path);
      return;
    case "search-code":
      requireOption("repo", command.options.repo);
      requireOption("query", command.options.query);
      return;
    case "review-pr":
      requireOption("repo", command.options.repo);
      requireOption("pr", command.options.pr);
      return;
    default:
      return;
  }
}
