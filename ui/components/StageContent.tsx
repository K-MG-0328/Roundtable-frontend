import type { Stage } from "@/features/brainstorm/domain/types";

type Content = Record<string, unknown>;

interface Props {
  stage: Stage;
  content: Content;
}

export default function StageContent({ stage, content }: Props) {
  switch (stage) {
    case "GENERATION":
      return <GenerationView content={content} />;
    case "SELF_CRITIQUE":
      return <CritiqueView content={content} />;
    case "REVISION":
      return <RevisionView content={content} />;
    case "SYNTHESIS":
      // 종합은 보통 SynthesisCard가 처리. 여기서는 fallback.
      return <RawView content={content} />;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h5 className="text-[11px] font-semibold uppercase tracking-wide opacity-60">{label}</h5>
      {children}
    </div>
  );
}

function ListItems({ items }: { items: unknown[] }) {
  if (items.length === 0) {
    return <p className="text-xs opacity-50">—</p>;
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
      ))}
    </ul>
  );
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : JSON.stringify(v);
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function GenerationView({ content }: { content: Content }) {
  return (
    <div className="space-y-3">
      {content.core_claim != null && (
        <Field label="핵심 주장">
          <p className="text-sm leading-relaxed">{asString(content.core_claim)}</p>
        </Field>
      )}
      {content.evidence != null && (
        <Field label="근거">
          <ListItems items={asArray(content.evidence)} />
        </Field>
      )}
      {content.assumptions != null && (
        <Field label="가정">
          <ListItems items={asArray(content.assumptions)} />
        </Field>
      )}
      {content.limits != null && (
        <Field label="한계">
          <ListItems items={asArray(content.limits)} />
        </Field>
      )}
      {Object.keys(content).length === 0 && <RawView content={content} />}
    </div>
  );
}

function CritiqueView({ content }: { content: Content }) {
  return (
    <div className="space-y-3">
      {content.weakest_argument != null && (
        <Field label="가장 약한 논거">
          <p className="text-sm leading-relaxed">{asString(content.weakest_argument)}</p>
        </Field>
      )}
      {content.unverified_assumptions != null && (
        <Field label="검증되지 않은 전제">
          <ListItems items={asArray(content.unverified_assumptions)} />
        </Field>
      )}
      {content.counter_examples != null && (
        <Field label="반례">
          <ListItems items={asArray(content.counter_examples)} />
        </Field>
      )}
      {content.missing_perspectives != null && (
        <Field label="빠진 관점">
          <ListItems items={asArray(content.missing_perspectives)} />
        </Field>
      )}
      {Object.keys(content).length === 0 && <RawView content={content} />}
    </div>
  );
}

function RevisionView({ content }: { content: Content }) {
  const rejected = asArray(content.rejected_critiques);
  return (
    <div className="space-y-3">
      {content.revised_core_claim != null && (
        <Field label="수정된 핵심 주장">
          <p className="text-sm leading-relaxed">{asString(content.revised_core_claim)}</p>
        </Field>
      )}
      {content.revised_evidence != null && (
        <Field label="보완된 근거">
          <ListItems items={asArray(content.revised_evidence)} />
        </Field>
      )}
      {content.accepted_critiques != null && (
        <Field label="수용한 비판">
          <ListItems items={asArray(content.accepted_critiques)} />
        </Field>
      )}
      {rejected.length > 0 && (
        <Field label="거부한 비판">
          <ul className="space-y-2 text-sm leading-relaxed">
            {rejected.map((item, i) => {
              if (
                item &&
                typeof item === "object" &&
                "critique" in item &&
                "reason" in item
              ) {
                const obj = item as { critique: unknown; reason: unknown };
                return (
                  <li key={i} className="space-y-0.5">
                    <p>비판: {asString(obj.critique)}</p>
                    <p className="opacity-70">근거: {asString(obj.reason)}</p>
                  </li>
                );
              }
              return <li key={i}>{asString(item)}</li>;
            })}
          </ul>
        </Field>
      )}
      {content.remaining_uncertainty != null && (
        <Field label="남은 불확실성">
          <ListItems items={asArray(content.remaining_uncertainty)} />
        </Field>
      )}
      {Object.keys(content).length === 0 && <RawView content={content} />}
    </div>
  );
}

function RawView({ content }: { content: Content }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/[0.04] p-3 text-xs leading-relaxed dark:bg-white/[0.04]">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
