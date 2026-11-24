import type { ApplicationStatus } from "../../shared/types.js";

export interface PreparedSavedJob {
  userId: string;
  jobId: string;
}

export interface PreparedApplication {
  jobId: string;
  userId: string;
  fullName: string;
  phone: string;
  university: string;
  intro: string;
  availableTime: string;
  status: ApplicationStatus;
  daysAgo: number;
}

/**
 * Xây dựng danh sách 5 công việc đã lưu cho tài khoản sinh viên demo (Nguyễn Minh Anh).
 */
export function buildSavedJobsForDemoStudent(
  studentId: string,
  candidateJobIds: string[]
): PreparedSavedJob[] {
  // Chọn 5 công việc đầu tiên từ danh sách công việc ứng viên
  return candidateJobIds.slice(0, 5).map((jobId) => ({
    userId: studentId,
    jobId,
  }));
}

/**
 * Xây dựng danh sách các hồ sơ ứng tuyển:
 * 1. 4 hồ sơ ứng tuyển của sinh viên demo chính (với 4 trạng thái khác nhau: moi, da-xem, hen-phong-van, da-nhan)
 * 2. 20+ hồ sơ ứng tuyển từ 12 sinh viên hư cấu nộp vào các công việc thuộc nhà tuyển dụng demo.
 */
export function buildDemoApplications(
  demoStudent: { id: string; fullName: string; phone: string; university: string },
  employerJobIds: string[],
  otherStudents: Array<{ id: string; fullName: string; phone: string; university: string }>
): PreparedApplication[] {
  const applications: PreparedApplication[] = [];

  // --- 1. 4 hồ sơ của sinh viên demo chính ---
  if (employerJobIds.length >= 4) {
    applications.push({
      jobId: employerJobIds[0],
      userId: demoStudent.id,
      fullName: demoStudent.fullName,
      phone: demoStudent.phone,
      university: demoStudent.university,
      intro: "Em chào anh/chị, em là sinh viên năm 3 Bách Khoa. Em rất cẩn thận, đã từng làm việc part-time và mong muốn được cống hiến lâu dài tại quán.",
      availableTime: "Rảnh tối T2, T4, T6 và cả ngày Chủ nhật",
      status: "moi",
      daysAgo: 1,
    });

    applications.push({
      jobId: employerJobIds[1],
      userId: demoStudent.id,
      fullName: demoStudent.fullName,
      phone: demoStudent.phone,
      university: demoStudent.university,
      intro: "Em muốn ứng tuyển vị trí này để rèn luyện thêm kỹ năng giao tiếp và tự lập tài chính trong năm học này ạ.",
      availableTime: "Rảnh các buổi chiều T3, T5, T7 từ 13h đến 18h",
      status: "da-xem",
      daysAgo: 3,
    });

    applications.push({
      jobId: employerJobIds[2],
      userId: demoStudent.id,
      fullName: demoStudent.fullName,
      phone: demoStudent.phone,
      university: demoStudent.university,
      intro: "Em đã đọc kỹ mô tả công việc và thấy rất phù hợp với thời gian biểu của em. Em cam kết làm việc nghiêm túc, đúng giờ.",
      availableTime: "Rảnh ca tối tất cả các ngày trong tuần",
      status: "hen-phong-van",
      daysAgo: 5,
    });

    applications.push({
      jobId: employerJobIds[3],
      userId: demoStudent.id,
      fullName: demoStudent.fullName,
      phone: demoStudent.phone,
      university: demoStudent.university,
      intro: "Em rất thích văn hóa của công ty và hy vọng có cơ hội học hỏi cũng như đóng góp cho đội ngũ.",
      availableTime: "Có thể linh hoạt đổi ca theo sắp xếp của quản lý",
      status: "da-nhan",
      daysAgo: 7,
    });
  }

  // --- 2. 20+ hồ sơ từ 12 sinh viên khác nộp vào các việc của nhà tuyển dụng demo ---
  const intros = [
    "Em chào anh/chị, em là sinh viên năng động, nhiệt tình, có trách nhiệm cao trong công việc.",
    "Em có kinh nghiệm 6 tháng làm phục vụ tại chuỗi cà phê, mong muốn tìm kiếm môi trường mới chuyên nghiệp hơn.",
    "Em nhà gần chi nhánh nên có thể đến làm nhanh chóng và hỗ trợ bù ca khi có bạn khác bận đột xuất.",
    "Em rất mong được nhận vào làm việc để trang trải học phí và tích lũy thêm kỹ năng thực tế.",
    "Em tính tình cẩn thận, trung thực, giao tiếp tiếng Anh cơ bản tốt.",
    "Em có thể cam kết gắn bó ít nhất 6 tháng trong năm học này ạ.",
    "Em đã từng tham gia nhiều hoạt động Đoàn - Hội nên rất hòa đồng và biết lắng nghe.",
  ];

  const availabilities = [
    "Rảnh tất cả các buổi sáng trong tuần",
    "Rảnh ca chiều T2, T4, T6 và cả ngày Chủ nhật",
    "Rảnh ca tối T3, T5, T7",
    "Rảnh 2 ngày cuối tuần T7 và Chủ nhật",
    "Lịch học tuần này rảnh các buổi chiều từ 12h30",
  ];

  const statusList: ApplicationStatus[] = [
    "moi",
    "da-xem",
    "hen-phong-van",
    "da-nhan",
    "tu-choi",
  ];

  let appCount = 0;
  // Mỗi sinh viên trong 12 bạn nộp vào 2 công việc khác nhau của employer (tổng cộng 24 hồ sơ)
  for (let sIndex = 0; sIndex < otherStudents.length; sIndex++) {
    const student = otherStudents[sIndex];

    for (let j = 0; j < 2; j++) {
      // Phân bổ rải đều vào các job của employer
      const jobIndex = (sIndex * 2 + j + 4) % employerJobIds.length;
      const jobId = employerJobIds[jobIndex];

      const status = statusList[appCount % statusList.length];
      const intro = intros[appCount % intros.length];
      const availableTime = availabilities[appCount % availabilities.length];
      const daysAgo = (appCount % 14) + 1;

      applications.push({
        jobId,
        userId: student.id,
        fullName: student.fullName,
        phone: student.phone,
        university: student.university,
        intro,
        availableTime,
        status,
        daysAgo,
      });

      appCount++;
    }
  }

  return applications;
}
