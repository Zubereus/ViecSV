// Các hàm định dạng thuần túy dùng cho giao diện ViệcSV

/**
 * Định dạng mức lương theo chuẩn tiền tệ Việt Nam (vi-VN)
 * Ví dụ: 35000 -> "35.000đ/giờ"
 */
export function formatWage(wage: number): string {
  const formatted = new Intl.NumberFormat("vi-VN").format(wage);
  return `${formatted}đ/giờ`;
}

/**
 * Định dạng thời gian đăng tin tương đối bằng tiếng Việt
 * Ví dụ: "Vừa xong", "Hôm nay", "Hôm qua", "3 ngày trước"
 */
export function formatPostedAt(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 60) {
    return diffMins <= 1 ? "Vừa xong" : `${diffMins} phút trước`;
  }
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return `Hôm nay, ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  if (diffDays === 1 || (diffHours < 48 && date.getDate() === now.getDate() - 1)) {
    return "Hôm qua";
  }
  if (diffDays <= 30) {
    return `${diffDays} ngày trước`;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Rút gọn hiển thị danh sách ngày làm việc
 * Ví dụ: ["T7", "CN"] -> "Cuối tuần", 7 ngày -> "Cả tuần", ["T2", "T4", "T6"] -> "T2, T4, T6"
 */
export function formatDays(days: string[]): string {
  if (!days || days.length === 0) return "Linh hoạt";
  if (days.length === 7) return "Cả tuần";

  const isWeekendOnly = days.length === 2 && days.includes("T7") && days.includes("CN");
  if (isWeekendOnly) return "Chỉ cuối tuần";

  const isWeekdaysOnly =
    days.length === 5 &&
    days.includes("T2") &&
    days.includes("T3") &&
    days.includes("T4") &&
    days.includes("T5") &&
    days.includes("T6");
  if (isWeekdaysOnly) return "Thứ 2 – Thứ 6";

  const dayOrder: Record<string, number> = {
    T2: 1,
    T3: 2,
    T4: 3,
    T5: 4,
    T6: 5,
    T7: 6,
    CN: 7,
  };

  const sorted = [...days].sort((a, b) => (dayOrder[a] || 99) - (dayOrder[b] || 99));
  return sorted.join(", ");
}

/**
 * Định dạng danh sách ca làm việc
 * Ví dụ: ["sang", "toi"] -> "Ca sáng, Ca tối"
 */
export function formatShifts(shifts: string[]): string {
  if (!shifts || shifts.length === 0) return "Linh hoạt";

  const shiftLabels: Record<string, string> = {
    sang: "Ca sáng",
    chieu: "Ca chiều",
    toi: "Ca tối",
  };

  return shifts.map((s) => shiftLabels[s] || s).join(", ");
}

/**
 * Trích xuất monogram chữ cái đầu đại diện cho công ty (tối đa 2 chữ cái)
 * Ví dụ: "Gốm & Trà Mộc" -> "GM", "Phúc Long" -> "PL", "Tiệm Bách Hóa 24h" -> "BH"
 */
export function getMonogram(companyName: string): string {
  if (!companyName || !companyName.trim()) return "VS";

  // Lọc bỏ ký tự đặc biệt, số và từ nối thông dụng
  const cleaned = companyName
    .replace(/[&|/\\#,+()$~%.'":*?<>{}]/g, " ")
    .replace(/\b(công ty|tnhh|cổ phần|chi nhánh|tiệm|chuỗi)\b/gi, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return companyName.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const firstLetter = words[0].charAt(0);
  const secondLetter = words[1].charAt(0);
  return `${firstLetter}${secondLetter}`.toUpperCase();
}

/**
 * Tính toán độ sáng tương đối (Luminance) để chọn màu chữ (Trắng hoặc Đen)
 * đảm bảo đạt chuẩn tương phản WCAG AA trên nền màu hex của công ty.
 */
export function getReadableTextColor(hex: string): string {
  if (!hex || !hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) {
    return "#ffffff";
  }

  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (hex.length === 4) {
    r = parseInt(hex.slice(1, 2) + hex.slice(1, 2), 16);
    g = parseInt(hex.slice(2, 3) + hex.slice(2, 3), 16);
    b = parseInt(hex.slice(3, 4) + hex.slice(3, 4), 16);
  }

  // Công thức chuẩn YIQ tính độ cảm nhận quang học
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0f172a" : "#ffffff";
}
