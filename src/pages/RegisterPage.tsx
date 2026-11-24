import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, UserRound, Building2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import {
  DISTRICTS,
  SEX_OPTIONS,
  UNIVERSITIES,
  YEAR_OPTIONS,
} from "../../shared/constants";
import type { RegisterEmployerInput, RegisterStudentInput, Sex } from "../../shared/types";
import {
  validateCccd,
  validateDateOfBirth,
  validateEmail,
  validatePassword,
  validatePhone,
  validateStudentId,
  validateYearOfStudy,
} from "../../shared/validators";

type RegisterMode = "student" | "employer";
type StudentStep = 1 | 2 | 3;

interface LocationState {
  from?: { pathname: string; search?: string; hash?: string };
}

interface StudentFormState {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth: string;
  sex: Sex | "";
  phone: string;
  cccd: string;
  university: string;
  studentId: string;
  major: string;
  yearOfStudy: string;
  district: string;
}

interface EmployerFormState {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  companyName: string;
  industry: string;
}

const initialStudentForm: StudentFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  dateOfBirth: "",
  sex: "",
  phone: "",
  cccd: "",
  university: "",
  studentId: "",
  major: "",
  yearOfStudy: "",
  district: "",
};

const initialEmployerForm: EmployerFormState = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  companyName: "",
  industry: "",
};

const studentSteps = [
  { id: 1, label: "Tài khoản" },
  { id: 2, label: "Thông tin cá nhân" },
  { id: 3, label: "Học vấn" },
] as const;

