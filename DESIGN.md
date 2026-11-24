# Định Hướng Thiết Kế ViệcSV (Design Direction Note)

- **Phong cách:** Editorial / Task-focused tinh gọn cho sinh viên & nhà tuyển dụng tại TP.HCM. Tối ưu khả năng quét nhanh (lương, lịch làm, quận huyện thấy ngay trong 1s); kiên quyết không AI-slop (không gradient tím xanh, không kính mờ glassmorphism, không glowing blob, không emoji làm icon/logo).
- **Typography:** Cặp phông hỗ trợ dấu tiếng Việt hoàn mỹ (ẫ, ề, ộ, ữ, ỳ): Phông tiêu đề và thương hiệu dùng **Lexend** (hiện đại, dễ đọc lướt), phông nội dung & bảng số liệu dùng **Be Vietnam Pro** (thiết kế bởi tác giả Việt Nam, cân đối tỉ lệ dấu thanh).
- **Bảng màu:** Màu hành động chính là Deep Pine Slate (`#0f3d2e` / `brand-primary`), màu nhấn duy nhất là Hổ Phách Ấm (`#d97706` / `brand-accent`) cho mức lương và điểm nhấn quan trọng; nền giấy ngà ấm (`#fbfbfa` / `surface-ground`) chống mỏi mắt; độ tương phản WCAG AA (≥4.5:1).
- **Độ sâu & Góc bo:** Bán kính bo góc chuẩn mực (6px, 8px, 12px); bóng đổ tự nhiên có độ lệch mềm mại, không bóng đặc hay viền màu lòe loẹt; logo công ty dạng monogram chữ cái đầu với màu nền xác định (deterministic muted tint).
- **Trạng thái & Chuyển động:** Chuyển động nhẹ 150–200ms với cubic-bezier mượt; mọi phần tử có đầy đủ hover, focus-visible với outline rõ nét, active, disabled; nhãn và thông báo lỗi bằng tiếng Việt chuẩn ngữ cảnh, tự nhiên.

## Ghi Chú Thiết Kế Trang Tìm Kiếm Việc Làm (Phase 3)
- **Định hướng & Bố cục:** Thiết kế theo chế độ Operate (công cụ tác vụ). Không hero banner hoa mỹ; mở thẳng vào thanh tìm kiếm và kết quả. Desktop chia 2 cột: filter panel sticky 280px bên trái, kết quả việc làm bên phải. Mobile dùng Bottom Sheet trượt mượt mà có bẫy focus và phím Esc.
- **Thẻ việc làm (JobCard):** Ưu tiên độ quét nhanh: mức lương (VND/giờ) là tâm điểm thị giác màu hổ phách `#d97706`; lịch làm (`T2, T4, T6`, `Cuối tuần`) và quận huyện hiển thị súc tích; logo monogram 44px mang chữ cái đầu công ty trên nền màu xác định, chữ có độ tương phản chuẩn.
- **Bộ lọc & Chip:** Hỗ trợ thanh kéo/nhập lương từ meta, chip ngày làm việc kèm lối tắt "Chỉ cuối tuần", chip ca làm việc sáng/chiều/tối, danh sách đa chọn ngành nghề & quận huyện có số lượng đếm kèm. Toàn bộ bộ lọc đang kích hoạt hiện dưới dạng chip tháo gỡ được phía trên kết quả.
- **Chuyển trạng thái:** Skeleton loading khớp 100% kích thước thẻ thực tế; giữ danh sách cũ với thanh tiến trình tinh tế khi lọc lại thay vì chớp giật; thông báo rỗng gợi ý cách nới lỏng bộ lọc trực tiếp.

## Ghi Chú Thiết Kế Xác Thực, Hồ Sơ & Ứng Tuyển (Phase 4)
- **Định hướng & Khí chất:** Giao diện tài khoản và quy trình ứng tuyển hướng đến sự tôn trọng, minh bạch và an tâm tuyệt đối cho sinh viên. Đồ họa không hào nhoáng, không gradient tím xanh hay viền phát sáng; dùng hình khối biên độ rõ ràng, nét viền mỏng `#e2e8f0` và bảng màu tự nhiên (Deep Pine Slate `#0f3d2e`, hổ phách ấm `#d97706`, nền ngà `#fbfbfa`).
- **Quy trình Đăng ký 3 bước:** Wizard sinh viên chia nhịp nhẹ nhàng (Tài khoản -> Thông tin cá nhân -> Học vấn), thanh tiến trình đo lường trực quan, giữ nguyên dữ liệu khi quay lại bước trước; trường CCCD luôn có ghi chú bảo mật rõ ràng, giải thích việc mã hóa.
- **Chi tiết việc làm (Job Detail):** Bố cục 2 cột trên desktop với thanh hành động dính (`sticky action sidebar`) và thanh dính đáy (`bottom bar`) trên mobile. Mức lương và các điểm chốt (ca làm, địa chỉ, hình thức) được gom thành khối dữ liệu dễ đối chiếu; modal ứng tuyển có bẫy focus, điền sẵn thông tin từ hồ sơ và bộ đếm ký tự giới thiệu.
- **Bảo mật & Trạng thái:** Số CCCD luôn hiển thị dạng mặt nạ `•••••••• 1234` và vô hiệu hóa sửa đổi; huy hiệu trạng thái ứng tuyển dùng kết hợp cả biểu tượng (icon) và văn bản rõ nghĩa, không phụ thuộc vào màu sắc đơn thuần. Mọi thông báo lỗi gắn kèm trường dữ liệu với `aria-invalid` và `aria-describedby`.

