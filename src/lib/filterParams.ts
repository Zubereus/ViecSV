import {
  DAYS_OF_WEEK,
  SHIFT_OPTIONS,
  WORK_TYPE_OPTIONS,
  CATEGORIES,
  DISTRICTS,
} from "../../shared/constants.js";
import type { JobSortOption } from "../../shared/types.js";

export interface JobFilters {
  q: string;
  minWage?: number;
  maxWage?: number;
  days: string[];
  shifts: string[];
  categories: string[];
  districts: string[];
  workTypes: string[];
  noExperience: boolean;
  sort: JobSortOption;
  page: number;
}

export const DEFAULT_FILTERS: JobFilters = {
  q: "",
  days: [],
  shifts: [],
  categories: [],
  districts: [],
  workTypes: [],
  noExperience: false,
  sort: "moi-nhat",
  page: 1,
};

const VALID_DAYS = new Set(DAYS_OF_WEEK.map((d: { value: string }) => d.value));
const VALID_SHIFTS = new Set(SHIFT_OPTIONS.map((s: { value: string }) => s.value));
const VALID_WORK_TYPES = new Set(WORK_TYPE_OPTIONS.map((w: { value: string }) => w.value));
const VALID_SORTS = new Set<JobSortOption>(["moi-nhat", "luong-cao", "luong-thap"]);

/**
 * Phân tích URLSearchParams thành đối tượng JobFilters có kiểm tra tính hợp lệ
 */
export function searchParamsToFilters(params: URLSearchParams): JobFilters {
  const q = params.get("q") || "";

  // Mức lương
  const rawMinWage = params.get("minWage");
  const minWage = rawMinWage && !isNaN(Number(rawMinWage)) ? Math.max(0, Number(rawMinWage)) : undefined;

  const rawMaxWage = params.get("maxWage");
  const maxWage = rawMaxWage && !isNaN(Number(rawMaxWage)) ? Math.max(0, Number(rawMaxWage)) : undefined;

  // Ngày làm việc (comma-separated)
  const rawDays = params.get("days");
  const days = rawDays
    ? rawDays
        .split(",")
        .map((s) => s.trim())
        .filter((d: string) => VALID_DAYS.has(d as any))
    : [];

  // Ca làm việc
  const rawShifts = params.get("shifts");
  const shifts = rawShifts
    ? rawShifts
        .split(",")
        .map((s) => s.trim())
        .filter((s: string) => VALID_SHIFTS.has(s as any))
    : [];

  // Ngành nghề
  const rawCats = params.get("categories");
  const categories = rawCats
    ? rawCats
        .split(",")
        .map((s) => s.trim())
        .filter((c: string) => (CATEGORIES as readonly string[]).includes(c))
    : [];

  // Quận huyện
  const rawDistricts = params.get("districts");
  const districts = rawDistricts
    ? rawDistricts
        .split(",")
        .map((s) => s.trim())
        .filter((d: string) => (DISTRICTS as readonly string[]).includes(d))
    : [];

  // Hình thức
  const rawWorkTypes = params.get("workTypes");
  const workTypes = rawWorkTypes
    ? rawWorkTypes
        .split(",")
        .map((s) => s.trim())
        .filter((w: string) => VALID_WORK_TYPES.has(w as any))
    : [];

  // Không yêu cầu kinh nghiệm
  const noExperience = params.get("noExperience") === "true";

  // Sắp xếp
  const rawSort = params.get("sort") as JobSortOption;
  const sort = VALID_SORTS.has(rawSort) ? rawSort : "moi-nhat";

  // Phân trang
  const rawPage = params.get("page");
  const page = rawPage && !isNaN(Number(rawPage)) ? Math.max(1, parseInt(rawPage, 10)) : 1;

  return {
    q,
    minWage,
    maxWage,
    days,
    shifts,
    categories,
    districts,
    workTypes,
    noExperience,
    sort,
    page,
  };
}

/**
 * Chuyển đối tượng JobFilters thành URLSearchParams sạch gọn
 */
export function filtersToSearchParams(filters: JobFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q.trim()) {
    params.set("q", filters.q.trim());
  }

  if (filters.minWage !== undefined && filters.minWage > 0) {
    params.set("minWage", String(filters.minWage));
  }

  if (filters.maxWage !== undefined && filters.maxWage > 0) {
    params.set("maxWage", String(filters.maxWage));
  }

  if (filters.days.length > 0) {
    params.set("days", filters.days.join(","));
  }

  if (filters.shifts.length > 0) {
    params.set("shifts", filters.shifts.join(","));
  }

  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }

  if (filters.districts.length > 0) {
    params.set("districts", filters.districts.join(","));
  }

  if (filters.workTypes.length > 0) {
    params.set("workTypes", filters.workTypes.join(","));
  }

  if (filters.noExperience) {
    params.set("noExperience", "true");
  }

  if (filters.sort && filters.sort !== "moi-nhat") {
    params.set("sort", filters.sort);
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params;
}

/**
 * Đếm số lượng bộ lọc đang được kích hoạt (không tính từ khóa, sắp xếp và số trang)
 */
export function countActiveFilters(filters: JobFilters): number {
  let count = 0;

  if (filters.minWage !== undefined && filters.minWage > 0) count++;
  if (filters.maxWage !== undefined && filters.maxWage > 0) count++;
  if (filters.days.length > 0) count += filters.days.length;
  if (filters.shifts.length > 0) count += filters.shifts.length;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.districts.length > 0) count += filters.districts.length;
  if (filters.workTypes.length > 0) count += filters.workTypes.length;
  if (filters.noExperience) count++;

  return count;
}

/**
 * Trả về bộ lọc mặc định sạch sẽ, giữ nguyên từ khóa nếu muốn
 */
export function clearFilters(keepKeyword = false, currentKeyword = ""): JobFilters {
  return {
    ...DEFAULT_FILTERS,
    q: keepKeyword ? currentKeyword : "",
    page: 1,
  };
}
