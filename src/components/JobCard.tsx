import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Bookmark, Globe, Zap, Sparkles } from "lucide-react";
import type { JobListItem } from "../../shared/types";
import {
  formatWage,
  formatPostedAt,
  formatDays,
  formatShifts,
  getMonogram,
  getReadableTextColor,
} from "../lib/format";

interface JobCardProps {
  job: JobListItem;
}

export function JobCard({ job }: JobCardProps) {
  const monogram = getMonogram(job.company_name);
  const textColor = getReadableTextColor(job.company_color_hex);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ngăn chặn chuyển trang khi bấm nút lưu việc
    e.preventDefault();
    e.stopPropagation();
    // Chức năng lưu việc thực tế sẽ được kết nối ở Phase 4
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group relative block bg-white border border-slate-200/90 rounded-lg p-4 sm:p-5 shadow-card hover:border-slate-300 hover:shadow-elevated transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-700"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Khối Logo Monogram + Tên việc + Doanh nghiệp */}
        <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
          {/* Monogram logo với màu hex xác định của từng công ty */}
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-md flex items-center justify-center font-display font-bold text-sm sm:text-base shrink-0 border border-black/5 shadow-sm transition-transform duration-200 group-hover:scale-105"
            style={{
              backgroundColor: job.company_color_hex || "#0f3d2e",
              color: textColor,
            }}
            aria-hidden="true"
          >
            {monogram}
          </div>

          <div className="min-w-0">
            <h2 className="font-display font-semibold text-base sm:text-lg text-slate-900 group-hover:text-brand-700 transition-colors leading-snug line-clamp-2">
              {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 truncate">
              {job.company_name}
            </p>
          </div>
        </div>

        {/* Nút lưu việc (Bookmark) */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-brand-700 hover:bg-slate-100 rounded-md transition-colors shrink-0 focus-visible:outline-brand-700"
          aria-label={`Lưu tin tuyển dụng: ${job.title}`}
          title="Lưu tin tuyển dụng (Sẽ kích hoạt ở Phase 4)"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Mức lương nổi bật - Điểm nhấn thị giác quan trọng nhất */}
      <div className="mt-3.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-base sm:text-lg font-bold text-brand-accent tabular-nums tracking-tight">
          {formatWage(job.wage_per_hour)}
        </span>
        {job.wage_note && (
          <span className="text-xs text-slate-500 font-normal">
            ({job.wage_note})
          </span>
        )}
      </div>

      {/* Thông tin lịch làm, địa điểm và ca trực theo dạng khối quét nhanh */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        {/* Địa điểm / Hình thức */}
        <span className="inline-flex items-center gap-1 bg-surface-subtle px-2.5 py-1 rounded border border-slate-200/70 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{job.district}</span>
        </span>

        {job.work_type === "tu-xa" && (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2.5 py-1 rounded border border-sky-200 font-medium">
            <Globe className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Từ xa / Online</span>
          </span>
        )}

        {job.work_type === "linh-hoat" && (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded border border-indigo-200 font-medium">
            <span>Linh hoạt</span>
          </span>
        )}

        {/* Ngày làm việc */}
        <span className="inline-flex items-center gap-1 bg-surface-subtle px-2.5 py-1 rounded border border-slate-200/70">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{formatDays(job.days)}</span>
        </span>

        {/* Ca làm việc */}
        <span className="inline-flex items-center gap-1 bg-surface-subtle px-2.5 py-1 rounded border border-slate-200/70">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{formatShifts(job.shifts)}</span>
        </span>
      </div>

      {/* Nhãn trạng thái (Badges) và Thời gian đăng */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          {job.is_urgent && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-semibold text-[11px]">
              <Zap className="w-3 h-3 text-rose-600 fill-rose-600" />
              Tuyển gấp
            </span>
          )}

          {!job.experience_required && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Không cần kinh nghiệm
            </span>
          )}

          <span className="inline-block text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
            {job.category}
          </span>
        </div>

        <time
          dateTime={job.posted_at}
          className="text-slate-400 text-[11px] shrink-0 ml-2"
        >
          {formatPostedAt(job.posted_at)}
        </time>
      </div>
    </Link>
  );
}
