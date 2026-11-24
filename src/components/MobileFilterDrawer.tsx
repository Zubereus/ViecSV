import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { JobFiltersPanel } from "./JobFiltersPanel";
import type { JobFilters } from "../lib/filterParams";
import type { JobMetaResponse } from "../../shared/types";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFilters;
  meta: JobMetaResponse | null;
  onFilterChange: (newFilters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  activeCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  meta,
  onFilterChange,
  onResetFilters,
  activeCount,
}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Khóa cuộn trang và lắng nghe phím Esc để đóng
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus vào drawer khi mở
    drawerRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Bộ lọc tìm kiếm việc làm"
    >
      {/* Lớp phủ mờ backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Khung Bottom Sheet trượt lên */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="relative bg-white w-full rounded-t-2xl max-h-[85vh] flex flex-col shadow-dropdown focus:outline-none"
      >
        {/* Thanh kéo gờ (Handle) */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Tiêu đề sheet */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-slate-900">
              Bộ lọc nâng cao
            </span>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-800 rounded-full">
                {activeCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md focus-visible:outline-brand-700"
            aria-label="Đóng bảng bộ lọc"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung bộ lọc có thể cuộn */}
        <div className="px-5 py-4 overflow-y-auto flex-1 overscroll-contain">
          <JobFiltersPanel
            filters={filters}
            meta={meta}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            activeCount={activeCount}
          />
        </div>

        {/* Thanh hành động dính chân (Sticky Action Bar) */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onResetFilters();
            }}
            className="w-full py-2.5 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Xóa bộ lọc
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
