import { normalizeText } from "../../shared/text.js";
import type { CreateJobInput, UpdateJobInput } from "../../shared/types.js";
import { getEmployerCompanies, getEmployerJob, getJobOwner, insertEmployerJob, updateEmployerJob } from "../db/queries.js";

export class EmployerAccessError extends Error {
  constructor(public readonly status: 403 | 404) {
    super(status === 403 ? "Bạn không có quyền truy cập" : "Không tìm thấy tin tuyển dụng");
  }
}

/** Xác nhận công ty được chọn do chính nhà tuyển dụng hiện tại sở hữu. */
async function getOwnedCompany(userId: string, companyId: string) {
  const company = (await getEmployerCompanies(userId)).find((item) => item.id === companyId);
  if (!company) throw new EmployerAccessError(403);
  return company;
}

/** Tạo từ khóa tìm kiếm theo cùng thứ tự và chuẩn hóa như dữ liệu seed. */
function makeSearchText(title: string, companyName: string, category: string, district: string, description: string, responsibilities: string[], requirements: string[]): string {
  return normalizeText(`${title} ${companyName} ${category} ${district} ${description} ${responsibilities.join(" ")} ${requirements.join(" ")}`);
}

/** Tạo tin sau khi kiểm tra quyền sở hữu công ty. */
export async function createEmployerJob(userId: string, input: CreateJobInput) {
  const company = await getOwnedCompany(userId, input.company_id);
  return insertEmployerJob({ ...input, search_text: makeSearchText(input.title, company.name, input.category, input.district, input.description, input.responsibilities, input.requirements) });
}

/** Cập nhật tin sau khi phân biệt tin không tồn tại và tin của người khác. */
export async function editEmployerJob(userId: string, jobId: string, input: UpdateJobInput) {
  const current = await getEmployerJob(userId, jobId);
  if (!current) {
    const ownerId = await getJobOwner(jobId);
    throw new EmployerAccessError(ownerId ? 403 : 404);
  }
  const companyId = input.company_id ?? current.company_id;
  const company = await getOwnedCompany(userId, companyId);
  const shouldReindex = input.title !== undefined || input.category !== undefined || input.description !== undefined || input.company_id !== undefined || input.district !== undefined || input.responsibilities !== undefined || input.requirements !== undefined;
  const fields = { ...input, ...(shouldReindex ? { search_text: makeSearchText(input.title ?? current.title, company.name, input.category ?? current.category, input.district ?? current.district, input.description ?? current.description, input.responsibilities ?? current.responsibilities, input.requirements ?? current.requirements) } : {}) };
  const job = await updateEmployerJob(jobId, fields);
  if (!job) throw new EmployerAccessError(404);
  return job;
}

/** Kiểm tra nhà tuyển dụng có quyền quản lý tin ứng tuyển hay không. */
export async function assertEmployerOwnsJob(userId: string, jobId: string): Promise<void> {
  const job = await getEmployerJob(userId, jobId);
  if (job) return;
  const ownerId = await getJobOwner(jobId);
  throw new EmployerAccessError(ownerId ? 403 : 404);
}
