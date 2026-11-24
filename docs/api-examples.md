# Tài Liệu và Ví Dụ Gọi API ViệcSV (Phase 2)

Hệ thống ViệcSV cung cấp toàn bộ phản hồi dạng JSON với thông báo lỗi tiếng Việt chuẩn hóa.

Biến môi trường mẫu cho local: `http://localhost:3001`

---

## 1. Xác thực & Tài khoản (`/api/auth`)

### 1.1 Đăng ký tài khoản Sinh viên
```bash
curl -X POST http://localhost:3001/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.sinhvien@demo.vn",
    "password": "Password123",
    "fullName": "Phan Văn Trí",
    "dateOfBirth": "2003-09-12",
    "sex": "nam",
    "phone": "0909123456",
    "university": "ĐH Bách Khoa (ĐHQG-HCM)",
    "studentId": "BK21045",
    "major": "Kỹ thuật Máy tính",
    "yearOfStudy": 4,
    "district": "Quận 10",
    "cccd": "079203012345"
  }'
```

### 1.2 Đăng ký tài khoản Nhà tuyển dụng
```bash
curl -X POST http://localhost:3001/api/auth/register/employer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.tuyendung@demo.vn",
    "password": "Password123",
    "fullName": "Nguyễn Văn Giám Đốc",
    "phone": "0988123456",
    "companyName": "Công Ty Sáng Tạo Trẻ",
    "industry": "Marketing & Truyền thông"
  }'
```

### 1.3 Đăng nhập
```bash
# Đăng nhập sinh viên demo
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sinhvien@demo.vn",
    "password": "demo1234"
  }'
```

### 1.4 Lấy thông tin tài khoản hiện tại (`/me`)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <TOKEN_O_BUOC_DANG_NHAP>"
```

### 1.5 Cập nhật hồ sơ sinh viên
```bash
curl -X PATCH http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{
    "fullName": "Nguyễn Minh Anh Cập Nhật",
    "phone": "0903999888",
    "major": "Kỹ thuật Phần mềm",
    "yearOfStudy": 4
  }'
```

---

## 2. Việc làm Công khai (`/api/jobs`)

### 2.1 Tìm kiếm và lọc việc làm
```bash
# Tìm kiếm từ khóa "gia su" kèm lọc lương và sắp xếp
curl "http://localhost:3001/api/jobs?q=gia%20su&minWage=80000&sort=luong-cao&page=1&pageSize=10"

# Lọc theo ca làm và ngày
curl "http://localhost:3001/api/jobs?shifts=sang,toi&days=T7,CN&workTypes=tai-cho"

# Lọc không yêu cầu kinh nghiệm tại Quận 1
curl "http://localhost:3001/api/jobs?districts=Qu%E1%BA%ADn%201&noExperience=true"
```

### 2.2 Dữ liệu Meta phục vụ xây dựng bộ lọc
```bash
curl http://localhost:3001/api/meta
```

### 2.3 Chi tiết việc làm
```bash
curl http://localhost:3001/api/jobs/1
```

### 2.4 Công việc tương tự cùng ngành
```bash
curl http://localhost:3001/api/jobs/1/similar
```

---

## 3. Chức năng Sinh viên (`/api/saved` & `/api/applications`)

### 3.1 Danh sách việc đã lưu
```bash
curl -X GET http://localhost:3001/api/saved \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```

### 3.2 Lưu việc làm (Idempotent)
```bash
curl -X PUT http://localhost:3001/api/saved/2 \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```

### 3.3 Hủy lưu việc làm
```bash
curl -X DELETE http://localhost:3001/api/saved/2 \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```

### 3.4 Nộp hồ sơ ứng tuyển
```bash
curl -X POST http://localhost:3001/api/jobs/2/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{
    "fullName": "Nguyễn Minh Anh",
    "phone": "0903123456",
    "university": "ĐH Bách Khoa (ĐHQG-HCM)",
    "intro": "Em rất mong muốn được trải nghiệm công việc này.",
    "availableTime": "Ca tối thứ 2, 4, 6"
  }'
```

### 3.5 Xem các hồ sơ đã nộp của tôi
```bash
curl -X GET http://localhost:3001/api/applications/mine \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```
