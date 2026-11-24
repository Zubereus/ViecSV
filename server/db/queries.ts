import type { PoolClient } from "@neondatabase/serverless";
import { query, withTransaction } from "./client.js";
import { normalizeText } from "../../shared/text.js";
import { calculateAge } from "../../shared/validators.js";
import type {
  JobListItem,
  JobSortOption,
  JobMetaResponse,
  ApplicationStatus,
  EmployerSummary,
  EmployerCompany,
  EmployerJobListItem,
  EmployerApplicant,
  CreateJobInput,
  UpdateJobInput,
  Job,
  DayOfWeek,
  Shift,
  WorkType,
  JobStatus,
} from "../../shared/types.js";

// ==========================================
// 1. TÌM KIẾM VÀ LỌC CÔNG VIỆC (JOB QUERIES)
// ==========================================

export interface JobFilterParams {
  q?: string;
  minWage?: number;
  maxWage?: number;
  days?: string[];
  shifts?: string[];
  categories?: string[];
  districts?: string[];
  workTypes?: string[];
  noExperience?: boolean;
  status?: "open" | "closed";
}

/**
 * Hàm THUẦN TÚY xây dựng mệnh đề WHERE cho câu truy vấn tìm kiếm việc làm
 * Trả về chuỗi SQL với các tham số $1, $2,... và mảng params tương ứng.
 */
export function buildJobSearchWhereClause(
  filters: JobFilterParams,
  startIndex = 1
): { whereSql: string; params: any[]; nextIndex: number } {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = startIndex;

  // Luôn mặc định lọc trạng thái (mặc định là 'open')
  const statusFilter = filters.status || "open";
  conditions.push(`j.status = $${paramIndex++}`);
  params.push(statusFilter);

  // 1. Tìm kiếm từ khóa theo search_text đã khử dấu
  if (filters.q && filters.q.trim()) {
    const normalizedKeyword = normalizeText(filters.q);
    conditions.push(`j.search_text ILIKE $${paramIndex++}`);
    params.push(`%${normalizedKeyword}%`);
  }

  // 2. Mức lương tối thiểu
  if (filters.minWage !== undefined && filters.minWage > 0) {
    conditions.push(`j.wage_per_hour >= $${paramIndex++}`);
    params.push(filters.minWage);
  }

  // 3. Mức lương tối đa
  if (filters.maxWage !== undefined && filters.maxWage > 0) {
    conditions.push(`j.wage_per_hour <= $${paramIndex++}`);
    params.push(filters.maxWage);
  }

  // 4. Lọc ngày làm việc: dùng toán tử array overlap '&&' (khớp ít nhất 1 ngày đã chọn)
  if (filters.days && filters.days.length > 0) {
    conditions.push(`j.days && $${paramIndex++}::text[]`);
    params.push(filters.days);
  }

  // 5. Lọc ca làm việc: dùng toán tử array overlap '&&' (khớp ít nhất 1 ca đã chọn)
  if (filters.shifts && filters.shifts.length > 0) {
    conditions.push(`j.shifts && $${paramIndex++}::text[]`);
    params.push(filters.shifts);
  }

  // 6. Danh mục công việc (Category)
  if (filters.categories && filters.categories.length > 0) {
    conditions.push(`j.category = ANY($${paramIndex++}::text[])`);
    params.push(filters.categories);
  }

  // 7. Quận / huyện (District)
  if (filters.districts && filters.districts.length > 0) {
    conditions.push(`j.district = ANY($${paramIndex++}::text[])`);
    params.push(filters.districts);
  }

  // 8. Hình thức làm việc (Work Type)
  if (filters.workTypes && filters.workTypes.length > 0) {
    conditions.push(`j.work_type = ANY($${paramIndex++}::text[])`);
    params.push(filters.workTypes);
  }

  // 9. Không yêu cầu kinh nghiệm
  if (filters.noExperience === true) {
    conditions.push(`j.experience_required = FALSE`);
  }

  const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereSql, params, nextIndex: paramIndex };
}

/**
 * Tìm kiếm danh sách việc làm có phân trang và sắp xếp
 */
