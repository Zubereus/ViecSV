import { apiRequest } from "./client";
import type { JobListItem } from "../../shared/types";

/** Lấy danh sách việc làm đã lưu của sinh viên hiện tại. */
export async function fetchSaved(): Promise<{ ok: boolean; items: JobListItem[]; total: number }> {
  return apiRequest<{ ok: boolean; items: JobListItem[]; total: number }>("/api/saved");
}

/** Lưu một công việc vào danh sách đã lưu. */
export async function saveJob(jobId: string): Promise<{ ok: boolean; saved: boolean; message: string }> {
  return apiRequest<{ ok: boolean; saved: boolean; message: string }>(`/api/saved/${jobId}`, {
    method: "PUT",
  });
}

/** Bỏ lưu một công việc khỏi danh sách đã lưu. */
export async function unsaveJob(jobId: string): Promise<{ ok: boolean; saved: boolean; message: string }> {
  return apiRequest<{ ok: boolean; saved: boolean; message: string }>(`/api/saved/${jobId}`, {
    method: "DELETE",
  });
}
