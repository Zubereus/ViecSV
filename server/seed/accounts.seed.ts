import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Sex, UserRole } from "../../shared/types.js";

export interface SeedUserRaw {
  email: string;
  plainPassword: string;
  role: UserRole;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  sex?: Sex;
  university?: string;
  studentId?: string;
  major?: string;
  yearOfStudy?: number;
  district?: string;
  // Các thông số để tạo CCCD giả lập hợp lệ
  provinceCode?: string;
  birthYear?: number;
  cccdSeq?: number;
}

export interface PreparedUser {
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  phone: string;
  dateOfBirth: string | null;
  sex: Sex | null;
  university: string | null;
  studentId: string | null;
  major: string | null;
  yearOfStudy: number | null;
  district: string | null;
  cccdHash: string | null;
  cccdLast4: string | null;
}

/**
 * Xây dựng số CCCD giả lập đúng cấu trúc 12 chữ số theo quy định Việt Nam:
 * - 3 số đầu: Mã tỉnh/thành phố (079: TP.HCM, 001: Hà Nội,...)
 * - 1 chữ số: Thế kỷ và giới tính (2: nam sinh 2000-2099, 3: nữ sinh 2000-2099)
 * - 2 chữ số: 2 số cuối năm sinh
 * - 6 chữ số: Dãy số ngẫu nhiên / thứ tự duy nhất
 */
export function buildFakeCccd(
  provinceCode: string,
  sex: Sex,
  birthYear: number,
  seq: number
): string {
  let centurySexDigit = 2; // mặc định: nam sinh sau năm 2000
  if (birthYear >= 2000) {
    centurySexDigit = sex === "nu" ? 3 : 2;
  } else {
    centurySexDigit = sex === "nu" ? 1 : 0;
  }

  const yearSuffix = String(birthYear).slice(-2);
  const randomSuffix = String(seq).padStart(6, "0");

  return `${provinceCode}${centurySexDigit}${yearSuffix}${randomSuffix}`;
}

/**
 * Băm CCCD bằng SHA-256 và trích xuất 4 số cuối.
 * Tuyệt đối không lưu số CCCD gốc.
 */
export function processCccd(rawCccd: string): { hash: string; last4: string } {
  const hash = crypto.createHash("sha256").update(rawCccd).digest("hex");
  const last4 = rawCccd.slice(-4);
  return { hash, last4 };
}

