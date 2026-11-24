import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Share2,
} from "lucide-react";
import { fetchJobById, fetchSimilarJobs } from "../api/jobs";
import { fetchMyApplications } from "../api/applications";
import { JobCard } from "../components/JobCard";
import { ApplyModal } from "../components/ApplyModal";
import { useAuth } from "../lib/AuthContext";
import { useSavedJobs } from "../lib/SavedJobsContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import {
  formatWage,
  formatPostedAt,
  formatDays,
  formatShifts,
  getMonogram,
  getReadableTextColor,
} from "../lib/format";
import { formatDate } from "../lib/profile";
import { WORK_TYPE_MAP } from "../../shared/constants";
import type { Application, Job, JobListItem } from "../../shared/types";

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();

  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [myApplication, setMyApplication] = useState<Application | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [isTogglingSave, setIsTogglingSave] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Cập nhật title trình duyệt
  const pageTitle = job
    ? `${job.title} – ${job.company?.name || "Doanh nghiệp"}`
    : "Chi tiết việc làm";
  useDocumentTitle(pageTitle);

  // Tải dữ liệu công việc, việc tương tự và trạng thái ứng tuyển của sinh viên
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [jobRes, simRes] = await Promise.all([
          fetchJobById(id),
          fetchSimilarJobs(id).catch(() => ({ ok: true, items: [] as JobListItem[] })),
        ]);

        if (cancelled) return;

        if (!jobRes || !jobRes.job) {
          setError("Không tìm thấy thông tin công việc hoặc công việc đã bị xóa.");
          return;
        }

        setJob(jobRes.job);
        setSimilarJobs(simRes.items || []);

        // Kiểm tra xem sinh viên hiện tại đã nộp đơn cho việc này chưa
        if (user && user.role === "student") {
          try {
            const appsRes = await fetchMyApplications();
            if (!cancelled) {
              const matched = appsRes.items.find((item) => String(item.job_id) === String(id));
              setMyApplication(matched || null);
            }
          } catch {
            // Không chặn trang nếu tải ứng tuyển lỗi
          }
        } else {
          setMyApplication(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không thể tải chi tiết việc làm.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const saved = id && user?.role === "student" ? isSaved(id) : false;

  const handleToggleBookmark = async () => {
    if (!id) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (user.role === "employer") return;

    setIsTogglingSave(true);
    try {
      await toggleSave(id);
    } catch (err) {
      setBookmarkError(err instanceof Error ? err.message : "Không thể lưu việc làm.");
      setTimeout(() => setBookmarkError(null), 3000);
    } finally {
      setIsTogglingSave(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (user.role === "employer") {
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageTitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Trạng thái đang tải
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="h-12 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded" />
          </div>
          <div className="h-32 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  // Trạng thái lỗi hoặc không tìm thấy việc
  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900">
          Không tìm thấy tin tuyển dụng
        </h1>
        <p className="text-slate-600 text-sm">
          {error || "Công việc này có thể đã hết hạn tuyển dụng hoặc bị gỡ bỏ."}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Thử lại
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Về trang tìm việc
          </Link>
        </div>
      </div>
    );
  }

  const companyName = job.company?.name || "Doanh nghiệp";
  const monogram = getMonogram(companyName);
  const companyColor = job.company?.color_hex || "#0f3d2e";
  const textColor = getReadableTextColor(companyColor);
  const isClosed = job.status === "closed";

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* Nút quay lại & Chia sẻ */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const fromSearch = (location.state as { fromSearch?: string } | null)?.fromSearch;
            if (fromSearch) {
              navigate(`/${fromSearch}`);
            } else if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại tìm việc</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? "Đã chép link!" : "Chia sẻ"}</span>
        </button>
      </div>

      {/* Thông báo lỗi bookmark nếu có */}
      {bookmarkError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
          {bookmarkError}
        </div>
      )}

      {/* Grid bố cục chính: Cột nội dung (trái) và Cột ứng tuyển nhanh (phải trên desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* CỘT CHÍNH (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Tiêu đề & Thông tin cơ bản */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-card space-y-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-display font-bold text-lg sm:text-xl shrink-0 border border-black/5 shadow-sm"
                style={{ backgroundColor: companyColor, color: textColor }}
                aria-hidden="true"
              >
                {monogram}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {job.is_urgent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-600" /> Tuyển gấp
                    </span>
                  )}
                  {isClosed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Đã đóng tuyển dụng
                    </span>
                  )}
                  <span className="text-xs text-slate-600">
                    Đăng {formatPostedAt(job.posted_at)}
                  </span>
                </div>

                <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                  {job.title}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-slate-700">
                  {companyName}
                </p>

                <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600 pt-0.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{job.address}, {job.district}, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>

            {/* Khối tóm tắt thông số quan trọng (Key Info Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-surface-ground rounded-lg border border-slate-200/70">
              <div>
                <span className="block text-xs text-slate-600 font-medium">Mức lương</span>
                <span className="font-display font-bold text-base sm:text-lg text-brand-700">
                  {formatWage(job.wage_per_hour)}
                </span>
                {job.wage_note && (
                  <span className="block text-xs text-slate-600 font-normal mt-0.5">{job.wage_note}</span>
                )}
              </div>

              <div>
                <span className="block text-xs text-slate-600 font-medium">Hình thức</span>
                <span className="text-sm font-semibold text-slate-800">
                  {WORK_TYPE_MAP[job.work_type] || job.work_type}
                </span>
              </div>

              <div>
                <span className="block text-xs text-slate-600 font-medium">Kinh nghiệm</span>
                <span className="text-sm font-semibold text-slate-800">
                  {job.experience_required ? "Cần kinh nghiệm" : "Không yêu cầu"}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" /> Ngày làm việc:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium">
                    {formatDays(job.days)}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-slate-600 font-medium mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-600" /> Ca làm việc:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium">
                    {formatShifts(job.shifts)} ({job.hours_per_week}h/tuần)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Các phần nội dung chi tiết */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-card space-y-6">
            {/* Mô tả công việc */}
            <section className="space-y-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-700" />
                Mô tả công việc
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </section>

            {/* Trách nhiệm */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
                  Trách nhiệm công việc
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Yêu cầu ứng viên */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-700" />
                  Yêu cầu ứng viên
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Quyền lợi */}
            {job.benefits && job.benefits.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Quyền lợi được hưởng
                </h2>
                <ul className="space-y-2">
                  {job.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Giới thiệu công ty */}
            {job.company && (
              <section className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-700" />
                  Giới thiệu {job.company.name}
                </h2>
                <p className="text-xs font-medium text-slate-600">
                  Lĩnh vực hoạt động: <span className="text-slate-700">{job.company.industry}</span>
                </p>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {job.company.description || "Doanh nghiệp uy tín đồng hành cùng sinh viên tìm kiếm cơ hội việc làm linh hoạt."}
                </p>
              </section>
            )}
          </div>

          {/* Việc làm tương tự */}
          {similarJobs.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Việc làm tương tự cùng ngành
                </h2>
                <Link to="/" className="text-xs font-semibold text-brand-700 hover:text-brand-600">
                  Xem tất cả việc làm &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {similarJobs.map((simJob) => (
                  <JobCard key={simJob.id} job={simJob} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: DESKTOP STICKY ACTION CARD (1/3) */}
        <div className="hidden lg:block lg:sticky lg:top-20 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-card space-y-5">
            <div>
              <span className="text-xs font-medium text-slate-600 block">Mức lương dự kiến</span>
              <div className="font-display font-bold text-2xl text-brand-700 mt-0.5">
                {formatWage(job.wage_per_hour)}
              </div>
              {job.wage_note && (
                <div className="text-xs text-slate-600 mt-1">{job.wage_note}</div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              {/* Nút Ứng tuyển */}
              {myApplication ? (
                <div className="w-full p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ĐÃ NỘP HỒ SƠ ỨNG TUYỂN
                  </div>
                  <p className="text-xs text-emerald-700">
                    Ngày nộp: {formatDate(myApplication.created_at)}
                  </p>
                  <Link
                    to="/applications"
                    className="inline-block mt-1 text-xs font-semibold text-emerald-900 underline hover:no-underline"
                  >
                    Xem trong mục Đơn ứng tuyển &rarr;
                  </Link>
                </div>
              ) : isClosed ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-lg bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed text-center"
                >
                  Tin tuyển dụng đã đóng
                </button>
              ) : user?.role === "employer" ? (
                <div className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
                  Tài khoản nhà tuyển dụng không thể nộp đơn ứng tuyển.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full py-3 px-4 rounded-lg bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Ứng tuyển ngay</span>
                </button>
              )}

              {/* Nút Lưu việc làm */}
              {user?.role !== "employer" && (
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  disabled={isTogglingSave}
                  aria-pressed={saved}
                  aria-label={saved ? "Bỏ lưu việc làm" : "Lưu bài đăng này"}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${
                    saved
                      ? "bg-brand-50 border-brand-300 text-brand-800 hover:bg-brand-100"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-brand-700" />
                      <span>Đã lưu việc làm này</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Lưu bài đăng này</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Thông tin hỗ trợ sinh viên */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hồ sơ được gửi trực tiếp đến nhà tuyển dụng.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bảo mật thông tin: Không bao giờ lộ số CCCD.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {user?.role !== "employer" && (
            <button
              type="button"
              onClick={handleToggleBookmark}
              disabled={isTogglingSave}
              className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                saved
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label={saved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
            >
              {saved ? <BookmarkCheck className="w-5 h-5 text-brand-700" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}

          <div className="flex-1 min-w-0">
            <span className="block text-xs text-slate-600 truncate">{job.title}</span>
            <span className="font-display font-bold text-sm text-brand-700">
              {formatWage(job.wage_per_hour)}
            </span>
          </div>

          <div className="shrink-0">
            {myApplication ? (
              <Link
                to="/applications"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã nộp hồ sơ
              </Link>
            ) : isClosed ? (
              <span className="inline-block px-3 py-2 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold">
                Đã đóng
              </span>
            ) : user?.role === "employer" ? (
              <span className="text-xs text-slate-600">Nhà tuyển dụng</span>
            ) : (
              <button
                type="button"
                onClick={handleApplyClick}
                className="px-4 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Ứng tuyển ngay
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal ứng tuyển */}
      {user && user.role === "student" && (
        <ApplyModal
          job={job}
          user={user}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            // Đánh dấu đã nộp đơn
            setMyApplication({
              id: "new",
              job_id: job.id,
              user_id: user.id,
              full_name: user.fullName || "",
              phone: user.phone || "",
              university: user.university || "",
              intro: "",
              available_time: "",
              status: "moi",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }}
        />
      )}

      {/* Dialog nhắc đăng nhập khi khách click bookmark */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-100">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900">
                Đăng nhập để lưu việc làm
              </h3>
              <p className="text-xs text-slate-600">
                Lưu lại các việc làm bán thời gian phù hợp để theo dõi và ứng tuyển bất cứ lúc nào.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => navigate("/login", { state: { from: location } })}
                className="px-4 py-2 text-xs font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-lg shadow-sm"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
