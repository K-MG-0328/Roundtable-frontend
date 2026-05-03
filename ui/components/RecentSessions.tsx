"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  listRecentSessions,
  RECENT_SESSIONS_EVENT,
  type RecentSession,
} from "@/features/brainstorm/infrastructure/recentSessions";

const EMPTY: RecentSession[] = [];

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(RECENT_SESSIONS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RECENT_SESSIONS_EVENT, callback);
  };
}

// useSyncExternalStore는 동일 참조 비교를 하므로 변경 없을 때 같은 인스턴스를 돌려줘야 한다.
let cached: RecentSession[] = EMPTY;
let cachedSerialized = "";

function getSnapshot(): RecentSession[] {
  const items = listRecentSessions();
  const serialized = JSON.stringify(items);
  if (serialized === cachedSerialized) return cached;
  cached = items;
  cachedSerialized = serialized;
  return cached;
}

function getServerSnapshot(): RecentSession[] {
  return EMPTY;
}

export default function RecentSessions() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (items.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">
        최근 세션
      </h2>
      <ul className="divide-y divide-black/5 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/15">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/sessions/${item.id}`}
              className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm transition hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            >
              <span className="line-clamp-1 flex-1">{item.question}</span>
              <span className="shrink-0 text-[11px] opacity-50">
                {formatRelative(item.startedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "방금";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}분 전`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}시간 전`;
  return `${Math.floor(ms / 86_400_000)}일 전`;
}
