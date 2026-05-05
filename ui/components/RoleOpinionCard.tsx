"use client";

import { useState } from "react";

import {
  STAGE_LABELS,
  STAGE_ORDER,
  type Persona,
  type RoleResponse,
  type Stage,
} from "@/features/brainstorm/domain/types";
import StageContent from "@/ui/components/StageContent";

interface Props {
  persona: Persona;
  responses: RoleResponse[];
}

const VISIBLE_STAGES: Stage[] = STAGE_ORDER.filter((s) => s !== "SYNTHESIS");

export default function RoleOpinionCard({ persona, responses }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>("REVISION");

  const byStage = new Map<Stage, RoleResponse>();
  for (const r of responses) byStage.set(r.stage, r);

  const current = byStage.get(activeStage) ?? byStage.get("GENERATION") ?? null;
  const isFailed = current?.is_failed ?? false;

  return (
    <article className="space-y-3 rounded-xl border border-black/15 p-4 dark:border-white/15">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{persona.name}</h3>
          {current && <p className="text-[11px] opacity-60">{current.model}</p>}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs underline-offset-2 hover:underline"
        >
          {expanded ? "접기" : "단계별 보기 (자기비판·수정안)"}
        </button>
      </header>

      {!current && (
        <p className="text-xs opacity-60">아직 응답이 도착하지 않았습니다.</p>
      )}

      {current && expanded && (
        <>
          <nav className="flex gap-1.5 text-[11px]">
            {VISIBLE_STAGES.map((stage) => {
              const has = byStage.has(stage);
              const active = stage === activeStage;
              return (
                <button
                  key={stage}
                  type="button"
                  disabled={!has}
                  onClick={() => setActiveStage(stage)}
                  className={[
                    "rounded-full border px-2.5 py-1",
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/20 hover:border-black/40 dark:border-white/20 dark:hover:border-white/40",
                    !has ? "cursor-not-allowed opacity-40" : "",
                  ].join(" ")}
                >
                  {STAGE_LABELS[stage]}
                </button>
              );
            })}
          </nav>

          {isFailed ? (
            <p className="text-xs text-red-600 dark:text-red-400">
              실패: {current.error_message ?? "알 수 없는 오류"}
            </p>
          ) : (
            <StageContent stage={current.stage} content={current.content} />
          )}
        </>
      )}

      {current && !expanded && current.content && (
        <p className="line-clamp-2 text-xs leading-relaxed opacity-80">
          {summarize(current.content)}
        </p>
      )}
    </article>
  );
}

function summarize(content: Record<string, unknown>): string {
  const keys = ["revised_core_claim", "core_claim", "weakest_argument", "summary"];
  for (const k of keys) {
    const v = content[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return JSON.stringify(content).slice(0, 140);
}
