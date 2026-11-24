import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import {
  searchJobs,
  getJobById,
  getSimilarJobs,
  getJobMeta,
  findApplication,
  createApplication,
} from "../db/queries.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validatePhone } from "../../shared/validators.js";
import type { JobSortOption } from "../../shared/types.js";

export const jobsRouter = Router();

// Schema kiểm tra query tìm kiếm việc làm
const jobsQuerySchema = z.object({
  q: z.string().optional(),
  minWage: z.coerce.number().min(0, "Mức lương tối thiểu không được âm").optional(),
  maxWage: z.coerce.number().min(0, "Mức lương tối đa không được âm").optional(),
  days: z.string().optional(),
  shifts: z.string().optional(),
  categories: z.string().optional(),
  districts: z.string().optional(),
  workTypes: z.string().optional(),
  noExperience: z
    .enum(["true", "false", "1", "0"])
    .optional()
    .transform((val) => val === "true" || val === "1"),
  sort: z.enum(["moi-nhat", "luong-cao", "luong-thap"]).default("moi-nhat"),
  page: z.coerce.number().int().min(1, "Trang phải từ 1 trở lên").default(1),
  pageSize: z.coerce.number().int().min(1).max(50, "Mỗi trang tối đa 50 việc làm").default(12),
});

// Helper chuyển chuỗi phân tách dấu phẩy thành mảng
function parseCommaArray(val?: string): string[] | undefined {
  if (!val) return undefined;
  const list = val.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

// 1. GET /api/jobs - Tìm kiếm việc làm mở có bộ lọc, sắp xếp và phân trang
jobsRouter.get(
  "/jobs",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = jobsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        res.status(400).json({
          ok: false,
          message: firstIssue ? `Dữ liệu tìm kiếm không hợp lệ: ${firstIssue.message}` : "Dữ liệu tìm kiếm không hợp lệ",
        });
        return;
      }

      const { q, minWage, maxWage, days, shifts, categories, districts, workTypes, noExperience, sort, page, pageSize } = parsed.data;

      const filters = {
        q,
        minWage,
        maxWage,
        days: parseCommaArray(days),
        shifts: parseCommaArray(shifts),
        categories: parseCommaArray(categories),
        districts: parseCommaArray(districts),
        workTypes: parseCommaArray(workTypes),
        noExperience,
        status: "open" as const,
      };

      const { items, total } = await searchJobs(filters, sort as JobSortOption, page, pageSize);
      const totalPages = Math.ceil(total / pageSize);

      res.json({
        ok: true,
        items,
        total,
        page,
        pageSize,
        totalPages,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 2. GET /api/meta - Thống kê số lượng việc theo danh mục, quận, khoảng lương
jobsRouter.get(
  "/meta",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const meta = await getJobMeta();
      res.json({
        ok: true,
        ...meta,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 3. GET /api/jobs/:id - Chi tiết việc làm
jobsRouter.get(
  "/jobs/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await getJobById(id);

      if (!job) {
        res.status(404).json({
          ok: false,
          message: "Không tìm thấy công việc",
        });
        return;
      }

      res.json({
        ok: true,
        job,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 4. GET /api/jobs/:id/similar - 3 công việc tương tự cùng ngành nghề
jobsRouter.get(
  "/jobs/:id/similar",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await getJobById(id);

      if (!job) {
        res.status(404).json({
          ok: false,
          message: "Không tìm thấy công việc",
        });
        return;
      }

      const similarJobs = await getSimilarJobs(id, job.category);

      res.json({
        ok: true,
        items: similarJobs,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 5. POST /api/jobs/:id/apply - Sinh viên nộp đơn ứng tuyển
jobsRouter.post(
  "/jobs/:id/apply",
  requireAuth("student"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body || {};

      // 1. Kiểm tra việc làm tồn tại
      const job = await getJobById(id);
      if (!job) {
        res.status(404).json({
          ok: false,
          message: "Không tìm thấy công việc",
        });
        return;
      }

      // 2. Không cho phép ứng tuyển tin đã đóng
      if (job.status === "closed") {
        res.status(400).json({
          ok: false,
          message: "Tin tuyển dụng đã đóng",
        });
        return;
      }

      // 3. Kiểm tra thông tin ứng tuyển
      if (!body.fullName || !String(body.fullName).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập họ và tên ứng tuyển", field: "fullName" });
        return;
      }

      const phoneErr = validatePhone(body.phone);
      if (phoneErr) {
        res.status(400).json({ ok: false, message: phoneErr, field: "phone" });
        return;
      }

      if (!body.university || !String(body.university).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập trường đại học", field: "university" });
        return;
      }

      if (!body.availableTime || !String(body.availableTime).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập thời gian bạn có thể làm việc", field: "availableTime" });
        return;
      }

      // 4. Kiểm tra trùng lặp hồ sơ ứng tuyển
      const existingApp = await findApplication(id, req.user!.id);
      if (existingApp) {
        res.status(400).json({
          ok: false,
          message: "Bạn đã ứng tuyển việc này rồi",
        });
        return;
      }

      // 5. Tạo hồ sơ ứng tuyển mới
      const application = await createApplication({
        jobId: id,
        userId: req.user!.id,
        fullName: body.fullName,
        phone: body.phone,
        university: body.university,
        intro: body.intro,
        availableTime: body.availableTime,
      });

      res.status(201).json({
        ok: true,
        message: "Ứng tuyển thành công",
        application: {
          id: String(application.id),
          job_id: String(application.job_id),
          user_id: String(application.user_id),
          full_name: application.full_name,
          phone: application.phone,
          university: application.university,
          intro: application.intro,
          available_time: application.available_time,
          status: application.status,
          created_at: application.created_at instanceof Date ? application.created_at.toISOString() : String(application.created_at),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);
