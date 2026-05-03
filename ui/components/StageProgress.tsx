import {
  STAGE_LABELS,
  STAGE_ORDER,
  type SessionStatus,
  type Stage,
} from "@/features/brainstorm/domain/types";

interface Props {
  status: SessionStatus;
  currentStage: Stage | null;
}

export default function StageProgress({ status, currentStage }: Props) {
  const currentIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;
  const completed = status === "COMPLETED";

  return (
    <ol className="flex flex-wrap gap-2 text-xs">
      {STAGE_ORDER.map((stage, idx) => {
        const isDone = completed || (currentIndex !== -1 && idx < currentIndex);
        const isActive = !completed && idx === currentIndex;
        const mark = isDone ? "✓" : isActive ? "◐" : "○";
        const cls = isDone
          ? "border-green-600/40 text-green-700 dark:text-green-400"
          : isActive
            ? "border-amber-600/40 text-amber-700 dark:text-amber-400"
            : "border-black/15 opacity-50 dark:border-white/15";
        return (
          <li
            key={stage}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${cls}`}
          >
            <span>{mark}</span>
            <span>{STAGE_LABELS[stage]}</span>
          </li>
        );
      })}
    </ol>
  );
}
