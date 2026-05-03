interface BoxProps {
  className?: string;
}

export function SkeletonBox({ className = "" }: BoxProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-black/5 dark:bg-white/10 ${className}`}
    />
  );
}

export function SkeletonRoleCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-black/10 p-4 dark:border-white/15"
        >
          <SkeletonBox className="h-4 w-1/3" />
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonSessionPage() {
  return (
    <div className="space-y-6">
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-9 w-full rounded-full" />
      <SkeletonBox className="h-32 w-full" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-black/10 p-4 dark:border-white/15"
          >
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
