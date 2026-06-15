# Security Notes

## Threat Model

This assistant consumes repository files, issue bodies, PR descriptions, comments, and diff snippets. All of that content is treated as untrusted input because it can contain prompt injection, malicious instructions, secrets, or misleading text.

## Guardrails

- Default mode is read-only.
- Any command that implies writing, posting, pushing, deleting, or mutating is blocked.
- Terminal execution is disabled unless both environment configuration and command flags explicitly allow it.
- Likely secrets, tokens, private keys, and `.env` snippets are redacted before rendering.
- Tool output is summarized rather than blindly echoed.

## Prompt-Injection Defense

The service layer sanitizes repository and discussion content before it is used. Instructions embedded inside files, issues, or PR descriptions are never treated as higher priority than the assistant's built-in safety policy.

## Secret Handling

The formatter and safety layer filter out likely:

- GitHub tokens
- API keys
- `PRIVATE KEY` material
- `.env` assignments

When in doubt, the assistant prefers omission over exposure.

## Write Actions

V1 does not implement write actions. If a future version adds write mode, it should:

1. Generate a draft first
2. Show the exact pending mutation
3. Require explicit user confirmation
4. Log the action clearly
