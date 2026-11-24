// Hằng số hệ thống ViệcSV dùng chung Client và Server

export const APP_NAME = "ViệcSV";
export const APP_TAGLINE = "Việc làm thêm cho sinh viên TP.HCM";

/** Danh sách khoảng 20 trường đại học tiêu biểu tại TP. Hồ Chí Minh */
export const UNIVERSITIES = [
  "ĐH Bách Khoa (ĐHQG-HCM)",
  "ĐH Khoa học Tự nhiên (ĐHQG-HCM)",
  "ĐH Khoa học Xã hội và Nhân văn (ĐHQG-HCM)",
  "ĐH Công nghệ Thông tin (ĐHQG-HCM)",
  "ĐH Quốc tế (ĐHQG-HCM)",
  "ĐH Kinh tế - Luật (ĐHQG-HCM)",
  "ĐH Kinh tế TP.HCM (UEH)",
  "ĐH Sư phạm TP.HCM",
  "ĐH Sư phạm Kỹ thuật TP.HCM",
  "ĐH Sài Gòn",
  "ĐH Mở TP.HCM",
  "ĐH Ngân hàng TP.HCM",
  "ĐH Tôn Đức Thắng",
  "ĐH Công nghiệp TP.HCM",
  "ĐH Nông Lâm TP.HCM",
  "ĐH Y Dược TP.HCM",
  "ĐH Y khoa Phạm Ngọc Thạch",
  "ĐH Luật TP.HCM",
  "ĐH FPT TP.HCM",
  "ĐH Văn Lang",
  "ĐH Công nghệ TP.HCM (HUTECH)",
  "Trường khác",
] as const;

/** Danh sách tùy chọn giới tính */
export const SEX_OPTIONS = [
  { value: "nam", label: "Nam" },
  { value: "nu", label: "Nữ" },
  { value: "khac", label: "Khác" },
] as const;

/** Danh sách năm học của sinh viên (1 - 6) */
export const YEAR_OPTIONS = [
  { value: 1, label: "Năm 1" },
  { value: 2, label: "Năm 2" },
  { value: 3, label: "Năm 3" },
  { value: 4, label: "Năm 4" },
  { value: 5, label: "Năm 5" },
  { value: 6, label: "Năm 6 (Khối Y - Dược)" },
] as const;

/** Danh sách quận/huyện tại TP. Hồ Chí Minh */
export const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Phú Nhuận",
  "Gò Vấp",
  "Tân Bình",
  "Tân Phú",
  "Bình Tân",
  "TP. Thủ Đức",
  "Nhà Bè",
  "Hóc Môn",
  "Bình Chánh",
  "Củ Chi",
  "Cần Giờ",
] as const;

/** Danh mục các ngành nghề việc làm thêm sinh viên */
export const CATEGORIES = [
  "Phục vụ / F&B",
  "Bán hàng / Cửa hàng",
  "Gia sư",
  "Trợ giảng",
  "Nhập liệu / Văn phòng",
  "Content / Social media",
  "Thiết kế",
  "Giao hàng",
  "Sự kiện / PG",
  "Chăm sóc khách hàng",
  "Dịch thuật",
  "IT hỗ trợ / Lập trình",
] as const;

/** Danh sách ca làm việc phổ biến */
export const SHIFT_MAP = {
  sang: "Ca sáng (06:00 – 12:00)",
  chieu: "Ca chiều (12:00 – 18:00)",
  toi: "Ca tối (18:00 – 23:00)",
} as const;

export const SHIFT_OPTIONS = [
  { value: "sang", label: "Ca sáng (06:00 – 12:00)" },
  { value: "chieu", label: "Ca chiều (12:00 – 18:00)" },
  { value: "toi", label: "Ca tối (18:00 – 23:00)" },
] as const;

/** Hình thức làm việc */
export const WORK_TYPE_MAP = {
  "tai-cho": "Tại chỗ",
  "tu-xa": "Từ xa / Online",
  "linh-hoat": "Linh hoạt / Kết hợp",
} as const;

export const WORK_TYPE_OPTIONS = [
  { value: "tai-cho", label: "Tại chỗ" },
  { value: "tu-xa", label: "Từ xa / Online" },
  { value: "linh-hoat", label: "Linh hoạt / Kết hợp" },
] as const;

/** Trạng thái hồ sơ ứng tuyển */
export const APPLICATION_STATUS_MAP = {
  moi: "Mới ứng tuyển",
  "da-xem": "Đã xem hồ sơ",
  "hen-phong-van": "Hẹn phỏng vấn",
  "da-nhan": "Đã nhận việc",
  "tu-choi": "Chưa phù hợp",
} as const;

export const APPLICATION_STATUS_OPTIONS = [
  { value: "moi", label: "Mới ứng tuyển" },
  { value: "da-xem", label: "Đã xem hồ sơ" },
  { value: "hen-phong-van", label: "Hẹn phỏng vấn" },
  { value: "da-nhan", label: "Đã nhận việc" },
  { value: "tu-choi", label: "Chưa phù hợp" },
] as const;

/** Các ngày trong tuần */
export const DAYS_OF_WEEK = [
  { value: "T2", label: "Thứ 2" },
  { value: "T3", label: "Thứ 3" },
  { value: "T4", label: "Thứ 4" },
  { value: "T5", label: "Thứ 5" },
  { value: "T6", label: "Thứ 6" },
  { value: "T7", label: "Thứ 7" },
  { value: "CN", label: "Chủ nhật" },
] as const;
