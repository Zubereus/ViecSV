import { withTransaction } from "../db/client.js";
import {
  getTotalJobCount,
  insertUsersBatch,
  insertCompaniesBatch,
  insertJobsBatch,
  insertSavedJobsBatch,
  insertApplicationsBatch,
} from "../db/queries.js";
import { buildPreparedUsers, RAW_SEED_USERS } from "./accounts.seed.js";
import { SEED_COMPANIES } from "./companies.seed.js";
import { buildPreparedJobs, RAW_SEED_JOBS } from "./jobs.seed.js";
import {
  buildSavedJobsForDemoStudent,
  buildDemoApplications,
} from "./activity.seed.js";

/**
 * Hàm thực thi quy trình gieo dữ liệu hạt giống (Seed Data)
 * Thực thi trong một giao dịch cơ sở dữ liệu duy nhất (single transaction)
 */
export async function runSeed(force = false): Promise<boolean> {
  const currentJobCount = await getTotalJobCount();

  if (!force && currentJobCount > 0) {
    console.log(
      `ℹ️  [db:seed] Cơ sở dữ liệu đã có ${currentJobCount} việc làm. Bỏ qua seed để tránh trùng lặp dữ liệu.`
    );
    console.log("👉 Dùng lệnh 'npm run db:reset' nếu bạn muốn xóa toàn bộ và nạp lại từ đầu.");
    return false;
  }

  console.log("🌱 [db:seed] Bắt đầu gieo dữ liệu hạt giống ViệcSV...");

  await withTransaction(async (client) => {
    // 1. Chèn danh sách tài khoản người dùng
    const preparedUsers = buildPreparedUsers();
    const insertedUsers = await insertUsersBatch(client, preparedUsers);

    const userEmailToIdMap: Record<string, string> = {};
    for (const u of insertedUsers) {
      userEmailToIdMap[u.email] = u.id;
    }

    // 2. Chèn danh sách công ty tuyển dụng
    const companiesToInsert = SEED_COMPANIES.map((c) => {
      const ownerUserId = userEmailToIdMap[c.ownerEmail];
      if (!ownerUserId) {
        throw new Error(`Không tìm thấy tài khoản chủ sở hữu cho công ty: ${c.name} (${c.ownerEmail})`);
      }
      return {
        ...c,
        ownerUserId,
      };
    });

    const insertedCompanies = await insertCompaniesBatch(client, companiesToInsert);
    const companyKeyToIdMap: Record<string, string> = {};
    const companyKeyToNameMap: Record<string, string> = {};

    for (const c of insertedCompanies) {
      companyKeyToIdMap[c.key] = c.id;
      companyKeyToNameMap[c.key] = c.name;
    }

    // 3. Chèn 70 việc làm
    const preparedJobs = buildPreparedJobs(companyKeyToIdMap, companyKeyToNameMap);
    const insertedJobs = await insertJobsBatch(client, preparedJobs);

    // 4. Lọc việc làm của nhà tuyển dụng demo chính (3 công ty demo)
    const demoEmployerCompanyKeys = ["gom-tra-moc", "bach-hoa-24h", "sang-tao-tinh-van"];
    const demoEmployerCompanyIds = demoEmployerCompanyKeys.map((k) => companyKeyToIdMap[k]);

    const demoEmployerJobIds = insertedJobs
      .filter((j) => demoEmployerCompanyIds.includes(j.companyId))
      .map((j) => j.id);

    // 5. Chuẩn bị thông tin sinh viên demo và 12 sinh viên khác
    const demoStudentId = userEmailToIdMap["sinhvien@demo.vn"];
    const demoStudentRaw = RAW_SEED_USERS.find((u) => u.email === "sinhvien@demo.vn")!;

    const demoStudent = {
      id: demoStudentId,
      fullName: demoStudentRaw.fullName,
      phone: demoStudentRaw.phone,
      university: demoStudentRaw.university || "ĐH Bách Khoa (ĐHQG-HCM)",
    };

    const otherStudents = RAW_SEED_USERS.filter(
      (u) => u.role === "student" && u.email !== "sinhvien@demo.vn"
    ).map((u) => ({
      id: userEmailToIdMap[u.email],
      fullName: u.fullName,
      phone: u.phone,
      university: u.university || "Đại học tại TP.HCM",
    }));

    // 6. Chèn việc đã lưu (5 việc cho sinh viên demo)
    const allJobIds = insertedJobs.map((j) => j.id);
    const savedJobs = buildSavedJobsForDemoStudent(demoStudentId, allJobIds);
    const savedJobsCount = await insertSavedJobsBatch(client, savedJobs);

    // 7. Chèn hồ sơ ứng tuyển (4 từ sinh viên demo + 24 từ các bạn sinh viên khác)
    const applications = buildDemoApplications(demoStudent, demoEmployerJobIds, otherStudents);
    const applicationsCount = await insertApplicationsBatch(client, applications);

    console.log(
      `✅ [db:seed] Đã seed thành công: ${insertedJobs.length} việc làm, ${insertedCompanies.length} công ty, ${insertedUsers.length} tài khoản, ${savedJobsCount} việc đã lưu, ${applicationsCount} hồ sơ ứng tuyển.`
    );
  });

  return true;
}
