// Hàm kiểm tra tính hợp lệ dữ liệu dùng chung Client & Server cho ViệcSV

/**
 * Kiểm tra định dạng Email hợp lệ
 */
export function validateEmail(email: unknown): string | null {
  if (typeof email !== "string" || !email.trim()) {
    return "Vui lòng nhập địa chỉ email";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Địa chỉ email không đúng định dạng";
  }
  return null;
}

/**
 * Kiểm tra mật khẩu (tối thiểu 8 ký tự, gồm ít nhất 1 chữ cái và 1 chữ số)
 */
export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || !password) {
    return "Vui lòng nhập mật khẩu";
  }
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (!hasLetter || !hasDigit) {
    return "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số";
  }
  return null;
}

/**
 * Kiểm tra số điện thoại di động Việt Nam (10 số bắt đầu bằng 0, hoặc tiền tố +84)
 */
export function validatePhone(phone: unknown): string | null {
  if (typeof phone !== "string" || !phone.trim()) {
    return "Vui lòng nhập số điện thoại";
  }
  const cleanPhone = phone.trim().replace(/[\s.-]/g, "");
  // Định dạng chuẩn Việt Nam: 03, 05, 07, 08, 09 (10 số) hoặc +84...
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return "Số điện thoại không hợp lệ (ví dụ: 0901234567 hoặc +84901234567)";
  }
  return null;
}

/**
 * Kiểm tra ngày sinh (định dạng YYYY-MM-DD, không được trong tương lai, đủ 16 tuổi)
 */
export function validateDateOfBirth(dob: unknown): string | null {
  if (typeof dob !== "string" || !dob.trim()) {
    return "Vui lòng nhập ngày sinh";
  }
  const date = new Date(dob.trim());
  if (isNaN(date.getTime())) {
    return "Ngày sinh không đúng định dạng ngày tháng hợp lệ";
  }

  const now = new Date();
  if (date > now) {
    return "Ngày sinh không thể ở trong tương lai";
  }

  // Tính tuổi (yêu cầu tối thiểu 16 tuổi để làm việc thêm theo luật lao động)
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
    age--;
  }

  if (age < 16) {
    return "Bạn phải đủ từ 16 tuổi trở lên để sử dụng dịch vụ";
  }

  return null;
}

/**
 * Kiểm tra tính hợp lệ của số Căn cước công dân (CCCD) 12 chữ số theo quy định Việt Nam:
 * - Đúng 12 chữ số
 * - Ký tự thứ 4 (chỉ số 3) là mã giới tính & thế kỷ:
 *     0 = nam sinh 1900-1999, 1 = nữ sinh 1900-1999
 *     2 = nam sinh 2000-2099, 3 = nữ sinh 2000-2099
 * - Ký tự thứ 5 và 6 (chỉ số 4-5) là 2 số cuối của năm sinh
 */
export function validateCccd(
  cccd: unknown,
  dateOfBirth: string,
  sex: "nam" | "nu" | "khac"
): string | null {
  if (typeof cccd !== "string" || !cccd.trim()) {
    return "Vui lòng nhập số CCCD";
  }
  const cleanCccd = cccd.trim();

  if (!/^[0-9]{12}$/.test(cleanCccd)) {
    return "CCCD phải gồm đúng 12 chữ số";
  }

  const dobDate = new Date(dateOfBirth);
  if (isNaN(dobDate.getTime())) {
    return "Ngày sinh không hợp lệ để đối chiếu CCCD";
  }

  const birthYear = dobDate.getFullYear();
  const yearSuffix = String(birthYear).slice(-2);
  const cccdYearSuffix = cleanCccd.substring(4, 6);

  if (yearSuffix !== cccdYearSuffix) {
    return "CCCD không khớp với ngày sinh hoặc giới tính";
  }

  // Kiểm tra mã giới tính & thế kỷ
  const centurySexDigit = cleanCccd.charAt(3);
  let expectedDigit: string;

  if (birthYear >= 2000 && birthYear <= 2099) {
    expectedDigit = sex === "nu" ? "3" : "2"; // Khác mặc định tính theo 2
  } else if (birthYear >= 1900 && birthYear <= 1999) {
    expectedDigit = sex === "nu" ? "1" : "0";
  } else {
    return "Năm sinh ngoài phạm vi hỗ trợ của CCCD";
  }

  // Nếu người dùng chọn 'khac', cho phép chấp nhận cả 2 mã giới tính của thế kỷ tương ứng
  if (sex === "khac") {
    const validCodes = birthYear >= 2000 ? ["2", "3"] : ["0", "1"];
    if (!validCodes.includes(centurySexDigit)) {
      return "CCCD không khớp với ngày sinh hoặc giới tính";
    }
  } else if (centurySexDigit !== expectedDigit) {
    return "CCCD không khớp với ngày sinh hoặc giới tính";
  }

  return null;
}

/**
 * Kiểm tra Mã số sinh viên (tùy chọn, 6-12 ký tự chữ và số)
 */
export function validateStudentId(studentId?: unknown): string | null {
  if (studentId === undefined || studentId === null || studentId === "") {
    return null; // Tùy chọn
  }
  if (typeof studentId !== "string") {
    return "Mã số sinh viên không hợp lệ";
  }
  const clean = studentId.trim();
  if (clean.length < 6 || clean.length > 12) {
    return "Mã số sinh viên phải có từ 6 đến 12 ký tự";
  }
  if (!/^[a-zA-Z0-9]+$/.test(clean)) {
    return "Mã số sinh viên chỉ được chứa chữ cái và số";
  }
  return null;
}

/**
 * Kiểm tra năm học sinh viên (từ 1 đến 6)
 */
export function validateYearOfStudy(year?: unknown): string | null {
  if (year === undefined || year === null) {
    return "Vui lòng chọn năm học";
  }
  const num = Number(year);
  if (!Number.isInteger(num) || num < 1 || num > 6) {
    return "Năm học phải là số từ 1 đến 6";
  }
  return null;
}
