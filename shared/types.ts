// Định nghĩa các kiểu dữ liệu cốt lõi của ViệcSV dùng chung Client và Server

export type UserRole = "student" | "employer";
export type Sex = "nam" | "nu" | "khac";
export type WorkType = "tai-cho" | "tu-xa" | "linh-hoat";
export type Shift = "sang" | "chieu" | "toi";
export type DayOfWeek = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";
export type JobStatus = "open" | "closed";
export type ApplicationStatus =
  | "moi"
  | "da-xem"
  | "hen-phong-van"
  | "da-nhan"
  | "tu-choi";

export type JobSortOption = "moi-nhat" | "luong-cao" | "luong-thap";

/**
 * Thông tin người dùng công khai (Public User)
 * TUYỆT ĐỐI không chứa password_hash, cccd_hash hay số CCCD đầy đủ.
 */
export interface PublicUser {
  id: string; // BigInt serialize sang string khi qua JSON
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  dateOfBirth?: string | null;
  sex?: Sex | null;
  university?: string | null;
  studentId?: string | null;
  major?: string | null;
  yearOfStudy?: number | null;
  district?: string | null;
  cccdLast4?: string | null;
  cccdMasked?: string | null; // Định dạng "•••••••• 1234"
  verified: boolean; // true nếu có số CCCD hợp lệ
  createdAt: string;
}

/** Thông tin doanh nghiệp / đơn vị tuyển dụng */
export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  owner_user_id?: string;
  color_hex: string;
}

/** Chi tiết bài đăng việc làm */
export interface Job {
  id: string;
  company_id: string;
  title: string;
  category: string;
  district: string;
  address: string;
  work_type: WorkType;
  wage_per_hour: number;
  wage_note: string;
  days: DayOfWeek[];
  shifts: Shift[];
  hours_per_week: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  experience_required: boolean;
  is_urgent: boolean;
  status: JobStatus;
  posted_at: string;
  search_text?: string;
  company?: Company;
}

/** Việc làm hiển thị trong danh sách tìm kiếm có kèm thông tin cơ bản của công ty */
export interface JobListItem extends Job {
  company_name: string;
  company_color_hex: string;
}

/** Hồ sơ ứng tuyển của sinh viên */
export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  university: string;
  intro: string;
  available_time: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job?: JobListItem;
}

/** Việc làm đã lưu */
export interface SavedJob {
  user_id: string;
  job_id: string;
  saved_at: string;
  job?: JobListItem;
}

/** Kết quả phân trang */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Dữ liệu meta phục vụ xây dựng bộ lọc */
export interface JobMetaResponse {
  categories: Array<{ name: string; count: number }>;
  districts: Array<{ name: string; count: number }>;
  minWage: number;
  maxWage: number;
  totalOpenJobs: number;
}

/** Dữ liệu đăng ký tài khoản sinh viên */
export interface RegisterStudentInput {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  phone: string;
  university: string;
  studentId?: string;
  major?: string;
  yearOfStudy: number;
  district?: string;
  cccd: string;
}

/** Dữ liệu đăng ký tài khoản nhà tuyển dụng */
export interface RegisterEmployerInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  companyName: string;
  industry: string;
}

/** Dữ liệu đăng nhập */
export interface LoginInput {
  email: string;
  password: string;
}

/** Phản hồi xác thực Token */
export interface AuthResponse {
  token: string;
  user: PublicUser;
}

/** Dữ liệu cập nhật hồ sơ sinh viên */
export interface UpdateStudentProfileInput {
  fullName?: string;
  phone?: string;
  university?: string;
  studentId?: string;
  major?: string;
  yearOfStudy?: number;
  district?: string;
}

/** Dữ liệu nộp hồ sơ ứng tuyển */
export interface ApplyJobInput {
  fullName: string;
  phone: string;
  university: string;
  intro?: string;
  availableTime: string;
}

/** Tóm tắt số liệu bảng điều khiển nhà tuyển dụng */
export interface EmployerSummary {
  openJobs: number;
  closedJobs: number;
  newApplications: number;
  interviewApplications: number;
  totalApplications: number;
}

/** Doanh nghiệp thuộc sở hữu của nhà tuyển dụng */
export interface EmployerCompany {
  id: string;
  name: string;
  color_hex: string;
}

/** Việc làm trong danh sách quản lý của nhà tuyển dụng */
export interface EmployerJobListItem extends Job {
  company_name: string;
  company_color_hex: string;
  applicant_count: number;
  new_applicant_count: number;
  interview_applicant_count: number;
}

/** Dữ liệu tạo tin tuyển dụng mới */
export interface CreateJobInput {
  title: string;
  category: string;
  district: string;
  address: string;
  work_type: WorkType;
  wage_per_hour: number;
  wage_note?: string;
  days: DayOfWeek[];
  shifts: Shift[];
  hours_per_week: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  experience_required: boolean;
  is_urgent: boolean;
  company_id: string;
}

/** Dữ liệu chỉnh sửa tin tuyển dụng */
export interface UpdateJobInput extends Partial<CreateJobInput> {
  status?: JobStatus;
}

/** Thông tin ứng viên hiển thị cho nhà tuyển dụng (TUYỆT ĐỐI không có CCCD, email, mật khẩu) */
export interface EmployerApplicant {
  id: string;
  job_id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phone: string;
  university: string;
  availableTime: string;
  intro: string;
  age: number | null;
  sex: Sex | null;
  major: string | null;
  yearOfStudy: number | null;
  verified: boolean;
}

export interface UpdateEmployerApplicationInput {
  status: ApplicationStatus;
}
