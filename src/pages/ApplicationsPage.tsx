import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarClock,
  Eye,
  FileText,
  RotateCcw,
  UserCheck,
  XCircle,
} from "lucide-react";
import { fetchMyApplications } from "../api/applications";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { formatDate, getApplicationStatusLabel } from "../lib/profile";
import { getMonogram, getReadableTextColor } from "../lib/format";
import type { Application, ApplicationStatus } from "../../shared/types";

const STATUS_FILTERS: Array<{ value: "all" | ApplicationStatus; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "moi", label: "Mới gửi" },
  { value: "da-xem", label: "Đã xem" },
  { value: "hen-phong-van", label: "Hẹn phỏng vấn" },
  { value: "da-nhan", label: "Đã nhận" },
  { value: "tu-choi", label: "Từ chối" },
];

/** Trang danh sách hồ sơ ứng tuyển của sinh viên với trạng thái, bộ lọc và liên kết về chi tiết việc làm. */
export function ApplicationsPage() {
  useDocumentTitle("Đơn ứng tuyển của tôi");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMyApplications();
      setApplications(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách đơn ứng tuyển.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-slate-900">Đơn ứng tuyển của tôi</h1>
        <p className="text-sm text-slate-600">Theo dõi trạng thái các hồ sơ bạn đã gửi đến nhà tuyển dụng.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                active
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="space-y-3" aria-label="Đang tải đơn ứng tuyển">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-white border border-rose-200 rounded-lg p-6 text-center space-y-3 shadow-card">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-sm font-semibold text-rose-800">Không tải được danh sách đơn ứng tuyển</p>
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadApplications()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md"
          >
            <RotateCcw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center shadow-card max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="font-display text-lg font-semibold text-slate-900">Bạn chưa có đơn ứng tuyển nào</h2>
          <p className="text-sm text-slate-600">Hãy khám phá các việc làm phù hợp và gửi hồ sơ ứng tuyển đầu tiên của bạn.</p>
          <Link to="/" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md">
            Khám phá việc làm
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && filteredApplications.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-card">
          <p className="text-sm text-slate-700">Không có đơn ứng tuyển nào ở trạng thái này.</p>
        </div>
      )}

      {!loading && !error && filteredApplications.length > 0 && (
        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <ApplicationRow key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Hiển thị một đơn ứng tuyển với thông tin việc làm, thời gian và trạng thái. */
function ApplicationRow({ application }: { application: Application }) {
  const job = application.job;
  const title = job?.title || `Việc làm #${application.job_id}`;
  const companyName = job?.company_name || "Doanh nghiệp";
  const monogram = getMonogram(companyName);
  const textColor = getReadableTextColor(job?.company_color_hex || "#0f3d2e");

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-md flex items-center justify-center font-display font-bold text-sm border border-black/5 shrink-0"
            style={{ backgroundColor: job?.company_color_hex || "#0f3d2e", color: textColor }}
            aria-hidden="true"
          >
            {monogram}
          </div>
          <div className="min-w-0 space-y-1">
            <Link to={`/jobs/${application.job_id}`} className="font-display font-semibold text-slate-900 hover:text-brand-700 line-clamp-2">
              {title}
            </Link>
            <p className="text-sm text-slate-600">{companyName}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>Ngày nộp: <span className="text-slate-700 font-medium">{formatDate(application.created_at)}</span></span>
              <span>Cập nhật: <span className="text-slate-700 font-medium">{formatDate(application.updated_at)}</span></span>
            </div>
          </div>
        </div>

        <div className="sm:text-right space-y-2 shrink-0">
          <StatusBadge status={application.status} />
          <Link to={`/jobs/${application.job_id}`} className="inline-flex text-sm font-medium text-brand-700 hover:text-brand-600">
            Xem việc làm
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Hiển thị huy hiệu trạng thái ứng tuyển với biểu tượng và văn bản (không chỉ dựa vào màu sắc). */
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const label = getApplicationStatusLabel(status);
  const base = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold";

  if (status === "moi") {
    return <span className={`${base} bg-slate-50 text-slate-700 border-slate-200`}><FileText className="w-3.5 h-3.5" />{label}</span>;
  }
  if (status === "da-xem") {
    return <span className={`${base} bg-sky-50 text-sky-800 border-sky-200`}><Eye className="w-3.5 h-3.5" />{label}</span>;
  }
  if (status === "hen-phong-van") {
    return <span className={`${base} bg-amber-50 text-amber-800 border-amber-200`}><CalendarClock className="w-3.5 h-3.5" />{label}</span>;
  }
  if (status === "da-nhan") {
    return <span className={`${base} bg-emerald-50 text-emerald-800 border-emerald-200`}><UserCheck className="w-3.5 h-3.5" />{label}</span>;
  }
  return <span className={`${base} bg-rose-50 text-rose-800 border-rose-200`}><XCircle className="w-3.5 h-3.5" />{label}</span>;
}
