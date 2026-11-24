import { useEffect, useState, useRef, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  SlidersHorizontal,
  AlertCircle,
  Briefcase,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { fetchJobs, fetchMeta } from "../api/jobs";
import type { JobListItem, JobMetaResponse } from "../../shared/types";
import {
  searchParamsToFilters,
  filtersToSearchParams,
  countActiveFilters,
  clearFilters,
  type JobFilters,
} from "../lib/filterParams";
import { JobCard } from "../components/JobCard";
import { JobCardSkeleton } from "../components/JobCardSkeleton";
import { JobFiltersPanel } from "../components/JobFiltersPanel";
import { ActiveFilterChips } from "../components/ActiveFilterChips";
import { MobileFilterDrawer } from "../components/MobileFilterDrawer";
import { Pagination } from "../components/Pagination";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc bộ lọc từ URL Query String
  const filters = searchParamsToFilters(searchParams);
  const activeFilterCount = countActiveFilters(filters);

  // Dữ liệu danh sách việc làm
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Dữ liệu meta bộ lọc
  const [meta, setMeta] = useState<JobMetaResponse | null>(null);

  // Trạng thái tải dữ liệu
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input tìm kiếm từ khóa với Debounce 300ms
  const [keywordInput, setKeywordInput] = useState(filters.q);
  const [, startTransition] = useTransition();

  // Drawer bộ lọc trên di động
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Ref chống Race Condition giữa các yêu cầu mạng kế tiếp
  const activeRequestId = useRef<number>(0);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // 1. Tải Meta bộ lọc khi trang khởi tạo (chỉ tải 1 lần)
  useEffect(() => {
    let isMounted = true;
    fetchMeta()
      .then((data) => {
        if (isMounted) setMeta(data);
      })
      .catch(() => {
        // Meta thất bại không làm vỡ trang, bộ lọc vẫn hoạt động bình thường
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Đồng bộ keywordInput khi URL thay đổi từ bên ngoài (ví dụ nút Back/Forward của trình duyệt)
  useEffect(() => {
    setKeywordInput(filters.q);
  }, [filters.q]);

  // 3. Debounce cập nhật từ khóa tìm kiếm lên URL (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (keywordInput.trim() !== filters.q.trim()) {
        const nextFilters: JobFilters = {
          ...filters,
          q: keywordInput.trim(),
          page: 1, // Đổi từ khóa luôn reset về trang 1
        };
        setSearchParams(filtersToSearchParams(nextFilters), { replace: true });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [keywordInput, filters, setSearchParams]);

  // 4. Gọi API tra cứu việc làm khi URLSearchParams thay đổi
  useEffect(() => {
    const currentId = ++activeRequestId.current;
    setError(null);

    if (jobs.length > 0) {
      setIsRefetching(true);
    } else {
      setInitialLoading(true);
    }

    const abortController = new AbortController();

    fetchJobs(
      {
        q: filters.q,
        minWage: filters.minWage,
        maxWage: filters.maxWage,
        days: filters.days.length > 0 ? filters.days.join(",") : undefined,
        shifts: filters.shifts.length > 0 ? filters.shifts.join(",") : undefined,
        categories: filters.categories.length > 0 ? filters.categories.join(",") : undefined,
        districts: filters.districts.length > 0 ? filters.districts.join(",") : undefined,
        workTypes: filters.workTypes.length > 0 ? filters.workTypes.join(",") : undefined,
        noExperience: filters.noExperience ? true : undefined,
        sort: filters.sort,
        page: filters.page,
        pageSize: 12,
      },
      abortController.signal
    )
      .then((res) => {
        // Bỏ qua nếu có yêu cầu mới hơn đã được kích hoạt (Race condition prevention)
        if (currentId !== activeRequestId.current) return;

        startTransition(() => {
          setJobs(res.items);
          setTotalJobs(res.total);
          setTotalPages(res.totalPages);
          setInitialLoading(false);
          setIsRefetching(false);
        });
      })
      .catch((err) => {
        if (currentId !== activeRequestId.current) return;
        if (err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
        setInitialLoading(false);
        setIsRefetching(false);
      });

    return () => {
      abortController.abort();
    };
  }, [searchParams]);

  // Hàm cập nhật bộ lọc lên URL
  const updateFilters = (newPartial: Partial<JobFilters>) => {
    const nextFilters: JobFilters = {
      ...filters,
      ...newPartial,
    };
    setSearchParams(filtersToSearchParams(nextFilters));
  };

  // Hàm xóa từng chip bộ lọc
  const removeFilterItem = (key: keyof JobFilters, val?: any) => {
    if (key === "minWage") {
      updateFilters({ minWage: undefined, page: 1 });
    } else if (key === "maxWage") {
      updateFilters({ maxWage: undefined, page: 1 });
    } else if (key === "noExperience") {
      updateFilters({ noExperience: false, page: 1 });
    } else if (Array.isArray(filters[key])) {
      const arr = filters[key] as string[];
      updateFilters({
        [key]: arr.filter((item) => item !== val),
        page: 1,
      } as any);
    }
  };

  // Hàm đặt lại toàn bộ bộ lọc
  const handleResetFilters = () => {
    setKeywordInput("");
    setSearchParams(filtersToSearchParams(clearFilters(false)));
  };

  // Cuộn mượt lên đầu danh sách việc làm khi đổi trang
  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
    if (resultsContainerRef.current) {
      const top = resultsContainerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH TÌM KIẾM CHÍNH (PROMINENT SEARCH INPUT - Mở thẳng vào việc) */}
      <section aria-label="Tìm kiếm việc làm">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3 shadow-card focus-within:border-brand-700 transition-colors">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Tìm theo tên việc, công ty, kỹ năng (ví dụ: gia sư, pha chế, Q.1...)"
                className="w-full pl-10 pr-9 py-2 text-sm sm:text-base bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                aria-label="Từ khóa tìm kiếm việc làm"
              />
              {keywordInput && (
                <button
                  type="button"
                  onClick={() => {
                    setKeywordInput("");
                    updateFilters({ q: "", page: 1 });
                  }}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded-full focus-visible:outline-brand-700"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nút mở bộ lọc trên thiết bị di động */}
            <div className="md:hidden shrink-0 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                  activeFilterCount > 0
                    ? "bg-brand-50 border-brand-600 text-brand-800"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                aria-label="Mở bảng bộ lọc"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-700" />
                <span>Bộ lọc</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dòng copy súc tích dưới thanh tìm kiếm (chuẩn phong cách operate) */}
        <p className="mt-2 text-xs text-slate-500">
          Tra cứu việc làm thêm sinh viên theo giờ, ca linh hoạt và địa điểm cụ thể tại TP. Hồ Chí Minh.
        </p>
      </section>

      {/* 2. BỐ CỤC 2 CỘT CHÍNH (DESKTOP: STICKY FILTERS + RESULTS) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Cột trái: Panel bộ lọc dính (Sticky desktop sidebar) */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-20 bg-white border border-slate-200/90 rounded-lg p-4 sm:p-5 shadow-card max-h-[calc(100vh-6rem)] overflow-y-auto">
          <JobFiltersPanel
            filters={filters}
            meta={meta}
            onFilterChange={updateFilters}
            onResetFilters={handleResetFilters}
            activeCount={activeFilterCount}
          />
        </aside>

        {/* Cột phải: Hàng kết quả & Danh sách việc làm */}
        <main
          ref={resultsContainerRef}
          className="col-span-1 md:col-span-8 lg:col-span-9 space-y-4"
        >
          {/* Thanh tiêu đề kết quả & Sắp xếp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-base sm:text-lg text-slate-900 tracking-tight">
                {initialLoading ? (
                  "Đang tải việc làm..."
                ) : (
                  <>
                    Tìm thấy{" "}
                    <span className="text-brand-700 font-bold tabular-nums">
                      {totalJobs}
                    </span>{" "}
                    việc làm
                  </>
                )}
              </h1>

              {isRefetching && (
                <span className="inline-flex items-center gap-1 text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 animate-pulse font-medium">
                  Đang cập nhật...
                </span>
              )}
            </div>

            {/* Chọn tiêu chí sắp xếp */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-select" className="sr-only">
                Sắp xếp theo
              </label>
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value as any, page: 1 })}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-700 cursor-pointer shadow-sm"
              >
                <option value="moi-nhat">Mới nhất</option>
                <option value="luong-cao">Lương cao nhất</option>
                <option value="luong-thap">Lương thấp nhất</option>
              </select>
            </div>
          </div>

          {/* Dải chip các bộ lọc đang kích hoạt */}
          <ActiveFilterChips
            filters={filters}
            onRemoveFilter={removeFilterItem}
            onResetFilters={handleResetFilters}
          />

          {/* TRẠNG THÁI LỖI (ERROR STATE) */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-rose-900">
                  Không tải được dữ liệu
                </p>
                <p className="text-xs text-rose-700">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setSearchParams(filtersToSearchParams(filters))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Thử lại
              </button>
            </div>
          )}

          {/* TRẠNG THÁI ĐANG TẢI LẦN ĐẦU (INITIAL LOADING) */}
          {initialLoading && (
            <div className="grid grid-cols-1 gap-3.5">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* TRẠNG THÁI TRỐNG (EMPTY STATE CÓ GỢI Ý NỚI LỎNG BỘ LỌC) */}
          {!initialLoading && !error && jobs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-12 text-center shadow-card space-y-4 max-w-lg mx-auto my-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900">
                  Không tìm thấy việc làm phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Hãy thử nới lỏng mức lương, chọn thêm ngày làm việc trong tuần hoặc xóa các điều kiện lọc quận huyện để có thêm nhiều lựa chọn.
                </p>
              </div>

              {activeFilterCount > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-md transition-colors"
                  >
                    Xóa tất cả bộ lọc hiện tại
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DANH SÁCH VIỆC LÀM KẾT QUẢ */}
          {!initialLoading && !error && jobs.length > 0 && (
            <div
              className={`grid grid-cols-1 gap-3.5 transition-opacity duration-200 ${
                isRefetching ? "opacity-60" : "opacity-100"
              }`}
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* THANH PHÂN TRANG */}
          {!initialLoading && !error && totalPages > 1 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>

      {/* DRAWER BỘ LỌC CHO GIAO DIỆN DI ĐỘNG (MOBILE BOTTOM SHEET) */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filters}
        meta={meta}
        onFilterChange={updateFilters}
        onResetFilters={handleResetFilters}
        activeCount={activeFilterCount}
      />
    </div>
  );
}
