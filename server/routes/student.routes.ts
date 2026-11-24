import { Router, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getSavedJobsByUserId,
  saveJob,
  unsaveJob,
  getApplicationsByUserId,
  getJobById,
} from "../db/queries.js";

export const studentRouter = Router();

// Tất cả các route tại đây đều yêu cầu quyền Sinh viên (role: 'student')
studentRouter.use(requireAuth("student"));

// 1. GET /api/saved - Lấy danh sách việc làm đã lưu
studentRouter.get(
  "/saved",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await getSavedJobsByUserId(req.user!.id);
      res.json({
        ok: true,
        items,
        total: items.length,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 2. PUT /api/saved/:jobId - Lưu việc làm (Idempotent)
studentRouter.put(
  "/saved/:jobId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;

      // Kiểm tra việc làm có tồn tại
      const job = await getJobById(jobId);
      if (!job) {
        res.status(404).json({
          ok: false,
          message: "Không tìm thấy việc làm",
        });
        return;
      }

      await saveJob(req.user!.id, jobId);

      res.json({
        ok: true,
        saved: true,
        message: "Đã lưu công việc thành công",
      });
    } catch (err) {
      next(err);
    }
  }
);

// 3. DELETE /api/saved/:jobId - Hủy lưu việc làm (Idempotent)
studentRouter.delete(
  "/saved/:jobId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      await unsaveJob(req.user!.id, jobId);

      res.json({
        ok: true,
        saved: false,
        message: "Đã xóa khỏi danh sách đã lưu",
      });
    } catch (err) {
      next(err);
    }
  }
);

// 4. GET /api/applications/mine - Xem các hồ sơ ứng tuyển của tôi
studentRouter.get(
  "/applications/mine",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applications = await getApplicationsByUserId(req.user!.id);
      res.json({
        ok: true,
        items: applications,
        total: applications.length,
      });
    } catch (err) {
      next(err);
    }
  }
);
