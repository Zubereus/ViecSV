export function JobCardSkeleton() {
  return (
    <div
      className="bg-white border border-slate-200/80 rounded-lg shadow-card animate-pulse overflow-hidden sm:flex"
      aria-hidden="true"
    >
      <div className="h-24 sm:h-auto sm:min-h-[206px] sm:w-36 md:w-40 shrink-0 bg-slate-200" />

      <div className="flex-1 p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 w-3/4">
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="w-5 h-5 bg-slate-200 rounded shrink-0" />
        </div>

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
    </div>
  );
}
