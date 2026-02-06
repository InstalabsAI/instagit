/**
 * KITT scanner animation — directional gradient trail (comet effect).
 * Direct port from Python implementation.
 */

const WIDTH = 16;
const SHADES = ["█", "▓", "▒"]; // Bright to dim
const BG = "░";

function makeKittFrame(pos: number, direction: number): string {
  const chars = Array(WIDTH).fill(BG);
  for (let offset = 0; offset < SHADES.length; offset++) {
    if (offset === 0) {
      chars[pos] = SHADES[offset]; // Bright center
    } else {
      // Trail behind: if moving right (direction=1), trail is on left (pos - offset)
      // If moving left (direction=-1), trail is on right (pos + offset)
      const trailPos = pos - offset * direction;
      if (trailPos >= 0 && trailPos < WIDTH) {
        chars[trailPos] = SHADES[offset];
      }
    }
  }
  return chars.join("");
}

// Generate frames with ease-in-out (slower at edges, faster in middle)
const forward = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15];
const backward = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0];

export const LOGO_FRAMES: string[] = [];
for (const i of forward) {
  LOGO_FRAMES.push(makeKittFrame(i, 1)); // Moving right
}
for (const i of backward.slice(1)) {
  // Skip first to avoid double frame
  LOGO_FRAMES.push(makeKittFrame(i, -1)); // Moving left
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
}

export function formatTokens(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

export function createProgressTracker(): import("./types.js").ProgressTracker {
  return {
    startTime: Date.now() / 1000,
    frameIndex: 0,
    inputTokens: 0,
    outputTokens: 0,
    displayedTokens: 0,
    lastStatus: "Connecting...",
    done: false,
  };
}

export function nextFrame(tracker: import("./types.js").ProgressTracker): string {
  const frame = LOGO_FRAMES[tracker.frameIndex % LOGO_FRAMES.length];
  tracker.frameIndex++;
  return frame;
}

export function elapsed(tracker: import("./types.js").ProgressTracker): string {
  return formatDuration(Date.now() / 1000 - tracker.startTime);
}

export function animateTokens(tracker: import("./types.js").ProgressTracker): number {
  const actual = tracker.inputTokens + tracker.outputTokens;
  if (tracker.displayedTokens < actual) {
    const step = Math.max(50, Math.floor((actual - tracker.displayedTokens) / 20));
    tracker.displayedTokens = Math.min(tracker.displayedTokens + step, actual);
  }
  return tracker.displayedTokens;
}

export function formatMessage(
  tracker: import("./types.js").ProgressTracker,
  status?: string,
  tokens?: { input?: number; output?: number }
): string {
  if (status) {
    tracker.lastStatus = status;
  }
  if (tokens) {
    if (tokens.input !== undefined) tracker.inputTokens = tokens.input;
    if (tokens.output !== undefined) tracker.outputTokens = tokens.output;
  }

  const parts = [nextFrame(tracker), elapsed(tracker)];

  const displayed = animateTokens(tracker);
  if (displayed > 0) {
    parts.push(`${formatTokens(displayed)} tokens`);
  }

  if (tracker.lastStatus) {
    parts.push(tracker.lastStatus);
  }

  return parts.join(" · ");
}
