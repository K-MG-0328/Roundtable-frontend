import type { Synthesis } from "@/features/brainstorm/domain/types";

interface Props {
  synthesis: Synthesis;
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h4>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function SynthesisCard({ synthesis }: Props) {
  return (
    <article className="space-y-5 rounded-2xl border border-black/15 bg-black/[0.02] p-6 dark:border-white/15 dark:bg-white/[0.02] print:break-inside-avoid print:bg-transparent">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">종합 결과</h2>
        {synthesis.summary && <p className="text-sm leading-relaxed">{synthesis.summary}</p>}
      </header>
      <Section title="합의" items={synthesis.consensus} />
      <Section title="다수 의견" items={synthesis.majority_view} />
      <Section title="남은 쟁점" items={synthesis.open_disputes} />
      <Section title="권고" items={synthesis.recommendations} />
    </article>
  );
}
