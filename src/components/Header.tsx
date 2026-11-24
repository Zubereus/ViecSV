import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, BookmarkCheck, Briefcase } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:rounded"
            aria-label="ViệcSV Trang chủ"
          >
            <div className="w-8 h-8 rounded-md bg-brand-700 text-white flex items-center justify-center font-display font-bold text-sm tracking-tight shadow-sm group-hover:bg-brand-600 transition-colors">
              VS
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              Việc<span className="text-brand-700">SV</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <Briefcase className="w-4 h-4 text-brand-700/80" />
              Tìm việc
            </NavLink>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <BookmarkCheck className="w-4 h-4 text-brand-700/80" />
              Việc đã lưu
            </NavLink>
          </nav>

          {/* User actions (Đăng nhập - Placeholder for Phase 0) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 active:bg-brand-800 rounded-md transition-colors shadow-sm focus-visible:outline-brand-700"
              title="Chức năng đăng nhập sẽ kích hoạt ở các giai đoạn sau"
            >
              Đăng nhập
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Mở danh mục điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              Tìm việc
            </NavLink>

            <NavLink
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <BookmarkCheck className="w-4 h-4 text-brand-700" />
              Việc đã lưu
            </NavLink>

            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
