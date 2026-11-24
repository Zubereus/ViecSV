import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service.js";
import type { UserRole } from "../../shared/types.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware bắt buộc đăng nhập qua JWT Bearer token và tùy chọn kiểm tra quyền vai trò
 */
export function requireAuth(requiredRole?: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        ok: false,
        message: "Vui lòng đăng nhập để tiếp tục",
      });
      return;
    }

    const token = authHeader.substring(7).trim();
    try {
      const decoded = verifyToken(token);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        res.status(403).json({
          ok: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }

      next();
    } catch {
      res.status(401).json({
        ok: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại",
      });
    }
  };
}