export async function searchJobs(
  filters: JobFilterParams,
  sort: JobSortOption = "moi-nhat",
  page = 1,
  pageSize = 12
): Promise<{ items: JobListItem[]; total: number }> {
  const { whereSql, params, nextIndex } = buildJobSearchWhereClause(filters);

  // 1. Đếm tổng số bản ghi khớp
  const countSql = `
    SELECT COUNT(*) AS total
    FROM jobs j
    ${whereSql}
  `;
  const countRes = await query<{ total: string }>(countSql, params);
  const total = parseInt(countRes[0]?.total || "0", 10);

  if (total === 0) {
    return { items: [], total: 0 };
  }

  // 2. Xác định thứ tự sắp xếp
  let orderSql = "ORDER BY j.posted_at DESC";
  if (sort === "luong-cao") {
    orderSql = "ORDER BY j.wage_per_hour DESC, j.posted_at DESC";
  } else if (sort === "luong-thap") {
    orderSql = "ORDER BY j.wage_per_hour ASC, j.posted_at DESC";
  }

  // 3. Truy vấn dữ liệu có phân trang
  const limit = Math.max(1, Math.min(pageSize, 50));
  const offset = Math.max(0, (page - 1) * limit);

  const queryParams = [...params, limit, offset];
  const itemsSql = `
    SELECT
      j.id, j.company_id, j.title, j.category, j.district, j.address,
      j.work_type, j.wage_per_hour, j.wage_note, j.days, j.shifts,
      j.hours_per_week, j.description, j.responsibilities, j.requirements,
      j.benefits, j.experience_required, j.is_urgent, j.status, j.posted_at,
      c.name AS company_name, c.color_hex AS company_color_hex
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    ${whereSql}
    ${orderSql}
    LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
  `;

  const rows = await query<any>(itemsSql, queryParams);

  const items: JobListItem[] = rows.map((r) => ({
    id: String(r.id),
    company_id: String(r.company_id),
    title: r.title,
    category: r.category,
    district: r.district,
    address: r.address,
    work_type: r.work_type,
    wage_per_hour: Number(r.wage_per_hour),
    wage_note: r.wage_note,
    days: r.days,
    shifts: r.shifts,
    hours_per_week: Number(r.hours_per_week),
    description: r.description,
    responsibilities: Array.isArray(r.responsibilities) ? r.responsibilities : JSON.parse(r.responsibilities || "[]"),
    requirements: Array.isArray(r.requirements) ? r.requirements : JSON.parse(r.requirements || "[]"),
    benefits: Array.isArray(r.benefits) ? r.benefits : JSON.parse(r.benefits || "[]"),
    experience_required: Boolean(r.experience_required),
    is_urgent: Boolean(r.is_urgent),
    status: r.status,
    posted_at: r.posted_at instanceof Date ? r.posted_at.toISOString() : String(r.posted_at),
    company_name: r.company_name,
    company_color_hex: r.company_color_hex,
  }));

  return { items, total };
}

/**
 * Lấy chi tiết việc làm theo ID kèm thông tin công ty đầy đủ
 */
export async function getJobById(jobId: string): Promise<any | null> {
  const sql = `
    SELECT
      j.id, j.company_id, j.title, j.category, j.district, j.address,
      j.work_type, j.wage_per_hour, j.wage_note, j.days, j.shifts,
      j.hours_per_week, j.description, j.responsibilities, j.requirements,
      j.benefits, j.experience_required, j.is_urgent, j.status, j.posted_at,
      c.id AS c_id, c.name AS c_name, c.industry AS c_industry,
      c.description AS c_description, c.color_hex AS c_color_hex
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.id = $1
  `;
  const rows = await query<any>(sql, [jobId]);
  if (!rows || rows.length === 0) return null;

  const r = rows[0];
  return {
    id: String(r.id),
    company_id: String(r.company_id),
    title: r.title,
    category: r.category,
    district: r.district,
    address: r.address,
    work_type: r.work_type,
    wage_per_hour: Number(r.wage_per_hour),
    wage_note: r.wage_note,
    days: r.days,
    shifts: r.shifts,
    hours_per_week: Number(r.hours_per_week),
    description: r.description,
    responsibilities: Array.isArray(r.responsibilities) ? r.responsibilities : JSON.parse(r.responsibilities || "[]"),
    requirements: Array.isArray(r.requirements) ? r.requirements : JSON.parse(r.requirements || "[]"),
    benefits: Array.isArray(r.benefits) ? r.benefits : JSON.parse(r.benefits || "[]"),
    experience_required: Boolean(r.experience_required),
    is_urgent: Boolean(r.is_urgent),
    status: r.status,
    posted_at: r.posted_at instanceof Date ? r.posted_at.toISOString() : String(r.posted_at),
    company: {
      id: String(r.c_id),
      name: r.c_name,
      industry: r.c_industry,
      description: r.c_description,
      color_hex: r.c_color_hex,
    },
  };
}

/**
 * Lấy tối đa 3 công việc tương tự cùng ngành nghề
 */
