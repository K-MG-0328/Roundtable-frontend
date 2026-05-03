"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import {
  usePersonas,
  usePollSession,
} from "@/features/brainstorm/application/hooks";
import CopySessionId from "@/ui/components/CopySessionId";
import RoleOpinionCard from "@/ui/components/RoleOpinionCard";
import SessionErrorBanner from "@/ui/components/SessionErrorBanner";
import { SkeletonSessionPage } from "@/ui/components/Skeleton";
import StageProgress from "@/ui/components/StageProgress";
import SynthesisCard from "@/ui/components/SynthesisCard";

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = typeof params?.id === "string" ? params.id : null;

  const { session, error: pollError } = usePollSession(sessionId);
  const { personas } = usePersonas();

  const personaById = useMemo(() => {
    const map = new Map<string, NonNullable<typeof personas>[number]>();
    if (personas) for (const p of personas) map.set(p.id, p);
    return map;
  }, [personas]);

  const participatingIds = useMemo(() => {
    if (!session) return [];
    return session.selected_role_ids.filter((id) => {
      const p = personaById.get(id);
      return p && !p.is_synthesizer;
    });
  }, [session, personaById]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <header className="flex items-baseline justify-between">
        <Link href="/" className="text-xs underline-offset-2 hover:underline">
          ← 새 질문
        </Link>
        {session && <CopySessionId sessionId={session.id} />}
      </header>

      {pollError && <SessionErrorBanner error={pollError} />}

      {!session && !pollError && <SkeletonSessionPage />}

      {session && (
        <>
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">질문</h2>
            <p className="text-base leading-relaxed">{session.question}</p>
          </section>

          <StageProgress status={session.status} currentStage={session.current_stage} />

          {session.status === "FAILED" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              실패: {session.error_message ?? "알 수 없는 오류"}
            </p>
          )}

          {session.synthesis && <SynthesisCard synthesis={session.synthesis} />}

          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">
              역할별 의견
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {participatingIds.map((roleId) => {
                const persona = personaById.get(roleId);
                if (!persona) return null;
                const responses = session.responses.filter((r) => r.role_id === roleId);
                return (
                  <RoleOpinionCard
                    key={roleId}
                    persona={persona}
                    responses={responses}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
