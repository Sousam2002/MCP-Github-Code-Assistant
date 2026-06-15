export interface ToolBinding {
  name: string;
  arguments: Record<string, unknown>;
}

export const githubToolCatalog = {
  getRepositoryMetadata: (repo: string): ToolBinding => ({
    name: "get_repository",
    arguments: { repo }
  }),
  getRepositoryTree: (repo: string): ToolBinding => ({
    name: "get_file_tree",
    arguments: { repo }
  }),
  getFileContent: (repo: string, path: string): ToolBinding => ({
    name: "get_file_contents",
    arguments: { repo, path }
  }),
  searchCode: (repo: string, query: string): ToolBinding => ({
    name: "search_code",
    arguments: { repo, query }
  }),
  listIssues: (repo: string): ToolBinding => ({
    name: "list_issues",
    arguments: { repo, state: "open" }
  }),
  listPullRequests: (repo: string): ToolBinding => ({
    name: "list_pull_requests",
    arguments: { repo, state: "open" }
  }),
  getPullRequest: (repo: string, prNumber: number): ToolBinding => ({
    name: "get_pull_request",
    arguments: { repo, pullNumber: prNumber }
  }),
  getPullRequestFiles: (repo: string, prNumber: number): ToolBinding => ({
    name: "get_pull_request_files",
    arguments: { repo, pullNumber: prNumber }
  })
} as const;

export const filesystemToolCatalog = {
  listFiles: (path: string): ToolBinding => ({
    name: "list_directory",
    arguments: { path }
  }),
  readFile: (path: string): ToolBinding => ({
    name: "read_file",
    arguments: { path }
  })
} as const;
