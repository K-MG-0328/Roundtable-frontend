import type { Persona } from "@/features/brainstorm/domain/types";

interface Props {
  persona: Persona;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

const PROVIDER_LABELS: Record<Persona["provider"], string> = {
  ANTHROPIC: "Claude",
  OPENAI: "GPT",
  GOOGLE: "Gemini",
};

export default function RoleCard({ persona, selected, disabled, onToggle }: Props) {
  const isLocked = disabled || persona.is_synthesizer;
  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onToggle}
      disabled={isLocked}
      aria-pressed={selected}
      className={[
        "flex flex-col gap-2 rounded-xl border p-4 text-left transition",
        selected
          ? "border-black/60 bg-black/5 dark:border-white/60 dark:bg-white/5"
          : "border-black/10 hover:border-black/30 dark:border-white/15 dark:hover:border-white/30",
        isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{persona.name}</h3>
        <span className="text-[11px] uppercase tracking-wide opacity-60">
          {PROVIDER_LABELS[persona.provider]}
        </span>
      </div>
      <p className="text-xs leading-relaxed opacity-80">{persona.description}</p>
      <p className="text-[11px] opacity-60">적합: {persona.suitable_for}</p>
      {persona.is_synthesizer && (
        <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
          종합 단계 자동 포함
        </p>
      )}
    </button>
  );
}
