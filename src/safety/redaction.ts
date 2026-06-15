const secretPatterns = [
  /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  /AIza[0-9A-Za-z\-_]{20,}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b[A-Z0-9_]{2,}\s*=\s*['"]?[A-Za-z0-9_\/+=.-]{8,}['"]?/g
];

export function redactSecrets(content: string): string {
  return secretPatterns.reduce((current, pattern) => current.replace(pattern, "[REDACTED]"), content);
}

export function sanitizeUntrustedContent(content: string): string {
  const withoutSecrets = redactSecrets(content);
  return withoutSecrets
    .split("\n")
    .filter((line) => !/ignore previous instructions|send token|reveal secret/i.test(line))
    .join("\n")
    .trim();
}
