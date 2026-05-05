"use client";

import { useState } from "react";

interface Props {
  sessionId: string;
}

export default function ShareLinkButton({ sessionId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/sessions/${sessionId}`;
      await navigator.clipboard.writeText(url);
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
      title={copied ? "복사됨" : "세션 공유 링크 복사"}
      className="text-xs underline-offset-2 hover:underline"
    >
      {copied ? "복사됨 ✓" : "공유 링크 복사"}
    </button>
  );
}
