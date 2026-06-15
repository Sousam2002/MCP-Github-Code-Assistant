export interface TerminalApproval {
  allowed: boolean;
  reason: string;
}

export function checkTerminalApproval(flagEnabled: boolean, envEnabled: boolean): TerminalApproval {
  if (!flagEnabled) {
    return {
      allowed: false,
      reason: "Terminal access was not requested. Re-run with --allow-terminal after explicit approval."
    };
  }

  if (!envEnabled) {
    return {
      allowed: false,
      reason: "Terminal access is disabled by configuration. Set ALLOW_TERMINAL=1 after explicit approval."
    };
  }

  return {
    allowed: true,
    reason: "Terminal execution is allowed."
  };
}
