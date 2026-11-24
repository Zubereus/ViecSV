import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BadgeCheck, Save } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { updateProfile } from "../api/profile";
import { DISTRICTS, UNIVERSITIES, YEAR_OPTIONS } from "../../shared/constants";
import { formatDate, getProfileCompleteness, maskCccd } from "../lib/profile";
import { validatePhone, validateStudentId, validateYearOfStudy } from "../../shared/validators";

interface ProfileFormState {
  fullName: string;
  phone: string;
  university: string;
  studentId: string;
  major: string;
  yearOfStudy: string;
  district: string;
}

/** Trang hồ sơ sinh viên: hiển thị thông tin xác minh, chỉnh sửa các trường cho phép và cập nhật qua API. */
export function ProfilePage() {
  useDocumentTitle("Hồ sơ của tôi");
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<ProfileFormState>({
    fullName: "",
    phone: "",
    university: "",
    studentId: "",
    major: "",
    yearOfStudy: "",
    district: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      university: user.university || "",
      studentId: user.studentId || "",
      major: user.major || "",
      yearOfStudy: user.yearOfStudy ? String(user.yearOfStudy) : "",
      district: user.district || "",
    });
  }, [user]);

  const completeness = useMemo(() => getProfileCompleteness(user), [user]);

  if (!user || user.role !== "student") {
    return null;
  }

  const setField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);

    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ và tên";
    const phoneError = validatePhone(form.phone);
    if (phoneError) nextErrors.phone = phoneError;
    if (!form.university.trim()) nextErrors.university = "Vui lòng chọn trường đại học";
    const studentIdError = validateStudentId(form.studentId || undefined);
    if (studentIdError) nextErrors.studentId = studentIdError;
    const yearError = validateYearOfStudy(form.yearOfStudy ? Number(form.yearOfStudy) : undefined);
    if (yearError) nextErrors.yearOfStudy = yearError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const response = await updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        studentId: form.studentId.trim() || undefined,
        major: form.major.trim() || undefined,
        yearOfStudy: form.yearOfStudy ? Number(form.yearOfStudy) : undefined,
        district: form.district.trim() || undefined,
      });
      updateUser(response.user);
      setStatusMessage({ type: "success", text: "Cập nhật hồ sơ thành công." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật hồ sơ. Vui lòng thử lại.";
      setStatusMessage({ type: "error", text: message });
      if (message.toLowerCase().includes("điện thoại")) setErrors((prev) => ({ ...prev, phone: message }));
      if (message.toLowerCase().includes("mã số")) setErrors((prev) => ({ ...prev, studentId: message }));
      if (message.toLowerCase().includes("năm học")) setErrors((prev) => ({ ...prev, yearOfStudy: message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-slate-900">Hồ sơ của tôi</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <BadgeCheck className="w-3.5 h-3.5" /> Hồ sơ đã xác minh
              </span>
            </div>
            <p className="text-sm text-slate-600">Quản lý thông tin cá nhân và học vấn để ứng tuyển nhanh hơn.</p>
          </div>

          <div className="w-full sm:w-64 border border-slate-200 rounded-md p-3 bg-surface-subtle space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">Mức độ hoàn thiện</span>
              <span className="font-semibold text-brand-700">{completeness.percent}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden" aria-hidden="true">
              <div className="h-full bg-brand-700 rounded-full" style={{ width: `${completeness.percent}%` }} />
            </div>
            {completeness.missingFields.length > 0 ? (
              <p className="text-xs text-slate-600">
                Còn thiếu: {completeness.missingFields.join(", ")}.
              </p>
            ) : (
              <p className="text-xs text-emerald-700">Hồ sơ của bạn đã đầy đủ thông tin cơ bản.</p>
            )}
          </div>
        </div>

        {statusMessage && (
          <div
            className={`rounded-md border px-3.5 py-2.5 text-sm ${
              statusMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
            role={statusMessage.type === "error" ? "alert" : "status"}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ReadOnlyField label="Số CCCD" value={maskCccd(user.cccdLast4)} />
          <ReadOnlyField label="Ngày sinh" value={formatDate(user.dateOfBirth)} />
          <ReadOnlyField label="Giới tính" value={user.sex === "nam" ? "Nam" : user.sex === "nu" ? "Nữ" : user.sex === "khac" ? "Khác" : "—"} />
        </div>
        <p className="text-xs text-slate-500 -mt-2">Ngày sinh, giới tính và số CCCD không thể thay đổi sau khi xác minh hồ sơ.</p>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="profile-fullName" label="Họ và tên" value={form.fullName} onChange={(v) => setField("fullName", v)} error={errors.fullName} />
            <InputField id="profile-phone" label="Số điện thoại" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-university" className="text-sm font-medium text-slate-800">Trường đại học</label>
              <select
                id="profile-university"
                value={form.university}
                onChange={(e) => setField("university", e.target.value)}
                className={inputClass(Boolean(errors.university))}
                aria-invalid={Boolean(errors.university)}
                aria-describedby={errors.university ? "profile-university-error" : undefined}
              >
                <option value="">Chọn trường đại học</option>
                {UNIVERSITIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                {form.university && !UNIVERSITIES.includes(form.university as any) && (
                  <option value={form.university}>{form.university}</option>
                )}
              </select>
              {errors.university && <p id="profile-university-error" className="text-xs text-rose-700">{errors.university}</p>}
            </div>

            <InputField id="profile-studentId" label="Mã số sinh viên" value={form.studentId} onChange={(v) => setField("studentId", v)} error={errors.studentId} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="profile-major" label="Ngành học" value={form.major} onChange={(v) => setField("major", v)} />
            <div className="space-y-1.5">
              <label htmlFor="profile-yearOfStudy" className="text-sm font-medium text-slate-800">Năm học</label>
              <select
                id="profile-yearOfStudy"
                value={form.yearOfStudy}
                onChange={(e) => setField("yearOfStudy", e.target.value)}
                className={inputClass(Boolean(errors.yearOfStudy))}
                aria-invalid={Boolean(errors.yearOfStudy)}
                aria-describedby={errors.yearOfStudy ? "profile-yearOfStudy-error" : undefined}
              >
                <option value="">Chọn năm học</option>
                {YEAR_OPTIONS.map((option) => (
                  <option key={option.value} value={String(option.value)}>{option.label}</option>
                ))}
              </select>
              {errors.yearOfStudy && <p id="profile-yearOfStudy-error" className="text-xs text-rose-700">{errors.yearOfStudy}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-district" className="text-sm font-medium text-slate-800">Khu vực sinh sống</label>
            <select
              id="profile-district"
              value={form.district}
              onChange={(e) => setField("district", e.target.value)}
              className={inputClass(false)}
            >
              <option value="">Chọn khu vực</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-md disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Hiển thị một trường thông tin chỉ đọc. */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Trường nhập liệu văn bản có gắn nhãn và thông báo lỗi. */
function InputField({ id, label, value, onChange, error }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(Boolean(error))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}

/** Trả về lớp CSS cho ô nhập liệu theo trạng thái lỗi. */
function inputClass(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 ${
    hasError ? "border-rose-300" : "border-slate-300 focus:border-brand-700"
  }`;
}
