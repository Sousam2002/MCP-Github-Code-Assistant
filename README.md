# MCP GitHub Code Assistant

`MCP GitHub Code Assistant` is a portfolio-ready TypeScript CLI that inspects GitHub repositories through the Model Context Protocol (MCP). It defaults to read-only behavior and helps developers explain code, summarize issues and pull requests, review PRs for risk, and draft safe improvement plans without posting anything back to GitHub.

## Features

- Explain repository structure with important files, dependencies, and TODO/risk hints
- Explain a file or narrow the explanation to a symbol/function
- Search code by keyword
- Summarize open issues
- Summarize pull requests
- Review pull requests for bugs, security concerns, performance concerns, missing tests, and unclear code
- Suggest tests and generate a safe fix plan without mutating GitHub
- Enforce read-only guardrails and redact likely secrets

## Tech Stack

- Node.js 22+
- TypeScript
- MCP SDK for stdio-based MCP clients
- `dotenv` for configuration
- `vitest` for unit tests
- Minimal custom CLI parser and structured logger

## Project Structure

```text
.
├── docs/
├── samples/
├── src/
│   ├── cli/
│   ├── formatters/
│   ├── logging/
│   ├── mcp/
│   ├── safety/
│   ├── services/
│   ├── terminal/
│   └── types/
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Setup

```bash
cp .env.example .env
npm install
npm run build
```

If PowerShell blocks `npm`, use `npm.cmd install` and `npm.cmd run build`.

## Configuration

Set the following environment variables in `.env`:

- `MCP_PROVIDER=mock` for local development and tests, or `live` for real MCP servers
- `GITHUB_TOKEN` for GitHub access
- `GITHUB_MCP_COMMAND` and `GITHUB_MCP_ARGS` for the GitHub MCP server process
- `FILESYSTEM_MCP_COMMAND` and `FILESYSTEM_MCP_ARGS` for the filesystem MCP server process
- `ALLOW_TERMINAL=1` only when you explicitly want to permit local terminal-based test execution
- `LOG_LEVEL=debug|info|warn|error`

## Run Commands

```bash
npm run dev -- explain-repo --repo owner/name
npm run dev -- explain-file --repo owner/name --path src/auth.ts
npm run dev -- explain-file --repo owner/name --path src/auth.ts --symbol validateToken
npm run dev -- search-code --repo owner/name --query JWT
npm run dev -- summarize-issues --repo owner/name
npm run dev -- summarize-prs --repo owner/name
npm run dev -- review-pr --repo owner/name --pr 12
npm run dev -- suggest-tests --repo owner/name --path src/payment.ts
```

## Demo Walkthrough

Command:

```bash
npm run dev -- review-pr --repo example-org/example-repo --pr 12
```

Expected flow:

1. Fetch PR metadata from the GitHub MCP server
2. Inspect the changed files and patch summaries
3. Summarize the PR intent
4. Highlight bug, security, and performance risks
5. Suggest missing tests
6. Draft a review comment
7. Stop without posting comments or mutating GitHub

The repository includes a mock provider and test fixture so this flow can be demonstrated without live GitHub access.

## Tests

```bash
npm run test
```

Coverage in the current suite:

- CLI argument parsing
- formatter output sections
- mock MCP provider-backed workflows
- read-only guardrails
- demo review flow

## Safety Notes

- Read-only mode is the default and only implemented mode in V1
- Write actions are blocked and return a draft/confirmation requirement instead
- Repository, issue, PR, and comment content are treated as untrusted input
- Possible secrets and `.env`-style content are redacted from summaries
- Prompt-injection text is ignored during analysis

See [docs/security.md](docs/security.md) for the full safety model.

## Limitations

- Live MCP tool names may vary slightly by server version and can require small config adjustments
- File/function explanation uses lightweight heuristics in V1 instead of full semantic indexing
- Review quality depends on the metadata and diff detail returned by the connected MCP servers
- No write mode, PR comments, issue creation, or code modifications are performed in V1

## V2 Ideas

- Safe write mode with explicit confirmation
- Draft PR comments and optional posting
- Create GitHub issues from TODOs
- Generate unit test skeletons
- Explain CI failures
- Generate repo-wide documentation bundles
