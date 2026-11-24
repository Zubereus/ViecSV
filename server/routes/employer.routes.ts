import { Router, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { EmployerAccessError, assertEmployerOwnsJob, createEmployerJob, editEmployerJob } from "../services/employer.service.js";
import { getEmployerApplicants, getEmployerCompanies, getEmployerJob, getEmployerJobs, getEmployerSummary, getApplicationJobOwner, getJobOwner, updateApplicationStatus } from "../db/queries.js";
import { createJobSchema, updateApplicationStatusSchema, updateJobSchema } from "../../shared/validators.js";
import type { CreateJobInput, UpdateJobInput } from "../../shared/types.js";

export const employerRouter = Router();
employerRouter.use("/employer", requireAuth("employer"));

/** Trả lỗi xác thực quyền thống nhất cho các route quản lý tin. */
function handleError(error: unknown, next: NextFunction, res: Response): void {
  if (error instanceof EmployerAccessError) { res.status(error.status).json({ ok:false, message:error.message }); return; }
  next(error);
}

employerRouter.get("/employer/summary", async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok:true, summary:await getEmployerSummary(req.user!.id) }); } catch (error) { next(error); }
});

employerRouter.get("/employer/companies", async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok:true, items:await getEmployerCompanies(req.user!.id) }); } catch (error) { next(error); }
});

employerRouter.get("/employer/jobs", async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok:true, items:await getEmployerJobs(req.user!.id) }); } catch (error) { next(error); }
});

employerRouter.post("/employer/jobs", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) { const issue=parsed.error.issues[0]; res.status(400).json({ok:false,message:issue?.message || "Dữ liệu tin tuyển dụng chưa hợp lệ",field:issue?.path.join(".")}); return; }
    // Sau khi schema xác thực thành công, chuẩn hóa kiểu đầu ra tại ranh giới Zod.
    const input = parsed.data as CreateJobInput;
    res.status(201).json({ ok:true, job:await createEmployerJob(req.user!.id, input) });
  } catch (error) { handleError(error,next,res); }
});

employerRouter.get("/employer/jobs/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job=await getEmployerJob(req.user!.id, req.params.id);
    if (!job) { const ownerId=await getJobOwner(req.params.id); res.status(ownerId?403:404).json({ok:false,message:ownerId?"Bạn không có quyền truy cập":"Không tìm thấy tin tuyển dụng"}); return; }
    res.json({ok:true,job});
  } catch (error) { next(error); }
});

employerRouter.patch("/employer/jobs/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed=updateJobSchema.safeParse(req.body);
    if (!parsed.success) { const issue=parsed.error.issues[0]; res.status(400).json({ok:false,message:issue?.message || "Dữ liệu chưa hợp lệ",field:issue?.path.join(".")}); return; }
    res.json({ok:true,job:await editEmployerJob(req.user!.id,req.params.id,parsed.data as UpdateJobInput)});
  } catch (error) { handleError(error,next,res); }
});

employerRouter.get("/employer/jobs/:id/applications", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await assertEmployerOwnsJob(req.user!.id,req.params.id);
    const [job, items]=await Promise.all([getEmployerJob(req.user!.id,req.params.id),getEmployerApplicants(req.params.id)]);
    res.json({ok:true,job,items,total:items.length});
  } catch (error) { handleError(error,next,res); }
});

employerRouter.patch("/employer/applications/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed=updateApplicationStatusSchema.safeParse(req.body);
    if (!parsed.success) { const issue=parsed.error.issues[0]; res.status(400).json({ok:false,message:issue?.message || "Trạng thái ứng tuyển không hợp lệ",field:"status"}); return; }
    const ownership=await getApplicationJobOwner(req.params.id);
    if (!ownership) { res.status(404).json({ok:false,message:"Không tìm thấy hồ sơ ứng tuyển"}); return; }
    if (ownership.ownerId!==req.user!.id) { res.status(403).json({ok:false,message:"Bạn không có quyền truy cập"}); return; }
    const application=await updateApplicationStatus(req.params.id,parsed.data.status);
    res.json({ok:true,application});
  } catch (error) { next(error); }
});
