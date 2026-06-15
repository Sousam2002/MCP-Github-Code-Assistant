import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli/parseArgs.js";
import { runCommand } from "../src/cli/run.js";
import { MockMcpProvider } from "../src/mcp/providers.js";

describe("review-pr demo flow", () => {
  it("fetches metadata, inspects files, and drafts a review without posting", async () => {
    const parsed = parseArgs(["review-pr", "--repo", "example-org/example-repo", "--pr", "12"]);
    const output = await runCommand(
      parsed,
      new MockMcpProvider(),
      "review-pr --repo example-org/example-repo --pr 12",
      false
    );

    expect(output).toContain("Summary");
    expect(output).toContain("Changed Files");
    expect(output).toContain("Security Concerns");
    expect(output).toContain("Missing Tests");
    expect(output).toContain("Recommended Review Comment Draft");
    expect(output).toContain("has not been posted");
    expect(output).toContain("Prompt-injection text was detected in PR content and ignored.");
  });
});
