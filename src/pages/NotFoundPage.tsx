import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/** Trang 404 tiếng Việt cho các đường dẫn không tồn tại. */
export function NotFoundPage() {
  useDocumentTitle("Không tìm thấy trang");

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-lg p-8 sm:p-10 text-center shadow-card space-y-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center mx-auto">
        <SearchX className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-slate-900">Không tìm thấy trang</h1>
        <p className="text-sm text-slate-600">Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
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
