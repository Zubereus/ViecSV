import { X, RotateCcw } from "lucide-react";
import type { JobFilters } from "../lib/filterParams";
import { SHIFT_MAP, WORK_TYPE_MAP } from "../../shared/constants";
import { formatWage } from "../lib/format";

interface ActiveFilterChipsProps {
  filters: JobFilters;
  onRemoveFilter: (key: keyof JobFilters, val?: any) => void;
  onResetFilters: () => void;
}

export function ActiveFilterChips({
  filters,
  onRemoveFilter,
  onResetFilters,
}: ActiveFilterChipsProps) {
  const chips: Array<{ label: string; onRemove: () => void }> = [];

  // Mức lương tối thiểu
  if (filters.minWage !== undefined && filters.minWage > 0) {
    chips.push({
      label: `Lương: từ ${formatWage(filters.minWage)}`,
      onRemove: () => onRemoveFilter("minWage", undefined),
    });
  }

  // Mức lương tối đa
  if (filters.maxWage !== undefined && filters.maxWage > 0) {
    chips.push({
      label: `Lương: dưới ${formatWage(filters.maxWage)}`,
      onRemove: () => onRemoveFilter("maxWage", undefined),
    });
  }

  // Ngày làm việc
  filters.days.forEach((day) => {
    chips.push({
      label: `Ngày: ${day}`,
      onRemove: () => onRemoveFilter("days", day),
    });
  });

  // Ca làm việc
  filters.shifts.forEach((shift) => {
    chips.push({
      label: `Ca: ${(SHIFT_MAP as any)[shift] || shift}`,
      onRemove: () => onRemoveFilter("shifts", shift),
    });
  });

  // Ngành nghề
  filters.categories.forEach((cat) => {
    chips.push({
      label: cat,
      onRemove: () => onRemoveFilter("categories", cat),
    });
  });

  // Quận huyện
  filters.districts.forEach((dist) => {
    chips.push({
      label: dist,
      onRemove: () => onRemoveFilter("districts", dist),
    });
  });

  // Hình thức
  filters.workTypes.forEach((wt) => {
    chips.push({
      label: (WORK_TYPE_MAP as any)[wt] || wt,
      onRemove: () => onRemoveFilter("workTypes", wt),
    });
  });

  // Không yêu cầu kinh nghiệm
  if (filters.noExperience) {
    chips.push({
      label: "Không cần kinh nghiệm",
      onRemove: () => onRemoveFilter("noExperience", false),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <span className="text-xs text-slate-500 font-medium mr-1">Đang lọc:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 bg-white border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded-full shadow-sm hover:border-slate-400 transition-colors"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="text-slate-400 hover:text-rose-600 rounded-full p-0.5 focus-visible:outline-brand-700"
            aria-label={`Xóa bộ lọc ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 ml-1 py-1 px-2 rounded hover:bg-slate-100 transition-colors focus-visible:outline-brand-700"
      >
        <RotateCcw className="w-3 h-3" />
        Xóa tất cả
      </button>
    </div>
  );
}