export async function getSimilarJobs(jobId: string, category: string): Promise<JobListItem[]> {
  const sql = `
    SELECT
      j.id, j.company_id, j.title, j.category, j.district, j.address,
      j.work_type, j.wage_per_hour, j.wage_note, j.days, j.shifts,
      j.hours_per_week, j.description, j.responsibilities, j.requirements,
      j.benefits, j.experience_required, j.is_urgent, j.status, j.posted_at,
      c.name AS company_name, c.color_hex AS company_color_hex
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.category = $1 AND j.id != $2 AND j.status = 'open'
    ORDER BY j.posted_at DESC
    LIMIT 3
  `;
  const rows = await query<any>(sql, [category, jobId]);

  return rows.map((r) => ({
    id: String(r.id),
    company_id: String(r.company_id),
    title: r.title,
    category: r.category,
    district: r.district,
    address: r.address,
    work_type: r.work_type,
    wage_per_hour: Number(r.wage_per_hour),
    wage_note: r.wage_note,
    days: r.days,
    shifts: r.shifts,
    hours_per_week: Number(r.hours_per_week),
    description: r.description,
    responsibilities: Array.isArray(r.responsibilities) ? r.responsibilities : JSON.parse(r.responsibilities || "[]"),
    requirements: Array.isArray(r.requirements) ? r.requirements : JSON.parse(r.requirements || "[]"),
    benefits: Array.isArray(r.benefits) ? r.benefits : JSON.parse(r.benefits || "[]"),
    experience_required: Boolean(r.experience_required),
    is_urgent: Boolean(r.is_urgent),
    status: r.status,
    posted_at: r.posted_at instanceof Date ? r.posted_at.toISOString() : String(r.posted_at),
    company_name: r.company_name,
    company_color_hex: r.company_color_hex,
  }));
}

/**
 * Lấy dữ liệu meta phục vụ xây dựng bộ lọc
 */
export async function getJobMeta(): Promise<JobMetaResponse> {
  const [categoriesRes, districtsRes, wageStatsRes] = await Promise.all([
    query<{ category: string; count: string }>(`
      SELECT category, COUNT(*) AS count
      FROM jobs
      WHERE status = 'open'
      GROUP BY category
      ORDER BY count DESC
    `),
    query<{ district: string; count: string }>(`
      SELECT district, COUNT(*) AS count
      FROM jobs
      WHERE status = 'open'
      GROUP BY district
      ORDER BY count DESC
    `),
    query<{ min_wage: string; max_wage: string; total_open: string }>(`
      SELECT
        COALESCE(MIN(wage_per_hour), 20000) AS min_wage,
        COALESCE(MAX(wage_per_hour), 150000) AS max_wage,
        COUNT(*) AS total_open
      FROM jobs
      WHERE status = 'open'
    `),
  ]);

  const stats = wageStatsRes[0] || { min_wage: "20000", max_wage: "150000", total_open: "0" };

  return {
    categories: categoriesRes.map((c) => ({ name: c.category, count: parseInt(c.count, 10) })),
    districts: districtsRes.map((d) => ({ name: d.district, count: parseInt(d.count, 10) })),
    minWage: parseInt(stats.min_wage, 10),
    maxWage: parseInt(stats.max_wage, 10),
    totalOpenJobs: parseInt(stats.total_open, 10),
  };
}

// ==========================================
// 2. NGƯỜI DÙNG & XÁC THỰC (USER QUERIES)
// ==========================================

export async function findUserByEmail(email: string): Promise<any | null> {
  const rows = await query<any>(
    "SELECT * FROM users WHERE email = $1",
    [email.trim().toLowerCase()]
  );
  return rows[0] || null;
}

export async function findUserByCccdHash(cccdHash: string): Promise<any | null> {
  const rows = await query<any>(
    "SELECT id, email FROM users WHERE cccd_hash = $1",
    [cccdHash]
  );
  return rows[0] || null;
}

