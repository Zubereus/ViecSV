import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import type { UserRole } from "../../shared/types";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: UserRole;
}

/** Bảo vệ trang yêu cầu đăng nhập và tùy chọn kiểm tra vai trò người dùng. */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-brand-700 animate-spin mx-auto" aria-hidden="true" />
        <p className="text-sm text-slate-600">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-lg p-8 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-display text-xl font-semibold text-slate-900">Bạn không có quyền truy cập trang này</h1>
          <p className="text-sm text-slate-600">Tài khoản hiện tại không phù hợp với khu vực bạn đang truy cập.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
