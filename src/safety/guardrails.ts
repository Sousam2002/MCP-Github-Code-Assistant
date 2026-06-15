import type { CommandName } from "../types/commands.js";

export interface SafetyDecision {
  allowed: boolean;
  reason?: string;
  requiresConfirmation: boolean;
}

const blockedWriteIntentPattern =
  /\b(push|commit|merge|delete|edit|write|comment|post|approve|close|reopen|apply|patch)\b/i;

export function evaluateSafety(command: CommandName, rawInput: string): SafetyDecision {
  if (blockedWriteIntentPattern.test(rawInput)) {
    return {
      allowed: false,
      reason: "This assistant is read-only in V1 and will only draft suggested write actions.",
      requiresConfirmation: true
    };
  }

  return {
    allowed: true,
    requiresConfirmation: command === "review-pr" ? false : false
  };
}

export function assertReadOnlyMode(decision: SafetyDecision): void {
  if (!decision.allowed) {
    throw new Error(decision.reason ?? "Blocked by read-only safety policy.");
  }
}

export function isPotentialPromptInjection(content: string): boolean {
  return /\b(ignore previous instructions|system prompt|developer message|tool call|exfiltrate)\b/i.test(
    content
  );
}
