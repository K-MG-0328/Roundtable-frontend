"use client";

import { useState } from "react";

interface Props {
  sessionId: string;
}

export default function CopySessionId({ sessionId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API 미지원/거부된 경우 — 조용히 무시
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "복사됨" : "전체 ID 복사"}
      className="text-xs opacity-60 transition hover:opacity-100"
    >
      세션 ID: {sessionId.slice(0, 8)}…{" "}
      <span aria-hidden className="ml-0.5">
        {copied ? "✓" : "⧉"}
      </span>
    </button>
  );
}
