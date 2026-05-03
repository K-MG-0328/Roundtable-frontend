import Link from "next/link";

import type { SessionError } from "@/features/brainstorm/domain/errors";

interface Props {
  error: SessionError;
}

export default function SessionErrorBanner({ error }: Props) {
  // not_found / expired는 같은 세션 ID로 재시도 의미 없음 → 새 질문 액션 제공
  // network는 자동 재시도 중이라는 신호 + 수동 새로고침 안내
  // unknown은 메시지만 보여주고 자동 재시도
  const isTerminal = error.kind === "not_found" || error.kind === "expired";
  const tone =
    error.kind === "network"
      ? "border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      : "border-red-600/40 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200";

  return (
    <div className={`space-y-2 rounded-lg border p-4 ${tone}`}>
      <p className="text-sm font-medium">{error.message}</p>
      {error.kind === "network" && (
        <p className="text-xs opacity-80">자동으로 재시도 중입니다.</p>
      )}
      {isTerminal && (
        <Link
          href="/"
          className="inline-block text-xs font-medium underline-offset-2 hover:underline"
        >
          → 새 질문으로 시작하기
        </Link>
      )}
    </div>
  );
}
