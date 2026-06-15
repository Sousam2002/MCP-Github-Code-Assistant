# Sample Prompts

## Repository Understanding

- `explain-repo --repo owner/name`
- `explain-file --repo owner/name --path src/auth.ts`
- `explain-file --repo owner/name --path src/auth.ts --symbol verifyJwt`

## Search and Triage

- `search-code --repo owner/name --query "JWT"`
- `summarize-issues --repo owner/name`
- `summarize-prs --repo owner/name`

## PR Review

- `review-pr --repo owner/name --pr 12`
- `review-pr --repo example-org/example-repo --pr 12`

## Test Planning

- `suggest-tests --repo owner/name --path src/payment.ts`
- `suggest-tests --repo owner/name --path src/api/session.ts --allow-terminal`
