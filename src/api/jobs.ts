import { apiRequest } from "./client";
import type {
  JobListItem,
  Job,
  PaginatedResponse,
  JobMetaResponse,
} from "../../shared/types";

export interface FetchJobsParams {
  q?: string;
  minWage?: number;
  maxWage?: number;
  days?: string;
  shifts?: string;
  categories?: string;
  districts?: string;
  workTypes?: string;
  noExperience?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Tra cứu danh sách việc làm theo bộ lọc và phân trang
 */
export async function fetchJobs(
  params: FetchJobsParams,
  signal?: AbortSignal
): Promise<PaginatedResponse<JobListItem>> {
  return apiRequest<PaginatedResponse<JobListItem>>("/api/jobs", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal,
  });
}

/**
 * Lấy dữ liệu meta phục vụ xây dựng bộ lọc
 */
export async function fetchMeta(signal?: AbortSignal): Promise<JobMetaResponse> {
  return apiRequest<JobMetaResponse>("/api/meta", { signal });
}

/**
 * Lấy thông tin chi tiết một bài đăng việc làm
 */
export async function fetchJobDetail(
  id: string,
  signal?: AbortSignal
): Promise<{ ok: boolean; job: Job }> {
  return apiRequest<{ ok: boolean; job: Job }>(`/api/jobs/${id}`, { signal });
}

/**
 * Lấy danh sách việc làm tương tự cùng danh mục
 */
export async function fetchSimilarJobs(
  id: string,
  signal?: AbortSignal
): Promise<{ ok: boolean; items: JobListItem[] }> {
  return apiRequest<{ ok: boolean; items: JobListItem[] }>(`/api/jobs/${id}/similar`, { signal });
}
