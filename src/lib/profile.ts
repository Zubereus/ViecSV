import { APPLICATION_STATUS_MAP } from "../../shared/constants";
import type { ApplicationStatus, PublicUser } from "../../shared/types";

/** Tính tuổi hiện tại từ ngày sinh (định dạng YYYY-MM-DD). */
export function calculateAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

/** Đánh giá mức độ hoàn thiện hồ sơ sinh viên và liệt kê các mục còn thiếu. */
export function getProfileCompleteness(user: PublicUser | null): { percent: number; missingFields: string[] } {
  if (!user || user.role !== "student") {
    return { percent: 0, missingFields: [] };
  }

  const checks: Array<{ label: string; ok: boolean }> = [
    { label: "Họ và tên", ok: Boolean(user.fullName?.trim()) },
    { label: "Số điện thoại", ok: Boolean(user.phone?.trim()) },
    { label: "Trường đại học", ok: Boolean(user.university?.trim()) },
    { label: "Mã số sinh viên", ok: Boolean(user.studentId?.trim()) },
    { label: "Ngành học", ok: Boolean(user.major?.trim()) },
    { label: "Năm học", ok: Boolean(user.yearOfStudy) },
    { label: "Khu vực sinh sống", ok: Boolean(user.district?.trim()) },
  ];

  const missingFields = checks.filter((item) => !item.ok).map((item) => item.label);
  const completed = checks.length - missingFields.length;
  const percent = Math.round((completed / checks.length) * 100);

  return { percent, missingFields };
}

/** Che số CCCD, chỉ hiển thị 4 số cuối theo định dạng "•••••••• 1234". */
export function maskCccd(last4?: string | null): string {
  const safeLast4 = (last4 || "").slice(-4);
  if (!safeLast4) return "•••••••• ••••";
  return `•••••••• ${safeLast4}`;
}

/** Định dạng ngày theo chuẩn tiếng Việt (vi-VN). */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  moi: "Mới gửi",
  "da-xem": "Nhà tuyển dụng đã xem",
  "hen-phong-van": "Hẹn phỏng vấn",
  "da-nhan": "Đã nhận",
  "tu-choi": "Từ chối",
};

/** Lấy nhãn tiếng Việt cho trạng thái ứng tuyển từ bảng hằng số chung. */
export function getApplicationStatusLabel(status: ApplicationStatus): string {
  return STATUS_LABELS[status] || APPLICATION_STATUS_MAP[status] || status;
}