export async function findUserById(id: string): Promise<any | null> {
  const rows = await query<any>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

/**
 * Đăng ký tài khoản sinh viên mới
 */
export async function createStudentUser(userData: {
  email: string;
  passwordHash: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  phone: string;
  university: string;
  studentId?: string | null;
  major?: string | null;
  yearOfStudy: number;
  district?: string | null;
  cccdHash: string;
  cccdLast4: string;
}): Promise<any> {
  const sql = `
    INSERT INTO users (
      email, password_hash, role, full_name, date_of_birth, sex,
      phone, university, student_id, major, year_of_study, district,
      cccd_hash, cccd_last4
    ) VALUES ($1, $2, 'student', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;
  const rows = await query<any>(sql, [
    userData.email.trim().toLowerCase(),
    userData.passwordHash,
    userData.fullName.trim(),
    userData.dateOfBirth,
    userData.sex,
    userData.phone.trim(),
    userData.university.trim(),
    userData.studentId || null,
    userData.major || null,
    userData.yearOfStudy,
    userData.district || null,
    userData.cccdHash,
    userData.cccdLast4,
  ]);
  return rows[0];
}

/**
 * Đăng ký tài khoản nhà tuyển dụng và công ty đầu tiên trong MỘT TRANSACTION duy nhất
 */
export async function registerEmployerWithCompanyTransaction(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  companyName: string;
  industry: string;
  colorHex?: string;
}): Promise<{ user: any; company: any }> {
  return withTransaction(async (client) => {
    // 1. Tạo tài khoản nhà tuyển dụng
    const userRes = await client.query(
      `INSERT INTO users (
        email, password_hash, role, full_name, phone
      ) VALUES ($1, $2, 'employer', $3, $4)
      RETURNING *`,
      [
        data.email.trim().toLowerCase(),
        data.passwordHash,
        data.fullName.trim(),
        data.phone.trim(),
      ]
    );
    const user = userRes.rows[0];

    // 2. Tạo công ty đầu tiên cho nhà tuyển dụng
    const defaultColor = data.colorHex || "#0f3d2e";
    const companyRes = await client.query(
      `INSERT INTO companies (
        name, industry, description, owner_user_id, color_hex
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        data.companyName.trim(),
        data.industry.trim(),
        `Đơn vị tuyển dụng ${data.companyName.trim()}`,
        user.id,
        defaultColor,
      ]
    );
    const company = companyRes.rows[0];

    return { user, company };
  });
}

/**
 * Cập nhật hồ sơ sinh viên (Chỉ sinh viên được phép sửa các trường an toàn)
 */
export async function updateStudentProfile(
  userId: string,
  updates: {
    fullName?: string;
    phone?: string;
    university?: string;
    studentId?: string | null;
    major?: string | null;
    yearOfStudy?: number | null;
    district?: string | null;
  }
): Promise<any> {
  const setClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (updates.fullName !== undefined) {
    setClauses.push(`full_name = $${paramIndex++}`);
    params.push(updates.fullName.trim());
  }
  if (updates.phone !== undefined) {
    setClauses.push(`phone = $${paramIndex++}`);
    params.push(updates.phone.trim());
  }
  if (updates.university !== undefined) {
    setClauses.push(`university = $${paramIndex++}`);
    params.push(updates.university.trim());
  }
  if (updates.studentId !== undefined) {
    setClauses.push(`student_id = $${paramIndex++}`);
    params.push(updates.studentId ? updates.studentId.trim() : null);
  }
  if (updates.major !== undefined) {
    setClauses.push(`major = $${paramIndex++}`);
    params.push(updates.major ? updates.major.trim() : null);
  }
  if (updates.yearOfStudy !== undefined) {
    setClauses.push(`year_of_study = $${paramIndex++}`);
    params.push(updates.yearOfStudy ? Number(updates.yearOfStudy) : null);
  }
  if (updates.district !== undefined) {
    setClauses.push(`district = $${paramIndex++}`);
    params.push(updates.district ? updates.district.trim() : null);
  }

  if (setClauses.length === 0) {
    return findUserById(userId);
  }

  params.push(userId);
  const sql = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<any>(sql, params);
  return rows[0] || null;
}

// ==========================================
// 3. VIỆC LÀM ĐÃ LƯU (SAVED JOBS QUERIES)
// ==========================================

export async function getSavedJobsByUserId(userId: string): Promise<any[]> {
  const sql = `
    SELECT
      sj.saved_at,
      j.id, j.company_id, j.title, j.category, j.district, j.address,
      j.work_type, j.wage_per_hour, j.wage_note, j.days, j.shifts,
      j.hours_per_week, j.description, j.experience_required, j.is_urgent,
      j.status, j.posted_at,
      c.name AS company_name, c.color_hex AS company_color_hex
    FROM saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE sj.user_id = $1
    ORDER BY sj.saved_at DESC
  `;
  const rows = await query<any>(sql, [userId]);

  return rows.map((r) => {
    const jobItem = {
      id: String(r.id),
      company_id: String(r.company_id),
      title: r.title,
      category: r.category,
      district: r.district,
      address: r.address,
      work_type: r.work_type,
      wage_per_hour: Number(r.wage_per_hour),
      wage_note: r.wage_note,
      days: r.days,
      shifts: r.shifts,
      hours_per_week: Number(r.hours_per_week),
      description: r.description,
      experience_required: Boolean(r.experience_required),
      is_urgent: Boolean(r.is_urgent),
      status: r.status,
      posted_at: r.posted_at instanceof Date ? r.posted_at.toISOString() : String(r.posted_at),
      company_name: r.company_name,
      company_color_hex: r.company_color_hex,
    };

    return {
      ...jobItem,
      user_id: userId,
      job_id: String(r.id),
      saved_at: r.saved_at instanceof Date ? r.saved_at.toISOString() : String(r.saved_at),
      job: jobItem,
    };
  });
}

