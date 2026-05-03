"use client";

const STORAGE_KEY = "roundtable.recentSessions";
const MAX = 5;

export const RECENT_SESSIONS_EVENT = "roundtable:recent-sessions-updated";

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(RECENT_SESSIONS_EVENT));
}

export interface RecentSession {
  id: string;
  question: string;
  startedAt: string;
}

function readAll(): RecentSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentSession =>
        item != null &&
        typeof item === "object" &&
        typeof (item as RecentSession).id === "string" &&
        typeof (item as RecentSession).question === "string" &&
        typeof (item as RecentSession).startedAt === "string",
    );
  } catch {
    return [];
  }
}

export function listRecentSessions(): RecentSession[] {
  return readAll();
}

export function pushRecentSession(entry: Omit<RecentSession, "startedAt">): void {
  if (typeof window === "undefined") return;
  const existing = readAll().filter((s) => s.id !== entry.id);
  const next: RecentSession[] = [
    { ...entry, startedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyChange();
  } catch {
    // quota / private mode 등 — 무시
  }
}

export function clearRecentSessions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    notifyChange();
  } catch {
    // ignore
  }
}
