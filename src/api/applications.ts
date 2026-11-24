import { apiRequest } from "./client";
import type { Application, ApplyJobInput } from "../../shared/types";

/** Nộp hồ sơ ứng tuyển cho một công việc. */
export async function applyToJob(
  jobId: string,
  payload: ApplyJobInput
): Promise<{ ok: boolean; message: string; application: Application }> {
  return apiRequest<{ ok: boolean; message: string; application: Application }>(
    `/api/jobs/${jobId}/apply`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/** Lấy danh sách hồ sơ ứng tuyển của sinh viên hiện tại. */
export async function fetchMyApplications(): Promise<{ ok: boolean; items: Application[]; total: number }> {
  return apiRequest<{ ok: boolean; items: Application[]; total: number }>("/api/applications/mine");
}