export async function saveJob(userId: string, jobId: string): Promise<boolean> {
  const sql = `
    INSERT INTO saved_jobs (user_id, job_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, job_id) DO NOTHING
  `;
  await query(sql, [userId, jobId]);
  return true;
}

export async function unsaveJob(userId: string, jobId: string): Promise<boolean> {
  const sql = `
    DELETE FROM saved_jobs
    WHERE user_id = $1 AND job_id = $2
  `;
  await query(sql, [userId, jobId]);
  return true;
}

// ==========================================
// 4. HỒ SƠ ỨNG TUYỂN (APPLICATION QUERIES)
// ==========================================

export async function findApplication(jobId: string, userId: string): Promise<any | null> {
  const rows = await query<any>(
    "SELECT * FROM applications WHERE job_id = $1 AND user_id = $2",
    [jobId, userId]
  );
  return rows[0] || null;
}

export async function createApplication(data: {
  jobId: string;
  userId: string;
  fullName: string;
  phone: string;
  university: string;
  intro?: string;
  availableTime: string;
}): Promise<any> {
  const sql = `
    INSERT INTO applications (
      job_id, user_id, full_name, phone, university, intro, available_time, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'moi')
    RETURNING *
  `;
  const rows = await query<any>(sql, [
    data.jobId,
    data.userId,
    data.fullName.trim(),
    data.phone.trim(),
    data.university.trim(),
    data.intro ? data.intro.trim() : "",
    data.availableTime.trim(),
  ]);
  return rows[0];
}

export async function getApplicationsByUserId(userId: string): Promise<any[]> {
  const sql = `
    SELECT
      a.id, a.job_id, a.user_id, a.full_name, a.phone, a.university,
      a.intro, a.available_time, a.status, a.created_at, a.updated_at,
      j.title AS job_title, j.category AS job_category, j.district AS job_district,
      j.wage_per_hour, j.work_type, j.status AS job_status,
      c.name AS company_name, c.color_hex AS company_color_hex
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
  `;
  const rows = await query<any>(sql, [userId]);

  return rows.map((r) => ({
    id: String(r.id),
    job_id: String(r.job_id),
    user_id: String(r.user_id),
    full_name: r.full_name,
    phone: r.phone,
    university: r.university,
    intro: r.intro,
    available_time: r.available_time,
    status: r.status as ApplicationStatus,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    updated_at: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
    job: {
      id: String(r.job_id),
      title: r.job_title,
      category: r.job_category,
      district: r.job_district,
      wage_per_hour: Number(r.wage_per_hour),
      work_type: r.work_type,
      status: r.job_status,
      company_name: r.company_name,
      company_color_hex: r.company_color_hex,
    },
  }));
}

// ==========================================
// 5. THỐNG KÊ & QUẢN TRỊ DỮ LIỆU
// ==========================================

export async function getOpenJobCount(): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM jobs WHERE status = 'open'"
  );
  return parseInt(rows[0]?.count || "0", 10);
}

export async function getTotalJobCount(): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM jobs"
  );
  return parseInt(rows[0]?.count || "0", 10);
}

export async function getTableStatusCounts(): Promise<{
  users: number;
  companies: number;
  jobs: number;
  saved_jobs: number;
  applications: number;
}> {
  const [users, companies, jobs, savedJobs, applications] = await Promise.all([
    query<{ count: string }>("SELECT COUNT(*) AS count FROM users"),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM companies"),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM jobs"),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM saved_jobs"),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM applications"),
  ]);

  return {
    users: parseInt(users[0]?.count || "0", 10),
    companies: parseInt(companies[0]?.count || "0", 10),
    jobs: parseInt(jobs[0]?.count || "0", 10),
    saved_jobs: parseInt(savedJobs[0]?.count || "0", 10),
    applications: parseInt(applications[0]?.count || "0", 10),
  };
}

