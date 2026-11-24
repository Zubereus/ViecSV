export function JobCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-card animate-pulse space-y-4"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 w-full">
          {/* Logo Skeleton */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-md bg-slate-200 shrink-0" />

          {/* Title & Company Skeleton */}
          <div className="space-y-2 w-3/4">
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>

        {/* Bookmark icon Skeleton */}
        <div className="w-5 h-5 bg-slate-200 rounded shrink-0" />
      </div>

      {/* Wage Skeleton */}
      <div className="h-5 bg-slate-200 rounded w-1/3" />

      {/* Chips Skeleton */}
      <div className="flex flex-wrap gap-2 pt-1">
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-6 bg-slate-200 rounded w-28" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>

      {/* Footer line Skeleton */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );
}
