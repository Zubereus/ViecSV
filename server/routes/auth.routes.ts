import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import {
  toPublicUser,
  generateToken,
  hashPassword,
  comparePassword,
  hashCccd,
  checkAuthRateLimit,
} from "../services/auth.service.js";
import {
  findUserByEmail,
  findUserByCccdHash,
  findUserById,
  createStudentUser,
  registerEmployerWithCompanyTransaction,
} from "../db/queries.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateDateOfBirth,
  validateCccd,
  validateStudentId,
  validateYearOfStudy,
} from "../../shared/validators.js";
import type { Sex } from "../../shared/types.js";

export const authRouter = Router();

// Middleware kiểm tra tần suất gọi xác thực (Rate limit)
function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
  if (!checkAuthRateLimit(clientIp)) {
    res.status(429).json({
      ok: false,
      message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ 1 phút rồi thử lại.",
    });
    return;
  }
  next();
}

// 1. Đăng ký tài khoản Sinh viên
authRouter.post(
  "/register/student",
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body;

      // Kiểm tra hợp lệ các trường bằng shared validators
      const emailErr = validateEmail(body.email);
      if (emailErr) {
        res.status(400).json({ ok: false, message: emailErr, field: "email" });
        return;
      }

      const passErr = validatePassword(body.password);
      if (passErr) {
        res.status(400).json({ ok: false, message: passErr, field: "password" });
        return;
      }

      if (!body.fullName || !String(body.fullName).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập họ và tên", field: "fullName" });
        return;
      }

      const dobErr = validateDateOfBirth(body.dateOfBirth);
      if (dobErr) {
        res.status(400).json({ ok: false, message: dobErr, field: "dateOfBirth" });
        return;
      }

      const sex: Sex = body.sex;
      if (!["nam", "nu", "khac"].includes(sex)) {
        res.status(400).json({ ok: false, message: "Vui lòng chọn giới tính hợp lệ", field: "sex" });
        return;
      }

      const phoneErr = validatePhone(body.phone);
      if (phoneErr) {
        res.status(400).json({ ok: false, message: phoneErr, field: "phone" });
        return;
      }

      if (!body.university || !String(body.university).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng chọn trường đại học", field: "university" });
        return;
      }

      const yearErr = validateYearOfStudy(body.yearOfStudy);
      if (yearErr) {
        res.status(400).json({ ok: false, message: yearErr, field: "yearOfStudy" });
        return;
      }

      const mssvErr = validateStudentId(body.studentId);
      if (mssvErr) {
        res.status(400).json({ ok: false, message: mssvErr, field: "studentId" });
        return;
      }

      const cccdErr = validateCccd(body.cccd, body.dateOfBirth, sex);
      if (cccdErr) {
        res.status(400).json({ ok: false, message: cccdErr, field: "cccd" });
        return;
      }

      // Kiểm tra trùng lặp email
      const existingEmail = await findUserByEmail(body.email);
      if (existingEmail) {
        res.status(400).json({ ok: false, message: "Email đã được sử dụng", field: "email" });
        return;
      }

      // Băm CCCD bằng SHA-256 để kiểm tra trùng lặp và lưu trữ
      const { hash: cccdHash, last4: cccdLast4 } = hashCccd(body.cccd);
      const existingCccd = await findUserByCccdHash(cccdHash);
      if (existingCccd) {
        res.status(400).json({ ok: false, message: "CCCD này đã được đăng ký", field: "cccd" });
        return;
      }

      // Băm mật khẩu và lưu người dùng mới
      const passwordHash = hashPassword(body.password);
      const newUser = await createStudentUser({
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        sex,
        phone: body.phone,
        university: body.university,
        studentId: body.studentId,
        major: body.major,
        yearOfStudy: Number(body.yearOfStudy),
        district: body.district,
        cccdHash,
        cccdLast4,
      });

      const publicUser = toPublicUser(newUser);
      const token = generateToken({
        id: publicUser.id,
        email: publicUser.email,
        role: publicUser.role,
      });

      res.status(201).json({
        ok: true,
        token,
        user: publicUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 2. Đăng ký tài khoản Nhà tuyển dụng kèm Doanh nghiệp đầu tiên (1 Transaction)
authRouter.post(
  "/register/employer",
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body;

      const emailErr = validateEmail(body.email);
      if (emailErr) {
        res.status(400).json({ ok: false, message: emailErr, field: "email" });
        return;
      }

      const passErr = validatePassword(body.password);
      if (passErr) {
        res.status(400).json({ ok: false, message: passErr, field: "password" });
        return;
      }

      if (!body.fullName || !String(body.fullName).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập họ và tên đại diện", field: "fullName" });
        return;
      }

      const phoneErr = validatePhone(body.phone);
      if (phoneErr) {
        res.status(400).json({ ok: false, message: phoneErr, field: "phone" });
        return;
      }

      if (!body.companyName || !String(body.companyName).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng nhập tên công ty hoặc thương hiệu", field: "companyName" });
        return;
      }

      if (!body.industry || !String(body.industry).trim()) {
        res.status(400).json({ ok: false, message: "Vui lòng chọn lĩnh vực hoạt động", field: "industry" });
        return;
      }

      // Kiểm tra trùng lặp email
      const existingUser = await findUserByEmail(body.email);
      if (existingUser) {
        res.status(400).json({ ok: false, message: "Email đã được sử dụng", field: "email" });
        return;
      }

      const passwordHash = hashPassword(body.password);
      const { user } = await registerEmployerWithCompanyTransaction({
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        phone: body.phone,
        companyName: body.companyName,
        industry: body.industry,
      });

      const publicUser = toPublicUser(user);
      const token = generateToken({
        id: publicUser.id,
        email: publicUser.email,
        role: publicUser.role,
      });

      res.status(201).json({
        ok: true,
        token,
        user: publicUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 3. Đăng nhập hệ thống (Sinh viên & Nhà tuyển dụng)
authRouter.post(
  "/login",
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          ok: false,
          message: "Vui lòng nhập email và mật khẩu",
        });
        return;
      }

      const user = await findUserByEmail(email);
      if (!user) {
        res.status(400).json({
          ok: false,
          message: "Email hoặc mật khẩu không đúng",
        });
        return;
      }

      const isMatch = comparePassword(password, user.password_hash);
      if (!isMatch) {
        res.status(400).json({
          ok: false,
          message: "Email hoặc mật khẩu không đúng",
        });
        return;
      }

      const publicUser = toPublicUser(user);
      const token = generateToken({
        id: publicUser.id,
        email: publicUser.email,
        role: publicUser.role,
      });

      res.json({
        ok: true,
        token,
        user: publicUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 4. Lấy thông tin người dùng hiện tại (Current User)
authRouter.get(
  "/me",
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ ok: false, message: "Vui lòng đăng nhập" });
        return;
      }

      const user = await findUserById(req.user.id);
      if (!user) {
        res.status(404).json({ ok: false, message: "Không tìm thấy người dùng" });
        return;
      }

      res.json({
        ok: true,
        user: toPublicUser(user),
      });
    } catch (err) {
      next(err);
    }
  }
);
