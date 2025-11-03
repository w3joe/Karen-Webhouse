import { RoastSession } from "../types";

// In-memory session store (for MVP - consider Redis for production)
// Use global to persist across hot reloads in development
const globalForSessions = global as typeof globalThis & {
  sessions?: Map<string, RoastSession>;
  cleanupInterval?: NodeJS.Timeout;
};

const sessions: Map<string, RoastSession> =
  globalForSessions.sessions || new Map();

if (process.env.NODE_ENV !== "production") {
  globalForSessions.sessions = sessions;
}

export const sessionStore = {
  create(sessionId: string, data: Partial<RoastSession>): void {
    sessions.set(sessionId, {
      sessionId,
      status: "processing",
      progress: 0,
      timestamp: Date.now(),
      ...data,
    } as RoastSession);
  },

  get(sessionId: string): RoastSession | undefined {
    return sessions.get(sessionId);
  },

  update(sessionId: string, data: Partial<RoastSession>): void {
    const existing = sessions.get(sessionId);
    if (existing) {
      sessions.set(sessionId, { ...existing, ...data });
    }
  },

  delete(sessionId: string): void {
    sessions.delete(sessionId);
  },

  // Clean up old sessions (older than 1 hour)
  cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.timestamp && session.timestamp < oneHourAgo) {
        sessions.delete(sessionId);
      }
    }
  },
};

// Run cleanup every 15 minutes (only start interval once)
if (!globalForSessions.cleanupInterval) {
  const cleanupInterval = setInterval(
    () => sessionStore.cleanup(),
    15 * 60 * 1000
  );
  if (process.env.NODE_ENV !== "production") {
    globalForSessions.cleanupInterval = cleanupInterval;
  }
}