// ==========================================
// 6. QUẢN LÝ TIN VÀ ỨNG VIÊN NHÀ TUYỂN DỤNG
// ==========================================

/** Lấy toàn bộ số liệu tổng quan cho các công ty thuộc nhà tuyển dụng. */
export async function getEmployerSummary(userId: string): Promise<EmployerSummary> {
  const rows = await query<any>(`SELECT
    COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'open') AS open_jobs,
    COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'closed') AS closed_jobs,
    COUNT(a.id) FILTER (WHERE a.status = 'moi') AS new_applications,
    COUNT(a.id) FILTER (WHERE a.status = 'hen-phong-van') AS interview_applications,
    COUNT(a.id) AS total_applications
    FROM companies c LEFT JOIN jobs j ON j.company_id = c.id
    LEFT JOIN applications a ON a.job_id = j.id WHERE c.owner_user_id = $1`, [userId]);
  const row = rows[0] || {};
  return { openJobs: Number(row.open_jobs || 0), closedJobs: Number(row.closed_jobs || 0), newApplications: Number(row.new_applications || 0), interviewApplications: Number(row.interview_applications || 0), totalApplications: Number(row.total_applications || 0) };
}

/** Trả về các công ty mà người dùng hiện tại sở hữu. */
export async function getEmployerCompanies(userId: string): Promise<EmployerCompany[]> {
  const rows = await query<any>("SELECT id, name, color_hex FROM companies WHERE owner_user_id = $1 ORDER BY name", [userId]);
  return rows.map((row) => ({ id: String(row.id), name: row.name, color_hex: row.color_hex }));
}

/** Danh sách tin của nhà tuyển dụng kèm số lượng hồ sơ theo trạng thái. */
export async function getEmployerJobs(userId: string): Promise<EmployerJobListItem[]> {
  const rows = await query<any>(`SELECT j.*, c.name AS company_name, c.color_hex AS company_color_hex,
    COUNT(a.id) AS applicant_count,
    COUNT(a.id) FILTER (WHERE a.status = 'moi') AS new_applicant_count,
    COUNT(a.id) FILTER (WHERE a.status = 'hen-phong-van') AS interview_applicant_count
    FROM jobs j JOIN companies c ON c.id = j.company_id
    LEFT JOIN applications a ON a.job_id = j.id WHERE c.owner_user_id = $1
    GROUP BY j.id, c.name, c.color_hex ORDER BY j.posted_at DESC`, [userId]);
  return rows.map((row) => ({ ...mapEmployerJob(row), company_name: row.company_name, company_color_hex: row.company_color_hex, applicant_count: Number(row.applicant_count), new_applicant_count: Number(row.new_applicant_count), interview_applicant_count: Number(row.interview_applicant_count) }));
}

/** Xem một tin chỉ khi công ty sở hữu tin thuộc về nhà tuyển dụng. */
export async function getEmployerJob(userId: string, jobId: string): Promise<Job | null> {
  if (!/^\d+$/.test(jobId)) return null;
  const rows = await query<any>(`SELECT j.*, c.name AS company_name, c.color_hex AS company_color_hex
    FROM jobs j JOIN companies c ON c.id = j.company_id
    WHERE j.id = $1 AND c.owner_user_id = $2`, [jobId, userId]);
  return rows[0] ? mapEmployerJob(rows[0]) : null;
}

/** Kiểm tra tin tồn tại và trả về chủ sở hữu để service phân biệt 403/404. */
export async function getJobOwner(jobId: string): Promise<string | null> {
  if (!/^\d+$/.test(jobId)) return null;
  const rows = await query<any>("SELECT c.owner_user_id FROM jobs j JOIN companies c ON c.id = j.company_id WHERE j.id = $1", [jobId]);
  return rows[0] ? String(rows[0].owner_user_id) : null;
}

/** Tạo tin mới sau khi service đã xác nhận công ty thuộc về người dùng. */
export async function insertEmployerJob(input: CreateJobInput & { search_text: string }): Promise<Job> {
  const rows = await query<any>(`INSERT INTO jobs (company_id,title,category,district,address,work_type,wage_per_hour,wage_note,days,shifts,hours_per_week,description,responsibilities,requirements,benefits,experience_required,is_urgent,status,search_text)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15::jsonb,$16,$17,'open',$18) RETURNING *`,
  [input.company_id,input.title,input.category,input.district,input.address,input.work_type,input.wage_per_hour,input.wage_note || "",input.days,input.shifts,input.hours_per_week,input.description,JSON.stringify(input.responsibilities),JSON.stringify(input.requirements),JSON.stringify(input.benefits),input.experience_required,input.is_urgent,input.search_text]);
  return mapEmployerJob(rows[0]);
}

