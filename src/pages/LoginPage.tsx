import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserRound, Building2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { validateEmail, validatePassword } from "../../shared/validators";

interface LoginLocationState {
  from?: { pathname: string; search?: string; hash?: string };
  message?: string;
}

/** Trang đăng nhập đầy đủ với kiểm tra dữ liệu, trợ giúp tài khoản demo và chuyển hướng sau đăng nhập. */
export function LoginPage() {
  useDocumentTitle("Đăng nhập");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const state = (location.state as LoginLocationState | null) || null;
  const fromPath = useMemo(() => {
    const from = state?.from;
    if (!from) return null;
    return `${from.pathname || "/"}${from.search || ""}${from.hash || ""}`;
  }, [state]);

  useEffect(() => {
    const stored = sessionStorage.getItem("viecsv_auth_message");
    if (stored) {
      setInfoMessage(stored);
      sessionStorage.removeItem("viecsv_auth_message");
    } else if (state?.message) {
      setInfoMessage(state.message);
    }
  }, [state]);

  const fillDemoStudent = () => {
    setEmail("sinhvien@demo.vn");
    setPassword("demo1234");
    setErrors({});
  };

  const fillDemoEmployer = () => {
    setEmail("tuyendung@demo.vn");
    setPassword("demo1234");
    setErrors({});
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setErrors({});
    try {
      const loggedInUser = await login({ email: email.trim(), password });
      if (loggedInUser.role === "employer") {
        navigate("/employer", { replace: true });
      } else {
        navigate(fromPath || "/", { replace: true });
      }
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Không thể đăng nhập. Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg shadow-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="w-11 h-11 rounded-md bg-brand-700 text-white flex items-center justify-center font-display font-bold">VS</div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Đăng nhập ViệcSV</h1>
          <p className="text-sm text-slate-600">Truy cập tài khoản để lưu việc làm, ứng tuyển và theo dõi hồ sơ của bạn.</p>
        </div>

        {infoMessage && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
            {infoMessage}
          </div>
        )}

        {errors.form && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700" role="alert">
            {errors.form}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-sm font-medium text-slate-800">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 ${
                errors.email ? "border-rose-300" : "border-slate-300 focus:border-brand-700"
              }`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <p id="login-email-error" className="text-xs text-rose-700">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-800">Mật khẩu</label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md border px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 ${
                  errors.password ? "border-rose-300" : "border-slate-300 focus:border-brand-700"
                }`}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="text-xs text-rose-700">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="border border-slate-200 rounded-md p-4 bg-surface-subtle space-y-3">
          <p className="text-sm font-medium text-slate-800">Dùng tài khoản demo</p>
          <p className="text-xs text-slate-600">Chọn một tài khoản để điền nhanh thông tin đăng nhập (không tự động đăng nhập).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 rounded-md text-slate-700"
            >
              <UserRound className="w-4 h-4 text-brand-700" />
              Sinh viên demo
            </button>
            <button
              type="button"
              onClick={fillDemoEmployer}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 rounded-md text-slate-700"
            >
              <Building2 className="w-4 h-4 text-brand-700" />
              Nhà tuyển dụng demo
            </button>
          </div>
          <div className="text-xs text-slate-500 space-y-0.5">
            <p>Sinh viên: <span className="font-medium text-slate-700">sinhvien@demo.vn</span> / <span className="font-medium text-slate-700">demo1234</span></p>
            <p>Nhà tuyển dụng: <span className="font-medium text-slate-700">tuyendung@demo.vn</span> / <span className="font-medium text-slate-700">demo1234</span></p>
          </div>
        </div>

        <p className="text-sm text-slate-600 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-medium text-brand-700 hover:text-brand-600 underline-offset-2 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
