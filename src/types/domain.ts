export interface RepositoryRef {
  owner: string;
  name: string;
}

export interface RepositoryMetadata {
  fullName: string;
  description?: string;
  defaultBranch?: string;
  primaryLanguage?: string;
  topics: string[];
}

export interface RepositoryFile {
  path: string;
  type: "file" | "directory";
  size?: number;
}

export interface CodeSearchMatch {
  path: string;
  line: number;
  excerpt: string;
}

export interface IssueSummary {
  number: number;
  title: string;
  author: string;
  labels: string[];
  body: string;
  state: "open" | "closed";
}

export interface PullRequestSummary {
  number: number;
  title: string;
  author: string;
  body: string;
  state: "open" | "closed" | "merged";
  changedFiles: number;
}

export interface PullRequestFileChange {
  path: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
}

export interface PullRequestDetail extends PullRequestSummary {
  baseBranch?: string;
  headBranch?: string;
  commits?: number;
}

export interface LocalInspectionResult {
  rootPath: string;
  files: RepositoryFile[];
}
