import express, { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { getOpenJobCount } from "./db/queries.js";
import { authRouter } from "./routes/auth.routes.js";
import { profileRouter } from "./routes/profile.routes.js";
import { jobsRouter } from "./routes/jobs.routes.js";
import { studentRouter } from "./routes/student.routes.js";

// Khởi tạo ứng dụng Express cho ViệcSV
export const app = express();

// Middleware giải mã JSON payload
app.use(express.json());

// 1. Endpoint kiểm tra sức khỏe hệ thống và số lượng việc mở
app.get("/api/health", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const openJobs = await getOpenJobCount();
    res.json({
      ok: true,
      db: true,
      jobs: openJobs,
      message: "Hệ thống ViệcSV hoạt động bình thường",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || "development",
    });
  } catch (err) {
    next(err);
  }
});

// 2. Gắn kết các router chức năng
app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api", jobsRouter);
app.use("/api", studentRouter);

// 3. Xử lý đường dẫn API không tồn tại (404)
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    message: "Không tìm thấy tài nguyên API yêu cầu",
  });
});

// 4. Middleware xử lý lỗi trung tâm trả về JSON tiếng Việt chuẩn hóa
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Lỗi do Zod validate schema
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    const field = issue ? issue.path.join(".") : undefined;
    const message = issue
      ? `Dữ liệu không hợp lệ tại trường '${field}': ${issue.message}`
      : "Dữ liệu không hợp lệ";
    res.status(400).json({
      ok: false,
      message,
      field,
    });
    return;
  }

  // Lỗi máy chủ không mong muốn: ghi log nội bộ bảo mật, trả về thông báo 500 tiếng Việt
  console.error("[Lỗi Máy Chủ ViệcSV]:", err);
  res.status(500).json({
    ok: false,
    message: "Có lỗi xảy ra, vui lòng thử lại",
  });
});

export default app;
