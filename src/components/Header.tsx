import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BookmarkCheck,
  Briefcase,
  User,
  FileText,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useSavedJobs } from "../lib/SavedJobsContext";

/** Thanh điều hướng chính với trạng thái đăng nhập, menu người dùng và số lượng việc đã lưu. */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { savedCount } = useSavedJobs();

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenus = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const savedLabel = user?.role === "student" ? `Việc đã lưu (${savedCount})` : "Việc đã lưu";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex min-w-0 items-center gap-7">
            <Link
              to="/"
              className="flex shrink-0 items-center group focus-visible:rounded"
              aria-label="ViệcSV Trang chủ"
              onClick={closeMenus}
            >
              <img
                src="/branding/viecsv-lockup.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto shrink-0 transition-opacity group-hover:opacity-90"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <Briefcase className="w-4 h-4 text-brand-700/80" />
                Tìm việc
              </NavLink>

              {user?.role === "student" && (
                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <BookmarkCheck className="w-4 h-4 text-brand-700/80" />
                  {savedLabel}
                </NavLink>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {user?.role === "student" && (
              <div className="relative" ref={menuRef}>
                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-800"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold">
                    {(user.fullName || "S").trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[140px] truncate">{user.fullName || "Sinh viên"}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Menu tài khoản sinh viên"
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-dropdown p-1.5 z-40"
                  >
                    <Link role="menuitem" to="/profile" onClick={closeMenus} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                      <User className="w-4 h-4 text-brand-700" /> Hồ sơ của tôi
                    </Link>
                    <Link role="menuitem" to="/saved" onClick={closeMenus} className="flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                      <span className="inline-flex items-center gap-2"><BookmarkCheck className="w-4 h-4 text-brand-700" /> Việc đã lưu</span>
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded">{savedCount}</span>
                    </Link>
                    <Link role="menuitem" to="/applications" onClick={closeMenus} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                      <FileText className="w-4 h-4 text-brand-700" /> Đơn ứng tuyển của tôi
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-rose-700 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {user?.role === "employer" && (
              <div className="flex items-center gap-2">
                <Link
                  to="/employer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md border border-slate-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-700" /> Bảng điều khiển
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Đóng danh mục điều hướng" : "Mở danh mục điều hướng"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            <NavLink
              to="/"
              end
              onClick={closeMenus}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`
              }
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              Tìm việc
            </NavLink>

            {!user && (
              <>
                <Link to="/login" onClick={closeMenus} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                  Đăng nhập
                </Link>
                <Link to="/register" onClick={closeMenus} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white bg-brand-700 hover:bg-brand-600">
                  Đăng ký
                </Link>
              </>
            )}

            {user?.role === "student" && (
              <>
                <NavLink to="/saved" onClick={closeMenus} className={({ isActive }) => `flex items-center justify-between gap-2 px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                  <span className="inline-flex items-center gap-2"><BookmarkCheck className="w-4 h-4 text-brand-700" /> Việc đã lưu</span>
                  <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded">{savedCount}</span>
                </NavLink>
                <NavLink to="/profile" onClick={closeMenus} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                  <User className="w-4 h-4 text-brand-700" /> Hồ sơ của tôi
                </NavLink>
                <NavLink to="/applications" onClick={closeMenus} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                  <FileText className="w-4 h-4 text-brand-700" /> Đơn ứng tuyển của tôi
                </NavLink>
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-rose-700 hover:bg-rose-50 text-left">
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </>
            )}

            {user?.role === "employer" && (
              <>
                <Link to="/employer" onClick={closeMenus} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                  <LayoutDashboard className="w-4 h-4 text-brand-700" /> Bảng điều khiển
                </Link>
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-rose-700 hover:bg-rose-50 text-left">
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