/** Cập nhật các trường đã gửi lên, gồm cả search_text khi nội dung tìm kiếm thay đổi. */
export async function updateEmployerJob(jobId: string, input: UpdateJobInput & { search_text?: string }): Promise<Job | null> {
  const columns: Record<string, string> = { company_id:"company_id",title:"title",category:"category",district:"district",address:"address",work_type:"work_type",wage_per_hour:"wage_per_hour",wage_note:"wage_note",days:"days",shifts:"shifts",hours_per_week:"hours_per_week",description:"description",responsibilities:"responsibilities",requirements:"requirements",benefits:"benefits",experience_required:"experience_required",is_urgent:"is_urgent",status:"status",search_text:"search_text" };
  const entries = Object.entries(input).filter(([key, value]) => columns[key] && value !== undefined);
  const values: unknown[] = [];
  const setters = entries.map(([key, value]) => { values.push(["responsibilities","requirements","benefits"].includes(key) ? JSON.stringify(value) : value); return `${columns[key]} = $${values.length}${["responsibilities","requirements","benefits"].includes(key) ? "::jsonb" : ""}`; });
  if (!setters.length) return getJobById(jobId);
  values.push(jobId);
  const rows = await query<any>(`UPDATE jobs SET ${setters.join(", ")} WHERE id = $${values.length} RETURNING *`, values);
  return rows[0] ? mapEmployerJob(rows[0]) : null;
}

/** Lấy hồ sơ ứng viên theo tin; chỉ chọn các trường được phép công khai. */
export async function getEmployerApplicants(jobId: string): Promise<EmployerApplicant[]> {
  if (!/^\d+$/.test(jobId)) return [];
  const rows = await query<any>(`SELECT a.id, a.job_id, a.status, a.created_at, a.updated_at, a.full_name, a.phone, a.university, a.available_time, a.intro,
    u.date_of_birth, u.sex, u.major, u.year_of_study
    FROM applications a JOIN users u ON u.id = a.user_id WHERE a.job_id = $1 ORDER BY a.created_at DESC`, [jobId]);
  return rows.map((row) => {
    const dateOfBirth = row.date_of_birth instanceof Date ? row.date_of_birth.toISOString().slice(0,10) : row.date_of_birth ? String(row.date_of_birth).slice(0,10) : null;
    return { id:String(row.id),job_id:String(row.job_id),status:row.status,createdAt:toIso(row.created_at),updatedAt:toIso(row.updated_at),fullName:row.full_name,phone:row.phone,university:row.university,availableTime:row.available_time,intro:row.intro,age:calculateAge(dateOfBirth,new Date()),sex:row.sex,major:row.major,yearOfStudy:row.year_of_study === null ? null : Number(row.year_of_study),verified:true };
  });
}

/** Tìm chủ sở hữu của tin ứng tuyển để áp dụng kiểm tra quyền thống nhất. */
export async function getApplicationJobOwner(applicationId: string): Promise<{ jobId: string; ownerId: string } | null> {
  if (!/^\d+$/.test(applicationId)) return null;
  const rows = await query<any>(`SELECT j.id AS job_id, c.owner_user_id FROM applications a JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id WHERE a.id=$1`, [applicationId]);
  return rows[0] ? { jobId:String(rows[0].job_id), ownerId:String(rows[0].owner_user_id) } : null;
}

/** Đổi trạng thái và chỉ trả về dữ liệu trạng thái của hồ sơ. */
export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<{ id: string; status: ApplicationStatus; updatedAt: string } | null> {
  const rows = await query<any>("UPDATE applications SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING id,status,updated_at", [status,applicationId]);
  return rows[0] ? { id:String(rows[0].id), status:rows[0].status, updatedAt:toIso(rows[0].updated_at) } : null;
}

/** Chuẩn hóa một hàng tin việc làm của PostgreSQL thành kiểu dùng chung. */
function mapEmployerJob(row: any): Job {
  return { id:String(row.id),company_id:String(row.company_id),title:row.title,category:row.category,district:row.district,address:row.address,work_type:row.work_type,wage_per_hour:Number(row.wage_per_hour),wage_note:row.wage_note,days:row.days,shifts:row.shifts,hours_per_week:Number(row.hours_per_week),description:row.description,responsibilities:Array.isArray(row.responsibilities)?row.responsibilities:JSON.parse(row.responsibilities || "[]"),requirements:Array.isArray(row.requirements)?row.requirements:JSON.parse(row.requirements || "[]"),benefits:Array.isArray(row.benefits)?row.benefits:JSON.parse(row.benefits || "[]"),experience_required:Boolean(row.experience_required),is_urgent:Boolean(row.is_urgent),status:row.status,posted_at:toIso(row.posted_at),...(row.company_name ? {company_name:row.company_name,company_color_hex:row.company_color_hex} : {}) } as Job;
}

