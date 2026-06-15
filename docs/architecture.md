# Architecture Notes

## Overview

The CLI is intentionally split into small layers so the assistant remains easy to test and safe to evolve:

1. `src/cli`
   Parses command-line input, validates options, and routes commands.
2. `src/services`
   Encodes user-facing behaviors such as repository explanation and PR review.
3. `src/mcp`
   Provides the MCP abstraction and live/mock provider implementations.
4. `src/safety`
   Enforces read-only rules, secret redaction, and prompt-injection resistance.
5. `src/formatters`
   Converts structured result objects into stable terminal output.

## Data Flow

1. The CLI parser turns argv into a typed command request.
2. Guardrails verify that the command is allowed in read-only mode.
3. The selected provider fetches repository, issue, PR, and file data through MCP.
4. Services transform the raw data into typed result objects.
5. The formatter renders those result objects into predictable sections.

## MCP Integration Strategy

- `LiveMcpProvider` wraps stdio-based MCP connections.
- The GitHub and filesystem servers are configured independently.
- Tool invocation names are centralized in `src/mcp/toolCatalog.ts`.
- `MockMcpProvider` mirrors the live interface for tests and offline demos.

## Why CLI for V1

The CLI gives the fastest path to a working MVP and matches the target workflow of developer tooling. It also keeps the focus on command behavior, MCP integration, and safe review output instead of UI complexity.
