import { describe, expect, it } from "vitest";
import { renderPullRequestReview } from "../src/formatters/render.js";
import type { PullRequestReviewResult } from "../src/types/results.js";

describe("renderPullRequestReview", () => {
  it("includes all required sections", () => {
    const result: PullRequestReviewResult = {
      command: "review-pr",
      summary: "Summary text",
      prNumber: 12,
      changedFiles: [{ path: "src/payment.ts", status: "modified", additions: 2, deletions: 1 }],
      possibleBugs: ["Bug risk"],
      securityConcerns: ["Security risk"],
      performanceConcerns: ["Performance risk"],
      missingTests: ["Missing tests"],
      recommendedReviewCommentDraft: "Draft comment",
      safeFixPlan: ["Fix step"],
      sources: ["repo:test"],
      warnings: ["None"],
      nextSteps: ["Follow up"]
    };

    const output = renderPullRequestReview(result);
    expect(output).toContain("Summary");
    expect(output).toContain("Changed Files");
    expect(output).toContain("Possible Bugs");
    expect(output).toContain("Security Concerns");
    expect(output).toContain("Performance Concerns");
    expect(output).toContain("Missing Tests");
    expect(output).toContain("Recommended Review Comment Draft");
    expect(output).toContain("Safe Fix Plan");
  });
});
