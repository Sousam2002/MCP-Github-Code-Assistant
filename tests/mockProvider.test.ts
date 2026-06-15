import { describe, expect, it } from "vitest";
import { MockMcpProvider } from "../src/mcp/providers.js";
import { explainRepository } from "../src/services/repoService.js";
import { summarizeIssues } from "../src/services/issueService.js";

describe("MockMcpProvider-backed services", () => {
  const provider = new MockMcpProvider();

  it("explains the repository", async () => {
    const result = await explainRepository("example-org/example-repo", provider);
    expect(result.summary).toContain("example-org/example-repo");
    expect(result.importantFiles).toContain("src/auth.ts");
  });

  it("summarizes issues", async () => {
    const result = await summarizeIssues("example-org/example-repo", provider);
    expect(result.issues).toHaveLength(2);
    expect(result.summary).toContain("open issues");
  });
});
