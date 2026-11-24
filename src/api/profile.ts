import { apiRequest } from "./client";
import type { PublicUser, UpdateStudentProfileInput } from "../../shared/types";

/** Cập nhật hồ sơ sinh viên qua PATCH /api/profile. */
export async function updateProfile(
  payload: UpdateStudentProfileInput
): Promise<{ ok: boolean; user: PublicUser }> {
  return apiRequest<{ ok: boolean; user: PublicUser }>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