/** Trang đăng ký tài khoản sinh viên (3 bước) hoặc nhà tuyển dụng (1 bước). */
export function RegisterPage() {
  useDocumentTitle("Đăng ký");
  const navigate = useNavigate();
  const location = useLocation();
  const { registerStudent, registerEmployer } = useAuth();
  const state = (location.state as LocationState | null) || null;
  const fromPath = state?.from ? `${state.from.pathname || "/"}${state.from.search || ""}${state.from.hash || ""}` : null;

  const [mode, setMode] = useState<RegisterMode | null>(null);
  const [studentStep, setStudentStep] = useState<StudentStep>(1);
  const [studentForm, setStudentForm] = useState<StudentFormState>(initialStudentForm);
  const [studentErrors, setStudentErrors] = useState<Record<string, string>>({});
  const [studentUniversityQuery, setStudentUniversityQuery] = useState("");
  const [showUniversityOptions, setShowUniversityOptions] = useState(false);
  const [employerForm, setEmployerForm] = useState<EmployerFormState>(initialEmployerForm);
  const [employerErrors, setEmployerErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const studentStepHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusStudentErrorRef = useRef(false);

  // Move focus after React renders a new registration step or validation error.
  useEffect(() => {
    if (mode !== "student") return;
    if (shouldFocusStudentErrorRef.current) {
      shouldFocusStudentErrorRef.current = false;
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    studentStepHeadingRef.current?.focus();
  }, [mode, studentStep, studentErrors]);

  const filteredUniversities = useMemo(() => {
    const keyword = studentUniversityQuery.trim().toLowerCase();
    if (!keyword) return [...UNIVERSITIES];
    return UNIVERSITIES.filter((item) => item.toLowerCase().includes(keyword));
  }, [studentUniversityQuery]);

  const setStudentField = <K extends keyof StudentFormState>(key: K, value: StudentFormState[K]) => {
    setStudentForm((prev) => ({ ...prev, [key]: value }));
    setStudentErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      if (key === "password" || key === "confirmPassword") delete next.confirmPassword;
      return next;
    });
  };

  const setEmployerField = <K extends keyof EmployerFormState>(key: K, value: EmployerFormState[K]) => {
    setEmployerForm((prev) => ({ ...prev, [key]: value }));
    setEmployerErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStudentStep = (step: StudentStep): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      const emailError = validateEmail(studentForm.email);
      if (emailError) errors.email = emailError;
      const passwordError = validatePassword(studentForm.password);
      if (passwordError) errors.password = passwordError;
      if (!studentForm.confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
      } else if (studentForm.confirmPassword !== studentForm.password) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
      }
    }

    if (step === 2) {
      if (!studentForm.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";
      const dobError = validateDateOfBirth(studentForm.dateOfBirth);
      if (dobError) errors.dateOfBirth = dobError;
      if (!studentForm.sex) errors.sex = "Vui lòng chọn giới tính";
      const phoneError = validatePhone(studentForm.phone);
      if (phoneError) errors.phone = phoneError;
      const cccdError = validateCccd(studentForm.cccd, studentForm.dateOfBirth, (studentForm.sex || "khac") as Sex);
      if (cccdError) errors.cccd = cccdError;
    }

    if (step === 3) {
      if (!studentForm.university.trim()) errors.university = "Vui lòng chọn trường đại học";
      const studentIdError = validateStudentId(studentForm.studentId || undefined);
      if (studentIdError) errors.studentId = studentIdError;
      const yearError = validateYearOfStudy(studentForm.yearOfStudy ? Number(studentForm.yearOfStudy) : undefined);
      if (yearError) errors.yearOfStudy = yearError;
    }

    return errors;
  };

  const goNextStudentStep = () => {
    const errors = validateStudentStep(studentStep);
    shouldFocusStudentErrorRef.current = Object.keys(errors).length > 0;
    setStudentErrors(errors);
    if (Object.keys(errors).length === 0) {
      setStudentStep((prev) => (Math.min(3, prev + 1) as StudentStep));
      setFormMessage(null);
    }
  };

  const goPrevStudentStep = () => {
    setStudentStep((prev) => (Math.max(1, prev - 1) as StudentStep));
    setFormMessage(null);
  };

  const submitStudent = async (event: FormEvent) => {
    event.preventDefault();
    const errors = {
      ...validateStudentStep(1),
      ...validateStudentStep(2),
      ...validateStudentStep(3),
    };
    shouldFocusStudentErrorRef.current = Object.keys(errors).length > 0;
    setStudentErrors(errors);
    if (Object.keys(errors).length > 0) {
      if (errors.email || errors.password || errors.confirmPassword) setStudentStep(1);
      else if (errors.fullName || errors.dateOfBirth || errors.sex || errors.phone || errors.cccd) setStudentStep(2);
      else setStudentStep(3);
      return;
    }

    const payload: RegisterStudentInput = {
      email: studentForm.email.trim(),
      password: studentForm.password,
      fullName: studentForm.fullName.trim(),
      dateOfBirth: studentForm.dateOfBirth,
      sex: studentForm.sex as Sex,
      phone: studentForm.phone.trim(),
      university: studentForm.university.trim(),
      studentId: studentForm.studentId.trim() || undefined,
      major: studentForm.major.trim() || undefined,
      yearOfStudy: Number(studentForm.yearOfStudy),
      district: studentForm.district.trim() || undefined,
      cccd: studentForm.cccd.trim(),
    };

    setSubmitting(true);
    setFormMessage(null);
    try {
      await registerStudent(payload);
      setStudentForm((prev) => ({ ...prev, cccd: "" }));
      navigate(fromPath || "/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký không thành công. Vui lòng thử lại.";
      setFormMessage(message);
      // Đưa người dùng về bước có khả năng chứa lỗi phổ biến từ máy chủ.
      if (message.toLowerCase().includes("email")) {
        setStudentStep(1);
        setStudentErrors((prev) => ({ ...prev, email: message }));
      } else if (message.toLowerCase().includes("cccd")) {
        setStudentStep(2);
        setStudentErrors((prev) => ({ ...prev, cccd: message }));
      } else if (message.toLowerCase().includes("điện thoại")) {
        setStudentStep(2);
        setStudentErrors((prev) => ({ ...prev, phone: message }));
      }
      setStudentForm((prev) => ({ ...prev, cccd: "" }));
    } finally {
      setSubmitting(false);
    }
  };

  const submitEmployer = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    const emailError = validateEmail(employerForm.email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(employerForm.password);
    if (passwordError) errors.password = passwordError;
    if (!employerForm.fullName.trim()) errors.fullName = "Vui lòng nhập họ tên người liên hệ";
    const phoneError = validatePhone(employerForm.phone);
    if (phoneError) errors.phone = phoneError;
    if (!employerForm.companyName.trim()) errors.companyName = "Vui lòng nhập tên công ty";
    if (!employerForm.industry.trim()) errors.industry = "Vui lòng nhập lĩnh vực hoạt động";

    setEmployerErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: RegisterEmployerInput = {
      email: employerForm.email.trim(),
      password: employerForm.password,
      fullName: employerForm.fullName.trim(),
      phone: employerForm.phone.trim(),
      companyName: employerForm.companyName.trim(),
      industry: employerForm.industry.trim(),
    };

    setSubmitting(true);
    setFormMessage(null);
    try {
      await registerEmployer(payload);
      navigate("/employer", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký không thành công. Vui lòng thử lại.";
      setFormMessage(message);
      if (message.toLowerCase().includes("email")) {
        setEmployerErrors((prev) => ({ ...prev, email: message }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-slate-900">Tạo tài khoản ViệcSV</h1>
          <p className="text-sm text-slate-600">Chọn vai trò phù hợp để bắt đầu sử dụng nền tảng.</p>
        </div>

        {formMessage && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700" role="alert">
            {formMessage}
          </div>
        )}

        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("student")}
              className="text-left border border-slate-200 rounded-lg p-4 hover:border-brand-500 hover:bg-brand-50/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                  <UserRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Tôi là sinh viên</p>
                  <p className="text-sm text-slate-600 mt-1">Tìm việc làm thêm, lưu tin và theo dõi hồ sơ ứng tuyển.</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("employer")}
              className="text-left border border-slate-200 rounded-lg p-4 hover:border-brand-500 hover:bg-brand-50/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Tôi là nhà tuyển dụng</p>
                  <p className="text-sm text-slate-600 mt-1">Tạo tài khoản doanh nghiệp để đăng tin và quản lý hồ sơ ứng tuyển.</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {mode === "student" && (
          <form className="space-y-6" onSubmit={submitStudent} noValidate>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => setMode(null)} className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Chọn lại vai trò
              </button>
              <span className="text-xs font-medium text-slate-500">Đăng ký sinh viên</span>
            </div>

            <ol className="grid grid-cols-3 gap-2">
              {studentSteps.map((step) => {
                const active = studentStep === step.id;
                const done = studentStep > step.id;
                return (
                  <li key={step.id} className={`rounded-md border px-3 py-2 text-xs sm:text-sm ${active ? "border-brand-600 bg-brand-50 text-brand-800" : done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600"}`}>
                    <span className="font-semibold">Bước {step.id}:</span> {step.label}
                  </li>
                );
              })}
            </ol>

            {studentStep === 1 && (
              <div className="space-y-4">
                <h2 ref={studentStepHeadingRef} tabIndex={-1} className="font-display text-lg font-semibold text-slate-900">Bước 1: Tài khoản</h2>
                <Field label="Email" htmlFor="student-email" error={studentErrors.email}>
                  <input id="student-email" type="email" autoComplete="email" value={studentForm.email} onChange={(e) => setStudentField("email", e.target.value)} className={inputClass(Boolean(studentErrors.email))} aria-invalid={Boolean(studentErrors.email)} aria-describedby={studentErrors.email ? "student-email-error" : undefined} />
                </Field>
                <Field label="Mật khẩu" htmlFor="student-password" error={studentErrors.password}>
                  <input id="student-password" type="password" autoComplete="new-password" value={studentForm.password} onChange={(e) => setStudentField("password", e.target.value)} className={inputClass(Boolean(studentErrors.password))} aria-invalid={Boolean(studentErrors.password)} aria-describedby={studentErrors.password ? "student-password-error" : undefined} />
                </Field>
                <Field label="Nhập lại mật khẩu" htmlFor="student-confirm-password" error={studentErrors.confirmPassword}>
                  <input id="student-confirm-password" type="password" autoComplete="new-password" value={studentForm.confirmPassword} onChange={(e) => setStudentField("confirmPassword", e.target.value)} className={inputClass(Boolean(studentErrors.confirmPassword))} aria-invalid={Boolean(studentErrors.confirmPassword)} aria-describedby={studentErrors.confirmPassword ? "student-confirm-password-error" : undefined} />
                </Field>
              </div>
            )}

            {studentStep === 2 && (
              <div className="space-y-4">
                <h2 ref={studentStepHeadingRef} tabIndex={-1} className="font-display text-lg font-semibold text-slate-900">Bước 2: Thông tin cá nhân</h2>
                <Field label="Họ và tên" htmlFor="student-fullName" error={studentErrors.fullName}>
                  <input id="student-fullName" type="text" value={studentForm.fullName} onChange={(e) => setStudentField("fullName", e.target.value)} className={inputClass(Boolean(studentErrors.fullName))} aria-invalid={Boolean(studentErrors.fullName)} aria-describedby={studentErrors.fullName ? "student-fullName-error" : undefined} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Ngày sinh" htmlFor="student-dob" error={studentErrors.dateOfBirth}>
                    <input id="student-dob" type="date" value={studentForm.dateOfBirth} onChange={(e) => setStudentField("dateOfBirth", e.target.value)} className={inputClass(Boolean(studentErrors.dateOfBirth))} aria-invalid={Boolean(studentErrors.dateOfBirth)} aria-describedby={studentErrors.dateOfBirth ? "student-dob-error" : undefined} />
                  </Field>
                  <Field label="Giới tính" htmlFor="student-sex" error={studentErrors.sex}>
                    <select id="student-sex" value={studentForm.sex} onChange={(e) => setStudentField("sex", e.target.value as Sex | "")} className={inputClass(Boolean(studentErrors.sex))} aria-invalid={Boolean(studentErrors.sex)} aria-describedby={studentErrors.sex ? "student-sex-error" : undefined}>
                      <option value="">Chọn giới tính</option>
                      {SEX_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Số điện thoại" htmlFor="student-phone" error={studentErrors.phone}>
                  <input id="student-phone" type="tel" inputMode="tel" value={studentForm.phone} onChange={(e) => setStudentField("phone", e.target.value)} className={inputClass(Boolean(studentErrors.phone))} aria-invalid={Boolean(studentErrors.phone)} aria-describedby={studentErrors.phone ? "student-phone-error" : undefined} />
                </Field>
                <Field label="Số CCCD" htmlFor="student-cccd" error={studentErrors.cccd} hint="Chỉ dùng để xác minh hồ sơ; máy chủ chỉ lưu mã băm và 4 số cuối.">
                  <input
                    id="student-cccd"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={studentForm.cccd}
                    onChange={(e) => setStudentField("cccd", e.target.value.replace(/\D/g, ""))}
                    className={inputClass(Boolean(studentErrors.cccd))}
                    aria-invalid={Boolean(studentErrors.cccd)}
                    aria-describedby={studentErrors.cccd ? "student-cccd-error" : "student-cccd-hint"}
                  />
                </Field>
              </div>
            )}

            {studentStep === 3 && (
              <div className="space-y-4">
                <h2 ref={studentStepHeadingRef} tabIndex={-1} className="font-display text-lg font-semibold text-slate-900">Bước 3: Học vấn</h2>
                <Field label="Trường đại học" htmlFor="student-university" error={studentErrors.university}>
                  <div className="relative">
                    <input
                      id="student-university"
                      type="text"
                      value={studentUniversityQuery || studentForm.university}
                      onChange={(e) => {
                        setStudentUniversityQuery(e.target.value);
                        setStudentField("university", e.target.value);
                        setShowUniversityOptions(true);
                      }}
                      onFocus={() => setShowUniversityOptions(true)}
                      onBlur={() => {
                        window.setTimeout(() => setShowUniversityOptions(false), 120);
                      }}
                      className={inputClass(Boolean(studentErrors.university))}
                      placeholder="Nhập để tìm trường..."
                      aria-invalid={Boolean(studentErrors.university)}
                      aria-describedby={studentErrors.university ? "student-university-error" : undefined}
                      autoComplete="off"
                    />
                    {showUniversityOptions && filteredUniversities.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-dropdown">
                        {filteredUniversities.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setStudentField("university", item);
                                setStudentUniversityQuery(item);
                                setShowUniversityOptions(false);
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mã số sinh viên (không bắt buộc)" htmlFor="student-studentId" error={studentErrors.studentId}>
                    <input id="student-studentId" type="text" value={studentForm.studentId} onChange={(e) => setStudentField("studentId", e.target.value)} className={inputClass(Boolean(studentErrors.studentId))} aria-invalid={Boolean(studentErrors.studentId)} aria-describedby={studentErrors.studentId ? "student-studentId-error" : undefined} />
                  </Field>
                  <Field label="Năm học" htmlFor="student-yearOfStudy" error={studentErrors.yearOfStudy}>
                    <select id="student-yearOfStudy" value={studentForm.yearOfStudy} onChange={(e) => setStudentField("yearOfStudy", e.target.value)} className={inputClass(Boolean(studentErrors.yearOfStudy))} aria-invalid={Boolean(studentErrors.yearOfStudy)} aria-describedby={studentErrors.yearOfStudy ? "student-yearOfStudy-error" : undefined}>
                      <option value="">Chọn năm học</option>
                      {YEAR_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Ngành học (không bắt buộc)" htmlFor="student-major">
                    <input id="student-major" type="text" value={studentForm.major} onChange={(e) => setStudentField("major", e.target.value)} className={inputClass(false)} />
                  </Field>
                  <Field label="Khu vực sinh sống (không bắt buộc)" htmlFor="student-district">
                    <select id="student-district" value={studentForm.district} onChange={(e) => setStudentField("district", e.target.value)} className={inputClass(false)}>
                      <option value="">Chọn khu vực</option>
                      {DISTRICTS.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="rounded-md border border-slate-200 bg-surface-subtle p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-700" />Xác nhận thông tin trước khi gửi</p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li><span className="text-slate-500">Email:</span> {studentForm.email || "—"}</li>
                    <li><span className="text-slate-500">Họ tên:</span> {studentForm.fullName || "—"}</li>
                    <li><span className="text-slate-500">Số điện thoại:</span> {studentForm.phone || "—"}</li>
                    <li><span className="text-slate-500">Trường:</span> {studentForm.university || "—"}</li>
                    <li><span className="text-slate-500">CCCD:</span> {studentForm.cccd ? `Đã nhập (${studentForm.cccd.length}/12 số)` : "—"}</li>
                  </ul>
                  <p className="text-xs text-slate-500">Số CCCD chỉ dùng để xác minh và sẽ được xử lý an toàn khi gửi đăng ký.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={goPrevStudentStep}
                disabled={studentStep === 1 || submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>

              {studentStep < 3 ? (
                <button
                  type="button"
                  onClick={goNextStudentStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-md"
                >
                  Tiếp tục <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-md disabled:opacity-60"
                >
                  {submitting ? "Đang tạo tài khoản..." : "Hoàn tất đăng ký"}
                </button>
              )}
            </div>
          </form>
        )}

        {mode === "employer" && (
          <form className="space-y-4" onSubmit={submitEmployer} noValidate>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => setMode(null)} className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Chọn lại vai trò
              </button>
              <span className="text-xs font-medium text-slate-500">Đăng ký nhà tuyển dụng</span>
            </div>

            <Field label="Email" htmlFor="employer-email" error={employerErrors.email}>
              <input id="employer-email" type="email" value={employerForm.email} onChange={(e) => setEmployerField("email", e.target.value)} className={inputClass(Boolean(employerErrors.email))} aria-invalid={Boolean(employerErrors.email)} aria-describedby={employerErrors.email ? "employer-email-error" : undefined} />
            </Field>
            <Field label="Mật khẩu" htmlFor="employer-password" error={employerErrors.password}>
              <input id="employer-password" type="password" autoComplete="new-password" value={employerForm.password} onChange={(e) => setEmployerField("password", e.target.value)} className={inputClass(Boolean(employerErrors.password))} aria-invalid={Boolean(employerErrors.password)} aria-describedby={employerErrors.password ? "employer-password-error" : undefined} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Họ tên người liên hệ" htmlFor="employer-fullName" error={employerErrors.fullName}>
                <input id="employer-fullName" type="text" value={employerForm.fullName} onChange={(e) => setEmployerField("fullName", e.target.value)} className={inputClass(Boolean(employerErrors.fullName))} aria-invalid={Boolean(employerErrors.fullName)} aria-describedby={employerErrors.fullName ? "employer-fullName-error" : undefined} />
              </Field>
              <Field label="Số điện thoại" htmlFor="employer-phone" error={employerErrors.phone}>
                <input id="employer-phone" type="tel" value={employerForm.phone} onChange={(e) => setEmployerField("phone", e.target.value)} className={inputClass(Boolean(employerErrors.phone))} aria-invalid={Boolean(employerErrors.phone)} aria-describedby={employerErrors.phone ? "employer-phone-error" : undefined} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tên công ty" htmlFor="employer-companyName" error={employerErrors.companyName}>
                <input id="employer-companyName" type="text" value={employerForm.companyName} onChange={(e) => setEmployerField("companyName", e.target.value)} className={inputClass(Boolean(employerErrors.companyName))} aria-invalid={Boolean(employerErrors.companyName)} aria-describedby={employerErrors.companyName ? "employer-companyName-error" : undefined} />
              </Field>
              <Field label="Lĩnh vực" htmlFor="employer-industry" error={employerErrors.industry}>
                <input id="employer-industry" type="text" value={employerForm.industry} onChange={(e) => setEmployerField("industry", e.target.value)} className={inputClass(Boolean(employerErrors.industry))} aria-invalid={Boolean(employerErrors.industry)} aria-describedby={employerErrors.industry ? "employer-industry-error" : undefined} />
              </Field>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-600 rounded-md disabled:opacity-60"
              >
                {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản nhà tuyển dụng"}
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-slate-600 text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-600 underline-offset-2 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Trả về lớp CSS cho ô nhập liệu theo trạng thái lỗi. */
function inputClass(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 ${
    hasError ? "border-rose-300" : "border-slate-300 focus:border-brand-700"
  }`;
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

/** Nhóm nhãn, ô nhập, trợ giúp và thông báo lỗi cho từng trường biểu mẫu. */
function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">{label}</label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-rose-700">{error}</p>
      )}
    </div>
  );
}
