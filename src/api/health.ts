import { apiRequest } from "./client";
import type { ApiHealthResponse } from "../../shared/types";

/**
 * Kiểm tra trạng thái máy chủ API backend
 */
export async function getApiHealth(): Promise<ApiHealthResponse> {
  return apiRequest<ApiHealthResponse>("/api/health");
}
