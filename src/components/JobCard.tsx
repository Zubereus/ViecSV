import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Bookmark, BookmarkCheck, Globe, Zap, Sparkles, X } from "lucide-react";
import type { JobListItem } from "../../shared/types";
import { getCategoryDisplayName } from "../../shared/constants";
import { formatWage, formatPostedAt, formatDays, formatShifts } from "../lib/format";
import { getJobCategoryImage } from "../lib/jobCategoryImages";
import { useAuth } from "../lib/AuthContext";
import { useSavedJobs } from "../lib/SavedJobsContext";

interface JobCardProps {
  job: JobListItem;
  onUnsaved?: (jobId: string) => void;
  previewMode?: boolean;
}

export function JobCard({ job, onUnsaved }: JobCardProps) {
  const categoryImage = getJobCategoryImage(job.category);
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const saved = user?.role === "student" ? isSaved(job.id) : false;

  useEffect(() => {
    if (!bookmarkError) return;
    const timer = window.setTimeout(() => setBookmarkError(null), 3000);
    return () => window.clearTimeout(timer);
  }, [bookmarkError]);

  const handleBookmarkClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (user.role === "employer") {
      return;
    }

    setIsToggling(true);
    try {
      await toggleSave(job.id);
      if (saved && onUnsaved) {
        onUnsaved(job.id);
      }
    } catch (error) {
      setBookmarkError(error instanceof Error ? error.message : "Không thể cập nhật việc đã lưu. Vui lòng thử lại.");
    } finally {
      setIsToggling(false);
    }
  };

  const goToAuth = (path: "/login" | "/register") => {
    navigate(path, { state: { from: location } });
  };

  const bookmarkTitle = !user
    ? "Đăng nhập để lưu việc làm"
    : user.role === "employer"
      ? "Nhà tuyển dụng không thể lưu việc làm"
      : saved
        ? "Bỏ lưu việc làm"
        : "Lưu việc làm";

  return (
    <div className="relative">
      <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-card transition-all duration-200 hover:border-slate-300 hover:shadow-elevated sm:flex-row">
        <div className="relative h-24 shrink-0 overflow-hidden bg-surface-subtle sm:h-auto sm:min-h-[206px] sm:w-36 md:w-40">
          <img
            src={categoryImage.src}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${categoryImage.position}`}
          />
          <div className="pointer-events-none absolute inset-0 border-b border-black/5 sm:border-b-0 sm:border-r" />
        </div>

        <div className="relative min-w-0 flex-1">
          <Link
            to={`/jobs/${job.id}`}
            state={{ fromSearch: location.search }}
            className="block h-full p-4 pr-14 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-700 sm:p-5 sm:pr-14"
          >
            <h2 className="font-display text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-700 sm:text-lg line-clamp-2">
              {job.title}
            </h2>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-600 sm:text-sm">{job.company_name}</p>

            <div className="mt-3.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-base font-bold tracking-tight text-brand-accent-dark tabular-nums sm:text-lg">
                {formatWage(job.wage_per_hour)}
              </span>
              {job.wage_note && <span className="text-xs font-normal text-slate-600">({job.wage_note})</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded border border-slate-200/70 bg-surface-subtle px-2.5 py-1 font-medium">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <span>{job.district}</span>
              </span>

              {job.work_type === "tu-xa" && (
                <span className="inline-flex items-center gap-1 rounded border border-brand-200 bg-brand-50 px-2.5 py-1 font-medium text-brand-800">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-brand-700" />
                  <span>Từ xa / Trực tuyến</span>
                </span>
              )}

              {job.work_type === "linh-hoat" && (
                <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-surface-subtle px-2.5 py-1 font-medium text-slate-700">
                  <span>Linh hoạt</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded border border-slate-200/70 bg-surface-subtle px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <span>{formatDays(job.days)}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded border border-slate-200/70 bg-surface-subtle px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <span>{formatShifts(job.shifts)}</span>
              </span>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-1.5">
                {job.is_urgent && (
                  <span className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                    <Zap className="h-3 w-3 fill-rose-600 text-rose-600" />
                    Tuyển gấp
                  </span>
                )}
                {!job.experience_required && (
                  <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    Không cần kinh nghiệm
                  </span>
                )}
                <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{getCategoryDisplayName(job.category)}</span>
              </div>

              <time dateTime={job.posted_at} className="ml-2 shrink-0 text-[11px] text-slate-600">
                {formatPostedAt(job.posted_at)}
              </time>
            </div>
          </Link>

          {user?.role !== "employer" && (
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={isToggling}
              className={`absolute right-3 top-3 z-10 rounded-md p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-brand-700 ${
                saved ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "text-slate-600 hover:bg-slate-100 hover:text-brand-700"
              } disabled:opacity-60`}
              aria-label={saved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
              aria-pressed={saved}
              title={bookmarkTitle}
            >
              {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
          )}
        </div>
      </article>

      {showLoginPrompt && (
        <div className="absolute right-3 top-12 z-20 w-64 rounded-md border border-slate-200 bg-white shadow-dropdown p-3" role="dialog" aria-label="Yêu cầu đăng nhập để lưu việc làm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-slate-700">Vui lòng đăng nhập để lưu việc làm</p>
            <button type="button" onClick={() => setShowLoginPrompt(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded" aria-label="Đóng thông báo">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={() => goToAuth("/login")} className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-md">Đăng nhập</button>
            <button type="button" onClick={() => goToAuth("/register")} className="flex-1 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50">Đăng ký</button>
          </div>
        </div>
      )}

      {bookmarkError && (
        <div className="absolute left-3 right-3 -bottom-2 translate-y-full z-20 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-xs px-3 py-2 shadow-sm" role="status">
          {bookmarkError}
        </div>
      )}
    </div>
  );
}
