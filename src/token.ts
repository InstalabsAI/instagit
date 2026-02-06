/**
 * Token management — env var / stored file / auto-register.
 * Shares ~/.instagit/token.json with the Python MCP server.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { getMachineFingerprint } from "./fingerprint.js";

const CONFIG_DIR = join(homedir(), ".instagit");
const TOKEN_FILE = join(CONFIG_DIR, "token.json");

export function getStoredToken(): string | null {
  if (!existsSync(TOKEN_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(TOKEN_FILE, "utf-8"));
    return data.token ?? null;
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(TOKEN_FILE, JSON.stringify({ token }));
}

export function clearStoredToken(): void {
  if (existsSync(TOKEN_FILE)) {
    unlinkSync(TOKEN_FILE);
  }
}

/**
 * Get the API token from environment or storage.
 *
 * Priority:
 * 1. INSTAGIT_API_KEY env var (paid users)
 * 2. Stored token from ~/.instagit/token.json
 * 3. null (will trigger auto-registration)
 */
export function getOrCreateToken(): string | null {
  const apiKey = process.env.INSTAGIT_API_KEY;
  if (apiKey) return apiKey;
  return getStoredToken();
}

/**
 * Register a new anonymous token with the API.
 */
export async function registerAnonymousToken(apiUrl: string): Promise<string | null> {
  try {
    const fingerprint = getMachineFingerprint();
    const response = await fetch(`${apiUrl}/v1/auth/anonymous`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    });

    if (response.ok) {
      const data = (await response.json()) as { token?: string };
      const token = data.token;
      if (token) {
        storeToken(token);
        return token;
      }
    }
    // 429 = IP limit reached, or other error
    return null;
  } catch {
    return null;
  }
}
