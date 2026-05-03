"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import {
  questionAtom,
  selectedRoleIdsAtom,
} from "@/features/brainstorm/application/atoms";
import {
  usePersonas,
  useStartSession,
} from "@/features/brainstorm/application/hooks";
import { pushRecentSession } from "@/features/brainstorm/infrastructure/recentSessions";
import CostEstimate from "@/ui/components/CostEstimate";
import QuestionInput from "@/ui/components/QuestionInput";
import RecentSessions from "@/ui/components/RecentSessions";
import RoleCard from "@/ui/components/RoleCard";
import { SkeletonRoleCardGrid } from "@/ui/components/Skeleton";

export default function HomePage() {
  const router = useRouter();
  const [question, setQuestion] = useAtom(questionAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedRoleIdsAtom);
  const { personas, error: personasError } = usePersonas();
  const { start, submitting, error: startError } = useStartSession();

  useEffect(() => {
    if (!personas || selectedIds.length > 0) return;
    setSelectedIds(personas.filter((p) => p.is_default_selected).map((p) => p.id));
  }, [personas, selectedIds.length, setSelectedIds]);

  const participatingCount = useMemo(() => {
    if (!personas) return 0;
    const synthIds = new Set(personas.filter((p) => p.is_synthesizer).map((p) => p.id));
    return selectedIds.filter((id) => !synthIds.has(id)).length;
  }, [personas, selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed || participatingCount === 0) return;
    const sessionId = await start(trimmed, selectedIds);
    if (sessionId) {
      pushRecentSession({ id: sessionId, question: trimmed });
      router.push(`/sessions/${sessionId}`);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Roundtable</h1>
        <p className="text-sm opacity-70">
          여러 LLM이 같은 질문에 독립적으로 답하고, 자기비판한 뒤, 답을 보완해 종합합니다.
          기획·제품 검증 도메인 MVP.
        </p>
      </header>

      <section className="space-y-3">
        <label className="text-sm font-medium">질문</label>
        <QuestionInput
          value={question}
          onChange={setQuestion}
          placeholder="예: 이 SaaS 아이디어의 시장성과 실행 가능성은?"
          disabled={submitting}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium">참여 역할</label>
          <CostEstimate participatingCount={participatingCount} />
        </div>
        {personasError && (
          <p className="text-sm text-red-600 dark:text-red-400">{personasError.message}</p>
        )}
        {!personas && !personasError && <SkeletonRoleCardGrid />}
        {personas && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {personas.map((p) => (
              <RoleCard
                key={p.id}
                persona={p}
                selected={selectedIds.includes(p.id)}
                disabled={submitting}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {startError && (
        <p className="text-sm text-red-600 dark:text-red-400">{startError.message}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !question.trim() || participatingCount === 0}
        className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {submitting ? "시작 중..." : "브레인스토밍 시작"}
      </button>

      <RecentSessions />
    </div>
  );
}
