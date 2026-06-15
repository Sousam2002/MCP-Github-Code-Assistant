import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli/parseArgs.js";

describe("parseArgs", () => {
  it("parses review-pr commands", () => {
    const result = parseArgs(["review-pr", "--repo", "example-org/example-repo", "--pr", "12"]);
    expect(result).toEqual({
      name: "review-pr",
      options: {
        repo: "example-org/example-repo",
        path: undefined,
        query: undefined,
        pr: 12,
        symbol: undefined,
        allowTerminal: false
      }
    });
  });

  it("throws when required options are missing", () => {
    expect(() => parseArgs(["search-code", "--repo", "example-org/example-repo"])).toThrow(
      "Missing required option --query"
    );
  });
});
