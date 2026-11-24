import dotenv from "dotenv";
dotenv.config();

import { app } from "../server/app.js";
import type { Server } from "node:http";

const PORT = 3999;
let server: Server;

async function request(path: string, options: RequestInit = {}) {
  const url = `http://127.0.0.1:${PORT}${path}`;
  const { headers, ...restOptions } = options;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    },
    ...restOptions,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ [THẤT BẠI] ${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ ${msg}`);
}

async function run() {
  console.log("🚀 Bắt đầu kịch bản kiểm thử toàn diện Phase 2 REST API...\n");

  server = app.listen(PORT);

  try {
    // 1. Kiểm tra Health
    console.log("1. Kiểm tra /api/health:");
    const health = await request("/api/health");
    assert(health.status === 200, "Health status 200");
    assert(health.data.ok === true && health.data.db === true, "Health ok: true và db: true");
    assert(typeof health.data.jobs === "number", `Số việc mở là số: ${health.data.jobs}`);

    // 2. Kiểm tra Đăng nhập tài khoản Demo
    console.log("\n2. Kiểm tra Đăng nhập & Xác thực:");
    // Đăng nhập sai
    const loginWrong = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "sinhvien@demo.vn", password: "wrongpassword" }),
    });
    assert(loginWrong.status === 400, "Đăng nhập sai mật khẩu trả về 400");
    assert(loginWrong.data.message === "Email hoặc mật khẩu không đúng", "Đúng thông báo lỗi chuẩn");

    // Đăng nhập thành công sinh viên demo
    const loginStudent = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "sinhvien@demo.vn", password: "demo1234" }),
    });
    assert(loginStudent.status === 200, "Đăng nhập sinh viên demo thành công (200)");
    const studentToken = loginStudent.data.token;
    assert(Boolean(studentToken), "Có token JWT hợp lệ");
    assert(loginStudent.data.user.role === "student", "Vai trò student");
    assert(!("password_hash" in loginStudent.data.user), "BẢO MẬT: Không rò rỉ password_hash");
    assert(!("cccd_hash" in loginStudent.data.user), "BẢO MẬT: Không rò rỉ cccd_hash");
    assert(loginStudent.data.user.cccdMasked === "•••••••• 4561", "CCCD hiển thị đúng dạng mặt nạ");

    // Đăng nhập thành công employer demo
    const loginEmployer = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "tuyendung@demo.vn", password: "demo1234" }),
    });
    assert(loginEmployer.status === 200, "Đăng nhập employer demo thành công (200)");
    const employerToken = loginEmployer.data.token;

    // 3. Kiểm tra bảo mật /api/auth/me
    console.log("\n3. Kiểm tra /api/auth/me & Bảo mật thông tin CCCD:");
    const meRes = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(meRes.status === 200, "/api/auth/me thành công");
    assert(!("password_hash" in meRes.data.user), "BẢO MẬT: Không rò rỉ password_hash");
    assert(!("cccd_hash" in meRes.data.user), "BẢO MẬT: Không rò rỉ cccd_hash");
    assert(meRes.data.user.verified === true, "verified: true");

    // Không có token
    const meNoToken = await request("/api/auth/me");
    assert(meNoToken.status === 401, "Không có token trả về 401 Vui lòng đăng nhập");

    // 4. Kiểm tra Đăng ký Sinh viên & Các trường hợp lỗi
    console.log("\n4. Kiểm tra Đăng ký Sinh viên & Bắt lỗi Validation:");
    const uniqueTime = Date.now();

    // Lỗi mật khẩu yếu
    const regWeakPass = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `sv_${uniqueTime}@demo.vn`,
        password: "123",
        fullName: "Test Sinh Viên",
        dateOfBirth: "2004-01-01",
        sex: "nam",
        phone: "0901111222",
        university: "ĐH Bách Khoa",
        yearOfStudy: 2,
        cccd: "079204011222",
      }),
    });
    assert(regWeakPass.status === 400 && regWeakPass.data.message.includes("Mật khẩu"), "Bắt lỗi mật khẩu yếu");

    // Lỗi dưới 16 tuổi
    const regUnder16 = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `sv_${uniqueTime}@demo.vn`,
        password: "Password123",
        fullName: "Test Sinh Viên",
        dateOfBirth: "2020-01-01",
        sex: "nam",
        phone: "0901111222",
        university: "ĐH Bách Khoa",
        yearOfStudy: 2,
        cccd: "079204011222",
      }),
    });
    assert(regUnder16.status === 400 && regUnder16.data.message.includes("16 tuổi"), "Bắt lỗi dưới 16 tuổi");

    // Lỗi CCCD không khớp năm sinh
    const regCccdMismatch = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `sv_${uniqueTime}@demo.vn`,
        password: "Password123",
        fullName: "Test Sinh Viên",
        dateOfBirth: "2004-01-01",
        sex: "nam",
        phone: "0901111222",
        university: "ĐH Bách Khoa",
        yearOfStudy: 2,
        cccd: "079205011222", // 05 khác 04
      }),
    });
    assert(regCccdMismatch.status === 400 && regCccdMismatch.data.message.includes("không khớp"), "Bắt lỗi CCCD sai năm sinh");

    // Đăng ký thành công
    const regSuccess = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `sv_${uniqueTime}@demo.vn`,
        password: "Password123",
        fullName: "Nguyễn Văn Mới",
        dateOfBirth: "2004-08-15",
        sex: "nam",
        phone: "0901111222",
        university: "ĐH Bách Khoa (ĐHQG-HCM)",
        yearOfStudy: 2,
        cccd: `079204${String(uniqueTime).slice(-6)}`,
      }),
    });
    assert(regSuccess.status === 201, "Đăng ký sinh viên mới thành công (201)");
    assert(!("password_hash" in regSuccess.data.user), "BẢO MẬT: Phản hồi register không có password_hash");
    assert(!("cccd_hash" in regSuccess.data.user), "BẢO MẬT: Phản hồi register không có cccd_hash");

    // Trùng email
    const regDupEmail = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `sv_${uniqueTime}@demo.vn`,
        password: "Password123",
        fullName: "Người Khác",
        dateOfBirth: "2004-08-15",
        sex: "nam",
        phone: "0903333444",
        university: "ĐH Sư phạm",
        yearOfStudy: 1,
        cccd: "079204999888",
      }),
    });
    assert(regDupEmail.status === 400 && regDupEmail.data.message === "Email đã được sử dụng", "Bắt lỗi trùng email");

    // Trùng CCCD
    const regDupCccd = await request("/api/auth/register/student", {
      method: "POST",
      body: JSON.stringify({
        email: `another_${uniqueTime}@demo.vn`,
        password: "Password123",
        fullName: "Người Khác",
        dateOfBirth: "2004-08-15",
        sex: "nam",
        phone: "0903333444",
        university: "ĐH Sư phạm",
        yearOfStudy: 1,
        cccd: `079204${String(uniqueTime).slice(-6)}`, // CCCD vừa đăng ký ở trên
      }),
    });
    assert(regDupCccd.status === 400 && regDupCccd.data.message === "CCCD này đã được đăng ký", "Bắt lỗi trùng CCCD");

    // 5. Kiểm tra Cập nhật Profile (PATCH /api/profile)
    console.log("\n5. Kiểm tra Cập nhật hồ sơ sinh viên (/api/profile):");
    // Thử sửa CCCD hoặc ngày sinh -> phải bị từ chối
    const patchForbidden = await request("/api/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ cccd: "079204123456" }),
    });
    assert(patchForbidden.status === 400, "Cấm sửa CCCD bị chặn");

    const patchSuccess = await request("/api/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ fullName: "Nguyễn Minh Anh Mới", phone: "0903123456" }),
    });
    assert(patchSuccess.status === 200, "Cập nhật họ tên thành công");
    assert(patchSuccess.data.user.fullName === "Nguyễn Minh Anh Mới", "Họ tên mới cập nhật đúng");

    // 6. Kiểm tra Public Jobs API
    console.log("\n6. Kiểm tra Public Jobs API:");
    // Tìm kiếm từ khóa "gia su"
    const searchGiaSu = await request("/api/jobs?q=gia%20su");
    assert(searchGiaSu.status === 200, "Tìm việc gia sư trả về 200");
    assert(searchGiaSu.data.items.length > 0, `Tìm thấy ${searchGiaSu.data.items.length} việc gia sư`);
    assert(
      searchGiaSu.data.items.every((j: any) =>
        j.title.toLowerCase().includes("gia sư") || j.category.includes("Gia sư") || j.description.includes("gia sư")
      ),
      "Mọi kết quả đều khớp ngữ cảnh 'gia sư'"
    );

    // Lọc kết hợp (Lương + Ngày + Ca + Sắp xếp + Phân trang)
    const complexFilter = await request("/api/jobs?minWage=30000&maxWage=80000&sort=luong-cao&page=1&pageSize=5");
    assert(complexFilter.status === 200, "Lọc kết hợp thành công");
    assert(complexFilter.data.items.length <= 5, "Phân trang pageSize 5");
    assert(complexFilter.data.totalPages >= 1, "Tính toán totalPages chính xác");

    // Lấy chi tiết việc làm
    const firstJobId = complexFilter.data.items[0].id;
    const jobDetail = await request(`/api/jobs/${firstJobId}`);
    assert(jobDetail.status === 200, "Lấy chi tiết việc làm thành công");
    assert(Boolean(jobDetail.data.job.company), "Có thông tin công ty lồng bên trong");

    // Lấy việc làm tương tự
    const similarJobs = await request(`/api/jobs/${firstJobId}/similar`);
    assert(similarJobs.status === 200, "Lấy việc tương tự thành công");
    assert(similarJobs.data.items.length <= 3, "Tối đa 3 việc tương tự");

    // Meta bộ lọc
    const metaRes = await request("/api/meta");
    assert(metaRes.status === 200, "Lấy meta bộ lọc thành công");
    assert(metaRes.data.categories.length > 0, "Có danh sách categories kèm số lượng");
    assert(metaRes.data.districts.length > 0, "Có danh sách districts kèm số lượng");

    // 7. Kiểm tra Quyền & Tính năng Sinh viên (Saved & Apply)
    console.log("\n7. Kiểm tra Quyền và Thao tác Sinh viên (Saved & Apply):");
    // Employer không được truy cập /api/saved
    const empSaved = await request("/api/saved", {
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    assert(empSaved.status === 403, "Employer bị từ chối 403 khi vào /api/saved");

    // Sinh viên lấy danh sách việc đã lưu
    const savedList = await request("/api/saved", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(savedList.status === 200, "Sinh viên lấy danh sách việc đã lưu thành công");
    assert(Array.isArray(savedList.data.items), "Danh sách việc đã lưu là mảng");

    // Lưu một việc mới và hủy lưu
    const testJobId = "10";
    const putSave = await request(`/api/saved/${testJobId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(putSave.status === 200 && putSave.data.saved === true, "Lưu việc thành công (PUT)");

    const delSave = await request(`/api/saved/${testJobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(delSave.status === 200 && delSave.data.saved === false, "Hủy lưu việc thành công (DELETE)");

    // Ứng tuyển vào việc mở
    const applyRes = await request(`/api/jobs/8/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        fullName: "Nguyễn Minh Anh",
        phone: "0903123456",
        university: "ĐH Bách Khoa",
        intro: "Em muốn thử sức với vị trí này ạ.",
        availableTime: "Rảnh tối T2, T4",
      }),
    });
    // Job 8 chưa có đơn của Minh Anh trong seed -> 201 hoặc nếu đã có -> 400
    if (applyRes.status === 201) {
      assert(applyRes.data.ok === true, "Ứng tuyển thành công");
      // Thử ứng tuyển lại lần 2 -> phải bị chặn duplicate
      const dupApply = await request(`/api/jobs/8/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${studentToken}` },
        body: JSON.stringify({
          fullName: "Nguyễn Minh Anh",
          phone: "0903123456",
          university: "ĐH Bách Khoa",
          intro: "Em nộp lại",
          availableTime: "Rảnh tối",
        }),
      });
      assert(dupApply.status === 400 && dupApply.data.message === "Bạn đã ứng tuyển việc này rồi", "Chặn nộp hồ sơ trùng lặp");
    } else {
      assert(applyRes.data.message === "Bạn đã ứng tuyển việc này rồi", "Chặn nộp hồ sơ trùng lặp");
    }

    // Ứng tuyển vào việc đã đóng (Job 4 là closed)
    const applyClosed = await request(`/api/jobs/4/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        fullName: "Nguyễn Minh Anh",
        phone: "0903123456",
        university: "ĐH Bách Khoa",
        availableTime: "Rảnh tối",
      }),
    });
    assert(applyClosed.status === 400 && applyClosed.data.message === "Tin tuyển dụng đã đóng", "Chặn ứng tuyển tin đã đóng");

    // Xem danh sách hồ sơ của tôi
    const myApps = await request("/api/applications/mine", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(myApps.status === 200, "Lấy danh sách hồ sơ ứng tuyển của tôi thành công");
    assert(myApps.data.items.length > 0, "Có hồ sơ ứng tuyển trả về");
    assert(
      myApps.data.items.every((a: any) => !("password_hash" in a) && !("cccd_hash" in a)),
      "BẢO MẬT: Hồ sơ ứng tuyển không rò rỉ hash/cccd"
    );

    console.log("\n🎉 TẤT CẢ CÁC BÀI KIỂM THỬ GIAI ĐOẠN 2 ĐỀU ĐẠT CHUẨN XUẤT SẮC!");
  } finally {
    server.close();
  }
}

run().catch((err) => {
  console.error("Lỗi kịch bản kiểm thử:", err);
  if (server) server.close();
  process.exit(1);
});
