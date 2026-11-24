# ViệcSV

ViệcSV là ứng dụng demo tìm việc làm thêm dành cho sinh viên đại học tại TP. Hồ Chí Minh. Ứng dụng dùng React, Express và PostgreSQL trên Neon.

## Tính năng

**Sinh viên:** tìm kiếm và lọc việc làm, xem chi tiết tin tuyển dụng, lưu tin, gửi hồ sơ ứng tuyển, theo dõi trạng thái và cập nhật hồ sơ cá nhân.

**Nhà tuyển dụng:** tạo và quản lý tin tuyển dụng, xem hồ sơ ứng viên và cập nhật trạng thái ứng tuyển.

## Chạy trên máy cá nhân

Yêu cầu Node.js và một cơ sở dữ liệu PostgreSQL trên Neon.

1. Cài dependencies: `npm install`
2. Tạo `.env` từ `.env.example`, sau đó điền `DATABASE_URL` và `JWT_SECRET`.
3. Khởi tạo schema và dữ liệu demo: `npm run db:reset`
4. Chạy ứng dụng: `npm run dev`
5. Mở địa chỉ Vite hiển thị trong terminal (mặc định `http://localhost:5173`).

> **Cảnh báo:** `npm run db:reset` xóa toàn bộ dữ liệu hiện có trong cơ sở dữ liệu được cấu hình rồi tạo lại schema và dữ liệu demo. Chỉ chạy với database demo.

## Tài khoản demo

Mật khẩu các tài khoản bên dưới là `demo1234` (theo `docs/demo-accounts.json`).

| Email | Vai trò | Họ tên |
|---|---|---|
| `sinhvien@demo.vn` | Sinh viên | Nguyễn Minh Anh |
| `tuyendung@demo.vn` | Nhà tuyển dụng | Trần Hoàng Nam |
| `bao.le@demo.vn` | Sinh viên | Lê Quốc Bảo |
| `phuong.tran@demo.vn` | Sinh viên | Trần Thị Mai Phương |
| `huy.pham@demo.vn` | Sinh viên | Phạm Đức Huy |
| `linh.hoang@demo.vn` | Sinh viên | Hoàng Ngọc Linh |
| `khiem.do@demo.vn` | Sinh viên | Đỗ Gia Khiêm |
| `duong.vu@demo.vn` | Sinh viên | Vũ Thùy Dương |
| `phat.nguyen@demo.vn` | Sinh viên | Nguyễn Tấn Phát |
| `huyen.bui@demo.vn` | Sinh viên | Bùi Khánh Huyền |
| `khoi.dang@demo.vn` | Sinh viên | Đặng Minh Khôi |
| `tram.phan@demo.vn` | Sinh viên | Phan Bảo Trâm |
| `nam.vo@demo.vn` | Sinh viên | Võ Nhật Nam |
| `thao.ho@demo.vn` | Sinh viên | Hồ Phương Thảo |

Tất cả CCCD trong dữ liệu seed đều là số giả. Máy chủ chỉ lưu mã băm SHA-256 và 4 số cuối; CCCD không được trả về cho nhà tuyển dụng.

## Cấu trúc thư mục

- `src/` — ứng dụng React, trang, component, API client và tiện ích giao diện.
- `shared/` — kiểu dữ liệu, hằng số, bộ kiểm tra đầu vào và hàm văn bản dùng chung.
- `server/` — Express app, routes, dịch vụ, truy vấn PostgreSQL, schema và seed.
- `api/index.ts` — điểm vào serverless dành cho Vercel, chỉ xuất Express app.
- `scripts/` — lệnh thiết lập, nạp dữ liệu, kiểm tra trạng thái và đặt lại database.
- `docs/` — tài liệu và tài khoản demo.

## API chính

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| GET | `/api/health` | Kiểm tra dịch vụ và số tin tuyển dụng đang mở |
| GET | `/api/jobs`, `/api/meta` | Tìm việc làm và lấy dữ liệu bộ lọc |
| GET | `/api/jobs/:id`, `/api/jobs/:id/similar` | Xem chi tiết và việc làm tương tự |
| POST | `/api/auth/register/student`, `/api/auth/register/employer` | Đăng ký tài khoản |
| POST | `/api/auth/login`; GET `/api/auth/me` | Đăng nhập và lấy tài khoản hiện tại |
| GET/PUT/DELETE | `/api/saved`, `/api/saved/:jobId` | Xem, lưu và bỏ lưu việc làm (yêu cầu sinh viên) |
| POST | `/api/jobs/:id/apply`; GET `/api/applications/mine` | Ứng tuyển và xem hồ sơ của mình |
| PATCH | `/api/profile` | Cập nhật hồ sơ sinh viên |
| GET/POST/PATCH | `/api/employer/summary`, `/api/employer/companies`, `/api/employer/jobs` | Tổng quan, công ty và quản lý tin (yêu cầu nhà tuyển dụng) |
| GET/PATCH | `/api/employer/jobs/:id`, `/api/employer/jobs/:id/applications`, `/api/employer/applications/:id` | Sửa tin, xem ứng viên và cập nhật trạng thái |

## Triển khai lên Vercel

Tạo project Vercel từ repository và thiết lập hai biến môi trường:

- `DATABASE_URL` — chuỗi kết nối PostgreSQL Neon.
- `JWT_SECRET` — chuỗi bí mật đủ dài để ký token đăng nhập.

Vercel phục vụ frontend; hàm `api/index.ts` xử lý API. Region đã cấu hình là `sin1`.
