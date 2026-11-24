import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { PublicUser, UserRole } from "../../shared/types.js";

/**
 * Lấy JWT Secret từ biến môi trường, báo lỗi tiếng Việt nếu chưa thiết lập
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET chưa được thiết lập trong biến môi trường. Vui lòng kiểm tra tệp .env hoặc Vercel dashboard.");
  }
  return secret;
}

/**
 * Hàm thuần túy chuyển đổi bản ghi người dùng thô từ database thành PublicUser.
 * TUYỆT ĐỐI không bao giờ chứa password_hash, cccd_hash hay số CCCD đầy đủ.
 */
export function toPublicUser(row: any): PublicUser {
  let dobString: string | null = null;
  if (row.date_of_birth) {
    if (row.date_of_birth instanceof Date) {
      dobString = row.date_of_birth.toISOString().split("T")[0];
    } else {
      dobString = String(row.date_of_birth).split("T")[0];
    }
  }

  const cccdLast4 = row.cccd_last4 ? String(row.cccd_last4) : null;
  const verified = Boolean(cccdLast4 || row.cccd_hash);
  const cccdMasked = cccdLast4 ? `•••••••• ${cccdLast4}` : null;

  return {
    id: String(row.id),
    email: String(row.email),
    role: row.role as UserRole,
    fullName: String(row.full_name || ""),
    phone: String(row.phone || ""),
    dateOfBirth: dobString,
    sex: row.sex || null,
    university: row.university || null,
    studentId: row.student_id || null,
    major: row.major || null,
    yearOfStudy: row.year_of_study ? Number(row.year_of_study) : null,
    district: row.district || null,
    cccdLast4,
    cccdMasked,
    verified,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

/**
 * Tạo JWT token có thời hạn 7 ngày
 */
export function generateToken(payload: { id: string; email: string; role: UserRole }): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

/**
 * Giải mã và xác thực tính hợp lệ của JWT token
 */
export function verifyToken(token: string): { id: string; email: string; role: UserRole } {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as { id: string; email: string; role: UserRole };
}

/**
 * Băm mật khẩu người dùng với bcryptjs
 */
export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}

/**
 * Đối chiếu mật khẩu người dùng
 */
export function comparePassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

/**
 * Băm số CCCD bằng thuật toán SHA-256 và lấy 4 số cuối.
 * Tuyệt đối không lưu số CCCD nguyên bản.
 */
export function hashCccd(rawCccd: string): { hash: string; last4: string } {
  const clean = rawCccd.trim();
  const hash = crypto.createHash("sha256").update(clean).digest("hex");
  const last4 = clean.slice(-4);
  return { hash, last4 };
}

/**
 * Bộ giới hạn tần suất gọi API (Rate Limiter) đơn giản trong bộ nhớ (in-memory).
 * Lưu ý: Trong môi trường serverless (Vercel), bộ nhớ này chỉ có hiệu lực trên từng container
 * độc lập (per-instance best-effort), phù hợp cho mức độ demo và chống brute-force cơ bản.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const authRateLimitMap = new Map<string, RateLimitRecord>();

export function checkAuthRateLimit(ip: string, maxRequests = 15, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = authRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    authRateLimitMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
