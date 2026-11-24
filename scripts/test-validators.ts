import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateDateOfBirth,
  validateCccd,
  validateStudentId,
  validateYearOfStudy,
} from "../shared/validators.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Kiểm tra thất bại: ${message}`);
    process.exit(1);
  }
}

console.log("Đang kiểm tra tính đúng đắn của các hàm kiểm tra hợp lệ (/shared/validators.ts)...");

// Email
assert(validateEmail("sinhvien@demo.vn") === null, "Email hợp lệ bị báo lỗi");
assert(validateEmail("invalid-email") !== null, "Email sai không bị phát hiện");

// Password
assert(validatePassword("demo1234") === null, "Mật khẩu hợp lệ bị báo lỗi");
assert(validatePassword("short1") !== null, "Mật khẩu ngắn không bị phát hiện");
assert(validatePassword("nopassworddigits") !== null, "Mật khẩu thiếu số không bị phát hiện");

// Phone
assert(validatePhone("0903123456") === null, "SĐT hợp lệ bị báo lỗi");
assert(validatePhone("+84903123456") === null, "SĐT +84 hợp lệ bị báo lỗi");
assert(validatePhone("0123456789") !== null, "Đầu số sai không bị phát hiện");

// DOB (Under 16)
assert(validateDateOfBirth("2004-05-15") === null, "Ngày sinh 2004 hợp lệ bị báo lỗi");
assert(validateDateOfBirth("2020-01-01") !== null, "Dưới 16 tuổi không bị phát hiện");

// CCCD
// Sinh 2004, nữ -> digit 4 = '3', digits 5-6 = '04'
assert(validateCccd("079304104561", "2004-05-15", "nu") === null, "CCCD đúng bị báo lỗi");
// Sai giới tính (2004 nữ mà để 2 là nam)
assert(validateCccd("079204104561", "2004-05-15", "nu") !== null, "CCCD sai giới tính không bị phát hiện");
// Sai năm sinh (2004 mà để 05)
assert(validateCccd("079305104561", "2004-05-15", "nu") !== null, "CCCD sai năm sinh không bị phát hiện");
// Sai độ dài
assert(validateCccd("0793041045", "2004-05-15", "nu") === "CCCD phải gồm đúng 12 chữ số", "CCCD thiếu số không đúng thông báo");

// Student ID
assert(validateStudentId("2210456") === null, "MSSV hợp lệ bị báo lỗi");
assert(validateStudentId(null) === null, "MSSV rỗng tùy chọn bị báo lỗi");
assert(validateStudentId("123") !== null, "MSSV ngắn không bị phát hiện");

// Year of Study
assert(validateYearOfStudy(3) === null, "Năm 3 hợp lệ bị báo lỗi");
assert(validateYearOfStudy(7) !== null, "Năm 7 sai không bị phát hiện");

console.log("✅ Toàn bộ bài kiểm tra shared/validators.ts đều vượt qua thành công!");
