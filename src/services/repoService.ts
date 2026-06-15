import type { McpProvider } from "../mcp/providers.js";
import { sanitizeUntrustedContent } from "../safety/redaction.js";
import type { RepoExplanationResult } from "../types/results.js";

export async function explainRepository(repo: string, provider: McpProvider): Promise<RepoExplanationResult> {
  const [metadata, tree] = await Promise.all([
    provider.getRepositoryMetadata(repo),
    provider.getRepositoryTree(repo)
  ]);

  const importantFiles = tree
    .filter((file) => file.type === "file")
    .map((file) => file.path)
    .filter((path) => /package\.json|readme|src\/|test/i.test(path))
    .slice(0, 6);

  const keyDependencies = metadata.primaryLanguage ? [metadata.primaryLanguage, ...metadata.topics] : metadata.topics;
  const risksOrTodos = [
    tree.some((file) => /payment/i.test(file.path)) ? "Review payment flows for retry/idempotency safety." : "",
    tree.some((file) => /auth/i.test(file.path)) ? "Check auth token handling and error mapping." : ""
  ].filter(Boolean);

  return {
    command: "explain-repo",
    summary: sanitizeUntrustedContent(
      metadata.description
        ? `${metadata.fullName} appears to be a ${metadata.primaryLanguage ?? "software"} project focused on ${metadata.description}.`
        : `${metadata.fullName} appears to be an active repository with ${tree.length} visible files/directories.`
    ),
    metadata,
    importantFiles,
    keyDependencies,
    risksOrTodos,
    sources: [`repo:${repo}`, "github-mcp:get_repository", "github-mcp:get_file_tree"],
    warnings: [],
    nextSteps: ["Run explain-file on a critical module such as auth or payment.", "Use review-pr for active pull requests."]
  };
}
