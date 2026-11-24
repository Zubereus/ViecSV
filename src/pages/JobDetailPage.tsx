import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mx-auto border border-brand-200">
        <Clock className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Chi tiết công việc #{id}
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          Trang chi tiết việc làm và form nộp hồ sơ ứng tuyển sẽ được hoàn thiện đầy đủ trong Giai đoạn 4 (Phase 4).
        </p>
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách tìm việc
        </Link>
      </div>
    </div>
  );
}
