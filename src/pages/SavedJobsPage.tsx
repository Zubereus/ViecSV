import { BookmarkCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function SavedJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
          Việc làm đã lưu
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Danh sách các cơ hội việc làm bán thời gian bạn đã đánh dấu để ứng tuyển sau.
        </p>
      </div>

      {/* Thoughtfully crafted Empty State */}
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-card max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4 border border-brand-100">
          <BookmarkCheck className="w-6 h-6" />
        </div>
        <h2 className="font-display font-semibold text-lg text-slate-900">
          Chưa có việc làm nào được lưu
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          Khi tìm kiếm công việc phù hợp với lịch học và khu vực của bạn, hãy nhấn nút lưu để theo dõi và ứng tuyển nhanh chóng.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
          >
            Khám phá việc làm ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