/** Biến đổi ngày PostgreSQL hoặc ISO thành chuỗi ISO nhất quán. */
function toIso(value: Date | string): string { return value instanceof Date ? value.toISOString() : new Date(value).toISOString(); }

export async function insertUsersBatch(
  client: PoolClient,
  users: any[]
): Promise<Array<{ id: string; email: string }>> {
  const inserted: Array<{ id: string; email: string }> = [];
  for (const u of users) {
    const res = await client.query(
      `INSERT INTO users (
        email, password_hash, role, full_name, date_of_birth, sex,
        phone, university, student_id, major, year_of_study, district,
        cccd_hash, cccd_last4
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, email`,
      [
        u.email,
        u.passwordHash,
        u.role,
        u.fullName,
        u.dateOfBirth,
        u.sex,
        u.phone,
        u.university,
        u.studentId,
        u.major,
        u.yearOfStudy,
        u.district,
        u.cccdHash,
        u.cccdLast4,
      ]
    );
    if (res.rows[0]) {
      inserted.push({
        id: String(res.rows[0].id),
        email: res.rows[0].email,
      });
    }
  }
  return inserted;
}

export async function insertCompaniesBatch(
  client: PoolClient,
  companies: any[]
): Promise<Array<{ id: string; key: string; name: string }>> {
  const inserted: Array<{ id: string; key: string; name: string }> = [];
  for (const c of companies) {
    const res = await client.query(
      `INSERT INTO companies (
        name, industry, description, owner_user_id, color_hex
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name`,
      [c.name, c.industry, c.description, c.ownerUserId, c.colorHex]
    );
    if (res.rows[0]) {
      inserted.push({
        id: String(res.rows[0].id),
        key: c.key,
        name: res.rows[0].name,
      });
    }
  }
  return inserted;
}

export async function insertJobsBatch(
  client: PoolClient,
  jobs: any[]
): Promise<Array<{ id: string; title: string; companyId: string }>> {
  const inserted: Array<{ id: string; title: string; companyId: string }> = [];
  for (const j of jobs) {
    const res = await client.query(
      `INSERT INTO jobs (
        company_id, title, category, district, address, work_type,
        wage_per_hour, wage_note, days, shifts, hours_per_week,
        description, responsibilities, requirements, benefits,
        experience_required, is_urgent, status, posted_at, search_text
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13::jsonb, $14::jsonb, $15::jsonb,
        $16, $17, $18, $19, $20
      )
      RETURNING id, title, company_id`,
      [
        j.companyId,
        j.title,
        j.category,
        j.district,
        j.address,
        j.workType,
        j.wagePerHour,
        j.wageNote,
        j.days,
        j.shifts,
        j.hoursPerWeek,
        j.description,
        j.responsibilities,
        j.requirements,
        j.benefits,
        j.experienceRequired,
        j.isUrgent,
        j.status,
        j.postedAt,
        j.searchText,
      ]
    );
    if (res.rows[0]) {
      inserted.push({
        id: String(res.rows[0].id),
        title: res.rows[0].title,
        companyId: String(res.rows[0].company_id),
      });
    }
  }
  return inserted;
}

export async function insertSavedJobsBatch(
  client: PoolClient,
  savedJobs: any[]
): Promise<number> {
  let count = 0;
  for (const s of savedJobs) {
    await client.query(
      `INSERT INTO saved_jobs (user_id, job_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, job_id) DO NOTHING`,
      [s.userId, s.jobId]
    );
    count++;
  }
  return count;
}

export async function insertApplicationsBatch(
  client: PoolClient,
  apps: any[]
): Promise<number> {
  let count = 0;
  const now = new Date();
  for (const a of apps) {
    const createdAt = new Date(now.getTime() - a.daysAgo * 24 * 60 * 60 * 1000);
    await client.query(
      `INSERT INTO applications (
        job_id, user_id, full_name, phone, university,
        intro, available_time, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      ON CONFLICT (job_id, user_id) DO NOTHING`,
      [
        a.jobId,
        a.userId,
        a.fullName,
        a.phone,
        a.university,
        a.intro,
        a.availableTime,
        a.status,
        createdAt.toISOString(),
      ]
    );
    count++;
  }
  return count;
}
