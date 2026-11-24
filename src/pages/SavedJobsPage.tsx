import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, RotateCcw } from "lucide-react";
import { fetchSaved } from "../api/saved";
import { JobCard } from "../components/JobCard";
import { JobCardSkeleton } from "../components/JobCardSkeleton";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useSavedJobs } from "../lib/SavedJobsContext";
import type { JobListItem } from "../../shared/types";

/** Trang danh sách việc làm đã lưu của sinh viên, có trạng thái tải, lỗi, trống và cập nhật khi bỏ lưu. */
export function SavedJobsPage() {
  useDocumentTitle("Việc đã lưu");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshSavedJobs } = useSavedJobs();

  const loadSaved = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSaved();
      setJobs(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách việc đã lưu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSaved();
  }, []);

  const handleUnsaved = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => String(job.id) !== String(jobId)));
    void refreshSavedJobs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Việc đã lưu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Danh sách các cơ hội việc làm bán thời gian bạn đã đánh dấu để xem lại và ứng tuyển.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-3.5" aria-label="Đang tải việc đã lưu">
          {[...Array(4)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-white border border-rose-200 rounded-lg p-6 text-center space-y-3 shadow-card">
          <p className="text-sm font-semibold text-rose-800">Không tải được danh sách việc đã lưu</p>
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadSaved()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md"
          >
            <RotateCcw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-10 sm:p-12 text-center shadow-card max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display font-semibold text-lg text-slate-900">Bạn chưa lưu việc làm nào</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Khi thấy công việc phù hợp, hãy nhấn lưu để dễ dàng quay lại và ứng tuyển sau.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-md transition-colors shadow-sm"
            >
              Khám phá việc làm
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onUnsaved={handleUnsaved} />
          ))}
        </div>
      )}
    </div>
  );
}