// Danh sách các tài khoản hạt giống (Seed Accounts)
export const RAW_SEED_USERS: SeedUserRaw[] = [
  // 1. Sinh viên Demo chính
  {
    email: "sinhvien@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Nguyễn Minh Anh",
    phone: "0903123456",
    dateOfBirth: "2004-05-15",
    sex: "nu",
    university: "ĐH Bách Khoa (ĐHQG-HCM)",
    studentId: "2210456",
    major: "Khoa học Máy tính",
    yearOfStudy: 3,
    district: "Quận 10",
    provinceCode: "079",
    birthYear: 2004,
    cccdSeq: 104561,
  },
  // 2. Nhà tuyển dụng Demo chính (sở hữu 3 công ty và 15 việc làm)
  {
    email: "tuyendung@demo.vn",
    plainPassword: "demo1234",
    role: "employer",
    fullName: "Trần Hoàng Nam",
    phone: "0988776655",
    district: "Quận 1",
  },
  // 3. Nhà tuyển dụng đối tác 1
  {
    email: "doi.tac@demo.vn",
    plainPassword: "demo1234",
    role: "employer",
    fullName: "Hoàng Đình Vũ",
    phone: "0977112233",
    district: "Quận 3",
  },
  // 4. Nhà tuyển dụng đối tác 2
  {
    email: "nhansu@demo.vn",
    plainPassword: "demo1234",
    role: "employer",
    fullName: "Lê Thúy An",
    phone: "0966445566",
    district: "Bình Thạnh",
  },
  // 12 sinh viên hư cấu nộp hồ sơ vào các vị trí tuyển dụng
  {
    email: "bao.le@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Lê Quốc Bảo",
    phone: "0912345001",
    dateOfBirth: "2003-08-20",
    sex: "nam",
    university: "ĐH Kinh tế TP.HCM (UEH)",
    studentId: "UEH21089",
    major: "Quản trị Kinh doanh",
    yearOfStudy: 4,
    district: "Quận 3",
    provinceCode: "079",
    birthYear: 2003,
    cccdSeq: 110892,
  },
  {
    email: "phuong.tran@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Trần Thị Mai Phương",
    phone: "0912345002",
    dateOfBirth: "2005-02-14",
    sex: "nu",
    university: "ĐH Khoa học Tự nhiên (ĐHQG-HCM)",
    studentId: "KHTN23012",
    major: "Công nghệ Sinh học",
    yearOfStudy: 2,
    district: "Quận 5",
    provinceCode: "074", // Bình Dương
    birthYear: 2005,
    cccdSeq: 120123,
  },
  {
    email: "huy.pham@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Phạm Đức Huy",
    phone: "0912345003",
    dateOfBirth: "2004-11-09",
    sex: "nam",
    university: "ĐH Công nghệ Thông tin (ĐHQG-HCM)",
    studentId: "UIT22045",
    major: "Kỹ thuật Phần mềm",
    yearOfStudy: 3,
    district: "TP. Thủ Đức",
    provinceCode: "079",
    birthYear: 2004,
    cccdSeq: 130454,
  },
  {
    email: "linh.hoang@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Hoàng Ngọc Linh",
    phone: "0912345004",
    dateOfBirth: "2006-03-25",
    sex: "nu",
    university: "ĐH Quốc tế (ĐHQG-HCM)",
    studentId: "IU24078",
    major: "Logistics & Chuỗi cung ứng",
    yearOfStudy: 1,
    district: "Bình Thạnh",
    provinceCode: "001", // Hà Nội
    birthYear: 2006,
    cccdSeq: 140785,
  },
  {
    email: "khiem.do@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Đỗ Gia Khiêm",
    phone: "0912345005",
    dateOfBirth: "2003-07-18",
    sex: "nam",
    university: "ĐH Sư phạm Kỹ thuật TP.HCM",
    studentId: "SPKT21034",
    major: "Kỹ thuật Cơ điện tử",
    yearOfStudy: 4,
    district: "TP. Thủ Đức",
    provinceCode: "072", // Tây Ninh
    birthYear: 2003,
    cccdSeq: 150346,
  },
  {
    email: "duong.vu@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Vũ Thùy Dương",
    phone: "0912345006",
    dateOfBirth: "2004-12-01",
    sex: "nu",
    university: "ĐH Sư phạm TP.HCM",
    studentId: "SP22091",
    major: "Sư phạm Tiếng Anh",
    yearOfStudy: 3,
    district: "Quận 1",
    provinceCode: "079",
    birthYear: 2004,
    cccdSeq: 160917,
  },
  {
    email: "phat.nguyen@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Nguyễn Tấn Phát",
    phone: "0912345007",
    dateOfBirth: "2005-09-10",
    sex: "nam",
    university: "ĐH Tôn Đức Thắng",
    studentId: "TDT23055",
    major: "Thiết kế Đồ họa",
    yearOfStudy: 2,
    district: "Quận 7",
    provinceCode: "080", // Long An
    birthYear: 2005,
    cccdSeq: 170558,
  },
  {
    email: "huyen.bui@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Bùi Khánh Huyền",
    phone: "0912345008",
    dateOfBirth: "2003-04-05",
    sex: "nu",
    university: "ĐH Ngân hàng TP.HCM",
    studentId: "NH21062",
    major: "Tài chính Ngân hàng",
    yearOfStudy: 4,
    district: "TP. Thủ Đức",
    provinceCode: "079",
    birthYear: 2003,
    cccdSeq: 180629,
  },
  {
    email: "khoi.dang@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Đặng Minh Khôi",
    phone: "0912345009",
    dateOfBirth: "2006-01-30",
    sex: "nam",
    university: "ĐH Văn Lang",
    studentId: "VL24018",
    major: "Truyền thông Đa phương tiện",
    yearOfStudy: 1,
    district: "Gò Vấp",
    provinceCode: "079",
    birthYear: 2006,
    cccdSeq: 190180,
  },
  {
    email: "tram.phan@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Phan Bảo Trâm",
    phone: "0912345010",
    dateOfBirth: "2004-06-22",
    sex: "nu",
    university: "ĐH Sài Gòn",
    studentId: "SG22073",
    major: "Ngôn ngữ Nhật",
    yearOfStudy: 3,
    district: "Quận 5",
    provinceCode: "079",
    birthYear: 2004,
    cccdSeq: 200731,
  },
  {
    email: "nam.vo@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Võ Nhật Nam",
    phone: "0912345011",
    dateOfBirth: "2005-10-15",
    sex: "nam",
    university: "ĐH Công nghiệp TP.HCM",
    studentId: "IUH23049",
    major: "Quản trị Nhà hàng Khách sạn",
    yearOfStudy: 2,
    district: "Gò Vấp",
    provinceCode: "077", // Bà Rịa - Vũng Tàu
    birthYear: 2005,
    cccdSeq: 210492,
  },
  {
    email: "thao.ho@demo.vn",
    plainPassword: "demo1234",
    role: "student",
    fullName: "Hồ Phương Thảo",
    phone: "0912345012",
    dateOfBirth: "2006-08-11",
    sex: "nu",
    university: "ĐH Y Dược TP.HCM",
    studentId: "YD24021",
    major: "Dược học",
    yearOfStudy: 1,
    district: "Quận 10",
    provinceCode: "079",
    birthYear: 2006,
    cccdSeq: 220213,
  },
];

/**
 * Hàm thuần túy chuyển đổi RAW_SEED_USERS sang cấu trúc đã mã hóa bcrypt và băm SHA-256 CCCD.
 */
export function buildPreparedUsers(): PreparedUser[] {
  return RAW_SEED_USERS.map((u) => {
    const passwordHash = bcrypt.hashSync(u.plainPassword, 10);

    let cccdHash: string | null = null;
    let cccdLast4: string | null = null;

    if (u.role === "student" && u.provinceCode && u.sex && u.birthYear && u.cccdSeq) {
      const rawCccd = buildFakeCccd(u.provinceCode, u.sex, u.birthYear, u.cccdSeq);
      const processed = processCccd(rawCccd);
      cccdHash = processed.hash;
      cccdLast4 = processed.last4;
    }

    return {
      email: u.email,
      passwordHash,
      role: u.role,
      fullName: u.fullName,
      phone: u.phone,
      dateOfBirth: u.dateOfBirth || null,
      sex: u.sex || null,
      university: u.university || null,
      studentId: u.studentId || null,
      major: u.major || null,
      yearOfStudy: u.yearOfStudy || null,
      district: u.district || null,
      cccdHash,
      cccdLast4,
    };
  });
}
