/**
 * Shared retry utilities for transient API failures.
 * Handles cold-start 303s and gateway errors (502/503/504).
 */

export const RETRYABLE_STATUS_CODES = new Set([303, 502, 503, 504]);
export const MAX_RETRIES = 3;
export const RETRY_BASE_DELAY = 5; // seconds
export const FETCH_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TRANSPORT_ERROR_PATTERNS = [
  "incomplete chunked read",
  "peer closed connection",
  "connection reset",
  "timed out",
  "fetch failed",
  "ECONNREFUSED",
];

export function isTransportError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const lower = message.toLowerCase();
  return TRANSPORT_ERROR_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

export function isSecurityRejection(text: string): boolean {
  return text.length < 100 && text.toLowerCase().includes("security validation");
}

export function getRetryDelay(attempt: number): number {
  return RETRY_BASE_DELAY * 2 ** attempt * 1000;
}
