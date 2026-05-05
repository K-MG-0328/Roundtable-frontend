"use client";

interface Props {
  label?: string;
}

export default function PrintButton({ label = "PDF로 저장" }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      title="브라우저 인쇄로 PDF 저장"
      className="text-xs underline-offset-2 hover:underline"
    >
      {label}
    </button>
  );
}
