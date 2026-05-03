"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createSession,
  getSession,
  listPersonas,
} from "@/features/brainstorm/infrastructure/brainstormApi";
import {
  classifyError,
  type SessionError,
} from "@/features/brainstorm/domain/errors";
import type {
  BrainstormSession,
  Persona,
} from "@/features/brainstorm/domain/types";

const POLL_INTERVAL_MS = 2000;

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [error, setError] = useState<SessionError | null>(null);

  useEffect(() => {
    let cancelled = false;
    listPersonas()
      .then((data) => {
        if (!cancelled) setPersonas(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(classifyError(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { personas, error };
}

export function useStartSession() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<SessionError | null>(null);

  const start = useCallback(
    async (question: string, selectedRoleIds: string[]): Promise<string | null> => {
      setSubmitting(true);
      setError(null);
      try {
        const { session_id } = await createSession(question, selectedRoleIds);
        return session_id;
      } catch (e: unknown) {
        setError(classifyError(e));
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { start, submitting, error };
}

export function usePollSession(sessionId: string | null) {
  const [session, setSession] = useState<BrainstormSession | null>(null);
  const [error, setError] = useState<SessionError | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;
    cancelledRef.current = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelledRef.current) return;
      try {
        const data = await getSession(sessionId);
        if (cancelledRef.current) return;
        setSession(data);
        // 직전 일시적 에러가 회복된 경우 배너를 내린다
        setError(null);
        if (data.status === "COMPLETED" || data.status === "FAILED") return;
        timeoutId = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (e: unknown) {
        if (cancelledRef.current) return;
        const classified = classifyError(e);
        setError(classified);
        // not_found / expired는 재시도해도 같은 결과 → 폴링 종료
        // network / unknown은 잠시 후 재시도
        if (classified.kind === "network" || classified.kind === "unknown") {
          timeoutId = setTimeout(tick, POLL_INTERVAL_MS);
        }
      }
    };

    void tick();

    return () => {
      cancelledRef.current = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [sessionId]);

  return { session, error };
}
