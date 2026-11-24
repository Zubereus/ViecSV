import { Router, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { updateStudentProfile } from "../db/queries.js";
import { toPublicUser } from "../services/auth.service.js";
import {
  validatePhone,
  validateStudentId,
  validateYearOfStudy,
} from "../../shared/validators.js";

export const profileRouter = Router();

// PATCH /api/profile - Cập nhật thông tin sinh viên
profileRouter.patch(
  "/profile",
  requireAuth("student"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body || {};

      // Nghiêm cấm thay đổi ngày sinh, giới tính hoặc CCCD
      if (
        body.dateOfBirth !== undefined ||
        body.date_of_birth !== undefined ||
        body.sex !== undefined ||
        body.cccd !== undefined ||
        body.cccd_hash !== undefined ||
        body.cccd_last4 !== undefined
      ) {
        res.status(400).json({
          ok: false,
          message: "Không được phép thay đổi ngày sinh, giới tính hoặc số CCCD",
        });
        return;
      }

      // Kiểm tra hợp lệ các trường cập nhật nếu có
      if (body.phone !== undefined) {
        const phoneErr = validatePhone(body.phone);
        if (phoneErr) {
          res.status(400).json({ ok: false, message: phoneErr, field: "phone" });
          return;
        }
      }

      if (body.studentId !== undefined) {
        const mssvErr = validateStudentId(body.studentId);
        if (mssvErr) {
          res.status(400).json({ ok: false, message: mssvErr, field: "studentId" });
          return;
        }
      }

      if (body.yearOfStudy !== undefined) {
        const yearErr = validateYearOfStudy(body.yearOfStudy);
        if (yearErr) {
          res.status(400).json({ ok: false, message: yearErr, field: "yearOfStudy" });
          return;
        }
      }

      const updatedUser = await updateStudentProfile(req.user!.id, {
        fullName: body.fullName,
        phone: body.phone,
        university: body.university,
        studentId: body.studentId,
        major: body.major,
        yearOfStudy: body.yearOfStudy,
        district: body.district,
      });

      res.json({
        ok: true,
        user: toPublicUser(updatedUser),
      });
    } catch (err) {
      next(err);
    }
  }
);
