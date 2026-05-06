"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  authReadyAtom,
  isAuthenticatedAtom,
} from "@/features/auth/application/atoms";
import { listMySessions } from "@/features/brainstorm/infrastructure/brainstormApi";
import type { SessionListPage, SessionSummary } from "@/features/brainstorm/domain/types";
import { SkeletonBox } from "@/ui/components/Skeleton";

export default function MyCrewPage() {
  const router = useRouter();
  const ready = useAtomValue(authReadyAtom);
  const isAuth = useAtomValue(isAuthenticatedAtom);

  const [items, setItems] = useState<SessionSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadStarted = useRef(false);

  useEffect(() => {
    if (ready && !isAuth) {
      router.replace("/login?redirect=/my-crew");
    }
  }, [ready, isAuth, router]);

  const loadMore = useCallback(
    async (currentCursor: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const page: SessionListPage = await listMySessions(currentCursor ?? undefined);
        setItems((prev) => (currentCursor ? [...prev, ...page.items] : page.items));
        setCursor(page.nextCursor);
      } catch (err) {
        const message = err instanceof Error ? err.message : "목록 조회 실패";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!ready || !isAuth || initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    void loadMore(null);
  }, [ready, isAuth, loadMore]);

  if (!ready || !isAuth) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <SkeletonBox className="h-8 w-40" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">My Crew</h1>
        <p className="text-sm opacity-70">내가 만든 브레인스토밍 세션 목록.</p>
      </header>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <p className="text-sm opacity-70">아직 세션이 없어요. 홈에서 새 질문을 시작해보세요.</p>
      )}

      <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <Link
              href={`/sessions/${item.id}`}
              className="flex flex-col gap-1 hover:opacity-80"
            >
              <span className="line-clamp-2 text-sm">{item.question}</span>
              <span className="text-xs opacity-60">
                {new Date(item.createdAt).toLocaleString()} · {item.status}
                {item.synthesisPresent ? " · 종합 완료" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {cursor && (
        <button
          type="button"
          onClick={() => void loadMore(cursor)}
          disabled={loading}
          className="self-center rounded border border-current px-4 py-2 text-sm opacity-80 disabled:opacity-50"
        >
          {loading ? "불러오는 중..." : "더 보기"}
        </button>
      )}
    </div>
  );
}
