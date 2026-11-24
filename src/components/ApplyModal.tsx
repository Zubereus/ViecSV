import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { X, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { applyToJob } from "../api/applications";
import { validatePhone } from "../../shared/validators";
import type { Job, PublicUser } from "../../shared/types";

interface ApplyModalProps {
  job: Job;
  user: PublicUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyModal({ job, user, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [university, setUniversity] = useState(user.university || "");
  const [availableTime, setAvailableTime] = useState("");
  const [intro, setIntro] = useState("");

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    university?: string;
    availableTime?: string;
    form?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Cập nhật giá trị khi user thay đổi hoặc mở modal
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setUniversity(user.university || "");
      setAvailableTime("");
      setIntro("");
      setErrors({});
      setIsSuccess(false);

      // Focus vào trường đầu tiên sau khi mở modal
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, user]);

  // Khóa scroll trang, bẫy tiêu điểm (focus trap) và phím Escape
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap khi ấn Tab / Shift+Tab
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      // Trả lại tiêu điểm cho phần tử kích hoạt trước đó
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ và tên của bạn.";
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      nextErrors.phone = phoneErr;
    }

    if (!university.trim()) {
      nextErrors.university = "Vui lòng nhập trường đại học.";
    }

    if (!availableTime.trim()) {
      nextErrors.availableTime = "Vui lòng nhập thời gian bạn có thể làm việc.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await applyToJob(job.id, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        university: university.trim(),
        availableTime: availableTime.trim(),
        intro: intro.trim() || undefined,
      });

      setIsSuccess(true);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại.";
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setSubmitting(false);
    }
  };

  const companyName = job.company?.name || "Doanh nghiệp";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-surface-ground">
          <div>
            <h2 id="apply-modal-title" className="font-display font-bold text-lg text-slate-900">
              {isSuccess ? "Ứng tuyển thành công" : "Nộp hồ sơ ứng tuyển"}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 truncate max-w-md">
              {job.title} &bull; {companyName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Hồ sơ đã được gửi thành công!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Hồ sơ của bạn đã được chuyển tới nhà tuyển dụng <span className="font-semibold text-slate-800">{companyName}</span>. Họ sẽ xem xét và liên hệ với bạn qua số điện thoại <span className="font-medium text-slate-800">{phone}</span>.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/applications"
                  className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 rounded-lg shadow-sm transition-colors"
                  onClick={onClose}
                >
                  Xem đơn ứng tuyển của tôi
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Tiếp tục xem việc khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Thông tin hồ sơ cơ bản */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="apply-fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="apply-fullName"
                    ref={firstInputRef}
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "apply-fullName-error" : undefined}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-slate-300 focus:border-brand-700 focus:ring-brand-100"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && <p id="apply-fullName-error" className="mt-1 text-xs text-rose-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="apply-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="apply-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "apply-phone-error" : undefined}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-slate-300 focus:border-brand-700 focus:ring-brand-100"
                    }`}
                    placeholder="0912345678"
                  />
                  {errors.phone && <p id="apply-phone-error" className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="apply-university" className="block text-xs font-semibold text-slate-700 mb-1">
                  Trường đại học / Cao đẳng <span className="text-rose-600">*</span>
                </label>
                <input
                  id="apply-university"
                  type="text"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value);
                    if (errors.university) setErrors((prev) => ({ ...prev, university: undefined }));
                  }}
                  aria-invalid={Boolean(errors.university)}
                  aria-describedby={errors.university ? "apply-university-error" : undefined}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.university
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-slate-300 focus:border-brand-700 focus:ring-brand-100"
                  }`}
                  placeholder="Đại học Quốc gia TP.HCM..."
                />
                {errors.university && <p id="apply-university-error" className="mt-1 text-xs text-rose-600">{errors.university}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="apply-availableTime" className="block text-xs font-semibold text-slate-700">
                    Thời gian bạn có thể làm việc <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-xs text-slate-600">Ví dụ: Tối 2-4-6 hoặc cuối tuần</span>
                </div>
                <input
                  id="apply-availableTime"
                  type="text"
                  value={availableTime}
                  onChange={(e) => {
                    setAvailableTime(e.target.value);
                    if (errors.availableTime) setErrors((prev) => ({ ...prev, availableTime: undefined }));
                  }}
                  aria-invalid={Boolean(errors.availableTime)}
                  aria-describedby={errors.availableTime ? "apply-availableTime-error" : undefined}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                    errors.availableTime
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-slate-300 focus:border-brand-700 focus:ring-brand-100"
                  }`}
                  placeholder="Tối T2-T4-T6 (18h-22h) và cả ngày Chủ nhật"
                />
                {errors.availableTime && <p id="apply-availableTime-error" className="mt-1 text-xs text-rose-600">{errors.availableTime}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="apply-intro" className="block text-xs font-semibold text-slate-700">
                    Giới thiệu bản thân & kinh nghiệm liên quan
                  </label>
                  <span className="text-xs text-slate-600">{intro.length}/500</span>
                </div>
                <textarea
                  id="apply-intro"
                  rows={3}
                  maxLength={500}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100 placeholder:text-slate-400 resize-none"
                  placeholder="Nêu ngắn gọn tính cách, tinh thần trách nhiệm hoặc kinh nghiệm part-time bạn từng có..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 active:bg-brand-800 rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang gửi hồ sơ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi đơn ứng tuyển</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
