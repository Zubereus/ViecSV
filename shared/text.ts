/**
 * Chuyển đổi chuỗi tiếng Việt thành chuỗi chữ thường không dấu,
 * chuẩn hóa khoảng trắng để phục vụ tìm kiếm và lập chỉ mục.
 *
 * @param text Chuỗi văn bản tiếng Việt đầu vào
 * @returns Chuỗi thường không dấu, không khoảng trắng thừa
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    // Loại bỏ các tổ hợp dấu thanh tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")
    // Chuyển ký tự Đ/đ sang d
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    // Thay thế ký tự đặc biệt bằng khoảng trắng
    .replace(/[^a-z0-9\s]/g, " ")
    // Gom nhiều khoảng trắng liên tiếp thành 1
    .replace(/\s+/g, " ")
    .trim();
}
