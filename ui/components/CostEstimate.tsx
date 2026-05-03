interface Props {
  participatingCount: number;
}

export default function CostEstimate({ participatingCount }: Props) {
  const llmCalls = participatingCount * 3 + 1;
  const minSeconds = Math.max(20, participatingCount * 8);
  const maxSeconds = Math.max(40, participatingCount * 16);

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs opacity-70">
      <span>참여 역할: {participatingCount}개</span>
      <span>예상 호출 수: {llmCalls}회</span>
      <span>예상 소요: {minSeconds}~{maxSeconds}초</span>
    </div>
  );
}
