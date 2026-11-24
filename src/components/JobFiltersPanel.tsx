import { useState } from "react";
import {
  getCategoryDisplayName,
  DAYS_OF_WEEK,
  SHIFT_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "../../shared/constants";
import type { JobFilters } from "../lib/filterParams";
import type { JobMetaResponse } from "../../shared/types";
import { ChevronDown, ChevronUp, RotateCcw, DollarSign, Calendar, Clock, Briefcase, MapPin, Layers } from "lucide-react";

interface JobFiltersPanelProps {
  filters: JobFilters;
  meta: JobMetaResponse | null;
  onFilterChange: (newFilters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  activeCount: number;
}

export function JobFiltersPanel({
  filters,
  meta,
  onFilterChange,
  onResetFilters,
  activeCount,
}: JobFiltersPanelProps) {
  // Trạng thái thu gọn / mở rộng của danh mục và quận huyện
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [districtsExpanded, setDistrictsExpanded] = useState(false);

  // Mức lương min/max mặc định nếu meta chưa tải xong
  const metaMinWage = meta?.minWage || 20000;
  const metaMaxWage = meta?.maxWage || 150000;
  const currentMinWage = filters.minWage !== undefined ? filters.minWage : metaMinWage;

  // Xử lý toggle chip ngày
  const toggleDay = (day: string) => {
    const exists = filters.days.includes(day);
    const updated = exists
      ? filters.days.filter((d) => d !== day)
      : [...filters.days, day];
    onFilterChange({ days: updated, page: 1 });
  };

  // Nút nhanh "Chỉ cuối tuần"
  const isWeekendOnly =
    filters.days.length === 2 &&
    filters.days.includes("T7") &&
    filters.days.includes("CN");

  const toggleWeekend = () => {
    if (isWeekendOnly) {
      onFilterChange({
        days: filters.days.filter((d) => d !== "T7" && d !== "CN"),
        page: 1,
      });
    } else {
      const merged = Array.from(new Set([...filters.days, "T7", "CN"]));
      onFilterChange({ days: merged, page: 1 });
    }
  };

  // Xử lý toggle chip ca làm
  const toggleShift = (shift: string) => {
    const exists = filters.shifts.includes(shift);
    const updated = exists
      ? filters.shifts.filter((s) => s !== shift)
      : [...filters.shifts, shift];
    onFilterChange({ shifts: updated, page: 1 });
  };

  // Xử lý toggle ngành nghề
  const toggleCategory = (cat: string) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ categories: updated, page: 1 });
  };

  // Xử lý toggle quận huyện
  const toggleDistrict = (dist: string) => {
    const exists = filters.districts.includes(dist);
    const updated = exists
      ? filters.districts.filter((d) => d !== dist)
      : [...filters.districts, dist];
    onFilterChange({ districts: updated, page: 1 });
  };

  // Xử lý toggle hình thức làm việc
  const toggleWorkType = (wt: string) => {
    const exists = filters.workTypes.includes(wt);
    const updated = exists
      ? filters.workTypes.filter((w) => w !== wt)
      : [...filters.workTypes, wt];
    onFilterChange({ workTypes: updated, page: 1 });
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Tiêu đề & Nút xóa bộ lọc */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-base text-slate-900">
            Bộ lọc tìm kiếm
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-800 rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors focus-visible:outline-brand-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* 1. MỨC LƯƠNG MONG MUỐN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="wage-range-input"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            <DollarSign className="w-4 h-4 text-brand-700" />
            Mức lương mong muốn
          </label>
          <span className="text-xs font-bold text-brand-accent-dark tabular-nums">
            {filters.minWage ? `Từ ${new Intl.NumberFormat("vi-VN").format(filters.minWage)}đ/h` : "Tất cả"}
          </span>
        </div>

        {/* Thanh trượt khoảng lương */}
        <input
          id="wage-range-input"
          type="range"
          min={metaMinWage}
          max={metaMaxWage}
          step={5000}
          value={currentMinWage}
          onChange={(e) => {
            const val = Number(e.target.value);
            onFilterChange({ minWage: val > metaMinWage ? val : undefined, page: 1 });
          }}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700 focus-visible:outline-brand-700"
        />

        {/* Các mốc thiết lập nhanh */}
        <div className="flex items-center gap-1.5 pt-1">
          {[
            { label: "Tất cả", val: undefined },
            { label: "Từ 25k", val: 25000 },
            { label: "Từ 40k", val: 40000 },
            { label: "Từ 60k", val: 60000 },
          ].map((preset) => {
            const isSelected = filters.minWage === preset.val;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onFilterChange({ minWage: preset.val, page: 1 })}
                className={`flex-1 whitespace-nowrap px-1.5 py-1 text-xs rounded border transition-colors ${
                  isSelected
                    ? "bg-brand-700 text-white border-brand-700 font-medium"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. NGÀY CÓ THỂ LÀM VIỆC */}
      <fieldset className="space-y-2.5 border-t border-slate-100 pt-2">
        <legend className="sr-only">Ngày có thể làm việc</legend>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <Calendar className="w-4 h-4 text-brand-700" />
            Ngày có thể làm
          </span>
          <button
            type="button"
            onClick={toggleWeekend}
            aria-pressed={isWeekendOnly}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              isWeekendOnly
                ? "bg-brand-100 text-brand-800 font-semibold"
                : "text-brand-700 hover:bg-brand-50 font-medium"
            }`}
          >
            Chỉ cuối tuần
          </button>
        </div>

        {/* Chips các ngày trong tuần */}
        <div role="group" aria-label="Chọn ngày có thể làm" className="grid grid-cols-4 gap-1.5">
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = filters.days.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                aria-pressed={isSelected}
                className={`py-1.5 text-xs text-center rounded border transition-colors ${
                  isSelected
                    ? "bg-brand-700 text-white border-brand-700 font-semibold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {d.value}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 3. CA LÀM VIỆC */}
      <fieldset className="space-y-2.5 border-t border-slate-100 pt-2">
        <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Clock className="w-4 h-4 text-brand-700" />
          Ca làm việc
        </legend>

        <div role="group" aria-label="Chọn ca làm việc" className="flex flex-col gap-1.5">
          {SHIFT_OPTIONS.map((s) => {
            const isSelected = filters.shifts.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleShift(s.value)}
                aria-pressed={isSelected}
                className={`px-3 py-2 text-left text-xs rounded-md border flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-brand-50 text-brand-800 border-brand-500 font-semibold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{s.label}</span>
                {isSelected && <span className="text-brand-700">✓</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 4. KHÔNG YÊU CẦU KINH NGHIỆM */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between p-2.5 bg-surface-subtle rounded-md cursor-pointer hover:bg-slate-100 transition-colors">
          <span className="text-xs font-medium text-slate-800">
            Chỉ xem việc không cần kinh nghiệm
          </span>
          <input
            type="checkbox"
            checked={filters.noExperience}
            onChange={(e) => onFilterChange({ noExperience: e.target.checked, page: 1 })}
            className="w-4 h-4 rounded text-brand-700 border-slate-300 focus:ring-brand-700 accent-brand-700 cursor-pointer"
          />
        </label>
      </div>

      {/* 5. HÌNH THỨC LÀM VIỆC */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Layers className="w-4 h-4 text-brand-700" />
          Hình thức làm việc
        </span>

        <div className="space-y-1.5">
          {WORK_TYPE_OPTIONS.map((wt) => {
            const isChecked = filters.workTypes.includes(wt.value);
            return (
              <label
                key={wt.value}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleWorkType(wt.value)}
                  className="w-3.5 h-3.5 rounded text-brand-700 border-slate-300 focus:ring-brand-700 accent-brand-700"
                />
                <span>{wt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. NGÀNH NGHỀ (COLLAPSIBLE, SCROLLABLE WITH COUNTS) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 py-1"
        >
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-brand-700" />
            Ngành nghề ({filters.categories.length > 0 ? filters.categories.length : "Tất cả"})
          </span>
          {categoriesExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {categoriesExpanded && (
          <div className="mt-2.5 max-h-48 overflow-y-auto pr-1 space-y-1.5">
            {meta?.categories.map((c) => {
              const isChecked = filters.categories.includes(c.name);
              return (
                <label
                  key={c.name}
                  className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(c.name)}
                      className="w-3.5 h-3.5 rounded text-brand-700 border-slate-300 focus:ring-brand-700 accent-brand-700 shrink-0"
                    />
                    <span className="truncate">{getCategoryDisplayName(c.name)}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 tabular-nums shrink-0 ml-1">
                    {c.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. KHU VỰC / QUẬN HUYỆN (COLLAPSIBLE, SCROLLABLE WITH COUNTS) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setDistrictsExpanded(!districtsExpanded)}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 py-1"
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-700" />
            Khu vực TP.HCM ({filters.districts.length > 0 ? filters.districts.length : "Tất cả"})
          </span>
          {districtsExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {districtsExpanded && (
          <div className="mt-2.5 max-h-48 overflow-y-auto pr-1 space-y-1.5">
            {meta?.districts.map((d) => {
              const isChecked = filters.districts.includes(d.name);
              return (
                <label
                  key={d.name}
                  className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDistrict(d.name)}
                      className="w-3.5 h-3.5 rounded text-brand-700 border-slate-300 focus:ring-brand-700 accent-brand-700 shrink-0"
                    />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 tabular-nums shrink-0 ml-1">
                    {d.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
