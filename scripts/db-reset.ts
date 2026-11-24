import dotenv from "dotenv";
dotenv.config();

import { query, getDatabaseUrl } from "../server/db/client.js";
import { DROP_TABLES_SQL, CREATE_TABLES_SQL } from "../server/db/schema.js";
import { runSeed } from "../server/seed/seed-runner.js";
import { getTableStatusCounts } from "../server/db/queries.js";

async function main() {
  try {
    getDatabaseUrl();
    console.log("⚠️  [db:reset] Đang xóa toàn bộ bảng dữ liệu cũ trên Neon PostgreSQL...");
    await query(DROP_TABLES_SQL);

    console.log("🔨 [db:reset] Đang tạo mới cấu trúc bảng dữ liệu và chỉ mục...");
    await query(CREATE_TABLES_SQL);

    console.log("🌱 [db:reset] Đang nạp dữ liệu hạt giống...");
    await runSeed(true);

    const counts = await getTableStatusCounts();
    console.log("\n📊 [db:reset] Kết quả kiểm tra bảng sau khi đặt lại:");
    console.log(`- Tài khoản người dùng (users):     ${counts.users}`);
    console.log(`- Công ty tuyển dụng (companies):   ${counts.companies}`);
    console.log(`- Bài đăng việc làm (jobs):         ${counts.jobs}`);
    console.log(`- Việc làm đã lưu (saved_jobs):     ${counts.saved_jobs}`);
    console.log(`- Hồ sơ ứng tuyển (applications):   ${counts.applications}\n`);

    console.log("✅ [db:reset] Đã hoàn tất đặt lại và tái khởi tạo cơ sở dữ liệu!");
    process.exit(0);
  } catch (err) {
    console.error("❌ [db:reset] Lỗi đặt lại cơ sở dữ liệu:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
